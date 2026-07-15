import { type ReactNode } from "react";
import { Typography } from "./Typography";

interface InfoRowProps {
  readonly label: string;
  readonly value: ReactNode;
  readonly className?: string;
}

export function InfoRow({ label, value, className = "" }: InfoRowProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-border last:border-0 ${className}`}
    >
      <Typography variant="muted" className="text-sm font-medium">
        {label}
      </Typography>
      <div className="mt-1 sm:mt-0 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
