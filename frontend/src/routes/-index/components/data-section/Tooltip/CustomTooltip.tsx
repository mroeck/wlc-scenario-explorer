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

type CustomTooltipProps = Pick<
  TooltipProps<ValueType, NameType>,
  "active" | "payload" | "label"
> & { indicatorUnit: IndicatorUnit; breakdownBy: Attribute };
export const CustomTooltip = ({
  active,
  payload,
  label,
  indicatorUnit,
  breakdownBy,
}: CustomTooltipProps) => {
  if (!active || payload == null || payload.length < 1) return null;

  const data = removeDuplicates(payload);

  return (
    <div className="text-wrap rounded bg-white/95 px-3 py-2 outline outline-1 outline-primary">
      <Content
        breakdownBy={breakdownBy}
        data={data}
        indicatorUnit={indicatorUnit}
        label={label as string}
      />
    </div>
  );
};
