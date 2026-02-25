import React, { useMemo, useState } from "react";
import { exportToExcel } from "./ExportToExcel";
import { exportToWord } from "./ExportToWord";

export default function ExportBar({
  rows = [],
  columns = [],
  fileBaseName = "export",
  title = "Export",
}) {
  const [mode, setMode] = useState("ALL"); // ALL | N
  const [n, setN] = useState(10);

  const limitedRows = useMemo(() => {
    const safe = Array.isArray(rows) ? rows : [];
    if (mode === "ALL") return safe;
    const nn = Math.max(1, Number(n) || 1);
    return safe.slice(0, nn);
  }, [rows, mode, n]);

  const stamp = () => {
    const d = new Date();
    const pad = (x) => String(x).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(
      d.getHours(),
    )}${pad(d.getMinutes())}`;
  };

  const onExcel = () => {
    exportToExcel({
      rows: limitedRows,
      columns,
      fileName: `${fileBaseName}_${stamp()}.xlsx`,
      sheetName: "Export",
    });
  };

  const onWord = async () => {
    await exportToWord({
      rows: limitedRows,
      columns,
      fileName: `${fileBaseName}_${stamp()}.docx`,
      title,
    });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-slate-600">Export:</span>

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="px-2 py-1.5 text-sm border rounded-md"
        title="How many rows to export"
      >
        <option value="ALL">All</option>
        <option value="N">First N</option>
      </select>

      {mode === "N" && (
        <input
          type="number"
          min={1}
          value={n}
          onChange={(e) => setN(e.target.value)}
          className="w-24 px-2 py-1.5 text-sm border rounded-md"
          title="Enter number of rows"
        />
      )}

      <button
        onClick={onExcel}
        className="px-3 py-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-800 text-sm"
        title="Export to Excel"
      >
        Export Excel
      </button>

      <button
        onClick={onWord}
        className="px-3 py-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-800 text-sm"
        title="Export to Word"
      >
        Export Word
      </button>

      <span className="text-xs text-slate-500">
        Rows: {limitedRows.length} / {Array.isArray(rows) ? rows.length : 0}
      </span>
    </div>
  );
}
