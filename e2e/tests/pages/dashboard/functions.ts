import {
  DISPLAY_SELECT_TESTID,
  SCENARIO_A_MENU_TESTID,
  SCENARIO_B_MENU_TESTID,
} from "@/lib/constants";
import type { PredefinedScenario } from "@/lib/shared_with_backend/constants";
import { expect, type Page } from "@playwright/test";
import type { RequireAtLeastOne } from "type-fest";

type ChangeDisplayInUIArgs = {
  page: Page;
  option: string;
};
export const changeDisplayInUI = async ({
  page,
  option,
}: ChangeDisplayInUIArgs) => {
  await page.getByLabel("Settings").nth(1).click();
  await page.getByTestId(DISPLAY_SELECT_TESTID).click();

  await page.getByRole("listbox").getByText(option).click();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(
    page.getByRole("dialog", { name: "Settings" }),
  ).not.toBeVisible();
};

type ScenarioOption = `${PredefinedScenario}${string}`;
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
