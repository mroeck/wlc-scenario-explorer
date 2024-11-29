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

type FormatTickNumberArgs = {
  value: number;
};

function formatTickNumber({ value }: FormatTickNumberArgs) {
  const formatted = value.toFixed(2).replaceAll(".00", "");

  return formatted.includes(".") && formatted.endsWith("0")
    ? formatted.slice(0, -1)
    : formatted;
}

export const tickFormatter = (number: number) => {
  if (number >= 1_000_000_000) {
    return `${formatTickNumber({ value: number / 1_000_000_000 })}B`;
  } else if (number >= 1_000_000) {
    return `${formatTickNumber({ value: number / 1_000_000 })}M`;
  } else if (number >= 1_000) {
    return `${formatTickNumber({ value: number / 1_000 })}K`;
  } else {
    return formatTickNumber({ value: number });
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

    type Key = keyof (typeof ATTRIBUTE_OPTIONS_COLOR)[typeof breakdownByTyped];
    const color = validOption
      ? ATTRIBUTE_OPTIONS_COLOR[breakdownByTyped][validOption as Key]
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
    "SK", // Slovakia
    "SI", // Slovenia
    "RO", // Romania
    "PL", // Poland
    "HU", // Hungary
    "CZ", // Czech Republic
    "BG", // Bulgaria
    "AT", // Austria
  ],
  Mediterranean: [
    "PT", // Portugal
    "MT", // Malta
    "IT", // Italy
    "HR", // Croatia
    "ES", // Spain
    "EL", // Greece
    "CY", // Cyprus
  ],
  Nordic: [
    "SE", // Sweden
    "LV", // Latvia
    "LT", // Lithuania
    "FI", // Finland
    "EE", // Estonia
  ],
  Oceanic: [
    "NL", // Netherlands
    "LU", // Luxembourg
    "IE", // Ireland
    "FR", // France
    "DK", // Denmark
    "DE", // Germany
    "BE", // Belgium
  ],
  [EMBODIED_CARBON]: [
    "Demolition embodied carbon",
    "Use phase embodied carbon",
    "Renovation embodied carbon",
    "Construction embodied carbon",
  ],
  [OPERATIONAL_CARBON]: ["Use phase operational carbon"],
  "A1-A3": ["A1-3"],
  "A4-A5": ["A4", "A5"],
  B: ["B2", "B4", "B5", "B6"],
  "C1-C4": ["C1", "C2", "C3", "C4"],
} as const satisfies Categories;

type AttributeOptionsColor = typeof ATTRIBUTE_OPTIONS_COLOR;
type AttributeOptions = keyof AttributeOptionsColor;

type OrderedAttributes =
  | "Building subtype"
  | "Element Class"
  | "country"
  | "Whole life cycle modules";

type TupleWithAsManyItemsAsGeneric<T> = ReadonlyTuple<
  keyof T,
  UnionToTuple<keyof T>["length"] extends number
    ? UnionToTuple<keyof T>["length"]
    : never
>;

type AttributeOptionsColorMapping = {
  [Attribute in AttributeOptions]: TupleWithAsManyItemsAsGeneric<
    AttributeOptionsColor[Attribute]
  >;
};

type AttributeOptionsOrder = Pick<
  AttributeOptionsColorMapping,
  OrderedAttributes
>;

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
  "Whole life cycle modules": [
    ...CATEGORIES[OPERATIONAL_CARBON],
    ...CATEGORIES[EMBODIED_CARBON],
  ],
} as const satisfies Partial<Record<Attribute, string[]>>;

const ORDERED_ATTRIBUTES: OrderedAttributes[] = [
  "country",
  "Building subtype",
  "Element Class",
  "Whole life cycle modules",
] as const satisfies Attribute[];

type GetAttributeOptionsOrderArgs = {
  breakdownBy: Attribute;
  defaultOptions: BreakdownByOptions[];
};
export const getAttributeOptionsOrdered = ({
  breakdownBy,
  defaultOptions,
}: GetAttributeOptionsOrderArgs) => {
  if (ORDERED_ATTRIBUTES.includes(breakdownBy)) {
    const breakdownByTyped = breakdownBy as OrderedAttributes;
    const optionsOrdered = ATTRIBUTE_OPTIONS_ORDER[breakdownByTyped];

    return optionsOrdered.filter((option) => defaultOptions.includes(option));
  } else {
    return defaultOptions;
  }
};

function findCategory(item: Payload) {
  for (const [category, values] of Object.entries(CATEGORIES)) {
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
