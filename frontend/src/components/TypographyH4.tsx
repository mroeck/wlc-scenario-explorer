import { cn } from "@/lib/utils";

type TypographyH4Props = React.ComponentPropsWithoutRef<"h4"> & {
  children: React.ReactNode;
};
export function TypographyH4({ children, className }: TypographyH4Props) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h4>
  );
}
