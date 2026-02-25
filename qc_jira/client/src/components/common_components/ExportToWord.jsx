import { Document, Packer, Paragraph, Table, TableRow, TableCell } from "docx";
import { saveAs } from "file-saver";

export async function exportToWord({
  rows = [],
  columns = [],
  fileName = "export.docx",
  title = "Export",
}) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const safeCols = Array.isArray(columns) ? columns : [];

  const headerRow = new TableRow({
    children: safeCols.map(
      (c) =>
        new TableCell({
          children: [new Paragraph(String(c.header || ""))],
        }),
    ),
  });

  const bodyRows = safeRows.map(
    (r) =>
      new TableRow({
        children: safeCols.map(
          (c) =>
            new TableCell({
              children: [new Paragraph(String(c.value(r) ?? ""))],
            }),
        ),
      }),
  );

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: title, heading: "Heading1" }),
          new Table({
            rows: [headerRow, ...bodyRows],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName);
}
