import { env } from "@/env";
import type {
  Attribute,
  Filters,
  Scenario,
  Indicator,
  DividedBy,
  CurrentLevel,
  StrategyAsSearchParam,
} from "./types";
import {
  FiltersSchema,
  ResultsScenarioRowsAggregatedSchema,
  ResultsActionsLevelsSuggestionsSchema,
} from "./shared_with_backend/schemas";
import { z } from "zod";
import {
  API_ROUTES,
  CUSTOM_SCENARIO,
  YEAR_KEY,
  ATTRIBUTE_OPTIONS_COLOR,
  TOTAL_ACTIONS,
} from "@/lib/shared_with_backend/constants";
import { DEFAULT_ACTIONS_LEVELS_SUGGESTIONS } from "./constants";

type FetchScenarioRowsArgs = {
  breakdownBy: Attribute;
  scenario: Scenario | undefined;
  indicator: Indicator;
  dividedBy: DividedBy;
  filters: Filters | undefined;
  strategy: StrategyAsSearchParam | undefined;
};

export async function fetchScenarioRowsAggregated({
  breakdownBy,
  filters,
  scenario,
  indicator,
  dividedBy,
  strategy,
}: FetchScenarioRowsArgs) {
  const isValidCustom =
    !!strategy &&
    strategy.filter((level) => level !== null).length === TOTAL_ACTIONS;
  const isValidScenario = scenario !== undefined;

  const shouldReturnEmptyData =
    scenario === CUSTOM_SCENARIO ? !isValidCustom : !isValidScenario;

  if (shouldReturnEmptyData) {
    return {
      data: [],
      unit: "",
    } satisfies z.infer<typeof ResultsScenarioRowsAggregatedSchema>;
  }
  const url = env.PUBLIC_API_URL + API_ROUTES.scenario;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      breakdownBy,
      scenario,
      indicator,
      dividedBy,
      filters,
      strategy,
    }),
  });
  const bodyUnvalidated = await response.json();
  const body = ResultsScenarioRowsAggregatedSchema.parse(bodyUnvalidated);
  return body;
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

type FetchActionsLevelsSuggestionsArgs = {
  currentLevels: [
    CurrentLevel,
    CurrentLevel,
    CurrentLevel,
    CurrentLevel,
    CurrentLevel,
    CurrentLevel,
    CurrentLevel,
    CurrentLevel,
    CurrentLevel,
    CurrentLevel,
    CurrentLevel,
  ];
};

export async function fetchActionsLevelsSuggestions({
  currentLevels,
}: FetchActionsLevelsSuggestionsArgs) {
  const levelsSelected = currentLevels.filter(
    (currentLevel) => currentLevel !== null,
  );
  if (levelsSelected.length === 11) {
    return {
      suggestions: DEFAULT_ACTIONS_LEVELS_SUGGESTIONS,
    } satisfies z.infer<typeof ResultsActionsLevelsSuggestionsSchema>;
  }
  const url = env.PUBLIC_API_URL + API_ROUTES.suggestions;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      current_parameters: currentLevels,
    }),
  });
  const bodyUnvalidated = await response.json();
  const body = ResultsActionsLevelsSuggestionsSchema.parse(bodyUnvalidated);
  return body;
}
