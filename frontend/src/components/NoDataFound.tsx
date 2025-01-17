import {
  DEFAULT_FROM,
  DEFAULT_TO,
  NO_DATA_FOUND,
  ROUTES,
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

export const NoDataFound = () => {
  const { scenarioA, filters, strategy } = route.useSearch({
    select: (search) => ({
      scenarioA: search.scenarioA,
      filters: search.filters,
      strategy: search.strategy,
    }),
  });
  const isCustom = scenarioA === CUSTOM_SCENARIO;
  const hasDefaultTimeframeFilters =
    !!filters && filters.From === DEFAULT_FROM && filters.To === DEFAULT_TO;

  const hasFilters = !!filters && !hasDefaultTimeframeFilters;
  const hasCompleteStrategy =
    !!strategy &&
    strategy.filter((level) => level !== null).length === TOTAL_ACTIONS;

  return (
    <div className="flex h-full flex-col justify-center">
      <div className="flex flex-col items-center justify-center space-y-4 pb-10 lg:-translate-y-1/2 lg:pb-0">
        <CircleAlert className="size-12 text-yellow-400" />
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-yellow-400">
            {NO_DATA_FOUND}
          </h2>
          {match(true as boolean)
            .with(isCustom && !hasCompleteStrategy, () => (
              <p className="max-w-prose text-muted-foreground">
                Please select a level for each scenario parameter to proceed.
              </p>
            ))
            .with(isCustom && !hasFilters && hasCompleteStrategy, () => (
              <p className="max-w-prose text-muted-foreground">
                Sorry, we couldn't find a scenario for the selected parameter
                combination. Please try a different set of parameters.
              </p>
            ))
            .with(isCustom && hasFilters && hasCompleteStrategy, () => (
              <p className="max-w-prose text-muted-foreground">
                No data available with the current filters or scenario
                parameters. This might be due to incompatible selections, such
                as a Region not matching the selected Country, a mismatch
                between Building Type and Subtype, or an invalid timeframe.
              </p>
            ))
            .with(!isCustom && hasFilters, () => (
              <p className="max-w-prose text-muted-foreground">
                No data available with the current filters. This might be due to
                incompatible selections, such as a Region not matching the
                selected Country, a mismatch between Building Type and Subtype,
                or an invalid timeframe.
              </p>
            ))
            .otherwise(() => (
              <p className="max-w-prose text-muted-foreground">
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
