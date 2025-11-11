import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaSync,
  FaEdit,
  FaSave,
  FaTimes,
  FaUserPlus,
  FaPlus,
  FaTrashAlt,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const cls = (...a) => a.filter(Boolean).join(" ");

const fmt = (d) => {
  try {
    const x = new Date(d);
    return isNaN(x.getTime()) ? "—" : x.toLocaleString();
  } catch {
    return "—";
  }
};

const BADGE = (status) => {
  switch ((status || "").toLowerCase()) {
    case "new":
      return "bg-blue-100 text-blue-700";
    case "re-assigned":
      return "bg-orange-500 text-white";
    case "assigned":
      return "bg-blue-500 text-white";
    case "in-progress":
      return "bg-amber-100 text-amber-700";
    case "finished":
      return "bg-green-100 text-green-700";
    case "closed":
      return "bg-gray-300 text-gray-700";
    case "pending":
      return "bg-rose-500 text-white";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const STATUS_VALUES = [
  "new",
  "re-assigned",
  "assigned",
  "in-progress",
  "finished",
  "closed",
  "pending",
];

const PRIORITY_VALUES = ["low", "medium", "high"];

// 👉 how many days before deadline to show "nearing"
const NEAR_THRESHOLD_DAYS = 3;

export default function TaskHistory() {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";
  const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined;
  const api = `${globalBackendRoute}/api`;

  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");

  const [task, setTask] = useState(null);
  const [history, setHistory] = useState([]);

  // project actors / modules (for selectors)
  const [engineers, setEngineers] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [modulesList, setModulesList] = useState([]);

  // edit state
  const [edit, setEdit] = useState(false);
  const [busy, setBusy] = useState(false);

  // editable fields
  const [eStatus, setEStatus] = useState("");
  const [ePriority, setEPriority] = useState("");
  const [eDeadline, setEDeadline] = useState(""); // YYYY-MM-DD
  const [eAssignees, setEAssignees] = useState([]); // ids

  // quick add/remove module
  const [addModuleId, setAddModuleId] = useState("");
  const [removeModuleId, setRemoveModuleId] = useState("");

  // --- helpers ---
  const allUsers = useMemo(
    () => [...engineers, ...developers],
    [engineers, developers]
  );
  const userNameById = (id) => {
    const u = allUsers.find((x) => String(x._id) === String(id));
    return u?.name || "(Unknown)";
  };

  // ---------- LOAD ----------
  const fetchTask = async () => {
    try {
      setLoading(true);
      setLoadErr("");

      const [tRes, tes, devs, mods] = await Promise.all([
        axios.get(`${api}/tasks/${taskId}`, { headers: authHeader }),
        axios.get(`${api}/projects/${projectId}/test-engineers`, {
          headers: authHeader,
        }),
        axios.get(`${api}/projects/${projectId}/developers`, {
          headers: authHeader,
        }),
        axios.get(`${api}/projects/${projectId}/modules`, {
          headers: authHeader,
        }),
      ]);

      const t = tRes?.data || null;
      setTask(t);

      const statusChanges = (t?.history || [])
        .map((h) => h?.statusChanges || [])
        .flat();
      setHistory(statusChanges || []);

      setEngineers(tes?.data?.testEngineers || []);
      setDevelopers(devs?.data?.developers || []);
      setModulesList(mods?.data || []);

      // seed edit fields
      setEStatus((t?.status || "").toLowerCase());
      setEPriority((t?.priority || "").toLowerCase());
      setEDeadline(
        t?.deadline
          ? new Date(t.deadline).toISOString().slice(0, 10)
          : "" /* YYYY-MM-DD */
      );
      setEAssignees(
        (t?.assignedUsers || []).map((u) => u?._id).filter(Boolean)
      );
    } catch (e) {
      console.error("TaskHistory load error:", e?.response || e);
      setLoadErr(e?.response?.data?.message || "Failed to load task.");
      setTask(null);
      setHistory([]);
      setEngineers([]);
      setDevelopers([]);
      setModulesList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, projectId]);

  // ---------- UPDATE ----------
  const saveEdits = async () => {
    if (!task) return;
    try {
      setBusy(true);

      const payload = {
        ...(eStatus ? { status: eStatus } : {}),
        ...(ePriority ? { priority: ePriority } : {}),
        ...(eDeadline ? { deadline: eDeadline } : { deadline: null }),
        ...(Array.isArray(eAssignees) ? { assignedUsers: eAssignees } : {}),
      };

      await axios.put(`${api}/tasks/${taskId}`, payload, {
        headers: authHeader,
      });
      setEdit(false);
      await fetchTask();
    } catch (e) {
      console.error("Save edits failed:", e?.response || e);
      alert(e?.response?.data?.message || "Failed to save changes.");
    } finally {
      setBusy(false);
    }
  };

  const addModule = async () => {
    if (!addModuleId) return;
    try {
      setBusy(true);
      await axios.patch(
        `${api}/tasks/${taskId}/modules/add`,
        { moduleIds: [addModuleId] },
        { headers: authHeader }
      );
      setAddModuleId("");
      await fetchTask();
    } catch (e) {
      console.error("Add module failed:", e?.response || e);
      alert(e?.response?.data?.message || "Failed to add module.");
    } finally {
      setBusy(false);
    }
  };

  const removeModule = async (id) => {
    if (!id) return;
    try {
      setBusy(true);
      await axios.patch(
        `${api}/tasks/${taskId}/modules/remove`,
        { moduleIds: [id] },
        { headers: authHeader }
      );
      await fetchTask();
    } catch (e) {
      console.error("Remove module failed:", e?.response || e);
      alert(e?.response?.data?.message || "Failed to remove module.");
    } finally {
      setBusy(false);
    }
  };

  // ---------- DERIVED ----------
  const title = useMemo(() => task?.task_title || task?.title || "—", [task]);
  const currentStatus = useMemo(() => task?.status || "—", [task]);
  const currentPriority = useMemo(() => task?.priority || "—", [task]);

  const isDone = useMemo(() => {
    const s = (task?.status || "").toLowerCase();
    return s === "finished" || s === "closed";
  }, [task]);

  const daysLeft = useMemo(() => {
    if (!task?.deadline) return null;
    const end = new Date(task.deadline);
    // normalize to date-only delta
    const today = new Date();
    const a = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const b = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    return Math.ceil((b - a) / (1000 * 60 * 60 * 24));
  }, [task]);

  const isOverdue = useMemo(
    () => daysLeft !== null && daysLeft < 0 && !isDone,
    [daysLeft, isDone]
  );
  const isDueToday = useMemo(
    () => daysLeft !== null && daysLeft === 0 && !isDone,
    [daysLeft, isDone]
  );
  const isNearing = useMemo(
    () =>
      daysLeft !== null &&
      daysLeft > 0 &&
      daysLeft <= NEAR_THRESHOLD_DAYS &&
      !isDone,
    [daysLeft, isDone]
  );

  const reminderText = useMemo(() => {
    if (daysLeft === null || isDone) return "";
    if (isOverdue)
      return `Overdue by ${Math.abs(daysLeft)} day${
        Math.abs(daysLeft) === 1 ? "" : "s"
      }`;
    if (isDueToday) return "Due today";
    if (isNearing) return `Due in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
    return "";
  }, [daysLeft, isDone, isOverdue, isDueToday, isNearing]);

  const reminderClass = useMemo(() => {
    if (!reminderText) return "";
    // Always red indicator as requested
    return "bg-rose-100 text-rose-800 border border-rose-200";
  }, [reminderText]);

  const moduleChips = useMemo(() => {
    // support both module_names (strings) and populated modules (objects)
    const namesFromStrings = (task?.module_names || []).map((n) => ({
      _id: `name:${n}`,
      name: n,
      _removableId: null, // unknown id
    }));
    const fromObjs = (task?.modules || []).map((m) => ({
      _id: m?._id,
      name: m?.name,
      _removableId: m?._id,
    }));

    // prefer populated objs; add leftover names not present there
    const setNames = new Set(fromObjs.map((x) => (x.name || "").toLowerCase()));
    const extra = namesFromStrings.filter(
      (x) => !setNames.has((x.name || "").toLowerCase())
    );
    return [...fromObjs, ...extra];
  }, [task]);

  // ---------- UI ----------
  return (
    <div className="bg-white py-6 sm:py-8 text-[13px]">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100"
              onClick={() => navigate(-1)}
              title="Back"
            >
              <FaArrowLeft />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-semibold tracking-tight text-indigo-600 text-[16px]">
                  Task — {loading ? "Loading…" : title}
                </h2>

                {/* 🔴 Red reminder chip (overdue / due today / nearing) */}
                {!!reminderText && (
                  <span
                    className={cls(
                      "px-2 py-0.5 rounded text-[11px] flex items-center gap-2",
                      reminderClass
                    )}
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-rose-600" />
                    {reminderText}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-gray-600">
                {task?._id ? `ID: ${task._id}` : ""}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {!edit ? (
              <button
                className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
                onClick={() => setEdit(true)}
                title="Edit"
              >
                <FaEdit /> <span className="hidden sm:inline">Edit</span>
              </button>
            ) : (
              <>
                <button
                  disabled={busy}
                  className={cls(
                    "px-2 py-1.5 rounded-md text-white flex items-center gap-1",
                    busy
                      ? "bg-emerald-400"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  )}
                  onClick={saveEdits}
                  title="Save"
                >
                  <FaSave /> <span className="hidden sm:inline">Save</span>
                </button>
                <button
                  disabled={busy}
                  className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
                  onClick={() => {
                    setEdit(false);
                    // reset to server values
                    setEStatus((task?.status || "").toLowerCase());
                    setEPriority((task?.priority || "").toLowerCase());
                    setEDeadline(
                      task?.deadline
                        ? new Date(task.deadline).toISOString().slice(0, 10)
                        : ""
                    );
                    setEAssignees(
                      (task?.assignedUsers || [])
                        .map((u) => u?._id)
                        .filter(Boolean)
                    );
                  }}
                  title="Cancel"
                >
                  <FaTimes /> <span className="hidden sm:inline">Cancel</span>
                </button>
              </>
            )}

            <button
              onClick={fetchTask}
              className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
              title="Refresh"
            >
              <FaSync /> <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              to={`/single-project/${projectId}/view-all-tasks`}
              className="bg-indigo-700 text-white px-3 py-1.5 rounded-md hover:bg-indigo-900"
            >
              All Tasks
            </Link>
            <Link
              to={`/single-project/${projectId}`}
              className="bg-indigo-700 text-white px-3 py-1.5 rounded-md hover:bg-indigo-900"
            >
              Project
            </Link>
          </div>
        </div>

        {/* Status strip */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 border rounded-md">
            <div className="text-[11px] text-slate-500">Current Status</div>
            <div className="mt-1">
              {!edit ? (
                <span
                  className={cls("px-2 py-0.5 rounded", BADGE(currentStatus))}
                >
                  {currentStatus}
                </span>
              ) : (
                <select
                  className="px-2 py-1 border rounded"
                  value={eStatus}
                  onChange={(e) => setEStatus(e.target.value)}
                >
                  {STATUS_VALUES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="p-3 border rounded-md">
            <div className="text-[11px] text-slate-500">Priority</div>
            <div className="mt-1">
              {!edit ? (
                <span
                  className={cls(
                    "px-2 py-0.5 rounded border capitalize",
                    (currentPriority || "") === "high"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : (currentPriority || "") === "medium"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  )}
                >
                  {currentPriority}
                </span>
              ) : (
                <select
                  className="px-2 py-1 border rounded capitalize"
                  value={ePriority}
                  onChange={(e) => setEPriority(e.target.value)}
                >
                  {PRIORITY_VALUES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="p-3 border rounded-md">
            <div className="text-[11px] text-slate-500">Deadline</div>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              {!edit ? (
                <>
                  <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200">
                    {task?.deadline ? fmt(task.deadline) : "—"}
                  </span>

                  {/* Inline days-left display with red emphasis */}
                  {reminderText && (
                    <span className="px-2 py-0.5 rounded text-[11px] bg-rose-50 text-rose-700 border border-rose-200">
                      {reminderText}
                    </span>
                  )}
                </>
              ) : (
                <input
                  type="date"
                  className="px-2 py-1 border rounded"
                  value={eDeadline}
                  onChange={(e) => setEDeadline(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Description + Assignees */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 border rounded-md md:col-span-2">
            <div className="text-[11px] text-slate-500">Description</div>
            <div className="mt-1 text-[13px] text-slate-800 whitespace-pre-wrap">
              {task?.description || "—"}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3 text-[12px] text-slate-700">
              <div>
                <div className="text-slate-500">Start</div>
                <div>{task?.startDate ? fmt(task.startDate) : "—"}</div>
              </div>
              <div>
                <div className="text-slate-500">Created</div>
                <div>{task?.createdAt ? fmt(task.createdAt) : "—"}</div>
              </div>
            </div>
          </div>

          <div className="p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-slate-500">Assignees</div>
              {edit && (
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <FaUserPlus /> edit
                </div>
              )}
            </div>
            <div className="mt-2 space-y-1">
              {(task?.assignedUsers || []).length ? (
                (task.assignedUsers || []).map((u) => (
                  <div
                    key={u?._id}
                    className="px-2 py-1 rounded border bg-slate-50 flex items-center justify-between"
                  >
                    <span>{u?.name || "(Unnamed)"}</span>
                    {edit && (
                      <button
                        className="text-rose-600 hover:text-rose-800 text-[12px]"
                        onClick={() =>
                          setEAssignees((prev) =>
                            prev.filter((x) => String(x) !== String(u?._id))
                          )
                        }
                        title="Remove from assignees (will save on Save)"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-slate-500 text-[12px]">No assignees</div>
              )}
            </div>

            {edit && (
              <>
                <div className="mt-3">
                  <div className="text-[11px] text-slate-500">Add/Replace</div>
                  <select
                    multiple
                    className="mt-1 px-2 py-1 border rounded w-full h-[110px]"
                    value={eAssignees.map(String)}
                    onChange={(e) =>
                      setEAssignees(
                        Array.from(e.target.selectedOptions).map((o) => o.value)
                      )
                    }
                    title="Hold Ctrl/Cmd to multi-select"
                  >
                    {allUsers.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} — {u.role}
                      </option>
                    ))}
                  </select>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Changes apply on Save
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Modules */}
        <div className="mt-3 p-3 border rounded-md">
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-slate-500">Modules</div>
            <div className="flex items-center gap-2">
              {edit && (
                <>
                  <div className="flex items-center gap-1">
                    <select
                      className="px-2 py-1 border rounded"
                      value={addModuleId}
                      onChange={(e) => setAddModuleId(e.target.value)}
                    >
                      <option value="">Add module…</option>
                      {modulesList.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <button
                      disabled={!addModuleId || busy}
                      onClick={addModule}
                      className={cls(
                        "px-2 py-1 rounded text-white flex items-center gap-1",
                        !addModuleId || busy
                          ? "bg-indigo-300"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      )}
                      title="Add module"
                    >
                      <FaPlus /> Add
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {moduleChips.length ? (
              moduleChips.map((m) => (
                <span
                  key={`${m._id}-${m.name}`}
                  className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700"
                  title={m._id}
                >
                  {m.name || "(unnamed module)"}
                  {edit && m._removableId && (
                    <button
                      className="ml-2 text-rose-600 hover:text-rose-800"
                      title="Remove"
                      onClick={() => removeModule(m._removableId)}
                    >
                      <FaTrashAlt />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <span className="text-[12px] text-slate-500">
                No modules on this task
              </span>
            )}
          </div>
        </div>

        {/* History */}
        <div className="mt-4 bg-white p-3 border rounded-md">
          <h3 className="text-[15px] font-semibold text-slate-700 mb-2">
            Status History
          </h3>
          {loading ? (
            <div className="text-sm text-gray-600">Loading…</div>
          ) : loadErr ? (
            <div className="text-sm text-red-600">{loadErr}</div>
          ) : history.length === 0 ? (
            <p className="text-gray-600 text-[12px]">
              No history available for this task.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300 text-[12px]">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 border border-gray-300 text-left">
                      #
                    </th>
                    <th className="px-3 py-2 border border-gray-300 text-left">
                      User
                    </th>
                    <th className="px-3 py-2 border border-gray-300 text-left">
                      Status
                    </th>
                    <th className="px-3 py-2 border border-gray-300 text-left">
                      Changed At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((ch, i) => (
                    <tr key={`${ch?.changedAt || ""}-${i}`}>
                      <td className="px-3 py-2 border border-gray-300">
                        {i + 1}
                      </td>
                      <td className="px-3 py-2 border border-gray-300">
                        {ch?.changedBy?.name || "Unknown"}
                      </td>
                      <td className="px-3 py-2 border border-gray-300">
                        <span
                          className={cls(
                            "px-2 py-0.5 rounded",
                            BADGE(ch?.status)
                          )}
                        >
                          {ch?.status || "—"}
                        </span>
                      </td>
                      <td className="px-3 py-2 border border-gray-300">
                        {fmt(ch?.changedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-[11px] text-slate-500">
            Last updated: {task?.updatedAt ? fmt(task.updatedAt) : "—"}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/single-project/${projectId}/view-all-tasks`}
              className="px-3 py-1.5 rounded-md border bg-slate-50 hover:bg-slate-100"
            >
              Back to Tasks
            </Link>
            <Link
              to={`/single-project/${projectId}`}
              className="px-3 py-1.5 rounded-md bg-indigo-700 text-white hover:bg-indigo-900"
            >
              Project Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
