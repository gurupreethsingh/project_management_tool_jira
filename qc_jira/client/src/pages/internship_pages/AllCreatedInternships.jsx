import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

const buttonClass =
  "rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

const cardClass = "rounded-xl border border-slate-200 bg-white p-4 shadow-sm";

const AllCreatedInternships = () => {
  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [counts, setCounts] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  const [selectedInternshipIds, setSelectedInternshipIds] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    department: "",
    domain: "",
    mode: "",
    preferredLocation: "",
    duration: "",
    paymentType: "",
    feesPaymentStatus: "",
    skills: "",
    tags: "",
    isPublished: "",
    isDeleted: "",
    sortBy: "createdAt",
    order: "desc",
    page: 1,
    limit: 10,
  });

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, []);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const buildQueryString = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.append(key, value);
      }
    });

    return params.toString();
  };

  const fetchInternships = async (showTableLoader = false) => {
    try {
      if (showTableLoader) setTableLoading(true);
      else setLoading(true);

      setServerError("");

      const queryString = buildQueryString();

      const response = await axios.get(
        `${globalBackendRoute}/api/internships?${queryString}`,
        {
          headers: authHeaders,
        },
      );

      setInternships(response?.data?.data || []);
      setPagination(
        response?.data?.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      );
    } catch (error) {
      console.error("Fetch internships error:", error);
      setServerError(
        error?.response?.data?.message || "Failed to fetch internships.",
      );
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const response = await axios.get(
        `${globalBackendRoute}/api/internships-counts-summary`,
        {
          headers: authHeaders,
        },
      );
      setCounts(response?.data?.data || null);
    } catch (error) {
      console.error("Fetch internship counts error:", error);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get(
        `${globalBackendRoute}/api/internships-filter-options`,
        {
          headers: authHeaders,
        },
      );
      setFilterOptions(response?.data?.data || null);
    } catch (error) {
      console.error("Fetch internship filter options error:", error);
    }
  };

  useEffect(() => {
    fetchInternships();
    fetchCounts();
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchInternships(true);
  }, [filters.page, filters.limit, filters.sortBy, filters.order]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSelectedInternshipIds([]);
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const applyFilters = () => {
    setSelectedInternshipIds([]);
    fetchInternships(true);
  };

  const clearFilters = () => {
    setSelectedInternshipIds([]);
    setFilters({
      search: "",
      department: "",
      domain: "",
      mode: "",
      preferredLocation: "",
      duration: "",
      paymentType: "",
      feesPaymentStatus: "",
      skills: "",
      tags: "",
      isPublished: "",
      isDeleted: "",
      sortBy: "createdAt",
      order: "desc",
      page: 1,
      limit: 10,
    });
  };

  const isAllSelected =
    internships.length > 0 &&
    selectedInternshipIds.length === internships.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedInternshipIds([]);
      return;
    }
    setSelectedInternshipIds(internships.map((item) => item._id));
  };

  const handleSelectOne = (internshipId) => {
    setSelectedInternshipIds((prev) =>
      prev.includes(internshipId)
        ? prev.filter((id) => id !== internshipId)
        : [...prev, internshipId],
    );
  };

  const doSingleSoftDelete = async (internshipId) => {
    const confirmed = window.confirm(
      "Are you sure you want to soft delete this internship?",
    );
    if (!confirmed) return;

    try {
      const response = await axios.delete(
        `${globalBackendRoute}/api/internships/${internshipId}/soft-delete`,
        {
          headers: authHeaders,
        },
      );
      setServerMessage(response?.data?.message || "Internship deleted.");
      fetchInternships(true);
      fetchCounts();
      setSelectedInternshipIds((prev) =>
        prev.filter((id) => id !== internshipId),
      );
    } catch (error) {
      console.error("Single internship soft delete error:", error);
      setServerError(
        error?.response?.data?.message || "Failed to delete internship.",
      );
    }
  };

  const doSinglePublishToggle = async (internshipId) => {
    try {
      const response = await axios.patch(
        `${globalBackendRoute}/api/internships/${internshipId}/toggle-publish`,
        {},
        { headers: authHeaders },
      );
      setServerMessage(
        response?.data?.message || "Internship publish status updated.",
      );
      fetchInternships(true);
      fetchCounts();
    } catch (error) {
      console.error("Toggle internship publish error:", error);
      setServerError(
        error?.response?.data?.message ||
          "Failed to toggle internship publish status.",
      );
    }
  };

  const doBulkAction = async (type) => {
    if (!selectedInternshipIds.length) {
      setServerError("Please select at least one internship.");
      return;
    }

    try {
      setServerError("");
      setServerMessage("");

      let response = null;

      if (type === "soft-delete") {
        response = await axios.patch(
          `${globalBackendRoute}/api/internships/bulk/soft-delete`,
          { internshipIds: selectedInternshipIds },
          { headers: authHeaders },
        );
      } else if (type === "restore") {
        response = await axios.patch(
          `${globalBackendRoute}/api/internships/bulk/restore`,
          { internshipIds: selectedInternshipIds },
          { headers: authHeaders },
        );
      } else if (type === "publish") {
        response = await axios.patch(
          `${globalBackendRoute}/api/internships/bulk/publish`,
          { internshipIds: selectedInternshipIds },
          { headers: authHeaders },
        );
      } else if (type === "unpublish") {
        response = await axios.patch(
          `${globalBackendRoute}/api/internships/bulk/unpublish`,
          { internshipIds: selectedInternshipIds },
          { headers: authHeaders },
        );
      } else if (type === "hard-delete") {
        const confirmed = window.confirm(
          "This will permanently delete the selected internships. Continue?",
        );
        if (!confirmed) return;

        response = await axios.delete(
          `${globalBackendRoute}/api/internships/bulk/hard-delete`,
          {
            headers: authHeaders,
            data: { internshipIds: selectedInternshipIds },
          },
        );
      }

      setServerMessage(response?.data?.message || "Bulk action completed.");
      setSelectedInternshipIds([]);
      fetchInternships(true);
      fetchCounts();
    } catch (error) {
      console.error("Internship bulk action error:", error);
      setServerError(
        error?.response?.data?.message || "Failed to perform bulk action.",
      );
    }
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages) return;
    setFilters((prev) => ({
      ...prev,
      page: nextPage,
    }));
  };

  const getStatusBadge = (item) => {
    if (item?.isDeleted) {
      return (
        <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-600 border border-rose-100">
          Deleted
        </span>
      );
    }

    if (item?.isPublished) {
      return (
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 border border-emerald-100">
          Open
        </span>
      );
    }

    return (
      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-600 border border-amber-100">
        Closed
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white px-3 py-4 sm:px-4 lg:px-5">
      <div className="mx-auto w-full max-w-[98%]">
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
              All Created Internships
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Manage and review all internships from one clean dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate("/create-internship")}
              className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Create New Internship
            </button>
          </div>
        </div>

        {counts ? (
          <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className={cardClass}>
              <p className="text-xs font-medium text-slate-500">
                Total Internships
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-800">
                {counts.totalInternships ?? 0}
              </h3>
            </div>

            <div className={cardClass}>
              <p className="text-xs font-medium text-slate-500">Published</p>
              <h3 className="mt-1 text-xl font-bold text-emerald-600">
                {counts.publishedInternships ?? 0}
              </h3>
            </div>

            <div className={cardClass}>
              <p className="text-xs font-medium text-slate-500">
                Draft / Closed
              </p>
              <h3 className="mt-1 text-xl font-bold text-amber-600">
                {counts.draftInternships ?? 0}
              </h3>
            </div>

            <div className={cardClass}>
              <p className="text-xs font-medium text-slate-500">Deleted</p>
              <h3 className="mt-1 text-xl font-bold text-rose-600">
                {counts.deletedInternships ?? 0}
              </h3>
            </div>
          </div>
        ) : null}

        {serverMessage ? (
          <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            {serverMessage}
          </div>
        ) : null}

        {serverError ? (
          <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
            {serverError}
          </div>
        ) : null}

        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-bold text-slate-800">
              Advanced Filters
            </h2>

            <div className="flex gap-2">
              <button
                onClick={applyFilters}
                className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                Apply
              </button>
              <button
                onClick={clearFilters}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            <input
              type="text"
              name="search"
              placeholder="Search..."
              value={filters.search}
              onChange={handleFilterChange}
              className={inputClass}
            />

            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className={inputClass}
            >
              <option value="">Department</option>
              {(filterOptions?.departments || []).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              name="domain"
              value={filters.domain}
              onChange={handleFilterChange}
              className={inputClass}
            >
              <option value="">Domain</option>
              {(filterOptions?.domains || []).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              name="mode"
              value={filters.mode}
              onChange={handleFilterChange}
              className={inputClass}
            >
              <option value="">Mode</option>
              {(filterOptions?.modes || []).map((item) => (
                <option key={item || "empty"} value={item}>
                  {item || "N/A"}
                </option>
              ))}
            </select>

            <select
              name="preferredLocation"
              value={filters.preferredLocation}
              onChange={handleFilterChange}
              className={inputClass}
            >
              <option value="">Location</option>
              {(filterOptions?.locations || []).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              name="duration"
              value={filters.duration}
              onChange={handleFilterChange}
              className={inputClass}
            >
              <option value="">Duration</option>
              {(filterOptions?.durations || []).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              name="paymentType"
              value={filters.paymentType}
              onChange={handleFilterChange}
              className={inputClass}
            >
              <option value="">Payment Type</option>
              {(filterOptions?.paymentTypes || []).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              name="feesPaymentStatus"
              value={filters.feesPaymentStatus}
              onChange={handleFilterChange}
              className={inputClass}
            >
              <option value="">Fees Status</option>
              <option value="Pending">Pending</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Paid">Paid</option>
            </select>

            <input
              type="text"
              name="skills"
              placeholder="Skills"
              value={filters.skills}
              onChange={handleFilterChange}
              className={inputClass}
            />

            <input
              type="text"
              name="tags"
              placeholder="Tags"
              value={filters.tags}
              onChange={handleFilterChange}
              className={inputClass}
            />

            <select
              name="isPublished"
              value={filters.isPublished}
              onChange={handleFilterChange}
              className={inputClass}
            >
              <option value="">Publish Status</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>

            <select
              name="isDeleted"
              value={filters.isDeleted}
              onChange={handleFilterChange}
              className={inputClass}
            >
              <option value="">Delete Status</option>
              <option value="true">Deleted</option>
              <option value="false">Not Deleted</option>
            </select>

            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className={inputClass}
            >
              <option value="createdAt">Created Date</option>
              <option value="updatedAt">Updated Date</option>
              <option value="title">Title</option>
              <option value="department">Department</option>
              <option value="domain">Domain</option>
              <option value="duration">Duration</option>
              <option value="preferredLocation">Location</option>
              <option value="viewsCount">Views</option>
              <option value="totalApplications">Applications</option>
              <option value="totalSelectedStudents">Selected Students</option>
              <option value="startDate">Start Date</option>
              <option value="endDate">End Date</option>
              <option value="applicationDeadline">Deadline</option>
            </select>

            <select
              name="order"
              value={filters.order}
              onChange={handleFilterChange}
              className={inputClass}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>

        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Bulk Operations
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Selected Internships: {selectedInternshipIds.length}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => doBulkAction("publish")}
                className={`${buttonClass} bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100`}
              >
                Bulk Open
              </button>
              <button
                onClick={() => doBulkAction("unpublish")}
                className={`${buttonClass} bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100`}
              >
                Bulk Close
              </button>
              <button
                onClick={() => doBulkAction("restore")}
                className={`${buttonClass} bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100`}
              >
                Bulk Restore
              </button>
              <button
                onClick={() => doBulkAction("soft-delete")}
                className={`${buttonClass} bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100`}
              >
                Bulk Delete
              </button>
              <button
                onClick={() => doBulkAction("hard-delete")}
                className={`${buttonClass} border border-rose-200 bg-white text-rose-700 hover:bg-rose-50`}
              >
                Permanent Delete
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Title
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Domain
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Duration
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Payment
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Location
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Applications
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Created
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading || tableLoading ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="px-4 py-10 text-center text-sm font-medium text-slate-500"
                    >
                      Loading internships...
                    </td>
                  </tr>
                ) : internships.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="px-4 py-10 text-center text-sm font-medium text-slate-500"
                    >
                      No internships found.
                    </td>
                  </tr>
                ) : (
                  internships.map((item) => (
                    <tr key={item._id} className="transition hover:bg-slate-50">
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedInternshipIds.includes(item._id)}
                          onChange={() => handleSelectOne(item._id)}
                        />
                      </td>

                      <td className="px-3 py-3">
                        <div className="max-w-[220px]">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {item.title}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-slate-500">
                            {item.slug || "No slug"}
                          </p>
                        </div>
                      </td>

                      <td className="px-3 py-3 text-xs text-slate-700">
                        {item.domain || "-"}
                      </td>

                      <td className="px-3 py-3 text-xs text-slate-700">
                        {item.duration || "-"}
                      </td>

                      <td className="px-3 py-3 text-xs text-slate-700">
                        {item.paymentType || "-"}
                      </td>

                      <td className="px-3 py-3 text-xs text-slate-700">
                        {item.preferredLocation || "-"}
                      </td>

                      <td className="px-3 py-3 text-xs text-slate-700">
                        {item.totalApplications || 0}
                      </td>

                      <td className="px-3 py-3">{getStatusBadge(item)}</td>

                      <td className="px-3 py-3 text-xs text-slate-700">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          <Link
                            to={`/single-created-internship/${item._id}`}
                            className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            View
                          </Link>

                          <button
                            onClick={() => doSinglePublishToggle(item._id)}
                            className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition ${
                              item.isPublished
                                ? "border border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                : "border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {item.isPublished ? "Close" : "Open"}
                          </button>

                          <button
                            onClick={() => doSingleSoftDelete(item._id)}
                            className="rounded-md border border-rose-100 bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-600">
              Total: <span className="font-semibold">{pagination.total}</span>
            </div>

            <div className="flex items-center gap-2">
              <select
                name="limit"
                value={filters.limit}
                onChange={handleFilterChange}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700"
              >
                <option value="10">10 / page</option>
                <option value="20">20 / page</option>
                <option value="50">50 / page</option>
              </select>

              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Prev
              </button>

              <span className="px-2 text-xs font-semibold text-slate-700">
                {pagination.page} / {pagination.totalPages || 1}
              </span>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCreatedInternships;
