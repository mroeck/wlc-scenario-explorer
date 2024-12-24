# FAQ

## How can I easily query parquet files for debugging?

In VScode, you can download the extension [Parquet Explorer](https://marketplace.visualstudio.com/items?itemName=AdamViola.parquet-explorer), now when clicking on a parquet file, an interface show up with an input field for your SQL query.
It uses duckdb under the hood to read the parquet files like the scenario explorer app.

### Caveats

- the extension duckdb version is outdated, so some features can't be used
- in rare cases an SQL query return different data based on if we use the extension or the scenario explorer duckdb instance directly


## How to run the production app?

Look at the dockerfiles prod stage.

- [backend dockerfile](../../../backend/Dockerfile)
- [frontend dockerfile](../../../frontend/Dockerfile)

There is also the [compose.yaml](../../../compose.yaml) that shows the environment variables that should be set.