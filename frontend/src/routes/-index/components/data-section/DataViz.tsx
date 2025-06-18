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
  ROUTES,
  SCENARIO_A_AND_B,
  SCENARIO_B_ONLY,
  TAB_CONTENT_TESTID,
  GRAPH_TITLE_DIVIDED_BY_TESTID,
  SCENARIO_TO_ACRONYM,
  SCENARIO_B_LABEL,
  DEFAULT_X_AXIS_DOMAIN,
  DEFAULT_SCENARIO_DATA,
  SCENARIO_A_ACRONYM,
  SCENARIO_B_ACRONYM,
} from "@/lib/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchScenarioRowsAggregated } from "@/lib/queries";
import { getRouteApi } from "@tanstack/react-router";
import type { z } from "zod";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorOccurred } from "@/components/ErrorOccurred";
import {
  CUSTOM_SCENARIO,
  DIVIDED_BY_NONE,
  NONE,
  TOTAL_ACTIONS,
  type BREAKDOWN_BY_OPTIONS,
} from "@/lib/shared_with_backend/constants";
import type { ScenarioRowsAggregatedArraySchema } from "@/lib/schemas";
import { NoDataFound } from "@/components/NoDataFound";
import { StackedBarChart } from "./graphs/StackedBarChart";
import { DataTable } from "./DataTable";
import { SettingsDrawer } from "./SettingsDrawer";
import type { Attribute, ScenarioId } from "@/lib/types";
import { LineGraph } from "./graphs/LineGraph";
import { useCallback, useState } from "react";
import { ComparisonSlider } from "./ComparisonSlider";
import { GraphWrapper } from "./graphs/GraphWrapper";
import type { Unit, UnitMinified } from "./types";
import { SCENARIO_QUERY_KEY } from "./constants";
import type { ValueOf } from "type-fest";
import type {
  ScenarioSchema,
  XAxisDomain,
} from "@/lib/shared_with_backend/schemas";
import { Sort } from "./components/Sort";
import { LineGraphIcon } from "@/components/LineGraphIcon";
import { StackedAreaGraphIcon } from "@/components/StackedAreaGraphIcon";
import { TableIcon } from "@/components/TableIcon";
import { StackedBarGraphIcon } from "@/components/StackedBarGraphIcon";
import { env } from "@/env";
import { ShareButton } from "./components/Share";
import PROJECT_LOGO_URL from "@/assets/PROJECT_LOGO.webp";
import { NoDataFoundInline } from "@/components/NoDataFoundInline";
import { WarningTextLayout } from "@/components/WarningTextLayout";

const route = getRouteApi(ROUTES.DASHBOARD);

type Graph =
  | typeof StackedAreaChart
  | typeof LineGraph
  | typeof StackedBarChart;

type ContentProps = {
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  dataB?: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  unit: UnitMinified;
  breakdownBy: Attribute;
  scenarioId?: ScenarioId;
  xAxisDomain: z.infer<typeof XAxisDomain>;
};

type CreateTabArgs = {
  name: string;
  Graph: Graph;
  icon:
    | typeof StackedAreaGraphIcon
    | typeof LineGraphIcon
    | typeof StackedBarGraphIcon
    | typeof TableIcon;
};
const createTab = ({ name, Graph, icon }: CreateTabArgs) => ({
  name,
  content: ({
    data,
    dataB,
    unit,
    breakdownBy,
    scenarioId,
    xAxisDomain,
  }: ContentProps) => (
    <GraphWrapper
      data={data}
      dataB={dataB ?? DEFAULT_SCENARIO_DATA}
      unit={unit}
      breakdownBy={breakdownBy}
      Graph={Graph}
      scenarioId={scenarioId}
      xAxisDomain={xAxisDomain}
    />
  ),
  icon,
});

const tabs = [
  createTab({
    name: DATA_TABS_NAMES.stackedAreaChart,
    Graph: StackedAreaChart,
    icon: StackedAreaGraphIcon,
  }),
  createTab({
    name: DATA_TABS_NAMES.stackedBarChart,
    Graph: StackedBarChart,
    icon: StackedBarGraphIcon,
  }),
  createTab({
    name: DATA_TABS_NAMES.lineChart,
    Graph: LineGraph,
    icon: LineGraphIcon,
  }),
] as const;

type TabName = ValueOf<typeof DATA_TABS_NAMES>;
const defaultTab: TabName = "Stacked Area Graph";

type CreateTitleArgs = {
  unit: Unit;
  breakdownBy: (typeof BREAKDOWN_BY_OPTIONS)[number];
  scenarioA: z.infer<typeof ScenarioSchema>;
  scenarioB?: z.infer<typeof ScenarioSchema> | typeof SCENARIO_B_LABEL;
  activeTab: string;
  display: string;
};

function createTitle({
  unit,
  breakdownBy,
  scenarioA,
  scenarioB = SCENARIO_B_LABEL,
  activeTab,
  display,
}: CreateTitleArgs) {
  const isTable = activeTab === DATA_TABS_NAMES.table;

  type Keys = keyof typeof SCENARIO_TO_ACRONYM;

  const acronymA = SCENARIO_TO_ACRONYM[scenarioA]
    ? ` (${SCENARIO_TO_ACRONYM[scenarioA]})`
    : "";
  // @ts-expect-error: I know the index may not exists
  const acronymB = SCENARIO_TO_ACRONYM[scenarioB]
    ? ` (${SCENARIO_TO_ACRONYM[scenarioB as Keys]})`
    : "";

  const scenarioATitle = `${scenarioA}${acronymA}`;
  const scenarioBTitle = `${scenarioB}${acronymB}`;
  let forScenarios: string = scenarioATitle;

  if (isTable) {
    forScenarios = scenarioATitle;
  } else if (display === SCENARIO_A_AND_B) {
    forScenarios = `${scenarioATitle} VS ${scenarioBTitle}`;
  } else if (display === SCENARIO_B_ONLY) {
    forScenarios = scenarioBTitle;
  }

  return (
    <h2 data-testid={GRAPH_TITLE_TESTID} className="">
      <span
        className="transform-none"
        data-testid={GRAPH_TITLE_DIVIDED_BY_TESTID}
      >
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
    strategy,
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
      strategy: search.strategy,
    }),
  });

  const queryClient = useQueryClient();

  const unit =
    dividedBy === DIVIDED_BY_NONE
      ? indicator
      : (`${indicator} per ${dividedBy}` as const);

  const acronymA = SCENARIO_TO_ACRONYM[scenarioA];
  // @ts-expect-error: not all scenarios have an acronym
  const acronymB = SCENARIO_TO_ACRONYM[scenarioB ?? ""] as string | undefined;

  const acronyms = {
    scenarioA: acronymA ? acronymA : SCENARIO_A_ACRONYM,
    scenarioB: acronymB ? acronymB : SCENARIO_B_ACRONYM,
  };

  const isStrategyComplete =
    !!strategy &&
    strategy.filter((level) => level !== null).length === TOTAL_ACTIONS;
  const isValidCustom = scenarioA === CUSTOM_SCENARIO && isStrategyComplete;
  const strategyForA = isValidCustom ? strategy : undefined;

  const scenarioAforBackend =
    scenarioA === CUSTOM_SCENARIO
      ? isStrategyComplete
        ? CUSTOM_SCENARIO
        : undefined
      : scenarioA;
  const strategyForBackend = isStrategyComplete ? strategyForA : undefined;

  const fetchScenarioData = () =>
    fetchScenarioRowsAggregated({
      breakdownBy,
      filters,
      strategy: strategyForBackend,
      scenarioA: scenarioAforBackend,
      scenarioB,
      indicator,
      dividedBy,
    });

  const commonKeys = { breakdownBy, filters, indicator, dividedBy };

  const queryKey = {
    ...commonKeys,
    strategy: strategyForBackend,
    scenarioA: scenarioAforBackend,
    scenarioB,
  };
  const cachedData = queryClient.getQueryData<
    Awaited<ReturnType<typeof fetchScenarioData>>
  >([
    SCENARIO_QUERY_KEY,
    {
      ...queryKey,
      scenarioA: queryKey.scenarioB,
      scenarioB: queryKey.scenarioA,
    },
  ]);
  const isDataCached = !!cachedData;
  const dataToUse = isDataCached
    ? {
        ...cachedData,
        scenarioA: cachedData.data.scenarioB,
        scenarioB: cachedData.data.scenarioA,
      }
    : undefined;

  const {
    isLoading,
    error,
    data: results,
  } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [SCENARIO_QUERY_KEY, queryKey],
    queryFn: () => (isDataCached ? dataToUse : fetchScenarioData()),
    staleTime: Infinity,
  });

  const resultsA = results?.data.scenarioA;
  const resultsB = results?.data.scenarioB;

  const hasError = !!error;
  const hasSomeData =
    !!resultsA &&
    !!resultsB &&
    (resultsA.data.length > 0 || resultsB.data.length > 0);
  const canRenderContent = !isLoading && !hasError && hasSomeData;
  const hasNoData =
    !!resultsA &&
    !!resultsB &&
    resultsA.data.length === 0 &&
    resultsB.data.length === 0;

  const unitMinified =
    resultsA?.unit !== "" && resultsA?.unit !== undefined
      ? resultsA.unit
      : resultsB?.unit !== undefined
        ? resultsB.unit
        : "";
  const xAxisDomainA = resultsA?.xAxisDomain ?? DEFAULT_X_AXIS_DOMAIN;
  const xAxisDomainB = resultsB?.xAxisDomain ?? DEFAULT_X_AXIS_DOMAIN;
  const xAxisDomain =
    xAxisDomainA.length > xAxisDomainB.length ? xAxisDomainA : xAxisDomainB;

  const DataStatus = () => {
    if (isLoading) return <LoadingSpinner />;
    if (hasError) {
      if (env.PUBLIC_NODE_ENV !== "production") {
        console.error(error);
      }
      return <ErrorOccurred />;
    }
    if (hasNoData) return <NoDataFound />;
    return null;
  };

  const onTabChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    newDataTab: ValueOf<typeof DATA_TABS_NAMES> | (string & {}),
  ) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        filters: {
          ...prev.filters,
          To: prev.filters?.To?.toString(),
          From: prev.filters?.From?.toString(),
        },
        dataTab: newDataTab,
      }),
      replace: true,
    });
  };

  return (
    <Section className="relative min-w-0 flex-1">
      <Tabs
        defaultValue={defaultTab}
        className="flex h-full flex-col"
        value={dataTab}
        onValueChange={onTabChange}
      >
        <div className="flex w-full flex-col items-start gap-4 lg:flex-row">
          <div className="w-full justify-between md:w-auto xl:flex xl:w-full">
            <div>
              <TabsList className="mx-auto flex flex-col md:flex-row">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.name}
                    value={tab.name}
                    className="flex w-full items-center gap-1 md:w-auto"
                  >
                    <div className="flex size-5 items-center justify-center">
                      <tab.icon colorful={dataTab === tab.name} />
                    </div>
                    <span>{tab.name}</span>
                  </TabsTrigger>
                ))}
                <TabsTrigger
                  key="Table"
                  value="Table"
                  className="flex w-full items-center gap-1 md:w-auto"
                >
                  <div className="flex size-5 items-center justify-center">
                    <TableIcon colorful={dataTab === DATA_TABS_NAMES.table} />
                  </div>
                  <span>Table</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="ml-auto mt-1 xl:mt-0 xl:flex">
              <img src={PROJECT_LOGO_URL} className="w-24 border" />
            </div>
          </div>
          <div className="ml-auto lg:hidden">
            <SettingsDrawer />
          </div>
        </div>
        <div className="mt-[5px] flex flex-col justify-between gap-5 pt-8 xl:pt-0 2xl:flex-row">
          <div className="flex flex-1 gap-5">
            <DataVizForm />
          </div>

          <div className="mt-auto flex gap-1">
            <Sort />
            <ShareButton />
            <DownloadMenu
              data={resultsA?.data}
              domTarget={visualizationElement}
            />
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
          {dataTab === DATA_TABS_NAMES.stackedBarChart && <NoDataFoundInline />}
          {dividedBy !== DIVIDED_BY_NONE && (
            <div className="text-center">
              <WarningTextLayout>
                Warning: "divided by" is an experimental feature
              </WarningTextLayout>
            </div>
          )}

          <div className="pb-10"></div>

          {tabs.map((tab) => {
            const isStackedBars = tab.name === DATA_TABS_NAMES.stackedBarChart;

            const Content = () => {
              if (!canRenderContent) return null;

              return isStackedBars ? (
                tab.content({
                  data: resultsA.data,
                  dataB: resultsB.data,
                  unit: unitMinified,
                  breakdownBy,
                  xAxisDomain,
                })
              ) : (
                <ComparisonSlider
                  items={[
                    {
                      label: acronyms.scenarioA,
                      component: tab.content({
                        data: resultsA.data,
                        dataB: [],
                        unit: unitMinified,
                        breakdownBy,
                        scenarioId: "A",
                        xAxisDomain,
                      }),
                    },
                    {
                      label: acronyms.scenarioB,
                      component: tab.content({
                        data: resultsB.data,
                        dataB: [],
                        unit: unitMinified,
                        breakdownBy,
                        scenarioId: "B",
                        xAxisDomain,
                      }),
                    },
                  ]}
                />
              );
            };

            return (
              <TabsContent
                key={tab.name}
                value={tab.name}
                className="relative min-h-0 flex-1"
                data-testid={TAB_CONTENT_TESTID}
              >
                <DataStatus />
                <Content />
              </TabsContent>
            );
          })}
          <TabsContent
            key={DATA_TABS_NAMES.table}
            value={DATA_TABS_NAMES.table}
            className="relative min-h-0 flex-1 basis-full lg:basis-0"
            data-testid={TAB_CONTENT_TESTID}
          >
            <DataStatus />
            {canRenderContent && (
              <DataTable data={resultsA.data} unit={unitMinified} />
            )}
          </TabsContent>
        </div>
      </Tabs>
    </Section>
  );
};
