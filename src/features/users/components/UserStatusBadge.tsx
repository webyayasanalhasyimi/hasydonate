import React from "react";

interface UserStatusBadgeProps {
  readonly isActive: boolean;
}

export function UserStatusBadge({ isActive }: UserStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
        isActive
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          : "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-400"
      }`}
    >
      {isActive ? "Aktif" : "Nonaktif"}
    </span>
  );
}
