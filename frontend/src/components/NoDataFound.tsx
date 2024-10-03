import { NO_DATA_FOUND } from "@/lib/constants";
import { CircleAlert } from "lucide-react";

export const NoDataFound = () => {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="flex flex-col items-center justify-center space-y-4 pb-10 lg:-translate-y-1/2 lg:pb-0">
        <CircleAlert className="size-12 text-yellow-400" />
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-yellow-400">
            {NO_DATA_FOUND}
          </h2>
          <p className="max-w-prose text-muted-foreground">
            It looks like there is no data available with the current filters.
            This may be due to incompatible filter combinations, such as
            selecting a Region that does not match the chosen Country, Building
            type/Subtype mismatch or an invalid timeframe.
          </p>
        </div>
      </div>
    </div>
  );
};
