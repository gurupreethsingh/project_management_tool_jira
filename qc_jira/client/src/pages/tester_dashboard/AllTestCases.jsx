import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
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

const STATUS_PENDING_ID = "__status_pending__";

const MIN_COL_WIDTHS = [56, 140, 320, 170, 150, 110, 48, 48];
const COL_WEIGHTS = [0.05, 0.11, 0.32, 0.16, 0.14, 0.1, 0.06, 0.06];

function buildResponsiveColWidths(containerWidth) {
  const safeWidth = Math.max(containerWidth || 0, 360);
  return COL_WEIGHTS.map((weight, index) =>
    Math.max(MIN_COL_WIDTHS[index], Math.floor(safeWidth * weight)),
  );
}

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
  "test",
  "tests",
  "case",
  "cases",
  "testcase",
  "testcases",
  "tc",
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

export default function AllTestCases() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [testCases, setTestCases] = useState([]);
  const [projectName, setProjectName] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [execType, setExecType] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const [totalTestCases, setTotalTestCases] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);

  const [passedCount, setPassedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const [reviewedCount, setReviewedCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingReviewApprovalCount, setPendingReviewApprovalCount] =
    useState(0);

  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const tableContainerRef = useRef(null);
  const userResizedColumnsRef = useRef(false);

  const [colW, setColW] = useState(() =>
    buildResponsiveColWidths(
      typeof window !== "undefined" ? window.innerWidth : 1300,
    ),
  );
  const dragRef = useRef(null);

  const [rowHeights, setRowHeights] = useState({});
  const rowDragRef = useRef(null);

  const getTestStatus = useCallback((tc) => {
    const steps = Array.isArray(tc?.testing_steps) ? tc.testing_steps : [];
    if (steps.length === 0) return "Missing";

    let hasAny = false;
    let hasFail = false;
    let hasPending = false;

    for (const s of steps) {
      const raw = String(s?.status ?? "")
        .trim()
        .toLowerCase();

      if (!raw) continue;
      hasAny = true;

      if (raw === "fail") hasFail = true;
      else if (raw === "pending") hasPending = true;
    }

    if (!hasAny) return "Missing";
    if (hasFail) return "Fail";
    if (hasPending) return "Pending";
    return "Pass";
  }, []);

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

    const fetchTCs = async () => {
      try {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams();

        if (execType) params.append("execType", execType);
        params.append("sortBy", "createdAt");
        params.append("order", "desc");

        const url = `${globalBackendRoute}/api/single-project/${projectId}/all-test-cases?${params.toString()}`;

        const [res, projectRes] = await Promise.all([
          axios.get(url, {
            signal: controller.signal,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          axios.get(`${globalBackendRoute}/api/single-project/${projectId}`, {
            signal: controller.signal,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        ]);

        if (!alive) return;

        const rows = Array.isArray(res.data) ? res.data : [];
        setTestCases(rows);
        setTotalTestCases(rows.length);

        const p = projectRes?.data || {};
        setProjectName(
          p.projectName || p.project_name || p.name || p.title || "",
        );

        setCurrentPage(1);
      } catch (err) {
        if (!axios.isCancel?.(err)) {
          console.error(
            "Error fetching test cases:",
            err?.response?.data || err,
          );
        }
      }
    };

    fetchTCs();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [projectId, execType]);

  const availableDates = useMemo(() => {
    const set = new Set();
    for (const tc of testCases) {
      const ymd = toLocalYMD(tc?.createdAt);
      if (ymd) set.add(ymd);
    }
    return Array.from(set).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }, [testCases]);

  const hasSelectedDate = Boolean(String(selectedDate || "").trim());
  const isSelectedDateValid = useMemo(() => {
    if (!hasSelectedDate) return true;
    return availableDates.includes(selectedDate);
  }, [availableDates, hasSelectedDate, selectedDate]);

  const dq = useDeferredValue(searchQuery);
  const dm = useDeferredValue(selectedModuleId);
  const dd = useDeferredValue(selectedDate);

  const modules = useMemo(() => {
    const counts = new Map();
    let pendingTotal = 0;

    for (const tc of testCases) {
      if (getTestStatus(tc) === "Pending") pendingTotal += 1;

      const modId = tc?.module_name
        ? `name:${tc.module_name}`
        : "__unassigned__";
      const modName = tc?.module_name || "Unassigned";

      if (!counts.has(modId)) {
        counts.set(modId, { _id: modId, name: modName, count: 0 });
      }
      counts.get(modId).count += 1;
    }

    const list = Array.from(counts.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );

    list.unshift({
      _id: STATUS_PENDING_ID,
      name: "Pending",
      count: pendingTotal,
    });

    return list;
  }, [testCases, getTestStatus]);

  const filtered = useMemo(() => {
    if (dd && !availableDates.includes(dd)) return [];

    const tokens = tokenize(dq);

    const rows = testCases.filter((tc) => {
      if (dd) {
        const ymd = toLocalYMD(tc?.createdAt);
        if (ymd !== dd) return false;
      }

      if (dm === STATUS_PENDING_ID) {
        if (getTestStatus(tc) !== "Pending") return false;
      } else if (dm) {
        const modIdCandidate = tc?.module_name
          ? `name:${tc.module_name}`
          : "__unassigned__";
        if (modIdCandidate !== dm) return false;
      }

      if (!tokens.length) return true;

      const reviewedBy = tc?.footer?.reviewed_by || "";
      const approvedBy = tc?.footer?.approved_by || "";

      const hay = norm(
        [
          tc?.test_case_name || "",
          tc?.test_case_number || "",
          tc?.module_name || "Unassigned",
          tc?.requirement_number || "",
          tc?.project_name || "",
          reviewedBy,
          approvedBy,
          toLocalYMD(tc?.createdAt),
          getTestStatus(tc),
        ].join(" "),
      );

      return tokens.some((t) => hay.includes(t));
    });

    let pass = 0;
    let fail = 0;
    let pend = 0;
    let reviewed = 0;
    let approved = 0;
    let pendingReviewApproval = 0;

    for (const r of rows) {
      const st = getTestStatus(r);

      if (st === "Pass") pass += 1;
      else if (st === "Fail") fail += 1;
      else if (st === "Pending") pend += 1;

      const reviewedBy = String(r?.footer?.reviewed_by || "").trim();
      const approvedBy = String(r?.footer?.approved_by || "").trim();

      if (reviewedBy) reviewed += 1;
      if (approvedBy) approved += 1;

      if (!reviewedBy || !approvedBy) pendingReviewApproval += 1;
    }

    setPassedCount(pass);
    setFailedCount(fail);
    setPendingCount(pend);
    setReviewedCount(reviewed);
    setApprovedCount(approved);
    setPendingReviewApprovalCount(pendingReviewApproval);

    return rows;
  }, [testCases, dq, dm, dd, availableDates, getTestStatus]);

  const sortedFiltered = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;

    const getVal = (tc) => {
      if (sortKey === "test_case_number") return tc?.test_case_number || "";
      if (sortKey === "test_case_name") return tc?.test_case_name || "";
      if (sortKey === "module_name") return tc?.module_name || "Unassigned";
      if (sortKey === "requirement_number") return tc?.requirement_number || "";
      if (sortKey === "status") return getTestStatus(tc);
      if (sortKey === "createdAt")
        return new Date(tc?.createdAt || 0).getTime();
      return "";
    };

    arr.sort((a, b) => {
      const va = getVal(a);
      const vb = getVal(b);

      if (sortKey === "createdAt") return (va - vb) * dir;
      return cmpStr(va, vb) * dir;
    });

    return arr;
  }, [filtered, sortKey, sortDir, getTestStatus]);

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

  const handleDelete = useCallback(async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this test case? This action is irreversible.",
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${globalBackendRoute}/api/delete-test-case/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      alert("Test case deleted successfully.");

      setTestCases((prev) => {
        const updated = prev.filter((t) => t._id !== id);
        setTotalTestCases(updated.length);
        return updated;
      });
    } catch (error) {
      console.error("Error deleting test case:", error);
      alert(
        error?.response?.data?.message ||
          "Error deleting test case. Please try again.",
      );
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

  const handlePageChange = useCallback(
    (newPage) => setCurrentPage(newPage),
    [],
  );

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

  const handleRowClick = useCallback(
    (id) => {
      navigate(`/test-case-detail/${id}`);
    },
    [navigate],
  );

  const exportRows = useMemo(() => {
    return sortedFiltered.map((r, idx) => ({
      ...r,
      __rowIndex: idx + 1,
      __status: getTestStatus(r),
      __createdOn: toLocalYMD(r?.createdAt),
      __reviewedBy: r?.footer?.reviewed_by || "",
      __approvedBy: r?.footer?.approved_by || "",
    }));
  }, [sortedFiltered, getTestStatus]);

  const exportCols = useMemo(() => {
    return [
      { header: "#", value: (r) => r.__rowIndex },
      { header: "TC Number", value: (r) => r?.test_case_number || "" },
      { header: "Name", value: (r) => r?.test_case_name || "" },
      { header: "Module", value: (r) => r?.module_name || "Unassigned" },
      { header: "Requirement", value: (r) => r?.requirement_number || "" },
      { header: "Status", value: (r) => r.__status || "" },
      { header: "Reviewed By", value: (r) => r.__reviewedBy || "" },
      { header: "Approved By", value: (r) => r.__approvedBy || "" },
      { header: "Created On", value: (r) => r.__createdOn || "" },
    ];
  }, []);

  const getStatusClass = (status) => {
    if (status === "Pass") return "text-emerald-600";
    if (status === "Fail") return "text-rose-600";
    if (status === "Pending") return "text-amber-600";
    return "text-slate-600";
  };

  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        <div className="space-y-3 flex flex-wrap">
          <div>
            <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
              All Test Cases for Project: {projectName || projectId}
            </h2>

            <p className="text-xs text-gray-600 mt-1">
              Total Test Cases: {totalTestCases}
            </p>

            <p className="text-[11px] text-slate-600 mt-1 flex flex-wrap gap-1">
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                Pass: {passedCount}
              </span>

              <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 font-medium text-rose-700">
                Fail: {failedCount}
              </span>

              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
                Pending: {pendingCount}
              </span>

              <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 font-medium text-sky-700">
                Reviewed: {reviewedCount}
              </span>

              <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 font-medium text-violet-700">
                Approved: {approvedCount}
              </span>

              <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 font-medium text-orange-700">
                Pending Review / Approval: {pendingReviewApprovalCount}
              </span>
            </p>

            {(searchQuery || selectedModuleId || execType || selectedDate) && (
              <p className="text-xs text-gray-600 mt-1">
                Showing {filteredCount} result(s)
                {searchQuery ? <> for “{searchQuery}”</> : null}
                {selectedModuleId
                  ? selectedModuleId === STATUS_PENDING_ID
                    ? " with status Pending"
                    : " in selected module"
                  : null}
                {selectedDate ? ` on ${selectedDate}` : null}
                {execType ? ` · Exec: ${execType}` : null}
              </p>
            )}

            {hasSelectedDate && !isSelectedDateValid && (
              <p className="text-xs text-rose-600 mt-1">
                No test cases were added on {selectedDate}.
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
                  placeholder="Search test cases, module, requirement..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  spellCheck={false}
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <label className="text-xs text-slate-600 whitespace-nowrap">
                  Exec:
                </label>
                <select
                  value={execType}
                  onChange={(e) => {
                    setExecType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1.5 text-sm border rounded-md focus:outline-none"
                  title="Filter by execution type"
                >
                  <option value="">All</option>
                  <option value="Manual">Manual</option>
                  <option value="Automation">Automation</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <input
                  type="date"
                  list="testcase-dates"
                  className="px-2 py-1.5 text-sm border rounded-md focus:outline-none"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  title="Filter by date"
                />
                <datalist id="testcase-dates">
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
                  fileBaseName={`TestCases_${projectName || projectId}`}
                  title={`Test Cases Export - ${projectName || projectId}`}
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
              Filter by Module / Status
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
                { label: "TC Number", key: "test_case_number" },
                { label: "Name", key: "test_case_name" },
                { label: "Module", key: "module_name" },
                { label: "Requirement", key: "requirement_number" },
                { label: "Status", key: "status" },
                { label: "View", key: null },
                { label: "Del", key: null },
              ].map((col, i) => (
                <div
                  key={col.label}
                  className={`relative ${i >= 6 ? "text-center" : ""} pr-2`}
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
                        ? `Sort by ${col.label} (${
                            sortKey === col.key ? sortDir : "asc"
                          })`
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
              {current.map((tc, idx) => {
                const status = getTestStatus(tc);

                return (
                  <div
                    key={tc._id}
                    onClick={() => handleRowClick(tc._id)}
                    className="relative grid items-start text-[12px] px-3 py-2 overflow-visible cursor-pointer hover:bg-slate-50"
                    style={{
                      gridTemplateColumns,
                      minHeight: rowHeights[tc._id] || 42,
                      height: rowHeights[tc._id] || "auto",
                    }}
                    title="Click row to view test case"
                  >
                    <div className="text-slate-700">
                      {indexOfFirst + idx + 1}
                    </div>

                    <div className="text-slate-900 font-medium whitespace-normal break-words leading-snug">
                      {tc?.test_case_number || "-"}
                    </div>

                    <div className="text-slate-700 whitespace-normal break-words leading-snug">
                      {tc?.test_case_name || "-"}
                    </div>

                    <div className="whitespace-normal break-words">
                      <span className="inline-flex max-w-full items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 whitespace-normal break-words">
                        {tc?.module_name || "Unassigned"}
                      </span>
                    </div>

                    <div className="text-slate-700 whitespace-normal break-words leading-snug">
                      {tc?.requirement_number || "-"}
                    </div>

                    <div className={`font-semibold ${getStatusClass(status)}`}>
                      {status}
                    </div>

                    <div className="flex justify-center pt-0.5">
                      <Link
                        to={`/test-case-detail/${tc._id}`}
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
                          handleDelete(tc._id);
                        }}
                        className="text-rose-600 hover:text-rose-800"
                        title="Delete"
                      >
                        <FaTrashAlt className="text-sm" />
                      </button>
                    </div>

                    <RowHeightHandle
                      onMouseDown={(e) => startRowResize(tc._id, e)}
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
