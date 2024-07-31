import { cn } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";

type ResetButtonProps = {
  reset: () => void;
  text: string;
};
export const ResetButton = ({ reset, text }: ResetButtonProps) => {
  return (
    <button
      type="button"
      className={cn("flex items-center gap-1 text-sm")}
      onClick={reset}
    >
      <RefreshCcw className={cn("size-4")} />
      <span>{text}</span>
    </button>
  );
};
