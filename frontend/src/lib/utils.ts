import { ATTRIBUTE_OPTIONS_COLOR } from "@/lib/shared_with_backend/constants";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import type { Attribute } from "./types";
import { DEFAULT_COLOR } from "./constants";
import type { Payload } from "recharts/types/component/DefaultLegendContent";
import type { BreakdownByOptions } from "@/routes/-index/components/data-section/graphs/types";

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
  if (Object.keys(ATTRIBUTE_OPTIONS_COLOR).includes(breakdownBy)) {
    const breakdownByTyped =
      breakdownBy as keyof typeof ATTRIBUTE_OPTIONS_COLOR;

    type AttributeColorCategory =
      (typeof ATTRIBUTE_OPTIONS_COLOR)[typeof breakdownByTyped];

    return ATTRIBUTE_OPTIONS_COLOR[breakdownByTyped][
      option as AttributeColorCategory[keyof AttributeColorCategory]
    ];
  }
  return DEFAULT_COLOR;
};

const CATEGORIES = {
  "Non-residential": ["Office"],
  Residential: ["Single-family house", "Multi-family house"],
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
