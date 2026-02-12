import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import axios from "axios";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaThList,
  FaThLarge,
  FaTh,
  FaArrowLeft,
  FaArrowRight,
  FaSort,
  FaSync,
  FaDownload,
  FaCheckSquare,
  FaSquare,
  FaTrashAlt,
  FaEye,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import globalBackendRoute from "../../config/Config";

const cls = (...a) => a.filter(Boolean).join(" ");

const badge = (status) => {
  switch ((status || "").toLowerCase()) {
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "accepted":
    case "approved":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-rose-100 text-rose-700";
    case "marked":
      return "bg-indigo-100 text-indigo-700";
    case "unmarked":
      return "bg-slate-200 text-slate-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const STATUS_VALUES = ["pending", "marked", "accepted", "rejected", "unmarked"];

const getIdStr = (x) => {
  if (!x) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x._id || x.id || x);
  return String(x);
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

export default function GetAllAttendance() {
  const navigate = useNavigate();

  // -------- auth / api base --------
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";
  const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined;
  const api = `${globalBackendRoute}/api`;

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const userRole = user?.role || "";

  // ---------- state ----------
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [busyId, setBusyId] = useState(null);

  // View + paging
  const [viewMode, setViewMode] = useState(
    localStorage.getItem("attendance:viewMode") || "list",
  );
  const [sortOrder, setSortOrder] = useState("asc"); // keep AllScenarios feel (asc/desc toggle)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    Number(localStorage.getItem("attendance:pageSize")) || 10,
  );

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [billableFilter, setBillableFilter] = useState(""); // "", "true", "false"
  const [quick, setQuick] = useState(""); // "", "today", "week", "month"
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  // ✅ Date filters (kept from your code)
  const [dateMode, setDateMode] = useState("any"); // any | day | week | month | year | range
  const [dayValue, setDayValue] = useState(""); // yyyy-mm-dd
  const [weekValue, setWeekValue] = useState(""); // yyyy-Www
  const [monthValue, setMonthValue] = useState(""); // yyyy-mm
  const [yearValue, setYearValue] = useState(String(new Date().getFullYear())); // yyyy
  const [fromDate, setFromDate] = useState(""); // yyyy-mm-dd
  const [toDate, setToDate] = useState(""); // yyyy-mm-dd

  // Counts
  const [statusCounts, setStatusCounts] = useState([]);
  const [employeeCounts, setEmployeeCounts] = useState([]);
  const [projectCounts, setProjectCounts] = useState([]);

  // Optional: list of projects for bulk assign UI
  const [projectsList, setProjectsList] = useState([]);

  // Bulk ops
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkMode, setBulkMode] = useState("status"); // 'status' | 'assignProject' | 'hoursSet' | 'hoursInc' | 'delete'
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkProject, setBulkProject] = useState("");
  const [bulkHours, setBulkHours] = useState("");

  // ✅ Column widths (Excel-like resize) — but make layout like AllScenarios
  // Columns: [#, Sel, Employee, Project, Task, Date, Hours, Status, Billable, View, Del]
  const COLS = useMemo(
    () => [
      "#",
      "Sel",
      "Employee",
      "Project",
      "Task",
      "Date",
      "Hours",
      "Status",
      "Billable",
      "View",
      "Del",
    ],
    [],
  );

  const storageKeyColW = "attendance:colW:v2_scenarios_style";
  const [colW, setColW] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKeyColW) || "null");
      if (Array.isArray(saved) && saved.length === COLS.length) return saved;
    } catch {}
    return [
      56, // #
      56, // Sel
      320, // Employee
      240, // Project
      520, // Task
      160, // Date
      120, // Hours
      160, // Status
      120, // Billable
      56, // View
      56, // Del
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKeyColW, JSON.stringify(colW));
    } catch {}
  }, [colW]);

  const dragRef = useRef(null);

  const gridTemplateColumns = useMemo(
    () => colW.map((w) => `${Math.max(32, Number(w) || 0)}px`).join(" "),
    [colW],
  );

  const startColResize = useCallback(
    (colIndex, e) => {
      e.preventDefault();
      e.stopPropagation();

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

  const Resizer = ({ onMouseDown }) => (
    <span
      onMouseDown={onMouseDown}
      className="absolute right-0 top-0 h-full w-2 cursor-col-resize select-none"
      title="Drag to resize"
    />
  );

  // ---------- fetch ----------
  const fetchAll = async () => {
    try {
      setLoading(true);
      setLoadErr("");

      const [listRes, scStatus, scEmp, scProj, projRes] = await Promise.all([
        axios.get(
          `${api}/attendance/view-all-attendance?limit=5000&order=desc`,
          {
            headers: authHeader,
          },
        ),
        axios.get(`${api}/attendance/counts?groupBy=status`, {
          headers: authHeader,
        }),
        axios.get(`${api}/attendance/counts?groupBy=employee`, {
          headers: authHeader,
        }),
        axios.get(`${api}/attendance/counts?groupBy=project`, {
          headers: authHeader,
        }),
        axios.get(`${api}/all-projects`, { headers: authHeader }).catch(() => ({
          data: [],
        })),
      ]);

      const arr = listRes?.data?.rows || [];
      setRows(arr);
      setStatusCounts(scStatus?.data?.counts || []);
      setEmployeeCounts(scEmp?.data?.counts || []);
      setProjectCounts(scProj?.data?.counts || []);
      setProjectsList(Array.isArray(projRes?.data) ? projRes.data : []);
    } catch (e) {
      console.error("Attendance load error:", e?.response || e);
      setLoadErr(e?.response?.data?.message || "Failed to load attendance.");
      setRows([]);
      setStatusCounts([]);
      setEmployeeCounts([]);
      setProjectCounts([]);
      setProjectsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("attendance:viewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem("attendance:pageSize", String(pageSize));
  }, [pageSize]);

  const handleBackToDashboard = () => {
    const role = (userRole || "").toLowerCase();
    if (role === "superadmin") navigate("/super-admin-dashboard");
    else if (role === "admin") navigate("/admin-dashboard");
    else if (role === "developer_lead") navigate("/developer-lead-dashboard");
    else if (role === "developer") navigate("/developer-dashboard");
    else if (role === "qa_lead") navigate("/qa-dashboard");
    else if (role === "test_engineer") navigate("/test-engineer-dashboard");
    else navigate("/dashboard");
  };

  // ---------- lookup maps ----------
  const employeeNameById = useMemo(() => {
    const map = new Map();
    for (const r of rows) {
      const id = getIdStr(r?.employee?._id || r?.employee?.id);
      const nm = r?.employee?.name;
      if (id && nm && !map.has(id)) map.set(id, nm);
    }
    return (idLike) => {
      const key = getIdStr(idLike);
      return map.get(key) || (key ? key.slice(-6) : "Unknown");
    };
  }, [rows]);

  const projectNameById = useMemo(() => {
    const map = new Map();
    for (const r of rows) {
      const id = getIdStr(r?.project?._id || r?.project?.id);
      const nm = r?.project?.project_name || r?.project?.name;
      if (id && nm && !map.has(id)) map.set(id, nm);
    }
    for (const p of projectsList || []) {
      const id = getIdStr(p?._id);
      const nm = p?.project_name || p?.name;
      if (id && nm && !map.has(id)) map.set(id, nm);
    }
    return (idLike) => {
      const key = getIdStr(idLike);
      return map.get(key) || (key ? key.slice(-6) : "Unassigned");
    };
  }, [rows, projectsList]);

  // ---------- helpers ----------
  const matchAny = (r, q) => {
    if (!q) return true;
    const lc = q.toLowerCase();
    const fields = [
      r?.employee?.name || "",
      r?.employee?.email || "",
      r?.project?.project_name || "",
      r?.taskDescription || "",
      r?.dayKey || "",
      r?.status || "",
      r?.location || "",
      r?.shift || "",
      String(r?.hoursWorked ?? ""),
      r?._id || "",
      r?.date ? moment(r.date).format("YYYY-MM-DD") : "",
      r?.date ? moment(r.date).format("DD/MM/YYYY") : "",
      r?.date ? moment(r.date).format("MMM D, YYYY") : "",
    ]
      .join(" ")
      .toLowerCase();

    const terms = lc.split(/\s+/).filter(Boolean);
    return terms.every((t) => fields.includes(t));
  };

  const inQuickRange = (r) => {
    if (!quick) return true;
    const d = r?.date ? new Date(r.date) : null;
    if (!d) return false;

    const now = new Date();
    if (quick === "today") {
      const dk = moment(d).format("YYYY-MM-DD");
      return dk === moment(now).format("YYYY-MM-DD");
    }
    if (quick === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return d >= new Date(weekAgo.setHours(0, 0, 0, 0));
    }
    if (quick === "month") {
      return (
        d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      );
    }
    return true;
  };

  const matchDateMode = useCallback(
    (r) => {
      if (dateMode === "any") return true;
      if (!r?.date) return false;
      const d = new Date(r.date);
      if (Number.isNaN(d.getTime())) return false;

      const ymd = toLocalYMD(d);

      if (dateMode === "day") {
        if (!dayValue) return true;
        return ymd === dayValue;
      }

      if (dateMode === "week") {
        if (!weekValue) return true; // YYYY-Www
        const m = moment(d);
        const iso = `${m.isoWeekYear()}-W${String(m.isoWeek()).padStart(2, "0")}`;
        return iso === weekValue;
      }

      if (dateMode === "month") {
        if (!monthValue) return true;
        return moment(d).format("YYYY-MM") === monthValue;
      }

      if (dateMode === "year") {
        if (!String(yearValue || "").trim()) return true;
        return String(d.getFullYear()) === String(yearValue).trim();
      }

      if (dateMode === "range") {
        const fromOk = fromDate ? ymd >= fromDate : true;
        const toOk = toDate ? ymd <= toDate : true;
        return fromOk && toOk;
      }

      return true;
    },
    [dateMode, dayValue, weekValue, monthValue, yearValue, fromDate, toDate],
  );

  // ✅ defer heavy filter while typing
  const dq = useDeferredValue(search);
  const ds = useDeferredValue(statusFilter);
  const db = useDeferredValue(billableFilter);
  const de = useDeferredValue(employeeFilter);
  const dp = useDeferredValue(projectFilter);
  const dqk = useDeferredValue(quick);
  const dso = useDeferredValue(sortOrder);

  // keep these as deps (so UI updates feel instant like AllScenarios)
  const ddm = useDeferredValue(dateMode);
  const ddy = useDeferredValue(dayValue);
  const ddw = useDeferredValue(weekValue);
  const ddmo = useDeferredValue(monthValue);
  const ddyr = useDeferredValue(yearValue);
  const ddf = useDeferredValue(fromDate);
  const ddt = useDeferredValue(toDate);

  // ---------- filter + sort ----------
  const filtered = useMemo(() => {
    let out = [...rows];

    if (ds) {
      const s = ds.toLowerCase();
      out = out.filter(
        (r) =>
          (r.status || "").toLowerCase() === s ||
          (s === "approved" && (r.status || "").toLowerCase() === "accepted"),
      );
    }

    if (db) {
      const want = db === "true";
      out = out.filter((r) => Boolean(r.isBillable) === want);
    }

    if (de) {
      out = out.filter(
        (r) => getIdStr(r?.employee?._id || r?.employee?.id) === de,
      );
    }

    if (dp) {
      out = out.filter(
        (r) => getIdStr(r?.project?._id || r?.project?.id) === dp,
      );
    }

    if (dqk) out = out.filter((r) => inQuickRange(r));
    out = out.filter((r) => matchDateMode(r));

    if (String(dq || "").trim()) out = out.filter((r) => matchAny(r, dq));

    // Sort toggle like AllScenarios: asc => latest first, desc => oldest first (kept from your handleSort logic)
    out.sort((a, b) => {
      const aTs = a?.date ? new Date(a.date).getTime() : 0;
      const bTs = b?.date ? new Date(b.date).getTime() : 0;
      return dso === "asc" ? bTs - aTs : aTs - bTs;
    });

    return out;
  }, [
    rows,
    ds,
    db,
    de,
    dp,
    dqk,
    dq,
    dso,
    matchDateMode,
    ddm,
    ddy,
    ddw,
    ddmo,
    ddyr,
    ddf,
    ddt,
  ]);

  // ---------- paging ----------
  const computedTotalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const indexOfFirst = (page - 1) * pageSize;
  const pageSlice = useMemo(
    () => filtered.slice(indexOfFirst, indexOfFirst + pageSize),
    [filtered, indexOfFirst, pageSize],
  );

  useEffect(() => {
    setPage((p) => Math.min(p, computedTotalPages));
  }, [computedTotalPages]);

  // ✅ progressive render like AllScenarios
  const [renderCount, setRenderCount] = useState(60);
  useEffect(() => {
    setRenderCount(60);
  }, [
    page,
    pageSize,
    dq,
    ds,
    db,
    de,
    dp,
    dqk,
    dso,
    ddm,
    ddy,
    ddw,
    ddmo,
    ddyr,
    ddf,
    ddt,
    viewMode,
  ]);

  useEffect(() => {
    if (renderCount >= pageSlice.length) return;
    const id = window.requestAnimationFrame(() => {
      setRenderCount((c) => Math.min(pageSlice.length, c + 80));
    });
    return () => window.cancelAnimationFrame(id);
  }, [renderCount, pageSlice.length]);

  const pageRows = useMemo(
    () => pageSlice.slice(0, renderCount),
    [pageSlice, renderCount],
  );

  // ---------- single update ----------
  const updateOne = async (id, partial) => {
    try {
      setBusyId(id);
      setRows((prev) =>
        prev.map((r) => (r._id === id ? { ...r, ...partial } : r)),
      );
      await axios.put(`${api}/attendance/${id}`, partial, {
        headers: authHeader,
      });
    } catch (e) {
      console.error("Update attendance failed:", e?.response || e);
      await fetchAll(); // rollback
      alert(e?.response?.data?.message || "Failed to update record.");
    } finally {
      setBusyId(null);
    }
  };

  // ---------- single delete ----------
  const removeOne = async (id) => {
    if (!window.confirm("Delete this attendance record?")) return;
    try {
      await axios.delete(`${api}/attendance/${id}`, { headers: authHeader });
      setRows((prev) => prev.filter((r) => r._id !== id));
      setSelectedIds((ids) => ids.filter((x) => x !== id));
    } catch (e) {
      console.error("Delete failed:", e?.response || e);
      alert(e?.response?.data?.message || "Failed to delete.");
    }
  };

  // ---------- selection / bulk ----------
  const toggleAllVisible = () => {
    const visibleIds = pageRows.map((r) => r._id);
    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((ids) => ids.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((ids) => Array.from(new Set([...ids, ...visibleIds])));
    }
  };

  const toggleOne = (id) =>
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );

  const doBulk = async () => {
    if (!selectedIds.length) return alert("Select at least one record.");

    try {
      if (bulkMode === "status") {
        if (!bulkStatus) return alert("Choose a status.");
        await axios.patch(
          `${api}/attendance/bulk/status`,
          { ids: selectedIds, status: bulkStatus },
          { headers: authHeader },
        );
      } else if (bulkMode === "assignProject") {
        const proj = bulkProject.trim() ? bulkProject.trim() : null;
        await axios.patch(
          `${api}/attendance/bulk/assign-project`,
          { ids: selectedIds, project: proj },
          { headers: authHeader },
        );
      } else if (bulkMode === "hoursSet") {
        const h = Number(bulkHours);
        if (!Number.isFinite(h))
          return alert("Enter a valid number for hours.");
        await axios.patch(
          `${api}/attendance/bulk/hours`,
          { ids: selectedIds, operation: "set", hours: h },
          { headers: authHeader },
        );
      } else if (bulkMode === "hoursInc") {
        const h = Number(bulkHours);
        if (!Number.isFinite(h))
          return alert("Enter a valid number for hours.");
        await axios.patch(
          `${api}/attendance/bulk/hours`,
          { ids: selectedIds, operation: "inc", hours: h },
          { headers: authHeader },
        );
      } else if (bulkMode === "delete") {
        if (!window.confirm("Delete selected records? This cannot be undone."))
          return;
        await axios.delete(`${api}/attendance/bulk`, {
          headers: authHeader,
          data: { ids: selectedIds },
        });
      }

      setSelectedIds([]);
      setBulkStatus("");
      setBulkProject("");
      setBulkHours("");

      await fetchAll();
    } catch (e) {
      console.error("Bulk op failed:", e?.response || e);
      alert(e?.response?.data?.message || "Bulk operation failed.");
    }
  };

  // ---------- CSV export (client, filtered) ----------
  const exportCSV = () => {
    const data = filtered.map((r) => ({
      id: r._id,
      employee: r.employee?.name || "",
      employeeEmail: r.employee?.email || "",
      project: r.project?.project_name || "",
      date: r.date ? moment(r.date).format("YYYY-MM-DD") : "",
      dayKey: r.dayKey || "",
      status: r.status || "",
      hoursWorked: r.hoursWorked ?? "",
      taskDescription: (r.taskDescription || "").replace(/\n/g, " "),
      isBillable: r.isBillable ? "Yes" : "No",
      location: r.location || "",
      shift: r.shift || "",
      submittedAt: r.submittedAt
        ? moment(r.submittedAt).format("YYYY-MM-DD HH:mm")
        : "",
      reviewedAt: r.reviewedAt
        ? moment(r.reviewedAt).format("YYYY-MM-DD HH:mm")
        : "",
      reviewedBy: r.reviewedBy || "",
      createdAt: r.createdAt
        ? moment(r.createdAt).format("YYYY-MM-DD HH:mm")
        : "",
      updatedAt: r.updatedAt
        ? moment(r.updatedAt).format("YYYY-MM-DD HH:mm")
        : "",
    }));

    const header = Object.keys(data[0] || {}).join(",");
    const body = data
      .map((row) =>
        Object.values(row)
          .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([header + "\n" + body], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_export_${moment().format("YYYYMMDD_HHmm")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- Excel export (client, filtered) ----------
  const exportXLSX = () => {
    try {
      const data = filtered.map((r) => ({
        ID: r._id,
        Employee: r.employee?.name || "",
        EmployeeEmail: r.employee?.email || "",
        Project: r.project?.project_name || "",
        Date: r.date ? moment(r.date).format("YYYY-MM-DD") : "",
        DayKey: r.dayKey || "",
        Status: r.status || "",
        HoursWorked: r.hoursWorked ?? "",
        TaskDescription: (r.taskDescription || "").replace(/\n/g, " "),
        Billable: r.isBillable ? "Yes" : "No",
        Location: r.location || "",
        Shift: r.shift || "",
        SubmittedAt: r.submittedAt
          ? moment(r.submittedAt).format("YYYY-MM-DD HH:mm")
          : "",
        ReviewedAt: r.reviewedAt
          ? moment(r.reviewedAt).format("YYYY-MM-DD HH:mm")
          : "",
        ReviewedBy: r.reviewedBy || "",
        CreatedAt: r.createdAt
          ? moment(r.createdAt).format("YYYY-MM-DD HH:mm")
          : "",
        UpdatedAt: r.updatedAt
          ? moment(r.updatedAt).format("YYYY-MM-DD HH:mm")
          : "",
      }));

      const ws = XLSX.utils.json_to_sheet(data, { skipHeader: false });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Attendance");

      const filename = `attendance_${moment().format("YYYYMMDD_HHmm")}.xlsx`;
      XLSX.writeFile(wb, filename);
    } catch (e) {
      console.error("Client XLSX export failed:", e);
      alert(`Client XLSX export failed: ${e?.message || e}`);
    }
  };

  // ---------- Excel export (server, DB) ----------
  const exportServerXLSX = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (billableFilter) params.set("billable", billableFilter);
      if (employeeFilter) params.set("employee", employeeFilter);
      if (projectFilter) params.set("project", projectFilter);
      if (search) params.set("search", search);
      if (quick) params.set("quick", quick);

      // date filters (if your server supports these keys)
      if (dateMode === "day" && dayValue) params.set("day", dayValue);
      if (dateMode === "week" && weekValue) params.set("week", weekValue);
      if (dateMode === "month" && monthValue) params.set("month", monthValue);
      if (dateMode === "year" && yearValue) params.set("year", yearValue);
      if (dateMode === "range") {
        if (fromDate) params.set("from", fromDate);
        if (toDate) params.set("to", toDate);
      }

      const url = `${api}/attendance/export.xlsx?${params.toString()}`;
      const res = await axios.get(url, {
        headers: authHeader,
        responseType: "arraybuffer",
        validateStatus: () => true,
      });

      const ct = (res.headers["content-type"] || "").toLowerCase();
      const isXlsx = ct.includes(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );

      if (!isXlsx || res.status < 200 || res.status >= 300) {
        let msg = `Export failed (status ${res.status}).`;
        try {
          const decoder = new TextDecoder("utf-8");
          const text = decoder.decode(new Uint8Array(res.data || []));
          try {
            const j = JSON.parse(text);
            msg += `\n${j.message || text}`;
          } catch {
            msg += `\n${text.slice(0, 600)}`;
          }
        } catch {}
        alert(msg);
        return;
      }

      const blob = new Blob([res.data], { type: ct });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `attendance_${moment().format("YYYYMMDD_HHmm")}.xlsx`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error("Server export failed:", e);
      alert(`Server export failed: ${e?.message || e}`);
    }
  };

  const clearAllFilters = () => {
    setStatusFilter("");
    setBillableFilter("");
    setQuick("");
    setSearch("");
    setEmployeeFilter("");
    setProjectFilter("");
    setDateMode("any");
    setDayValue("");
    setWeekValue("");
    setMonthValue("");
    setYearValue(String(new Date().getFullYear()));
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const handleSort = useCallback(() => {
    // Keep sort toggle behavior similar to AllScenarios (just toggle)
    setSortOrder((s) => (s === "asc" ? "desc" : "asc"));
  }, []);

  // Small memo component for header "Sel" toggle (no UI change)
  const HeaderSelectAll = memo(function HeaderSelectAll() {
    const allSelected =
      pageRows.length > 0 && pageRows.every((r) => selectedIds.includes(r._id));
    return (
      <button onClick={toggleAllVisible} title="Select all on page">
        {allSelected ? <FaCheckSquare /> : <FaSquare />}
      </button>
    );
  });

  // ---------- UI ----------
  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        {/* Header / Controls (match AllScenarios layout + typography) */}
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div>
            <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
              Attendance — All Users
            </h2>

            <p className="text-xs text-gray-600 mt-1">
              {loading
                ? "Loading…"
                : `Total: ${rows.length} | Showing: ${filtered.length}`}
            </p>

            {(search ||
              statusFilter ||
              billableFilter ||
              quick ||
              employeeFilter ||
              projectFilter ||
              dateMode !== "any" ||
              dayValue ||
              weekValue ||
              monthValue ||
              yearValue ||
              fromDate ||
              toDate) && (
              <p className="text-xs text-gray-600">
                Showing {filtered.length} result(s)
                {search ? <> for “{search}”</> : null}
                {statusFilter ? <> with status “{statusFilter}”</> : null}
              </p>
            )}

            <button
              onClick={handleBackToDashboard}
              className="mt-1 text-xs underline text-slate-600"
            >
              ← Back to Dashboard
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* View toggles */}
            <FaThList
              className={`text-lg cursor-pointer ${
                viewMode === "list" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setViewMode("list")}
              title="List view"
            />
            <FaThLarge
              className={`text-lg cursor-pointer ${
                viewMode === "card" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setViewMode("card")}
              title="Card view"
            />
            <FaTh
              className={`text-lg cursor-pointer ${
                viewMode === "grid" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setViewMode("grid")}
              title="Grid view"
            />

            {/* Sort toggle */}
            <FaSort
              className={`text-lg cursor-pointer ${
                sortOrder === "desc" ? "text-indigo-600" : "text-gray-500"
              }`}
              onClick={handleSort}
              title={
                sortOrder === "asc"
                  ? "Sort by Latest First"
                  : "Sort by Oldest First"
              }
            />

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                className="pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none"
                placeholder="Search employee, project, task, date…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                spellCheck={false}
              />
            </div>

            {/* Rows per page */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600">Rows:</label>
              <select
                value={String(pageSize)}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1.5 text-sm border rounded-md focus:outline-none"
                title="Rows per page"
              >
                {[5, 10, 20, 40, 60, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Export buttons */}
            <button
              onClick={exportXLSX}
              className="px-3 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 text-sm flex items-center gap-2"
              title="Export Excel (filtered on client)"
            >
              <FaDownload /> Export (Client)
            </button>

            <button
              onClick={exportServerXLSX}
              className="px-3 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 text-sm flex items-center gap-2"
              title="Export Excel from server (DB)"
            >
              <FaDownload /> Export (Server)
            </button>

            <button
              onClick={exportCSV}
              className="px-3 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 text-sm flex items-center gap-2"
              title="Export CSV (filtered)"
            >
              <FaDownload /> Export CSV
            </button>

            <button
              onClick={fetchAll}
              className="px-3 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 text-sm flex items-center gap-2"
              title="Refresh"
            >
              <FaSync /> Refresh
            </button>
          </div>
        </div>

        {/* Quick filters + badges (keep ALL content; keep same controls) */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              <button
                className={cls(
                  "text-[11px] leading-none rounded-full px-2 py-1 border transition",
                  quick === "today"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
                )}
                onClick={() => {
                  setQuick((q) => (q === "today" ? "" : "today"));
                  setPage(1);
                }}
                title="Show only today's entries"
              >
                Today
              </button>

              <button
                className={cls(
                  "text-[11px] leading-none rounded-full px-2 py-1 border transition",
                  quick === "week"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
                )}
                onClick={() => {
                  setQuick((q) => (q === "week" ? "" : "week"));
                  setPage(1);
                }}
                title="Last 7 days"
              >
                Last 7d
              </button>

              <button
                className={cls(
                  "text-[11px] leading-none rounded-full px-2 py-1 border transition",
                  quick === "month"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
                )}
                onClick={() => {
                  setQuick((q) => (q === "month" ? "" : "month"));
                  setPage(1);
                }}
                title="This month"
              >
                This Month
              </button>

              <select
                value={billableFilter}
                onChange={(e) => {
                  setBillableFilter(e.target.value);
                  setPage(1);
                }}
                className="px-2 py-1 border rounded-md text-[12px]"
                title="Billable filter"
              >
                <option value="">All Work</option>
                <option value="true">Billable</option>
                <option value="false">Non-billable</option>
              </select>

              {/* Date filter controls (kept) */}
              <select
                value={dateMode}
                onChange={(e) => {
                  setDateMode(e.target.value);
                  setPage(1);
                }}
                className="px-2 py-1 border rounded-md text-[12px]"
                title="Date filter"
              >
                <option value="any">Any Date</option>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
                <option value="range">From-To</option>
              </select>

              {dateMode === "day" && (
                <input
                  type="date"
                  className="px-2 py-1 border rounded-md text-[12px]"
                  value={dayValue}
                  onChange={(e) => {
                    setDayValue(e.target.value);
                    setPage(1);
                  }}
                  title="Select day"
                />
              )}

              {dateMode === "week" && (
                <input
                  type="week"
                  className="px-2 py-1 border rounded-md text-[12px]"
                  value={weekValue}
                  onChange={(e) => {
                    setWeekValue(e.target.value);
                    setPage(1);
                  }}
                  title="Select week"
                />
              )}

              {dateMode === "month" && (
                <input
                  type="month"
                  className="px-2 py-1 border rounded-md text-[12px]"
                  value={monthValue}
                  onChange={(e) => {
                    setMonthValue(e.target.value);
                    setPage(1);
                  }}
                  title="Select month"
                />
              )}

              {dateMode === "year" && (
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  className="px-2 py-1 border rounded-md text-[12px] w-[92px]"
                  value={yearValue}
                  onChange={(e) => {
                    setYearValue(e.target.value);
                    setPage(1);
                  }}
                  title="Enter year"
                />
              )}

              {dateMode === "range" && (
                <>
                  <input
                    type="date"
                    className="px-2 py-1 border rounded-md text-[12px]"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setPage(1);
                    }}
                    title="From"
                  />
                  <input
                    type="date"
                    className="px-2 py-1 border rounded-md text-[12px]"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setPage(1);
                    }}
                    title="To"
                  />
                </>
              )}
            </div>

            <button
              className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
              onClick={clearAllFilters}
            >
              Clear All Filters
            </button>
          </div>

          {/* Status badges */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {STATUS_VALUES.map((s) => {
              const count =
                statusCounts.find((x) => String(x._id).toLowerCase() === s)
                  ?.count || 0;
              const active = statusFilter.toLowerCase() === s;
              return (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(active ? "" : s);
                    setPage(1);
                  }}
                  className={cls(
                    "text-[11px] leading-none rounded-full px-2 py-1 border transition",
                    active
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
                  )}
                  title={`${s} (${count})`}
                >
                  <span className={cls("px-1 rounded", badge(s))}>{s}</span>{" "}
                  <span className="opacity-70 ml-1">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Project badges */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {projectCounts.slice(0, 12).map((p) => {
              const projId = getIdStr(p._id);
              const label = projectNameById(projId);
              const active = projectFilter === projId;
              return (
                <button
                  key={projId || "null"}
                  onClick={() => {
                    setProjectFilter(active ? "" : projId);
                    setPage(1);
                  }}
                  className={cls(
                    "text-[11px] leading-none rounded-full px-2 py-1 border transition cursor-pointer",
                    active
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
                  )}
                  title={`${label} (${p.count})`}
                >
                  {label} <span className="opacity-70 ml-1">({p.count})</span>
                </button>
              );
            })}
            {projectCounts.length === 0 && (
              <span className="text-[12px] text-slate-500">
                No project data
              </span>
            )}
          </div>

          {/* Employee badges */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {employeeCounts.slice(0, 12).map((e) => {
              const empId = getIdStr(e._id);
              const label = employeeNameById(empId);
              const active = employeeFilter === empId;
              return (
                <button
                  key={empId || "null"}
                  onClick={() => {
                    setEmployeeFilter(active ? "" : empId);
                    setPage(1);
                  }}
                  className={cls(
                    "text-[11px] leading-none rounded-full px-2 py-1 border transition cursor-pointer",
                    active
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
                  )}
                  title={`${label} (${e.count})`}
                >
                  {label} <span className="opacity-70 ml-1">({e.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bulk ops (keep all content, just AllScenarios spacing) */}
        <div className="mt-4 p-2 bg-amber-50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-semibold">Bulk:</span>
            <select
              value={bulkMode}
              onChange={(e) => setBulkMode(e.target.value)}
              className="px-2 py-1 border rounded"
              title="Choose bulk operation"
            >
              <option value="status">Change Status</option>
              <option value="assignProject">Assign/Clear Project</option>
              <option value="hoursSet">Set Hours</option>
              <option value="hoursInc">Increment Hours</option>
              <option value="delete">Delete</option>
            </select>

            {bulkMode === "status" && (
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="px-2 py-1 border rounded"
              >
                <option value="">Select status…</option>
                {STATUS_VALUES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}

            {bulkMode === "assignProject" && (
              <>
                {projectsList.length > 0 ? (
                  <select
                    value={bulkProject}
                    onChange={(e) => setBulkProject(e.target.value)}
                    className="px-2 py-1 border rounded w-[240px]"
                  >
                    <option value="">(Clear project)</option>
                    {projectsList.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.project_name || p.name || p._id}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="px-2 py-1 border rounded w-[260px]"
                    placeholder="Project ID (blank to clear)"
                    value={bulkProject}
                    onChange={(e) => setBulkProject(e.target.value)}
                    title="Enter a Project ObjectId; leave empty to clear"
                  />
                )}
              </>
            )}

            {(bulkMode === "hoursSet" || bulkMode === "hoursInc") && (
              <input
                type="number"
                step="0.25"
                className="px-2 py-1 border rounded w-[140px]"
                placeholder={
                  bulkMode === "hoursInc" ? "Add hours…" : "Set hours…"
                }
                value={bulkHours}
                onChange={(e) => setBulkHours(e.target.value)}
              />
            )}

            <button
              onClick={doBulk}
              className="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Apply to {selectedIds.length} selected
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="mt-6 text-sm text-gray-600">Loading…</div>
        ) : loadErr ? (
          <div className="mt-6 text-sm text-red-600">{loadErr}</div>
        ) : viewMode === "list" ? (
          <div className="mt-5">
            <div className="overflow-x-auto">
              {/* Header row (AllScenarios style) */}
              <div
                className="relative grid items-center text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200 min-w-max"
                style={{ gridTemplateColumns }}
              >
                {COLS.map((label, i) => (
                  <div
                    key={label}
                    className={cls(
                      "relative pr-2",
                      i === 1 || i >= 9 ? "text-center" : "",
                    )}
                  >
                    <span>{label === "Sel" ? <HeaderSelectAll /> : label}</span>
                    {i < colW.length - 1 ? (
                      <Resizer onMouseDown={(e) => startColResize(i, e)} />
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Rows (AllScenarios style, with divider, resizable height) */}
              <div className="divide-y divide-slate-200 min-w-max">
                {pageRows.map((r, idx) => (
                  <div
                    key={r._id}
                    className="grid items-start text-[12px] px-3 py-2 resize-y overflow-visible"
                    style={{ gridTemplateColumns, minHeight: 42 }}
                    title="Drag bottom edge to resize row"
                  >
                    <div className="text-slate-700">
                      {indexOfFirst + idx + 1}
                    </div>

                    <div className="flex justify-center pt-0.5">
                      <button onClick={() => toggleOne(r._id)} title="Select">
                        {selectedIds.includes(r._id) ? (
                          <FaCheckSquare className="text-emerald-600" />
                        ) : (
                          <FaSquare className="text-slate-400" />
                        )}
                      </button>
                    </div>

                    <div className="text-slate-900 font-medium whitespace-normal break-words leading-snug">
                      {(r.employee?.name || "N/A") +
                        (r.employee?.email ? ` (${r.employee.email})` : "")}
                    </div>

                    <div className="text-slate-700 whitespace-normal break-words leading-snug">
                      {r.project?.project_name || "—"}
                    </div>

                    <div className="text-slate-700 whitespace-normal break-words leading-snug">
                      {r.taskDescription || "—"}
                    </div>

                    <div className="text-slate-700 whitespace-normal break-words leading-snug">
                      {r.date ? moment(r.date).format("DD/MM/YYYY") : "—"}
                    </div>

                    <div>
                      <input
                        type="number"
                        step="0.25"
                        className="border p-1 rounded w-[90px]"
                        value={Number(r.hoursWorked ?? 0)}
                        onChange={(e) =>
                          updateOne(r._id, {
                            hoursWorked: Number(e.target.value),
                          })
                        }
                        disabled={busyId === r._id}
                        title="Update hours"
                      />
                    </div>

                    <div>
                      <select
                        className={cls(
                          "px-2 py-1 rounded border",
                          badge(r.status),
                        )}
                        value={(r.status || "").toLowerCase()}
                        onChange={(e) =>
                          updateOne(r._id, { status: e.target.value })
                        }
                        disabled={busyId === r._id}
                        title="Change status"
                      >
                        {STATUS_VALUES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="text-slate-700 whitespace-normal break-words leading-snug">
                      {r.isBillable ? "Yes" : "No"}
                    </div>

                    <div className="flex justify-center pt-0.5">
                      <Link
                        to={`/get-single-attendance/${r._id}`}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="View"
                      >
                        <FaEye className="text-sm" />
                      </Link>
                    </div>

                    <div className="flex justify-center pt-0.5">
                      <button
                        className="text-rose-600 hover:text-rose-800"
                        title="Delete record"
                        onClick={() => removeOne(r._id)}
                      >
                        <FaTrashAlt className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}

                {!pageRows.length && (
                  <div className="text-center text-[12px] text-slate-500 py-6">
                    No records match your filters.
                  </div>
                )}
              </div>

              {renderCount < pageSlice.length && (
                <div className="text-center text-xs text-slate-500 py-3">
                  Rendering more…
                </div>
              )}
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {pageRows.map((r) => (
              <div
                key={r._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                    <span>{r.employee?.name || "Employee"}</span>
                    <button onClick={() => toggleOne(r._id)} title="Select">
                      {selectedIds.includes(r._id) ? (
                        <FaCheckSquare className="text-emerald-600" />
                      ) : (
                        <FaSquare className="text-slate-400" />
                      )}
                    </button>
                  </div>

                  <div className="mt-1 text-[12px] text-slate-700 break-words whitespace-normal">
                    {r.taskDescription || "—"}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={cls(
                        "px-2 py-0.5 rounded text-[11px]",
                        badge(r.status),
                      )}
                    >
                      {r.status || "—"}
                    </span>
                    <span className="text-[11px] text-slate-600">
                      {r.date ? moment(r.date).format("DD/MM") : "—"}
                    </span>
                  </div>

                  <div className="mt-2 text-[12px] text-slate-700 break-words whitespace-normal">
                    {r.project?.project_name || "—"}
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                    <div>
                      <div className="text-slate-500">Hours</div>
                      <div>{Number(r.hoursWorked ?? 0)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Billable</div>
                      <div>{r.isBillable ? "Yes" : "No"}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex justify-between">
                  <Link
                    to={`/get-single-attendance/${r._id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                    title="View"
                  >
                    <FaEye className="text-sm" />
                  </Link>
                  <button
                    className="text-rose-600 hover:text-rose-800 text-sm"
                    title="Delete record"
                    onClick={() => removeOne(r._id)}
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </div>
              </div>
            ))}

            {!pageRows.length && (
              <div className="text-center text-[12px] text-slate-500 py-6 col-span-full">
                No records match your filters.
              </div>
            )}
          </div>
        ) : (
          // Card mode
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {pageRows.map((r) => (
              <div
                key={r._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                    <span>{r.employee?.name || "Employee"}</span>
                    <button onClick={() => toggleOne(r._id)} title="Select">
                      {selectedIds.includes(r._id) ? (
                        <FaCheckSquare className="text-emerald-600" />
                      ) : (
                        <FaSquare className="text-slate-400" />
                      )}
                    </button>
                  </div>

                  <div className="mt-1 text-[12px] text-slate-700 break-words whitespace-normal">
                    {r.taskDescription || "—"}
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-[11px]">
                    <span
                      className={cls("px-2 py-0.5 rounded", badge(r.status))}
                    >
                      {r.status || "—"}
                    </span>
                    <span className="px-2 py-0.5 rounded border">
                      {r.isBillable ? "Billable" : "Non-billable"}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                    <div>
                      <div className="text-slate-500">Date</div>
                      <div>
                        {r.date ? moment(r.date).format("DD/MM/YYYY") : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Hours</div>
                      <div>{Number(r.hoursWorked ?? 0)}</div>
                    </div>
                  </div>

                  <div className="mt-2 text-[12px] text-slate-700 break-words whitespace-normal">
                    {r.project?.project_name || "—"}
                  </div>
                </div>

                <div className="mt-3 flex justify-between">
                  <Link
                    to={`/get-single-attendance/${r._id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                    title="View"
                  >
                    <FaEye className="text-sm" />
                  </Link>
                  <button
                    className="text-rose-600 hover:text-rose-800 text-sm"
                    title="Delete record"
                    onClick={() => removeOne(r._id)}
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </div>
              </div>
            ))}

            {!pageRows.length && (
              <div className="text-center text-[12px] text-slate-500 py-6 col-span-full">
                No records match your filters.
              </div>
            )}
          </div>
        )}

        {/* Pagination (AllScenarios spacing) */}
        {!loading && !loadErr && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              title="Previous"
            >
              <FaArrowLeft className="text-lg" />
            </button>
            <span className="text-sm">
              Page {page} of {computedTotalPages}
            </span>
            <button
              className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
              disabled={page === computedTotalPages}
              onClick={() =>
                setPage((p) => Math.min(computedTotalPages, p + 1))
              }
              title="Next"
            >
              <FaArrowRight className="text-lg" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
