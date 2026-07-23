import React from "react";
import { type RoleValue, ROLES } from "@/lib/auth/roles";

interface RoleBadgeProps {
  readonly role: RoleValue;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const isSysAdmin = role === ROLES.ADMIN;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
        isSysAdmin
          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      }`}
    >
      {isSysAdmin ? "Administrator" : "Front Admin"}
    </span>
  );
}
