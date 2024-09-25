import { ROUTES, HELP_TITLE } from "@/lib/constants";
import { test, expect } from "@playwright/test";
import { TAGS } from "@tests/constants";
import { testPageScreenshot } from "@tests/functions";

test.describe("dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.HELP);
  });

  test("page snapshot", { tag: TAGS.snapshot }, async ({ page }) => {
    await expect(page.getByText(HELP_TITLE)).toBeVisible({
      timeout: 10_000,
    });
    await testPageScreenshot({ page });
  });
});
