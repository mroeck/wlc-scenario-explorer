import { z } from "zod";
import {
  BREAKDOWN_BY_OPTIONS,
  type FILTERS,
  MAX_YEAR,
  MIN_YEAR,
  SCENARIOS_OPTIONS,
  INDICATORS,
  YEAR_KEY,
  DIVIDED_BY_OPTIONS,
  TOTAL_ACTIONS,
  SCENARIO_PARAMETERS_ORDER,
} from "./constants";
import type { ValueOf } from "type-fest";
import {
  format_scenario_parameter_for_backend,
  type FormatString,
} from "./utils";

export const IndicatorSchema = z.enum(INDICATORS);
export const DividedBySchema = z.enum(DIVIDED_BY_OPTIONS);
export const BreakdownBySchema = z.enum(BREAKDOWN_BY_OPTIONS);

export const ScenarioRowsAggregatedSchema = z
  .object({
    [YEAR_KEY]: z.number(),
  })
  .catchall(z.number());

const MinmaxSchema = z.strictObject({
  min: z.number(),
  max: z.number(),
});

const UnitSchema = z.string().min(1);
export const XAxisDomain = z.number().array();

export const ResultsScenarioRowsAggregatedSchema = z.strictObject({
  data: ScenarioRowsAggregatedSchema.array(),
  minmax: z
    .strictObject({
      stacked: MinmaxSchema,
      nonStacked: MinmaxSchema,
    })
    .optional(),
  unit: UnitSchema,
  xAxisDomain: XAxisDomain,
});
export const ActionLevelSchema = z.enum(["1.0", "2.0", "3.0", "4.0"]);
const StrategyItem = ActionLevelSchema.or(z.null());
export const StrategyAsSearchParamSchema = z
  .tuple([
    StrategyItem,
    StrategyItem,
    StrategyItem,
    StrategyItem,
    StrategyItem,
    StrategyItem,
  ])
  .and(StrategyItem.array().length(TOTAL_ACTIONS));

export const ActionsLevelsSuggestionSchema = ActionLevelSchema.array();

const SuggestionSchema = ActionsLevelsSuggestionSchema.optional();

type ActionsFormattedForBackend = ValueOf<{
  [K in (typeof SCENARIO_PARAMETERS_ORDER)[number]]: FormatString<K>;
}>;
type ExpectedObject = Record<
  ActionsFormattedForBackend,
  typeof SuggestionSchema
>;
const acc = {} as ExpectedObject;
const expectedObject = SCENARIO_PARAMETERS_ORDER.reduce<ExpectedObject>(
  (acc, key) => {
    acc[format_scenario_parameter_for_backend(key)] = SuggestionSchema;
    return acc;
  },
  acc,
);

export const ResultsActionsLevelsSuggestionsSchema = z.strictObject({
  suggestions: z.object(expectedObject),
});

export const ScenarioSchema = z.enum(SCENARIOS_OPTIONS);

export const YearSchema = z.coerce
  .string()
  .refine((val) => /^\d{4}$/.test(val), {
    message: "Invalid year format. Must be a four-digit integer.",
  })
  .refine(
    (val) => {
      const year = parseInt(val, 10);
      return year >= MIN_YEAR && year <= MAX_YEAR;
    },
    {
      message: `Year must be between ${MIN_YEAR.toString()} and ${MAX_YEAR.toString()}.`,
    },
  )
  .transform((val) => parseInt(val, 10));

export const FiltersSchema = z
  .object({
    "Element Class": z.string().array(),
    "Building subtype": z.string().array(),
    "Building type": z.string().array(),
    "EU country": z.string().array(),
    "Material Class": z.string().array(),
    "EU Region": z.string().array(),
    "building stock activity": z.string().array(),
    "Life cycle stages": z.string().array(),
    "Life cycle modules": z.string().array(),
    From: YearSchema,
    To: YearSchema,
  } satisfies Record<(typeof FILTERS)[number], z.ZodType>)
  .partial();
