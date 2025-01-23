import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BREAKDOWN_BY_ORDER, PROD, RESET_LABEL, ROUTES } from "@/lib/constants";
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
import { InfoButton } from "@/components/InfoButton";
import { getValueLabel } from "@/lib/utils";

const route = getRouteApi(ROUTES.DASHBOARD);
const SelectOptionArraySchema = z
  .object({ label: z.string(), value: z.string() })
  .array();

const formSchema = z.object({
  "Element Class": SelectOptionArraySchema,
  "Building subtype": SelectOptionArraySchema,
  "Building type": SelectOptionArraySchema,
  country: SelectOptionArraySchema,
  "Material Class": SelectOptionArraySchema,
  Region: SelectOptionArraySchema,
  "building stock activity": SelectOptionArraySchema,
  "Life cycle stages": SelectOptionArraySchema,
  "Life cycle modules": SelectOptionArraySchema,
  From: YearSchema.transform((number) => number.toString()),
  To: YearSchema.transform((number) => number.toString()),
} satisfies Record<(typeof FILTERS)[number], z.ZodType>);

const FilterMenuItem = ({ option, selected }: MenuItemProps) => {
  return (
    <div className="flex items-center gap-2">
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
type DefaultValues = Record<
  keyof Omit<(typeof formSchema)["shape"], "From" | "To">,
  SelectOption[]
> &
  Record<"From" | "To", string>;

const defaultValues: DefaultValues = {
  "Element Class": [],
  "Building subtype": [],
  "Building type": [],
  country: [],
  "Material Class": [],
  Region: [],
  "building stock activity": [],
  "Life cycle stages": [],
  "Life cycle modules": [],
  From: "2020",
  To: "2050",
};

export const Filters = () => {
  const filters = route.useSearch({
    select: (search) => search.filters,
  });
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
    defaultValues,
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
      replace: true,
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
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col p-0">
      <h2 className="sr-only">Filters</h2>
      <div className="flex justify-end px-primary-x pb-px pt-3">
        <ResetButton reset={reset} text={RESET_LABEL} />
      </div>
      {!isLoading && error && <ErrorOccurred />}
      {isLoading && <LoadingSpinner />}
      {data != null && (
        <ScrollArea
          className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-5 overflow-x-visible px-primary-x"
          type="always"
        >
          <Form {...form}>
            <form
              onSubmit={void form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">Year:</span>
                <div className="flex justify-between">
                  <FormField
                    control={form.control}
                    name={"From"}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2">
                        <FormLabel className="text-sm">From</FormLabel>
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
                            <SelectTrigger className="w-fit min-w-16 capitalize">
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
                      <FormItem className="flex flex-row items-center gap-2">
                        <FormLabel className="text-sm">To</FormLabel>
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
                            <SelectTrigger className="w-fit min-w-16 capitalize">
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
                  return BREAKDOWN_BY_ORDER.indexOf(
                    keyA.toLowerCase() as keyof typeof filtersWithoutTimeFilters,
                  ) <
                    BREAKDOWN_BY_ORDER.indexOf(
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
                    label: getValueLabel({ value: option }),
                    value: option,
                  }));

                  return (
                    <FormField
                      key={key}
                      control={form.control}
                      name={key}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center font-medium capitalize">
                            {key}:
                            <InfoButton disabled={true} className="invisible">
                              This is just to have the exact same design as the
                              other label with info buttons
                            </InfoButton>
                          </FormLabel>
                          <div className="flex gap-5">
                            <div className="min-w-0 flex-1" data-testid={key}>
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
          <div className="pointer-events-none sticky inset-x-0 bottom-0 bg-gradient-to-t from-background from-10% to-transparent">
            <div className="h-52"></div>
          </div>
        </ScrollArea>
      )}
    </section>
  );
};
