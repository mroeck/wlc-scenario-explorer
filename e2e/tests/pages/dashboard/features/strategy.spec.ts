import {
  CHART_TESTID,
  ROUTES,
  SET_ALL_PARAMETERS_TRIGGER_TESTID,
  STRATEGY_TESTID,
} from "@/lib/constants";
import type { SCENARIO_PARAMETERS_OBJ } from "@/lib/shared_with_backend/constants";
import type { Level } from "@/lib/types";
import type { LEVEL_TO_LABEL } from "@/routes/-index/components/side-section/components/ParameterLevel";
import { expect, test, type Page } from "@playwright/test";
import { TAGS } from "@tests/constants";
import { testScreenshot } from "@tests/functions";

const openStrategySection = async ({
  page,
  section,
  lastAction,
}: {
  page: Page;
  section: string;
  lastAction: string;
}) => {
  await page.getByRole("button", { name: section }).click();
  await expect(page.getByText(lastAction)).toBeVisible();
};

type Section = keyof typeof SCENARIO_PARAMETERS_OBJ;
const setAllParameter = async ({
  page,
  section,
  level,
}: {
  page: Page;
  section: Section;
  level: (typeof LEVEL_TO_LABEL)[Level];
}) => {
  const dialog = page.getByRole("dialog");
  const sections = ["improve", "shift", "avoid"] as const satisfies Section[];

  const index = sections.indexOf(section);

  await page.getByTestId(SET_ALL_PARAMETERS_TRIGGER_TESTID).nth(index).click();

  await dialog.getByRole("button", { name: level, exact: true }).click();
  await expect(dialog).not.toBeVisible();
};

test.describe("Strategy", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
  });
  test(
    "strategy accordion snapshot",
    {
      tag: TAGS.snapshot,
    },
    async ({ page }) => {
      await openStrategySection({
        page,
        section: "improve",
        lastAction: "Reduce operational emissions:",
      });

      await testScreenshot({
        page,
        target: page.getByTestId(STRATEGY_TESTID),
      });
    },
  );

  test(
    "selecting some levels should show a text asking to provide all parameters",
    {
      tag: TAGS.snapshot,
    },
    async ({ page }) => {
      await openStrategySection({
        page,
        section: "improve",
        lastAction: "Reduce operational emissions:",
      });

      await page.getByRole("button", { name: "0.0" }).first().click();
      await page.getByRole("button", { name: "0.0" }).nth(1).click();

      await expect(page.getByText("Please select a level for")).toBeVisible();

      await testScreenshot({
        page,
        target: page.getByTestId(STRATEGY_TESTID).first(),
      });
    },
  );

  test(
    "set all parameters to value",
    {
      tag: TAGS.snapshot,
    },
    async ({ page }) => {
      await openStrategySection({
        page,
        section: "improve",
        lastAction: "Reduce operational emissions:",
      });

      await page.getByTestId(SET_ALL_PARAMETERS_TRIGGER_TESTID).first().click();
      await page
        .getByRole("dialog")
        .getByRole("button", { name: "0.0", exact: true })
        .click();

      await testScreenshot({
        page,
        target: page.getByTestId(STRATEGY_TESTID).first(),
      });
    },
  );

  test(
    "setting a valid strategy should display a graph",
    {
      tag: TAGS.snapshot,
    },
    async ({ page }) => {
      await setAllParameter({ page, section: "improve", level: "0.0" });
      await setAllParameter({ page, section: "avoid", level: "0.0" });
      await setAllParameter({ page, section: "shift", level: "0.0" });

      await testScreenshot({
        page,
        target: page.getByTestId(CHART_TESTID).nth(1),
      });
    },
  );
  test("unselecting a level should not reset the strategy in search param", async ({
    page,
  }) => {
    const expectedBefore = ["1.0", null, null, null, null, null];
    const expectedAfter = [null, null, null, null, null, null];

    await openStrategySection({
      page,
      section: "shift",
      lastAction: "Shift to low carbon and bio-based solutions:",
    });

    await page.getByRole("button", { name: "0.0" }).first().click();

    const strategyBeforeAsString =
      new URL(page.url()).searchParams.get("strategy") ?? "[]";
    const strategyBefore = JSON.parse(strategyBeforeAsString) as Array<
      null | string
    >;

    await page.getByRole("button", { name: "0.0" }).first().click();
    const strategyAfterAsString =
      new URL(page.url()).searchParams.get("strategy") ?? "[]";
    const strategyAfter = JSON.parse(strategyAfterAsString) as Array<
      null | string
    >;

    expect(strategyBefore).toEqual(expectedBefore);
    expect(strategyAfter).toEqual(expectedAfter);
  });
});
