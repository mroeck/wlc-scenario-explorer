import {
  ROUTES,
  DEFAULT_SEARCH_PARAMS,
  BREAKDOWN_BY_TESTID,
  DISPLAY_SELECT_TESTID,
  DEFAULT_FROM,
  DEFAULT_TO,
  SCENARIO_A_MENU_TESTID,
  SCENARIO_B_MENU_TESTID,
  SCENARIO_B_ONLY,
  DEFAULT_SCENARIO,
  SELECT_DIVIDED_BY_TESTID,
  SCENARIO_B_LABEL,
} from "@/lib/constants";
import { DIVIDED_BY_OPTIONS } from "@/lib/shared_with_backend/constants";
import { test, expect } from "@playwright/test";

test.describe("search params", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");

  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
  });

  test("url search params on first render", async ({ page }) => {
    const searchParamsExists = page.waitForFunction(
      () => new URL(window.location.href).searchParams.size > 0,
    );
    await searchParamsExists;

    const searchParams = new URL(page.url()).searchParams;

    for (const [param, value] of searchParams.entries()) {
      if (param === "animation") continue;
      expect(Object.keys(DEFAULT_SEARCH_PARAMS)).toContain(param);
      const ref =
        DEFAULT_SEARCH_PARAMS[param as keyof typeof DEFAULT_SEARCH_PARAMS];
      expect(ref).toBe(value);
    }
  });

  test("uses dividedBy search param on mount", async ({ page }) => {
    test.skip(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      DIVIDED_BY_OPTIONS.length < 2,
      "temporary until we put back the dividedBy options",
    );

    const dividedBySelect = page
      .getByTestId(SELECT_DIVIDED_BY_TESTID)
      .getByRole("combobox");
    const dividedBy = DIVIDED_BY_OPTIONS[1];

    const url = `${ROUTES.DASHBOARD}?dividedBy=${dividedBy}`;

    await page.goto(url);
    await expect(dividedBySelect).toHaveText(dividedBy);
  });

  test("uses scenarioA search param on mount", async ({ page }) => {
    const scenarioASelect = page
      .getByRole("tabpanel", { name: "Scenarios" })
      .getByTestId(SCENARIO_A_MENU_TESTID);

    const scenario = DEFAULT_SCENARIO;
    const url = `${ROUTES.DASHBOARD}?scenarioA=${scenario}`;

    await page.goto(url);
    await expect(scenarioASelect).toHaveText(scenario);
  });

  test("uses scenarioB search param on mount", async ({ page }) => {
    const scenarioBSelect = page
      .getByRole("tabpanel", { name: "Scenarios" })
      .getByTestId(SCENARIO_B_MENU_TESTID);

    const scenario = DEFAULT_SCENARIO;
    const url = `${ROUTES.DASHBOARD}?scenarioB=${scenario}`;

    await page.goto(url);
    await expect(scenarioBSelect).toHaveText(scenario);
  });

  test("tabs search params are used on mount", async ({ page }) => {
    const url = `${ROUTES.DASHBOARD}?settingsTab=Filters&dataTab=Table`;

    await page.goto(url);

    await expect(page.getByText(DEFAULT_SCENARIO)).toBeVisible();
    await expect(page.getByText("Year:")).toBeVisible();
  });

  test("uses attribute search param on mount", async ({ page }) => {
    const attributeSelect = page
      .getByTestId(BREAKDOWN_BY_TESTID)
      .getByRole("combobox");

    const attribute = "Building subtype";
    const url = `${ROUTES.DASHBOARD}?breakdownBy=${attribute}`;

    await page.goto(url);
    await expect(attributeSelect).toHaveText(attribute);
  });

  test("uses display search param on mount", async ({ page }) => {
    const displaySelect = page.getByTestId(DISPLAY_SELECT_TESTID);

    const display = SCENARIO_B_ONLY;
    const expectedLabel = `${SCENARIO_B_LABEL} only`;

    const url = `${ROUTES.DASHBOARD}?display=${display}`;

    await page.goto(url);
    await expect(displaySelect).toHaveText(expectedLabel);
  });

  test("uses filters search param on mount", async ({ page }) => {
    const filters = {
      From: DEFAULT_FROM,
      To: DEFAULT_TO,
      "EU country": ["FR"],
    };
    const filtersEncoded = encodeURIComponent(JSON.stringify(filters));
    const url = `${ROUTES.DASHBOARD}?filters=${filtersEncoded}`;

    await page.goto(url);
    await page.getByRole("tab", { name: "Filters" }).click();

    const filterElements = {
      From: page.getByLabel("From"),
      To: page.getByLabel("To"),
      country: page
        .getByRole("combobox")
        .filter({ hasText: filters["EU country"][0] }),
    };

    await expect(filterElements.From).toHaveText(filters.From.toString());
    await expect(filterElements.To).toHaveText(filters.To.toString());
    await expect(filterElements.country).toBeVisible();
  });
});
