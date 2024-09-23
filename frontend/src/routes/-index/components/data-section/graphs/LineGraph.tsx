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
import { getColor } from "@/lib/utils";
import { type z } from "zod";
import { SCENARIO_A_AND_B } from "@/lib/constants";
import type {
  AnimationTabSchema,
  DisplaySchema,
  ScenarioRowsAggregatedArraySchema,
} from "@/lib/schemas";
import { CustomLegend } from "../Legend/CustomLegend";
import type { Attribute, IndicatorUnit } from "@/lib/types";
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

type LineChartProps = {
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  animation: z.infer<typeof AnimationTabSchema> | undefined;
  breakdownBy: Attribute;
  attributeOptions: string[];
  chartRef: React.RefObject<HTMLDivElement>;
  display: z.infer<typeof DisplaySchema>;
  unit: IndicatorUnit;
};
export const LineGraph = ({
  animation,
  attributeOptions,
  breakdownBy,
  chartRef,
  data,
  display,
  unit,
}: LineChartProps) => {
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
        <Legend content={(props) => <CustomLegend payload={props.payload} />} />
        <XAxis {...commonXaxisProps} />
        <YAxis {...commonYaxisProps}>
          <Label value={unit} {...commonYaxisLabelProps} />
        </YAxis>
      </LineChart>
    </ResponsiveContainer>
  );
};
