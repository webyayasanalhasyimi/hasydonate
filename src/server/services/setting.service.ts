import { prisma } from "@/lib/prisma/client";
import { type Setting } from "@prisma/client";

const SETTINGS_RECORD_ID = "00000000-0000-0000-0000-000000000000";

export const SettingService = {
  getByKey(key: string): Promise<Setting | null> {
    return prisma.setting.findUnique({ where: { key } });
  },

  getMany(keys: readonly string[]): Promise<readonly Setting[]> {
    return prisma.setting.findMany({
      where: { key: { in: [...keys] } },
    });
  },

  async getAll(): Promise<readonly Setting[]> {
    return prisma.setting.findMany();
  },

  set(key: string, value: string): Promise<Setting> {
    return prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  },

  async updateMany(
    updates: Record<string, string>,
    userId: string
  ): Promise<readonly Setting[]> {
    return prisma.$transaction(async (tx) => {
      const keys = Object.keys(updates);
      const existing = await tx.setting.findMany({
        where: { key: { in: keys } },
      });

      const oldValues: Record<string, string> = {};
      const newValues: Record<string, string> = {};
      const changedUpdates: Record<string, string> = {};

      for (const key of keys) {
        const newValue = updates[key] ?? "";
        const found = existing.find((s) => s.key === key);
        const oldValue = found ? found.value : "";

        if (oldValue !== newValue) {
          oldValues[key] = oldValue;
          newValues[key] = newValue;
          changedUpdates[key] = newValue;
        }
      }

      const changedKeys = Object.keys(changedUpdates);
      if (changedKeys.length === 0) {
        return existing;
      }

      // Perform upserts for changed settings
      const promises = changedKeys.map((key) =>
        tx.setting.upsert({
          where: { key },
          create: { key, value: changedUpdates[key] ?? "" },
          update: { value: changedUpdates[key] ?? "" },
        })
      );
      await Promise.all(promises);

      // Write transaction audit log
      await tx.auditLog.create({
        data: {
          userId,
          action: "UPDATE_SETTINGS",
          tableName: "settings",
          recordId: SETTINGS_RECORD_ID,
          oldValue: oldValues,
          newValue: newValues,
        },
      });

      return tx.setting.findMany({
        where: { key: { in: keys } },
      });
    });
  },
};

export type SettingServiceType = typeof SettingService;

