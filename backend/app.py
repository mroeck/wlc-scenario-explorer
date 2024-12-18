import os
from flask import Flask, request
from flask_cors import CORS, cross_origin
from src.queries import get_scenario_rows, ScenarioDataType, get_possible_parameters
from src.shared_with_frontend.schemas import (
    AttributeEnumSchema,
    ScenarioEnumSchema,
    IndicatorEnumSchema,
    DividedByEnumSchema,
    FiltersSchema,
    SCENARIO_TO_FILE_NAME,
    UNIT_TO_DB_COLUMNS,
    ATTRIBUTE_TO_DB_COLUMNS,
    FilterFrontEnumSchema,
    ScenarioParameters,
)

from src.utils import convert_keys_to_columns, construct_filename
from typing import cast, Any, TypedDict, Union
from dotenv import load_dotenv

load_dotenv()


class ErrorResponse(TypedDict):
    error: str


app = Flask(__name__)
CORS(app)


@app.route("/health")
def hello_world() -> str:
    return "<p>Hello, World!</p>"


class SuggestionPayload(TypedDict):
    need_suggestion: str
    current_values: ScenarioParameters


@app.route("/suggestion", methods=["POST"])
@cross_origin()  # type:ignore[misc]
def suggestion() -> Union[dict[str, Any], tuple[ErrorResponse, int]]:
    body = request.json
    if body is None:
        return {"error": "Invalid request: body cannot be None"}, 400

    payload = SuggestionPayload(**body)  # type:ignore[typeddict-item]

    suggested_parameter_levels = get_possible_parameters(
        payload["current_values"], payload["need_suggestion"]
    )

    return suggested_parameter_levels.dict()


@app.route("/scenario", methods=["POST"])
@cross_origin()  # type:ignore[misc]
def scenario() -> Union[ScenarioDataType, tuple[ErrorResponse, int]]:
    body = request.json
    if body is None:
        return {"error": "Invalid request: body cannot be None"}, 400

    breakdown_by = ATTRIBUTE_TO_DB_COLUMNS[AttributeEnumSchema(body["breakdownBy"])]
    scenario = SCENARIO_TO_FILE_NAME[ScenarioEnumSchema(body["scenario"])]
    indicator = UNIT_TO_DB_COLUMNS[IndicatorEnumSchema(body["indicator"])]
    divided_by = UNIT_TO_DB_COLUMNS[DividedByEnumSchema(body["dividedBy"])]
    filters = None
    parameters_levels = None

    if "filters" in body and body["filters"] is not None:
        filtersWithDbCols = convert_keys_to_columns(
            cast(dict[FilterFrontEnumSchema, Any], body["filters"])
        )
        filtersRaw = FiltersSchema(**filtersWithDbCols).dict()  # type:ignore[arg-type]
        filters = {key: value for key, value in filtersRaw.items() if value is not None}

    if (
        "scenario_parameters" in body
        and body["scenario_parameters"] is not None
        and scenario == ScenarioEnumSchema.CUSR.value
    ):
        # parameters_levels = ScenarioParameters(**requestdata["scenario_parameters"])
        # temp: hardcoded until we clarify the feature
        parameters_levels = ScenarioParameters(
            **{
                "scenario_parameter_1": "1.0",
                "scenario_parameter_2": "2.0",
                "scenario_parameter_3": "3.0",
            }
        )

        filename = construct_filename(parameters_levels)

        isCustom = scenario == ScenarioEnumSchema.CUSR.value

        if not os.path.exists(f"{filename}.parquet") and isCustom:
            return {"data": [], "unit": "MtCO2"}

        if isCustom:
            scenario = filename

    data = get_scenario_rows(
        scenario,
        breakdown_by,
        indicator,
        cast(FiltersSchema | None, filters),
        cast(DividedByEnumSchema, divided_by),
    )

    return data
