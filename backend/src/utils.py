from typing import Dict, Any, Union
from .shared_with_frontend.schemas import (
    FilterFrontEnumSchema,
    FILTER_TO_DB_COLUMN,
)
from .shared_with_frontend.constants import SCENARIO_PARAMETERS_ORDER


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
    scenario_parameters: Dict[str, str],
) -> str:
    filename = "-".join(
        scenario_parameters[action] for action in SCENARIO_PARAMETERS_ORDER
    )

    return filename
