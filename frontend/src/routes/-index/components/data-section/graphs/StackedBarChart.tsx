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
import {
  GRAPH_AXIS_COLOR,
  ROUTES,
  SCENARIO_A_AND_B,
  SCENARIO_A_LABEL,
  SCENARIO_B_LABEL,
  SCENARIO_B_ONLY,
} from "@/lib/constants";
import { HIGHLIGHT_OPACITY } from "./constants";
import { YEAR_KEY } from "@/lib/shared_with_backend/constants";
import { Fragment } from "react/jsx-runtime";

const route = getRouteApi(ROUTES.DASHBOARD);
const COLUMNS_TYPE: [typeof SCENARIO_A_LABEL, typeof SCENARIO_B_LABEL] = [
  SCENARIO_A_LABEL,
  SCENARIO_B_LABEL,
];
const PATTERN = {
  width: 8,
  height: 4,
} as const;

type StackedBarChartProps = GraphProps & {
  dataB: GraphProps["data"];
};

export const StackedBarChart = ({
  animation,
  attributeOptions,
  breakdownBy,
  chartRef,
  data: dataA,
  dataB,
  unit,
  highlight,
  domain,
}: StackedBarChartProps) => {
  const navigate = route.useNavigate();
  const { display } = route.useSearch({
    select: (search) => ({
      display: search.display,
    }),
  });

  const isSomethingHighlighted = !!highlight;
  const isAvsB = display === SCENARIO_A_AND_B;
  const isBonly = display === SCENARIO_B_ONLY;

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

  type MergedData = {
    stock_projection_year: number;
    [SCENARIO_A_LABEL]: { [k: string]: number };
    [SCENARIO_B_LABEL]: { [k: string]: number } | Record<string, never>;
  };

  type Data = Record<string, number>;

  let finalData: MergedData[] | Data[] = dataA;

  if (isAvsB) {
    finalData = dataA.map((item) => {
      const { stock_projection_year: yearA, ...restA } = item;

      const itemB = dataB.find((item) => item.stock_projection_year === yearA);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { stock_projection_year: yearB, ...restB } = itemB
        ? itemB
        : { stock_projection_year: undefined };

      return {
        [YEAR_KEY]: item.stock_projection_year,
        [SCENARIO_A_LABEL]: restA,
        [SCENARIO_B_LABEL]: restB,
      };
    });
  } else if (isBonly) {
    finalData = dataB;
  }

  return (
    <ResponsiveContainer width="100%" height="100%" ref={chartRef}>
      <BarChart {...commonChartProps} data={finalData}>
        <CartesianGrid {...commonCartisianGridProps} />

        <YAxis {...commonYaxisProps} domain={domain} allowDataOverflow>
          <Label value={unit} {...commonYaxisLabelProps} />
        </YAxis>
        {COLUMNS_TYPE.map((type, index) => {
          if (display !== SCENARIO_A_AND_B && index > 0) {
            return null;
          }

          return attributeOptions.map((option) => {
            const areaColor = getColor({ breakdownBy, option });

            const isHighlight = option === highlight;
            const opacity =
              isSomethingHighlighted && !isHighlight ? HIGHLIGHT_OPACITY : 0.8;
            const dataKey = isAvsB ? `${type}.${option}` : option;
            const id = dataKey.toString().replaceAll(" ", "");
            const needPattern = type === COLUMNS_TYPE[1] && isAvsB;

            return (
              <Fragment key={dataKey}>
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
                <Bar
                  {...commonGraphElementProps}
                  type="monotone"
                  dataKey={dataKey}
                  stackId={type}
                  isAnimationActive={animation}
                  barSize={45}
                  onClick={() => {
                    onBarClick({ highlight: option });
                  }}
                  stroke={isHighlight ? GRAPH_AXIS_COLOR : areaColor}
                  strokeWidth={isHighlight ? 1 : undefined}
                  fill={`url(#${id})`}
                  fillOpacity={opacity}
                  strokeOpacity={opacity}
                />
              </Fragment>
            );
          });
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
