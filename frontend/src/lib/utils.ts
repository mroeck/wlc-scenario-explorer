import { ATTRIBUTE_OPTIONS_COLOR } from "@/routes/-index/components/data-section/temp_data";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import type { Attribute } from "./types";
import { DEFAULT_COLOR } from "./constants";

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
  option: string;
};
export const getColor = ({ breakdownBy, option }: GetColorArgs) => {
  if (Object.keys(ATTRIBUTE_OPTIONS_COLOR).includes(breakdownBy)) {
    return ATTRIBUTE_OPTIONS_COLOR[breakdownBy][option];
  }
  return DEFAULT_COLOR;
};
