import { describe, expect, test } from "vitest";
import { Database } from "duckdb-async";
import path from "path";
import { z } from "zod";
import { env } from "@/env";

const db = await Database.create(":memory:");

const basePath = env.PUBLIC_DATA_PATH
  ? path.resolve(__dirname, env.PUBLIC_DATA_PATH)
  : "/app/data";
// const DATA_PATH = basePath + "/AT-SHIFT-1-1-1-4-1-1-1-4-1-1-4.parquet";
// const DATA_PATH = basePath + "/DK-SHIFT-1-1-1-4-1-1-1-4-1-1-4.parquet";
const DATA_PATH = basePath + "/FULL.parquet";

const EXPECTED_SCHEMA = [
  {
    column_name: "stock_projection_year",
    column_type: "USMALLINT",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "building_archetype_code",
    column_type: "VARCHAR",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "stock_region_name",
    column_type: "VARCHAR",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "country_name",
    column_type: "VARCHAR",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "building_use_type_name",
    column_type: "VARCHAR",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "building_use_subtype_name",
    column_type: "VARCHAR",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "LCS_EN15978",
    column_type: "VARCHAR",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "element_class_generic_name",
    column_type: "VARCHAR",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "techflow_name_mmg",
    column_type: "VARCHAR",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "material_name_JRC_CDW",
    column_type: "VARCHAR",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "activity_in_out",
    column_type: "VARCHAR",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "stock_activity_type_name",
    column_type: "VARCHAR",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "carbon_category",
    column_type: "VARCHAR",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "stock_floor_area_Mm2",
    column_type: "FLOAT",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "floor_area_country",
    column_type: "FLOAT",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "amount_material",
    column_type: "FLOAT",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "ind_GWP_Tot",
    column_type: "FLOAT",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "ind_GWP_Fos",
    column_type: "FLOAT",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "ind_GWP_Bio",
    column_type: "FLOAT",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "ind_GWP_LuLuc",
    column_type: "FLOAT",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "population_country",
    column_type: "INTEGER",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "population_archetype",
    column_type: "INTEGER",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
  {
    column_name: "floor_area_archetype",
    column_type: "FLOAT",
    null: "YES",
    key: null,
    default: null,
    extra: null,
  },
] as const;

type Column = (typeof EXPECTED_SCHEMA)[number]["column_name"];

export const EXPECTED_VALUES = {
  stock_projection_year: [2020, 2025, 2030, 2035, 2040, 2045, 2050],
  activity_in_out: [
    "ENERGY_IN",
    "MATERIAL_IN",
    "MATERIAL_LOSS_IN",
    "MATERIAL_LOSS_OUT",
    "MATERIAL_OUT",
    "PROCESS",
    "TRANSPORT_EOL",
    "TRANSPORT_TO_SITE",
  ],
  amount_material: undefined,
  building_archetype_code: undefined,
  building_use_subtype_name: [
    "ABL",
    "EDU",
    "HEA",
    "HOR",
    "MFH",
    "OFF",
    "OTH",
    "SFH",
    "TRA",
  ],
  building_use_type_name: ["Non-residential", "Residential"],
  carbon_category: [
    "Construction embodied carbon",
    "Demolition embodied carbon",
    "Renovation embodied carbon",
    "Use phase embodied carbon",
    "Use phase operational carbon",
  ],
  country_name: [
    "AT",
    "BE",
    "BG",
    "CY",
    "CZ",
    "DE",
    "DK",
    "EE",
    "EL",
    "ES",
    "FI",
    "FR",
    "HR",
    "HU",
    "IE",
    "IT",
    "LT",
    "LU",
    "LV",
    "MT",
    "NL",
    "PL",
    "PT",
    "RO",
    "SE",
    "SI",
    "SK",
  ],
  element_class_generic_name: [
    "Common walls",
    "Electrical services",
    "External openings",
    "External walls",
    "Internal openings",
    "Internal walls",
    "Roofs",
    "Staircases",
    "Storey floors",
    "Substructure",
    "Technical services",
  ],
  floor_area_archetype: undefined,
  floor_area_country: undefined,
  ind_GWP_Bio: undefined,
  ind_GWP_Fos: undefined,
  ind_GWP_LuLuc: undefined,
  ind_GWP_Tot: undefined,
  LCS_EN15978: [
    "A1-3",
    "A4",
    "A5",
    "B2",
    "B4",
    "B5",
    "B6",
    "C1",
    "C2",
    "C3",
    "C4",
  ],
  material_name_JRC_CDW: [
    "Aluminium",
    "Brick",
    "Ceramics",
    "Cleaning",
    "Concrete",
    "Copper",
    "Electronics",
    "Energy",
    "Glass",
    "Gypsum",
    "Insulation",
    "Other Construction Materials",
    "Other Metal",
    "Paint and Glue",
    "Plastic",
    "Process",
    "Sand",
    "Steel",
    "Undefined",
    "Wood",
  ],
  population_archetype: undefined,
  population_country: [
    0, 10089138, 10104622, 1012858, 10220601, 10291457, 10303200, 1030807,
    10322613, 1046219, 10510196, 10530251, 10571354, 10625402, 10693861,
    10694436, 10696535, 10746886, 10762174, 10789806, 11099033, 11405423,
    11507338, 11661206, 11693373, 11757990, 11835820, 11894881, 11926987,
    11927324, 11979369, 12254064, 1256223, 1269633, 1281555, 1294043, 1308435,
    1322440, 1329916, 1395039, 1462550, 1536108, 15502837, 16018918, 1618827,
    16576187, 1712746, 17169288, 17404793, 17751055, 17808000, 17969884,
    18119551, 18142292, 1815550, 18185792, 18185796, 18507547, 1907094,
    19281118, 2043751, 2065380, 2081622, 2094654, 2095314, 2106316, 2114603,
    2137939, 2236142, 2339698, 2452313, 2575553, 2707915, 2793592, 3392559,
    34102204, 34897373, 3502067, 35661656, 3612487, 36369328, 37018453, 3721032,
    37567248, 37941122, 3828089, 3936509, 4056285, 47321434, 48310619, 48746399,
    49110869, 49348530, 49377094, 49479880, 4966879, 506951, 5147215, 5232249,
    5272930, 5290709, 5312439, 5361229, 5384612, 5426143, 5440730, 5457679,
    5467891, 5480971, 5504390, 5519298, 5527189, 5537441, 557426, 5655026,
    5714371, 5811651, 58125032, 5828425, 5884275, 588691, 58870898, 5904540,
    59375006, 5963578, 59709982, 59942512, 60088529, 6016719, 6018816, 60286529,
    6055503, 6073416, 6080087, 6098190, 614214, 6213191, 6224049, 626031,
    634910, 6450296, 652604, 662364, 668373, 6690388, 67197367, 68036808,
    68749400, 692722, 69354321, 6949549, 69802409, 70010903, 70015780, 718104,
    739137, 756215, 769048, 82669724, 82983422, 83135181, 83178426, 83318670,
    83453697, 83482307, 887331, 8904262, 9029008, 9149001, 9232708, 9270352,
    928295, 9292363, 9332840, 9345829, 9350754, 9375347, 9441139, 9503127,
    9532830, 9593258, 9619020, 962854, 9697220, 9713851, 9771975, 9786632,
    990814, 9910798, 9948994,
  ],
  stock_activity_type_name: [
    "Existing buildings",
    "New buildings",
    "Refurbishment",
  ],
  stock_floor_area_Mm2: undefined,
  stock_region_name: ["CON", "MED", "NOR", "OCE"],
  techflow_name_mmg: undefined,
} as const satisfies Record<Column, (string | number)[] | undefined>;

const COLUMNS = Object.keys(
  EXPECTED_VALUES,
) as (keyof typeof EXPECTED_VALUES)[];

describe("parquet files data", () => {
  test("has expected columns", async () => {
    const actualSchema = await db.all(`DESCRIBE TABLE '${DATA_PATH}'`);
    expect(
      actualSchema,
      `Expected ${EXPECTED_SCHEMA.length} columns but got ${actualSchema.length}`,
    ).toHaveLength(EXPECTED_SCHEMA.length);

    actualSchema.forEach((column, index) => {
      const expected = EXPECTED_SCHEMA[index];

      expect(
        column.column_name,
        `Column at index ${index} has incorrect name`,
      ).toBe(expected.column_name);

      expect(
        column.column_type,
        `Column "${column.column_name}" has incorrect type`,
      ).toBe(expected.column_type);

      expect(
        column.null,
        `Column "${column.column_name}" has incorrect null constraint`,
      ).toBe(expected.null);

      expect(
        column.key,
        `Column "${column.column_name}" has incorrect key value`,
      ).toBe(expected.key);

      expect(
        column.default,
        `Column "${column.column_name}" has incorrect default value`,
      ).toBe(expected.default);

      expect(
        column.extra,
        `Column "${column.column_name}" has incorrect extra value`,
      ).toBe(expected.extra);
    });
  });

  for (const column of COLUMNS) {
    test(`has expected distinct ${column} values`, async () => {
      const expectedValues = EXPECTED_VALUES[column];

      if (!expectedValues) return;

      const dataRaw = await db.all(
        `SELECT DISTINCT ${column} FROM '${DATA_PATH}'`,
      );

      const data = z
        .object({ [column]: z.number().or(z.string()) })
        .array()
        .parse(dataRaw);

      const distincts = data.map((item) => Object.values(item)).flat();

      expect(distincts.sort()).toStrictEqual(expectedValues.sort());
    });
  }
});
