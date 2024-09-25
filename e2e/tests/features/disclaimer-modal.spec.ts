import { DISCLAIMER_MODAL_TITLE, PROJECT_NAME, ROUTES } from "@/lib/constants";
import test, { expect } from "@playwright/test";
import { env } from "@tests/env";

test.describe("disclaimer modal", () => {
  test.use({
    storageState: {
      origins: [
        {
          localStorage: [],
          origin: env.BASE_URL,
        },
      ],
      cookies: [],
    },
  });
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.ABOUT);
  });

  test("open on every user session", async ({ page }) => {
    const modalTitle = page.getByRole("heading", {
      name: DISCLAIMER_MODAL_TITLE,
    });
    const confirmButton = page.getByRole("button", { name: "I Understand" });

    await expect(modalTitle).toBeVisible();

    await confirmButton.click();
    await page.reload();
    await expect(modalTitle).toBeVisible();

    await page.getByLabel("Don't show again").click();
    await confirmButton.click();
    await page.reload();

    await expect(page.getByText(PROJECT_NAME).first()).toBeVisible();
    await expect(modalTitle).not.toBeVisible();
  });
});
