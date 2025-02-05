import { getAttributeOptionsOrdered } from "@/lib/utils";
import { type z } from "zod";
import {
  ROUTES,
  CHART_TESTID,
  SORT_OPTIONS,
  DATA_TABS_NAMES,
  SCENARIO_A_AND_B,
  SCENARIO_A_ONLY,
} from "@/lib/constants";
import { YEAR_KEY } from "@/lib/shared_with_backend/constants";
import type { ScenarioRowsAggregatedArraySchema } from "@/lib/schemas";
import type { Attribute, ScenarioId } from "@/lib/types";
import { getRouteApi } from "@tanstack/react-router";
import { useRef } from "react";
import type { StackedAreaChart } from "./StackedAreaChart";
import type { StackedBarChart } from "./StackedBarChart";
import type { LineGraph } from "./LineGraph";
import type { UnitMinified } from "../types";
import type { BreakdownByOptions } from "./types";
import { NoDataFound } from "@/components/NoDataFound";
import type { XAxisDomain } from "@/lib/shared_with_backend/schemas";

const route = getRouteApi(ROUTES.DASHBOARD);

type SortByValueArgs = {
  keys: BreakdownByOptions[];
  item: Record<string, number>;
  isLineGraph: boolean;
};
function sortByValue({ keys, item, isLineGraph }: SortByValueArgs) {
  return keys.sort((keyA, keyB) => {
    const itemA = item[keyA] as Exclude<(typeof item)[typeof keyA], undefined>;
    const itemB = item[keyB] as Exclude<(typeof item)[typeof keyB], undefined>;
    const comparison = itemA - itemB;
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
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  scenarioId?: ScenarioId;
  sliderValues?: number[];
  xAxisDomain: z.infer<typeof XAxisDomain>;
};

type GraphWrapperProps = CoreProps &
  (
    | {
        dataB: never;
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
  Graph,
  scenarioId,
  sliderValues,
  xAxisDomain,
}: GraphWrapperProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { animation, sort, highlights, dataTab, display } = route.useSearch({
    select: (search) => ({
      animation: search.animation,
      sort: search.sort,
      highlights: search.highlights,
      dataTab: search.dataTab,
      scenarioA: search.scenarioA,
      scenarioB: search.scenarioB,
      display: search.display,
    }),
  });

  const DEFAULT_FIRST_ITEM_RAW: Record<string, number> = {};
  type FirstItemRaw =
    | {
        stock_projection_year: number;
        [key: string]: number;
      }
    | typeof DEFAULT_FIRST_ITEM_RAW;

  const firstItemRaw: FirstItemRaw =
    data[0] ?? dataB[0] ?? DEFAULT_FIRST_ITEM_RAW;

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

  const isStackedBarChart =
    (Graph.name as "StackedBarChart" | "StackedAreaChart" | "LineGraph") ===
    "StackedBarChart";
  const dataAisEmpty = data.length === 0;
  const dataBisEmpty = dataB.length === 0;
  const isAvsB = display === SCENARIO_A_AND_B;
  const isAonly = display === SCENARIO_A_ONLY;
  const showNoDataForStackedBar = isAvsB
    ? dataAisEmpty && dataBisEmpty
    : isAonly
      ? dataAisEmpty
      : dataBisEmpty;

  return (
    <div className="h-full overflow-x-visible">
      <div
        className="h-0 min-h-[500px] w-full sm:min-w-[600px] lg:min-h-full lg:min-w-[unset] lg:flex-1 [&_svg]:overflow-visible"
        data-testid={CHART_TESTID}
      >
        <Graph
          animation={animation}
          attributeOptions={attributeOptions}
          breakdownBy={breakdownBy}
          chartRef={chartRef}
          data={data}
          dataB={dataB}
          unit={unit}
          highlights={highlights}
          scenarioId={scenarioId}
          xAxisDomain={xAxisDomain}
        />

        {!isStackedBarChart && dataAisEmpty && (
          <div
            className="absolute left-16 top-0 h-full"
            style={{ width: `calc(100% * ${sliderValues?.[0] ?? 1} - 4rem)` }}
          >
            <NoDataFound scenarioId={scenarioId} />{" "}
          </div>
        )}
        {isStackedBarChart && showNoDataForStackedBar && (
          <div
            className="absolute left-16 top-0 h-full"
            style={{ width: `calc(100% * ${sliderValues?.[0] ?? 1} - 4rem)` }}
          >
            <NoDataFound scenarioId={scenarioId} />{" "}
          </div>
        )}
      </div>
    </div>
  );
};
