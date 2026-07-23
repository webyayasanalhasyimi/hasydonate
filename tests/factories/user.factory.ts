import { type UserDetailDto, type UserListItemDto } from "@/features/users/types";
import { Role } from "@prisma/client";

export const UserFactory = {
  createListItem(overrides: Partial<UserListItemDto> = {}): UserListItemDto {
    return {
      id: crypto.randomUUID(),
      fullName: "Staff Al-Hasyimi",
      email: `staff_${Math.random().toString(36).substring(7)}@alhasyimi.org`,
      role: Role.FRONT_ADMIN,
      isActive: true,
      createdAt: new Date(),
      ...overrides,
    };
  },

  createDetail(overrides: Partial<UserDetailDto> = {}): UserDetailDto {
    return {
      id: crypto.randomUUID(),
      fullName: "Admin Al-Hasyimi",
      email: `admin_${Math.random().toString(36).substring(7)}@alhasyimi.org`,
      role: Role.ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      auditLogs: [],
      ...overrides,
    };
  },
};
