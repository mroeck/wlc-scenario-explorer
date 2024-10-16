# Caveats

## Synchronize shared_with_ folders

:::danger
Anything that is changed in the folder **shared_with_frontend** should be carefully synchronize with the **shared_with_backend** folder and vice versa.
:::

### ATTRIBUTE_OPTIONS_COLOR

Some data could not be stored in the parquet files and the desire of assigning specific colors to specific values returned from those parquet files lead to storing the following in the frontend:

```json
{
  // structure:
  "COLUMN_1": {
    "DISTINCT VALUE 1": "COLOR HEX CODE",
    "DISTINCT VALUE 2": "COLOR HEX CODE",
    "DISTINCT VALUE 3": "COLOR HEX CODE"
  },
  //  example:
  "flow type": {
    "Energy in": "#5FB8CE",
    "MATERIAL_IN": "#5BB89F",
    "MATERIAL_LOSS_IN": "#56B770",
    "MATERIAL_LOSS_OUT": "#ABD561",
    "MATERIAL_OUT": "#FFF352",
    "PROCESS": "#FCC74B",
    "TRANSPORT_EOL": "#F99B43",
    "TRANSPORT_TO_SITE": "#E34542"
  },
  // ...
}
```

#### What happens if later on we add a new column to the parquet file?

Then we need to add the columns and its distinct values to ATTRIBUTE_OPTIONS_COLOR and assign colors to them.

#### What happens if later on we remove a column from the parquet file?
Then we need to remove the column from ATTRIBUTE_OPTIONS_COLOR so the user can't query a column that does not exist.

:::warning
The distinct values are case sensitive
:::
