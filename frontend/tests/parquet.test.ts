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
const DATA_PATH = basePath + "/DK-SHIFT-1-1-1-4-1-1-1-4-1-1-4.parquet";

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
  building_use_type_name: ["Non-Residential", "Residential"],
  carbon_category: [
    "Construction embodied carbon",
    "Demolition embodied carbon",
    "Use phase embodied carbon",
    "Use phase operational carbon",
  ],
  country_name: ["AT"],
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
  population_country: undefined,
  stock_activity_type_name: [
    "Existing buildings",
    "New buildings",
    "Refurbishment",
  ],
  stock_floor_area_Mm2: undefined,
  stock_region_name: ["CON"],
} as const satisfies Record<Column, (string | number)[] | undefined>;

const COLUMNS = Object.keys(
  EXPECTED_VALUES,
) as (keyof typeof EXPECTED_VALUES)[];

const COLUMNS_TO_SKIP: Column[] = [
  "country_name",
  "building_archetype_code",
  "stock_region_name",
];

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
      if (COLUMNS_TO_SKIP.includes(column)) {
        return;
      }
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
