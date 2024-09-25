import {
  GRAPH_TESTID,
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
      await expect(page.getByText("MtCO2e", { exact: true })).toBeVisible();
      await selectDividedBy.click();

      await page.getByLabel("m² (country)").click();
      await expect(
        page.getByText("GWP total per m² (country) by"),
      ).toBeVisible();
      await expect(page.getByText("MtCO2e/m²", { exact: true })).toBeVisible();

      await testScreenshot({
        page,
        target: page.getByTestId(GRAPH_TESTID).first(),
      });

      await selectDividedBy.click();
      await page.getByLabel("capita (country)").click();
      await expect(
        page.getByText("GWP total per capita (country) by"),
      ).toBeVisible();
      await expect(
        page.getByText("MtCO2e/capita", { exact: true }),
      ).toBeVisible();

      await testScreenshot({
        page,
        target: page.getByTestId(GRAPH_TESTID).first(),
      });
    },
  );
});
