import { type RoleValue, ROLES } from "./roles";

export function canManageUsers(role: RoleValue): boolean {
  return role === ROLES.ADMIN;
}

export function canManageSettings(role: RoleValue): boolean {
  return role === ROLES.ADMIN;
}

export function canManageReports(role: RoleValue): boolean {
  return role === ROLES.ADMIN || role === ROLES.FRONT_ADMIN;
}
