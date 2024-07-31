import { cn } from "@/lib/utils";
import type { ReactNode } from "@tanstack/react-router";

type SelectMenuStyleProps = {
  children: ReactNode;
};
export const SelectMenuStyle = ({ children }: SelectMenuStyleProps) => {
  return <div className={cn("min-w-20")}>{children}</div>;
};
