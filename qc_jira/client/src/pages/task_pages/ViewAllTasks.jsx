import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import {
  FaSearch,
  FaThList,
  FaThLarge,
  FaTh,
  FaArrowLeft,
  FaArrowRight,
  FaSortAmountDownAlt,
  FaSortAmountUpAlt,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const badge = (status) => {
  switch (status) {
    case "new":
      return "bg-blue-100 rounded text-center";
    case "re-assigned":
      return "bg-orange-500 rounded text-center text-white";
    case "in-progress":
      return "bg-orange-100 rounded text-center";
    case "finished":
      return "bg-green-100 rounded text-center";
    case "closed":
      return "bg-gray-300 rounded text-center";
    case "pending":
      return "bg-red-500 rounded text-center text-white";
    default:
      return "rounded text-center";
  }
};

const formatInputDate = (d) => (d ? moment(d).format("YYYY-MM-DD") : "");

const roleOptionsMap = {
  elevated: ["re-assigned", "in-progress", "finished", "closed", "pending"],
  developer: ["in-progress", "finished"],
  test_engineer: ["in-progress", "finished"],
};

const getRoleBucket = (role) =>
  ["superadmin", "admin", "project_manager", "qa_lead"].includes(role)
    ? "elevated"
    : role;

const ViewAllTasks = () => {
  const { projectId } = useParams();

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

  const userRole = user?.role || "developer";
  const userId = user?.id || user?._id;

  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setLoadErr("");
      // ✅ Use Tasks-by-Project API
      const res = await axios.get(`${api}/projects/${projectId}/tasks`, {
        headers: authHeader,
      });
      const arr = Array.isArray(res?.data) ? res.data : res?.data?.tasks || [];
      setTasks(arr);
    } catch (e) {
      console.error("ViewAllTasks load error:", e?.response || e);
      setLoadErr(e?.response?.data?.message || "Failed to load tasks.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // search + sort + paginate
  const filtered = useMemo(() => {
    let rows = [...tasks];
    const q = search.trim().toLowerCase();

    if (q) {
      rows = rows.filter((t) => {
        const assignedNames = (t.assignedUsers || [])
          .map((u) => String(u?.name || ""))
          .join(" ")
          .toLowerCase();
        const parts = [
          t.title,
          t.description,
          t.priority,
          t.status,
          t.startDate ? moment(t.startDate).format("DD/MM/YYYY") : "",
          t.deadline ? moment(t.deadline).format("DD/MM/YYYY") : "",
          assignedNames,
        ]
          .join(" ")
          .toLowerCase();
        return parts.includes(q);
      });
    }

    rows.sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    return rows;
  }, [tasks, search, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const renderStatusOptions = (currentStatus) => {
    if (currentStatus === "closed")
      return [
        <option key="closed" value="closed">
          Closed
        </option>,
      ];

    const bucket = getRoleBucket(userRole);
    const opts = roleOptionsMap[bucket] || [];
    return opts
      .filter((o) => o !== currentStatus)
      .map((s) => (
        <option key={s} value={s}>
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ));
  };

  const updateTask = async (taskId, partial) => {
    if (!userId) return;

    try {
      setBusyId(taskId);
      // optimistic
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, ...partial } : t))
      );

      // ✅ Use Task update endpoint
      await axios.put(`${api}/tasks/${taskId}`, partial, {
        headers: authHeader,
      });
      // Optionally re-fetch for server truth
      // await fetchTasks();
    } catch (e) {
      console.error("Update task failed:", e?.response || e);
      fetchTasks(); // rollback by refetch
      alert(
        e?.response?.data?.message ||
          "Failed to update task. Your changes were rolled back."
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <h2 className="text-left font-semibold tracking-tight text-indigo-600">
              All Tasks for Project: {projectId}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              {loading ? "Loading…" : `Total Tasks: ${tasks.length}`}
            </p>
            {search && !loading && (
              <p className="text-sm text-gray-600">
                Showing {filtered.length} result(s) for “{search}”
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3 flex-wrap">
            {sortOrder === "desc" ? (
              <FaSortAmountDownAlt
                className="text-xl cursor-pointer text-gray-500"
                onClick={() =>
                  setSortOrder((s) => (s === "desc" ? "asc" : "desc"))
                }
                title="Sort by latest"
              />
            ) : (
              <FaSortAmountUpAlt
                className="text-xl cursor-pointer text-gray-500"
                onClick={() =>
                  setSortOrder((s) => (s === "desc" ? "asc" : "desc"))
                }
                title="Sort by oldest"
              />
            )}
            <FaThList
              className={`text-xl cursor-pointer ${
                viewMode === "list" ? "text-indigo-600" : "text-gray-500"
              }`}
              onClick={() => setViewMode("list")}
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${
                viewMode === "card" ? "text-indigo-600" : "text-gray-500"
              }`}
              onClick={() => setViewMode("card")}
            />
            <FaTh
              className={`text-xl cursor-pointer ${
                viewMode === "grid" ? "text-indigo-600" : "text-gray-500"
              }`}
              onClick={() => setViewMode("grid")}
            />
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                className="pl-10 pr-4 py-2 border rounded-md"
                placeholder="Search…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Link
              to={`/single-project/${projectId}`}
              className="bg-indigo-700 text-white px-3 py-2 rounded-md hover:bg-indigo-900"
            >
              Project Dashboard
            </Link>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="mt-6 text-sm text-gray-600">Loading…</div>
        ) : loadErr ? (
          <div className="mt-6 text-sm text-red-600">{loadErr}</div>
        ) : viewMode === "list" ? (
          <div className="mt-10 space-y-6">
            {pageRows.map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between bg-white rounded-lg shadow p-4"
              >
                <div className="flex flex-1 flex-wrap gap-4">
                  <div className="min-w-[12rem]">
                    <span className="block text-sm font-semibold text-gray-600">
                      Title
                    </span>
                    <span className="text-sm text-gray-900">{task.title}</span>
                  </div>
                  <div className="min-w-[16rem]">
                    <span className="block text-sm font-semibold text-gray-600">
                      Description
                    </span>
                    <span className="text-sm text-gray-900">
                      {task.description}
                    </span>
                  </div>
                  <div className="min-w-[8rem]">
                    <span className="block text-sm font-semibold text-gray-600">
                      Priority
                    </span>
                    <span className="text-sm text-gray-900">
                      {task.priority}
                    </span>
                  </div>
                  <div className="min-w-[8rem]">
                    <span className="block text-sm font-semibold text-gray-600 text-center">
                      Status
                    </span>
                    <span
                      className={`text-sm font-bold px-2 ${badge(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <div className="min-w-[8rem]">
                    <span className="block text-sm font-semibold text-gray-600">
                      Start Date
                    </span>
                    <span className="text-sm text-gray-900">
                      {task.startDate
                        ? moment(task.startDate).format("DD/MM/YYYY")
                        : "N/A"}
                    </span>
                  </div>
                  <div className="min-w-[8rem]">
                    <span className="block text-sm font-semibold text-gray-600">
                      End Date
                    </span>
                    <span className="text-sm text-gray-900">
                      {task.deadline
                        ? moment(task.deadline).format("DD/MM/YYYY")
                        : "No deadline"}
                    </span>
                  </div>
                  <div className="min-w-[12rem]">
                    <span className="block text-sm font-semibold text-gray-600">
                      Assigned Users
                    </span>
                    <div className="text-sm text-gray-900">
                      {(task.assignedUsers || [])
                        .map((u) => u.name)
                        .join(", ") || "—"}
                    </div>
                  </div>

                  {/* Deadline editor (elevated roles) */}
                  {["superadmin", "admin", "qa_lead"].includes(userRole) && (
                    <div className="min-w-[12rem]">
                      <span className="block text-sm font-semibold text-gray-600">
                        Update Deadline
                      </span>
                      <input
                        type="date"
                        className="border border-gray-300 p-2 rounded"
                        value={formatInputDate(task.deadline)}
                        onChange={(e) =>
                          updateTask(task._id, { deadline: e.target.value })
                        }
                        disabled={
                          busyId === task._id || task.status === "closed"
                        }
                      />
                    </div>
                  )}

                  {/* Status editor */}
                  <div className="min-w-[12rem]">
                    <span className="block text-sm font-semibold text-gray-600">
                      Change Status
                    </span>
                    <select
                      className="bg-white border border-gray-300 px-2 py-1 rounded-lg"
                      defaultValue=""
                      onChange={(e) =>
                        updateTask(task._id, { status: e.target.value })
                      }
                      disabled={busyId === task._id || task.status === "closed"}
                    >
                      <option value="" disabled hidden>
                        Select…
                      </option>
                      {renderStatusOptions(task.status)}
                    </select>
                  </div>

                  <div className="min-w-[6rem]">
                    <Link
                      to={`/single-project/${projectId}/single-task/${task._id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      History
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 text-sm text-gray-500">
            Card/Grid view not implemented here. (List view provides full
            editing.)
          </div>
        )}

        {/* Pagination */}
        {!loading && !loadErr && (
          <div className="flex justify-center items-center space-x-2 mt-10">
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <FaArrowRight className="text-xl" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllTasks;
