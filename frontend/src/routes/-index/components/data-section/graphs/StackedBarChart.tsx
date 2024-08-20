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
import { CustomTooltip } from "../CustomTooltip";
import { cn, getColor, tickFormatter } from "@/lib/utils";
import { type z } from "zod";
import { GRAPH_FONT_SIZE, STACKED_BAR_CHART_TESTID } from "@/lib/constants";
import { YEAR_KEY } from "@/lib/shared_with_backend/constants";
import type { ScenarioRowsAggregatedArraySchema } from "@/lib/schemas";
import { CustomLegend } from "../Legend/CustomLegend";
import type { Attribute, IndicatorUnit } from "@/lib/types";
import { SHOULD_ANIMATE } from "@/lib/constants2";

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
          <BarChart
            width={500}
            height={400}
            data={data}
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              content={(props) => (
                <CustomTooltip
                  {...props}
                  indicatorUnit={indicatorUnit}
                  breakdownBy={breakdownBy}
                />
              )}
              cursor={false}
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
                    isAnimationActive={SHOULD_ANIMATE}
                    barSize={45}
                  />
                );
              })
              .reverse()}
            <Legend
              content={(props) => (
                <CustomLegend
                  payload={props.payload}
                  className={cn("pl-[60px] pt-4")}
                />
              )}
            />
            <XAxis
              dataKey={YEAR_KEY}
              stroke="hsl(223 0% 20%)"
              tick={{ fontSize: GRAPH_FONT_SIZE }}
            />

            <YAxis
              tickFormatter={tickFormatter}
              tickCount={4}
              stroke="hsl(223 0% 20%)"
              tick={{ fontSize: GRAPH_FONT_SIZE }}
            >
              <Label
                value={indicatorUnit}
                angle={-90}
                position="insideLeft"
                dx={10}
                fontSize={GRAPH_FONT_SIZE}
                fill="hsl(223 0% 20%)"
              />
            </YAxis>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
