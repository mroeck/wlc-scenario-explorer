import type {
  AnimationTabSchema,
  ScenarioRowsAggregatedArraySchema,
} from "@/lib/schemas";
import type { Attribute } from "@/lib/types";
import type { z } from "zod";
import type { UnitMinified } from "../types";

export type GraphProps = {
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  animation: z.infer<typeof AnimationTabSchema> | undefined;
  breakdownBy: Attribute;
  attributeOptions: string[];
  chartRef: React.RefObject<HTMLDivElement>;
  unit: UnitMinified;
};
