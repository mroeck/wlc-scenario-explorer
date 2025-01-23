import type { UseNavigateResult } from "@tanstack/react-router";
import type { BreakdownByOptions } from "./types";

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
