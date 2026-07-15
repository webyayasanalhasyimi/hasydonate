import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icons } from "@/lib/icons";

interface ErrorAlertProps {
  readonly title?: string;
  readonly message: string;
}

export function ErrorAlert({ title = "Error occurred", message }: ErrorAlertProps) {
  return (
    <Alert variant="destructive">
      <Icons.Error className="h-4 w-4" />
      {title && <AlertTitle className="font-semibold">{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
