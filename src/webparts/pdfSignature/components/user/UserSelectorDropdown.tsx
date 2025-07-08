import { ChevronDown, ChevronUp, Search } from "lucide-react";
import React from "react";
import { IUser } from "../../hooks/useUsers";
import styles from "./UserSelector.module.scss";

interface UserSelectorDropdownProps {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
  users: IUser[];
  filteredUsers: IUser[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedUserIds: string[];
  toggleUserSelection: (userId: string) => void;
  selectedUsersCount: number;
}

const UserSelectorDropdown: React.FC<UserSelectorDropdownProps> = ({
  isDropdownOpen,
  setIsDropdownOpen,
  dropdownRef,
  users,
  filteredUsers,
  searchTerm,
  setSearchTerm,
  selectedUserIds,
  toggleUserSelection,
  selectedUsersCount,
}) => (
  <div className={styles.dropdownContainer} ref={dropdownRef}>
    <button
      type="button"
      className={styles.dropdownToggle}
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      {selectedUsersCount > 0
        ? `${selectedUsersCount} Pengguna dipilih`
        : "Pilih pengguna"}
      {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
                <p className={styles.emptyText}>Pengguna tidak ditemukan</p>
              ) : (
                filteredUsers.map((user) => (
                  <label key={user.id} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
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
);

export default UserSelectorDropdown;
