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
  STRATEGY_TESTID,
  SET_ALL_PARAMETERS_TRIGGER_TESTID,
  PREDEFINED_SCENARIO_TO_APPROXIMATION,
} from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z, type ZodNull, type ZodString, type ZodUnion } from "zod";
import { SelectMenuStyle } from "../../data-section/SelectMenuStyle";
import { ResetButton } from "../components/ResetButton";
import {
  CUSTOM_SCENARIO,
  PARAMETER_LEVELS,
  PREDEFINED_SCENARIOS,
  SCENARIO_PARAMETERS_OBJ,
  SCENARIO_PARAMETERS_ORDER,
  SCENARIOS_OPTIONS,
  type Actions,
} from "@/lib/shared_with_backend/constants";
import {
  ScenarioSchema,
  type StrategyAsSearchParamSchema,
} from "@/lib/shared_with_backend/schemas";
import { useEffect, useState } from "react";
import { InfoButton } from "@/components/InfoButton";
import { LinkIcon, MoreVerticalIcon, XIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ParameterLevel } from "../components/ParameterLevel";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const route = getRouteApi(ROUTES.DASHBOARD);

type DefaultStrategies = Record<Actions, string | null>;
const typedAcc = {} as DefaultStrategies;
const defaultStrategiesForForm = Object.values(SCENARIO_PARAMETERS_OBJ)
  .flatMap((category) => category.strategies)
  .reduce<DefaultStrategies>((acc, strategy) => {
    acc[strategy] = null;
    return acc;
  }, typedAcc);

type StrategiesSchemaType = Record<Actions, ZodUnion<[ZodString, ZodNull]>>;

const typedAccForSchema = {} as StrategiesSchemaType;
const StrategiesSchema = Object.keys(
  defaultStrategiesForForm,
).reduce<StrategiesSchemaType>((acc, strategy) => {
  acc[strategy as Actions] = z.string().or(z.null());
  return acc;
}, typedAccForSchema);

const formSchema = z.object({
  scenarioA: ScenarioSchema,
  scenarioB: z.union([ScenarioSchema, z.literal("")]),
  ...StrategiesSchema,
});
const DEFAULT_STRATEGY = [null, null, null, null, null, null] satisfies z.infer<
  typeof StrategyAsSearchParamSchema
>;

const SUGGESTIONS_QUERY_KEY = "SUGGESTIONS_QUERY_KEY";
const DEFAULT_ACCORDION_ITEMS: MyAccordionItem[] = ["avoid"];

type MyAccordionItem = keyof typeof SCENARIO_PARAMETERS_OBJ | "";

export const Scenarios = () => {
  const queryClient = useQueryClient();
  const [activeAccordionItems, setActiveAccordionItems] = useState<
    MyAccordionItem[]
  >(DEFAULT_ACCORDION_ITEMS);
  const {
    scenarioA,
    scenarioB,
    display,
    strategy = DEFAULT_STRATEGY,
  } = route.useSearch({
    select: (search) => ({
      scenarioA: search.scenarioA,
      scenarioB: search.scenarioB,
      display: search.display,
      strategy: search.strategy,
    }),
  });
  const isDataCached = !!queryClient.getQueryData([
    SUGGESTIONS_QUERY_KEY,
    strategy,
  ]);
  const strategyDebounced = useDebounce(strategy, 750);
  const finalStrategy = isDataCached ? strategy : strategyDebounced;

  const navigate = route.useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scenarioA: DEFAULT_SCENARIO,
      scenarioB: "",
      ...defaultStrategiesForForm,
    },
  });

  async function onSubmit({
    scenarioA,
    scenarioB,
    ...actions
  }: z.infer<typeof formSchema>) {
    const scenarioBIsEmpty = scenarioB === "";
    const strategy =
      scenarioA === CUSTOM_SCENARIO
        ? SCENARIO_PARAMETERS_ORDER.map((action) => actions[action])
        : undefined;

    await navigate({
      search: (prev) => ({
        ...prev,
        filters: {
          ...prev.filters,
          To: prev.filters?.To?.toString(),
          From: prev.filters?.From?.toString(),
        },
        scenarioA,
        scenarioB: scenarioBIsEmpty ? undefined : scenarioB,
        strategy,
      }),
      replace: true,
    });
  }

  type OnSelectChangeArgs = {
    value: string;
    fieldOnChange: (...args: unknown[]) => void;
    form: typeof form;
  };
  function onValueChange({ value, fieldOnChange, form }: OnSelectChangeArgs) {
    fieldOnChange(value);
    void form.handleSubmit(onSubmit)();
  }

  const reset = () => {
    form.reset();
    void navigate({
      search: (prev) => ({
        ...prev,
        filters: {
          ...prev.filters,
          To: prev.filters?.To?.toString(),
          From: prev.filters?.From?.toString(),
        },
        display: DEFAULT_DISPLAY,
      }),
      replace: true,
    });
    void form.handleSubmit(onSubmit)();
  };

  useEffect(() => {
    form.setValue("scenarioA", scenarioA);

    if (scenarioB) {
      form.setValue("scenarioB", scenarioB);
    }
    strategy.forEach((actionLevel, index) => {
      form.setValue(
        SCENARIO_PARAMETERS_ORDER[
          index
        ] as (typeof SCENARIO_PARAMETERS_ORDER)[number],
        actionLevel,
      );
    });
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
                          Choose from predefined scenarios or define a custom
                          scenario below. Predefined scenarios represent
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
                        onValueChange({
                          fieldOnChange: (value) => {
                            void navigate({
                              search: (prev) => ({
                                ...prev,
                                filters: {
                                  ...prev.filters,
                                  To: prev.filters?.To?.toString(),
                                  From: prev.filters?.From?.toString(),
                                },
                                display:
                                  display === SCENARIO_B_ONLY
                                    ? SCENARIO_A_AND_B
                                    : display,
                              }),
                              replace: true,
                            });

                            const isCustom = value === CUSTOM_SCENARIO;
                            const hasActiveAccordionItem =
                              activeAccordionItems.length > 0;

                            if (isCustom && !hasActiveAccordionItem) {
                              setTimeout(() => {
                                setActiveAccordionItems(["avoid"]);
                              }, 0);
                            }

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
                              {scenario} {acronym ? `(${acronym})` : null}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <Link
                      to={ROUTES.HELP}
                      hash={HELP_PAGE_IDS.predefinedScenarioSelection}
                      className="flex items-center gap-1 py-2 text-xs font-medium text-gray-600 underline"
                    >
                      <LinkIcon className="size-3" /> Learn about predefined
                      scenarios parameters
                    </Link>
                  </FormItem>
                )}
              />
              <div className="px-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">
                    Define a custom scenario:
                  </span>
                  <InfoButton>
                    <p>
                      Define a custom scenario by adjusting the ambition levels
                      for different carbon reduction and removal (CRR)
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
                <Accordion
                  type="multiple"
                  className="pl-2"
                  value={activeAccordionItems}
                  onValueChange={(value) => {
                    setActiveAccordionItems(value as MyAccordionItem[]);
                  }}
                  data-testid={STRATEGY_TESTID}
                >
                  {Object.entries(SCENARIO_PARAMETERS_OBJ).map(
                    ([category, values]) => {
                      const actions = values.strategies;
                      const Info = values.info;
                      return (
                        <AccordionItem key={category} value={category}>
                          <div className="flex justify-between gap-2">
                            <div className="flex flex-1 items-center gap-x-2">
                              <InfoButton>
                                <Info />
                              </InfoButton>
                              <div className="flex-1">
                                <AccordionTrigger
                                  className="
                text-sm font-bold capitalize text-gray-800"
                                >
                                  {category}
                                </AccordionTrigger>
                              </div>
                            </div>
                            <Popover>
                              <PopoverTrigger
                                data-testid={SET_ALL_PARAMETERS_TRIGGER_TESTID}
                              >
                                <MoreVerticalIcon className="h-6 w-7 rounded-sm text-primary" />
                              </PopoverTrigger>
                              <PopoverContent className="flex flex-col gap-1">
                                <span className="text-sm text-gray-800">
                                  Set all{" "}
                                  <span className="font-bold capitalize">
                                    "{category}"
                                  </span>{" "}
                                  levels to:
                                </span>
                                <PopoverClose className="flex flex-col gap-2">
                                  <div className="flex gap-2">
                                    {PARAMETER_LEVELS.map((level) => (
                                      <ParameterLevel
                                        key={level}
                                        level={level}
                                        onClick={() => {
                                          actions.forEach((action) => {
                                            form.setValue(action, level);
                                          });
                                          form.setValue(
                                            "scenarioA",
                                            CUSTOM_SCENARIO,
                                          );
                                          void form.handleSubmit(onSubmit)();
                                        }}
                                      />
                                    ))}
                                  </div>
                                  <button
                                    type="button"
                                    className="ml-auto flex items-center gap-1 text-sm text-gray-800"
                                    onClick={() => {
                                      actions.forEach((action) => {
                                        form.setValue(action, null);
                                      });
                                      form.setValue(
                                        "scenarioA",
                                        CUSTOM_SCENARIO,
                                      );
                                      void form.handleSubmit(onSubmit)();
                                    }}
                                  >
                                    <XIcon className="size-[14px]" />
                                    <span>Clear</span>
                                  </button>
                                </PopoverClose>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <AccordionContent>
                            <div className="flex flex-col gap-5 pl-2">
                              {actions.map((label) => (
                                <FormField
                                  key={encodeURIComponent(label)}
                                  control={form.control}
                                  name={label}
                                  render={({ field }) => (
                                    <FormItem
                                      className="flex flex-col gap-1"
                                      key={`${label}${field.value ?? "null"} `}
                                    >
                                      <FormLabel asChild>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm text-gray-800">
                                            {label}:
                                          </span>
                                        </div>
                                      </FormLabel>
                                      <FormControl>
                                        <ToggleGroup.Root
                                          type="single"
                                          onValueChange={(value) => {
                                            onValueChange({
                                              fieldOnChange: (valueRaw) => {
                                                const isEmpty = valueRaw === "";
                                                const value = isEmpty
                                                  ? null
                                                  : valueRaw;
                                                form.setValue(
                                                  "scenarioA",
                                                  CUSTOM_SCENARIO,
                                                );

                                                void queryClient.cancelQueries({
                                                  queryKey: [
                                                    SUGGESTIONS_QUERY_KEY,
                                                    finalStrategy,
                                                  ],
                                                });

                                                field.onChange(value);
                                              },
                                              form,
                                              value,
                                            });
                                          }}
                                          value={field.value ?? undefined}
                                          className="flex max-w-40 justify-around gap-2"
                                        >
                                          {PARAMETER_LEVELS.map((value) => {
                                            const isActive =
                                              field.value === value;
                                            const isApproximation =
                                              scenarioA !== CUSTOM_SCENARIO &&
                                              PREDEFINED_SCENARIO_TO_APPROXIMATION[
                                                scenarioA
                                              ] === value;

                                            const status = isActive
                                              ? "active"
                                              : isApproximation
                                                ? "approximation"
                                                : undefined;

                                            return (
                                              <FormItem
                                                key={value}
                                                className="flex items-center space-x-3 space-y-0"
                                              >
                                                <FormControl>
                                                  <ToggleGroup.Item
                                                    value={value}
                                                    asChild
                                                  >
                                                    <ParameterLevel
                                                      level={value}
                                                      status={status}
                                                    />
                                                  </ToggleGroup.Item>
                                                </FormControl>
                                              </FormItem>
                                            );
                                          })}
                                        </ToggleGroup.Root>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    },
                  )}
                </Accordion>
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
                      onValueChange({
                        fieldOnChange: (value) => {
                          void navigate({
                            search: (prev) => ({
                              ...prev,
                              filters: {
                                ...prev.filters,
                                To: prev.filters?.To?.toString(),
                                From: prev.filters?.From?.toString(),
                              },
                              display:
                                display === SCENARIO_A_ONLY
                                  ? SCENARIO_A_AND_B
                                  : display,
                            }),
                            replace: true,
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
