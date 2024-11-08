import {
  ATTRIBUTE_OPTIONS_COLOR,
  VALUE_TO_LABEL,
} from "./shared_with_backend/constants";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import type { Attribute, Color } from "./types";
import {
  DEFAULT_COLOR,
  EMBODIED_CARBON,
  OPERATIONAL_CARBON,
} from "./constants";
import type { Payload } from "recharts/types/component/DefaultLegendContent";
import type { BreakdownByOptions } from "@/routes/-index/components/data-section/graphs/types";
import type { KeysOfUnion, ReadonlyTuple, UnionToTuple } from "type-fest";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createSchema<T extends Record<string, any>>(input: {
  [K in keyof T]: z.ZodType<T[K]>;
}) {
  const Schema = z.object(input);

  return Schema;
}

export const tickFormatter = (number: number) => {
  if (number >= 1_000_000_000) {
    return `${Math.floor(number / 1_000_000_000).toString()}B`;
  } else if (number >= 1_000_000) {
    return `${Math.floor(number / 1_000_000).toString()}M`;
  } else if (number >= 1_000) {
    return `${Math.floor(number / 1_000).toString()}K`;
  } else {
    return number.toString();
  }
};

type GetColorArgs = {
  breakdownBy: Attribute;
  // eslint-disable-next-line @typescript-eslint/ban-types
  option: BreakdownByOptions | (string & {});
};
export const getColor = ({ breakdownBy, option }: GetColorArgs) => {
  const hasColor = Object.keys(ATTRIBUTE_OPTIONS_COLOR).includes(breakdownBy);

  if (hasColor) {
    const breakdownByTyped =
      breakdownBy as keyof typeof ATTRIBUTE_OPTIONS_COLOR;

    type AttributeColorCategory =
      (typeof ATTRIBUTE_OPTIONS_COLOR)[typeof breakdownByTyped];

    type Option = KeysOfUnion<AttributeColorCategory>;

    const OptionSchema = z.enum(
      Object.keys(ATTRIBUTE_OPTIONS_COLOR[breakdownByTyped]) as [
        Option,
        ...Option[],
      ],
      {
        message: "Could not find color for: " + option.toString(),
      },
    );

    const result = OptionSchema.safeParse(option);
    const validOption = result.data;

    if (result.error) {
      console.error(result.error);
    }

    const color = validOption
      ? ATTRIBUTE_OPTIONS_COLOR[breakdownByTyped][validOption]
      : DEFAULT_COLOR;

    return color as Color;
  }
  return DEFAULT_COLOR;
};

type Categories = Record<string, BreakdownByOptions[]>;
const CATEGORIES = {
  "Non-residential": ["OTH", "TRA", "OFF", "HOR", "HEA", "EDU"],
  Residential: ["SFH", "MFH", "ABL"],
  Walls: ["Internal walls", "External walls", "Common walls"],
  Openings: ["Internal openings", "External openings"],
  Services: ["Technical services", "Electrical services"],
  Structure: ["Substructure", "Storey floors", "Staircases", "Roofs"],
  Continental: [
    // @ts-expect-error: temp for new/not final parquet files
    "SK", // Slovakia
    // @ts-expect-error: temp for new/not final parquet files
    "SI", // Slovenia
    // @ts-expect-error: temp for new/not final parquet files
    "RO", // Romania
    // @ts-expect-error: temp for new/not final parquet files
    "PL", // Poland
    // @ts-expect-error: temp for new/not final parquet files
    "HU", // Hungary
    // @ts-expect-error: temp for new/not final parquet files
    "CZ", // Czech Republic
    // @ts-expect-error: temp for new/not final parquet files
    "BG", // Bulgaria
    "AT", // Austria
  ],
  Mediterranean: [
    // @ts-expect-error: temp for new/not final parquet files
    "PT", // Portugal
    // @ts-expect-error: temp for new/not final parquet files
    "MT", // Malta
    // @ts-expect-error: temp for new/not final parquet files
    "IT", // Italy
    // @ts-expect-error: temp for new/not final parquet files
    "HR", // Croatia
    // @ts-expect-error: temp for new/not final parquet files
    "ES", // Spain
    // @ts-expect-error: temp for new/not final parquet files
    "EL", // Greece
    // @ts-expect-error: temp for new/not final parquet files
    "CY", // Cyprus
  ],
  Nordic: [
    // @ts-expect-error: temp for new/not final parquet files
    "SE", // Sweden
    // @ts-expect-error: temp for new/not final parquet files
    "LV", // Latvia
    // @ts-expect-error: temp for new/not final parquet files
    "LT", // Lithuania
    // @ts-expect-error: temp for new/not final parquet files
    "FI", // Finland
    // @ts-expect-error: temp for new/not final parquet files
    "EE", // Estonia
  ],
  Oceanic: [
    // @ts-expect-error: temp for new/not final parquet files
    "NL", // Netherlands
    // @ts-expect-error: temp for new/not final parquet files
    "LU", // Luxembourg
    // @ts-expect-error: temp for new/not final parquet files
    "IE", // Ireland
    // @ts-expect-error: temp for new/not final parquet files
    "FR", // France
    // @ts-expect-error: temp for new/not final parquet files
    "DK", // Denmark
    // @ts-expect-error: temp for new/not final parquet files
    "DE", // Germany
    // @ts-expect-error: temp for new/not final parquet files
    "BE", // Belgium
  ],
  [EMBODIED_CARBON]: [
    "Construction embodied carbon",
    "Demolition embodied carbon",
    "Use phase embodied carbon",
    // @ts-expect-error: temp for new/not final parquet files
    "Renovation embodied carbon",
  ],
  [OPERATIONAL_CARBON]: ["Use phase operational carbon"],
  "A1-A3": ["A1-3"],
  "A4-A5": ["A4", "A5"],
  B: ["B2", "B4", "B5", "B6"],
  "C1-C4": ["C1", "C2", "C3", "C4"],
} as const satisfies Categories;

type AttributeOptionsColor = typeof ATTRIBUTE_OPTIONS_COLOR;
type AttributeOptions = keyof AttributeOptionsColor;

type AttributeOptionsOrder = Pick<
  {
    [Attribute in AttributeOptions]: ReadonlyTuple<
      keyof AttributeOptionsColor[Attribute],
      UnionToTuple<
        keyof AttributeOptionsColor[Attribute]
      >["length"] extends number
        ? UnionToTuple<keyof AttributeOptionsColor[Attribute]>["length"]
        : never
    >;
  },
  "Building subtype" | "Element Class" | "country"
>;

// @ts-expect-error: temp for new/not final parquet files
export const ATTRIBUTE_OPTIONS_ORDER: AttributeOptionsOrder = {
  "Building subtype": [
    ...CATEGORIES.Residential,
    ...CATEGORIES["Non-residential"],
  ],
  "Element Class": [
    ...CATEGORIES.Structure,
    ...CATEGORIES.Walls,
    ...CATEGORIES.Services,
    ...CATEGORIES.Openings,
  ],
  country: [
    ...CATEGORIES.Oceanic,
    ...CATEGORIES.Nordic,
    ...CATEGORIES.Mediterranean,
    ...CATEGORIES.Continental,
  ],
} as const satisfies Partial<Record<Attribute, string[]>>;

const ORDERED_ATTRIBUTES = [
  "country",
  "Building subtype",
  "Element Class",
] as const satisfies Attribute[];

type GetAttributeOptionsOrderArgs = {
  breakdownBy: Attribute;
  defaultOptions: BreakdownByOptions[];
};
export const getAttributeOptionsOrdered = ({
  breakdownBy,
  defaultOptions,
}: GetAttributeOptionsOrderArgs) => {
  // @ts-expect-error: some breakdownBy need to be ordered some not, no reason to error here
  if (ORDERED_ATTRIBUTES.includes(breakdownBy)) {
    const breakdownByTyped = breakdownBy as (typeof ORDERED_ATTRIBUTES)[number];
    const optionsOrdered = ATTRIBUTE_OPTIONS_ORDER[breakdownByTyped];

    return optionsOrdered.filter((option) => defaultOptions.includes(option));
  } else {
    return defaultOptions;
  }
};

function findCategory(item: Payload) {
  for (const [category, values] of Object.entries(CATEGORIES)) {
    // @ts-expect-error: Argument of type 'string' is not assignable to parameter of type 'never'.
    if (!!item.value && values.includes(item.value as string)) {
      return category;
    }
  }
  return null;
}

export function groupByCategory({ values }: { values: Payload[] }) {
  const grouped: Record<string, Payload[]> = {};

  values.forEach((value) => {
    const category = findCategory(value);
    if (category) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      grouped[category] = grouped[category] || [];

      grouped[category].push(value);
    }
  });

  return grouped;
}

type GetValueLabelArgs = {
  value: string;
};
export function getValueLabel({ value }: GetValueLabelArgs) {
  const valueTyped = value as keyof typeof VALUE_TO_LABEL;
  const label =
    (VALUE_TO_LABEL[valueTyped] as string | undefined) ??
    (valueTyped as string);

  return label;
}
