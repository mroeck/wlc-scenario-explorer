import { cn } from "@/lib/utils";

type SectionProps = React.ComponentPropsWithoutRef<"button"> & {
  children: React.ReactNode;
};
export const Section = ({ children, className }: SectionProps) => {
  return (
    <section
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-primary shadow-md",
        className,
      )}
    >
      {children}
    </section>
  );
};
