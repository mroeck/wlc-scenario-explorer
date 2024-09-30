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
import type { BreakdownByOptions, GraphProps } from "./types";
import { getRouteApi } from "@tanstack/react-router";
import { ROUTES } from "@/lib/constants";
import { HIGHLIGHT_OPACITY } from "./constants";

const route = getRouteApi(ROUTES.DASHBOARD);

export const LineGraph = ({
  animation,
  attributeOptions,
  breakdownBy,
  chartRef,
  data,
  unit,
  highlight,
}: GraphProps) => {
  const navigate = route.useNavigate();
  const isSomethingHighlighted = !!highlight;

  type OnLineClickArgs = {
    highlight: BreakdownByOptions;
  };
  const onLineClick = ({ highlight }: OnLineClickArgs) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        highlight,
      }),
    });
  };

  return (
    <ResponsiveContainer width="100%" height="100%" ref={chartRef}>
      <LineChart {...commonChartProps} data={data}>
        <CartesianGrid {...commonCartisianGridProps} />
        {attributeOptions.map((option) => {
          const areaColor = getColor({ breakdownBy, option });

          const isHighlight = option === highlight;
          const opacity =
            isSomethingHighlighted && !isHighlight
              ? HIGHLIGHT_OPACITY
              : undefined;

          return (
            <Line
              {...commonGraphElementProps}
              strokeWidth={3}
              key={option}
              type="monotone"
              dataKey={option}
              stroke={areaColor}
              isAnimationActive={animation}
              onClick={() => {
                onLineClick({ highlight: option });
              }}
              fill={areaColor}
              fillOpacity={opacity}
              opacity={opacity}
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
              highlight={highlight}
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
