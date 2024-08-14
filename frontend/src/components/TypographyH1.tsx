import { cn } from "@/lib/utils";

type TypographyH1Props = React.ComponentPropsWithoutRef<"h1"> & {
  children: React.ReactNode;
};
export function TypographyH1({ children, className }: TypographyH1Props) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}
