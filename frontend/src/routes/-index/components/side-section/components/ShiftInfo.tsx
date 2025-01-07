import { HELP_PAGE_IDS, ROUTES } from "../../../../../lib/constants";
import { Link } from "@tanstack/react-router";
import { LinkIcon } from "lucide-react";

export const ShiftInfo = () => {
  return (
    <>
      <p>Shift to alternative low-carbon, renewable, and bio-based solutions</p>
      <Link
        to={ROUTES.HELP}
        hash={HELP_PAGE_IDS.shift}
        className="flex items-center gap-1 underline"
      >
        <LinkIcon className="size-3" /> Read more here
      </Link>
    </>
  );
};
