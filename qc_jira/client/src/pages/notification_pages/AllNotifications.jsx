import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaFilter,
  FaSync,
  FaThList,
  FaThLarge,
  FaTh,
  FaArrowLeft,
  FaArrowRight,
  FaSortAmountDown,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

/**
 * AdminNotifications
 * - Lists all notifications with filters, search, sort, and three views
 * - Each item links to /notification/:id
 */
const AllNotifications = () => {
  const navigate = useNavigate();

  /** =====================
   *  View + Pagination
   *  ===================== */
  const [view, setView] = useState("grid"); // "grid" | "card" | "list"
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  /** =====================
   *  Filters / Search
   *  ===================== */
  const [search, setSearch] = useState(""); // text search (server must support)
  const [audience, setAudience] = useState(""); // "", "all" | "role" | "user"
  const [role, setRole] = useState(""); // receiverRole
  const [type, setType] = useState(""); // "task_update" | "bug_report" | "comment" | "reply" | "alert"
  const [priority, setPriority] = useState(""); // "low" | "medium" | "high" | "urgent"
  const [status, setStatus] = useState(""); // "unread" | "read" | "seen" | "replied" (server must support)
  const [fromDate, setFromDate] = useState(""); // yyyy-mm-dd
  const [toDate, setToDate] = useState(""); // yyyy-mm-dd
  const [sort, setSort] = useState("-createdAt"); // "-createdAt", "createdAt", "priority", "-priority", etc.

  /** =====================
   *  Data
   *  ===================== */
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState("");

  /** =====================
   *  Helpers
   *  ===================== */
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token");

  const canQuery = useMemo(() => !!token, [token]);

  const resetFilters = () => {
    setSearch("");
    setAudience("");
    setRole("");
    setType("");
    setPriority("");
    setStatus("");
    setFromDate("");
    setToDate("");
    setSort("-createdAt");
    setPage(1);
    setLimit(20);
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setLoadErr("");

      const params = { page, limit, sort };

      // Only include filter params if they have a value
      if (search) params.search = search.trim();
      if (audience) params.audience = audience;
      if (role) params.role = role;
      if (type) params.type = type;
      if (priority) params.priority = priority;
      if (status) params.status = status;
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const res = await axios.get(`${globalBackendRoute}/api/admin/messages`, {
        params,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const rows = res?.data?.data || [];
      const totalRows = res?.data?.total || 0;

      setData(rows);
      setTotal(totalRows);
    } catch (err) {
      console.error("Fetch notifications failed:", err);
      setLoadErr(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load notifications."
      );
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  /** =====================
   *  Effects
   *  ===================== */
  useEffect(() => {
    if (!canQuery) return;
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    limit,
    audience,
    role,
    type,
    priority,
    status,
    fromDate,
    toDate,
    sort,
  ]);

  // Debounce search
  useEffect(() => {
    if (!canQuery) return;
    const t = setTimeout(() => {
      setPage(1);
      fetchNotifications();
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  /** =====================
   *  Render helpers
   *  ===================== */
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const nextPage = () => setPage((p) => Math.min(totalPages, p + 1));
  const prevPage = () => setPage((p) => Math.max(1, p - 1));

  const roleOptions = [
    "accountant",
    "admin",
    "alumni_relations",
    "business_analyst",
    "content_creator",
    "course_coordinator",
    "customer_support",
    "data_scientist",
    "dean",
    "department_head",
    "developer",
    "developer_lead",
    "event_coordinator",
    "exam_controller",
    "hr_manager",
    "intern",
    "legal_advisor",
    "librarian",
    "maintenance_staff",
    "marketing_manager",
    "operations_manager",
    "product_owner",
    "project_manager",
    "qa_lead",
    "recruiter",
    "registrar",
    "researcher",
    "sales_executive",
    "student",
    "superadmin",
    "support_engineer",
    "teacher",
    "tech_lead",
    "test_engineer",
    "test_lead",
    "user",
    "ux_ui_designer",
  ];

  const typeOptions = [
    "task_update",
    "bug_report",
    "comment",
    "reply",
    "alert",
  ];
  const priorityOptions = ["low", "medium", "high", "urgent"];
  const statusOptions = ["unread", "read", "seen", "replied"];
  const audienceOptions = ["all", "role", "user"];

  /** =====================
   *  Item (List/Card/Grid)
   *  ===================== */
  const ItemCard = ({ n }) => {
    return (
      <Link
        to={`/notification/${n._id}`}
        className="block bg-white border rounded-lg p-4 hover:shadow-md transition"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
            {n.audience}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(n.createdAt).toLocaleString()}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          <div className="font-semibold text-gray-800 line-clamp-1">
            {n.message}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {n.receiverRole && (
              <span className="text-[11px] px-2 py-1 rounded bg-indigo-50 text-indigo-700">
                Role: {n.receiverRole}
              </span>
            )}
            {n.type && (
              <span className="text-[11px] px-2 py-1 rounded bg-blue-50 text-blue-700">
                {n.type}
              </span>
            )}
            {n.priority && (
              <span className="text-[11px] px-2 py-1 rounded bg-amber-50 text-amber-700">
                {n.priority}
              </span>
            )}
            {n.sender?.name && (
              <span className="text-[11px] px-2 py-1 rounded bg-gray-100 text-gray-700">
                From: {n.sender.name}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  const ItemRow = ({ n }) => {
    return (
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-2 whitespace-nowrap text-xs">
          <Link
            to={`/notification/${n._id}`}
            className="text-indigo-600 underline"
          >
            {n._id}
          </Link>
        </td>
        <td className="px-4 py-2 text-sm text-gray-800">{n.message}</td>
        <td className="px-4 py-2 text-xs">{n.audience}</td>
        <td className="px-4 py-2 text-xs">{n.receiverRole || "-"}</td>
        <td className="px-4 py-2 text-xs">{n.type || "-"}</td>
        <td className="px-4 py-2 text-xs">{n.priority || "-"}</td>
        <td className="px-4 py-2 text-xs">{n.sender?.name || "-"}</td>
        <td className="px-4 py-2 text-xs text-gray-500">
          {new Date(n.createdAt).toLocaleString()}
        </td>
      </tr>
    );
  };

  /** =====================
   *  Page
   *  ===================== */
  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
          <h3 className="text-2xl font-bold text-start text-indigo-600">
            All Notifications
          </h3>

          {/* View toggles */}
          <div className="flex items-center space-x-3">
            <FaThList
              className={`text-xl cursor-pointer ${
                view === "list" ? "text-indigo-600" : "text-gray-600"
              }`}
              title="List view"
              onClick={() => setView("list")}
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${
                view === "card" ? "text-indigo-600" : "text-gray-600"
              }`}
              title="Card view"
              onClick={() => setView("card")}
            />
            <FaTh
              className={`text-xl cursor-pointer ${
                view === "grid" ? "text-indigo-600" : "text-gray-600"
              }`}
              title="Grid view"
              onClick={() => setView("grid")}
            />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border rounded-lg p-4 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Search (message / sender / role)
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
                  placeholder="Type to search..."
                />
              </div>
            </div>

            {/* Audience */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Audience
              </label>
              <select
                value={audience}
                onChange={(e) => {
                  setAudience(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All</option>
                {["all", "role", "user"].map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Receiver Role
              </label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">Any</option>
                {roleOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">Any</option>
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">Any</option>
                {priorityOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">Any</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                From
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                To
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Sort
              </label>
              <div className="relative">
                <FaSortAmountDown className="absolute left-3 top-2.5 text-gray-400" />
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
                >
                  <option value="-createdAt">Newest first</option>
                  <option value="createdAt">Oldest first</option>
                  <option value="priority">Priority (low→high)</option>
                  <option value="-priority">Priority (high→low)</option>
                  <option value="type">Type (A→Z)</option>
                  <option value="-type">Type (Z→A)</option>
                </select>
              </div>
            </div>

            {/* Reset + Refresh */}
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center px-3 py-2 border rounded-md text-sm bg-white hover:bg-gray-50"
                title="Reset filters"
              >
                <FaFilter className="mr-2" />
                Reset
              </button>
              <button
                type="button"
                onClick={() => fetchNotifications()}
                className="inline-flex items-center px-3 py-2 border rounded-md text-sm bg-white hover:bg-gray-50"
                title="Refresh"
              >
                <FaSync className={`mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white border rounded-lg p-0">
          {/* Loading / Error */}
          {loading && <div className="p-6 text-sm text-gray-600">Loading…</div>}
          {!loading && loadErr && (
            <div className="p-6 text-sm text-red-600">{loadErr}</div>
          )}
          {!loading && !loadErr && data.length === 0 && (
            <div className="p-6 text-sm text-gray-600">
              No notifications found.
            </div>
          )}

          {!loading && !loadErr && data.length > 0 && (
            <>
              {/* LIST VIEW */}
              {view === "list" && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          Message
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          Audience
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          Role
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          Type
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          Priority
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          Sender
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {data.map((n) => (
                        <ItemRow key={n._id} n={n} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CARD VIEW */}
              {view === "card" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {data.map((n) => (
                    <ItemCard key={n._id} n={n} />
                  ))}
                </div>
              )}

              {/* GRID VIEW (denser) */}
              {view === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                  {data.map((n) => (
                    <ItemCard key={n._id} n={n} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="text-xs text-gray-600">
                  Page <span className="font-semibold">{page}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span> • Total:{" "}
                  <span className="font-semibold">{total}</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="px-2 py-1 border rounded text-xs"
                  >
                    {[10, 20, 30, 50].map((n) => (
                      <option key={n} value={n}>
                        {n} / page
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={prevPage}
                    disabled={page <= 1}
                    className={`inline-flex items-center px-3 py-1 border rounded text-xs ${
                      page <= 1
                        ? "opacity-50 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <FaArrowLeft className="mr-2" /> Prev
                  </button>

                  <button
                    onClick={nextPage}
                    disabled={page >= totalPages}
                    className={`inline-flex items-center px-3 py-1 border rounded text-xs ${
                      page >= totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    Next <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Back / Create actions (optional) */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-indigo-600 hover:text-indigo-800 underline"
          >
            Go Back
          </button>
          <Link
            to="/create-notification"
            className="text-sm text-indigo-600 hover:text-indigo-800 underline"
          >
            Create Notification
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AllNotifications;
