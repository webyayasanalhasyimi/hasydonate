export interface DonaturListItemDto {
  readonly id: string;
  readonly fullName: string;
  readonly address: string;
  readonly phoneNumber: string;
  readonly totalDonations: number;
  readonly lastDonationAt: Date | null;
}

export interface DonationHistoryDto {
  readonly id: string;
  readonly donationNumber: string;
  readonly donationType: string;
  readonly amount: number;
  readonly donationDate: Date;
  readonly paymentMethod: string;
}

export interface DonaturDetailDto {
  readonly id: string;
  readonly fullName: string;
  readonly address: string;
  readonly phoneNumber: string;
  readonly totalDonations: number;
  readonly lastDonationAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly donations: readonly DonationHistoryDto[];
}

export interface DonaturSummaryDto {
  readonly totalDonors: number;
  readonly newDonorsThisMonth: number;
}
