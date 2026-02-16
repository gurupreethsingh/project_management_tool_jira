// ViewAllTask.jsx (FULL FILE — compact “table-row” cards + responsive + fast + JWT headers everywhere)
// ✅ Changes:
// - Task UI is now compact row/table-style (shows more tasks on screen)
// - Actions moved into a small right-side icon cluster
// - Details collapsible on demand (keeps rows small)
// - Mobile: stacks into clean blocks, still compact
// - Still supports drag/drop, edit modal, bulk actions, etc.

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  FaSearch,
  FaTrashAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaCalendarAlt,
  FaCheckCircle,
  FaRedoAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const COLUMNS = [
  { key: "NEW", label: "New", bg: "bg-sky-50", border: "border-sky-200" },
  {
    key: "IN_PROGRESS",
    label: "In Progress",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    key: "FINISHED",
    label: "Finished",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    key: "PENDING",
    label: "Pending",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
];

function fmtShort(dt) {
  if (!dt) return "";
  try {
    const d = new Date(dt);
    // compact: 12 Feb, 2:30 PM
    return d.toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function toLocalDTInputValue(date) {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function computeSortOrders(idsInOrder) {
  return idsInOrder.map((id, idx) => ({ id, sortOrder: (idx + 1) * 1000 }));
}

export default function ViewAllTask() {
  const [tasks, setTasks] = useState([]);
  const [counts, setCounts] = useState({
    NEW: 0,
    IN_PROGRESS: 0,
    FINISHED: 0,
    PENDING: 0,
    TOTAL: 0,
  });

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [saving, setSaving] = useState(false);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const selectedCount = selectedIds.size;

  // Row expand/collapse for details
  const [expandedIds, setExpandedIds] = useState(new Set());

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("ecoders_token");

  const authHeaders = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const API = useMemo(
    () => ({
      list: `${globalBackendRoute}/api/todos/list-tasks`,
      counts: `${globalBackendRoute}/api/todos/counts`,
      bulkDelete: `${globalBackendRoute}/api/todos/bulk-delete`,
      bulkStatus: `${globalBackendRoute}/api/todos/bulk-status`,
      bulkReschedule: `${globalBackendRoute}/api/todos/bulk-reschedule`,
      bulkReorder: `${globalBackendRoute}/api/todos/bulk-reorder`,
      updateById: (id) =>
        `${globalBackendRoute}/api/todos/update-task-by-id/${id}`,
      deleteById: (id) =>
        `${globalBackendRoute}/api/todos/delete-task-by-id/${id}`,
      finish: (id) =>
        `${globalBackendRoute}/api/todos/finish-task/${id}/finish`,
      reopen: (id) =>
        `${globalBackendRoute}/api/todos/reopen-task/${id}/reopen`,
    }),
    [],
  );

  const fetchAll = async (overrideQuery) => {
    const query = typeof overrideQuery === "string" ? overrideQuery : q;
    try {
      setLoading(true);

      const [tRes, cRes] = await Promise.all([
        axios.get(API.list, {
          params: query?.trim() ? { q: query.trim() } : {},
          headers: authHeaders,
        }),
        axios.get(API.counts, { headers: authHeaders }),
      ]);

      setTasks(tRes.data?.tasks || []);
      setCounts(cRes.data?.counts || {});
    } catch (err) {
      console.error(
        "fetchAll error:",
        err?.response?.data || err?.message || err,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const byColumn = useMemo(() => {
    const map = { NEW: [], IN_PROGRESS: [], FINISHED: [], PENDING: [] };
    for (const t of tasks) {
      const st = t.effectiveStatus || t.status || "NEW";
      (map[st] ||= []).push(t);
    }
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    }
    return map;
  }, [tasks]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openEdit = (task) => {
    setEditTask({
      ...task,
      startAtInput: toLocalDTInputValue(task.startAt),
      dueAtInput: toLocalDTInputValue(task.dueAt),
      status: task.status || task.effectiveStatus || "NEW",
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditTask(null);
  };

  const saveEdit = async () => {
    if (!editTask?.title?.trim()) return;
    try {
      setSaving(true);
      await axios.put(
        API.updateById(editTask._id),
        {
          title: editTask.title.trim(),
          details: editTask.details || "",
          reportTo: editTask.reportTo || "",
          startAt: editTask.startAtInput
            ? new Date(editTask.startAtInput).toISOString()
            : null,
          dueAt: editTask.dueAtInput
            ? new Date(editTask.dueAtInput).toISOString()
            : null,
          status: editTask.status,
        },
        { headers: authHeaders },
      );
      await fetchAll();
      closeEdit();
    } catch (err) {
      console.error(
        "saveEdit error:",
        err?.response?.data || err?.message || err,
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteOne = async (id) => {
    try {
      await axios.delete(API.deleteById(id), { headers: authHeaders });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      await fetchAll();
    } catch (err) {
      console.error(
        "deleteOne error:",
        err?.response?.data || err?.message || err,
      );
    }
  };

  const markFinished = async (id) => {
    try {
      await axios.post(API.finish(id), {}, { headers: authHeaders });
      await fetchAll();
    } catch (err) {
      console.error(
        "markFinished error:",
        err?.response?.data || err?.message || err,
      );
    }
  };

  const reopenTask = async (id) => {
    try {
      await axios.post(
        API.reopen(id),
        { status: "IN_PROGRESS" },
        { headers: authHeaders },
      );
      await fetchAll();
    } catch (err) {
      console.error(
        "reopenTask error:",
        err?.response?.data || err?.message || err,
      );
    }
  };

  const bulkDelete = async () => {
    if (!selectedCount) return;
    try {
      setBulkBusy(true);
      await axios.post(
        API.bulkDelete,
        { ids: Array.from(selectedIds) },
        { headers: authHeaders },
      );
      clearSelection();
      await fetchAll();
    } catch (err) {
      console.error(
        "bulkDelete error:",
        err?.response?.data || err?.message || err,
      );
    } finally {
      setBulkBusy(false);
    }
  };

  const bulkMoveStatus = async (status) => {
    if (!selectedCount) return;
    try {
      setBulkBusy(true);
      await axios.post(
        API.bulkStatus,
        { ids: Array.from(selectedIds), status },
        { headers: authHeaders },
      );
      clearSelection();
      await fetchAll();
    } catch (err) {
      console.error(
        "bulkMoveStatus error:",
        err?.response?.data || err?.message || err,
      );
    } finally {
      setBulkBusy(false);
    }
  };

  const bulkReschedule = async (dueAtISO) => {
    if (!selectedCount || !dueAtISO) return;
    try {
      setBulkBusy(true);
      await axios.post(
        API.bulkReschedule,
        { ids: Array.from(selectedIds), dueAt: dueAtISO },
        { headers: authHeaders },
      );
      clearSelection();
      await fetchAll();
    } catch (err) {
      console.error(
        "bulkReschedule error:",
        err?.response?.data || err?.message || err,
      );
    } finally {
      setBulkBusy(false);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source } = result;
    if (!destination) return;

    const fromCol = source.droppableId;
    const toCol = destination.droppableId;
    if (fromCol === toCol && destination.index === source.index) return;

    const fromItems = Array.from(byColumn[fromCol] || []);
    const toItems =
      fromCol === toCol ? fromItems : Array.from(byColumn[toCol] || []);

    const [moved] = fromItems.splice(source.index, 1);
    const movedTask = { ...moved, status: toCol, effectiveStatus: toCol };

    if (fromCol === toCol) fromItems.splice(destination.index, 0, movedTask);
    else toItems.splice(destination.index, 0, movedTask);

    const updates = [];
    const fromOrder = computeSortOrders(fromItems.map((t) => t._id));
    for (const o of fromOrder)
      updates.push({ id: o.id, status: fromCol, sortOrder: o.sortOrder });

    if (fromCol !== toCol) {
      const toOrder = computeSortOrders(toItems.map((t) => t._id));
      for (const o of toOrder)
        updates.push({ id: o.id, status: toCol, sortOrder: o.sortOrder });
    }

    // optimistic
    const sortMap = new Map(updates.map((u) => [u.id, u.sortOrder]));
    const statusMap = new Map(updates.map((u) => [u.id, u.status]));
    setTasks((prev) =>
      prev.map((t) => {
        const so = sortMap.get(t._id);
        const st = statusMap.get(t._id);
        if (so == null && st == null) return t;
        return {
          ...t,
          sortOrder: so ?? t.sortOrder,
          status: st ?? t.status,
          effectiveStatus: st,
        };
      }),
    );

    try {
      await axios.post(API.bulkReorder, { updates }, { headers: authHeaders });
      await fetchAll();
    } catch (err) {
      console.error(
        "bulkReorder error:",
        err?.response?.data || err?.message || err,
      );
      await fetchAll();
    }
  };

  const badge = (label, value, tone) => (
    <div
      className={`px-3 py-1 rounded-full text-[11px] font-medium border ${tone}`}
    >
      {label}: <span className="font-semibold">{value ?? 0}</span>
    </div>
  );

  const Row = React.memo(function Row({ task, provided }) {
    const isExpanded = expandedIds.has(task._id);
    const isFinished = task.status === "FINISHED";
    const hasDetails = Boolean(task.details);
    const hasReport = Boolean(task.reportTo);
    const hasStart = Boolean(task.startAt);
    const hasDue = Boolean(task.dueAt);

    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        className="rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition"
      >
        {/* Compact row header */}
        <div className="px-3 py-2 sm:px-4 sm:py-2.5">
          <div className="flex items-start gap-3">
            {/* Left: checkbox + drag handle */}
            <div className="flex items-start gap-2 pt-0.5">
              <input
                type="checkbox"
                checked={selectedIds.has(task._id)}
                onChange={() => toggleSelect(task._id)}
                className="mt-0.5 h-4 w-4"
              />
              <div
                {...provided.dragHandleProps}
                className="select-none text-slate-400 text-xs px-2 py-1 rounded-md border border-slate-200 bg-slate-50"
                title="Drag"
              >
                ⇅
              </div>
            </div>

            {/* Middle: title + mini meta */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {task.title}
                  </div>

                  {/* meta: responsive */}
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                    {hasReport ? (
                      <span className="truncate max-w-[220px]">
                        Report:{" "}
                        <span className="text-slate-700">{task.reportTo}</span>
                      </span>
                    ) : null}
                    {hasStart ? (
                      <span>Start: {fmtShort(task.startAt)}</span>
                    ) : null}
                    {hasDue ? <span>Due: {fmtShort(task.dueAt)}</span> : null}
                  </div>
                </div>

                {/* Right: actions (compact icons) */}
                <div className="flex items-center gap-2">
                  {(hasDetails || !isExpanded) && (
                    <button
                      onClick={() => toggleExpanded(task._id)}
                      className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                      title={isExpanded ? "Hide details" : "Show details"}
                    >
                      {isExpanded ? (
                        <FaChevronUp className="text-slate-600 text-xs" />
                      ) : (
                        <FaChevronDown className="text-slate-600 text-xs" />
                      )}
                    </button>
                  )}

                  {!isFinished ? (
                    <button
                      onClick={() => markFinished(task._id)}
                      className="p-2 rounded-lg border border-emerald-200 hover:bg-emerald-50 transition"
                      title="Finish"
                    >
                      <FaCheckCircle className="text-emerald-700 text-xs" />
                    </button>
                  ) : (
                    <button
                      onClick={() => reopenTask(task._id)}
                      className="p-2 rounded-lg border border-amber-200 hover:bg-amber-50 transition"
                      title="Reopen"
                    >
                      <FaRedoAlt className="text-amber-800 text-xs" />
                    </button>
                  )}

                  <button
                    onClick={() => openEdit(task)}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                    title="Edit"
                  >
                    <FaEdit className="text-slate-600 text-xs" />
                  </button>

                  <button
                    onClick={() => deleteOne(task._id)}
                    className="p-2 rounded-lg border border-rose-200 hover:bg-rose-50 transition"
                    title="Delete"
                  >
                    <FaTrashAlt className="text-rose-600 text-xs" />
                  </button>
                </div>
              </div>

              {/* Expanded details (kept compact) */}
              {isExpanded ? (
                <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 leading-relaxed">
                  {task.details ? (
                    task.details
                  ) : (
                    <span className="text-slate-500">No details.</span>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="bg-white text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50" />
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse" />

        <div className="relative container mx-auto px-3 sm:px-6 lg:px-10 py-8 sm:py-10">
          {/* Header (compact) */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 p-5 sm:p-7">
            <div className="flex justify-between items-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-900">
                View All To-Do List Tasks
                <span className="mx-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  Kanban
                </span>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                  Drag tasks between columns. Rows are compact for faster
                  scanning.
                </p>
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                {badge(
                  "New",
                  counts.NEW,
                  "border-sky-200 text-slate-700 bg-sky-50",
                )}
                {badge(
                  "In Progress",
                  counts.IN_PROGRESS,
                  "border-amber-200 text-slate-700 bg-amber-50",
                )}
                {badge(
                  "Finished",
                  counts.FINISHED,
                  "border-emerald-200 text-slate-700 bg-emerald-50",
                )}
                {badge(
                  "Pending",
                  counts.PENDING,
                  "border-rose-200 text-slate-700 bg-rose-50",
                )}
                {badge(
                  "Total",
                  counts.TOTAL,
                  "border-slate-200 text-slate-700 bg-white",
                )}
              </div>
            </div>
          </div>

          {/* Search + bulk (compact) */}
          <div className="mt-5 rounded-3xl bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
              <div className="lg:col-span-1">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    onClick={() => fetchAll(q)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                  >
                    {loading ? "Refreshing..." : "Apply Search"}
                  </button>

                  <button
                    onClick={() => {
                      setQ("");
                      fetchAll("");
                    }}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="text-xs font-semibold text-slate-700">
                    Bulk Actions{" "}
                    <span className="text-slate-500 font-medium">
                      ({selectedCount} selected)
                    </span>
                  </div>

                  <button
                    disabled={!selectedCount}
                    onClick={clearSelection}
                    className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Clear Selection
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    disabled={!selectedCount || bulkBusy}
                    onClick={() => bulkMoveStatus("NEW")}
                    className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Mark New
                  </button>
                  <button
                    disabled={!selectedCount || bulkBusy}
                    onClick={() => bulkMoveStatus("IN_PROGRESS")}
                    className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Mark In Progress
                  </button>
                  <button
                    disabled={!selectedCount || bulkBusy}
                    onClick={() => bulkMoveStatus("FINISHED")}
                    className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Mark Finished
                  </button>
                  <button
                    disabled={!selectedCount || bulkBusy}
                    onClick={bulkDelete}
                    className="px-3 py-2 rounded-xl text-xs font-medium border border-rose-200 text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                  >
                    Bulk Delete
                  </button>
                </div>

                <div className="mt-3">
                  <div className="text-[11px] text-slate-500 mb-2">
                    Bulk Reschedule (Due Date & Time):
                  </div>
                  <div className="relative max-w-sm">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="datetime-local"
                      onChange={(e) => {
                        const v = e.target.value;
                        if (!v) return;
                        bulkReschedule(new Date(v).toISOString());
                        e.target.value = "";
                      }}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-slate-500">
                  Tip: Row view shows more tasks. Expand a row to see details.
                </div>
              </div>
            </div>
          </div>

          {/* Board (compact rows) */}
          <div className="mt-5">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {COLUMNS.map((col) => {
                  const items = byColumn[col.key] || [];
                  return (
                    <div
                      key={col.key}
                      className={`rounded-3xl border ${col.border} ${col.bg} p-3 sm:p-4`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-semibold text-slate-900">
                          {col.label}
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          {items.length}
                        </div>
                      </div>

                      {/* Table header (hidden on mobile to keep clean) */}
                      <div className="hidden sm:grid grid-cols-[1fr_auto] gap-3 px-3 pb-2 text-[11px] text-slate-500">
                        <div>Task</div>
                        <div className="text-right">Actions</div>
                      </div>

                      <Droppable droppableId={col.key}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="min-h-[120px] space-y-2"
                          >
                            {items.map((task, idx) => (
                              <Draggable
                                key={task._id}
                                draggableId={task._id}
                                index={idx}
                              >
                                {(p) => <Row task={task} provided={p} />}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>

            {loading ? (
              <div className="mt-5 text-sm text-slate-600">
                Loading tasks...
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {editOpen && editTask ? (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-xl p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  Update Task
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Update text, status, start/due date, or reschedule.
                </div>
              </div>

              <button
                onClick={closeEdit}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
              >
                <FaTimes className="text-slate-600" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Title
                </label>
                <input
                  value={editTask.title}
                  onChange={(e) =>
                    setEditTask((p) => ({ ...p, title: e.target.value }))
                  }
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Details
                </label>
                <textarea
                  rows={4}
                  value={editTask.details || ""}
                  onChange={(e) =>
                    setEditTask((p) => ({ ...p, details: e.target.value }))
                  }
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Report To (optional)
                  </label>
                  <input
                    value={editTask.reportTo || ""}
                    onChange={(e) =>
                      setEditTask((p) => ({ ...p, reportTo: e.target.value }))
                    }
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={editTask.startAtInput}
                    onChange={(e) =>
                      setEditTask((p) => ({
                        ...p,
                        startAtInput: e.target.value,
                      }))
                    }
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Due Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={editTask.dueAtInput}
                    onChange={(e) =>
                      setEditTask((p) => ({ ...p, dueAtInput: e.target.value }))
                    }
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Status
                  </label>
                  <select
                    value={editTask.status}
                    onChange={(e) =>
                      setEditTask((p) => ({ ...p, status: e.target.value }))
                    }
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                  >
                    <option value="NEW">NEW</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="FINISHED">FINISHED</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>

                <div className="flex items-end gap-3">
                  <button
                    disabled={saving}
                    onClick={saveEdit}
                    className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    <FaSave className="inline mr-2 text-xs" />
                    {saving ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={closeEdit}
                    className="px-6 py-3 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-slate-500">
              Tip: Row view is compact. Drag using the ⇅ handle.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
