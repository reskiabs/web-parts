import React from "react";
import { IUser } from "../../hooks/useUsers";
import { useUserSelector } from "../../hooks/useUserSelector";
import ActionButtons from "./ActionButtons";
import SelectedUsersList from "./SelectedUsersList";
import UserSelectorDropdown from "./UserSelectorDropdown";

interface UserSelectorProps {
  users: IUser[];
  selectedUserIds: string[];
  onChange: (userIds: string[]) => void;
  isSign?: boolean;
  signType: "signature" | "initials" | undefined;
  setSignType: React.Dispatch<
    React.SetStateAction<"signature" | "initials" | undefined>
  >;
  selectedUserId: string | undefined;
  setSelectedUserId: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSign?: () => void;
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
}) => {
  const {
    dropdownRef,
    isDropdownOpen,
    setIsDropdownOpen,
    searchTerm,
    setSearchTerm,
    selectedUsers,
    filteredUsers,
    toggleUserSelection,
    handleRemoveUser,
  } = useUserSelector(
    users,
    selectedUserIds,
    onChange,
    selectedUserId,
    setSelectedUserId
  );

  const handleSignAction = (type: "signature" | "initials"): void => {
    if (!selectedUserId) return;
    setSignType(type);
    onSign?.();
  };

  return (
    <div>
      <h2>{isSign ? "Tanda Tangani" : "Undang Penandatangan"}</h2>
      {!isSign && (
        <UserSelectorDropdown
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          dropdownRef={dropdownRef}
          users={users}
          filteredUsers={filteredUsers}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedUserIds={selectedUserIds}
          toggleUserSelection={toggleUserSelection}
          selectedUsersCount={selectedUsers.length}
        />
      )}
      {selectedUsers.length > 0 && (
        <SelectedUsersList
          selectedUsers={selectedUsers}
          isSign={isSign}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          handleRemoveUser={handleRemoveUser}
        />
      )}
      {isSign && selectedUsers.length > 0 && (
        <ActionButtons
          signType={signType}
          selectedUserId={selectedUserId}
          handleSignAction={handleSignAction}
        />
      )}
    </div>
  );
};

export default UserSelector;
