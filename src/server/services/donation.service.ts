import { prisma } from "@/lib/prisma/client";
import { type Donation } from "@prisma/client";

export const DonationService = {
  getById(id: string): Promise<Donation | null> {
    return prisma.donation.findUnique({ where: { id } });
  },

  getByDonationNumber(donationNumber: string): Promise<Donation | null> {
    return prisma.donation.findUnique({ where: { donationNumber } });
  },

  create(data: Omit<Donation, "id" | "createdAt" | "updatedAt">): Promise<Donation> {
    return prisma.donation.create({ data });
  },
};
export type DonationServiceType = typeof DonationService;
