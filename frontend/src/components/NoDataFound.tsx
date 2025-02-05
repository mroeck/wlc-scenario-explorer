import {
  DEFAULT_FROM,
  DEFAULT_TO,
  NO_DATA_FOUND,
  ROUTES,
  SCENARIO_B_ACRONYM,
  SCENARIO_B_ONLY,
  SCENARIO_TO_ACRONYM,
} from "@/lib/constants";
import {
  CUSTOM_SCENARIO,
  TOTAL_ACTIONS,
} from "@/lib/shared_with_backend/constants";
import { Link } from "@tanstack/react-router";
import { getRouteApi } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { match } from "ts-pattern";

const route = getRouteApi(ROUTES.DASHBOARD);

export const NoDataFound = ({ scenarioId }: { scenarioId?: "A" | "B" }) => {
  const { scenarioA, scenarioB, filters, strategy, display } = route.useSearch({
    select: (search) => ({
      scenarioA: search.scenarioA,
      scenarioB: search.scenarioB,
      filters: search.filters,
      strategy: search.strategy,
      display: search.display,
    }),
  });
  const isCustom = scenarioA === CUSTOM_SCENARIO;
  const hasDefaultTimeframeFilters =
    !!filters &&
    Object.values(filters).length === 2 &&
    filters.From === DEFAULT_FROM &&
    filters.To === DEFAULT_TO;

  const hasFilters = !!filters && !hasDefaultTimeframeFilters;
  const hasCompleteStrategy =
    !!strategy &&
    strategy.filter((level) => level !== null).length === TOTAL_ACTIONS;

  const isScenarioB =
    display === SCENARIO_B_ONLY || (!!scenarioId && scenarioId === "B");
  const isScenarioBempty = scenarioB === undefined;

  const acronymA = SCENARIO_TO_ACRONYM[scenarioA];
  const acronymB = scenarioB
    ? SCENARIO_TO_ACRONYM[scenarioB]
    : SCENARIO_B_ACRONYM;

  const acronym = isScenarioB ? acronymB : acronymA;

  return (
    <div className="flex h-full flex-col justify-center">
      <div className="flex flex-col items-center justify-center space-y-4 pb-10 lg:-translate-y-1/2 lg:pb-0">
        <CircleAlert className="size-12 text-yellow-400" />
        <div className="space-y-2 text-center">
          <h2 className="font-bold text-yellow-400 sm:text-lg xl:text-2xl">
            {NO_DATA_FOUND} {!!scenarioId && `for scenario ${acronym}`}
          </h2>
          {match(true as boolean)
            .with(isScenarioB && isScenarioBempty, () => (
              <p className="max-w-[40ch] text-muted-foreground">
                Please select a {SCENARIO_B_ACRONYM} scenario to proceed.
              </p>
            ))
            .with(isCustom && !hasCompleteStrategy, () => (
              <p className="max-w-[40ch] text-muted-foreground">
                Please select a level for each scenario parameter to proceed.
              </p>
            ))
            .with(isCustom && !hasFilters && hasCompleteStrategy, () => (
              <p className="max-w-[40ch] text-muted-foreground">
                Sorry, we couldn't find a scenario for the selected parameter
                combination. Please try a different set of parameters.
              </p>
            ))
            .with(isCustom && hasFilters && hasCompleteStrategy, () => (
              <p className="max-w-[40ch] text-muted-foreground">
                No data available with the current filters or scenario
                parameters. This might be due to incompatible selections, such
                as a Region not matching the selected Country, a mismatch
                between Building Type and Subtype, or an invalid timeframe.
              </p>
            ))
            .with(!isCustom && hasFilters, () => (
              <p className="max-w-[40ch] text-muted-foreground">
                No data available with the current filters. This might be due to
                incompatible selections, such as a Region not matching the
                selected Country, a mismatch between Building Type and Subtype,
                or an invalid timeframe.
              </p>
            ))
            .otherwise(() => (
              <p className="max-w-[40ch] text-muted-foreground">
                No data available. Please review your selections or try again.
                If the issue persists, contact us, our email addresses are
                listed on the{" "}
                <Link to="/about" className="link">
                  About page
                </Link>
                .
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};
