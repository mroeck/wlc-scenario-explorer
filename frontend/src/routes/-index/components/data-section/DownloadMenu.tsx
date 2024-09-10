import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import domtoimage from "dom-to-image";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import type { fetchScenarioRowsAggregated } from "@/lib/queries";
import {
  DOWNLOAD_AS_TESTID,
  imageFormats,
  LINKS,
  spreadsheetFormats,
} from "@/lib/constants";
import { unparse } from "papaparse";

const sourceText = `source: ${LINKS.explorerWebsite}`;

type ImageFormat = (typeof imageFormats)[number];
type SpreadsheetFormat = (typeof spreadsheetFormats)[number];

type ExportAsImageArgs = {
  format: ImageFormat;
  domTarget: Parameters<typeof domtoimage.toPng>[0];
};
async function exportAsImage({ format, domTarget }: ExportAsImageArgs) {
  const exportOptions = {
    png: () =>
      domtoimage.toPng(domTarget).then(async (dataUrl) => {
        const finalImage = await addSourceToImage(dataUrl, format);
        saveImage(finalImage, format);
      }),
    jpeg: () =>
      domtoimage.toJpeg(domTarget).then(async (dataUrl) => {
        const finalImage = await addSourceToImage(dataUrl, format);
        saveImage(finalImage, format);
      }),
    svg: () =>
      domtoimage.toSvg(domTarget).then((dataUrl) => {
        const finalSvg = addSourceToSvg(dataUrl);
        saveImage(finalSvg, "svg");
      }),
    pdf: () => {
      void exportAsPdf({ domTarget });
    },
  };

  await exportOptions[format]();
}

function addSourceToSvg(dataUrl: string) {
  let textYvalue = 0;
  const firstSvgChildOpeningTag = "<foreignObject";

  const updatedHeightSvg = dataUrl.replace(
    /height="(\d+)"/,
    (_, heightFoundAsString) => {
      const currentHeight = parseInt(heightFoundAsString as string);
      const newHeight = currentHeight + 45;
      textYvalue = newHeight - 10;
      return `height="${newHeight.toString()}"`;
    },
  );

  const sourceAsSvg = `
    <rect x="0" y="0" width="100%" height="100%" fill="white" />
    <text xmlns="http://www.w3.org/2000/svg" x="50%" y="${textYvalue.toString()}" text-anchor="middle" font-size="16" fill="black">source: ${LINKS.explorerWebsite}</text>
  `;

  return updatedHeightSvg.replace(
    firstSvgChildOpeningTag,
    sourceAsSvg + firstSvgChildOpeningTag,
  );
}

function addSourceToImage(dataUrl: string, format: string) {
  const img = new Image();
  img.src = dataUrl;

  return new Promise<string>((resolve) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height + 30;

      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0);

        ctx.font = "16px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(sourceText, canvas.width / 2, canvas.height - 10);

        const finalDataUrl = canvas.toDataURL(`image/${format}`);
        resolve(finalDataUrl);
      }
    };
  });
}

function saveImage(dataUrl: string, format: string): void {
  const link = document.createElement("a");
  const fileType = format || dataUrl.split(";")[0].split("/")[1];
  link.download = `chart.${fileType}`;
  link.href = dataUrl;
  link.click();
}

type ExportAsPdfArgs = {
  domTarget: Parameters<typeof domtoimage.toPng>[0];
};
async function exportAsPdf({ domTarget }: ExportAsPdfArgs) {
  const imgData = await domtoimage.toPng(domTarget);
  const pdf = new jsPDF();
  const imgProps = pdf.getImageProperties(imgData);

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pdfWidth, pdfHeight + 30, "F");
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(sourceText, pdfWidth / 2, pdfHeight + 20, { align: "center" });

  pdf.save("scenario.pdf");
}

type Data = Array<unknown>;
type ExportAsSpreadsheetArgs = {
  format: SpreadsheetFormat;
  data: Data;
};
const exportAsSpreadsheet = ({ format, data }: ExportAsSpreadsheetArgs) => {
  if (format === "xlsx") {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "scenario");

    const infoData = [[sourceText]];

    const infoWorksheet = XLSX.utils.aoa_to_sheet(infoData);

    XLSX.utils.book_append_sheet(workbook, infoWorksheet, "Info");

    XLSX.writeFile(workbook, `scenario.${format}`, { bookType: format });
  } else {
    exportAsCsv({ data });
  }
};

type ExportAsCsvArgs = {
  data: Data;
};
function exportAsCsv({ data }: ExportAsCsvArgs) {
  const dataCSV = unparse(data);
  const documentationText = [[], [sourceText]];
  const documentationCSV = unparse(documentationText);
  const combinedCSV = `${dataCSV}\n\n${documentationCSV}`;

  const blob = new Blob([combinedCSV], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "scenario.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

type DownloadMenuProps = {
  domTarget: Parameters<typeof domtoimage.toPng>[0];
  data: Awaited<ReturnType<typeof fetchScenarioRowsAggregated>>;
};
export const DownloadMenu = ({ domTarget, data }: DownloadMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger data-testid={DOWNLOAD_AS_TESTID}>
        <Download className="text-primary" />
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
