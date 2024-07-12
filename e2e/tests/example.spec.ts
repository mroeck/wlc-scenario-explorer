import { test, expect } from "@playwright/test";
import { env } from "../env";

test("has title", async ({ page }) => {
  await page.goto(env.APP_URL);

  await expect(page).toHaveTitle(/Vite/);
});

test("has hellow world", async ({ page }) => {
  await page.goto(`${env.API_URL}/health`);
  const helloWorld = page.getByText("Hello, World!");
  await expect(helloWorld).toBeVisible();
});
