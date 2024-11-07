import { ROUTES } from "@/lib/constants";
import { expect, test } from "@playwright/test";
import { TAGS } from "@tests/constants";
import { testPageScreenshot } from "@tests/functions";

test.describe("dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.HELP);
  });

  test("page snapshot", { tag: TAGS.snapshot }, async ({ page }) => {
    const title = page
      .locator("#introduction")
      .getByRole("heading", { name: "Introduction" });
    await expect(title).toBeVisible();
    await testPageScreenshot({ page });
  });
});
