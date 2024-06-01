import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://frontend:3001");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vite/);
});

test("has hellow world", async ({ page }) => {
  await page.goto("http://backend:8081/health");
  const helloWorld = page.getByText("Hello, World!");
  // Expect a title "to contain" a substring.
  await expect(helloWorld).toBeVisible();
});
