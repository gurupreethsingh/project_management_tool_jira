// // src/pages/tasks/ViewAssignedTasks.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import moment from "moment";
// import { useParams, Link } from "react-router-dom";
// import {
//   FaSearch,
//   FaThList,
//   FaThLarge,
//   FaTh,
//   FaArrowLeft,
//   FaArrowRight,
//   FaSortAmountDownAlt,
//   FaSortAmountUpAlt,
//   FaSync,
//   FaDownload,
// } from "react-icons/fa";
// import globalBackendRoute from "../../config/Config";

// const cls = (...a) => a.filter(Boolean).join(" ");

// // ===== Status badge (visual only) =====
// const badge = (status) => {
//   switch ((status || "").toLowerCase()) {
//     case "new":
//       return "bg-blue-100 text-blue-700";
//     case "assigned":
//       return "bg-blue-900 text-white";
//     case "re-assigned":
//       return "bg-orange-500 text-white";
//     case "in-progress":
//       return "bg-amber-100 text-amber-700";
//     case "finished":
//       return "bg-green-100 text-green-700";
//     case "closed":
//       return "bg-gray-300 text-gray-700";
//     case "pending":
//       return "bg-rose-500 text-white";
//     default:
//       return "bg-slate-100 text-slate-700";
//   }
// };

// // ===== Role-based allowed transitions (UI) =====
// const roleOptionsMap = {
//   superadmin: ["re-assigned", "in-progress", "finished", "closed", "pending"],
//   qa_lead: ["re-assigned", "in-progress", "finished", "closed"],
//   developer: ["in-progress", "finished"],
//   test_engineer: ["in-progress", "finished"],
// };

// // ===== Deadline reminder helpers =====
// const NEAR_THRESHOLD_DAYS = 3;

// const isDoneStatus = (s) => {
//   const v = (s || "").toLowerCase();
//   return v === "finished" || v === "closed";
// };

// const daysLeftTo = (deadline) => {
//   if (!deadline) return null;
//   const end = new Date(deadline);
//   if (isNaN(end.getTime())) return null;
//   const today = new Date();
//   const a = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
//   const b = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
//   return Math.ceil((b - a) / (1000 * 60 * 60 * 24));
// };

// const reminderFor = (task) => {
//   if (!task?.deadline || isDoneStatus(task?.status)) return null;
//   const dl = daysLeftTo(task.deadline);
//   if (dl === null) return null;
//   if (dl < 0)
//     return {
//       kind: "overdue",
//       text: `Overdue by ${Math.abs(dl)} day${Math.abs(dl) === 1 ? "" : "s"}`,
//     };
//   if (dl === 0) return { kind: "today", text: "Due today" };
//   if (dl <= NEAR_THRESHOLD_DAYS)
//     return { kind: "near", text: `Due in ${dl} day${dl === 1 ? "" : "s"}` };
//   return null;
// };

// const reminderChipClass =
//   "inline-flex items-center gap-2 px-2 py-0.5 rounded text-[12px] bg-rose-50 text-rose-700 border border-rose-200";
// const redDot = (
//   <span className="inline-block w-2 h-2 rounded-full bg-rose-600" />
// );

// // ===== Component =====
// export default function ViewAssignedTasks() {
//   const { projectId } = useParams();

//   const token =
//     localStorage.getItem("userToken") || localStorage.getItem("token") || "";
//   const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined;
//   const api = `${globalBackendRoute}/api`;

//   const user = (() => {
//     try {
//       return JSON.parse(localStorage.getItem("user"));
//     } catch {
//       return null;
//     }
//   })();
//   const userRole = user?.role || "developer";
//   const userId = user?.id || user?._id;

//   // ---------- state ----------
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadErr, setLoadErr] = useState("");
//   const [busyId, setBusyId] = useState(null);

//   // View + paging
//   const [viewMode, setViewMode] = useState(
//     localStorage.getItem("assigned:viewMode") || "list"
//   );
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(
//     Number(localStorage.getItem("assigned:pageSize")) || 10
//   );

//   // Filters
//   const [search, setSearch] = useState("");
//   const [quick, setQuick] = useState(""); // "", "overdue", "due7", "high", "open"

//   // ---------- fetch ----------
//   const fetchAssigned = async () => {
//     if (!userId) {
//       setLoading(false);
//       setLoadErr("Not authenticated.");
//       return;
//     }
//     try {
//       setLoading(true);
//       setLoadErr("");

//       // All tasks for this user; client-side filter to project if present
//       const res = await axios.get(`${api}/users/${userId}/tasks`, {
//         headers: authHeader,
//       });
//       const all = Array.isArray(res?.data) ? res.data : res?.data?.tasks || [];
//       const arr = projectId
//         ? all.filter((t) => String(t.project?._id || t.project) === projectId)
//         : all;

//       setTasks(arr);
//     } catch (e) {
//       console.error("ViewAssignedTasks load error:", e?.response || e);
//       setLoadErr(e?.response?.data?.message || "Failed to load tasks.");
//       setTasks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAssigned();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [projectId, userId]);

//   useEffect(() => {
//     localStorage.setItem("assigned:viewMode", viewMode);
//   }, [viewMode]);

//   useEffect(() => {
//     localStorage.setItem("assigned:pageSize", String(pageSize));
//   }, [pageSize]);

//   // ---------- search / quick filters / sort ----------
//   const matchAny = (task, q) => {
//     if (!q) return true;
//     const lc = q.toLowerCase();
//     const fields = [
//       task.task_title || task.title || "",
//       task.description || "",
//       task.priority || "",
//       task.status || "",
//       task._id || "",
//       task.startDate ? moment(task.startDate).format("YYYY-MM-DD") : "",
//       task.startDate ? moment(task.startDate).format("DD/MM/YYYY") : "",
//       task.startDate ? moment(task.startDate).format("MMM D, YYYY") : "",
//       task.deadline ? moment(task.deadline).format("YYYY-MM-DD") : "",
//       task.deadline ? moment(task.deadline).format("DD/MM/YYYY") : "",
//       task.deadline ? moment(task.deadline).format("MMM D, YYYY") : "",
//       (task.assignedUsers || []).map((u) => u?.name || "").join(" "),
//       (task.module_names || []).join(" "),
//       (task.modules || []).map((m) => m?.name || "").join(" "),
//     ]
//       .join(" ")
//       .toLowerCase();
//     const terms = lc.split(/\s+/).filter(Boolean);
//     return terms.every((t) => fields.includes(t));
//   };

//   const applyQuick = (rows) => {
//     if (quick === "overdue") {
//       const now = new Date();
//       return rows.filter(
//         (t) =>
//           t.deadline && new Date(t.deadline) < now && !isDoneStatus(t.status)
//       );
//     }
//     if (quick === "due7") {
//       const now = new Date();
//       const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
//       return rows.filter((t) => {
//         const d = t.deadline ? new Date(t.deadline) : null;
//         return d && d >= now && d <= soon && !isDoneStatus(t.status);
//       });
//     }
//     if (quick === "high") {
//       return rows.filter((t) => (t.priority || "").toLowerCase() === "high");
//     }
//     if (quick === "open") {
//       return rows.filter((t) => !isDoneStatus(t.status));
//     }
//     return rows;
//   };

//   const filtered = useMemo(() => {
//     let rows = [...tasks];
//     rows = applyQuick(rows);
//     if (search.trim()) rows = rows.filter((t) => matchAny(t, search));
//     rows.sort((a, b) =>
//       sortOrder === "desc"
//         ? new Date(b.createdAt) - new Date(a.createdAt)
//         : new Date(a.createdAt) - new Date(b.createdAt)
//     );
//     return rows;
//   }, [tasks, search, sortOrder, quick]);

//   // ---------- paging ----------
//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
//   useEffect(() => {
//     setPage((p) => Math.min(p, totalPages));
//   }, [totalPages]);

//   // ---------- update ----------
//   const renderStatusOptions = (currentStatus) => {
//     if (String(currentStatus).toLowerCase() === "closed")
//       return [
//         <option key="closed" value="closed">
//           Closed
//         </option>,
//       ];
//     const opts = roleOptionsMap[userRole] || roleOptionsMap["qa_lead"];
//     return opts
//       .filter((s) => s !== currentStatus)
//       .map((s) => (
//         <option key={s} value={s}>
//           {s.charAt(0).toUpperCase() + s.slice(1)}
//         </option>
//       ));
//   };

//   const updateTask = async (taskId, partial) => {
//     if (!userId) return;
//     try {
//       setBusyId(taskId);
//       // optimistic UI
//       setTasks((prev) =>
//         prev.map((t) => (t._id === taskId ? { ...t, ...partial } : t))
//       );
//       await axios.put(`${api}/tasks/${taskId}`, partial, {
//         headers: authHeader,
//       });
//     } catch (e) {
//       console.error("Update assigned task failed:", e?.response || e);
//       fetchAssigned(); // rollback
//       alert(
//         e?.response?.data?.message ||
//           "Failed to update task. Your changes were rolled back."
//       );
//     } finally {
//       setBusyId(null);
//     }
//   };

//   // ---------- CSV export ----------
//   const exportCSV = () => {
//     const rows = filtered.map((t) => ({
//       id: t._id,
//       title: t.task_title || t.title || "",
//       description: (t.description || "").replace(/\n/g, " "),
//       status: t.status,
//       priority: t.priority,
//       assignees: (t.assignedUsers || []).map((u) => u?.name).join("; "),
//       startDate: t.startDate ? moment(t.startDate).format("YYYY-MM-DD") : "",
//       deadline: t.deadline ? moment(t.deadline).format("YYYY-MM-DD") : "",
//       createdAt: t.createdAt
//         ? moment(t.createdAt).format("YYYY-MM-DD HH:mm")
//         : "",
//     }));
//     const header = Object.keys(rows[0] || {}).join(",");
//     const body = rows
//       .map((r) =>
//         Object.values(r)
//           .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
//           .join(",")
//       )
//       .join("\n");
//     const blob = new Blob([header + "\n" + body], {
//       type: "text/csv;charset=utf-8;",
//     });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `assigned_tasks_project_${projectId || "all"}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   // ---------- UI ----------
//   return (
//     <div className="bg-white py-6 sm:py-8 text-[13px]">
//       <div className="mx-auto container px-2 sm:px-3 lg:px-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between gap-2 flex-wrap">
//           <div className="min-w-[220px]">
//             <h2 className="font-semibold tracking-tight text-indigo-600 text-[16px]">
//               Assigned Tasks — Project: {projectId || "All"}
//             </h2>
//             <div className="text-[11px] text-gray-600">
//               {loading
//                 ? "Loading…"
//                 : `Total: ${tasks.length} | Showing: ${filtered.length}`}
//             </div>
//           </div>

//           <div className="flex items-center gap-2 flex-wrap">
//             {/* Sort */}
//             {sortOrder === "desc" ? (
//               <FaSortAmountDownAlt
//                 className="text-lg cursor-pointer text-gray-500"
//                 onClick={() =>
//                   setSortOrder((s) => (s === "desc" ? "asc" : "desc"))
//                 }
//                 title="Sort by latest"
//               />
//             ) : (
//               <FaSortAmountUpAlt
//                 className="text-lg cursor-pointer text-gray-500"
//                 onClick={() =>
//                   setSortOrder((s) => (s === "desc" ? "asc" : "desc"))
//                 }
//                 title="Sort by oldest"
//               />
//             )}

//             {/* View toggles */}
//             <FaThList
//               className={cls(
//                 "text-lg cursor-pointer",
//                 viewMode === "list" ? "text-indigo-600" : "text-gray-500"
//               )}
//               onClick={() => setViewMode("list")}
//               title="List"
//             />
//             <FaThLarge
//               className={cls(
//                 "text-lg cursor-pointer",
//                 viewMode === "card" ? "text-indigo-600" : "text-gray-500"
//               )}
//               onClick={() => setViewMode("card")}
//               title="Card"
//             />
//             <FaTh
//               className={cls(
//                 "text-lg cursor-pointer",
//                 viewMode === "grid" ? "text-indigo-600" : "text-gray-500"
//               )}
//               onClick={() => setViewMode("grid")}
//               title="Grid"
//             />

//             {/* Search */}
//             <div className="relative">
//               <FaSearch className="absolute left-2 top-2.5 text-gray-400" />
//               <input
//                 className="pl-7 pr-2 py-1.5 border rounded-md w-[220px]"
//                 placeholder="Search title, user, module, date…"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//               />
//             </div>

//             {/* Page size */}
//             <div className="flex items-center gap-1">
//               <span className="text-[11px] text-slate-600">Rows</span>
//               <select
//                 value={pageSize}
//                 onChange={(e) => {
//                   setPageSize(Number(e.target.value));
//                   setPage(1);
//                 }}
//                 className="px-2 py-1.5 border rounded-md"
//                 title="Rows per page"
//               >
//                 {[5, 10, 20, 40, 60, 100].map((n) => (
//                   <option key={n} value={n}>
//                     {n}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Export + refresh */}
//             <button
//               onClick={exportCSV}
//               className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
//               title="Export CSV (filtered)"
//             >
//               <FaDownload /> <span className="hidden sm:inline">Export</span>
//             </button>
//             <button
//               onClick={fetchAssigned}
//               className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
//               title="Refresh"
//             >
//               <FaSync /> <span className="hidden sm:inline">Refresh</span>
//             </button>

//             <Link
//               to={`/single-project/${projectId}`}
//               className="bg-indigo-700 text-white px-3 py-1.5 rounded-md hover:bg-indigo-900"
//             >
//               Project
//             </Link>
//           </div>
//         </div>

//         {/* Quick filters */}
//         <div className="mt-3 flex items-center justify-between">
//           <div className="flex gap-2 flex-wrap">
//             <button
//               className={cls(
//                 "text-[11px] leading-none rounded-full px-2 py-1 border transition",
//                 quick === "open"
//                   ? "bg-indigo-600 text-white border-indigo-600"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//               onClick={() => {
//                 setQuick((q) => (q === "open" ? "" : "open"));
//                 setPage(1);
//               }}
//               title="Not finished/closed"
//             >
//               Open
//             </button>
//             <button
//               className={cls(
//                 "text-[11px] leading-none rounded-full px-2 py-1 border transition",
//                 quick === "overdue"
//                   ? "bg-indigo-600 text-white border-indigo-600"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//               onClick={() => {
//                 setQuick((q) => (q === "overdue" ? "" : "overdue"));
//                 setPage(1);
//               }}
//               title="Not finished/closed and deadline passed"
//             >
//               Overdue
//             </button>
//             <button
//               className={cls(
//                 "text-[11px] leading-none rounded-full px-2 py-1 border transition",
//                 quick === "due7"
//                   ? "bg-indigo-600 text-white border-indigo-600"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//               onClick={() => {
//                 setQuick((q) => (q === "due7" ? "" : "due7"));
//                 setPage(1);
//               }}
//               title="Due in next 7 days"
//             >
//               Due in 7d
//             </button>
//             <button
//               className={cls(
//                 "text-[11px] leading-none rounded-full px-2 py-1 border transition",
//                 quick === "high"
//                   ? "bg-indigo-600 text-white border-indigo-600"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//               onClick={() => {
//                 setQuick((q) => (q === "high" ? "" : "high"));
//                 setPage(1);
//               }}
//               title="Priority: High"
//             >
//               High Priority
//             </button>
//           </div>
//           <button
//             className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
//             onClick={() => {
//               setQuick("");
//               setSearch("");
//               setPage(1);
//             }}
//           >
//             Clear Filters
//           </button>
//         </div>

//         {/* Content */}
//         {loading ? (
//           <div className="mt-6 text-sm text-gray-600">Loading…</div>
//         ) : loadErr ? (
//           <div className="mt-6 text-sm text-red-600">{loadErr}</div>
//         ) : viewMode === "list" ? (
//           <div className="mt-4 space-y-2">
//             {/* header */}
//             <div className="w-full grid grid-cols-[1.4fr,1.8fr,0.9fr,0.9fr,0.9fr,0.9fr] items-center text-[12px] font-semibold text-slate-600 px-2 py-2 border-b border-slate-200">
//               <div>Title</div>
//               <div>Description</div>
//               <div>Priority</div>
//               <div>Status</div>
//               <div>Start</div>
//               <div>Deadline</div>
//             </div>

//             {/* rows */}
//             <div className="divide-y divide-slate-100">
//               {pageRows.map((t) => {
//                 const rem = reminderFor(t);
//                 return (
//                   <div
//                     key={t._id}
//                     className="w-full grid grid-cols-[1.4fr,1.8fr,0.9fr,0.9fr,0.9fr,0.9fr] items-center text-[12px] px-2 py-2"
//                   >
//                     {/* Title (single line, no duplicate reminder chip here) */}
//                     <div className="text-slate-900 font-medium truncate">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <span>{t.task_title || t.title}</span>
//                       </div>
//                     </div>

//                     {/* Description */}
//                     <div className="text-slate-700 line-clamp-2">
//                       {t.description}
//                     </div>

//                     {/* Priority */}
//                     <div className="capitalize">
//                       <span
//                         className={cls(
//                           "px-2 py-0.5 rounded text-[11px] border",
//                           (t.priority || "") === "high"
//                             ? "bg-rose-50 text-rose-700 border-rose-200"
//                             : (t.priority || "") === "medium"
//                             ? "bg-amber-50 text-amber-700 border-amber-200"
//                             : "bg-slate-50 text-slate-700 border-slate-200"
//                         )}
//                       >
//                         {t.priority}
//                       </span>
//                     </div>

//                     {/* Status (editable) */}
//                     <div>
//                       <select
//                         className={cls(
//                           "px-2 py-1 rounded border",
//                           badge(t.status)
//                         )}
//                         defaultValue={t.status}
//                         onChange={(e) =>
//                           updateTask(t._id, { status: e.target.value })
//                         }
//                         disabled={
//                           busyId === t._id ||
//                           String(t.status).toLowerCase() === "closed"
//                         }
//                         title="Change status"
//                       >
//                         {/* render limited options for role */}
//                         <option value={t.status}>{t.status}</option>
//                         {renderStatusOptions(t.status)}
//                       </select>
//                     </div>

//                     {/* Start */}
//                     <div className="text-slate-700">
//                       {t.startDate
//                         ? moment(t.startDate).format("DD/MM/YYYY")
//                         : "—"}
//                     </div>

//                     {/* Deadline (single place for both date + reminder chip) */}
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <span className="text-slate-700">
//                         {t.deadline
//                           ? moment(t.deadline).format("DD/MM/YYYY")
//                           : "—"}
//                       </span>
//                       {rem && (
//                         <span
//                           className={reminderChipClass}
//                           title="Deadline reminder"
//                         >
//                           {redDot}
//                           {rem.text}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}

//               {!pageRows.length && (
//                 <div className="text-center text-[12px] text-slate-500 py-6">
//                   No tasks match your filters.
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : viewMode === "grid" ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
//             {pageRows.map((t) => {
//               const rem = reminderFor(t);
//               return (
//                 <div key={t._id} className="border rounded-lg p-3 shadow-sm">
//                   <div className="font-semibold text-slate-900 truncate">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <span>{t.task_title || t.title}</span>
//                       {/* Show reminder chip here OR in the deadline field below?
//                           We'll show it only in the detailed "Deadline" field below to avoid duplication. */}
//                     </div>
//                   </div>
//                   <div className="mt-1 text-[12px] text-slate-700 line-clamp-2">
//                     {t.description}
//                   </div>
//                   <div className="mt-2 flex items-center justify-between">
//                     <span
//                       className={cls(
//                         "px-2 py-0.5 rounded text-[11px]",
//                         badge(t.status)
//                       )}
//                     >
//                       {t.status}
//                     </span>
//                     {/* Removed the top-right mini deadline to avoid duplicates */}
//                   </div>
//                   <div className="mt-2 text-[12px] text-slate-700 truncate">
//                     {(t.assignedUsers || []).map((u) => u?.name).join(", ") ||
//                       "—"}
//                   </div>
//                   <div className="mt-2">
//                     <select
//                       className="w-full bg-white border border-gray-300 px-2 py-1 rounded-lg text-[12px]"
//                       defaultValue=""
//                       onChange={(e) =>
//                         updateTask(t._id, { status: e.target.value })
//                       }
//                       disabled={
//                         busyId === t._id ||
//                         String(t.status).toLowerCase() === "closed"
//                       }
//                     >
//                       <option value="" disabled hidden>
//                         Change status…
//                       </option>
//                       {renderStatusOptions(t.status)}
//                     </select>
//                   </div>
//                   <div className="mt-2 text-[11px] text-slate-600 grid grid-cols-2 gap-2">
//                     <div>
//                       <div className="text-slate-500">Start</div>
//                       <div>
//                         {t.startDate
//                           ? moment(t.startDate).format("DD/MM/YYYY")
//                           : "—"}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-slate-500">Deadline</div>
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <span>
//                           {t.deadline
//                             ? moment(t.deadline).format("DD/MM/YYYY")
//                             : "—"}
//                         </span>
//                         {rem && (
//                           <span className={reminderChipClass}>
//                             {redDot}
//                             {rem.text}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-2">
//                     <Link
//                       to={`/single-project/${projectId}/single-task/${t._id}`}
//                       className="text-indigo-600 hover:underline text-[12px]"
//                     >
//                       History
//                     </Link>
//                   </div>
//                 </div>
//               );
//             })}
//             {!pageRows.length && (
//               <div className="text-center text-[12px] text-slate-500 py-6 col-span-full">
//                 No tasks match your filters.
//               </div>
//             )}
//           </div>
//         ) : (
//           // Card mode (simple)
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
//             {pageRows.map((t) => {
//               const rem = reminderFor(t);
//               return (
//                 <div key={t._id} className="border rounded-lg p-3 shadow-sm">
//                   <div className="flex items-start justify-between">
//                     <div className="font-semibold truncate">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <span>{t.task_title || t.title}</span>
//                         {/* Keep chip here? To keep consistency with “single place”, we’ll
//                             show chip near the Deadline field below only. */}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-[12px] text-slate-700 mt-1 line-clamp-3">
//                     {t.description}
//                   </div>
//                   <div className="mt-2 flex items-center gap-2 text-[11px]">
//                     <span
//                       className={cls(
//                         "px-2 py-0.5 rounded border capitalize",
//                         (t.priority || "") === "high"
//                           ? "bg-rose-50 text-rose-700 border-rose-200"
//                           : (t.priority || "") === "medium"
//                           ? "bg-amber-50 text-amber-700 border-amber-200"
//                           : "bg-slate-50 text-slate-700 border-slate-200"
//                       )}
//                     >
//                       {t.priority}
//                     </span>
//                     <span
//                       className={cls("px-2 py-0.5 rounded", badge(t.status))}
//                     >
//                       {t.status}
//                     </span>
//                   </div>
//                   <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
//                     <div>
//                       <div className="text-slate-500">Start</div>
//                       <div>
//                         {t.startDate
//                           ? moment(t.startDate).format("DD/MM/YYYY")
//                           : "—"}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-slate-500">Deadline</div>
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <span>
//                           {t.deadline
//                             ? moment(t.deadline).format("DD/MM/YYYY")
//                             : "—"}
//                         </span>
//                         {rem && (
//                           <span className={reminderChipClass}>
//                             {redDot}
//                             {rem.text}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-2 text-[12px] text-slate-700 truncate">
//                     {(t.assignedUsers || []).map((u) => u?.name).join(", ") ||
//                       "—"}
//                   </div>
//                   <div className="mt-2 flex justify-between">
//                     <Link
//                       to={`/single-project/${projectId}/single-task/${t._id}`}
//                       className="text-indigo-600 hover:underline text-[12px]"
//                     >
//                       History
//                     </Link>
//                     <select
//                       className="bg-white border border-gray-300 px-2 py-1 rounded-lg text-[12px]"
//                       defaultValue=""
//                       onChange={(e) =>
//                         updateTask(t._id, { status: e.target.value })
//                       }
//                       disabled={
//                         busyId === t._id ||
//                         String(t.status).toLowerCase() === "closed"
//                       }
//                     >
//                       <option value="" disabled hidden>
//                         Change status…
//                       </option>
//                       {renderStatusOptions(t.status)}
//                     </select>
//                   </div>
//                 </div>
//               );
//             })}
//             {!pageRows.length && (
//               <div className="text-center text-[12px] text-slate-500 py-6 col-span-full">
//                 No tasks match your filters.
//               </div>
//             )}
//           </div>
//         )}

//         {/* Pagination */}
//         {!loading && !loadErr && (
//           <div className="flex justify-center items-center gap-2 mt-6">
//             <button
//               className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
//               disabled={page === 1}
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               title="Previous"
//             >
//               <FaArrowLeft className="text-lg" />
//             </button>
//             <span className="text-[12px]">
//               Page {page} of {totalPages}
//             </span>
//             <button
//               className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
//               disabled={page === totalPages}
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               title="Next"
//             >
//               <FaArrowRight className="text-lg" />
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

//

// src/pages/tasks/ViewAssignedTasks.jsx
// src/pages/tasks/ViewAssignedTasks.jsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
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
  FaSync,
  FaDownload,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const cls = (...a) => a.filter(Boolean).join(" ");

// ===== Status badge (visual only) =====
const badge = (status) => {
  switch ((status || "").toLowerCase()) {
    case "new":
      return "bg-blue-100 text-blue-700";
    case "assigned":
      return "bg-blue-900 text-white";
    case "re-assigned":
      return "bg-orange-500 text-white";
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

// ===== Role-based allowed transitions (UI) =====
const roleOptionsMap = {
  superadmin: ["re-assigned", "in-progress", "finished", "closed", "pending"],
  qa_lead: ["re-assigned", "in-progress", "finished", "closed"],
  developer: ["in-progress", "finished"],
  test_engineer: ["in-progress", "finished"],
};

// ===== Deadline reminder helpers =====
const NEAR_THRESHOLD_DAYS = 3;

const isDoneStatus = (s) => {
  const v = (s || "").toLowerCase();
  return v === "finished" || v === "closed";
};

const daysLeftTo = (deadline) => {
  if (!deadline) return null;
  const end = new Date(deadline);
  if (isNaN(end.getTime())) return null;
  const today = new Date();
  const a = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const b = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.ceil((b - a) / (1000 * 60 * 60 * 24));
};

const reminderFor = (task) => {
  if (!task?.deadline || isDoneStatus(task?.status)) return null;
  const dl = daysLeftTo(task.deadline);
  if (dl === null) return null;
  if (dl < 0)
    return {
      kind: "overdue",
      text: `Overdue by ${Math.abs(dl)} day${Math.abs(dl) === 1 ? "" : "s"}`,
    };
  if (dl === 0) return { kind: "today", text: "Due today" };
  if (dl <= NEAR_THRESHOLD_DAYS)
    return { kind: "near", text: `Due in ${dl} day${dl === 1 ? "" : "s"}` };
  return null;
};

const reminderChipClass =
  "inline-flex items-center gap-2 px-2 py-0.5 rounded text-[12px] bg-rose-50 text-rose-700 border border-rose-200";
const redDot = (
  <span className="inline-block w-2 h-2 rounded-full bg-rose-600" />
);

export default function ViewAssignedTasks() {
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

  // ---------- state ----------
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [busyId, setBusyId] = useState(null);

  // View + paging
  const [viewMode, setViewMode] = useState(
    localStorage.getItem("assigned:viewMode") || "list",
  );
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    Number(localStorage.getItem("assigned:pageSize")) || 10,
  );

  // Filters
  const [search, setSearch] = useState("");
  const [quick, setQuick] = useState(""); // "", "overdue", "due7", "high", "open"

  // ✅ Column widths (resizable like scenario page)
  // original grid-cols: [1.4fr,1.8fr,0.9fr,0.9fr,0.9fr,0.9fr] (6 columns)
  const [colW, setColW] = useState([260, 380, 140, 160, 140, 220]);
  const dragRef = useRef(null);

  const gridTemplateColumns = useMemo(
    () => colW.map((w) => `${Math.max(32, Number(w) || 0)}px`).join(" "),
    [colW],
  );

  const startColResize = useCallback(
    (colIndex, e) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startW = colW[colIndex] || 60;

      dragRef.current = { colIndex, startX, startW };

      const onMove = (ev) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const next = Math.max(32, dragRef.current.startW + dx);
        setColW((prev) => {
          const cp = [...prev];
          cp[colIndex] = next;
          return cp;
        });
      };

      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        dragRef.current = null;
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [colW],
  );

  const Resizer = ({ onMouseDown }) => (
    <span
      onMouseDown={onMouseDown}
      className="absolute right-0 top-0 h-full w-2 cursor-col-resize select-none"
      title="Drag to resize"
    />
  );

  // ---------- fetch ----------
  const fetchAssigned = async () => {
    if (!userId) {
      setLoading(false);
      setLoadErr("Not authenticated.");
      return;
    }
    try {
      setLoading(true);
      setLoadErr("");

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

  useEffect(() => {
    localStorage.setItem("assigned:viewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem("assigned:pageSize", String(pageSize));
  }, [pageSize]);

  // ---------- search / quick filters / sort ----------
  const matchAny = (task, q) => {
    if (!q) return true;
    const lc = q.toLowerCase();
    const fields = [
      task.task_title || task.title || "",
      task.description || "",
      task.priority || "",
      task.status || "",
      task._id || "",
      task.startDate ? moment(task.startDate).format("YYYY-MM-DD") : "",
      task.startDate ? moment(task.startDate).format("DD/MM/YYYY") : "",
      task.startDate ? moment(task.startDate).format("MMM D, YYYY") : "",
      task.deadline ? moment(task.deadline).format("YYYY-MM-DD") : "",
      task.deadline ? moment(task.deadline).format("DD/MM/YYYY") : "",
      task.deadline ? moment(task.deadline).format("MMM D, YYYY") : "",
      (task.assignedUsers || []).map((u) => u?.name || "").join(" "),
      (task.module_names || []).join(" "),
      (task.modules || []).map((m) => m?.name || "").join(" "),
    ]
      .join(" ")
      .toLowerCase();
    const terms = lc.split(/\s+/).filter(Boolean);
    return terms.every((t) => fields.includes(t));
  };

  const applyQuick = (rows) => {
    if (quick === "overdue") {
      const now = new Date();
      return rows.filter(
        (t) =>
          t.deadline && new Date(t.deadline) < now && !isDoneStatus(t.status),
      );
    }
    if (quick === "due7") {
      const now = new Date();
      const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return rows.filter((t) => {
        const d = t.deadline ? new Date(t.deadline) : null;
        return d && d >= now && d <= soon && !isDoneStatus(t.status);
      });
    }
    if (quick === "high") {
      return rows.filter((t) => (t.priority || "").toLowerCase() === "high");
    }
    if (quick === "open") {
      return rows.filter((t) => !isDoneStatus(t.status));
    }
    return rows;
  };

  const filtered = useMemo(() => {
    let rows = [...tasks];
    rows = applyQuick(rows);
    if (search.trim()) rows = rows.filter((t) => matchAny(t, search));
    rows.sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt),
    );
    return rows;
  }, [tasks, search, sortOrder, quick]);

  // ---------- paging ----------
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  // ---------- update ----------
  const renderStatusOptions = (currentStatus) => {
    if (String(currentStatus).toLowerCase() === "closed")
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
      // optimistic UI
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, ...partial } : t)),
      );
      await axios.put(`${api}/tasks/${taskId}`, partial, {
        headers: authHeader,
      });
    } catch (e) {
      console.error("Update assigned task failed:", e?.response || e);
      fetchAssigned(); // rollback
      alert(
        e?.response?.data?.message ||
          "Failed to update task. Your changes were rolled back.",
      );
    } finally {
      setBusyId(null);
    }
  };

  // ---------- CSV export ----------
  const exportCSV = () => {
    const rows = filtered.map((t) => ({
      id: t._id,
      title: t.task_title || t.title || "",
      description: (t.description || "").replace(/\n/g, " "),
      status: t.status,
      priority: t.priority,
      assignees: (t.assignedUsers || []).map((u) => u?.name).join("; "),
      startDate: t.startDate ? moment(t.startDate).format("YYYY-MM-DD") : "",
      deadline: t.deadline ? moment(t.deadline).format("YYYY-MM-DD") : "",
      createdAt: t.createdAt
        ? moment(t.createdAt).format("YYYY-MM-DD HH:mm")
        : "",
    }));
    const header = Object.keys(rows[0] || {}).join(",");
    const body = rows
      .map((r) =>
        Object.values(r)
          .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([header + "\n" + body], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `assigned_tasks_project_${projectId || "all"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- UI ----------
  return (
    <div className="bg-white py-6 sm:py-8 text-[13px]">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="min-w-[220px]">
            <h2 className="font-semibold tracking-tight text-indigo-600 text-[16px]">
              Assigned Tasks — Project: {projectId || "All"}
            </h2>
            <div className="text-[11px] text-gray-600">
              {loading
                ? "Loading…"
                : `Total: ${tasks.length} | Showing: ${filtered.length}`}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Sort */}
            {sortOrder === "desc" ? (
              <FaSortAmountDownAlt
                className="text-lg cursor-pointer text-gray-500"
                onClick={() =>
                  setSortOrder((s) => (s === "desc" ? "asc" : "desc"))
                }
                title="Sort by latest"
              />
            ) : (
              <FaSortAmountUpAlt
                className="text-lg cursor-pointer text-gray-500"
                onClick={() =>
                  setSortOrder((s) => (s === "desc" ? "asc" : "desc"))
                }
                title="Sort by oldest"
              />
            )}

            {/* View toggles */}
            <FaThList
              className={cls(
                "text-lg cursor-pointer",
                viewMode === "list" ? "text-indigo-600" : "text-gray-500",
              )}
              onClick={() => setViewMode("list")}
              title="List"
            />
            <FaThLarge
              className={cls(
                "text-lg cursor-pointer",
                viewMode === "card" ? "text-indigo-600" : "text-gray-500",
              )}
              onClick={() => setViewMode("card")}
              title="Card"
            />
            <FaTh
              className={cls(
                "text-lg cursor-pointer",
                viewMode === "grid" ? "text-indigo-600" : "text-gray-500",
              )}
              onClick={() => setViewMode("grid")}
              title="Grid"
            />

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-2 top-2.5 text-gray-400" />
              <input
                className="pl-7 pr-2 py-1.5 border rounded-md w-[220px]"
                placeholder="Search title, user, module, date…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Page size */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-600">Rows</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1.5 border rounded-md"
                title="Rows per page"
              >
                {[5, 10, 20, 40, 60, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Export + refresh */}
            <button
              onClick={exportCSV}
              className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
              title="Export CSV (filtered)"
            >
              <FaDownload /> <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={fetchAssigned}
              className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
              title="Refresh"
            >
              <FaSync /> <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              to={`/single-project/${projectId}`}
              className="bg-indigo-700 text-white px-3 py-1.5 rounded-md hover:bg-indigo-900"
            >
              Project
            </Link>
          </div>
        </div>

        {/* Quick filters */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <button
              className={cls(
                "text-[11px] leading-none rounded-full px-2 py-1 border transition",
                quick === "open"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
              )}
              onClick={() => {
                setQuick((q) => (q === "open" ? "" : "open"));
                setPage(1);
              }}
              title="Not finished/closed"
            >
              Open
            </button>
            <button
              className={cls(
                "text-[11px] leading-none rounded-full px-2 py-1 border transition",
                quick === "overdue"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
              )}
              onClick={() => {
                setQuick((q) => (q === "overdue" ? "" : "overdue"));
                setPage(1);
              }}
              title="Not finished/closed and deadline passed"
            >
              Overdue
            </button>
            <button
              className={cls(
                "text-[11px] leading-none rounded-full px-2 py-1 border transition",
                quick === "due7"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
              )}
              onClick={() => {
                setQuick((q) => (q === "due7" ? "" : "due7"));
                setPage(1);
              }}
              title="Due in next 7 days"
            >
              Due in 7d
            </button>
            <button
              className={cls(
                "text-[11px] leading-none rounded-full px-2 py-1 border transition",
                quick === "high"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
              )}
              onClick={() => {
                setQuick((q) => (q === "high" ? "" : "high"));
                setPage(1);
              }}
              title="Priority: High"
            >
              High Priority
            </button>
          </div>
          <button
            className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
            onClick={() => {
              setQuick("");
              setSearch("");
              setPage(1);
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="mt-6 text-sm text-gray-600">Loading…</div>
        ) : loadErr ? (
          <div className="mt-6 text-sm text-red-600">{loadErr}</div>
        ) : viewMode === "list" ? (
          <div className="mt-4 space-y-2">
            <div className="overflow-x-auto">
              {/* header */}
              <div
                className="relative grid items-center text-[12px] font-semibold text-slate-600 px-2 py-2 border-b border-slate-200 min-w-max"
                style={{ gridTemplateColumns }}
              >
                {[
                  "Title",
                  "Description",
                  "Priority",
                  "Status",
                  "Start",
                  "Deadline",
                ].map((label, i) => (
                  <div key={label} className="relative pr-2">
                    <span>{label}</span>
                    {i < colW.length - 1 ? (
                      <Resizer onMouseDown={(e) => startColResize(i, e)} />
                    ) : null}
                  </div>
                ))}
              </div>

              {/* rows */}
              <div className="divide-y divide-slate-100 min-w-max">
                {pageRows.map((t) => {
                  const rem = reminderFor(t);
                  return (
                    <div
                      key={t._id}
                      className="grid items-center text-[12px] px-2 py-2 resize-y overflow-visible"
                      style={{ gridTemplateColumns, minHeight: 42 }}
                      title="Drag bottom edge to resize row"
                    >
                      {/* ✅ WRAP instead of truncate */}
                      <div className="text-slate-900 font-medium whitespace-normal break-words leading-snug">
                        {t.task_title || t.title}
                      </div>

                      {/* ✅ WRAP instead of line-clamp */}
                      <div className="text-slate-700 whitespace-normal break-words leading-snug">
                        {t.description}
                      </div>

                      <div className="capitalize">
                        <span
                          className={cls(
                            "px-2 py-0.5 rounded text-[11px] border inline-block",
                            (t.priority || "") === "high"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : (t.priority || "") === "medium"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-50 text-slate-700 border-slate-200",
                          )}
                        >
                          {t.priority}
                        </span>
                      </div>

                      <div>
                        <select
                          className={cls(
                            "px-2 py-1 rounded border",
                            badge(t.status),
                          )}
                          defaultValue={t.status}
                          onChange={(e) =>
                            updateTask(t._id, { status: e.target.value })
                          }
                          disabled={
                            busyId === t._id ||
                            String(t.status).toLowerCase() === "closed"
                          }
                          title="Change status"
                        >
                          <option value={t.status}>{t.status}</option>
                          {renderStatusOptions(t.status)}
                        </select>
                      </div>

                      <div className="text-slate-700 whitespace-normal break-words">
                        {t.startDate
                          ? moment(t.startDate).format("DD/MM/YYYY")
                          : "—"}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-slate-700 whitespace-normal break-words">
                          {t.deadline
                            ? moment(t.deadline).format("DD/MM/YYYY")
                            : "—"}
                        </span>
                        {rem && (
                          <span
                            className={reminderChipClass}
                            title="Deadline reminder"
                          >
                            {redDot}
                            {rem.text}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {!pageRows.length && (
                  <div className="text-center text-[12px] text-slate-500 py-6">
                    No tasks match your filters.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
            {pageRows.map((t) => {
              const rem = reminderFor(t);
              return (
                <div key={t._id} className="border rounded-lg p-3 shadow-sm">
                  <div className="font-semibold text-slate-900 truncate">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span>{t.task_title || t.title}</span>
                    </div>
                  </div>
                  <div className="mt-1 text-[12px] text-slate-700 line-clamp-2">
                    {t.description}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={cls(
                        "px-2 py-0.5 rounded text-[11px]",
                        badge(t.status),
                      )}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div className="mt-2 text-[12px] text-slate-700 truncate">
                    {(t.assignedUsers || []).map((u) => u?.name).join(", ") ||
                      "—"}
                  </div>
                  <div className="mt-2">
                    <select
                      className="w-full bg-white border border-gray-300 px-2 py-1 rounded-lg text-[12px]"
                      defaultValue=""
                      onChange={(e) =>
                        updateTask(t._id, { status: e.target.value })
                      }
                      disabled={
                        busyId === t._id ||
                        String(t.status).toLowerCase() === "closed"
                      }
                    >
                      <option value="" disabled hidden>
                        Change status…
                      </option>
                      {renderStatusOptions(t.status)}
                    </select>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-600 grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-slate-500">Start</div>
                      <div>
                        {t.startDate
                          ? moment(t.startDate).format("DD/MM/YYYY")
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Deadline</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>
                          {t.deadline
                            ? moment(t.deadline).format("DD/MM/YYYY")
                            : "—"}
                        </span>
                        {rem && (
                          <span className={reminderChipClass}>
                            {redDot}
                            {rem.text}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Link
                      to={`/single-project/${projectId}/single-task/${t._id}`}
                      className="text-indigo-600 hover:underline text-[12px]"
                    >
                      History
                    </Link>
                  </div>
                </div>
              );
            })}
            {!pageRows.length && (
              <div className="text-center text-[12px] text-slate-500 py-6 col-span-full">
                No tasks match your filters.
              </div>
            )}
          </div>
        ) : (
          // Card mode (simple)
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            {pageRows.map((t) => {
              const rem = reminderFor(t);
              return (
                <div key={t._id} className="border rounded-lg p-3 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="font-semibold truncate">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>{t.task_title || t.title}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[12px] text-slate-700 mt-1 line-clamp-3">
                    {t.description}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px]">
                    <span
                      className={cls(
                        "px-2 py-0.5 rounded border capitalize",
                        (t.priority || "") === "high"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : (t.priority || "") === "medium"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-50 text-slate-700 border-slate-200",
                      )}
                    >
                      {t.priority}
                    </span>
                    <span
                      className={cls("px-2 py-0.5 rounded", badge(t.status))}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                    <div>
                      <div className="text-slate-500">Start</div>
                      <div>
                        {t.startDate
                          ? moment(t.startDate).format("DD/MM/YYYY")
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Deadline</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>
                          {t.deadline
                            ? moment(t.deadline).format("DD/MM/YYYY")
                            : "—"}
                        </span>
                        {rem && (
                          <span className={reminderChipClass}>
                            {redDot}
                            {rem.text}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-[12px] text-slate-700 truncate">
                    {(t.assignedUsers || []).map((u) => u?.name).join(", ") ||
                      "—"}
                  </div>
                  <div className="mt-2 flex justify-between">
                    <Link
                      to={`/single-project/${projectId}/single-task/${t._id}`}
                      className="text-indigo-600 hover:underline text-[12px]"
                    >
                      History
                    </Link>
                    <select
                      className="bg-white border border-gray-300 px-2 py-1 rounded-lg text-[12px]"
                      defaultValue=""
                      onChange={(e) =>
                        updateTask(t._id, { status: e.target.value })
                      }
                      disabled={
                        busyId === t._id ||
                        String(t.status).toLowerCase() === "closed"
                      }
                    >
                      <option value="" disabled hidden>
                        Change status…
                      </option>
                      {renderStatusOptions(t.status)}
                    </select>
                  </div>
                </div>
              );
            })}
            {!pageRows.length && (
              <div className="text-center text-[12px] text-slate-500 py-6 col-span-full">
                No tasks match your filters.
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !loadErr && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              title="Previous"
            >
              <FaArrowLeft className="text-lg" />
            </button>
            <span className="text-[12px]">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              title="Next"
            >
              <FaArrowRight className="text-lg" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
