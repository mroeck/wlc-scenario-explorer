import { RefreshCcw } from "lucide-react";

type ResetButtonProps = {
  reset: () => void;
  text: string;
};
export const ResetButton = ({ reset, text }: ResetButtonProps) => {
  return (
    <button
      type="button"
      className="flex items-center gap-1 text-sm text-gray-800"
      onClick={reset}
    >
      <RefreshCcw className="size-4" />
      <span>{text}</span>
    </button>
  );
};
