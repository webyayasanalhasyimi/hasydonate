import { Icons } from "@/lib/icons";

interface InlineErrorProps {
  readonly message: string;
}

export function InlineError({ message }: InlineErrorProps) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-destructive mt-1">
      <Icons.Error className="h-3.5 w-3.5" />
      <span>{message}</span>
    </div>
  );
}
