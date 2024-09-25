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
import { getColor } from "@/lib/utils";
import { CustomLegend } from "../Legend/CustomLegend";
import {
  commonCartisianGridProps,
  commonChartProps,
  commonGraphElementProps,
  commonTooltipProps,
  commonXaxisProps,
  commonYaxisLabelProps,
  commonYaxisProps,
} from "../constants";
import { PortalTooltip } from "../Tooltip/PortalTooltip";
import type { GraphProps } from "./types";

export const StackedAreaChart = ({
  animation,
  attributeOptions,
  breakdownBy,
  chartRef,
  data,
  unit,
}: GraphProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%" ref={chartRef}>
      <AreaChart {...commonChartProps} data={data}>
        <CartesianGrid {...commonCartisianGridProps} />
        {attributeOptions.map((option) => {
          const areaColor = getColor({ breakdownBy, option });

          return (
            <Area
              {...commonGraphElementProps}
              key={option + "A"}
              dataKey={option}
              stroke={areaColor}
              fill={areaColor}
              isAnimationActive={animation}
            />
          );
        })}
        <Tooltip
          {...commonTooltipProps}
          content={(props) => (
            <PortalTooltip
              {...props}
              indicatorUnit={unit}
              breakdownBy={breakdownBy}
              chartRef={chartRef}
              offset={20}
            />
          )}
        />
        {attributeOptions.map((option) => {
          const areaColor = getColor({ breakdownBy, option });

          return (
            <Area
              {...commonGraphElementProps}
              key={option + "B"}
              type="monotone"
              stackId="0"
              dataKey={option}
              stroke={areaColor}
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
        })}
        <Legend content={(props) => <CustomLegend payload={props.payload} />} />
        <XAxis {...commonXaxisProps} />
        <YAxis {...commonYaxisProps}>
          <Label value={unit} {...commonYaxisLabelProps} />
        </YAxis>
      </AreaChart>
    </ResponsiveContainer>
  );
};
