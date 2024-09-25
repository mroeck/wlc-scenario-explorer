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

export const LineGraph = ({
  animation,
  attributeOptions,
  breakdownBy,
  chartRef,
  data,
  unit,
}: GraphProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%" ref={chartRef}>
      <LineChart {...commonChartProps} data={data}>
        <CartesianGrid {...commonCartisianGridProps} />
        {attributeOptions.map((option) => {
          const areaColor = getColor({ breakdownBy, option });

          return (
            <Line
              {...commonGraphElementProps}
              strokeWidth={3}
              key={option}
              type="monotone"
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

        <Legend content={(props) => <CustomLegend payload={props.payload} />} />
        <XAxis {...commonXaxisProps} />
        <YAxis {...commonYaxisProps}>
          <Label value={unit} {...commonYaxisLabelProps} />
        </YAxis>
      </LineChart>
    </ResponsiveContainer>
  );
};
