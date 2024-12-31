import { cn } from "@/lib/utils";
import { Section } from "./Section";

type SectionForDocProps = React.ComponentPropsWithoutRef<"section"> & {
  children: React.ReactNode;
  className?: string;
};
export const SectionForDoc = ({
  children,
  className,
  ...props
}: SectionForDocProps) => {
  return (
    <Section
      {...props}
      className={cn("border-none px-4 pt-primary-y shadow-none", className)}
      noPadding
    >
      {children}
    </Section>
  );
};
