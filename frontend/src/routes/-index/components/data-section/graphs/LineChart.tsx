import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { colors } from "../temp_data";
import { CustomTooltip } from "../CustomTooltip";
import { cn, tickFormatter } from "@/lib/utils";
import { type z } from "zod";
import {
  DEFAULT_COLOR,
  DEFAULT_UNIT_MINIMIZED,
  STACKED_BAR_CHART_TESTID,
  TEST,
} from "@/lib/constants";
import { env } from "@/env";
import { YEAR_KEY } from "@/lib/shared_with_backend/constants";
import type { ScenarioRowsAggregatedArraySchema } from "@/lib/schemas";
import { CustomLegend } from "../Legend/CustomLegend";
import type { Attribute, Unit } from "@/lib/types";

const Y_AXIS_LABEL_MARGIN = 20;
type StackedBarChartProps = {
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  unit: Unit;
  breakdownBy: Attribute;
};
export const StackedBarChart = ({
  data,
  unit,
  breakdownBy,
}: StackedBarChartProps) => {
  const attributes =
    data.length > 0
      ? Object.keys(data[0]).filter((key) => key !== YEAR_KEY)
      : [];

  return (
    <div className={cn("h-full overflow-x-scroll lg:overflow-x-visible")}>
      <div
        className={cn(
          "h-0 min-h-[500px] min-w-[600px] lg:min-h-full lg:min-w-[unset] lg:flex-1 [&_svg]:overflow-visible",
        )}
        style={{ paddingLeft: Y_AXIS_LABEL_MARGIN + 5 }}
        data-testid={STACKED_BAR_CHART_TESTID}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={400}
            data={data}
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
            />
            <XAxis dataKey={YEAR_KEY} />
            <YAxis
              label={{
                value: DEFAULT_UNIT_MINIMIZED,
                angle: -90,
                position: "insideLeft",
                dx: Y_AXIS_LABEL_MARGIN * -1,
              }}
              tickFormatter={tickFormatter}
              tickCount={4}
            />
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
            {attributes
              .map((attribute, index) => (
                <Line
                  key={attribute}
                  type="monotone"
                  dataKey={attribute}
                  stroke={colors[index] ?? DEFAULT_COLOR}
                  fill={colors[index] ?? DEFAULT_COLOR}
                  fillOpacity="0.7"
                  isAnimationActive={env.PUBLIC_NODE_ENV !== TEST}
                  strokeWidth={3}
                />
              ))
              .reverse()}
            <Legend
              content={(props) => (
                <CustomLegend
                  payload={props.payload}
                  className={cn("pl-[60px] pt-4")}
                />
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
