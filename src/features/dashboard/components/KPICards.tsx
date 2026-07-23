import React from "react";
import { type DashboardKpiItemDto } from "../types";
import { StatCard } from "@/components/shared/StatCard";
import { Icons } from "@/lib/icons";

interface KPICardsProps {
  readonly kpis: readonly DashboardKpiItemDto[];
}

export function KPICards({ kpis }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi) => {
        // Resolve dynamic icon string to actual Icon component from our design system
        const IconComponent = kpi.icon && kpi.icon in Icons 
          ? Icons[kpi.icon as keyof typeof Icons] 
          : undefined;

        return (
          <StatCard
            key={kpi.id}
            title={kpi.label}
            value={kpi.value}
            {...(IconComponent ? { icon: IconComponent } : {})}
            {...(kpi.description ? { description: kpi.description } : {})}
          />
        );
      })}
    </div>
  );
}
export type KPICardsType = typeof KPICards;
