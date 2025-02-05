import type {
  DIVIDED_BY_OPTIONS,
  INDICATORS,
} from "@/lib/shared_with_backend/constants";

export type Unit =
  | `${(typeof INDICATORS)[number]} per ${(typeof DIVIDED_BY_OPTIONS)[number]}`
  | (typeof INDICATORS)[number];

export type UnitMinified = string;

export type GraphDomain = [number, number];

export type Domain = {
  max: null | number;
  min: null | number;
  isUpdated: {
    A: boolean;
    B: boolean;
  };
};

export type DomainAll = {
  line: Domain;
  stackedArea: Domain;
};
