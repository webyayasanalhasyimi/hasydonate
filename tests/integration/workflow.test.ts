import { prismaMock } from "../helpers/db-mock";
import { supabaseAdminMock } from "../mocks/supabase";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserService } from "@/server/services/user.service";
import { SettingService } from "@/server/services/setting.service";
import { Role, DonationType, PaymentMethod, Prisma } from "@prisma/client";

describe("Workflow Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("coordinates complete user creation, deactivation, and setting update lifecycle", async () => {
    // 1. Create User Sync
    const mockUser = { id: "user-999", email: "new_admin@alhasyimi.org" };
    supabaseAdminMock.auth.admin.createUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    prismaMock.profile.create.mockResolvedValue({
      id: "user-999",
      fullName: "New Admin",
      email: "new_admin@alhasyimi.org",
      role: Role.ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await UserService.create(
      {
        fullName: "New Admin",
        email: "new_admin@alhasyimi.org",
        role: Role.ADMIN,
        isActive: true,
        password: "TempPassword123",
      },
      "actor-123"
    );

    expect(user.id).toBe("user-999");
    expect(user.role).toBe(Role.ADMIN);
    expect(supabaseAdminMock.auth.admin.createUser).toHaveBeenCalled();
    expect(prismaMock.profile.create).toHaveBeenCalled();

    // 2. Mocking user update/deactivation checks
    prismaMock.profile.findUnique.mockResolvedValue({
      id: "user-999",
      fullName: "New Admin",
      email: "new_admin@alhasyimi.org",
      role: Role.ADMIN,
      isActive: true,
    });

    prismaMock.profile.count.mockResolvedValue(2); // More than 1 admin active
    prismaMock.auditLog.findMany.mockResolvedValue([]);

    supabaseAdminMock.auth.admin.updateUserById.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const inactiveProfile = {
      id: "user-999",
      fullName: "New Admin",
      email: "new_admin@alhasyimi.org",
      role: Role.ADMIN,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.profile.update.mockResolvedValue(inactiveProfile);
    // Return inactive profile on subsequent findUnique lookup
    prismaMock.profile.findUnique.mockResolvedValue(inactiveProfile);

    const deactivatedUser = await UserService.deactivate("user-999", "actor-123");
    expect(deactivatedUser.isActive).toBe(false);

    // 3. Setting Updates
    prismaMock.setting.upsert.mockResolvedValue({
      key: "foundation.name",
      value: "Yayasan Al-Hasyimi Baru",
      updatedAt: new Date(),
    });

    const updatedSetting = await SettingService.set("foundation.name", "Yayasan Al-Hasyimi Baru");
    expect(updatedSetting.value).toBe("Yayasan Al-Hasyimi Baru");
    expect(prismaMock.setting.upsert).toHaveBeenCalled();
  });
});
