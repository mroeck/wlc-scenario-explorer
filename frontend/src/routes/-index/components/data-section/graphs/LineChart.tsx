import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
  LineChart,
  Line,
} from "recharts";
import { CustomTooltip } from "../Tooltip/CustomTooltip";
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

const route = getRouteApi(ROUTES.DASHBOARD);

type LineGraphProps = {
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  indicatorUnit: IndicatorUnit;
  breakdownBy: Attribute;
};
export const LineGraph = ({
  data,
  indicatorUnit: unit,
  breakdownBy,
}: LineGraphProps) => {
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
          <LineChart {...commonChartProps} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              {...commonTooltipProps}
              content={(props) => (
                <CustomTooltip
                  {...props}
                  indicatorUnit={unit}
                  breakdownBy={breakdownBy}
                />
              )}
            />
            {attributeOptions
              .map((option) => {
                const color = getColor({ breakdownBy, option });

                return (
                  <Line
                    key={option}
                    type="monotone"
                    dataKey={option}
                    stroke={color}
                    fill={color}
                    strokeWidth={3}
                    fillOpacity="0.7"
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
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
