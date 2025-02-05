import type {
  AnimationSchema,
  ScenarioRowsAggregatedArraySchema,
} from "@/lib/schemas";
import type { Attribute, ScenarioId } from "@/lib/types";
import type { z } from "zod";
import type { UnitMinified } from "../types";
import type { KeysOfUnion, ValueOf } from "type-fest";
import type { ATTRIBUTE_OPTIONS_COLOR } from "@/lib/shared_with_backend/constants";
import type { XAxisDomain } from "@/lib/shared_with_backend/schemas";

export type BreakdownByOptions = KeysOfUnion<
  ValueOf<typeof ATTRIBUTE_OPTIONS_COLOR>
>;

export type GraphProps = {
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  animation: z.infer<typeof AnimationSchema> | undefined;
  breakdownBy: Attribute;
  attributeOptions: BreakdownByOptions[];
  chartRef: React.RefObject<HTMLDivElement>;
  unit: UnitMinified;
  highlights: BreakdownByOptions[] | undefined;
  scenarioId?: ScenarioId;
  xAxisDomain: z.infer<typeof XAxisDomain>;
};
