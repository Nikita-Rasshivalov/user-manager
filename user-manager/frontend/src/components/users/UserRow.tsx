import React from "react";
import { UserResponse, UserStatus } from "../../models/models";
import Checkbox from "../common/Checkbox";

interface UserRowProps {
  user: UserResponse;
  checked: boolean;
  onCheck: (id: number) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, checked, onCheck }) => {
  const isDeleted = user.status === UserStatus.DELETED;

  return (
    <tr className="hover:bg-gray-50">
      <td
        className={`p-2 border border-gray-300 ${
          isDeleted ? "line-through text-gray-400" : ""
        }`}
      >
        <Checkbox
          checked={checked}
          onChange={() => onCheck(user.id)}
          aria-label={`Select user ${user.name}`}
          disabled={isDeleted}
        />
      </td>
      <td
        className={`p-2 border border-gray-300 ${
          isDeleted ? "line-through text-gray-400" : ""
        }`}
      >
        {user.name}
      </td>
      <td
        className={`p-2 border border-gray-300 ${
          isDeleted ? "line-through text-gray-400" : ""
        }`}
      >
        {user.email}
      </td>
      <td
        className={`p-2 border border-gray-300 ${
          isDeleted ? "line-through text-gray-400" : ""
        }`}
      >
        {user.last_login ? new Date(user.last_login).toLocaleString() : "–"}
      </td>
      <td className="p-2 border border-gray-300">
        {user.status === UserStatus.ACTIVE
          ? "Active"
          : user.status === UserStatus.BLOCKED
          ? "Blocked"
          : "Deleted"}
      </td>
    </tr>
  );
};

export default UserRow;
