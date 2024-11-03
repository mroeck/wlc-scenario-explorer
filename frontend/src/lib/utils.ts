import {
  ATTRIBUTE_OPTIONS_COLOR,
  VALUE_TO_LABEL,
} from "@/lib/shared_with_backend/constants";
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
import type { KeysOfUnion } from "type-fest";

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
        message: "Could not find color for: " + option,
      },
    );

    const result = OptionSchema.safeParse(option);
    const validOption = result.data;

    if (result.error) {
      console.error(result.error);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const color = validOption
      ? // @ts-expect-error: hard to type properly, valideOption should be a proper key to access
        ATTRIBUTE_OPTIONS_COLOR[breakdownByTyped][validOption]
      : DEFAULT_COLOR;

    return color as Color;
  }
  return DEFAULT_COLOR;
};

type Categories = Record<string, BreakdownByOptions[]>;
const CATEGORIES: Categories = {
  "Non-residential": ["OFF"],
  Residential: ["SFH", "MFH"],
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
    "Construction embodied carbon",
    "Demolition embodied carbon",
    "Use phase embodied carbon",
    "Renovation embodied carbon",
  ],
  [OPERATIONAL_CARBON]: ["Use phase operational carbon"],
} as const;

const ATTRIBUTE_OPTIONS_ORDER = {
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
} satisfies Partial<Record<Attribute, string[]>>;

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
