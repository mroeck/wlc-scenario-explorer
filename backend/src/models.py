from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped
from .constants import STRATEGIES_TABLE_NAME


class StrategiesBase(DeclarativeBase):
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


class Strategies(StrategiesBase):
    __tablename__ = STRATEGIES_TABLE_NAME

    id: Mapped[int] = mapped_column(primary_key=True)
    increase_low_carbon_conventional: Mapped[str] = mapped_column(nullable=False)
    reduce_transport_emissions: Mapped[str] = mapped_column(nullable=False)
    reduce_construction_process: Mapped[str] = mapped_column(nullable=False)
    reduce_operational_energy: Mapped[str] = mapped_column(nullable=False)
    increase_bio_based_solutions: Mapped[str] = mapped_column(nullable=False)
    increase_circularity_and_reuse: Mapped[str] = mapped_column(nullable=False)
    increase_carbon_dioxide_removal: Mapped[str] = mapped_column(nullable=False)
    reduce_space_per_capita: Mapped[str] = mapped_column(nullable=False)
    increase_repair_and_retrofit: Mapped[str] = mapped_column(nullable=False)
    increase_material_efficiency: Mapped[str] = mapped_column(nullable=False)
    reduce_construction_waste: Mapped[str] = mapped_column(nullable=False)
