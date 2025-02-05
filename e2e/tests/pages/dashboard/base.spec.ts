import {
  ROUTES,
  PROJECT_NAME,
  CHART_TESTID,
  DEFAULT_DIVIDED_BY,
  DEFAULT_INDICATOR,
} from "@/lib/constants";
import { UNITS_FROM_BACKEND } from "@/lib/shared_with_backend/constants";
import { test, expect } from "@playwright/test";
import { DEFAULT_GRAPH_TITLE, TAGS } from "@tests/constants";
import { testPageScreenshot, waitLoadingEnds } from "@tests/functions";

test.describe("dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
    await waitLoadingEnds({ page });
  });

  test("has tab title and data header", async ({ page }) => {
    await expect(page).toHaveTitle(/Scenario Explorer/);
    await expect(page.getByText(DEFAULT_GRAPH_TITLE)).toBeVisible();
  });

  test(
    "page snapshot",
    {
      tag: TAGS.snapshot,
    },
    async ({ page }) => {
      await expect(page.getByText(PROJECT_NAME).first()).toBeVisible({
        timeout: 5_000,
      });
      const unit = UNITS_FROM_BACKEND[DEFAULT_INDICATOR][DEFAULT_DIVIDED_BY];
      await expect(page.getByTestId(CHART_TESTID).getByText(unit)).toBeVisible({
        timeout: 10_000,
      });
      await expect(page.getByText("Non-residential").last()).toBeVisible();
      await testPageScreenshot({ page });
    },
  );

  test(
    "snapshot on a very big screen",
    {
      tag: TAGS.snapshot,
    },
    async ({ page, isMobile }) => {
      test.skip(isMobile, "Desktop only!");

      await page.setViewportSize({ width: 3840, height: 2160 });

      await waitLoadingEnds({ page });

      await testPageScreenshot({ page });
    },
  );
});
