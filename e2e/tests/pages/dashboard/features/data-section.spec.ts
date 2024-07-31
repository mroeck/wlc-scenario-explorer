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
  SELECT_UNIT_TESTID,
  INDICATOR_TO_UNIT,
} from "@/lib/constants";
import { test, expect } from "@playwright/test";
import { waitLoadingEnds } from "@tests/functions";

test.describe("data viz", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD);
    await waitLoadingEnds({ page });
  });

  test("select breakdown by", async ({ page }) => {
    const breakdownByDropdown = page.getByTestId(BREAKDOWN_BY_TESTID);
    const attributeInGraphTitle = page
      .getByTestId(GRAPH_TITLE_TESTID)
      .getByTestId(ATTRIBUTE_TESTID);
    const buildingUseSubtypeOption = page
      .getByLabel("building use subtype name")
      .getByText("building use subtype name");
    const colorLegend = page.getByTestId(COLOR_LEGEND_TESTID);

    await breakdownByDropdown.click();
    await buildingUseSubtypeOption.click();

    await expect(attributeInGraphTitle).toHaveText("building use subtype name");
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

  test("select indicator/unit", async ({ page }) => {
    const unitSelect = page.getByTestId(SELECT_UNIT_TESTID);
    const unitInGraphTitle = page
      .getByTestId(GRAPH_TITLE_TESTID)
      .getByTestId(UNIT_TESTID);
    const optionText = "bio GWP";
    const unitOption = page.getByLabel(optionText).getByText(optionText);
    const unitOption2 = page
      .getByLabel("material amount")
      .getByText("material amount");
    const unit1 = "ktCO2";
    const unit2 = "kt/building";

    await expect(page.getByText(unit1)).toBeVisible();

    await unitSelect.click();
    await unitOption.click();

    await expect(unitInGraphTitle).toHaveText(optionText);
    await expect(page.getByText(INDICATOR_TO_UNIT[optionText])).toBeVisible();
    await expect(page.getByText(unit1)).toBeVisible();

    await page.bringToFront();
    await expect(
      page.getByTestId(STACKED_AREA_CHART_TESTID),
    ).toHaveScreenshot();

    await page.getByRole("tab", { name: "Stacked Bar Chart" }).click();
    await expect(page.getByTestId(STACKED_BAR_CHART_TESTID)).toHaveScreenshot();

    await page.getByRole("tab", { name: "Table" }).click();
    await expect(page.getByTestId(DATA_TABLE_TESTID)).toHaveScreenshot();

    await page.getByRole("tab", { name: "Stacked Bar Chart" }).click();
    await unitSelect.click();
    await unitOption2.click();
    await expect(page.getByText(unit2, { exact: true })).toBeVisible();
  });
});
