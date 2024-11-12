import { cn } from "@/lib/utils";

type TableIconProps = {
  colorful: boolean;
};
export const TableIcon = ({ colorful }: TableIconProps) => {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 557.48 487.71"
    >
      <polygon
        fill="none"
        className={cn(colorful ? "stroke-[#394285]" : "stroke-primary-900")}
        strokeWidth="40"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="535.94 467.71 20 467.71 20 20 537.48 20 535.94 467.71"
      />
      <rect
        x="19.08"
        y="20"
        width="518.4"
        height="115.32"
        className={cn(
          colorful
            ? "fill-[#499acc] stroke-[#394285]"
            : "fill-transparent stroke-primary-900",
        )}
        strokeWidth="25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="154.44"
        y1="138.78"
        x2="154.44"
        y2="459.03"
        fill="none"
        className={cn(colorful ? "stroke-[#394285]" : "stroke-primary-900")}
        strokeWidth="25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="277.7"
        y1="138.78"
        x2="277.7"
        y2="459.03"
        fill="none"
        className={cn(colorful ? "stroke-[#394285]" : "stroke-primary-900")}
        strokeWidth="25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="400.96"
        y1="138.78"
        x2="400.96"
        y2="459.03"
        fill="none"
        className={cn(colorful ? "stroke-[#394285]" : "stroke-primary-900")}
        strokeWidth="25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="21.96"
        y1="249.37"
        x2="534.6"
        y2="249.37"
        fill="none"
        className={cn(colorful ? "stroke-[#394285]" : "stroke-primary-900")}
        strokeWidth="25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="21.96"
        y1="355.42"
        x2="534.6"
        y2="355.42"
        fill="none"
        className={cn(colorful ? "stroke-[#394385]" : "stroke-primary-900")}
        strokeWidth="25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
