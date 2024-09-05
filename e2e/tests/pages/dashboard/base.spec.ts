import {
  ROUTES,
  PROJECT_NAME,
  DEFAULT_UNIT_MINIMIZED,
  STACKED_AREA_CHART_TESTID,
} from "@/lib/constants";
import { test, expect } from "@playwright/test";
import { DEFAULT_DATA_HEADER } from "@tests/constants";
import { testPageScreenshot } from "@tests/functions";

test.describe("dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
  });

  test("has tab title and data header", async ({ page }) => {
    await expect(page).toHaveTitle(/Scenario Explorer/);
    await expect(page.getByText(DEFAULT_DATA_HEADER)).toBeVisible();
  });

  test("page snapshot", async ({ page }) => {
    await expect(page.getByText(PROJECT_NAME)).toBeVisible({ timeout: 5_000 });
    await expect(
      page
        .getByTestId(STACKED_AREA_CHART_TESTID)
        .getByText(DEFAULT_UNIT_MINIMIZED),
    ).toBeVisible({
      timeout: 10_000,
    });
    await testPageScreenshot({ page });
  });
});
