import { createFileRoute } from "@tanstack/react-router";

import { DataViz } from "./-index/components/data-section/DataViz";
import { cn } from "@/lib/utils";
import {
  DASHBOARD_HEADING,
  DEFAULT_ATTRIBUTE,
  DEFAULT_DISPLAY,
  DEFAULT_SCENARIO,
  DEFAULT_INDICATOR,
  ROUTES,
  DEFAULT_UNIT,
  DEFAULT_SETTINGS_TAB,
  DEFAULT_DATA_TAB,
} from "@/lib/constants";
import { z } from "zod";

import {
  AttributeSchema,
  FiltersSchema,
  ScenarioSchema,
  IndicatorSchema,
  UnitSchema,
} from "@/lib/shared_with_backend/schemas";
import { DataTabSchema, DisplaySchema, SettingsTabSchema } from "@/lib/schemas";
import { Settings } from "./-index/components/side-section/Settings";
import { memo } from "react";

const SearchParamsSchema = z.object({
  filters: FiltersSchema.optional(),
  attribute: AttributeSchema.catch(DEFAULT_ATTRIBUTE),
  indicator: IndicatorSchema.catch(DEFAULT_INDICATOR),
  unit: UnitSchema.catch(DEFAULT_UNIT),
  display: DisplaySchema.catch(DEFAULT_DISPLAY),
  scenarioA: ScenarioSchema.catch(DEFAULT_SCENARIO),
  scenarioB: ScenarioSchema.optional().catch(undefined),
  animation: z.boolean().optional().catch(undefined),
  settingsTab: SettingsTabSchema.catch(DEFAULT_SETTINGS_TAB),
  dataTab: DataTabSchema.catch(DEFAULT_DATA_TAB),
});

const Dashboard = memo(function Dashboard() {
  return (
    <main
      className={cn(
        "flex flex-col justify-stretch gap-5 py-primary-y sm:px-primary-x",
        "lg:flex-row",
        "lg:h-[calc(100dvh-72px)]", // = screen height - HEADER_HEIGHT
        "min-h-[700px] lg:max-h-[900px]",
      )}
    >
      <h1 className={cn("sr-only")}>{DASHBOARD_HEADING}</h1>
      <div className={cn("hidden lg:flex")}>
        <Settings />
      </div>
      <DataViz />
    </main>
  );
});

export const Route = createFileRoute(ROUTES.DASHBOARD)({
  component: () => <Dashboard />,
  validateSearch: SearchParamsSchema,
});
