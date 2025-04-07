import type { Props } from "recharts/types/component/Legend";
import { ColorCube } from "./ColorCube";
import { cn, getColor, getValueLabel, groupByCategory } from "@/lib/utils";
import { colors } from "../colors";
import {
  COLOR_LEGEND_TESTID,
  DATA_TABS_NAMES,
  GRAPH_FONT_SIZE,
  NO_SCENARIO_SELECTED_LABEL,
  ROUTES,
  SCENARIO_A_AND_B,
  SCENARIO_A_KEY_PREFIX,
  SCENARIO_A_LABEL,
  SCENARIO_B_KEY_PREFIX,
  SCENARIO_B_LABEL,
  SCENARIO_TO_ACRONYM,
} from "@/lib/constants";
import { getRouteApi } from "@tanstack/react-router";
import type { Attribute } from "@/lib/types";
import type { Payload } from "recharts/types/component/DefaultLegendContent";
import React from "react";
import type { BreakdownByOptions } from "../graphs/types";
import { StringSchema } from "@/lib/schemas";
import { ColorLine } from "./ColorLine";
import { onElementClick } from "../graphs/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const route = getRouteApi(ROUTES.DASHBOARD);

const removeDuplicates = (
  arr: Exclude<CustomLegendProps["payload"], typeof undefined>,
) => {
  const seen = new Set();
  return arr.filter((item) => {
    const valueAsString = StringSchema.parse(item.value);

    item.value = valueAsString
      .replace(SCENARIO_A_KEY_PREFIX, "")
      .replace(SCENARIO_B_KEY_PREFIX, "");

    const duplicate = seen.has(item.value);
    seen.add(item.value);
    return !duplicate;
  });
};
type LegendData = {
  payload: Payload[];
  isUpdated: {
    A: boolean;
    B: boolean;
  };
};

const COLOR_LEGEND_QUERY_KEY = "COLOR_LEGEND_QUERY_KEY";
const DEFAULT_LEGEND_PAYLOAD: Payload[] = [];
const DEFAULT_LEGEND_DATA: LegendData = {
  payload: DEFAULT_LEGEND_PAYLOAD,
  isUpdated: {
    A: false,
    B: false,
  },
};

export type CustomLegendProps = Pick<Props, "payload"> & {
  className?: string;
  scenarioId?: "A" | "B";
};
export const CustomLegend = ({
  payload,
  className,
  scenarioId,
}: CustomLegendProps) => {
  const {
    display,
    attribute,
    highlights,
    scenarioA,
    scenarioB,
    dataTab,
    breakdownBy,
    dividedBy,
    filters,
    indicator,
  } = route.useSearch({
    select: (search) => ({
      display: search.display,
      attribute: search.breakdownBy,
      highlights: search.highlights,
      scenarioA: search.scenarioA,
      scenarioB: search.scenarioB,
      dataTab: search.dataTab,
      breakdownBy: search.breakdownBy,
      dividedBy: search.dividedBy,
      filters: search.filters,
      indicator: search.indicator,
    }),
  });

  const queryClient = useQueryClient();
  const hash = {
    breakdownBy,
    dividedBy,
    filters,
    indicator,
    scenarioA,
    scenarioB,
  };

  const { data: legendData } = useQuery({
    queryKey: [COLOR_LEGEND_QUERY_KEY, hash],
    initialData: DEFAULT_LEGEND_DATA,
    staleTime: Infinity,
    gcTime: Infinity,
    networkMode: "always",
    retry: 0,
  });

  if (!!scenarioId && !legendData.isUpdated[scenarioId]) {
    queryClient.setQueryData<LegendData>(
      [COLOR_LEGEND_QUERY_KEY, hash],
      (old) => {
        const currentData = old ?? DEFAULT_LEGEND_DATA;
        const currentPayload = currentData.payload;
        const newPayload = payload ?? DEFAULT_LEGEND_PAYLOAD;

        return {
          payload:
            newPayload.length > currentPayload.length
              ? newPayload
              : currentPayload,
          isUpdated: {
            ...currentData.isUpdated,
            [scenarioId]: true,
          },
        } satisfies LegendData;
      },
    );
  }

  const isLineGraph = dataTab === DATA_TABS_NAMES.lineChart;
  const finalPayload =
    dataTab === "Stacked Bar Graph" ? payload : legendData.payload;
  const data = removeDuplicates(finalPayload ?? []);
  const amountOfOptions = data.length;

  const groupedData = groupByCategory({ values: data });
  const hasCategory = Object.keys(groupedData).length > 0;

  const labelA = SCENARIO_TO_ACRONYM[scenarioA] || SCENARIO_A_LABEL;
  const labelB = scenarioB
    ? SCENARIO_TO_ACRONYM[scenarioB] || SCENARIO_B_LABEL
    : NO_SCENARIO_SELECTED_LABEL;

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
        <h3
          className="font-semibold text-gray-800"
          style={{ fontSize: GRAPH_FONT_SIZE }}
        >
          Color legend{" "}
          <span className="font-normal italic">(click to highlight)</span>
        </h3>
        {hasCategory ? (
          <div className="grid max-w-prose grid-cols-[max-content,1fr] gap-x-2 px-2">
            {Object.entries(groupedData)
              .sort((a, b) => b[0].localeCompare(a[0]))
              .reverse()
              .map(([category, values]) => (
                <React.Fragment key={category}>
                  <h4 className="text-sm">{category}:</h4>
                  <div className="">
                    <ColorLegendItemAll
                      breakdownBy={attribute}
                      data={values.reverse()}
                      highlights={highlights}
                      amountOfOptions={amountOfOptions}
                    />
                  </div>
                </React.Fragment>
              ))}
          </div>
        ) : (
          <ColorLegendItemAll
            breakdownBy={attribute}
            data={data.reverse()}
            highlights={highlights}
            amountOfOptions={amountOfOptions}
          />
        )}
      </section>
      <section
        className={cn(
          "flex min-w-36 flex-col gap-1",
          !scenarioB || display !== SCENARIO_A_AND_B ? "hidden" : "",
        )}
      >
        <h3
          className="font-semibold text-gray-800"
          style={{ fontSize: GRAPH_FONT_SIZE }}
        >
          Pattern legend:
        </h3>
        <ul className="flex max-w-[50ch] flex-col flex-wrap gap-x-6 px-2">
          <li className="flex items-center gap-1 text-gray-800">
            {isLineGraph ? (
              <ColorLine color={colors[0] as string} lineType="solid" />
            ) : (
              <ColorCube color={colors[0]} />
            )}
            <span style={{ fontSize: GRAPH_FONT_SIZE }}>{labelA}</span>
          </li>
          <li className="flex items-center gap-1 text-gray-800">
            {isLineGraph ? (
              <ColorLine color={colors[0] as string} lineType="dashed" />
            ) : (
              <ColorCube color={colors[0]} showPattern />
            )}
            <span style={{ fontSize: GRAPH_FONT_SIZE }}>{labelB}</span>
          </li>
        </ul>
      </section>
    </div>
  );
};

type ColorLegendItemAllProps = {
  data: Payload[];
  breakdownBy: Attribute;
  highlights: BreakdownByOptions[] | undefined;
  amountOfOptions: number;
};
function ColorLegendItemAll({
  data,
  breakdownBy,
  highlights,
  amountOfOptions,
}: ColorLegendItemAllProps) {
  const navigate = route.useNavigate();
  const isSomethingHighlighted = !!highlights && highlights.length > 0;

  return (
    <ol className="flex flex-wrap justify-items-start gap-x-6">
      {data.map((item) => {
        const option = typeof item.value === "string" ? item.value : "";
        const highlightsAsString: string[] | undefined = highlights;
        const isHighlight = highlightsAsString?.includes(option) === true;
        const label = getValueLabel({ value: item.value as string });

        return (
          <li
            key={item.dataKey as string}
            className={cn(
              "relative flex items-center gap-1 hover:cursor-pointer",
              isSomethingHighlighted &&
                isHighlight &&
                "before:absolute before:left-1/2 before:top-0 before:h-full before:w-[calc(100%+20px)] before:-translate-x-1/2 before:rounded-full before:bg-slate-200 before:content-['']",
              isSomethingHighlighted && !isHighlight && "opacity-50",
            )}
            onClick={() => {
              onElementClick({
                newHighlight: option as BreakdownByOptions,
                navigate,
                amountOfOptions,
              });
            }}
          >
            <ColorCube
              color={getColor({
                breakdownBy,
                option,
              })}
              isHighlight={isHighlight}
              isSomethingHighlighted={isSomethingHighlighted}
            />
            <span
              className="z-0 whitespace-nowrap text-sm text-gray-800 first-letter:uppercase"
              style={{ fontSize: GRAPH_FONT_SIZE }}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
