import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

const fmt = (d) => {
  try {
    const x = new Date(d);
    return isNaN(x.getTime()) ? "—" : x.toLocaleString();
  } catch {
    return "—";
  }
};

const badge = (status) => {
  switch (status) {
    case "new":
      return "bg-blue-100 rounded text-center";
    case "re-assigned":
      return "bg-orange-500 rounded text-center text-white";
    case "assigned":
      return "bg-blue-500 rounded text-center text-white";
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

const TaskHistory = () => {
  const { projectId, taskId } = useParams();

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";
  const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined;

  const api = `${globalBackendRoute}/api`;

  const [task, setTask] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setLoadErr("");
        // ✅ Use Tasks API
        const res = await axios.get(`${api}/tasks/${taskId}`, {
          headers: authHeader,
        });
        const t = res?.data || null;
        setTask(t);

        const statusChanges = (t?.history || [])
          .map((h) => h?.statusChanges || [])
          .flat();
        setHistory(statusChanges || []);
      } catch (e) {
        console.error("TaskHistory load error:", e?.response || e);
        setLoadErr(
          e?.response?.data?.message || "Failed to load task history."
        );
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [taskId, api]); // projectId not required for this API anymore

  const title = useMemo(() => task?.title || "—", [task]);
  const currentStatus = useMemo(() => task?.status || "—", [task]);

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="bg-white p-6 rounded-md shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-700">
              Task Title: {loading ? "Loading…" : title}
            </h2>
            <div className="flex gap-2 flex-wrap">
              <Link
                to={`/single-project/${projectId}/view-all-tasks`}
                className="bg-indigo-700 btn btn-sm text-white hover:bg-indigo-900"
              >
                All Tasks
              </Link>
              <Link
                to={`/single-project/${projectId}`}
                className="bg-indigo-700 btn btn-sm text-white hover:bg-indigo-900"
              >
                Project Dashboard
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="mt-3 text-sm text-gray-600">Loading…</div>
          ) : loadErr ? (
            <div className="mt-3 text-sm text-red-600">{loadErr}</div>
          ) : (
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-600">
                Description: {task?.description || "—"}
              </h3>
              <p className="mt-3">
                Current Status:{" "}
                <span className={`text-sm px-2 py-1 ${badge(currentStatus)}`}>
                  {currentStatus}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* History */}
        <div className="mt-10 bg-white p-6 rounded-md shadow-lg">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">
            Task History
          </h3>
          {loading ? (
            <div className="text-sm text-gray-600">Loading…</div>
          ) : loadErr ? (
            <div className="text-sm text-red-600">{loadErr}</div>
          ) : history.length === 0 ? (
            <p className="text-gray-600">No history available for this task.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border border-gray-300 text-left">
                      User
                    </th>
                    <th className="px-4 py-2 border border-gray-300 text-left">
                      Status
                    </th>
                    <th className="px-4 py-2 border border-gray-300 text-left">
                      Changed At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((change, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 border border-gray-300">
                        {change?.changedBy?.name || "Unknown"}
                      </td>
                      <td
                        className={`px-4 py-2 border border-gray-300 ${badge(
                          change?.status
                        )}`}
                      >
                        {change?.status || "—"}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {fmt(change?.changedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskHistory;
