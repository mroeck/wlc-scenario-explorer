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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sourceText = `Source: ${LINKS.explorerWebsite}`;
const spreadSheetText = `
${sourceText}

Disclaimer:
This tool is part of a study contracted by the European Commission, DG GROW, on the ‘Analysis of Life-cycle Greenhouse Gas Emissions and Removals of EU Buildings and Construction.’ The views expressed in this document and on the scenario modelling tool web app are the sole responsibility of the authors and do not necessarily reflect the views of the European Commission.

License and citation:
This tool has been developed as part of GROW/2022/OP/0005. Courtesy of the European Union, DG GROW. Development authored by Martin Röck, Shadwa Eissa, Benjamin Lesné, and Karen Allacker.

Licensed under a Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0) International License. When using or improving this tool or parts of it, consider giving appropriate credit. Cite as:

Röck M, Eissa S, Lesné B, and Allacker K. “Scenario Modelling Tool - Analysis of Life-cycle Greenhouse Gas Emissions and Removals of EU Buildings and Construction” European Commission DG GROW, 2024. DOI: https://doi.org/10.5281/zenodo.13315281. Web-app available online via: https://ae-scenario-explorer.cloud.set.kuleuven.be

Contact details:
We encourage users to get in touch with feedback and/or questions on both the study and the tool:

    Tool Development Lead, KU Leuven: Martin Röck (martin.roeck@kuleuven.be)
    European Commission, DG GROW: Philippe Moseley (philippe.moseley@ec.europa.eu)

An extended list of consortium members and contact details is available via the project website.`;

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
    <text xmlns="http://www.w3.org/2000/svg" x="50%" y="${textYvalue.toString()}" text-anchor="middle" font-size="16" fill="black">${sourceText}</text>
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

    const infoData = [[spreadSheetText]];

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
  const documentationText = [[], [spreadSheetText]];
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
  domTarget: Parameters<typeof domtoimage.toPng>[0] | null;
  data:
    | Awaited<ReturnType<typeof fetchScenarioRowsAggregated>>["data"]
    | undefined;
};
export const DownloadMenu = ({ domTarget, data }: DownloadMenuProps) => {
  const isReady = !!data && !!domTarget;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger data-testid={DOWNLOAD_AS_TESTID} disabled={!isReady}>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Download
            className={cn(
              !isReady && "cursor-wait text-gray-300",
              isReady && "text-primary",
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Download as:</DropdownMenuLabel>
        <DropdownMenuGroup>
          {imageFormats.map((format) => (
            <DropdownMenuItem
              key={format}
              onClick={() =>
                isReady && void exportAsImage({ domTarget, format })
              }
            >
              {format}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          {spreadsheetFormats.map((format) => (
            <DropdownMenuItem
              key={format}
              onClick={() => {
                isReady && exportAsSpreadsheet({ data, format });
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
