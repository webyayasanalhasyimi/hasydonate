"use client";

import React, { useState, useEffect } from "react";
import { type DashboardOverviewDto } from "../types";
import { getDashboardOverviewAction } from "@/server/actions/dashboard/get-overview";
import { KPICards } from "./KPICards";
import { DonationTrend } from "./DonationTrend";
import { DonationDistribution } from "./DonationDistribution";
import { RecentDonations } from "./RecentDonations";
import { QuickActions } from "./QuickActions";
import { SystemStatus } from "./SystemStatus";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/lib/icons";

interface WidgetState<T> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: string | null;
}

export function DashboardLayout() {
  const [overviewState, setOverviewState] = useState<WidgetState<DashboardOverviewDto>>({
    data: null,
    loading: true,
    error: null,
  });

  const loadData = React.useCallback(async () => {
    setOverviewState((prev) => ({ ...prev, loading: true, error: null }));
    const res = await getDashboardOverviewAction();
    if (res.success) {
      setOverviewState({ data: res.data, loading: false, error: null });
    } else {
      setOverviewState({
        data: null,
        loading: false,
        error: res.error.message || "Gagal memuat data dasbor.",
      });
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function initFetch() {
      const res = await getDashboardOverviewAction();
      if (!active) return;
      if (res.success) {
        setOverviewState({ data: res.data, loading: false, error: null });
      } else {
        setOverviewState({
          data: null,
          loading: false,
          error: res.error.message || "Gagal memuat data dasbor.",
        });
      }
    }
    initFetch();
    return () => {
      active = false;
    };
  }, []);

  const handleRetryOverview = () => {
    loadData();
  };

  // Helper render for localized widget states
  const renderWidget = <T,>(
    state: WidgetState<T>,
    skeletonHeightClass: string,
    renderFn: (data: NonNullable<T>) => React.ReactNode
  ) => {
    if (state.loading) {
      return <Skeleton className={`w-full ${skeletonHeightClass}`} />;
    }
    if (state.error || state.data === null || state.data === undefined) {
      return (
        <Alert variant="destructive" className="flex flex-col gap-2 items-start justify-center p-6 h-full">
          <Icons.Error className="h-5 w-5 shrink-0" />
          <AlertTitle className="text-sm font-bold">Gagal Memuat Widget</AlertTitle>
          <AlertDescription className="text-xs">
            {state.error || "Data tidak tersedia."}
          </AlertDescription>
          <Button size="sm" variant="outline" className="mt-2" onClick={handleRetryOverview}>
            Coba Lagi
          </Button>
        </Alert>
      );
    }
    return renderFn(state.data as NonNullable<T>);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Title */}
      <div className="flex flex-col gap-1 pb-4 border-b border-border">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Beranda Dasbor</h1>
        <p className="text-xs text-muted-foreground">
          Pantau ringkasan donasi masuk dan status operasional yayasan.
        </p>
      </div>

      {/* KPI Cards Row (Full Width) */}
      <div className="w-full">
        {renderWidget(
          {
            data: overviewState.data?.kpis,
            loading: overviewState.loading,
            error: overviewState.error,
          },
          "h-28",
          (kpis) => <KPICards kpis={kpis} />
        )}
      </div>

      {/* Responsive Widget Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Content Area (Span 2 Columns on Desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Section */}
          <div className="w-full">
            {renderWidget(
              {
                data: overviewState.data?.trend,
                loading: overviewState.loading,
                error: overviewState.error,
              },
              "h-80",
              (trend) => <DonationTrend trend={trend} />
            )}
          </div>

          {/* Recent Transactions Section */}
          <div className="w-full">
            {renderWidget(
              {
                data: overviewState.data?.recentDonations,
                loading: overviewState.loading,
                error: overviewState.error,
              },
              "h-64",
              (recentDonations) => <RecentDonations items={recentDonations} />
            )}
          </div>
        </div>

        {/* Sidebar Widgets Panel (1 Column on Desktop) */}
        <div className="space-y-6">
          {/* Category Distributions */}
          <div className="w-full">
            {renderWidget(
              {
                data: overviewState.data
                  ? {
                      typeDistribution: overviewState.data.typeDistribution,
                      methodDistribution: overviewState.data.methodDistribution,
                    }
                  : null,
                loading: overviewState.loading,
                error: overviewState.error,
              },
              "h-96",
              (data) => (
                <DonationDistribution
                  typeDistribution={data.typeDistribution}
                  methodDistribution={data.methodDistribution}
                />
              )
            )}
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="w-full">
            {renderWidget(
              {
                data: overviewState.data?.quickActions,
                loading: overviewState.loading,
                error: overviewState.error,
              },
              "h-52",
              (quickActions) => <QuickActions actions={quickActions} />
            )}
          </div>

          {/* Setup Config Status */}
          <div className="w-full">
            {renderWidget(
              {
                data: overviewState.data?.systemStatus,
                loading: overviewState.loading,
                error: overviewState.error,
              },
              "h-64",
              (systemStatus) => <SystemStatus statusItems={systemStatus} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export type DashboardLayoutType = typeof DashboardLayout;
