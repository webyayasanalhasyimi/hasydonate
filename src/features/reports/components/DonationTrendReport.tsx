import React from "react";
import { type ReportTrendItemDto } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatIDR } from "@/lib/utils/currency";

interface DonationTrendReportProps {
  readonly trend: readonly ReportTrendItemDto[];
}

export function DonationTrendReport({ trend }: DonationTrendReportProps) {
  const maxAmount = Math.max(...trend.map((t) => t.amount), 1);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Garis Waktu Tren Laporan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative h-60 w-full flex flex-col justify-between">
          {/* Y Axis Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <div key={ratio} className="w-full flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-16 text-right shrink-0">
                  {formatIDR(maxAmount * (1 - ratio))}
                </span>
                <div className="w-full border-t border-dashed border-border/60" />
              </div>
            ))}
          </div>

          {/* SVG Bars Block */}
          <div className="relative h-44 ml-18 mr-2 mt-4 flex items-end justify-between gap-0.5 group">
            {trend.map((item) => {
              const heightPercent = (item.amount / maxAmount) * 100;
              const dateObj = new Date(item.date);
              const formattedDate = dateObj.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              });

              return (
                <div key={item.date} className="relative flex-1 flex flex-col items-center group/bar h-full justify-end">
                  <div className="absolute bottom-full mb-2 hidden group-hover/bar:flex flex-col items-center z-30 pointer-events-none transition-all duration-200">
                    <div className="bg-popover text-popover-foreground text-[10px] font-medium px-2 py-1 rounded-md shadow-md border border-border whitespace-nowrap text-center">
                      <p className="font-bold text-primary">{formatIDR(item.amount)}</p>
                      <p className="text-muted-foreground text-[9px]">{item.count} Donasi</p>
                      <p className="text-muted-foreground text-[8px]">{formattedDate}</p>
                    </div>
                    <div className="w-1.5 h-1.5 bg-border rotate-45 -mt-1" />
                  </div>

                  <div
                    style={{ height: `${Math.max(heightPercent, 2)}%` }}
                    className="w-full bg-primary/70 group-hover/bar:bg-primary transition-all duration-200"
                  />
                </div>
              );
            })}
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between ml-18 mr-2 border-t border-border pt-1">
            <span className="text-[9px] text-muted-foreground">
              {trend[0]?.date ? new Date(trend[0].date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : ""}
            </span>
            <span className="text-[9px] text-muted-foreground">
              {trend[Math.floor(trend.length / 2)]?.date 
                ? new Date(trend[Math.floor(trend.length / 2)]!.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) 
                : ""}
            </span>
            <span className="text-[9px] text-muted-foreground">
              {trend[trend.length - 1]?.date ? new Date(trend[trend.length - 1]!.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : ""}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export type DonationTrendReportType = typeof DonationTrendReport;
