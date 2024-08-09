import {
  ROUTES,
  GRAPH_TITLE_TESTID,
  ATTRIBUTE_TESTID,
  COLOR_LEGEND_TESTID,
  BREAKDOWN_BY_TESTID,
  STACKED_AREA_CHART_TESTID,
  DATA_TABLE_TESTID,
  STACKED_BAR_CHART_TESTID,
  UNIT_TESTID,
  SELECT_INDICATOR_TESTID,
  INDICATOR_TO_UNIT,
  INDICATORS_UNITS,
} from "@/lib/constants";
import { UNITS } from "@/lib/shared_with_backend/constants";
import { test, expect } from "@playwright/test";
import { waitLoadingEnds } from "@tests/functions";

test.describe("data viz", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD);
    await waitLoadingEnds({ page });
  });

  test("years from X axis", async ({ page }) => {
    await expect(page.getByText("2020", { exact: true })).toBeVisible();
    await expect(page.getByText("2035", { exact: true })).toBeVisible();
  });

  test("select breakdown by", async ({ page }) => {
    const breakdownByDropdown = page.getByTestId(BREAKDOWN_BY_TESTID);
    const attributeInGraphTitle = page
      .getByTestId(GRAPH_TITLE_TESTID)
      .getByTestId(ATTRIBUTE_TESTID);
    const buildingUseSubtypeOption = page
      .getByLabel("Building subtype")
      .getByText("Building subtype");
    const colorLegend = page.getByTestId(COLOR_LEGEND_TESTID);

    await breakdownByDropdown.click();
    await buildingUseSubtypeOption.click();

    await expect(attributeInGraphTitle).toHaveText("Building subtype");
    await expect(colorLegend.getByText("Multi-family house")).toBeVisible();
    await expect(colorLegend.getByText("Office")).toBeVisible();
    await expect(colorLegend.getByText("Single-family house")).toBeVisible();

    await page.bringToFront();
    await expect(
      page.getByTestId(STACKED_AREA_CHART_TESTID),
    ).toHaveScreenshot();

    await page.getByRole("tab", { name: "Stacked Bar Chart" }).click();
    await expect(page.getByTestId(STACKED_BAR_CHART_TESTID)).toHaveScreenshot();

    await page.getByRole("tab", { name: "Table" }).click();
    await expect(page.getByTestId(DATA_TABLE_TESTID)).toHaveScreenshot();
  });

  test("select indicator", async ({ page }) => {
    const indicatorSelect = page.getByTestId(SELECT_INDICATOR_TESTID);
    const indicatorInGraphTitle = page
      .getByTestId(GRAPH_TITLE_TESTID)
      .getByTestId(UNIT_TESTID);
    const optionText = "GWP bio";
    const indicatorOption = page.getByLabel(optionText).getByText(optionText);
    const indicatorOption2 = page
      .getByLabel("Material mass")
      .getByText("Material mass");
    const indicator1 = INDICATORS_UNITS[0];
    const indicator2 = INDICATORS_UNITS[1];
    const graph = page.getByTestId(STACKED_AREA_CHART_TESTID);

    await expect(graph.getByText(indicator1)).toBeVisible();

    await indicatorSelect.click();
    await indicatorOption.click();

    await expect(indicatorInGraphTitle).toHaveText(optionText);
    await expect(
      graph.getByText(INDICATOR_TO_UNIT[optionText], { exact: true }),
    ).toBeVisible();
    await expect(graph.getByText(indicator1, { exact: true })).toBeVisible();

    await page.bringToFront();
    await expect(
      page.getByTestId(STACKED_AREA_CHART_TESTID),
    ).toHaveScreenshot();

    await page.getByRole("tab", { name: "Stacked Bar Chart" }).click();
    await expect(page.getByTestId(STACKED_BAR_CHART_TESTID)).toHaveScreenshot();

    await page.getByRole("tab", { name: "Table" }).click();
    await expect(page.getByTestId(DATA_TABLE_TESTID)).toHaveScreenshot();

    await page.getByRole("tab", { name: "Stacked Bar Chart" }).click();
    await indicatorSelect.click();
    await indicatorOption2.click();
    await expect(
      page
        .getByTestId(STACKED_BAR_CHART_TESTID)
        .getByText(indicator2, { exact: true }),
    ).toBeVisible();
  });
});
