import { cn } from "@/lib/utils";

type TypographyH3Props = React.ComponentPropsWithoutRef<"h3"> & {
  children: React.ReactNode;
};
export function TypographyH3({
  children,
  className,
  ...props
}: TypographyH3Props) {
  return (
    <h3
      {...props}
      className={cn(
        "scroll-m-20 border-b pb-1 text-base font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h3>
  );
}
