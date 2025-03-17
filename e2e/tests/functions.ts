import {
  expect,
  type Locator,
  type Page,
  type PageAssertionsToHaveScreenshotOptions,
} from "@playwright/test";

type WaitLoadingEnds = {
  page: Page;
};
export const waitLoadingEnds = async ({ page }: WaitLoadingEnds) => {
  const loadingIcon = page.getByRole("progressbar");

  await expect(loadingIcon).toHaveCount(0, { timeout: 20_0000 });
};

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
  await waitLoadingEnds({ page });

  for (const img of await page.locator("img").all()) {
    // https://github.com/microsoft/playwright/issues/6046#issuecomment-1803609118

    await expect(img).toHaveJSProperty("complete", true);
    await expect(img).not.toHaveJSProperty("naturalWidth", 0);
  }

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
