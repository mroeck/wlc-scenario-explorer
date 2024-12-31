import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { DEFAULT_DASHBOARD_SEARCH, ROUTES } from "@/lib/constants";

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-background pt-[20dvh]">
      <h1 className="mb-4 text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mb-8 text-xl text-muted-foreground">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link to={ROUTES.DASHBOARD} search={DEFAULT_DASHBOARD_SEARCH}>
          Return Home
        </Link>
      </Button>
    </div>
  );
};
