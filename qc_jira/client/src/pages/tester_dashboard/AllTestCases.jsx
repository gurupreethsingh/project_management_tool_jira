// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import {
//   FaThList,
//   FaThLarge,
//   FaTh,
//   FaSearch,
//   FaEye,
//   FaTrashAlt,
//   FaArrowLeft,
//   FaArrowRight,
//   FaSort,
// } from "react-icons/fa";
// import globalBackendRoute from "../../config/Config";

// const STATUS_PENDING_ID = "__status_pending__";

// /* ---------- Search utils (same pattern as other pages) ---------- */
// const STOP_WORDS = new Set([
//   "a",
//   "an",
//   "the",
//   "and",
//   "or",
//   "of",
//   "in",
//   "on",
//   "at",
//   "to",
//   "for",
//   "with",
//   "by",
//   "from",
//   "is",
//   "are",
//   "was",
//   "were",
//   "be",
//   "been",
//   "being",
//   "i",
//   "you",
//   "he",
//   "she",
//   "it",
//   "we",
//   "they",
//   "me",
//   "him",
//   "her",
//   "us",
//   "them",
//   "this",
//   "that",
//   "these",
//   "those",
//   "there",
//   "here",
//   "please",
//   "pls",
//   "plz",
//   "show",
//   "find",
//   "search",
//   "look",
//   "list",
//   "test",
//   "tests",
//   "case",
//   "cases",
//   "testcase",
//   "testcases",
//   "tc",
//   "named",
//   "called",
// ]);

// const norm = (s = "") =>
//   String(s)
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, ""); // strip accents

// const tokenize = (raw) => {
//   const trimmed = String(raw || "").trim(); // kill leading/trailing spaces
//   if (!trimmed) return [];
//   return trimmed
//     .split(/\s+/)
//     .map(norm)
//     .filter(Boolean)
//     .filter((t) => !STOP_WORDS.has(t));
// };
// /* --------------------------------------------------------------- */

// export default function AllTestCases() {
//   const { projectId } = useParams();

//   // ---- state ----
//   const [testCases, setTestCases] = useState([]);
//   const [view, setView] = useState("list");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedQuery, setDebouncedQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [sortOrder, setSortOrder] = useState("desc"); // newest first (server sort)
//   const [execType, setExecType] = useState(""); // "", Manual, Automation, Both

//   const [totalTestCases, setTotalTestCases] = useState(0);
//   const [filteredCount, setFilteredCount] = useState(0);

//   // pass/fail/pending counters (recomputed from filtered list)
//   const [passedCount, setPassedCount] = useState(0);
//   const [failedCount, setFailedCount] = useState(0);
//   const [pendingCount, setPendingCount] = useState(0);

//   // Module filter + special "Pending" chip
//   const [selectedModuleId, setSelectedModuleId] = useState(null);

//   const getTestStatus = (tc) => {
//     const steps = Array.isArray(tc?.testing_steps) ? tc.testing_steps : [];
//     if (steps.length === 0) return "Missing";
//     let hasAny = false,
//       hasFail = false,
//       hasPending = false;
//     for (const s of steps) {
//       const raw = String(s?.status ?? "")
//         .trim()
//         .toLowerCase();
//       if (!raw) continue;
//       hasAny = true;
//       if (raw === "fail") hasFail = true;
//       else if (raw === "pending") hasPending = true;
//     }
//     if (!hasAny) return "Missing";
//     if (hasFail) return "Fail";
//     if (hasPending) return "Pending";
//     return "Pass";
//   };

//   // ---- fetch ----
//   const fetchTCs = async (opts = {}) => {
//     try {
//       const token = localStorage.getItem("token");
//       const params = new URLSearchParams();
//       if (execType) params.append("execType", execType);
//       params.append("sortBy", "createdAt");
//       params.append("order", sortOrder);
//       const url = `${globalBackendRoute}/api/single-project/${projectId}/all-test-cases?${params.toString()}`;
//       const res = await axios.get(url, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       const rows = Array.isArray(res.data) ? res.data : [];
//       setTestCases(rows);
//       setTotalTestCases(rows.length);
//       if (opts.resetPage) setCurrentPage(1);
//     } catch (err) {
//       console.error("Error fetching test cases:", err?.response?.data || err);
//     }
//   };

//   useEffect(() => {
//     fetchTCs({ resetPage: true });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [projectId, execType, sortOrder]);

//   // ---- debounce search ----
//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedQuery(searchQuery), 180);
//     return () => clearTimeout(t);
//   }, [searchQuery]);

//   // ---- module chips + special "Pending" chip ----
//   const modules = useMemo(() => {
//     const counts = new Map(); // key -> { _id, name, count }
//     let pendingTotal = 0;

//     for (const tc of testCases) {
//       if (getTestStatus(tc) === "Pending") pendingTotal += 1;

//       // From list API we have only `module_name`
//       const modId = tc?.module_name
//         ? `name:${tc.module_name}`
//         : "__unassigned__";
//       const modName = tc?.module_name || "Unassigned";

//       if (!counts.has(modId))
//         counts.set(modId, { _id: modId, name: modName, count: 0 });
//       counts.get(modId).count += 1;
//     }

//     const list = Array.from(counts.values()).sort((a, b) =>
//       a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
//     );

//     // special status-pending chip (top)
//     list.unshift({
//       _id: STATUS_PENDING_ID,
//       name: "Pending",
//       count: pendingTotal,
//     });

//     return list;
//   }, [testCases]);

//   // ---- filtered (smart search + module/status filter) ----
//   const filtered = useMemo(() => {
//     const tokens = tokenize(debouncedQuery);

//     const rows = testCases.filter((tc) => {
//       // special "Pending" filter
//       if (selectedModuleId === STATUS_PENDING_ID) {
//         if (getTestStatus(tc) !== "Pending") return false;
//       } else if (selectedModuleId) {
//         // module match
//         const modIdCandidate = tc?.module_name
//           ? `name:${tc.module_name}`
//           : "__unassigned__";
//         if (modIdCandidate !== selectedModuleId) return false;
//       }

//       // If no search tokens (empty or all stop-words), keep row
//       if (!tokens.length) return true;

//       // Build search haystack
//       const hay = norm(
//         [
//           tc?.test_case_name || "",
//           tc?.test_case_number || "",
//           tc?.module_name || "Unassigned",
//           tc?.requirement_number || "",
//           tc?.project_name || "",
//         ].join(" ")
//       );

//       // Match if any token exists in haystack
//       return tokens.some((t) => hay.includes(t));
//     });

//     // recompute pass/fail/pending on filtered set
//     let pass = 0,
//       fail = 0,
//       pend = 0;
//     for (const r of rows) {
//       const st = getTestStatus(r);
//       if (st === "Pass") pass += 1;
//       else if (st === "Fail") fail += 1;
//       else if (st === "Pending") pend += 1;
//     }
//     setPassedCount(pass);
//     setFailedCount(fail);
//     setPendingCount(pend);

//     return rows;
//   }, [testCases, debouncedQuery, selectedModuleId]);

//   // ---- pagination + counts sync ----
//   useEffect(() => {
//     setFilteredCount(filtered.length);

//     if (itemsPerPage === 0) {
//       setTotalPages(1);
//       setCurrentPage(1);
//       return;
//     }

//     const pages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
//     setTotalPages(pages);
//     setCurrentPage((p) => Math.min(p, pages));
//   }, [filtered, itemsPerPage]);

//   // ---- pagination slice ----
//   const current = useMemo(() => {
//     if (itemsPerPage === 0) return filtered; // All
//     const indexOfLast = currentPage * itemsPerPage;
//     const indexOfFirst = indexOfLast - itemsPerPage;
//     return filtered.slice(indexOfFirst, indexOfLast);
//   }, [filtered, itemsPerPage, currentPage]);

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this test case? This action is irreversible."
//     );
//     if (!confirmDelete) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${globalBackendRoute}/api/delete-test-case/${id}`, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       alert("Test case deleted successfully.");
//       const updated = testCases.filter((t) => t._id !== id);
//       setTestCases(updated);
//       setTotalTestCases(updated.length);
//     } catch (error) {
//       console.error("Error deleting test case:", error);
//       alert(
//         error?.response?.data?.message ||
//           "Error deleting test case. Please try again."
//       );
//     }
//   };

//   const onModuleClick = (id) => {
//     setSelectedModuleId((prev) => (prev === id ? null : id));
//     setCurrentPage(1);
//   };

//   const clearModuleSelection = () => {
//     setSelectedModuleId(null);
//     setCurrentPage(1);
//   };

//   return (
//     <div className="bg-white py-10 sm:py-12">
//       <div className="mx-auto container px-2 sm:px-3 lg:px-4">
//         {/* Header / Controls */}
//         <div className="flex justify-between items-center gap-3 flex-wrap">
//           <div>
//             <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
//               All Test Cases for Project: {projectId}
//             </h2>
//             <p className="text-xs text-gray-600 mt-1">
//               Total Test Cases: {totalTestCases}
//             </p>
//             {(searchQuery || selectedModuleId || execType) && (
//               <p className="text-xs text-gray-600">
//                 Showing {filteredCount} result(s)
//                 {searchQuery ? <> for “{searchQuery}”</> : null}
//                 {selectedModuleId
//                   ? selectedModuleId === STATUS_PENDING_ID
//                     ? " with status Pending"
//                     : " in selected module"
//                   : null}
//                 {execType ? ` · Exec: ${execType}` : null}
//               </p>
//             )}
//             <p className="text-[11px] text-slate-600 mt-1">
//               <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 mr-1 font-medium text-emerald-700">
//                 Pass: {passedCount}
//               </span>
//               <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 mr-1 font-medium text-rose-700">
//                 Fail: {failedCount}
//               </span>
//               <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
//                 Pending: {pendingCount}
//               </span>
//             </p>
//           </div>

//           <div className="flex items-center gap-3 flex-wrap">
//             {/* Exec type filter */}
//             <div className="flex items-center gap-2">
//               <label className="text-xs text-slate-600">Exec:</label>
//               <select
//                 value={execType}
//                 onChange={(e) => setExecType(e.target.value)}
//                 className="text-sm border rounded-md px-2 py-1"
//                 title="Filter by execution type"
//               >
//                 <option value="">All</option>
//                 <option value="Manual">Manual</option>
//                 <option value="Automation">Automation</option>
//                 <option value="Both">Both</option>
//               </select>
//             </div>

//             {/* Page size */}
//             <div className="flex items-center gap-2">
//               <label className="text-xs text-slate-600">Rows:</label>
//               <select
//                 value={itemsPerPage}
//                 onChange={(e) => {
//                   const v =
//                     e.target.value === "0" ? 0 : parseInt(e.target.value, 10);
//                   setItemsPerPage(v);
//                   setCurrentPage(1);
//                 }}
//                 className="text-sm border rounded-md px-2 py-1"
//                 title="Select number of rows per page"
//               >
//                 <option value={10}>10</option>
//                 <option value={20}>20</option>
//                 <option value={30}>30</option>
//                 <option value={40}>40</option>
//                 <option value={60}>60</option>
//                 <option value={0}>All</option>
//               </select>
//             </div>

//             {/* View toggles */}
//             <FaThList
//               className={`text-lg cursor-pointer ${
//                 view === "list" ? "text-blue-500" : "text-gray-500"
//               }`}
//               onClick={() => setView("list")}
//               title="List view"
//             />
//             <FaThLarge
//               className={`text-lg cursor-pointer ${
//                 view === "card" ? "text-blue-500" : "text-gray-500"
//               }`}
//               onClick={() => setView("card")}
//               title="Card view"
//             />
//             <FaTh
//               className={`text-lg cursor-pointer ${
//                 view === "grid" ? "text-blue-500" : "text-gray-500"
//               }`}
//               onClick={() => setView("grid")}
//               title="Grid view"
//             />

//             {/* Search (raw input; matching uses trimmed/tokenized debouncedQuery) */}
//             <div className="relative">
//               <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
//               <input
//                 type="text"
//                 className="pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none"
//                 placeholder="Search test cases..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 spellCheck={false}
//               />
//             </div>

//             {/* Sort order toggle (server-side via sortOrder) */}
//             <button
//               onClick={() =>
//                 setSortOrder((s) => (s === "asc" ? "desc" : "asc"))
//               }
//               className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm inline-flex items-center"
//               title="Server sort by Created date"
//             >
//               <FaSort className="mr-1" />
//               Sort ({sortOrder === "asc" ? "Oldest" : "Newest"})
//             </button>

//             <a
//               href={`/single-project/${projectId}`}
//               className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm"
//             >
//               Project Dashboard
//             </a>
//           </div>
//         </div>

//         {/* Module + Status chips row */}
//         <div className="mt-4">
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="text-xs font-semibold text-slate-700">
//               Filter by Module / Status
//             </h3>
//             <button
//               onClick={clearModuleSelection}
//               className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
//             >
//               Clear
//             </button>
//           </div>

//           <div className="flex gap-2 overflow-x-auto pb-1">
//             {modules.map((m) => {
//               const active = selectedModuleId === m._id;
//               return (
//                 <button
//                   key={m._id}
//                   onClick={() => onModuleClick(m._id)}
//                   className={[
//                     "whitespace-nowrap px-3 py-1 rounded-full border text-[12px]",
//                     active
//                       ? "bg-indigo-600 text-white border-indigo-600"
//                       : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
//                   ].join(" ")}
//                   title={`${m.name} (${m.count})`}
//                 >
//                   {m.name} <span className="opacity-70 ml-1">({m.count})</span>
//                 </button>
//               );
//             })}
//             {modules.length === 0 && (
//               <span className="text-slate-500 text-sm">No modules found</span>
//             )}
//           </div>
//         </div>

//         {/* List View */}
//         {view === "list" && (
//           <div className="mt-5">
//             <div className="grid grid-cols-[56px,140px,1fr,160px,140px,90px,40px,40px] items-center text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200">
//               <div>#</div>
//               <div>TC Number</div>
//               <div>Name</div>
//               <div>Module</div>
//               <div>Requirement</div>
//               <div>Status</div>
//               <div className="text-center">View</div>
//               <div className="text-center">Del</div>
//             </div>

//             <div className="divide-y divide-slate-200">
//               {current.map((tc, idx) => {
//                 const status = getTestStatus(tc);
//                 const statusClass =
//                   status === "Pass"
//                     ? "text-emerald-600"
//                     : status === "Fail"
//                     ? "text-rose-600"
//                     : status === "Pending"
//                     ? "text-amber-600"
//                     : "text-slate-600";
//                 return (
//                   <div
//                     key={tc._id}
//                     className="grid grid-cols-[56px,140px,1fr,160px,140px,90px,40px,40px] items-center text-[12px] px-3 py-2"
//                   >
//                     <div className="text-slate-700">
//                       {(itemsPerPage === 0
//                         ? 0
//                         : (currentPage - 1) * itemsPerPage) +
//                         idx +
//                         1}
//                     </div>

//                     <div className="text-slate-900 font-medium truncate">
//                       {tc?.test_case_number || "-"}
//                     </div>

//                     <div className="text-slate-700 line-clamp-2">
//                       {tc?.test_case_name || "-"}
//                     </div>

//                     <div className="truncate">
//                       <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
//                         {tc?.module_name || "Unassigned"}
//                       </span>
//                     </div>

//                     <div className="text-slate-700 truncate">
//                       {tc?.requirement_number || "-"}
//                     </div>

//                     <div className={`font-semibold ${statusClass}`}>
//                       {status}
//                     </div>

//                     <div className="flex justify-center">
//                       <Link
//                         to={`/test-case-detail/${tc._id}`}
//                         className="text-indigo-600 hover:text-indigo-800"
//                         title="View"
//                       >
//                         <FaEye className="text-sm" />
//                       </Link>
//                     </div>

//                     <div className="flex justify-center">
//                       <button
//                         onClick={() => handleDelete(tc._id)}
//                         className="text-rose-600 hover:text-rose-800"
//                         title="Delete"
//                       >
//                         <FaTrashAlt className="text-sm" />
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Grid View */}
//         {view === "grid" && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-8">
//             {current.map((tc) => {
//               const status = getTestStatus(tc);
//               const statusClass =
//                 status === "Pass"
//                   ? "text-emerald-600"
//                   : status === "Fail"
//                   ? "text-rose-600"
//                   : status === "Pending"
//                   ? "text-amber-600"
//                   : "text-slate-600";
//               return (
//                 <div
//                   key={tc._id}
//                   className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
//                 >
//                   <div>
//                     <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
//                       <span>TC: {tc?.test_case_number || "-"}</span>
//                       <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
//                         {tc?.module_name || "Unassigned"}
//                       </span>
//                     </div>
//                     <div className="text-sm text-gray-600 break-words whitespace-normal mt-1">
//                       {tc?.test_case_name || "-"}
//                     </div>
//                     <div className="mt-1 text-[11px] text-slate-600">
//                       Requirement: {tc?.requirement_number || "-"}
//                     </div>
//                     <div
//                       className={`mt-1 text-[12px] font-semibold ${statusClass}`}
//                     >
//                       {status}
//                     </div>
//                   </div>
//                   <div className="mt-2 flex justify-between">
//                     <Link
//                       to={`/test-case-detail/${tc._id}`}
//                       className="text-blue-500 hover:text-blue-700 text-sm"
//                     >
//                       <FaEye className="text-sm" />
//                     </Link>
//                     <button
//                       onClick={() => handleDelete(tc._id)}
//                       className="text-rose-500 hover:text-rose-700 text-sm"
//                     >
//                       <FaTrashAlt className="text-sm" />
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Card View */}
//         {view === "card" && (
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
//             {current.map((tc) => {
//               const status = getTestStatus(tc);
//               const statusClass =
//                 status === "Pass"
//                   ? "text-emerald-600"
//                   : status === "Fail"
//                   ? "text-rose-600"
//                   : status === "Pending"
//                   ? "text-amber-600"
//                   : "text-slate-600";
//               return (
//                 <div
//                   key={tc._id}
//                   className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
//                 >
//                   <div>
//                     <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
//                       <span>TC: {tc?.test_case_number || "-"}</span>
//                       <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
//                         {tc?.module_name || "Unassigned"}
//                       </span>
//                     </div>
//                     <div className="text-sm text-gray-600 break-words whitespace-normal mt-1">
//                       {tc?.test_case_name || "-"}
//                     </div>
//                     <div className="mt-1 text-[11px] text-slate-600">
//                       Requirement: {tc?.requirement_number || "-"}
//                     </div>
//                     <div
//                       className={`mt-1 text-[12px] font-semibold ${statusClass}`}
//                     >
//                       {status}
//                     </div>
//                   </div>
//                   <div className="mt-2 flex justify-between">
//                     <Link
//                       to={`/test-case-detail/${tc._id}`}
//                       className="text-blue-500 hover:text-blue-700 text-sm"
//                     >
//                       <FaEye className="text-sm" />
//                     </Link>
//                     <button
//                       onClick={() => handleDelete(tc._id)}
//                       className="text-rose-500 hover:text-rose-700 text-sm"
//                     >
//                       <FaTrashAlt className="text-sm" />
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Pagination */}
//         <div className="flex justify-center items-center gap-2 mt-8">
//           <button
//             className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
//             disabled={itemsPerPage === 0 || currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//           >
//             <FaArrowLeft className="text-lg" />
//           </button>
//           <span className="text-sm">
//             {itemsPerPage === 0 ? (
//               <>Showing all {filteredCount} test cases</>
//             ) : (
//               <>
//                 Page {currentPage} of {totalPages}
//               </>
//             )}
//           </span>
//           <button
//             className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
//             disabled={itemsPerPage === 0 || currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => p + 1)}
//           >
//             <FaArrowRight className="text-lg" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

//

import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

const STATUS_PENDING_ID = "__status_pending__";

/* ---------- Search utils (same pattern as other pages) ---------- */
const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "of",
  "in",
  "on",
  "at",
  "to",
  "for",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "me",
  "him",
  "her",
  "us",
  "them",
  "this",
  "that",
  "these",
  "those",
  "there",
  "here",
  "please",
  "pls",
  "plz",
  "show",
  "find",
  "search",
  "look",
  "list",
  "test",
  "tests",
  "case",
  "cases",
  "testcase",
  "testcases",
  "tc",
  "named",
  "called",
]);

const norm = (s = "") =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // strip accents

const tokenize = (raw) => {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return [];
  return trimmed
    .split(/\s+/)
    .map(norm)
    .filter(Boolean)
    .filter((t) => !STOP_WORDS.has(t));
};
/* --------------------------------------------------------------- */

export default function AllTestCases() {
  const { projectId } = useParams();

  // ---- state ----
  const [testCases, setTestCases] = useState([]);
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [execType, setExecType] = useState(""); // "", Manual, Automation, Both
  const [sortOrder, setSortOrder] = useState("desc"); // newest first (server sort)

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [totalTestCases, setTotalTestCases] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);

  // pass/fail/pending counters (recomputed from filtered list)
  const [passedCount, setPassedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  // Module filter + special "Pending" chip
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  // ✅ Column widths (Excel-ish)
  // Columns: [#, TC Number, Name, Module, Requirement, Status, View, Del]
  const [colW, setColW] = useState([56, 140, 520, 160, 140, 90, 40, 40]);
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

  const getTestStatus = (tc) => {
    const steps = Array.isArray(tc?.testing_steps) ? tc.testing_steps : [];
    if (steps.length === 0) return "Missing";
    let hasAny = false,
      hasFail = false,
      hasPending = false;
    for (const s of steps) {
      const raw = String(s?.status ?? "")
        .trim()
        .toLowerCase();
      if (!raw) continue;
      hasAny = true;
      if (raw === "fail") hasFail = true;
      else if (raw === "pending") hasPending = true;
    }
    if (!hasAny) return "Missing";
    if (hasFail) return "Fail";
    if (hasPending) return "Pending";
    return "Pass";
  };

  // ---- fetch ----
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const fetchTCs = async () => {
      try {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams();
        if (execType) params.append("execType", execType);
        params.append("sortBy", "createdAt");
        params.append("order", sortOrder);

        const url = `${globalBackendRoute}/api/single-project/${projectId}/all-test-cases?${params.toString()}`;
        const res = await axios.get(url, {
          signal: controller.signal,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!alive) return;
        const rows = Array.isArray(res.data) ? res.data : [];
        setTestCases(rows);
        setTotalTestCases(rows.length);
        setCurrentPage(1);
      } catch (err) {
        if (!axios.isCancel?.(err)) {
          console.error(
            "Error fetching test cases:",
            err?.response?.data || err,
          );
        }
      }
    };

    fetchTCs();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [projectId, execType, sortOrder]);

  // ✅ defer heavy filtering while typing
  const dq = useDeferredValue(searchQuery);
  const dm = useDeferredValue(selectedModuleId);

  // ---- module chips + special "Pending" chip ----
  const modules = useMemo(() => {
    const counts = new Map(); // key -> { _id, name, count }
    let pendingTotal = 0;

    for (const tc of testCases) {
      if (getTestStatus(tc) === "Pending") pendingTotal += 1;

      const modId = tc?.module_name
        ? `name:${tc.module_name}`
        : "__unassigned__";
      const modName = tc?.module_name || "Unassigned";

      if (!counts.has(modId))
        counts.set(modId, { _id: modId, name: modName, count: 0 });
      counts.get(modId).count += 1;
    }

    const list = Array.from(counts.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );

    list.unshift({
      _id: STATUS_PENDING_ID,
      name: "Pending",
      count: pendingTotal,
    });

    return list;
  }, [testCases]);

  // ---- filtered (smart search + module/status filter) ----
  const filtered = useMemo(() => {
    const tokens = tokenize(dq);

    const rows = testCases.filter((tc) => {
      // special "Pending" filter
      if (dm === STATUS_PENDING_ID) {
        if (getTestStatus(tc) !== "Pending") return false;
      } else if (dm) {
        const modIdCandidate = tc?.module_name
          ? `name:${tc.module_name}`
          : "__unassigned__";
        if (modIdCandidate !== dm) return false;
      }

      if (!tokens.length) return true;

      const hay = norm(
        [
          tc?.test_case_name || "",
          tc?.test_case_number || "",
          tc?.module_name || "Unassigned",
          tc?.requirement_number || "",
          tc?.project_name || "",
        ].join(" "),
      );

      return tokens.some((t) => hay.includes(t));
    });

    // recompute pass/fail/pending on filtered set
    let pass = 0,
      fail = 0,
      pend = 0;
    for (const r of rows) {
      const st = getTestStatus(r);
      if (st === "Pass") pass += 1;
      else if (st === "Fail") fail += 1;
      else if (st === "Pending") pend += 1;
    }
    setPassedCount(pass);
    setFailedCount(fail);
    setPendingCount(pend);

    return rows;
  }, [testCases, dq, dm]);

  // ---- pagination + counts sync ----
  useEffect(() => {
    setFilteredCount(filtered.length);

    if (itemsPerPage === 0) {
      setTotalPages(1);
      setCurrentPage(1);
      return;
    }

    const pages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    setTotalPages(pages);
    setCurrentPage((p) => Math.min(p, pages));
  }, [filtered, itemsPerPage]);

  const indexOfLast =
    itemsPerPage === 0 ? filtered.length : currentPage * itemsPerPage;
  const indexOfFirst = itemsPerPage === 0 ? 0 : indexOfLast - itemsPerPage;

  const pageSlice = useMemo(
    () => filtered.slice(indexOfFirst, indexOfLast),
    [filtered, indexOfFirst, indexOfLast],
  );

  // ✅ Lazy render inside current page (helps if you choose "All")
  const [renderCount, setRenderCount] = useState(60);
  useEffect(() => {
    setRenderCount(60);
  }, [currentPage, itemsPerPage, dq, dm, view]);

  useEffect(() => {
    if (renderCount >= pageSlice.length) return;
    const id = window.requestAnimationFrame(() => {
      setRenderCount((c) => Math.min(pageSlice.length, c + 80));
    });
    return () => window.cancelAnimationFrame(id);
  }, [renderCount, pageSlice.length]);

  const current = useMemo(
    () => pageSlice.slice(0, renderCount),
    [pageSlice, renderCount],
  );

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this test case? This action is irreversible.",
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${globalBackendRoute}/api/delete-test-case/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      alert("Test case deleted successfully.");
      setTestCases((prev) => {
        const updated = prev.filter((t) => t._id !== id);
        setTotalTestCases(updated.length);
        return updated;
      });
    } catch (error) {
      console.error("Error deleting test case:", error);
      alert(
        error?.response?.data?.message ||
          "Error deleting test case. Please try again.",
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

  const handlePageChange = (newPage) => setCurrentPage(newPage);

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

            {(searchQuery || selectedModuleId || execType) && (
              <p className="text-xs text-gray-600">
                Showing {filteredCount} result(s)
                {searchQuery ? <> for “{searchQuery}”</> : null}
                {selectedModuleId
                  ? selectedModuleId === STATUS_PENDING_ID
                    ? " with status Pending"
                    : " in selected module"
                  : null}
                {execType ? ` · Exec: ${execType}` : null}
              </p>
            )}

            <p className="text-[11px] text-slate-600 mt-1">
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 mr-1 font-medium text-emerald-700">
                Pass: {passedCount}
              </span>
              <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 mr-1 font-medium text-rose-700">
                Fail: {failedCount}
              </span>
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
                Pending: {pendingCount}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Exec type filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600">Exec:</label>
              <select
                value={execType}
                onChange={(e) => {
                  setExecType(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-sm border rounded-md px-2 py-1"
                title="Filter by execution type"
              >
                <option value="">All</option>
                <option value="Manual">Manual</option>
                <option value="Automation">Automation</option>
                <option value="Both">Both</option>
              </select>
            </div>

            {/* Page size */}
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

            {/* View toggles */}
            <FaThList
              className={`text-lg cursor-pointer ${view === "list" ? "text-blue-500" : "text-gray-500"}`}
              onClick={() => setView("list")}
              title="List view"
            />
            <FaThLarge
              className={`text-lg cursor-pointer ${view === "card" ? "text-blue-500" : "text-gray-500"}`}
              onClick={() => setView("card")}
              title="Card view"
            />
            <FaTh
              className={`text-lg cursor-pointer ${view === "grid" ? "text-blue-500" : "text-gray-500"}`}
              onClick={() => setView("grid")}
              title="Grid view"
            />

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                className="pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none"
                placeholder="Search test cases..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                spellCheck={false}
              />
            </div>

            {/* Sort order toggle */}
            <button
              onClick={() =>
                setSortOrder((s) => (s === "asc" ? "desc" : "asc"))
              }
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm inline-flex items-center"
              title="Server sort by Created date"
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
            <div className="overflow-x-auto">
              {/* Header row (resizable columns) */}
              <div
                className="relative grid items-center text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200 min-w-max"
                style={{ gridTemplateColumns }}
              >
                {[
                  "#",
                  "TC Number",
                  "Name",
                  "Module",
                  "Requirement",
                  "Status",
                  "View",
                  "Del",
                ].map((label, i) => (
                  <div
                    key={label}
                    className={`relative ${i >= 6 ? "text-center" : ""} pr-2`}
                  >
                    <span>{label}</span>
                    {i < colW.length - 1 ? (
                      <Resizer onMouseDown={(e) => startColResize(i, e)} />
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Body rows (resizable height + WRAP, NOT HIDE) */}
              <div className="divide-y divide-slate-200 min-w-max">
                {current.map((tc, idx) => {
                  const status = getTestStatus(tc);
                  const statusClass =
                    status === "Pass"
                      ? "text-emerald-600"
                      : status === "Fail"
                        ? "text-rose-600"
                        : status === "Pending"
                          ? "text-amber-600"
                          : "text-slate-600";

                  return (
                    <div
                      key={tc._id}
                      className="grid items-start text-[12px] px-3 py-2 resize-y overflow-visible"
                      style={{ gridTemplateColumns, minHeight: 42 }}
                      title="Drag bottom edge to resize row"
                    >
                      <div className="text-slate-700">
                        {(itemsPerPage === 0
                          ? 0
                          : (currentPage - 1) * itemsPerPage) +
                          idx +
                          1}
                      </div>

                      <div className="text-slate-900 font-medium whitespace-normal break-words leading-snug">
                        {tc?.test_case_number || "-"}
                      </div>

                      <div className="text-slate-700 whitespace-normal break-words leading-snug">
                        {tc?.test_case_name || "-"}
                      </div>

                      <div className="whitespace-normal break-words">
                        <span className="inline-flex max-w-full items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 whitespace-normal break-words">
                          {tc?.module_name || "Unassigned"}
                        </span>
                      </div>

                      <div className="text-slate-700 whitespace-normal break-words leading-snug">
                        {tc?.requirement_number || "-"}
                      </div>

                      <div className={`font-semibold ${statusClass}`}>
                        {status}
                      </div>

                      <div className="flex justify-center pt-0.5">
                        <Link
                          to={`/test-case-detail/${tc._id}`}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="View"
                        >
                          <FaEye className="text-sm" />
                        </Link>
                      </div>

                      <div className="flex justify-center pt-0.5">
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

              {renderCount < pageSlice.length && (
                <div className="text-center text-xs text-slate-500 py-3">
                  Rendering more…
                </div>
              )}
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
                    : status === "Pending"
                      ? "text-amber-600"
                      : "text-slate-600";
              return (
                <div
                  key={tc._id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                      <span>TC: {tc?.test_case_number || "-"}</span>
                      <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                        {tc?.module_name || "Unassigned"}
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
            {renderCount < pageSlice.length && (
              <div className="col-span-full text-center text-xs text-slate-500 py-3">
                Rendering more…
              </div>
            )}
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
                    : status === "Pending"
                      ? "text-amber-600"
                      : "text-slate-600";
              return (
                <div
                  key={tc._id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                      <span>TC: {tc?.test_case_number || "-"}</span>
                      <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                        {tc?.module_name || "Unassigned"}
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
            {renderCount < pageSlice.length && (
              <div className="col-span-full text-center text-xs text-slate-500 py-3">
                Rendering more…
              </div>
            )}
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
