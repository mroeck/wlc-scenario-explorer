import { TriangleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const ErrorOccurred = () => {
  return (
    <div className={cn("flex h-full flex-col justify-center")}>
      <div className="flex  -translate-y-1/2 flex-col items-center justify-center space-y-4">
        <TriangleAlertIcon className="size-12 text-destructive" />
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-destructive">
            Oops, an error occurred
          </h2>
          <p className="text-muted-foreground">
            We&apos;re sorry, but something went wrong on our end. Please try
            again in a few moments.
          </p>
        </div>
      </div>
    </div>
  );
};
