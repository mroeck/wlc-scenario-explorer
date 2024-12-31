import { cn } from "@/lib/utils";

type TypographyH2Props = React.ComponentPropsWithoutRef<"h2"> & {
  children: React.ReactNode;
};
export function TypographyH2({
  children,
  className,
  ...props
}: TypographyH2Props) {
  return (
    <h2
      {...props}
      className={cn(
        "scroll-m-20 border-b pb-1 text-base font-semibold tracking-tight first:mt-0",
        className,
      )}
    >
      {children}
    </h2>
  );
}
