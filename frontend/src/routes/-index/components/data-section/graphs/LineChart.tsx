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
import { CustomTooltip } from "../CustomTooltip";
import { cn, getColor, tickFormatter } from "@/lib/utils";
import { type z } from "zod";
import {
  GRAPH_FONT_SIZE,
  STACKED_BAR_CHART_TESTID,
  TEST,
} from "@/lib/constants";
import { env } from "@/env";
import { YEAR_KEY } from "@/lib/shared_with_backend/constants";
import type { ScenarioRowsAggregatedArraySchema } from "@/lib/schemas";
import { CustomLegend } from "../Legend/CustomLegend";
import type { Attribute, Unit } from "@/lib/types";

type LineGraphProps = {
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  unit: Unit;
  breakdownBy: Attribute;
};
export const LineGraph = ({ data, unit, breakdownBy }: LineGraphProps) => {
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
          <LineChart
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
                  unit={unit}
                  breakdownBy={breakdownBy}
                />
              )}
              cursor={false}
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
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
