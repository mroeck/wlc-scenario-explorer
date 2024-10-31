import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ROUTES,
  SORT_OPTIONS_VALUES,
  SORT_SELECT_TESTID,
} from "@/lib/constants";
import { getRouteApi } from "@tanstack/react-router";
import { ArrowUpDownIcon } from "lucide-react";

const route = getRouteApi(ROUTES.DASHBOARD);

export const Sort = () => {
  const navigate = route.useNavigate();
  const { sort } = route.useSearch({
    select: (search) => ({
      sort: search.sort,
    }),
  });

  const onSortChange = (newSort: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        sort: newSort,
      }),
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Sort"
          data-testid={SORT_SELECT_TESTID}
        >
          <ArrowUpDownIcon className="text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={sort} onValueChange={onSortChange}>
          {SORT_OPTIONS_VALUES.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
