import React, { useMemo, useState } from "react";
import UserRow from "./UserRow";
import { UserResponse } from "../../models/models";
import Checkbox from "../common/Checkbox";

interface UserTableProps {
  users: UserResponse[];
  selectedIds: number[];
  onSelectIds: (ids: number[]) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedIds,
  onSelectIds,
}) => {
  const [sortDesc, setSortDesc] = useState(true);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aTime = a.last_login ? new Date(a.last_login).getTime() : 0;
      const bTime = b.last_login ? new Date(b.last_login).getTime() : 0;
      return sortDesc ? bTime - aTime : aTime - bTime;
    });
  }, [users, sortDesc]);

  const allSelected = selectedIds.length === users.length && users.length > 0;

  const toggleAll = () => {
    onSelectIds(allSelected ? [] : users.map((u) => u.id));
  };

  const toggleOne = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectIds(selectedIds.filter((sid) => sid !== id));
    } else {
      onSelectIds([...selectedIds, id]);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">
              <Checkbox
                checked={allSelected}
                onChange={toggleAll}
                aria-label="Select all users"
                className="mx-auto"
              />
            </th>
            <th className="p-3 text-left text-sm font-semibold text-gray-700">
              Name
            </th>
            <th className="p-3 text-left text-sm font-semibold text-gray-700">
              Email
            </th>
            <th
              className="p-3 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none flex items-center"
              onClick={() => setSortDesc(!sortDesc)}
              title="Sort by last login"
            >
              Last Login
              <span className="ml-1 text-gray-400">{sortDesc ? "↓" : "↑"}</span>
            </th>
            <th className="p-3 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {sortedUsers.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              checked={selectedIds.includes(user.id)}
              onCheck={toggleOne}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
