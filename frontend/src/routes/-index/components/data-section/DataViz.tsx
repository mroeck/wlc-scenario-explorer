import { Section } from "@/components/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StackedAreaChart } from "./graphs/StackedAreaChart";
import { DataVizForm } from "./DataVizForm";
import { DownloadMenu } from "./DownloadMenu";
import {
  ATTRIBUTE_TESTID,
  DATA_TABS_NAMES,
  FOR_SCENARIOS_TESTID,
  GRAPH_TITLE_TESTID,
  INDICATOR_TO_UNIT,
  NONE,
  ROUTES,
  SCENARIO_A_AND_B,
  SCENARIO_B_ONLY,
  TAB_CONTENT_TESTID,
  DIVIDED_BY_TESTID,
  DIVIDED_BY_NONE,
  DIVIDED_BY_TO_MINIFIED_UNIT,
  SCENARIO_TO_ACRONYM,
  SCENARIO_A_LABEL,
  SCENARIO_B_LABEL,
} from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { fetchScenarioRowsAggregated } from "@/lib/queries";
import { getRouteApi } from "@tanstack/react-router";
import type { z } from "zod";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorOccurred } from "@/components/ErrorOccurred";
import { type ATTRIBUTES } from "@/lib/shared_with_backend/constants";
import type { ScenarioRowsAggregatedArraySchema } from "@/lib/schemas";
import { NoDataFound } from "@/components/NoDataFound";
import { StackedBarChart } from "./graphs/StackedBarChart";
import { DataTable } from "./DataTable";
import { SettingsDrawer } from "./SettingsDrawer";
import type { Attribute, Scenario } from "@/lib/types";
import { LineGraph } from "./graphs/LineGraph";
import { useCallback, useState } from "react";
import { ComparisonSlider } from "./ComparisonSlider";
import { SettingsButton } from "@/components/settings-button";
import { GraphWrapper } from "./graphs/GraphWrapper";
import type { Unit, UnitMinified } from "./types";

const route = getRouteApi(ROUTES.DASHBOARD);

type Graph =
  | typeof StackedAreaChart
  | typeof LineGraph
  | typeof StackedBarChart;

type ContentProps = {
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  unit: UnitMinified;
  breakdownBy: Attribute;
};

const createTab = (name: string, Graph: Graph) => ({
  name,
  content: ({ data, unit, breakdownBy }: ContentProps) => (
    <GraphWrapper
      data={data}
      unit={unit}
      breakdownBy={breakdownBy}
      Graph={Graph}
    />
  ),
});

const tabs = [
  createTab(DATA_TABS_NAMES.stackedAreaChart, StackedAreaChart),
  createTab(DATA_TABS_NAMES.lineChart, LineGraph),
  createTab(DATA_TABS_NAMES.stackedBarChart, StackedBarChart),
] as const;

type TabName = (typeof tabs)[number]["name"];
const defaultTab: TabName = "Stacked Area Chart";

type CreateTitleArgs = {
  unit: Unit;
  breakdownBy: (typeof ATTRIBUTES)[number];
  scenarioA: string;
  scenarioB?: string;
  activeTab: string;
  display: string;
};

function createTitle({
  unit,
  breakdownBy,
  scenarioA,
  scenarioB = "scenario B",
  activeTab,
  display,
}: CreateTitleArgs) {
  const isTable = activeTab === DATA_TABS_NAMES.table;

  let forScenarios = scenarioA;

  if (isTable) {
    forScenarios = scenarioA;
  } else if (display === SCENARIO_A_AND_B) {
    forScenarios = `${scenarioA} VS ${scenarioB}`;
  } else if (display === SCENARIO_B_ONLY) {
    forScenarios = scenarioB;
  }

  return (
    <h2 data-testid={GRAPH_TITLE_TESTID} className="text-primary">
      <span className="transform-none" data-testid={DIVIDED_BY_TESTID}>
        {unit}
      </span>{" "}
      {breakdownBy !== NONE && (
        <>
          <span>by</span>{" "}
          <span className="capitalize" data-testid={ATTRIBUTE_TESTID}>
            {breakdownBy}
          </span>{" "}
        </>
      )}
      for{" "}
      <span className="capitalize" data-testid={FOR_SCENARIOS_TESTID}>
        {forScenarios}
      </span>
    </h2>
  );
}

export const DataViz = () => {
  const navigate = route.useNavigate();
  const [visualizationElement, setVisualizationElement] =
    useState<HTMLDivElement | null>(null);

  const visualizationRef = useCallback((node: HTMLDivElement) => {
    setVisualizationElement(node);
  }, []);

  const {
    breakdownBy,
    display,
    indicator,
    dividedBy,
    filters,
    scenarioA,
    scenarioB,
    dataTab,
  } = route.useSearch({
    select: (search) => ({
      breakdownBy: search.breakdownBy,
      display: search.display,
      indicator: search.indicator,
      dividedBy: search.dividedBy,
      filters: search.filters,
      scenarioA: search.scenarioA,
      scenarioB: search.scenarioB,
      dataTab: search.dataTab,
    }),
  });
  const unit =
    dividedBy === DIVIDED_BY_NONE
      ? indicator
      : (`${indicator} per ${dividedBy}` as const);

  const indicatorMinified = INDICATOR_TO_UNIT[indicator];

  const unitMinified =
    dividedBy === DIVIDED_BY_NONE
      ? indicatorMinified
      : (`${indicatorMinified}/${DIVIDED_BY_TO_MINIFIED_UNIT[dividedBy]}` as const);

  // @ts-expect-error: not all scenarios have an acronym
  const acronymA = SCENARIO_TO_ACRONYM[scenarioA] as string | undefined;
  // @ts-expect-error: not all scenarios have an acronym
  const acronymB = SCENARIO_TO_ACRONYM[scenarioB ?? ""] as string | undefined;

  const acronyms = {
    scenarioA: acronymA ? acronymA : SCENARIO_A_LABEL,
    scenarioB: acronymB ? acronymB : SCENARIO_B_LABEL,
  };

  const fetchScenarioData = (scenario: Scenario | undefined) =>
    fetchScenarioRowsAggregated({
      breakdownBy,
      filters,
      scenario,
      indicator,
      dividedBy,
    });

  const commonKeys = { breakdownBy, filters, indicator, dividedBy };
  const {
    isLoading: isLoadingA,
    error: errorA,
    data: dataA,
  } = useQuery({
    queryKey: [
      "scenarioRowsAggregated",
      { ...commonKeys, scenario: scenarioA },
    ],
    queryFn: () => fetchScenarioData(scenarioA),
    staleTime: Infinity,
  });

  const {
    isLoading: isLoadingB,
    error: errorB,
    data: dataB,
  } = useQuery({
    queryKey: [
      "scenarioRowsAggregated",
      { ...commonKeys, scenario: scenarioB },
    ],
    queryFn: () => fetchScenarioData(scenarioB),
    staleTime: Infinity,
  });

  const hasError = !!errorA || !!errorB;
  const isLoading = isLoadingA || isLoadingB;
  const hasSomeData =
    !!dataA && !!dataB && (dataA.length > 0 || dataB.length > 0);
  const canRenderContent = !isLoading && !hasError && hasSomeData;
  const hasNoData = dataA?.length === 0 && dataB?.length === 0;

  const DataStatus = () => {
    if (isLoading) return <LoadingSpinner />;
    if (hasError) return <ErrorOccurred />;
    if (hasNoData) return <NoDataFound />;
    return null;
  };

  const onTabChange = (newDataTab: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        dataTab: newDataTab,
      }),
    });
  };

  return (
    <Section className="min-w-0 flex-1">
      <Tabs
        defaultValue={defaultTab}
        className="flex h-full flex-col"
        value={dataTab}
        onValueChange={onTabChange}
      >
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row">
          <div className="w-full md:w-auto">
            <TabsList className="mx-auto flex flex-col md:flex-row lg:flex-row">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.name}
                  value={tab.name}
                  className="w-full md:w-auto"
                >
                  {tab.name}
                </TabsTrigger>
              ))}
              <TabsTrigger
                key="Table"
                value="Table"
                className="w-full md:w-auto"
              >
                Table
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="ml-auto lg:hidden">
            <SettingsDrawer />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-5 pt-8 md:flex-row">
          <div className="flex flex-1 gap-5">
            <DataVizForm />
          </div>

          <div className="mt-auto flex gap-1">
            <DownloadMenu data={dataA} domTarget={visualizationElement} />
            <SettingsButton />
          </div>
        </div>
        <div className="pt-12"></div>
        <div ref={visualizationRef} className="flex flex-1 flex-col bg-white">
          <div className="text-center text-base font-semibold">
            {createTitle({
              breakdownBy,
              scenarioA,
              scenarioB,
              unit,
              activeTab: dataTab,
              display,
            })}
          </div>
          <div className="pb-10"></div>

          {tabs.map((tab) => (
            <TabsContent
              key={tab.name}
              value={tab.name}
              className="relative min-h-0 flex-1"
              data-testid={TAB_CONTENT_TESTID}
            >
              <DataStatus />
              {canRenderContent && (
                <ComparisonSlider
                  items={[
                    {
                      label: acronyms.scenarioA,
                      component: tab.content({
                        data: dataA,
                        unit: unitMinified,
                        breakdownBy,
                      }),
                    },
                    {
                      label: acronyms.scenarioB,
                      component: tab.content({
                        data: dataB,
                        unit: unitMinified,
                        breakdownBy,
                      }),
                    },
                  ]}
                />
              )}
            </TabsContent>
          ))}
          <TabsContent
            key={DATA_TABS_NAMES.table}
            value={DATA_TABS_NAMES.table}
            className="relative min-h-0 flex-1 basis-full lg:basis-0"
            data-testid={TAB_CONTENT_TESTID}
          >
            <DataStatus />
            {canRenderContent && <DataTable data={dataA} unit={unitMinified} />}
          </TabsContent>
        </div>
      </Tabs>
    </Section>
  );
};
