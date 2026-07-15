import { type ReactNode } from "react";

interface KeyValueListProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function KeyValueList({ children, className = "" }: KeyValueListProps) {
  return (
    <div
      className={`divide-y divide-border border border-border rounded-lg bg-card px-4 py-2 ${className}`}
    >
      {children}
    </div>
  );
}
