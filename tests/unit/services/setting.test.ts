import { prismaMock } from "../../helpers/db-mock";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SettingService } from "@/server/services/setting.service";

describe("SettingService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retrieves all settings as an array", async () => {
    prismaMock.setting.findMany.mockResolvedValue([
      { key: "foundation.name", value: "Yayasan Panti Asuhan Al-Hasyimi", updatedAt: new Date() },
      { key: "bank.name", value: "Bank Syariah Indonesia", updatedAt: new Date() },
    ]);

    const settings = await SettingService.getAll();
    expect(settings).toHaveLength(2);
    expect(settings[0]?.key).toBe("foundation.name");
    expect(settings[0]?.value).toBe("Yayasan Panti Asuhan Al-Hasyimi");
  });

  it("retrieves a single setting value by key", async () => {
    prismaMock.setting.findUnique.mockResolvedValue({
      key: "foundation.name",
      value: "Yayasan Panti Asuhan Al-Hasyimi",
      updatedAt: new Date(),
    });

    const value = await SettingService.getByKey("foundation.name");
    expect(value?.value).toBe("Yayasan Panti Asuhan Al-Hasyimi");
  });

  it("returns null or default when setting is not found", async () => {
    prismaMock.setting.findUnique.mockResolvedValue(null);
    const value = await SettingService.getByKey("nonexistent.key");
    expect(value).toBeNull();
  });
});
