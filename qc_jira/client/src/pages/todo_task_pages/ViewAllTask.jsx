// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";
// import { Link } from "react-router-dom";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import {
//   FaSearch,
//   FaTrashAlt,
//   FaEdit,
//   FaSave,
//   FaTimes,
//   FaCalendarAlt,
//   FaCheckCircle,
//   FaRedoAlt,
//   FaChevronDown,
//   FaChevronUp,
// } from "react-icons/fa";

// const COLUMNS = [
//   { key: "NEW", label: "New", bg: "bg-sky-50", border: "border-sky-200" },
//   {
//     key: "IN_PROGRESS",
//     label: "In Progress",
//     bg: "bg-amber-50",
//     border: "border-amber-200",
//   },
//   {
//     key: "FINISHED",
//     label: "Finished",
//     bg: "bg-emerald-50",
//     border: "border-emerald-200",
//   },
//   {
//     key: "PENDING",
//     label: "Pending",
//     bg: "bg-rose-50",
//     border: "border-rose-200",
//   },
// ];

// // ✅ Local date formatter (no time shown)
// function fmtDate(dt) {
//   if (!dt) return "";
//   try {
//     const d = new Date(dt);
//     return d.toLocaleDateString(undefined, {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   } catch {
//     return "";
//   }
// }

// // ✅ Convert Date -> YYYY-MM-DD in LOCAL time (matches <input type="date" />)
// function toYMDLocal(dateValue) {
//   if (!dateValue) return "";
//   const d = new Date(dateValue);
//   if (Number.isNaN(d.getTime())) return "";
//   const pad = (n) => String(n).padStart(2, "0");
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
// }

// // ✅ Convert "YYYY-MM-DD" to ISO at LOCAL midnight
// function dateOnlyToISO(ymd) {
//   if (!ymd) return null;
//   const [y, m, d] = String(ymd).split("-").map(Number);
//   if (!y || !m || !d) return null;
//   const localMidnight = new Date(y, m - 1, d, 0, 0, 0, 0);
//   return localMidnight.toISOString();
// }

// // ✅ For edit modal date input value
// function toDateInputValue(date) {
//   if (!date) return "";
//   return toYMDLocal(date);
// }

// function computeSortOrders(idsInOrder) {
//   return idsInOrder.map((id, idx) => ({ id, sortOrder: (idx + 1) * 1000 }));
// }

// export default function ViewAllTask() {
//   const [tasks, setTasks] = useState([]);
//   const [counts, setCounts] = useState({
//     NEW: 0,
//     IN_PROGRESS: 0,
//     FINISHED: 0,
//     PENDING: 0,
//     TOTAL: 0,
//   });

//   const [q, setQ] = useState("");
//   const [loading, setLoading] = useState(true);

//   // ✅ NEW: Date filter
//   const [selectedDate, setSelectedDate] = useState("");

//   const [editOpen, setEditOpen] = useState(false);
//   const [editTask, setEditTask] = useState(null);
//   const [saving, setSaving] = useState(false);

//   const [selectedIds, setSelectedIds] = useState(new Set());
//   const [bulkBusy, setBulkBusy] = useState(false);
//   const selectedCount = selectedIds.size;

//   const [expandedIds, setExpandedIds] = useState(new Set());

//   // ✅ Bulk reschedule date (fixed)
//   const [bulkDueDate, setBulkDueDate] = useState("");

//   const token =
//     localStorage.getItem("token") ||
//     localStorage.getItem("authToken") ||
//     localStorage.getItem("ecoders_token");

//   const authHeaders = useMemo(() => {
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   }, [token]);

//   const API = useMemo(
//     () => ({
//       list: `${globalBackendRoute}/api/todos/list-tasks`,
//       counts: `${globalBackendRoute}/api/todos/counts`,
//       bulkDelete: `${globalBackendRoute}/api/todos/bulk-delete`,
//       bulkStatus: `${globalBackendRoute}/api/todos/bulk-status`,
//       bulkReschedule: `${globalBackendRoute}/api/todos/bulk-reschedule`,
//       bulkReorder: `${globalBackendRoute}/api/todos/bulk-reorder`,
//       updateById: (id) =>
//         `${globalBackendRoute}/api/todos/update-task-by-id/${id}`,
//       deleteById: (id) =>
//         `${globalBackendRoute}/api/todos/delete-task-by-id/${id}`,
//       finish: (id) =>
//         `${globalBackendRoute}/api/todos/finish-task/${id}/finish`,
//       reopen: (id) =>
//         `${globalBackendRoute}/api/todos/reopen-task/${id}/reopen`,
//     }),
//     [],
//   );

//   const fetchAll = async (overrideQuery) => {
//     const query = typeof overrideQuery === "string" ? overrideQuery : q;
//     try {
//       setLoading(true);

//       const [tRes, cRes] = await Promise.all([
//         axios.get(API.list, {
//           params: query?.trim() ? { q: query.trim() } : {},
//           headers: authHeaders,
//         }),
//         axios.get(API.counts, { headers: authHeaders }),
//       ]);

//       setTasks(tRes.data?.tasks || []);
//       setCounts(cRes.data?.counts || {});
//     } catch (err) {
//       console.error(
//         "fetchAll error:",
//         err?.response?.data || err?.message || err,
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAll("");
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ✅ FILTER TASKS BY SELECTED DATE (startAt OR dueAt) — status ignored
//   const filteredTasks = useMemo(() => {
//     if (!selectedDate) return tasks;

//     return tasks.filter((t) => {
//       const s = toYMDLocal(t.startAt);
//       const d = toYMDLocal(t.dueAt);
//       return s === selectedDate || d === selectedDate;
//     });
//   }, [tasks, selectedDate]);

//   // ✅ COLUMN GROUPING STILL WORKS (but uses filteredTasks)
//   const byColumn = useMemo(() => {
//     const map = { NEW: [], IN_PROGRESS: [], FINISHED: [], PENDING: [] };
//     for (const t of filteredTasks) {
//       const st = t.effectiveStatus || t.status || "NEW";
//       (map[st] ||= []).push(t);
//     }
//     for (const k of Object.keys(map)) {
//       map[k].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
//     }
//     return map;
//   }, [filteredTasks]);

//   const toggleSelect = (id) => {
//     setSelectedIds((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });
//   };

//   const clearSelection = () => setSelectedIds(new Set());

//   const toggleExpanded = (id) => {
//     setExpandedIds((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });
//   };

//   const openEdit = (task) => {
//     setEditTask({
//       ...task,
//       startAtInput: toDateInputValue(task.startAt),
//       dueAtInput: toDateInputValue(task.dueAt),
//       status: task.status || task.effectiveStatus || "NEW",
//     });
//     setEditOpen(true);
//   };

//   const closeEdit = () => {
//     setEditOpen(false);
//     setEditTask(null);
//   };

//   const saveEdit = async () => {
//     if (!editTask?.title?.trim()) return;
//     try {
//       setSaving(true);

//       await axios.put(
//         API.updateById(editTask._id),
//         {
//           title: editTask.title.trim(),
//           details: editTask.details || "",
//           reportTo: editTask.reportTo || "",

//           // ✅ DATE ONLY -> ISO at local midnight
//           startAt: editTask.startAtInput
//             ? dateOnlyToISO(editTask.startAtInput)
//             : null,
//           dueAt: editTask.dueAtInput
//             ? dateOnlyToISO(editTask.dueAtInput)
//             : null,

//           status: editTask.status,
//         },
//         { headers: authHeaders },
//       );

//       await fetchAll();
//       closeEdit();
//     } catch (err) {
//       console.error(
//         "saveEdit error:",
//         err?.response?.data || err?.message || err,
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const deleteOne = async (id) => {
//     try {
//       await axios.delete(API.deleteById(id), { headers: authHeaders });
//       setSelectedIds((prev) => {
//         const next = new Set(prev);
//         next.delete(id);
//         return next;
//       });
//       setExpandedIds((prev) => {
//         const next = new Set(prev);
//         next.delete(id);
//         return next;
//       });
//       await fetchAll();
//     } catch (err) {
//       console.error(
//         "deleteOne error:",
//         err?.response?.data || err?.message || err,
//       );
//     }
//   };

//   const markFinished = async (id) => {
//     try {
//       await axios.post(API.finish(id), {}, { headers: authHeaders });
//       await fetchAll();
//     } catch (err) {
//       console.error(
//         "markFinished error:",
//         err?.response?.data || err?.message || err,
//       );
//     }
//   };

//   const reopenTask = async (id) => {
//     try {
//       await axios.post(
//         API.reopen(id),
//         { status: "IN_PROGRESS" },
//         { headers: authHeaders },
//       );
//       await fetchAll();
//     } catch (err) {
//       console.error(
//         "reopenTask error:",
//         err?.response?.data || err?.message || err,
//       );
//     }
//   };

//   const bulkDelete = async () => {
//     if (!selectedCount) return;
//     try {
//       setBulkBusy(true);
//       await axios.post(
//         API.bulkDelete,
//         { ids: Array.from(selectedIds) },
//         { headers: authHeaders },
//       );
//       clearSelection();
//       await fetchAll();
//     } catch (err) {
//       console.error(
//         "bulkDelete error:",
//         err?.response?.data || err?.message || err,
//       );
//     } finally {
//       setBulkBusy(false);
//     }
//   };

//   const bulkMoveStatus = async (status) => {
//     if (!selectedCount) return;
//     try {
//       setBulkBusy(true);
//       await axios.post(
//         API.bulkStatus,
//         { ids: Array.from(selectedIds), status },
//         { headers: authHeaders },
//       );
//       clearSelection();
//       await fetchAll();
//     } catch (err) {
//       console.error(
//         "bulkMoveStatus error:",
//         err?.response?.data || err?.message || err,
//       );
//     } finally {
//       setBulkBusy(false);
//     }
//   };

//   // ✅ FIXED bulk reschedule: use stored date + Apply button (no instant clear)
//   const applyBulkReschedule = async () => {
//     if (!selectedCount || !bulkDueDate) return;
//     try {
//       setBulkBusy(true);
//       await axios.post(
//         API.bulkReschedule,
//         { ids: Array.from(selectedIds), dueAt: dateOnlyToISO(bulkDueDate) },
//         { headers: authHeaders },
//       );
//       setBulkDueDate("");
//       clearSelection();
//       await fetchAll();
//     } catch (err) {
//       console.error(
//         "bulkReschedule error:",
//         err?.response?.data || err?.message || err,
//       );
//     } finally {
//       setBulkBusy(false);
//     }
//   };

//   const onDragEnd = async (result) => {
//     const { destination, source } = result;
//     if (!destination) return;

//     // ✅ NOTE:
//     // Drag reorder only makes sense on the full board, not a date-filtered subset.
//     // So if user has selected a date, we block drag reorder to avoid wrong ordering updates.
//     if (selectedDate) return;

//     const fromCol = source.droppableId;
//     const toCol = destination.droppableId;
//     if (fromCol === toCol && destination.index === source.index) return;

//     const fromItems = Array.from(byColumn[fromCol] || []);
//     const toItems =
//       fromCol === toCol ? fromItems : Array.from(byColumn[toCol] || []);

//     const [moved] = fromItems.splice(source.index, 1);
//     const movedTask = { ...moved, status: toCol, effectiveStatus: toCol };

//     if (fromCol === toCol) fromItems.splice(destination.index, 0, movedTask);
//     else toItems.splice(destination.index, 0, movedTask);

//     const updates = [];
//     const fromOrder = computeSortOrders(fromItems.map((t) => t._id));
//     for (const o of fromOrder)
//       updates.push({ id: o.id, status: fromCol, sortOrder: o.sortOrder });

//     if (fromCol !== toCol) {
//       const toOrder = computeSortOrders(toItems.map((t) => t._id));
//       for (const o of toOrder)
//         updates.push({ id: o.id, status: toCol, sortOrder: o.sortOrder });
//     }

//     const sortMap = new Map(updates.map((u) => [u.id, u.sortOrder]));
//     const statusMap = new Map(updates.map((u) => [u.id, u.status]));
//     setTasks((prev) =>
//       prev.map((t) => {
//         const so = sortMap.get(t._id);
//         const st = statusMap.get(t._id);
//         if (so == null && st == null) return t;
//         return {
//           ...t,
//           sortOrder: so ?? t.sortOrder,
//           status: st ?? t.status,
//           effectiveStatus: st,
//         };
//       }),
//     );

//     try {
//       await axios.post(API.bulkReorder, { updates }, { headers: authHeaders });
//       await fetchAll();
//     } catch (err) {
//       console.error(
//         "bulkReorder error:",
//         err?.response?.data || err?.message || err,
//       );
//       await fetchAll();
//     }
//   };

//   const badge = (label, value, tone) => (
//     <div
//       className={`px-3 py-1 rounded-full text-[11px] font-medium border ${tone}`}
//     >
//       {label}: <span className="font-semibold">{value ?? 0}</span>
//     </div>
//   );

//   const Row = React.memo(function Row({ task, provided }) {
//     const isExpanded = expandedIds.has(task._id);
//     const isFinished = task.status === "FINISHED";
//     const hasDetails = Boolean(task.details);
//     const hasReport = Boolean(task.reportTo);
//     const hasStart = Boolean(task.startAt);
//     const hasDue = Boolean(task.dueAt);

//     return (
//       <div
//         ref={provided.innerRef}
//         {...provided.draggableProps}
//         className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition"
//       >
//         <div className="px-3 py-2.5 sm:px-4 sm:py-3">
//           <div className="flex items-start gap-3">
//             {/* ✅ KEEP checkbox + drag handle in same place */}
//             <div className="flex items-start gap-2 pt-0.5">
//               <input
//                 type="checkbox"
//                 checked={selectedIds.has(task._id)}
//                 onChange={() => toggleSelect(task._id)}
//                 className="mt-0.5 h-4 w-4"
//               />
//               <div
//                 {...provided.dragHandleProps}
//                 className={`select-none text-slate-400 text-xs px-2 py-1 rounded-md border border-slate-200 bg-slate-50 ${
//                   selectedDate ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 title={selectedDate ? "Clear date filter to drag" : "Drag"}
//               >
//                 ⇅
//               </div>
//             </div>

//             {/* ✅ New layout block */}
//             <div className="min-w-0 flex-1">
//               {/* 1) Title first line */}
//               <div className="text-sm font-semibold text-slate-900 truncate">
//                 {task.title}
//               </div>

//               {/* 2) Report To second line */}
//               <div className="mt-1 text-[12px] text-slate-600 truncate">
//                 {hasReport ? (
//                   <>
//                     Report To:{" "}
//                     <span className="text-slate-800 font-medium">
//                       {task.reportTo}
//                     </span>
//                   </>
//                 ) : (
//                   <span className="text-slate-400">Report To: —</span>
//                 )}
//               </div>

//               {/* 3) Start & Due on one line */}
//               <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
//                 <span>
//                   Start:{" "}
//                   {hasStart ? (
//                     <span className="text-slate-700">
//                       {fmtDate(task.startAt)}
//                     </span>
//                   ) : (
//                     <span className="text-slate-400">—</span>
//                   )}
//                 </span>
//                 <span className="text-slate-300">•</span>
//                 <span>
//                   Due:{" "}
//                   {hasDue ? (
//                     <span className="text-slate-700">
//                       {fmtDate(task.dueAt)}
//                     </span>
//                   ) : (
//                     <span className="text-slate-400">—</span>
//                   )}
//                 </span>
//               </div>

//               {/* Bottom icons row */}
//               <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
//                 <div className="flex items-center gap-2">
//                   {/* show/hide details */}
//                   {(hasDetails || !isExpanded) && (
//                     <button
//                       onClick={() => toggleExpanded(task._id)}
//                       className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
//                       title={isExpanded ? "Hide details" : "Show details"}
//                     >
//                       {isExpanded ? (
//                         <FaChevronUp className="text-slate-600 text-xs" />
//                       ) : (
//                         <FaChevronDown className="text-slate-600 text-xs" />
//                       )}
//                     </button>
//                   )}
//                 </div>

//                 <div className="flex items-center gap-2">
//                   {/* tick / reopen */}
//                   {!isFinished ? (
//                     <button
//                       onClick={() => markFinished(task._id)}
//                       className="p-2 rounded-xl border border-emerald-200 hover:bg-emerald-50 transition"
//                       title="Finish"
//                     >
//                       <FaCheckCircle className="text-emerald-700 text-xs" />
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => reopenTask(task._id)}
//                       className="p-2 rounded-xl border border-amber-200 hover:bg-amber-50 transition"
//                       title="Reopen"
//                     >
//                       <FaRedoAlt className="text-amber-800 text-xs" />
//                     </button>
//                   )}

//                   {/* edit */}
//                   <button
//                     onClick={() => openEdit(task)}
//                     className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
//                     title="Edit"
//                   >
//                     <FaEdit className="text-slate-600 text-xs" />
//                   </button>

//                   {/* delete */}
//                   <button
//                     onClick={() => deleteOne(task._id)}
//                     className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 transition"
//                     title="Delete"
//                   >
//                     <FaTrashAlt className="text-rose-600 text-xs" />
//                   </button>
//                 </div>
//               </div>

//               {/* Details block */}
//               {isExpanded ? (
//                 <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 leading-relaxed">
//                   {task.details ? (
//                     task.details
//                   ) : (
//                     <span className="text-slate-500">No details.</span>
//                   )}
//                 </div>
//               ) : null}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   });

//   return (
//     <div className="bg-white text-slate-900">
//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0" />
//         <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse" />

//         <div className="relative container mx-auto px-3 sm:px-6 lg:px-10 py-8 sm:py-10">
//           {/* Header */}
//           <div className="rounded-3xl bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 p-5 sm:p-5 flex justify-between flex-wrap gap-2">
//             <div className="min-w-0">
//               <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-900">
//                 View All To-Do List Tasks
//                 <span className="mx-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
//                   Kanban
//                 </span>
//                 <span className="mt-2 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
//                   Drag tasks between columns. Rows are compact for faster
//                   scanning.
//                   {selectedDate
//                     ? " (Drag is disabled while date filter is ON)"
//                     : ""}
//                 </span>
//               </h1>

//               <div className="flex flex-wrap gap-2">
//                 <div className="mt-4 flex flex-wrap gap-2">
//                   {badge(
//                     "New",
//                     counts.NEW,
//                     "border-sky-200 text-slate-700 bg-sky-50",
//                   )}
//                   {badge(
//                     "In Progress",
//                     counts.IN_PROGRESS,
//                     "border-amber-200 text-slate-700 bg-amber-50",
//                   )}
//                   {badge(
//                     "Finished",
//                     counts.FINISHED,
//                     "border-emerald-200 text-slate-700 bg-emerald-50",
//                   )}
//                   {badge(
//                     "Pending",
//                     counts.PENDING,
//                     "border-rose-200 text-slate-700 bg-rose-50",
//                   )}
//                   {badge(
//                     "Total",
//                     counts.TOTAL,
//                     "border-slate-200 text-slate-700 bg-white",
//                   )}
//                 </div>

//                 {/* ✅ Date Filter */}
//                 <div className="mt-4 flex flex-wrap items-center gap-3">
//                   <div className="text-xs font-semibold text-slate-700">
//                     Filter by Date (Start or Due):
//                   </div>
//                   <input
//                     type="date"
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     className="px-4 py-2 rounded-xl border border-slate-200 text-sm bg-white"
//                   />
//                   {selectedDate ? (
//                     <>
//                       <div className="text-xs text-slate-600">
//                         Showing:{" "}
//                         <span className="font-semibold">{selectedDate}</span> (
//                         {filteredTasks.length} tasks)
//                       </div>
//                       <button
//                         onClick={() => setSelectedDate("")}
//                         className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium hover:bg-slate-100"
//                       >
//                         Clear Date
//                       </button>
//                     </>
//                   ) : (
//                     <div className="text-xs text-slate-500">
//                       Select a date to show tasks across ALL statuses.
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Create Task link */}
//             <div className="shrink-0">
//               <Link
//                 to="/create-todo-list"
//                 className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
//                 title="Create a new task"
//               >
//                 Create Task
//               </Link>
//             </div>
//           </div>

//           {/* Search + bulk */}
//           <div className="mt-5 rounded-3xl bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 p-4 sm:p-6">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
//               <div className="lg:col-span-1">
//                 <div className="relative">
//                   <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
//                   <input
//                     value={q}
//                     onChange={(e) => setQ(e.target.value)}
//                     placeholder="Search tasks..."
//                     className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
//                   />
//                 </div>

//                 <div className="mt-3 flex flex-wrap gap-3">
//                   <button
//                     onClick={() => fetchAll(q)}
//                     className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
//                   >
//                     {loading ? "Refreshing..." : "Apply Search"}
//                   </button>

//                   <button
//                     onClick={() => {
//                       setQ("");
//                       fetchAll("");
//                     }}
//                     className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </div>

//               <div className="lg:col-span-2">
//                 <div className="flex items-center justify-between flex-wrap gap-3">
//                   <div className="text-xs font-semibold text-slate-700">
//                     Bulk Actions{" "}
//                     <span className="text-slate-500 font-medium">
//                       ({selectedIds.size} selected)
//                     </span>
//                   </div>

//                   <button
//                     disabled={!selectedIds.size}
//                     onClick={clearSelection}
//                     className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
//                   >
//                     Clear Selection
//                   </button>
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                   <div className="mt-3 flex flex-wrap gap-2">
//                     <button
//                       disabled={!selectedIds.size || bulkBusy}
//                       onClick={() => bulkMoveStatus("NEW")}
//                       className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
//                     >
//                       Mark New
//                     </button>
//                     <button
//                       disabled={!selectedIds.size || bulkBusy}
//                       onClick={() => bulkMoveStatus("IN_PROGRESS")}
//                       className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
//                     >
//                       Mark In Progress
//                     </button>
//                     <button
//                       disabled={!selectedIds.size || bulkBusy}
//                       onClick={() => bulkMoveStatus("FINISHED")}
//                       className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
//                     >
//                       Mark Finished
//                     </button>
//                     <button
//                       disabled={!selectedIds.size || bulkBusy}
//                       onClick={bulkDelete}
//                       className="px-3 py-2 rounded-xl text-xs font-medium border border-rose-200 text-rose-700 hover:bg-rose-50 disabled:opacity-50"
//                     >
//                       Bulk Delete
//                     </button>
//                   </div>

//                   {/* ✅ Bulk Reschedule DATE ONLY (fixed) */}
//                   <div className="mt-4">
//                     <div className="text-[11px] text-slate-500 mb-2">
//                       Bulk Reschedule (Due Date):
//                     </div>

//                     <div className="flex flex-wrap items-center gap-2">
//                       <div className="relative max-w-sm">
//                         <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
//                         <input
//                           type="date"
//                           value={bulkDueDate}
//                           onChange={(e) => setBulkDueDate(e.target.value)}
//                           className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
//                         />
//                       </div>

//                       <button
//                         disabled={!selectedIds.size || bulkBusy || !bulkDueDate}
//                         onClick={applyBulkReschedule}
//                         className="px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium disabled:opacity-50"
//                       >
//                         Apply
//                       </button>

//                       {bulkDueDate ? (
//                         <button
//                           type="button"
//                           onClick={() => setBulkDueDate("")}
//                           className="px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100"
//                         >
//                           Clear
//                         </button>
//                       ) : null}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-2 text-[11px] text-slate-500">
//                   Tip: Expand a row to see details. Date filter shows tasks
//                   across ALL statuses.
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Board */}
//           <div className="mt-5">
//             <DragDropContext onDragEnd={onDragEnd}>
//               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
//                 {COLUMNS.map((col) => {
//                   const items = byColumn[col.key] || [];
//                   return (
//                     <div
//                       key={col.key}
//                       className={`rounded-3xl border ${col.border} ${col.bg} p-3 sm:p-4`}
//                     >
//                       <div className="flex items-center justify-between mb-3">
//                         <div className="text-sm font-semibold text-slate-900">
//                           {col.label}
//                         </div>
//                         <div className="text-xs text-slate-600 font-medium">
//                           {items.length}
//                         </div>
//                       </div>

//                       <Droppable droppableId={col.key}>
//                         {(provided) => (
//                           <div
//                             ref={provided.innerRef}
//                             {...provided.droppableProps}
//                             className="min-h-[120px] space-y-2"
//                           >
//                             {items.map((task, idx) => (
//                               <Draggable
//                                 key={task._id}
//                                 draggableId={task._id}
//                                 index={idx}
//                                 isDragDisabled={Boolean(selectedDate)}
//                               >
//                                 {(p) => <Row task={task} provided={p} />}
//                               </Draggable>
//                             ))}
//                             {provided.placeholder}
//                           </div>
//                         )}
//                       </Droppable>
//                     </div>
//                   );
//                 })}
//               </div>
//             </DragDropContext>

//             {loading ? (
//               <div className="mt-5 text-sm text-slate-600">
//                 Loading tasks...
//               </div>
//             ) : null}
//           </div>
//         </div>
//       </section>

//       {/* Edit Modal */}
//       {editOpen && editTask ? (
//         <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-3 sm:p-4">
//           <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-xl p-5 sm:p-7">
//             <div className="flex items-start justify-between gap-4">
//               <div>
//                 <div className="text-lg font-semibold text-slate-900">
//                   Update Task
//                 </div>
//                 <div className="mt-1 text-sm text-slate-600">
//                   Update text, status, start/due date.
//                 </div>
//               </div>

//               <button
//                 onClick={closeEdit}
//                 className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
//               >
//                 <FaTimes className="text-slate-600" />
//               </button>
//             </div>

//             <div className="mt-5 grid grid-cols-1 gap-4">
//               <div>
//                 <label className="text-xs font-semibold text-slate-700">
//                   Title
//                 </label>
//                 <input
//                   value={editTask.title}
//                   onChange={(e) =>
//                     setEditTask((p) => ({ ...p, title: e.target.value }))
//                   }
//                   className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="text-xs font-semibold text-slate-700">
//                   Details
//                 </label>
//                 <textarea
//                   rows={4}
//                   value={editTask.details || ""}
//                   onChange={(e) =>
//                     setEditTask((p) => ({ ...p, details: e.target.value }))
//                   }
//                   className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
//                 />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div>
//                   <label className="text-xs font-semibold text-slate-700 ">
//                     Report To (optional)
//                   </label>
//                   <input
//                     value={editTask.reportTo || ""}
//                     onChange={(e) =>
//                       setEditTask((p) => ({ ...p, reportTo: e.target.value }))
//                     }
//                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
//                   />
//                 </div>

//                 {/* ✅ DATE ONLY */}
//                 <div>
//                   <label className="text-xs font-semibold text-slate-700">
//                     Start Date
//                   </label>
//                   <input
//                     type="date"
//                     value={editTask.startAtInput}
//                     onChange={(e) =>
//                       setEditTask((p) => ({
//                         ...p,
//                         startAtInput: e.target.value,
//                       }))
//                     }
//                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
//                   />
//                 </div>

//                 {/* ✅ DATE ONLY */}
//                 <div>
//                   <label className="text-xs font-semibold text-slate-700">
//                     Due Date
//                   </label>
//                   <input
//                     type="date"
//                     value={editTask.dueAtInput}
//                     onChange={(e) =>
//                       setEditTask((p) => ({ ...p, dueAtInput: e.target.value }))
//                     }
//                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-xs font-semibold text-slate-700">
//                     Status
//                   </label>
//                   <select
//                     value={editTask.status}
//                     onChange={(e) =>
//                       setEditTask((p) => ({ ...p, status: e.target.value }))
//                     }
//                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
//                   >
//                     <option value="NEW">NEW</option>
//                     <option value="IN_PROGRESS">IN_PROGRESS</option>
//                     <option value="FINISHED">FINISHED</option>
//                     <option value="PENDING">PENDING</option>
//                   </select>
//                 </div>

//                 <div className="flex items-end gap-3">
//                   <button
//                     disabled={saving}
//                     onClick={saveEdit}
//                     className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
//                   >
//                     <FaSave className="inline mr-2 text-xs" />
//                     {saving ? "Saving..." : "Save"}
//                   </button>

//                   <button
//                     onClick={closeEdit}
//                     className="px-6 py-3 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-4 text-[11px] text-slate-500">
//               Tip: Clear date filter if you want drag reorder.
//             </div>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

//

// with optimize

//

// file: src/pages/ViewAllTask.jsx
// file: src/pages/todo_task_pages/ViewAllTask.jsx
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import globalBackendRoute from "../../config/Config";
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
  FaSyncAlt,
  FaInfoCircle,
  FaClipboardList,
  FaFilter,
  FaTasks,
  FaSortAmountDownAlt,
  FaRegUser,
  FaArrowRight,
} from "react-icons/fa";
import taskBanner from "../../assets/images/profile_banner.jpg";

const HERO_TAGS = ["TASKS", "KANBAN", "TODO", "MANAGEMENT"];

const HERO_STYLE = Object.freeze({
  backgroundImage: `url(${taskBanner})`,
});

const COLUMNS = Object.freeze([
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
]);

const INITIAL_COUNTS = Object.freeze({
  NEW: 0,
  IN_PROGRESS: 0,
  FINISHED: 0,
  PENDING: 0,
  TOTAL: 0,
});

const INITIAL_TOAST = Object.freeze({
  open: false,
  type: "success",
  text: "",
});

const EMPTY_EDIT_TASK = Object.freeze({
  _id: "",
  title: "",
  details: "",
  reportTo: "",
  status: "NEW",
  startAtInput: "",
  dueAtInput: "",
});

function pad2(n) {
  return String(n).padStart(2, "0");
}

function todayYMDLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function toYMDLocal(dateValue) {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function dateOnlyToISO(ymd) {
  if (!ymd) return null;
  const [y, m, d] = String(ymd).split("-").map(Number);
  if (!y || !m || !d) return null;
  const localMidnight = new Date(y, m - 1, d, 0, 0, 0, 0);
  return localMidnight.toISOString();
}

function fmtDate(dt) {
  if (!dt) return "—";
  try {
    const d = new Date(dt);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function safeText(value, fallback = "") {
  const text = normalizeText(value);
  return text || fallback;
}

function getAuthToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("ecoders_token") ||
    ""
  );
}

function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function computeSortOrders(idsInOrder) {
  return idsInOrder.map((id, idx) => ({ id, sortOrder: (idx + 1) * 1000 }));
}

function normalizeTask(task, index) {
  const status = safeText(
    task?.effectiveStatus || task?.status,
    "NEW",
  ).toUpperCase();

  return {
    _id: task?._id || task?.id || `task-${index}`,
    title: safeText(task?.title, "Untitled Task"),
    details: safeText(task?.details, ""),
    reportTo: safeText(task?.reportTo, ""),
    status,
    effectiveStatus: status,
    startAt: task?.startAt || null,
    dueAt: task?.dueAt || null,
    createdAt: task?.createdAt || null,
    updatedAt: task?.updatedAt || null,
    sortOrder: Number(task?.sortOrder ?? 0),
  };
}

function getStatusClasses(status) {
  const normalized = safeText(status, "NEW").toUpperCase();

  if (normalized === "FINISHED") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (normalized === "IN_PROGRESS") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (normalized === "PENDING") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  return "bg-sky-50 text-sky-700 border-sky-200";
}

const Toast = memo(function Toast({ toast, onClose }) {
  if (!toast.open) return null;

  const isSuccess = toast.type === "success";

  return (
    <div className="fixed top-4 right-4 z-[999] w-[92vw] max-w-sm">
      <div
        className={[
          "rounded-2xl border shadow-xl backdrop-blur bg-white/95 px-4 py-3",
          "flex items-start gap-3",
          isSuccess ? "border-emerald-200" : "border-rose-200",
        ].join(" ")}
        role="status"
        aria-live="polite"
      >
        <div
          className={[
            "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border",
            isSuccess
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700",
          ].join(" ")}
          aria-hidden="true"
        >
          <FaInfoCircle className="text-sm" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-slate-900">
            {isSuccess ? "Success" : "Error"}
          </div>
          <div className="mt-0.5 text-sm text-slate-700 break-words">
            {toast.text}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
          aria-label="Close toast"
        >
          <FaTimes className="text-slate-600 text-sm" />
        </button>
      </div>
    </div>
  );
});

const StatCard = memo(function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="form-icon-badge shrink-0">{icon}</span>
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            {label}
          </div>
          <div className="mt-1 text-lg font-semibold text-slate-900 break-words">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
});

const BoardSkeleton = memo(function BoardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {COLUMNS.map((col) => (
        <div
          key={col.key}
          className={`rounded-3xl border ${col.border} ${col.bg} p-3 sm:p-4`}
        >
          <div className="h-5 w-28 rounded bg-white/70 animate-pulse" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 animate-pulse"
              >
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
                <div className="mt-3 h-3 w-full rounded bg-slate-200" />
                <div className="mt-2 h-3 w-4/5 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

const EditModal = memo(function EditModal({
  open,
  task,
  saving,
  onClose,
  onSave,
  onChange,
}) {
  if (!open || !task) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-3 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-xl p-5 sm:p-7"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-semibold text-slate-900">
                Update Task
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Update text, status, start date, and due date.
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
              type="button"
            >
              <FaTimes className="text-slate-600" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4">
            <div>
              <label className="form-label">
                <span className="form-icon-badge">
                  <FaClipboardList className="text-[11px]" />
                </span>
                <span>Title</span>
              </label>
              <input
                value={task.title}
                onChange={(e) => onChange("title", e.target.value)}
                className="mt-2.5 w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-slate-100 text-sm"
              />
            </div>

            <div>
              <label className="form-label">
                <span className="form-icon-badge">
                  <FaClipboardList className="text-[11px]" />
                </span>
                <span>Details</span>
              </label>
              <textarea
                rows={4}
                value={task.details || ""}
                onChange={(e) => onChange("details", e.target.value)}
                className="mt-2.5 w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-slate-100 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">
                  <span className="form-icon-badge">
                    <FaRegUser className="text-[11px]" />
                  </span>
                  <span>Report To</span>
                </label>
                <input
                  value={task.reportTo || ""}
                  onChange={(e) => onChange("reportTo", e.target.value)}
                  className="mt-2.5 w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-slate-100 text-sm"
                />
              </div>

              <div>
                <label className="form-label">
                  <span className="form-icon-badge">
                    <FaCalendarAlt className="text-[11px]" />
                  </span>
                  <span>Start Date</span>
                </label>
                <input
                  type="date"
                  value={task.startAtInput}
                  onChange={(e) => onChange("startAtInput", e.target.value)}
                  className="mt-2.5 w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-slate-100 text-sm"
                />
              </div>

              <div>
                <label className="form-label">
                  <span className="form-icon-badge">
                    <FaCalendarAlt className="text-[11px]" />
                  </span>
                  <span>Due Date</span>
                </label>
                <input
                  type="date"
                  value={task.dueAtInput}
                  onChange={(e) => onChange("dueAtInput", e.target.value)}
                  className="mt-2.5 w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-slate-100 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  <span className="form-icon-badge">
                    <FaFilter className="text-[11px]" />
                  </span>
                  <span>Status</span>
                </label>
                <select
                  value={task.status}
                  onChange={(e) => onChange("status", e.target.value)}
                  className="mt-2.5 w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-slate-100 text-sm"
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
                  onClick={onSave}
                  type="button"
                  className="primary-gradient-button disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FaSave className="mr-2 text-xs" />
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={onClose}
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-[11px] text-slate-500">
            Tip: Clear date filter if you want drag reorder.
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

const TaskRow = memo(function TaskRow({
  task,
  provided,
  isSelected,
  isExpanded,
  onToggleSelect,
  onToggleExpanded,
  onMarkFinished,
  onReopenTask,
  onOpenEdit,
  onDeleteOne,
  selectedDate,
}) {
  const isFinished = task.status === "FINISHED";
  const hasDetails = Boolean(task.details);
  const hasReport = Boolean(task.reportTo);
  const hasStart = Boolean(task.startAt);
  const hasDue = Boolean(task.dueAt);

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition"
    >
      <div className="px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-start gap-3">
          <div className="flex items-start gap-2 pt-0.5">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(task._id)}
              className="mt-0.5 h-4 w-4"
            />

            <div
              {...provided.dragHandleProps}
              className={`select-none text-slate-400 text-xs px-2 py-1 rounded-md border border-slate-200 bg-slate-50 ${
                selectedDate ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title={selectedDate ? "Clear date filter to drag" : "Drag"}
            >
              ⇅
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-900 truncate">
              {task.title}
            </div>

            {/* <div className="mt-1 text-[12px] text-slate-600 truncate">
              {hasReport ? (
                <>
                  Report To:{" "}
                  <span className="text-slate-800 font-medium">
                    {task.reportTo}
                  </span>
                </>
              ) : (
                <span className="text-slate-400">Report To: —</span>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
              <span>
                Start:{" "}
                {hasStart ? (
                  <span className="text-slate-700">
                    {fmtDate(task.startAt)}
                  </span>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </span>
              <span className="text-slate-300">•</span>
              <span>
                Due:{" "}
                {hasDue ? (
                  <span className="text-slate-700">{fmtDate(task.dueAt)}</span>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </span>
            </div> */}

            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {(hasDetails || !isExpanded) && (
                  <button
                    type="button"
                    onClick={() => onToggleExpanded(task._id)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                    title={isExpanded ? "Hide details" : "Show details"}
                  >
                    {isExpanded ? (
                      <FaChevronUp className="text-slate-600 text-xs" />
                    ) : (
                      <FaChevronDown className="text-slate-600 text-xs" />
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!isFinished ? (
                  <button
                    type="button"
                    onClick={() => onMarkFinished(task._id)}
                    className="p-2 rounded-xl border border-emerald-200 hover:bg-emerald-50 transition"
                    title="Finish"
                  >
                    <FaCheckCircle className="text-emerald-700 text-xs" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onReopenTask(task._id)}
                    className="p-2 rounded-xl border border-amber-200 hover:bg-amber-50 transition"
                    title="Reopen"
                  >
                    <FaRedoAlt className="text-amber-800 text-xs" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onOpenEdit(task)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                  title="Edit"
                >
                  <FaEdit className="text-slate-600 text-xs" />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteOne(task._id)}
                  className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 transition"
                  title="Delete"
                >
                  <FaTrashAlt className="text-rose-600 text-xs" />
                </button>
              </div>
            </div>

            {isExpanded ? (
              <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 leading-relaxed">
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

function ViewAllTask() {
  const [tasks, setTasks] = useState([]);
  const [counts, setCounts] = useState(INITIAL_COUNTS);

  const [q, setQ] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkDueDate, setBulkDueDate] = useState("");

  const [toast, setToast] = useState(INITIAL_TOAST);

  const toastTimerRef = useRef(null);
  const abortRef = useRef(null);

  const selectedCount = selectedIds.size;

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

  const authHeaders = useMemo(() => getAuthHeaders(), []);

  const showToast = useCallback((type, text, ms = 2400) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    setToast({
      open: true,
      type,
      text,
    });

    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, ms);
  }, []);

  const closeToast = useCallback(() => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const fetchAll = useCallback(
    async (overrideQuery, isRefresh = false) => {
      const query = typeof overrideQuery === "string" ? overrideQuery : q;

      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [taskResponse, countResponse] = await Promise.all([
          axios.get(API.list, {
            params: query?.trim() ? { q: query.trim() } : {},
            headers: authHeaders,
            signal: controller.signal,
          }),
          axios.get(API.counts, {
            headers: authHeaders,
            signal: controller.signal,
          }),
        ]);

        const nextTasks = (taskResponse?.data?.tasks || []).map(normalizeTask);
        const nextCounts =
          taskResponse?.data?.counts ||
          countResponse?.data?.counts ||
          INITIAL_COUNTS;

        setTasks(nextTasks);
        setCounts({
          NEW: Number(nextCounts.NEW || 0),
          IN_PROGRESS: Number(nextCounts.IN_PROGRESS || 0),
          FINISHED: Number(nextCounts.FINISHED || 0),
          PENDING: Number(nextCounts.PENDING || 0),
          TOTAL: Number(nextCounts.TOTAL || 0) || Number(nextTasks.length || 0),
        });

        if (isRefresh) {
          showToast("success", "Task list refreshed successfully.");
        }
      } catch (err) {
        if (
          err?.name === "CanceledError" ||
          err?.name === "AbortError" ||
          axios.isCancel?.(err)
        ) {
          return;
        }

        console.error(
          "fetchAll error:",
          err?.response?.data || err?.message || err,
        );
        setTasks([]);
        setCounts(INITIAL_COUNTS);
        showToast(
          "error",
          err?.response?.data?.message || "Failed to load tasks.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [API, authHeaders, q, showToast],
  );

  useEffect(() => {
    fetchAll("", false);
  }, [fetchAll]);

  const filteredByDateTasks = useMemo(() => {
    if (!selectedDate) return tasks;

    return tasks.filter((task) => {
      const s = toYMDLocal(task.startAt);
      const d = toYMDLocal(task.dueAt);
      return s === selectedDate || d === selectedDate;
    });
  }, [tasks, selectedDate]);

  const fullyFilteredTasks = useMemo(() => {
    const keyword = normalizeText(searchText).toLowerCase();

    if (!keyword) return filteredByDateTasks;

    return filteredByDateTasks.filter((task) => {
      const haystack = [task.title, task.details, task.reportTo, task.status]
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [filteredByDateTasks, searchText]);

  const byColumn = useMemo(() => {
    const map = {
      NEW: [],
      IN_PROGRESS: [],
      FINISHED: [],
      PENDING: [],
    };

    for (const task of fullyFilteredTasks) {
      const status = task.effectiveStatus || task.status || "NEW";
      (map[status] ||= []).push(task);
    }

    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    }

    return map;
  }, [fullyFilteredTasks]);

  const stats = useMemo(
    () => ({
      total: counts.TOTAL || tasks.length,
      newCount: counts.NEW || 0,
      inProgress: counts.IN_PROGRESS || 0,
      finished: counts.FINISHED || 0,
      pending: counts.PENDING || 0,
    }),
    [counts, tasks.length],
  );

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleExpanded = useCallback((id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const openEdit = useCallback((task) => {
    setEditTask({
      ...EMPTY_EDIT_TASK,
      ...task,
      startAtInput: toYMDLocal(task.startAt),
      dueAtInput: toYMDLocal(task.dueAt),
      status: task.status || task.effectiveStatus || "NEW",
    });
    setEditOpen(true);
  }, []);

  const closeEdit = useCallback(() => {
    setEditOpen(false);
    setEditTask(null);
  }, []);

  const updateEditField = useCallback((field, value) => {
    setEditTask((prev) => (prev ? { ...prev, [field]: value } : prev));
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editTask?._id || !normalizeText(editTask.title)) {
      showToast("error", "Task title is required.");
      return;
    }

    try {
      setSaving(true);

      await axios.put(
        API.updateById(editTask._id),
        {
          title: normalizeText(editTask.title),
          details: editTask.details || "",
          reportTo: editTask.reportTo || "",
          startAt: editTask.startAtInput
            ? dateOnlyToISO(editTask.startAtInput)
            : null,
          dueAt: editTask.dueAtInput
            ? dateOnlyToISO(editTask.dueAtInput)
            : null,
          status: editTask.status,
        },
        { headers: authHeaders },
      );

      await fetchAll();
      closeEdit();
      showToast("success", "Task updated successfully.");
    } catch (err) {
      console.error(
        "saveEdit error:",
        err?.response?.data || err?.message || err,
      );
      showToast(
        "error",
        err?.response?.data?.message || "Failed to update task.",
      );
    } finally {
      setSaving(false);
    }
  }, [API, authHeaders, closeEdit, editTask, fetchAll, showToast]);

  const deleteOne = useCallback(
    async (id) => {
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
        showToast("success", "Task deleted successfully.");
      } catch (err) {
        console.error(
          "deleteOne error:",
          err?.response?.data || err?.message || err,
        );
        showToast(
          "error",
          err?.response?.data?.message || "Failed to delete task.",
        );
      }
    },
    [API, authHeaders, fetchAll, showToast],
  );

  const markFinished = useCallback(
    async (id) => {
      try {
        await axios.post(API.finish(id), {}, { headers: authHeaders });
        await fetchAll();
        showToast("success", "Task marked as finished.");
      } catch (err) {
        console.error(
          "markFinished error:",
          err?.response?.data || err?.message || err,
        );
        showToast(
          "error",
          err?.response?.data?.message || "Failed to finish task.",
        );
      }
    },
    [API, authHeaders, fetchAll, showToast],
  );

  const reopenTask = useCallback(
    async (id) => {
      try {
        await axios.post(
          API.reopen(id),
          { status: "IN_PROGRESS" },
          { headers: authHeaders },
        );
        await fetchAll();
        showToast("success", "Task reopened successfully.");
      } catch (err) {
        console.error(
          "reopenTask error:",
          err?.response?.data || err?.message || err,
        );
        showToast(
          "error",
          err?.response?.data?.message || "Failed to reopen task.",
        );
      }
    },
    [API, authHeaders, fetchAll, showToast],
  );

  const bulkDelete = useCallback(async () => {
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
      showToast("success", "Selected tasks deleted successfully.");
    } catch (err) {
      console.error(
        "bulkDelete error:",
        err?.response?.data || err?.message || err,
      );
      showToast(
        "error",
        err?.response?.data?.message || "Failed to delete selected tasks.",
      );
    } finally {
      setBulkBusy(false);
    }
  }, [
    API,
    authHeaders,
    clearSelection,
    fetchAll,
    selectedCount,
    selectedIds,
    showToast,
  ]);

  const bulkMoveStatus = useCallback(
    async (status) => {
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
        showToast("success", `Selected tasks marked as ${status}.`);
      } catch (err) {
        console.error(
          "bulkMoveStatus error:",
          err?.response?.data || err?.message || err,
        );
        showToast(
          "error",
          err?.response?.data?.message || "Failed to update selected tasks.",
        );
      } finally {
        setBulkBusy(false);
      }
    },
    [
      API,
      authHeaders,
      clearSelection,
      fetchAll,
      selectedCount,
      selectedIds,
      showToast,
    ],
  );

  const applyBulkReschedule = useCallback(async () => {
    if (!selectedCount || !bulkDueDate) return;

    try {
      setBulkBusy(true);
      await axios.post(
        API.bulkReschedule,
        {
          ids: Array.from(selectedIds),
          dueAt: dateOnlyToISO(bulkDueDate),
        },
        { headers: authHeaders },
      );

      setBulkDueDate("");
      clearSelection();
      await fetchAll();
      showToast("success", "Selected tasks rescheduled successfully.");
    } catch (err) {
      console.error(
        "bulkReschedule error:",
        err?.response?.data || err?.message || err,
      );
      showToast(
        "error",
        err?.response?.data?.message || "Failed to reschedule selected tasks.",
      );
    } finally {
      setBulkBusy(false);
    }
  }, [
    API,
    authHeaders,
    bulkDueDate,
    clearSelection,
    fetchAll,
    selectedCount,
    selectedIds,
    showToast,
  ]);

  const onDragEnd = useCallback(
    async (result) => {
      const { destination, source } = result;
      if (!destination) return;

      if (selectedDate) return;

      const fromCol = source.droppableId;
      const toCol = destination.droppableId;

      if (fromCol === toCol && destination.index === source.index) return;

      const fromItems = Array.from(byColumn[fromCol] || []);
      const toItems =
        fromCol === toCol ? fromItems : Array.from(byColumn[toCol] || []);

      const [moved] = fromItems.splice(source.index, 1);
      const movedTask = { ...moved, status: toCol, effectiveStatus: toCol };

      if (fromCol === toCol) {
        fromItems.splice(destination.index, 0, movedTask);
      } else {
        toItems.splice(destination.index, 0, movedTask);
      }

      const updates = [];
      const fromOrder = computeSortOrders(fromItems.map((t) => t._id));

      for (const item of fromOrder) {
        updates.push({
          id: item.id,
          status: fromCol,
          sortOrder: item.sortOrder,
        });
      }

      if (fromCol !== toCol) {
        const toOrder = computeSortOrders(toItems.map((t) => t._id));
        for (const item of toOrder) {
          updates.push({
            id: item.id,
            status: toCol,
            sortOrder: item.sortOrder,
          });
        }
      }

      const sortMap = new Map(updates.map((u) => [u.id, u.sortOrder]));
      const statusMap = new Map(updates.map((u) => [u.id, u.status]));

      setTasks((prev) =>
        prev.map((task) => {
          const sortOrder = sortMap.get(task._id);
          const status = statusMap.get(task._id);

          if (sortOrder == null && status == null) return task;

          return {
            ...task,
            sortOrder: sortOrder ?? task.sortOrder,
            status: status ?? task.status,
            effectiveStatus: status ?? task.effectiveStatus,
          };
        }),
      );

      try {
        await axios.post(
          API.bulkReorder,
          { updates },
          { headers: authHeaders },
        );
        await fetchAll();
      } catch (err) {
        console.error(
          "bulkReorder error:",
          err?.response?.data || err?.message || err,
        );
        await fetchAll();
        showToast(
          "error",
          err?.response?.data?.message || "Failed to reorder tasks.",
        );
      }
    },
    [API, authHeaders, byColumn, fetchAll, selectedDate, showToast],
  );

  const emptyFiltered = useMemo(() => {
    return COLUMNS.every((column) => (byColumn[column.key] || []).length === 0);
  }, [byColumn]);

  return (
    <div className="service-page-wrap min-h-screen">
      <Toast toast={toast} onClose={closeToast} />

      {/* HERO */}
      {/* <section className="service-hero-section" style={HERO_STYLE}>
        <div className="service-hero-overlay-1" />
        <div className="service-hero-overlay-2" />
        <div className="service-hero-overlay-3" />

        <div className="service-hero-container">
          <div className="service-hero-layout">
            <div>
              <div className="service-tag-row">
                {HERO_TAGS.map((item) => (
                  <span key={item} className="service-tag-pill">
                    {item}
                  </span>
                ))}
              </div>

              <h1 className="service-hero-title">
                View all{" "}
                <span className="service-hero-title-highlight">tasks</span>
              </h1>

              <p className="service-hero-text">
                Search, filter, drag, bulk update, reschedule, and manage all
                tasks from one kanban board.
              </p>

              <div className="service-hero-status">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Task board is synced
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <main className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="glass-card p-5 sm:p-6 lg:p-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="service-badge-heading">All tasks kanban</p>
                  <p className="mt-3 form-help-text">
                    Drag tasks between columns, apply bulk actions, edit rows,
                    and manage dates quickly.
                    {selectedDate
                      ? " Drag is disabled while date filter is active."
                      : ""}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => fetchAll(q, true)}
                    disabled={refreshing || loading}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <FaSyncAlt
                      className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
                    />
                    {refreshing ? "Refreshing..." : "Refresh"}
                  </button>

                  <Link
                    to="/create-todo-list"
                    className="primary-gradient-button"
                  >
                    Create Task
                    <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  icon={<FaTasks className="text-indigo-600" />}
                  label="Total tasks"
                  value={stats.total}
                />
                <StatCard
                  icon={<FaClipboardList className="text-sky-600" />}
                  label="New"
                  value={stats.newCount}
                />
                <StatCard
                  icon={<FaSortAmountDownAlt className="text-amber-600" />}
                  label="In progress"
                  value={stats.inProgress}
                />
                <StatCard
                  icon={<FaFilter className="text-emerald-600" />}
                  label="Finished"
                  value={stats.finished}
                />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.2fr),220px]">
                <div>
                  <label className="form-label">
                    <span className="form-icon-badge">
                      <FaSearch className="text-[11px]" />
                    </span>
                    <span>Backend search</span>
                  </label>

                  <div className="mt-2.5 flex flex-col sm:flex-row gap-3">
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search from backend..."
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:ring-4 focus:ring-slate-100"
                    />

                    <button
                      type="button"
                      onClick={() => fetchAll(q)}
                      disabled={loading}
                      className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:shadow-md transition disabled:opacity-60"
                    >
                      Apply Search
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setQ("");
                        fetchAll("");
                      }}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div>
                  <label className="form-label">
                    <span className="form-icon-badge">
                      <FaSearch className="text-[11px]" />
                    </span>
                    <span>Quick filter</span>
                  </label>

                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Filter current board..."
                    className="mt-2.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:ring-4 focus:ring-slate-100"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-end gap-4">
                <div>
                  <label className="form-label">
                    <span className="form-icon-badge">
                      <FaCalendarAlt className="text-[11px]" />
                    </span>
                    <span>Filter by Date</span>
                  </label>

                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mt-2.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:ring-4 focus:ring-slate-100"
                  />
                </div>

                {selectedDate ? (
                  <>
                    <div className="text-sm text-slate-600">
                      Showing tasks for{" "}
                      <span className="font-semibold">{selectedDate}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedDate("")}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50"
                    >
                      Clear Date
                    </button>
                  </>
                ) : (
                  <div className="text-sm text-slate-500">
                    Select a date to show tasks across all statuses.
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="text-sm font-semibold text-slate-900">
                    Bulk Actions{" "}
                    <span className="text-slate-500 font-medium">
                      ({selectedCount} selected)
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={!selectedCount}
                    onClick={clearSelection}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Clear Selection
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={!selectedCount || bulkBusy}
                    onClick={() => bulkMoveStatus("NEW")}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Mark New
                  </button>

                  <button
                    type="button"
                    disabled={!selectedCount || bulkBusy}
                    onClick={() => bulkMoveStatus("IN_PROGRESS")}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Mark In Progress
                  </button>

                  <button
                    type="button"
                    disabled={!selectedCount || bulkBusy}
                    onClick={() => bulkMoveStatus("FINISHED")}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Mark Finished
                  </button>

                  <button
                    type="button"
                    disabled={!selectedCount || bulkBusy}
                    onClick={() => bulkMoveStatus("PENDING")}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Mark Pending
                  </button>

                  <button
                    type="button"
                    disabled={!selectedCount || bulkBusy}
                    onClick={bulkDelete}
                    className="inline-flex items-center justify-center rounded-xl border border-rose-200 px-3 py-2 text-xs font-medium text-rose-700 transition-all duration-200 hover:bg-rose-50 disabled:opacity-50"
                  >
                    Bulk Delete
                  </button>
                </div>

                <div className="mt-5">
                  <div className="text-xs font-semibold text-slate-700">
                    Bulk Reschedule (Due Date)
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div className="relative max-w-sm">
                      <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="date"
                        value={bulkDueDate}
                        onChange={(e) => setBulkDueDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-slate-100 text-sm"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={!selectedCount || bulkBusy || !bulkDueDate}
                      onClick={applyBulkReschedule}
                      className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
                    >
                      Apply
                    </button>

                    {bulkDueDate ? (
                      <button
                        type="button"
                        onClick={() => setBulkDueDate("")}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-500">
                  Tip: Expand a row to view details. Drag reorder is disabled
                  while date filter is active.
                </div>
              </div>

              <div className="mt-8">
                {loading ? (
                  <BoardSkeleton />
                ) : emptyFiltered ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                      <FaClipboardList className="text-2xl text-slate-400" />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                      No tasks found
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                      Try refreshing, changing filters, or creating a new task.
                    </p>

                    <div className="mt-6 flex justify-center">
                      <Link
                        to="/create-todo-list"
                        className="primary-gradient-button"
                      >
                        Create Task
                        <FaArrowRight className="ml-2" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      {COLUMNS.map((column) => {
                        const items = byColumn[column.key] || [];

                        return (
                          <div
                            key={column.key}
                            className={`rounded-3xl border ${column.border} ${column.bg} p-3 sm:p-4`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-sm font-semibold text-slate-900">
                                {column.label}
                              </div>
                              <div className="text-xs text-slate-600 font-medium">
                                {items.length}
                              </div>
                            </div>

                            <Droppable droppableId={column.key}>
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
                                      isDragDisabled={Boolean(selectedDate)}
                                    >
                                      {(draggableProvided) => (
                                        <TaskRow
                                          task={task}
                                          provided={draggableProvided}
                                          isSelected={selectedIds.has(task._id)}
                                          isExpanded={expandedIds.has(task._id)}
                                          onToggleSelect={toggleSelect}
                                          onToggleExpanded={toggleExpanded}
                                          onMarkFinished={markFinished}
                                          onReopenTask={reopenTask}
                                          onOpenEdit={openEdit}
                                          onDeleteOne={deleteOne}
                                          selectedDate={selectedDate}
                                        />
                                      )}
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
                )}
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <EditModal
        open={editOpen}
        task={editTask}
        saving={saving}
        onClose={closeEdit}
        onSave={saveEdit}
        onChange={updateEditField}
      />
    </div>
  );
}

export default memo(ViewAllTask);
