import {
  ROUTES,
  BREAKDOWN_BY_TESTID,
  NO_DATA_FOUND,
  SELECT_ALL_LABEL,
  ALL_LABEL,
  ERROR_OCCURED,
  RESET_LABEL,
} from "@/lib/constants";
import {
  BREAKDOWN_BY_OBJ,
  FILTERS_OBJ,
} from "@/lib/shared_with_backend/constants";
import type { FiltersSchema } from "@/lib/shared_with_backend/schemas";
import { test, expect } from "@playwright/test";
import { ACTIVE_DATA_TAB_LOCATOR, TAGS } from "@tests/constants";
import { waitLoadingEnds } from "@tests/functions";
import type { z } from "zod";

test.describe("filters", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
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
      .getByLabel(BREAKDOWN_BY_OBJ.country)
      .getByText(BREAKDOWN_BY_OBJ.country)
      .click();
    await page.getByRole("tab", { name: "Filters" }).click();
    const countryFilterTestId: keyof z.infer<typeof FiltersSchema> = "country";
    const materialTypeFilterTestId: keyof z.infer<typeof FiltersSchema> =
      "Material Class";
    await page.getByTestId(countryFilterTestId).click();
    await page.getByRole("option", { name: "FR" }).click();

    await page
      .getByTestId(materialTypeFilterTestId)
      .getByRole("combobox")
      .click();
    await page.getByRole("option", { name: "Concrete" }).click();

    await page.bringToFront();
    await expect(page.locator(ACTIVE_DATA_TAB_LOCATOR)).toHaveScreenshot();

    await page.getByRole("tab", { name: "Stacked Bar Chart" }).click();
    await expect(page.locator(ACTIVE_DATA_TAB_LOCATOR)).toHaveScreenshot();

    await page.getByRole("tab", { name: "Table" }).click();
    await expect(page.locator(ACTIVE_DATA_TAB_LOCATOR)).toHaveScreenshot();
  });

  test(
    "snapshot when multiple filter options are on",
    { tag: TAGS.snapshot },
    async ({ page }) => {
      await page.getByTestId(BREAKDOWN_BY_TESTID).getByRole("combobox").click();
      await page
        .getByLabel(BREAKDOWN_BY_OBJ.country)
        .getByText(BREAKDOWN_BY_OBJ.country)
        .click();
      await page.getByRole("tab", { name: "Filters" }).click();
      const countryFilterTestId: keyof z.infer<typeof FiltersSchema> =
        "country";
      await page.getByTestId(countryFilterTestId).click();
      await page.getByRole("option", { name: "FR" }).click();
      await page.getByRole("option", { name: "IT" }).click();

      await page.bringToFront();
      await expect(page.locator(ACTIVE_DATA_TAB_LOCATOR)).toHaveScreenshot();

      await page.getByRole("tab", { name: "Stacked Bar Chart" }).click();
      await expect(page.locator(ACTIVE_DATA_TAB_LOCATOR)).toHaveScreenshot();

      await page.getByRole("tab", { name: "Table" }).click();
      await expect(page.locator(ACTIVE_DATA_TAB_LOCATOR)).toHaveScreenshot();
    },
  );

  test("reset all filters", async ({ page }) => {
    await page.getByRole("tab", { name: "Filters" }).click();
    await page
      .getByTestId(FILTERS_OBJ.carbonCategory)
      .getByRole("combobox")
      .click();
    const carbonCategoryOptions = await page.getByRole("option").all();
    await carbonCategoryOptions[1].click();

    await page
      .getByTestId(FILTERS_OBJ.elementClass)
      .getByRole("combobox")
      .click();
    await page.getByRole("option", { name: "External openings" }).click();

    await page
      .getByTestId(FILTERS_OBJ.carbonCategory)
      .getByRole("combobox")
      .click();

    await page.getByRole("button", { name: RESET_LABEL }).click();
    await expect(
      page.getByTestId(FILTERS_OBJ.carbonCategory).getByRole("combobox"),
    ).toHaveText(ALL_LABEL);
    await expect(
      page.getByTestId(FILTERS_OBJ.elementClass).getByRole("combobox"),
    ).toHaveText(ALL_LABEL);
  });

  test("select all options", async ({ page }) => {
    const carbonCategorySelect = page
      .getByTestId(FILTERS_OBJ.carbonCategory)
      .getByRole("combobox");

    const countrySelect = page
      .getByTestId(FILTERS_OBJ.country)
      .getByRole("combobox");

    const FR = "FR";

    await page.getByRole("tab", { name: "Filters" }).click();

    await expect(carbonCategorySelect).toHaveText(ALL_LABEL);
    await carbonCategorySelect.click();
    const carbonCategoryOptions = await page.getByRole("option").all();
    const option1 = carbonCategoryOptions[2];
    const option1Text = await option1.innerText();
    const option2 = carbonCategoryOptions[3];
    const option2Text = await option2.innerText();

    await option1.click();
    await expect(carbonCategorySelect).toHaveText(option1Text);

    await page
      .getByRole("option", { name: SELECT_ALL_LABEL })
      .getByRole("checkbox")
      .click();
    await expect(carbonCategorySelect).toHaveText(ALL_LABEL);

    await option2.click();
    await expect(carbonCategorySelect).not.toHaveText(option2Text);

    await countrySelect.click();

    await expect(page.getByRole("dialog")).toHaveCount(1);

    await page.getByRole("dialog").getByPlaceholder("Search").fill(FR);
    await page.getByRole("option", { name: FR }).click();
    await expect(countrySelect).toHaveText(FR);

    await page.getByRole("dialog").getByPlaceholder("Search").click();
    await page.getByRole("dialog").getByPlaceholder("Search").fill("");
    await page.getByRole("option", { name: SELECT_ALL_LABEL }).click();
    await expect(countrySelect).toHaveText(ALL_LABEL);
  });

  test.describe("Filters do not error", () => {
    // const comboboxCount = 11;
    const comboboxCount = 10; //temp: we removed flow type fow now
    const FILTERS_TAB = "Filters";
    const xAxisValue = "2025";

    for (let i = 0; i < comboboxCount; i++) {
      const id = i + 1;
      test(`Filter ${id.toString()} does not error`, async ({ page }) => {
        await page.goto(ROUTES.DASHBOARD + "?animation=false");
        const filtersTab = page.getByRole("tab", { name: FILTERS_TAB });
        await filtersTab.click();
        await waitLoadingEnds({ page });

        const filtersForm = page.getByLabel(FILTERS_TAB).locator("form");
        const comboboxes = await filtersForm.getByRole("combobox").all();
        const combobox = comboboxes[i];

        expect(comboboxes).toHaveLength(comboboxCount);

        await combobox.click();
        const options = await page.getByRole("option").all();
        await options[1].click();
        await waitLoadingEnds({ page });

        const errorMessage = page.getByText(ERROR_OCCURED);
        const graph = page.locator(ACTIVE_DATA_TAB_LOCATOR);
        await expect(errorMessage).not.toBeVisible();
        await expect(
          graph.getByText(xAxisValue, { exact: true }),
        ).toBeVisible();
      });
    }
  });
});
