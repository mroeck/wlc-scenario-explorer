import { Section } from "@/components/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StackedAreaChart } from "./graphs/StackedAreaChart";
import { cn } from "@/lib/utils";
import { DataVizForm } from "./DataVizForm";
import { DownloadMenu } from "./DownloadMenu";
import {
  ATTRIBUTE_TESTID,
  FOR_SCENARIOS_TESTID,
  GRAPH_TITLE_TESTID,
  INDICATOR_TO_UNIT,
  ROUTES,
  SCENARIO_A_ONLY,
  SCENARIO_B_ONLY,
  UNIT_TESTID,
} from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { fetchScenarioRowsAggregated } from "@/lib/queries";
import { getRouteApi } from "@tanstack/react-router";
import type { z } from "zod";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorOccurred } from "@/components/ErrorOccurred";
import type {
  ATTRIBUTES,
  INDICATORS,
} from "@/lib/shared_with_backend/constants";
import type { ScenarioRowsAggregatedArraySchema } from "@/lib/schemas";
import { NoDataFound } from "@/components/NoDataFound";
import { StackedBarChart } from "./graphs/StackedBarChart";
import { DataTable } from "./DataTable";
import { SettingsDrawer } from "./SettingsDrawer";
import type { Attribute, Indicator } from "@/lib/types";
import { LineGraph } from "./graphs/LineChart";

const route = getRouteApi(ROUTES.DASHBOARD);

type ContentProps = {
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  indicator: Indicator;
  breakdownBy: Attribute;
};
const tabs = [
  {
    name: "Stacked Area Chart",
    content: ({ data, indicator, breakdownBy }: ContentProps) => (
      <StackedAreaChart
        data={data}
        unit={INDICATOR_TO_UNIT[indicator]}
        breakdownBy={breakdownBy}
      />
    ),
  },
  {
    name: "Line Chart",
    content: ({ data, indicator, breakdownBy }: ContentProps) => (
      <LineGraph
        data={data}
        unit={INDICATOR_TO_UNIT[indicator]}
        breakdownBy={breakdownBy}
      />
    ),
  },
  {
    name: "Stacked Bar Chart",
    content: ({ data, indicator, breakdownBy }: ContentProps) => (
      <StackedBarChart
        data={data}
        unit={INDICATOR_TO_UNIT[indicator]}
        breakdownBy={breakdownBy}
      />
    ),
  },
  {
    name: "Table",
    content: ({ data, indicator }: ContentProps) => (
      <DataTable data={data} unit={INDICATOR_TO_UNIT[indicator]} />
    ),
  },
] as const;

type TabName = (typeof tabs)[number]["name"];
const defaultTab: TabName = "Stacked Area Chart";

type CreateTitleArgs = {
  unit: (typeof INDICATORS)[number];
  attribute: (typeof ATTRIBUTES)[number];
  scenarioA?: string;
  scenarioB?: string;
};
function createTitle({
  unit,
  attribute,
  scenarioA,
  scenarioB,
}: CreateTitleArgs) {
  const forScenarios =
    scenarioA && scenarioB
      ? `${scenarioA} VS ${scenarioB}`
      : scenarioA
        ? scenarioA
        : scenarioB ?? "scenario B";

  return (
    <h2 data-testid={GRAPH_TITLE_TESTID} className={cn("text-primary")}>
      <span className={cn("capitalize")} data-testid={UNIT_TESTID}>
        {unit}
      </span>{" "}
      by{" "}
      <span className={cn("capitalize")} data-testid={ATTRIBUTE_TESTID}>
        {attribute}
      </span>{" "}
      for{" "}
      <span className={cn("capitalize")} data-testid={FOR_SCENARIOS_TESTID}>
        {forScenarios}
      </span>
    </h2>
  );
}

export const DataViz = () => {
  const {
    attribute,
    display,
    unit: indicator,
    filters,
    scenarioA,
    scenarioB,
  } = route.useSearch();
  const scenarioAForTitle = display !== SCENARIO_B_ONLY ? scenarioA : undefined;
  const scenarioBForTitle = display !== SCENARIO_A_ONLY ? scenarioB : undefined;

  const {
    isLoading: isLoadingA,
    error: errorA,
    data: dataA,
  } = useQuery({
    queryKey: [
      "scenarioRowsAggregated",
      { attribute, filters, scenario: scenarioA, unit: indicator },
    ],
    queryFn: () =>
      fetchScenarioRowsAggregated({
        attribute,
        filters,
        scenario: scenarioA,
        unit: indicator,
      }),
    staleTime: Infinity,
  });

  /*
  WILL BE USED WHEN TWO SCENARIOS FEATURES WILL BE REQUIRED
  const {
    isLoading: isLoadingB,
    error: errorB,
    data: dataB,
  } = useQuery({
    queryKey: [
      "scenarioRowsAggregated",
      { attribute, filters, scenario: scenarioB, unit },
    ],
    queryFn: () =>
      fetchScenarioRowsAggregated({
        attribute,
        filters,
        scenario: scenarioB ?? DEFAULT_SCENARIO,
        unit,
      }),
    staleTime: Infinity,
    enabled: scenarioB !== undefined,
  });

  */

  return (
    <Section className={cn("min-w-0 flex-1")}>
      <Tabs defaultValue={defaultTab} className={cn("flex h-full flex-col")}>
        <div
          className={cn(
            "flex flex-col items-start justify-between gap-2 md:flex-row",
          )}
        >
          <div className={cn("w-full md:w-auto")}>
            <TabsList
              className={cn("mx-auto flex flex-col md:flex-row lg:flex-row")}
            >
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.name}
                  value={tab.name}
                  className={cn("w-full md:w-auto")}
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className={cn("lg:hidden")}>
            <SettingsDrawer />
          </div>
        </div>
        <div
          className={cn("flex flex-col justify-between gap-5 pt-8 md:flex-row")}
        >
          <div className={cn("flex flex-1 gap-5")}>
            <DataVizForm />
          </div>
          <div className={cn("mt-auto")}>
            <DownloadMenu />
          </div>
        </div>
        <div className={cn("pb-5 pt-12 text-center text-base font-semibold")}>
          {createTitle({
            attribute,
            scenarioA: scenarioAForTitle,
            scenarioB: scenarioBForTitle,
            unit: indicator,
          })}
        </div>

        {tabs.map((tab) => (
          <TabsContent
            key={tab.name}
            value={tab.name}
            className={cn("relative min-h-0 flex-1")}
          >
            {!isLoadingA && errorA && <ErrorOccurred />}
            {errorA == null && dataA?.length === 0 && <NoDataFound />}
            {errorA == null &&
              dataA &&
              dataA.length > 0 &&
              tab.content({ data: dataA, indicator, breakdownBy: attribute })}
            {isLoadingA && <LoadingSpinner />}
          </TabsContent>
        ))}
      </Tabs>
    </Section>
  );
};
