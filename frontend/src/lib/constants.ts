import type { UnionToTuple, ValueOf } from "type-fest";
import {
  UNITS_FROM_BACKEND,
  type FILTERS_OBJ,
  type PredefinedScenario,
  type SCENARIOS_OPTIONS,
} from "./shared_with_backend/constants";
import type { Attribute, Indicator, DividedBy, Level } from "./types";
import type { DomainAll } from "@/routes/-index/components/data-section/types";
import { env } from "../env";
import type { z } from "zod";
import type { ResultsActionsLevelsSuggestionsSchema } from "./shared_with_backend/schemas";

export const MOBILE_SETTINGS_BUTTON = "Scenarios and Filters";
export const RESET_LABEL = "Reset";
export const PROD = "production";
export const DEV = "development";
export const isProd = env.PUBLIC_NODE_ENV === PROD;
export const PROJECT_NAME = "GHG Emissions of EU Building Stock Scenarios";

export const DEFAULT_FILTERS = undefined;
export const DEFAULT_BREAKDOWN_BY: Attribute = "Building type";
export const DEFAULT_INDICATOR = "GWP total" satisfies Indicator;
export const DEFAULT_DIVIDED_BY: DividedBy = "none (total)";
export const INDICATORS_UNITS = ["MtCO₂", "Gt"] as const;
export const INDICATOR_TO_UNIT: Record<
  Indicator,
  (typeof INDICATORS_UNITS)[number]
> = {
  "GWP bio": "MtCO₂",
  "GWP fossil": "MtCO₂",
  "GWP luluc": "MtCO₂",
  "Material mass": "Gt",
  "GWP total": "MtCO₂",
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
export const DEFAULT_SCENARIO: (typeof SCENARIOS_OPTIONS)[number] = "CPOL/A";
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
export const GRAPH_TITLE_DIVIDED_BY_TESTID = "DIVIDED_BY_TESTID";
export const ATTRIBUTE_TESTID = "attribute";
export const DISPLAY_SELECT_TESTID = "DISPLAY_SELECT_TESTID";
export const SORT_SELECT_TESTID = "SORT_SELECT_TESTID";
export const FOR_SCENARIOS_TESTID = "forScenarios";
export const SCENARIO_A_MENU_TESTID = "SCENARIO_A_TESTID";
export const SCENARIO_B_MENU_TESTID = "SCENARIO_B_MENU_TESTID";
export const COLOR_LEGEND_TESTID = "colorLegend";
export const BREAKDOWN_BY_TESTID = "breakdownby";
export const CHART_TESTID = "CHART_TESTID";
export const DATA_TABLE_TESTID = "dataTable";
export const NO_DATA_FOUND = "No data found";
export const PARAMETER_STATUS = {
  active: "active",
  approximation: "approximation",
} as const;
export const DEFAULT_COLOR = "#499ACC";
export const DASHBOARD_HEADING = "Dashboard";
export const SELECT_ALL_LABEL = "Select All";
export const ALL_LABEL = "All";
export const GRAPH_FONT_SIZE = 14;
export const SELECT_INDICATOR_TESTID = "SELECT_INDICATOR_TESTID";
export const SELECT_DIVIDED_BY_TESTID = "SELECT_DIVIDED_BY_TESTID";

type BreakdownByOrderItem = Lowercase<
  ValueOf<Omit<typeof FILTERS_OBJ, "From" | "To">> | "None"
>;
export const BREAKDOWN_BY_ORDER = [
  "eu region",
  "eu country",
  "building type",
  "building subtype",
  "element class",
  "material class",
  "building stock activity",
  "life cycle stages",
  "life cycle modules",
  "none",
] as const satisfies readonly BreakdownByOrderItem[];

export const ERROR_OCCURED = "Oops, an error occurred";
export const HELP_TITLE = "Functionalities";
export const ABOUT_TITLE = "Introduction";
export const MOSELEY_EMAIL = "philippe.moseley@ec.europa.eu";
export const ROECK_EMAIL = "martin.roeck@kuleuven.be";
export const imageFormats = ["png", "jpeg", "pdf", "svg"] as const;
export const spreadsheetFormats = ["csv", "xlsx"] as const;
export const DOWNLOAD_AS_TESTID = "DOWNLOAD_AS_TESTID";
export const TAB_CONTENT_TESTID = "TAB_CONTENT_TESTID";
export const STRATEGY_TESTID = "STRATEGY_TESTID";
export const SET_ALL_PARAMETERS_TRIGGER_TESTID =
  "SET_ALL_PARAMETERS_TRIGGER_TESTID";
export const SETTINGS_TABS_NAMES = {
  scenarios: "Scenarios",
  filters: "Filters",
} as const;
type SETTINGS_TAB =
  (typeof SETTINGS_TABS_NAMES)[keyof typeof SETTINGS_TABS_NAMES];
export const DEFAULT_SETTINGS_TAB: SETTINGS_TAB = "Scenarios";

export const DATA_TABS_NAMES = {
  stackedAreaChart: "Stacked Area Graph",
  lineChart: "Line Graph",
  stackedBarChart: "Stacked Bar Graph",
  table: "Table",
} as const;
type DATA_TAB = (typeof DATA_TABS_NAMES)[keyof typeof DATA_TABS_NAMES];
export const DEFAULT_DATA_TAB: DATA_TAB = "Stacked Area Graph";
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
const hostname =
  env.PUBLIC_NODE_ENV === "production"
    ? location.hostname
    : "consistent-url-for-testing.com";
export const LINKS = {
  doi: "https://doi.org/10.5281/zenodo.13315281",
  explorerWebsite: `https://${hostname}`,
  study: {
    wholeLifeCarbon: "https://c.ramboll.com/whole-life-carbon-reduction",
    lifeCycleGreenhouse:
      "https://c.ramboll.com/life-cycle-emissions-of-eu-building-and-construction",
  },
} as const;

export const HELP_PAGE_IDS = {
  predefinedScenarioSelection: "predefined-scenarios",
  scenarioParametersCustomization: "parameters-customization",
  avoid: "avoid",
  improve: "improve",
  shift: "shift",
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
  introduction: "introduction",
  studyBackground: "studyBackground",
  studyObjectives: "studyObjectives",
  scenarioModellingTool: "scenarioModellingTool",
  userInterface: "userInterface",
  generalRemarks: "generalRemarks",
  faq: "faq",
} as const;
export const SCENARIO_A_LABEL = "Primary scenario";
export const SCENARIO_B_LABEL = "Secondary scenario";
export const SCENARIO_A_ACRONYM = "primary";
export const SCENARIO_B_ACRONYM = "secondary";
export const NO_SCENARIO_SELECTED_LABEL = "undefined";
export const STORAGE_KEYS = {
  isDisclaimerAccepted: "scenarioExplorerIsDisclaimerAccepted",
};
export const DISCLAIMER_MODAL_TITLE = "Website Disclaimer";
export const GRAPH_AXIS_COLOR = "hsl(223 0% 20%)";
export const SCENARIO_TO_ACRONYM = {
  // "Additional Policy scenario": "APOL",
  // "Conservative scenario of Current Policies": "CPOL/B",
  // "Current Policy + Avoid + Shift + Improve strategies": "CPOL+ASI",
  // "Current Policy + Avoid strategies": "CPOL+A",
  // "Current Policy + Improve strategies": "CPOL+I",
  // "Current Policy + Shift strategies": "CPOL+S",
  // "Optimistic scenario of Current Policies": "CPOL/A",
  // "Example scenario (for illustration purpose only)": undefined,
  "ALL/HIGH": "ALL/HIGH",
  "CPOL/A": "CPOL/A",
  "CPOL/B": "CPOL/B",
  "APOL/A": "APOL/A",
  "APOL/B": "APOL/B",
  BAU: "BAU",
  "Custom scenario": "Custom",
} satisfies Record<(typeof SCENARIOS_OPTIONS)[number], string | undefined>;
export const EMBODIED_CARBON = "Embodied carbon (EC)";
export const OPERATIONAL_CARBON = "Operational carbon (OC)";
export const EMBODIED_CARBON_TEXT = "embodied carbon";
export const OPERATION_CARBON_TEXT = "operational carbon";
export const SCENARIO_A_KEY_PREFIX = `${SCENARIO_A_LABEL}.`;
export const SCENARIO_B_KEY_PREFIX = `${SCENARIO_B_LABEL}.`;
export const PATTERN = {
  width: 8,
  height: 4,
} as const;
export const DEFAULT_UNIT_MINIMIZED =
  UNITS_FROM_BACKEND[DEFAULT_INDICATOR][DEFAULT_DIVIDED_BY];
export const DEFAULT_Y_AXIS_DOMAIN_ALL: DomainAll = {
  line: {
    max: null,
    min: null,
    isUpdated: {
      A: false,
      B: false,
    },
  },
  stackedArea: {
    max: null,
    min: null,
    isUpdated: {
      A: false,
      B: false,
    },
  },
};

export const DEFAULT_DASHBOARD_SEARCH = {
  breakdownBy: DEFAULT_BREAKDOWN_BY,
  display: DEFAULT_DISPLAY,
  scenarioA: DEFAULT_SCENARIO,
  indicator: DEFAULT_INDICATOR,
  dividedBy: DEFAULT_DIVIDED_BY,
  dataTab: DEFAULT_DATA_TAB,
  settingsTab: DEFAULT_SETTINGS_TAB,
  sort: DEFAULT_SORT,
} as const;

export const DEFAULT_ACTIONS_LEVELS_SUGGESTIONS = {
  reduce_transport_and_construction_emissions: [],
  increase_use_of_improved_materials: [],
  increase_of_circularity_measures: [],
  shift_to_low_carbon_and_bio_based_solutions: [],
  reduce_operational_emissions: [],
  reduce_space_per_capita: [],
} satisfies z.infer<
  typeof ResultsActionsLevelsSuggestionsSchema
>["suggestions"];

export const SHORTCUT_LINK_TESTID = "SHORTCUT_LINK_TESTID";

export const DEFAULT_X_AXIS_DOMAIN = [];
export const DEFAULT_SCENARIO_DATA = [];
export const LEVEL_TO_LABEL = {
  "1.0": "0.0",
  "2.0": "0.5",
  "3.0": "1.0",
  "4.0": "max",
} satisfies Record<Level, string>;
export const PREDEFINED_SCENARIO_TO_APPROXIMATION = {
  "ALL/HIGH": "1.0",
  "CPOL/A": "2.0",
  "CPOL/B": "3.0",
  "APOL/A": "4.0",
  "APOL/B": "4.0",
  BAU: "1.0",
} satisfies Record<PredefinedScenario, Level>;
export const MIN_TICK_AMOUNT = 4;
