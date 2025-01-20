import { ImproveInfo } from "../../routes/-index/components/side-section/components/ImproveInfo";
import type { Attribute, ValidOption } from "../types";
import { ShiftInfo } from "../../routes/-index/components/side-section/components/ShiftInfo";
import { AvoidInfo } from "../../routes/-index/components/side-section/components/AvoidInfo";
import type { UnionToTuple } from "type-fest";

/*
  /!\
  Any variable in this file has variables in the backend sharing some of its values. Modifying anything here means modifying also the backend the variable depending on it in the share-with-frontend folder
  /!\
 */

export const TOTAL_ACTIONS = 11;
const COMMON_IN_FILTERS_AND_BREAKDOWN = {
  country: "country",
  buildingUseType: "Building type",
  buildingUseSubtype: "Building subtype",
  elementClass: "Element Class",
  material: "Material Class",
  Region: "Region",
  activityType: "building stock activity",
  carbonCategory: "Life cycle stages",
  lcaStages: "Life cycle modules",
} as const;

export const NONE = "None";
export const BREAKDOWN_BY_OBJ = {
  ...COMMON_IN_FILTERS_AND_BREAKDOWN,
  none: NONE,
} as const;

type AttributesEnum = [
  (typeof BREAKDOWN_BY_OBJ)[keyof typeof BREAKDOWN_BY_OBJ],
  ...Array<(typeof BREAKDOWN_BY_OBJ)[keyof typeof BREAKDOWN_BY_OBJ]>,
];
export const ATTRIBUTES = Object.values(BREAKDOWN_BY_OBJ) as AttributesEnum;

export const PREDEFINED_SCENARIOS = [
  // "Example scenario (for illustration purpose only)",
  // "Optimistic scenario of Current Policies",
  // "Conservative scenario of Current Policies",
  // "Additional Policy scenario",
  // "Current Policy + Improve strategies",
  // "Current Policy + Shift strategies",
  // "Current Policy + Avoid strategies",
  // "Current Policy + Avoid + Shift + Improve strategies",
  "BAU",
  "CPOL/A",
  "CPOL/B",
  "APOL",
  "ALL/HIGH",
] as const;
export type PredefinedScenario = (typeof PREDEFINED_SCENARIOS)[number];
export const CUSTOM_SCENARIO = "Custom scenario results";
export const SCENARIOS_OPTIONS = [
  ...PREDEFINED_SCENARIOS,
  CUSTOM_SCENARIO,
] as const;

export const FILTERS_OBJ = {
  ...COMMON_IN_FILTERS_AND_BREAKDOWN,
  From: "From",
  To: "To",
} as const;

export const FILTERS = Object.values(FILTERS_OBJ);

export const INDICATORS = [
  "Material mass",
  "GWP total",
  "GWP fossil",
  "GWP bio",
  "GWP luluc",
] as const;

export const DIVIDED_BY_NONE = "none (total)";

export const DIVIDED_BY_OPTIONS = [
  DIVIDED_BY_NONE,
  "m² (country)",
  "m² (archetype)",
  "capita (country)",
  "capita (archetype)",
] as const;

export const YEAR_KEY = "stock_projection_year";
export const MAX_YEAR = 2500;
export const MIN_YEAR = 1900;

export const SCENARIO_PARAMETERS_OBJ = {
  improve: {
    info: ImproveInfo,
    strategies: [
      "Increase low carbon conventional",
      "Reduce transport emissions",
      "Reduce construction process",
      "Reduce operational energy",
    ],
  },
  shift: {
    info: ShiftInfo,
    strategies: [
      "Increase bio-based solutions",
      "Increase circularity and reuse",
      "Increase carbon dioxide removal",
    ],
  },
  avoid: {
    info: AvoidInfo,
    strategies: [
      "Reduce space per capita",
      "Increase repair and retrofit",
      "Increase material efficiency",
      "Reduce construction waste",
    ],
  },
} as const;
type CategoriesOfStrategies = keyof typeof SCENARIO_PARAMETERS_OBJ;
export type Actions =
  (typeof SCENARIO_PARAMETERS_OBJ)[CategoriesOfStrategies]["strategies"][number];

export const SCENARIO_PARAMETERS_ORDER: UnionToTuple<Actions> = [
  "Increase low carbon conventional",
  "Reduce transport emissions",
  "Reduce construction process",
  "Reduce operational energy",
  "Increase bio-based solutions",
  "Increase circularity and reuse",
  "Increase carbon dioxide removal",
  "Reduce space per capita",
  "Increase repair and retrofit",
  "Increase material efficiency",
  "Reduce construction waste",
];

export const API_ROUTES = {
  scenario: "/scenario",
  suggestions: "/suggestions",
};

export const ATTRIBUTE_OPTIONS_COLOR = {
  "Element Class": {
    "External openings": "#882929",
    "Internal openings": "#C73B3B",
    "Electrical services": "#3C7FA8",
    "Technical services": "#499ACC",
    Roofs: "#95400E",
    Staircases: "#CD5713",
    "Storey floors": "#EE854A",
    Substructure: "#F3A87C",
    "Common walls": "#28803F",
    "External walls": "#3ABB5C",
    "Internal walls": "#78D18F",
  },
  "Building subtype": {
    ABL: "#3C7FA8",
    MFH: "#499ACC",
    SFH: "#56B5F0",
    EDU: "#216044",
    HEA: "#267248",
    HOR: "#2B844C",
    OFF: "#309650",
    TRA: "#35A854",
    OTH: "#3ABB5C",
  },
  "Building type": {
    "Non-residential": "#3ABB5C",
    Residential: "#499ACC",
  },
  country: {
    AT: "#95400E",
    BE: "#2D5F7E",
    BG: "#BB4F11",
    CY: "#216934",
    CZ: "#CD5713",
    DE: "#377399",
    DK: "#3C7FA8",
    EE: "#882929",
    EL: "#28803F",
    ES: "#309B4C",
    FI: "#A53131",
    FR: "#428CB9",
    HR: "#3ABB5C",
    HU: "#EC7632",
    IE: "#499ACC",
    IT: "#5CC778",
    LT: "#C73B3B",
    LU: "#69ABD5",
    LV: "#D15D5D",
    MT: "#78D18F",
    NL: "#83BADC",
    PL: "#EE854A",
    PT: "#8FD9A2",
    RO: "#F19763",
    SE: "#D97979",
    SI: "#F3A87C",
    SK: "#F5B58F",
  },
  "Material Class": {
    Aluminium: "#2D5F7E",
    Brick: "#3C7FA8",
    Ceramics: "#499ACC",
    Cleaning: "#42AB94",
    Concrete: "#3ABB5C",
    Copper: "#8DCD48",
    Electronics: "#B6D63E",
    Energy: "#DFDF34",
    Glass: "#E7B23F",
    Gypsum: "#EB9C45",
    Insulation: "#EE854A",
    "Other Construction Materials": "#DB6043",
    "Other Metal": "#C73B3B",
    "Paint and Glue": "#D6576D",
    Plastic: "#DD6586",
    Process: "#E4739E",
    Sand: "#C352A7",
    Steel: "#A131AF",
    Wood: "#6B3A83",
  },
  Region: {
    CON: "#EE854A",
    MED: "#3ABB5C",
    NOR: "#C73B3B",
    OCE: "#499ACC",
  },
  "building stock activity": {
    "Existing buildings": "#499ACC",
    "New buildings": "#3ABB5C",
    Refurbishment: "#EE854A",
  },
  "Life cycle stages": {
    "Construction embodied carbon": "#377399",
    "Renovation embodied carbon": "#3C7FA8",
    "Use phase embodied carbon": "#428CB9",
    "Demolition embodied carbon": "#499ACC",
    "Use phase operational carbon": "#3ABB5C",
  },
  "Life cycle modules": {
    "A1-3": "#3ABB5C",
    A4: "#2D5F7E",
    A5: "#499ACC",

    B2: "#DB6043",
    B4: "#EE854A",
    B5: "#EB9C45",
    B6: "#E7B23F",

    C1: "#6B3A83",
    C2: "#A131AF",
    C3: "#C352A7",
    C4: "#E4739E",
  },
} as const satisfies Record<
  Exclude<Attribute, "stock building stock activity name" | "None">,
  Partial<Record<Exclude<ValidOption, number>, `#${string}`>>
>;

export const VALUE_TO_LABEL: Record<Exclude<ValidOption, number>, string> = {
  "External openings": "External openings",
  "Internal openings": "Internal openings",
  "Electrical services": "Electrical services",
  "Technical services": "Technical services",
  Roofs: "Roofs",
  Staircases: "Staircases",
  "Storey floors": "Storey floors",
  Substructure: "Substructure",
  "Common walls": "Common walls",
  "External walls": "External walls",
  "Internal walls": "Internal walls",
  "Non-residential": "Non-residential",
  Residential: "Residential",
  Aluminium: "Aluminium",
  Brick: "Brick",
  Ceramics: "Ceramics",
  Cleaning: "Cleaning",
  Concrete: "Concrete",
  Copper: "Copper",
  Electronics: "Electronics",
  Energy: "Energy",
  Glass: "Glass",
  Gypsum: "Gypsum",
  Insulation: "Insulation",
  "Other Construction Materials": "Other Construction Materials",
  "Other Metal": "Other Metal",
  "Paint and Glue": "Paint and Glue",
  Plastic: "Plastic",
  Process: "Process",
  Sand: "Sand",
  Steel: "Steel",
  Undefined: "Undefined",
  Wood: "Wood",
  "Existing buildings": "Existing buildings",
  "New buildings": "New buildings",
  Refurbishment: "Refurbishment",
  "Construction embodied carbon": "Construction EC",
  "Demolition embodied carbon": "Demolition EC",
  "Use phase embodied carbon": "Use phase EC",
  "Renovation embodied carbon": "Renovation EC",
  "Use phase operational carbon": "Use phase OC",
  CON: "Continental",
  AT: "AT",
  SFH: "Single-family house",
  MFH: "Multi-family house",
  ABL: "Apartment block",
  OFF: "Office",
  TRA: "Trade",
  EDU: "Education",
  HEA: "Health",
  HOR: "Hotel and restaurant",
  OTH: "Other",
  BE: "BE",
  BG: "BG",
  CY: "CY",
  CZ: "CZ",
  DE: "DE",
  DK: "DK",
  EE: "EE",
  EL: "EL",
  ES: "ES",
  FI: "FI",
  FR: "FR",
  HR: "HR",
  HU: "HU",
  IE: "IE",
  IT: "IT",
  LT: "LT",
  LU: "LU",
  LV: "LV",
  MT: "MT",
  NL: "NL",
  PL: "PL",
  PT: "PT",
  RO: "RO",
  SE: "SE",
  SI: "SI",
  SK: "SK",
  MED: "Mediterranean",
  NOR: "Nordic",
  OCE: "Oceanic",
  "A1-3": "A1-3",
  A4: "A4",
  A5: "A5",
  B2: "B2",
  B4: "B4",
  B5: "B5",
  B6: "B6",
  C1: "C1",
  C2: "C2",
  C3: "C3",
  C4: "C4",
  ENERGY_IN: "ENERGY_IN",
  MATERIAL_IN: "MATERIAL_IN",
  MATERIAL_LOSS_IN: "MATERIAL_LOSS_IN",
  MATERIAL_LOSS_OUT: "MATERIAL_LOSS_OUT",
  MATERIAL_OUT: "MATERIAL_OUT",
  PROCESS: "PROCESS",
  TRANSPORT_EOL: "TRANSPORT_EOL",
  TRANSPORT_TO_SITE: "TRANSPORT_TO_SITE",
};

export const LABEL_TO_VALUE = Object.fromEntries(
  Object.entries(VALUE_TO_LABEL).map(([key, value]) => [value, key]),
);

export const UNITS_FROM_BACKEND = {
  "GWP total": {
    [DIVIDED_BY_NONE]: "MtCO₂",
    "m² (country)": "ktCO₂/m²",
    "m² (archetype)": "MtCO₂/m²",
    "capita (country)": "tCO₂/capita",
    "capita (archetype)": "tCO₂/capita",
  },
} as const;
