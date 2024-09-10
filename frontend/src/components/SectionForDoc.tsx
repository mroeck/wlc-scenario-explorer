import { Section } from "./Section";

type SectionForDocProps = React.ComponentPropsWithoutRef<"section"> & {
  children: React.ReactNode;
};
export const SectionForDoc = ({ children, ...props }: SectionForDocProps) => {
  return (
    <Section
      {...props}
      className="border-none pl-2 pr-0 pt-primary-y shadow-none"
      noPadding
    >
      {children}
    </Section>
  );
};
