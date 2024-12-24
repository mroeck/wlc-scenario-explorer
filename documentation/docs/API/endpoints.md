# /scenario

**Method**: `POST`  
**URL**: `/scenario`  
**Content-Type**: `application/json`

## Description

This endpoint retrieves scenario data from a parquet file based on the given parameters. It also returns the minimum and maximum values of the retrieved data, which are necessary to maintain a consistent Y-axis when displaying two graphs.
The minmax stacked are for stacked graphs (stacked area/bar) and the non stacked is for the line chart.

## Request Body Parameters

- `breakdownBy` _(required)_: Attribute to break down the data by, maps to `AttributeEnumSchema`.
  - **Type**: `string`
  - **Example**: `"country"`, `"Region"`

- `scenario` _(required)_: Specifies the scenario to retrieve, maps to `ScenarioEnumSchema`.
  - **Type**: `string`
  - **Example**: `"[IN PROGRESS]"`

- `indicator` _(required)_: Indicator for the scenario, maps to `IndicatorEnumSchema`.
  - **Type**: `string`
  - **Example**: `"GWP total"`

- `dividedBy` _(required)_: Unit by which data should be divided, maps to `DividedByEnumSchema`.
  - **Type**: `string`
  - **Example**: `"m² (country)"`

- `filters` _(optional)_: Dictionary of filters with keys mapping to `FilterFrontEnumSchema`.
  - **Type**: `object`
  - **Example**:
```json
{
  "country": [
    "BG",
    "CY"
  ],
  "From": 2020,
  "To": 2040
}
```

## Response

**Content-Type**: `application/json`

### Example Response:

```json
{
  "data": [
    {
      "Non-residential": 119.687,
      "Residential": 319.473,
      "stock_projection_year": 2020
    },
    {
      "Non-residential": 119.163,
      "Residential": 315.329,
      "stock_projection_year": 2025
    },
    {
      "Non-residential": 119.65,
      "Residential": 307.084,
      "stock_projection_year": 2030
    }
  ],
  "minmax": {
    "nonStacked": { "max": 319.473, "min": 101.861 },
    "stacked": { "max": 439, "min": 356 }
  },
  "unit": "MtC02"
}
```



