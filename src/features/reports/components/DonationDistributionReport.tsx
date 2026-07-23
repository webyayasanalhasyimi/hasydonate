import React from "react";
import { type ReportDistributionItemDto } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatIDR } from "@/lib/utils/currency";

interface DonationDistributionReportProps {
  readonly typeDistribution: readonly ReportDistributionItemDto[];
  readonly methodDistribution: readonly ReportDistributionItemDto[];
}

export function DonationDistributionReport({
  typeDistribution,
  methodDistribution,
}: DonationDistributionReportProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Penyebaran Distribusi
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Donation Types */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-foreground">Berdasarkan Kategori Donasi</h4>
          <div className="space-y-3">
            {typeDistribution.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">{item.label}</span>
                  <span className="text-muted-foreground font-bold">
                    {formatIDR(item.amount)} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%` }}
                    className="h-full bg-primary rounded-full transition-all duration-300"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">{item.count} Transaksi</p>
              </div>
            ))}
            {typeDistribution.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">Tidak ada data kategori.</p>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 border-t border-border pt-4">
          <h4 className="text-xs font-bold text-foreground">Berdasarkan Saluran Pembayaran</h4>
          <div className="space-y-3">
            {methodDistribution.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">{item.label}</span>
                  <span className="text-muted-foreground font-bold">
                    {formatIDR(item.amount)} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%` }}
                    className="h-full bg-primary/80 rounded-full transition-all duration-300"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">{item.count} Transaksi</p>
              </div>
            ))}
            {methodDistribution.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">Tidak ada data metode pembayaran.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export type DonationDistributionReportType = typeof DonationDistributionReport;
