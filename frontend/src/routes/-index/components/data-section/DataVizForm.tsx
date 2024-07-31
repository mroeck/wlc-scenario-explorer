import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  BREAKDOWN_BY_TESTID,
  ROUTES,
  type DISPLAY_OPTIONS,
  DISPLAY_SELECT_TESTID,
  SCENARIO_A_ONLY,
  SCENARIO_B_ONLY,
  SCENARIO_A_AND_B,
  SELECT_UNIT_TESTID,
} from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SelectMenuStyle } from "./SelectMenuStyle";
import { getRouteApi } from "@tanstack/react-router";
import { type Writable } from "type-fest";
import {
  AttributeSchema,
  IndicatorSchema,
} from "@/lib/shared_with_backend/schemas";
import { DisplaySchema } from "@/lib/schemas";
import { ATTRIBUTES, INDICATORS } from "@/lib/shared_with_backend/constants";
import { useEffect } from "react";

const route = getRouteApi(ROUTES.DASHBOARD);

const DataVizFormSchema = z.object<{
  unit: z.ZodEnum<Writable<typeof INDICATORS>>;
  attribute: z.ZodEnum<Writable<typeof ATTRIBUTES>>;
  display: z.ZodEnum<Writable<typeof DISPLAY_OPTIONS>>;
}>({
  unit: IndicatorSchema,
  attribute: AttributeSchema,
  display: DisplaySchema,
});

export const DataVizForm = () => {
  const navigate = route.useNavigate();
  const { attribute, unit, display, scenarioA, scenarioB } = route.useSearch();
  const form = useForm<z.infer<typeof DataVizFormSchema>>({
    resolver: zodResolver(DataVizFormSchema),
    defaultValues: {
      unit,
      attribute,
      display,
    },
  });

  async function onSubmit({
    attribute,
    unit,
    display,
  }: z.infer<typeof DataVizFormSchema>) {
    await navigate({
      search: (prev) => ({
        ...prev,
        attribute,
        unit,
        display,
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

  useEffect(() => {
    form.setValue("display", display);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display, scenarioA, scenarioB]);

  return (
    <Form {...form}>
      <form
        onSubmit={void form.handleSubmit(onSubmit)}
        className={cn("flex flex-wrap gap-5")}
      >
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem data-testid={SELECT_UNIT_TESTID}>
              <FormLabel className={cn("font-medium")}>Indicator:</FormLabel>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                  </SelectMenuStyle>
                </FormControl>
                <SelectContent>
                  {INDICATORS.map((unit) => (
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
              <FormLabel className={cn("font-medium")}>Breakdown by:</FormLabel>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select what to breakdown" />
                    </SelectTrigger>
                  </SelectMenuStyle>
                </FormControl>
                <SelectContent>
                  {ATTRIBUTES.map((attribute) => (
                    <SelectItem key={attribute} value={attribute}>
                      {attribute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="display"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn("font-medium")}>Display:</FormLabel>
              <Select
                onValueChange={(value) => {
                  onSelectChange({
                    fieldOnChange: field.onChange,
                    form,
                    value,
                  });
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectMenuStyle>
                    <SelectTrigger data-testid={DISPLAY_SELECT_TESTID}>
                      <SelectValue placeholder="Select what to breakdown" />
                    </SelectTrigger>
                  </SelectMenuStyle>
                </FormControl>
                <SelectContent>
                  <SelectItem value={SCENARIO_A_ONLY}>
                    {`${scenarioA} only`}
                  </SelectItem>
                  <SelectItem value={SCENARIO_B_ONLY}>
                    {`${scenarioB ?? "Scenario B"} only`}
                  </SelectItem>
                  <SelectItem value={SCENARIO_A_AND_B}>
                    {`${scenarioA} VS ${scenarioB ?? "scenario B"}`}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
