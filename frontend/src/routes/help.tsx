import { Section } from "@/components/Section";
import { TypographyH1 } from "@/components/TypographyH1";
import { TypographyH2 } from "@/components/TypographyH2";
import { TypographyH3 } from "@/components/TypographyH3";
import { TypographyList } from "@/components/TypographyList";
import { TypographyMuted } from "@/components/TypographyMuted";
import { TypographyP } from "@/components/TypographyP";
import { createFileRoute } from "@tanstack/react-router";
import lineChartShowingColorAndTooltipUrl from "@/assets/dataViz/line_chart_evolution_gwp_total_new_residential_buildings_by_country.png";
import tableWithFilteredEmbodiedCaronUrl from "@/assets/dataViz/table_with_filtered_embodied_carbon_data_of_new_buildings_per_country_ready_for_download.png";

import stackedBarChartForEmbodiedCarbonUrl from "@/assets/dataViz/stacked_bar_chart_showing_filtered_results_for_embodied_carbon_by_building_element_class.png";
import { TypographyFigure } from "@/components/TypographyFigure";
import {
  HELP_PAGE_IDS,
  HELP_TITLE,
  LINKS,
  MOSELEY_EMAIL,
  ROECK_EMAIL,
} from "@/lib/constants";
import { TypographyContent } from "@/components/TypographyContent";
import { SectionForDoc } from "@/components/SectionForDoc";
import { TableOfContents, type ToCSection } from "@/components/TableOfContents";
import { TypographyH4 } from "@/components/TypographyH4";
import { cn } from "@/lib/utils";
import dashboardStructureUrl from "@/assets/dashboard-structure.png";

export const Route = createFileRoute("/help")({
  component: () => <Help />,
});

type Ids = (typeof HELP_PAGE_IDS)[keyof typeof HELP_PAGE_IDS];

const sections = [
  {
    id: HELP_PAGE_IDS.introduction,
    title: "Introduction",
    subsections: [
      {
        id: HELP_PAGE_IDS.generalRemarks,
        title: "General remarks",
      },
      {
        id: HELP_PAGE_IDS.studyBackground,
        title: "Study background",
      },
      {
        id: HELP_PAGE_IDS.studyObjectives,
        title: "Study objectives",
      },
      {
        id: HELP_PAGE_IDS.scenarioModellingTool,
        title: "Scenario modelling tool",
      },
    ],
  },

  {
    id: HELP_PAGE_IDS.userInterface,
    title: "User interface",
  },
  {
    id: "scenario",
    title: "Scenarios",
    subsections: [
      {
        id: HELP_PAGE_IDS.predefinedScenarioSelection,
        title: "Predefined scenarios",
      },
      {
        id: HELP_PAGE_IDS.scenarioParametersCustomization,
        title: "Customise scenario parameters",
      },
    ],
  },
  {
    id: HELP_PAGE_IDS.filterSetting,
    title: "Filters",
  },
  {
    id: HELP_PAGE_IDS.visualization,
    title: "Visualization",
    subsections: [
      { id: HELP_PAGE_IDS.visualizationTypes, title: "Types" },
      { id: HELP_PAGE_IDS.visualizationSettings, title: "Settings" },
    ],
  },
  {
    id: HELP_PAGE_IDS.output,
    title: "Output",
  },

  {
    id: HELP_PAGE_IDS.faq,
    title: "F.A.Q.",
  },
] satisfies ToCSection<Ids>[];

function Help() {
  return (
    <main className="flex flex-col justify-stretch gap-5 py-primary-y sm:px-primary-x lg:flex-row">
      <aside>
        {Array.from({ length: 2 }, (_, index) => (
          <Section
            key={index}
            className={cn(
              "static flex flex-col px-0 lg:fixed lg:h-[calc(100dvh-72px-24px-24px)] lg:w-80",
              index === 1 && "invisible hidden lg:static lg:flex",
            )}
          >
            <TableOfContents sections={sections} />
          </Section>
        ))}
      </aside>
      <Section noPadding className="flex flex-col">
        <TypographyH1 className="sr-only"> {HELP_TITLE} </TypographyH1>
        <SectionForDoc className="!pt-0">
          <SectionForDoc className="pt-0" id={HELP_PAGE_IDS.introduction}>
            <TypographyH2>Introduction</TypographyH2>
            <SectionForDoc id={HELP_PAGE_IDS.generalRemarks}>
              <TypographyH3>General remarks</TypographyH3>
              <TypographyContent>
                <TypographyP>
                  This report is documentation accompanying deliverable D4.2:
                  User-friendly tool that enables selection, comparison and
                  analysis of the various promising combinations of carbon
                  reduction/removal strategies that could be applied across
                  building stocks.
                </TypographyP>
                <TypographyP>
                  The tool itself is available online via:{" "}
                  <a href={LINKS.explorerWebsite} className="link">
                    {LINKS.explorerWebsite}
                  </a>
                </TypographyP>
              </TypographyContent>
            </SectionForDoc>

            <SectionForDoc id={HELP_PAGE_IDS.studyBackground}>
              <TypographyH3>Study background</TypographyH3>
              <TypographyContent>
                <TypographyP>
                  Over their whole life cycle, buildings account for around 40%
                  of CO2 emissions in the EU as recent studies using bottom-up
                  modelling of the building stock indicate. Reducing emissions
                  from the building sector and construction ecosystem will
                  therefore play a key role for achieving the targets of a
                  climate neutral Europe by 2050, as set out in the European
                  Climate Law.
                </TypographyP>
                <TypographyP>
                  There is a growing recognition of the need to tackle embodied
                  emissions and carbon removals alongside a continued focus on
                  reducing emissions from the energy used to operate buildings.
                  Recent policy initiatives on the EU and national level have
                  highlighted the importance of such a whole life carbon (WLC)
                  emission approach.
                </TypographyP>
                <TypographyP>
                  At present, however, only limited information on whole life
                  carbon emissions of buildings is available in a format that
                  allows in-depth comparison between countries, building types,
                  and emission reduction strategies including design and policy
                  choices. This is especially the case when considering the
                  larger scale, at the level of national and EU building stocks.
                </TypographyP>
                <TypographyP>
                  To address this, the European Commission has initiated a
                  preparatory action aimed at developing a better understanding
                  of WLC emissions and carbon removals of buildings and
                  construction in the EU. This analysis will help establish a
                  more accurate picture of the climate impact of Europe’s
                  building stock and the associated construction activity. It
                  will also aim to inform the design and proper implementation
                  of effective building- and construction-related policies.
                </TypographyP>
                <TypographyP>
                  The work in this project builds upon efforts and findings from
                  the study ‘
                  <a
                    href="https://c.ramboll.com/whole-life-carbon-reduction?hsLang=en"
                    className="link"
                  >
                    Supporting the development of a roadmap for the reduction of
                    whole life carbon of buildings
                  </a>
                  ’, launched by the European Commission in 2021.
                </TypographyP>
                <TypographyP>
                  The study is conducted by Ramboll Management Consulting in a
                  consortium with BPIE, KU Leuven, TU Graz, Aalborg University,
                  Politecnico di Milano, and IIASA. It runs from 2022 until
                  2025.
                </TypographyP>
              </TypographyContent>
            </SectionForDoc>
            <SectionForDoc id={HELP_PAGE_IDS.studyObjectives}>
              <TypographyH3>Study objectives</TypographyH3>
              <TypographyContent>
                <TypographyP>
                  This study enables a clearer understanding of the effects and
                  feasibility of applying life-cycle emissions reduction and
                  carbon removal (CRR) strategies at the EU and national level.
                </TypographyP>
                <TypographyP>The objectives include to:</TypographyP>
                <TypographyList>
                  <li>
                    Model the whole life carbon impact of the EU building stock
                    and the associated construction, renovation and demolition
                    activity on emissions and carbon removals.
                  </li>
                  <li>
                    Assess and compare strategies for whole life carbon
                    emissions reduction and removal, within the perspective of
                    reaching climate neutrality and resilience by 2050.
                  </li>
                  <li>
                    Improve the availability of data to assess the whole life
                    carbon impact of the EU building stock.
                  </li>
                </TypographyList>
              </TypographyContent>
            </SectionForDoc>

            <SectionForDoc id={HELP_PAGE_IDS.scenarioModellingTool}>
              <TypographyH3>Scenario modelling tool</TypographyH3>
              <SectionForDoc>
                <TypographyH4>Disclaimer</TypographyH4>
                <TypographyContent>
                  <TypographyP>
                    This tool is part of a study contracted by the European
                    Commission, DG GROW, on the ‘Analysis of Life-cycle
                    Greenhouse Gas Emissions and Removals of EU Buildings and
                    Construction.’ The views expressed in this document and on
                    the scenario modelling tool web app are the sole
                    responsibility of the authors and do not necessarily reflect
                    the views of the European Commission.
                  </TypographyP>
                </TypographyContent>
              </SectionForDoc>
              <SectionForDoc>
                <TypographyH4>Purpose and objectives</TypographyH4>
                <TypographyContent>
                  <TypographyP>
                    This scenario modelling tool is part of the ‘Modelling of
                    future whole life carbon scenarios’ (Task 4). The tool is a
                    stand-alone deliverable, closely linked to the ‘Modelling of
                    future scenarios to address whole life carbon and carbon
                    removals’, where the datasets with scenario results are
                    generated.{" "}
                  </TypographyP>
                  <TypographyP>
                    The objectives for developing this tool include to establish
                    a user-friendly tool intended to illustrate the potential
                    outcomes of predefined scenarios. Furthermore, the tool
                    enables selection, comparison and analysis of various
                    promising combinations of carbon reduction and removal
                    strategies that could be applied across European building
                    stocks.
                  </TypographyP>
                </TypographyContent>
              </SectionForDoc>

              <SectionForDoc>
                <TypographyH4>Model resources and data</TypographyH4>
                <TypographyContent>
                  <TypographyP>
                    The scenario results in this scenario modelling tool are
                    generated using a custom modelling pipeline combining
                    building archetype data from the SLiCE1 model with upscaling
                    and scenario analyses based on the PULSE2 model. The
                    collection of scenario results data [will be] separately
                    published.
                  </TypographyP>
                </TypographyContent>
              </SectionForDoc>
              <SectionForDoc>
                <TypographyH4>Contact details</TypographyH4>
                <TypographyContent>
                  <TypographyP>
                    We encourage users to get in touch with feedback and/or
                    questions on both the study and the tool:
                  </TypographyP>

                  <TypographyList>
                    <li>
                      Tool Development Lead, KU Leuven: Martin Röck (
                      <a href={`mailto:${ROECK_EMAIL}`} className="link">
                        martin.roeck@kuleuven.be{" "}
                      </a>
                      )
                    </li>
                    <li>
                      European Commission, DG GROW: Philippe Moseley (
                      <a href={`mailto:${MOSELEY_EMAIL}`} className="link">
                        philippe.moseley@ec.europa.eu{" "}
                      </a>
                      )
                    </li>
                  </TypographyList>
                  <TypographyP>
                    An extended list of consortium members and contact details
                    is available via{" "}
                    <a
                      href="https://c.ramboll.com/life-cycle-emissions-of-eu-building-and-construction"
                      className="link"
                    >
                      the project website.
                    </a>
                  </TypographyP>
                </TypographyContent>
              </SectionForDoc>
            </SectionForDoc>
          </SectionForDoc>
          <SectionForDoc id={HELP_PAGE_IDS.userInterface}>
            <TypographyH2>User Interface</TypographyH2>
            <SectionForDoc>
              <TypographyH3>Main page: Dashboard </TypographyH3>
              <TypographyContent>
                <TypographyP>
                  This is the main page of the scenario explorer tool web
                  application. As illustrated in Figure 1, it consists of two
                  main sections: The side panel and the data visualization
                  section. Each of these sections provides graphical user
                  interfaces for defining distinct settings. These settings and
                  functionalities are outlined in the following and elaborated
                  in subsequent sections of this report:
                </TypographyP>
                <TypographyP>
                  <span className="font-bold">1. Side Panel</span>:
                </TypographyP>
                <TypographyList>
                  <li>
                    <span className="font-bold">a</span>. Scenario settings –
                    Define which scenario result are loaded to the tool
                  </li>
                  <li>
                    <span className="font-bold">b</span>. Filter settings –
                    Define which data is shown out of the selected scenario
                    results
                  </li>
                </TypographyList>

                <TypographyP>
                  <span className="font-bold">2. Data Visualization</span>:
                </TypographyP>
                <TypographyList>
                  <li>
                    <span className="font-bold">a</span>. Visualization types –
                    Define which type of chart or table to use for visualization
                  </li>
                  <li>
                    <span className="font-bold">b</span>. Visualization settings
                    – Define how data is shown for selected scenario and filters
                  </li>

                  <li>
                    <span className="font-bold">c</span>. Output section – Area
                    which show the data as defined via different charts or as a
                    data table
                  </li>
                </TypographyList>
                <div className="py-2"></div>
                <TypographyFigure
                  url={dashboardStructureUrl}
                  caption="Figure 1: Dashboard page overview, indicating elements in side panel (1) and data visualization (2)"
                />
              </TypographyContent>
            </SectionForDoc>
            <SectionForDoc>
              <TypographyH3>Other pages: Help, About </TypographyH3>
              <TypographyContent>
                <TypographyP>
                  The ‘Help’ and ‘About’ pages offer supplementary information
                  for users of the tool. The ‘Help’ page offers information to
                  help users understand how to use the tool. That section
                  largely mirrors the description and documentation provided on
                  the following pages. The ‘About’ page offers information on
                  the project context and related research outcomes. That
                  section mirrors the description offered in the corresponding
                  section of this report.
                </TypographyP>
              </TypographyContent>
            </SectionForDoc>
          </SectionForDoc>

          <SectionForDoc id={HELP_PAGE_IDS.scenario}>
            <TypographyH2>Scenarios</TypographyH2>

            <SectionForDoc id={HELP_PAGE_IDS.predefinedScenarioSelection}>
              <TypographyH3>Predefined scenarios</TypographyH3>
              <TypographyContent>
                <TypographyP>
                  Users can select predefined scenarios from the dropdown menu
                  to investigate the results of one scenario (scenario A) or
                  compare results of two scenarios side by side (scenario A and
                  scenario B).
                </TypographyP>

                <TypographyP>
                  The scenarios available for selection from the dropdown menu
                  are the pre-defined scenarios as specified with the client.
                  The scenarios represent aspirational scenarios, modelled to
                  represent a certain policy ambition (current policies (CPOL),
                  or additional policies (APOL)), as well as explorative
                  scenarios, modelled to better understand the GHG emission
                  potential of implementing different types of carbon reduction
                  and removal (CRR) strategies.
                </TypographyP>

                <TypographyP>
                  The CRR strategies have been categorized into strategies
                  focused on action aimed to:
                </TypographyP>

                <TypographyList>
                  <li>
                    <strong>Improve (I)</strong> supply-side processes for
                    conventional materials and energy sources.
                  </li>
                  <li>
                    <strong>Shift (S)</strong> to alternative low-carbon,
                    renewable, and bio-based solutions.
                  </li>
                  <li>
                    <strong>Avoid (A)</strong> material and energy demand, e.g.,
                    via circularity or sufficiency measures.
                  </li>
                </TypographyList>

                <TypographyP>
                  The implementation of the CRR strategies related to these
                  ‘ASI’ measures are modelled based on the scope, impact, and
                  diffusion potential identified from scientific literature and
                  expert consultation as established via the collection of
                  available data and information on whole life cycle GHG
                  emissions and carbon removals (Task 1).
                </TypographyP>

                <TypographyP>
                  Users can choose from the following pre-defined scenarios and
                  related narratives:
                </TypographyP>

                <TypographyList>
                  <li>
                    <strong>CPOL/A:</strong> Optimistic current policy scenario.
                    Assuming current policies are fully delivering, and policy
                    targets are being met as planned.
                  </li>
                  <li>
                    <strong>CPOL/B:</strong> Conservative current policy
                    scenario. Implementation of current policies but assuming
                    transposition and implementation may encounter
                    socio/technical challenges.
                  </li>
                  <li>
                    <strong>APOL:</strong> Additional policy scenario. Based on
                    the latest EU policy ambition outlined in the CLIMA 2040
                    target study<sup>3</sup>, aiming for 90% reduction of GHG
                    emissions in scope by 2040.
                  </li>
                  <li>
                    <strong>CPOL+I:</strong> Supply-side improvement of
                    conventional solutions. Implementation of CPOL and full
                    focus on ‘improving’ the conventional construction materials
                    and energy use.
                  </li>
                  <li>
                    <strong>CPOL+S:</strong> Demand-side shift to alternative
                    solutions. CPOL plus focus on demand shift towards
                    alternative low carbon, bio-based construction materials and
                    renewable energy.
                  </li>
                  <li>
                    <strong>CPOL+A:</strong> Demand reduction and lifestyle
                    changes. CPOL plus reducing need for materials and energy
                    via focus on circularity and sufficiency-measures, lifestyle
                    changes.
                  </li>
                  <li>
                    <strong>CPOL+ASI:</strong> Supply & demand side action, all
                    CRR strategies. CPOL + advanced supply side action
                    (improve), demand side shifts (shift), and lifestyle changes
                    (avoid).
                  </li>
                </TypographyList>

                <TypographyMuted>
                  <sup>3</sup> Securing our future Europe&apos;s 2040 climate
                  target and path to climate neutrality by 2050 building a
                  sustainable, just and prosperous society (COM/2024/63 final).
                  Available online:
                  https://climate.ec.europa.eu/eu-action/climate-strategies-targets/2040-climate-target_en
                  (Last accessed 13/08/2024)
                </TypographyMuted>

                <TypographyP>
                  Further details on the results for these scenarios [will be]
                  available in the report with quantitative figures for future
                  scenarios addressing whole life carbon and carbon removals
                  (Task 4).
                </TypographyP>
              </TypographyContent>
            </SectionForDoc>

            <SectionForDoc id={HELP_PAGE_IDS.scenarioParametersCustomization}>
              <TypographyH3>Customise scenario parameters</TypographyH3>
              <TypographyContent>
                <TypographyP>
                  Beyond the pre-defined scenarios available from the dropdown
                  menu, users can explore various additional scenarios. These
                  [are being] modelled in a generative way, based on the
                  combination of different settings for the scenario parameters,
                  assuming different ambition levels for the uptake of
                  individual CRR strategies across Member States.
                </TypographyP>

                <TypographyP>
                  Implementation of the following strategies for carbon
                  reduction and removal can be modified:
                </TypographyP>

                <SectionForDoc>
                  <TypographyH4>Improve</TypographyH4>
                  <TypographyContent>
                    <TypographyList>
                      <li>
                        <strong>Increase low carbon conventional:</strong> This
                        strategy focuses on the embodied emissions from
                        conventional construction materials, which contribute to
                        a significant share of the building sectors’ total
                        carbon footprint. By introducing substitute materials
                        and improving manufacturing processes, this strategy
                        seeks to lower the impacts associated with commonly used
                        construction materials like concrete, steel, and
                        aluminium.
                      </li>
                      <li>
                        <strong>Reduce transport emissions:</strong> This
                        strategy focuses on curbing embodied emissions by
                        improving the transportation logistics associated with
                        construction materials. This entails, amongst others,
                        reducing the distance materials travel to construction
                        sites by favouring local sourcing and employing
                        low-carbon transportation alternatives.
                      </li>
                      <li>
                        <strong>Reduce construction process:</strong> This
                        strategy addresses construction machinery and equipment
                        used on site, the main contributors to emissions in the
                        construction phase. Currently, construction machines
                        generally run on fossil fuels, usually diesel.
                        Implementing fuel switching, using more efficient
                        machines and optimising site logistics to reduce machine
                        idling and fuel consumption can help mitigate emissions
                        from construction sites.
                      </li>
                      <li>
                        <strong>Reduce operational energy:</strong> This
                        strategy aims at improving the energy efficiency of
                        buildings during their operational phase as an essential
                        element of reducing the WLC emissions from the EU
                        building stock. This strategy includes seven renovation
                        measures contributing to reducing operational carbon
                        emissions, organised per type of energy saving that is
                        achieved. The strategy is also linked to the uptake of
                        energy efficient options for new buildings.
                      </li>
                    </TypographyList>
                  </TypographyContent>
                </SectionForDoc>

                <SectionForDoc>
                  <TypographyH4>Shift</TypographyH4>
                  <TypographyContent>
                    <TypographyList>
                      <li>
                        <strong>Increase bio-based solutions:</strong> This
                        strategy focuses on replacing conventional construction
                        materials with bio-based alternatives, such as those
                        derived from agricultural plants and trees. These
                        materials have a lower embodied carbon footprint due to
                        their natural growth processes and offer carbon
                        sequestration capabilities, leading to potential carbon
                        removals.
                      </li>
                      <li>
                        <strong>Increase circularity and reuse:</strong> This
                        strategy aims to mitigate emissions by emphasising the
                        reuse, recycling, and repurposing of construction
                        materials, components, and products. In this way, the
                        lifespan of entire building elements can be extended and
                        the degree of recycled content in construction product
                        increasing, leading to lower demand new
                        resource-intensive materials reduced. By embracing
                        circular material flows, these efforts contribute to
                        embodied emissions reductions by minimizing impacts of
                        material production and disposal.
                      </li>
                      <li>
                        <strong>Increase carbon dioxide removal:</strong> This
                        strategy relates to using additional carbon dioxide
                        removals (CDR) solutions not yet in scope of other
                        strategies. It involves implementing technologies and
                        practices that actively capture and durably storing
                        atmospheric CO2 and contributing to negative emissions.
                        Focus is on CDR solutions applied in scope of the
                        building as such and not its surroundings (the wider
                        built environment).
                      </li>
                    </TypographyList>
                  </TypographyContent>
                </SectionForDoc>

                <SectionForDoc>
                  <TypographyH4>Avoid</TypographyH4>
                  <TypographyContent>
                    <TypographyList>
                      <li>
                        <strong>Reduce space per capita:</strong> This strategy
                        focuses on improving sufficient use of buildings by
                        decreasing average individual space demand. The number
                        of users and the floor space per user determines the
                        amount of built area that is required. If the overall
                        area that is occupied per user can be reduced, the
                        demand for new construction also decreases.
                      </li>
                      <li>
                        <strong>Increase repair and retrofit:</strong> This
                        strategy emphasises the preservation and enhancement of
                        existing structures and spaces. This approach seeks to
                        reduce emissions by avoiding the use of new materials,
                        while also retaining cultural and historical value of
                        existing buildings.
                      </li>
                      <li>
                        <strong>Increase material efficiency:</strong> This
                        strategy considers emissions savings from optimizing the
                        use of construction materials. This involves lightweight
                        construction methods and prefabrication and modular
                        construction. By implementing efficient material
                        practices, this strategy aims to mitigate emissions
                        associated with resource extraction, manufacturing,
                        transportation and construction, i.e. embodied
                        emissions.
                      </li>
                      <li>
                        <strong>Reduce construction waste:</strong> This
                        strategy focuses on reducing emissions by minimising
                        construction and demolition waste (CDW). By preventing
                        the generation of waste, this strategy promotes resource
                        conservation and contributes to emissions savings by
                        reducing the need for the production and disposal of
                        construction materials.
                      </li>
                    </TypographyList>
                  </TypographyContent>
                </SectionForDoc>
                <SectionForDoc>
                  <TypographyP>
                    Five distinct ambition levels can be selected for adjusting
                    the implementation of the CRR strategies – as illustrated in
                    Figure 1. Setpoint ‘3’ represents the baseline, and
                    setpoints ‘1-2’ and ‘4-5’ represent lower and higher levels
                    of a strategies future market diffusion, respectively.
                  </TypographyP>

                  <div className="py-5"></div>

                  <TypographyH4>
                    Ambition level setpoints (numbers 1-5) for CRR strategy
                    implementation are modelled as follows:
                  </TypographyH4>
                  <TypographyContent>
                    <TypographyList>
                      <li>
                        <strong>
                          No increased uptake, assuming continuation of past
                          trends:
                        </strong>
                        Scaling factor 0,0x. Modelled with reduction potentials
                        as in baseline implementation but scaling the diffusion
                        across Member States by factor 0,0.
                      </li>
                      <li>
                        <strong>
                          Reduced diffusion rate of the strategy compared to
                          baseline:
                        </strong>
                        Scaling factor 0,5x. Modelled with reduction potentials
                        as in baseline implementation but scaling the diffusion
                        across Member States by factor 0,5.
                      </li>
                      <li>
                        <strong>
                          Baseline modelling of carbon reduction and removal
                          strategy:
                        </strong>
                        Scaling factor 1,0x. Modelled with reduction and
                        diffusion potentials established via the collection of
                        available data and information on whole life cycle GHG
                        emissions and carbon removals (Task 1).
                      </li>
                      <li>
                        <strong>
                          Increased diffusion rate of the strategy compared to
                          baseline:
                        </strong>
                        Scaling factor 1,5x. Modelled with reduction potentials
                        as in baseline implementation but scaling the diffusion
                        across Member States by factor 1,5.
                      </li>
                      <li>
                        <strong>
                          Doubling diffusion rate of the strategy compared to
                          baseline:
                        </strong>
                        Scaling factor 2,0x. Modelled with reduction potentials
                        as in baseline implementation but scaling the diffusion
                        across Member States by factor 2,0.
                      </li>
                    </TypographyList>
                  </TypographyContent>
                </SectionForDoc>
                <TypographyP>
                  Users can specify the ambition level for an individual
                  strategy by selecting an available option from via the number
                  buttons. Ambition levels can also be defined at once for the
                  whole set of strategies (Improve/Shift/Avoid) by specifying
                  the desired number right next to the section heading.
                </TypographyP>
              </TypographyContent>
            </SectionForDoc>
          </SectionForDoc>
        </SectionForDoc>
        <SectionForDoc id={HELP_PAGE_IDS.filterSetting}>
          <TypographyH2>Filters</TypographyH2>

          <SectionForDoc>
            <TypographyH3>Year</TypographyH3>
            <TypographyContent>
              <TypographyP>
                Users can select the time range to be shown in the
                visualizations by specifying both the start and end point of the
                timeseries (From-To). Scenario results are always presented in
                5-year steps. The values shown are a snapshot of the results in
                that respective year.
              </TypographyP>
            </TypographyContent>
          </SectionForDoc>

          <SectionForDoc>
            <TypographyH3>Region</TypographyH3>
            <TypographyContent>
              <TypographyP>
                All results are grouped according to four different climatic
                regions as defined in the recast of the EU’s Energy Performance
                of Buildings Directive (EPBD): Continental, Mediterranean,
                Nordic, and Oceanic.
              </TypographyP>
            </TypographyContent>
          </SectionForDoc>

          <SectionForDoc>
            <TypographyH3>Country</TypographyH3>
            <TypographyContent>
              <TypographyP>
                Detailed results are available at the resolution of individual
                countries for the EU27 Member States. Users can select to
                include one or more of the EU27 countries, listed below,
                illustrated in Figure 2.
              </TypographyP>
              <TypographyList>
                <li>
                  <strong>Continental region:</strong> Austria (AT), Bulgaria
                  (BG), Czechia (CZ), Hungary (HU), Poland (PL), Romania (RO),
                  Slovenia (SI), and Slovakia (SK)
                </li>
                <li>
                  <strong>Mediterranean region:</strong> Cyprus (CY), Croatia
                  (HR), Italy (IT), Greece (GR), Malta (MT), Spain (SP), and
                  Portugal (PT)
                </li>
                <li>
                  <strong>Nordic region:</strong> Estonia (EW), Finland (FI),
                  Latvia (LV), Lithuania (LT), and Sweden (SE)
                </li>
                <li>
                  <strong>Oceanic region:</strong> Belgium (BE), Denmark (DK),
                  Ireland (IE), Germany (DE), France (FR), Luxembourg (LU), and
                  Netherlands (NL)
                </li>
              </TypographyList>
              <div className="py-2"></div>
              <div className="flex justify-center">
                <TypographyFigure
                  url={stackedBarChartForEmbodiedCarbonUrl}
                  caption="Figure 2: Stacked Bar Graph showing filtered results for embodied carbon by building element class."
                />
              </div>
              <TypographyP>
                Note: Users should pay attention that the filter settings chosen
                for region and country are not mutually exclusive. For example,
                if selecting a filter by region ‘Continental’ and then filtering
                to only include Spain (‘SP) and Portugal (‘PT’), no data will be
                shown until the filter by region is reset.
              </TypographyP>
            </TypographyContent>
          </SectionForDoc>

          <SectionForDoc>
            <TypographyH3>Building Type</TypographyH3>
            <TypographyContent>
              <TypographyP>
                As a main distinction of building types, users can select to
                show one or both of ‘Residential’ and ‘Commercial’ buildings.
              </TypographyP>
              <TypographyMuted>
                [The ‘Example Scenario’ uses different data from preliminary
                model runs for illustration purposes. It instead shows
                ‘Residential’ and ‘Non-residential’.]
              </TypographyMuted>
            </TypographyContent>
          </SectionForDoc>

          <SectionForDoc>
            <TypographyH3>Building Subtype</TypographyH3>
            <TypographyContent>
              <TypographyP>
                Within the two main building types (residential, commercial),
                scenario results are available for a total of nine building
                subtypes. Within residential buildings, three subtypes available
                for user selection: Single family houses (SFH), Multifamily
                houses (MFH), Apartment blocks (APP). Within commercial
                buildings, six more subtypes are included: Offices (OFF), Trade
                (TRA), Education (EDU), Health (HEA), Hotels and Restaurants
                (HOR), Other service buildings (OSB).
              </TypographyP>
              <TypographyMuted>
                [The ‘Example Scenario’ uses different data from preliminary
                model runs for illustration purposes. It instead only shows
                three building subtypes: SFH, MFH, OFF.]
              </TypographyMuted>
            </TypographyContent>
          </SectionForDoc>

          <SectionForDoc>
            <TypographyH3>Element Class</TypographyH3>
            <TypographyContent>
              <TypographyP>
                Users can select to filter results by building element class.
                The classes available for selection are: External walls,
                Internal walls, Common walls, Storey floors, Roofs,
                Substructure, External openings (e.g., windows), Internal
                openings (e.g., doors), Staircases, Electrical services,
                Technical services.
              </TypographyP>
            </TypographyContent>
          </SectionForDoc>

          <SectionForDoc>
            <TypographyH3>Material Class</TypographyH3>
            <TypographyContent>
              <TypographyP>
                Various materials have been included in the modelling underlying
                this scenario tool. Users can select to adjust the results along
                the following material classes: Aluminium, Brick, Ceramics,
                Cleaning, Concrete, Copper, Electronics, Energy, Glass, Gypsum,
                Insulation, Other Construction Materials, Other Metals, Paint
                and Glue, Plastic, Process, Sand, Steel, Wood.
              </TypographyP>
              <TypographyP>
                To present complete results when selecting this attribute for
                contribution analysis (‘breakdown by’), the material class
                includes ‘Energy’. This value can be excluded via the filter
                settings to only show the material-related results. Furthermore,
                material classes are included for ‘Cleaning’ and ‘Process’,
                which represent embodied impacts related to the cleaning of
                surfaces during the use phase and the processing of materials
                before or after use, respectively. The category can be
                deselected, if desired.
              </TypographyP>
            </TypographyContent>
          </SectionForDoc>

          <SectionForDoc>
            <TypographyH3>Building Stock Activity</TypographyH3>
            <TypographyContent>
              <TypographyP>
                Users can select to filter results by building stock activities,
                corresponding to the type of building archetypes modelled.
                Selection is available for: Existing buildings, New buildings,
                Refurbishment.
              </TypographyP>
            </TypographyContent>
          </SectionForDoc>

          <SectionForDoc>
            <TypographyH3>Life cycle stages</TypographyH3>
            <TypographyContent>
              <TypographyP>
                Users can further distinguish results by the corresponding whole
                life cycle stages: Construction embodied carbon, Demolition
                embodied carbon, Renovation embodied carbon, Use phase embodied
                carbon, and Use phase operational carbon. See an embodied carbon
                filtered example in Figure 2.
              </TypographyP>
            </TypographyContent>
          </SectionForDoc>
        </SectionForDoc>
        <SectionForDoc id={HELP_PAGE_IDS.visualization}>
          <TypographyH2>Visualization</TypographyH2>

          <SectionForDoc id={HELP_PAGE_IDS.visualizationTypes}>
            <TypographyH3>Types</TypographyH3>
            <TypographyContent>
              <TypographyP>
                At the very top of the visualization settings, users can select
                the type of chart or table through which the results should be
                presented. Users can show results via Stacked Area Graph, Line
                Graph, Stacked Bar Graph, or Table – see examples in Figure 1,
                Figure 2, Figure 3, and Figure 4.
              </TypographyP>
            </TypographyContent>
            <SectionForDoc>
              <TypographyH4>Stacked Area Graph</TypographyH4>
              <TypographyContent>
                <TypographyP>
                  Best for visualizing how selected categories evolve over time.
                  Presents the results as colored bands stacked on top of each
                  other. Each band indicates the results for the respective
                  subcategories. While the top boundary shows the cumulative
                  results of all subcategories combined. Automatic interpolation
                  is applied to seamlessly connect the different data points
                  (i.e. 5-year steps) and provide a smooth appearance.
                </TypographyP>
              </TypographyContent>
            </SectionForDoc>
            <SectionForDoc>
              <TypographyH4>Line Graph</TypographyH4>
              <TypographyContent>
                <TypographyP>
                  Best for investigating the evolution of absolute results
                  across categories. Presents the results of each subcategory as
                  an individual line. Intersections are possible, and the
                  highest values only indicate the results for that subcategory,
                  not cumulative totals.
                </TypographyP>
              </TypographyContent>
            </SectionForDoc>
            <SectionForDoc>
              <TypographyH4>Stacked Bar Graph</TypographyH4>
              <TypographyContent>
                <TypographyP>
                  Best for comparing categories at a specific point in time.
                  Presents the results as distinct bars for each of the points
                  in time scenario results are available in the underlying
                  dataset, i.e., in steps of 5 years. The Stacked Bar Graph is
                  similar to the Stacked Area Graph, with the main difference
                  and benefit being that it enables a clear distinction of the
                  situation in a selected year.
                </TypographyP>
              </TypographyContent>
            </SectionForDoc>
            <SectionForDoc>
              <TypographyH4>Table</TypographyH4>
              <TypographyContent>
                <TypographyP>
                  Best for an exact and comprehensive view of the data, optional
                  data export. Presents the results as a data table based on the
                  filter and visualization settings. It gives stock projection
                  years in the first column, and in all subsequent columns, the
                  corresponding results for the respective subcategories as per
                  the selected breakdown attribute. If the ‘breakdown by’
                  attribute has a larger number of subcategories, the columns
                  may extend further to the right, requiring users to scroll
                  sideways. The user can select to sort data in ascending or
                  descending order for each of the columns – see Figure 3.
                </TypographyP>
                <div className="py-2"></div>
                <div className="flex justify-center">
                  <TypographyFigure
                    url={tableWithFilteredEmbodiedCaronUrl}
                    caption="Figure 3: Table with filtered embodied carbon data of new buildings per country, ready for download."
                  />
                </div>
              </TypographyContent>
            </SectionForDoc>
          </SectionForDoc>

          <SectionForDoc id={HELP_PAGE_IDS.visualizationSettings}>
            <TypographyH3>Settings</TypographyH3>
            <SectionForDoc id={HELP_PAGE_IDS.indicator}>
              <TypographyH3>
                Indicator (GHG emissions and carbon removals)
              </TypographyH3>
              <TypographyContent>
                <TypographyP>
                  Users can define the indicator results should be visualized
                  for by selecting one of the options from the dropdown menu.
                  Users can select, for example, to show global warming
                  potential (GWP) results for the combined GWP total indicator,
                  as well as for the sub-indicators GWP fossil, GWP bio, and GWP
                  luluc (acc. EN 15804+A2).
                </TypographyP>
              </TypographyContent>
            </SectionForDoc>
            <SectionForDoc id={HELP_PAGE_IDS.dividedBy}>
              <TypographyH3>Divided by (reference unit)</TypographyH3>
              <TypographyContent>
                <TypographyMuted>
                  [This functionality becomes active once the newly generated
                  scenario results are loaded to the tool.]
                </TypographyMuted>
                <TypographyP>
                  In addition to selecting the indicator, users can define the
                  reference unit ‘per’ which the indicator should be presented.
                  By selecting from the dropdown menu, users can define to show
                  sum totals (‘none’) or visualize results per square meter or
                  per capita.
                </TypographyP>
              </TypographyContent>
            </SectionForDoc>
            <SectionForDoc id={HELP_PAGE_IDS.breakdownBy}>
              <TypographyH3>Breakdown by (contribution analysis)</TypographyH3>
              <TypographyContent>
                <TypographyP>
                  Users can select how results should be broken down, meaning
                  they can choose an attribute for contribution analysis. The
                  attributes available for contribution analysis correspond to
                  those available in the filter settings – see that section for
                  a detailed description of the subcategories available under
                  each attribute.
                </TypographyP>
                <TypographyP>
                  By choosing from the dropdown menu, the results for the
                  selected indicator and reference unit are shown broken down by
                  the different values of that attribute. For example, that way,
                  users can select to visualize the contribution of different
                  building types, different building elements, or different Life
                  cycle stages, respectively. If users wish to exclude or
                  include certain values, they can do so via the filter
                  settings.
                </TypographyP>
              </TypographyContent>
            </SectionForDoc>
            <SectionForDoc id={HELP_PAGE_IDS.display}>
              <TypographyH3>
                Display (optional scenario comparison)
              </TypographyH3>
              <TypographyContent>
                <TypographyMuted>
                  [This functionality becomes active once the newly generated
                  scenario results are loaded to the tool.]
                </TypographyMuted>
                <TypographyP>
                  Via this selection, users can choose to display in the chart
                  area either scenario A, scenario B, or to compare both
                  scenarios side-by-side for intuitive visual investigation and
                  analysis.
                </TypographyP>
              </TypographyContent>
            </SectionForDoc>
          </SectionForDoc>
        </SectionForDoc>
        <SectionForDoc id={HELP_PAGE_IDS.output}>
          <TypographyH2>Output section</TypographyH2>
          <SectionForDoc>
            <TypographyH3>Chart title</TypographyH3>
            <TypographyContent>
              <TypographyP>
                The chart title is automatically generated based on the current
                selections in scenario, filters, and visualization settings,
                respectively.
              </TypographyP>
            </TypographyContent>
          </SectionForDoc>
          <SectionForDoc>
            <TypographyH3>Chart area</TypographyH3>
            <TypographyContent>
              <TypographyP>
                The chart area is automatically generated based on the selected
                type of chart and the specified visualization settings. By
                default, the horizontal x-axis shows the years (2020-2050) for
                which the scenario offers projections. The vertical y-axis shows
                the results of the respective indicator selected in the
                visualization settings. Both the horizontal and the vertical
                axes adjust automatically to changes in the filter or
                visualization settings.
              </TypographyP>
            </TypographyContent>
          </SectionForDoc>
          <SectionForDoc>
            <TypographyH3>Color legend and tool-tip menu</TypographyH3>
            <TypographyContent>
              <TypographyP>
                The color legend at the bottom of the charts reflects the values
                currently visualized based on the selected attribute (breakdown
                by) and indicates their corresponding colors in the chart.
              </TypographyP>
              <TypographyP>
                When hovering over the chart area, a tool-tip info box appears
                showing specific quantitative results for the respective year
                and values of the selected breakdown attribute.
              </TypographyP>
              <TypographyP>
                Figure 4 illustrates these elements in a line chart showing the
                evolution of emissions related to new residential buildings by
                country over time.
              </TypographyP>
              <div className="py-2"></div>
              <div className="flex justify-center">
                <TypographyFigure
                  caption="Figure 4: Line chart showing evolution of GWP total of new
                  residential building by country."
                  url={lineChartShowingColorAndTooltipUrl}
                />
              </div>
            </TypographyContent>
          </SectionForDoc>
          <SectionForDoc>
            <TypographyH3>Export (Download as)</TypographyH3>
            <TypographyContent>
              <TypographyMuted>
                [This functionality becomes active once the newly generated
                scenario results are loaded to the tool.]
              </TypographyMuted>
              <TypographyP>
                The tool enables the user to download visualizations and data in
                different formats using the download button at the very top
                right, just above the chart area. Here, charts can be downloaded
                as raster images (.PNG or .JPEG) and as high-quality vector
                files (.PDF or .SVG). Table data can furthermore be downloaded
                as original text files (.CSV) or spreadsheets (.XLS). When
                exporting charts or tables, the export takes into consideration
                the settings defined for scenarios, filters, and visualization,
                respectively.
              </TypographyP>
            </TypographyContent>
          </SectionForDoc>
          <SectionForDoc id={HELP_PAGE_IDS.faq}>
            <TypographyH2>F.A.Q.</TypographyH2>
            <TypographyContent>
              <TypographyP>
                <span className="font-bold">
                  How to conduct contribution analysis?
                </span>
              </TypographyP>
              <TypographyP>
                Contribution analysis can be applied for investigating the
                contribution of different attributes to the overall results.
                Users can select, for example to show contributions from
                different countries, types of buildings, building elements, or
                life cycle stages. This is done by selecting the desired
                attribute in ‘Visualization settings: Breakdown by’. The results
                will the be broken down by contribution of the subcategories
                available in the respective attribute and can be investigated as
                charts or table.
              </TypographyP>
            </TypographyContent>

            <TypographyContent>
              <TypographyP>
                <span className="font-bold">
                  How to visualize building level results?
                </span>
              </TypographyP>
              <TypographyP>
                Building level results can be obtained from the tool via two
                steps. First, filtering the results for the respective context
                (region, country, building typology) and scope of interest
                (building elements, life cycle stages included). And second,
                selecting the respective indicator of interest, and then the
                reference unit to be “per m²”. This will give the results per
                square meter of building floor area for the respective filter
                settings.
              </TypographyP>
            </TypographyContent>

            <TypographyContent>
              <TypographyP>
                <span className="font-bold">
                  How to assess results at building stock level?
                </span>
              </TypographyP>
              <TypographyP>
                The scenario modelling tool shows building stock level totals by
                default. Users can explore these building stock level results in
                as charts or table. Users can further apply filter and
                visualization settings to adjust the scope of results shown to
                their respective research question or interest. To change from
                building stock level results to results at building level, users
                can adjust the indicator and the reference unit (‘per’) to show
                results per square meter (m²) or per population (capita).
              </TypographyP>
            </TypographyContent>

            <TypographyContent>
              <TypographyP>
                <span className="font-bold">
                  How to compare results with baseline or business as usual?
                </span>
              </TypographyP>
              <TypographyP>
                Users can compare the scenario results with predefined scenarios
                directly in the tool – see optional scenario comparison
                described in Visualization settings (‘Display’). In addition to
                this built-in comparison, users can download data tables to
                conduct further comparisons externally. For details on how to
                export see ‘Visualization settings: Export (download as)’.
              </TypographyP>
            </TypographyContent>

            <TypographyContent>
              <TypographyP>
                <span className="font-bold">
                  How to export data tables and prepare descriptive statistics?
                </span>
              </TypographyP>
              <TypographyP>
                Data tables with the specific results for the current filter and
                visualization settings can be exported via the tool - see
                ‘Visualization settings: Export (download as)’. These data can
                then be further processed in external tools, such as Microsoft
                Excel, to compute descriptive statistics as desired.
              </TypographyP>
            </TypographyContent>

            <TypographyContent>
              <TypographyP>
                <span className="font-bold">
                  How to derive benchmarks per region or country, per building
                  type?
                </span>
              </TypographyP>
              <TypographyP>
                To obtain benchmarks of different types of buildings in
                different regions or countries, users can specify filter
                settings to only show results for one or more countries and/or
                building (sub)types. Defining the desired indicator and
                reference unit per square meter or per capita, users can then
                obtain indicative benchmark values for the different years of
                the scenario analysis. Data can be viewed and exported as charts
                or data tables - see ‘Visualization settings: Export (download
                as)’.
              </TypographyP>
            </TypographyContent>

            <TypographyContent>
              <TypographyP>
                <span className="font-bold">
                  How to compare results with cumulative carbon budgets?
                </span>
              </TypographyP>
              <TypographyP>
                To compare the scenario results with carbon budgets cumulative
                emission results have to be calculated outside of the tool. To
                calculate cumulative emissions results, it is required to
                compute interpolated values for the years in between the 5-year
                steps based on the data provided. For such a computation, data
                can be prepared with the desired filter and visualization
                settings and then downloaded as data table for custom
                calculation in a next step - see ‘Visualization settings: Export
                (download as)’.
              </TypographyP>
            </TypographyContent>

            <TypographyContent>
              <TypographyP>
                <span className="font-bold">
                  How to zoom-in and change the timeline of the data shown?
                </span>
              </TypographyP>
              <TypographyP>
                The temporal extent or timeline of the results visualized can be
                adjusted via the filter settings. Users can select to show the
                full range of scenario results, spanning from 2020-2050
                (default), or adjust the start and end points (From-To) as
                desired – see ‘Filter settings: Year’.
              </TypographyP>
            </TypographyContent>

            <TypographyContent>
              <TypographyP>
                <span className="font-bold">
                  How to investigate carbon removal potentials?
                </span>
              </TypographyP>
              <TypographyP>
                Potential carbon removal effects related to the use of bio-based
                materials can be investigated when selecting the indicator ‘GWP
                bio’. Numbers in the graph will show cumulative results for the
                selected scope, thus potentially including both positive and
                negative emissions which may cancel out. Users can define the
                filter settings to only show a subset of results, for example
                for specific countries, building types, building elements or
                materials, as well as only selected Life cycle stages.
              </TypographyP>
            </TypographyContent>
          </SectionForDoc>
        </SectionForDoc>
      </Section>
    </main>
  );
}
