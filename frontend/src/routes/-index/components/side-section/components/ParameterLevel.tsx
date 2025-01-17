import { PARAMETER_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type ParameterLevelProps = {
  level: string | undefined;
  status?: (typeof PARAMETER_STATUS)[keyof typeof PARAMETER_STATUS];
  editable?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler;
};
const commonStyles = cn(
  "flex aspect-square size-5 items-center justify-center rounded-full border border-primary text-sm text-primary",
);
export const ParameterLevel = forwardRef<
  HTMLButtonElement,
  ParameterLevelProps
>(function ParameterLevel(
  { level, status, editable = false, className, onClick },
  ref,
) {
  if (editable) {
    return (
      <input
        className={cn(
          commonStyles,
          "text-center",
          status === PARAMETER_STATUS.active && "bg-accent text-primary",
          status === PARAMETER_STATUS.disable && "opacity-30",
          className,
        )}
        defaultValue={level}
      />
    );
  }

  return (
    <button
      ref={ref}
      className={cn(
        commonStyles,
        status === PARAMETER_STATUS.active && "bg-primary text-white",
        status === PARAMETER_STATUS.disable && "opacity-30",
        "aspect-auto size-[unset] px-2 py-0",
        className,
      )}
      type="button"
      onClick={onClick}
    >
      {level}
    </button>
  );
});
