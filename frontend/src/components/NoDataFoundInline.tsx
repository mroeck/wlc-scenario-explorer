import {
  ROUTES,
  SCENARIO_A_AND_B,
  SCENARIO_B_ACRONYM,
  SCENARIO_B_ONLY,
} from "@/lib/constants";
import {
  CUSTOM_SCENARIO,
  TOTAL_ACTIONS,
} from "@/lib/shared_with_backend/constants";
import { getRouteApi } from "@tanstack/react-router";
import { match } from "ts-pattern";
import { WarningTextLayout } from "./WarningTextLayout";

const route = getRouteApi(ROUTES.DASHBOARD);

export const NoDataFoundInline = () => {
  const { scenarioA, scenarioB, strategy, display } = route.useSearch({
    select: (search) => ({
      scenarioA: search.scenarioA,
      scenarioB: search.scenarioB,
      strategy: search.strategy,
      display: search.display,
    }),
  });

  const isCustom = scenarioA === CUSTOM_SCENARIO && display !== SCENARIO_B_ONLY;

  const hasCompleteStrategy =
    !!strategy &&
    strategy.filter((level) => level !== null).length === TOTAL_ACTIONS;

  const isScenarioBempty = scenarioB === undefined;

  const isAvsB = display === SCENARIO_A_AND_B;
  const isAvalid = scenarioA !== CUSTOM_SCENARIO || hasCompleteStrategy;
  const isBvalid = scenarioB !== undefined;
  const isOneScenarioValid = isAvalid || isBvalid;
  const shouldDisplayInlineWarning = isAvsB && isOneScenarioValid;

  return (
    <div className="text-center">
      {match(true as boolean)
        .with(shouldDisplayInlineWarning && isScenarioBempty, () => (
          <WarningTextLayout>
            Warning: no {SCENARIO_B_ACRONYM} scenario have been selected.
          </WarningTextLayout>
        ))
        .with(
          shouldDisplayInlineWarning && isCustom && !hasCompleteStrategy,
          () => (
            <WarningTextLayout>
              Warning: Some parameter levels are missing, please select them to
              complete your custom scenario.
            </WarningTextLayout>
          ),
        )
        .otherwise(() => null)}
    </div>
  );
};
