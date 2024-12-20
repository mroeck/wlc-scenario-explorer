import { useId, useRef } from "react";
import { LinkIcon, SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";
import { InfoButton } from "./InfoButton";
import {
  DATA_TABS_NAMES,
  DISPLAY_SELECT_TESTID,
  HELP_PAGE_IDS,
  ROUTES,
  SCENARIO_A_AND_B,
  SCENARIO_A_LABEL,
  SCENARIO_A_ONLY,
  SCENARIO_B_LABEL,
  SCENARIO_B_ONLY,
  SCENARIO_TO_ACRONYM,
  SORT_OPTIONS,
  SORT_OPTIONS_VALUES,
  SORT_SELECT_TESTID,
} from "@/lib/constants";
import { getRouteApi, Link } from "@tanstack/react-router";

const route = getRouteApi(ROUTES.DASHBOARD);

function getTitleAcronym({ acronym }: { acronym: string | undefined }) {
  return acronym ? ` (${acronym})` : "";
}

export function SettingsButton() {
  const navigate = route.useNavigate();
  const {
    sort,
    display,
    scenarioA,
    scenarioB = SCENARIO_B_LABEL,
    dataTab,
  } = route.useSearch({
    select: (search) => ({
      display: search.display,
      sort: search.sort,
      scenarioA: search.scenarioA,
      scenarioB: search.scenarioB,
      dataTab: search.dataTab,
    }),
  });

  type Keys = keyof typeof SCENARIO_TO_ACRONYM;
  const acronymA =
    scenarioA in SCENARIO_TO_ACRONYM
      ? SCENARIO_TO_ACRONYM[scenarioA]
      : undefined;

  const acronymB =
    scenarioB in SCENARIO_TO_ACRONYM
      ? SCENARIO_TO_ACRONYM[scenarioB as Keys]
      : undefined;

  const acronymAForTitle = getTitleAcronym({ acronym: acronymA });
  const acronymBForTitle = getTitleAcronym({ acronym: acronymB });

  const SELECT_IDS = {
    display: useId(),
    sort: useId(),
  };

  const displaySelectRef = useRef<HTMLButtonElement>(null);

  const onDisplayChange = (newDisplay: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        display: newDisplay,
      }),
    });
  };

  const onSortChange = (newSort: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        sort: newSort,
      }),
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <SettingsIcon className="size-5 text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        className="max-w-max"
      >
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-5">
          <div className="flex flex-col gap-1">
            {dataTab !== DATA_TABS_NAMES.table && (
              <>
                <Label
                  htmlFor={SELECT_IDS.display}
                  className="flex items-center gap-2 font-medium"
                >
                  <span>Display:</span>
                  <InfoButton>
                    <p>
                      Choose how to display scenarios in the chart: show{" "}
                      {SCENARIO_A_LABEL}, {SCENARIO_B_LABEL}, or compare both
                      side-by-side for a detailed visual analysis.
                    </p>
                    <p>
                      For the table tab, only the primary scenario is displayed
                    </p>
                    <Link
                      to={ROUTES.HELP}
                      hash={HELP_PAGE_IDS.display}
                      className="flex items-center gap-1 underline"
                    >
                      <LinkIcon className="size-3" /> Read more here
                    </Link>
                  </InfoButton>
                </Label>
                <Select value={display} onValueChange={onDisplayChange}>
                  <SelectTrigger
                    ref={displaySelectRef}
                    className="text-left capitalize"
                    data-testid={DISPLAY_SELECT_TESTID}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value={SCENARIO_A_ONLY}
                    >{`${scenarioA}${acronymAForTitle} only`}</SelectItem>
                    <SelectItem
                      value={SCENARIO_B_ONLY}
                    >{`${scenarioB}${acronymBForTitle} only`}</SelectItem>
                    <SelectItem value={SCENARIO_A_AND_B}>
                      <span className="block w-full overflow-hidden text-ellipsis text-nowrap font-medium">
                        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                        {acronymA || scenarioA}
                        <span className="mx-2 font-bold">VS</span>
                        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                        {acronymB || scenarioB}
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>{" "}
              </>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label
              htmlFor={SELECT_IDS.sort}
              className="flex items-center gap-2 font-medium"
            >
              <span>Sort by:</span>
              <InfoButton>
                <p>
                  {SORT_OPTIONS.desc} (Bottom to Top): Sorts the stacked areas
                  in the chart by value, with the largest values at the bottom
                  and the smallest values at the top.
                </p>
                <p>
                  {SORT_OPTIONS.categoriesAlphabetically}: Groups the stacked
                  areas by region, and within each region, the items are
                  arranged in alphabetical order from top to bottom.
                </p>
                <Link
                  to={ROUTES.HELP}
                  hash={HELP_PAGE_IDS.sort}
                  className="flex items-center gap-1 underline"
                >
                  <LinkIcon className="size-3" /> Read more here
                </Link>
              </InfoButton>
            </Label>
            <Select value={sort} onValueChange={onSortChange}>
              <SelectTrigger
                className="text-left capitalize"
                data-testid={SORT_SELECT_TESTID}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS_VALUES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
