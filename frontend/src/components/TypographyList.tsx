import { cn } from "@/lib/utils";

type TypographyListProps = React.ComponentPropsWithoutRef<"ul"> & {
  children: React.ReactNode;
  items?: string[];
};
export function TypographyList({
  children,
  items,
  className,
}: TypographyListProps) {
  return (
    <ul className={cn("ml-6 list-disc [&>li]:mt-2", className)}>
      {children}
      {items?.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
  );
}
