import { type ReactNode } from "react";
import { Typography } from "./Typography";

interface PageHeaderProps {
  readonly title: string;
  readonly description?: string;
  readonly actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 pb-6 border-b border-border">
      <div>
        <Typography variant="h2" as="h1">
          {title}
        </Typography>
        {description && (
          <Typography variant="muted" className="mt-1">
            {description}
          </Typography>
        )}
      </div>
      {actions && <div className="flex items-center space-x-3">{actions}</div>}
    </div>
  );
}
