import { cn } from "@/lib/utils";

type SectionProps = React.ComponentPropsWithoutRef<"section"> & {
  children: React.ReactNode;
  noPadding?: boolean;
};
export const Section = ({
  children,
  noPadding = false,
  className,
  ...props
}: SectionProps) => {
  return (
    <section
      {...props}
      className={cn(
        "rounded-lg border border-gray-200 bg-white shadow-md",
        noPadding ? "" : "p-primary",
        className,
      )}
    >
      {children}
    </section>
  );
};
