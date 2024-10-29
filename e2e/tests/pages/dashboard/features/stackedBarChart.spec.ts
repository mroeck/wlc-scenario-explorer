import {
  DATA_TABS_NAMES,
  GRAPH_TESTID,
  ROUTES,
  SCENARIO_B_LABEL,
} from "@/lib/constants";
import { test } from "@playwright/test";
import { TAGS } from "@tests/constants";
import { testScreenshot } from "@tests/functions";
import { changeDisplayInUI, changeScenariosInUI } from "../functions";

test.describe("stacked bar chart", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");

  test.beforeEach(async ({ page }) => {
    await page.goto(
      ROUTES.DASHBOARD +
        `?animation=false&dataTab=${DATA_TABS_NAMES.stackedBarChart}`,
    );
  });

  test(
    "display only one scenario show expected graph",
    {
      tag: TAGS.snapshot,
    },
    async ({ page }) => {
      await testScreenshot({
        page,
        target: page.getByTestId(GRAPH_TESTID).first(),
      });

      const option = SCENARIO_B_LABEL + " only";
      await changeDisplayInUI({ page, option });

      await testScreenshot({
        page,
        target: page.getByTestId(GRAPH_TESTID).first(),
      });
    },
  );

  test(
    "display VS show proper columns pattern",
    {
      tag: TAGS.snapshot,
    },
    async ({ page }) => {
      const scenarios = {
        a: "Austria + Shift (A/S)",
        b: "Austria + Improve (A/I)",
      } as const;

      await changeScenariosInUI({ page, scenarios });

      const option = "VS";
      await changeDisplayInUI({ page, option });

      await testScreenshot({
        page,
        target: page.getByTestId(GRAPH_TESTID).first(),
      });
    },
  );
});
