import { GRAPH_FONT_SIZE } from "@/lib/constants";
import { ColorCube } from "../Legend/ColorCube";
import { getColor } from "@/lib/utils";
import type {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type { Attribute, IndicatorUnit } from "@/lib/types";

type ContentProps = {
  label: string;
  indicatorUnit: IndicatorUnit;
  data: Payload<ValueType, NameType>[];
  breakdownBy: Attribute;
};
export const Content = ({
  label,
  indicatorUnit,
  data,
  breakdownBy,
}: ContentProps) => {
  const totalValue = data.reduce(
    (acc, item) => acc + (item.value as number),
    0,
  );

  return (
    <>
      <div className="mx-auto flex w-max flex-col text-center">
        <span style={{ fontSize: GRAPH_FONT_SIZE }}>{label}</span>
        <span className="pb-2 text-left" style={{ fontSize: GRAPH_FONT_SIZE }}>
          From top to bottom on graph in {indicatorUnit}
        </span>
      </div>
      <div style={{ fontSize: GRAPH_FONT_SIZE }}>
        Total:{" "}
        <span className="font-bold">
          {totalValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}{" "}
        </span>
        (100%)
      </div>
      <ul className="grid grid-flow-col grid-rows-[repeat(15,auto)] gap-x-5">
        {data.length > 1 &&
          data
            .map((item) => {
              const value = item.value as number;
              const percentage = totalValue ? (value / totalValue) * 100 : 0;

              return (
                <li
                  key={item.name}
                  className="flex items-center gap-1"
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
                  <span className="font-bold">
                    {value.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}{" "}
                  </span>
                  ({percentage.toFixed(2)}%)
                </li>
              );
            })
            .reverse()}
      </ul>
    </>
  );
};
