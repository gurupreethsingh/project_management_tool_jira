import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaEye, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import globalBackendRoute from "../../config/Config";
import ExportBar from "../../components/common_components/ExportBar";

const UNASSIGNED_ID = "__unassigned__";
const UNASSIGNED_NAME = "Unassigned";

const MIN_COL_WIDTHS = [56, 120, 260, 180, 150, 110, 130, 130, 48];
const COL_WEIGHTS = [0.05, 0.1, 0.29, 0.15, 0.12, 0.09, 0.1, 0.1, 0.04];

function buildResponsiveColWidths(containerWidth) {
  const safeWidth = Math.max(containerWidth || 0, 360);
  return COL_WEIGHTS.map((weight, index) =>
    Math.max(MIN_COL_WIDTHS[index], Math.floor(safeWidth * weight)),
  );
}

/* ---------- Search utils ---------- */
const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "of",
  "in",
  "on",
  "at",
  "to",
  "for",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "me",
  "him",
  "her",
  "us",
  "them",
  "this",
  "that",
  "these",
  "those",
  "there",
  "here",
  "please",
  "pls",
  "plz",
  "show",
  "find",
  "search",
  "look",
  "list",
  "traceability",
  "matrix",
  "scenario",
  "scenarios",
  "module",
  "modules",
  "test",
  "case",
  "cases",
  "defect",
  "named",
  "called",
]);

const norm = (s = "") =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const tokenize = (raw) => {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return [];
  return trimmed
    .split(/\s+/)
    .map(norm)
    .filter(Boolean)
    .filter((t) => !STOP_WORDS.has(t));
};

const toLocalYMD = (d) => {
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const safeStr = (v) => (v == null ? "" : String(v));
const cmpStr = (a, b) =>
  safeStr(a).localeCompare(safeStr(b), undefined, { sensitivity: "base" });

const Resizer = ({ onMouseDown }) => (
  <span
    onMouseDown={onMouseDown}
    className="absolute right-0 top-0 h-full w-2 cursor-col-resize select-none"
    title="Drag to resize"
  />
);

const RowHeightHandle = ({ onMouseDown }) => (
  <div
    onMouseDown={onMouseDown}
    className="absolute bottom-0 left-0 h-2 w-full cursor-row-resize"
    title="Drag to resize row"
  />
);

export default function TraceabilityMatrix() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [matrix, setMatrix] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [projectName, setProjectName] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const [totalScenarios, setTotalScenarios] = useState(0);
  const [totalTestCases, setTotalTestCases] = useState(0);
  const [passCount, setPassCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [defectReportCount, setDefectReportCount] = useState(0);
  const [missingTestCasesCount, setMissingTestCasesCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);

  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const tableContainerRef = useRef(null);
  const userResizedColumnsRef = useRef(false);

  const [colW, setColW] = useState(() =>
    buildResponsiveColWidths(
      typeof window !== "undefined" ? window.innerWidth : 1400,
    ),
  );
  const dragRef = useRef(null);

  const [rowHeights, setRowHeights] = useState({});
  const rowDragRef = useRef(null);

  useEffect(() => {
    const updateWidths = () => {
      if (userResizedColumnsRef.current) return;

      const containerWidth =
        tableContainerRef.current?.clientWidth || window.innerWidth;

      setColW(buildResponsiveColWidths(containerWidth));
    };

    updateWidths();
    window.addEventListener("resize", updateWidths);
    return () => window.removeEventListener("resize", updateWidths);
  }, []);

  const gridTemplateColumns = useMemo(
    () => colW.map((w) => `${Math.max(32, Number(w) || 0)}px`).join(" "),
    [colW],
  );

  const startColResize = useCallback(
    (colIndex, e) => {
      e.preventDefault();
      e.stopPropagation();

      userResizedColumnsRef.current = true;

      const startX = e.clientX;
      const startW = colW[colIndex] || 60;

      dragRef.current = { colIndex, startX, startW };

      const onMove = (ev) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const next = Math.max(32, dragRef.current.startW + dx);
        setColW((prev) => {
          const cp = [...prev];
          cp[colIndex] = next;
          return cp;
        });
      };

      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        dragRef.current = null;
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [colW],
  );

  const startRowResize = useCallback(
    (rowId, e) => {
      e.preventDefault();
      e.stopPropagation();

      const startY = e.clientY;
      const startH = rowHeights[rowId] || 42;

      rowDragRef.current = { rowId, startY, startH };

      const onMove = (ev) => {
        if (!rowDragRef.current) return;
        const dy = ev.clientY - rowDragRef.current.startY;
        const next = Math.max(42, rowDragRef.current.startH + dy);
        setRowHeights((prev) => ({
          ...prev,
          [rowId]: next,
        }));
      };

      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        rowDragRef.current = null;
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [rowHeights],
  );

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const auth = token
          ? {
              headers: { Authorization: `Bearer ${token}` },
              signal: controller.signal,
            }
          : { signal: controller.signal };

        const [matrixRes, scenariosRes, projectRes] = await Promise.all([
          axios.get(
            `${globalBackendRoute}/api/projects/${projectId}/traceability-matrix`,
            auth,
          ),
          axios.get(
            `${globalBackendRoute}/api/single-project/${projectId}/view-all-scenarios`,
            auth,
          ),
          axios.get(
            `${globalBackendRoute}/api/single-project/${projectId}`,
            auth,
          ),
        ]);

        if (!alive) return;

        const m = Array.isArray(matrixRes.data) ? matrixRes.data : [];
        const s = Array.isArray(scenariosRes.data) ? scenariosRes.data : [];
        const p = projectRes?.data || {};

        setMatrix(m);
        setScenarios(s);

        const pn =
          p.projectName ||
          p.project_name ||
          p.name ||
          p.title ||
          s?.[0]?.project?.project_name ||
          s?.[0]?.project?.projectName ||
          "";
        setProjectName(pn);

        setTotalScenarios(m.length);
        setTotalTestCases(m.filter((i) => i.testCaseNumber).length);
        setPassCount(m.filter((i) => i.testCaseStatus === "Pass").length);
        setFailCount(m.filter((i) => i.testCaseStatus === "Fail").length);
        setDefectReportCount(
          m.filter((i) => i.defectReportStatus === "Present").length,
        );
        setMissingTestCasesCount(
          m.filter((i) => !i.testCaseNumber || i.testCaseNumber === "Missing")
            .length,
        );
        setCurrentPage(1);
      } catch (err) {
        if (!axios.isCancel?.(err)) {
          console.error("Error fetching data:", err?.message || err);
        }
      }
    };

    fetchAll();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [projectId]);

  const scenarioNumToScenarioMeta = useMemo(() => {
    const map = new Map();
    for (const s of scenarios) {
      const key = s?.scenario_number?.toString();
      if (!key) continue;

      const modules =
        Array.isArray(s?.modules) && s.modules.length
          ? s.modules.filter(Boolean).map((m) =>
              typeof m === "object"
                ? {
                    _id: m?._id || UNASSIGNED_ID,
                    name: m?.name || UNASSIGNED_NAME,
                  }
                : { _id: m, name: "" },
            )
          : s?.module?._id || s?.module?.name
            ? [
                {
                  _id: s?.module?._id || UNASSIGNED_ID,
                  name: s?.module?.name || UNASSIGNED_NAME,
                },
              ]
            : [];

      map.set(key, {
        _id: s?._id || "",
        createdAt: s?.createdAt || "",
        modules,
      });
    }
    return map;
  }, [scenarios]);

  const getRowModules = useCallback(
    (row) => {
      const sn = row?.scenarioNumber?.toString();
      const meta = scenarioNumToScenarioMeta.get(sn);
      const mods = meta?.modules || [];
      if (mods.length) return mods;
      return [{ _id: UNASSIGNED_ID, name: UNASSIGNED_NAME }];
    },
    [scenarioNumToScenarioMeta],
  );

  const availableDates = useMemo(() => {
    const set = new Set();
    for (const row of matrix) {
      const sn = row?.scenarioNumber?.toString();
      const ymd = toLocalYMD(scenarioNumToScenarioMeta.get(sn)?.createdAt);
      if (ymd) set.add(ymd);
    }
    return Array.from(set).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }, [matrix, scenarioNumToScenarioMeta]);

  const hasSelectedDate = Boolean(String(selectedDate || "").trim());
  const isSelectedDateValid = useMemo(() => {
    if (!hasSelectedDate) return true;
    return availableDates.includes(selectedDate);
  }, [availableDates, hasSelectedDate, selectedDate]);

  const modules = useMemo(() => {
    const counts = new Map();

    for (const row of matrix) {
      const mods = getRowModules(row);
      const seen = new Set();

      for (const m of mods) {
        const id = String(m?._id || UNASSIGNED_ID);
        if (seen.has(id)) continue;
        seen.add(id);

        if (!counts.has(id)) {
          counts.set(id, {
            _id: id,
            name: m?.name || UNASSIGNED_NAME,
            count: 0,
          });
        }
        counts.get(id).count += 1;
      }
    }

    return Array.from(counts.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
  }, [matrix, getRowModules]);

  const dq = useDeferredValue(searchQuery);
  const dd = useDeferredValue(selectedDate);
  const dm = useDeferredValue(selectedModuleId);

  const filtered = useMemo(() => {
    if (dd && !availableDates.includes(dd)) return [];

    const tokens = tokenize(dq);

    return matrix.filter((row) => {
      const sn = row?.scenarioNumber?.toString();
      const meta = scenarioNumToScenarioMeta.get(sn);
      const rowDate = toLocalYMD(meta?.createdAt);

      if (dd && rowDate !== dd) return false;

      if (dm) {
        const mods = getRowModules(row).map((m) => String(m._id));
        if (!mods.includes(String(dm))) return false;
      }

      if (!tokens.length) return true;

      const hay = norm(
        [
          row?.scenarioNumber || "",
          row?.scenarioText || "",
          row?.testCaseNumber || "",
          row?.defectNumber || "",
          row?.testCaseStatus || "",
          row?.defectReportStatus || "",
          rowDate,
          getRowModules(row)
            .map((m) => m.name)
            .join(" "),
        ].join(" "),
      );

      return tokens.some((t) => hay.includes(t));
    });
  }, [
    matrix,
    dq,
    dd,
    dm,
    availableDates,
    scenarioNumToScenarioMeta,
    getRowModules,
  ]);

  const sortedFiltered = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;

    const getVal = (row) => {
      const sn = row?.scenarioNumber?.toString();
      const meta = scenarioNumToScenarioMeta.get(sn);

      if (sortKey === "scenarioNumber") return row?.scenarioNumber || "";
      if (sortKey === "scenarioText") return row?.scenarioText || "";
      if (sortKey === "modules")
        return getRowModules(row)
          .map((m) => m.name || m._id)
          .join(", ");
      if (sortKey === "testCaseNumber") return row?.testCaseNumber || "";
      if (sortKey === "testCaseStatus") return row?.testCaseStatus || "";
      if (sortKey === "defectNumber") return row?.defectNumber || "";
      if (sortKey === "defectReportStatus")
        return row?.defectReportStatus || "";
      if (sortKey === "createdAt")
        return new Date(meta?.createdAt || 0).getTime();

      return "";
    };

    arr.sort((a, b) => {
      const va = getVal(a);
      const vb = getVal(b);

      if (sortKey === "createdAt") return (va - vb) * dir;
      return cmpStr(va, vb) * dir;
    });

    return arr;
  }, [filtered, sortKey, sortDir, scenarioNumToScenarioMeta, getRowModules]);

  useEffect(() => {
    setFilteredCount(sortedFiltered.length);
    const pages = Math.max(1, Math.ceil(sortedFiltered.length / itemsPerPage));
    setTotalPages(pages);
    setCurrentPage((p) => Math.min(p, pages));
  }, [sortedFiltered, itemsPerPage]);

  const handlePageSizeChange = useCallback((e) => {
    const v = e.target.value;
    const next = v === "ALL" ? 1000000000 : Number(v);
    setItemsPerPage(next);
    setCurrentPage(1);
  }, []);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const pageSlice = useMemo(
    () => sortedFiltered.slice(indexOfFirst, indexOfLast),
    [sortedFiltered, indexOfFirst, indexOfLast],
  );

  const [renderCount, setRenderCount] = useState(60);
  useEffect(() => {
    setRenderCount(60);
  }, [currentPage, itemsPerPage, dq, dd, dm, sortKey, sortDir]);

  useEffect(() => {
    if (renderCount >= pageSlice.length) return;
    const id = window.requestAnimationFrame(() => {
      setRenderCount((c) => Math.min(pageSlice.length, c + 80));
    });
    return () => window.cancelAnimationFrame(id);
  }, [renderCount, pageSlice.length]);

  const current = useMemo(
    () => pageSlice.slice(0, renderCount),
    [pageSlice, renderCount],
  );

  const onModuleClick = useCallback((id) => {
    setSelectedModuleId((prev) => (prev === id ? null : id));
    setCurrentPage(1);
  }, []);

  const clearModuleSelection = useCallback(() => {
    setSelectedModuleId(null);
    setCurrentPage(1);
  }, []);

  const clearDateSelection = useCallback(() => {
    setSelectedDate("");
    setCurrentPage(1);
  }, []);

  const onHeaderSort = useCallback(
    (key) => {
      if (sortKey === key) {
        setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir(key === "createdAt" ? "desc" : "asc");
      }
    },
    [sortKey],
  );

  const handlePageChange = useCallback(
    (newPage) => setCurrentPage(newPage),
    [],
  );

  const handleRowClick = useCallback(
    (row) => {
      const sn = row?.scenarioNumber?.toString();
      const scenarioId = scenarioNumToScenarioMeta.get(sn)?._id;
      if (scenarioId) {
        navigate(`/single-project/${projectId}/scenario-history/${scenarioId}`);
      }
    },
    [navigate, projectId, scenarioNumToScenarioMeta],
  );

  const ModuleChips = memo(function ModuleChips({ row, max = 3 }) {
    const mods = getRowModules(row);
    if (!mods.length) {
      return (
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700">
          {UNASSIGNED_NAME}
        </span>
      );
    }

    const show = mods.slice(0, max);
    const extra = mods.length - show.length;

    return (
      <span className="flex flex-wrap gap-1">
        {show.map((m) => (
          <span
            key={m._id}
            className="inline-flex max-w-full items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 whitespace-normal break-words"
          >
            {m.name || m._id}
          </span>
        ))}
        {extra > 0 && (
          <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600">
            +{extra}
          </span>
        )}
      </span>
    );
  });

  const exportRows = useMemo(() => {
    return sortedFiltered.map((r, idx) => ({
      ...r,
      __rowIndex: idx + 1,
      __createdAt: toLocalYMD(
        scenarioNumToScenarioMeta.get(r?.scenarioNumber?.toString())?.createdAt,
      ),
    }));
  }, [sortedFiltered, scenarioNumToScenarioMeta]);

  const exportCols = useMemo(() => {
    return [
      { header: "#", value: (r) => r.__rowIndex },
      { header: "Scenario", value: (r) => r?.scenarioNumber || "" },
      { header: "Text", value: (r) => r?.scenarioText || "" },
      {
        header: "Modules",
        value: (r) =>
          getRowModules(r)
            .map((m) => m.name || m._id)
            .join(", "),
      },
      { header: "Test Case #", value: (r) => r?.testCaseNumber || "" },
      { header: "Status", value: (r) => r?.testCaseStatus || "" },
      { header: "Defect #", value: (r) => r?.defectNumber || "" },
      { header: "Defect Report", value: (r) => r?.defectReportStatus || "" },
      { header: "Created On", value: (r) => r.__createdAt || "" },
    ];
  }, [getRowModules]);

  const getStatusClass = (status) => {
    if (status === "Pass") return "text-emerald-600";
    if (status === "Fail") return "text-rose-600";
    return "text-slate-600";
  };

  const getDefectReportClass = (status) => {
    if (status === "Present") return "text-emerald-600";
    if (!status || status === "Missing") return "text-rose-600";
    return "text-slate-600";
  };

  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        <div className="space-y-3 flex flex-wrap">
          <div>
            <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
              Traceability Matrix for Project: {projectName || projectId}
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Total Scenarios: {totalScenarios}
            </p>

            <p className="text-[11px] text-slate-600 mt-1">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 mr-1 font-medium text-slate-700">
                Expected Test Cases: {totalTestCases}
              </span>
              <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 mr-1 font-medium text-rose-700">
                Missing Test Cases: {missingTestCasesCount}
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 mr-1 font-medium text-emerald-700">
                Pass: {passCount}
              </span>
              <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 mr-1 font-medium text-rose-700">
                Fail: {failCount}
              </span>
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
                Defect Reports Present: {defectReportCount}
              </span>
            </p>

            {(searchQuery || selectedModuleId || selectedDate) && (
              <p className="text-xs text-gray-600">
                Showing {filteredCount} result(s)
                {searchQuery ? <> for “{searchQuery}”</> : null}
                {selectedModuleId ? " in selected module" : null}
                {selectedDate ? ` on ${selectedDate}` : null}
              </p>
            )}

            {hasSelectedDate && !isSelectedDateValid && (
              <p className="text-xs text-rose-600 mt-1">
                No traceability rows found for {selectedDate}.
              </p>
            )}
          </div>

          <div className="w-full overflow-x-auto pb-1">
            <div className="flex flex-wrap items-center gap-3 min-w-max">
              <div className="relative shrink-0">
                <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  className="pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none"
                  placeholder="Search scenario, module, testcase, defect..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  spellCheck={false}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <input
                  type="date"
                  list="traceability-dates"
                  className="px-2 py-1.5 text-sm border rounded-md focus:outline-none"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  title="Filter by date"
                />
                <datalist id="traceability-dates">
                  {availableDates.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>

                <button
                  onClick={clearDateSelection}
                  className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100 whitespace-nowrap"
                  title="Clear date"
                >
                  Clear
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <label className="text-xs text-slate-600 whitespace-nowrap">
                  Rows:
                </label>
                <select
                  value={
                    itemsPerPage >= 1000000000 ? "ALL" : String(itemsPerPage)
                  }
                  onChange={handlePageSizeChange}
                  className="px-2 py-1.5 text-sm border rounded-md focus:outline-none"
                  title="Rows per page"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="40">40</option>
                  <option value="60">60</option>
                  <option value="ALL">All</option>
                </select>
              </div>

              <div className="shrink-0">
                <ExportBar
                  rows={exportRows}
                  columns={exportCols}
                  fileBaseName={`TraceabilityMatrix_${projectName || projectId}`}
                  title={`Traceability Matrix Export - ${projectName || projectId}`}
                />
              </div>

              <Link
                to={`/single-project/${projectId}`}
                className="inline-flex shrink-0 whitespace-nowrap px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm"
              >
                Project Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-slate-700">
              Filter by Module
            </h3>
            <button
              onClick={clearModuleSelection}
              className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
            >
              Clear
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {modules.map((m) => {
              const active = selectedModuleId === m._id;
              return (
                <button
                  key={m._id}
                  onClick={() => onModuleClick(m._id)}
                  className={`max-w-full px-3 py-1 rounded-full border text-[12px] leading-snug text-left whitespace-normal break-words ${
                    active
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                  title={`${m.name} (${m.count})`}
                >
                  {m.name} <span className="opacity-70 ml-1">({m.count})</span>
                </button>
              );
            })}
            {modules.length === 0 && (
              <span className="text-slate-500 text-sm">No modules found</span>
            )}
          </div>
        </div>

        <div className="mt-5">
          <div ref={tableContainerRef} className="overflow-x-auto">
            <div
              className="relative grid items-center text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200 min-w-max"
              style={{ gridTemplateColumns }}
            >
              {[
                { label: "#", key: null },
                { label: "Scenario", key: "scenarioNumber" },
                { label: "Text", key: "scenarioText" },
                { label: "Modules", key: "modules" },
                { label: "TestCase #", key: "testCaseNumber" },
                { label: "Status", key: "testCaseStatus" },
                { label: "Defect #", key: "defectNumber" },
                { label: "Defect Report", key: "defectReportStatus" },
                { label: "View", key: null },
              ].map((col, i) => (
                <div
                  key={col.label}
                  className={`relative ${i >= 8 ? "text-center" : ""} pr-2`}
                >
                  <span
                    className={
                      col.key
                        ? "cursor-pointer select-none hover:text-slate-900"
                        : ""
                    }
                    onClick={() => col.key && onHeaderSort(col.key)}
                    title={
                      col.key
                        ? `Sort by ${col.label} (${sortKey === col.key ? sortDir : "asc"})`
                        : undefined
                    }
                  >
                    {col.label}
                  </span>

                  {i < colW.length - 1 ? (
                    <Resizer onMouseDown={(e) => startColResize(i, e)} />
                  ) : null}
                </div>
              ))}
            </div>

            <div className="divide-y divide-slate-200 min-w-max">
              {current.map((row, idx) => {
                const sn = row?.scenarioNumber?.toString();
                const scenarioId = scenarioNumToScenarioMeta.get(sn)?._id;
                return (
                  <div
                    key={`${row?.scenarioNumber || "row"}-${idx}`}
                    onClick={() => handleRowClick(row)}
                    className={`relative grid items-start text-[12px] px-3 py-2 overflow-visible hover:bg-slate-50 ${
                      scenarioId ? "cursor-pointer" : ""
                    }`}
                    style={{
                      gridTemplateColumns,
                      minHeight:
                        rowHeights[`${row?.scenarioNumber}-${idx}`] || 42,
                      height:
                        rowHeights[`${row?.scenarioNumber}-${idx}`] || "auto",
                    }}
                    title={
                      scenarioId ? "Click row to view scenario" : undefined
                    }
                  >
                    <div className="text-slate-700">
                      {indexOfFirst + idx + 1}
                    </div>

                    <div className="text-slate-900 font-medium whitespace-normal break-words leading-snug">
                      {row?.scenarioNumber || "-"}
                    </div>

                    <div className="text-slate-700 whitespace-normal break-words leading-snug">
                      {row?.scenarioText || "-"}
                    </div>

                    <div className="whitespace-normal break-words">
                      <ModuleChips row={row} />
                    </div>

                    <div
                      className={`whitespace-normal break-words leading-snug ${
                        row?.testCaseNumber === "Missing"
                          ? "text-rose-600 font-semibold"
                          : "text-slate-700"
                      }`}
                    >
                      {row?.testCaseNumber || "-"}
                    </div>

                    <div
                      className={`font-semibold ${getStatusClass(row?.testCaseStatus)}`}
                    >
                      {row?.testCaseStatus || "-"}
                    </div>

                    <div className="text-slate-700 whitespace-normal break-words leading-snug">
                      {row?.defectNumber || "-"}
                    </div>

                    <div
                      className={`font-semibold ${getDefectReportClass(
                        row?.defectReportStatus,
                      )}`}
                    >
                      {row?.defectReportStatus || "-"}
                    </div>

                    <div className="flex justify-center pt-0.5">
                      {scenarioId ? (
                        <Link
                          to={`/single-project/${projectId}/scenario-history/${scenarioId}`}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="View"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaEye className="text-sm" />
                        </Link>
                      ) : (
                        <span className="text-slate-300">
                          <FaEye className="text-sm" />
                        </span>
                      )}
                    </div>

                    <RowHeightHandle
                      onMouseDown={(e) =>
                        startRowResize(`${row?.scenarioNumber}-${idx}`, e)
                      }
                    />
                  </div>
                );
              })}
            </div>

            {renderCount < pageSlice.length && (
              <div className="text-center text-xs text-slate-500 py-3">
                Rendering more…
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <FaArrowRight className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
