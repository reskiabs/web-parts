import { useEffect, useMemo, useRef, useState } from "react";
import { IUser } from "./useUsers";

interface UseUserSelectorResult {
  dropdownRef: React.RefObject<HTMLDivElement>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedUsers: IUser[];
  filteredUsers: IUser[];
  toggleUserSelection: (userId: string) => void;
  handleRemoveUser: (userId: string) => void;
}

export const useUserSelector = (
  users: IUser[],
  selectedUserIds: string[],
  onChange: (userIds: string[]) => void,
  selectedUserId: string | undefined,
  setSelectedUserId: React.Dispatch<React.SetStateAction<string | undefined>>
): UseUserSelectorResult => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedUsers = useMemo(
    () => users.filter((u) => selectedUserIds.includes(u.id)),
    [users, selectedUserIds]
  );

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.mail || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  const toggleUserSelection = (userId: string): void => {
    const updated = selectedUserIds.includes(userId)
      ? selectedUserIds.filter((id) => id !== userId)
      : [...selectedUserIds, userId];
    onChange(updated);
    if (selectedUserId === userId) {
      setSelectedUserId(undefined);
    }
  };

  const handleRemoveUser = (userId: string): void => {
    onChange(selectedUserIds.filter((id) => id !== userId));
    if (selectedUserId === userId) {
      setSelectedUserId(undefined);
    }
  };

  const handleClickOutside = (event: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return {
    dropdownRef,
    isDropdownOpen,
    setIsDropdownOpen,
    searchTerm,
    setSearchTerm,
    selectedUsers,
    filteredUsers,
    toggleUserSelection,
    handleRemoveUser,
  };
};
