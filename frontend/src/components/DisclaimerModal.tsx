import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DisclaimerText } from "./DisclaimerText";
import { Checkbox } from "./ui/checkbox";
import { DISCLAIMER_MODAL_TITLE, STORAGE_KEYS } from "@/lib/constants";

export function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const hasRun = useRef(false);

  if (!hasRun.current) {
    const hasAccepted = localStorage.getItem(STORAGE_KEYS.isDisclaimerAccepted);
    if (hasAccepted !== "true") {
      setIsOpen(true);
    }

    hasRun.current = true;
  }

  const handleAccept = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEYS.isDisclaimerAccepted, "true");
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-prose">
        <DialogHeader>
          <DialogTitle>{DISCLAIMER_MODAL_TITLE}</DialogTitle>
          <DialogDescription>
            Please read and accept our disclaimer before using the website.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <DisclaimerText className="text-sm text-gray-500" />
        </div>
        <DialogFooter className="gap-4 sm:justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dontShowAgain"
              checked={dontShowAgain}
              onCheckedChange={(checked) => {
                setDontShowAgain(checked as boolean);
              }}
            />
            <label
              htmlFor="dontShowAgain"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Don't show again
            </label>
          </div>
          <Button onClick={handleAccept}>I Understand</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
