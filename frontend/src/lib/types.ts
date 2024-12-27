import type { z } from "zod";
import type {
  BreakdownBySchema,
  FiltersSchema,
  ScenarioSchema,
  IndicatorSchema,
  DividedBySchema,
} from "./shared_with_backend/schemas";
import type { SortSchema } from "./schemas";
import type { EXPECTED_VALUES } from "tests/parquet.test";
import type { TupleToUnion } from "type-fest";

export type Attribute = z.infer<typeof BreakdownBySchema>;
export type Scenario = z.infer<typeof ScenarioSchema>;
export type Indicator = z.infer<typeof IndicatorSchema>;
export type DividedBy = z.infer<typeof DividedBySchema>;
export type Filters = z.infer<typeof FiltersSchema>;
export type EnumArgs = Parameters<typeof z.enum>[0];
export type Color = string;
export type Sort = z.infer<typeof SortSchema>;
export type ValidValues = Partial<typeof EXPECTED_VALUES>;
export type ValidColumn = keyof ValidValues;
export type ValidOption = TupleToUnion<ValidValues[ValidColumn]>;
export type ScenarioId = "A" | "B";
