from flask import Flask, request
from flask_cors import CORS, cross_origin
from src.queries import get_scenario_rows, ScenarioDataType
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
)
from src.shared_with_frontend.constants import SCENARIO_PARAMETERS_ORDER, TOTAL_ACTIONS
from src.utils import convert_keys_to_columns, construct_filename
from typing import cast, Any, TypedDict, Union, List
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
    current_parameters: List[Union[str, None]]


CURRENT_VALUES_LENGTH = 6


@app.route("/scenario", methods=["POST"])
@cross_origin()  # type:ignore[misc]
def scenario() -> Union[ScenarioDataType, dict[str, Any], tuple[ErrorResponse, int]]:
    body = request.json
    if body is None:
        return {"error": "Invalid request: body cannot be None"}, 400

    breakdown_by = ATTRIBUTE_TO_DB_COLUMNS[AttributeEnumSchema(body["breakdownBy"])]
    scenarioA = None
    scenarioB = None
    scenarioA_filename = None
    scenarioB_filename = None

    if "scenarioA" in body and body["scenarioA"] is not None:
        scenarioA = ScenarioEnumSchema(body["scenarioA"])
        scenarioA_filename = SCENARIO_TO_FILE_NAME[scenarioA]

    if "scenarioB" in body and body["scenarioB"] is not None:
        scenarioB = ScenarioEnumSchema(body["scenarioB"])
        if scenarioB == ScenarioEnumSchema.CUSR:
            return {"error": "scenarioB cannot be Custom scenario"}, 400
        scenarioB_filename = SCENARIO_TO_FILE_NAME[scenarioB]

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
        "strategy" in body
        and body["strategy"] is not None
        and scenarioA == ScenarioEnumSchema.CUSR.value
    ):
        expected_length = TOTAL_ACTIONS
        expected_values = {
            "1.0",
            "2.0",
            "3.0",
            "4.0",
        }
        parameters = body["strategy"]
        if len(parameters) != expected_length or not all(
            value in expected_values for value in parameters
        ):
            raise ValueError(
                f"Scenario strategy must have exactly {expected_length} elements and only contain the values {', '.join(sorted(expected_values))}."
            )
        parameters_levels = {
            key: value for key, value in zip(SCENARIO_PARAMETERS_ORDER, parameters)
        }

        scenarioA_filename = construct_filename(parameters_levels)

    data = get_scenario_rows(
        scenarioA_filename,
        scenarioB_filename,
        breakdown_by,
        indicator,
        cast(FiltersSchema | None, filters),
        cast(DividedByEnumSchema, divided_by),
    )

    return data
