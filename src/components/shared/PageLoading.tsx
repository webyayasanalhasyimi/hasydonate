import { Icons } from "@/lib/icons";
import { Typography } from "./Typography";

interface PageLoadingProps {
  readonly message?: string;
}

export function PageLoading({ message = "Loading page..." }: PageLoadingProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <Icons.Spinner className="h-10 w-10 text-primary animate-spin" />
      <Typography variant="muted" className="mt-4">
        {message}
      </Typography>
    </div>
  );
}
