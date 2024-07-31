import { PARAMETER_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ParameterLevelProps = {
  level: number;
  status?: (typeof PARAMETER_STATUS)[keyof typeof PARAMETER_STATUS];
  editable?: boolean;
  className?: string;
};
const commonStyles = cn(
  "flex aspect-square size-5 items-center justify-center rounded-full border border-primary text-sm text-primary",
);
export const ParameterLevel = ({
  level,
  status,
  editable = false,
  className,
}: ParameterLevelProps) => {
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
      className={cn(
        commonStyles,
        status === PARAMETER_STATUS.active && "bg-primary text-white",
        status === PARAMETER_STATUS.disable && "opacity-30",
        className,
      )}
      type="button"
    >
      {level}
    </button>
  );
};
