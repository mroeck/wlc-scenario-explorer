/*
  /!\
  Any variable in this file have a twin variable in the backend. Modifying anything here means modifying also the backend the variable with the same name in the share-with-frontend file
  /!\
 */
export const BREAKDOWN_BY_OBJ = {
  countries: "country name",
  buildingUseType: "building use type name",
  buildingUseSubtype: "building use subtype name",
  elementClass: "element class generic name",
  material: "material name JRC CDW",
  activityInOut: "activity in out",
  // activityType: "stock activity type name",
  // carbonCategory: "carbon category",
} as const;

type AttributesEnum = [
  (typeof BREAKDOWN_BY_OBJ)[keyof typeof BREAKDOWN_BY_OBJ],
  ...Array<(typeof BREAKDOWN_BY_OBJ)[keyof typeof BREAKDOWN_BY_OBJ]>,
];
export const ATTRIBUTES = Object.values(BREAKDOWN_BY_OBJ) as AttributesEnum;

export const SCENARIOS_OPTIONS = [
  "scenario 1",
  "scenario 2",
  "scenario 3",
] as const;

export const FILTERS_OBJ = {
  From: "From",
  To: "To",
  countries: "Countries",
  buildingUseType: "Building Use Type",
  buildingUseSubtype: "Building Use Subtype",
  elementClass: "Building Element Class",
  material: "Material Type",
  activityInOut: "Activity in out",
  Region: "Region",
} as const;

export const FILTERS = Object.values(FILTERS_OBJ);

export const INDICATORS = [
  "total GWP",
  "fossil GWP",
  "bio GWP",
  "luluc GWP",
  "material amount",
] as const;
export const UNITS = ["ktCO2", "kt/building"] as const;

export const YEAR_KEY = "stock_projection_year";
export const MAX_YEAR = 2500;
export const MIN_YEAR = 1900;

export const SCENARIO_PARAMETERS_OBJ = {
  improve: [
    "Reduce per capital floor space demand",
    "Prioritise renovation & repair over demolition & new construction",
    "Improve material efficiency",
  ],
  shift: [
    "Reduce per capital floor space demand",
    "Prioritise renovation & repair over demolition & new construction",
    "Improve material efficiency",
  ],
  avoid: [
    "Reduce per capital floor space demand",
    "Prioritise renovation & repair over demolition & new construction",
    "Improve material efficiency",
  ],
} as const;
