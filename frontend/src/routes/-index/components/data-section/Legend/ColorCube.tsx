import { GRAPH_AXIS_COLOR } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ColorCubeProps = {
  color: string | undefined;
  className?: string;
  isSomethingHighlighted?: boolean;
  isHighlight?: boolean;
};
export const ColorCube = ({
  color,
  className,
  isHighlight,
  isSomethingHighlighted,
}: ColorCubeProps) => {
  if (color == null) return null;
  return (
    <div
      className={cn(
        "size-3 rounded-full opacity-75",
        isSomethingHighlighted && !isHighlight && "opacity-30",
        isSomethingHighlighted && isHighlight && "border border-solid",
        className,
      )}
      style={{
        backgroundColor: color,
        borderColor: GRAPH_AXIS_COLOR,
      }}
    ></div>
  );
};
