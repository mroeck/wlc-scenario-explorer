import os
from typing import (
    Optional,
    cast,
    Any,
    Literal,
    TypedDict,
    List,
    Dict,
    Union,
    NotRequired,
)
from sqlalchemy import text, column, select, func, Select
from sqlalchemy.sql import ClauseElement
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
from .models import Scenario
from .constants import DIVIDED_BY_NONE

DATA_PATH = os.getenv("DATA_PATH", "/app/data")
CONVERSION_FACTOR = 1000
TOTAL_LABEL = "Total"


def apply_filters(
    statement: Select[Any], filters: Optional[FiltersSchema]
) -> Select[Any]:
    if not filters:
        return statement

    filter_conditions: list[ClauseElement] = []
    for key, value in filters.items():  # type: ignore[attr-defined]
        if key == FilterFrontEnumSchema.FROM.value:
            filter_conditions.append(Scenario.stock_projection_year >= value)
        elif key == FilterFrontEnumSchema.TO.value:
            filter_conditions.append(Scenario.stock_projection_year <= value)
        else:
            filter_conditions.append(column(key).in_(value))

    return statement.where(*filter_conditions)  # type: ignore[arg-type]


def compile_statement(statement: Select[Any], scenario: ScenarioEnumSchema) -> str:
    compiled = str(statement.compile(compile_kwargs={"literal_binds": True}))
    return compiled.replace("FROM scenario", f"FROM '{DATA_PATH}/{scenario}.parquet'")


def get_base_statement(
    attribute: ColumnsEnumSchema | Literal[AttributeEnumSchema.NONE],
    indicator: IndicatorEnumSchema,
    dividedBy: DividedByEnumSchema,
) -> Select[Any]:
    if attribute == AttributeEnumSchema.NONE:
        return select(
            Scenario.stock_projection_year,
            (func.sum(column(indicator)) / CONVERSION_FACTOR).label(TOTAL_LABEL),
        ).group_by(Scenario.stock_projection_year)

    select_columns = [
        Scenario.stock_projection_year,
        column(cast(str, attribute)),
        column(indicator),
    ]
    if dividedBy != DIVIDED_BY_NONE:
        select_columns.append(column(dividedBy))

    return select(*select_columns)


def get_indicator_as_sql(
    indicator: IndicatorEnumSchema, dividedBy: DividedByEnumSchema
) -> str:
    return (
        f"sum({indicator})"
        if dividedBy == DIVIDED_BY_NONE
        else f"sum({indicator} / {dividedBy})"
    )


def get_pivot_query(
    attribute: ColumnsEnumSchema | Literal[AttributeEnumSchema.NONE],
    indicator_as_sql: str,
) -> str:
    if attribute == AttributeEnumSchema.NONE:
        return ""

    return f"""
        SELECT
            CAST(COLUMNS(*) AS INTEGER) / {CONVERSION_FACTOR},
            stock_projection_year
        FROM (
            PIVOT filtered_data
            ON {attribute}
            USING {indicator_as_sql}
            GROUP BY stock_projection_year
        )
        ORDER BY stock_projection_year
    """


def get_minmax_query(
    compiled_statement: str,
    attribute: ColumnsEnumSchema | Literal[AttributeEnumSchema.NONE],
    indicator_as_sql: str,
) -> str:
    if attribute == AttributeEnumSchema.NONE:
        return f"""
            WITH filtered_data AS (
                {compiled_statement}
            ),
            totals_data AS ( 
                SELECT
                    {TOTAL_LABEL} AS total
                FROM filtered_data
            )
            SELECT 
                CAST(MIN(total) AS INTEGER) AS min, 
                CAST(MAX(total) AS INTEGER) AS max
            FROM totals_data;
        """

    return f"""
        WITH filtered_data AS (
            {compiled_statement}
        ),
        totals_data AS ( 
            SELECT
                {indicator_as_sql} AS total
            FROM filtered_data
            GROUP BY stock_projection_year
        )
        SELECT 
            CAST(MIN(total) / {CONVERSION_FACTOR} AS INTEGER) AS min, 
            CAST(MAX(total) / {CONVERSION_FACTOR} AS INTEGER) AS max
        FROM totals_data;
    """


def get_nonstacked_minmax_query(
    compiled_statement: str, pivot_query: str, columns: list[str]
) -> str:
    pivot_without_years = "SELECT * EXCLUDE (stock_projection_year, stock_projection_year_1) FROM pivoted_data"
    common_sql = f"""
        WITH filtered_data AS (
            {compiled_statement}
        ), pivoted_data AS (
            {pivot_query}
        ), pivot_without_years AS (
            {pivot_without_years}
        )
    """
    max_string = ", ".join(f'MAX("{s}")' for s in columns)
    min_string = ", ".join(f'MIN("{s}")' for s in columns)

    return f"""
        {common_sql}
        SELECT
            GREATEST({max_string}) as max,
            LEAST({min_string}) as min
        FROM pivot_without_years;
    """


class MinMaxDict(TypedDict):
    stacked: dict[str, Any] | Any
    nonStacked: dict[str, Any] | Any


class ScenarioDataType(TypedDict):
    data: List[Dict[str, Union[int, str]]]
    minmax: NotRequired[MinMaxDict]


def get_scenario_rows(
    scenario: ScenarioEnumSchema,
    attribute: ColumnsEnumSchema | Literal[AttributeEnumSchema.NONE],
    indicator: IndicatorEnumSchema,
    filters: Optional[FiltersSchema],
    dividedBy: DividedByEnumSchema,
) -> ScenarioDataType:
    base_statement = get_base_statement(attribute, indicator, dividedBy)
    filtered_statement = apply_filters(base_statement, filters)
    compiled_statement = compile_statement(filtered_statement, scenario)

    indicator_as_sql = get_indicator_as_sql(indicator, dividedBy)
    pivot_query = get_pivot_query(attribute, indicator_as_sql)

    scenario_query = (
        compiled_statement
        if attribute == AttributeEnumSchema.NONE
        else f"""
        WITH filtered_data AS (
            {compiled_statement}
        )
        {pivot_query}
    """
    )

    minmax_query_for_stacked_graph = get_minmax_query(
        compiled_statement, attribute, indicator_as_sql
    )

    with Session() as session:
        data_raw = session.execute(text(scenario_query)).fetchall()
        data = [row._asdict() for row in data_raw]

        if len(data) == 0:
            return {
                "data": data,
            }

        stacked_minmax = (
            session.execute(text(minmax_query_for_stacked_graph)).fetchone()._asdict()  # type: ignore[union-attr]
        )

        nonstacked_minmax = stacked_minmax

        if attribute != AttributeEnumSchema.NONE:
            columns_query = f"""
                WITH filtered_data AS (
                    {compiled_statement}
                ), pivoted_data AS (
                    {pivot_query}
                )
                SELECT column_name as columns
                FROM (DESCRIBE (SELECT * EXCLUDE (stock_projection_year, stock_projection_year_1) FROM pivoted_data))
            """
            columns_raw = session.execute(text(columns_query)).fetchall()
            columns = [col[0] for col in columns_raw]

            nonstacked_minmax_query = get_nonstacked_minmax_query(
                compiled_statement, pivot_query, columns
            )
            nonstacked_minmax = (
                session.execute(text(nonstacked_minmax_query)).fetchone()._asdict()  # type: ignore[union-attr]
            )

    return {
        "data": data,
        "minmax": {
            "stacked": stacked_minmax,
            "nonStacked": nonstacked_minmax,
        },
    }
