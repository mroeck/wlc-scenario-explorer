/*
  /!\
  Any variable in this file have a twin variable in the backend. Modifying anything here means modifying also the backend the variable with the same name in the share-with-frontend file
  /!\
 */
export const BREAKDOWN_BY_OBJ = {
  region: "region",
  country: "country",
  buildingUseType: "use type",
  buildingUseSubtype: "use subtype",
  elementClass: "element class",
  material: "material class",
  activityInOut: "flow type",
  activityType: "building stock activity",
  carbonCategory: "WLC Category",
} as const;

type AttributesEnum = [
  (typeof BREAKDOWN_BY_OBJ)[keyof typeof BREAKDOWN_BY_OBJ],
  ...Array<(typeof BREAKDOWN_BY_OBJ)[keyof typeof BREAKDOWN_BY_OBJ]>,
];
export const ATTRIBUTES = Object.values(BREAKDOWN_BY_OBJ) as AttributesEnum;

export const SCENARIOS_OPTIONS = [
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
  buildingUseType: "use type",
  buildingUseSubtype: "use subtype",
  elementClass: "Element Class",
  material: "Material Class",
  activityInOut: "flow type",
  Region: "Region",
  activityType: "building stock activity",
  carbonCategory: "WLC Category",
} as const;

export const FILTERS = Object.values(FILTERS_OBJ);

export const INDICATORS = [
  "Material mass",
  "GWP total",
  "GWP fossil",
  "GWP bio",
  "GWP luluc",
] as const;

export const UNITS = ["MtCO2e", "Mt"] as const;

export const YEAR_KEY = "stock_projection_year";
export const MAX_YEAR = 2500;
export const MIN_YEAR = 1900;

export const SCENARIO_PARAMETERS_OBJ = {
  improve: [
    "Low carbon conventional",
    "Reduce transport emissions",
    "Reduce construction process",
    "Reduce operational energy",
  ],
  shift: [
    "Bio-based solutions",
    "Circularity and reuse",
    "Carbon dioxide removal",
  ],
  avoid: [
    "Reduce space per capita",
    "Repair and retrofit",
    "Material efficiency",
    "Reduce construction waste",
  ],
} as const;
