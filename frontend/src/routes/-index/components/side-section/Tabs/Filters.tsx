import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FILTERS_ORDER, PROD, ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ResetButton } from "../components/ResetButton";
import { YearSchema } from "@/lib/shared_with_backend/schemas";
import {
  MultiSelect,
  type MenuItemProps,
  type SelectOption,
} from "@/components/MultiSelect";
import { useEffect, type SetStateAction } from "react";
import { FILTERS, YEAR_KEY } from "@/lib/shared_with_backend/constants";
import { type Filters as FiltersType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { fetchFilters } from "@/lib/queries";
import { ErrorOccurred } from "@/components/ErrorOccurred";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { env } from "@/env";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

const route = getRouteApi(ROUTES.DASHBOARD);
const SelectOptionArraySchema = z
  .object({ label: z.string(), value: z.string() })
  .array();

const formSchema = z.object({
  // "flow type": SelectOptionArraySchema,
  "Element Class": SelectOptionArraySchema,
  "Building subtype": SelectOptionArraySchema,
  "Building type": SelectOptionArraySchema,
  country: SelectOptionArraySchema,
  "Material Class": SelectOptionArraySchema,
  Region: SelectOptionArraySchema,
  "building stock activity": SelectOptionArraySchema,
  "Whole life cycle stages": SelectOptionArraySchema,
  From: YearSchema.transform((number) => number.toString()),
  To: YearSchema.transform((number) => number.toString()),
} satisfies Record<(typeof FILTERS)[number], z.ZodType>);

const FilterMenuItem = ({ option, selected }: MenuItemProps) => {
  return (
    <div className={cn("flex items-center gap-2")}>
      <Checkbox
        checked={selected.some((item) => item.value === option.value)}
      />
      {option.label}
    </div>
  );
};

type AuthorizedKey = Exclude<
  (typeof FILTERS)[number] | typeof YEAR_KEY,
  "From" | "To" | "stock_projection_year"
>;

type FormatForMultiSelectArgs = {
  filters: FiltersType | undefined;
  authorizedKeys: AuthorizedKey[];
};
function formatForMultiSelect({
  filters,
  authorizedKeys,
}: FormatForMultiSelectArgs) {
  if (filters == null) {
    return undefined;
  }

  const output: Partial<Record<AuthorizedKey, SelectOption[]>> = {};

  Object.keys(filters).forEach((keyUnTyped) => {
    const key = keyUnTyped as keyof typeof filters;

    if (authorizedKeys.includes(key as AuthorizedKey)) {
      const filterItems = filters[key];
      if (filterItems && Array.isArray(filterItems)) {
        output[key as AuthorizedKey] = filterItems.map((item) => ({
          label: item,
          value: item,
        }));
      }
    }
  });

  return output;
}

type FormatForBackendArgs = {
  filters: Record<
    string,
    | Array<{
        label: string;
        value: string;
      }>
    | string
  >;
};
function formatForBackend({ filters }: FormatForBackendArgs) {
  const output: Record<keyof typeof filters, string[] | string> = {};
  for (const key in filters) {
    const value = filters[key];
    if (typeof value === "string") {
      output[key] = value;
    } else {
      const array = value.map((item) => item.value);
      if (array.length > 0) {
        output[key] = array;
      }
    }
  }

  return output;
}

export const Filters = () => {
  const { filters } = route.useSearch();
  const { isLoading, error, data } = useQuery({
    queryKey: ["filters"],
    queryFn: () => fetchFilters(),
    staleTime: Infinity,
  });

  const { [YEAR_KEY]: years = [], ...filtersWithoutTimeFilters } = data ?? {};
  const yearsOptions = years
    .map((year) => ({
      label: year.toString(),
      value: year.toString(),
    }))
    .sort((a, b) => parseInt(a.value) - parseInt(b.value));
  if (error != null && env.PUBLIC_NODE_ENV !== PROD) {
    console.error(error);
  }

  const authorizedKeys = FILTERS.filter(
    (item) => item !== "From" && item !== "To",
  );

  const valuesFromSearchParams = formatForMultiSelect({
    filters,
    authorizedKeys,
  });
  const navigate = route.useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // "flow type": [] satisfies SelectOption[],
      "Element Class": [] satisfies SelectOption[],
      "Building subtype": [] satisfies SelectOption[],
      "Building type": [] satisfies SelectOption[],
      country: [] satisfies SelectOption[],
      "Material Class": [] satisfies SelectOption[],
      Region: [] satisfies SelectOption[],
      "building stock activity": [] satisfies SelectOption[],
      "Whole life cycle stages": [] satisfies SelectOption[],
      From: "2020",
      To: "2050",
    },
  });

  useEffect(() => {
    if (valuesFromSearchParams != null) {
      Object.entries(valuesFromSearchParams).forEach(
        ([keyWithWrongType, value]) => {
          const key = keyWithWrongType as keyof typeof valuesFromSearchParams;
          form.setValue(key, value);
        },
      );
    }

    if (filters?.From != null) {
      form.setValue("From", filters.From.toString());
    }

    if (filters?.To != null) {
      form.setValue("To", filters.To.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(filters: z.infer<typeof formSchema>) {
    const formattedFilters = formatForBackend({ filters });

    await navigate({
      search: (prev) => ({
        ...prev,
        filters: formattedFilters,
      }),
    });
  }

  type OnSelectChangeArgs = {
    value: SetStateAction<SelectOption[]> | string;
    fieldOnChange: (...args: unknown[]) => void;
    form: typeof form;
  };
  function onSelectChange({ value, fieldOnChange, form }: OnSelectChangeArgs) {
    fieldOnChange(value);
    void form.handleSubmit(onSubmit)();
  }

  const reset = () => {
    form.reset();
    void form.handleSubmit(onSubmit)();
  };

  return (
    <section className={cn("flex h-full min-h-0 min-w-0 flex-1 flex-col")}>
      <h2 className={cn("sr-only")}>Filters</h2>
      <div className={cn("flex justify-end px-primary-x pb-px pt-3")}>
        <ResetButton reset={reset} text="Reset all" />
      </div>
      {!isLoading && error && <ErrorOccurred />}
      {isLoading && <LoadingSpinner />}
      {data != null && (
        <ScrollArea
          className={cn(
            "relative flex min-h-0 min-w-0 flex-1 flex-col gap-5 overflow-x-visible px-primary-x",
          )}
          type="always"
        >
          <Form {...form}>
            <form
              onSubmit={void form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className={cn("flex flex-col gap-1")}>
                <span className={cn("text-sm font-medium")}>Year:</span>
                <div className={cn("flex justify-between")}>
                  <FormField
                    control={form.control}
                    name={"From"}
                    render={({ field }) => (
                      <FormItem
                        className={cn("flex flex-row items-center gap-2")}
                      >
                        <FormLabel>From</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            onSelectChange({
                              fieldOnChange: field.onChange,
                              form,
                              value,
                            });
                          }}
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn("w-fit min-w-16 capitalize")}
                            >
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {yearsOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
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
                    name={"To"}
                    render={({ field }) => (
                      <FormItem
                        className={cn("flex flex-row items-center gap-2")}
                      >
                        <FormLabel>To</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            onSelectChange({
                              fieldOnChange: field.onChange,
                              form,
                              value,
                            });
                          }}
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn("w-fit min-w-16 capitalize")}
                            >
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {yearsOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {Object.entries(filtersWithoutTimeFilters)
                .sort(([keyA], [keyB]) => {
                  return FILTERS_ORDER.indexOf(
                    keyA.toLowerCase() as keyof typeof filtersWithoutTimeFilters,
                  ) <
                    FILTERS_ORDER.indexOf(
                      keyB.toLowerCase() as keyof typeof filtersWithoutTimeFilters,
                    )
                    ? -1
                    : 1;
                })
                .map(([keyRaw, dataValue]) => {
                  const key = keyRaw as keyof Omit<
                    typeof data,
                    typeof YEAR_KEY
                  >;
                  const options = dataValue.map((option) => ({
                    label: option,
                    value: option,
                  }));

                  return (
                    <FormField
                      key={key}
                      control={form.control}
                      name={key}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn("font-medium capitalize")}>
                            {key}:
                          </FormLabel>
                          <div className={cn("flex gap-5")}>
                            <div
                              className={cn("min-w-0 flex-1")}
                              data-testid={key}
                            >
                              <FormControl>
                                <MultiSelect
                                  {...field}
                                  options={options}
                                  MenuItem={FilterMenuItem}
                                  selected={options.filter((item) => {
                                    const shouldFilter = field.value.some(
                                      (option) => option.value === item.value,
                                    );

                                    return shouldFilter;
                                  })}
                                  onChange={(value) => {
                                    onSelectChange({
                                      value,
                                      fieldOnChange: field.onChange,
                                      form,
                                    });
                                  }}
                                />
                              </FormControl>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  );
                })}
            </form>
          </Form>
          <div
            className={cn(
              "pointer-events-none sticky inset-x-0 bottom-0 bg-gradient-to-t from-background from-10% to-transparent",
            )}
          >
            <div className={cn("h-52")}></div>
          </div>
        </ScrollArea>
      )}
    </section>
  );
};
