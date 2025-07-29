import { useState, useEffect } from "react";
import UserTable from "./UserTable";
import { useAuth } from "../../hooks/useAuth";
import { useUsers } from "../../hooks/useUsers";
import Toolbar from "../layout/Toolbar";
import { UserStatus } from "../../models/models";

const UserManagement = () => {
  const { users, loading, error, blockUsers, unblockUsers, deleteUsers } =
    useUsers();
  const { user, logout } = useAuth();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (!user) return;

    const currentUser = users.find((u) => u.email === user.email);
    if (!currentUser) return;

    if (currentUser.status === UserStatus.BLOCKED) {
      logout();
    }
  }, [users, user, logout]);

  const handleBlock = async () => {
    await blockUsers(selectedIds);
    setSelectedIds([]);
  };

  const handleUnblock = async () => {
    await unblockUsers(selectedIds);
    setSelectedIds([]);
  };

  const handleDelete = async () => {
    await deleteUsers(selectedIds);
    setSelectedIds([]);
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <Toolbar
        selectedCount={selectedIds.length}
        onBlock={handleBlock}
        onUnblock={handleUnblock}
        onDelete={handleDelete}
      />
      <UserTable
        users={users}
        selectedIds={selectedIds}
        onSelectIds={setSelectedIds}
      />
    </div>
  );
};

export default UserManagement;
