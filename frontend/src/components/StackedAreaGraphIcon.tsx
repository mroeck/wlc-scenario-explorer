import { cn } from "@/lib/utils";

type StackedAreaGraphIconProps = {
  colorful: boolean;
};
export const StackedAreaGraphIcon = ({
  colorful,
}: StackedAreaGraphIconProps) => {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 555.94 487.71"
    >
      <polyline
        fill="none"
        strokeWidth="40"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="20 20 20 467.71 535.94 467.71"
        className={cn(colorful ? "stroke-[#394285]" : "stroke-primary-900")}
      />
      <polygon
        className={cn(
          colorful
            ? "fill-[#3abb5c] stroke-[#394285]"
            : "fill-transparent stroke-primary-900",
        )}
        strokeWidth="25"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="70.05 419.58 70.05 257.14 197.92 122.36 323.2 175.06 511.56 41.14 511.56 421.3 70.05 419.58"
      />
      <polygon
        className={cn(
          colorful
            ? "fill-[#499acc] stroke-[#394285]"
            : "fill-primary-900 stroke-primary-900",
        )}
        strokeWidth="25"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="70.34 298.9 195.91 187.16 322.63 249.37 511.56 132.63 511.56 421.3 70.05 419.58 70.34 298.9"
      />
    </svg>
  );
};
