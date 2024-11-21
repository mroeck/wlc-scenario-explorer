import { getAttributeOptionsOrdered } from "@/lib/utils";
import { type z } from "zod";
import {
  ROUTES,
  CHART_TESTID,
  SORT_OPTIONS,
  DATA_TABS_NAMES,
} from "@/lib/constants";
import { YEAR_KEY } from "@/lib/shared_with_backend/constants";
import type { ScenarioRowsAggregatedArraySchema } from "@/lib/schemas";
import type { Attribute } from "@/lib/types";
import { getRouteApi } from "@tanstack/react-router";
import { useRef } from "react";
import type { StackedAreaChart } from "./StackedAreaChart";
import type { StackedBarChart } from "./StackedBarChart";
import type { LineGraph } from "./LineGraph";
import type { GraphDomain, UnitMinified } from "../types";
import type { BreakdownByOptions } from "./types";

const route = getRouteApi(ROUTES.DASHBOARD);

type SortByValueArgs = {
  keys: BreakdownByOptions[];
  item: Record<string, number>;
  isLineGraph: boolean;
};
function sortByValue({ keys, item, isLineGraph }: SortByValueArgs) {
  return keys.sort((keyA, keyB) => {
    const comparison = item[keyA] - item[keyB];
    return isLineGraph ? comparison : -comparison;
  });
}

type getSortedAttributeOptionsArgs = {
  sort: string;
  dataTab: string;
  breakdownBy: Parameters<typeof getAttributeOptionsOrdered>[0]["breakdownBy"];
  firstItemKeys: Parameters<
    typeof getAttributeOptionsOrdered
  >[0]["defaultOptions"];
  firstItem: Record<string, number>;
};

function getSortedAttributeOptions({
  sort,
  dataTab,
  breakdownBy,
  firstItemKeys,
  firstItem,
}: getSortedAttributeOptionsArgs) {
  const isLineGraph = dataTab === DATA_TABS_NAMES.lineChart;
  if (sort === SORT_OPTIONS.categoriesAlphabetically && !isLineGraph) {
    return getAttributeOptionsOrdered({
      defaultOptions: firstItemKeys,
      breakdownBy,
    });
  }

  return sortByValue({
    keys: firstItemKeys,
    item: firstItem,
    isLineGraph,
  });
}

type CoreProps = {
  unit: UnitMinified;
  breakdownBy: Attribute;
  domain: GraphDomain | undefined;
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  scenarioId?: string;
};

type GraphWrapperProps = CoreProps &
  (
    | {
        dataB?: never;
        Graph: typeof StackedAreaChart | typeof LineGraph;
      }
    | {
        dataB: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
        Graph: typeof StackedBarChart;
      }
  );

export const GraphWrapper = ({
  data,
  dataB,
  unit,
  breakdownBy,
  domain,
  Graph,
  scenarioId,
}: GraphWrapperProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { animation, sort, highlight, dataTab } = route.useSearch({
    select: (search) => ({
      animation: search.animation,
      sort: search.sort,
      highlight: search.highlight,
      dataTab: search.dataTab,
    }),
  });

  const firstItemRaw = data[0] ?? {};
  const firstItem = Object.fromEntries(
    Object.entries(firstItemRaw).filter(([key]) => key !== YEAR_KEY),
  );
  const firstItemKeys = Object.keys(firstItem).sort((keyA, keyB) =>
    keyB.localeCompare(keyA),
  ) as BreakdownByOptions[];

  const attributeOptions = getSortedAttributeOptions({
    sort,
    dataTab,
    breakdownBy,
    firstItemKeys,
    firstItem,
  });

  return (
    <div className="h-full overflow-x-visible">
      <div
        className="h-0 min-h-[500px] w-full sm:min-w-[600px] lg:min-h-full lg:min-w-[unset] lg:flex-1 [&_svg]:overflow-visible"
        data-testid={CHART_TESTID}
      >
        {dataB ? (
          <Graph
            animation={animation}
            attributeOptions={attributeOptions}
            breakdownBy={breakdownBy}
            chartRef={chartRef}
            data={data}
            dataB={dataB}
            unit={unit}
            highlight={highlight}
            domain={domain}
            scenarioId={scenarioId}
          />
        ) : (
          <Graph
            animation={animation}
            attributeOptions={attributeOptions}
            breakdownBy={breakdownBy}
            chartRef={chartRef}
            data={data}
            unit={unit}
            highlight={highlight}
            domain={domain}
            scenarioId={scenarioId}
          />
        )}
      </div>
    </div>
  );
};
