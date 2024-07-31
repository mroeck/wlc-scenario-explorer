import { cn } from "@/lib/utils";

type ColorCubeProps = {
  color: string | undefined;
  className?: string;
};
export const ColorCube = ({ color, className }: ColorCubeProps) => {
  if (color == null) return null;
  return (
    <div
      className={cn("size-3 rounded-full opacity-75", className)}
      style={{
        backgroundColor: color,
      }}
    ></div>
  );
};
