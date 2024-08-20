import { cn } from "@/lib/utils";

type ContentProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode;
};
export const TypographyContent = ({ children, className }: ContentProps) => {
  return (
    <div className={cn("flex flex-col gap-2 p-2 md:p-primary", className)}>
      {children}
    </div>
  );
};
