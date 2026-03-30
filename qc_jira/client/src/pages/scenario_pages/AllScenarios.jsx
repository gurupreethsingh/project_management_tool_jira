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
import {
  FaSearch,
  FaEye,
  FaTrashAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";
import ExportBar from "../../components/common_components/ExportBar";

const UNASSIGNED_ID = "__unassigned__";
const UNASSIGNED_NAME = "Unassigned";

const MIN_COL_WIDTHS = [56, 120, 260, 160, 120, 110, 48, 48];
const COL_WEIGHTS = [0.06, 0.12, 0.38, 0.16, 0.12, 0.1, 0.03, 0.03];

function buildResponsiveColWidths(containerWidth) {
  const safeWidth = Math.max(containerWidth || 0, 320);

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
  "scenario",
  "scenarios",
  "module",
  "modules",
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

// yyyy-mm-dd in local time
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

export default function AllScenarios() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [scenarios, setScenarios] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalScenarios, setTotalScenarios] = useState(0);
  const [filteredScenarioCount, setFilteredScenarioCount] = useState(0);
  const [projectName, setProjectName] = useState("");

  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const tableContainerRef = useRef(null);
  const userResizedColumnsRef = useRef(false);

  // #, Scenario, Text, Modules, Created By, Created On, View, Del
  const [colW, setColW] = useState(() =>
    buildResponsiveColWidths(
      typeof window !== "undefined" ? window.innerWidth : 1200,
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

  const getScenarioModules = useCallback((s) => {
    if (Array.isArray(s?.modules) && s.modules.length) {
      return s.modules
        .filter(Boolean)
        .map((m) =>
          typeof m === "object"
            ? { _id: m._id, name: m.name }
            : { _id: m, name: "" },
        )
        .filter((m) => m && m._id);
    }
    if (s?.module?._id || s?.module?.name) {
      return [{ _id: s.module._id, name: s.module.name }];
    }
    return [];
  }, []);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const fetchScenarios = async () => {
      try {
        const response = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}/view-all-scenarios`,
          { signal: controller.signal },
        );
        if (!alive) return;
        const data = Array.isArray(response.data) ? response.data : [];
        setScenarios(data);
        setTotalScenarios(data.length);

        if (data.length > 0) {
          const pn =
            data[0]?.project?.project_name ||
            data[0]?.project?.projectName ||
            "";
          if (pn) setProjectName((prev) => prev || pn);
        }
      } catch (error) {
        if (!axios.isCancel?.(error)) {
          console.error("Error fetching scenarios:", error);
        }
      }
    };

    fetchScenarios();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [projectId]);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const fetchProjectName = async () => {
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}`,
          { signal: controller.signal },
        );
        if (!alive) return;
        const p = res.data;
        if (p) {
          const pn = p.projectName || p.project_name || p.name || p.title || "";
          if (pn) setProjectName(pn);
        }
      } catch (err) {
        if (!axios.isCancel?.(err)) {
          console.error("Error fetching project for name:", err);
        }
      }
    };

    fetchProjectName();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [projectId]);

  const availableDates = useMemo(() => {
    const set = new Set();
    for (const s of scenarios) {
      const ymd = toLocalYMD(s?.createdAt);
      if (ymd) set.add(ymd);
    }
    return Array.from(set).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }, [scenarios]);

  const hasSelectedDate = Boolean(String(selectedDate || "").trim());
  const isSelectedDateValid = useMemo(() => {
    if (!hasSelectedDate) return true;
    return availableDates.includes(selectedDate);
  }, [availableDates, hasSelectedDate, selectedDate]);

  const modules = useMemo(() => {
    const counts = new Map();
    for (const s of scenarios) {
      const mods = getScenarioModules(s);
      if (mods.length === 0) {
        if (!counts.has(UNASSIGNED_ID)) {
          counts.set(UNASSIGNED_ID, {
            _id: UNASSIGNED_ID,
            name: UNASSIGNED_NAME,
            count: 0,
          });
        }
        counts.get(UNASSIGNED_ID).count += 1;
        continue;
      }
      const seen = new Set();
      for (const m of mods) {
        const id = String(m._id);
        if (seen.has(id)) continue;
        seen.add(id);
        if (!counts.has(id)) {
          counts.set(id, { _id: id, name: m.name || "", count: 0 });
        }
        counts.get(id).count += 1;
      }
    }
    return Array.from(counts.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
  }, [scenarios, getScenarioModules]);

  const dq = useDeferredValue(searchQuery);
  const dd = useDeferredValue(selectedDate);
  const dm = useDeferredValue(selectedModuleId);

  const filtered = useMemo(() => {
    if (dd && !availableDates.includes(dd)) return [];

    const tokens = tokenize(dq);

    return scenarios.filter((scenario) => {
      if (dd) {
        const ymd = toLocalYMD(scenario?.createdAt);
        if (ymd !== dd) return false;
      }

      if (dm) {
        const mods = getScenarioModules(scenario);
        if (dm === UNASSIGNED_ID) {
          if (mods.length !== 0) return false;
        } else {
          const ids = mods.map((m) => String(m._id));
          if (!ids.includes(String(dm))) return false;
        }
      }

      if (!tokens.length) return true;

      const hay = norm(
        [
          scenario.scenario_text || "",
          scenario.scenario_number || "",
          scenario?.createdBy?.name || "",
          scenario?.project?.project_name ||
            scenario?.project?.projectName ||
            "",
          toLocalYMD(scenario?.createdAt),
          getScenarioModules(scenario)
            .map((m) => m.name)
            .join(" "),
        ].join(" "),
      );

      return tokens.some((t) => hay.includes(t));
    });
  }, [availableDates, dd, dq, dm, scenarios, getScenarioModules]);

  const sortedFiltered = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;

    const getVal = (s) => {
      if (sortKey === "scenario_number") return s?.scenario_number || "";
      if (sortKey === "scenario_text") return s?.scenario_text || "";
      if (sortKey === "project")
        return s?.project?.project_name || s?.project?.projectName || "";
      if (sortKey === "createdBy") return s?.createdBy?.name || "";
      if (sortKey === "createdAt") return new Date(s?.createdAt || 0).getTime();
      if (sortKey === "modules")
        return getScenarioModules(s)
          .map((m) => m.name || m._id)
          .join(", ");
      return "";
    };

    arr.sort((a, b) => {
      const va = getVal(a);
      const vb = getVal(b);

      if (sortKey === "createdAt") return (va - vb) * dir;
      return cmpStr(va, vb) * dir;
    });

    return arr;
  }, [filtered, sortKey, sortDir, getScenarioModules]);

  useEffect(() => {
    setFilteredScenarioCount(sortedFiltered.length);
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

  const handlePageChange = useCallback(
    (newPage) => setCurrentPage(newPage),
    [],
  );

  const handleDelete = useCallback(async (scenarioId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this scenario? This will delete all its history as well.",
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `${globalBackendRoute}/api/single-project/scenario/${scenarioId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      );
      alert("Scenario deleted successfully.");
      setScenarios((prev) => {
        const updated = prev.filter((s) => s._id !== scenarioId);
        setTotalScenarios(updated.length);
        return updated;
      });
    } catch (error) {
      console.error("Error deleting scenario:", error);
      alert("Error deleting scenario");
    }
  }, []);

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
        setSortDir("asc");
      }
    },
    [sortKey],
  );

  const handleRowClick = useCallback(
    (scenarioId) => {
      navigate(`/single-project/${projectId}/scenario-history/${scenarioId}`);
    },
    [navigate, projectId],
  );

  const ModuleChips = memo(function ModuleChips({ scenario, max = 3 }) {
    const mods = getScenarioModules(scenario);
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
            className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700"
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
    return sortedFiltered.map((r, idx) => ({ ...r, __rowIndex: idx + 1 }));
  }, [sortedFiltered]);

  const exportCols = useMemo(() => {
    return [
      { header: "#", value: (r) => r.__rowIndex },
      { header: "Scenario", value: (r) => r?.scenario_number || "" },
      { header: "Text", value: (r) => r?.scenario_text || "" },
      {
        header: "Modules",
        value: (r) =>
          getScenarioModules(r)
            .map((m) => m.name || m._id)
            .join(", "),
      },
      {
        header: "Project",
        value: (r) => r?.project?.project_name || r?.project?.projectName || "",
      },
      { header: "Created By", value: (r) => r?.createdBy?.name || "" },
      { header: "Created On", value: (r) => toLocalYMD(r?.createdAt) },
    ];
  }, [getScenarioModules]);

  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        {/* Header / Controls */}
        <div className="space-y-3 flex flex-wrap">
          <div>
            <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
              All Scenarios for Project: {projectName || projectId}
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Total Scenarios: {totalScenarios}
            </p>

            {(searchQuery || selectedModuleId || selectedDate) && (
              <p className="text-xs text-red-600">
                Showing {filteredScenarioCount} result(s)
                {searchQuery ? <> for “{searchQuery}”</> : null}
                {selectedModuleId ? " in selected module" : null}
                {selectedDate ? ` on ${selectedDate}` : null}
              </p>
            )}

            {hasSelectedDate && !isSelectedDateValid && (
              <p className="text-xs text-rose-600 mt-1">
                No scenarios were added on {selectedDate}.
              </p>
            )}
          </div>

          <div className="w-full overflow-x-auto pb-1">
            <div className="flex flex-wrap items-center gap-3 min-w-max">
              {/* Search */}
              <div className="relative shrink-0">
                <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  className="pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none"
                  placeholder="Search scenarios, modules, project, user..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  spellCheck={false}
                />
              </div>

              {/* Date filter */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <input
                  type="date"
                  list="scenario-dates"
                  className="px-2 py-1.5 text-sm border rounded-md focus:outline-none"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  title="Filter by date"
                />
                <datalist id="scenario-dates">
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

              {/* Rows per page */}
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
                  fileBaseName={`Scenarios_${projectName || projectId}`}
                  title={`Scenarios Export - ${projectName || projectId}`}
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

        {/* Module chips row */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-slate-700">
              Filter by{" "}
              <span className="text-indigo-600 underline">Module/Page</span>
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
                  className={`whitespace-nowrap px-3 py-1 rounded-full border text-[12px] ${
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

        {/* Table View */}
        <div className="mt-5">
          <div ref={tableContainerRef} className="overflow-x-auto">
            {/* Header row */}
            <div
              className="relative grid items-center text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200 min-w-max bg-light"
              style={{ gridTemplateColumns }}
            >
              {[
                { label: "#", key: null },
                { label: "Scenario", key: "scenario_number" },
                { label: "Text", key: "scenario_text" },
                { label: "Modules", key: "modules" },
                { label: "Created By", key: "createdBy" },
                { label: "Created On", key: "createdAt" },
                { label: "View", key: null },
                { label: "Del", key: null },
              ].map((col, i) => (
                <div
                  key={col.label}
                  className={`relative ${i >= 7 ? "text-center" : ""} pr-2`}
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
              {current.map((s, idx) => (
                <div
                  key={s._id}
                  onClick={() => handleRowClick(s._id)}
                  className="relative grid items-start text-[12px] px-3 py-2 overflow-visible cursor-pointer hover:bg-slate-50"
                  style={{
                    gridTemplateColumns,
                    minHeight: rowHeights[s._id] || 42,
                    height: rowHeights[s._id] || "auto",
                  }}
                  title="Click row to view scenario"
                >
                  <div className="text-slate-700">{indexOfFirst + idx + 1}</div>

                  <div className="text-slate-900 font-medium whitespace-normal break-words leading-snug">
                    {s.scenario_number}
                  </div>

                  <div className="text-slate-700 whitespace-normal break-words leading-snug">
                    {s.scenario_text}
                  </div>

                  <div className="whitespace-normal break-words">
                    <ModuleChips scenario={s} />
                  </div>

                  <div className="text-indigo-700 font-semibold whitespace-normal break-words leading-snug">
                    {s?.createdBy?.name}
                  </div>

                  <div className="text-slate-700 whitespace-normal break-words leading-snug">
                    {toLocalYMD(s?.createdAt) || "-"}
                  </div>

                  <div className="flex justify-center pt-0.5">
                    <Link
                      to={`/single-project/${projectId}/scenario-history/${s._id}`}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="View"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaEye className="text-sm" />
                    </Link>
                  </div>

                  <div className="flex justify-center pt-0.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(s._id);
                      }}
                      className="text-rose-600 hover:text-rose-800"
                      title="Delete"
                    >
                      <FaTrashAlt className="text-sm" />
                    </button>
                  </div>

                  <RowHeightHandle
                    onMouseDown={(e) => startRowResize(s._id, e)}
                  />
                </div>
              ))}
            </div>

            {renderCount < pageSlice.length && (
              <div className="text-center text-xs text-slate-500 py-3">
                Rendering more…
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
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
