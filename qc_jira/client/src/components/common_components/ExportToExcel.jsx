import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportToExcel({
  rows = [],
  columns = [],
  fileName = "export.xlsx",
  sheetName = "Sheet1",
}) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const safeCols = Array.isArray(columns) ? columns : [];

  const data = safeRows.map((r) => {
    const out = {};
    for (const col of safeCols) {
      out[col.header] = col.value(r);
    }
    return out;
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  const arrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
}
