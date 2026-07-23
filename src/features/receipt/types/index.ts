import { type DonationType, type PaymentMethod } from "@prisma/client";

export interface ReceiptData {
  readonly receiptNumber: string;
  readonly donationNumber: string;
  readonly donationDate: Date;
  readonly donorName: string;
  readonly donorAddress: string;
  readonly donorPhone: string;
  readonly donationType: DonationType;
  readonly paymentMethod: PaymentMethod;
  readonly amount: number;
  readonly amountSpelled: string;
  readonly notes?: string;
  readonly receivedBy: string;
  readonly printedAt: Date;

  // Foundation & Bank Settings
  readonly foundationName: string;
  readonly foundationAddress: string;
  readonly foundationPhone: string;
  readonly bankName: string;
  readonly bankAccountNumber: string;
  readonly bankAccountName: string;

  // Custom Signatures & Messages
  readonly thankYouMessage: string;
  readonly signatureName: string;
  readonly signaturePosition: string;

  // Verification & Watermark Placeholders
  readonly verificationCode?: string;
  readonly verificationUrl?: string;
  readonly qrPlaceholderUrl?: string;
  readonly statusLabel?: string;
  readonly watermarkText?: string;
  readonly logoUrl?: string | undefined;
}

export interface ReceiptTemplate {
  readonly id: string;
  readonly name: string;
  readonly paperSize: "A5" | "A4" | "THERMAL";
  readonly render: (data: ReceiptData) => React.ReactElement;
}
