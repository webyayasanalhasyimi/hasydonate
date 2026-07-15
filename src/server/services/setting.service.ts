import { prisma } from "@/lib/prisma/client";
import { type Setting } from "@prisma/client";

export const SettingService = {
  getByKey(key: string): Promise<Setting | null> {
    return prisma.setting.findUnique({ where: { key } });
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
};
export type SettingServiceType = typeof SettingService;
