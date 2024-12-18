from typing import Dict, Any, Union, Optional
from .shared_with_frontend.schemas import (
    FilterFrontEnumSchema,
    FILTER_TO_DB_COLUMN,
    ScenarioParameters,
)
from .constants import FILENAME_SEARCH_OPERATOR


def convert_keys_to_columns(
    input_dict: Dict[FilterFrontEnumSchema, Any],
) -> Dict[str, Union[str, int]]:
    converted_dict: Dict[str, Union[str, int]] = {}
    for key, value in input_dict.items():
        if key in FILTER_TO_DB_COLUMN:
            if (
                key == FilterFrontEnumSchema.FROM.value
                or key == FilterFrontEnumSchema.TO.value
            ):
                converted_dict[key] = int(value)
            else:
                converted_key = FILTER_TO_DB_COLUMN[key]
                converted_dict[converted_key] = value

    return converted_dict


def construct_filename(
    scenario_parameters: ScenarioParameters,
    suggestion_target: Optional[str] = None,
) -> str:
    params = scenario_parameters

    if suggestion_target in params:
        params[suggestion_target] = FILENAME_SEARCH_OPERATOR  # type:ignore[literal-required]

    param_1 = params["scenario_parameter_1"]
    param_2 = params["scenario_parameter_2"]
    param_3 = params["scenario_parameter_3"]

    filename = f"{param_1}-{param_2}-{param_3}"

    return filename
