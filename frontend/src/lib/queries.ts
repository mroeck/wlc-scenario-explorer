import { env } from "@/env";
import type { Attribute, Filters, Scenario, Indicator } from "./types";
import {
  FiltersSchema,
  ScenarioRowsAggregatedSchema,
} from "./shared_with_backend/schemas";
import { z } from "zod";
import { YEAR_KEY } from "./shared_with_backend/constants";

type FetchScenarioRowsArgs = {
  attribute: Attribute;
  scenario: Scenario;
  unit: Indicator;
  filters: Filters | undefined;
};

export async function fetchScenarioRowsAggregated({
  attribute,
  filters,
  scenario,
  unit,
}: FetchScenarioRowsArgs) {
  const url = `${env.PUBLIC_API_URL}/scenario`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      attribute,
      scenario,
      unit,
      filters,
    }),
  });
  const dataRaw = (await response.json()) as unknown;
  const data = ScenarioRowsAggregatedSchema.array().parse(dataRaw);
  return data;
}

export async function fetchFilters() {
  const url = `${env.PUBLIC_API_URL}/filters`;
  const response = await fetch(url, {
    method: "POST",
  });
  const dataRaw = (await response.json()) as unknown;
  const YearAllSchema = z.number().int().array();
  const FiltersOptionsSchema = FiltersSchema.omit({
    From: true,
    To: true,
  }).extend({
    [YEAR_KEY]: YearAllSchema,
  });
  const data = FiltersOptionsSchema.required().parse(dataRaw);
  return data;
}
