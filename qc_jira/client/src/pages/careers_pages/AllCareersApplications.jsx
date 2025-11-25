// src/pages/admin/AllCareersApplications.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaUserTie,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  shortlisted: "bg-sky-50 text-sky-700 border-sky-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  on_hold: "bg-slate-50 text-slate-700 border-slate-200",
};

function StatusBadge({ status }) {
  const classes =
    STATUS_COLORS[status] || "bg-slate-50 text-slate-700 border-slate-200";
  let icon = <FaHourglassHalf className="text-[11px]" />;
  if (status === "accepted") icon = <FaCheckCircle className="text-[11px]" />;
  if (status === "rejected") icon = <FaTimesCircle className="text-[11px]" />;
  if (status === "shortlisted") icon = <FaUserTie className="text-[11px]" />;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] capitalize ${classes}`}
    >
      {icon}
      {status.replace("_", " ")}
    </span>
  );
}

export default function AllCareersApplications() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [applyType, setApplyType] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchData = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError("");

      // ✅ Get token (same pattern as other admin pages)
      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      if (!token) {
        setError(
          "You are not authorized. Please log in again as admin / superadmin."
        );
        setLoading(false);
        return;
      }

      const res = await axios.get(`${globalBackendRoute}/api/careers`, {
        params: {
          page: pageNum,
          limit: 20,
          status,
          applyType,
          q,
          sort: "-createdAt",
        },
        headers: {
          Authorization: `Bearer ${token}`, // ✅ send JWT
        },
      });

      if (res.data?.status) {
        setItems(res.data.items || []);
        setPage(res.data.page || 1);
        setPages(res.data.pages || 1);
        setTotal(res.data.total || 0);
      } else {
        setError(res.data?.message || "Failed to fetch applications.");
      }
    } catch (err) {
      console.error("AllCareersApplications fetch error:", err);
      if (err?.response?.status === 401) {
        setError(
          "Unauthorized (401). Please ensure you are logged in as admin / superadmin."
        );
      } else {
        setError("Error fetching applications.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, applyType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData(1);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-semibold text-slate-900">
              Careers Applications
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              View all internship &amp; job applications submitted via the
              careers page.
            </p>
          </div>
          <div className="text-xs sm:text-sm text-slate-500">
            Total applications:{" "}
            <span className="font-semibold text-slate-800">{total}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 mb-4">
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 sm:grid-cols-[minmax(0,2fr),minmax(0,1fr),minmax(0,1fr)] gap-3 items-end"
          >
            {/* Search */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                <span className="inline-flex items-center gap-1">
                  <FaSearch className="text-indigo-500" /> Search
                </span>
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <FaSearch className="text-slate-400 text-sm" />
                <input
                  className="w-full text-sm outline-none bg-transparent"
                  placeholder="Name, email, role, location, notes…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                <span className="inline-flex items-center gap-1">
                  <FaFilter className="text-purple-500" /> Status
                </span>
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="on_hold">On hold</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                <span className="inline-flex items-center gap-1">
                  <FaClock className="text-emerald-500" /> Type
                </span>
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                value={applyType}
                onChange={(e) => setApplyType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="internship">Internship</option>
                <option value="job">Job</option>
              </select>
            </div>
          </form>
        </div>

        {/* Error / loading */}
        {error && (
          <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-700">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-3 text-xs text-slate-500">
            Loading applications…
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-[11px] sm:text-xs">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Name</th>
                <th className="px-3 py-2 text-left font-medium">Type</th>
                <th className="px-3 py-2 text-left font-medium">
                  Desired role
                </th>
                <th className="px-3 py-2 text-left font-medium">Email</th>
                <th className="px-3 py-2 text-left font-medium">Location</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-left font-medium">Applied</th>
              </tr>
            </thead>
            <tbody>
              {items.map((app) => (
                <tr
                  key={app._id}
                  className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"
                  // ✅ Route corrected to your SingleCareersApplication route
                  onClick={() =>
                    navigate(`/single-careers-applications/${app._id}`)
                  }
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">
                      {app.fullName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {app.experienceLevel || "-"}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize">
                    {app.applyType}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {app.desiredRole || "-"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{app.email}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {app.preferredLocation || "-"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <StatusBadge status={app.status || "pending"} />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-slate-500">
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
              {items.length === 0 && !loading && (
                <tr>
                  <td
                    className="px-3 py-6 text-center text-slate-500"
                    colSpan={7}
                  >
                    No applications found for the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-4 flex items-center justify-end gap-3 text-xs text-slate-600">
            <span>
              Page {page} of {pages}
            </span>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => fetchData(page - 1)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => fetchData(page + 1)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
