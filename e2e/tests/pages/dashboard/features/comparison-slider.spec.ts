import {
  DEFAULT_SCENARIO,
  DISPLAY_SELECT_TESTID,
  ROUTES,
  TAB_CONTENT_TESTID,
} from "@/lib/constants";
import { expect, test } from "@playwright/test";

test.describe("comparison slider", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
  });

  test("selecting a display show expected graph", async ({ page }) => {
    const graph = page.locator(
      `[data-testid="${TAB_CONTENT_TESTID}"][data-state="active"]`,
    );

    const selectDisplay = page.getByTestId(DISPLAY_SELECT_TESTID);

    await selectDisplay.click();
    await page
      .getByLabel(DEFAULT_SCENARIO + " VS scenario B")
      .getByText(DEFAULT_SCENARIO)
      .click();

    await expect(graph).toHaveScreenshot();

    await selectDisplay.click();
    await page
      .getByLabel(DEFAULT_SCENARIO + " only")
      .getByText(DEFAULT_SCENARIO)
      .click();
    await expect(graph).toHaveScreenshot();

    await selectDisplay.click();
    await page.getByLabel("Scenario B only").click();
    await selectDisplay.click();
    await expect(graph).toHaveScreenshot();
  });
});
