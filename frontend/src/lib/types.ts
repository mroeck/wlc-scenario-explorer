import type { z } from "zod";
import type {
  BreakdownBySchema,
  FiltersSchema,
  ScenarioSchema,
  IndicatorSchema,
  DividedBySchema,
} from "./shared_with_backend/schemas";
import type { DIVIDED_BY_UNITS, INDICATORS_UNITS } from "./constants";
import type { SortSchema } from "./schemas";

export type Attribute = z.infer<typeof BreakdownBySchema>;
export type Scenario = z.infer<typeof ScenarioSchema>;
export type Indicator = z.infer<typeof IndicatorSchema>;
export type IndicatorUnit = (typeof INDICATORS_UNITS)[number];
export type DividedBy = z.infer<typeof DividedBySchema>;
export type DividedByUnit = (typeof DIVIDED_BY_UNITS)[number];
export type Unit = z.infer<typeof DividedBySchema>;
export type Filters = z.infer<typeof FiltersSchema>;
export type EnumArgs = Parameters<typeof z.enum>[0];
export type Color = string;
export type Sort = z.infer<typeof SortSchema>;
