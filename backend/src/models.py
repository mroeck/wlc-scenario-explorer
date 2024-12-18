from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped


class FilenamesBase(DeclarativeBase):
    pass


# class Scenario(Base):
#     __tablename__ = "scenario"

#     id: Mapped[int] = mapped_column(primary_key=True)
#     stock_projection_year: Mapped[int] = mapped_column(BigInteger)
#     building_archetype_code: Mapped[str] = mapped_column(String)
#     stock_region_name: Mapped[str] = mapped_column(String)
#     country_name: Mapped[str] = mapped_column(String)
#     building_use_type_name: Mapped[str] = mapped_column(String)
#     building_use_subtype_name: Mapped[str] = mapped_column(String)
#     element_class_generic_name: Mapped[str] = mapped_column(String)
#     material_name_JRC_CDW: Mapped[str] = mapped_column(String)
#     activity_in_out: Mapped[str] = mapped_column(String)
#     stock_activity_type_name: Mapped[str] = mapped_column(String)
#     carbon_category: Mapped[str] = mapped_column(String)
#     stock_floor_area_Mm2: Mapped[float] = mapped_column(Float)
#     amount_material: Mapped[float] = mapped_column(Float)
#     ind_GWP_Tot: Mapped[float] = mapped_column(Float)
#     ind_GWP_Fos: Mapped[float] = mapped_column(Float)
#     ind_GWP_Bio: Mapped[float] = mapped_column(Float)
#     ind_GWP_LuLuc: Mapped[float] = mapped_column(Float)


class Filenames(FilenamesBase):
    __tablename__ = "filenames"

    id: Mapped[int] = mapped_column(primary_key=True)
    filename: Mapped[str] = mapped_column(String, nullable=False)
