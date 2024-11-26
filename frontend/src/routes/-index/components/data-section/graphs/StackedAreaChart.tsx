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
import {
  GRAPH_AXIS_COLOR,
  PATTERN,
  ROUTES,
  SCENARIO_A_AND_B,
} from "@/lib/constants";
import { getRouteApi } from "@tanstack/react-router";
import { HIGHLIGHT_OPACITY } from "./constants";
import { Fragment } from "react/jsx-runtime";
import { onElementClick } from "./utils";

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
  highlights,
  domain,
  scenarioId,
}: GraphProps) => {
  const navigate = route.useNavigate();
  const { display } = route.useSearch({
    select: (search) => ({
      display: search.display,
    }),
  });
  const isSomethingHighlighted = !!highlights && highlights.length > 0;
  const needPattern = scenarioId === "B" && display === SCENARIO_A_AND_B;

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
          const isHighlight = !!highlights && highlights.includes(option);
          const isRigthAfterHighlight =
            !!highlights && highlights.includes(attributeOptions[index + 1]);

          const opacity =
            isSomethingHighlighted && !isHighlight
              ? HIGHLIGHT_OPACITY
              : undefined;

          const commonAreaProps = {
            dataKey: option,
            isAnimationActive: animation,
            strokeWidth: isHighlight ? 1 : undefined,
          } satisfies CommonAreaProps;

          const id = option.toString().replaceAll(" ", "") + (scenarioId ?? "");

          return (
            <Fragment key={id}>
              <defs>
                <pattern
                  id={id}
                  width={PATTERN.width}
                  height={PATTERN.height}
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <rect
                    width={PATTERN.width}
                    height={PATTERN.height}
                    fill={areaColor}
                  />
                  {needPattern && <rect width="2" height="4" fill="white" />}
                </pattern>
              </defs>
              <Area
                {...commonGraphElementProps}
                {...commonAreaProps}
                key={`${option}A`}
                stroke={
                  isHighlight || isRigthAfterHighlight
                    ? GRAPH_AXIS_COLOR
                    : areaColor
                }
                strokeWidth={
                  isHighlight || isRigthAfterHighlight ? 1 : undefined
                }
                strokeOpacity={isRigthAfterHighlight ? undefined : opacity}
                fill={`url(#${id})`}
                fillOpacity={opacity}
              />
            </Fragment>
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
        {attributeOptions.map((option) => {
          const areaColor = getColor({ breakdownBy, option });
          const isHighlight = !!highlights && highlights.includes(option);

          const commonAreaProps = {
            dataKey: option,
            isAnimationActive: animation,
            strokeWidth: isHighlight ? 1 : undefined,
          } satisfies CommonAreaProps;

          return (
            <Area
              {...commonGraphElementProps}
              {...commonAreaProps}
              key={`${option}B`}
              type="monotone"
              stackId="0"
              fill="transparent"
              fillOpacity="0"
              stroke="transparent"
              onClick={() => {
                onElementClick({
                  navigate,
                  newHighlight: option,
                  amountOfOptions: attributeOptions.length,
                });
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
