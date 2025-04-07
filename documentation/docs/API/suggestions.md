# /suggestions

The `/suggestions` endpoint provides action level suggestions based on the current levels supplied in the request. The suggestions are aimed to help the users to find a set of actions/levels that lead to a scenario.

#### Request

**URL**: `/suggestions`

**Method**: `POST`

**Headers**:

- `Content-Type: application/json`

**Body**:

```json
{
  "current_parameters": [
    "1.0",
    "2.0",
    null,
    null,
    null,
    "2.0",
    "3.0",
    null,
    null,
    null,
    null
  ]
}
```

- `current_parameters` (array): An array of current levels values. The order of this array matters, it follows the SCENARIO_PARAMETERS_ORDER variable.

#### Response

**Success Response**:

- **Code**: `200 OK`
- **Content**:

```json
{
  "suggestions": {
    "increase_bio_based_solutions": ["1.0", "3.0", "4.0"],
    "increase_carbon_dioxide_removal": ["3.0", "1.0", "2.0"]
  }
}
```

**Error Responses**:

- **Code**: `400 Bad Request`
  - **Content**:
  ```json
  {
    "error": "Invalid request: body cannot be None"
  }
  ```
  - **Content**:
  ```json
  {
    "error": "Invalid request: parameters length is not {CURRENT_VALUES_LENGTH}"
  }
  ```

#### Notes

- Ensure the `current_parameters` array matches the required length (`CURRENT_VALUES_LENGTH`).
- The response includes suggested levels for various actions based on the provided parameters.
