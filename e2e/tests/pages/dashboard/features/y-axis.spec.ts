import { DATA_TABS_NAMES, ROUTES } from "@/lib/constants";
import { expect, test } from "@playwright/test";
import { waitLoadingEnds } from "@tests/functions";

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
});
