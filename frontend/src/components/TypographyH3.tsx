import { cn } from "@/lib/utils";

type TypographyH3Props = React.ComponentPropsWithoutRef<"h3"> & {
  children: React.ReactNode;
};
export function TypographyH3({ children, className }: TypographyH3Props) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h3>
  );
}
