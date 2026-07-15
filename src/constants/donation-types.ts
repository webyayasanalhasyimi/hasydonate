export const DONATION_TYPES = {
  ZAKAT: "ZAKAT",
  SHADAQAH: "SHADAQAH",
  SUMBANGAN_LAIN: "SUMBANGAN_LAIN",
} as const;

export type DonationTypeValue = typeof DONATION_TYPES[keyof typeof DONATION_TYPES];
