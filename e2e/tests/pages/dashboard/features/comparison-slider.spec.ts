import {
  DEFAULT_SCENARIO,
  ROUTES,
  SCENARIO_B_LABEL,
  SCENARIO_TO_ACRONYM,
  TAB_CONTENT_TESTID,
} from "@/lib/constants";
import { test } from "@playwright/test";
import { TAGS } from "@tests/constants";
import { testScreenshot } from "@tests/functions";
import { changeDisplayInUI } from "../functions";

test.describe("comparison slider", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
  });

  test(
    "selecting a display show expected graph",
    { tag: TAGS.snapshot },
    async ({ page }) => {
      const graph = page.locator(
        `[data-testid="${TAB_CONTENT_TESTID}"][data-state="active"]`,
      );

      type Keys = keyof typeof SCENARIO_TO_ACRONYM;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const scenarioATitle =
        SCENARIO_TO_ACRONYM[DEFAULT_SCENARIO as Keys] ?? DEFAULT_SCENARIO;

      await changeDisplayInUI({
        page,
        option: scenarioATitle + "VS" + SCENARIO_B_LABEL,
      });

      await testScreenshot({ page, target: graph });

      await changeDisplayInUI({
        page,
        option: DEFAULT_SCENARIO + " only",
      });

      await testScreenshot({ page, target: graph });

      await changeDisplayInUI({
        page,
        option: `${SCENARIO_B_LABEL} only`,
      });

      await testScreenshot({ page, target: graph });
    },
  );
});
