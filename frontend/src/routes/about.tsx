import { Section } from "@/components/Section";
import { TypographyContent } from "@/components/TypographyContent";
import { TypographyH1 } from "@/components/TypographyH1";
import { TypographyH2 } from "@/components/TypographyH2";
import { TypographyH3 } from "@/components/TypographyH3";
import { TypographyList } from "@/components/TypographyList";
import { TypographyMuted } from "@/components/TypographyMuted";
import { TypographyP } from "@/components/TypographyP";
import {
  ABOUT_TITLE,
  DOI_URL,
  MOSELEY_EMAIL,
  ROECK_EMAIL,
  WEB_APP_URL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: () => <About />,
});

function About() {
  return (
    <main
      className={cn(
        "flex flex-col justify-stretch gap-5 py-primary-y sm:px-primary-x",
        "lg:flex-row",
      )}
    >
      <Section
        className={cn(
          "flex flex-col border-none shadow-none lg:border-gray-200 lg:shadow-md",
        )}
      >
        <TypographyH1>{ABOUT_TITLE}</TypographyH1>
        <Section className={cn("border-none shadow-none")}>
          <TypographyH2>General remarks</TypographyH2>
          <TypographyContent>
            <TypographyP>
              This report is documentation accompanying deliverable D4.2:
              User-friendly tool that enables selection, comparison, and
              analysis of the various promising combinations of carbon
              reduction/removal strategies that could be applied across building
              stocks.
            </TypographyP>
            <TypographyP>
              The tool itself is available online via:{" "}
              <a
                href={WEB_APP_URL}
                rel="noopener noreferrer"
                className={cn("link")}
              >
                {WEB_APP_URL}
              </a>
            </TypographyP>
          </TypographyContent>
          <TypographyH2>Study background</TypographyH2>
          <TypographyContent>
            <TypographyP>
              Over their whole life cycle, buildings account for around 40% of
              CO2 emissions in the EU as recent studies using bottom-up
              modelling of the building stock indicate. Reducing emissions from
              the building sector and construction ecosystem will therefore play
              a key role in achieving the targets of a climate-neutral Europe by
              2050, as set out in the European Climate Law.
              <br />
              There is a growing recognition of the need to tackle embodied
              emissions and carbon removals alongside a continued focus on
              reducing emissions from the energy used to operate buildings.
              Recent policy initiatives at the EU and national level have
              highlighted the importance of such a whole life carbon (WLC)
              emission approach.
            </TypographyP>
            <TypographyP>
              At present, however, only limited information on whole life carbon
              emissions of buildings is available in a format that allows
              in-depth comparison between countries, building types, and
              emission reduction strategies including design and policy choices.
              This is especially the case when considering the larger scale, at
              the level of national and EU building stocks.
            </TypographyP>
            <TypographyP>
              To address this, the European Commission has initiated a
              preparatory action aimed at developing a better understanding of
              WLC emissions and carbon removals of buildings and construction in
              the EU. This analysis will help establish a more accurate picture
              of the climate impact of Europe’s building stock and the
              associated construction activity. It will also aim to inform the
              design and proper implementation of effective building- and
              construction-related policies.
            </TypographyP>
            <TypographyP>
              The work in this project builds upon efforts and findings from the
              study ‘
              <a
                href="https://c.ramboll.com/whole-life-carbon-reduction?hsLang=en"
                className={cn("link")}
              >
                Supporting the development of a roadmap for the reduction of
                whole life carbon of buildings
              </a>
              ’, launched by the European Commission in 2021.
            </TypographyP>
            <TypographyP>
              The study is conducted by Ramboll Management Consulting in a
              consortium with BPIE, KU Leuven, TU Graz, Aalborg University,
              Politecnico di Milano, and IIASA. It runs from 2022 until 2025.
            </TypographyP>
          </TypographyContent>
          <TypographyH2>Study objectives</TypographyH2>
          <TypographyContent>
            <TypographyP>
              This study enables a clearer understanding of the effects and
              feasibility of applying life-cycle emissions reduction and carbon
              removal (CRR) strategies at the EU and national level.
            </TypographyP>
            <TypographyP>The objectives include to:</TypographyP>
            <TypographyList>
              <li>
                Model the whole life carbon impact of the EU building stock and
                the associated construction, renovation, and demolition activity
                on emissions and carbon removals.
              </li>
              <li>
                Assess and compare strategies for whole life carbon emissions
                reduction and removal, within the perspective of reaching
                climate neutrality and resilience by 2050.
              </li>
              <li>
                Improve the availability of data to assess the whole life carbon
                impact of the EU building stock.
              </li>
            </TypographyList>
          </TypographyContent>
          <TypographyH2>Scenario modelling tool</TypographyH2>
          <TypographyContent>
            <TypographyH3>Disclaimer</TypographyH3>
            <TypographyContent>
              <TypographyP>
                This tool is part of a study contracted by the European
                Commission, DG GROW, on the ‘
                <a
                  href="https://c.ramboll.com/life-cycle-emissions-of-eu-building-and-construction"
                  className={cn("link")}
                >
                  Analysis of Life-cycle Greenhouse Gas Emissions and Removals
                  of EU Buildings and Construction
                </a>
                .’ The views expressed in this document and on the scenario
                modelling tool web app are the sole responsibility of the
                authors and do not necessarily reflect the views of the European
                Commission.
              </TypographyP>
            </TypographyContent>
            <TypographyH3>Purpose and objectives</TypographyH3>
            <TypographyContent>
              <TypographyP>
                This scenario modelling tool is part of the ‘Modelling of future
                whole life carbon scenarios’ (Task 4). The tool is a stand-alone
                deliverable, closely linked to the ‘Modelling of future
                scenarios to address whole life carbon and carbon removals’,
                where the datasets with scenario results are generated.
              </TypographyP>
              <TypographyP>
                The objectives for developing this tool include to establish a
                user-friendly tool intended to illustrate the potential outcomes
                of predefined scenarios. Furthermore, the tool enables
                selection, comparison, and analysis of various promising
                combinations of carbon reduction and removal strategies that
                could be applied across European building stocks.
              </TypographyP>
            </TypographyContent>
            <TypographyH3>Model resources and data</TypographyH3>
            <TypographyContent>
              <TypographyP>
                The scenario results in this scenario modelling tool are
                generated using a custom modelling pipeline combining building
                archetype data from the SLiCE<sup>1</sup> model with upscaling
                and scenario analyses based on the PULSE<sup>2</sup> model. The
                collection of scenario results data will be separately
                published.
              </TypographyP>
            </TypographyContent>
            <TypographyMuted>
              <TypographyP>
                <sup>1</sup> Röck M, Passer A, and Allacker K. “SLiCE: An Open
                Building Data Model for Scalable High-Definition Life Cycle
                Engineering, Environmental Hotspot Analysis and Dynamic Impact
                Assessment.” Sustainable Production and Consumption, 2024.
                <br />
                <a href={DOI_URL} className={cn("link")}>
                  {DOI_URL}
                </a>
              </TypographyP>

              <TypographyP>
                <sup>2</sup> Alaux N, Schwark B, Hörmann M, Ruschi Mendes Saade
                M, and Passer A. “Assessing the Prospective Environmental
                Impacts and Circularity Potentials of Building 3 Stocks: An
                Open-Source Model from Austria (PULSE-AT).” (Forthcoming), 2024.
              </TypographyP>
            </TypographyMuted>
            <TypographyH3> Contact details</TypographyH3>
            <TypographyContent>
              <TypographyP>
                We encourage users to get in touch with feedback and/or
                questions on both the study and the tool:
              </TypographyP>
              <TypographyList>
                <li>
                  Tool Development Lead, KU Leuven: Martin Röck (
                  <a href={`mailto:${ROECK_EMAIL}`} className={cn("link")}>
                    {ROECK_EMAIL}
                  </a>
                  )
                </li>
                <li>
                  European Commission, DG GROW: Philippe Moseley (
                  <a href={`mailto:${MOSELEY_EMAIL}`} className={cn("link")}>
                    {MOSELEY_EMAIL}
                  </a>
                  )
                </li>
              </TypographyList>
              <TypographyP>
                An extended list of consortium members and contact details is
                available via the{" "}
                <a
                  href="https://c.ramboll.com/life-cycle-emissions-of-eu-building-and-construction"
                  className={cn("link")}
                >
                  project website
                </a>{" "}
                .
              </TypographyP>
            </TypographyContent>
            <TypographyH3> License and citation</TypographyH3>
            <TypographyContent>
              <TypographyP>
                This tool has been developed as part of{" "}
                <a
                  href="https://etendering.ted.europa.eu/cft/cft-display.html?cftId=10989"
                  className={cn("link")}
                >
                  GROW/2022/OP/0005
                </a>
                . Courtesy of the European Union, DG GROW. Development authored
                by Martin Röck, Shadwa Eissa, Benjamin Lesné, and Karen
                Allacker.
              </TypographyP>

              <TypographyP>
                Licensed under a Creative Commons Attribution-ShareAlike 4.0 (
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/"
                  className={cn("link")}
                >
                  CC BY-SA 4.0
                </a>
                ) International License. When using or improving this tool or
                parts of it, consider giving appropriate credit. Cite as:
              </TypographyP>

              <TypographyP>
                Röck M, Eissa S, Lesné B, and Allacker K. “Scenario Modelling
                Tool - Analysis of Life-cycle Greenhouse Gas Emissions and
                Removals of EU Buildings and Construction” European Commission
                DG GROW, 2024. DOI:{" "}
                <a href={DOI_URL} className={cn("link")}>
                  {DOI_URL}
                </a>
                . Web-app available online via:{" "}
                <a href={WEB_APP_URL} className={cn("link")}>
                  {WEB_APP_URL}
                </a>
              </TypographyP>
            </TypographyContent>
          </TypographyContent>
        </Section>
      </Section>
    </main>
  );
}
