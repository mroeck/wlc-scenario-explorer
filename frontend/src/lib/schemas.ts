import { z } from "zod";
import { DISPLAY_OPTIONS } from "./constants";
import { ScenarioRowsAggregatedSchema } from "./shared_with_backend/schemas";

export const DisplaySchema = z.enum(DISPLAY_OPTIONS);

export const ScenarioRowsAggregatedArraySchema =
  ScenarioRowsAggregatedSchema.array();
