import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useParams, Link } from "react-router-dom";
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
    case "assigned":
      return "bg-blue-900 rounded text-center text-white";
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

const roleOptionsMap = {
  superadmin: ["re-assigned", "in-progress", "finished", "closed", "pending"],
  qa_lead: ["re-assigned", "in-progress", "finished", "closed"],
  developer: ["in-progress", "finished"],
  test_engineer: ["in-progress", "finished"],
};

const ViewAssignedTasks = () => {
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

  const fetchAssigned = async () => {
    if (!userId) {
      setLoading(false);
      setLoadErr("Not authenticated.");
      return;
    }
    try {
      setLoading(true);
      setLoadErr("");
      // ✅ Use Tasks-for-User API (optionally filter by project client-side)
      const res = await axios.get(`${api}/users/${userId}/tasks`, {
        headers: authHeader,
      });
      const all = Array.isArray(res?.data) ? res.data : res?.data?.tasks || [];
      const arr = projectId
        ? all.filter((t) => String(t.project?._id || t.project) === projectId)
        : all;
      setTasks(arr);
    } catch (e) {
      console.error("ViewAssignedTasks load error:", e?.response || e);
      setLoadErr(e?.response?.data?.message || "Failed to load tasks.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigned();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, userId]);

  const filtered = useMemo(() => {
    let rows = [...tasks];
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter((t) =>
        [
          t.title,
          t.description,
          t.priority,
          t.status,
          t.startDate ? moment(t.startDate).format("YYYY-MM-DD") : "",
          t.deadline ? moment(t.deadline).format("YYYY-MM-DD") : "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
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
    const opts = roleOptionsMap[userRole] || roleOptionsMap["qa_lead"];
    return opts
      .filter((s) => s !== currentStatus)
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
    } catch (e) {
      console.error("Update assigned task failed:", e?.response || e);
      fetchAssigned(); // rollback
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
              View Assigned Tasks — Project: {projectId}
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

export default ViewAssignedTasks;
