import { DIVIDED_BY_NONE, NONE } from "../constants";
import type { Attribute, ValidOption } from "../types";

/*
  /!\
  Any variable in this file have a twin variable in the backend. Modifying anything here means modifying also the backend the variable with the same name in the share-with-frontend file
  /!\
 */
export const BREAKDOWN_BY_OBJ = {
  region: "Region",
  country: "country",
  buildingUseType: "Building type",
  buildingUseSubtype: "Building subtype",
  elementClass: "Element Class",
  material: "Material Class",
  activityType: "building stock activity",
  carbonCategory: "Whole life cycle stages",
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
  "Austria",
  "Austria + Shift",
  "Austria + Improve",
  "Austria + Avoid",
  "Austria + Full",
  "Denmark",
  "Denmark + Shift",
  "Denmark + Improve",
  "Denmark + Avoid",
  "Denmark + Full",
] as const;
export type PredefinedScenario = (typeof PREDEFINED_SCENARIOS)[number];

export const SCENARIOS_OPTIONS = [
  ...PREDEFINED_SCENARIOS,
  "Custom scenario results",
] as const;

export const FILTERS_OBJ = {
  From: "From",
  To: "To",
  country: "country",
  buildingUseType: "Building type",
  buildingUseSubtype: "Building subtype",
  elementClass: "Element Class",
  material: "Material Class",
  Region: "Region",
  activityType: "building stock activity",
  carbonCategory: "Whole life cycle stages",
} as const;

export const FILTERS = Object.values(FILTERS_OBJ);

export const INDICATORS = [
  "Material mass",
  "GWP total",
  "GWP fossil",
  "GWP bio",
  "GWP luluc",
] as const;

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
  improve: [
    "Increase low carbon conventional",
    "Reduce transport emissions",
    "Reduce construction process",
    "Reduce operational energy",
  ],
  shift: [
    "Increase bio-based solutions",
    "Increase circularity and reuse",
    "Increase carbon dioxide removal",
  ],
  avoid: [
    "Reduce space per capita",
    "Increase repair and retrofit",
    "Increase material efficiency",
    "Reduce construction waste",
  ],
} as const;

export const API_ROUTES = {
  scenario: "/scenario",
};

export const ATTRIBUTE_OPTIONS_COLOR = {
  // "flow type": {
  //   "Energy in": "#5FB8CE",
  //   MATERIAL_IN: "#5BB89F",
  //   MATERIAL_LOSS_IN: "#56B770",
  //   MATERIAL_LOSS_OUT: "#ABD561",
  //   MATERIAL_OUT: "#FFF352",
  //   PROCESS: "#FCC74B",
  //   TRANSPORT_EOL: "#F99B43",
  //   TRANSPORT_TO_SITE: "#E34542",
  // },
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
    "Non-Residential": "#3ABB5C",
    Residential: "#499ACC",
  },
  country: {
    AT: "#95400E",
    // @ts-expect-error: temp for new/not final parquet files
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
    Undefined: "#863699",
    Wood: "#6B3A83",
  },
  Region: {
    CON: "#EE854A",
    // @ts-expect-error: temp for new/not final parquet files
    Mediterranean: "#3ABB5C",
    Nordic: "#C73B3B",
    Oceanic: "#499ACC",
  },
  "building stock activity": {
    "Existing buildings": "#499ACC",
    "New buildings": "#3ABB5C",
    Refurbishment: "#EE854A",
  },
  "Whole life cycle stages": {
    "Construction embodied carbon": "#377399",
    "Demolition embodied carbon": "#3C7FA8",
    // @ts-expect-error: temp for new/not final parquet files
    "Renovation embodied carbon": "#428CB9",
    "Use phase embodied carbon": "#499ACC",
    "Use phase operational carbon": "#3ABB5C",
  },
} as const satisfies Record<
  Exclude<Attribute, "stock building stock activity name" | "None">,
  Partial<Record<ValidOption, `#${string}`>>
>;

export const VALUE_TO_LABEL: Record<ValidOption, string> = {
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
  "Non-Residential": "Non-Residential",
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
  // @ts-expect-error: temp for new/not final parquet files
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
  Mediterranean: "Mediterranean",
  Nordic: "Nordic",
  Oceanic: "Oceanic",
  "Renovation embodied carbon": "Renovation embodied carbon",
};
