import { type Donation, DonationType, PaymentMethod, Prisma } from "@prisma/client";

export const DonationFactory = {
  create(overrides: Partial<Donation> = {}): Donation {
    return {
      id: crypto.randomUUID(),
      donorId: crypto.randomUUID(),
      donationNumber: `AH-DON-20260723-${Math.floor(1000 + Math.random() * 9000)}`,
      donationType: DonationType.SHADAQAH,
      paymentMethod: PaymentMethod.CASH,
      amount: new Prisma.Decimal(150000),
      notes: "Donasi rutin untuk anak yatim",
      donationDate: new Date(),
      transferProofPath: null,
      transferProofFilename: null,
      transferUploadedAt: null,
      receivedBy: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  },
};
