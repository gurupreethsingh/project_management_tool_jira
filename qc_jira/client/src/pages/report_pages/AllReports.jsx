// src/pages/admin/AllReports.jsx

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaSearch,
  FaEye,
  FaTrashAlt,
  FaArrowLeft,
  FaArrowRight,
  FaSort,
  FaCircle,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

/* ---------- Search utils (same pattern as AllTestCases) ---------- */
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
  "report",
  "reports",
  "named",
  "called",
]);

const norm = (s = "") =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // strip accents

const tokenize = (raw) => {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return [];
  return trimmed
    .split(/\s+/)
    .map(norm)
    .filter(Boolean)
    .filter((t) => !STOP_WORDS.has(t));
};
/* --------------------------------------------------------------- */

const PROJECT_GENERAL_ID = "__general_reports__";

const statusLabel = (statusRaw) => {
  const s = String(statusRaw || "").toLowerCase();
  if (s === "draft") return "Draft";
  if (s === "submitted") return "Submitted";
  if (s === "under_review") return "Under Review";
  if (s === "approved") return "Approved";
  if (s === "rejected") return "Rejected";
  return "Unknown";
};

const statusChipClass = (statusRaw) => {
  const s = String(statusRaw || "").toLowerCase();
  if (s === "draft") return "border-slate-200 bg-slate-50 text-slate-700";
  if (s === "submitted") return "border-sky-200 bg-sky-50 text-sky-700";
  if (s === "under_review")
    return "border-amber-200 bg-amber-50 text-amber-700";
  if (s === "approved")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (s === "rejected") return "border-rose-200 bg-rose-50 text-rose-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
};

// ✅ Per-user “viewed” check: use viewedBy + currentUserId, fallback to isViewed if no user
const hasUserViewed = (report, currentUserId) => {
  if (!report) return false;

  // If we don't know the user id (not logged in / no user in localStorage),
  // fall back to the global isViewed flag (old behavior).
  if (!currentUserId) {
    return !!report.isViewed;
  }

  if (Array.isArray(report.viewedBy) && report.viewedBy.length > 0) {
    return report.viewedBy.some((u) => {
      if (!u) return false;
      const uid =
        typeof u === "string"
          ? u
          : u._id || u.id || u.userId || u.user_id || u.toString?.();
      return uid && String(uid) === String(currentUserId);
    });
  }

  // If no viewedBy info, treat as "not viewed" for this user.
  return false;
};

export default function AllReports() {
  // ---- state ----
  const [reports, setReports] = useState([]);
  const [view, setView] = useState("list"); // list | card | grid
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc"); // newest first
  const [statusFilter, setStatusFilter] = useState("all");

  const [filteredCount, setFilteredCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // overallStatus counters (recomputed from filtered list)
  const [draftCount, setDraftCount] = useState(0);
  const [submittedCount, setSubmittedCount] = useState(0);
  const [underReviewCount, setUnderReviewCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [linkedCount, setLinkedCount] = useState(0);
  const [generalCount, setGeneralCount] = useState(0);

  // project / general chips
  const [selectedProjectBucketId, setSelectedProjectBucketId] = useState(null);

  // current user (id + role)
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState("");

  // ---- load current user from localStorage ----
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;

    try {
      const user = JSON.parse(raw);
      const id = user?.id || user?._id || user?.userId || user?.user_id || null;
      const roleRaw = user?.role || user?.userType || user?.userRole || "";
      setCurrentUserId(id ? String(id) : null);
      setCurrentUserRole(String(roleRaw || "").toLowerCase());
    } catch {
      // ignore parse errors; just leave user as null
    }
  }, []);

  const isAdminLike = useMemo(() => {
    const r = (currentUserRole || "").toLowerCase();
    if (!r) return false;
    if (r === "admin" || r === "superadmin" || r === "super_admin") return true;
    if (r.includes("owner")) return true;
    if (r.includes("super") && r.includes("admin")) return true;
    return false;
  }, [currentUserRole]);

  // ---- fetch reports ----
  const fetchReports = async (opts = {}) => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");

      const params = new URLSearchParams();
      params.append("sortBy", "createdAt");
      params.append("order", sortOrder);

      const url = `${globalBackendRoute}/api/reports?${params.toString()}`;

      const res = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const rows = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      setReports(rows);

      if (opts.resetPage) setCurrentPage(1);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        console.warn("Reports endpoint returned 404 – treating as empty list.");
        setReports([]);
        setError("");
      } else {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports({ resetPage: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder]);

  // ---- debounce search ----
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 180);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // ---- visible reports (per-user visibility) ----
  const visibleReports = useMemo(() => {
    if (!currentUserId) return reports;

    if (isAdminLike) {
      // Admin / superadmin: see all reports
      return reports;
    }

    // Normal user: only the reports they created
    return reports.filter((r) => {
      const rep = r.reporter;
      const reporterId =
        (rep && (rep._id || rep.id || rep.userId || rep.user_id)) ||
        r.reporterId ||
        r.createdBy ||
        r.created_by;

      if (!reporterId) return false;
      return String(reporterId) === String(currentUserId);
    });
  }, [reports, currentUserId, isAdminLike]);

  // ---- project chips (Project / General) based on visible reports ----
  const projectBuckets = useMemo(() => {
    const map = new Map(); // key -> { _id, name, count }

    for (const r of visibleReports) {
      const project = r.project;
      const hasProject = !!project;

      const bucketId = hasProject
        ? String(
            project._id || project.id || project.name || project.slug || project
          )
        : PROJECT_GENERAL_ID;

      const bucketName = hasProject
        ? project.name ||
          project.project_name ||
          project.projectName ||
          "Unnamed Project"
        : "General / Unlinked";

      if (!map.has(bucketId)) {
        map.set(bucketId, { _id: bucketId, name: bucketName, count: 0 });
      }
      map.get(bucketId).count += 1;
    }

    const list = Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

    return list;
  }, [visibleReports]);

  // ---- filtered reports (search + status + project bucket) ----
  const filtered = useMemo(() => {
    const tokens = tokenize(debouncedQuery);

    const rows = visibleReports.filter((r) => {
      const stRaw = r.overallStatus || "unknown";
      const st = String(stRaw || "").toLowerCase();

      // status dropdown filter
      if (statusFilter !== "all") {
        if (st !== statusFilter.toLowerCase()) return false;
      }

      // project / general chips filter
      if (selectedProjectBucketId) {
        const project = r.project;
        const hasProject = !!project;
        const bucketId = hasProject
          ? String(
              project._id ||
                project.id ||
                project.name ||
                project.slug ||
                project
            )
          : PROJECT_GENERAL_ID;

        if (bucketId !== selectedProjectBucketId) return false;
      }

      // search tokens
      if (!tokens.length) return true;

      const hay = norm(
        [
          r.title || "",
          r.description || "",
          r.remarks || "",
          r.blockers || "",
          r.nonSubmissionReason || "",
          r.project?.name ||
            r.project?.project_name ||
            r.project?.projectName ||
            "",
          r.task?.title || r.task?.task_title || "",
          r.reporter?.name || r.reporter?.email || "",
          r.overallStatus || "",
        ].join(" ")
      );

      return tokens.some((t) => hay.includes(t));
    });

    // recompute counts from filtered set
    let draft = 0,
      submitted = 0,
      underReview = 0,
      approved = 0,
      rejected = 0,
      linked = 0,
      general = 0;

    for (const r of rows) {
      const stRaw = r.overallStatus || "unknown";
      const st = String(stRaw || "").toLowerCase();
      if (st === "draft") draft += 1;
      else if (st === "submitted") submitted += 1;
      else if (st === "under_review") underReview += 1;
      else if (st === "approved") approved += 1;
      else if (st === "rejected") rejected += 1;

      if (r.project || r.task) linked += 1;
      else general += 1;
    }

    setDraftCount(draft);
    setSubmittedCount(submitted);
    setUnderReviewCount(underReview);
    setApprovedCount(approved);
    setRejectedCount(rejected);
    setLinkedCount(linked);
    setGeneralCount(general);

    return rows;
  }, [visibleReports, debouncedQuery, selectedProjectBucketId, statusFilter]);

  // ---- pagination + counts sync ----
  useEffect(() => {
    setFilteredCount(filtered.length);

    if (itemsPerPage === 0) {
      setTotalPages(1);
      setCurrentPage(1);
      return;
    }

    const pages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    setTotalPages(pages);
    setCurrentPage((p) => Math.min(p, pages));
  }, [filtered, itemsPerPage]);

  // ---- pagination slice ----
  const current = useMemo(() => {
    if (itemsPerPage === 0) return filtered; // All
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return filtered.slice(indexOfFirst, indexOfLast);
  }, [filtered, itemsPerPage, currentPage]);

  // ---- actions ----
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report? This is a soft delete and can be restored from backend tools if implemented."
    );
    if (!confirmDelete) return;

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");
      await axios.delete(`${globalBackendRoute}/api/reports/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      alert("Report deleted successfully.");

      const updated = reports.filter((r) => r._id !== id);
      setReports(updated);
    } catch (error) {
      console.error("Error deleting report:", error);
      alert(
        error?.response?.data?.message ||
          "Error deleting report. Please try again."
      );
    }
  };

  // ✅ Mark a report as viewed for THIS user (backend + local state)
  const handleMarkViewed = async (id) => {
    try {
      // If we don't know the current user, just update local state optimistically
      if (!currentUserId) {
        setReports((prev) =>
          prev.map((r) => {
            if (r._id !== id) return r;
            return {
              ...r,
              isViewed: true,
            };
          })
        );
        return;
      }

      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");

      // Send currentUserId in body so backend can push into viewedBy[]
      await axios.patch(
        `${globalBackendRoute}/api/reports/${id}/view`,
        { currentUserId },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      // Update local state: mark as viewed for THIS user
      setReports((prev) =>
        prev.map((r) => {
          if (r._id !== id) return r;

          const viewedBy = Array.isArray(r.viewedBy) ? [...r.viewedBy] : [];
          const exists = viewedBy.some((u) => {
            if (!u) return false;
            const uid =
              typeof u === "string"
                ? u
                : u._id || u.id || u.userId || u.user_id || u.toString?.();
            return uid && String(uid) === String(currentUserId);
          });

          if (!exists) viewedBy.push(currentUserId);

          return {
            ...r,
            isViewed: true,
            viewedBy,
          };
        })
      );
    } catch (error) {
      console.error("Error marking report as viewed:", error);
    }
  };

  const onProjectBucketClick = (id) => {
    setSelectedProjectBucketId((prev) => (prev === id ? null : id));
    setCurrentPage(1);
  };

  const clearProjectSelection = () => {
    setSelectedProjectBucketId(null);
    setCurrentPage(1);
  };

  const totalVisibleReports = visibleReports.length;

  // ---- header / summary ----
  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        {/* Header / Controls */}
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div>
            <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
              All Reports
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Total Reports: {totalVisibleReports}
              {isAdminLike ? " (visible to you as admin)" : ""}
            </p>
            {(searchQuery ||
              selectedProjectBucketId ||
              statusFilter !== "all") && (
              <p className="text-xs text-gray-600">
                Showing {filteredCount} result(s)
                {searchQuery ? <> for “{searchQuery}”</> : null}
                {selectedProjectBucketId
                  ? selectedProjectBucketId === PROJECT_GENERAL_ID
                    ? " · General / Unlinked"
                    : " · Selected project"
                  : null}
                {statusFilter !== "all"
                  ? ` · Status: ${statusLabel(statusFilter)}`
                  : null}
              </p>
            )}
            <p className="text-[11px] text-slate-600 mt-1 space-x-1">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
                Draft: {draftCount}
              </span>
              <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 font-medium text-sky-700">
                Submitted: {submittedCount}
              </span>
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
                Under Review: {underReviewCount}
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                Approved: {approvedCount}
              </span>
              <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 font-medium text-rose-700">
                Rejected: {rejectedCount}
              </span>
              <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
                Linked: {linkedCount}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
                General: {generalCount}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Status filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-sm border rounded-md px-2 py-1"
                title="Filter by overall status"
              >
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Page size */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600">Rows:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  const v =
                    e.target.value === "0" ? 0 : parseInt(e.target.value, 10);
                  setItemsPerPage(v);
                  setCurrentPage(1);
                }}
                className="text-sm border rounded-md px-2 py-1"
                title="Select number of rows per page"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={60}>60</option>
                <option value={0}>All</option>
              </select>
            </div>

            {/* View toggles */}
            <FaThList
              className={`text-lg cursor-pointer ${
                view === "list" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setView("list")}
              title="List view"
            />
            <FaThLarge
              className={`text-lg cursor-pointer ${
                view === "card" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setView("card")}
              title="Card view"
            />
            <FaTh
              className={`text-lg cursor-pointer ${
                view === "grid" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setView("grid")}
              title="Grid view"
            />

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                className="pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                spellCheck={false}
              />
            </div>

            {/* Sort order toggle */}
            <button
              onClick={() =>
                setSortOrder((s) => (s === "asc" ? "desc" : "asc"))
              }
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm inline-flex items-center"
              title="Server sort by Created date"
            >
              <FaSort className="mr-1" />
              Sort ({sortOrder === "asc" ? "Oldest" : "Newest"})
            </button>
          </div>
        </div>

        {/* Loading & error */}
        {loading && (
          <p className="mt-4 text-sm text-slate-600">Loading reports…</p>
        )}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {/* Early exit */}
        {!loading && !error && totalVisibleReports === 0 && (
          <p className="mt-4 text-sm text-slate-600">
            No reports found yet for your account.
          </p>
        )}

        {/* Project / General chips row */}
        {!loading && !error && totalVisibleReports > 0 && (
          <>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-slate-700">
                  Filter by Project / General
                </h3>
                <button
                  onClick={clearProjectSelection}
                  className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
                >
                  Clear
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {projectBuckets.map((b) => {
                  const active = selectedProjectBucketId === b._id;
                  return (
                    <button
                      key={b._id}
                      onClick={() => onProjectBucketClick(b._id)}
                      className={[
                        "whitespace-nowrap px-3 py-1 rounded-full border text-[12px]",
                        active
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
                      ].join(" ")}
                      title={`${b.name} (${b.count})`}
                    >
                      {b.name}{" "}
                      <span className="opacity-70 ml-1">({b.count})</span>
                    </button>
                  );
                })}
                {projectBuckets.length === 0 && (
                  <span className="text-slate-500 text-sm">
                    No project buckets found
                  </span>
                )}
              </div>
            </div>

            {/* List View */}
            {view === "list" && (
              <div className="mt-5">
                <div className="grid grid-cols-[40px,40px,1.5fr,1.3fr,1.3fr,1.1fr,120px,60px] items-center text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200">
                  <div>#</div>
                  <div>New</div>
                  <div>Title</div>
                  <div>Project</div>
                  <div>Task</div>
                  <div>Reporter</div>
                  <div>Status</div>
                  <div className="text-center">Actions</div>
                </div>

                <div className="divide-y divide-slate-200">
                  {current.map((r, idx) => {
                    const st = statusLabel(r.overallStatus);
                    const created =
                      r.createdAt && new Date(r.createdAt).toLocaleString();
                    const projectName =
                      r.project?.name ||
                      r.project?.project_name ||
                      r.project?.projectName ||
                      (r.project ? "Unnamed Project" : "General / Unlinked");
                    const taskName = r.task?.title || r.task?.task_title || "-";
                    const reporterName =
                      r.reporter?.name ||
                      r.reporter?.email ||
                      r.createdBy?.name ||
                      "-";

                    const rowIndex =
                      (itemsPerPage === 0
                        ? 0
                        : (currentPage - 1) * itemsPerPage) +
                      idx +
                      1;

                    const viewedByUser = hasUserViewed(r, currentUserId);

                    return (
                      <div
                        key={r._id}
                        className="grid grid-cols-[40px,40px,1.5fr,1.3fr,1.3fr,1.1fr,120px,60px] items-center text-[12px] px-3 py-2"
                      >
                        <div className="text-slate-700">{rowIndex}</div>

                        <div className="flex items-center justify-center">
                          {!viewedByUser && (
                            <button
                              type="button"
                              onClick={() => handleMarkViewed(r._id)}
                              title="Mark as viewed"
                            >
                              <FaCircle className="text-red-500 text-[9px]" />
                            </button>
                          )}
                        </div>

                        <div className="text-slate-900 font-medium line-clamp-2">
                          {r.title || "(No title)"}
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {created || "-"}
                          </div>
                        </div>

                        <div className="truncate">
                          <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                            {projectName}
                          </span>
                        </div>

                        <div className="text-slate-700 truncate">
                          {taskName}
                        </div>

                        <div className="text-slate-700 truncate">
                          {reporterName}
                        </div>

                        <div className="truncate">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusChipClass(
                              r.overallStatus
                            )}`}
                          >
                            {st}
                          </span>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/single-report/${r._id}`}
                            className="text-indigo-600 hover:text-indigo-800"
                            title="View / Edit"
                            onClick={() => handleMarkViewed(r._id)} // ✅ mark when opening
                          >
                            <FaEye className="text-sm" />
                          </Link>
                          <button
                            onClick={() => handleDelete(r._id)}
                            className="text-rose-600 hover:text-rose-800"
                            title="Delete"
                          >
                            <FaTrashAlt className="text-sm" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Grid View */}
            {view === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                {current.map((r) => {
                  const st = statusLabel(r.overallStatus);
                  const projectName =
                    r.project?.name ||
                    r.project?.project_name ||
                    r.project?.projectName ||
                    (r.project ? "Unnamed Project" : "General / Unlinked");
                  const taskName = r.task?.title || r.task?.task_title || "-";
                  const reporterName =
                    r.reporter?.name ||
                    r.reporter?.email ||
                    r.createdBy?.name ||
                    "-";
                  const created =
                    r.createdAt && new Date(r.createdAt).toLocaleString();

                  const viewedByUser = hasUserViewed(r, currentUserId);

                  return (
                    <div
                      key={r._id}
                      className="bg-white rounded-lg shadow p-4 flex flex-col justify-between border border-slate-100"
                    >
                      <div>
                        <div className="text-sm font-semibold text-gray-700 flex items-center justify-between gap-2">
                          <span className="line-clamp-1">
                            {r.title || "(No title)"}
                          </span>
                          {!viewedByUser && (
                            <button
                              type="button"
                              onClick={() => handleMarkViewed(r._id)}
                              title="Mark as viewed"
                            >
                              <FaCircle className="text-red-500 text-[9px]" />
                            </button>
                          )}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                          {r.description || r.remarks || "-"}
                        </div>
                        <div className="mt-2 text-[11px] text-slate-600">
                          <span className="font-semibold">Project:</span>{" "}
                          {projectName}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-600">
                          <span className="font-semibold">Task:</span>{" "}
                          {taskName}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-600">
                          <span className="font-semibold">Reporter:</span>{" "}
                          {reporterName}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500">
                          {created || "-"}
                        </div>
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusChipClass(
                              r.overallStatus
                            )}`}
                          >
                            {st}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <Link
                          to={`/single-report/${r._id}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm inline-flex items-center gap-1"
                          onClick={() => handleMarkViewed(r._id)} // ✅ mark when opening
                        >
                          <FaEye className="text-sm" />
                          <span>View</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="text-rose-600 hover:text-rose-800 text-sm inline-flex items-center gap-1"
                        >
                          <FaTrashAlt className="text-sm" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Card View */}
            {view === "card" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {current.map((r) => {
                  const st = statusLabel(r.overallStatus);
                  const projectName =
                    r.project?.name ||
                    r.project?.project_name ||
                    r.project?.projectName ||
                    (r.project ? "Unnamed Project" : "General / Unlinked");
                  const taskName = r.task?.title || r.task?.task_title || "-";
                  const reporterName =
                    r.reporter?.name ||
                    r.reporter?.email ||
                    r.createdBy?.name ||
                    "-";
                  const created =
                    r.createdAt && new Date(r.createdAt).toLocaleString();

                  const viewedByUser = hasUserViewed(r, currentUserId);

                  return (
                    <div
                      key={r._id}
                      className="bg-white rounded-lg shadow p-4 flex flex-col justify-between border border-slate-100"
                    >
                      <div>
                        <div className="text-sm font-semibold text-gray-700 flex items-center justify-between gap-2">
                          <span className="line-clamp-1">
                            {r.title || "(No title)"}
                          </span>
                          {!viewedByUser && (
                            <button
                              type="button"
                              onClick={() => handleMarkViewed(r._id)}
                              title="Mark as viewed"
                            >
                              <FaCircle className="text-red-500 text-[9px]" />
                            </button>
                          )}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500 line-clamp-3">
                          {r.description || r.remarks || "-"}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-600">
                          <span className="font-semibold">Project:</span>{" "}
                          {projectName}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-600">
                          <span className="font-semibold">Task:</span>{" "}
                          {taskName}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-600">
                          <span className="font-semibold">Reporter:</span>{" "}
                          {reporterName}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500">
                          {created || "-"}
                        </div>
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusChipClass(
                              r.overallStatus
                            )}`}
                          >
                            {st}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <Link
                          to={`/single-report/${r._id}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm inline-flex items-center gap-1"
                          onClick={() => handleMarkViewed(r._id)} // ✅ mark when opening
                        >
                          <FaEye className="text-sm" />
                          <span>View</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="text-rose-600 hover:text-rose-800 text-sm inline-flex items-center gap-1"
                        >
                          <FaTrashAlt className="text-sm" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
                disabled={itemsPerPage === 0 || currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <FaArrowLeft className="text-lg" />
              </button>
              <span className="text-sm">
                {itemsPerPage === 0 ? (
                  <>Showing all {filteredCount} reports</>
                ) : (
                  <>
                    Page {currentPage} of {totalPages}
                  </>
                )}
              </span>
              <button
                className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
                disabled={itemsPerPage === 0 || currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <FaArrowRight className="text-lg" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
