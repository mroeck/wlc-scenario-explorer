import { cn } from "@/lib/utils";

type SVGStyle = {
  stroke: string;
  strokeWidth: string;
  fill: string;
  strokeLinecap: "round" | "butt" | "square";
  strokeLinejoin: "round" | "bevel" | "miter";
};

const sharedStyles: Partial<SVGStyle> = {
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

type LineGraphIconProps = {
  colorful: boolean;
};
export const LineGraphIcon = ({ colorful }: LineGraphIconProps) => {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 555.94 487.71"
    >
      <polyline
        style={{
          ...sharedStyles,
          strokeWidth: "40px",
        }}
        className={cn(colorful ? "stroke-[#394285]" : "stroke-primary-900")}
        points="20 20 20 467.71 535.94 467.71"
      />
      <polyline
        style={{
          ...sharedStyles,
          strokeWidth: "25px",
        }}
        points="70.05 257.14 197.92 122.36 323.2 175.06 511.56 41.14"
        className={cn(colorful ? "stroke-[#3abb5c]" : "stroke-primary-900")}
      />
      <polyline
        style={{
          ...sharedStyles,
          strokeWidth: "25px",
        }}
        points="70.34 298.9 195.91 204.44 324.93 241.3 511.56 132.63"
        className={cn(colorful ? "stroke-[#499acc]" : "stroke-primary-900")}
      />
      <polyline
        style={{
          ...sharedStyles,
          strokeWidth: "25px",
        }}
        points="69.19 376.09 200.51 319.64 326.08 332.31 510.4 199.83"
        className={cn(colorful ? "stroke-[#3abb5c]" : "stroke-primary-900")}
      />
    </svg>
  );
};
