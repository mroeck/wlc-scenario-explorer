import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_DISPLAY,
  HELP_PAGE_IDS,
  RESET_LABEL,
  ROUTES,
  SCENARIO_A_AND_B,
  SCENARIO_A_ONLY,
  SCENARIO_A_MENU_TESTID,
  SCENARIO_B_ONLY,
  SCENARIO_B_MENU_TESTID,
  SCENARIO_TO_ACRONYM,
  DEFAULT_SCENARIO,
} from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SelectMenuStyle } from "../../data-section/SelectMenuStyle";
import { ResetButton } from "../components/ResetButton";
import {
  PREDEFINED_SCENARIOS,
  SCENARIOS_OPTIONS,
} from "@/lib/shared_with_backend/constants";
import { ScenarioSchema } from "@/lib/shared_with_backend/schemas";
import { ScenarioParameters } from "../components/ScenarioParameters";
import { useEffect } from "react";
import { InfoButton } from "@/components/InfoButton";
import { LinkIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const route = getRouteApi(ROUTES.DASHBOARD);

const formSchema = z.object({
  scenarioA: ScenarioSchema,
  scenarioB: z.union([ScenarioSchema, z.literal("")]),
});

export const Scenarios = () => {
  const { scenarioA, scenarioB, display } = route.useSearch({
    select: (search) => ({
      scenarioA: search.scenarioA,
      scenarioB: search.scenarioB,
      display: search.display,
    }),
  });
  const navigate = route.useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scenarioA: DEFAULT_SCENARIO,
      scenarioB: "",
    },
  });

  async function onSubmit({
    scenarioA,
    scenarioB,
  }: z.infer<typeof formSchema>) {
    const scenarioBIsEmpty = scenarioB === "";

    await navigate({
      search: (prev) => ({
        ...prev,
        scenarioA,
        scenarioB: scenarioBIsEmpty ? undefined : scenarioB,
      }),
    });
  }

  type OnSelectChangeArgs = {
    value: string;
    fieldOnChange: (...args: unknown[]) => void;
    form: typeof form;
  };
  function onSelectChange({ value, fieldOnChange, form }: OnSelectChangeArgs) {
    fieldOnChange(value);
    void form.handleSubmit(onSubmit)();
  }

  const reset = () => {
    form.reset();
    void navigate({
      search: (prev) => ({
        ...prev,
        display: DEFAULT_DISPLAY,
      }),
    });
    void form.handleSubmit(onSubmit)();
  };

  useEffect(() => {
    form.setValue("scenarioA", scenarioA);

    if (scenarioB) {
      form.setValue("scenarioB", scenarioB);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col p-0">
      <h2 className="sr-only">Scenarios</h2>
      <div className="flex justify-end px-primary-x pb-px pt-3">
        <ResetButton reset={reset} text={RESET_LABEL} />
      </div>
      <ScrollArea
        className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-5 overflow-x-visible px-primary-x"
        type="always"
      >
        <Form {...form}>
          <form
            onSubmit={void form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="scenarioA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-medium">
                      <div className="flex flex-col">
                        <span>Select a scenario:</span>
                        <span className="text-sm font-normal italic text-gray-800">
                          (primary)
                        </span>
                      </div>
                      <InfoButton>
                        <p>
                          Choose from predefined scenarios. They represent
                          aspirational policy ambitions such as current policies
                          (CPOL) and additional policies (APOL). These scenarios
                          explore the potential of various carbon reduction and
                          removal (CRR) strategies.
                        </p>
                        <Link
                          to={ROUTES.HELP}
                          hash={HELP_PAGE_IDS.predefinedScenarioSelection}
                          className="flex items-center gap-1 underline"
                        >
                          <LinkIcon className="size-3" /> Read more here
                        </Link>
                      </InfoButton>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        onSelectChange({
                          fieldOnChange: (value) => {
                            void navigate({
                              search: (prev) => ({
                                ...prev,
                                display:
                                  display === SCENARIO_B_ONLY
                                    ? SCENARIO_A_AND_B
                                    : display,
                              }),
                            });
                            field.onChange(value);
                          },
                          form,
                          value,
                        });
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectMenuStyle>
                          <SelectTrigger
                            className="w-full max-w-full capitalize"
                            data-testid={SCENARIO_A_MENU_TESTID}
                          >
                            <SelectValue placeholder="Select a scenario" />
                          </SelectTrigger>
                        </SelectMenuStyle>
                      </FormControl>
                      <SelectContent>
                        {SCENARIOS_OPTIONS.map((scenario) => {
                          const acronym = SCENARIO_TO_ACRONYM[scenario];

                          return (
                            <SelectItem key={scenario} value={scenario}>
                              {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/restrict-template-expressions */}
                              {scenario} {acronym ? `(${acronym})` : null}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <div className="px-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">
                    Customise scenario parameters:
                  </span>
                  <InfoButton>
                    <p>
                      Customise scenario parameters by adjusting the ambition
                      levels for different carbon reduction and removal (CRR)
                      strategies. Explore strategies such as improving supply
                      chains, shifting to bio-based solutions, and avoiding
                      unnecessary demand. Set ambition levels to simulate
                      different adoption rates across Member States. Careful,
                      customized scenarios are not based on EU policies like
                      CPOL and APOL.
                    </p>
                    <Link
                      to={ROUTES.HELP}
                      hash={HELP_PAGE_IDS.scenarioParametersCustomization}
                      className="flex items-center gap-1 underline"
                    >
                      <LinkIcon className="size-3" /> Read more here
                    </Link>
                  </InfoButton>
                </div>
                <ScenarioParameters />
              </div>
            </div>
            <div></div>
            <FormField
              control={form.control}
              name="scenarioB"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 font-medium">
                    <div className="flex flex-col">
                      <span>Select another scenario:</span>
                      <span className="text-sm font-normal italic text-gray-800">
                        (secondary, for comparison)
                      </span>
                    </div>
                    <InfoButton>
                      <p>
                        Select a second predefined scenario to compare with your
                        primary scenario. Explore policy ambitions like current
                        policies (CPOL), additional policies (APOL), and
                        combined CRR strategies (Improve, Shift, Avoid) to
                        analyze their impact side by side.
                      </p>
                      <Link
                        to={ROUTES.HELP}
                        hash={HELP_PAGE_IDS.predefinedScenarioSelection}
                        className="flex items-center gap-1 underline"
                      >
                        <LinkIcon className="size-3" /> Read more here
                      </Link>
                    </InfoButton>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      onSelectChange({
                        fieldOnChange: (value) => {
                          void navigate({
                            search: (prev) => ({
                              ...prev,
                              display:
                                display === SCENARIO_A_ONLY
                                  ? SCENARIO_A_AND_B
                                  : display,
                            }),
                          });
                          field.onChange(value);
                        },
                        form,
                        value,
                      });
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectMenuStyle>
                        <SelectTrigger
                          className="w-full max-w-full"
                          data-testid={SCENARIO_B_MENU_TESTID}
                        >
                          <SelectValue placeholder="Select a scenario" />
                        </SelectTrigger>
                      </SelectMenuStyle>
                    </FormControl>
                    <SelectContent>
                      {PREDEFINED_SCENARIOS.map((scenario) => {
                        const acronym = SCENARIO_TO_ACRONYM[scenario];

                        return (
                          <SelectItem key={scenario} value={scenario}>
                            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/restrict-template-expressions */}
                            {scenario} {acronym ? `(${acronym})` : null}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="pb-primary-y"></div>
      </ScrollArea>
    </section>
  );
};
