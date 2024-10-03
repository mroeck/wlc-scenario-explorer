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
    <ul className={cn("list-disc md:ml-6 [&>li]:mt-2", className)}>
      {children}
      {items?.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}
