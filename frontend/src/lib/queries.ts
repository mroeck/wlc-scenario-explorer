import { env } from "@/env";
import type {
  Attribute,
  Filters,
  Scenario,
  Indicator,
  DividedBy,
} from "./types";
import {
  FiltersSchema,
  ScenarioRowsAggregatedSchema,
} from "./shared_with_backend/schemas";
import { z } from "zod";
import { YEAR_KEY } from "./shared_with_backend/constants";
import { ATTRIBUTE_OPTIONS_COLOR } from "@/routes/-index/components/data-section/colors";

type FetchScenarioRowsArgs = {
  attribute: Attribute;
  scenario: Scenario | undefined;
  indicator: Indicator;
  dividedBy: DividedBy;
  filters: Filters | undefined;
};

export async function fetchScenarioRowsAggregated({
  attribute,
  filters,
  scenario,
  indicator,
  dividedBy,
}: FetchScenarioRowsArgs) {
  if (scenario === undefined) return [];

  const url = `${env.PUBLIC_API_URL}/scenario`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      attribute,
      scenario,
      indicator,
      dividedBy,
      filters,
    }),
  });
  const dataRaw = (await response.json()) as unknown;
  const data = ScenarioRowsAggregatedSchema.array().parse(dataRaw);
  return data;
}

export function fetchFilters() {
  const YearAllSchema = z.number().int().array();
  const FiltersOptionsSchema = FiltersSchema.omit({
    From: true,
    To: true,
  }).extend({
    [YEAR_KEY]: YearAllSchema,
  });

  const resultRaw: Record<string, string[] | number[]> = {};
  for (const keyUnTyped in ATTRIBUTE_OPTIONS_COLOR) {
    const key = keyUnTyped as keyof typeof ATTRIBUTE_OPTIONS_COLOR;

    resultRaw[key] = Object.keys(ATTRIBUTE_OPTIONS_COLOR[key]);
  }

  resultRaw["stock_projection_year"] = [
    2020, 2025, 2030, 2035, 2040, 2045, 2050,
  ];

  const result = FiltersOptionsSchema.required().parse(resultRaw);

  return result;
}
