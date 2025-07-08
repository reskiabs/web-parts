import { X } from "lucide-react";
import React from "react";
import { IUser } from "../../hooks/useUsers";
import styles from "./UserSelector.module.scss";

interface SelectedUsersListProps {
  selectedUsers: IUser[];
  isSign: boolean;
  selectedUserId: string | undefined;
  setSelectedUserId: (id: string) => void;
  handleRemoveUser: (id: string) => void;
}

const SelectedUsersList: React.FC<SelectedUsersListProps> = ({
  selectedUsers,
  isSign,
  selectedUserId,
  setSelectedUserId,
  handleRemoveUser,
}) => (
  <ul className={styles.selectedUserList}>
    {selectedUsers.map((user) => (
      <li
        key={user.id}
        className={`${styles.selectedUserItem} ${
          isSign && selectedUserId === user.id
            ? styles.selectedUserItemSign
            : ""
        }`}
        onClick={() => isSign && setSelectedUserId(user.id)}
        style={{ cursor: isSign ? "pointer" : "default" }}
      >
        <div>
          <strong>{user.displayName}</strong>
          <p>{user.mail || "no email"}</p>
        </div>
        {!isSign && (
          <button
            type="button"
            onClick={() => handleRemoveUser(user.id)}
            className={styles.removeButton}
            title="Hapus"
          >
            <X size={16} />
          </button>
        )}
      </li>
    ))}
  </ul>
);

export default SelectedUsersList;
