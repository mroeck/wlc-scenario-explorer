import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  value: string;
  className?: string;
};

export function CopyButton({ value, className }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setHasCopied(true);
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <Button
      className={cn(className)}
      onClick={void copyToClipboard}
      aria-label="Copy to clipboard"
    >
      {hasCopied ? (
        <>
          <Check className="size-4" />
          <span className="ml-2">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="size-4" />
          <span className="ml-2 font-bold">Copy link</span>
        </>
      )}
    </Button>
  );
}
