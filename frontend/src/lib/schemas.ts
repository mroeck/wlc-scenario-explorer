import { z } from "zod";
import {
  DATA_TABS_NAMES,
  DEFAULT_BREAKDOWN_BY,
  DEFAULT_DATA_TAB,
  DEFAULT_DISPLAY,
  DEFAULT_DIVIDED_BY,
  DEFAULT_INDICATOR,
  DEFAULT_SCENARIO,
  DEFAULT_SETTINGS_TAB,
  DEFAULT_SORT,
  DISPLAY_OPTIONS,
  SETTINGS_TABS_NAMES,
  SORT_OPTIONS_VALUES,
} from "./constants";
import {
  BreakdownBySchema,
  DividedBySchema,
  FiltersSchema,
  IndicatorSchema,
  ScenarioRowsAggregatedSchema,
  ScenarioSchema,
  StrategyAsSearchParamSchema,
} from "./shared_with_backend/schemas";
import type { UnionToTuple } from "type-fest";
import { ATTRIBUTE_OPTIONS_COLOR } from "@/lib/shared_with_backend/constants";
import type { BreakdownByOptions } from "@/routes/-index/components/data-section/graphs/types";

export const DisplaySchema = z.enum(DISPLAY_OPTIONS);

export const SortSchema = z.enum(SORT_OPTIONS_VALUES);

export const ScenarioRowsAggregatedArraySchema =
  ScenarioRowsAggregatedSchema.array();

const SETTINGS_TABS = Object.values(SETTINGS_TABS_NAMES) as UnionToTuple<
  (typeof SETTINGS_TABS_NAMES)[keyof typeof SETTINGS_TABS_NAMES]
>;
export const SettingsTabSchema = z.enum(SETTINGS_TABS);

const DATA_TABS = Object.values(DATA_TABS_NAMES) as UnionToTuple<
  (typeof DATA_TABS_NAMES)[keyof typeof DATA_TABS_NAMES]
>;
export const DataTabSchema = z.enum(DATA_TABS);
export const AnimationSchema = z.boolean();

const breakdownByOptions = Object.values(ATTRIBUTE_OPTIONS_COLOR).flatMap(
  Object.keys,
) as [BreakdownByOptions, ...BreakdownByOptions[]];

export const HighlightSchema = z.enum(breakdownByOptions);
export const NumberSchema = z.number();
export const StringSchema = z.string();

export const SearchParamsSchema = z.object({
  filters: FiltersSchema.optional(),
  breakdownBy: BreakdownBySchema.catch(DEFAULT_BREAKDOWN_BY),
  indicator: IndicatorSchema.catch(DEFAULT_INDICATOR),
  dividedBy: DividedBySchema.catch(DEFAULT_DIVIDED_BY),
  display: DisplaySchema.catch(DEFAULT_DISPLAY),
  sort: SortSchema.catch(DEFAULT_SORT),
  scenarioA: ScenarioSchema.catch(DEFAULT_SCENARIO),
  scenarioB: ScenarioSchema.optional().catch(undefined),
  animation: AnimationSchema.optional().catch(undefined),
  settingsTab: SettingsTabSchema.catch(DEFAULT_SETTINGS_TAB),
  dataTab: DataTabSchema.catch(DEFAULT_DATA_TAB),
  highlights: HighlightSchema.array().optional().catch(undefined),
  strategy: StrategyAsSearchParamSchema.optional().catch(undefined),
});
