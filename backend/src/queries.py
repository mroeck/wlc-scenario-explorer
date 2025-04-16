from typing import (
    Optional,
    Any,
    TypedDict,
    List,
    Dict,
    Union,
    NotRequired,
    Never,
    Tuple,
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


def determine_appropriate_unit(
    min_value: float, max_value: float, indicator: str, divided_by: str
) -> Tuple[str, float]:
    """
    Determine the most appropriate unit scale based on data ranges.
    Returns the unit string and the conversion factor to apply to the data.
    """

    largest_abs = max(abs(min_value or 0), abs(max_value or 0))

    is_co2 = indicator != ColumnsEnumSchema.AMOUNT_MATERIAL.value

    factor = 1.0

    if largest_abs >= 1e3:
        prefix = "Gt"
        factor = 1e-3
    elif largest_abs >= 1 and largest_abs < 1e3:
        prefix = "Mt"
    elif largest_abs >= 1e-3 and largest_abs < 1:
        prefix = "kt"
        factor = 1e3
    elif largest_abs >= 1e-6 and largest_abs < 1e-3:
        prefix = "t"
        factor = 1e6
    elif largest_abs >= 1e-9 and largest_abs < 1e-6:
        prefix = "kg"
        factor = 1e9
    else:
        prefix = "mg"
        factor = 1e12

    suffix = ""
    if divided_by != DIVIDED_BY_NONE:
        if "population" in divided_by:
            suffix = "/capita"
        elif "floor_area" in divided_by:
            suffix = "/m²"

    if is_co2:
        unit_final = f"{prefix}CO₂{suffix}"
    else:
        unit_final = f"{prefix}{suffix}"

    return unit_final, factor


def get_indicator_as_sql(indicator: str, dividedBy: str) -> str:
    """Generate SQL for calculating indicator values without unit conversion"""
    if dividedBy == DIVIDED_BY_NONE:
        return f"sum({indicator})"
    else:
        area_factor = "1000000" if "floor_area" in dividedBy else "1"

        return f"""sum(
                 CASE
                    WHEN {dividedBy} = 0 THEN 0
                    ELSE {indicator} / ({dividedBy} * {area_factor})
                END
            )
            """


def get_pivot_query(
    attribute: str,
    indicator_as_sql: str,
) -> str:
    if attribute == AttributeEnumSchema.NONE:
        return ""

    query = f"""
        SELECT
            COLUMNS(*),
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
    data: List[Dict[str, Union[int, str, float]]]
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
            return {"data": data, "unit": "MtCO₂", "xAxisDomain": []}

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

    nonstacked_min_value = nonstacked_minmax.get("min", 0)
    nonstacked_max_value = nonstacked_minmax.get("max", 0)

    unit_for_nonstacked_graph, nonstacked_conversion_factor = (
        determine_appropriate_unit(
            nonstacked_min_value, nonstacked_max_value, indicator, dividedBy
        )
    )

    for item in data:
        for key, value in item.items():
            if key != "stock_projection_year" and isinstance(value, (int, float)):
                item[key] = value * nonstacked_conversion_factor

    x_axis_domain = list(set(item["stock_projection_year"] for item in data))
    x_axis_domain.sort(key=lambda x: int(x))

    return {
        "data": data,
        "minmax": {
            "stacked": stacked_minmax,
            "nonStacked": nonstacked_minmax,
        },
        "unit": unit_for_nonstacked_graph,
        "xAxisDomain": x_axis_domain,
    }
