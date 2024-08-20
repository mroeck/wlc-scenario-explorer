import { cn } from "@/lib/utils";
import { Section } from "./Section";

type SectionForDocProps = React.ComponentPropsWithoutRef<"section"> & {
  children: React.ReactNode;
};
export const SectionForDoc = ({ children }: SectionForDocProps) => {
  return (
    <Section
      className={cn("border-none pl-2 pr-0 pt-primary-y shadow-none")}
      noPadding
    >
      {children}
    </Section>
  );
};
