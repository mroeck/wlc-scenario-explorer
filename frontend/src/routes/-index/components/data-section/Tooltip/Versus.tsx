import { cn } from "@/lib/utils";

type VersusProps = {
  className?: string;
};
export const Versus = ({ className }: VersusProps) => {
  return (
    <span
      className={cn(
        "mx-3 text-xs font-bold leading-[unset] text-gray-500",
        className,
      )}
    >
      VS
    </span>
  );
};
