import { prismaMock } from "../../helpers/db-mock";
import { supabaseAdminMock } from "../../mocks/supabase";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserService } from "@/server/services/user.service";
import { Role } from "@prisma/client";

describe("UserService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("provisions a Supabase Auth user and creates local profile successfully", async () => {
      const mockUser = { id: "user-123", email: "test@example.com" };
      supabaseAdminMock.auth.admin.createUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      prismaMock.profile.create.mockResolvedValue({
        id: "user-123",
        fullName: "Test User",
        email: "test@example.com",
        role: Role.FRONT_ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const user = await UserService.create(
        {
          fullName: "Test User",
          email: "test@example.com",
          role: Role.FRONT_ADMIN,
          isActive: true,
          password: "password123",
        },
        "actor-123"
      );

      expect(user.id).toBe("user-123");
      expect(supabaseAdminMock.auth.admin.createUser).toHaveBeenCalled();
      expect(prismaMock.profile.create).toHaveBeenCalled();
    });

    it("triggers compensating deleteUser when profile creation fails", async () => {
      const mockUser = { id: "user-123", email: "test@example.com" };
      supabaseAdminMock.auth.admin.createUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      prismaMock.profile.create.mockRejectedValue(new Error("Database write error"));

      await expect(
        UserService.create(
          {
            fullName: "Test User",
            email: "test@example.com",
            role: Role.FRONT_ADMIN,
            isActive: true,
            password: "password123",
          },
          "actor-123"
        )
      ).rejects.toThrow("Database write error");

      expect(supabaseAdminMock.auth.admin.deleteUser).toHaveBeenCalledWith("user-123");
    });
  });

  describe("update guards", () => {
    it("blocks deactivating oneself", async () => {
      prismaMock.profile.findUnique.mockResolvedValue({
        id: "actor-123",
        fullName: "Admin",
        email: "admin@example.com",
        role: Role.ADMIN,
        isActive: true,
      });

      await expect(
        UserService.update(
          "actor-123",
          {
            fullName: "Admin Changed",
            email: "admin@example.com",
            role: Role.ADMIN,
            isActive: false,
          },
          "actor-123"
        )
      ).rejects.toThrow("Anda tidak dapat menonaktifkan akun Anda sendiri.");
    });

    it("blocks deactivating the last active ADMIN", async () => {
      prismaMock.profile.findUnique.mockResolvedValue({
        id: "admin-456",
        fullName: "Last Admin",
        email: "last@example.com",
        role: Role.ADMIN,
        isActive: true,
      });

      prismaMock.profile.count.mockResolvedValue(1);

      await expect(
        UserService.update(
          "admin-456",
          {
            fullName: "Last Admin",
            email: "last@example.com",
            role: Role.ADMIN,
            isActive: false,
          },
          "actor-123"
        )
      ).rejects.toThrow("Tidak dapat menonaktifkan Administrator aktif terakhir di sistem.");
    });

    it("blocks downgrading the last active ADMIN", async () => {
      prismaMock.profile.findUnique.mockResolvedValue({
        id: "admin-456",
        fullName: "Last Admin",
        email: "last@example.com",
        role: Role.ADMIN,
        isActive: true,
      });

      prismaMock.profile.count.mockResolvedValue(1);

      await expect(
        UserService.update(
          "admin-456",
          {
            fullName: "Last Admin",
            email: "last@example.com",
            role: Role.FRONT_ADMIN,
            isActive: true,
          },
          "actor-123"
        )
      ).rejects.toThrow("Tidak dapat mengubah peran Administrator aktif terakhir menjadi Front Admin.");
    });
  });
});
