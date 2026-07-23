import { type ReportSummaryDto } from "../../types";

export function aggregateSummary(
  totalAmount: number,
  totalCount: number,
  largestDonation: number
): ReportSummaryDto {
  const averageDonation = totalCount > 0 ? totalAmount / totalCount : 0;
  return {
    totalAmount,
    totalCount,
    averageDonation,
    largestDonation,
  };
}
export type AggregateSummaryType = typeof aggregateSummary;
