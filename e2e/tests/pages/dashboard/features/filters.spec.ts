import {
  ROUTES,
  BREAKDOWN_BY_TESTID,
  STACKED_AREA_CHART_TESTID,
  NO_DATA_FOUND,
  STACKED_BAR_CHART_TESTID,
  DATA_TABLE_TESTID,
  SELECT_ALL_LABEL,
  ALL_LABEL,
} from "@/lib/constants";
import {
  BREAKDOWN_BY_OBJ,
  FILTERS_OBJ,
} from "@/lib/shared_with_backend/constants";
import type { FiltersSchema } from "@/lib/shared_with_backend/schemas";
import { test, expect } from "@playwright/test";
import type { z } from "zod";

test.describe("filters", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD);
  });

  test("warning message when no data retrieved", async ({ page }) => {
    const filterTab = page.getByRole("tab", { name: "Filters" });
    await filterTab.click();
    await page
      .getByTestId(FILTERS_OBJ.buildingUseType)
      .getByRole("combobox")
      .click();
    await page.getByRole("option", { name: "Non-residential" }).click();
    await page
      .getByTestId(FILTERS_OBJ.buildingUseSubtype)
      .getByRole("combobox")
      .click();
    await page.getByRole("option", { name: "Multi-family house" }).click();
    await expect(
      page.getByRole("heading", { name: NO_DATA_FOUND }),
    ).toBeVisible();
  });

  test("snapshot when multiple filters are on", async ({ page }) => {
    await page.getByTestId(BREAKDOWN_BY_TESTID).getByRole("combobox").click();
    await page
      .getByLabel(BREAKDOWN_BY_OBJ.countries)
      .getByText(BREAKDOWN_BY_OBJ.countries)
      .click();
    await page.getByRole("tab", { name: "Filters" }).click();
    const countryFilterTestId: keyof z.infer<typeof FiltersSchema> =
      "Countries";
    const materialTypeFilterTestId: keyof z.infer<typeof FiltersSchema> =
      "Material Type";
    await page.getByTestId(countryFilterTestId).click();
    await page.getByRole("option", { name: "FR" }).click();

    await page
      .getByTestId(materialTypeFilterTestId)
      .getByRole("combobox")
      .click();
    await page.getByRole("option", { name: "Concrete" }).click();

    await page.bringToFront();
    await expect(
      page.getByTestId(STACKED_AREA_CHART_TESTID),
    ).toHaveScreenshot();

    await page.getByRole("tab", { name: "Stacked Bar Chart" }).click();
    await expect(page.getByTestId(STACKED_BAR_CHART_TESTID)).toHaveScreenshot();

    await page.getByRole("tab", { name: "Table" }).click();
    await expect(page.getByTestId(DATA_TABLE_TESTID)).toHaveScreenshot();
  });

  test("snapshot when multiple filter options are on", async ({ page }) => {
    await page.getByTestId(BREAKDOWN_BY_TESTID).getByRole("combobox").click();
    await page
      .getByLabel(BREAKDOWN_BY_OBJ.countries)
      .getByText(BREAKDOWN_BY_OBJ.countries)
      .click();
    await page.getByRole("tab", { name: "Filters" }).click();
    const countryFilterTestId: keyof z.infer<typeof FiltersSchema> =
      "Countries";
    await page.getByTestId(countryFilterTestId).click();
    await page.getByRole("option", { name: "FR" }).click();
    await page.getByRole("option", { name: "IT" }).click();

    await page.bringToFront();
    await expect(
      page.getByTestId(STACKED_AREA_CHART_TESTID),
    ).toHaveScreenshot();

    await page.getByRole("tab", { name: "Stacked Bar Chart" }).click();
    await expect(page.getByTestId(STACKED_BAR_CHART_TESTID)).toHaveScreenshot();

    await page.getByRole("tab", { name: "Table" }).click();
    await expect(page.getByTestId(DATA_TABLE_TESTID)).toHaveScreenshot();
  });

  test("reset all filters", async ({ page }) => {
    await page.getByRole("tab", { name: "Filters" }).click();
    await page
      .getByTestId(FILTERS_OBJ.activityInOut)
      .getByRole("combobox")
      .click();
    await page.getByRole("option", { name: "MATERIAL_IN" }).click();

    await page
      .getByTestId(FILTERS_OBJ.elementClass)
      .getByRole("combobox")
      .click();
    await page.getByRole("option", { name: "External openings" }).click();

    await page
      .getByTestId(FILTERS_OBJ.activityInOut)
      .getByRole("combobox")
      .click();

    await page.getByRole("button", { name: "Reset all" }).click();
    await expect(
      page.getByTestId(FILTERS_OBJ.activityInOut).getByRole("combobox"),
    ).toHaveText(ALL_LABEL);
    await expect(
      page.getByTestId(FILTERS_OBJ.elementClass).getByRole("combobox"),
    ).toHaveText(ALL_LABEL);
  });

  test("select all options", async ({ page }) => {
    const activityInOutSelect = page
      .getByTestId(FILTERS_OBJ.activityInOut)
      .getByRole("combobox");

    const countriesSelect = page
      .getByTestId(FILTERS_OBJ.countries)
      .getByRole("combobox");

    const energyInOption = "Energy in";
    const materialInOption = "MATERIAL_IN";
    const FR = "FR";

    await page.getByRole("tab", { name: "Filters" }).click();

    await expect(activityInOutSelect).toHaveText(ALL_LABEL);
    await activityInOutSelect.click();
    await page.getByRole("option", { name: energyInOption }).click();
    await expect(activityInOutSelect).toHaveText(energyInOption);

    await page
      .getByRole("option", { name: SELECT_ALL_LABEL })
      .getByRole("checkbox")
      .click();
    await expect(activityInOutSelect).toHaveText(ALL_LABEL);

    await page.getByRole("option", { name: materialInOption }).click();
    await expect(activityInOutSelect).not.toHaveText(energyInOption);

    await countriesSelect.click();

    await expect(page.getByRole("dialog")).toHaveCount(1);

    await page.getByRole("dialog").getByPlaceholder("Search").fill(FR);
    await page.getByRole("option", { name: FR }).click();
    await expect(countriesSelect).toHaveText(FR);

    await page.getByRole("dialog").getByPlaceholder("Search").click();
    await page.getByRole("dialog").getByPlaceholder("Search").fill("");
    await page.getByRole("option", { name: SELECT_ALL_LABEL }).click();
    await expect(countriesSelect).toHaveText(ALL_LABEL);
  });
});
