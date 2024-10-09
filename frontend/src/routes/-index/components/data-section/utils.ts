import { SCENARIO_A_ONLY, SCENARIO_B_ONLY } from "@/lib/constants";
import type { fetchScenarioRowsAggregated } from "@/lib/queries";
import type { DisplaySchema } from "@/lib/schemas";
import type { z } from "zod";

function getYaxisMaxValue({
  maxValue,
  gap,
}: {
  maxValue: number;
  gap: number;
}) {
  const baseMagnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
  const normalizedMaxValue = maxValue / baseMagnitude;
  const normalizedGap = gap / baseMagnitude;

  const adjustedMaxValue =
    Math.ceil((normalizedMaxValue + normalizedGap) * 2) / 2;

  return Math.ceil(adjustedMaxValue * baseMagnitude);
}

function getYaxisMinValue({
  minValue,
  gap,
}: {
  minValue: number;
  gap: number;
}) {
  const baseMagnitude = Math.pow(10, Math.floor(Math.log10(minValue)));
  const normalizedMinValue = minValue / baseMagnitude;
  const normalizedGap = gap / baseMagnitude;

  const adjustedMinValue =
    Math.floor((normalizedMinValue - normalizedGap) * 2) / 2;

  const roundedMinValue = Math.floor(adjustedMinValue * baseMagnitude);

  return normalizedGap < 0 ? roundedMinValue : Math.max(0, roundedMinValue);
}

type GetDomainAllArgs = {
  resultsA: Awaited<ReturnType<typeof fetchScenarioRowsAggregated>>;
  resultsB: Awaited<ReturnType<typeof fetchScenarioRowsAggregated>>;
  display: z.infer<typeof DisplaySchema>;
};
export function getDomainAll({
  resultsA,
  resultsB,
  display,
}: GetDomainAllArgs) {
  const stackedValuesA =
    display !== SCENARIO_B_ONLY
      ? [resultsA.minmax?.stacked.max, resultsA.minmax?.stacked.min]
      : [];
  const stackedValuesB =
    display !== SCENARIO_A_ONLY
      ? [resultsB.minmax?.stacked.max, resultsB.minmax?.stacked.min]
      : [];
  const stackedRaw = [...stackedValuesA, ...stackedValuesB].filter(
    (item) => item != null,
  ) as [number, number, ...number[]];

  const nonStackedValuesA =
    display !== SCENARIO_B_ONLY
      ? [resultsA.minmax?.nonStacked.max, resultsA.minmax?.nonStacked.min]
      : [];
  const nonStackedValuesB =
    display !== SCENARIO_A_ONLY
      ? [resultsB.minmax?.nonStacked.max, resultsB.minmax?.nonStacked.min]
      : [];

  const nonStackedRaw = [...nonStackedValuesA, ...nonStackedValuesB].filter(
    (item) => item != null,
  );

  const minStackedRaw = Math.min(...stackedRaw);
  const minStacked = minStackedRaw < 0 ? minStackedRaw : 0;
  const maxStacked = Math.max(...stackedRaw);

  const minNonStacked = Math.min(...nonStackedRaw);
  const maxNonStacked = Math.max(...nonStackedRaw);

  const gapStacked = (maxStacked - minStacked) / 10;
  const stacked: [number, number] = [
    getYaxisMinValue({ minValue: minStacked, gap: gapStacked }),
    getYaxisMaxValue({ maxValue: maxStacked, gap: gapStacked }),
  ];

  const gapNonStacked = (maxNonStacked - minNonStacked) / 10;
  const nonStacked: [number, number] = [
    getYaxisMinValue({ minValue: minNonStacked, gap: gapNonStacked }),
    getYaxisMaxValue({ maxValue: maxNonStacked, gap: gapNonStacked }),
  ];

  return {
    stacked,
    nonStacked,
  };
}
