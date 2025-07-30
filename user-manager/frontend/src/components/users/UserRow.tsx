import React from "react";
import { UserResponse, UserStatus } from "../../models/models";
import Checkbox from "../common/Checkbox";

interface UserRowProps {
  user: UserResponse;
  checked: boolean;
  onCheck: (id: number) => void;
}

const formatLastSeen = (lastLogin: string | null): string => {
  if (!lastLogin) return "–";

  const lastDate = new Date(lastLogin);
  const now = new Date();
  const diffMs = now.getTime() - lastDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "less than a minute ago";
  if (diffMinutes < 5) return "less than 5 minutes ago";
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
};

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
        {formatLastSeen(user.last_login)}
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
