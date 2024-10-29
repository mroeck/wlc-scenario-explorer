import {
  ROUTES,
  GRAPH_TITLE_TESTID,
  ATTRIBUTE_TESTID,
  COLOR_LEGEND_TESTID,
  BREAKDOWN_BY_TESTID,
  DATA_TABLE_TESTID,
  GRAPH_TESTID,
  DIVIDED_BY_TESTID,
  SELECT_INDICATOR_TESTID,
  INDICATOR_TO_UNIT,
  INDICATORS_UNITS,
  DISPLAY_SELECT_TESTID,
  SORT_SELECT_TESTID,
} from "@/lib/constants";
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
    const displaySelect = page
      .getByRole("dialog", { name: "Settings" })
      .getByTestId(DISPLAY_SELECT_TESTID);

    await page.getByRole("tab", { name: "Table" }).click();
    await page.getByLabel("Settings").nth(1).click();

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
    const colorLegend = page.getByTestId(COLOR_LEGEND_TESTID);

    await breakdownByDropdown.click();
    await buildingUseSubtypeOption.click();

    await expect(attributeInGraphTitle).toHaveText("Building subtype");
    await expect(colorLegend.getByText("Multi-family house")).toBeVisible();
    await expect(colorLegend.getByText("Office")).toBeVisible();
    await expect(colorLegend.getByText("Single-family house")).toBeVisible();

    await testScreenshot({
      page,
      target: page.locator(ACTIVE_DATA_TAB_LOCATOR),
    });

    await page.getByRole("tab", { name: "Stacked Bar Chart" }).click();
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
      .getByTestId(DIVIDED_BY_TESTID);
    const optionText = "GWP bio";
    const indicatorOption = page.getByLabel(optionText).getByText(optionText);
    const indicatorOption2 = page
      .getByLabel("Material mass")
      .getByText("Material mass");
    const indicator1 = INDICATORS_UNITS[0];
    const indicator2 = INDICATORS_UNITS[1];
    const graph = page.locator(ACTIVE_DATA_TAB_LOCATOR);

    await expect(graph.getByText(indicator1).nth(1)).toBeVisible();

    await indicatorSelect.click();
    await indicatorOption.click();

    await expect(indicatorInGraphTitle).toHaveText(optionText);
    await expect(
      graph.getByText(INDICATOR_TO_UNIT[optionText], { exact: true }),
    ).toBeVisible();
    await expect(graph.getByText(indicator1, { exact: true })).toBeVisible();

    await testScreenshot({
      page,
      target: page.locator(ACTIVE_DATA_TAB_LOCATOR),
    });

    await page.getByRole("tab", { name: "Stacked Bar Chart" }).click();
    await testScreenshot({
      page,
      target: page.locator(ACTIVE_DATA_TAB_LOCATOR),
    });

    await page.getByRole("tab", { name: "Table" }).click();
    await testScreenshot({
      page,
      target: page.locator(ACTIVE_DATA_TAB_LOCATOR),
    });

    await page.getByRole("tab", { name: "Stacked Bar Chart" }).click();
    await indicatorSelect.click();
    await indicatorOption2.click();

    await expect(page.getByText(indicator2)).toBeVisible();
  });
});
