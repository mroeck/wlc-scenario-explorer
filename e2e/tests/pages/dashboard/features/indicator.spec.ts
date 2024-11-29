import {
  GRAPH_TITLE_DIVIDED_BY_TESTID,
  CHART_TESTID,
  ROUTES,
  SELECT_INDICATOR_TESTID,
} from "@/lib/constants";
import { expect, test } from "@playwright/test";
import { TAGS } from "@tests/constants";
import { testScreenshot } from "@tests/functions";

test.describe("indicator", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");

  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
  });

  test(
    "show expected unit",
    {
      tag: TAGS.snapshot,
    },
    async ({ page }) => {
      const indicatorSelect = page
        .getByTestId(SELECT_INDICATOR_TESTID)
        .getByRole("combobox");
      const option1 = { name: "Material mass", minified: "Mt" };
      const option2 = { name: "GWP total", minified: "MtCO₂" };

      await indicatorSelect.click();
      await page.getByLabel(option1.name).click();
      await expect(page.getByText(option1.minified).nth(1)).toBeVisible();
      await expect(page.getByTestId(GRAPH_TITLE_DIVIDED_BY_TESTID)).toHaveText(
        option1.name,
      );

      await testScreenshot({
        page,
        target: page.getByTestId(CHART_TESTID).first(),
      });

      await indicatorSelect.click();
      await page.getByLabel(option2.name).click();
      await expect(page.getByText(option2.minified).nth(1)).toBeVisible();
      await expect(page.getByTestId(GRAPH_TITLE_DIVIDED_BY_TESTID)).toHaveText(
        option2.name,
      );

      await testScreenshot({
        page,
        target: page.getByTestId(CHART_TESTID).first(),
      });
    },
  );
});
