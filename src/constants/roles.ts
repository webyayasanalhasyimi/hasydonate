export const ROLES = {
  ADMIN: "ADMIN",
  FRONT_ADMIN: "FRONT_ADMIN",
} as const;

export type RoleValue = typeof ROLES[keyof typeof ROLES];
