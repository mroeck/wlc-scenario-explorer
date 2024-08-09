import { Section } from "@/components/Section";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/help")({
  component: () => <Help />,
});

function Help() {
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
        <h1 className={cn("sr-only")}>Documentation</h1>
        <h1 className={cn("text-lg font-bold")}>1. Introduction</h1>

        <p className={cn("pb-3")}>
          A team of researchers aimed to model the Greenhouse Gas emissions
          (GHG) resulting from different EU building stock policies and carbon
          reduction & removal (CRR) strategies. In this web app, these
          combinations of policies and strategies are referred to as a
          &quot;Scenario&quot;. The aim of this web app is to visualize the
          results of these different scenarios on the Dashboard page.
        </p>

        <h1 className={cn("sr-only")}>Documentation</h1>
        <h1 className={cn("text-lg font-bold")}>2. Dashboard Overview</h1>

        <p>The Dashboard interface is divided into two main parts:</p>

        <section className={cn("p-primary")}>
          <h2 className={cn("font-bold")}>
            A. Left Side: Scenarios and Filters
          </h2>

          <p>
            This section enables you to setup and compare different scenarios.
            You can find and adjust these settings in their respective tabs:
          </p>
          <section className={cn("p-primary")}>
            <h3 className={cn("font-bold")}>Scenario tab</h3>
            <p>
              You can choose from a list of seven predefinred scenarios. Each
              one is an assumption for the level of implementation of the
              current EU policies and the CRR strategies.
              <br />
              - Current policy optimistic scenario (CPOO): assuming current
              policy targets are met
              <br />
              - Current policy conservative scenario (CPOC): assuming current
              policy targets encounter social/technical challenges
              <br />
              - Additional policy scenario (APOL):
              <br />
              - APOL + Improve (APOI)
              <br />
              - APOL + Shift (APOS)
              <br />
              - APOL + Avoid (APOA)
              <br />- APOL + A+S+I (AASI)
            </p>

            {/* <p>
              Explaining the scenario selection, different scenarios and their
              meanings
              <br />
              Explaining the parameters, how to set them and how the logic work.
              <br />
              Not satisfied with the predefined scenarios? Create your own by
              modifying the scenario parameters. <br />
              We offer three categories for customization: - Improve - Shift -
              Avoid Each category has policies that you can adjust from level 1
              (weak) to level 5 (strong). Customizing these parameters will
              replace the current "Scenario A" with your custom scenario.
              <br />
              Explaining the option to compare scenarios by setting scenario B.
              Explaining that this automatically sets display button on the
              right side of the page to displaying both graphs
            </p> */}
          </section>
          <section className={cn("p-primary")}>
            <h3 className={cn("font-bold")}>Filters tab</h3>

            {/* <p>Explaining each filter and the options of each filter</p> */}
          </section>
        </section>

        <section className={cn("p-primary")}>
          <h2 className={cn("font-bold")}>
            B. Right Side: Visualisation and Settings
          </h2>

          <p>
            In this section, you&apos;ll view graphs generated based on the
            settings and filters you&apos;ve selected. It is organized into
            three distinct parts:
          </p>
          <section className={cn("p-primary")}>
            <h3 className={cn("font-bold")}>Visualisation types:</h3>

            <p>
              At the top, there are three tabs, each corresponding to a
              different type of visualization:
              <br />- Stacked area chart is best for visualizing how a group of
              categories and its sub categories evolve over time
              <br />- Stacked bar chart is best suited for comparing categories
              and its sub categories at a specific point in time.
              <br />- Data table is best to provide an exact and comprehensive
              view of the data.
            </p>
          </section>

          <section className={cn("p-primary")}>
            <h3 className={cn("font-bold")}>Visualisation Settings:</h3>

            <p>
              After choosing the visualisaition type, you can configure the
              following:
              <br />- Indicator:
              <br />- Breakdown by:
              <br />- Display:
              <br />- Download:
            </p>
          </section>

          <section className={cn("p-primary")}>
            <h3 className={cn("font-bold")}>Visualisation:</h3>

            <p>
              {" "}
              Here you can view the visualisation itself, either with only one
              scenario or two, depends on your scenario and display settings.
              <br />
              There are two legends;
              <br />
              Color Legend: shows the color scheme used to represent different
              categories in the graph.
              <br />
              Opacity Legend: indicates how varying levels of opacity
              differentiate between Scenario A and Scenario B.
            </p>
          </section>
        </section>

        {/* <section className={cn("p-primary")}>
          <h2 className={cn("font-bold")}>Scenario Simulation and Data</h2>

          <p>
            When simulating a scenario, we obtain data on potential building
            outcomes. This data includes :
          </p>

          <ul className={cn("px-primary-x")}>
            <li>- GHG emissions produced</li>
            <li>- Building type (Residential, Non-residential)</li>
            <li>- Amount of material used per building</li>
            <li>- Country of the building</li>
            <li>- and more...</li>
          </ul>

          <p>This data is visualized using various graphs.</p>
        </section>
        <section className={cn("p-primary")}>
          <h2 className={cn("font-bold")}>Graph Types</h2>

          <ul>
            <li>
              - Stacked Area Graph: Best for visualizing trends as a group. By
              setting &quot;breakdown by&quot; to &quot;country&quot; you can
              see the GHG emissions generated by all EU country under the
              selected scenario.
            </li>
            <li>
              - Line Chart: Better for comparing GHG emissions between different
              country.
            </li>
          </ul>
        </section>
        <section className={cn("p-primary")}>
          <h2 className={cn("font-bold")}>Scenario Selection and Comparison</h2>

          <p>
            On the left side of the dashboard page, you can select the scenarios
            you want to analyze:
          </p>

          <p>
            To compare two scenarios, select &quot;Scenario A&quot; and
            &quot;Scenario B.&quot; Use the &quot;display&quot; selection and/or
            the slider on the graph to switch between the scenarios.
          </p>
        </section>
        <section className={cn("p-primary")}>
          <h2 className={cn("font-bold")}>Custom Scenarios</h2>
          <p>
            Not satisfied with the predefined scenarios? Create your own by
            modifying the scenario parameters. We offer three categories for
            customization:
          </p>
          <ul>
            <li>- Improve</li>
            <li>- Shift</li>
            <li>- Avoid</li>
          </ul>

          <p>
            Each category has policies that you can adjust from level 1 (weak)
            to level 5 (strong). Customizing these parameters will replace the
            current &quot;Scenario A&quot; with your custom scenario.
          </p>
          <p>Here are some policies you can change:</p>
          <ul>
            <li>Reduce per capita space demand</li>
            <li>
              Prioritise better use, renovation and repair over demolition and
              new construction
            </li>
            <li>Improve material efficiency</li>
            <li>Increase the use of bio-based materials (material shift)</li>
            <li>
              {" "}
              Reduce emissions from traditionally high impact construction
              materials (material choice)
            </li>
            <li>
              {" "}
              Reduce emissions from transport of materials and construction
              products{" "}
            </li>
            <li> Reduce emissions from the construction site</li>
            <li> Increase circular material use</li>
            <li> Reduce operational carbon emissions</li>
            <li> Reduce construction waste </li>
            <li> Use of carbon dioxide removal (CDR) solutions</li>
          </ul>
        </section>
        <section className={cn("p-primary")}>
          <h2 className={cn("font-bold")}>Data Filtering</h2>

          <p>
            The filter tab on the left side allows you to display only the data
            you are interested in.
          </p>
        </section>
        <section className={cn("p-primary")}>
          <h2 className={cn("font-bold")}>Data Display</h2>

          <p>
            On the right side, data can be displayed as either a graph or a
            table, depending on the tab you select. You can also choose an
            indicator for the Y-axis of the graph. Each indicator has its own
            unit (e.g., ktCO2, kt/building).
          </p>
        </section>
        <section className={cn("p-primary")}>
          <h2 className={cn("font-bold")}>Downloading Data</h2>

          <p>You can download the data in various formats:</p>
          <ul>
            <li>- Image</li>
            <li>- Spreadsheet</li>
            <li>- PDF</li>
          </ul>
          <p>
            Simply click the download button at the top right of the right
            section to choose your preferred format.
          </p>
        </section> */}
      </Section>
    </main>
  );
}
