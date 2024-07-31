import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { ALL_LABEL, SELECT_ALL_LABEL } from "@/lib/constants";

export type SelectOption = {
  value: string;
  label: string;
  [key: string]: unknown;
};

export type MenuItemProps = {
  option: SelectOption;
  selected: SelectOption[];
};

interface MultiSelectProps {
  MenuItem: ({ option, selected }: MenuItemProps) => JSX.Element;
  options: SelectOption[];
  selected: SelectOption[];
  onChange: React.Dispatch<React.SetStateAction<SelectOption[]>>;
  className?: string;
  placeholder?: string;
}
const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({ MenuItem, options, selected, onChange, className, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (option: SelectOption) => {
      onChange(
        selected.some((item) => item.value === option.value)
          ? selected.filter((item) => item.value !== option.value)
          : [...selected, option],
      );
    };

    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [onChange, selected]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className={className}>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "group h-9 w-full justify-between border-slate-400 text-slate-700",
            )}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <div className="flex w-full flex-wrap items-center gap-1">
              <span className={cn("truncate")}>
                {selected.length < options.length &&
                  selected.map((item) => item.label).join(" ,")}
                {selected.length === options.length ? ALL_LABEL : null}
                {selected.length === 0 && (props.placeholder ?? ALL_LABEL)}
              </span>
            </div>
            <ChevronDown className="size-4 text-slate-700 opacity-100" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[272px] p-0">
          <Command className={className}>
            <CommandInput
              placeholder="Search ..."
              hidden={options.length < 9}
            />
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandList>
              <CommandItem
                onSelect={() => {
                  if (selected.length === options.length) {
                    onChange([]);
                  } else {
                    onChange(options);
                  }
                  setOpen(true);
                }}
              >
                <div className={cn("flex items-center gap-2")}>
                  <Checkbox checked={selected.length === options.length} />
                  <span className={cn("font-bold")}>{SELECT_ALL_LABEL}</span>
                </div>
              </CommandItem>
              <CommandSeparator />
              {options.map((option, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    handleSelect(option);
                    setOpen(true);
                  }}
                >
                  <MenuItem option={option} selected={selected} />
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
