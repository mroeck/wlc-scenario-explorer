import { cn, getColor } from "@/lib/utils";
import type { TooltipProps } from "recharts";
import type {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { ColorCube } from "./Legend/ColorCube";
import { GRAPH_FONT_SIZE } from "@/lib/constants";
import type { Attribute, Unit } from "@/lib/types";

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
> & { unit: Unit; breakdownBy: Attribute };
export const CustomTooltip = ({
  active,
  payload,
  label,
  unit,
  breakdownBy,
}: CustomTooltipProps) => {
  if (!active || payload == null || payload.length < 1) return null;

  const data = removeDuplicates(payload);

  return (
    <div
      className={cn(
        "text-wrap rounded bg-white/95 px-3 py-2 outline outline-1 outline-primary",
      )}
    >
      <div className={cn("mx-auto flex w-max flex-col text-center ")}>
        <span style={{ fontSize: GRAPH_FONT_SIZE }}>{label}</span>
        <span
          className={cn("pb-2 text-left")}
          style={{ fontSize: GRAPH_FONT_SIZE }}
        >
          From top to bottom on graph in {unit}
        </span>
      </div>
      <ul
        className={cn("grid grid-flow-col grid-rows-[repeat(15,auto)] gap-x-5")}
      >
        {data.reverse().map((item) => {
          return (
            <li
              key={item.name}
              className={cn("flex items-center gap-1 ")}
              style={{ fontSize: GRAPH_FONT_SIZE }}
            >
              <div>
                <ColorCube
                  color={getColor({
                    breakdownBy,
                    option:
                      typeof item.dataKey === "string" ? item.dataKey : "",
                  })}
                />
              </div>
              <span>{item.name}:</span>
              <span className={cn("font-bold")}>
                {item.value?.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
