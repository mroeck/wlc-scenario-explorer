import { HELP_PAGE_IDS, ROUTES } from "../../../../../lib/constants";
import { Link } from "@tanstack/react-router";
import { LinkIcon } from "lucide-react";

export const ImproveInfo = () => {
  return (
    <>
      <p>
        Improve (I) supply-side processes for conventional materials and energy
        sources
      </p>
      <Link
        to={ROUTES.HELP}
        hash={HELP_PAGE_IDS.improve}
        className="flex items-center gap-1 underline"
      >
        <LinkIcon className="size-3" /> Read more here
      </Link>
    </>
  );
};
