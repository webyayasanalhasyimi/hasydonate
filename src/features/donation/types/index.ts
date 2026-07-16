import { type DonationType, type PaymentMethod } from "@prisma/client";

export interface DonationCreateDto {
  readonly donorId: string;
  readonly donationType: DonationType;
  readonly paymentMethod: PaymentMethod;
  readonly amount: number;
  readonly notes?: string | undefined;
  readonly transferProofPath?: string | undefined;
  readonly transferProofFilename?: string | undefined;
  readonly donationDate: Date;
}

export interface DonationListItemDto {
  readonly id: string;
  readonly donationNumber: string;
  readonly donorName: string;
  readonly donationType: DonationType;
  readonly paymentMethod: PaymentMethod;
  readonly amount: number;
  readonly donationDate: Date;
  readonly receivedByName: string;
}

export interface DonationDetailDto {
  readonly id: string;
  readonly donationNumber: string;
  readonly donorId: string;
  readonly donorName: string;
  readonly donorPhone: string;
  readonly donorAddress: string;
  readonly donationType: DonationType;
  readonly paymentMethod: PaymentMethod;
  readonly amount: number;
  readonly notes: string | null;
  readonly transferProofPath: string | null;
  readonly transferProofFilename: string | null;
  readonly donationDate: Date;
  readonly receivedByName: string;
  readonly createdAt: Date;
}

export interface DonationSummaryDto {
  readonly totalAmount: number;
  readonly transactionCount: number;
}
