import {
  GRAPH_FONT_SIZE,
  ROUTES,
  SCENARIO_A_KEY_PREFIX,
  SCENARIO_A_LABEL,
  SCENARIO_B_KEY_PREFIX,
  SCENARIO_TO_ACRONYM,
  SCENARIO_B_LABEL,
  SCENARIO_B_ACRONYM,
} from "@/lib/constants";
import { ColorCube } from "../Legend/ColorCube";
import { cn, getColor, getValueLabel } from "@/lib/utils";
import type {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type { Attribute } from "@/lib/types";
import type { UnitMinified } from "../types";
import { z } from "zod";
import { NumberSchema, StringSchema } from "@/lib/schemas";
import { getRouteApi } from "@tanstack/react-router";
import { Versus } from "./Versus";
import { LABEL_TO_VALUE } from "@/lib/shared_with_backend/constants";

type DataItem = Payload<ValueType, NameType>;

const getScenarioTotals = (data: DataItem[]) => {
  if (!data.length) {
    return {
      totalValue: 0,
      scenarioATotal: 0,
      scenarioBTotal: 0,
      areDataMerged: false,
    };
  }

  const item = data[0] as Exclude<(typeof data)[0], undefined>;
  const firstItemName = StringSchema.parse(item.name);
  const areDataMerged =
    firstItemName.includes(SCENARIO_A_KEY_PREFIX) ||
    firstItemName.includes(SCENARIO_B_KEY_PREFIX);

  const totalValue = data.reduce(
    (acc, item) => acc + (item.value as number),
    0,
  );

  if (!areDataMerged) {
    return {
      totalValue,
      scenarioATotal: 0,
      scenarioBTotal: 0,
      areDataMerged,
    };
  }

  const scenarioATotal = data.reduce(
    (acc, item) =>
      (item.name as string).includes(SCENARIO_A_KEY_PREFIX)
        ? acc + (item.value as number)
        : acc,
    0,
  );

  const scenarioBTotal = data.reduce(
    (acc, item) =>
      (item.name as string).includes(SCENARIO_B_KEY_PREFIX)
        ? acc + (item.value as number)
        : acc,
    0,
  );

  return {
    totalValue,
    scenarioATotal,
    scenarioBTotal,
    areDataMerged,
  };
};

const ScenariosValuesSchema = z.object({
  [SCENARIO_A_LABEL]: NumberSchema.optional(),
  [SCENARIO_B_LABEL]: NumberSchema.optional(),
});

type Scenarios =
  | typeof SCENARIO_A_LABEL
  | typeof SCENARIO_B_LABEL
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {});

type RestructureDataArgs = {
  data: { name?: NameType; value?: ValueType }[];
};
function restructureData({ data }: RestructureDataArgs) {
  type Item = Omit<DataItem, "value"> & {
    value: Record<Scenarios, ValueType | undefined>;
  };

  type Result = {
    [type: string]: Item;
  };

  const result: Result = {};

  data.forEach((item) => {
    const name = StringSchema.parse(item.name);
    const [scenario, type] = name.split(".") as [string, string];

    if (!result[type]) {
      result[type] = {
        name: type,
        value: {} as Item["value"],
      };
    }

    result[type].value[scenario] = item.value;
  });

  return Object.values(result);
}

const route = getRouteApi(ROUTES.DASHBOARD);

const MAX_ROWS = 15;

type ContentProps = {
  label: string;
  unit: UnitMinified;
  data: DataItem[];
  breakdownBy: Attribute;
};
export const Content = ({ label, unit, data, breakdownBy }: ContentProps) => {
  const { totalValue, scenarioATotal, scenarioBTotal, areDataMerged } =
    getScenarioTotals(data);

  const { scenarioA, scenarioB, highlights } = route.useSearch({
    select: (search) => ({
      scenarioA: search.scenarioA,
      scenarioB: search.scenarioB,
      highlights: search.highlights,
    }),
  });

  const isSomethingHighlighted = !!highlights && highlights.length > 0;
  const acronymA = SCENARIO_TO_ACRONYM[scenarioA];
  const acronymB = scenarioB
    ? SCENARIO_TO_ACRONYM[scenarioB]
    : SCENARIO_B_ACRONYM;

  const finalData = areDataMerged ? restructureData({ data }) : data;
  const hasGridOverflow = finalData.length > MAX_ROWS;

  return (
    <>
      <div className="flex w-max flex-col text-left text-gray-800">
        <div className="leading-5">
          <span>Year:</span>{" "}
          <span className="font-bold" style={{ fontSize: GRAPH_FONT_SIZE }}>
            {label}
          </span>
        </div>
        <div
          className="text-left leading-5"
          style={{ fontSize: GRAPH_FONT_SIZE }}
        >
          <span>Unit:</span> <span className="font-semibold">{unit}</span>
        </div>
      </div>
      <div className="pb-5"></div>
      <ul
        className={cn(
          "grid grid-flow-col gap-x-5 text-gray-800",
          areDataMerged
            ? "grid-cols-[repeat(4,max-content)]"
            : "grid-cols-[repeat(2,max-content)]",
        )}
        style={{
          gridTemplateRows: `repeat(${MAX_ROWS}, auto)`,
        }}
      >
        {areDataMerged ? (
          <li
            className={cn(
              "grid min-w-0 grid-cols-subgrid gap-x-1 text-left text-sm",
              hasGridOverflow ? "col-span-8" : "col-span-4",
            )}
          >
            <span></span>
            <span className="font-bold">{acronymA}</span>{" "}
            <Versus className="mx-0 text-center" />{" "}
            <span className="font-bold">{acronymB}</span>
            {hasGridOverflow ? (
              <>
                <span></span>
                <span className="font-bold">{acronymA}</span>{" "}
                <Versus className="mx-0 text-center" />{" "}
                <span className="font-bold">{acronymB}</span>
              </>
            ) : null}
          </li>
        ) : null}
        {finalData.length > 1 &&
          finalData
            .map((item) => {
              if (!areDataMerged) {
                const value = item.value as number;
                const name = getValueLabel({ value: item.name as string });
                const percentage = totalValue ? (value / totalValue) * 100 : 0;
                return {
                  name,
                  value,
                  percentage,
                  dataKey: item.dataKey,
                };
              } else {
                const values = ScenariosValuesSchema.parse(item.value);
                const scenarioAValue = values[SCENARIO_A_LABEL] || 0;
                const scenarioBValue = values[SCENARIO_B_LABEL] || 0;
                const percentageA = scenarioATotal
                  ? (scenarioAValue / scenarioATotal) * 100
                  : 0;
                const percentageB = scenarioBTotal
                  ? (scenarioBValue / scenarioBTotal) * 100
                  : 0;
                const name = getValueLabel({ value: item.name as string });

                return {
                  name: name,
                  scenarioAValue,
                  scenarioBValue,
                  percentageA,
                  percentageB,
                  dataKey: item.name,
                };
              }
            })
            .map((item) => {
              if (item.name === "Undefined") return null;

              const value = LABEL_TO_VALUE[item.name] ?? item.name;
              const isHighlight = !!highlights && highlights.includes(value);
              const isOneScenario = item.percentage != null;

              return (
                <li
                  key={item.name}
                  style={{
                    fontSize: GRAPH_FONT_SIZE,
                  }}
                  className={cn(
                    "relative w-max items-center gap-1",
                    "grid min-w-0 grid-cols-subgrid",
                    "gap-x-1",
                    isOneScenario ? "col-span-2" : "col-span-4",
                    isSomethingHighlighted &&
                      isHighlight &&
                      "before:absolute before:left-1/2 before:top-0 before:-z-10 before:h-full before:w-[calc(100%+20px)] before:-translate-x-1/2 before:rounded-full before:border before:border-solid before:border-white before:bg-slate-200 before:content-['']",
                    isSomethingHighlighted && !isHighlight && "opacity-50",
                  )}
                >
                  {isOneScenario ? (
                    <>
                      <div className="flex items-center gap-1">
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
                        <span className="z-0">{item.name}: </span>
                      </div>
                      <div>
                        <span className="z-0 font-bold">
                          {item.value.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })}{" "}
                        </span>
                        <span className="z-0">
                          ({item.percentage.toFixed(2)}%)
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1">
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
                        <span className="z-0">{item.name}: </span>
                      </div>
                      <div>
                        <span className="z-0 font-bold">
                          {item.scenarioAValue.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })}{" "}
                        </span>
                        <span className="z-0">
                          ({item.percentageA.toFixed(2)}%)
                        </span>
                      </div>
                      <Versus className="mx-1" />
                      <div>
                        <span className="z-0 font-bold">
                          {item.scenarioBValue.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })}{" "}
                        </span>
                        <span className="z-0">
                          ({item.percentageB.toFixed(2)}%)
                        </span>
                      </div>
                    </>
                  )}
                </li>
              );
            })
            .reverse()}
        <li
          className={cn(
            "col-span-2 grid min-w-0 grid-cols-subgrid gap-x-1 border-t border-solid border-primary text-left text-sm",
            areDataMerged ? "col-span-4" : "col-span-2",
          )}
          style={{ fontSize: GRAPH_FONT_SIZE }}
        >
          {areDataMerged ? (
            <>
              <span className="font-bold">Total:</span>{" "}
              <span className="font-bold">
                {scenarioATotal.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}{" "}
                <span className="font-normal">(100%)</span>
              </span>
              <Versus className="mx-1" />
              <span className="font-bold">
                {scenarioBTotal.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}{" "}
                <span className="font-normal">(100%)</span>
              </span>
            </>
          ) : (
            <>
              <span className="font-bold">Total:</span>{" "}
              <span className="font-bold">
                {totalValue.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}{" "}
                <span className="font-normal">(100%)</span>
              </span>
            </>
          )}
        </li>
      </ul>
    </>
  );
};
