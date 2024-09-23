import { GRAPH_FONT_SIZE } from "@/lib/constants";
import { YEAR_KEY } from "@/lib/shared_with_backend/constants";
import { tickFormatter } from "@/lib/utils";
import {
  type CartesianGridProps,
  type LabelProps,
  type XAxisProps,
  type YAxisProps,
} from "recharts";
import type { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";

export const commonCartisianGridProps: CartesianGridProps = {
  strokeDasharray: "3 3",
  stroke: "lightgrey",
  strokeWidth: 0.5,
};

export const commonChartProps: CategoricalChartProps = {
  width: 500,
  height: 400,
  margin: { top: 0, left: 0, right: 0, bottom: 0 },
};

export const commonTooltipProps = {
  cursor: false,
  allowEscapeViewBox: { x: true, y: true },
};

export const commonXaxisProps: XAxisProps = {
  dataKey: YEAR_KEY,
  stroke: "hsl(223 0% 20%)",
  tick: { fontSize: GRAPH_FONT_SIZE },
};

export const commonYaxisProps: YAxisProps = {
  tickFormatter,
  tickCount: 4,
  stroke: "hsl(223 0% 20%)",
  tick: { fontSize: GRAPH_FONT_SIZE },
};

export const commonYaxisLabelProps: LabelProps = {
  angle: -90,
  position: "insideLeft",
  dx: 10,
  fontSize: GRAPH_FONT_SIZE,
  fill: "hsl(223 0% 20%)",
};

export const commonGraphElementProps = {
  strokeWidth: 0.5,
  strokeOpacity: 0.75,
  fillOpacity: 0.75,
  stackId: "1",
};
