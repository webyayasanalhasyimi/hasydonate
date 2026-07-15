import { type RoleValue, ROLES } from "@/constants/roles";

export const hasRole = (userRole: RoleValue, requiredRoles: readonly RoleValue[]): boolean => {
  return requiredRoles.includes(userRole);
};

export const isAdmin = (role: RoleValue): boolean => {
  return role === ROLES.ADMIN;
};

export const isFrontAdmin = (role: RoleValue): boolean => {
  return role === ROLES.FRONT_ADMIN;
};

export const PERMISSIONS = {
  MANAGE_USERS: [ROLES.ADMIN],
  VIEW_REPORTS: [ROLES.ADMIN],
  MANAGE_SETTINGS: [ROLES.ADMIN],
  MANAGE_DONATIONS: [ROLES.ADMIN, ROLES.FRONT_ADMIN],
  MANAGE_DONORS: [ROLES.ADMIN, ROLES.FRONT_ADMIN],
  RECORD_DONATION: [ROLES.ADMIN, ROLES.FRONT_ADMIN],
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

export const hasPermission = (role: RoleValue, permission: PermissionKey): boolean => {
  const allowedRoles: readonly RoleValue[] = PERMISSIONS[permission];
  return hasRole(role, allowedRoles);
};
