"use client";

import React, { useState, useEffect, useTransition } from "react";
import { type ReportResultDto, type ReportRowDto } from "../types";
import { type ReportFilterInputValues } from "../schemas/report-filter.schema";
import { generateReportAction } from "@/server/actions/reports/generate-report";
import { ReportFilters } from "./ReportFilters";
import { ReportSummary } from "./ReportSummary";
import { DonationTrendReport } from "./DonationTrendReport";
import { DonationDistributionReport } from "./DonationDistributionReport";
import { DonationTable } from "./DonationTable";
import { ExportActions } from "./ExportActions";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/lib/icons";

interface WidgetState<T> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: string | null;
}

export function ReportsLayout() {
  const [filters, setFilters] = useState<ReportFilterInputValues>({});
  const [reportState, setReportState] = useState<WidgetState<ReportResultDto>>({
    data: null,
    loading: true,
    error: null,
  });

  const [rows, setRows] = useState<readonly ReportRowDto[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [, startTransition] = useTransition();

  const loadReport = async (currentFilters: ReportFilterInputValues, cursor?: string) => {
    if (!cursor) {
      setReportState((prev) => ({ ...prev, loading: true, error: null }));
    } else {
      setLoadingMore(true);
    }

    const res = await generateReportAction({ ...currentFilters, cursor });

    if (!cursor) {
      if (res.success) {
        setReportState({ data: res.data, loading: false, error: null });
        setRows(res.data.rows);
      } else {
        setReportState({
          data: null,
          loading: false,
          error: res.error.message || "Gagal memuat laporan.",
        });
        setRows([]);
      }
    } else {
      setLoadingMore(false);
      if (res.success) {
        setReportState((prev) => ({
          ...prev,
          data: prev.data
            ? {
                ...prev.data,
                nextCursor: res.data.nextCursor,
              }
            : null,
        }));
        setRows((prev) => [...prev, ...res.data.rows]);
      }
    }
  };

  useEffect(() => {
    startTransition(() => {
      loadReport(filters);
    });
  }, [filters]);

  const handleFilterChange = (newFilters: ReportFilterInputValues) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleLoadMore = () => {
    if (reportState.data?.nextCursor) {
      loadReport(filters, reportState.data.nextCursor);
    }
  };

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
          <AlertTitle className="text-sm font-bold">Gagal Memuat Widget Laporan</AlertTitle>
          <AlertDescription className="text-xs">
            {state.error || "Data tidak tersedia."}
          </AlertDescription>
          <Button size="sm" variant="outline" className="mt-2" onClick={() => loadReport(filters)}>
            Coba Lagi
          </Button>
        </Alert>
      );
    }
    return renderFn(state.data as NonNullable<T>);
  };

  return (
    <div className="space-y-6">
      {/* Header and Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Laporan Analisis Donasi</h1>
          <p className="text-xs text-muted-foreground">
            Lakukan filter data, lihat tren grafik donasi, dan ekspor laporan ke CSV.
          </p>
        </div>
        <ExportActions filters={filters} />
      </div>

      {/* Filter panel */}
      <ReportFilters filters={filters} onChange={handleFilterChange} onReset={handleResetFilters} />

      {/* Summary Row */}
      <div className="w-full">
        {renderWidget(
          {
            data: reportState.data?.summary,
            loading: reportState.loading,
            error: reportState.error,
          },
          "h-28",
          (summary) => <ReportSummary summary={summary} />
        )}
      </div>

      {/* Trend and Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          {renderWidget(
            {
              data: reportState.data?.trend,
              loading: reportState.loading,
              error: reportState.error,
            },
            "h-80",
            (trend) => <DonationTrendReport trend={trend} />
          )}
        </div>
        <div>
          {renderWidget(
            {
              data: reportState.data
                ? {
                    typeDistribution: reportState.data.typeDistribution,
                    methodDistribution: reportState.data.methodDistribution,
                  }
                : null,
              loading: reportState.loading,
              error: reportState.error,
            },
            "h-96",
            (data) => (
              <DonationDistributionReport
                typeDistribution={data.typeDistribution}
                methodDistribution={data.methodDistribution}
              />
            )
          )}
        </div>
      </div>

      {/* Paginated rows table */}
      <div className="w-full">
        {renderWidget(
          {
            data: reportState.data ? rows : null,
            loading: reportState.loading,
            error: reportState.error,
          },
          "h-80",
          (tableRows) => (
            <DonationTable
              rows={tableRows}
              nextCursor={reportState.data?.nextCursor}
              onLoadMore={handleLoadMore}
              loadingMore={loadingMore}
            />
          )
        )}
      </div>
    </div>
  );
}
export type ReportsLayoutType = typeof ReportsLayout;
