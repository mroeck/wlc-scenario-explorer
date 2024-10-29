import type { UnionToTuple } from "type-fest";
import type {
  PREDEFINED_SCENARIOS,
  SCENARIOS_OPTIONS,
} from "./shared_with_backend/constants";
import type { Attribute, Indicator, Unit } from "./types";

export const MOBILE_SETTINGS_BUTTON = "Scenarios and Filters";
export const RESET_LABEL = "Reset";
export const PROD = "production";
export const DEV = "development";
export const TEST = "test";
export const PROJECT_NAME = "GHG Emissions of EU Building Stock Scenarios";

export const DEFAULT_FILTERS = undefined;
export const DEFAULT_BREAKDOWN_BY: Attribute = "Building type";
export const DEFAULT_INDICATOR: Indicator = "GWP total";
export const DEFAULT_DIVIDED_BY: Unit = "none (total)";
export const DEFAULT_UNIT_MINIMIZED: (typeof INDICATORS_UNITS)[number] =
  "MtCO2e";
export const DIVIDED_BY_UNITS = ["m²", "capita"] as const;
export const DIVIDED_BY_NONE = "none (total)";
export const DIVIDED_BY_TO_MINIFIED_UNIT: Record<
  Exclude<Unit, typeof DIVIDED_BY_NONE>,
  (typeof DIVIDED_BY_UNITS)[number]
> = {
  "capita (archetype)": "capita",
  "capita (country)": "capita",
  "m² (archetype)": "m²",
  "m² (country)": "m²",
} as const;
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
  categoriesAlphabetically: "group / alphabetical",
  desc: "Descending value",
} as const;
export const SORT_OPTIONS_VALUES = Object.values(SORT_OPTIONS) as UnionToTuple<
  (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS]
>;
export const DEFAULT_DISPLAY: (typeof DISPLAY_OPTIONS)[number] =
  SCENARIO_A_ONLY;
export const DEFAULT_SORT: (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS] =
  "group / alphabetical";
export const DEFAULT_SCENARIO: (typeof SCENARIOS_OPTIONS)[number] =
  "Example scenario (for illustration purpose only)";
export const DEFAULT_FROM = 2020;
export const DEFAULT_TO = 2050;
export const HEADER_HEIGHT = "72";
export const ROUTES = {
  DASHBOARD: "/",
  HELP: "/help",
  ABOUT: "/about",
  HEALTH: "/health",
} as const;
export const LOADING_SPINNER_ID = "LoadingSpinner";
export const GRAPH_TITLE_TESTID = "graphTitle";
export const DIVIDED_BY_TESTID = "DIVIDED_BY_TESTID";
export const ATTRIBUTE_TESTID = "attribute";
export const DISPLAY_SELECT_TESTID = "DISPLAY_SELECT_TESTID";
export const SORT_SELECT_TESTID = "SORT_SELECT_TESTID";
export const FOR_SCENARIOS_TESTID = "forScenarios";
export const SCENARIO_A_MENU_TESTID = "SCENARIO_A_TESTID";
export const SCENARIO_B_MENU_TESTID = "SCENARIO_B_MENU_TESTID";
export const COLOR_LEGEND_TESTID = "colorLegend";
export const BREAKDOWN_BY_TESTID = "breakdownby";
export const GRAPH_TESTID = "GRAPH_TESTID";
export const DATA_TABLE_TESTID = "dataTable";
export const NO_DATA_FOUND = "No data found";
export const PARAMETER_STATUS = {
  active: "active",
  disable: "disable",
} as const;
export const DEFAULT_COLOR = "#499ACC";
export const DASHBOARD_HEADING = "Dashboard";
export const SELECT_ALL_LABEL = "Select All";
export const ALL_LABEL = "All";
export const GRAPH_FONT_SIZE = 14;
export const SELECT_INDICATOR_TESTID = "SELECT_INDICATOR_TESTID";
export const SELECT_DIVIDED_BY_TESTID = "SELECT_DIVIDED_BY_TESTID";
export const BREAKDOWN_BY_ORDER = [
  "region",
  "country",
  "building type",
  "building subtype",
  "element class",
  "material class",
  "flow type",
  "building stock activity",
  "whole life cycle stages",
  "none",
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
  breakdownBy: DEFAULT_BREAKDOWN_BY,
  indicator: DEFAULT_INDICATOR,
  dividedBy: DEFAULT_DIVIDED_BY,
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
  predefinedScenarioSelection: "predefined-scenarios",
  scenarioParametersCustomization: "parameters-customization",
  filterSetting: "filters",
  indicator: "scenario-indicator",
  dividedBy: "scenario-divided-by",
  breakdownBy: "scenario-breakdown-by",
  display: "display",
  sort: "sort",
  scenario: "scenario",
  visualizationTypes: "visualization-types",
  visualizationSettings: "visualization-settings",
  output: "output",
  visualization: "visualization",
} as const;
export const SCENARIO_A_LABEL = "primary scenario";
export const SCENARIO_B_LABEL = "second scenario";
export const SCENARIO_A_ACRONYM = "primary";
export const SCENARIO_B_ACRONYM = "2nd";
export const NONE = "None";
export const STORAGE_KEYS = {
  isDisclaimerAccepted: "scenarioExplorerIsDisclaimerAccepted",
};
export const DISCLAIMER_MODAL_TITLE = "Website Disclaimer";
export const GRAPH_AXIS_COLOR = "hsl(223 0% 20%)";
export const SCENARIO_TO_ACRONYM = {
  "Additional Policy scenario": "APOL",
  "Conservative scenario of Current Policies": "CPOL/B",
  "Current Policy + Avoid + Shift + Improve strategies": "CPOL+ASI",
  "Current Policy + Avoid strategies": "CPOL+A",
  "Current Policy + Improve strategies": "CPOL+I",
  "Current Policy + Shift strategies": "CPOL+S",
  "Optimistic scenario of Current Policies": "CPOL/A",
  "Example scenario (for illustration purpose only)": undefined,
  Austria: undefined,
  "Austria + Avoid": "A/A",
  "Austria + Improve": "A/I",
  "Austria + Shift": "A/S",
} satisfies Record<(typeof PREDEFINED_SCENARIOS)[number], string | undefined>;
export const EMBODIED_CARBON = "Embodied carbon (EC)";
export const OPERATIONAL_CARBON = "Operational carbon (OC)";
export const EMBODIED_CARBON_TEXT = "embodied carbon";
export const OPERATION_CARBON_TEXT = "operational carbon";
export const SCENARIO_A_KEY_PREFIX = `${SCENARIO_A_LABEL}.`;
export const SCENARIO_B_KEY_PREFIX = `${SCENARIO_B_LABEL}.`;
