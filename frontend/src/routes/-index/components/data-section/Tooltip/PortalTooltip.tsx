import { useEffect, useRef, useState, type Ref } from "react";
import ReactDOM from "react-dom";
import { cn } from "@/lib/utils";
import type { TooltipProps } from "recharts";
import type {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type { Attribute, IndicatorUnit } from "@/lib/types";
import { Content } from "./Content";

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
  indicatorUnit: IndicatorUnit;
  breakdownBy: Attribute;
  chartRef: Ref<HTMLDivElement>;
};

export const PortalTooltip = ({
  active,
  payload,
  label,
  indicatorUnit,
  breakdownBy,
  coordinate,
  offset = 0,
  chartRef,
}: PortalTooltipProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [boundingRect, setBoundingRect] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const isDefaultCoordinate = boundingRect.x === 0 && boundingRect.y === 0;
  const [tooltipWidth, setTooltipWidth] = useState(0);

  useEffect(() => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setBoundingRect({ x: rect.x, y: rect.y });
      setTooltipWidth(rect.width);
    }
    if (contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      setTooltipWidth(rect.width);
    }
  }, [active]);

  if (!active || payload == null || payload.length < 1) return null;

  const areCoordinatesDefined =
    !!coordinate && !!coordinate.x && !!coordinate.y;
  if (!areCoordinatesDefined) return null;

  const data = removeDuplicates(payload);
  const { x = 0, y = 0 } = coordinate;

  const chartRect = (
    chartRef as React.MutableRefObject<HTMLDivElement>
  ).current.getBoundingClientRect();
  const chartX = chartRect.x || 0;
  const chartWidth = chartRect.width || 0;

  const maxTranslateX = chartX + chartWidth - tooltipWidth - offset;
  const translateX = Math.min(
    x + offset + boundingRect.x,
    maxTranslateX,
  ).toString();
  const translateY = (y + offset + boundingRect.y).toString();

  const tooltipContent = (
    <div
      ref={contentRef}
      className="pointer-events-none visible absolute left-0 top-0 z-10 text-wrap rounded bg-white/95 px-3 py-2 outline outline-1 outline-primary transition-transform duration-700"
      style={{ transform: `translate(${translateX}px, ${translateY}px)` }}
    >
      <Content
        breakdownBy={breakdownBy}
        data={data}
        indicatorUnit={indicatorUnit}
        label={label as string}
      />
    </div>
  );

  return (
    <div ref={wrapperRef} className={cn("absolute left-0 top-0")}>
      {!isDefaultCoordinate &&
        ReactDOM.createPortal(tooltipContent, document.body)}
    </div>
  );
};
