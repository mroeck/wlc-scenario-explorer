import { LOADING_SPINNER_ID } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div
      className={cn(
        "absolute inset-x-1/2 top-1/4 flex items-center justify-center",
      )}
      role="progressbar"
      data-testid={LOADING_SPINNER_ID}
    >
      <div className={cn("animate-spin text-primary")}>
        <LoaderCircleIcon className="size-10" />
      </div>
    </div>
  );
};
