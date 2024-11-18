import {
  CHART_TESTID,
  DEFAULT_UNIT_MINIMIZED,
  DIVIDED_BY_NONE,
  DIVIDED_BY_TO_MINIFIED_UNIT,
  ERROR_OCCURED,
  GRAPH_TITLE_DIVIDED_BY_TESTID,
  ROUTES,
  SELECT_DIVIDED_BY_TESTID,
} from "@/lib/constants";
import { DIVIDED_BY_OPTIONS } from "@/lib/shared_with_backend/constants";
import { expect, test } from "@playwright/test";
import { TAGS } from "@tests/constants";
import { testScreenshot, waitLoadingEnds } from "@tests/functions";

test.describe("dividedBy", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");

  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
  });

  const tempWorkingOptions = [DIVIDED_BY_OPTIONS[0], DIVIDED_BY_OPTIONS[1]];

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

        const unit =
          option === DIVIDED_BY_NONE
            ? undefined
            : DIVIDED_BY_TO_MINIFIED_UNIT[option];

        const graphYaxisUnitText = unit
          ? `MtCO2e/${unit}`
          : DEFAULT_UNIT_MINIMIZED;
        const graphYaxisUnit = page
          .getByTestId(CHART_TESTID)
          .getByText(graphYaxisUnitText)
          .nth(1);
        const dividedByInTitle = page.getByTestId(
          GRAPH_TITLE_DIVIDED_BY_TESTID,
        );

        await waitLoadingEnds({ page });

        // @ts-expect-error: temp, will be removed when no 0 in parquet file
        if (tempWorkingOptions.includes(option)) {
          await expect(graphYaxisUnit).toBeVisible();

          if (unit) {
            await expect(dividedByInTitle).toContainText(option);
          }

          await testScreenshot({
            page,
            target: page.getByTestId(CHART_TESTID).first(),
          });
        } else {
          await expect(page.getByText(ERROR_OCCURED)).toBeVisible();
        }
      },
    );
  }

  // test(
  //   "show expected unit",
  //   {
  //     tag: TAGS.snapshot,
  //   },
  //   async ({ page }) => {
  //     const selectDividedBy = page
  //       .getByTestId(SELECT_DIVIDED_BY_TESTID)
  //       .getByRole("combobox");

  //     await expect(page.getByText("GWP total by")).toBeVisible();
  //     await expect(
  //       page.getByText("MtCO2e", { exact: true }).nth(1),
  //     ).toBeVisible();
  //     await selectDividedBy.click();

  //     await page.getByLabel("m² (country)").click();
  //     await expect(
  //       page.getByText("GWP total per m² (country) by"),
  //     ).toBeVisible();
  //     await expect(
  //       page.getByText("MtCO2e/m²", { exact: true }).nth(1),
  //     ).toBeVisible();

  //     await testScreenshot({
  //       page,
  //       target: page.getByTestId(CHART_TESTID).first(),
  //     });

  //     await selectDividedBy.click();
  //     await page.getByLabel("capita (country)").click();
  //     await expect(
  //       page.getByText("GWP total per capita (country) by"),
  //     ).toBeVisible();
  //     await expect(
  //       page
  //         .locator('[id="radix-\\:rm\\:-content-Stacked\\ Area\\ Graph"]')
  //         .getByText("MtCO2e/capita", { exact: true })
  //         .nth(1),
  //     ).toBeVisible();

  //     await testScreenshot({
  //       page,
  //       target: page.getByTestId(CHART_TESTID).first(),
  //     });
  //   },
  // );
});
