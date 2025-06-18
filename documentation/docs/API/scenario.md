# /scenario

**Method**: `POST`  
**URL**: `/scenario`  
**Content-Type**: `application/json`

## Description

This endpoint retrieves scenario data from a parquet file based on the given body parameters.

## Request Body Parameters

- `breakdownBy` _(required)_: Attribute to break down the data by, maps to `AttributeEnumSchema`.

  - **Type**: `string`
  - **Example**: `"EU country"`, `"EU Region"`

- `scenario` _(required)_: Specifies the scenario to retrieve, maps to `ScenarioEnumSchema`.

  - **Type**: `string`
  - **Example**: `"Conservative current policy scenario"`

- `indicator` _(required)_: Indicator for the scenario, maps to `IndicatorEnumSchema`.

  - **Type**: `string`
  - **Example**: `"GWP total"`

- `dividedBy` _(required)_: Unit by which data should be divided, maps to `DividedByEnumSchema`.

  - **Type**: `string`
  - **Example**: `"m² (country)"`

- `filters` _(optional)_: Dictionary of filters with keys mapping to `FilterFrontEnumSchema`.

  - **Type**: `object`

- `strategy` _(required when scenario is custom)_: Array of actions levels mapping to `SCENARIO_PARAMETERS_ORDER`.
  - **Type**: `array`

### Body example:

```json
{
  "breakdownBy": "Building type",
  "scenario": "APOL",
  "indicator": "GWP bio",
  "dividedBy": "none (total)",
  "filters": { "EU country": ["AT", "BE"], "From": 2020, "To": 2025 },
  "strategy": [
    "1.0",
    "1.0",
    "3.0",
    "1.0",
    "3.0",
    "1.0",
    "1.0",
    "3.0",
    "1.0",
    "2.0",
    "1.0"
  ]
}
```

## Response

**Content-Type**: `application/json`

### Example Response:

```json
{
  "data": [
    {
      "Non-residential": 0.01588,
      "Residential": -0.131025,
      "stock_projection_year": 2020
    },
    {
      "Non-residential": 0.018442,
      "Residential": -0.100563,
      "stock_projection_year": 2025
    }
  ],
  "minmax": {
    "nonStacked": {
      "max": 0.018611,
      "min": -0.143355
    },
    "stacked": {
      "max": -0.0774105839453688,
      "min": -0.12747382113027803
    }
  },
  "unit": "MtCO\u2082"
}
```
