import { z } from "zod";
import {
  ATTRIBUTES,
  type FILTERS,
  MAX_YEAR,
  MIN_YEAR,
  SCENARIOS_OPTIONS,
  INDICATORS,
  YEAR_KEY,
  UNITS,
} from "./constants";

export const IndicatorSchema = z.enum(INDICATORS);
export const UnitSchema = z.enum(UNITS);
export const AttributeSchema = z.enum(ATTRIBUTES);

export const ScenarioRowsAggregatedSchema = z
  .object({
    [YEAR_KEY]: z.number(),
  })
  .catchall(z.number());

export const ScenarioSchema = z.enum(SCENARIOS_OPTIONS);

export const YearSchema = z.coerce
  .string()
  .refine((val) => /^\d{4}$/.test(val), {
    message: "Invalid year format. Must be a four-digit integer.",
  })
  .refine(
    (val) => {
      const year = parseInt(val, 10);
      return year >= MIN_YEAR && year <= MAX_YEAR;
    },
    {
      message: `Year must be between ${MIN_YEAR.toString()} and ${MAX_YEAR.toString()}.`,
    },
  )
  .transform((val) => parseInt(val, 10));

export const FiltersSchema = z
  .object({
    // "flow type": z.string().array(),
    "Element Class": z.string().array(),
    "Building subtype": z.string().array(),
    "Building type": z.string().array(),
    country: z.string().array(),
    "Material Class": z.string().array(),
    Region: z.string().array(),
    "building stock activity": z.string().array(),
    "Whole life cycle stages": z.string().array(),
    From: YearSchema,
    To: YearSchema,
  } satisfies Record<(typeof FILTERS)[number], z.ZodType>)
  .partial();
