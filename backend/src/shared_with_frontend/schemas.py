from typing import List, Dict, Optional, Mapping
from pydantic import BaseModel, Field, field_validator, Extra
from enum import Enum
from ..constants import DIVIDED_BY_NONE
from .constants import SCENARIO_PARAMETERS_ORDER

MAX_YEAR = 2500
MIN_YEAR = 1900


class ColumnsEnumSchema(Enum):
    STOCK_PROJECTION_YEAR = "stock_projection_year"
    BUILDING_ARCHETYPE_CODE = "building_archetype_code"
    STOCK_REGION_NAME = "stock_region_name"
    COUNTRY_NAME = "country_name"
    BUILDING_USE_TYPE_NAME = "building_use_type_name"
    BUILDING_USE_SUBTYPE_NAME = "building_use_subtype_name"
    ELEMENT_CLASS_GENERIC_NAME = "element_class_generic_name"
    MATERIAL_NAME_JRC_CDW = "material_name_JRC_CDW"
    ACTIVITY_IN_OUT = "activity_in_out"
    STOCK_ACTIVITY_TYPE_NAME = "stock_activity_type_name"
    CARBON_CATEGORY = "carbon_category"
    STOCK_FLOOR_AREA_MM2 = "stock_floor_area_Mm2"
    AMOUNT_MATERIAL = "amount_material"
    IND_GWP_TOT = "ind_GWP_Tot"
    IND_GWP_FOS = "ind_GWP_Fos"
    IND_GWP_BIO = "ind_GWP_Bio"
    IND_GWP_LULUC = "ind_GWP_LuLuc"
    LCA_STAGES = "LCS_EN15978"
    POPULATION_COUNTRY = "population_country"
    POPULATION_ARCHETYPE = "population_archetype"
    FLOOR_AREA_COUNTRY = "floor_area_country"
    FLOOR_AREA_ARCHETYPE = "floor_area_archetype"


class AttributeEnumSchema(str, Enum):
    STOCK_REGION_NAME = "EU Region"
    COUNTRY_NAME = "EU country"
    STOCK_PROJECTION_YEAR = "stock projection year"
    BUILDING_USE_TYPE_NAME = "Building type"
    BUILDING_USE_SUBTYPE_NAME = "Building subtype"
    ELEMENT_CLASS_GENERIC_NAME = "Element Class"
    MATERIAL_NAME_JRC_CDW = "Material Class"
    ACTIVITY_IN_OUT = "flow type"
    STOCK_ACTIVITY_TYPE_NAME = "building stock activity"
    CARBON_CATEGORY = "Life cycle stages"
    LCA_STAGES = "Life cycle modules"
    NONE = "None"


ATTRIBUTE_TO_DB_COLUMNS: Mapping[str, str] = {
    AttributeEnumSchema.STOCK_REGION_NAME.value: ColumnsEnumSchema.STOCK_REGION_NAME.value,
    AttributeEnumSchema.STOCK_PROJECTION_YEAR.value: ColumnsEnumSchema.STOCK_PROJECTION_YEAR.value,
    AttributeEnumSchema.COUNTRY_NAME.value: ColumnsEnumSchema.COUNTRY_NAME.value,
    AttributeEnumSchema.BUILDING_USE_TYPE_NAME.value: ColumnsEnumSchema.BUILDING_USE_TYPE_NAME.value,
    AttributeEnumSchema.BUILDING_USE_SUBTYPE_NAME.value: ColumnsEnumSchema.BUILDING_USE_SUBTYPE_NAME.value,
    AttributeEnumSchema.ELEMENT_CLASS_GENERIC_NAME.value: ColumnsEnumSchema.ELEMENT_CLASS_GENERIC_NAME.value,
    AttributeEnumSchema.MATERIAL_NAME_JRC_CDW.value: ColumnsEnumSchema.MATERIAL_NAME_JRC_CDW.value,
    AttributeEnumSchema.ACTIVITY_IN_OUT.value: ColumnsEnumSchema.ACTIVITY_IN_OUT.value,
    AttributeEnumSchema.STOCK_ACTIVITY_TYPE_NAME.value: ColumnsEnumSchema.STOCK_ACTIVITY_TYPE_NAME.value,
    AttributeEnumSchema.CARBON_CATEGORY.value: ColumnsEnumSchema.CARBON_CATEGORY.value,
    AttributeEnumSchema.LCA_STAGES.value: ColumnsEnumSchema.LCA_STAGES.value,
    AttributeEnumSchema.NONE.value: AttributeEnumSchema.NONE.value,
}


class SortEnumSchema(str, Enum):
    BIG_TO_SMALL = "Descending value"
    REGIONS_ALPHABETICALLY = "default"


class IndicatorEnumSchema(str, Enum):
    TOTAL_GWP = "GWP total"
    FOSSIL_GWP = "GWP fossil"
    BIO_GWP = "GWP bio"
    LULUC_GWP = "GWP luluc"
    MATERIAL_AMOUNT_PER_BUILDING = "Material mass"


class DividedByEnumSchema(str, Enum):
    NONE = "none (total)"
    FLOOR_AREA_COUNTRY = "m² (floor area)"
    FLOOR_AREA_ARCHETYPE = "m² (archetype)"
    POPULATION_COUNTRY = "capita (users)"
    POPULATION_ARCHETYPE = "capita (archetype)"


UNIT_TO_DB_COLUMNS: Dict[IndicatorEnumSchema | DividedByEnumSchema, str] = {
    IndicatorEnumSchema.TOTAL_GWP: ColumnsEnumSchema.IND_GWP_TOT.value,
    IndicatorEnumSchema.FOSSIL_GWP: ColumnsEnumSchema.IND_GWP_FOS.value,
    IndicatorEnumSchema.BIO_GWP: ColumnsEnumSchema.IND_GWP_BIO.value,
    IndicatorEnumSchema.LULUC_GWP: ColumnsEnumSchema.IND_GWP_LULUC.value,
    IndicatorEnumSchema.MATERIAL_AMOUNT_PER_BUILDING: ColumnsEnumSchema.AMOUNT_MATERIAL.value,
    DividedByEnumSchema.NONE: DIVIDED_BY_NONE,
    DividedByEnumSchema.FLOOR_AREA_COUNTRY: ColumnsEnumSchema.FLOOR_AREA_COUNTRY.value,
    DividedByEnumSchema.FLOOR_AREA_ARCHETYPE: ColumnsEnumSchema.FLOOR_AREA_ARCHETYPE.value,
    DividedByEnumSchema.POPULATION_COUNTRY: ColumnsEnumSchema.POPULATION_COUNTRY.value,
    DividedByEnumSchema.POPULATION_ARCHETYPE: ColumnsEnumSchema.POPULATION_ARCHETYPE.value,
}


class YearSchema(BaseModel):
    year: int

    @field_validator("year")
    def validate_year(cls, year: int) -> int:
        if not (MIN_YEAR <= year <= MAX_YEAR):
            raise ValueError(f"Year must be between {MIN_YEAR} and {MAX_YEAR}.")
        return year


class FilterFrontEnumSchema(str, Enum):
    FROM = "From"
    TO = "To"
    country = "EU country"
    BUILDING_USE_TYPE = "Building type"
    BUILDING_ELEMENT_CLASS = "Element Class"
    MATERIAL_CLASS = "Material Class"
    BUILDING_USE_SUBTYPE = "Building subtype"
    ACTIVITY_IN_OUT = "flow type"
    REGION = "EU Region"
    STOCK_ACTIVITY_TYPE_NAME = "building stock activity"
    CARBON_CATEGORY = "Life cycle stages"
    LCA_STAGES = "Life cycle modules"


FILTER_TO_DB_COLUMN: Dict[str, str] = {
    FilterFrontEnumSchema.FROM.value: ColumnsEnumSchema.STOCK_PROJECTION_YEAR.value,
    FilterFrontEnumSchema.TO.value: ColumnsEnumSchema.STOCK_PROJECTION_YEAR.value,
    FilterFrontEnumSchema.country.value: ColumnsEnumSchema.COUNTRY_NAME.value,
    FilterFrontEnumSchema.BUILDING_USE_TYPE.value: ColumnsEnumSchema.BUILDING_USE_TYPE_NAME.value,
    FilterFrontEnumSchema.BUILDING_ELEMENT_CLASS.value: ColumnsEnumSchema.ELEMENT_CLASS_GENERIC_NAME.value,
    FilterFrontEnumSchema.MATERIAL_CLASS.value: ColumnsEnumSchema.MATERIAL_NAME_JRC_CDW.value,
    FilterFrontEnumSchema.BUILDING_USE_SUBTYPE.value: ColumnsEnumSchema.BUILDING_USE_SUBTYPE_NAME.value,
    FilterFrontEnumSchema.REGION.value: ColumnsEnumSchema.STOCK_REGION_NAME.value,
    FilterFrontEnumSchema.STOCK_ACTIVITY_TYPE_NAME.value: ColumnsEnumSchema.STOCK_ACTIVITY_TYPE_NAME.value,
    FilterFrontEnumSchema.CARBON_CATEGORY.value: ColumnsEnumSchema.CARBON_CATEGORY.value,
    FilterFrontEnumSchema.LCA_STAGES.value: ColumnsEnumSchema.LCA_STAGES.value,
}

DB_COLUMN_TO_FILTER = {v: k for k, v in FILTER_TO_DB_COLUMN.items()}


class FiltersSchema(BaseModel, extra=Extra.forbid):
    From: Optional[int] = None
    To: Optional[int] = None
    country_name: Optional[List[str]] = None
    building_use_type_name: Optional[List[str]] = None
    element_class_generic_name: Optional[List[str]] = None
    material_name_JRC_CDW: Optional[List[str]] = None
    building_use_subtype_name: Optional[List[str]] = None
    activity_in_out: Optional[List[str]] = None
    stock_region_name: Optional[List[str]] = None
    stock_activity_type_name: Optional[List[str]] = None
    carbon_category: Optional[List[str]] = None
    LCS_EN15978: Optional[List[str]] = None

    @field_validator("From", "To")
    def validate_year(cls, year: Optional[int]) -> Optional[int]:
        if year is not None and not (MIN_YEAR <= year <= MAX_YEAR):
            raise ValueError(f"Year must be between {MIN_YEAR} and {MAX_YEAR}.")
        return year

    def validate_field(self, key: str) -> None:
        if key not in FILTER_TO_DB_COLUMN.values():
            raise ValueError(f"Invalid field '{key}'")


class ScenarioEnumSchema(str, Enum):
    Example = "Example scenario (for illustration purpose only)"
    CPOO = "Optimistic scenario of Current Policies"
    CPOC = "Conservative scenario of Current Policies"
    # APOL = "Additional Policy scenario"
    APOI = "Current Policy + Improve strategies"
    APOS = "Current Policy + Shift strategies"
    APOA = "Current Policy + Avoid strategies"
    AASI = "Current Policy + Avoid + Shift + Improve strategies"
    CUSR = "Custom scenario"

    BAU = "BAU"
    CPOL_A = "CPOL/A"
    CPOL_B = "CPOL/B"
    APOL = "APOL"
    ALL_HIGH = "ALL/HIGH"


DEFAULT_SCENARIO = "1.5-2.5-1.0-1.5-2.0-2.0-1.5-1.5-1.0-1.0-1.0"

SCENARIO_TO_FILE_NAME: Dict[str, str] = {
    ScenarioEnumSchema.AASI.value: "2.5-2.5-2.5-2.5-2.5-2.5-2.5-2.5-2.5-2.5-2.5",
    ScenarioEnumSchema.APOA.value: DEFAULT_SCENARIO,
    ScenarioEnumSchema.APOI.value: DEFAULT_SCENARIO,
    ScenarioEnumSchema.APOL.value: DEFAULT_SCENARIO,
    ScenarioEnumSchema.APOS.value: DEFAULT_SCENARIO,
    ScenarioEnumSchema.CPOC.value: DEFAULT_SCENARIO,
    ScenarioEnumSchema.CPOO.value: DEFAULT_SCENARIO,
    ScenarioEnumSchema.CUSR.value: ScenarioEnumSchema.CUSR.value,
    ScenarioEnumSchema.Example.value: DEFAULT_SCENARIO,
    ScenarioEnumSchema.BAU.value: "1.0-1.0-1.0-1.0-1.0-1.0",
    ScenarioEnumSchema.CPOL_A.value: "1.0-1.0-1.5-2.0-2.5-1.0",
    ScenarioEnumSchema.CPOL_B.value: "1.5-2.5-1.0-1.5-2.0-2.0",
    ScenarioEnumSchema.APOL.value: "2.5-2.0-1.5-1.0-1.0-2.5",
    ScenarioEnumSchema.ALL_HIGH.value: "2.0-2.0-2.0-2.0-2.0-2.0",
}


class ScenarioRowsAggregatedSchema(BaseModel):
    year: int = Field(..., alias="stock_projection_year")


class ScenarioParameters:
    def __init__(self, **kwargs: Dict[str, str]) -> None:
        for key, value in kwargs.items():
            if key not in SCENARIO_PARAMETERS_ORDER:
                raise TypeError(
                    "Argument %s not valid for %s" % (key, self.__class__.__name__)
                )
            setattr(self, key, value)
