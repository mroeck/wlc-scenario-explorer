import { describe, expect, test } from "vitest";
import { Database } from "duckdb-async";
import path from "path";
import { z } from "zod";
import { env } from "@/env";
import { EXPECTED_SCHEMA, EXPECTED_VALUES } from "./constants";

const db = await Database.create(":memory:");

const basePath = env.PUBLIC_DATA_PATH
  ? path.resolve(__dirname, env.PUBLIC_DATA_PATH)
  : "/app/data";
// const DATA_PATH = basePath + "/latest/1.0-1.0-1.0-1.0-1.0-1.0.parquet";
const DATA_PATH = basePath + "/scenarios/test/1.0-1.0-1.0-1.0-1.0-1.0.parquet";
// const DATA_PATH = basePath + "/scenarios/1.0-1.0-1.0-1.0-1.0-1.0.parquet";

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
      const expected = EXPECTED_SCHEMA[index] as Exclude<
        (typeof EXPECTED_SCHEMA)[number],
        undefined
      >;

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
