import os
from sqlalchemy import create_engine, insert, text, inspect
from sqlalchemy.orm import sessionmaker
from .constants import DATA_PATH
from .models import Strategies, StrategiesBase
from .shared_with_frontend.constants import SCENARIO_PARAMETERS_ORDER

engine = create_engine("duckdb:///:memory:")

Session = sessionmaker(engine)

sqlite_db_path = f"{DATA_PATH}/strategies.db"

scenarios_dir_path = f"{DATA_PATH}/scenarios"
db_url = f"sqlite:///file:{sqlite_db_path}?uri=true"


JustOnStartStrategiesEngine = create_engine(db_url)

inspector = inspect(JustOnStartStrategiesEngine)
if inspector.has_table("strategies"):
    print("table strategies already exists: reseting the db...")
    with JustOnStartStrategiesEngine.connect() as conn:
        trans = conn.begin()
        conn.execute(text("PRAGMA writable_schema = 1;"))
        conn.execute(
            text(
                "DELETE FROM sqlite_master WHERE type IN ('table', 'index', 'trigger', 'view');"
            )
        )
        conn.execute(text("PRAGMA writable_schema = 0;"))
        trans.commit()

        conn.execute(text("VACUUM;"))


StrategiesBase.metadata.create_all(JustOnStartStrategiesEngine)

filenames = os.listdir(scenarios_dir_path)

formatted_values = [
    dict(zip(SCENARIO_PARAMETERS_ORDER, name.replace(".parquet", "").split("-")))
    for name in filenames
]

insertFilenames = insert(Strategies).values(formatted_values)
conn = JustOnStartStrategiesEngine.connect()

try:
    conn.execute(insertFilenames)
    conn.commit()

finally:
    conn.close()
    engine.dispose()

StrategiesEngine = create_engine(
    f"{db_url}mode=ro&immutable=1&uri=true",
    connect_args={"uri": True},
)

StrategiesSession = sessionmaker(StrategiesEngine)
