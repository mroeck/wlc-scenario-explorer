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
  commonStackedGraphElementProps,
  commonTooltipProps,
  commonXaxisProps,
  commonYaxisLabelProps,
  commonYaxisProps,
  DOMAINS_QUERY_KEY,
} from "../constants";
import { PortalTooltip } from "../Tooltip/PortalTooltip";
import type { GraphProps } from "./types";
import {
  DEFAULT_Y_AXIS_DOMAIN_ALL,
  GRAPH_AXIS_COLOR,
  MIN_TICK_AMOUNT,
  PATTERN,
  ROUTES,
  SCENARIO_A_AND_B,
} from "@/lib/constants";
import { getRouteApi } from "@tanstack/react-router";
import { HIGHLIGHT_OPACITY } from "./constants";
import { Fragment } from "react/jsx-runtime";
import { getDefaultDomain, onElementClick, updateDomain } from "./utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type WantedProps = "strokeWidth" | "dataKey" | "isAnimationActive";

type CommonAreaProps = Record<
  WantedProps,
  React.ComponentProps<typeof Area>[WantedProps]
>;

const route = getRouteApi(ROUTES.DASHBOARD);

export const StackedAreaChart = ({
  animation,
  attributeOptions,
  chartRef,
  data,
  unit,
  highlights,
  scenarioId = "A",
  xAxisDomain,
}: GraphProps) => {
  const [tickCount, setTickCount] = useState<number>(MIN_TICK_AMOUNT);

  const navigate = route.useNavigate();
  const {
    display,
    breakdownBy,
    dividedBy,
    filters,
    indicator,
    scenarioA,
    scenarioB,
  } = route.useSearch({
    select: (search) => ({
      display: search.display,
      breakdownBy: search.breakdownBy,
      dividedBy: search.dividedBy,
      filters: search.filters,
      indicator: search.indicator,
      scenarioA: search.scenarioA,
      scenarioB: search.scenarioB,
    }),
  });

  const queryClient = useQueryClient();
  const hash = {
    breakdownBy,
    dividedBy,
    filters,
    indicator,
    scenarioA,
    scenarioB,
  };

  const { data: domainsData } = useQuery({
    queryKey: [DOMAINS_QUERY_KEY, hash],
    initialData: DEFAULT_Y_AXIS_DOMAIN_ALL,
    staleTime: Infinity,
  });

  const stackedAreaDomain = domainsData.stackedArea;

  const isSomethingHighlighted = !!highlights && highlights.length > 0;
  const needPattern = scenarioId === "B";
  const isAvsB = display === SCENARIO_A_AND_B;

  type GetDomainArg = number;
  const getDomainMin = (dataMin: GetDomainArg) => {
    updateDomain({
      graphType: "stackedArea",
      newMin: dataMin,
      newMax: null,
      queryClient,
      scenarioId,
      graphDomain: stackedAreaDomain,
      hash,
    });

    return stackedAreaDomain.min ?? dataMin;
  };

  const getDomainMax = (dataMax: GetDomainArg) => {
    updateDomain({
      graphType: "stackedArea",
      newMin: null,
      newMax: dataMax,
      queryClient,
      scenarioId,
      graphDomain: stackedAreaDomain,
      hash,
    });

    return stackedAreaDomain.max ?? dataMax;
  };

  const getDomain = ([dataMin, dataMax]: [number, number]) => {
    const domainRaw = [getDomainMin(dataMin), getDomainMax(dataMax)] satisfies [
      number,
      number,
    ];

    return getDefaultDomain({
      domainRaw,
      initialTickCount: MIN_TICK_AMOUNT,
      setTickCount,
    });
  };

  return (
    <ResponsiveContainer width="100%" height="100%" ref={chartRef}>
      <AreaChart {...commonChartProps} data={data} stackOffset="sign">
        <CartesianGrid {...commonCartisianGridProps} />
        <XAxis
          {...commonXaxisProps}
          domain={isAvsB ? xAxisDomain : undefined}
        />

        <YAxis
          {...commonYaxisProps}
          tickCount={tickCount}
          domain={
            isAvsB
              ? getDomain
              : (domainRaw) =>
                  getDefaultDomain({
                    domainRaw,
                    initialTickCount: MIN_TICK_AMOUNT,
                    setTickCount,
                  })
          }
        >
          <Label value={unit} {...commonYaxisLabelProps} />
        </YAxis>
        {attributeOptions.map((option) => {
          const areaColor = getColor({ breakdownBy, option });
          const isHighlight = !!highlights && highlights.includes(option);

          const opacity =
            isSomethingHighlighted && !isHighlight
              ? HIGHLIGHT_OPACITY
              : undefined;

          const commonAreaProps = {
            dataKey: option,
            isAnimationActive: animation,
            strokeWidth: isHighlight ? 1 : undefined,
          } satisfies CommonAreaProps;

          const id = option.toString().replaceAll(" ", "") + scenarioId;

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
                {...commonStackedGraphElementProps}
                {...commonAreaProps}
                key={`${option}A`}
                stroke={isHighlight ? GRAPH_AXIS_COLOR : areaColor}
                strokeWidth={isHighlight ? 1 : undefined}
                strokeOpacity={opacity}
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
              {...commonStackedGraphElementProps}
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
        <Legend
          content={(props) => (
            <CustomLegend payload={props.payload} scenarioId={scenarioId} />
          )}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
