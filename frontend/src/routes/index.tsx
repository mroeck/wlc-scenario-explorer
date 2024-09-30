import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { DataViz } from "./-index/components/data-section/DataViz";
import { cn } from "@/lib/utils";
import {
  DASHBOARD_HEADING,
  DEFAULT_BREAKDOWN_BY,
  DEFAULT_DISPLAY,
  DEFAULT_SCENARIO,
  DEFAULT_INDICATOR,
  ROUTES,
  DEFAULT_DIVIDED_BY,
  DEFAULT_SETTINGS_TAB,
  DEFAULT_DATA_TAB,
  DEFAULT_SORT,
} from "@/lib/constants";
import { z } from "zod";

import {
  BreakdownBySchema,
  FiltersSchema,
  ScenarioSchema,
  IndicatorSchema,
  DividedBySchema,
} from "@/lib/shared_with_backend/schemas";
import {
  AnimationSchema,
  DataTabSchema,
  DisplaySchema,
  HighlightSchema,
  SettingsTabSchema,
  SortSchema,
} from "@/lib/schemas";
import { Settings } from "./-index/components/side-section/Settings";
import { memo, useRef, type MouseEvent } from "react";

const SearchParamsSchema = z.object({
  filters: FiltersSchema.optional(),
  breakdownBy: BreakdownBySchema.catch(DEFAULT_BREAKDOWN_BY),
  indicator: IndicatorSchema.catch(DEFAULT_INDICATOR),
  dividedBy: DividedBySchema.catch(DEFAULT_DIVIDED_BY),
  display: DisplaySchema.catch(DEFAULT_DISPLAY),
  sort: SortSchema.catch(DEFAULT_SORT),
  scenarioA: ScenarioSchema.catch(DEFAULT_SCENARIO),
  scenarioB: ScenarioSchema.optional().catch(undefined),
  animation: AnimationSchema.optional().catch(undefined),
  settingsTab: SettingsTabSchema.catch(DEFAULT_SETTINGS_TAB),
  dataTab: DataTabSchema.catch(DEFAULT_DATA_TAB),
  highlight: HighlightSchema.optional().catch(undefined),
});
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
          highlight: undefined,
        }),
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

export default Dashboard;

export const Route = createFileRoute(ROUTES.DASHBOARD)({
  component: () => <Dashboard />,
  validateSearch: SearchParamsSchema,
});
