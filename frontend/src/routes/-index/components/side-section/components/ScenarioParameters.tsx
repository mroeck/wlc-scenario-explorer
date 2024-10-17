import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SCENARIO_PARAMETERS_OBJ } from "@/lib/shared_with_backend/constants";
import { ParameterLevel } from "./ParameterLevel";
import { HELP_PAGE_IDS, PARAMETER_STATUS, ROUTES } from "@/lib/constants";
import { InfoButton } from "@/components/InfoButton";
import { Link } from "@tanstack/react-router";
import { LinkIcon } from "lucide-react";

export const ScenarioParameters = () => {
  return (
    <Accordion type="single" collapsible className="pl-2">
      {Object.entries(SCENARIO_PARAMETERS_OBJ).map(([key, value], index) => {
        return (
          <AccordionItem
            key={key + index.toString()}
            value={key + index.toString()}
          >
            <div className="flex justify-between gap-2">
              <div className="flex-1">
                <AccordionTrigger className="text-sm capitalize">
                  {key}
                </AccordionTrigger>
              </div>
              <div className="flex items-center justify-center">
                <ParameterLevel
                  level={undefined}
                  status="active"
                  editable
                  className="h-6 w-7 rounded-sm"
                />
              </div>
            </div>
            <AccordionContent>
              <ul className="flex flex-col gap-5 pl-2">
                {value.map((item) => (
                  <li
                    key={encodeURIComponent(item)}
                    className="flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="min-w-max text-sm">{item}:</span>
                      <InfoButton>
                        <p>[in progress]</p>
                        <Link
                          to={ROUTES.HELP}
                          hash={HELP_PAGE_IDS.scenarioParametersCustomization}
                          className="flex items-center gap-1 underline"
                        >
                          <LinkIcon className="size-3" /> Read more here
                        </Link>
                      </InfoButton>
                    </div>
                    <div className="flex max-w-40 justify-around gap-2">
                      <ParameterLevel level={1.0} />
                      <ParameterLevel
                        level={1.5}
                        status={PARAMETER_STATUS.active}
                      />
                      <ParameterLevel
                        level={2.0}
                        status={PARAMETER_STATUS.disable}
                      />
                      <ParameterLevel
                        level={2.5}
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
