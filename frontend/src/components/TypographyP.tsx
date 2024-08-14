import { cn } from "@/lib/utils";

type TypographyPProps = React.ComponentPropsWithoutRef<"p"> & {
  children: React.ReactNode;
};
export function TypographyP({ children, className }: TypographyPProps) {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-5", className)}>
      {children}
    </p>
  );
}
