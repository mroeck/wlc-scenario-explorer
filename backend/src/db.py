import os
from sqlalchemy import create_engine, insert, delete
from sqlalchemy.orm import sessionmaker
from .constants import DATA_PATH
from .models import Strategies, StrategiesBase
from .shared_with_frontend.constants import SCENARIO_PARAMETERS_ORDER

engine = create_engine("duckdb:///:memory:")

Session = sessionmaker(engine)

is_absolute_path = DATA_PATH.startswith("/")
sqlite_db_path = f"{DATA_PATH}/strategies.db"
scenarios_dir_path = f"{DATA_PATH}/scenarios"
db_url = f"sqlite:///file:{sqlite_db_path}?uri=true"

JustOnStartStrategiesEngine = create_engine(db_url)
StrategiesBase.metadata.create_all(JustOnStartStrategiesEngine)

filenames = os.listdir(scenarios_dir_path)

deleteAllFilenames = delete(Strategies)

formatted_values = [
    dict(zip(SCENARIO_PARAMETERS_ORDER, name.replace(".parquet", "").split("-")))
    for name in filenames
]

insertFilenames = insert(Strategies).values(formatted_values)
conn = JustOnStartStrategiesEngine.connect()

try:
    conn.execute(deleteAllFilenames)
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
