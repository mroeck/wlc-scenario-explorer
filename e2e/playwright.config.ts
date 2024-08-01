import { defineConfig, devices } from "@playwright/test";
import { env } from "@tests/env";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: process.env.CI ? "never" : "on-failure" }]],
  use: {
    baseURL: env.BASE_URL,
    trace: "on-first-retry",
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.03,
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],

  webServer: process.env.CI
    ? undefined
    : [
        {
          command:
            "cd ../frontend && VITE_NODE_ENV=test npm run build && npm run preview",
          url: "http://localhost:3001/health",
          reuseExistingServer: true,
          timeout: 30 * 1000,
        },
        {
          command: "cd ../backend && DATA_PATH=./data poetry run task preview",
          url: "http://localhost:8081/health",
          reuseExistingServer: true,
          timeout: 30 * 1000,
        },
      ],
});
