import os
from sqlalchemy import create_engine, insert, delete
from sqlalchemy.orm import sessionmaker
from .constants import DATA_PATH
from .models import Filenames, FilenamesBase

engine = create_engine("duckdb:///:memory:")

Session = sessionmaker(engine)

is_absolute_path = DATA_PATH.startswith("/")
sqlite_db_path = f"{DATA_PATH}/filenames.db"
scenarios_dir_path = f"{DATA_PATH}/scenarios"
db_url = f"sqlite:///file:{sqlite_db_path}?uri=true"

JustOnStartFilenameEngine = create_engine(db_url)
FilenamesBase.metadata.create_all(JustOnStartFilenameEngine)

filenames = os.listdir(scenarios_dir_path)

deleteAllFilenames = delete(Filenames)
insertFilenames = insert(Filenames).values([{"filename": name} for name in filenames])

conn = JustOnStartFilenameEngine.connect()

try:
    conn.execute(deleteAllFilenames)
    conn.execute(insertFilenames)
    conn.commit()

finally:
    conn.close()
    engine.dispose()

FilenameEngine = create_engine(
    f"{db_url}mode=ro&immutable=1&uri=true",
    connect_args={"uri": True},
)

FilenameSession = sessionmaker(FilenameEngine)
