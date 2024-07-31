import type { SCENARIOS_OPTIONS } from "./shared_with_backend/constants";
import type { Attribute, Indicator, Unit } from "./types";

export const PROD = "production";
export const DEV = "development";
export const TEST = "test";
export const PROJECT_NAME = "GHG Emissions of EU Building Stock Scenarios";

export const DEFAULT_FILTERS = undefined;
export const DEFAULT_ATTRIBUTE: Attribute = "building use type name";
export const DEFAULT_UNIT: Indicator = "total GWP";
export const DEFAULT_UNIT_MINIMIZED = "ktCO2";
export const INDICATOR_TO_UNIT: Record<Indicator, Unit> = {
  "bio GWP": "ktCO2",
  "fossil GWP": "ktCO2",
  "luluc GWP": "ktCO2",
  "material amount": "kt/building",
  "total GWP": "ktCO2",
} as const;
export const SCENARIO_A_ONLY = "Scenario A only";
export const SCENARIO_B_ONLY = "Scenario B only";
export const SCENARIO_A_AND_B = "Scenario A and B";
export const DISPLAY_OPTIONS = [
  SCENARIO_A_ONLY,
  SCENARIO_B_ONLY,
  SCENARIO_A_AND_B,
] as const;
export const DEFAULT_DISPLAY: (typeof DISPLAY_OPTIONS)[number] =
  SCENARIO_A_ONLY;
export const DEFAULT_SCENARIO: (typeof SCENARIOS_OPTIONS)[number] =
  "scenario 1";
export const DEFAULT_FROM = 2020;
export const DEFAULT_TO = 2050;
export const HEADER_HEIGHT = "72";
export const ROUTES = {
  DASHBOARD: "/",
  HELP: "/help",
  ABOUT: "/about",
} as const;
export const DEFAULT_SEARCH_PARAMS = {
  attribute: DEFAULT_ATTRIBUTE,
  unit: DEFAULT_UNIT,
  display: DEFAULT_DISPLAY,
  scenarioA: DEFAULT_SCENARIO,
  filters: {
    From: DEFAULT_FROM,
    To: DEFAULT_TO,
  },
};
export const LOADING_SPINNER_ID = "LoadingSpinner";
export const GRAPH_TITLE_TESTID = "graphTitle";
export const UNIT_TESTID = "unit";
export const ATTRIBUTE_TESTID = "attribute";
export const DISPLAY_SELECT_TESTID = "DISPLAY_SELECT_TESTID";
export const FOR_SCENARIOS_TESTID = "forScenarios";
export const SCENARIO_A_TESTID = "scenarioASelect";
export const SCENARIO_B_TESTID = "scenarioBSelect";
export const COLOR_LEGEND_TESTID = "colorLegend";
export const BREAKDOWN_BY_TESTID = "breakdownby";
export const STACKED_AREA_CHART_TESTID = "stackedAreaChart";
export const STACKED_BAR_CHART_TESTID = "stackedBarChart";
export const DATA_TABLE_TESTID = "dataTable";
export const NO_DATA_FOUND = "No data found";
export const PARAMETER_STATUS = {
  active: "active",
  disable: "disable",
} as const;
export const DEFAULT_COLOR = "lightgrey";
export const DASHBOARD_HEADING = "Dashboard";
export const ABOUT_HEADING = "ABOUT";
export const SELECT_ALL_LABEL = "Select All";
export const ALL_LABEL = "All";
export const GRAPH_FONT_SIZE = 14;
export const SELECT_UNIT_TESTID = "SELECT_UNIT_TESTID";
