import { type ReactNode } from "react";

interface PageContainerProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return <div className={`max-w-7xl mx-auto space-y-6 w-full ${className}`}>{children}</div>;
}
