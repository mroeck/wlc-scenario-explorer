import { cn } from "@/lib/utils";

type TypographyMutedProps = React.ComponentPropsWithoutRef<"p"> & {
  children: React.ReactNode;
};
export function TypographyMuted({ children, className }: TypographyMutedProps) {
  return <p className={cn("text-sm text-gray-500", className)}>{children}</p>;
}
