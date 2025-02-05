from flask import Flask, request
from flask_cors import CORS, cross_origin
from src.queries import get_scenario_rows, ScenarioDataType, get_possible_actions_levels
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
from src.db import StrategiesSession
from src.models import Strategies
from sqlalchemy.sql import exists, select, literal

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


CURRENT_VALUES_LENGTH = 11


@app.route("/suggestions", methods=["POST"])
@cross_origin()  # type:ignore[misc]
def suggestion() -> Union[dict[str, Any], tuple[ErrorResponse, int]]:
    body = request.json
    if body is None:
        return {"error": "Invalid request: body cannot be None"}, 400
    if len(body["current_parameters"]) is not CURRENT_VALUES_LENGTH:
        return {
            "error": f"Invalid request: parameters length is not {CURRENT_VALUES_LENGTH}"
        }, 400

    payload = SuggestionPayload(**body)  # type:ignore[typeddict-item]

    current_actions_levels = {
        action: value
        for action, value in zip(
            SCENARIO_PARAMETERS_ORDER, payload["current_parameters"]
        )
        if value is not None
    }
    suggested_action_levels = get_possible_actions_levels(current_actions_levels)

    return {"suggestions": suggested_action_levels}


@app.route("/scenario", methods=["POST"])
@cross_origin()  # type:ignore[misc]
def scenario() -> Union[ScenarioDataType, tuple[ErrorResponse, int]]:
    body = request.json
    if body is None:
        return {"error": "Invalid request: body cannot be None"}, 400

    breakdown_by = ATTRIBUTE_TO_DB_COLUMNS[AttributeEnumSchema(body["breakdownBy"])]
    scenario = ScenarioEnumSchema(body["scenario"])
    scenario_filename = SCENARIO_TO_FILE_NAME[scenario]
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
        and scenario == ScenarioEnumSchema.CUSR.value
    ):
        expected_length = TOTAL_ACTIONS
        expected_values = {
            "1.0",
            "1.5",
            "2.0",
            "2.5",
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

        with StrategiesSession() as session:
            conditions = [
                getattr(Strategies, key) == value
                for key, value in parameters_levels.items()
            ]

            statement = select(literal(1)).where(exists().where(*conditions))

            does_scenario_exists = session.execute(statement).scalar() is not None

            if not does_scenario_exists:
                return {"data": [], "unit": "MtCO2", "xAxisDomain": []}

        scenario_filename = construct_filename(parameters_levels)

    data = get_scenario_rows(
        scenario_filename,
        breakdown_by,
        indicator,
        cast(FiltersSchema | None, filters),
        cast(DividedByEnumSchema, divided_by),
    )

    return data
