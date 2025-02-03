import {
  DOWNLOAD_AS_TESTID,
  ROUTES,
  SHORTCUT_LINK_TESTID,
  imageFormats,
  spreadsheetFormats,
} from "@/lib/constants";
import { test, expect } from "@playwright/test";
import { TAGS } from "@tests/constants";
import { waitLoadingEnds } from "@tests/functions";

test.describe("dashboard download", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
    await waitLoadingEnds({ page });
  });

  const formats = [...imageFormats, ...spreadsheetFormats] as const;

  for (let i = 0; i < formats.length; i++) {
    const format = formats[i];

    if (format === "pdf") continue;

    test(`as ${format}`, { tag: TAGS.snapshot }, async ({ page }) => {
      await page.getByTestId(DOWNLOAD_AS_TESTID).click();

      const downloadPromise = page.waitForEvent("download");
      await page.getByRole("menuitem", { name: format }).click();
      const download = await downloadPromise;

      const stream = await download.createReadStream();
      const chunks = [];

      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);
      const filenameRaw = download.suggestedFilename();
      const filename = filenameRaw.replace(".svg+xml", ".svg");

      expect(buffer).toMatchSnapshot(filename);
    });
  }
  test.describe("shortcut", () => {
    test("shortcut icon link has expected href and do not navigate on click", async ({
      page,
    }) => {
      const dialogTitle = page.getByText(
        "How to create a shortcut to the current page?",
      );

      await page.getByTestId(DOWNLOAD_AS_TESTID).click();
      await page.getByRole("menuitem", { name: "Shortcut" }).click();

      const shortcutLink =
        (await page.getByTestId(SHORTCUT_LINK_TESTID).getAttribute("href")) ??
        "could not find href of locator";

      await page.getByTestId(SHORTCUT_LINK_TESTID).click();
      await expect(dialogTitle).toBeVisible();
      await page.getByRole("button", { name: "Close" }).click();

      await expect(page).toHaveURL(shortcutLink);
    });
  });
});
