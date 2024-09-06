import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";
import { CustomTooltip } from "../Tooltip/CustomTooltip";
import { cn, getColor } from "@/lib/utils";
import { type z } from "zod";
import {
  ROUTES,
  SCENARIO_A_AND_B,
  STACKED_AREA_CHART_TESTID,
} from "@/lib/constants";
import { YEAR_KEY } from "@/lib/shared_with_backend/constants";
import type { ScenarioRowsAggregatedArraySchema } from "@/lib/schemas";
import { CustomLegend } from "../Legend/CustomLegend";
import type { Attribute, IndicatorUnit } from "@/lib/types";
import { getRouteApi } from "@tanstack/react-router";
import {
  commonCartisianGridProps,
  commonChartProps,
  commonTooltipProps,
  commonXaxisProps,
  commonYaxisLabelProps,
  commonYaxisProps,
} from "../constants";
import { useRef } from "react";
import { PortalTooltip } from "../Tooltip/PortalTooltip";

const route = getRouteApi(ROUTES.DASHBOARD);

type StackedAreaChartProps = {
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  indicatorUnit: IndicatorUnit;
  breakdownBy: Attribute;
};
export const StackedAreaChart = ({
  data,
  indicatorUnit: unit,
  breakdownBy,
}: StackedAreaChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { animation, display } = route.useSearch({
    select: (search) => ({
      animation: search.animation,
      display: search.display,
    }),
  });
  const attributeOptions =
    data.length > 0
      ? Object.keys(data[0]).filter((key) => key !== YEAR_KEY)
      : [];

  // const totals: Record<string, number> = {};
  // data.forEach((item) => {
  //   for (const key in item) {
  //     if (key !== "stock_projection_year") {
  //       if (!totals[key]) {
  //         totals[key] = 0;
  //       }
  //       totals[key] += item[key];
  //     }
  //   }
  // });
  // const attributeOptions = Object.keys(totals).sort(
  //   (a, b) => totals[b] - totals[a],
  // );

  return (
    <div className={cn("h-full overflow-x-scroll lg:overflow-x-visible")}>
      <div
        className={cn(
          "h-0 min-h-[500px] min-w-[600px] lg:min-h-full lg:min-w-[unset] lg:flex-1 [&_svg]:overflow-visible",
        )}
        data-testid={STACKED_AREA_CHART_TESTID}
      >
        <ResponsiveContainer width="100%" height="100%" ref={chartRef}>
          <AreaChart {...commonChartProps} data={data}>
            <CartesianGrid {...commonCartisianGridProps} />
            {attributeOptions
              .map((option) => {
                const areaColor = getColor({ breakdownBy, option });

                return (
                  <Area
                    key={option + "A"}
                    stackId="1"
                    dataKey={option}
                    stroke={areaColor}
                    strokeWidth={0.5}
                    strokeOpacity={0.75}
                    fill={areaColor}
                    fillOpacity={0.75}
                    isAnimationActive={animation}
                  />
                );
              })
              .reverse()}
            <Tooltip
              {...commonTooltipProps}
              content={(props) =>
                display === SCENARIO_A_AND_B ? (
                  <PortalTooltip
                    {...props}
                    indicatorUnit={unit}
                    breakdownBy={breakdownBy}
                    chartRef={chartRef}
                  />
                ) : (
                  <CustomTooltip
                    {...props}
                    indicatorUnit={unit}
                    breakdownBy={breakdownBy}
                  />
                )
              }
            />
            {attributeOptions
              .map((option) => {
                const areaColor = getColor({ breakdownBy, option });

                return (
                  <Area
                    key={option + "B"}
                    type="monotone"
                    stackId="0"
                    dataKey={option}
                    stroke={areaColor}
                    strokeWidth={0.5}
                    fill={areaColor}
                    fillOpacity="0"
                    activeDot={{
                      r: 4,
                      stroke: "white",
                      fill: areaColor,
                      strokeWidth: 1,
                    }}
                    isAnimationActive={animation}
                  />
                );
              })
              .reverse()}
            <Legend
              content={(props) => <CustomLegend payload={props.payload} />}
            />
            <XAxis {...commonXaxisProps} />
            <YAxis {...commonYaxisProps}>
              <Label value={unit} {...commonYaxisLabelProps} />
            </YAxis>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
