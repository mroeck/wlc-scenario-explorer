import { TypographyP } from "./TypographyP";
import { LINKS } from "@/lib/constants";

type DisclaimerTextProps = {
  className?: string;
};
export const DisclaimerText = ({ className }: DisclaimerTextProps) => {
  return (
    <TypographyP className={className}>
      This tool is part of a study contracted by the European Commission, DG
      GROW, on the ‘
      <a href={LINKS.study.lifeCycleGreenhouse} className="link">
        Analysis of Life-cycle Greenhouse Gas Emissions and Removals of EU
        Buildings and Construction
      </a>
      .’ The views expressed in this document and on the scenario modelling tool
      web app are the sole responsibility of the authors and do not necessarily
      reflect the views of the European Commission.
    </TypographyP>
  );
};
