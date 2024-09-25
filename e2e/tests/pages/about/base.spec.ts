import { ABOUT_TITLE, ROUTES } from "@/lib/constants";
import { test, expect } from "@playwright/test";
import { TAGS } from "@tests/constants";
import { testPageScreenshot } from "@tests/functions";

test.describe("dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.ABOUT);
  });

  test(
    "page snapshot",
    {
      tag: TAGS.snapshot,
    },
    async ({ page }) => {
      await expect(page.getByText(ABOUT_TITLE)).toBeVisible({
        timeout: 10_000,
      });
      await testPageScreenshot({ page });
    },
  );
});
