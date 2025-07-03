import * as React from "react";
import { IUser } from "../../hooks/useUsers";
import styles from "./UserSelector.module.scss";

interface UserSelectorProps {
  users: IUser[];
  selectedUserId: string;
  onChange: (userId: string) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  selectedUserId,
  onChange,
}) => {
  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <div>
      <h2>Pilih User dari Organisasi</h2>

      {users.length === 0 ? (
        <p>Memuat data pengguna...</p>
      ) : (
        <select
          onChange={(e) => onChange(e.target.value)}
          value={selectedUserId}
          className={styles.selectBox}
        >
          <option value="">-- Pilih user --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.displayName} ({user.mail || "no email"})
            </option>
          ))}
        </select>
      )}

      {selectedUser && (
        <div className={styles.userDetail}>
          <h3>Detail Pengguna:</h3>
          <p>
            <strong>Nama:</strong> {selectedUser.displayName}
          </p>
          <p>
            <strong>Email:</strong> {selectedUser.mail || "Tidak tersedia"}
          </p>
          <p>
            <strong>ID:</strong> {selectedUser.id}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserSelector;
