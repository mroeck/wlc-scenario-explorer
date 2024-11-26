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
import { getRouteApi } from "@tanstack/react-router";
import { GRAPH_AXIS_COLOR, ROUTES } from "@/lib/constants";
import { HIGHLIGHT_OPACITY } from "./constants";
import { onElementClick } from "./utils";

const route = getRouteApi(ROUTES.DASHBOARD);

export const LineGraph = ({
  animation,
  attributeOptions,
  breakdownBy,
  chartRef,
  data,
  unit,
  highlights,
  domain,
  scenarioId,
}: GraphProps) => {
  const navigate = route.useNavigate();
  const isSomethingHighlighted = !!highlights && highlights.length > 0;
  const isScenarioB = scenarioId === "B";

  return (
    <ResponsiveContainer width="100%" height="100%" ref={chartRef}>
      <LineChart {...commonChartProps} data={data}>
        <CartesianGrid {...commonCartisianGridProps} />
        <XAxis {...commonXaxisProps} />
        <YAxis {...commonYaxisProps} domain={domain} allowDataOverflow>
          <Label value={unit} {...commonYaxisLabelProps} />
        </YAxis>
        {attributeOptions.map((option) => {
          const areaColor = getColor({ breakdownBy, option });

          const isHighlight = !!highlights && highlights.includes(option);
          const opacity =
            isSomethingHighlighted && !isHighlight
              ? HIGHLIGHT_OPACITY * 2.5
              : undefined;

          return (
            <Line
              {...commonGraphElementProps}
              key={option}
              type="monotone"
              strokeDasharray={isScenarioB ? "10 5" : undefined}
              dataKey={option}
              stroke={areaColor}
              strokeWidth={3}
              isAnimationActive={animation}
              onClick={() => {
                onElementClick({
                  navigate,
                  newHighlight: option,
                  amountOfOptions: attributeOptions.length,
                });
              }}
              fill={areaColor}
              fillOpacity={opacity}
              opacity={opacity}
              activeDot={{
                stroke: GRAPH_AXIS_COLOR,
                strokeOpacity: 0.7,
              }}
            />
          );
        })}
        <Tooltip
          {...commonTooltipProps}
          content={(props) => (
            <PortalTooltip
              {...props}
              unit={unit}
              breakdownBy={breakdownBy}
              chartRef={chartRef}
              offset={20}
            />
          )}
        />

        <Legend content={(props) => <CustomLegend payload={props.payload} />} />
      </LineChart>
    </ResponsiveContainer>
  );
};
