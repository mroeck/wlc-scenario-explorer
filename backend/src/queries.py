import os
from typing import Optional, cast, Any, Literal
from .db import Session
from .shared_with_frontend.schemas import (
    ScenarioEnumSchema,
    IndicatorEnumSchema,
    DividedByEnumSchema,
    AttributeEnumSchema,
    FiltersSchema,
    ColumnsEnumSchema,
    FilterFrontEnumSchema,
)
from sqlalchemy import text, column, select, func, Select
from .models import Scenario
from .constants import DIVIDED_BY_NONE

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
    dividedBy: DividedByEnumSchema,
) -> list[dict[str, int]]:
    statement: Select[Any]

    if attribute == AttributeEnumSchema.NONE:
        statement = select(
            Scenario.stock_projection_year,
            (func.sum(column(indicator)) / 1000).label("Total"),
        ).group_by(Scenario.stock_projection_year)

    else:
        select_columns = [
            Scenario.stock_projection_year,
            column(cast(str, attribute)),
            column(indicator),
        ]

        if dividedBy != DIVIDED_BY_NONE:
            select_columns.append(column(dividedBy))

        statement = select(*select_columns)

    statement = apply_filters(statement, filters)

    compiled_statement = compile_statement(statement, scenario)

    if attribute == AttributeEnumSchema.NONE:
        query = compiled_statement
    else:
        indicator_as_sql_using = (
            f"sum({indicator})"
            if dividedBy == DIVIDED_BY_NONE
            else f"sum({indicator} / {dividedBy})"
        )

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
        data = [row._asdict() for row in dataRaw]

    return cast(list[dict[str, int]], data)
