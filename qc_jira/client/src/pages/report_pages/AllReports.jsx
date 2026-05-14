import React, {
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
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

const getReportProjectId = (report) => {
  const project = report?.project;

  if (project && typeof project === "object") {
    return String(
      project._id ||
        project.id ||
        project.project_id ||
        project.projectId ||
        "",
    );
  }

  return String(
    project ||
      report?.project_id ||
      report?.projectId ||
      report?.projectID ||
      "",
  );
};

const getProjectName = (report) =>
  report?.project?.projectName ||
  report?.project?.project_name ||
  report?.project?.name ||
  report?.project?.title ||
  "Current Project";

const getTaskName = (report) =>
  report?.task?.title || report?.task?.task_title || "-";

const getReporterName = (report) =>
  report?.reporter?.name ||
  report?.reporter?.email ||
  report?.createdBy?.name ||
  "-";

const hasUserViewed = (report, currentUserId) => {
  if (!report) return false;

  if (!currentUserId) return !!report.isViewed;

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

  return false;
};

const StatusBadge = memo(function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusChipClass(
        status,
      )}`}
    >
      {statusLabel(status)}
    </span>
  );
});

export default function AllReports() {
  const { projectId } = useParams();
  const location = useLocation();

  const token = useMemo(
    () =>
      localStorage.getItem("token") || localStorage.getItem("userToken") || "",
    [],
  );

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token],
  );

  const [projectName, setProjectName] = useState(
    location.state?.projectName || "",
  );

  const [reports, setReports] = useState([]);
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState("");

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
      setCurrentUserId(null);
      setCurrentUserRole("");
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

  useEffect(() => {
    if (!projectId) return;

    let alive = true;
    const controller = new AbortController();

    const fetchProjectName = async () => {
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}`,
          {
            signal: controller.signal,
            headers: authHeaders,
          },
        );

        if (!alive) return;

        const p = res.data || {};
        const pn =
          p.projectName ||
          p.project_name ||
          p.name ||
          p.title ||
          p.project?.projectName ||
          p.project?.project_name ||
          p.project?.name ||
          "";

        if (pn) setProjectName(pn);
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
  }, [projectId, authHeaders]);

  const fetchReports = useCallback(
    async (opts = {}) => {
      if (!projectId) {
        setReports([]);
        setError("Project ID was not found in the URL.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const queryParams = new URLSearchParams();
        queryParams.append("sortBy", "createdAt");
        queryParams.append("sortDir", sortOrder);
        queryParams.append("projectId", projectId);
        queryParams.append("includeDeleted", "true");
        queryParams.append("limit", "1000");

        const url = `${globalBackendRoute}/api/reports?${queryParams.toString()}`;

        const res = await axios.get(url, {
          headers: authHeaders,
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
          setReports([]);
          setError("");
        } else {
          console.error("Error fetching reports:", err);
          setError("Failed to load reports. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    },
    [projectId, sortOrder, authHeaders],
  );

  useEffect(() => {
    fetchReports({ resetPage: true });
  }, [fetchReports]);

  const dq = useDeferredValue(searchQuery);

  const projectReports = useMemo(() => {
    if (!projectId) return [];

    return reports.filter((r) => {
      const reportProjectId = getReportProjectId(r);

      if (!reportProjectId) return false;

      return String(reportProjectId) === String(projectId);
    });
  }, [reports, projectId]);

  const visibleReports = useMemo(() => {
    if (!currentUserId) return projectReports;

    if (isAdminLike) return projectReports;

    return projectReports.filter((r) => {
      const rep = r.reporter;
      const reporterId =
        (rep && (rep._id || rep.id || rep.userId || rep.user_id)) ||
        r.reporterId ||
        r.createdBy ||
        r.created_by;

      if (!reporterId) return false;
      return String(reporterId) === String(currentUserId);
    });
  }, [projectReports, currentUserId, isAdminLike]);

  useEffect(() => {
    if (projectName || !visibleReports.length) return;

    const pn =
      visibleReports[0]?.project?.projectName ||
      visibleReports[0]?.project?.project_name ||
      visibleReports[0]?.project?.name ||
      visibleReports[0]?.project?.title ||
      "";

    if (pn) setProjectName(pn);
  }, [visibleReports, projectName]);

  const filtered = useMemo(() => {
    const tokens = tokenize(dq);

    return visibleReports.filter((r) => {
      const stRaw = r.overallStatus || "unknown";
      const st = String(stRaw || "").toLowerCase();

      if (statusFilter !== "all" && st !== statusFilter.toLowerCase()) {
        return false;
      }

      if (!tokens.length) return true;

      const hay = norm(
        [
          r.title || "",
          r.description || "",
          r.remarks || "",
          r.blockers || "",
          r.nonSubmissionReason || "",
          getProjectName(r),
          getTaskName(r),
          getReporterName(r),
          r.overallStatus || "",
        ].join(" "),
      );

      return tokens.some((t) => hay.includes(t));
    });
  }, [visibleReports, dq, statusFilter]);

  const counts = useMemo(() => {
    let draft = 0;
    let submitted = 0;
    let underReview = 0;
    let approved = 0;
    let rejected = 0;
    let linked = 0;
    let general = 0;
    let deleted = 0;
    let active = 0;

    for (const r of filtered) {
      const st = String(r.overallStatus || "unknown").toLowerCase();

      if (st === "draft") draft += 1;
      else if (st === "submitted") submitted += 1;
      else if (st === "under_review") underReview += 1;
      else if (st === "approved") approved += 1;
      else if (st === "rejected") rejected += 1;

      if (r.project || r.task) linked += 1;
      else general += 1;

      if (r.isDeleted) deleted += 1;
      else active += 1;
    }

    return {
      draft,
      submitted,
      underReview,
      approved,
      rejected,
      linked,
      general,
      deleted,
      active,
    };
  }, [filtered]);

  const totalPages = useMemo(() => {
    if (itemsPerPage === 0) return 1;
    return Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  }, [filtered.length, itemsPerPage]);

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const current = useMemo(() => {
    if (itemsPerPage === 0) return filtered;

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;

    return filtered.slice(indexOfFirst, indexOfLast);
  }, [filtered, itemsPerPage, currentPage]);

  const handleDelete = useCallback(
    async (id) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this report?",
      );

      if (!confirmDelete) return;

      try {
        await axios.delete(`${globalBackendRoute}/api/reports/${id}`, {
          headers: authHeaders,
        });

        alert("Report deleted successfully.");

        setReports((prev) =>
          prev.map((r) =>
            r._id === id
              ? {
                  ...r,
                  isDeleted: true,
                }
              : r,
          ),
        );
      } catch (error) {
        console.error("Error deleting report:", error);
        alert(
          error?.response?.data?.message ||
            "Error deleting report. Please try again.",
        );
      }
    },
    [authHeaders],
  );

  const handleMarkViewed = useCallback(
    async (id) => {
      try {
        if (!currentUserId) {
          setReports((prev) =>
            prev.map((r) =>
              r._id === id
                ? {
                    ...r,
                    isViewed: true,
                  }
                : r,
            ),
          );
          return;
        }

        await axios.patch(
          `${globalBackendRoute}/api/reports/${id}/view`,
          { currentUserId },
          {
            headers: authHeaders,
          },
        );

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
          }),
        );
      } catch (error) {
        console.error("Error marking report as viewed:", error);
      }
    },
    [currentUserId, authHeaders],
  );

  const handleStatusFilterChange = useCallback((e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleRowsChange = useCallback((e) => {
    const v = e.target.value === "0" ? 0 : parseInt(e.target.value, 10);
    setItemsPerPage(v);
    setCurrentPage(1);
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((s) => (s === "asc" ? "desc" : "asc"));
  }, []);

  const totalVisibleReports = visibleReports.length;
  const filteredCount = filtered.length;
  const displayProjectName = projectName || projectId || "Current Project";

  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        <div className="space-y-3 flex flex-wrap">
          <div>
            <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
              All Reports for Project: {displayProjectName}
            </h2>

            <p className="text-xs text-gray-600 mt-1">
              Project ID:{" "}
              <span className="font-medium text-slate-800">
                {projectId || "-"}
              </span>
            </p>

            <p className="text-xs text-gray-600 mt-1">
              Total Reports: {totalVisibleReports}
              {isAdminLike ? " (visible to you as admin)" : ""}
            </p>

            {(searchQuery || statusFilter !== "all") && (
              <p className="text-xs text-gray-600">
                Showing {filteredCount} result(s)
                {searchQuery ? <> for “{searchQuery}”</> : null}
                {statusFilter !== "all"
                  ? ` · Status: ${statusLabel(statusFilter)}`
                  : null}
              </p>
            )}

            <p className="text-[11px] text-slate-600 mt-1 flex flex-wrap gap-1">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
                Draft: {counts.draft}
              </span>

              <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 font-medium text-sky-700">
                Submitted: {counts.submitted}
              </span>

              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
                Under Review: {counts.underReview}
              </span>

              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                Approved: {counts.approved}
              </span>

              <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 font-medium text-rose-700">
                Rejected: {counts.rejected}
              </span>

              <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
                Linked: {counts.linked}
              </span>

              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
                General: {counts.general}
              </span>

              <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 font-medium text-orange-700">
                Deleted: {counts.deleted}
              </span>

              <span className="inline-flex items-center rounded-full border border-lime-200 bg-lime-50 px-2 py-0.5 font-medium text-lime-700">
                Active: {counts.active}
              </span>
            </p>
          </div>

          <div className="w-full overflow-x-auto pb-1">
            <div className="flex flex-wrap items-center gap-3 min-w-max">
              <div className="flex items-center gap-2 shrink-0">
                <label className="text-xs text-slate-600">Status:</label>
                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
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

              <div className="flex items-center gap-2 shrink-0">
                <label className="text-xs text-slate-600">Rows:</label>
                <select
                  value={itemsPerPage}
                  onChange={handleRowsChange}
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

              <div className="relative shrink-0">
                <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  className="pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  spellCheck={false}
                />
              </div>

              <button
                onClick={toggleSortOrder}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm inline-flex items-center"
                title="Server sort by Created date"
              >
                <FaSort className="mr-1" />
                Sort ({sortOrder === "asc" ? "Oldest" : "Newest"})
              </button>

              <Link
                to={`/single-project/${projectId}`}
                className="inline-flex shrink-0 whitespace-nowrap px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm"
              >
                Project Dashboard
              </Link>
            </div>
          </div>
        </div>

        {loading && (
          <p className="mt-4 text-sm text-slate-600">Loading reports…</p>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {!loading && !error && totalVisibleReports === 0 && (
          <p className="mt-4 text-sm text-slate-600">
            No reports found for this project.
          </p>
        )}

        {!loading && !error && totalVisibleReports > 0 && (
          <>
            {view === "list" && (
              <div className="mt-5 overflow-x-auto">
                <div className="min-w-[980px]">
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
                      const created =
                        r.createdAt && new Date(r.createdAt).toLocaleString();

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
                          className={`grid grid-cols-[40px,40px,1.5fr,1.3fr,1.3fr,1.1fr,120px,60px] items-center text-[12px] px-3 py-2 ${
                            r.isDeleted ? "bg-orange-50/40" : ""
                          }`}
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
                            {r.isDeleted && (
                              <div className="text-[10px] text-orange-600 font-semibold mt-0.5">
                                Soft Deleted
                              </div>
                            )}
                          </div>

                          <div className="truncate">
                            <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                              {getProjectName(r)}
                            </span>
                          </div>

                          <div className="text-slate-700 truncate">
                            {getTaskName(r)}
                          </div>

                          <div className="text-slate-700 truncate">
                            {getReporterName(r)}
                          </div>

                          <div className="truncate">
                            <StatusBadge status={r.overallStatus} />
                          </div>

                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/single-report/${r._id}`}
                              className="text-indigo-600 hover:text-indigo-800"
                              title="View / Edit"
                              onClick={() => handleMarkViewed(r._id)}
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
              </div>
            )}

            {(view === "grid" || view === "card") && (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8"
                    : "grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
                }
              >
                {current.map((r) => {
                  const created =
                    r.createdAt && new Date(r.createdAt).toLocaleString();

                  const viewedByUser = hasUserViewed(r, currentUserId);

                  return (
                    <div
                      key={r._id}
                      className={`bg-white rounded-lg shadow p-4 flex flex-col justify-between border ${
                        r.isDeleted
                          ? "border-orange-200 bg-orange-50/40"
                          : "border-slate-100"
                      }`}
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

                        {r.isDeleted && (
                          <div className="mt-1 text-[10px] text-orange-600 font-semibold">
                            Soft Deleted
                          </div>
                        )}

                        <div
                          className={
                            view === "grid"
                              ? "mt-1 text-[11px] text-slate-500 line-clamp-2"
                              : "mt-1 text-[11px] text-slate-500 line-clamp-3"
                          }
                        >
                          {r.description || r.remarks || "-"}
                        </div>

                        <div className="mt-2 text-[11px] text-slate-600">
                          <span className="font-semibold">Project:</span>{" "}
                          {getProjectName(r)}
                        </div>

                        <div className="mt-1 text-[11px] text-slate-600">
                          <span className="font-semibold">Task:</span>{" "}
                          {getTaskName(r)}
                        </div>

                        <div className="mt-1 text-[11px] text-slate-600">
                          <span className="font-semibold">Reporter:</span>{" "}
                          {getReporterName(r)}
                        </div>

                        <div className="mt-1 text-[11px] text-slate-500">
                          {created || "-"}
                        </div>

                        <div className="mt-2">
                          <StatusBadge status={r.overallStatus} />
                        </div>
                      </div>

                      <div className="mt-3 flex justify-between">
                        <Link
                          to={`/single-report/${r._id}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm inline-flex items-center gap-1"
                          onClick={() => handleMarkViewed(r._id)}
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
