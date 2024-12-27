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
  DEFAULT_DOMAIN_ALL,
  GRAPH_AXIS_COLOR,
  PATTERN,
  ROUTES,
  SCENARIO_A_AND_B,
} from "@/lib/constants";
import { getRouteApi } from "@tanstack/react-router";
import { HIGHLIGHT_OPACITY } from "./constants";
import { Fragment } from "react/jsx-runtime";
import { onElementClick } from "./utils";
import { getNiceTickValues } from "recharts-scale";
import {
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import type { DomainAll } from "../types";

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
  scenarioId,
}: GraphProps) => {
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
    initialData: DEFAULT_DOMAIN_ALL,
    staleTime: Infinity,
  });

  const stackedAreaDomain = domainsData.stackedArea;

  const isSomethingHighlighted = !!highlights && highlights.length > 0;
  const needPattern = scenarioId === "B" && display === SCENARIO_A_AND_B;
  const isAvsB = display === SCENARIO_A_AND_B;

  type UpdateDomainArgs = {
    graphType: "stackedArea" | "line";
    newMin: number | null;
    newMax: number | null;
    queryClient: QueryClient;
  };
  const updateDomain = ({
    graphType,
    newMin,
    newMax,
    queryClient,
  }: UpdateDomainArgs) => {
    const id = (scenarioId ?? "A") as "A" | "B";

    if (!stackedAreaDomain.update[id]) {
      queryClient.setQueryData<DomainAll>([DOMAINS_QUERY_KEY, hash], (old) => {
        const currentData = old ?? DEFAULT_DOMAIN_ALL;
        const minValues = [currentData[graphType].min, newMin].filter(
          (item) => item != null,
        );
        const maxValues = [currentData[graphType].max, newMax].filter(
          (item) => item != null,
        );

        return {
          ...currentData,
          [graphType]: {
            min: minValues.length > 0 ? Math.min(...minValues) : null,
            max: maxValues.length > 0 ? Math.max(...maxValues) : null,
            update: {
              ...currentData[graphType].update,
              [id]: true,
            },
          },
        };
      });
    }
  };

  type GetDomainArg = number;
  const getDomainMin = (dataMin: GetDomainArg) => {
    updateDomain({
      graphType: "stackedArea",
      newMin: dataMin,
      newMax: null,
      queryClient,
    });

    return stackedAreaDomain.min ?? dataMin;
  };

  const getDomainMax = (dataMax: GetDomainArg) => {
    updateDomain({
      graphType: "stackedArea",
      newMin: null,
      newMax: dataMax,
      queryClient,
    });

    return stackedAreaDomain.max ?? dataMax;
  };

  type GetFinalDomainArg = [number, number];
  const getDomain = ([dataMin, dataMax]: GetFinalDomainArg) => {
    const domainRaw = [getDomainMin(dataMin), getDomainMax(dataMax)] satisfies [
      number,
      number,
    ];
    const { tickCount } = commonYaxisProps;
    const tickValues = getNiceTickValues(domainRaw, commonYaxisProps.tickCount);

    const domain = [tickValues[0], tickValues[tickCount - 1]] satisfies [
      number,
      number,
    ];

    return domain;
  };

  return (
    <ResponsiveContainer width="100%" height="100%" ref={chartRef}>
      <AreaChart {...commonChartProps} data={data} stackOffset="sign">
        <CartesianGrid {...commonCartisianGridProps} />
        <XAxis {...commonXaxisProps} />
        <YAxis {...commonYaxisProps} domain={isAvsB ? getDomain : undefined}>
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
        <Legend content={(props) => <CustomLegend payload={props.payload} />} />
      </AreaChart>
    </ResponsiveContainer>
  );
};
