import type { Replace } from "type-fest";

export type FormatString<T extends string> = Replace<
  Replace<Lowercase<T>, " ", "_", { all: true }>,
  "-",
  "_",
  { all: true }
>;

export function format_scenario_parameter_for_backend<Input extends string>(
  parameter: Input,
): FormatString<Input> {
  return parameter
    .toLowerCase()
    .replaceAll(" ", "_")
    .replaceAll("-", "_") as FormatString<Input>;
}
