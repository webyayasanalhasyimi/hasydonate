import React from "react";
import { type ReportSummaryDto } from "../types";
import { StatCard } from "@/components/shared/StatCard";
import { formatIDR } from "@/lib/utils/currency";
import { Icons } from "@/lib/icons";

interface ReportSummaryProps {
  readonly summary: ReportSummaryDto;
}

export function ReportSummary({ summary }: ReportSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Donasi Masuk"
        value={formatIDR(summary.totalAmount)}
        description="Akumulasi nilai donasi tersaring"
        icon={Icons.Wallet}
      />
      <StatCard
        title="Jumlah Transaksi"
        value={summary.totalCount.toLocaleString("id-ID")}
        description="Frekuensi donasi masuk tersaring"
        icon={Icons.Receipt}
      />
      <StatCard
        title="Rata-rata Donasi"
        value={formatIDR(summary.averageDonation)}
        description="Rata-rata nilai per transaksi"
        icon={Icons.DollarSign}
      />
      <StatCard
        title="Donasi Terbesar"
        value={formatIDR(summary.largestDonation)}
        description="Nilai donasi tertinggi yang tercatat"
        icon={Icons.Check}
      />
    </div>
  );
}
export type ReportSummaryType = typeof ReportSummary;
