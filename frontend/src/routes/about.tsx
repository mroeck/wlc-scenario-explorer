import { ABOUT_HEADING } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: () => (
    <div>
      <h1 className={cn("sr-only")}>{ABOUT_HEADING}</h1>
      <div>Hello /about!</div>
    </div>
  ),
});
