import { join } from "path";
import parquet from "parquetjs";
import { EXPECTED_SCHEMA, EXPECTED_VALUES } from "../tests/constants";
import type { RowInterface } from "parquetjs/lib/row.interface";

const { ParquetWriter, ParquetSchema } = parquet;

type Column = (typeof EXPECTED_SCHEMA)[number]["column_name"];
type ColumnType = (typeof EXPECTED_SCHEMA)[number]["column_type"];

// Map DuckDB types to Parquet types
function mapTypeToParquetType(type: ColumnType): string {
  switch (type) {
    case "VARCHAR":
      return "UTF8";
    case "FLOAT":
      return "FLOAT";
    case "INTEGER":
      return "INT_32";
    case "USMALLINT":
      return "INT_16";
    default:
      return "UTF8";
  }
}

function createParquetSchema() {
  const fields: Record<string, { type: string; optional?: boolean }> = {};

  EXPECTED_SCHEMA.forEach((column) => {
    fields[column.column_name] = {
      type: mapTypeToParquetType(column.column_type),
      optional: true,
    };
  });

  return new ParquetSchema(fields);
}

function generateColumnData(
  columnName: Column,
  numRows: number,
  index: number,
): unknown[] {
  const expectedValues = EXPECTED_VALUES[columnName];

  if (expectedValues) {
    const repeatedValues = Array(numRows)
      .fill(0)
      .map((_, i) => expectedValues[i % expectedValues.length]);
    return repeatedValues;
  }

  const column = EXPECTED_SCHEMA.find((c) => c.column_name === columnName);
  if (!column) throw new Error(`Column ${columnName} not found in schema`);

  switch (column.column_type) {
    case "FLOAT":
      return Array(numRows)
        .fill(0)
        .map((_, i) => (i + index) * 0.1);
    case "INTEGER":
    case "USMALLINT":
      return Array(numRows)
        .fill(0)
        .map((_, i) => i + index);
    default:
      return Array(numRows)
        .fill(0)
        .map((_, i) => `placeholder_${i + index}`);
  }
}

async function generateSeedFile(
  numRows: number,
  index: number,
  filename: string,
) {
  const schema = createParquetSchema();
  const outputPath = join(process.cwd(), "..", "data", "scenarios", filename);

  const writer = await ParquetWriter.openFile(schema, outputPath);

  const data: Record<string, unknown[]> = {};
  EXPECTED_SCHEMA.forEach((column) => {
    data[column.column_name] = generateColumnData(
      column.column_name,
      numRows,
      index,
    );
  });

  for (let i = 0; i < numRows; i++) {
    const row: Record<string, unknown> = {};
    EXPECTED_SCHEMA.forEach((column) => {
      row[column.column_name] = data[column.column_name][i];
    });
    await writer.appendRow(row as RowInterface);
  }

  await writer.close();
  console.log(`Created ${outputPath} with ${numRows} rows`);
}

async function generateSeedFiles() {
  const files = [
    "1.0-1.0-1.0-1.0-1.0-1.0.parquet",
    "1.0-1.0-2.0-2.0-3.0-1.0.parquet",
    "2.0-2.0-2.0-2.0-2.0-2.0.parquet",
    "2.0-3.0-1.0-2.0-3.0-2.0.parquet",
    "4.0-2.0-2.0-1.0-1.0-4.0.parquet",
    "AUTO-1.0-1.0-1.0-1.0-1.0-1.0.parquet",
  ];

  for (let i = 0; i < files.length; i++) {
    await generateSeedFile(1000, i, files[i]);
  }
}

generateSeedFiles().catch((error: unknown) => {
  console.error(error);
});
