import { Icons } from "@/lib/icons";
import { Typography } from "./Typography";

interface LoadingStateProps {
  readonly message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Icons.Spinner className="h-8 w-8 text-primary animate-spin" />
      <Typography variant="muted">{message}</Typography>
    </div>
  );
}
