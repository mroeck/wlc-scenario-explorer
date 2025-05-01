import { LEVEL_TO_LABEL, PARAMETER_STATUS } from "@/lib/constants";
import type { Level } from "@/lib/types";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type ParameterLevelProps = {
  level: Level;
  status?: (typeof PARAMETER_STATUS)[keyof typeof PARAMETER_STATUS];
  className?: string;
  onClick?: React.MouseEventHandler;
};
const commonStyles = cn(
  "flex aspect-square size-5 items-center justify-center rounded-full border border-primary text-sm text-primary",
);
export const ParameterLevel = forwardRef<
  HTMLButtonElement,
  ParameterLevelProps
>(function ParameterLevel({ level, status, className, onClick }, ref) {
  const label = LEVEL_TO_LABEL[level];

  return (
    <button
      ref={ref}
      className={cn(
        commonStyles,
        status === PARAMETER_STATUS.approximation && "bg-[#56B5F0] text-white",
        status === PARAMETER_STATUS.active && "bg-primary text-white",
        "aspect-auto size-[unset] px-2 py-0",
        className,
      )}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
});
