import {
  DEFAULT_BREAKDOWN_BY,
  DEFAULT_DISPLAY,
  DEFAULT_SCENARIO,
  DEFAULT_INDICATOR,
  PROJECT_NAME,
  ROUTES,
  DEFAULT_DIVIDED_BY,
  DEFAULT_DATA_TAB,
  DEFAULT_SETTINGS_TAB,
  DEFAULT_SORT,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  type getRouteApi,
  Link,
  useRouterState,
  useSearch,
} from "@tanstack/react-router";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Menu } from "lucide-react";
import PROJECT_LOGO_URL from "@/assets/PROJECT_LOGO.webp";

const DEFAULT_DASHBOARD_SEARCH = {
  breakdownBy: DEFAULT_BREAKDOWN_BY,
  display: DEFAULT_DISPLAY,
  scenarioA: DEFAULT_SCENARIO,
  indicator: DEFAULT_INDICATOR,
  dividedBy: DEFAULT_DIVIDED_BY,
  dataTab: DEFAULT_DATA_TAB,
  settingsTab: DEFAULT_SETTINGS_TAB,
  sort: DEFAULT_SORT,
};

type DashboardRouteApi = ReturnType<
  typeof getRouteApi<typeof ROUTES.DASHBOARD>
>;
type DashboardUseSearchArgument = Parameters<DashboardRouteApi["useSearch"]>[0];
type NonUndefinedSelectOptions = Exclude<
  DashboardUseSearchArgument,
  undefined
>["select"];
type FinalSelectOptions = Exclude<NonUndefinedSelectOptions, undefined>;
type DashboardLinkSearch = Parameters<FinalSelectOptions>[0];

type NavLinksProps = {
  className: string;
  currentRoute: string;
  dashboardSearchParams: DashboardLinkSearch | undefined;
};
const NavLinks = ({
  className,
  currentRoute,
  dashboardSearchParams = DEFAULT_DASHBOARD_SEARCH,
}: NavLinksProps) => {
  return (
    <ul className={cn("flex gap-8", className)}>
      <li
        className={cn({
          "font-semibold": ROUTES.DASHBOARD === currentRoute,
          "opacity-80": ROUTES.DASHBOARD !== currentRoute,
        })}
      >
        <Link to={ROUTES.DASHBOARD} search={dashboardSearchParams}>
          Dashboard
        </Link>
      </li>
      <li
        className={cn({
          "font-semibold": ROUTES.HELP === currentRoute,
          "opacity-80": ROUTES.HELP !== currentRoute,
        })}
      >
        <Link to={ROUTES.HELP}>Help</Link>
      </li>

      <li
        className={cn({
          "font-semibold": ROUTES.ABOUT === currentRoute,
          "opacity-80": ROUTES.ABOUT !== currentRoute,
        })}
      >
        <Link to={ROUTES.ABOUT}>About</Link>
      </li>
    </ul>
  );
};

type BurgerNavigationProps = {
  currentRoute: string;
  dashboardSearchParams: DashboardLinkSearch | undefined;
};
const BurgerNavigation = ({
  currentRoute,
  dashboardSearchParams = DEFAULT_DASHBOARD_SEARCH,
}: BurgerNavigationProps) => {
  return (
    <Drawer>
      <DrawerTrigger>
        <Menu />
      </DrawerTrigger>
      <DrawerContent className="bg-primary text-white">
        <ul className="flex flex-col items-center gap-8 py-20">
          <li
            className={cn({
              "font-semibold": ROUTES.DASHBOARD === currentRoute,
              "opacity-80": ROUTES.DASHBOARD !== currentRoute,
            })}
          >
            <Link to={ROUTES.DASHBOARD} search={dashboardSearchParams}>
              <DrawerClose>Dashboard</DrawerClose>
            </Link>
          </li>
          <li
            className={cn({
              "font-semibold": ROUTES.HELP === currentRoute,
              "opacity-80": ROUTES.HELP !== currentRoute,
            })}
          >
            <Link to={ROUTES.HELP}>
              <DrawerClose>Help</DrawerClose>
            </Link>
          </li>

          <li
            className={cn({
              "font-semibold": ROUTES.ABOUT === currentRoute,
              "opacity-80": ROUTES.ABOUT !== currentRoute,
            })}
          >
            <Link to={ROUTES.ABOUT}>
              <DrawerClose>About</DrawerClose>
            </Link>
          </li>
        </ul>
      </DrawerContent>
    </Drawer>
  );
};

let dashboardSearchParams: DashboardLinkSearch | undefined = undefined;

export const Header = () => {
  const currentRoute = useRouterState({
    select: (state) => state.location.pathname,
  });
  const search = useSearch({
    strict: false,
  });

  if (currentRoute === ROUTES.DASHBOARD) {
    dashboardSearchParams = search as DashboardLinkSearch;
  }

  return (
    <header className="relative shadow-lg">
      {Array.from({ length: 2 }, (_, index) => (
        <nav
          key={index}
          className={cn(
            "fixed top-0 z-10 flex w-dvw max-w-screen-2xl justify-between gap-5 bg-primary p-primary text-primary-foreground",
            index === 1 && "invisible static",
          )}
        >
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex aspect-[1.161px] h-1 w-[48px] items-center">
              <img src={PROJECT_LOGO_URL} className="border border-white" />
            </div>
            <span>{PROJECT_NAME}</span>
          </div>
          <NavLinks
            className="hidden sm:flex"
            currentRoute={currentRoute}
            dashboardSearchParams={dashboardSearchParams}
          />
          <div className="sm:hidden">
            <BurgerNavigation
              currentRoute={currentRoute}
              dashboardSearchParams={dashboardSearchParams}
            />
          </div>
        </nav>
      ))}
    </header>
  );
};
