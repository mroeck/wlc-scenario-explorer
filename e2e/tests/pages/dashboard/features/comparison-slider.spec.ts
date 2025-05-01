import {
  DEFAULT_SCENARIO,
  ROUTES,
  SCENARIO_TO_ACRONYM,
  TAB_CONTENT_TESTID,
} from "@/lib/constants";
import { test } from "@playwright/test";
import { TAGS } from "@tests/constants";
import { testScreenshot } from "@tests/functions";
import { changeDisplayInUI, changeScenariosInUI } from "../functions";

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

      const scenarioATitle =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        SCENARIO_TO_ACRONYM[DEFAULT_SCENARIO] ?? DEFAULT_SCENARIO;

      const scenarioBlabel: Keys = "BAU";

      const acronymB =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        SCENARIO_TO_ACRONYM[scenarioBlabel] ?? scenarioBlabel;

      const acronymA = SCENARIO_TO_ACRONYM[DEFAULT_SCENARIO];

      await changeScenariosInUI({
        page,
        scenarios: {
          b: scenarioBlabel,
        },
      });

      await changeDisplayInUI({
        page,
        option: scenarioATitle + "VS" + acronymB,
      });

      await testScreenshot({ page, target: graph });

      await changeDisplayInUI({
        page,
        option: acronymA + " only",
      });

      await testScreenshot({ page, target: graph });

      await changeDisplayInUI({
        page,
        option: `${acronymB} only`,
      });

      await testScreenshot({ page, target: graph });
    },
  );
});
