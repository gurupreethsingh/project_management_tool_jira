// // src/pages/tasks/ViewAllTasks.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import moment from "moment";
// import { Link, useParams } from "react-router-dom";
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
//   FaCheckSquare,
//   FaSquare,
//   FaTrashAlt,
// } from "react-icons/fa";
// import globalBackendRoute from "../../config/Config";

// const cls = (...a) => a.filter(Boolean).join(" ");

// const badge = (status) => {
//   switch (status) {
//     case "new":
//       return "bg-blue-100 text-blue-700";
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

// const STATUS_VALUES = [
//   "new",
//   "re-assigned",
//   "in-progress",
//   "finished",
//   "closed",
//   "pending",
// ];

// export default function ViewAllTasks() {
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
//   const isSuperAdmin = userRole === "superadmin";

//   // ---------- state ----------
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadErr, setLoadErr] = useState("");
//   const [busyId, setBusyId] = useState(null);

//   // View + paging
//   const [viewMode, setViewMode] = useState(
//     localStorage.getItem("tasks:viewMode") || "list"
//   );
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(
//     Number(localStorage.getItem("tasks:pageSize")) || 10
//   );

//   // Filters
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [moduleFilter, setModuleFilter] = useState("");
//   const [assigneeFilter, setAssigneeFilter] = useState("");
//   const [quick, setQuick] = useState(""); // "", "overdue", "due7", "high"

//   // Counts for header badges
//   const [statusCounts, setStatusCounts] = useState([]);
//   const [moduleCounts, setModuleCounts] = useState([]);
//   const [assigneeCounts, setAssigneeCounts] = useState([]);
//   const [engineers, setEngineers] = useState([]);
//   const [developers, setDevelopers] = useState([]);

//   // Modules (for dropdowns)
//   const [modulesList, setModulesList] = useState([]);

//   // Bulk ops state
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [bulkMode, setBulkMode] = useState("status"); // 'status' | 'assign' | 'addMods' | 'removeMods' | 'delete'
//   const [bulkStatus, setBulkStatus] = useState("");
//   const [bulkUser, setBulkUser] = useState("");
//   const [bulkModuleNames, setBulkModuleNames] = useState(""); // CSV input for new names
//   const [newModuleName, setNewModuleName] = useState(""); // single new name helper
//   const [bulkModuleIds, setBulkModuleIds] = useState([]); // multi-select existing modules

//   // ---------- fetch ----------
//   const fetchAll = async () => {
//     try {
//       setLoading(true);
//       setLoadErr("");

//       const [t, scStatus, scModule, scAssignee, tes, devs, mods] =
//         await Promise.all([
//           axios.get(`${api}/projects/${projectId}/tasks`, {
//             headers: authHeader,
//           }),
//           axios.get(`${api}/tasks-counts?project=${projectId}&groupBy=status`, {
//             headers: authHeader,
//           }),
//           axios.get(`${api}/tasks-counts?project=${projectId}&groupBy=module`, {
//             headers: authHeader,
//           }),
//           axios.get(
//             `${api}/tasks-counts?project=${projectId}&groupBy=assignee`,
//             { headers: authHeader }
//           ),
//           axios.get(`${api}/projects/${projectId}/test-engineers`, {
//             headers: authHeader,
//           }),
//           axios.get(`${api}/projects/${projectId}/developers`, {
//             headers: authHeader,
//           }),
//           axios.get(`${api}/projects/${projectId}/modules`, {
//             headers: authHeader,
//           }),
//         ]);

//       const tasksArr = Array.isArray(t?.data) ? t.data : t?.data?.tasks || [];
//       setTasks(tasksArr);

//       setStatusCounts(scStatus?.data?.counts || []);
//       setModuleCounts(scModule?.data?.counts || []);
//       setAssigneeCounts(scAssignee?.data?.counts || []);
//       setEngineers(tes?.data?.testEngineers || []);
//       setDevelopers(devs?.data?.developers || []);
//       setModulesList(mods?.data || []);
//     } catch (e) {
//       console.error("ViewAllTasks load error:", e?.response || e);
//       setLoadErr(e?.response?.data?.message || "Failed to load tasks.");
//       setTasks([]);
//       setStatusCounts([]);
//       setModuleCounts([]);
//       setAssigneeCounts([]);
//       setModulesList([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAll();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [projectId]);

//   useEffect(() => {
//     localStorage.setItem("tasks:viewMode", viewMode);
//   }, [viewMode]);

//   useEffect(() => {
//     localStorage.setItem("tasks:pageSize", String(pageSize));
//   }, [pageSize]);

//   const allUsers = useMemo(
//     () => [...engineers, ...developers],
//     [engineers, developers]
//   );

//   const userNameById = (id) => {
//     const u = allUsers.find((x) => String(x._id) === String(id));
//     return u?.name || "(Unknown)";
//   };

//   const matchAny = (task, q) => {
//     if (!q) return true;
//     const lc = q.toLowerCase();

//     const fields = [
//       task.task_title || task.title || "",
//       task.description || "",
//       task.priority || "",
//       task.status || "",
//       (task.module_names || []).join(" "),
//       (task.modules || []).map((m) => m?.name || "").join(" "),
//       (task.assignedUsers || []).map((u) => u?.name || "").join(" "),
//       task._id,
//       task?.project?.project_name || "",
//       // dates in multiple formats
//       task.startDate ? moment(task.startDate).format("YYYY-MM-DD") : "",
//       task.startDate ? moment(task.startDate).format("DD/MM/YYYY") : "",
//       task.startDate ? moment(task.startDate).format("MMM D, YYYY") : "",
//       task.deadline ? moment(task.deadline).format("YYYY-MM-DD") : "",
//       task.deadline ? moment(task.deadline).format("DD/MM/YYYY") : "",
//       task.deadline ? moment(task.deadline).format("MMM D, YYYY") : "",
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
//           t.deadline &&
//           new Date(t.deadline) < now &&
//           !["finished", "closed"].includes(t.status)
//       );
//     }
//     if (quick === "due7") {
//       const now = new Date();
//       const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
//       return rows.filter((t) => {
//         const d = t.deadline ? new Date(t.deadline) : null;
//         return (
//           d &&
//           d >= now &&
//           d <= soon &&
//           !["finished", "closed"].includes(t.status)
//         );
//       });
//     }
//     if (quick === "high") {
//       return rows.filter((t) => (t.priority || "").toLowerCase() === "high");
//     }
//     return rows;
//   };

//   // ---------- search + filter + sort ----------
//   const filtered = useMemo(() => {
//     let rows = [...tasks];

//     if (statusFilter) rows = rows.filter((t) => t.status === statusFilter);

//     if (moduleFilter) {
//       rows = rows.filter((t) => {
//         const names = (t.module_names || []).map((x) =>
//           (x || "").toLowerCase()
//         );
//         const populated = (t.modules || []).map((m) =>
//           (m?.name || "").toLowerCase()
//         );
//         const all = new Set([...names, ...populated]);
//         return all.has(moduleFilter.toLowerCase());
//       });
//     }

//     if (assigneeFilter) {
//       rows = rows.filter((t) =>
//         (t.assignedUsers || []).some(
//           (u) => String(u?._id) === String(assigneeFilter)
//         )
//       );
//     }

//     rows = applyQuick(rows);

//     if (search.trim()) {
//       rows = rows.filter((t) => matchAny(t, search));
//     }

//     rows.sort((a, b) =>
//       sortOrder === "desc"
//         ? new Date(b.createdAt) - new Date(a.createdAt)
//         : new Date(a.createdAt) - new Date(b.createdAt)
//     );

//     return rows;
//   }, [
//     tasks,
//     statusFilter,
//     moduleFilter,
//     assigneeFilter,
//     quick,
//     search,
//     sortOrder,
//   ]);

//   // ---------- paging ----------
//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

//   useEffect(() => {
//     setPage((p) => Math.min(p, totalPages));
//   }, [totalPages]);

//   // ---------- single update ----------
//   const updateTask = async (taskId, partial) => {
//     if (!userId) return;
//     try {
//       setBusyId(taskId);
//       setTasks((prev) =>
//         prev.map((t) => (t._id === taskId ? { ...t, ...partial } : t))
//       );
//       await axios.put(`${api}/tasks/${taskId}`, partial, {
//         headers: authHeader,
//       });
//     } catch (e) {
//       console.error("Update task failed:", e?.response || e);
//       await fetchAll(); // rollback
//       alert(e?.response?.data?.message || "Failed to update task.");
//     } finally {
//       setBusyId(null);
//     }
//   };

//   // ---------- bulk ops ----------
//   const toggleAllVisible = () => {
//     const visibleIds = pageRows.map((t) => t._id);
//     const allSelected = visibleIds.every((id) => selectedIds.includes(id));
//     if (allSelected) {
//       setSelectedIds((ids) => ids.filter((id) => !visibleIds.includes(id)));
//     } else {
//       setSelectedIds((ids) => Array.from(new Set([...ids, ...visibleIds])));
//     }
//   };

//   const toggleOne = (id) => {
//     setSelectedIds((ids) =>
//       ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
//     );
//   };

//   const doBulk = async () => {
//     if (!selectedIds.length) return alert("Select at least one task.");
//     try {
//       if (bulkMode === "status") {
//         if (!bulkStatus) return alert("Choose a status.");
//         await axios.patch(
//           `${api}/tasks/bulk/status`,
//           { ids: selectedIds, status: bulkStatus },
//           { headers: authHeader }
//         );
//       } else if (bulkMode === "assign") {
//         if (!bulkUser) return alert("Choose a user to assign.");
//         await axios.patch(
//           `${api}/tasks/bulk/assign`,
//           { ids: selectedIds, assignedUsers: [bulkUser] },
//           { headers: authHeader }
//         );
//       } else if (bulkMode === "addMods") {
//         const names = [
//           ...bulkModuleNames
//             .split(",")
//             .map((s) => s.trim())
//             .filter(Boolean),
//           ...(newModuleName ? [newModuleName.trim()] : []),
//         ];
//         if (!names.length && !bulkModuleIds.length)
//           return alert("Choose existing modules and/or type new names.");

//         await axios.patch(
//           `${api}/tasks/bulk/modules/add`,
//           {
//             ids: selectedIds,
//             project: projectId,
//             moduleNames: names,
//             moduleIds: bulkModuleIds,
//           },
//           { headers: authHeader }
//         );
//       } else if (bulkMode === "removeMods") {
//         const names = bulkModuleNames
//           .split(",")
//           .map((s) => s.trim())
//           .filter(Boolean);
//         if (!names.length && !bulkModuleIds.length)
//           return alert("Pick modules to remove (ids and/or names).");

//         await axios.patch(
//           `${api}/tasks/bulk/modules/remove`,
//           { ids: selectedIds, moduleNames: names, moduleIds: bulkModuleIds },
//           { headers: authHeader }
//         );
//       } else if (bulkMode === "delete") {
//         if (!window.confirm("Delete selected tasks? This cannot be undone."))
//           return;
//         await axios.delete(`${api}/tasks/bulk`, {
//           headers: authHeader,
//           data: { ids: selectedIds },
//         });
//       }

//       // reset bulk inputs
//       setSelectedIds([]);
//       setBulkStatus("");
//       setBulkUser("");
//       setBulkModuleNames("");
//       setNewModuleName("");
//       setBulkModuleIds([]);

//       await fetchAll();
//     } catch (e) {
//       console.error("Bulk op failed:", e?.response || e);
//       const serverMsg = e?.response?.data?.message || "Bulk operation failed.";
//       const mismatched = e?.response?.data?.mismatchedTaskIds;
//       if (mismatched && mismatched.length) {
//         alert(
//           `${serverMsg}\n\nThese tasks are in a different project:\n${mismatched.join(
//             ", "
//           )}`
//         );
//       } else {
//         alert(serverMsg);
//       }
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
//       modules: (t.module_names || []).join("; "),
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
//     a.download = `project_${projectId}_tasks.csv`;
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
//               Tasks — Project: {projectId}
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
//               onClick={fetchAll}
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

//         {/* Quick filters + badges */}
//         <div className="mt-3 space-y-2">
//           <div className="flex items-center justify-between">
//             <div className="flex gap-2 flex-wrap">
//               <button
//                 className={cls(
//                   "text-[11px] leading-none rounded-full px-2 py-1 border transition",
//                   quick === "overdue"
//                     ? "bg-indigo-600 text-white border-indigo-600"
//                     : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//                 )}
//                 onClick={() => {
//                   setQuick((q) => (q === "overdue" ? "" : "overdue"));
//                   setPage(1);
//                 }}
//                 title="Not finished/closed and deadline passed"
//               >
//                 Overdue
//               </button>
//               <button
//                 className={cls(
//                   "text-[11px] leading-none rounded-full px-2 py-1 border transition",
//                   quick === "due7"
//                     ? "bg-indigo-600 text-white border-indigo-600"
//                     : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//                 )}
//                 onClick={() => {
//                   setQuick((q) => (q === "due7" ? "" : "due7"));
//                   setPage(1);
//                 }}
//                 title="Due in next 7 days"
//               >
//                 Due in 7d
//               </button>
//               <button
//                 className={cls(
//                   "text-[11px] leading-none rounded-full px-2 py-1 border transition",
//                   quick === "high"
//                     ? "bg-indigo-600 text-white border-indigo-600"
//                     : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//                 )}
//                 onClick={() => {
//                   setQuick((q) => (q === "high" ? "" : "high"));
//                   setPage(1);
//                 }}
//                 title="Priority: High"
//               >
//                 High Priority
//               </button>
//             </div>
//             <button
//               className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
//               onClick={() => {
//                 setStatusFilter("");
//                 setModuleFilter("");
//                 setAssigneeFilter("");
//                 setQuick("");
//                 setSearch("");
//                 setPage(1);
//               }}
//             >
//               Clear All Filters
//             </button>
//           </div>

//           {/* Status badges */}
//           <div className="flex gap-2 overflow-x-auto pb-1">
//             {STATUS_VALUES.map((s) => {
//               const count = statusCounts.find((x) => x._id === s)?.count || 0;
//               const active = statusFilter === s;
//               return (
//                 <button
//                   key={s}
//                   onClick={() => {
//                     setStatusFilter(active ? "" : s);
//                     setPage(1);
//                   }}
//                   className={cls(
//                     "text-[11px] leading-none rounded-full px-2 py-1 border transition",
//                     active
//                       ? "bg-indigo-600 text-white border-indigo-600"
//                       : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//                   )}
//                   title={`${s} (${count})`}
//                 >
//                   <span className={cls("px-1 rounded", badge(s))}>{s}</span>{" "}
//                   <span className="opacity-70 ml-1">({count})</span>
//                 </button>
//               );
//             })}
//           </div>

//           {/* Module badges */}
//           <div className="flex gap-2 overflow-x-auto pb-1">
//             {moduleCounts.map((m) => {
//               const active =
//                 moduleFilter.toLowerCase() === String(m._id).toLowerCase();
//               return (
//                 <button
//                   key={String(m._id)}
//                   onClick={() => {
//                     setModuleFilter(active ? "" : String(m._id));
//                     setPage(1);
//                   }}
//                   className={cls(
//                     "text-[11px] leading-none rounded-full px-2 py-1 border transition",
//                     active
//                       ? "bg-indigo-600 text-white border-indigo-600"
//                       : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//                   )}
//                   title={`${m._id} (${m.count})`}
//                 >
//                   {m._id} <span className="opacity-70 ml-1">({m.count})</span>
//                 </button>
//               );
//             })}
//             {moduleCounts.length === 0 && (
//               <span className="text-[12px] text-slate-500">No module data</span>
//             )}
//           </div>

//           {/* Assignee badges */}
//           <div className="flex gap-2 overflow-x-auto pb-1">
//             {assigneeCounts.map((a) => {
//               const id = String(a._id || "");
//               const name = userNameById(id);
//               const active = String(assigneeFilter) === id;
//               return (
//                 <button
//                   key={id}
//                   onClick={() => {
//                     setAssigneeFilter(active ? "" : id);
//                     setPage(1);
//                   }}
//                   className={cls(
//                     "text-[11px] leading-none rounded-full px-2 py-1 border transition",
//                     active
//                       ? "bg-indigo-600 text-white border-indigo-600"
//                       : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//                   )}
//                   title={`${name} (${a.count})`}
//                 >
//                   {name} <span className="opacity-70 ml-1">({a.count})</span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Bulk ops (superadmin only) */}
//         {isSuperAdmin && (
//           <div className="mt-3 p-2 border rounded-md bg-amber-50">
//             <div className="flex items-center gap-2 flex-wrap">
//               <span className="text-[12px] font-semibold">Bulk:</span>
//               <select
//                 value={bulkMode}
//                 onChange={(e) => setBulkMode(e.target.value)}
//                 className="px-2 py-1 border rounded"
//                 title="Choose bulk operation"
//               >
//                 <option value="status">Change Status</option>
//                 <option value="assign">Replace Assignee</option>
//                 <option value="addMods">Add Modules</option>
//                 <option value="removeMods">Remove Modules</option>
//                 <option value="delete">Delete</option>
//               </select>

//               {bulkMode === "status" && (
//                 <select
//                   value={bulkStatus}
//                   onChange={(e) => setBulkStatus(e.target.value)}
//                   className="px-2 py-1 border rounded"
//                 >
//                   <option value="">Select status…</option>
//                   {STATUS_VALUES.map((s) => (
//                     <option key={s} value={s}>
//                       {s}
//                     </option>
//                   ))}
//                 </select>
//               )}

//               {bulkMode === "assign" && (
//                 <select
//                   value={bulkUser}
//                   onChange={(e) => setBulkUser(e.target.value)}
//                   className="px-2 py-1 border rounded"
//                 >
//                   <option value="">Select user…</option>
//                   {[...engineers, ...developers].map((u) => (
//                     <option key={u._id} value={u._id}>
//                       {u.name} — {u.role}
//                     </option>
//                   ))}
//                 </select>
//               )}

//               {(bulkMode === "addMods" || bulkMode === "removeMods") && (
//                 <div className="flex items-center gap-2 flex-wrap">
//                   {/* existing modules (multi) */}
//                   <select
//                     multiple
//                     value={bulkModuleIds}
//                     onChange={(e) =>
//                       setBulkModuleIds(
//                         Array.from(e.target.selectedOptions).map((o) => o.value)
//                       )
//                     }
//                     className="px-2 py-1 border rounded w-[220px] h-[90px]"
//                     title="Hold Ctrl/Cmd to multi-select"
//                   >
//                     {modulesList.map((m) => (
//                       <option key={m._id} value={m._id}>
//                         {m.name}
//                       </option>
//                     ))}
//                   </select>

//                   {/* new names (optional) */}
//                   {bulkMode === "addMods" && (
//                     <>
//                       <input
//                         className="px-2 py-1 border rounded w-[220px]"
//                         placeholder="Or type new module name"
//                         value={newModuleName}
//                         onChange={(e) => setNewModuleName(e.target.value)}
//                         title="Will be created if it does not exist"
//                       />
//                       <input
//                         className="px-2 py-1 border rounded w-[260px]"
//                         placeholder="Additional new names (comma separated)"
//                         value={bulkModuleNames}
//                         onChange={(e) => setBulkModuleNames(e.target.value)}
//                       />
//                     </>
//                   )}

//                   {bulkMode === "removeMods" && (
//                     <input
//                       className="px-2 py-1 border rounded w-[260px]"
//                       placeholder="Module names to remove (comma separated)"
//                       value={bulkModuleNames}
//                       onChange={(e) => setBulkModuleNames(e.target.value)}
//                     />
//                   )}
//                 </div>
//               )}

//               <button
//                 onClick={doBulk}
//                 className="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700"
//               >
//                 Apply to {selectedIds.length} selected
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Content */}
//         {loading ? (
//           <div className="mt-6 text-sm text-gray-600">Loading…</div>
//         ) : loadErr ? (
//           <div className="mt-6 text-sm text-red-600">{loadErr}</div>
//         ) : viewMode === "list" ? (
//           <div className="mt-4 space-y-2">
//             {/* header */}
//             <div className="grid grid-cols-[36px,24px,1.1fr,1.5fr,0.7fr,0.9fr,0.9fr,0.9fr,0.7fr,150px,70px] items-center text-[12px] font-semibold text-slate-600 px-2 py-2 border-b border-slate-200">
//               <div>#</div>
//               <div className="text-center">
//                 <button onClick={toggleAllVisible} title="Select all on page">
//                   {pageRows.length &&
//                   pageRows.every((r) => selectedIds.includes(r._id)) ? (
//                     <FaCheckSquare />
//                   ) : (
//                     <FaSquare />
//                   )}
//                 </button>
//               </div>
//               <div>Title</div>
//               <div>Description</div>
//               <div>Priority</div>
//               <div>Status</div>
//               <div>Start</div>
//               <div>Deadline</div>
//               <div>Assignees</div>
//               <div>Add Module</div>
//               <div className="text-center">History</div>
//             </div>

//             {/* rows */}
//             <div className="divide-y divide-slate-100">
//               {pageRows.map((t, idx) => (
//                 <div
//                   key={t._id}
//                   className="grid grid-cols-[36px,24px,1.1fr,1.5fr,0.7fr,0.9fr,0.9fr,0.9fr,0.7fr,150px,70px] items-center text-[12px] px-2 py-2"
//                 >
//                   <div className="text-slate-700">
//                     {(page - 1) * pageSize + idx + 1}
//                   </div>

//                   <div className="flex justify-center">
//                     <button onClick={() => toggleOne(t._id)} title="Select">
//                       {selectedIds.includes(t._id) ? (
//                         <FaCheckSquare className="text-emerald-600" />
//                       ) : (
//                         <FaSquare className="text-slate-400" />
//                       )}
//                     </button>
//                   </div>

//                   <div className="text-slate-900 font-medium truncate">
//                     {t.task_title || t.title}
//                   </div>

//                   <div className="text-slate-700 line-clamp-2">
//                     {t.description}
//                   </div>

//                   <div className="capitalize">
//                     <span
//                       className={cls(
//                         "px-2 py-0.5 rounded text-[11px] border",
//                         (t.priority || "") === "high"
//                           ? "bg-rose-50 text-rose-700 border-rose-200"
//                           : (t.priority || "") === "medium"
//                           ? "bg-amber-50 text-amber-700 border-amber-200"
//                           : "bg-slate-50 text-slate-700 border-slate-200"
//                       )}
//                     >
//                       {t.priority}
//                     </span>
//                   </div>

//                   <div>
//                     <select
//                       className={cls(
//                         "px-2 py-1 rounded border",
//                         badge(t.status)
//                       )}
//                       defaultValue={t.status}
//                       onChange={(e) =>
//                         updateTask(t._id, { status: e.target.value })
//                       }
//                       disabled={busyId === t._id || t.status === "closed"}
//                       title="Change status"
//                     >
//                       {STATUS_VALUES.map((s) => (
//                         <option key={s} value={s}>
//                           {s}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="text-slate-700">
//                     {t.startDate
//                       ? moment(t.startDate).format("DD/MM/YYYY")
//                       : "—"}
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <input
//                       type="date"
//                       className="border p-1 rounded w-[140px]"
//                       value={
//                         t.deadline
//                           ? moment(t.deadline).format("YYYY-MM-DD")
//                           : ""
//                       }
//                       onChange={(e) =>
//                         updateTask(t._id, { deadline: e.target.value })
//                       }
//                       disabled={busyId === t._id || t.status === "closed"}
//                       title="Update deadline"
//                     />
//                   </div>

//                   <div className="truncate">
//                     {(t.assignedUsers || []).map((u) => u?.name).join(", ") ||
//                       "—"}
//                   </div>

//                   {/* quick add one module */}
//                   <div>
//                     {modulesList.length > 0 && (
//                       <select
//                         className="px-2 py-1 border rounded w-full"
//                         defaultValue=""
//                         onChange={async (e) => {
//                           const id = e.target.value;
//                           if (!id) return;
//                           try {
//                             await axios.patch(
//                               `${api}/tasks/${t._id}/modules/add`,
//                               { moduleIds: [id] },
//                               { headers: authHeader }
//                             );
//                             await fetchAll();
//                           } catch (err) {
//                             alert(
//                               err?.response?.data?.message ||
//                                 "Failed to add module"
//                             );
//                           } finally {
//                             e.target.value = "";
//                           }
//                         }}
//                         title="Add module"
//                       >
//                         <option value="" disabled>
//                           Add module…
//                         </option>
//                         {modulesList.map((m) => (
//                           <option key={m._id} value={m._id}>
//                             {m.name}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </div>

//                   <div className="text-center">
//                     <Link
//                       to={`/single-project/${projectId}/single-task/${t._id}`}
//                       className="text-indigo-600 hover:underline"
//                     >
//                       View
//                     </Link>
//                   </div>
//                 </div>
//               ))}

//               {!pageRows.length && (
//                 <div className="text-center text-[12px] text-slate-500 py-6">
//                   No tasks match your filters.
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : viewMode === "grid" ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
//             {pageRows.map((t) => (
//               <div key={t._id} className="border rounded-lg p-3 shadow-sm">
//                 <div className="flex justify-between items-start gap-2">
//                   <div className="font-semibold text-slate-900 truncate">
//                     {t.task_title || t.title}
//                   </div>
//                   <button onClick={() => toggleOne(t._id)} title="Select">
//                     {selectedIds.includes(t._id) ? (
//                       <FaCheckSquare className="text-emerald-600" />
//                     ) : (
//                       <FaSquare className="text-slate-400" />
//                     )}
//                   </button>
//                 </div>
//                 <div className="mt-1 text-[12px] text-slate-700 line-clamp-2">
//                   {t.description}
//                 </div>
//                 <div className="mt-2 flex flex-wrap gap-1">
//                   {(t.module_names || []).slice(0, 3).map((m) => (
//                     <span
//                       key={m}
//                       className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700"
//                     >
//                       {m}
//                     </span>
//                   ))}
//                   {(t.module_names || []).length > 3 && (
//                     <span className="text-[10px] text-slate-600">
//                       +{(t.module_names || []).length - 3}
//                     </span>
//                   )}
//                 </div>
//                 <div className="mt-2 flex items-center justify-between">
//                   <span
//                     className={cls(
//                       "px-2 py-0.5 rounded text-[11px]",
//                       badge(t.status)
//                     )}
//                   >
//                     {t.status}
//                   </span>
//                   <span className="text-[11px] text-slate-600">
//                     {t.deadline ? moment(t.deadline).format("DD/MM") : "—"}
//                   </span>
//                 </div>
//                 <div className="mt-2 text-[12px] text-slate-700 truncate">
//                   {(t.assignedUsers || []).map((u) => u?.name).join(", ") ||
//                     "—"}
//                 </div>
//                 <div className="mt-2 flex justify-between">
//                   <Link
//                     to={`/single-project/${projectId}/single-task/${t._id}`}
//                     className="text-indigo-600 hover:underline text-[12px]"
//                   >
//                     History
//                   </Link>
//                   {isSuperAdmin && (
//                     <button
//                       className="text-rose-600 hover:text-rose-800 text-[12px] flex items-center gap-1"
//                       title="Delete task"
//                       onClick={async () => {
//                         if (!window.confirm("Delete this task?")) return;
//                         try {
//                           await axios.delete(`${api}/tasks/${t._id}`, {
//                             headers: authHeader,
//                           });
//                           await fetchAll();
//                         } catch (e) {
//                           alert("Delete failed.");
//                         }
//                       }}
//                     >
//                       <FaTrashAlt /> Delete
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//             {!pageRows.length && (
//               <div className="text-center text-[12px] text-slate-500 py-6 col-span-full">
//                 No tasks match your filters.
//               </div>
//             )}
//           </div>
//         ) : (
//           // Card mode
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
//             {pageRows.map((t) => (
//               <div key={t._id} className="border rounded-lg p-3 shadow-sm">
//                 <div className="flex items-start justify-between">
//                   <div className="font-semibold truncate">
//                     {t.task_title || t.title}
//                   </div>
//                   <button onClick={() => toggleOne(t._id)} title="Select">
//                     {selectedIds.includes(t._id) ? (
//                       <FaCheckSquare className="text-emerald-600" />
//                     ) : (
//                       <FaSquare className="text-slate-400" />
//                     )}
//                   </button>
//                 </div>
//                 <div className="text-[12px] text-slate-700 mt-1 line-clamp-3">
//                   {t.description}
//                 </div>
//                 <div className="mt-2 flex items-center gap-2 text-[11px]">
//                   <span
//                     className={cls(
//                       "px-2 py-0.5 rounded border capitalize",
//                       (t.priority || "") === "high"
//                         ? "bg-rose-50 text-rose-700 border-rose-200"
//                         : (t.priority || "") === "medium"
//                         ? "bg-amber-50 text-amber-700 border-amber-200"
//                         : "bg-slate-50 text-slate-700 border-slate-200"
//                     )}
//                   >
//                     {t.priority}
//                   </span>
//                   <span className={cls("px-2 py-0.5 rounded", badge(t.status))}>
//                     {t.status}
//                   </span>
//                 </div>
//                 <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
//                   <div>
//                     <div className="text-slate-500">Start</div>
//                     <div>
//                       {t.startDate
//                         ? moment(t.startDate).format("DD/MM/YYYY")
//                         : "—"}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-slate-500">Deadline</div>
//                     <div>
//                       {t.deadline
//                         ? moment(t.deadline).format("DD/MM/YYYY")
//                         : "—"}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-2 text-[12px] text-slate-700 truncate">
//                   {(t.assignedUsers || []).map((u) => u?.name).join(", ") ||
//                     "—"}
//                 </div>
//                 <div className="mt-2 flex justify-between">
//                   <Link
//                     to={`/single-project/${projectId}/single-task/${t._id}`}
//                     className="text-indigo-600 hover:underline text-[12px]"
//                   >
//                     History
//                   </Link>
//                 </div>
//               </div>
//             ))}
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

// src/pages/tasks/ViewAllTasks.jsx
// src/pages/tasks/ViewAllTasks.jsx
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
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
  FaSync,
  FaDownload,
  FaCheckSquare,
  FaSquare,
  FaTrashAlt,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const cls = (...a) => a.filter(Boolean).join(" ");

const badge = (status) => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-700";
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

const STATUS_VALUES = [
  "new",
  "re-assigned",
  "in-progress",
  "finished",
  "closed",
  "pending",
];

export default function ViewAllTasks() {
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
  const isSuperAdmin = userRole === "superadmin";

  // ---------- state ----------
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [busyId, setBusyId] = useState(null);

  // View + paging
  const [viewMode, setViewMode] = useState(
    localStorage.getItem("tasks:viewMode") || "list",
  );
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    Number(localStorage.getItem("tasks:pageSize")) || 10,
  );

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [quick, setQuick] = useState(""); // "", "overdue", "due7", "high"

  // Counts for header badges
  const [statusCounts, setStatusCounts] = useState([]);
  const [moduleCounts, setModuleCounts] = useState([]);
  const [assigneeCounts, setAssigneeCounts] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [developers, setDevelopers] = useState([]);

  // Modules (for dropdowns)
  const [modulesList, setModulesList] = useState([]);

  // Bulk ops state
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkMode, setBulkMode] = useState("status"); // 'status' | 'assign' | 'addMods' | 'removeMods' | 'delete'
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkUser, setBulkUser] = useState("");
  const [bulkModuleNames, setBulkModuleNames] = useState(""); // CSV input for new names
  const [newModuleName, setNewModuleName] = useState(""); // single new name helper
  const [bulkModuleIds, setBulkModuleIds] = useState([]); // multi-select existing modules

  // ✅ Column widths (resizable like your scenario page)
  // grid-cols: [36px,24px,Title,Desc,Priority,Status,Start,Deadline,Assignees,AddModule,History]
  const [colW, setColW] = useState([
    36, // #
    24, // checkbox
    260, // Title
    340, // Description
    90, // Priority
    120, // Status
    120, // Start
    170, // Deadline (date input)
    160, // Assignees
    170, // Add Module
    90, // History
  ]);
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
  const fetchAll = async () => {
    try {
      setLoading(true);
      setLoadErr("");

      const [t, scStatus, scModule, scAssignee, tes, devs, mods] =
        await Promise.all([
          axios.get(`${api}/projects/${projectId}/tasks`, {
            headers: authHeader,
          }),
          axios.get(`${api}/tasks-counts?project=${projectId}&groupBy=status`, {
            headers: authHeader,
          }),
          axios.get(`${api}/tasks-counts?project=${projectId}&groupBy=module`, {
            headers: authHeader,
          }),
          axios.get(
            `${api}/tasks-counts?project=${projectId}&groupBy=assignee`,
            { headers: authHeader },
          ),
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

      const tasksArr = Array.isArray(t?.data) ? t.data : t?.data?.tasks || [];
      setTasks(tasksArr);

      setStatusCounts(scStatus?.data?.counts || []);
      setModuleCounts(scModule?.data?.counts || []);
      setAssigneeCounts(scAssignee?.data?.counts || []);
      setEngineers(tes?.data?.testEngineers || []);
      setDevelopers(devs?.data?.developers || []);
      setModulesList(mods?.data || []);
    } catch (e) {
      console.error("ViewAllTasks load error:", e?.response || e);
      setLoadErr(e?.response?.data?.message || "Failed to load tasks.");
      setTasks([]);
      setStatusCounts([]);
      setModuleCounts([]);
      setAssigneeCounts([]);
      setModulesList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    localStorage.setItem("tasks:viewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem("tasks:pageSize", String(pageSize));
  }, [pageSize]);

  const allUsers = useMemo(
    () => [...engineers, ...developers],
    [engineers, developers],
  );

  const userNameById = (id) => {
    const u = allUsers.find((x) => String(x._id) === String(id));
    return u?.name || "(Unknown)";
  };

  const matchAny = (task, q) => {
    if (!q) return true;
    const lc = q.toLowerCase();

    const fields = [
      task.task_title || task.title || "",
      task.description || "",
      task.priority || "",
      task.status || "",
      (task.module_names || []).join(" "),
      (task.modules || []).map((m) => m?.name || "").join(" "),
      (task.assignedUsers || []).map((u) => u?.name || "").join(" "),
      task._id,
      task?.project?.project_name || "",
      // dates in multiple formats
      task.startDate ? moment(task.startDate).format("YYYY-MM-DD") : "",
      task.startDate ? moment(task.startDate).format("DD/MM/YYYY") : "",
      task.startDate ? moment(task.startDate).format("MMM D, YYYY") : "",
      task.deadline ? moment(task.deadline).format("YYYY-MM-DD") : "",
      task.deadline ? moment(task.deadline).format("DD/MM/YYYY") : "",
      task.deadline ? moment(task.deadline).format("MMM D, YYYY") : "",
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
          t.deadline &&
          new Date(t.deadline) < now &&
          !["finished", "closed"].includes(t.status),
      );
    }
    if (quick === "due7") {
      const now = new Date();
      const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return rows.filter((t) => {
        const d = t.deadline ? new Date(t.deadline) : null;
        return (
          d &&
          d >= now &&
          d <= soon &&
          !["finished", "closed"].includes(t.status)
        );
      });
    }
    if (quick === "high") {
      return rows.filter((t) => (t.priority || "").toLowerCase() === "high");
    }
    return rows;
  };

  // ---------- search + filter + sort ----------
  const filtered = useMemo(() => {
    let rows = [...tasks];

    if (statusFilter) rows = rows.filter((t) => t.status === statusFilter);

    if (moduleFilter) {
      rows = rows.filter((t) => {
        const names = (t.module_names || []).map((x) =>
          (x || "").toLowerCase(),
        );
        const populated = (t.modules || []).map((m) =>
          (m?.name || "").toLowerCase(),
        );
        const all = new Set([...names, ...populated]);
        return all.has(moduleFilter.toLowerCase());
      });
    }

    if (assigneeFilter) {
      rows = rows.filter((t) =>
        (t.assignedUsers || []).some(
          (u) => String(u?._id) === String(assigneeFilter),
        ),
      );
    }

    rows = applyQuick(rows);

    if (search.trim()) {
      rows = rows.filter((t) => matchAny(t, search));
    }

    rows.sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt),
    );

    return rows;
  }, [
    tasks,
    statusFilter,
    moduleFilter,
    assigneeFilter,
    quick,
    search,
    sortOrder,
  ]);

  // ---------- paging ----------
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  // ---------- single update ----------
  const updateTask = async (taskId, partial) => {
    if (!userId) return;
    try {
      setBusyId(taskId);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, ...partial } : t)),
      );
      await axios.put(`${api}/tasks/${taskId}`, partial, {
        headers: authHeader,
      });
    } catch (e) {
      console.error("Update task failed:", e?.response || e);
      await fetchAll(); // rollback
      alert(e?.response?.data?.message || "Failed to update task.");
    } finally {
      setBusyId(null);
    }
  };

  // ---------- bulk ops ----------
  const toggleAllVisible = () => {
    const visibleIds = pageRows.map((t) => t._id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((ids) => ids.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((ids) => Array.from(new Set([...ids, ...visibleIds])));
    }
  };

  const toggleOne = (id) => {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );
  };

  const doBulk = async () => {
    if (!selectedIds.length) return alert("Select at least one task.");
    try {
      if (bulkMode === "status") {
        if (!bulkStatus) return alert("Choose a status.");
        await axios.patch(
          `${api}/tasks/bulk/status`,
          { ids: selectedIds, status: bulkStatus },
          { headers: authHeader },
        );
      } else if (bulkMode === "assign") {
        if (!bulkUser) return alert("Choose a user to assign.");
        await axios.patch(
          `${api}/tasks/bulk/assign`,
          { ids: selectedIds, assignedUsers: [bulkUser] },
          { headers: authHeader },
        );
      } else if (bulkMode === "addMods") {
        const names = [
          ...bulkModuleNames
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          ...(newModuleName ? [newModuleName.trim()] : []),
        ];
        if (!names.length && !bulkModuleIds.length)
          return alert("Choose existing modules and/or type new names.");

        await axios.patch(
          `${api}/tasks/bulk/modules/add`,
          {
            ids: selectedIds,
            project: projectId,
            moduleNames: names,
            moduleIds: bulkModuleIds,
          },
          { headers: authHeader },
        );
      } else if (bulkMode === "removeMods") {
        const names = bulkModuleNames
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (!names.length && !bulkModuleIds.length)
          return alert("Pick modules to remove (ids and/or names).");

        await axios.patch(
          `${api}/tasks/bulk/modules/remove`,
          { ids: selectedIds, moduleNames: names, moduleIds: bulkModuleIds },
          { headers: authHeader },
        );
      } else if (bulkMode === "delete") {
        if (!window.confirm("Delete selected tasks? This cannot be undone."))
          return;
        await axios.delete(`${api}/tasks/bulk`, {
          headers: authHeader,
          data: { ids: selectedIds },
        });
      }

      // reset bulk inputs
      setSelectedIds([]);
      setBulkStatus("");
      setBulkUser("");
      setBulkModuleNames("");
      setNewModuleName("");
      setBulkModuleIds([]);

      await fetchAll();
    } catch (e) {
      console.error("Bulk op failed:", e?.response || e);
      const serverMsg = e?.response?.data?.message || "Bulk operation failed.";
      const mismatched = e?.response?.data?.mismatchedTaskIds;
      if (mismatched && mismatched.length) {
        alert(
          `${serverMsg}\n\nThese tasks are in a different project:\n${mismatched.join(
            ", ",
          )}`,
        );
      } else {
        alert(serverMsg);
      }
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
      modules: (t.module_names || []).join("; "),
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
    a.download = `project_${projectId}_tasks.csv`;
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
              Tasks — Project: {projectId}
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
              onClick={fetchAll}
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

        {/* Quick filters + badges */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
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
                setStatusFilter("");
                setModuleFilter("");
                setAssigneeFilter("");
                setQuick("");
                setSearch("");
                setPage(1);
              }}
            >
              Clear All Filters
            </button>
          </div>

          {/* Status badges */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {STATUS_VALUES.map((s) => {
              const count = statusCounts.find((x) => x._id === s)?.count || 0;
              const active = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(active ? "" : s);
                    setPage(1);
                  }}
                  className={cls(
                    "text-[11px] leading-none rounded-full px-2 py-1 border transition",
                    active
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
                  )}
                  title={`${s} (${count})`}
                >
                  <span className={cls("px-1 rounded", badge(s))}>{s}</span>{" "}
                  <span className="opacity-70 ml-1">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Module badges */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {moduleCounts.map((m) => {
              const active =
                moduleFilter.toLowerCase() === String(m._id).toLowerCase();
              return (
                <button
                  key={String(m._id)}
                  onClick={() => {
                    setModuleFilter(active ? "" : String(m._id));
                    setPage(1);
                  }}
                  className={cls(
                    "text-[11px] leading-none rounded-full px-2 py-1 border transition",
                    active
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
                  )}
                  title={`${m._id} (${m.count})`}
                >
                  {m._id} <span className="opacity-70 ml-1">({m.count})</span>
                </button>
              );
            })}
            {moduleCounts.length === 0 && (
              <span className="text-[12px] text-slate-500">No module data</span>
            )}
          </div>

          {/* Assignee badges */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {assigneeCounts.map((a) => {
              const id = String(a._id || "");
              const name = userNameById(id);
              const active = String(assigneeFilter) === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setAssigneeFilter(active ? "" : id);
                    setPage(1);
                  }}
                  className={cls(
                    "text-[11px] leading-none rounded-full px-2 py-1 border transition",
                    active
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
                  )}
                  title={`${name} (${a.count})`}
                >
                  {name} <span className="opacity-70 ml-1">({a.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bulk ops (superadmin only) */}
        {isSuperAdmin && (
          <div className="mt-3 p-2 border rounded-md bg-amber-50">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] font-semibold">Bulk:</span>
              <select
                value={bulkMode}
                onChange={(e) => setBulkMode(e.target.value)}
                className="px-2 py-1 border rounded"
                title="Choose bulk operation"
              >
                <option value="status">Change Status</option>
                <option value="assign">Replace Assignee</option>
                <option value="addMods">Add Modules</option>
                <option value="removeMods">Remove Modules</option>
                <option value="delete">Delete</option>
              </select>

              {bulkMode === "status" && (
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="px-2 py-1 border rounded"
                >
                  <option value="">Select status…</option>
                  {STATUS_VALUES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              )}

              {bulkMode === "assign" && (
                <select
                  value={bulkUser}
                  onChange={(e) => setBulkUser(e.target.value)}
                  className="px-2 py-1 border rounded"
                >
                  <option value="">Select user…</option>
                  {[...engineers, ...developers].map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} — {u.role}
                    </option>
                  ))}
                </select>
              )}

              {(bulkMode === "addMods" || bulkMode === "removeMods") && (
                <div className="flex items-center gap-2 flex-wrap">
                  {/* existing modules (multi) */}
                  <select
                    multiple
                    value={bulkModuleIds}
                    onChange={(e) =>
                      setBulkModuleIds(
                        Array.from(e.target.selectedOptions).map(
                          (o) => o.value,
                        ),
                      )
                    }
                    className="px-2 py-1 border rounded w-[220px] h-[90px]"
                    title="Hold Ctrl/Cmd to multi-select"
                  >
                    {modulesList.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))}
                  </select>

                  {/* new names (optional) */}
                  {bulkMode === "addMods" && (
                    <>
                      <input
                        className="px-2 py-1 border rounded w-[220px]"
                        placeholder="Or type new module name"
                        value={newModuleName}
                        onChange={(e) => setNewModuleName(e.target.value)}
                        title="Will be created if it does not exist"
                      />
                      <input
                        className="px-2 py-1 border rounded w-[260px]"
                        placeholder="Additional new names (comma separated)"
                        value={bulkModuleNames}
                        onChange={(e) => setBulkModuleNames(e.target.value)}
                      />
                    </>
                  )}

                  {bulkMode === "removeMods" && (
                    <input
                      className="px-2 py-1 border rounded w-[260px]"
                      placeholder="Module names to remove (comma separated)"
                      value={bulkModuleNames}
                      onChange={(e) => setBulkModuleNames(e.target.value)}
                    />
                  )}
                </div>
              )}

              <button
                onClick={doBulk}
                className="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Apply to {selectedIds.length} selected
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="mt-6 text-sm text-gray-600">Loading…</div>
        ) : loadErr ? (
          <div className="mt-6 text-sm text-red-600">{loadErr}</div>
        ) : viewMode === "list" ? (
          <div className="mt-4 space-y-2">
            {/* ✅ Horizontal scroll + Resizable columns */}
            <div className="overflow-x-auto">
              {/* header */}
              <div
                className="relative grid items-center text-[12px] font-semibold text-slate-600 px-2 py-2 border-b border-slate-200 min-w-max"
                style={{ gridTemplateColumns }}
              >
                {[
                  "#",
                  "",
                  "Title",
                  "Description",
                  "Priority",
                  "Status",
                  "Start",
                  "Deadline",
                  "Assignees",
                  "Add Module",
                  "History",
                ].map((label, i) => (
                  <div
                    key={`${label}-${i}`}
                    className={cls(
                      "relative pr-2",
                      i === 1 || i === 10 ? "text-center" : "",
                    )}
                  >
                    {i === 1 ? (
                      <button
                        onClick={toggleAllVisible}
                        title="Select all on page"
                      >
                        {pageRows.length &&
                        pageRows.every((r) => selectedIds.includes(r._id)) ? (
                          <FaCheckSquare />
                        ) : (
                          <FaSquare />
                        )}
                      </button>
                    ) : (
                      <span>{label}</span>
                    )}
                    {i < colW.length - 1 ? (
                      <Resizer onMouseDown={(e) => startColResize(i, e)} />
                    ) : null}
                  </div>
                ))}
              </div>

              {/* rows */}
              <div className="divide-y divide-slate-100 min-w-max">
                {pageRows.map((t, idx) => (
                  <div
                    key={t._id}
                    className="grid items-center text-[12px] px-2 py-2 resize-y overflow-visible"
                    style={{ gridTemplateColumns, minHeight: 42 }}
                    title="Drag bottom edge to resize row"
                  >
                    <div className="text-slate-700">
                      {(page - 1) * pageSize + idx + 1}
                    </div>

                    <div className="flex justify-center">
                      <button onClick={() => toggleOne(t._id)} title="Select">
                        {selectedIds.includes(t._id) ? (
                          <FaCheckSquare className="text-emerald-600" />
                        ) : (
                          <FaSquare className="text-slate-400" />
                        )}
                      </button>
                    </div>

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
                        disabled={busyId === t._id || t.status === "closed"}
                        title="Change status"
                      >
                        {STATUS_VALUES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="text-slate-700 whitespace-normal break-words">
                      {t.startDate
                        ? moment(t.startDate).format("DD/MM/YYYY")
                        : "—"}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        className="border p-1 rounded w-full min-w-[120px]"
                        value={
                          t.deadline
                            ? moment(t.deadline).format("YYYY-MM-DD")
                            : ""
                        }
                        onChange={(e) =>
                          updateTask(t._id, { deadline: e.target.value })
                        }
                        disabled={busyId === t._id || t.status === "closed"}
                        title="Update deadline"
                      />
                    </div>

                    {/* ✅ WRAP instead of truncate */}
                    <div className="whitespace-normal break-words leading-snug">
                      {(t.assignedUsers || []).map((u) => u?.name).join(", ") ||
                        "—"}
                    </div>

                    {/* quick add one module */}
                    <div>
                      {modulesList.length > 0 && (
                        <select
                          className="px-2 py-1 border rounded w-full"
                          defaultValue=""
                          onChange={async (e) => {
                            const id = e.target.value;
                            if (!id) return;
                            try {
                              await axios.patch(
                                `${api}/tasks/${t._id}/modules/add`,
                                { moduleIds: [id] },
                                { headers: authHeader },
                              );
                              await fetchAll();
                            } catch (err) {
                              alert(
                                err?.response?.data?.message ||
                                  "Failed to add module",
                              );
                            } finally {
                              e.target.value = "";
                            }
                          }}
                          title="Add module"
                        >
                          <option value="" disabled>
                            Add module…
                          </option>
                          {modulesList.map((m) => (
                            <option key={m._id} value={m._id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="text-center">
                      <Link
                        to={`/single-project/${projectId}/single-task/${t._id}`}
                        className="text-indigo-600 hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}

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
            {pageRows.map((t) => (
              <div key={t._id} className="border rounded-lg p-3 shadow-sm">
                <div className="flex justify-between items-start gap-2">
                  <div className="font-semibold text-slate-900 truncate">
                    {t.task_title || t.title}
                  </div>
                  <button onClick={() => toggleOne(t._id)} title="Select">
                    {selectedIds.includes(t._id) ? (
                      <FaCheckSquare className="text-emerald-600" />
                    ) : (
                      <FaSquare className="text-slate-400" />
                    )}
                  </button>
                </div>
                <div className="mt-1 text-[12px] text-slate-700 line-clamp-2">
                  {t.description}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(t.module_names || []).slice(0, 3).map((m) => (
                    <span
                      key={m}
                      className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700"
                    >
                      {m}
                    </span>
                  ))}
                  {(t.module_names || []).length > 3 && (
                    <span className="text-[10px] text-slate-600">
                      +{(t.module_names || []).length - 3}
                    </span>
                  )}
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
                  <span className="text-[11px] text-slate-600">
                    {t.deadline ? moment(t.deadline).format("DD/MM") : "—"}
                  </span>
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
                  {isSuperAdmin && (
                    <button
                      className="text-rose-600 hover:text-rose-800 text-[12px] flex items-center gap-1"
                      title="Delete task"
                      onClick={async () => {
                        if (!window.confirm("Delete this task?")) return;
                        try {
                          await axios.delete(`${api}/tasks/${t._id}`, {
                            headers: authHeader,
                          });
                          await fetchAll();
                        } catch (e) {
                          alert("Delete failed.");
                        }
                      }}
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
            {!pageRows.length && (
              <div className="text-center text-[12px] text-slate-500 py-6 col-span-full">
                No tasks match your filters.
              </div>
            )}
          </div>
        ) : (
          // Card mode
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            {pageRows.map((t) => (
              <div key={t._id} className="border rounded-lg p-3 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="font-semibold truncate">
                    {t.task_title || t.title}
                  </div>
                  <button onClick={() => toggleOne(t._id)} title="Select">
                    {selectedIds.includes(t._id) ? (
                      <FaCheckSquare className="text-emerald-600" />
                    ) : (
                      <FaSquare className="text-slate-400" />
                    )}
                  </button>
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
                  <span className={cls("px-2 py-0.5 rounded", badge(t.status))}>
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
                    <div>
                      {t.deadline
                        ? moment(t.deadline).format("DD/MM/YYYY")
                        : "—"}
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
                </div>
              </div>
            ))}
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
