import {
  expect,
  type Locator,
  type Page,
  type PageAssertionsToHaveScreenshotOptions,
} from "@playwright/test";

type TestScreenshotMatch = {
  page: Page;
  target: Locator | Page;
  options?: PageAssertionsToHaveScreenshotOptions;
};
export async function testScreenshot({
  page,
  target,
  options,
}: TestScreenshotMatch) {
  await page.bringToFront(); // https://github.com/microsoft/playwright/issues/20434#issuecomment-1477560521
  await page.evaluate(() => document.fonts.ready);

  await expect(target).toHaveScreenshot(options);
}

type TestPageScreenshotMatch = {
  page: Page;
  fullPage?: boolean;
};
export async function testPageScreenshot({
  page,
  fullPage = true,
}: TestPageScreenshotMatch) {
  await testScreenshot({ page, target: page, options: { fullPage } });
}

type WaitLoadingEnds = {
  page: Page;
};
export const waitLoadingEnds = async ({ page }: WaitLoadingEnds) => {
  const loadingIcon = page.getByRole("progressbar");

  await expect(loadingIcon).toHaveCount(0, { timeout: 20_0000 });
};
