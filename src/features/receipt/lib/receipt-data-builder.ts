import { type DonationDetailDto } from "@/features/donation/types";
import { type ReceiptData } from "../types";
import { RECEIPT_SETTINGS_KEYS, RECEIPT_SETTINGS_DEFAULTS } from "../config";
import { spellNumberIndonesian } from "@/lib/utils/currency";

export const buildReceiptData = (
  donation: DonationDetailDto,
  settings: ReadonlyArray<{ readonly key: string; readonly value: string }>,
  logoUrl?: string
): ReceiptData => {
  const getSetting = (key: string): string => {
    const found = settings.find((s) => s.key === key);
    return found ? found.value : (RECEIPT_SETTINGS_DEFAULTS as Record<string, string>)[key] || "";
  };

  const receiptNumber = donation.donationNumber;

  const data: ReceiptData = {
    receiptNumber,
    donationNumber: donation.donationNumber,
    donationDate: donation.donationDate,
    donorName: donation.donorName,
    donorAddress: donation.donorAddress,
    donorPhone: donation.donorPhone,
    donationType: donation.donationType,
    paymentMethod: donation.paymentMethod,
    amount: donation.amount,
    amountSpelled: spellNumberIndonesian(donation.amount),
    receivedBy: donation.receivedByName,
    printedAt: new Date(),

    // Settings mapping
    foundationName: getSetting(RECEIPT_SETTINGS_KEYS.FOUNDATION_NAME),
    foundationAddress: getSetting(RECEIPT_SETTINGS_KEYS.FOUNDATION_ADDRESS),
    foundationPhone: getSetting(RECEIPT_SETTINGS_KEYS.FOUNDATION_PHONE),
    bankName: getSetting(RECEIPT_SETTINGS_KEYS.BANK_NAME),
    bankAccountNumber: getSetting(RECEIPT_SETTINGS_KEYS.BANK_ACCOUNT_NUMBER),
    bankAccountName: getSetting(RECEIPT_SETTINGS_KEYS.BANK_ACCOUNT_NAME),

    // Messages
    thankYouMessage: getSetting(RECEIPT_SETTINGS_KEYS.FOOTER_MESSAGE),
    signatureName: getSetting(RECEIPT_SETTINGS_KEYS.SIGNATURE_NAME),
    signaturePosition: getSetting(RECEIPT_SETTINGS_KEYS.SIGNATURE_POSITION),

    // Placeholders
    verificationCode: `VERIFY-${donation.donationNumber.split("-").pop()}`,
    verificationUrl: `https://hasydonate.or.id/verify/${donation.id}`,
    qrPlaceholderUrl: "/placeholder-qr.png",
    statusLabel: "LUNAS",
    watermarkText: "YAYASAN AL-HASYIMI",
    logoUrl,
  };

  if (donation.notes) {
    return {
      ...data,
      notes: donation.notes,
    };
  }

  return data;
};
