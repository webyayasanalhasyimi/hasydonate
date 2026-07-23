import { type Donor } from "@prisma/client";

export const DonorFactory = {
  create(overrides: Partial<Donor> = {}): Donor {
    return {
      id: crypto.randomUUID(),
      fullName: "Budi Santoso",
      address: "Jl. Merdeka No. 12, Jakarta",
      phoneNumber: `0812${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      ...overrides,
    };
  },
};
