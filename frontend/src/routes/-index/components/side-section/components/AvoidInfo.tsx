import { HELP_PAGE_IDS, ROUTES } from "@/lib/constants";
import { Link } from "@tanstack/react-router";
import { LinkIcon } from "lucide-react";

export const AvoidInfo = () => {
  return (
    <>
      <p>
        Avoid (A) material and energy demand, e.g., via circularity or
        sufficiency measures
      </p>
      <Link
        to={ROUTES.HELP}
        hash={HELP_PAGE_IDS.avoid}
        className="flex items-center gap-1 underline"
      >
        <LinkIcon className="size-3" /> Read more here
      </Link>
    </>
  );
};
