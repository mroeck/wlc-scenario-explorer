import type { UseNavigateResult } from "@tanstack/react-router";
import type { BreakdownByOptions, GraphProps } from "./types";
import type { QueryClient } from "@tanstack/react-query";
import type { Domain, DomainAll } from "../types";
import { DOMAINS_QUERY_KEY } from "../constants";
import { DEFAULT_Y_AXIS_DOMAIN_ALL } from "@/lib/constants";
import { getNiceTickValues } from "recharts-scale";
import type { Dispatch, SetStateAction } from "react";

type OnElementClickArgs = {
  newHighlight: BreakdownByOptions;
  navigate: UseNavigateResult<"/">;
  amountOfOptions: number;
};
export const onElementClick = ({
  newHighlight,
  navigate,
  amountOfOptions,
}: OnElementClickArgs) => {
  void navigate({
    search: (prev) => {
      const hasHighlights =
        "highlights" in prev && Array.isArray(prev.highlights);
      const currentHighlights = hasHighlights
        ? (prev.highlights as Exclude<typeof prev.highlights, undefined>)
        : [];
      const isAlreadyHighlighted = currentHighlights.includes(newHighlight);
      const addNewHighlight = [...currentHighlights, newHighlight];
      const removeNewHighlight = currentHighlights.filter(
        (item) => item !== newHighlight,
      );
      const willEverythingBeHighlighted =
        addNewHighlight.length >= amountOfOptions;

      return {
        ...prev,
        filters: {
          ...prev.filters,
          To: prev.filters?.To?.toString(),
          From: prev.filters?.From?.toString(),
        },
        highlights: isAlreadyHighlighted
          ? removeNewHighlight
          : willEverythingBeHighlighted
            ? undefined
            : addNewHighlight,
      };
    },
    replace: true,
  });
};

type UpdateDomainArgs = {
  graphType: "stackedArea" | "line";
  newMin: number | null;
  newMax: number | null;
  queryClient: QueryClient;
  scenarioId: GraphProps["scenarioId"];
  graphDomain: Domain;
  hash: Record<string, unknown>;
};
export const updateDomain = ({
  graphType,
  newMin,
  newMax,
  queryClient,
  scenarioId,
  graphDomain,
  hash,
}: UpdateDomainArgs) => {
  const id = (scenarioId ?? "A") as "A" | "B";

  if (!graphDomain.isUpdated[id]) {
    queryClient.setQueryData<DomainAll>([DOMAINS_QUERY_KEY, hash], (old) => {
      const currentData = old ?? DEFAULT_Y_AXIS_DOMAIN_ALL;
      const minValues = [currentData[graphType].min, newMin].filter(
        (item) => item != null,
      );
      const maxValues = [currentData[graphType].max, newMax].filter(
        (item) => item != null,
      );

      return {
        ...currentData,
        [graphType]: {
          min: minValues.length > 0 ? Math.min(...minValues) : null,
          max: maxValues.length > 0 ? Math.max(...maxValues) : null,
          isUpdated: {
            ...currentData[graphType].isUpdated,
            [id]: true,
          },
        },
      };
    });
  }
};

export type GetFinalDomainArg = [number, number];

type GetDefaultDomainArgs = {
  domainRaw: [number, number];
  initialTickCount: number;
  setTickCount: Dispatch<SetStateAction<number>>;
};
export const getDefaultDomain = ({
  domainRaw,
  initialTickCount,
  setTickCount,
}: GetDefaultDomainArgs) => {
  const [dataMin, dataMax] = domainRaw;
  const maxIterations = 10;
  let currentTickCount = initialTickCount;
  let bestDomain: [number, number] | null = null;
  let bestGap = Infinity;
  let bestTickCount = initialTickCount;

  for (let i = 0; i < maxIterations; i++) {
    const tickValues = getNiceTickValues(domainRaw, currentTickCount);

    if (!tickValues.length) break;

    const domainStart = tickValues[0] as Exclude<
      (typeof tickValues)[0],
      undefined
    >;
    const domainEnd = tickValues[tickValues.length - 1] as Exclude<
      (typeof tickValues)[number],
      undefined
    >;
    const domainLength = domainEnd - domainStart;

    const startGap = Math.abs(domainStart - dataMin) / domainLength;
    const endGap = Math.abs(domainEnd - dataMax) / domainLength;
    const maxGap = Math.max(startGap, endGap);

    if (maxGap < bestGap) {
      console.log("best tick", currentTickCount);
      bestDomain = [domainStart, domainEnd];
      bestGap = maxGap;
      bestTickCount = currentTickCount;
    }

    currentTickCount = currentTickCount + 1;
  }

  setTickCount(bestTickCount);

  return bestDomain ?? [dataMin, dataMax];
};
