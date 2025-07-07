import {
  ChevronDown,
  ChevronUp,
  FilePenLine,
  Search,
  Signature,
  X,
} from "lucide-react";
import * as React from "react";
import { IUser } from "../../hooks/useUsers";
import styles from "./UserSelector.module.scss";

interface UserSelectorProps {
  users: IUser[];
  selectedUserIds: string[];
  onChange: (userIds: string[]) => void;
  isSign?: boolean;
  signType: "signature" | "initials" | null;
  setSignType: React.Dispatch<
    React.SetStateAction<"signature" | "initials" | null>
  >;
  selectedUserId: string | null;
  setSelectedUserId: React.Dispatch<React.SetStateAction<string | null>>;
  onSign?: () => void;
  isUserSigned?: boolean;
}

const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  selectedUserIds,
  onChange,
  isSign = false,
  signType,
  setSignType,
  selectedUserId,
  setSelectedUserId,
  onSign,
  isUserSigned,
}) => {
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleCheckboxChange = (userId: string): void => {
    if (selectedUserIds.includes(userId)) {
      const updated = selectedUserIds.filter((id) => id !== userId);
      onChange(updated);
      if (selectedUserId === userId) {
        setSelectedUserId(null);
      }
    } else {
      onChange([...selectedUserIds, userId]);
    }
  };

  const handleRemoveUser = (userId: string): void => {
    const updated = selectedUserIds.filter((id) => id !== userId);
    onChange(updated);
    if (selectedUserId === userId) {
      setSelectedUserId(null);
    }
  };

  const handleUserClick = (userId: string): void => {
    setSelectedUserId(selectedUserId === userId ? null : userId);
  };

  const selectedUsers = users.filter((u) => selectedUserIds.includes(u.id));

  const filteredUsers = users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.mail || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <h2>{isSign ? "Tanda Tangani" : "Undang Penandatangan"}</h2>

      {!isSign && (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <button
            type="button"
            className={styles.dropdownToggle}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedUsers.length > 0
              ? `${selectedUsers.length} Pengguna dipilih`
              : "Pilih pengguna"}
            {isDropdownOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {users.length === 0 ? (
                <p>Memuat data pengguna...</p>
              ) : (
                <>
                  <div className={styles.searchBox}>
                    <Search size={14} />
                    <input
                      type="text"
                      placeholder="Cari pengguna..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>

                  <div className={styles.checkboxList}>
                    {filteredUsers.length === 0 ? (
                      <p className={styles.emptyText}>
                        Pengguna tidak ditemukan
                      </p>
                    ) : (
                      filteredUsers.map((user) => (
                        <label key={user.id} className={styles.checkboxItem}>
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(user.id)}
                            onChange={() => handleCheckboxChange(user.id)}
                          />
                          <strong>{user.displayName}</strong> (
                          {user.mail || "no email"})
                        </label>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {!isSign && selectedUsers.length > 0 && (
        <ul className={styles.selectedUserList}>
          {selectedUsers.map((user) => (
            <li key={user.id} className={styles.selectedUserItem}>
              <div>
                <strong>{user.displayName}</strong>
                <p>{user.mail || "no email"}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveUser(user.id)}
                className={styles.removeButton}
                title="Hapus"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {isSign && selectedUsers.length > 0 && (
        <ul className={styles.selectedUserList}>
          {selectedUsers.map((user) => (
            <li
              key={user.id}
              className={`${styles.selectedUserItem} ${
                selectedUserId === user.id ? styles.selectedUserItemSign : ""
              }`}
              onClick={() => handleUserClick(user.id)}
              style={{ cursor: "pointer" }}
            >
              <div>
                <strong>{user.displayName}</strong>
                <p>{user.mail || "no email"}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isSign && selectedUsers.length > 0 && (
        <div className={styles.actionGroup}>
          <button
            disabled={!selectedUserId}
            className={`${styles.actionButton} ${
              signType === "signature" ? styles.activeAction : ""
            } ${isUserSigned ? styles.disabledAction : ""}`}
            onClick={() => {
              if (selectedUserId) {
                setSignType("signature");
                onSign?.();
              }
            }}
          >
            <Signature size={18} />
            Tanda Tangani
          </button>

          <button
            className={`${styles.actionButton} ${
              signType === "initials" ? styles.activeAction : ""
            }`}
            onClick={() => setSignType("initials")}
          >
            <FilePenLine size={18} />
            Paraf
          </button>
        </div>
      )}
    </div>
  );
};

export default UserSelector;
