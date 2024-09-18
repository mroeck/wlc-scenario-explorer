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
  ROUTES,
  SCENARIO_A_AND_B,
  SCENARIO_A_ONLY,
  SCENARIO_A_TESTID,
  SCENARIO_B_ONLY,
  SCENARIO_B_TESTID,
} from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SelectMenuStyle } from "../../data-section/SelectMenuStyle";
import { ResetButton } from "../components/ResetButton";
import {
  PREDEFINED_SCNEARIOS,
  SCENARIOS_OPTIONS,
} from "@/lib/shared_with_backend/constants";
import { ScenarioSchema } from "@/lib/shared_with_backend/schemas";
import { ScenarioParameters } from "../components/ScenarioParameters";
import { useEffect } from "react";
import { InfoButton } from "@/components/InfoButton";
import { LinkIcon } from "lucide-react";

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
      scenarioA: SCENARIOS_OPTIONS[0],
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
    <section className=" px-primary-x">
      <h2 className="sr-only">Scenarios</h2>
      <div className="flex justify-end pb-px pt-3">
        <ResetButton reset={reset} text="Reset all" />
      </div>
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
                    <span>Primary scenario:</span>
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
                          data-testid={SCENARIO_A_TESTID}
                        >
                          <SelectValue placeholder="Select a scenario" />
                        </SelectTrigger>
                      </SelectMenuStyle>
                    </FormControl>
                    <SelectContent>
                      {SCENARIOS_OPTIONS.map((scenario) => (
                        <SelectItem key={scenario} value={scenario}>
                          {scenario}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className="px-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium underline">
                  Customize Parameters:
                </span>
                <InfoButton>
                  <p>
                    Customize scenario parameters by adjusting the ambition
                    levels for different carbon reduction and removal (CRR)
                    strategies. Explore strategies such as improving supply
                    chains, shifting to bio-based solutions, and avoiding
                    unnecessary demand. Set ambition levels to simulate
                    different adoption rates across Member States
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
          <FormField
            control={form.control}
            name="scenarioB"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-medium">
                  <span>Compare with scenario:</span>
                  <InfoButton>
                    <p>
                      Select a second predefined scenario to compare with your
                      primary scenario. Explore policy ambitions like current
                      policies (CPOL), additional policies (APOL), and combined
                      CRR strategies (Improve, Shift, Avoid) to analyze their
                      impact side by side.
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
                        data-testid={SCENARIO_B_TESTID}
                      >
                        <SelectValue placeholder="Select a scenario" />
                      </SelectTrigger>
                    </SelectMenuStyle>
                  </FormControl>
                  <SelectContent>
                    {PREDEFINED_SCNEARIOS.map((scenario) => (
                      <SelectItem key={scenario} value={scenario}>
                        {scenario}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </section>
  );
};
