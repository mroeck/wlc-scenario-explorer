import { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import type { TooltipProps } from "recharts";
import type {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type { Attribute } from "@/lib/types";
import { Content } from "./Content";
import type { UnitMinified } from "../types";
import { type HighlightSchema } from "@/lib/schemas";
import type { z } from "zod";

const removeDuplicates = (arr: Payload<ValueType, NameType>[]) => {
  const seen = new Set();
  return arr.filter((item) => {
    const duplicate = seen.has(item.name);
    seen.add(item.name);
    return !duplicate;
  });
};

type PortalTooltipProps = Pick<
  TooltipProps<ValueType, NameType>,
  "active" | "payload" | "label" | "coordinate" | "offset"
> & {
  unit: UnitMinified;
  breakdownBy: Attribute;
  chartRef: React.RefObject<HTMLDivElement>;
  highlight: z.infer<typeof HighlightSchema> | undefined;
};

let lastTooltip: HTMLDivElement | null = null;

export const PortalTooltip = ({
  active,
  payload,
  label,
  unit,
  breakdownBy,
  coordinate,
  offset = 10,
  chartRef,
  highlight,
}: PortalTooltipProps) => {
  const [tooltipElement, setTooltipElement] = useState<HTMLDivElement | null>(
    lastTooltip,
  );

  const setTooltipRef = useCallback((element: HTMLDivElement | null) => {
    const tooltip = element ?? lastTooltip;
    setTooltipElement(tooltip);
    lastTooltip = tooltip;
  }, []);

  if (!active || payload == null || payload.length < 1) return null;

  const areCoordinatesDefined =
    !!coordinate && !!coordinate.x && !!coordinate.y;
  if (!areCoordinatesDefined || chartRef.current == null) return null;

  const tooltipDimensions = tooltipElement?.getBoundingClientRect() ?? {
    width: 0,
    height: 0,
  };

  const data = removeDuplicates(payload);

  const { x = 0, y = 0 } = coordinate;
  const chartRect = chartRef.current.getBoundingClientRect();

  const chartX = chartRect.x + window.scrollX || 0;
  const chartWidth = chartRect.width || 0;
  const halfChart = chartWidth / 2;

  const chartY = chartRect.y + window.scrollY || 0;
  const chartHeight = chartRect.height || 0;

  const maxTranslateX = chartX + chartWidth - tooltipDimensions.width - offset;
  const minTranslateX = chartX;
  const translateX = Math.max(
    minTranslateX,
    Math.min(
      x <= halfChart
        ? chartRect.x + window.scrollX + x + offset
        : chartRect.x + window.scrollX + x - offset - tooltipDimensions.width,
      maxTranslateX,
    ),
  ).toString();

  const maxTranslateY =
    chartY + chartHeight - tooltipDimensions.height - offset;
  const translateY = Math.min(
    y + offset + chartRect.y + window.scrollY,
    maxTranslateY,
  ).toString();

  const tooltipContent = (
    <div
      ref={setTooltipRef}
      className="pointer-events-none visible absolute left-0 top-0 z-10 max-h-[450px] text-wrap rounded bg-white/95 px-3 py-2 outline outline-1 outline-primary transition-transform duration-700"
      style={{ transform: `translate(${translateX}px, ${translateY}px)` }}
    >
      <Content
        breakdownBy={breakdownBy}
        data={data}
        unit={unit}
        label={label as string}
        highlight={highlight}
      />
    </div>
  );

  return (
    <div className="absolute left-0 top-0">
      {ReactDOM.createPortal(tooltipContent, document.body)}
    </div>
  );
};
