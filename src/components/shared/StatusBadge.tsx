import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  readonly status: string;
  readonly label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const statusUpper = status.toUpperCase();
  const displayLabel = label ?? status;

  let variantClass = "bg-secondary text-secondary-foreground";

  if (["ACTIVE", "SUCCESS", "PAID", "COMPLETED"].includes(statusUpper)) {
    variantClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  } else if (["INACTIVE", "FAILED", "CANCELLED", "DISABLED"].includes(statusUpper)) {
    variantClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  } else if (["PENDING", "WARNING", "UNPAID"].includes(statusUpper)) {
    variantClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  } else if (["INFO", "ZAKAT", "SHADAQAH", "SUMBANGAN_LAIN"].includes(statusUpper)) {
    variantClass = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  }

  return (
    <Badge variant="outline" className={`font-semibold border-transparent ${variantClass}`}>
      {displayLabel}
    </Badge>
  );
}
