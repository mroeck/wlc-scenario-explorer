import { getAttributeOptionsOrdered } from "@/lib/utils";
import { type z } from "zod";
import { ROUTES, GRAPH_TESTID } from "@/lib/constants";
import { YEAR_KEY } from "@/lib/shared_with_backend/constants";
import type { ScenarioRowsAggregatedArraySchema } from "@/lib/schemas";
import type { Attribute, IndicatorUnit } from "@/lib/types";
import { getRouteApi } from "@tanstack/react-router";
import { useRef } from "react";
import type { StackedAreaChart } from "./StackedAreaChart";

const route = getRouteApi(ROUTES.DASHBOARD);

type GraphWrapperProps = {
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  unit: IndicatorUnit;
  breakdownBy: Attribute;
  Graph: typeof StackedAreaChart;
};
export const GraphWrapper = ({
  data,
  unit: unit,
  breakdownBy,
  Graph,
}: GraphWrapperProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { animation, display } = route.useSearch({
    select: (search) => ({
      animation: search.animation,
      display: search.display,
    }),
  });

  const attributeOptions =
    data.length > 0
      ? getAttributeOptionsOrdered({
          defaultOptions: Object.keys(data[0]).filter(
            (key) => key !== YEAR_KEY,
          ),
          breakdownBy,
        })
      : [];

  return (
    <div className="h-full overflow-x-scroll lg:overflow-x-visible">
      <div
        className="h-0 min-h-[500px] min-w-[600px] lg:min-h-full lg:min-w-[unset] lg:flex-1 [&_svg]:overflow-visible"
        data-testid={GRAPH_TESTID}
      >
        <Graph
          animation={animation}
          attributeOptions={attributeOptions}
          breakdownBy={breakdownBy}
          chartRef={chartRef}
          data={data}
          display={display}
          unit={unit}
        />
      </div>
    </div>
  );
};
