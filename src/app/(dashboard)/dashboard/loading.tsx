import React from "react";
import { PageContainer } from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-col gap-1 pb-4 border-b border-border">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* KPI Cards Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </PageContainer>
  );
}
export type DashboardLoadingType = typeof DashboardLoading;
