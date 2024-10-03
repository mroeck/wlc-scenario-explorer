import {
  ROUTES,
  DISPLAY_SELECT_TESTID,
  SCENARIO_B_TESTID,
  FOR_SCENARIOS_TESTID,
  RESET_LABEL,
  MOBILE_SETTINGS_BUTTON,
} from "@/lib/constants";
import { SCENARIOS_OPTIONS } from "@/lib/shared_with_backend/constants";
import { test, expect } from "@playwright/test";

test.describe("scenario selection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
  });

  test("selecting a scenario update the display menu", async ({
    page,
    isMobile,
  }) => {
    const mobileSettings = page
      .locator("button")
      .filter({ hasText: MOBILE_SETTINGS_BUTTON });
    const scenarioA = SCENARIOS_OPTIONS[0];
    const scenarioB = SCENARIOS_OPTIONS[1];

    if (isMobile) {
      await mobileSettings.click();
    }

    await page
      .getByRole("tabpanel", { name: "Scenarios" })
      .getByTestId(SCENARIO_B_TESTID)
      .click();
    await page.getByLabel(scenarioB).click();

    if (isMobile) {
      await page.getByRole("button").first().click();
    }

    const vsText = `${scenarioA} VS ${scenarioB}`;
    await expect(page.getByTestId(FOR_SCENARIOS_TESTID)).toHaveText(vsText);

    await page.getByLabel("Settings").nth(1).click();
    await expect(page.getByTestId(DISPLAY_SELECT_TESTID)).toHaveText(vsText);

    await page.getByRole("button", { name: "Close" }).click();

    if (isMobile) {
      await mobileSettings.click();
    }

    await page.getByRole("button", { name: RESET_LABEL }).click();

    if (isMobile) {
      await page.getByRole("button").first().click();
    }

    await expect(page.getByTestId(FOR_SCENARIOS_TESTID)).toHaveText(scenarioA);

    await page.getByLabel("Settings").nth(1).click();
    await expect(page.getByTestId(DISPLAY_SELECT_TESTID)).toHaveText(
      `${scenarioA} only`,
    );
  });
});
