import { InfoIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type InfoButtonProps = {
  children: React.ReactNode;
};
export const InfoButton = ({ children }: InfoButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="p-1">
          <InfoIcon className="size-4 fill-slate-500 text-white [&>circle:first-child]:stroke-slate-500" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="max-w-[50ch] bg-slate-500 text-sm text-white">
        {children}
      </PopoverContent>
    </Popover>
  );
};
