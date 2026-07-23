import { type DonationListItemDto } from "@/features/donation/types";
import { type DashboardDistributionItemDto } from "@/features/dashboard/types";
import { type DonationType, type PaymentMethod } from "@prisma/client";

export interface ReportSummaryDto {
  readonly totalAmount: number;
  readonly totalCount: number;
  readonly averageDonation: number;
  readonly largestDonation: number;
}

export interface ReportTrendItemDto {
  readonly date: string;
  readonly amount: number;
  readonly count: number;
}

export type ReportDistributionItemDto = DashboardDistributionItemDto;

export type ReportRowDto = DonationListItemDto;

export interface ReportFilterInputDto {
  readonly dateStart?: string | undefined;
  readonly dateEnd?: string | undefined;
  readonly donationType?: DonationType | undefined;
  readonly paymentMethod?: PaymentMethod | undefined;
  readonly donorId?: string | undefined;
  readonly minAmount?: number | undefined;
  readonly maxAmount?: number | undefined;
  readonly searchKeyword?: string | undefined;
  readonly limit?: number | undefined;
  readonly cursor?: string | undefined;
}

export interface ReportResultDto {
  readonly summary: ReportSummaryDto;
  readonly trend: readonly ReportTrendItemDto[];
  readonly typeDistribution: readonly ReportDistributionItemDto[];
  readonly methodDistribution: readonly ReportDistributionItemDto[];
  readonly rows: readonly ReportRowDto[];
  readonly nextCursor?: string | undefined;
}
