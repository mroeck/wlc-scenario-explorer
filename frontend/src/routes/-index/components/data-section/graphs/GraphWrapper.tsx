import { getAttributeOptionsOrdered } from "@/lib/utils";
import { type z } from "zod";
import { ROUTES, GRAPH_TESTID, SORT_OPTIONS } from "@/lib/constants";
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

type GraphWrapperProps = {
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  unit: UnitMinified;
  breakdownBy: Attribute;
  domain: GraphDomain | undefined;
  Graph: typeof StackedAreaChart | typeof StackedBarChart | typeof LineGraph;
};
export const GraphWrapper = ({
  data,
  unit,
  breakdownBy,
  domain,
  Graph,
}: GraphWrapperProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { animation, sort, highlight } = route.useSearch({
    select: (search) => ({
      animation: search.animation,
      sort: search.sort,
      highlight: search.highlight,
    }),
  });

  const firstItemRaw = data[0] ?? {};
  const firstItem = Object.fromEntries(
    Object.entries(firstItemRaw).filter(([key]) => key !== YEAR_KEY),
  );
  const firstItemKeys = Object.keys(firstItem).sort((keyA, keyB) =>
    keyB.localeCompare(keyA),
  ) as BreakdownByOptions[];

  const attributeOptions =
    sort === SORT_OPTIONS.categoriesAlphabetically
      ? getAttributeOptionsOrdered({
          defaultOptions: firstItemKeys,
          breakdownBy,
        })
      : firstItemKeys.sort((keyA, keyB) => firstItem[keyB] - firstItem[keyA]);

  return (
    <div className="h-full overflow-x-visible">
      <div
        className="h-0 min-h-[500px] w-full sm:min-w-[600px] lg:min-h-full lg:min-w-[unset] lg:flex-1 [&_svg]:overflow-visible"
        data-testid={GRAPH_TESTID}
      >
        <Graph
          animation={animation}
          attributeOptions={attributeOptions}
          breakdownBy={breakdownBy}
          chartRef={chartRef}
          data={data}
          unit={unit}
          highlight={highlight}
          domain={domain}
        />
      </div>
    </div>
  );
};
