import {
  ROUTES,
  GRAPH_TITLE_TESTID,
  ATTRIBUTE_TESTID,
  COLOR_LEGEND_TESTID,
  BREAKDOWN_BY_TESTID,
  DATA_TABLE_TESTID,
  GRAPH_TITLE_DIVIDED_BY_TESTID,
  SELECT_INDICATOR_TESTID,
  INDICATOR_TO_UNIT,
  INDICATORS_UNITS,
  DISPLAY_SELECT_TESTID,
  SORT_SELECT_TESTID,
  DEFAULT_DIVIDED_BY,
} from "@/lib/constants";
import {
  DIVIDED_BY_NONE,
  UNITS_FROM_BACKEND,
} from "@/lib/shared_with_backend/constants";
import { test, expect } from "@playwright/test";
import { ACTIVE_DATA_TAB_LOCATOR, TAGS } from "@tests/constants";
import { testScreenshot, waitLoadingEnds } from "@tests/functions";

test.describe("data viz", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
    await waitLoadingEnds({ page });
  });

  test("years from X axis", async ({ page }) => {
    await expect(page.getByText("2020", { exact: true })).toBeVisible();
    await expect(page.getByText("2035", { exact: true })).toBeVisible();
  });

  test("table tab has no display select", async ({ page }) => {
    const displaySelect = page.getByTestId(DISPLAY_SELECT_TESTID);

    await page.getByRole("tab", { name: "Table" }).click();

    await expect(page.getByTestId(SORT_SELECT_TESTID)).toBeVisible();
    await expect(displaySelect).not.toBeVisible();
  });

  test("select breakdown by", { tag: TAGS.snapshot }, async ({ page }) => {
    const breakdownByDropdown = page.getByTestId(BREAKDOWN_BY_TESTID);
    const attributeInGraphTitle = page
      .getByTestId(GRAPH_TITLE_TESTID)
      .getByTestId(ATTRIBUTE_TESTID);
    const buildingUseSubtypeOption = page
      .getByLabel("Building subtype")
      .getByText("Building subtype");
    const colorLegend = page.getByTestId(COLOR_LEGEND_TESTID).nth(1);

    await breakdownByDropdown.click();
    await buildingUseSubtypeOption.click();

    await expect(attributeInGraphTitle).toHaveText("Building subtype");
    await expect(
      colorLegend.getByText("Multi-family house").first(),
    ).toBeVisible();
    await expect(colorLegend.getByText("Office").first()).toBeVisible();
    await expect(
      colorLegend.getByText("Single-family house").first(),
    ).toBeVisible();

    await testScreenshot({
      page,
      target: page.locator(ACTIVE_DATA_TAB_LOCATOR),
    });

    await page.getByRole("tab", { name: "Stacked Bar Graph" }).click();
    await testScreenshot({
      page,
      target: page.locator(ACTIVE_DATA_TAB_LOCATOR),
    });

    await page.getByRole("tab", { name: "Table" }).click();
    await testScreenshot({
      page,
      target: page.getByTestId(DATA_TABLE_TESTID),
    });
  });

  test("select indicator", { tag: TAGS.snapshot }, async ({ page }) => {
    const indicatorSelect = page.getByTestId(SELECT_INDICATOR_TESTID);
    const indicatorInGraphTitle = page
      .getByTestId(GRAPH_TITLE_TESTID)
      .getByTestId(GRAPH_TITLE_DIVIDED_BY_TESTID);
    const optionText = "GWP bio";
    const indicatorOption = page.getByLabel(optionText).getByText(optionText);
    const indicatorOption2 = page
      .getByLabel("Material mass")
      .getByText("Material mass");
    const indicator1 = INDICATORS_UNITS[0];
    const indicator2 = INDICATORS_UNITS[1];
    const graph = page.locator(ACTIVE_DATA_TAB_LOCATOR);

    await expect(graph.getByText(indicator1)).toBeVisible();

    await indicatorSelect.click();
    await indicatorOption.click();
    await waitLoadingEnds({ page });

    await expect(indicatorInGraphTitle).toHaveText(optionText);
    await expect(graph.getByText(INDICATOR_TO_UNIT[optionText])).toBeVisible();

    await expect(graph.getByText(indicator1)).toBeVisible();

    await testScreenshot({
      page,
      target: page.locator(ACTIVE_DATA_TAB_LOCATOR),
    });

    await page.getByRole("tab", { name: "Stacked Bar Graph" }).click();
    await testScreenshot({
      page,
      target: page.locator(ACTIVE_DATA_TAB_LOCATOR),
    });

    await page.getByRole("tab", { name: "Table" }).click();
    await testScreenshot({
      page,
      target: page.locator(ACTIVE_DATA_TAB_LOCATOR),
    });

    await page.getByRole("tab", { name: "Stacked Bar Graph" }).click();
    await indicatorSelect.click();
    await indicatorOption2.click();
    await waitLoadingEnds({ page });

    await expect(page.getByText(indicator2)).toBeVisible();
  });
});
