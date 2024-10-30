import {
  GRAPH_FONT_SIZE,
  ROUTES,
  SCENARIO_A_ACRONYM,
  SCENARIO_A_KEY_PREFIX,
  SCENARIO_A_LABEL,
  SCENARIO_B_ACRONYM,
  SCENARIO_B_KEY_PREFIX,
  SCENARIO_TO_ACRONYM,
  SCENARIO_B_LABEL,
} from "@/lib/constants";
import { ColorCube } from "../Legend/ColorCube";
import { cn, getColor } from "@/lib/utils";
import type {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type { Attribute } from "@/lib/types";
import type { UnitMinified } from "../types";
import { z } from "zod";
import {
  NumberSchema,
  StringSchema,
  type HighlightSchema,
} from "@/lib/schemas";
import { getRouteApi } from "@tanstack/react-router";
import { Versus } from "./Versus";

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

  const firstItemName = StringSchema.parse(data[0].name);
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
    const [scenario, type] = name.split(".");

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

type ContentProps = {
  label: string;
  unit: UnitMinified;
  data: DataItem[];
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
  const { totalValue, scenarioATotal, scenarioBTotal, areDataMerged } =
    getScenarioTotals(data);

  const { scenarioA, scenarioB } = route.useSearch({
    select: (search) => ({
      scenarioA: search.scenarioA,
      scenarioB: search.scenarioB,
    }),
  });

  const isSomethingHighlighted = !!highlight;
  type Keys = keyof typeof SCENARIO_TO_ACRONYM;
  const acronymA = SCENARIO_TO_ACRONYM[scenarioA as Keys] ?? SCENARIO_A_ACRONYM;
  const acronymB = SCENARIO_TO_ACRONYM[scenarioB as Keys] ?? SCENARIO_B_ACRONYM;

  const finalData = areDataMerged ? restructureData({ data }) : data;

  return (
    <>
      <div className="flex w-max flex-col text-left">
        <span>
          Year:{" "}
          <span className="font-bold" style={{ fontSize: GRAPH_FONT_SIZE }}>
            {label}
          </span>
        </span>
        <span className="py-1 text-left" style={{ fontSize: GRAPH_FONT_SIZE }}>
          Unit: <span className="font-semibold">{unit}</span>
        </span>
        {areDataMerged ? (
          <span
            className="py-1 text-left capitalize"
            style={{ fontSize: GRAPH_FONT_SIZE }}
          >
            Scenarios: <span className="font-bold">{acronymA}</span> <Versus />{" "}
            <span className="font-bold">{acronymB}</span>
          </span>
        ) : null}
      </div>
      <div className="pb-5"></div>

      {areDataMerged ? (
        <div style={{ fontSize: GRAPH_FONT_SIZE }}>
          Total:{" "}
          <span className="font-bold">
            {scenarioATotal.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}{" "}
          </span>
          (100%) <Versus />
          <span className="font-bold">
            {scenarioBTotal.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}{" "}
          </span>
          (100%)
        </div>
      ) : (
        <div style={{ fontSize: GRAPH_FONT_SIZE }}>
          Total:{" "}
          <span className="font-bold">
            {totalValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}{" "}
          </span>
          (100%)
        </div>
      )}

      <ul className="grid grid-flow-col grid-rows-[repeat(15,auto)] gap-x-5">
        {finalData.length > 1 &&
          finalData
            .map((item) => {
              if (!areDataMerged) {
                const value = item.value as number;
                const percentage = totalValue ? (value / totalValue) * 100 : 0;

                return {
                  name: item.name,
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

                return {
                  name: item.name,
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

              const isHighlight = item.name === highlight;
              const isOneScenario = !!item.percentage;

              return (
                <li key={item.name} style={{ fontSize: GRAPH_FONT_SIZE }}>
                  <div
                    className={cn(
                      "relative flex w-max items-center gap-1",
                      isSomethingHighlighted &&
                        isHighlight &&
                        "before:absolute before:left-1/2 before:top-0 before:h-full before:w-[calc(100%+20px)] before:-translate-x-1/2 before:rounded-full before:bg-slate-200 before:content-['']",
                      isSomethingHighlighted && !isHighlight && "opacity-50",
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
                    {isOneScenario ? (
                      <div className="z-0">
                        <span className="z-0">{item.name}:</span>
                        <span className="z-0 font-bold">
                          {item.value.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })}{" "}
                        </span>
                        <span className="z-0">
                          ({item.percentage.toFixed(2)}%)
                        </span>
                      </div>
                    ) : (
                      <div className="z-0">
                        <span className="z-0">{item.name}: </span>
                        <span className="z-0 font-bold">
                          {item.scenarioAValue?.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })}{" "}
                        </span>
                        <span className="z-0">
                          ({item.percentageA?.toFixed(2)}%)
                        </span>
                        <Versus />
                        <span className="z-0 font-bold">
                          {item.scenarioBValue?.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })}{" "}
                        </span>
                        <span className="z-0">
                          ({item.percentageB?.toFixed(2)}%)
                        </span>
                      </div>
                    )}
                  </div>
                </li>
              );
            })
            .reverse()}
      </ul>
    </>
  );
};
