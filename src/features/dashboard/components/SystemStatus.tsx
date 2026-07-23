import React from "react";
import { type DashboardSystemStatusItemDto } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Icons } from "@/lib/icons";

interface SystemStatusProps {
  readonly statusItems: readonly DashboardSystemStatusItemDto[];
}

export function SystemStatus({ statusItems }: SystemStatusProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Status Konfigurasi Sistem
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {statusItems.map((item) => {
            const isSuccess = item.status === "SUCCESS";
            const isWarning = item.status === "WARNING";

            return (
              <div key={item.id} className="flex gap-3 items-start">
                <div className="mt-0.5">
                  {isSuccess ? (
                    <Icons.Success className="h-5 w-5 text-emerald-600 shrink-0" />
                  ) : isWarning ? (
                    <Icons.Error className="h-5 w-5 text-amber-500 shrink-0" />
                  ) : (
                    <Icons.Error className="h-5 w-5 text-destructive shrink-0" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    {item.label}
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        isSuccess
                          ? "bg-emerald-100 text-emerald-800"
                          : isWarning
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </h4>
                  {item.description && (
                    <p className="text-[10px] text-muted-foreground leading-normal">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          {statusItems.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              Tidak ada status konfigurasi sistem.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export type SystemStatusType = typeof SystemStatus;
