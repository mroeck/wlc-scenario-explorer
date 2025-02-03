import { ROUTES } from "@/lib/constants";
import { expect, test } from "@playwright/test";

test.describe("share", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");

  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
  });

  const SOCIAL_MEDIAS = [
    { name: "x", hostname: "x.com" },
    { name: "bluesky", hostname: "bsky.app" },
    { name: "facebook", hostname: "facebook.com" },
    { name: "linkedin", hostname: "linkedin.com" },
  ];

  for (const media of SOCIAL_MEDIAS) {
    test(`clicking on ${media.name} icon redirect to their website`, async ({
      page,
    }) => {
      await page.locator(".mt-auto > .flex > .inline-flex").click();
      await page.getByRole("figure", { name: media.name }).click();
      await expect(page).toHaveURL(new RegExp(`${media.hostname}(/.*)?$`));
    });
  }
});
