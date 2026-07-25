import { type DonationDetailDto } from "../types";

export interface ReceiptData {
  readonly receiptNumber: string;
  readonly donationNumber: string;
  readonly donationDate: Date;
  readonly donorName: string;
  readonly donorAddress: string;
  readonly donorPhone: string;
  readonly donationType: string;
  readonly amount: number;
  readonly amountSpelled: string;
  readonly receivedBy: string;
  readonly printedAt: Date;
  readonly thankYouMessage: string;
}

import { spellNumberIndonesian } from "@/lib/utils/currency";

/**
 * Generates reusable receipt data structure from a Donation Detail DTO.
 */
export function generateReceiptData(donation: DonationDetailDto): ReceiptData {
  // Kwitansi receipt number derived from donation number prefix
  const receiptNumber = donation.donationNumber.replace("AH-DON-", "KW-");

  return {
    receiptNumber,
    donationNumber: donation.donationNumber,
    donationDate: donation.donationDate,
    donorName: donation.donorName,
    donorAddress: donation.donorAddress,
    donorPhone: donation.donorPhone,
    donationType: donation.donationType,
    amount: donation.amount,
    amountSpelled: spellNumberIndonesian(donation.amount),
    receivedBy: donation.receivedByName,
    printedAt: new Date(),
    thankYouMessage:
      "Atas nama pengurus dan seluruh anak asuh Yayasan Panti Asuhan Al-Hasyimi mengucapkan terima kasih atas kepercayaan dan donasi yang telah diberikan.",
  };
}
