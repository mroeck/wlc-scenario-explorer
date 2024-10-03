import { ERROR_OCCURED, ROUTES } from "@/lib/constants";
import { API_ROUTES } from "@/lib/shared_with_backend/constants";
import { expect, test } from "@playwright/test";
import { waitLoadingEnds } from "@tests/functions";

test.describe("issue when scenario fetching", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");

  test("warn user when error was returned", async ({ page }) => {
    await page.route("*/**" + API_ROUTES.scenario, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "text/plain",
        body: "Server error occured",
      });
    });

    await page.goto(ROUTES.DASHBOARD + "?animation=false");
    await waitLoadingEnds({ page });
    await expect(
      page.getByRole("heading", { name: ERROR_OCCURED }),
    ).toBeVisible();
  });
});
