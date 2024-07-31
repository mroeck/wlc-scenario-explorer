from typing import List, Dict, Optional, Mapping
from pydantic import BaseModel, Field, field_validator, Extra
from enum import Enum

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
    AMOUNT_MATERIAL_KG_PER_BUILDING = "amount_material_kg_per_building"
    IND_GWP_TOT = "ind_GWP_Tot"
    IND_GWP_FOS = "ind_GWP_Fos"
    IND_GWP_BIO = "ind_GWP_Bio"
    IND_GWP_LULUC = "ind_GWP_LuLuc"


class AttributeEnumSchema(str, Enum):
    STOCK_PROJECTION_YEAR = "stock projection year"
    COUNTRY_NAME = "country name"
    BUILDING_USE_TYPE_NAME = "building use type name"
    BUILDING_USE_SUBTYPE_NAME = "building use subtype name"
    ELEMENT_CLASS_GENERIC_NAME = "element class generic name"
    MATERIAL_NAME_JRC_CDW = "material name JRC CDW"
    ACTIVITY_IN_OUT = "activity in out"
    STOCK_ACTIVITY_TYPE_NAME = "stock activity type name"
    CARBON_CATEGORY = "carbon category"


ATTRIBUTE_TO_DB_COLUMNS: Mapping[str, str] = {
    AttributeEnumSchema.STOCK_PROJECTION_YEAR.value: ColumnsEnumSchema.STOCK_PROJECTION_YEAR.value,
    AttributeEnumSchema.COUNTRY_NAME.value: ColumnsEnumSchema.COUNTRY_NAME.value,
    AttributeEnumSchema.BUILDING_USE_TYPE_NAME.value: ColumnsEnumSchema.BUILDING_USE_TYPE_NAME.value,
    AttributeEnumSchema.BUILDING_USE_SUBTYPE_NAME.value: ColumnsEnumSchema.BUILDING_USE_SUBTYPE_NAME.value,
    AttributeEnumSchema.ELEMENT_CLASS_GENERIC_NAME.value: ColumnsEnumSchema.ELEMENT_CLASS_GENERIC_NAME.value,
    AttributeEnumSchema.MATERIAL_NAME_JRC_CDW.value: ColumnsEnumSchema.MATERIAL_NAME_JRC_CDW.value,
    AttributeEnumSchema.ACTIVITY_IN_OUT.value: ColumnsEnumSchema.ACTIVITY_IN_OUT.value,
    AttributeEnumSchema.STOCK_ACTIVITY_TYPE_NAME.value: ColumnsEnumSchema.STOCK_ACTIVITY_TYPE_NAME.value,
    AttributeEnumSchema.CARBON_CATEGORY.value: ColumnsEnumSchema.CARBON_CATEGORY.value,
}


class UnitEnumSchema(str, Enum):
    TOTAL_GWP = "total GWP"
    FOSSIL_GWP = "fossil GWP"
    BIO_GWP = "bio GWP"
    LULUC_GWP = "luluc GWP"
    MATERIAL_AMOUNT_PER_BUILDING = "material amount"


UNIT_TO_DB_COLUMNS: Dict[str, str] = {
    UnitEnumSchema.TOTAL_GWP.value: ColumnsEnumSchema.IND_GWP_TOT.value,
    UnitEnumSchema.FOSSIL_GWP.value: ColumnsEnumSchema.IND_GWP_FOS.value,
    UnitEnumSchema.BIO_GWP.value: ColumnsEnumSchema.IND_GWP_BIO.value,
    UnitEnumSchema.LULUC_GWP.value: ColumnsEnumSchema.IND_GWP_LULUC.value,
    UnitEnumSchema.MATERIAL_AMOUNT_PER_BUILDING.value: ColumnsEnumSchema.AMOUNT_MATERIAL_KG_PER_BUILDING.value,
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
    COUNTRIES = "Countries"
    BUILDING_USE_TYPE = "Building Use Type"
    BUILDING_ELEMENT_CLASS = "Building Element Class"
    MATERIAL_TYPE = "Material Type"
    BUILDING_USE_SUBTYPE = "Building Use Subtype"
    ACTIVITY_IN_OUT = "Activity in out"
    REGION = "Region"


FILTER_TO_DB_COLUMN: Dict[str, str] = {
    FilterFrontEnumSchema.FROM.value: ColumnsEnumSchema.STOCK_PROJECTION_YEAR.value,
    FilterFrontEnumSchema.TO.value: ColumnsEnumSchema.STOCK_PROJECTION_YEAR.value,
    FilterFrontEnumSchema.COUNTRIES.value: ColumnsEnumSchema.COUNTRY_NAME.value,
    FilterFrontEnumSchema.BUILDING_USE_TYPE.value: ColumnsEnumSchema.BUILDING_USE_TYPE_NAME.value,
    FilterFrontEnumSchema.BUILDING_ELEMENT_CLASS.value: ColumnsEnumSchema.ELEMENT_CLASS_GENERIC_NAME.value,
    FilterFrontEnumSchema.MATERIAL_TYPE.value: ColumnsEnumSchema.MATERIAL_NAME_JRC_CDW.value,
    FilterFrontEnumSchema.BUILDING_USE_SUBTYPE.value: ColumnsEnumSchema.BUILDING_USE_SUBTYPE_NAME.value,
    FilterFrontEnumSchema.ACTIVITY_IN_OUT.value: ColumnsEnumSchema.ACTIVITY_IN_OUT.value,
    FilterFrontEnumSchema.REGION.value: ColumnsEnumSchema.STOCK_REGION_NAME.value,
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

    @field_validator("From", "To")
    def validate_year(cls, year: Optional[int]) -> Optional[int]:
        if year is not None and not (MIN_YEAR <= year <= MAX_YEAR):
            raise ValueError(f"Year must be between {MIN_YEAR} and {MAX_YEAR}.")
        return year

    def validate_field(self, key: str) -> None:
        if key not in FILTER_TO_DB_COLUMN.values():
            raise ValueError(f"Invalid field '{key}'")


class ScenarioEnumSchema(str, Enum):
    SCENARIO_1 = "scenario 1"
    SCENARIO_2 = "scenario 2"
    SCENARIO_3 = "scenario 3"


SCENARIO_TO_FILE_NAME: Dict[str, str] = {
    ScenarioEnumSchema.SCENARIO_1.value: "scenario",
    ScenarioEnumSchema.SCENARIO_2.value: "scenario",
    ScenarioEnumSchema.SCENARIO_3.value: "scenario",
}


class ScenarioRowsAggregatedSchema(BaseModel):
    year: int = Field(..., alias="stock_projection_year")
