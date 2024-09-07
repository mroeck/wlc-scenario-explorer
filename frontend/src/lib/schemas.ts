import { z } from "zod";
import {
  DATA_TABS_NAMES,
  DISPLAY_OPTIONS,
  SETTINGS_TABS_NAMES,
} from "./constants";
import { ScenarioRowsAggregatedSchema } from "./shared_with_backend/schemas";
import type { UnionToTuple } from "type-fest";

export const DisplaySchema = z.enum(DISPLAY_OPTIONS);

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
