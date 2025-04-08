import {
  CHART_TESTID,
  DATA_TABS_NAMES,
  ROUTES,
  SELECT_DIVIDED_BY_TESTID,
} from "@/lib/constants";
import { expect, test } from "@playwright/test";
import { TAGS } from "@tests/constants";
import { testScreenshot, waitLoadingEnds } from "@tests/functions";

test.describe("Y axis", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");

  test("when A vs B, both Y axes are synchronized", async ({ page }) => {
    await page.goto(
      ROUTES.DASHBOARD +
        "?" +
        "indicator=GWP%20bio&display=Scenario%20A%20and%20B&scenarioA=CPOL%2FA&scenarioB=APOL",
    );

    await waitLoadingEnds({ page });

    const Yaxis = {
      stackedArea: {
        max: page.getByText("2").nth(3),
        min: page.getByText("-4").nth(1),
      },
      line: {
        max: page.getByText("2").nth(3),
        min: page.getByText("-4").nth(1),
      },
    };
    await expect(Yaxis.stackedArea.max).toBeVisible();
    await expect(Yaxis.stackedArea.min).toBeVisible();

    await page.getByRole("tab", { name: DATA_TABS_NAMES.lineChart }).click();

    await expect(Yaxis.line.max).toBeVisible();
    await expect(Yaxis.line.min).toBeVisible();
  });
  test(
    "when displaying only a very small value, the Y axis is not full of zeros",
    {
      tag: TAGS.snapshot,
    },
    async ({ page }) => {
      await page.goto(ROUTES.DASHBOARD + "?animation=false");

      await page.getByRole("tab", { name: "Filters" }).click();
      await page.getByTestId("Material Class").getByRole("combobox").click();
      await page.getByPlaceholder("Search").fill("copper");
      await page.getByPlaceholder("Search").press("Enter");
      await page.getByTestId("breakdownby").getByRole("combobox").click();
      await page.getByRole("option", { name: "Material Class" }).click();

      await page.getByRole("tab", { name: "Line Graph" }).click();
      await page
        .getByTestId(SELECT_DIVIDED_BY_TESTID)
        .getByRole("combobox")
        .click();
      await page
        .getByLabel("capita (users)")
        .getByText("capita (users)")
        .click();
      await expect(page.getByText("mgCO₂/capita")).toBeVisible();
      await testScreenshot({
        page,
        target: page.getByTestId(CHART_TESTID).nth(1),
      });
    },
  );
});
