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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, label] of Object.entries(SORT_OPTIONS)) {
    test(
      `by ${label}`,
      {
        tag: TAGS.snapshot,
      },
      async ({ page }) => {
        const closeButton = page.getByRole("button", { name: "Close" });

        await page.getByLabel("Settings").click();
        await page.getByTestId(SORT_SELECT_TESTID).click();

        await page.getByLabel(SORT_OPTIONS.desc).click();
        await closeButton.click();

        await closeButton.waitFor({
          state: "hidden",
        });

        await testScreenshot({
          page,
          target: page.getByTestId(GRAPH_TESTID).first(),
        });
      },
    );
  }
});
