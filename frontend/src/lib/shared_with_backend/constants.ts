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
  // activityInOut: "flow type", temp: hidden for now
  activityType: "building stock activity",
  carbonCategory: "Whole life cycle stages",
} as const;

type AttributesEnum = [
  (typeof BREAKDOWN_BY_OBJ)[keyof typeof BREAKDOWN_BY_OBJ],
  ...Array<(typeof BREAKDOWN_BY_OBJ)[keyof typeof BREAKDOWN_BY_OBJ]>,
];
export const ATTRIBUTES = Object.values(BREAKDOWN_BY_OBJ) as AttributesEnum;

export const SCENARIOS_OPTIONS = [
  "Example scenario (for illustration purpose only)",
  "Current policy optimistic scenario",
  "Current policy conservative scenario",
  "Additional policy scenario (APOL)",
  "APOL + Improve",
  "APOL + Shift",
  "APOL + Avoid",
  "APOL + A+S+I",
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
  // activityInOut: "flow type",
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

export const UNITS = [
  "none (total)",
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
