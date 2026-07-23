import { type Setting } from "@prisma/client";

export const SettingFactory = {
  create(overrides: Partial<Setting> = {}): Setting {
    return {
      key: "foundation.name",
      value: "Yayasan Panti Asuhan Al-Hasyimi",
      updatedAt: new Date(),
      ...overrides,
    };
  },
};
