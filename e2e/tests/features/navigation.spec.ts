import {
  ABOUT_TITLE,
  DASHBOARD_HEADING,
  PROJECT_NAME,
  ROUTES,
} from "@/lib/constants";
import { test, expect } from "@playwright/test";

test.describe("header navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD);
  });

  test("has project name", async ({ page }) => {
    await expect(page.getByText(PROJECT_NAME)).toBeVisible();
  });

  test.describe("desktop only", () => {
    test.skip(({ isMobile }) => isMobile, "Desktop only!");

    test("navigation between pages", async ({ page }) => {
      await page.getByRole("link", { name: "About" }).click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        ABOUT_TITLE,
      );

      await page.getByRole("link", { name: "Dashboard" }).click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        DASHBOARD_HEADING,
      );
    });
  });

  test.describe("mobile only", () => {
    test.skip(({ isMobile }) => !isMobile, "Mobile only!");

    test("navigation between pages", async ({ page }) => {
      await page.getByRole("navigation").getByRole("button").click();
      await page.getByRole("button", { name: "About" }).click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        ABOUT_TITLE,
      );

      await page.getByRole("navigation").getByRole("button").click();
      await page.getByRole("button", { name: "Dashboard" }).click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        DASHBOARD_HEADING,
      );
    });
  });
});
