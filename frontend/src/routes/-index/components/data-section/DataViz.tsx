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
import type { Attribute, Indicator, Scenario } from "@/lib/types";
import { LineGraph } from "./graphs/LineGraph";
import { useRef } from "react";
import { ComparisonSlider } from "./ComparisonSlider";
import { SettingsButton } from "@/components/settings-button";
import { GraphWrapper } from "./graphs/GraphWrapper";

const route = getRouteApi(ROUTES.DASHBOARD);

type ContentProps = {
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  indicator: Indicator;
  breakdownBy: Attribute;
};
const tabs = [
  {
    name: DATA_TABS_NAMES.stackedAreaChart,
    content: ({ data, indicator, breakdownBy }: ContentProps) => (
      <GraphWrapper
        data={data}
        unit={INDICATOR_TO_UNIT[indicator]}
        breakdownBy={breakdownBy}
        Graph={StackedAreaChart}
      />
    ),
  },
  {
    name: DATA_TABS_NAMES.lineChart,
    content: ({ data, indicator, breakdownBy }: ContentProps) => (
      <GraphWrapper
        data={data}
        unit={INDICATOR_TO_UNIT[indicator]}
        breakdownBy={breakdownBy}
        Graph={LineGraph}
      />
    ),
  },
  {
    name: DATA_TABS_NAMES.stackedBarChart,
    content: ({ data, indicator, breakdownBy }: ContentProps) => (
      <GraphWrapper
        data={data}
        unit={INDICATOR_TO_UNIT[indicator]}
        breakdownBy={breakdownBy}
        Graph={StackedBarChart}
      />
    ),
  },
] as const;

type TabName = (typeof tabs)[number]["name"];
const defaultTab: TabName = "Stacked Area Chart";

type CreateTitleArgs = {
  unit: (typeof INDICATORS)[number];
  attribute: (typeof ATTRIBUTES)[number];
  scenarioA: string;
  scenarioB?: string;
  activeTab: string;
  display: string;
};

function createTitle({
  unit,
  attribute,
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
      <span className="capitalize" data-testid={UNIT_TESTID}>
        {unit}
      </span>{" "}
      {attribute !== NONE && (
        <>
          <span>by</span>{" "}
          <span className="capitalize" data-testid={ATTRIBUTE_TESTID}>
            {attribute}
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
  const visualizationRef = useRef<HTMLDivElement>(null);
  const {
    attribute,
    display,
    indicator,
    filters,
    scenarioA,
    scenarioB,
    dataTab,
    sort,
  } = route.useSearch({
    select: (search) => ({
      attribute: search.attribute,
      display: search.display,
      indicator: search.indicator,
      filters: search.filters,
      scenarioA: search.scenarioA,
      scenarioB: search.scenarioB,
      dataTab: search.dataTab,
      sort: search.sort,
    }),
  });

  const fetchScenarioData = (scenario: Scenario | undefined) =>
    fetchScenarioRowsAggregated({
      attribute,
      filters,
      scenario,
      unit: indicator,
      sort,
    });

  const {
    isLoading: isLoadingA,
    error: errorA,
    data: dataA,
  } = useQuery({
    queryKey: [
      "scenarioRowsAggregated",
      { attribute, filters, scenario: scenarioA, unit: indicator, sort },
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
      { attribute, filters, scenario: scenarioB, unit: indicator, sort },
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

  const DataStatus = () => (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && hasError && <ErrorOccurred />}
      {!isLoading && !hasError && hasNoData && <NoDataFound />}
    </>
  );

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
        <div className="flex flex-col items-start justify-between gap-2 md:flex-row">
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
          <div className="lg:hidden">
            <SettingsDrawer />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-5 pt-8 md:flex-row">
          <div className="flex flex-1 gap-5">
            <DataVizForm />
          </div>

          {dataA && visualizationRef.current && (
            <div className="mt-auto flex gap-1">
              <DownloadMenu data={dataA} domTarget={visualizationRef.current} />
              <SettingsButton />
            </div>
          )}
        </div>
        <div className="pt-12"></div>
        <div ref={visualizationRef} className="flex flex-1 flex-col bg-white">
          <div className="text-center text-base font-semibold">
            {createTitle({
              attribute,
              scenarioA,
              scenarioB,
              unit: indicator,
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
                      label: "Scenario A",
                      component: tab.content({
                        data: dataA,
                        indicator,
                        breakdownBy: attribute,
                      }),
                    },
                    {
                      label: "Scenario B",
                      component: tab.content({
                        data: dataB,
                        indicator,
                        breakdownBy: attribute,
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
            className="relative min-h-0 flex-1"
            data-testid={TAB_CONTENT_TESTID}
          >
            <DataStatus />
            {canRenderContent && (
              <DataTable
                data={dataA}
                indicator={INDICATOR_TO_UNIT[indicator]}
              />
            )}
          </TabsContent>
        </div>
      </Tabs>
    </Section>
  );
};
