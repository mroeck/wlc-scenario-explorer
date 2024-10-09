import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
  BarChart,
  Bar,
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
import { GRAPH_AXIS_COLOR, ROUTES } from "@/lib/constants";
import { HIGHLIGHT_OPACITY } from "./constants";

const route = getRouteApi(ROUTES.DASHBOARD);

export const StackedBarChart = ({
  animation,
  attributeOptions,
  breakdownBy,
  chartRef,
  data,
  unit,
  highlight,
  domain,
}: GraphProps) => {
  const navigate = route.useNavigate();
  const isSomethingHighlighted = !!highlight;

  type OnAreaClickArgs = {
    highlight: BreakdownByOptions;
  };
  const onBarClick = ({ highlight }: OnAreaClickArgs) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        highlight,
      }),
    });
  };

  return (
    <ResponsiveContainer width="100%" height="100%" ref={chartRef}>
      <BarChart {...commonChartProps} data={data}>
        <CartesianGrid {...commonCartisianGridProps} />

        <YAxis {...commonYaxisProps} domain={domain} allowDataOverflow>
          <Label value={unit} {...commonYaxisLabelProps} />
        </YAxis>
        {attributeOptions.map((option) => {
          const areaColor = getColor({ breakdownBy, option });

          const isHighlight = option === highlight;
          const opacity =
            isSomethingHighlighted && !isHighlight ? HIGHLIGHT_OPACITY : 0.8;

          return (
            <Bar
              {...commonGraphElementProps}
              key={option}
              type="monotone"
              dataKey={option}
              isAnimationActive={animation}
              barSize={45}
              onClick={() => {
                onBarClick({ highlight: option });
              }}
              stroke={isHighlight ? GRAPH_AXIS_COLOR : areaColor}
              strokeWidth={isHighlight ? 1 : undefined}
              fill={areaColor}
              fillOpacity={opacity}
              strokeOpacity={opacity}
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
        <XAxis {...commonXaxisProps} />
        <Legend content={(props) => <CustomLegend payload={props.payload} />} />
      </BarChart>
    </ResponsiveContainer>
  );
};
