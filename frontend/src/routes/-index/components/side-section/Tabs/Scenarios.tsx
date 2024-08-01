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
  ROUTES,
  SCENARIO_A_AND_B,
  SCENARIO_A_ONLY,
  SCENARIO_A_TESTID,
  SCENARIO_B_ONLY,
  SCENARIO_B_TESTID,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SelectMenuStyle } from "../../data-section/SelectMenuStyle";
import { ResetButton } from "../components/ResetButton";
import { SCENARIOS_OPTIONS } from "@/lib/shared_with_backend/constants";
import { ScenarioSchema } from "@/lib/shared_with_backend/schemas";
import { ScenarioParameters } from "../components/ScenarioParameters";
import { useEffect } from "react";

const route = getRouteApi(ROUTES.DASHBOARD);

const formSchema = z.object({
  scenarioA: ScenarioSchema,
  scenarioB: z.union([ScenarioSchema, z.literal("")]),
});

export const Scenarios = () => {
  const { scenarioA, scenarioB, display } = route.useSearch();
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
    <section className={cn(" px-primary-x")}>
      <h2 className={cn("sr-only")}>Scenarios</h2>
      <div className={cn("flex justify-end pb-px pt-3")}>
        <ResetButton reset={reset} text="Reset all" />
      </div>
      <Form {...form}>
        <form
          onSubmit={void form.handleSubmit(onSubmit)}
          className={cn("flex flex-col gap-8")}
        >
          <div className={cn("flex flex-col gap-4")}>
            <FormField
              control={form.control}
              name="scenarioA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("font-medium")}>
                    Scenario A:
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
                          className={cn("w-full max-w-full capitalize")}
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
            <div className={cn("px-2")}>
              <div className={cn("flex justify-between")}>
                <span className={cn("text-sm font-medium underline")}>
                  Modify Parameters:
                </span>
              </div>
              <ScenarioParameters />
            </div>
          </div>
          <FormField
            control={form.control}
            name="scenarioB"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("font-medium")}>Scenario B:</FormLabel>
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
                        className={cn("w-full max-w-full")}
                        data-testid={SCENARIO_B_TESTID}
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
        </form>
      </Form>
    </section>
  );
};
