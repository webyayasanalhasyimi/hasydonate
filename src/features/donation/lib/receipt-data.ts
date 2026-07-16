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

/**
 * Utility to spell out numbers in Indonesian text.
 */
export function spellNumberIndonesian(num: number): string {
  const units = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
  
  if (num === 0) return "Nol";
  
  let result = "";
  if (num < 12) {
    result = units[num] || "";
  } else if (num < 20) {
    result = spellNumberIndonesian(num - 10) + " Belas";
  } else if (num < 100) {
    result = spellNumberIndonesian(Math.floor(num / 10)) + " Puluh " + spellNumberIndonesian(num % 10);
  } else if (num < 200) {
    result = "Seratus " + spellNumberIndonesian(num - 100);
  } else if (num < 1000) {
    result = spellNumberIndonesian(Math.floor(num / 100)) + " Ratus " + spellNumberIndonesian(num % 100);
  } else if (num < 2000) {
    result = "Seribu " + spellNumberIndonesian(num - 1000);
  } else if (num < 1000000) {
    result = spellNumberIndonesian(Math.floor(num / 1000)) + " Ribu " + spellNumberIndonesian(num % 1000);
  } else if (num < 1000000000) {
    result = spellNumberIndonesian(Math.floor(num / 1000000)) + " Juta " + spellNumberIndonesian(num % 1000000);
  } else {
    result = String(num);
  }
  
  return result.trim().replace(/\s+/g, " ") + " Rupiah";
}

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
