import {
  CHART_TESTID,
  DEFAULT_INDICATOR,
  GRAPH_TITLE_DIVIDED_BY_TESTID,
  ROUTES,
  SELECT_DIVIDED_BY_TESTID,
} from "@/lib/constants";
import {
  DIVIDED_BY_NONE,
  DIVIDED_BY_OPTIONS,
  UNITS_FROM_BACKEND,
} from "@/lib/shared_with_backend/constants";
import { expect, test } from "@playwright/test";
import { TAGS } from "@tests/constants";
import { testScreenshot, waitLoadingEnds } from "@tests/functions";

test.describe("dividedBy", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");

  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
  });

  for (const option of DIVIDED_BY_OPTIONS) {
    test(
      `divided by ${option} show expected graph`,
      {
        tag: TAGS.snapshot,
      },
      async ({ page }) => {
        const dividedBySelect = page
          .getByTestId(SELECT_DIVIDED_BY_TESTID)
          .getByRole("combobox");

        await dividedBySelect.click();
        await page.getByLabel(option).click();

        const unit = UNITS_FROM_BACKEND[DEFAULT_INDICATOR][option];
        const graphYaxisUnitText = unit;
        const graphYaxisUnit = page
          .getByTestId(CHART_TESTID)
          .getByText(graphYaxisUnitText);
        const dividedByInTitle = page.getByTestId(
          GRAPH_TITLE_DIVIDED_BY_TESTID,
        );

        await waitLoadingEnds({ page });
        await expect(graphYaxisUnit).toBeVisible();

        if (option !== DIVIDED_BY_NONE) {
          await expect(dividedByInTitle).toContainText(option);
        }

        await testScreenshot({
          page,
          target: page.getByTestId(CHART_TESTID).first(),
        });
      },
    );
  }
});
