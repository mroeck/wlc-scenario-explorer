import type { Props } from "recharts/types/component/Legend";
import { ColorCube } from "./ColorCube";
import { cn, getColor } from "@/lib/utils";
import { colors } from "../colors";
import {
  COLOR_LEGEND_TESTID,
  GRAPH_FONT_SIZE,
  ROUTES,
  SCENARIO_A_AND_B,
} from "@/lib/constants";
import { getRouteApi } from "@tanstack/react-router";

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
  className: string;
};
export const CustomLegend = ({ payload, className }: CustomLegendProps) => {
  const { display, attribute } = route.useSearch();
  if (payload == null) return null;

  const data = removeDuplicates(payload);

  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-5 lg:flex-row",
        className,
      )}
    >
      <section
        className={cn("flex flex-col gap-1")}
        data-testid={COLOR_LEGEND_TESTID}
      >
        <h3 style={{ fontSize: GRAPH_FONT_SIZE }}>Color legend:</h3>
        <ul className={cn("flex max-w-[50ch] flex-wrap gap-x-6")}>
          {data.reverse().map((item, index) => (
            <li key={index} className={cn("flex flex-1 items-center gap-1")}>
              <ColorCube
                color={getColor({
                  breakdownBy: attribute,
                  option: typeof item.dataKey === "string" ? item.dataKey : "",
                })}
              />
              <span
                className={cn("whitespace-nowrap text-sm")}
                style={{ fontSize: GRAPH_FONT_SIZE }}
              >
                {item.value}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section
        className={cn(
          "flex flex-col gap-1",
          display !== SCENARIO_A_AND_B && "hidden",
        )}
      >
        <h3 style={{ fontSize: GRAPH_FONT_SIZE }}>Opacity legend:</h3>
        <ul className={cn("flex max-w-[50ch] flex-wrap gap-x-6")}>
          <li className={cn("flex items-center gap-1")}>
            <ColorCube color={colors[0]} />
            <span style={{ fontSize: GRAPH_FONT_SIZE }}>Scenario A</span>
          </li>
          <li className={cn("flex items-center gap-1")}>
            <ColorCube color={colors[0]} className={cn("opacity-50")} />
            <span style={{ fontSize: GRAPH_FONT_SIZE }}>Scenario B</span>
          </li>
        </ul>
      </section>
    </div>
  );
};
