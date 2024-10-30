import { GRAPH_AXIS_COLOR } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useId } from "react";

type ColorCubeProps = {
  color: string | undefined;
  className?: string;
  isSomethingHighlighted?: boolean;
  isHighlight?: boolean;
  showPattern?: boolean;
};
export const ColorCube = ({
  color,
  className,
  isHighlight,
  isSomethingHighlighted,
  showPattern = false,
}: ColorCubeProps) => {
  const patternId = useId();
  if (color == null) return null;
  return (
    <div
      className={cn(
        "size-3 overflow-hidden rounded-full opacity-75",
        isSomethingHighlighted && !isHighlight && "opacity-30",
        isSomethingHighlighted && isHighlight && "border border-solid",
        className,
      )}
      style={{
        backgroundColor: color,
        borderColor: GRAPH_AXIS_COLOR,
      }}
    >
      {showPattern ? (
        <svg>
          <defs>
            <pattern
              id={patternId}
              width={6}
              height={6}
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width={6} height={6} fill={color} />
              <rect width="2" height="40" fill="white" />
            </pattern>
          </defs>

          <rect className="size-3" fill={`url(#${patternId})`} />
        </svg>
      ) : null}
    </div>
  );
};
