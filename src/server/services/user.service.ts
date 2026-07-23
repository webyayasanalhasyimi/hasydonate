import { prisma } from "@/lib/prisma/client";
import { Prisma, Role } from "@prisma/client";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { type RoleValue } from "@/lib/auth/roles";
import {
  type UserDetailDto,
  type UserCreateDto,
  type UserUpdateDto,
  type UserResultDto,
  type UserAuditLogDto,
} from "@/features/users/types";

export const UserService = {
  async create(data: UserCreateDto, actorId: string): Promise<UserDetailDto> {
    const adminClient = createAdminSupabase();

    // 1. Create User in Supabase Auth
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: data.email,
      password: data.password || "Password123",
      email_confirm: true,
    });

    if (authError || !authData.user) {
      throw new Error(`Gagal membuat user di auth: ${authError?.message}`);
    }

    const authUser = authData.user;

    // 2. Create local Profile record
    try {
      const profile = await prisma.profile.create({
        data: {
          id: authUser.id,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
          isActive: data.isActive,
        },
      });

      // 3. Write Audit Log
      await prisma.auditLog.create({
        data: {
          userId: actorId,
          action: "CREATE_USER",
          tableName: "profiles",
          recordId: profile.id,
          oldValue: Prisma.DbNull,
          newValue: profile as unknown as Prisma.InputJsonValue,
        },
      });

      return {
        id: profile.id,
        fullName: profile.fullName,
        email: profile.email,
        role: profile.role as RoleValue,
        isActive: profile.isActive,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        auditLogs: [],
      };
    } catch (dbErr) {
      // Compensating action: Delete Auth user if local profile write fails
      await adminClient.auth.admin.deleteUser(authUser.id);
      throw dbErr;
    }
  },

  async update(id: string, data: UserUpdateDto, actorId: string): Promise<UserDetailDto> {
    const adminClient = createAdminSupabase();

    // Retrieve current profile
    const currentProfile = await prisma.profile.findUnique({ where: { id } });
    if (!currentProfile) {
      throw new Error("Pengguna tidak ditemukan.");
    }

    // Lifecycle Guards
    if (currentProfile.isActive && !data.isActive) {
      // Cannot deactivate yourself
      if (id === actorId) {
        throw new Error("Anda tidak dapat menonaktifkan akun Anda sendiri.");
      }

      // Cannot deactivate the last active ADMIN
      if (currentProfile.role === Role.ADMIN) {
        const activeAdminsCount = await prisma.profile.count({
          where: { role: Role.ADMIN, isActive: true },
        });
        if (activeAdminsCount <= 1) {
          throw new Error("Tidak dapat menonaktifkan Administrator aktif terakhir di sistem.");
        }
      }
    }

    // Cannot downgrade the last active ADMIN
    if (currentProfile.role === Role.ADMIN && data.role !== Role.ADMIN) {
      const activeAdminsCount = await prisma.profile.count({
        where: { role: Role.ADMIN, isActive: true },
      });
      if (activeAdminsCount <= 1) {
        throw new Error("Tidak dapat mengubah peran Administrator aktif terakhir menjadi Front Admin.");
      }
    }

    // Update Supabase Auth if email or password changed
    const authUpdates: Record<string, string> = {};
    if (currentProfile.email !== data.email) {
      authUpdates.email = data.email;
    }
    if (data.password && data.password !== "") {
      authUpdates.password = data.password;
    }

    if (Object.keys(authUpdates).length > 0) {
      const { error: authError } = await adminClient.auth.admin.updateUserById(id, authUpdates);
      if (authError) {
        throw new Error(`Gagal memperbarui user di auth: ${authError.message}`);
      }
    }

    // Update local database profile
    const profile = await prisma.profile.update({
      where: { id },
      data: {
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        isActive: data.isActive,
      },
    });

    // Write audit log tracking only mutated fields
    const oldValues: Record<string, unknown> = {};
    const newValues: Record<string, unknown> = {};

    if (currentProfile.fullName !== data.fullName) {
      oldValues.fullName = currentProfile.fullName;
      newValues.fullName = data.fullName;
    }
    if (currentProfile.email !== data.email) {
      oldValues.email = currentProfile.email;
      newValues.email = data.email;
    }
    if (currentProfile.role !== data.role) {
      oldValues.role = currentProfile.role;
      newValues.role = data.role;
    }
    if (currentProfile.isActive !== data.isActive) {
      oldValues.isActive = currentProfile.isActive;
      newValues.isActive = data.isActive;
    }

    if (Object.keys(oldValues).length > 0) {
      await prisma.auditLog.create({
        data: {
          userId: actorId,
          action: "UPDATE_USER",
          tableName: "profiles",
          recordId: profile.id,
          oldValue: oldValues as unknown as Prisma.InputJsonValue,
          newValue: newValues as unknown as Prisma.InputJsonValue,
        },
      });
    }

    return this.findById(id) as Promise<UserDetailDto>;
  },

  async findById(id: string): Promise<UserDetailDto | null> {
    const profile = await prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) return null;

    // Fetch related audit logs
    const logs = await prisma.auditLog.findMany({
      where: { recordId: id, tableName: "profiles" },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    });

    const auditLogs: readonly UserAuditLogDto[] = logs.map((l) => ({
      id: l.id,
      actorId: l.userId,
      actorName: l.user.fullName,
      action: l.action,
      oldValue: l.oldValue ? (l.oldValue as Record<string, unknown>) : null,
      newValue: l.newValue ? (l.newValue as Record<string, unknown>) : null,
      createdAt: l.createdAt,
    }));

    return {
      id: profile.id,
      fullName: profile.fullName,
      email: profile.email,
      role: profile.role as RoleValue,
      isActive: profile.isActive,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      auditLogs,
    };
  },

  async paginate(options: {
    readonly cursor?: string | undefined;
    readonly limit: number;
    readonly query?: string | undefined;
  }): Promise<UserResultDto> {
    const limit = options.limit;
    const cursor = options.cursor;
    const query = options.query;

    const where: Prisma.ProfileWhereInput = query
      ? {
          OR: [
            { fullName: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        }
      : {};

    const profiles = await prisma.profile.findMany({
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      where,
      orderBy: { createdAt: "desc" },
    });

    let nextCursor: string | undefined = undefined;
    const items = [...profiles];
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }

    return {
      items: items.map((p) => ({
        id: p.id,
        fullName: p.fullName,
        email: p.email,
        role: p.role as RoleValue,
        isActive: p.isActive,
        createdAt: p.createdAt,
      })),
      nextCursor,
    };
  },

  async search(
    query: string,
    options: { readonly cursor?: string | undefined; readonly limit: number }
  ): Promise<UserResultDto> {
    return this.paginate({
      query,
      cursor: options.cursor,
      limit: options.limit,
    });
  },

  async activate(id: string, actorId: string): Promise<UserDetailDto> {
    const user = await this.findById(id);
    if (!user) throw new Error("Pengguna tidak ditemukan.");
    return this.update(
      id,
      {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: true,
      },
      actorId
    );
  },

  async deactivate(id: string, actorId: string): Promise<UserDetailDto> {
    const user = await this.findById(id);
    if (!user) throw new Error("Pengguna tidak ditemukan.");
    return this.update(
      id,
      {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: false,
      },
      actorId
    );
  },
};
export type UserServiceType = typeof UserService;
