import type { Props } from "recharts/types/component/Legend";
import { ColorCube } from "./ColorCube";
import { cn, getColor, groupByCategory } from "@/lib/utils";
import { colors } from "../colors";
import {
  COLOR_LEGEND_TESTID,
  GRAPH_FONT_SIZE,
  ROUTES,
  SCENARIO_A_AND_B,
  SCENARIO_A_LABEL,
  SCENARIO_B_LABEL,
} from "@/lib/constants";
import { getRouteApi } from "@tanstack/react-router";
import type { Attribute } from "@/lib/types";
import type { Payload } from "recharts/types/component/DefaultLegendContent";
import React from "react";

const route = getRouteApi(ROUTES.DASHBOARD);

const removeDuplicates = (
  arr: Exclude<CustomLegendProps["payload"], typeof undefined>,
) => {
  const seen = new Set();
  return arr.filter((item) => {
    const duplicate = seen.has(item.value);
    seen.add(item.value);
    return !duplicate;
  });
};

export type CustomLegendProps = Pick<Props, "payload"> & {
  className?: string;
};
export const CustomLegend = ({ payload, className }: CustomLegendProps) => {
  const { display, attribute } = route.useSearch({
    select: (search) => ({
      display: search.display,
      attribute: search.attribute,
    }),
  });
  if (payload == null) return null;

  const data = removeDuplicates(payload);

  const groupedData = groupByCategory({ values: data });
  const hasCategory = Object.keys(groupedData).length > 0;

  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-5 pl-[60px] pt-4 lg:flex-row",
        className,
      )}
    >
      <section
        className="flex flex-col gap-1"
        data-testid={COLOR_LEGEND_TESTID}
      >
        <h3 className="font-semibold" style={{ fontSize: GRAPH_FONT_SIZE }}>
          Color legend:
        </h3>
        {hasCategory ? (
          <div className="grid max-w-prose grid-cols-[max-content,1fr] gap-x-2 px-2">
            {Object.entries(groupedData)
              .reverse()
              .map(([category, values]) => (
                <React.Fragment key={category}>
                  <h4 className="text-sm">{category}:</h4>
                  <div className="">
                    <ColorLegendItemAll
                      breakdownBy={attribute}
                      data={values.reverse()}
                    />
                  </div>
                </React.Fragment>
              ))}
          </div>
        ) : (
          <ColorLegendItemAll breakdownBy={attribute} data={data} />
        )}
      </section>
      <section
        className={cn(
          "flex min-w-36 flex-col gap-1",
          display !== SCENARIO_A_AND_B && "hidden",
        )}
      >
        <h3 className="font-semibold" style={{ fontSize: GRAPH_FONT_SIZE }}>
          Opacity legend:
        </h3>
        <ul className="flex max-w-[50ch] flex-col flex-wrap gap-x-6 px-2">
          <li className="flex items-center gap-1">
            <ColorCube color={colors[0]} />
            <span style={{ fontSize: GRAPH_FONT_SIZE }}>
              {SCENARIO_A_LABEL}
            </span>
          </li>
          <li className="flex items-center gap-1">
            <ColorCube color={colors[0]} className="opacity-50" />
            <span style={{ fontSize: GRAPH_FONT_SIZE }}>
              {SCENARIO_B_LABEL}
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
};

type ColorLegendItemAllProps = {
  data: Payload[];
  breakdownBy: Attribute;
};
function ColorLegendItemAll({ data, breakdownBy }: ColorLegendItemAllProps) {
  return (
    <ol className="flex flex-wrap justify-items-start gap-x-6">
      {data.map((item, index) => (
        <li key={index} className="flex items-center gap-1">
          <ColorCube
            color={getColor({
              breakdownBy,
              option: typeof item.dataKey === "string" ? item.dataKey : "",
            })}
          />
          <span
            className="whitespace-nowrap text-sm"
            style={{ fontSize: GRAPH_FONT_SIZE }}
          >
            {item.value}
          </span>
        </li>
      ))}
    </ol>
  );
}
