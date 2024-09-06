import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Label,
} from "recharts";
import { cn, getColor } from "@/lib/utils";
import { type z } from "zod";
import { ROUTES, STACKED_BAR_CHART_TESTID } from "@/lib/constants";
import { YEAR_KEY } from "@/lib/shared_with_backend/constants";
import type { ScenarioRowsAggregatedArraySchema } from "@/lib/schemas";
import { CustomLegend } from "../Legend/CustomLegend";
import type { Attribute, IndicatorUnit } from "@/lib/types";
import { getRouteApi } from "@tanstack/react-router";
import {
  commonChartProps,
  commonTooltipProps,
  commonXaxisProps,
  commonYaxisLabelProps,
  commonYaxisProps,
} from "../constants";
import { CustomTooltip } from "../Tooltip/CustomTooltip";

const route = getRouteApi(ROUTES.DASHBOARD);

type StackedBarChartProps = {
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  indicatorUnit: IndicatorUnit;
  breakdownBy: Attribute;
};
export const StackedBarChart = ({
  data,
  indicatorUnit: indicatorUnit,
  breakdownBy,
}: StackedBarChartProps) => {
  const { animation } = route.useSearch({
    select: (search) => ({
      animation: search.animation,
    }),
  });

  const attributeOptions =
    data.length > 0
      ? Object.keys(data[0]).filter((key) => key !== YEAR_KEY)
      : [];

  return (
    <div className={cn("h-full overflow-x-scroll lg:overflow-x-visible")}>
      <div
        className={cn(
          "h-0 min-h-[500px] min-w-[600px] lg:min-h-full lg:min-w-[unset] lg:flex-1 [&_svg]:overflow-visible",
        )}
        data-testid={STACKED_BAR_CHART_TESTID}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart {...commonChartProps} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              {...commonTooltipProps}
              content={(props) => (
                <CustomTooltip
                  {...props}
                  indicatorUnit={indicatorUnit}
                  breakdownBy={breakdownBy}
                />
              )}
            />
            {attributeOptions
              .map((option) => {
                const color = getColor({ breakdownBy, option });

                return (
                  <Bar
                    key={option}
                    type="monotone"
                    stackId="1"
                    dataKey={option}
                    stroke={color}
                    fill={color}
                    fillOpacity="0.7"
                    isAnimationActive={animation}
                    barSize={45}
                  />
                );
              })
              .reverse()}
            <Legend
              content={(props) => <CustomLegend payload={props.payload} />}
            />
            <XAxis {...commonXaxisProps} />

            <YAxis {...commonYaxisProps}>
              <Label value={indicatorUnit} {...commonYaxisLabelProps} />
            </YAxis>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
