import { type RoleValue } from "@/lib/auth/roles";

export interface UserListItemDto {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly role: RoleValue;
  readonly isActive: boolean;
  readonly createdAt: Date;
}

export interface UserAuditLogDto {
  readonly id: string;
  readonly actorId: string;
  readonly actorName: string;
  readonly action: string;
  readonly oldValue: Record<string, unknown> | null;
  readonly newValue: Record<string, unknown> | null;
  readonly createdAt: Date;
}

export interface UserDetailDto {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly role: RoleValue;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly auditLogs: readonly UserAuditLogDto[];
}

export interface UserCreateDto {
  readonly fullName: string;
  readonly email: string;
  readonly role: RoleValue;
  readonly isActive: boolean;
  readonly password?: string | undefined;
}

export interface UserUpdateDto {
  readonly fullName: string;
  readonly email: string;
  readonly role: RoleValue;
  readonly isActive: boolean;
  readonly password?: string | undefined;
}

export interface UserResultDto {
  readonly items: readonly UserListItemDto[];
  readonly nextCursor?: string | undefined;
}
