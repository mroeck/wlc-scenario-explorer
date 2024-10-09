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
import type { BreakdownByOptions, GraphProps } from "./types";
import { GRAPH_AXIS_COLOR, ROUTES } from "@/lib/constants";
import { getRouteApi } from "@tanstack/react-router";
import { HIGHLIGHT_OPACITY } from "./constants";

type WantedProps = "strokeWidth" | "dataKey" | "isAnimationActive";

type CommonAreaProps = Record<
  WantedProps,
  React.ComponentProps<typeof Area>[WantedProps]
>;

const route = getRouteApi(ROUTES.DASHBOARD);

export const StackedAreaChart = ({
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
  const onAreaClick = ({ highlight }: OnAreaClickArgs) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        highlight,
      }),
    });
  };

  return (
    <ResponsiveContainer width="100%" height="100%" ref={chartRef}>
      <AreaChart {...commonChartProps} data={data}>
        <CartesianGrid {...commonCartisianGridProps} />
        <XAxis {...commonXaxisProps} />
        <YAxis {...commonYaxisProps} domain={domain} allowDataOverflow>
          <Label value={unit} {...commonYaxisLabelProps} />
        </YAxis>
        {attributeOptions.map((option, index) => {
          const areaColor = getColor({ breakdownBy, option });
          const isHighlight = option === highlight;
          const isRigthAfterHighlight =
            !!highlight && attributeOptions[index + 1] === highlight;

          const opacity =
            isSomethingHighlighted && !isHighlight
              ? HIGHLIGHT_OPACITY
              : undefined;

          const commonAreaProps = {
            dataKey: option,
            isAnimationActive: animation,
            strokeWidth: isHighlight ? 1 : undefined,
          } satisfies CommonAreaProps;

          return (
            <Area
              {...commonGraphElementProps}
              {...commonAreaProps}
              key={option + "A"}
              stroke={
                isHighlight || isRigthAfterHighlight
                  ? GRAPH_AXIS_COLOR
                  : areaColor
              }
              strokeWidth={isHighlight || isRigthAfterHighlight ? 1 : undefined}
              strokeOpacity={isRigthAfterHighlight ? undefined : opacity}
              fill={areaColor}
              fillOpacity={opacity}
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
        {attributeOptions.map((option) => {
          const areaColor = getColor({ breakdownBy, option });
          const isHighlight = option === highlight;

          const commonAreaProps = {
            dataKey: option,
            isAnimationActive: animation,
            strokeWidth: isHighlight ? 1 : undefined,
          } satisfies CommonAreaProps;

          return (
            <Area
              {...commonGraphElementProps}
              {...commonAreaProps}
              key={option + "B"}
              type="monotone"
              stackId="0"
              fill="transparent"
              fillOpacity="0"
              stroke="transparent"
              onClick={() => {
                onAreaClick({ highlight: option });
              }}
              activeDot={{
                r: 4,
                stroke: "white",
                fill: areaColor,
                strokeWidth: 1,
              }}
            />
          );
        })}
        <Legend content={(props) => <CustomLegend payload={props.payload} />} />
      </AreaChart>
    </ResponsiveContainer>
  );
};
