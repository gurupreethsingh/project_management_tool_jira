// src/pages/admin/AllProjectReports.jsx

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

const PROJECT_GENERAL_ID = "__general_reports__";

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
  "this",
  "that",
  "these",
  "those",
  "show",
  "find",
  "search",
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

const getProjectName = (r) =>
  r?.project?.name ||
  r?.project?.project_name ||
  r?.project?.projectName ||
  r?.project?.title ||
  (r?.project ? "Unnamed Project" : "General / Unlinked");

const getTaskName = (r) => r?.task?.title || r?.task?.task_title || "-";

const getReporterName = (r) =>
  r?.reporter?.name ||
  r?.reporter?.email ||
  r?.createdBy?.name ||
  r?.createdBy?.email ||
  "-";

const getProjectBucketId = (r) => {
  const project = r?.project;
  if (!project) return PROJECT_GENERAL_ID;

  if (typeof project === "object") {
    return String(
      project._id ||
        project.id ||
        project.project_id ||
        project.projectId ||
        project.name ||
        project.projectName ||
        PROJECT_GENERAL_ID,
    );
  }

  return String(project);
};

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

export default function AllProjectReports() {
  const [reports, setReports] = useState([]);
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProjectBucketId, setSelectedProjectBucketId] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;

    try {
      const user = JSON.parse(raw);
      const id = user?.id || user?._id || user?.userId || user?.user_id || null;
      setCurrentUserId(id ? String(id) : null);
    } catch {
      setCurrentUserId(null);
    }
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");

      const params = new URLSearchParams();
      params.append("sortBy", "createdAt");
      params.append("sortDir", sortOrder);
      params.append("limit", "1000");

      const res = await axios.get(
        `${globalBackendRoute}/api/reports?${params.toString()}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      const rows = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];

      setReports(rows);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching all project reports:", err);
      setReports([]);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load reports. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 180);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const visibleReports = useMemo(() => reports, [reports]);

  const projectBuckets = useMemo(() => {
    const map = new Map();

    for (const r of visibleReports) {
      const id = getProjectBucketId(r);
      const name = getProjectName(r);

      if (!map.has(id)) {
        map.set(id, { _id: id, name, count: 0 });
      }

      map.get(id).count += 1;
    }

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
  }, [visibleReports]);

  const filtered = useMemo(() => {
    const tokens = tokenize(debouncedQuery);

    return visibleReports.filter((r) => {
      const st = String(r.overallStatus || "unknown").toLowerCase();

      if (statusFilter !== "all" && st !== statusFilter.toLowerCase()) {
        return false;
      }

      if (selectedProjectBucketId) {
        if (getProjectBucketId(r) !== selectedProjectBucketId) return false;
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
  }, [visibleReports, debouncedQuery, statusFilter, selectedProjectBucketId]);

  const counts = useMemo(() => {
    let draft = 0;
    let submitted = 0;
    let underReview = 0;
    let approved = 0;
    let rejected = 0;
    let linked = 0;
    let general = 0;

    for (const r of filtered) {
      const st = String(r.overallStatus || "unknown").toLowerCase();

      if (st === "draft") draft += 1;
      else if (st === "submitted") submitted += 1;
      else if (st === "under_review") underReview += 1;
      else if (st === "approved") approved += 1;
      else if (st === "rejected") rejected += 1;

      if (r.project || r.task) linked += 1;
      else general += 1;
    }

    return {
      draft,
      submitted,
      underReview,
      approved,
      rejected,
      linked,
      general,
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
    const end = currentPage * itemsPerPage;
    return filtered.slice(end - itemsPerPage, end);
  }, [filtered, currentPage, itemsPerPage]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?",
    );
    if (!confirmDelete) return;

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");

      await axios.delete(`${globalBackendRoute}/api/reports/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setReports((prev) => prev.filter((r) => r._id !== id));
      alert("Report deleted successfully.");
    } catch (err) {
      console.error("Error deleting report:", err);
      alert(err?.response?.data?.message || "Error deleting report.");
    }
  };

  const handleMarkViewed = async (id) => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");

      await axios.patch(
        `${globalBackendRoute}/api/reports/${id}/view`,
        currentUserId ? { currentUserId } : {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      );

      setReports((prev) =>
        prev.map((r) => {
          if (r._id !== id) return r;

          const viewedBy = Array.isArray(r.viewedBy) ? [...r.viewedBy] : [];

          if (currentUserId) {
            const exists = viewedBy.some((u) => {
              const uid =
                typeof u === "string"
                  ? u
                  : u?._id ||
                    u?.id ||
                    u?.userId ||
                    u?.user_id ||
                    u?.toString?.();

              return uid && String(uid) === String(currentUserId);
            });

            if (!exists) viewedBy.push(currentUserId);
          }

          return { ...r, isViewed: true, viewedBy };
        }),
      );
    } catch (err) {
      console.error("Error marking report as viewed:", err);
    }
  };

  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div>
            <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
              All Project Reports
            </h2>

            <p className="text-xs text-gray-600 mt-1">
              Total Reports: {visibleReports.length}
            </p>

            {(searchQuery ||
              selectedProjectBucketId ||
              statusFilter !== "all") && (
              <p className="text-xs text-gray-600">
                Showing {filtered.length} result(s)
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
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-sm border rounded-md px-2 py-1"
              >
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

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
            />

            <FaThLarge
              className={`text-lg cursor-pointer ${
                view === "card" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setView("card")}
            />

            <FaTh
              className={`text-lg cursor-pointer ${
                view === "grid" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setView("grid")}
            />

            <div className="relative">
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
              />
            </div>

            <button
              onClick={() =>
                setSortOrder((s) => (s === "asc" ? "desc" : "asc"))
              }
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm inline-flex items-center"
            >
              <FaSort className="mr-1" />
              Sort ({sortOrder === "asc" ? "Oldest" : "Newest"})
            </button>
          </div>
        </div>

        {loading && (
          <p className="mt-4 text-sm text-slate-600">Loading reports…</p>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {!loading && !error && visibleReports.length === 0 && (
          <p className="mt-4 text-sm text-slate-600">No reports found.</p>
        )}

        {!loading && !error && visibleReports.length > 0 && (
          <>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-slate-700">
                  Filter by Project / General
                </h3>
                <button
                  onClick={() => {
                    setSelectedProjectBucketId(null);
                    setCurrentPage(1);
                  }}
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
                      onClick={() => {
                        setSelectedProjectBucketId((prev) =>
                          prev === b._id ? null : b._id,
                        );
                        setCurrentPage(1);
                      }}
                      className={[
                        "whitespace-nowrap px-3 py-1 rounded-full border text-[12px]",
                        active
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
                      ].join(" ")}
                    >
                      {b.name}{" "}
                      <span className="opacity-70 ml-1">({b.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

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
                    const rowIndex =
                      (itemsPerPage === 0
                        ? 0
                        : (currentPage - 1) * itemsPerPage) +
                      idx +
                      1;

                    const viewedByUser = hasUserViewed(r, currentUserId);
                    const created = r.createdAt
                      ? new Date(r.createdAt).toLocaleString()
                      : "-";

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
                            >
                              <FaCircle className="text-red-500 text-[9px]" />
                            </button>
                          )}
                        </div>

                        <div className="text-slate-900 font-medium line-clamp-2">
                          {r.title || "(No title)"}
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {created}
                          </div>
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
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusChipClass(
                              r.overallStatus,
                            )}`}
                          >
                            {statusLabel(r.overallStatus)}
                          </span>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/single-report/${r._id}`}
                            className="text-indigo-600 hover:text-indigo-800"
                            onClick={() => handleMarkViewed(r._id)}
                          >
                            <FaEye className="text-sm" />
                          </Link>

                          <button
                            onClick={() => handleDelete(r._id)}
                            className="text-rose-600 hover:text-rose-800"
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

            {(view === "grid" || view === "card") && (
              <div
                className={`grid grid-cols-1 ${
                  view === "grid"
                    ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "sm:grid-cols-3"
                } gap-4 mt-8`}
              >
                {current.map((r) => {
                  const viewedByUser = hasUserViewed(r, currentUserId);
                  const created = r.createdAt
                    ? new Date(r.createdAt).toLocaleString()
                    : "-";

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
                            >
                              <FaCircle className="text-red-500 text-[9px]" />
                            </button>
                          )}
                        </div>

                        <div className="mt-1 text-[11px] text-slate-500 line-clamp-3">
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
                          {created}
                        </div>

                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusChipClass(
                              r.overallStatus,
                            )}`}
                          >
                            {statusLabel(r.overallStatus)}
                          </span>
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
                {itemsPerPage === 0
                  ? `Showing all ${filtered.length} reports`
                  : `Page ${currentPage} of ${totalPages}`}
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
