import {
  DISPLAY_SELECT_TESTID,
  SCENARIO_A_MENU_TESTID,
  SCENARIO_B_MENU_TESTID,
  SORT_SELECT_TESTID,
} from "@/lib/constants";
import { expect, type Page } from "@playwright/test";
import type { RequireAtLeastOne } from "type-fest";
import type { ScenarioOption } from "./types";

type ChangeSortArgs = {
  page: Page;
  option: string;
};
export const changeSort = async ({ page, option }: ChangeSortArgs) => {
  await page.getByTestId(SORT_SELECT_TESTID).click();

  const item = page.getByRole("menuitemradio", { name: option });
  await item.click();

  await expect(item).not.toBeVisible();
};

type ChangeDisplayInUIArgs = {
  page: Page;
  option: string;
};
export const changeDisplayInUI = async ({
  page,
  option,
}: ChangeDisplayInUIArgs) => {
  await page.getByTestId(DISPLAY_SELECT_TESTID).click();

  const item = page.getByRole("listbox").getByText(option);
  await item.click();

  await expect(item).not.toBeVisible();
};

type ChangeScenariosInUIArgs = {
  page: Page;
  scenarios: RequireAtLeastOne<{
    a?: ScenarioOption;
    b?: ScenarioOption;
  }>;
};
export const changeScenariosInUI = async ({
  page,
  scenarios,
}: ChangeScenariosInUIArgs) => {
  const openedMenu = page.getByRole("listbox");

  if (scenarios.a) {
    await page.getByTestId(SCENARIO_A_MENU_TESTID).click();
    await openedMenu.getByText(scenarios.a).click();
    await expect(openedMenu).not.toBeVisible();
  }

  if (scenarios.b) {
    await page.getByTestId(SCENARIO_B_MENU_TESTID).click();
    await openedMenu.getByText(scenarios.b).click();
    await expect(openedMenu).not.toBeVisible();
  }
};
