import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";

type InfoButtonProps = {
  children: React.ReactNode;
  variant?: "dark" | "light";
};
export const InfoButton = ({
  children,
  variant = "light",
}: InfoButtonProps) => {
  return (
    <TooltipProvider delayDuration={350}>
      <Tooltip>
        <TooltipTrigger type="button">
          <div className="">
            <InfoIcon
              className={cn(
                "size-4",
                variant === "dark" &&
                  "fill-slate-500 text-white [&>circle:first-child]:stroke-slate-500",
              )}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-[50ch] bg-slate-500 text-white">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
