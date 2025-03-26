import { InfoIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";

type InfoButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};
export const InfoButton = ({
  children,
  disabled = false,
  className,
}: InfoButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger disabled={disabled} className={cn(className)}>
        <div className="p-1">
          <InfoIcon className="size-[18px] fill-primary-100 text-primary [&>circle:first-child]:stroke-primary-900" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="max-w-[50ch] bg-primary-900 text-sm text-white">
        {children}
      </PopoverContent>
    </Popover>
  );
};
