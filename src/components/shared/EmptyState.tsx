import { type ReactNode } from "react";
import { type IconType } from "@/lib/icons";
import { Typography } from "./Typography";

interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly icon?: IconType;
  readonly action?: ReactNode;
}

export function EmptyState({ title, description, icon: Icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg border-border bg-card">
      {Icon && <Icon className="h-10 w-10 text-muted-foreground mb-4" />}
      <Typography variant="large" as="h3">
        {title}
      </Typography>
      <Typography variant="muted" className="mt-1 max-w-sm">
        {description}
      </Typography>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
