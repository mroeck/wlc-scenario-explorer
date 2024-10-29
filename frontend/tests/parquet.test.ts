import { describe, expect, test } from "vitest";
import { Database } from "duckdb-async";
import path from "path";
import { z } from "zod";
import { env } from "@/env";

const db = await Database.create(":memory:");

const basePath = env.PUBLIC_DATA_PATH
  ? path.resolve(__dirname, env.PUBLIC_DATA_PATH)
  : "/app/data";
const DATA_PATH = basePath + "/SHIFT.parquet";

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
    "Energy in",
    "MATERIAL_IN",
    "MATERIAL_LOSS_IN",
    "MATERIAL_LOSS_OUT",
    "MATERIAL_OUT",
    "PROCESS",
    "TRANSPORT_EOL",
    "TRANSPORT_TO_SITE",
  ],
  amount_material: undefined,
  building_archetype_code: [
    "AT-ABL-1850-1918-EXB",
    "AT-ABL-1850-1918-REF",
    "AT-ABL-1919-1944-EXB",
    "AT-ABL-1919-1944-REF",
    "AT-ABL-1945-1969-EXB",
    "AT-ABL-1945-1969-REF",
    "AT-ABL-1970-1979-EXB",
    "AT-ABL-1970-1979-REF",
    "AT-ABL-1980-1989-EXB",
    "AT-ABL-1980-1989-REF",
    "AT-ABL-1990-1999-EXB",
    "AT-ABL-1990-1999-REF",
    "AT-ABL-2000-2010-EXB",
    "AT-ABL-2000-2010-REF",
    "AT-ABL-2011-2019-EXB",
    "AT-ABL-2022-2025-NEW",
    "AT-EDU-1850-1944-EXB",
    "AT-EDU-1850-1944-REF",
    "AT-EDU-1945-1969-EXB",
    "AT-EDU-1945-1969-REF",
    "AT-EDU-1970-1979-EXB",
    "AT-EDU-1970-1979-REF",
    "AT-EDU-1980-1989-EXB",
    "AT-EDU-1980-1989-REF",
    "AT-EDU-1990-1999-EXB",
    "AT-EDU-1990-1999-REF",
    "AT-EDU-2000-2010-EXB",
    "AT-EDU-2000-2010-REF",
    "AT-EDU-2011-2019-EXB",
    "AT-EDU-2022-2025-NEW",
    "AT-HEA-1850-1944-EXB",
    "AT-HEA-1850-1944-REF",
    "AT-HEA-1945-1969-EXB",
    "AT-HEA-1945-1969-REF",
    "AT-HEA-1970-1979-EXB",
    "AT-HEA-1970-1979-REF",
    "AT-HEA-1980-1989-EXB",
    "AT-HEA-1980-1989-REF",
    "AT-HEA-1990-1999-EXB",
    "AT-HEA-1990-1999-REF",
    "AT-HEA-2000-2010-EXB",
    "AT-HEA-2000-2010-REF",
    "AT-HEA-2011-2019-EXB",
    "AT-HEA-2022-2025-NEW",
    "AT-HOR-1850-1944-EXB",
    "AT-HOR-1850-1944-REF",
    "AT-HOR-1945-1969-EXB",
    "AT-HOR-1945-1969-REF",
    "AT-HOR-1970-1979-EXB",
    "AT-HOR-1970-1979-REF",
    "AT-HOR-1980-1989-EXB",
    "AT-HOR-1980-1989-REF",
    "AT-HOR-1990-1999-EXB",
    "AT-HOR-1990-1999-REF",
    "AT-HOR-2000-2010-EXB",
    "AT-HOR-2000-2010-REF",
    "AT-HOR-2011-2019-EXB",
    "AT-HOR-2022-2025-NEW",
    "AT-MFH-1850-1918-EXB",
    "AT-MFH-1850-1918-REF",
    "AT-MFH-1919-1944-EXB",
    "AT-MFH-1919-1944-REF",
    "AT-MFH-1945-1969-EXB",
    "AT-MFH-1945-1969-REF",
    "AT-MFH-1970-1979-EXB",
    "AT-MFH-1970-1979-REF",
    "AT-MFH-1980-1989-EXB",
    "AT-MFH-1980-1989-REF",
    "AT-MFH-1990-1999-EXB",
    "AT-MFH-1990-1999-REF",
    "AT-MFH-2000-2010-EXB",
    "AT-MFH-2000-2010-REF",
    "AT-MFH-2011-2019-EXB",
    "AT-MFH-2022-2025-NEW",
    "AT-OFF-1850-1944-EXB",
    "AT-OFF-1850-1944-REF",
    "AT-OFF-1945-1969-EXB",
    "AT-OFF-1945-1969-REF",
    "AT-OFF-1970-1979-EXB",
    "AT-OFF-1970-1979-REF",
    "AT-OFF-1980-1989-EXB",
    "AT-OFF-1980-1989-REF",
    "AT-OFF-1990-1999-EXB",
    "AT-OFF-1990-1999-REF",
    "AT-OFF-2000-2010-EXB",
    "AT-OFF-2000-2010-REF",
    "AT-OFF-2011-2019-EXB",
    "AT-OFF-2022-2025-NEW",
    "AT-OTH-1850-1944-EXB",
    "AT-OTH-1850-1944-REF",
    "AT-OTH-1945-1969-EXB",
    "AT-OTH-1945-1969-REF",
    "AT-OTH-1970-1979-EXB",
    "AT-OTH-1970-1979-REF",
    "AT-OTH-1980-1989-EXB",
    "AT-OTH-1980-1989-REF",
    "AT-OTH-1990-1999-EXB",
    "AT-OTH-1990-1999-REF",
    "AT-OTH-2000-2010-EXB",
    "AT-OTH-2000-2010-REF",
    "AT-OTH-2011-2019-EXB",
    "AT-OTH-2022-2025-NEW",
    "AT-SFH-1850-1918-EXB",
    "AT-SFH-1850-1918-REF",
    "AT-SFH-1919-1944-EXB",
    "AT-SFH-1919-1944-REF",
    "AT-SFH-1945-1969-EXB",
    "AT-SFH-1945-1969-REF",
    "AT-SFH-1970-1979-EXB",
    "AT-SFH-1970-1979-REF",
    "AT-SFH-1980-1989-EXB",
    "AT-SFH-1980-1989-REF",
    "AT-SFH-1990-1999-EXB",
    "AT-SFH-1990-1999-REF",
    "AT-SFH-2000-2010-EXB",
    "AT-SFH-2000-2010-REF",
    "AT-SFH-2011-2019-EXB",
    "AT-SFH-2022-2025-NEW",
    "AT-TRA-1850-1944-EXB",
    "AT-TRA-1850-1944-REF",
    "AT-TRA-1945-1969-EXB",
    "AT-TRA-1945-1969-REF",
    "AT-TRA-1970-1979-EXB",
    "AT-TRA-1970-1979-REF",
    "AT-TRA-1980-1989-EXB",
    "AT-TRA-1980-1989-REF",
    "AT-TRA-1990-1999-EXB",
    "AT-TRA-1990-1999-REF",
    "AT-TRA-2000-2010-EXB",
    "AT-TRA-2000-2010-REF",
    "AT-TRA-2011-2019-EXB",
    "AT-TRA-2022-2025-NEW",
  ],
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
    test.only(`has expected distinct ${column} values`, async () => {
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
