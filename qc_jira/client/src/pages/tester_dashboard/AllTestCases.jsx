import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
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
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const STATUS_PENDING_ID = "__status_missing__";

export default function AllTestCases() {
  const { projectId } = useParams();

  // ---- state ----
  const [testCases, setTestCases] = useState([]);
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // itemsPerPage: number; 0 means "All"
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");

  const [totalTestCases, setTotalTestCases] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);

  // pass/fail/missing counters (recomputed from filtered list)
  const [passedCount, setPassedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [missingCount, setMissingCount] = useState(0);

  // Module filter (supports either embedded module {name} or flat module_name)
  // Also used to hold the "Status Pending" pseudo-chip selection.
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  // ---- helpers ----
  const norm = (v) => (v ?? "").toString().toLowerCase();

  const isMissingStatus = (tc) => {
    const steps = Array.isArray(tc?.testing_steps) ? tc.testing_steps : [];
    if (steps.length === 0) return true;
    // Missing when every step either has no status or not equal to pass/fail
    return steps.every((s) => {
      const st = String(s?.status || "")
        .trim()
        .toLowerCase();
      return st !== "pass" && st !== "fail";
    });
  };

  const getTestStatus = (tc) => {
    if (isMissingStatus(tc)) return "Missing";
    const steps = Array.isArray(tc?.testing_steps) ? tc.testing_steps : [];
    const hasFailed = steps.some(
      (s) => String(s?.status).toLowerCase() === "fail"
    );
    return hasFailed ? "Fail" : "Pass";
  };

  // ---- fetch ----
  useEffect(() => {
    const fetchTCs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}/all-test-cases`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        const rows = Array.isArray(res.data) ? res.data : [];
        setTestCases(rows);
        setTotalTestCases(rows.length);
      } catch (err) {
        console.error("Error fetching test cases:", err);
      }
    };
    fetchTCs();
  }, [projectId]);

  // ---- debounce search ----
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 180);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // ---- module chips from dataset + special "Status Pending" chip ----
  const modules = useMemo(() => {
    const counts = new Map(); // key -> { _id, name, count }
    let missingTotal = 0;

    for (const tc of testCases) {
      if (isMissingStatus(tc)) missingTotal += 1;

      const modObj = tc?.module;
      const modId =
        (modObj && (modObj._id || modObj.id)) ||
        (tc?.module_name ? `name:${tc.module_name}` : "__unassigned__");
      const modName =
        (modObj && (modObj.name || modObj.module_name)) ||
        tc?.module_name ||
        "Unassigned";

      if (!counts.has(modId))
        counts.set(modId, { _id: modId, name: modName, count: 0 });
      counts.get(modId).count += 1;
    }

    const list = Array.from(counts.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

    // append special status-pending chip
    list.unshift({
      _id: STATUS_PENDING_ID,
      name: "Status Pending",
      count: missingTotal,
    });

    return list;
  }, [testCases]);

  // ---- filtered (search + module OR status-pending special) ----
  const filtered = useMemo(() => {
    const q = norm(debouncedQuery);

    const rows = testCases.filter((tc) => {
      // special "Status Pending" filter
      if (selectedModuleId === STATUS_PENDING_ID) {
        if (!isMissingStatus(tc)) return false;
      } else if (selectedModuleId) {
        // module match
        const modObj = tc?.module;
        const modIdCandidate =
          (modObj && (modObj._id || modObj.id)) ||
          (tc?.module_name ? `name:${tc.module_name}` : "__unassigned__");
        if (modIdCandidate !== selectedModuleId) return false;
      }

      // search fields
      const fields = [
        norm(tc?.test_case_name),
        norm(tc?.test_case_number),
        norm(tc?.module?.name || tc?.module_name || "Unassigned"),
        norm(tc?.requirement_number),
        norm(tc?.project?.project_name),
        norm(tc?.createdBy?.name),
      ];
      return q ? fields.some((f) => f.includes(q)) : true;
    });

    // recompute pass/fail/missing on filtered set
    let pass = 0;
    let fail = 0;
    let miss = 0;
    for (const r of rows) {
      const st = getTestStatus(r);
      if (st === "Pass") pass += 1;
      else if (st === "Fail") fail += 1;
      else miss += 1;
    }
    setPassedCount(pass);
    setFailedCount(fail);
    setMissingCount(miss);

    return rows;
  }, [testCases, debouncedQuery, selectedModuleId]);

  // ---- pagination + counts sync ----
  useEffect(() => {
    setFilteredCount(filtered.length);

    if (itemsPerPage === 0) {
      // All
      setTotalPages(1);
      setCurrentPage(1);
      return;
    }

    const pages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    setTotalPages(pages);
    setCurrentPage((p) => Math.min(p, pages));
  }, [filtered, itemsPerPage]);

  // ---- sort by createdAt ----
  const handleSort = () => {
    const sorted = [...testCases].sort((a, b) => {
      const dateA = a?.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b?.createdAt ? new Date(b.createdAt) : new Date(0);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setTestCases(sorted);
    setSortOrder((s) => (s === "asc" ? "desc" : "asc"));
  };

  // ---- pagination slice ----
  const computeCurrentSlice = () => {
    if (itemsPerPage === 0) return filtered; // All
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return filtered.slice(indexOfFirst, indexOfLast);
  };
  const current = computeCurrentSlice();

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  // ---- delete ----
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this test case? This action is irreversible."
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${globalBackendRoute}/api/delete-test-case/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      alert("Test case deleted successfully.");
      const updated = testCases.filter((t) => t._id !== id);
      setTestCases(updated);
      setTotalTestCases(updated.length);
    } catch (error) {
      console.error("Error deleting test case:", error);
      alert(
        error?.response?.data?.message ||
          "Error deleting test case. Please try again."
      );
    }
  };

  const onModuleClick = (id) => {
    setSelectedModuleId((prev) => (prev === id ? null : id));
    setCurrentPage(1);
  };

  const clearModuleSelection = () => {
    setSelectedModuleId(null);
    setCurrentPage(1);
  };

  // ---- UI ----
  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        {/* Header / Controls */}
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div>
            <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
              All Test Cases for Project: {projectId}
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Total Test Cases: {totalTestCases}
            </p>
            {(searchQuery || selectedModuleId) && (
              <p className="text-xs text-gray-600">
                Showing {filteredCount} result(s)
                {searchQuery ? <> for “{searchQuery}”</> : null}
                {selectedModuleId
                  ? selectedModuleId === STATUS_PENDING_ID
                    ? " with status pending"
                    : " in selected module"
                  : null}
              </p>
            )}
            {/* pass/fail/missing badges */}
            <p className="text-[11px] text-slate-600 mt-1">
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 mr-1 font-medium text-emerald-700">
                Pass: {passedCount}
              </span>
              <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 mr-1 font-medium text-rose-700">
                Fail: {failedCount}
              </span>
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
                Missing: {missingCount}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Page size dropdown */}
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

            <div className="relative">
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                className="pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none"
                placeholder="Search test cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              onClick={handleSort}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm inline-flex items-center"
            >
              <FaSort className="mr-1" />
              Sort ({sortOrder === "asc" ? "Oldest" : "Newest"})
            </button>

            <a
              href={`/single-project/${projectId}`}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm"
            >
              Project Dashboard
            </a>
          </div>
        </div>

        {/* Module + Status chips row */}
        <div className="mt-4">
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

          <div className="flex gap-2 overflow-x-auto pb-1">
            {modules.map((m) => {
              const active = selectedModuleId === m._id;
              return (
                <button
                  key={m._id}
                  onClick={() => onModuleClick(m._id)}
                  className={[
                    "whitespace-nowrap px-3 py-1 rounded-full border text-[12px]",
                    active
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
                  ].join(" ")}
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

        {/* List View */}
        {view === "list" && (
          <div className="mt-5">
            {/* global header */}
            <div className="grid grid-cols-[56px,140px,1fr,160px,140px,90px,40px,40px] items-center text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200">
              <div>#</div>
              <div>TC Number</div>
              <div>Name</div>
              <div>Module</div>
              <div>Requirement</div>
              <div>Status</div>
              <div className="text-center">View</div>
              <div className="text-center">Del</div>
            </div>

            {/* rows */}
            <div className="divide-y divide-slate-200">
              {current.map((tc, idx) => {
                const status = getTestStatus(tc);
                const statusClass =
                  status === "Pass"
                    ? "text-emerald-600"
                    : status === "Fail"
                    ? "text-rose-600"
                    : "text-amber-600";
                return (
                  <div
                    key={tc._id}
                    className="grid grid-cols-[56px,140px,1fr,160px,140px,90px,40px,40px] items-center text-[12px] px-3 py-2"
                  >
                    <div className="text-slate-700">
                      {(itemsPerPage === 0
                        ? 0
                        : (currentPage - 1) * itemsPerPage) +
                        idx +
                        1}
                    </div>

                    <div className="text-slate-900 font-medium truncate">
                      {tc?.test_case_number || "-"}
                    </div>

                    <div className="text-slate-700 line-clamp-2">
                      {tc?.test_case_name || "-"}
                    </div>

                    <div className="truncate">
                      <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                        {tc?.module?.name || tc?.module_name || "Unassigned"}
                      </span>
                    </div>

                    <div className="text-slate-700 truncate">
                      {tc?.requirement_number || "-"}
                    </div>

                    <div className={`font-semibold ${statusClass}`}>
                      {status}
                    </div>

                    {/* View column */}
                    <div className="flex justify-center">
                      <Link
                        to={`/test-case-detail/${tc._id}`}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="View"
                      >
                        <FaEye className="text-sm" />
                      </Link>
                    </div>

                    {/* Delete column */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleDelete(tc._id)}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-8">
            {current.map((tc) => {
              const status = getTestStatus(tc);
              const statusClass =
                status === "Pass"
                  ? "text-emerald-600"
                  : status === "Fail"
                  ? "text-rose-600"
                  : "text-amber-600";
              return (
                <div
                  key={tc._id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                      <span>TC: {tc?.test_case_number || "-"}</span>
                      <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                        {tc?.module?.name || tc?.module_name || "Unassigned"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 break-words whitespace-normal mt-1">
                      {tc?.test_case_name || "-"}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-600">
                      Requirement: {tc?.requirement_number || "-"}
                    </div>
                    <div
                      className={`mt-1 text-[12px] font-semibold ${statusClass}`}
                    >
                      {status}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <Link
                      to={`/test-case-detail/${tc._id}`}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      <FaEye className="text-sm" />
                    </Link>
                    <button
                      onClick={() => handleDelete(tc._id)}
                      className="text-rose-500 hover:text-rose-700 text-sm"
                    >
                      <FaTrashAlt className="text-sm" />
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
            {current.map((tc) => {
              const status = getTestStatus(tc);
              const statusClass =
                status === "Pass"
                  ? "text-emerald-600"
                  : status === "Fail"
                  ? "text-rose-600"
                  : "text-amber-600";
              return (
                <div
                  key={tc._id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                      <span>TC: {tc?.test_case_number || "-"}</span>
                      <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                        {tc?.module?.name || tc?.module_name || "Unassigned"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 break-words whitespace-normal mt-1">
                      {tc?.test_case_name || "-"}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-600">
                      Requirement: {tc?.requirement_number || "-"}
                    </div>
                    <div
                      className={`mt-1 text-[12px] font-semibold ${statusClass}`}
                    >
                      {status}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <Link
                      to={`/test-case-detail/${tc._id}`}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      <FaEye className="text-sm" />
                    </Link>
                    <button
                      onClick={() => handleDelete(tc._id)}
                      className="text-rose-500 hover:text-rose-700 text-sm"
                    >
                      <FaTrashAlt className="text-sm" />
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
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <span className="text-sm">
            {itemsPerPage === 0 ? (
              <>Showing all {filteredCount} test cases</>
            ) : (
              <>
                Page {currentPage} of {totalPages}
              </>
            )}
          </span>
          <button
            className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
            disabled={itemsPerPage === 0 || currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <FaArrowRight className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
