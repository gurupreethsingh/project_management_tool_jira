// src/pages/attendance/GetAllAttendance.jsx
import React, { useEffect, useMemo, useState } from "react";
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
  FaSortAmountDownAlt,
  FaSortAmountUpAlt,
  FaSync,
  FaDownload,
  FaCheckSquare,
  FaSquare,
  FaTrashAlt,
} from "react-icons/fa";
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

// normalize any {_id} / {id} / string to a String id
const getIdStr = (x) => {
  if (!x) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x._id || x.id || x);
  return String(x);
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
    localStorage.getItem("attendance:viewMode") || "list"
  );
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    Number(localStorage.getItem("attendance:pageSize")) || 10
  );

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [billableFilter, setBillableFilter] = useState(""); // "", "true", "false"
  const [quick, setQuick] = useState(""); // "", "today", "week", "month"
  const [employeeFilter, setEmployeeFilter] = useState(""); // NEW
  const [projectFilter, setProjectFilter] = useState(""); // NEW

  // Counts for header badges
  const [statusCounts, setStatusCounts] = useState([]);
  const [employeeCounts, setEmployeeCounts] = useState([]);
  const [projectCounts, setProjectCounts] = useState([]);

  // Optional: list of projects for bulk assign UI (best-effort)
  const [projectsList, setProjectsList] = useState([]);

  // Bulk ops state
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkMode, setBulkMode] = useState("status"); // 'status' | 'assignProject' | 'hoursSet' | 'hoursInc' | 'delete'
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkProject, setBulkProject] = useState(""); // projectId
  const [bulkHours, setBulkHours] = useState(""); // numeric

  // ---------- fetch ----------
  const fetchAll = async () => {
    try {
      setLoading(true);
      setLoadErr("");

      const [listRes, scStatus, scEmp, scProj, projRes] = await Promise.all([
        axios.get(
          `${api}/attendance/view-all-attendance?limit=5000&order=desc`,
          { headers: authHeader }
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

  // ---------- lookup maps (names for badges) ----------
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

  // ---------- computed helpers ----------
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

  // ---------- search + filter + sort ----------
  const filtered = useMemo(() => {
    let out = [...rows];

    if (statusFilter) {
      const s = statusFilter.toLowerCase();
      out = out.filter(
        (r) =>
          (r.status || "").toLowerCase() === s ||
          (s === "approved" && (r.status || "").toLowerCase() === "accepted")
      );
    }

    if (billableFilter) {
      const want = billableFilter === "true";
      out = out.filter((r) => Boolean(r.isBillable) === want);
    }

    if (employeeFilter) {
      out = out.filter(
        (r) => getIdStr(r?.employee?._id || r?.employee?.id) === employeeFilter
      );
    }

    if (projectFilter) {
      out = out.filter(
        (r) => getIdStr(r?.project?._id || r?.project?.id) === projectFilter
      );
    }

    if (quick) out = out.filter((r) => inQuickRange(r));

    if (search.trim()) out = out.filter((r) => matchAny(r, search));

    out.sort((a, b) => {
      const aTs = a?.date ? new Date(a.date).getTime() : 0;
      const bTs = b?.date ? new Date(b.date).getTime() : 0;
      return sortOrder === "desc" ? bTs - aTs : aTs - bTs;
    });

    return out;
  }, [
    rows,
    statusFilter,
    billableFilter,
    employeeFilter,
    projectFilter,
    quick,
    search,
    sortOrder,
  ]);

  // ---------- paging ----------
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  // ---------- single update ----------
  const updateOne = async (id, partial) => {
    try {
      setBusyId(id);
      setRows((prev) =>
        prev.map((r) => (r._id === id ? { ...r, ...partial } : r))
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
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((ids) => ids.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((ids) => Array.from(new Set([...ids, ...visibleIds])));
    }
  };

  const toggleOne = (id) => {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
  };

  const doBulk = async () => {
    if (!selectedIds.length) return alert("Select at least one record.");

    try {
      if (bulkMode === "status") {
        if (!bulkStatus) return alert("Choose a status.");
        await axios.patch(
          `${api}/attendance/bulk/status`,
          { ids: selectedIds, status: bulkStatus },
          { headers: authHeader }
        );
      } else if (bulkMode === "assignProject") {
        const proj = bulkProject.trim() ? bulkProject.trim() : null;
        await axios.patch(
          `${api}/attendance/bulk/assign-project`,
          { ids: selectedIds, project: proj },
          { headers: authHeader }
        );
      } else if (bulkMode === "hoursSet") {
        const h = Number(bulkHours);
        if (!Number.isFinite(h))
          return alert("Enter a valid number for hours.");
        await axios.patch(
          `${api}/attendance/bulk/hours`,
          { ids: selectedIds, operation: "set", hours: h },
          { headers: authHeader }
        );
      } else if (bulkMode === "hoursInc") {
        const h = Number(bulkHours);
        if (!Number.isFinite(h))
          return alert("Enter a valid number for hours.");
        await axios.patch(
          `${api}/attendance/bulk/hours`,
          { ids: selectedIds, operation: "inc", hours: h },
          { headers: authHeader }
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

  // ---------- CSV export ----------
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
          .join(",")
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

  // ---------- UI ----------
  return (
    <div className="bg-white py-6 sm:py-8 text-[13px]">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="min-w-[220px]">
            <h2 className="font-semibold tracking-tight text-indigo-600 text-[16px]">
              Attendance — All Users
            </h2>
            <div className="text-[11px] text-gray-600">
              {loading
                ? "Loading…"
                : `Total: ${rows.length} | Showing: ${filtered.length}`}
            </div>
            <button
              onClick={handleBackToDashboard}
              className="mt-1 text-[11px] underline text-slate-600"
            >
              ← Back to Dashboard
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {sortOrder === "desc" ? (
              <FaSortAmountDownAlt
                className="text-lg cursor-pointer text-gray-500"
                onClick={() =>
                  setSortOrder((s) => (s === "desc" ? "asc" : "desc"))
                }
                title="Sort by latest"
              />
            ) : (
              <FaSortAmountUpAlt
                className="text-lg cursor-pointer text-gray-500"
                onClick={() =>
                  setSortOrder((s) => (s === "desc" ? "asc" : "desc"))
                }
                title="Sort by oldest"
              />
            )}

            <FaThList
              className={cls(
                "text-lg cursor-pointer",
                viewMode === "list" ? "text-indigo-600" : "text-gray-500"
              )}
              onClick={() => setViewMode("list")}
              title="List"
            />
            <FaThLarge
              className={cls(
                "text-lg cursor-pointer",
                viewMode === "card" ? "text-indigo-600" : "text-gray-500"
              )}
              onClick={() => setViewMode("card")}
              title="Card"
            />
            <FaTh
              className={cls(
                "text-lg cursor-pointer",
                viewMode === "grid" ? "text-indigo-600" : "text-gray-500"
              )}
              onClick={() => setViewMode("grid")}
              title="Grid"
            />

            <div className="relative">
              <FaSearch className="absolute left-2 top-2.5 text-gray-400" />
              <input
                className="pl-7 pr-2 py-1.5 border rounded-md w-[240px]"
                placeholder="Search employee, project, task, date…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-600">Rows</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1.5 border rounded-md"
                title="Rows per page"
              >
                {[5, 10, 20, 40, 60, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={exportCSV}
              className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
              title="Export CSV (filtered)"
            >
              <FaDownload /> <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={fetchAll}
              className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
              title="Refresh"
            >
              <FaSync /> <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Quick filters + badges */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <button
                className={cls(
                  "text-[11px] leading-none rounded-full px-2 py-1 border transition",
                  quick === "today"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
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
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
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
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
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
            </div>

            <button
              className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
              onClick={() => {
                setStatusFilter("");
                setBillableFilter("");
                setQuick("");
                setSearch("");
                setEmployeeFilter(""); // NEW
                setProjectFilter(""); // NEW
                setPage(1);
              }}
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
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  )}
                  title={`${s} (${count})`}
                >
                  <span className={cls("px-1 rounded", badge(s))}>{s}</span>{" "}
                  <span className="opacity-70 ml-1">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Project badges — CLICKABLE filter */}
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
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
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

          {/* Employee badges — CLICKABLE filter */}
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
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  )}
                  title={`${label} (${e.count})`}
                >
                  {label} <span className="opacity-70 ml-1">({e.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bulk ops */}
        <div className="mt-3 p-2 border rounded-md bg-amber-50">
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
          <div className="mt-4 space-y-2">
            {/* header */}
            <div className="grid grid-cols-[36px,24px,1.1fr,1.1fr,1.2fr,0.8fr,0.7fr,0.8fr,0.7fr,80px,90px] items-center text-[12px] font-semibold text-slate-600 px-2 py-2 border-b border-slate-200">
              <div>#</div>
              <div className="text-center">
                <button onClick={toggleAllVisible} title="Select all on page">
                  {pageRows.length &&
                  pageRows.every((r) => selectedIds.includes(r._id)) ? (
                    <FaCheckSquare />
                  ) : (
                    <FaSquare />
                  )}
                </button>
              </div>
              <div>Employee</div>
              <div>Project</div>
              <div>Task</div>
              <div>Date</div>
              <div>Hours</div>
              <div>Status</div>
              <div>Billable</div>
              <div className="text-center">View</div>
              <div className="text-center">Delete</div>
            </div>

            {/* rows */}
            <div className="divide-y divide-slate-100">
              {pageRows.map((r, idx) => (
                <div
                  key={r._id}
                  className="grid grid-cols-[36px,24px,1.1fr,1.1fr,1.2fr,0.8fr,0.7fr,0.8fr,0.7fr,80px,90px] items-center text-[12px] px-2 py-2"
                >
                  <div className="text-slate-700">
                    {(page - 1) * pageSize + idx + 1}
                  </div>

                  <div className="flex justify-center">
                    <button onClick={() => toggleOne(r._id)} title="Select">
                      {selectedIds.includes(r._id) ? (
                        <FaCheckSquare className="text-emerald-600" />
                      ) : (
                        <FaSquare className="text-slate-400" />
                      )}
                    </button>
                  </div>

                  <div className="truncate">
                    {(r.employee?.name || "N/A") +
                      (r.employee?.email ? ` (${r.employee.email})` : "")}
                  </div>

                  <div className="truncate">
                    {r.project?.project_name || "—"}
                  </div>

                  <div className="line-clamp-2">{r.taskDescription || "—"}</div>

                  <div>
                    {r.date ? moment(r.date).format("DD/MM/YYYY") : "—"}
                  </div>

                  <div>
                    <input
                      type="number"
                      step="0.25"
                      className="border p-1 rounded w-[80px]"
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
                        badge(r.status)
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

                  <div className="truncate">{r.isBillable ? "Yes" : "No"}</div>

                  <div className="text-center">
                    <Link
                      to={`/get-single-attendance/${r._id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </Link>
                  </div>

                  <div className="text-center">
                    <button
                      className="text-rose-600 hover:text-rose-800 flex items-center gap-1 mx-auto"
                      title="Delete record"
                      onClick={() => removeOne(r._id)}
                    >
                      <FaTrashAlt /> Delete
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
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
            {pageRows.map((r) => (
              <div key={r._id} className="border rounded-lg p-3 shadow-sm">
                <div className="flex justify-between items-start gap-2">
                  <div className="font-semibold text-slate-900 truncate">
                    {r.employee?.name || "Employee"}
                  </div>
                  <button onClick={() => toggleOne(r._id)} title="Select">
                    {selectedIds.includes(r._id) ? (
                      <FaCheckSquare className="text-emerald-600" />
                    ) : (
                      <FaSquare className="text-slate-400" />
                    )}
                  </button>
                </div>

                <div className="mt-1 text-[12px] text-slate-700 line-clamp-2">
                  {r.taskDescription || "—"}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={cls(
                      "px-2 py-0.5 rounded text-[11px]",
                      badge(r.status)
                    )}
                  >
                    {r.status || "—"}
                  </span>
                  <span className="text-[11px] text-slate-600">
                    {r.date ? moment(r.date).format("DD/MM") : "—"}
                  </span>
                </div>

                <div className="mt-2 text-[12px] text-slate-700 truncate">
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

                <div className="mt-2 flex justify-between">
                  <Link
                    to={`/get-single-attendance/${r._id}`}
                    className="text-indigo-600 hover:underline text-[12px]"
                  >
                    View
                  </Link>
                  <button
                    className="text-rose-600 hover:text-rose-800 text-[12px] flex items-center gap-1"
                    title="Delete record"
                    onClick={() => removeOne(r._id)}
                  >
                    <FaTrashAlt /> Delete
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            {pageRows.map((r) => (
              <div key={r._id} className="border rounded-lg p-3 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="font-semibold truncate">
                    {r.employee?.name || "Employee"}
                  </div>
                  <button onClick={() => toggleOne(r._id)} title="Select">
                    {selectedIds.includes(r._id) ? (
                      <FaCheckSquare className="text-emerald-600" />
                    ) : (
                      <FaSquare className="text-slate-400" />
                    )}
                  </button>
                </div>

                <div className="text-[12px] text-slate-700 mt-1 line-clamp-3">
                  {r.taskDescription || "—"}
                </div>

                <div className="mt-2 flex items-center gap-2 text-[11px]">
                  <span className={cls("px-2 py-0.5 rounded", badge(r.status))}>
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

                <div className="mt-2 text-[12px] text-slate-700 truncate">
                  {r.project?.project_name || "—"}
                </div>

                <div className="mt-2 flex justify-between">
                  <Link
                    to={`/get-single-attendance/${r._id}`}
                    className="text-indigo-600 hover:underline text-[12px]"
                  >
                    View
                  </Link>
                  <button
                    className="text-rose-600 hover:text-rose-800 text-[12px] flex items-center gap-1"
                    title="Delete record"
                    onClick={() => removeOne(r._id)}
                  >
                    <FaTrashAlt /> Delete
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

        {/* Pagination */}
        {!loading && !loadErr && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              title="Previous"
            >
              <FaArrowLeft className="text-lg" />
            </button>
            <span className="text-[12px]">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
