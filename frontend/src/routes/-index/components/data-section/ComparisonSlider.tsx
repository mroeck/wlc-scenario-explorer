import { Slider } from "@/components/ui/slider";
import {
  ROUTES,
  SCENARIO_A_AND_B,
  SCENARIO_A_ONLY,
  SCENARIO_B_ONLY,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getRouteApi } from "@tanstack/react-router";
import React, { useEffect, useRef, useState, type ReactNode } from "react";

const route = getRouteApi(ROUTES.DASHBOARD);

const MIN_SLIDER = 1;
const MAX_SLIDER = 100;

type Item = {
  label: string;
  component: ReactNode;
};

type ComparisonSliderProps = {
  items: [Item, Item];
};

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  items,
}) => {
  const navigate = route.useNavigate();
  const display = route.useSearch({
    select: (search) => search.display,
  });
  const firstGraphRef = useRef<HTMLDivElement>(null);
  const secondGraphRef = useRef<HTMLDivElement>(null);
  const [graphDimensions, setGraphDimensions] = useState<
    { width: number; height: number } | undefined
  >(undefined);
  const [sliderValues, setSliderValues] = useState<number[]>([50]);

  const debounceTimeoutRef = useRef<number | undefined>();

  const handleSliderChange = (values: number[]) => {
    const newValues = values[0] < MIN_SLIDER ? [MIN_SLIDER] : values;
    setSliderValues(newValues);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      if (newValues[0] === MIN_SLIDER) {
        void navigate({
          search: (prev) => ({
            ...prev,
            display: SCENARIO_B_ONLY,
          }),
        });
      } else if (newValues[0] === MAX_SLIDER) {
        void navigate({
          search: (prev) => ({
            ...prev,
            display: SCENARIO_A_ONLY,
          }),
        });
      } else if (display !== SCENARIO_A_AND_B) {
        void navigate({
          search: (prev) => ({
            ...prev,
            display: SCENARIO_A_AND_B,
          }),
        });
      }
    }, 1000);
  };

  useEffect(() => {
    const graph = firstGraphRef.current;
    if (!graph) return;

    const resizeObserver = new ResizeObserver(() => {
      setGraphDimensions({
        width: graph.clientWidth,
        height: graph.clientHeight,
      });
    });

    resizeObserver.observe(graph);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (display === SCENARIO_A_ONLY) {
      setSliderValues([MAX_SLIDER]);
    } else if (display === SCENARIO_B_ONLY) {
      setSliderValues([MIN_SLIDER]);
    }
  }, [display]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      if (e.matches && display === SCENARIO_A_AND_B) {
        void navigate({
          search: (prev) => ({
            ...prev,
            display: SCENARIO_A_ONLY,
          }),
        });
      }
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, [display, navigate]);

  return (
    <div className="flex flex-col items-center space-y-4 md:h-full">
      <div className="relative size-full">
        <div
          className="absolute left-0 top-0 flex h-8 w-full -translate-y-full"
          style={{ width: sliderValues[0].toString() + "%" }}
        >
          <div className="absolute right-0 top-0 w-fit text-nowrap rounded-l-lg border-2 border-r-0 border-solid bg-white px-2 py-1 text-sm">
            <div className="absolute right-0 top-[-2px] h-[calc(100%+4px)]  border-r-2 border-solid border-black"></div>
            {items[0].label}
          </div>
          <div className="absolute right-0 top-0 w-fit translate-x-full text-nowrap rounded-r-lg border-2 border-l-0 bg-white px-2 py-1 text-sm">
            {items[1].label}
          </div>
        </div>
        <div className="size-full bg-white" ref={firstGraphRef}>
          <div
            className={cn(
              "relative size-full bg-white sm:visible",
              display === SCENARIO_A_ONLY ? "visible" : "invisible",
            )}
          >
            {items[0].component}
          </div>
        </div>
        <div
          className={cn(
            "absolute inset-0 size-full overflow-x-hidden sm:visible",
            display === SCENARIO_B_ONLY ? "visible" : "invisible",
          )}
          style={{ width: sliderValues[0].toString() + "%" }}
        >
          {display !== SCENARIO_A_ONLY && (
            <div
              className="relative size-full bg-white"
              ref={secondGraphRef}
              style={
                graphDimensions
                  ? {
                      width: graphDimensions.width,
                      height: graphDimensions.height,
                    }
                  : {}
              }
            >
              {items[1].component}
            </div>
          )}
          <div className="absolute right-0 top-0 hidden h-full border-r-2 border-solid border-black sm:block"></div>
        </div>
        <Slider
          className="absolute left-[-15px] top-1/2 z-10 hidden w-[calc(100%+28px)] origin-center sm:block"
          value={sliderValues}
          onValueChange={handleSliderChange}
          min={0}
          max={100}
          step={0.5}
        />
      </div>
    </div>
  );
};
