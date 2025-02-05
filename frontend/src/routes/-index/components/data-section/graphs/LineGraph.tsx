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
  ROUTES,
  SCENARIO_A_AND_B,
} from "@/lib/constants";
import { HIGHLIGHT_OPACITY } from "./constants";
import { onElementClick } from "./utils";
import { getNiceTickValues } from "recharts-scale";
import {
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import type { DomainAll } from "../types";

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

    if (!lineGraphDomain.isUpdated[id]) {
      queryClient.setQueryData<DomainAll>([DOMAINS_QUERY_KEY, hash], (old) => {
        const currentData = old ?? DEFAULT_Y_AXIS_DOMAIN_ALL;
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
            isUpdated: {
              ...currentData[graphType].isUpdated,
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
      graphType: "line",
      newMin: dataMin,
      newMax: null,
      queryClient,
    });

    return lineGraphDomain.min ?? dataMin;
  };

  const getDomainMax = (dataMax: GetDomainArg) => {
    updateDomain({
      graphType: "line",
      newMin: null,
      newMax: dataMax,
      queryClient,
    });

    return lineGraphDomain.max ?? dataMax;
  };

  type GetFinalDomainArg = [number, number];
  const getDomain = ([dataMin, dataMax]: GetFinalDomainArg) => {
    const domainRaw = [getDomainMin(dataMin), getDomainMax(dataMax)] satisfies [
      number,
      number,
    ];
    const { tickCount } = commonYaxisProps;
    const tickValues = getNiceTickValues(domainRaw, commonYaxisProps.tickCount);

    const domainStart = tickValues[0] as Exclude<
      (typeof tickValues)[0],
      undefined
    >;
    const domainEnd = tickValues[tickCount - 1] as Exclude<
      (typeof tickValues)[number],
      undefined
    >;
    const domain = [domainStart, domainEnd] satisfies [number, number];

    return domain;
  };

  return (
    <ResponsiveContainer width="100%" height="100%" ref={chartRef}>
      <LineChart {...commonChartProps} data={data} stackOffset="sign">
        <CartesianGrid {...commonCartisianGridProps} />
        <XAxis
          {...commonXaxisProps}
          domain={isAvsB ? xAxisDomain : undefined}
        />
        <YAxis {...commonYaxisProps} domain={isAvsB ? getDomain : undefined}>
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
