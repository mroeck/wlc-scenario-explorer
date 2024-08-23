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
import domtoimage from "dom-to-image";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import type { fetchScenarioRowsAggregated } from "@/lib/queries";
import {
  DOWNLOAD_AS_TESTID,
  imageFormats,
  spreadsheetFormats,
} from "@/lib/constants";

type ImageFormat = (typeof imageFormats)[number];
type SpreadsheetFormat = (typeof spreadsheetFormats)[number];

type ExportAsImageArgs = {
  format: ImageFormat;
  domTarget: Parameters<typeof domtoimage.toPng>[0];
};
async function exportAsImage({ format, domTarget }: ExportAsImageArgs) {
  const exportOptions = {
    png: () => domtoimage.toPng(domTarget).then(saveImage),
    jpeg: () => domtoimage.toJpeg(domTarget).then(saveImage),
    svg: () => domtoimage.toSvg(domTarget).then(saveImage),
    pdf: () => {
      void exportAsPdf({ domTarget });
    },
  };

  await exportOptions[format]();
}

function saveImage(dataUrl: string): void {
  const link = document.createElement("a");
  const fileType = dataUrl.split(";")[0].split("/")[1];
  link.download = `chart.${fileType}`;
  link.href = dataUrl;
  link.click();
}

type ExportAsPdfArgs = {
  domTarget: Parameters<typeof domtoimage.toPng>[0];
};
async function exportAsPdf({ domTarget }: ExportAsPdfArgs) {
  await domtoimage.toPng(domTarget).then((imgData) => {
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("scenario.pdf");
  });
}

type ExportAsSpreadsheetArgs = {
  format: SpreadsheetFormat;
  data: Array<unknown>;
};
const exportAsSpreadsheet = ({ format, data }: ExportAsSpreadsheetArgs) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "scenario");

  XLSX.writeFile(workbook, `scenario.${format}`, { bookType: format });
};

type DownloadMenuProps = {
  domTarget: Parameters<typeof domtoimage.toPng>[0];
  data: Awaited<ReturnType<typeof fetchScenarioRowsAggregated>>;
};
export const DownloadMenu = ({ domTarget, data }: DownloadMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger data-testid={DOWNLOAD_AS_TESTID}>
        <Download className={cn("text-primary")} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Download as:</DropdownMenuLabel>
        <DropdownMenuGroup>
          {imageFormats.map((format) => (
            <DropdownMenuItem
              key={format}
              onClick={() => void exportAsImage({ domTarget, format })}
            >
              {format}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          {spreadsheetFormats.map((format) => (
            <DropdownMenuItem
              key={format}
              onClick={() => {
                exportAsSpreadsheet({ data, format });
              }}
            >
              {format}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
