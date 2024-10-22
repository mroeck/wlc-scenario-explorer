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

const MIN_SLIDER = 0.5;
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
  const leftSideItem = items[0];
  const rightSideItem = items[1];

  const [isGrabbing, setIsGrabbing] = React.useState(false);
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

  const handleSliderChange = (values: number[]) => {
    const newValues = values[0] < MIN_SLIDER ? [MIN_SLIDER] : values;
    setSliderValues(newValues);
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
      // disabled eslint: I don't know how to make it work outside the useEffect
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setSliderValues([MAX_SLIDER]);
    } else if (display === SCENARIO_B_ONLY) {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setSliderValues([MIN_SLIDER]);
    } else {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setSliderValues([50]);
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
    <div className="flex flex-col items-center space-y-4 md:h-full md:max-h-[600px]">
      <div className="relative size-full">
        <div
          className={cn(
            "absolute left-0 top-0 flex h-8 w-full -translate-y-full",
            display !== SCENARIO_A_AND_B && "hidden",
          )}
          style={{ width: sliderValues[0].toString() + "%" }}
        >
          <div className="absolute right-0 top-0 w-fit text-nowrap rounded-l-lg border-2 border-r-0 border-solid bg-white px-2 py-1 text-sm">
            <div
              className="absolute right-0 top-[-2px] h-[calc(100%+4px)]  border-r-2 border-solid"
              style={{ borderColor: "hsl(223 0% 40%)" }}
            ></div>
            {leftSideItem.label}
          </div>
          <div className="absolute right-0 top-0 w-fit translate-x-full text-nowrap rounded-r-lg border-2 border-l-0 bg-white px-2 py-1 text-sm">
            {rightSideItem.label}
          </div>
        </div>
        <div className="size-full bg-white" ref={firstGraphRef}>
          <div
            className={cn(
              "relative size-full bg-white sm:visible",
              display === SCENARIO_B_ONLY ? "visible" : "invisible",
            )}
          >
            {rightSideItem.component}
          </div>
        </div>
        <div
          className={cn(
            "absolute inset-0 size-full sm:visible",
            display !== SCENARIO_A_ONLY && "overflow-x-hidden",
          )}
          style={{ width: sliderValues[0].toString() + "%" }}
        >
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
            {leftSideItem.component}
          </div>
          <div
            className={cn(
              "absolute right-0 top-0 h-full border-r-2 border-solid",
              display !== SCENARIO_A_AND_B && "hidden",
            )}
            style={{ borderColor: "hsl(223 0% 40%)" }}
          ></div>
        </div>
        <Slider
          className={cn(
            "absolute left-[-15px] top-1/2 z-10 w-[calc(100%+28px)] origin-center",
            display !== SCENARIO_A_AND_B && "hidden",
          )}
          value={sliderValues}
          onValueChange={handleSliderChange}
          min={0}
          max={100}
          step={0.5}
          isGrabbing={isGrabbing}
          setIsGrabbing={setIsGrabbing}
        />
        <div
          className={cn("absolute inset-0 z-50", isGrabbing ? "" : "hidden")}
          onClick={() =>
            "stop the click from propagating to graph since element with onClick are ignored. (see BLACKLIST_TAGS usage)"
          }
        ></div>
      </div>
    </div>
  );
};
