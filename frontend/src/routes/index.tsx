import { createFileRoute } from "@tanstack/react-router";

import { DataViz } from "./-index/components/data-section/DataViz";
import { cn } from "@/lib/utils";
import {
  DASHBOARD_HEADING,
  DEFAULT_ATTRIBUTE,
  DEFAULT_DISPLAY,
  DEFAULT_SCENARIO,
  DEFAULT_INDICATOR,
  HEADER_HEIGHT,
  ROUTES,
} from "@/lib/constants";
import { z } from "zod";

import {
  AttributeSchema,
  FiltersSchema,
  ScenarioSchema,
  IndicatorSchema,
} from "@/lib/shared_with_backend/schemas";
import { DisplaySchema } from "@/lib/schemas";
import { Settings } from "./-index/components/side-section/Settings";
import { useQuery } from "@tanstack/react-query";
import { fetchFilters } from "@/lib/queries";
import { useEffect, useState } from "react";

const SearchParamsSchema = z.object({
  filters: FiltersSchema.optional(),
  attribute: AttributeSchema.catch(DEFAULT_ATTRIBUTE),
  unit: IndicatorSchema.catch(DEFAULT_INDICATOR),
  display: DisplaySchema.catch(DEFAULT_DISPLAY),
  scenarioA: ScenarioSchema.catch(DEFAULT_SCENARIO),
  scenarioB: ScenarioSchema.optional().catch(undefined),
});

export const Route = createFileRoute(ROUTES.DASHBOARD)({
  component: () => <Dashboard />,
  validateSearch: SearchParamsSchema,
});

function Dashboard() {
  const [enabled, setEnabled] = useState(true);
  // this prevent the user from seeing a loading spinner when opening the filters tab
  useQuery({
    queryKey: ["filters"],
    queryFn: () => fetchFilters(),
    staleTime: Infinity,
    enabled,
  });

  useEffect(() => {
    setEnabled(false);
  }, []);

  return (
    <main
      className={cn(
        "flex flex-col justify-stretch gap-5 py-primary-y sm:px-primary-x",
        "lg:flex-row",
        "h-[calc(100dvh-72px)]",
      )}
      style={{
        minHeight: `calc(100dvh - ${HEADER_HEIGHT}px)`,
      }}
    >
      <h1 className={cn("sr-only")}>{DASHBOARD_HEADING}</h1>
      <div className={cn("hidden lg:flex")}>
        <Settings />
      </div>
      <DataViz />
    </main>
  );
}
