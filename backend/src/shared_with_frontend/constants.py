def format_scenario_parameter(parameter: str) -> str:
    return parameter.lower().replace(" ", "_").replace("-", "_")


SCENARIO_PARAMETERS_ORDER = [
    format_scenario_parameter("Increase low carbon conventional"),
    format_scenario_parameter("Reduce transport emissions"),
    format_scenario_parameter("Reduce construction process"),
    format_scenario_parameter("Reduce operational energy"),
    format_scenario_parameter("Increase bio-based solutions"),
    format_scenario_parameter("Increase circularity and reuse"),
    format_scenario_parameter("Increase carbon dioxide removal"),
    format_scenario_parameter("Reduce space per capita"),
    format_scenario_parameter("Increase repair and retrofit"),
    format_scenario_parameter("Increase material efficiency"),
    format_scenario_parameter("Reduce construction waste"),
]

TOTAL_ACTIONS = 11

PARAMETER_LEVELS = ["1.0", "1.5", "2.0", "2.5"]
