import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { HELP_PAGE_IDS, ROUTES, STORAGE_KEYS } from "@/lib/constants";
import { getRouteApi, Link } from "@tanstack/react-router";
import { LinkIcon } from "lucide-react";

const route = getRouteApi(ROUTES.DASHBOARD);

export function DividedByDisclaimerModal({ mayOpen }: { mayOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const hasShownModal = useRef(false);
  const { dividedBy } = route.useSearch({
    select: (search) => ({
      dividedBy: search.dividedBy,
    }),
  });
  const isUsingDividedBy = mayOpen;

  useEffect(() => {
    const hasAccepted = localStorage.getItem(
      STORAGE_KEYS.isDividedByDisclaimerAccepted,
    );

    if (isUsingDividedBy && hasAccepted !== "true" && !hasShownModal.current) {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setIsOpen(true);
      hasShownModal.current = true;
    } else if (!isUsingDividedBy) {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setIsOpen(false);
    }
  }, [dividedBy, isUsingDividedBy]);

  const handleAccept = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEYS.isDividedByDisclaimerAccepted, "true");
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-prose">
        <DialogHeader>
          <DialogTitle>⚠️ Use with Care</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-500">
            The "Divided by" menu is powerful but can be misleading. When used
            thoughtfully, it reveals valuable insights, but if misapplied, it
            may lead to confusing or false conclusions.
          </p>
          <p>
            <Link
              to={ROUTES.HELP}
              hash={HELP_PAGE_IDS.dividedBy}
              className="flex items-center gap-1 text-sm underline"
            >
              <LinkIcon className="size-3" /> Read more here
            </Link>
          </p>
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
