import React from "react";
import { type DashboardQuickActionItemDto } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Icons } from "@/lib/icons";
import Link from "next/link";

interface QuickActionsProps {
  readonly actions: readonly DashboardQuickActionItemDto[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Aksi Cepat
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action) => {
            const IconComponent = action.icon in Icons 
              ? Icons[action.icon as keyof typeof Icons] 
              : undefined;

            return (
              <Link
                key={action.id}
                href={action.href}
                className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-all group"
              >
                <div className="p-2 bg-muted rounded-md group-hover:bg-primary/10 transition-colors">
                  {IconComponent && <IconComponent className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {action.label}
                  </span>
                </div>
                <Icons.ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
          {actions.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              Tidak ada aksi cepat tersedia.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export type QuickActionsType = typeof QuickActions;
