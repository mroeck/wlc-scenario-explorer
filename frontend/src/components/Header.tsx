import {
  DEFAULT_ATTRIBUTE,
  DEFAULT_DISPLAY,
  DEFAULT_SCENARIO,
  DEFAULT_INDICATOR,
  PROJECT_NAME,
  ROUTES,
  DEFAULT_UNIT,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Menu } from "lucide-react";

type NavLinksProps = {
  className: string;
};
const NavLinks = ({ className }: NavLinksProps) => {
  const currentRoute = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <ul className={cn("flex gap-8", className)}>
      <li
        className={cn({
          "font-semibold": ROUTES.DASHBOARD === currentRoute,
          "opacity-80": ROUTES.DASHBOARD !== currentRoute,
        })}
      >
        <Link
          to={ROUTES.DASHBOARD}
          search={{
            attribute: DEFAULT_ATTRIBUTE,
            display: DEFAULT_DISPLAY,
            scenarioA: DEFAULT_SCENARIO,
            indicator: DEFAULT_INDICATOR,
            unit: DEFAULT_UNIT,
          }}
        >
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

const BurgerNavigation = () => {
  const currentRoute = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <Drawer>
      <DrawerTrigger>
        <Menu />
      </DrawerTrigger>
      <DrawerContent className={cn("bg-primary text-white")}>
        <ul className={cn("flex flex-col items-center gap-8 py-20")}>
          <li
            className={cn({
              "font-semibold": ROUTES.DASHBOARD === currentRoute,
              "opacity-80": ROUTES.DASHBOARD !== currentRoute,
            })}
          >
            <Link
              to={ROUTES.DASHBOARD}
              search={{
                attribute: DEFAULT_ATTRIBUTE,
                display: DEFAULT_DISPLAY,
                scenarioA: DEFAULT_SCENARIO,
                indicator: DEFAULT_INDICATOR,
                unit: DEFAULT_UNIT,
              }}
            >
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

export const Header = () => {
  return (
    <header>
      <nav
        className={cn(
          "flex justify-between gap-5 bg-primary p-primary text-primary-foreground",
        )}
      >
        <div className={cn("font-semibold")}>{PROJECT_NAME}</div>
        <NavLinks className={cn("hidden sm:flex")} />
        <div className={cn("sm:hidden")}>
          <BurgerNavigation />
        </div>
      </nav>
    </header>
  );
};
