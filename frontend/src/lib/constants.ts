import type { UnionToTuple } from "type-fest";
import type { SCENARIOS_OPTIONS } from "./shared_with_backend/constants";
import type { Attribute, Indicator, Unit } from "./types";

export const PROD = "production";
export const DEV = "development";
export const TEST = "test";
export const PROJECT_NAME = "GHG Emissions of EU Building Stock Scenarios";

export const DEFAULT_FILTERS = undefined;
export const DEFAULT_ATTRIBUTE: Attribute = "Building type";
export const DEFAULT_INDICATOR: Indicator = "GWP total";
export const DEFAULT_UNIT: Unit = "none (total)";
export const DEFAULT_UNIT_MINIMIZED = "MtCO2e";
export const INDICATORS_UNITS = ["MtCO2e", "Mt"] as const;
export const INDICATOR_TO_UNIT: Record<
  Indicator,
  (typeof INDICATORS_UNITS)[number]
> = {
  "GWP bio": "MtCO2e",
  "GWP fossil": "MtCO2e",
  "GWP luluc": "MtCO2e",
  "Material mass": "Mt",
  "GWP total": "MtCO2e",
} as const;
export const SCENARIO_A_ONLY = "Scenario A only";
export const SCENARIO_B_ONLY = "Scenario B only";
export const SCENARIO_A_AND_B = "Scenario A and B";
export const DISPLAY_OPTIONS = [
  SCENARIO_A_ONLY,
  SCENARIO_B_ONLY,
  SCENARIO_A_AND_B,
] as const;
export const SORT_OPTIONS = {
  desc: "biggest to smallest",
  regionsAlphabetically: "regions alphabetically",
} as const;
export const SORT_OPTIONS_VALUES = Object.values(SORT_OPTIONS) as UnionToTuple<
  (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS]
>;
export const DEFAULT_DISPLAY: (typeof DISPLAY_OPTIONS)[number] =
  SCENARIO_A_ONLY;
export const DEFAULT_SORT: (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS] =
  "regions alphabetically";
export const DEFAULT_SCENARIO: (typeof SCENARIOS_OPTIONS)[number] =
  "Example scenario (for illustration purpose only)";
export const DEFAULT_FROM = 2020;
export const DEFAULT_TO = 2050;
export const HEADER_HEIGHT = "72";
export const ROUTES = {
  DASHBOARD: "/",
  HELP: "/help",
  ABOUT: "/about",
} as const;
export const LOADING_SPINNER_ID = "LoadingSpinner";
export const GRAPH_TITLE_TESTID = "graphTitle";
export const UNIT_TESTID = "unit";
export const ATTRIBUTE_TESTID = "attribute";
export const DISPLAY_SELECT_TESTID = "DISPLAY_SELECT_TESTID";
export const SORT_SELECT_TESTID = "SORT_SELECT_TESTID";
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
export const SELECT_ALL_LABEL = "Select All";
export const ALL_LABEL = "All";
export const GRAPH_FONT_SIZE = 14;
export const SELECT_INDICATOR_TESTID = "SELECT_INDICATOR_TESTID";
export const SELECT_UNIT_TESTID = "SELECT_UNIT_TESTID";
export const FILTERS_ORDER = [
  "region",
  "country",
  "building type",
  "building subtype",
  "element class",
  "material class",
  "flow type",
  "building stock activity",
  "whole life cycle stages",
] as const satisfies readonly Lowercase<string>[];

export const ERROR_OCCURED = "Oops, an error occurred";
export const HELP_TITLE = "Functionalities";
export const ABOUT_TITLE = "Introduction";
export const MOSELEY_EMAIL = "philippe.moseley@ec.europa.eu";
export const ROECK_EMAIL = "martin.roeck@kuleuven.be";
export const imageFormats = ["png", "jpeg", "pdf", "svg"] as const;
export const spreadsheetFormats = ["csv", "xlsx"] as const;
export const DOWNLOAD_AS_TESTID = "DOWNLOAD_AS_TESTID";
export const TAB_CONTENT_TESTID = "TAB_CONTENT_TESTID";
export const SETTINGS_TABS_NAMES = {
  scenarios: "Scenarios",
  filters: "Filters",
} as const;
type SETTINGS_TAB =
  (typeof SETTINGS_TABS_NAMES)[keyof typeof SETTINGS_TABS_NAMES];
export const DEFAULT_SETTINGS_TAB: SETTINGS_TAB = "Scenarios";

export const DATA_TABS_NAMES = {
  stackedAreaChart: "Stacked Area Chart",
  lineChart: "Line Chart",
  stackedBarChart: "Stacked Bar Chart",
  table: "Table",
} as const;
type DATA_TAB = (typeof DATA_TABS_NAMES)[keyof typeof DATA_TABS_NAMES];
export const DEFAULT_DATA_TAB: DATA_TAB = "Stacked Area Chart";
export const DEFAULT_SEARCH_PARAMS = {
  attribute: DEFAULT_ATTRIBUTE,
  indicator: DEFAULT_INDICATOR,
  unit: DEFAULT_UNIT,
  display: DEFAULT_DISPLAY,
  scenarioA: DEFAULT_SCENARIO,
  filters: {
    From: DEFAULT_FROM,
    To: DEFAULT_TO,
  },
  settingsTab: DEFAULT_SETTINGS_TAB,
  dataTab: DEFAULT_DATA_TAB,
  sort: DEFAULT_SORT,
};
export const LINKS = {
  doi: "https://doi.org/10.5281/zenodo.13315281",
  explorerWebsite: "https://ae-scenario-explorer.cloud.set.kuleuven.be",
  study: {
    wholeLifeCarbon: "https://c.ramboll.com/whole-life-carbon-reduction",
    lifeCycleGreenhouse:
      "https://c.ramboll.com/life-cycle-emissions-of-eu-building-and-construction",
  },
} as const;

export const HELP_PAGE_IDS = {
  predefinedScenarioSelection: "predefinedScenarioSelection",
  scenarioParametersCustomization: "scenarioParametersCustomization",
  filterSetting: "filterSetting",
  indicator: "indicatorDoc",
  dividedBy: "dividedBy",
  breakdownBy: "breakdownBy",
  display: "display",
  sort: "sort",
} as const;
export const SCENARIO_A_LABEL = "primary scenario";
export const SCENARIO_B_LABEL = "scenario B";
