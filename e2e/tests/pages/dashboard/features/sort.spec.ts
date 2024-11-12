import { CHART_TESTID, ROUTES, SORT_OPTIONS } from "@/lib/constants";
import { test } from "@playwright/test";
import { TAGS } from "@tests/constants";
import { testScreenshot } from "@tests/functions";
import { changeSort } from "../functions";

test.describe("sort", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");

  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const label of Object.values(SORT_OPTIONS)) {
    test(
      `by ${label}`,
      {
        tag: TAGS.snapshot,
      },
      async ({ page }) => {
        await changeSort({
          page,
          option: label,
        });

        await testScreenshot({
          page,
          target: page.getByTestId(CHART_TESTID).first(),
        });
      },
    );
  }
});
