import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-destructive">
      <AlertCircle className="size-10" />
      <p className="text-lg font-medium">Something went wrong</p>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
