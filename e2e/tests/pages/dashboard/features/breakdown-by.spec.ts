import { ROUTES, BREAKDOWN_BY_TESTID } from "@/lib/constants";
import { NONE, VALUE_TO_LABEL } from "@/lib/shared_with_backend/constants";
import { ATTRIBUTE_OPTIONS_ORDER } from "@/lib/utils";
import { expect, test } from "@playwright/test";
import { ACTIVE_DATA_TAB_LOCATOR, TAGS } from "@tests/constants";
import { testScreenshot, waitLoadingEnds } from "@tests/functions";

test.describe("breakdown by", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
    await waitLoadingEnds({ page });
  });

  test(
    `select ${NONE} display expected graph`,
    { tag: TAGS.snapshot },
    async ({ page }) => {
      const breakdownByDropdown = page.getByTestId(BREAKDOWN_BY_TESTID);
      const NoneOption = page.getByLabel(NONE).getByText(NONE);
      await breakdownByDropdown.click();
      await NoneOption.click();

      await testScreenshot({
        page,
        target: page.locator(ACTIVE_DATA_TAB_LOCATOR),
      });
    },
  );

  test("building subtype display expected color legend", async ({ page }) => {
    await page.getByTestId(BREAKDOWN_BY_TESTID).getByRole("combobox").click();
    await page
      .getByLabel("Building subtype")
      .getByText("Building subtype")
      .click();

    for (const subtype of ATTRIBUTE_OPTIONS_ORDER["Building subtype"]) {
      await expect(page.getByText(VALUE_TO_LABEL[subtype])).toBeVisible();
    }
  });
});
