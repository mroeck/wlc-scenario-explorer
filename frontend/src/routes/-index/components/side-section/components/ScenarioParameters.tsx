import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SCENARIO_PARAMETERS_OBJ } from "@/lib/shared_with_backend/constants";
import { ParameterLevel } from "./ParameterLevel";
import { cn } from "@/lib/utils";
import { PARAMETER_STATUS } from "@/lib/constants";

export const ScenarioParameters = () => {
  return (
    <Accordion type="single" collapsible className="pl-2">
      {Object.entries(SCENARIO_PARAMETERS_OBJ).map(([key, value], index) => {
        return (
          <AccordionItem
            key={key + index.toString()}
            value={key + index.toString()}
          >
            <div className={cn("flex justify-between gap-2")}>
              <div className={cn("flex-1")}>
                <AccordionTrigger className={cn("text-sm capitalize")}>
                  {key}
                </AccordionTrigger>
              </div>
              <div className={cn("flex items-center justify-center")}>
                <ParameterLevel
                  level={undefined}
                  status="active"
                  editable
                  className={cn("h-6 w-7 rounded-sm")}
                />
              </div>
            </div>
            <AccordionContent>
              <ul className={cn("flex flex-col gap-5 pl-2")}>
                {value.map((item) => (
                  <li
                    key={encodeURIComponent(item)}
                    className={cn("flex flex-col gap-1")}
                  >
                    <span className={cn("text-sm")}>{item}</span>{" "}
                    <div className={cn("flex max-w-40 justify-around")}>
                      <ParameterLevel level={1} />
                      <ParameterLevel
                        level={2}
                        status={PARAMETER_STATUS.active}
                      />
                      <ParameterLevel
                        level={3}
                        status={PARAMETER_STATUS.disable}
                      />
                      <ParameterLevel level={4} />
                      <ParameterLevel
                        level={5}
                        status={PARAMETER_STATUS.disable}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
