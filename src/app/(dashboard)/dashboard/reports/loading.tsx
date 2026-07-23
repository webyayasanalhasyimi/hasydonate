import React from "react";
import { PageContainer } from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsLoading() {
  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-24 w-full" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-80 w-full" />
        </div>
        <div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>

      <Skeleton className="h-80 w-full" />
    </PageContainer>
  );
}
export type ReportsLoadingType = typeof ReportsLoading;
