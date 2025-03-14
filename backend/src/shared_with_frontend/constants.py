def format_scenario_parameter(parameter: str) -> str:
    return parameter.lower().replace(" ", "_").replace("-", "_")


SCENARIO_PARAMETERS_ORDER = [
    format_scenario_parameter("Increase of circularity measures"),
    format_scenario_parameter("Reduce space per capita"),
    format_scenario_parameter("Shift to low carbon and bio-based solutions"),
    format_scenario_parameter("Reduce transport and construction emissions"),
    format_scenario_parameter("Increase use of improved materials"),
    format_scenario_parameter("Reduce operational emissions"),
]

TOTAL_ACTIONS = 6

PARAMETER_LEVELS = ["1.0", "1.5", "2.0", "2.5"]
