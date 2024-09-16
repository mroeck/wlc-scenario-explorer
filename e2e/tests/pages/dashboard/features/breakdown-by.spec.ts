import { ROUTES, BREAKDOWN_BY_TESTID, NONE } from "@/lib/constants";
import { test } from "@playwright/test";
import { ACTIVE_DATA_TAB_LOCATOR } from "@tests/constants";
import { testScreenshot, waitLoadingEnds } from "@tests/functions";

test.describe("breakdown by", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
    await waitLoadingEnds({ page });
  });

  test(`select ${NONE} display expected graph`, async ({ page }) => {
    const breakdownByDropdown = page.getByTestId(BREAKDOWN_BY_TESTID);
    const buildingUseSubtypeOption = page.getByLabel(NONE).getByText(NONE);

    await breakdownByDropdown.click();
    await buildingUseSubtypeOption.click();

    await testScreenshot({
      page,
      target: page.locator(ACTIVE_DATA_TAB_LOCATOR),
    });
  });
});
