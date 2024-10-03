import { TriangleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ERROR_OCCURED } from "@/lib/constants";

export const ErrorOccurred = () => {
  return (
    <div className={cn("flex h-full flex-col justify-center")}>
      <div className="flex flex-col items-center justify-center space-y-4 pb-10 lg:-translate-y-1/2 lg:pb-0">
        <TriangleAlertIcon className="size-12 text-destructive" />
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-destructive">
            {ERROR_OCCURED}
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
