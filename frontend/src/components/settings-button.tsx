import { useId, useRef } from "react";
import { LinkIcon, MoreVertical } from "lucide-react";
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
  SORT_OPTIONS,
  SORT_OPTIONS_VALUES,
  SORT_SELECT_TESTID,
} from "@/lib/constants";
import { getRouteApi, Link } from "@tanstack/react-router";

const route = getRouteApi(ROUTES.DASHBOARD);

export function SettingsButton() {
  const navigate = route.useNavigate();
  const { sort, display, scenarioA, scenarioB, dataTab } = route.useSearch({
    select: (search) => ({
      display: search.display,
      sort: search.sort,
      scenarioA: search.scenarioA,
      scenarioB: search.scenarioB,
      dataTab: search.dataTab,
    }),
  });

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
          <MoreVertical className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-[min-content_auto] gap-4 pl-2">
          {dataTab !== DATA_TABS_NAMES.table && (
            <>
              <Label
                htmlFor={SELECT_IDS.display}
                className="flex items-center gap-2 font-medium"
              >
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
                <span>Display:</span>
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
                  >{`${scenarioA} only`}</SelectItem>
                  <SelectItem
                    value={SCENARIO_B_ONLY}
                  >{`${scenarioB ?? "Scenario B"} only`}</SelectItem>
                  <SelectItem value={SCENARIO_A_AND_B}>
                    {`${scenarioA} VS ${scenarioB ?? "Scenario B"}`}
                  </SelectItem>
                </SelectContent>
              </Select>{" "}
            </>
          )}

          <Label
            htmlFor={SELECT_IDS.sort}
            className="flex items-center gap-2 font-medium"
          >
            <InfoButton>
              <p>
                {SORT_OPTIONS.desc} (Bottom to Top): Sorts the stacked areas in
                the chart by value, with the largest values at the bottom and
                the smallest values at the top.
              </p>
              <p>
                {SORT_OPTIONS.categoriesAlphabetically}: Groups the stacked
                areas by region, and within each region, the items are arranged
                in alphabetical order from top to bottom.
              </p>
              <Link
                to={ROUTES.HELP}
                hash={HELP_PAGE_IDS.sort}
                className="flex items-center gap-1 underline"
              >
                <LinkIcon className="size-3" /> Read more here
              </Link>
            </InfoButton>
            <span>Sort:</span>
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
      </DialogContent>
    </Dialog>
  );
}
