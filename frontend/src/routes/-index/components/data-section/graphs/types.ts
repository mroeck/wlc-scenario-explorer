import type {
  AnimationSchema,
  ScenarioRowsAggregatedArraySchema,
} from "@/lib/schemas";
import type { Attribute } from "@/lib/types";
import type { z } from "zod";
import type { GraphDomain, UnitMinified } from "../types";
import type { KeysOfUnion, ValueOf } from "type-fest";
import type { ATTRIBUTE_OPTIONS_COLOR } from "@/lib/shared_with_backend/constants";

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
  highlight: BreakdownByOptions | undefined;
  domain: GraphDomain | undefined;
  scenarioId?: string;
};
