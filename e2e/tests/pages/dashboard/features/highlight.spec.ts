import { CHART_TESTID, ROUTES, SELECT_INDICATOR_TESTID } from "@/lib/constants";
import { test } from "@playwright/test";
import { TAGS } from "@tests/constants";
import { testScreenshot } from "@tests/functions";

test.describe("graph highlight", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");

  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
  });

  test(
    "click graph or legend to highlight",
    {
      tag: TAGS.snapshot,
    },
    async ({ page }) => {
      const emptySpace = page.locator(".pt-12");
      const areaFromGraph = page.locator(".recharts-area");

      await areaFromGraph.last().click();

      await testScreenshot({
        page,
        target: page.getByTestId(CHART_TESTID).first(),
      });

      await emptySpace.click();
      await testScreenshot({
        page,
        target: page.getByTestId(CHART_TESTID).first(),
      });

      await page.getByText("Non-residential").last().click();
      await page
        .getByTestId(SELECT_INDICATOR_TESTID)
        .getByRole("combobox")
        .click();
      await page.locator("html").click();

      await testScreenshot({
        page,
        target: page.getByTestId(CHART_TESTID).first(),
      });
    },
  );

  test(
    "all graph have the same highlight",
    {
      tag: TAGS.snapshot,
    },
    async ({ page }) => {
      const areaFromGraph = page.locator(".recharts-area");

      await areaFromGraph.last().click();
      await testScreenshot({
        page,
        target: page.getByTestId(CHART_TESTID).first(),
      });

      await page.getByRole("tab", { name: "Line Graph" }).click();
      await testScreenshot({
        page,
        target: page.getByTestId(CHART_TESTID).first(),
      });

      await page.getByRole("tab", { name: "Stacked Bar Graph" }).click();
      await testScreenshot({
        page,
        target: page.getByTestId(CHART_TESTID).first(),
      });
    },
  );
});
