import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

const imageFormats = ["png", "jpeg", "pdf", "svg"];
const spreadsheetFormats = ["csv"];

export const DownloadMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Download className={cn("text-primary")} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Download as:</DropdownMenuLabel>
        <DropdownMenuGroup>
          {imageFormats.map((format) => (
            <DropdownMenuItem key={format}>{format}</DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          {spreadsheetFormats.map((format) => (
            <DropdownMenuItem key={format}>{format}</DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
