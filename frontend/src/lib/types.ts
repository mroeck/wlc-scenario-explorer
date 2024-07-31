import type { z } from "zod";
import type {
  AttributeSchema,
  FiltersSchema,
  ScenarioSchema,
  IndicatorSchema,
  UnitSchema,
} from "./shared_with_backend/schemas";

export type Attribute = z.infer<typeof AttributeSchema>;
export type Scenario = z.infer<typeof ScenarioSchema>;
export type Indicator = z.infer<typeof IndicatorSchema>;
export type Unit = z.infer<typeof UnitSchema>;
export type Filters = z.infer<typeof FiltersSchema>;
export type EnumArgs = Parameters<typeof z.enum>[0];
export type Color = string;
