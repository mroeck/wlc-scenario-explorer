import {
  ROUTES,
  DEFAULT_SEARCH_PARAMS,
  BREAKDOWN_BY_TESTID,
  DISPLAY_SELECT_TESTID,
  DEFAULT_FROM,
  DEFAULT_TO,
  SCENARIO_A_TESTID,
  SCENARIO_B_TESTID,
  SCENARIO_B_ONLY,
} from "@/lib/constants";
import { UNITS } from "@/lib/shared_with_backend/constants";
import { test, expect } from "@playwright/test";

test.describe("search params", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");

  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD);
  });

  test("url search params on first render", async ({ page }) => {
    const searchParamsExists = page.waitForFunction(
      () => new URL(window.location.href).searchParams.size > 0,
    );
    await searchParamsExists;

    const searchParams = new URL(page.url()).searchParams;

    for (const [param, value] of searchParams.entries()) {
      expect(Object.keys(DEFAULT_SEARCH_PARAMS)).toContain(param);
      const ref =
        DEFAULT_SEARCH_PARAMS[param as keyof typeof DEFAULT_SEARCH_PARAMS];
      expect(ref).toBe(value);
    }
  });

  test("search params are used on mount", async ({ page }) => {
    const attributeSelect = page
      .getByTestId(BREAKDOWN_BY_TESTID)
      .getByRole("combobox");
    const scenarioBSelect = page
      .getByRole("tabpanel", { name: "Scenarios" })
      .getByTestId(SCENARIO_B_TESTID);
    const scenarioASelect = page
      .getByRole("tabpanel", { name: "Scenarios" })
      .getByTestId(SCENARIO_A_TESTID);

    const displaySelect = page.getByTestId(DISPLAY_SELECT_TESTID);

    const attribute = "use subtype";
    const unit = UNITS[1];
    const scenario = "Current policy optimistic scenario";
    const display = SCENARIO_B_ONLY;
    const filters = { From: DEFAULT_FROM, To: DEFAULT_TO, country: ["FR"] };
    const filtersEncoded = encodeURIComponent(JSON.stringify(filters));
    const url = `${ROUTES.DASHBOARD}?attribute=${attribute}&unit=${unit}&display=${display}&scenarioA=${scenario}&filters=${filtersEncoded}`;

    await page.goto(url);

    await expect(attributeSelect).toHaveText(attribute);
    await expect(scenarioBSelect).toHaveText("Select a scenario");
    await expect(scenarioASelect).toHaveText(scenario);
    await expect(displaySelect).toHaveText(display);

    await page.getByRole("tab", { name: "Filters" }).click();
    const filterElements = {
      From: page.getByLabel("From"),
      To: page.getByLabel("To"),
      country: page
        .getByRole("combobox")
        .filter({ hasText: filters.country[0] }),
    };
    await expect(filterElements.From).toHaveText(filters.From.toString());
    await expect(filterElements.To).toHaveText(filters.To.toString());
    await expect(filterElements.country).toBeVisible();

    await page.getByRole("tab", { name: "Scenarios" }).click();
    await scenarioASelect.click();
    await page
      .getByLabel("Additional policy scenario (APOL)")
      .getByText("Additional policy scenario (APOL)")
      .click();
    await page.getByRole("tab", { name: "Filters" }).click();

    await expect(filterElements.From).toHaveText(filters.From.toString());
    await expect(filterElements.To).toHaveText(filters.To.toString());
    await expect(filterElements.country).toBeVisible();
  });
});
