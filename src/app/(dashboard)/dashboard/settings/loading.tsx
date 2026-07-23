import React from "react";
import { PageContainer } from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <PageContainer className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-border">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    </PageContainer>
  );
}
export type SettingsLoadingType = typeof SettingsLoading;
