import {
  CHART_TESTID,
  ROUTES,
  SELECT_DIVIDED_BY_TESTID,
} from "@/lib/constants";
import { expect, test } from "@playwright/test";
import { TAGS } from "@tests/constants";
import { testScreenshot } from "@tests/functions";

test.describe("dividedBy", () => {
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
      const selectDividedBy = page
        .getByTestId(SELECT_DIVIDED_BY_TESTID)
        .getByRole("combobox");

      await expect(page.getByText("GWP total by")).toBeVisible();
      await expect(
        page.getByText("MtCO2e", { exact: true }).nth(1),
      ).toBeVisible();
      await selectDividedBy.click();

      await page.getByLabel("m² (country)").click();
      await expect(
        page.getByText("GWP total per m² (country) by"),
      ).toBeVisible();
      await expect(
        page.getByText("MtCO2e/m²", { exact: true }).nth(1),
      ).toBeVisible();

      await testScreenshot({
        page,
        target: page.getByTestId(CHART_TESTID).first(),
      });

      await selectDividedBy.click();
      await page.getByLabel("capita (country)").click();
      await expect(
        page.getByText("GWP total per capita (country) by"),
      ).toBeVisible();
      await expect(
        page
          .locator('[id="radix-\\:rm\\:-content-Stacked\\ Area\\ Graph"]')
          .getByText("MtCO2e/capita", { exact: true })
          .nth(1),
      ).toBeVisible();

      await testScreenshot({
        page,
        target: page.getByTestId(CHART_TESTID).first(),
      });
    },
  );
});
