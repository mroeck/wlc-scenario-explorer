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
  DOMAINS_QUERY_KEY,
} from "../constants";
import { PortalTooltip } from "../Tooltip/PortalTooltip";
import type { GraphProps } from "./types";
import { getRouteApi } from "@tanstack/react-router";
import {
  DEFAULT_Y_AXIS_DOMAIN_ALL,
  GRAPH_AXIS_COLOR,
  MIN_TICK_AMOUNT,
  ROUTES,
  SCENARIO_A_AND_B,
} from "@/lib/constants";
import { HIGHLIGHT_OPACITY } from "./constants";
import { getDefaultDomain, onElementClick, updateDomain } from "./utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const route = getRouteApi(ROUTES.DASHBOARD);

export const LineGraph = ({
  animation,
  attributeOptions,
  chartRef,
  data,
  unit,
  highlights,
  scenarioId,
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

  const isSomethingHighlighted = !!highlights && highlights.length > 0;
  const isScenarioB = scenarioId === "B";
  const isAvsB = display === SCENARIO_A_AND_B;

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

  const lineGraphDomain = domainsData.line;

  type GetDomainArg = number;
  const getDomainMin = (dataMin: GetDomainArg) => {
    updateDomain({
      graphType: "line",
      newMin: dataMin,
      newMax: null,
      queryClient,
      scenarioId,
      graphDomain: lineGraphDomain,
      hash,
    });

    return lineGraphDomain.min ?? dataMin;
  };

  const getDomainMax = (dataMax: GetDomainArg) => {
    updateDomain({
      graphType: "line",
      newMin: null,
      newMax: dataMax,
      queryClient,
      scenarioId,
      graphDomain: lineGraphDomain,
      hash,
    });

    return lineGraphDomain.max ?? dataMax;
  };

  type GetFinalDomainArg = [number, number];

  const getDomain = ([dataMin, dataMax]: GetFinalDomainArg) => {
    const domainRaw = [getDomainMin(dataMin), getDomainMax(dataMax)] satisfies [
      number,
      number,
    ];

    return getDefaultDomain({
      domainRaw,
      initialTickCount: tickCount,
      setTickCount,
    });
  };

  return (
    <ResponsiveContainer width="100%" height="100%" ref={chartRef}>
      <LineChart {...commonChartProps} data={data} stackOffset="sign">
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
                    initialTickCount: tickCount,
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

        <Legend
          content={(props) => (
            <CustomLegend payload={props.payload} scenarioId={scenarioId} />
          )}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
