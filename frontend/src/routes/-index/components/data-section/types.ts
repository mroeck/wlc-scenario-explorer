import type {
  DIVIDED_BY_TO_MINIFIED_UNIT,
  INDICATOR_TO_UNIT,
} from "@/lib/constants";
import type {
  DIVIDED_BY_OPTIONS,
  INDICATORS,
} from "@/lib/shared_with_backend/constants";
import type { ValueOf } from "type-fest";

export type Unit =
  | `${(typeof INDICATORS)[number]} per ${(typeof DIVIDED_BY_OPTIONS)[number]}`
  | (typeof INDICATORS)[number];

export type UnitMinified =
  | `${ValueOf<typeof INDICATOR_TO_UNIT>}/${ValueOf<typeof DIVIDED_BY_TO_MINIFIED_UNIT>}`
  | ValueOf<typeof INDICATOR_TO_UNIT>;
