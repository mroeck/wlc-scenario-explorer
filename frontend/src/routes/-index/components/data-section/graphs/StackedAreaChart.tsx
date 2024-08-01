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
import { CustomTooltip } from "../CustomTooltip";
import { cn, getColor, tickFormatter } from "@/lib/utils";
import { type z } from "zod";
import {
  GRAPH_FONT_SIZE,
  STACKED_AREA_CHART_TESTID,
  TEST,
} from "@/lib/constants";
import { env } from "@/env";
import { YEAR_KEY } from "@/lib/shared_with_backend/constants";
import type { ScenarioRowsAggregatedArraySchema } from "@/lib/schemas";
import { CustomLegend } from "../Legend/CustomLegend";
import type { Attribute, Unit } from "@/lib/types";

type StackedAreaChartProps = {
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  unit: Unit;
  breakdownBy: Attribute;
};
export const StackedAreaChart = ({
  data,
  unit,
  breakdownBy,
}: StackedAreaChartProps) => {
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
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={data}
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="lightgrey"
              strokeWidth={0.5}
            />
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
                    isAnimationActive={env.PUBLIC_NODE_ENV !== TEST}
                  />
                );
              })
              .reverse()}
            <Tooltip
              content={(props) => (
                <CustomTooltip
                  {...props}
                  unit={unit}
                  breakdownBy={breakdownBy}
                />
              )}
              cursor={false}
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
                    isAnimationActive={env.PUBLIC_NODE_ENV !== TEST}
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
                value={unit}
                angle={-90}
                position="insideLeft"
                dx={10}
                fontSize={GRAPH_FONT_SIZE}
                fill="hsl(223 0% 20%)"
              />
            </YAxis>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
