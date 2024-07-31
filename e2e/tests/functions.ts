import { expect, type Page } from "@playwright/test";

type TestScreenshotMatch = {
  page: Page;
  fullPage?: boolean;
};
export async function testPageScreenshot({
  page,
  fullPage = true,
}: TestScreenshotMatch) {
  await page.bringToFront(); // https://github.com/microsoft/playwright/issues/20434#issuecomment-1477560521
  await expect(page).toHaveScreenshot({
    fullPage,
  });
}

type WaitLoadingEnds = {
  page: Page;
};
export const waitLoadingEnds = async ({ page }: WaitLoadingEnds) => {
  const loadingIcon = page.getByRole("progressbar");

  await expect(loadingIcon).toHaveCount(0, { timeout: 20_0000 });
};
