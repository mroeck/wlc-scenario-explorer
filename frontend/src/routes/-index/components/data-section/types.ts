import type {
  DIVIDED_BY_OPTIONS,
  INDICATORS,
} from "@/lib/shared_with_backend/constants";

export type Unit =
  | `${(typeof INDICATORS)[number]} per ${(typeof DIVIDED_BY_OPTIONS)[number]}`
  | (typeof INDICATORS)[number];

export type UnitMinified = string;

export type GraphDomain = [number, number];
