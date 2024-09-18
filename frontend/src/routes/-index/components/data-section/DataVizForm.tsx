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
  SELECT_UNIT_TESTID,
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
  AttributeSchema,
  IndicatorSchema,
  UnitSchema,
} from "@/lib/shared_with_backend/schemas";
import {
  ATTRIBUTES,
  INDICATORS,
  UNITS,
} from "@/lib/shared_with_backend/constants";
import { InfoButton } from "@/components/InfoButton";
import { Link } from "@tanstack/react-router";
import { LinkIcon } from "lucide-react";

const route = getRouteApi(ROUTES.DASHBOARD);

const DataVizFormSchema = z.object<{
  indicator: z.ZodEnum<Writable<typeof INDICATORS>>;
  attribute: z.ZodEnum<Writable<typeof ATTRIBUTES>>;
  unit: z.ZodEnum<Writable<typeof UNITS>>;
}>({
  indicator: IndicatorSchema,
  attribute: AttributeSchema,
  unit: UnitSchema,
});

export const DataVizForm = () => {
  const navigate = route.useNavigate();
  const { attribute, indicator, unit } = route.useSearch({
    select: (search) => ({
      attribute: search.attribute,
      indicator: search.indicator,
      unit: search.unit,
      scenarioA: search.scenarioA,
      scenarioB: search.scenarioB,
    }),
  });
  const form = useForm<z.infer<typeof DataVizFormSchema>>({
    resolver: zodResolver(DataVizFormSchema),
    defaultValues: {
      indicator,
      attribute,
      unit,
    },
  });

  async function onSubmit({
    attribute,
    indicator,
    unit,
  }: z.infer<typeof DataVizFormSchema>) {
    await navigate({
      search: (prev) => ({
        ...prev,
        attribute,
        indicator,
        unit,
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
                    <SelectItem key={indicator} value={indicator}>
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
          name="unit"
          render={({ field }) => (
            <FormItem data-testid={SELECT_UNIT_TESTID}>
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
                    <SelectTrigger className="text-left capitalize">
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                  </SelectMenuStyle>
                </FormControl>
                <SelectContent>
                  {UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="attribute"
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
