from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

engine = create_engine("duckdb:///:memory:")
Base.metadata.create_all(engine)

conn = engine.connect()
Session = sessionmaker(engine)

# Columns = Literal[
#     "stock_projection_year",
#     "building_archetype_code",
#     "stock_region_name",
#     "country_name",
#     "building_use_type_name",
#     "building_use_subtype_name",
#     "element_class_generic_name",
#     "material_name_JRC_CDW",
#     "activity_in_out",
#     "stock_activity_type_name",
#     "carbon_category",
#     "stock_floor_area_Mm2",
#     "amount_material",
#     "ind_GWP_Tot",
#     "ind_GWP_Fos",
#     "ind_GWP_Bio",
#     "ind_GWP_LuLuc",
# ]
