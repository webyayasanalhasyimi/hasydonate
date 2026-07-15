import { prisma } from "@/lib/prisma/client";
import { type Donor } from "@prisma/client";

export const DonorService = {
  getById(id: string): Promise<Donor | null> {
    return prisma.donor.findUnique({ where: { id } });
  },

  getByPhoneNumber(phoneNumber: string): Promise<Donor | null> {
    return prisma.donor.findUnique({ where: { phoneNumber } });
  },

  create(data: Omit<Donor, "id" | "createdAt" | "updatedAt" | "deletedAt">): Promise<Donor> {
    return prisma.donor.create({ data });
  },

  update(id: string, data: Partial<Omit<Donor, "id" | "createdAt" | "updatedAt" | "deletedAt">>): Promise<Donor> {
    return prisma.donor.update({
      where: { id },
      data,
    });
  },

  softDelete(id: string): Promise<Donor> {
    return prisma.donor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
export type DonorServiceType = typeof DonorService;
