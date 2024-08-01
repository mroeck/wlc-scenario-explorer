from flask import Flask, request
from flask_cors import CORS, cross_origin
from src.queries import get_scenario_rows, get_filters
from src.shared_with_frontend.schemas import (
    AttributeEnumSchema,
    ScenarioEnumSchema,
    IndicatorEnumSchema,
    FiltersSchema,
    SCENARIO_TO_FILE_NAME,
    UNIT_TO_DB_COLUMNS,
    ATTRIBUTE_TO_DB_COLUMNS,
    ColumnsEnumSchema,
    FilterFrontEnumSchema,
)

from src.utils import convert_keys_to_columns
from typing import Dict, cast, List, Any
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route("/health")
def hello_world() -> str:
    return "<p>Hello, World!</p>"


@app.route("/scenario", methods=["POST"])
@cross_origin()  # type:ignore[misc]
def scenario() -> Dict[str, int]:
    requestdata = request.json
    attribute = ATTRIBUTE_TO_DB_COLUMNS[AttributeEnumSchema(requestdata["attribute"])]  # type:ignore[index]
    scenario = SCENARIO_TO_FILE_NAME[ScenarioEnumSchema(requestdata["scenario"])]  # type:ignore[index]
    unit = UNIT_TO_DB_COLUMNS[IndicatorEnumSchema(requestdata["unit"])]  # type:ignore[index]
    filters = None

    if (
        "filters" in requestdata and requestdata["filters"] is not None  # type:ignore[index,operator]
    ):
        filtersWithDbCols = convert_keys_to_columns(
            cast(dict[FilterFrontEnumSchema, Any], requestdata["filters"])  # type:ignore[index]
        )
        filtersRaw = FiltersSchema(**filtersWithDbCols).dict()  # type:ignore[arg-type]
        filters = {key: value for key, value in filtersRaw.items() if value is not None}

    data = get_scenario_rows(
        cast(ScenarioEnumSchema, scenario),
        cast(ColumnsEnumSchema, attribute),
        cast(IndicatorEnumSchema, unit),
        cast(FiltersSchema | None, filters),
    )

    return data


@app.route("/filters", methods=["POST"])
@cross_origin()  # type: ignore[misc]
def filters() -> Dict[str, List[str]]:
    data = get_filters()

    return data
