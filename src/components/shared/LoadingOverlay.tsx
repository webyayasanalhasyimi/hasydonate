import { Icons } from "@/lib/icons";
import { Typography } from "./Typography";

interface LoadingOverlayProps {
  readonly message?: string;
}

export function LoadingOverlay({ message = "Processing..." }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xs">
      <Icons.Spinner className="h-8 w-8 text-primary animate-spin" />
      <Typography variant="small" className="mt-2 font-medium">
        {message}
      </Typography>
    </div>
  );
}
