from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped
from .constants import STRATEGIES_TABLE_NAME


class StrategiesBase(DeclarativeBase):
    pass


class Strategies(StrategiesBase):
    __tablename__ = STRATEGIES_TABLE_NAME

    id: Mapped[int] = mapped_column(primary_key=True)

    increase_of_circularity_measures: Mapped[str] = mapped_column(nullable=False)
    reduce_space_per_capita: Mapped[str] = mapped_column(nullable=False)
    shift_to_low_carbon_and_bio_based_solutions: Mapped[str] = mapped_column(
        nullable=False
    )
    reduce_transport_and_construction_emissions: Mapped[str] = mapped_column(
        nullable=False
    )
    increase_use_of_improved_materials: Mapped[str] = mapped_column(nullable=False)
    reduce_operational_emissions: Mapped[str] = mapped_column(nullable=False)
