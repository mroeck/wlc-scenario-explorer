import {
  GRAPH_TESTID,
  ROUTES,
  SORT_OPTIONS,
  SORT_SELECT_TESTID,
} from "@/lib/constants";
import { test } from "@playwright/test";
import { TAGS } from "@tests/constants";
import { testScreenshot } from "@tests/functions";

test.describe("sort", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
  });

  test(
    `by ${SORT_OPTIONS.desc}`,
    {
      tag: TAGS.snapshot,
    },
    async ({ page }) => {
      await page.getByLabel("Settings").click();
      await page.getByTestId(SORT_SELECT_TESTID).click();
      await page.getByLabel(SORT_OPTIONS.desc).click();
      await testScreenshot({
        page,
        target: page.getByTestId(GRAPH_TESTID).first(),
      });
    },
  );
});
