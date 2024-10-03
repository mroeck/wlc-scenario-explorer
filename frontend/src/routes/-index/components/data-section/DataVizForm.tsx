import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  BREAKDOWN_BY_TESTID,
  ROUTES,
  SELECT_INDICATOR_TESTID,
  BREAKDOWN_BY_ORDER,
  SELECT_DIVIDED_BY_TESTID,
  HELP_PAGE_IDS,
} from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectMenuStyle } from "./SelectMenuStyle";
import { getRouteApi } from "@tanstack/react-router";
import { type Writable } from "type-fest";
import {
  BreakdownBySchema,
  IndicatorSchema,
  DividedBySchema,
} from "@/lib/shared_with_backend/schemas";
import {
  ATTRIBUTES,
  INDICATORS,
  DIVIDED_BY_OPTIONS,
} from "@/lib/shared_with_backend/constants";
import { InfoButton } from "@/components/InfoButton";
import { Link } from "@tanstack/react-router";
import { LinkIcon } from "lucide-react";

const route = getRouteApi(ROUTES.DASHBOARD);

const DataVizFormSchema = z.object<{
  indicator: z.ZodEnum<Writable<typeof INDICATORS>>;
  breakdownBy: z.ZodEnum<Writable<typeof ATTRIBUTES>>;
  dividedBy: z.ZodEnum<Writable<typeof DIVIDED_BY_OPTIONS>>;
}>({
  indicator: IndicatorSchema,
  breakdownBy: BreakdownBySchema,
  dividedBy: DividedBySchema,
});

export const DataVizForm = () => {
  const navigate = route.useNavigate();
  const { breakdownBy, indicator, dividedBy, highlight } = route.useSearch({
    select: (search) => ({
      breakdownBy: search.breakdownBy,
      indicator: search.indicator,
      dividedBy: search.dividedBy,
      scenarioA: search.scenarioA,
      scenarioB: search.scenarioB,
      highlight: search.highlight,
    }),
  });
  const form = useForm<z.infer<typeof DataVizFormSchema>>({
    resolver: zodResolver(DataVizFormSchema),
    defaultValues: {
      indicator,
      breakdownBy,
      dividedBy,
    },
  });

  async function onSubmit({
    breakdownBy: newBreakdownBy,
    indicator,
    dividedBy,
  }: z.infer<typeof DataVizFormSchema>) {
    await navigate({
      search: (prev) => ({
        ...prev,
        breakdownBy: newBreakdownBy,
        indicator,
        dividedBy,
        highlight: newBreakdownBy === breakdownBy ? highlight : undefined,
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

  return (
    <Form {...form}>
      <form
        onSubmit={void form.handleSubmit(onSubmit)}
        className="flex flex-wrap gap-5"
      >
        <FormField
          control={form.control}
          name="indicator"
          render={({ field }) => (
            <FormItem data-testid={SELECT_INDICATOR_TESTID}>
              <FormLabel className="flex items-center gap-2">
                <span className="font-medium">Indicator:</span>
                <InfoButton>
                  <p>
                    Select an indicator to visualize GHG emissions and carbon
                    removals, such as total global warming potential (GWP) or
                    specific sub-indicators like GWP fossil, GWP bio, and GWP
                    luluc.
                  </p>
                  <Link
                    to={ROUTES.HELP}
                    hash={HELP_PAGE_IDS.indicator}
                    className="flex items-center gap-1 underline"
                  >
                    <LinkIcon className="size-3" /> Read more here
                  </Link>
                </InfoButton>
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  onSelectChange({
                    fieldOnChange: field.onChange,
                    form,
                    value,
                  });
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectMenuStyle>
                    <SelectTrigger className="text-left capitalize">
                      <SelectValue placeholder="Select a indicator" />
                    </SelectTrigger>
                  </SelectMenuStyle>
                </FormControl>
                <SelectContent>
                  {INDICATORS.map((indicator) => (
                    <SelectItem
                      key={indicator}
                      value={indicator}
                      className="normal-case"
                    >
                      {indicator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dividedBy"
          render={({ field }) => (
            <FormItem data-testid={SELECT_DIVIDED_BY_TESTID}>
              <FormLabel className="flex items-center gap-2">
                <span className="font-medium">Divided by:</span>
                <InfoButton>
                  <p>
                    Select a reference unit to divide the indicator results by,
                    such as per square meter, per capita, or show total sums
                    with no division.
                  </p>
                  <Link
                    to={ROUTES.HELP}
                    hash={HELP_PAGE_IDS.dividedBy}
                    className="flex items-center gap-1 underline"
                  >
                    <LinkIcon className="size-3" /> Read more here
                  </Link>
                </InfoButton>
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  onSelectChange({
                    fieldOnChange: field.onChange,
                    form,
                    value,
                  });
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectMenuStyle>
                    <SelectTrigger className="text-left">
                      <SelectValue placeholder="Select an option.." />
                    </SelectTrigger>
                  </SelectMenuStyle>
                </FormControl>
                <SelectContent>
                  {DIVIDED_BY_OPTIONS.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className="normal-case"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="breakdownBy"
          render={({ field }) => (
            <FormItem data-testid={BREAKDOWN_BY_TESTID}>
              <FormLabel className="flex items-center gap-2">
                <span className="font-medium">Breakdown by:</span>
                <InfoButton>
                  <p>
                    Select an attribute to break down the results for detailed
                    contribution analysis. Choose attributes like building
                    types, elements, or life cycle stages to see how each
                    contributes to the overall indicator. Customize which values
                    to include or exclude via the filter settings.
                  </p>
                  <Link
                    to={ROUTES.HELP}
                    hash={HELP_PAGE_IDS.breakdownBy}
                    className="flex items-center gap-1 underline"
                  >
                    <LinkIcon className="size-3" /> Read more here
                  </Link>
                </InfoButton>
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  onSelectChange({
                    fieldOnChange: field.onChange,
                    form,
                    value,
                  });
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectMenuStyle>
                    <SelectTrigger className="text-left capitalize">
                      <SelectValue />
                    </SelectTrigger>
                  </SelectMenuStyle>
                </FormControl>
                <SelectContent>
                  {ATTRIBUTES.sort((keyA, keyB) => {
                    return BREAKDOWN_BY_ORDER.indexOf(
                      keyA.toLowerCase() as Writable<
                        typeof BREAKDOWN_BY_ORDER
                      >[number],
                    ) <
                      BREAKDOWN_BY_ORDER.indexOf(
                        keyB.toLowerCase() as Writable<
                          typeof BREAKDOWN_BY_ORDER
                        >[number],
                      )
                      ? -1
                      : 1;
                  }).map((attribute) => (
                    <SelectItem
                      key={attribute}
                      value={attribute}
                      className="capitalize"
                    >
                      {attribute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
