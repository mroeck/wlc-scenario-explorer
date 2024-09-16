import os
from typing import Optional, Dict, cast, List, Any, Literal
from .db import Session
from .shared_with_frontend.schemas import (
    ScenarioEnumSchema,
    IndicatorEnumSchema,
    SortEnumSchema,
    AttributeEnumSchema,
    FiltersSchema,
    ColumnsEnumSchema,
    FILTER_TO_DB_COLUMN,
    DB_COLUMN_TO_FILTER,
    FilterFrontEnumSchema,
)
from sqlalchemy import text, column, select, func, Select
from .models import Scenario

DATA_PATH = os.getenv("DATA_PATH", "/app/data")


def apply_filters(
    statement: Select[Any], filters: Optional[FiltersSchema]
) -> Select[Any]:
    if filters is not None:
        for key, value in filters.items():  # type: ignore[attr-defined]
            if key == FilterFrontEnumSchema.FROM.value:
                statement = statement.where(
                    Scenario.stock_projection_year >= filters[key]  # type: ignore[index]
                )
            elif key == FilterFrontEnumSchema.TO.value:
                statement = statement.where(
                    Scenario.stock_projection_year <= filters[key]  # type: ignore[index]
                )
            else:
                statement = statement.where(column(key).in_(value))
    return statement


def compile_statement(statement: Select[Any], scenario: ScenarioEnumSchema) -> str:
    return str(statement.compile(compile_kwargs={"literal_binds": True})).replace(
        "FROM scenario", f"FROM '{DATA_PATH}/{scenario}.parquet'"
    )


def get_scenario_rows(
    scenario: ScenarioEnumSchema,
    attribute: ColumnsEnumSchema | Literal[AttributeEnumSchema.NONE],
    indicator: IndicatorEnumSchema,
    filters: Optional[FiltersSchema],
    sort: SortEnumSchema,
) -> Dict[str, int]:
    statement: Select[Any]

    if attribute == AttributeEnumSchema.NONE:
        statement = select(
            Scenario.stock_projection_year, func.sum(column(indicator)).label("Total")
        ).group_by(Scenario.stock_projection_year)

    else:
        statement = select(
            Scenario.stock_projection_year,
            column(cast(str, attribute)),
            column(indicator),
        )

    statement = apply_filters(statement, filters)

    compiled_statement = compile_statement(statement, scenario)

    if attribute == AttributeEnumSchema.NONE:
        query = compiled_statement
    else:
        indicator_as_sql_using = f"sum({indicator})"
        query = f"""
            WITH filtered_data AS (
                {compiled_statement}
            )
            SELECT
                CAST(COLUMNS(*) AS INTEGER) / 1000,
                stock_projection_year
            FROM (
                PIVOT filtered_data
                ON {attribute}
                USING {indicator_as_sql_using}
                GROUP BY stock_projection_year
            )
            ORDER BY stock_projection_year
        """

    with Session() as session:
        dataRaw = session.execute(text(query)).fetchall()
        data = [dict(row._mapping) for row in dataRaw]

    return cast(Dict[str, int], data)


def get_distinct_filter(
    dbColumn: ColumnsEnumSchema,
) -> List[str]:
    query = f"SELECT DISTINCT {dbColumn} FROM '{DATA_PATH}/scenario.parquet' ORDER BY {dbColumn} ASC"
    with Session() as session:
        data = session.execute(text(query)).fetchall()

        return cast(List[str], data)

    return cast(List[str], data)


def get_filters() -> Dict[str, List[str]]:
    yearsRaw = get_distinct_filter(
        cast(ColumnsEnumSchema, ColumnsEnumSchema.STOCK_PROJECTION_YEAR.value),
    )
    data = {ColumnsEnumSchema.STOCK_PROJECTION_YEAR.value: [row[0] for row in yearsRaw]}

    for dbColumn in FILTER_TO_DB_COLUMN.values():
        if dbColumn != cast(str, ColumnsEnumSchema.STOCK_PROJECTION_YEAR):
            dataRaw = get_distinct_filter(cast(ColumnsEnumSchema, dbColumn))
            filterName = DB_COLUMN_TO_FILTER[dbColumn]
            data[filterName] = [row[0] for row in dataRaw]

    return data
