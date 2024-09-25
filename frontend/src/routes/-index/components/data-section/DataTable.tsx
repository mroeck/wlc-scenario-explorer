import { DataTableGeneric } from "@/components/DataTableGeneric";
import { NoDataFound } from "@/components/NoDataFound";
import { Button } from "@/components/ui/button";
import type { ScenarioRowsAggregatedArraySchema } from "@/lib/schemas";
import { YEAR_KEY } from "@/lib/shared_with_backend/constants";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { z } from "zod";
import type { UnitMinified } from "./types";

type DataTableProps = {
  data: z.infer<typeof ScenarioRowsAggregatedArraySchema>;
  unit: UnitMinified;
};
export const DataTable = ({ data, unit }: DataTableProps) => {
  if (data.length < 1) {
    return <NoDataFound />;
  }
  const columns: ColumnDef<(typeof data)[0]>[] = Object.keys(data[0]).map(
    (key) => ({
      accessorKey: key,
      header: ({ column }) => {
        const unitString = key === YEAR_KEY ? "" : ` (${unit})`;

        return (
          <Button
            variant="ghost"
            onClick={() => {
              const sort =
                column.getIsSorted() === false ||
                column.getIsSorted() === "asc";
              column.toggleSorting(sort);
            }}
          >
            {key.replace(/_/g, " ")}
            {unitString}
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
    }),
  );

  return <DataTableGeneric columns={columns} data={data} />;
};
