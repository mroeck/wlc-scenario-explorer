import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { DataViz } from "./-index/components/data-section/DataViz";
import { cn } from "@/lib/utils";
import { DASHBOARD_HEADING, ROUTES } from "@/lib/constants";

import { SearchParamsSchema } from "@/lib/schemas";
import { Settings } from "./-index/components/side-section/Settings";
import { memo, useRef, type MouseEvent } from "react";

const route = getRouteApi(ROUTES.DASHBOARD);

const BLACKLIST_TAGS = ["HTML", "BUTTON", "INPUT", "CIRCLE", "PATH", "G"];

const Dashboard = memo(function Dashboard() {
  const navigate = route.useNavigate();
  const mainRef = useRef<HTMLDivElement>(null);

  type HandleClick = {
    event: MouseEvent<HTMLElement>;
    lastElement: HTMLElement | null;
  };
  const handleClickOutside = ({ event, lastElement }: HandleClick) => {
    let currentElement = event.target as HTMLElement | null;
    let hasClickHandler = false;

    while (currentElement && lastElement) {
      if (currentElement === lastElement) {
        currentElement = currentElement.parentElement;
        break;
      }

      if (
        typeof currentElement.onclick === "function" ||
        BLACKLIST_TAGS.includes(currentElement.tagName.toUpperCase())
      ) {
        hasClickHandler = true;
        break;
      }

      currentElement = currentElement.parentElement;
    }

    if (!hasClickHandler) {
      void navigate({
        search: (prev) => ({
          ...prev,
          filters: {
            ...prev.filters,
            To: prev.filters?.To?.toString(),
            From: prev.filters?.From?.toString(),
          },
          highlights: undefined,
        }),
        replace: true,
      });
    }
  };

  return (
    <main
      ref={mainRef}
      className={cn(
        "flex flex-col justify-stretch gap-5 py-primary-y sm:px-primary-x",
        "lg:flex-row",
        "lg:h-[calc(100dvh-72px)]", // = screen height - HEADER_HEIGHT
        "min-h-[700px] lg:max-h-[900px]",
      )}
      onClick={(event) => {
        handleClickOutside({
          event,
          lastElement: mainRef.current,
        });
      }}
    >
      <h1 className="sr-only">{DASHBOARD_HEADING}</h1>
      <aside className="hidden lg:flex">
        <Settings />
      </aside>
      <DataViz />
    </main>
  );
});

export const Route = createFileRoute(ROUTES.DASHBOARD)({
  component: () => <Dashboard />,
  validateSearch: SearchParamsSchema,
});
