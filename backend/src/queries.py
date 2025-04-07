from typing import (
    Optional,
    Any,
    TypedDict,
    List,
    Dict,
    Union,
    NotRequired,
    Never,
)
from sqlalchemy import text, column, select, func, Select, ColumnClause
from sqlalchemy.sql import ClauseElement
from .db import Session
from .shared_with_frontend.schemas import (
    AttributeEnumSchema,
    FiltersSchema,
    ColumnsEnumSchema,
    FilterFrontEnumSchema,
)
from .constants import DIVIDED_BY_NONE, DATA_PATH
from enum import Enum

TOTAL_LABEL = "Total"
YEAR_COLUMN: ColumnClause[Never] = column("stock_projection_year")


def apply_filters(
    statement: Select[Any], filters: Optional[FiltersSchema]
) -> Select[Any]:
    if not filters:
        return statement

    filter_conditions: list[ClauseElement] = []
    for key, value in filters.items():  # type: ignore[attr-defined]
        if key == FilterFrontEnumSchema.FROM.value:
            filter_conditions.append(YEAR_COLUMN >= value)
        elif key == FilterFrontEnumSchema.TO.value:
            filter_conditions.append(YEAR_COLUMN <= value)
        else:
            filter_conditions.append(column(key).in_(value))

    return statement.where(*filter_conditions)  # type: ignore[arg-type]


def compile_statement(statement: Select[Any], scenario: str) -> str:
    compiled = str(statement.compile(compile_kwargs={"literal_binds": True}))

    return (
        f"FROM (SELECT * FROM '{DATA_PATH}/scenarios/{scenario}.parquet') " + compiled
    )


def get_base_statement(
    attribute: str,
    indicator: str,
    dividedBy: str,
) -> Select[Any]:
    if attribute == AttributeEnumSchema.NONE:
        return select(
            YEAR_COLUMN,
            (func.sum(column(indicator))).label(TOTAL_LABEL),
        ).group_by(YEAR_COLUMN)
    select_columns: List[ColumnClause[Never]] = [
        YEAR_COLUMN,
        column(attribute),
        column(indicator),
    ]
    if dividedBy != DIVIDED_BY_NONE:
        select_columns.append(column(dividedBy))

    return select(*select_columns)


class UnitsForFrontType(str, Enum):
    MtCO2 = "MtCO₂"
    Mt = "Mt"
    MtCO2_per_capita = "MtCO₂/capita"
    tCO2_per_m2 = "tCO₂/m²"
    tCO2_per_capita = "tCO₂/capita"
    Mt_per_m2 = "Mt/m²"
    t_per_m2 = "t/m2"
    ktCO2_per_capita = "ktCO₂/capita"
    ktCO2_per_m2 = "ktCO₂/m²"
    kgCO2_per_m2 = "kgCO₂/m²"
    t_per_capita = "t/capita"
    kt_per_capita = "kt/capita"
    kt_per_m2 = "kt/m²"
    kgCO2_per_capita = "kgCO₂/capita"
    gCO2_per_capita = "gCO₂/capita"
    gCO2_per_m2 = "gCO₂/m²"


Mt = "1"
kt = "1000"
ton = "1000000"
kg = "1000000000"
g = "1000000000000"

front_unit_to_factor: Dict[UnitsForFrontType, str] = {
    UnitsForFrontType.MtCO2: Mt,
    UnitsForFrontType.Mt: Mt,
    UnitsForFrontType.Mt_per_m2: Mt,
    UnitsForFrontType.MtCO2_per_capita: Mt,
    UnitsForFrontType.ktCO2_per_m2: kt,
    UnitsForFrontType.ktCO2_per_capita: kt,
    UnitsForFrontType.kt_per_capita: kt,
    UnitsForFrontType.kt_per_m2: kt,
    UnitsForFrontType.tCO2_per_capita: ton,
    UnitsForFrontType.tCO2_per_m2: ton,
    UnitsForFrontType.t_per_capita: ton,
    UnitsForFrontType.t_per_m2: ton,
    UnitsForFrontType.kgCO2_per_capita: kg,
    UnitsForFrontType.kgCO2_per_m2: kg,
    UnitsForFrontType.gCO2_per_capita: g,
    UnitsForFrontType.gCO2_per_m2: g,
}


units_for_front: Dict[
    str,
    Dict[str, UnitsForFrontType],
] = {
    ColumnsEnumSchema.IND_GWP_TOT.value: {
        DIVIDED_BY_NONE: UnitsForFrontType.MtCO2,
        ColumnsEnumSchema.FLOOR_AREA_COUNTRY.value: UnitsForFrontType.kgCO2_per_m2,
        ColumnsEnumSchema.FLOOR_AREA_ARCHETYPE.value: UnitsForFrontType.tCO2_per_m2,
        ColumnsEnumSchema.POPULATION_COUNTRY.value: UnitsForFrontType.tCO2_per_capita,
        ColumnsEnumSchema.POPULATION_ARCHETYPE.value: UnitsForFrontType.tCO2_per_capita,
    },
    ColumnsEnumSchema.IND_GWP_FOS.value: {
        DIVIDED_BY_NONE: UnitsForFrontType.MtCO2,
        ColumnsEnumSchema.FLOOR_AREA_COUNTRY.value: UnitsForFrontType.kgCO2_per_m2,
        ColumnsEnumSchema.FLOOR_AREA_ARCHETYPE.value: UnitsForFrontType.tCO2_per_m2,
        ColumnsEnumSchema.POPULATION_COUNTRY.value: UnitsForFrontType.tCO2_per_capita,
        ColumnsEnumSchema.POPULATION_ARCHETYPE.value: UnitsForFrontType.tCO2_per_capita,
    },
    ColumnsEnumSchema.IND_GWP_BIO.value: {
        DIVIDED_BY_NONE: UnitsForFrontType.MtCO2,
        ColumnsEnumSchema.FLOOR_AREA_COUNTRY.value: UnitsForFrontType.gCO2_per_m2,
        ColumnsEnumSchema.FLOOR_AREA_ARCHETYPE.value: UnitsForFrontType.tCO2_per_m2,
        ColumnsEnumSchema.POPULATION_COUNTRY.value: UnitsForFrontType.kgCO2_per_capita,
        ColumnsEnumSchema.POPULATION_ARCHETYPE.value: UnitsForFrontType.tCO2_per_capita,
    },
    ColumnsEnumSchema.IND_GWP_LULUC.value: {
        DIVIDED_BY_NONE: UnitsForFrontType.MtCO2,
        ColumnsEnumSchema.FLOOR_AREA_COUNTRY.value: UnitsForFrontType.kgCO2_per_m2,
        ColumnsEnumSchema.FLOOR_AREA_ARCHETYPE.value: UnitsForFrontType.kgCO2_per_m2,
        ColumnsEnumSchema.POPULATION_COUNTRY.value: UnitsForFrontType.kgCO2_per_capita,
        ColumnsEnumSchema.POPULATION_ARCHETYPE.value: UnitsForFrontType.kgCO2_per_capita,
    },
    ColumnsEnumSchema.AMOUNT_MATERIAL.value: {
        DIVIDED_BY_NONE: UnitsForFrontType.Mt,
        ColumnsEnumSchema.FLOOR_AREA_COUNTRY.value: UnitsForFrontType.t_per_m2,
        ColumnsEnumSchema.FLOOR_AREA_ARCHETYPE.value: UnitsForFrontType.kt_per_m2,
        ColumnsEnumSchema.POPULATION_COUNTRY.value: UnitsForFrontType.t_per_capita,
        ColumnsEnumSchema.POPULATION_ARCHETYPE.value: UnitsForFrontType.kt_per_capita,
    },
}


def get_indicator_as_sql(indicator: str, dividedBy: str) -> str:
    indicator_factor = front_unit_to_factor[units_for_front[indicator][dividedBy]]

    divided_by_factor = (
        "1000000"
        if dividedBy
        in {
            ColumnsEnumSchema.FLOOR_AREA_ARCHETYPE.value,
            ColumnsEnumSchema.FLOOR_AREA_COUNTRY.value,
        }
        else "1"
    )

    return (
        f"sum({indicator} * {indicator_factor})"
        if dividedBy == DIVIDED_BY_NONE
        else f"""sum(
                 CASE
                    WHEN {dividedBy} = 0 THEN 0
                    ELSE {indicator} * {indicator_factor} / ({dividedBy} * {divided_by_factor})
                END
            )
            """
    )


def get_pivot_query(
    attribute: str,
    indicator_as_sql: str,
) -> str:
    if attribute == AttributeEnumSchema.NONE:
        return ""

    query = f"""
        SELECT
            round(COLUMNS(*), 6),
            stock_projection_year
        FROM (
            PIVOT filtered_data
            ON {attribute}
            USING {indicator_as_sql}
            GROUP BY stock_projection_year
        )
        ORDER BY stock_projection_year
    """

    return query


def get_minmax_query(
    compiled_statement: str,
    attribute: str,
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
                MIN(total) AS min, 
                MAX(total) AS max
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
            MIN(total) AS min, 
            MAX(total) AS max
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
    unit: str
    xAxisDomain: list[str]


def get_scenario_rows(
    scenario: str,
    attribute: str,
    indicator: str,
    filters: Optional[FiltersSchema],
    dividedBy: str,
) -> ScenarioDataType:
    unit_for_front = units_for_front[indicator][dividedBy]
    base_statement = get_base_statement(attribute, indicator, dividedBy)
    filtered_statement = apply_filters(base_statement, filters)
    compiled_statement = compile_statement(filtered_statement, scenario)

    indicator_as_sql = get_indicator_as_sql(indicator, dividedBy)
    pivot_query = get_pivot_query(attribute, indicator_as_sql)

    attribute_none_query = compiled_statement

    default_query = f"""
        WITH filtered_data AS (
            {compiled_statement}
        )
        {pivot_query}
    """

    scenario_query = (
        attribute_none_query if attribute == AttributeEnumSchema.NONE else default_query
    )

    minmax_query_for_stacked_graph = get_minmax_query(
        compiled_statement, attribute, indicator_as_sql
    )

    with Session() as session:
        rows = session.execute(text(scenario_query)).fetchall()
        data = [row._asdict() for row in rows]

        if len(data) == 0:
            return {"data": data, "unit": "MtCO2", "xAxisDomain": []}

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

    x_axis_domain = list(set(item["stock_projection_year"] for item in data))

    x_axis_domain.sort(key=lambda x: int(x))

    return {
        "data": data,
        "minmax": {
            "stacked": stacked_minmax,
            "nonStacked": nonstacked_minmax,
        },
        "unit": unit_for_front,
        "xAxisDomain": x_axis_domain,
    }
