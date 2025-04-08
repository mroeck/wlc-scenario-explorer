import {
  DOWNLOAD_AS_TESTID,
  ROUTES,
  SHORTCUT_LINK_TESTID,
  imageFormats,
  spreadsheetFormats,
} from "@/lib/constants";
import { test, expect } from "@playwright/test";
import { TAGS } from "@tests/constants";
import { waitLoadingEnds } from "@tests/functions";
import * as XLSX from "xlsx";

test.describe("dashboard download", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only!");
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD + "?animation=false");
    await waitLoadingEnds({ page });
  });

  const formats = [...imageFormats, ...spreadsheetFormats] as const;

  for (let i = 0; i < formats.length; i++) {
    const format = formats[i];

    if (format === "pdf") continue;

    test(`as ${format}`, { tag: TAGS.snapshot }, async ({ page }) => {
      await page.getByTestId(DOWNLOAD_AS_TESTID).click();

      const downloadPromise = page.waitForEvent("download");
      await page.getByRole("menuitem", { name: format }).click();
      const download = await downloadPromise;

      const stream = await download.createReadStream();
      const chunks: Buffer[] = [];

      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);
      const filenameRaw = download.suggestedFilename();
      const filename = filenameRaw.replace(".svg+xml", ".svg");
      const MAX_DECIMALS = 6;

      // After six decimal places, the values may vary due to floating point precision, to prevent false negatives we round to six decimals
      if (format === "csv") {
        const content = buffer.toString();
        const lines = content.split("\n");
        const processedLines = lines.map((line) => {
          const values = line.split(",");
          return values
            .map((value) => {
              const num = parseFloat(value);
              if (!isNaN(num)) {
                return num.toFixed(MAX_DECIMALS);
              }
              return value;
            })
            .join(",");
        });
        const processedContent = processedLines.join("\n");
        expect(Buffer.from(processedContent)).toMatchSnapshot(filename);
      } else if (format === "xlsx") {
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          throw new Error("No sheets found in workbook");
        }
        const worksheet = workbook.Sheets[firstSheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });

        const processedData = rawData.map((row) => {
          if (!Array.isArray(row)) return row;

          const result = row.map((cell) => {
            if (typeof cell === "number") {
              return Number(cell.toFixed(MAX_DECIMALS));
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return cell;
          });

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return result;
        });

        const processedWorksheet = XLSX.utils.aoa_to_sheet(
          processedData as unknown[][],
        );
        const processedWorkbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
          processedWorkbook,
          processedWorksheet,
          "Sheet1",
        );

        const processedBuffer = XLSX.write(processedWorkbook, {
          type: "buffer",
          bookType: "xlsx",
        }) as unknown;

        expect(processedBuffer).toMatchSnapshot(filename);
      } else {
        expect(buffer).toMatchSnapshot(filename);
      }
    });
  }

  test.describe("shortcut", () => {
    test("shortcut icon link has expected href and do not navigate on click", async ({
      page,
    }) => {
      const dialogTitle = page.getByText(
        "How to create a shortcut to the current page?",
      );

      await page.getByTestId(DOWNLOAD_AS_TESTID).click();
      await page.getByRole("menuitem", { name: "Shortcut" }).click();

      const shortcutLink =
        (await page.getByTestId(SHORTCUT_LINK_TESTID).getAttribute("href")) ??
        "could not find href of locator";

      await page.getByTestId(SHORTCUT_LINK_TESTID).click();
      await expect(dialogTitle).toBeVisible();
      await page.getByRole("button", { name: "Close" }).click();

      await expect(page).toHaveURL(shortcutLink);
    });
  });
});
