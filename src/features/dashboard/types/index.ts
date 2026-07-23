import { type DonationListItemDto } from "@/features/donation/types";

export interface DashboardKpiItemDto {
  readonly id: string;
  readonly label: string;
  readonly value: string | number;
  readonly description?: string | undefined;
  readonly icon?: string | undefined;
  readonly trend?: {
    readonly value: number;
    readonly isPositive: boolean;
  } | null | undefined;
}

export interface DashboardTrendItemDto {
  readonly date: string;
  readonly amount: number;
  readonly count: number;
}

export interface DashboardDistributionItemDto {
  readonly id: string;
  readonly label: string;
  readonly count: number;
  readonly amount: number;
  readonly percentage: number;
}

export interface DashboardSystemStatusItemDto {
  readonly id: string;
  readonly label: string;
  readonly status: "SUCCESS" | "WARNING" | "DANGER";
  readonly description?: string | undefined;
}

export interface DashboardQuickActionItemDto {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly icon: string;
  readonly requiredRole?: string | undefined;
}

export interface DashboardOverviewDto {
  readonly kpis: readonly DashboardKpiItemDto[];
  readonly trend: readonly DashboardTrendItemDto[];
  readonly typeDistribution: readonly DashboardDistributionItemDto[];
  readonly methodDistribution: readonly DashboardDistributionItemDto[];
  readonly recentDonations: readonly DonationListItemDto[];
  readonly systemStatus: readonly DashboardSystemStatusItemDto[];
  readonly quickActions: readonly DashboardQuickActionItemDto[];
}
