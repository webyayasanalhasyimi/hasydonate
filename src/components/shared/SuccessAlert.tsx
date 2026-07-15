import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icons } from "@/lib/icons";

interface SuccessAlertProps {
  readonly title?: string;
  readonly message: string;
}

export function SuccessAlert({ title = "Success", message }: SuccessAlertProps) {
  return (
    <Alert
      variant="default"
      className="border-green-600/30 bg-green-50 text-green-800 dark:bg-green-950/20 dark:text-green-400"
    >
      <Icons.Success className="h-4 w-4 text-green-600 dark:text-green-400" />
      {title && (
        <AlertTitle className="text-green-800 dark:text-green-400 font-semibold">{title}</AlertTitle>
      )}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
