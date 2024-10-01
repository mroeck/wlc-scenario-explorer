import { GRAPH_FONT_SIZE } from "@/lib/constants";
import { ColorCube } from "../Legend/ColorCube";
import { cn, getColor } from "@/lib/utils";
import type {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type { Attribute } from "@/lib/types";
import type { UnitMinified } from "../types";
import type { z } from "zod";
import type { HighlightSchema } from "@/lib/schemas";

type ContentProps = {
  label: string;
  unit: UnitMinified;
  data: Payload<ValueType, NameType>[];
  breakdownBy: Attribute;
  highlight: z.infer<typeof HighlightSchema> | undefined;
};
export const Content = ({
  label,
  unit,
  data,
  breakdownBy,
  highlight,
}: ContentProps) => {
  const totalValue = data.reduce(
    (acc, item) => acc + (item.value as number),
    0,
  );

  const isSomethingHighlighted = !!highlight;

  return (
    <>
      <div className="flex w-max flex-col text-left">
        <span style={{ fontSize: GRAPH_FONT_SIZE }}>{label}</span>
        <span
          className="py-1 text-left font-semibold"
          style={{ fontSize: GRAPH_FONT_SIZE }}
        >
          Unit: {unit}
        </span>
        <span className="text-left" style={{ fontSize: GRAPH_FONT_SIZE }}>
          From top to bottom on graph
        </span>
      </div>
      <div className="pb-5"></div>
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
              const isHighlight = item.name === highlight;

              return (
                <li key={item.name} style={{ fontSize: GRAPH_FONT_SIZE }}>
                  <div
                    className={cn(
                      "relative flex w-max items-center gap-1",
                      isSomethingHighlighted &&
                        isHighlight &&
                        "before:absolute before:left-1/2 before:top-0 before:h-full before:w-[calc(100%+20px)] before:-translate-x-1/2 before:rounded-full before:bg-slate-200 before:content-['']",
                    )}
                  >
                    <div>
                      <ColorCube
                        color={getColor({
                          breakdownBy,
                          option:
                            typeof item.dataKey === "string"
                              ? item.dataKey
                              : "",
                        })}
                        isHighlight={isHighlight}
                        isSomethingHighlighted={isSomethingHighlighted}
                      />
                    </div>
                    <span className="z-0">{item.name}:</span>
                    <span className="z-0 font-bold">
                      {value.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}{" "}
                    </span>
                    <span className="z-0">({percentage.toFixed(2)}%)</span>
                  </div>
                </li>
              );
            })
            .reverse()}
      </ul>
    </>
  );
};
