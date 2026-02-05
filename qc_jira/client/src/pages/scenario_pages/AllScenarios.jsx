// // import React, { useEffect, useMemo, useState } from "react";
// // import { useParams, Link } from "react-router-dom";
// // import axios from "axios";
// // import {
// //   FaThList,
// //   FaThLarge,
// //   FaTh,
// //   FaSearch,
// //   FaEye,
// //   FaTrashAlt,
// //   FaArrowLeft,
// //   FaArrowRight,
// //   FaSort,
// // } from "react-icons/fa";
// // import globalBackendRoute from "../../config/Config";

// // const UNASSIGNED_ID = "__unassigned__";
// // const UNASSIGNED_NAME = "Unassigned";

// // /* ---------- Search utils (similar style to AllUsers) ---------- */
// // const STOP_WORDS = new Set([
// //   "a",
// //   "an",
// //   "the",
// //   "and",
// //   "or",
// //   "of",
// //   "in",
// //   "on",
// //   "at",
// //   "to",
// //   "for",
// //   "with",
// //   "by",
// //   "from",
// //   "is",
// //   "are",
// //   "was",
// //   "were",
// //   "be",
// //   "been",
// //   "being",
// //   "i",
// //   "you",
// //   "he",
// //   "she",
// //   "it",
// //   "we",
// //   "they",
// //   "me",
// //   "him",
// //   "her",
// //   "us",
// //   "them",
// //   "this",
// //   "that",
// //   "these",
// //   "those",
// //   "there",
// //   "here",
// //   "please",
// //   "pls",
// //   "plz",
// //   "show",
// //   "find",
// //   "search",
// //   "look",
// //   "list",
// //   "scenario",
// //   "scenarios",
// //   "module",
// //   "modules",
// //   "named",
// //   "called",
// // ]);

// // const norm = (s = "") =>
// //   String(s)
// //     .toLowerCase()
// //     .normalize("NFD")
// //     .replace(/[\u0300-\u036f]/g, "");

// // const tokenize = (raw) => {
// //   const trimmed = String(raw || "").trim();
// //   if (!trimmed) return [];
// //   return trimmed
// //     .split(/\s+/)
// //     .map(norm)
// //     .filter(Boolean)
// //     .filter((t) => !STOP_WORDS.has(t));
// // };

// // export default function AllScenarios() {
// //   const { projectId } = useParams();
// //   const [scenarios, setScenarios] = useState([]);
// //   const [view, setView] = useState("list");
// //   const [searchQuery, setSearchQuery] = useState(""); // raw input
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [itemsPerPage, setItemsPerPage] = useState(10);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [sortOrder, setSortOrder] = useState("asc");
// //   const [totalScenarios, setTotalScenarios] = useState(0);
// //   const [filteredScenarioCount, setFilteredScenarioCount] = useState(0);
// //   const [projectName, setProjectName] = useState(""); // used in header

// //   // Module filter (multi-module aware)
// //   const [selectedModuleId, setSelectedModuleId] = useState(null);

// //   // Fetch scenarios
// //   useEffect(() => {
// //     const fetchScenarios = async () => {
// //       try {
// //         const response = await axios.get(
// //           `${globalBackendRoute}/api/single-project/${projectId}/view-all-scenarios`,
// //         );
// //         const data = Array.isArray(response.data) ? response.data : [];
// //         setScenarios(data);
// //         setTotalScenarios(data.length);

// //         // If scenarios exist, try to derive project name from them
// //         if (data.length > 0 && !projectName) {
// //           const pn =
// //             data[0]?.project?.project_name ||
// //             data[0]?.project?.projectName ||
// //             "";
// //           if (pn) setProjectName(pn);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching scenarios:", error);
// //       }
// //     };
// //     fetchScenarios();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [projectId]);

// //   // Fetch project name independently (works even if 0 scenarios)
// //   useEffect(() => {
// //     const fetchProjectName = async () => {
// //       try {
// //         const res = await axios.get(
// //           `${globalBackendRoute}/api/single-project/${projectId}`,
// //         );
// //         const p = res.data;
// //         if (p) {
// //           const pn = p.projectName || p.project_name || p.name || p.title || "";
// //           if (pn) setProjectName(pn);
// //         }
// //       } catch (err) {
// //         console.error("Error fetching project for name:", err);
// //       }
// //     };
// //     fetchProjectName();
// //   }, [projectId]);

// //   // Helper: get module objects array from a scenario
// //   const getScenarioModules = (s) => {
// //     if (Array.isArray(s?.modules) && s.modules.length) {
// //       return s.modules
// //         .filter(Boolean)
// //         .map((m) =>
// //           typeof m === "object"
// //             ? { _id: m._id, name: m.name }
// //             : { _id: m, name: "" },
// //         )
// //         .filter((m) => m && m._id);
// //     }
// //     if (s?.module?._id || s?.module?.name) {
// //       return [{ _id: s.module._id, name: s.module.name }];
// //     }
// //     return [];
// //   };

// //   // Build module chips (+ counts)
// //   const modules = useMemo(() => {
// //     const counts = new Map();
// //     for (const s of scenarios) {
// //       const mods = getScenarioModules(s);
// //       if (mods.length === 0) {
// //         if (!counts.has(UNASSIGNED_ID)) {
// //           counts.set(UNASSIGNED_ID, {
// //             _id: UNASSIGNED_ID,
// //             name: UNASSIGNED_NAME,
// //             count: 0,
// //           });
// //         }
// //         counts.get(UNASSIGNED_ID).count += 1;
// //         continue;
// //       }
// //       const seen = new Set();
// //       for (const m of mods) {
// //         const id = String(m._id);
// //         if (seen.has(id)) continue;
// //         seen.add(id);
// //         if (!counts.has(id)) {
// //           counts.set(id, { _id: id, name: m.name || "", count: 0 });
// //         }
// //         counts.get(id).count += 1;
// //       }
// //     }
// //     return Array.from(counts.values()).sort((a, b) =>
// //       a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
// //     );
// //   }, [scenarios]);

// //   // Filter: module + smart search
// //   const filtered = useMemo(() => {
// //     const tokens = tokenize(searchQuery);
// //     return scenarios.filter((scenario) => {
// //       // Module filter
// //       if (selectedModuleId) {
// //         const mods = getScenarioModules(scenario);
// //         if (selectedModuleId === UNASSIGNED_ID) {
// //           if (mods.length !== 0) return false;
// //         } else {
// //           const ids = mods.map((m) => String(m._id));
// //           if (!ids.includes(String(selectedModuleId))) return false;
// //         }
// //       }

// //       // No search tokens (empty or only stop-words) → keep
// //       if (!tokens.length) return true;

// //       // Searchable haystack
// //       const hay = norm(
// //         [
// //           scenario.scenario_text || "",
// //           scenario.scenario_number || "",
// //           scenario?.createdBy?.name || "",
// //           scenario?.project?.project_name ||
// //             scenario?.project?.projectName ||
// //             "",
// //           getScenarioModules(scenario)
// //             .map((m) => m.name)
// //             .join(" "),
// //         ].join(" "),
// //       );

// //       return tokens.some((t) => hay.includes(t));
// //     });
// //   }, [scenarios, searchQuery, selectedModuleId]);

// //   // Keep filtered count and pages in sync
// //   useEffect(() => {
// //     setFilteredScenarioCount(filtered.length);
// //     const pages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
// //     setTotalPages(pages);
// //     setCurrentPage((p) => Math.min(p, pages));
// //   }, [filtered, itemsPerPage]);

// //   // Sort toggle (latest / oldest) using createdAt
// //   const handleSort = () => {
// //     const sorted = [...scenarios].sort((a, b) => {
// //       const dateA = new Date(a.createdAt);
// //       const dateB = new Date(b.createdAt);
// //       // When sortOrder is "asc", next state will be "desc" and we show latest first
// //       return sortOrder === "asc" ? dateB - dateA : dateA - dateB;
// //     });
// //     setScenarios(sorted);
// //     setSortOrder((s) => (s === "asc" ? "desc" : "asc"));
// //   };

// //   // Page-size dropdown
// //   const handlePageSizeChange = (e) => {
// //     const v = e.target.value;
// //     const next = v === "ALL" ? 1000000000 : Number(v);
// //     setItemsPerPage(next);
// //     setCurrentPage(1);
// //   };

// //   // Pagination slice
// //   const indexOfLast = currentPage * itemsPerPage;
// //   const indexOfFirst = indexOfLast - itemsPerPage;
// //   const current = filtered.slice(indexOfFirst, indexOfLast);

// //   const handlePageChange = (newPage) => setCurrentPage(newPage);

// //   const handleDelete = async (scenarioId) => {
// //     const confirmDelete = window.confirm(
// //       "Are you sure you want to delete this scenario? This will delete all its history as well.",
// //     );
// //     if (!confirmDelete) return;

// //     const token = localStorage.getItem("token");
// //     try {
// //       await axios.delete(
// //         `${globalBackendRoute}/api/single-project/scenario/${scenarioId}`,
// //         { headers: token ? { Authorization: `Bearer ${token}` } : {} },
// //       );
// //       alert("Scenario deleted successfully.");
// //       const updated = scenarios.filter((s) => s._id !== scenarioId);
// //       setScenarios(updated);
// //       setTotalScenarios(updated.length);
// //     } catch (error) {
// //       console.error("Error deleting scenario:", error);
// //       alert("Error deleting scenario");
// //     }
// //   };

// //   const onModuleClick = (id) => {
// //     setSelectedModuleId((prev) => (prev === id ? null : id));
// //     setCurrentPage(1);
// //   };

// //   const clearModuleSelection = () => {
// //     setSelectedModuleId(null);
// //     setCurrentPage(1);
// //   };

// //   const ModuleChips = ({ scenario, max = 3 }) => {
// //     const mods = getScenarioModules(scenario);
// //     if (!mods.length) {
// //       return (
// //         <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700">
// //           {UNASSIGNED_NAME}
// //         </span>
// //       );
// //     }
// //     const show = mods.slice(0, max);
// //     const extra = mods.length - show.length;
// //     return (
// //       <span className="flex flex-wrap gap-1">
// //         {show.map((m) => (
// //           <span
// //             key={m._id}
// //             className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700"
// //           >
// //             {m.name || m._id}
// //           </span>
// //         ))}
// //         {extra > 0 && (
// //           <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600">
// //             +{extra}
// //           </span>
// //         )}
// //       </span>
// //     );
// //   };

// //   return (
// //     <div className="bg-white py-10 sm:py-12">
// //       <div className="mx-auto container px-2 sm:px-3 lg:px-4">
// //         {/* Header / Controls */}
// //         <div className="flex justify-between items-center gap-3 flex-wrap">
// //           <div>
// //             <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
// //               All Scenarios for Project: {projectName || projectId}
// //             </h2>
// //             <p className="text-xs text-gray-600 mt-1">
// //               Total Scenarios: {totalScenarios}
// //             </p>
// //             {(searchQuery || selectedModuleId) && (
// //               <p className="text-xs text-gray-600">
// //                 Showing {filteredScenarioCount} result(s)
// //                 {searchQuery ? <> for “{searchQuery}”</> : null}
// //                 {selectedModuleId ? " in selected module" : null}
// //               </p>
// //             )}
// //           </div>

// //           <div className="flex items-center gap-3 flex-wrap">
// //             {/* View toggles */}
// //             <FaThList
// //               className={`text-lg cursor-pointer ${
// //                 view === "list" ? "text-blue-500" : "text-gray-500"
// //               }`}
// //               onClick={() => setView("list")}
// //               title="List view"
// //             />
// //             <FaThLarge
// //               className={`text-lg cursor-pointer ${
// //                 view === "card" ? "text-blue-500" : "text-gray-500"
// //               }`}
// //               onClick={() => setView("card")}
// //               title="Card view"
// //             />
// //             <FaTh
// //               className={`text-lg cursor-pointer ${
// //                 view === "grid" ? "text-blue-500" : "text-gray-500"
// //               }`}
// //               onClick={() => setView("grid")}
// //               title="Grid view"
// //             />

// //             {/* Sort toggle (latest / oldest) */}
// //             <FaSort
// //               className={`text-lg cursor-pointer ${
// //                 sortOrder === "desc" ? "text-indigo-600" : "text-gray-500"
// //               }`}
// //               onClick={handleSort}
// //               title={
// //                 sortOrder === "asc"
// //                   ? "Sort by Latest First"
// //                   : "Sort by Oldest First"
// //               }
// //             />

// //             {/* Search */}
// //             <div className="relative">
// //               <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
// //               <input
// //                 type="text"
// //                 className="pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none"
// //                 placeholder="Search scenarios, modules, project, user..."
// //                 value={searchQuery}
// //                 onChange={(e) => setSearchQuery(e.target.value)}
// //                 spellCheck={false}
// //               />
// //             </div>

// //             {/* Rows per page */}
// //             <div className="flex items-center gap-2">
// //               <label className="text-xs text-slate-600">Rows:</label>
// //               <select
// //                 value={
// //                   itemsPerPage >= 1000000000 ? "ALL" : String(itemsPerPage)
// //                 }
// //                 onChange={handlePageSizeChange}
// //                 className="px-2 py-1.5 text-sm border rounded-md focus:outline-none"
// //                 title="Rows per page"
// //               >
// //                 <option value="10">10</option>
// //                 <option value="20">20</option>
// //                 <option value="40">40</option>
// //                 <option value="60">60</option>
// //                 <option value="ALL">All</option>
// //               </select>
// //             </div>

// //             <Link
// //               to={`/single-project/${projectId}`}
// //               className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm"
// //             >
// //               Project Dashboard
// //             </Link>
// //           </div>
// //         </div>

// //         {/* Module chips row */}
// //         <div className="mt-4">
// //           <div className="flex items-center justify-between mb-2">
// //             <h3 className="text-xs font-semibold text-slate-700">
// //               Filter by Module
// //             </h3>
// //             <button
// //               onClick={clearModuleSelection}
// //               className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
// //             >
// //               Clear
// //             </button>
// //           </div>

// //           <div className="flex gap-2 overflow-x-auto pb-1">
// //             {modules.map((m) => {
// //               const active = selectedModuleId === m._id;
// //               return (
// //                 <button
// //                   key={m._id}
// //                   onClick={() => onModuleClick(m._id)}
// //                   className={`whitespace-nowrap px-3 py-1 rounded-full border text-[12px] ${
// //                     active
// //                       ? "bg-indigo-600 text-white border-indigo-600"
// //                       : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
// //                   }`}
// //                   title={`${m.name} (${m.count})`}
// //                 >
// //                   {m.name} <span className="opacity-70 ml-1">({m.count})</span>
// //                 </button>
// //               );
// //             })}
// //             {modules.length === 0 && (
// //               <span className="text-slate-500 text-sm">No modules found</span>
// //             )}
// //           </div>
// //         </div>

// //         {/* List View */}
// //         {view === "list" && (
// //           <div className="mt-5">
// //             <div className="grid grid-cols-[56px,120px,1fr,260px,160px,140px,40px,40px] items-center text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200">
// //               <div>#</div>
// //               <div>Scenario</div>
// //               <div>Text</div>
// //               <div>Modules</div>
// //               <div>Project</div>
// //               <div>Created By</div>
// //               <div className="text-center">View</div>
// //               <div className="text-center">Del</div>
// //             </div>

// //             <div className="divide-y divide-slate-200">
// //               {current.map((s, idx) => (
// //                 <div
// //                   key={s._id}
// //                   className="grid grid-cols-[56px,120px,1fr,260px,160px,140px,40px,40px] items-center text-[12px] px-3 py-2"
// //                 >
// //                   <div className="text-slate-700">{indexOfFirst + idx + 1}</div>
// //                   <div className="text-slate-900 font-medium truncate">
// //                     {s.scenario_number}
// //                   </div>
// //                   <div className="text-slate-700 line-clamp-2">
// //                     {s.scenario_text}
// //                   </div>
// //                   <div className="truncate">
// //                     <ModuleChips scenario={s} />
// //                   </div>
// //                   <div className="text-slate-700 truncate">
// //                     {s?.project?.project_name || s?.project?.projectName}
// //                   </div>
// //                   <div className="text-indigo-700 font-semibold truncate">
// //                     {s?.createdBy?.name}
// //                   </div>
// //                   <div className="flex justify-center">
// //                     <Link
// //                       to={`/single-project/${projectId}/scenario-history/${s._id}`}
// //                       className="text-indigo-600 hover:text-indigo-800"
// //                       title="View"
// //                     >
// //                       <FaEye className="text-sm" />
// //                     </Link>
// //                   </div>
// //                   <div className="flex justify-center">
// //                     <button
// //                       onClick={() => handleDelete(s._id)}
// //                       className="text-rose-600 hover:text-rose-800"
// //                       title="Delete"
// //                     >
// //                       <FaTrashAlt className="text-sm" />
// //                     </button>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         {/* Grid View */}
// //         {view === "grid" && (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-8">
// //             {current.map((s) => (
// //               <div
// //                 key={s._id}
// //                 className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
// //               >
// //                 <div>
// //                   <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
// //                     <span>Scenario: {s.scenario_number}</span>
// //                   </div>
// //                   <div className="mt-1">
// //                     <ModuleChips scenario={s} />
// //                   </div>
// //                   <div className="text-sm text-gray-600 break-words whitespace-normal mt-1">
// //                     {s.scenario_text}
// //                   </div>
// //                 </div>
// //                 <div className="mt-2 flex justify-between">
// //                   <Link
// //                     to={`/single-project/${projectId}/scenario-history/${s._id}`}
// //                     className="text-blue-500 hover:text-blue-700 text-sm"
// //                   >
// //                     <FaEye className="text-sm" />
// //                   </Link>
// //                   <button
// //                     onClick={() => handleDelete(s._id)}
// //                     className="text-rose-500 hover:text-rose-700 text-sm"
// //                   >
// //                     <FaTrashAlt className="text-sm" />
// //                   </button>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {/* Card View */}
// //         {view === "card" && (
// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
// //             {current.map((s) => (
// //               <div
// //                 key={s._id}
// //                 className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
// //               >
// //                 <div>
// //                   <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
// //                     <span>Scenario: {s.scenario_number}</span>
// //                   </div>
// //                   <div className="mt-1">
// //                     <ModuleChips scenario={s} />
// //                   </div>
// //                   <div className="text-sm text-gray-600 break-words whitespace-normal mt-1">
// //                     {s.scenario_text}
// //                   </div>
// //                 </div>
// //                 <div className="mt-2 flex justify-between">
// //                   <Link
// //                     to={`/single-project/${projectId}/scenario-history/${s._id}`}
// //                     className="text-blue-500 hover:text-blue-700 text-sm"
// //                   >
// //                     <FaEye className="text-sm" />
// //                   </Link>
// //                   <button
// //                     onClick={() => handleDelete(s._id)}
// //                     className="text-rose-500 hover:text-rose-700 text-sm"
// //                   >
// //                     <FaTrashAlt className="text-sm" />
// //                   </button>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {/* Pagination */}
// //         <div className="flex justify-center items-center gap-2 mt-8">
// //           <button
// //             className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
// //             disabled={currentPage === 1}
// //             onClick={() => handlePageChange(currentPage - 1)}
// //           >
// //             <FaArrowLeft className="text-lg" />
// //           </button>
// //           <span className="text-sm">
// //             Page {currentPage} of {totalPages}
// //           </span>
// //           <button
// //             className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
// //             disabled={currentPage === totalPages}
// //             onClick={() => handlePageChange(currentPage + 1)}
// //           >
// //             <FaArrowRight className="text-lg" />
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // till here original code

// import React, {
//   useCallback,
//   useDeferredValue,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   memo,
// } from "react";
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

// const UNASSIGNED_ID = "__unassigned__";
// const UNASSIGNED_NAME = "Unassigned";

// /* ---------- Search utils (similar style to AllUsers) ---------- */
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
//   "scenario",
//   "scenarios",
//   "module",
//   "modules",
//   "named",
//   "called",
// ]);

// const norm = (s = "") =>
//   String(s)
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "");

// const tokenize = (raw) => {
//   const trimmed = String(raw || "").trim();
//   if (!trimmed) return [];
//   return trimmed
//     .split(/\s+/)
//     .map(norm)
//     .filter(Boolean)
//     .filter((t) => !STOP_WORDS.has(t));
// };

// // yyyy-mm-dd in local time (for date filter input)
// const toLocalYMD = (d) => {
//   const dt = d instanceof Date ? d : new Date(d);
//   if (Number.isNaN(dt.getTime())) return "";
//   const y = dt.getFullYear();
//   const m = String(dt.getMonth() + 1).padStart(2, "0");
//   const day = String(dt.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// };

// export default function AllScenarios() {
//   const { projectId } = useParams();

//   const [scenarios, setScenarios] = useState([]);
//   const [view, setView] = useState("list");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedModuleId, setSelectedModuleId] = useState(null);

//   // ✅ Date filter (yyyy-mm-dd)
//   const [selectedDate, setSelectedDate] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(20); // ✅ default 20
//   const [totalPages, setTotalPages] = useState(1);
//   const [sortOrder, setSortOrder] = useState("asc"); // asc/desc toggle logic kept
//   const [totalScenarios, setTotalScenarios] = useState(0);
//   const [filteredScenarioCount, setFilteredScenarioCount] = useState(0);
//   const [projectName, setProjectName] = useState("");

//   // ✅ Column widths (dynamic / resizable like Excel feel)
//   // Matches old template: [56,120,1fr,260,160,140,40,40]
//   // We keep layout same, but make columns resizable with px widths and horizontal scroll when needed.
//   const [colW, setColW] = useState([56, 120, 520, 260, 160, 140, 40, 40]);
//   const dragRef = useRef(null);

//   const gridTemplateColumns = useMemo(
//     () => colW.map((w) => `${Math.max(32, Number(w) || 0)}px`).join(" "),
//     [colW],
//   );

//   const startColResize = useCallback(
//     (colIndex, e) => {
//       e.preventDefault();
//       e.stopPropagation();

//       const startX = e.clientX;
//       const startW = colW[colIndex] || 60;

//       dragRef.current = { colIndex, startX, startW };

//       const onMove = (ev) => {
//         if (!dragRef.current) return;
//         const dx = ev.clientX - dragRef.current.startX;
//         const next = Math.max(32, dragRef.current.startW + dx);
//         setColW((prev) => {
//           const cp = [...prev];
//           cp[colIndex] = next;
//           return cp;
//         });
//       };

//       const onUp = () => {
//         window.removeEventListener("mousemove", onMove);
//         window.removeEventListener("mouseup", onUp);
//         dragRef.current = null;
//       };

//       window.addEventListener("mousemove", onMove);
//       window.addEventListener("mouseup", onUp);
//     },
//     [colW],
//   );

//   // Helper: get module objects array from a scenario
//   const getScenarioModules = useCallback((s) => {
//     if (Array.isArray(s?.modules) && s.modules.length) {
//       return s.modules
//         .filter(Boolean)
//         .map((m) =>
//           typeof m === "object"
//             ? { _id: m._id, name: m.name }
//             : { _id: m, name: "" },
//         )
//         .filter((m) => m && m._id);
//     }
//     if (s?.module?._id || s?.module?.name) {
//       return [{ _id: s.module._id, name: s.module.name }];
//     }
//     return [];
//   }, []);

//   // Fetch scenarios (lazy: cancel if unmount / project changes)
//   useEffect(() => {
//     let alive = true;
//     const controller = new AbortController();

//     const fetchScenarios = async () => {
//       try {
//         const response = await axios.get(
//           `${globalBackendRoute}/api/single-project/${projectId}/view-all-scenarios`,
//           { signal: controller.signal },
//         );
//         if (!alive) return;
//         const data = Array.isArray(response.data) ? response.data : [];
//         setScenarios(data);
//         setTotalScenarios(data.length);

//         if (data.length > 0) {
//           const pn =
//             data[0]?.project?.project_name ||
//             data[0]?.project?.projectName ||
//             "";
//           if (pn) setProjectName((prev) => prev || pn);
//         }
//       } catch (error) {
//         if (!axios.isCancel?.(error)) {
//           console.error("Error fetching scenarios:", error);
//         }
//       }
//     };

//     fetchScenarios();

//     return () => {
//       alive = false;
//       controller.abort();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [projectId]);

//   // Fetch project name independently (works even if 0 scenarios)
//   useEffect(() => {
//     let alive = true;
//     const controller = new AbortController();

//     const fetchProjectName = async () => {
//       try {
//         const res = await axios.get(
//           `${globalBackendRoute}/api/single-project/${projectId}`,
//           { signal: controller.signal },
//         );
//         if (!alive) return;
//         const p = res.data;
//         if (p) {
//           const pn = p.projectName || p.project_name || p.name || p.title || "";
//           if (pn) setProjectName(pn);
//         }
//       } catch (err) {
//         if (!axios.isCancel?.(err)) {
//           console.error("Error fetching project for name:", err);
//         }
//       }
//     };

//     fetchProjectName();

//     return () => {
//       alive = false;
//       controller.abort();
//     };
//   }, [projectId]);

//   // ✅ Available dates ONLY where scenarios exist
//   const availableDates = useMemo(() => {
//     const set = new Set();
//     for (const s of scenarios) {
//       const ymd = toLocalYMD(s?.createdAt);
//       if (ymd) set.add(ymd);
//     }
//     return Array.from(set).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
//   }, [scenarios]);

//   const hasSelectedDate = Boolean(String(selectedDate || "").trim());
//   const isSelectedDateValid = useMemo(() => {
//     if (!hasSelectedDate) return true; // no filter
//     return availableDates.includes(selectedDate);
//   }, [availableDates, hasSelectedDate, selectedDate]);

//   // Build module chips (+ counts)
//   const modules = useMemo(() => {
//     const counts = new Map();
//     for (const s of scenarios) {
//       const mods = getScenarioModules(s);
//       if (mods.length === 0) {
//         if (!counts.has(UNASSIGNED_ID)) {
//           counts.set(UNASSIGNED_ID, {
//             _id: UNASSIGNED_ID,
//             name: UNASSIGNED_NAME,
//             count: 0,
//           });
//         }
//         counts.get(UNASSIGNED_ID).count += 1;
//         continue;
//       }
//       const seen = new Set();
//       for (const m of mods) {
//         const id = String(m._id);
//         if (seen.has(id)) continue;
//         seen.add(id);
//         if (!counts.has(id)) {
//           counts.set(id, { _id: id, name: m.name || "", count: 0 });
//         }
//         counts.get(id).count += 1;
//       }
//     }
//     return Array.from(counts.values()).sort((a, b) =>
//       a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
//     );
//   }, [scenarios, getScenarioModules]);

//   // ✅ Speed: defer heavy filtering while typing
//   const dq = useDeferredValue(searchQuery);
//   const dd = useDeferredValue(selectedDate);
//   const dm = useDeferredValue(selectedModuleId);

//   // Filter: module + date + smart search
//   const filtered = useMemo(() => {
//     // date invalid => show no rows (and show message)
//     if (dd && !availableDates.includes(dd)) return [];

//     const tokens = tokenize(dq);

//     return scenarios.filter((scenario) => {
//       // Date filter (local)
//       if (dd) {
//         const ymd = toLocalYMD(scenario?.createdAt);
//         if (ymd !== dd) return false;
//       }

//       // Module filter
//       if (dm) {
//         const mods = getScenarioModules(scenario);
//         if (dm === UNASSIGNED_ID) {
//           if (mods.length !== 0) return false;
//         } else {
//           const ids = mods.map((m) => String(m._id));
//           if (!ids.includes(String(dm))) return false;
//         }
//       }

//       // No search tokens (empty or only stop-words) → keep
//       if (!tokens.length) return true;

//       // Searchable haystack
//       const hay = norm(
//         [
//           scenario.scenario_text || "",
//           scenario.scenario_number || "",
//           scenario?.createdBy?.name || "",
//           scenario?.project?.project_name ||
//             scenario?.project?.projectName ||
//             "",
//           getScenarioModules(scenario)
//             .map((m) => m.name)
//             .join(" "),
//         ].join(" "),
//       );

//       // keep existing behavior: token ANY match
//       return tokens.some((t) => hay.includes(t));
//     });
//   }, [availableDates, dd, dq, dm, scenarios, getScenarioModules]);

//   // Keep filtered count and pages in sync
//   useEffect(() => {
//     setFilteredScenarioCount(filtered.length);
//     const pages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
//     setTotalPages(pages);
//     setCurrentPage((p) => Math.min(p, pages));
//   }, [filtered, itemsPerPage]);

//   // Sort toggle (latest / oldest) using createdAt (kept behavior)
//   const handleSort = useCallback(() => {
//     setScenarios((prev) => {
//       const sorted = [...prev].sort((a, b) => {
//         const dateA = new Date(a.createdAt);
//         const dateB = new Date(b.createdAt);
//         return sortOrder === "asc" ? dateB - dateA : dateA - dateB;
//       });
//       return sorted;
//     });
//     setSortOrder((s) => (s === "asc" ? "desc" : "asc"));
//   }, [sortOrder]);

//   // Page-size dropdown
//   const handlePageSizeChange = useCallback((e) => {
//     const v = e.target.value;
//     const next = v === "ALL" ? 1000000000 : Number(v);
//     setItemsPerPage(next);
//     setCurrentPage(1);
//   }, []);

//   // Pagination slice
//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const pageSlice = useMemo(
//     () => filtered.slice(indexOfFirst, indexOfLast),
//     [filtered, indexOfFirst, indexOfLast],
//   );

//   // ✅ Lazy render (progressively render current page for faster UI on very large pages like ALL)
//   const [renderCount, setRenderCount] = useState(60);
//   useEffect(() => {
//     // reset when page/filter changes
//     setRenderCount(60);
//   }, [currentPage, itemsPerPage, dq, dd, dm, view]);

//   useEffect(() => {
//     if (renderCount >= pageSlice.length) return;
//     const id = window.requestAnimationFrame(() => {
//       setRenderCount((c) => Math.min(pageSlice.length, c + 80));
//     });
//     return () => window.cancelAnimationFrame(id);
//   }, [renderCount, pageSlice.length]);

//   const current = useMemo(
//     () => pageSlice.slice(0, renderCount),
//     [pageSlice, renderCount],
//   );

//   const handlePageChange = useCallback(
//     (newPage) => setCurrentPage(newPage),
//     [],
//   );

//   const handleDelete = useCallback(async (scenarioId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this scenario? This will delete all its history as well.",
//     );
//     if (!confirmDelete) return;

//     const token = localStorage.getItem("token");
//     try {
//       await axios.delete(
//         `${globalBackendRoute}/api/single-project/scenario/${scenarioId}`,
//         { headers: token ? { Authorization: `Bearer ${token}` } : {} },
//       );
//       alert("Scenario deleted successfully.");
//       setScenarios((prev) => {
//         const updated = prev.filter((s) => s._id !== scenarioId);
//         setTotalScenarios(updated.length);
//         return updated;
//       });
//     } catch (error) {
//       console.error("Error deleting scenario:", error);
//       alert("Error deleting scenario");
//     }
//   }, []);

//   const onModuleClick = useCallback((id) => {
//     setSelectedModuleId((prev) => (prev === id ? null : id));
//     setCurrentPage(1);
//   }, []);

//   const clearModuleSelection = useCallback(() => {
//     setSelectedModuleId(null);
//     setCurrentPage(1);
//   }, []);

//   const clearDateSelection = useCallback(() => {
//     setSelectedDate("");
//     setCurrentPage(1);
//   }, []);

//   const ModuleChips = memo(function ModuleChips({ scenario, max = 3 }) {
//     const mods = getScenarioModules(scenario);
//     if (!mods.length) {
//       return (
//         <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700">
//           {UNASSIGNED_NAME}
//         </span>
//       );
//     }
//     const show = mods.slice(0, max);
//     const extra = mods.length - show.length;
//     return (
//       <span className="flex flex-wrap gap-1">
//         {show.map((m) => (
//           <span
//             key={m._id}
//             className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700"
//           >
//             {m.name || m._id}
//           </span>
//         ))}
//         {extra > 0 && (
//           <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600">
//             +{extra}
//           </span>
//         )}
//       </span>
//     );
//   });

//   const Resizer = ({ onMouseDown }) => (
//     <span
//       onMouseDown={onMouseDown}
//       className="absolute right-0 top-0 h-full w-2 cursor-col-resize select-none"
//       title="Drag to resize"
//     />
//   );

//   return (
//     <div className="bg-white py-10 sm:py-12">
//       <div className="mx-auto container px-2 sm:px-3 lg:px-4">
//         {/* Header / Controls */}
//         <div className="flex justify-between items-center gap-3 flex-wrap">
//           <div>
//             <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
//               All Scenarios for Project: {projectName || projectId}
//             </h2>
//             <p className="text-xs text-gray-600 mt-1">
//               Total Scenarios: {totalScenarios}
//             </p>

//             {(searchQuery || selectedModuleId || selectedDate) && (
//               <p className="text-xs text-gray-600">
//                 Showing {filteredScenarioCount} result(s)
//                 {searchQuery ? <> for “{searchQuery}”</> : null}
//                 {selectedModuleId ? " in selected module" : null}
//                 {selectedDate ? ` on ${selectedDate}` : null}
//               </p>
//             )}

//             {/* ✅ Date invalid message */}
//             {hasSelectedDate && !isSelectedDateValid && (
//               <p className="text-xs text-rose-600 mt-1">
//                 No scenarios were added on {selectedDate}.
//               </p>
//             )}
//           </div>

//           <div className="flex items-center gap-3 flex-wrap">
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

//             {/* Sort toggle (latest / oldest) */}
//             <FaSort
//               className={`text-lg cursor-pointer ${
//                 sortOrder === "desc" ? "text-indigo-600" : "text-gray-500"
//               }`}
//               onClick={handleSort}
//               title={
//                 sortOrder === "asc"
//                   ? "Sort by Latest First"
//                   : "Sort by Oldest First"
//               }
//             />

//             {/* Search */}
//             <div className="relative">
//               <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
//               <input
//                 type="text"
//                 className="pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none"
//                 placeholder="Search scenarios, modules, project, user..."
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 spellCheck={false}
//               />
//             </div>

//             {/* ✅ Date filter (shows only dates that exist, but user can still type any date) */}
//             <div className="flex items-center gap-2">
//               <input
//                 type="date"
//                 list="scenario-dates"
//                 className="px-2 py-1.5 text-sm border rounded-md focus:outline-none"
//                 value={selectedDate}
//                 onChange={(e) => {
//                   setSelectedDate(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 title="Filter by date"
//               />
//               <datalist id="scenario-dates">
//                 {availableDates.map((d) => (
//                   <option key={d} value={d} />
//                 ))}
//               </datalist>

//               <button
//                 onClick={clearDateSelection}
//                 className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
//                 title="Clear date"
//               >
//                 Clear
//               </button>
//             </div>

//             {/* Rows per page */}
//             <div className="flex items-center gap-2">
//               <label className="text-xs text-slate-600">Rows:</label>
//               <select
//                 value={
//                   itemsPerPage >= 1000000000 ? "ALL" : String(itemsPerPage)
//                 }
//                 onChange={handlePageSizeChange}
//                 className="px-2 py-1.5 text-sm border rounded-md focus:outline-none"
//                 title="Rows per page"
//               >
//                 <option value="10">10</option>
//                 <option value="20">20</option>
//                 <option value="40">40</option>
//                 <option value="60">60</option>
//                 <option value="ALL">All</option>
//               </select>
//             </div>

//             <Link
//               to={`/single-project/${projectId}`}
//               className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm"
//             >
//               Project Dashboard
//             </Link>
//           </div>
//         </div>

//         {/* Module chips row */}
//         <div className="mt-4">
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="text-xs font-semibold text-slate-700">
//               Filter by Module
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
//                   className={`whitespace-nowrap px-3 py-1 rounded-full border text-[12px] ${
//                     active
//                       ? "bg-indigo-600 text-white border-indigo-600"
//                       : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//                   }`}
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
//             {/* ✅ Horizontal scroll if user stretches columns */}
//             <div className="overflow-x-auto">
//               {/* Header row (resizable columns) */}
//               <div
//                 className="relative grid items-center text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200 min-w-max"
//                 style={{ gridTemplateColumns }}
//               >
//                 {[
//                   "#",
//                   "Scenario",
//                   "Text",
//                   "Modules",
//                   "Project",
//                   "Created By",
//                   "View",
//                   "Del",
//                 ].map((label, i) => (
//                   <div
//                     key={label}
//                     className={`relative ${i >= 6 ? "text-center" : ""} pr-2`}
//                   >
//                     <span>{label}</span>
//                     {/* resizer handle (except last col) */}
//                     {i < colW.length - 1 ? (
//                       <Resizer onMouseDown={(e) => startColResize(i, e)} />
//                     ) : null}
//                   </div>
//                 ))}
//               </div>

//               <div className="divide-y divide-slate-200 min-w-max">
//                 {current.map((s, idx) => (
//                   <div
//                     key={s._id}
//                     className="grid items-center text-[12px] px-3 py-2 resize-y overflow-hidden"
//                     style={{ gridTemplateColumns, minHeight: 42 }}
//                     title="Drag bottom edge to resize row"
//                   >
//                     <div className="text-slate-700">
//                       {indexOfFirst + idx + 1}
//                     </div>
//                     <div className="text-slate-900 font-medium truncate">
//                       {s.scenario_number}
//                     </div>
//                     <div className="text-slate-700 line-clamp-2">
//                       {s.scenario_text}
//                     </div>
//                     <div className="truncate">
//                       <ModuleChips scenario={s} />
//                     </div>
//                     <div className="text-slate-700 truncate">
//                       {s?.project?.project_name || s?.project?.projectName}
//                     </div>
//                     <div className="text-indigo-700 font-semibold truncate">
//                       {s?.createdBy?.name}
//                     </div>
//                     <div className="flex justify-center">
//                       <Link
//                         to={`/single-project/${projectId}/scenario-history/${s._id}`}
//                         className="text-indigo-600 hover:text-indigo-800"
//                         title="View"
//                       >
//                         <FaEye className="text-sm" />
//                       </Link>
//                     </div>
//                     <div className="flex justify-center">
//                       <button
//                         onClick={() => handleDelete(s._id)}
//                         className="text-rose-600 hover:text-rose-800"
//                         title="Delete"
//                       >
//                         <FaTrashAlt className="text-sm" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Optional: if we’re still lazily rendering within the page */}
//               {renderCount < pageSlice.length && (
//                 <div className="text-center text-xs text-slate-500 py-3">
//                   Rendering more…
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Grid View */}
//         {view === "grid" && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-8">
//             {current.map((s) => (
//               <div
//                 key={s._id}
//                 className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
//               >
//                 <div>
//                   <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
//                     <span>Scenario: {s.scenario_number}</span>
//                   </div>
//                   <div className="mt-1">
//                     <ModuleChips scenario={s} />
//                   </div>
//                   <div className="text-sm text-gray-600 break-words whitespace-normal mt-1">
//                     {s.scenario_text}
//                   </div>
//                 </div>
//                 <div className="mt-2 flex justify-between">
//                   <Link
//                     to={`/single-project/${projectId}/scenario-history/${s._id}`}
//                     className="text-blue-500 hover:text-blue-700 text-sm"
//                   >
//                     <FaEye className="text-sm" />
//                   </Link>
//                   <button
//                     onClick={() => handleDelete(s._id)}
//                     className="text-rose-500 hover:text-rose-700 text-sm"
//                   >
//                     <FaTrashAlt className="text-sm" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//             {renderCount < pageSlice.length && (
//               <div className="col-span-full text-center text-xs text-slate-500 py-3">
//                 Rendering more…
//               </div>
//             )}
//           </div>
//         )}

//         {/* Card View */}
//         {view === "card" && (
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
//             {current.map((s) => (
//               <div
//                 key={s._id}
//                 className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
//               >
//                 <div>
//                   <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
//                     <span>Scenario: {s.scenario_number}</span>
//                   </div>
//                   <div className="mt-1">
//                     <ModuleChips scenario={s} />
//                   </div>
//                   <div className="text-sm text-gray-600 break-words whitespace-normal mt-1">
//                     {s.scenario_text}
//                   </div>
//                 </div>
//                 <div className="mt-2 flex justify-between">
//                   <Link
//                     to={`/single-project/${projectId}/scenario-history/${s._id}`}
//                     className="text-blue-500 hover:text-blue-700 text-sm"
//                   >
//                     <FaEye className="text-sm" />
//                   </Link>
//                   <button
//                     onClick={() => handleDelete(s._id)}
//                     className="text-rose-500 hover:text-rose-700 text-sm"
//                   >
//                     <FaTrashAlt className="text-sm" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//             {renderCount < pageSlice.length && (
//               <div className="col-span-full text-center text-xs text-slate-500 py-3">
//                 Rendering more…
//               </div>
//             )}
//           </div>
//         )}

//         {/* Pagination */}
//         <div className="flex justify-center items-center gap-2 mt-8">
//           <button
//             className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
//             disabled={currentPage === 1}
//             onClick={() => handlePageChange(currentPage - 1)}
//           >
//             <FaArrowLeft className="text-lg" />
//           </button>
//           <span className="text-sm">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
//             disabled={currentPage === totalPages}
//             onClick={() => handlePageChange(currentPage + 1)}
//           >
//             <FaArrowRight className="text-lg" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
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

const UNASSIGNED_ID = "__unassigned__";
const UNASSIGNED_NAME = "Unassigned";

/* ---------- Search utils (similar style to AllUsers) ---------- */
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
  "scenario",
  "scenarios",
  "module",
  "modules",
  "named",
  "called",
]);

const norm = (s = "") =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const tokenize = (raw) => {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return [];
  return trimmed
    .split(/\s+/)
    .map(norm)
    .filter(Boolean)
    .filter((t) => !STOP_WORDS.has(t));
};

// yyyy-mm-dd in local time (for date filter input)
const toLocalYMD = (d) => {
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function AllScenarios() {
  const { projectId } = useParams();

  const [scenarios, setScenarios] = useState([]);
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  // ✅ Date filter (yyyy-mm-dd)
  const [selectedDate, setSelectedDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); // ✅ default 20
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc"); // asc/desc toggle logic kept
  const [totalScenarios, setTotalScenarios] = useState(0);
  const [filteredScenarioCount, setFilteredScenarioCount] = useState(0);
  const [projectName, setProjectName] = useState("");

  // ✅ Column widths (dynamic / resizable like Excel feel)
  const [colW, setColW] = useState([56, 120, 520, 260, 160, 140, 40, 40]);
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

  // Helper: get module objects array from a scenario
  const getScenarioModules = useCallback((s) => {
    if (Array.isArray(s?.modules) && s.modules.length) {
      return s.modules
        .filter(Boolean)
        .map((m) =>
          typeof m === "object"
            ? { _id: m._id, name: m.name }
            : { _id: m, name: "" },
        )
        .filter((m) => m && m._id);
    }
    if (s?.module?._id || s?.module?.name) {
      return [{ _id: s.module._id, name: s.module.name }];
    }
    return [];
  }, []);

  // Fetch scenarios (lazy: cancel if unmount / project changes)
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const fetchScenarios = async () => {
      try {
        const response = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}/view-all-scenarios`,
          { signal: controller.signal },
        );
        if (!alive) return;
        const data = Array.isArray(response.data) ? response.data : [];
        setScenarios(data);
        setTotalScenarios(data.length);

        if (data.length > 0) {
          const pn =
            data[0]?.project?.project_name ||
            data[0]?.project?.projectName ||
            "";
          if (pn) setProjectName((prev) => prev || pn);
        }
      } catch (error) {
        if (!axios.isCancel?.(error)) {
          console.error("Error fetching scenarios:", error);
        }
      }
    };

    fetchScenarios();

    return () => {
      alive = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // Fetch project name independently (works even if 0 scenarios)
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const fetchProjectName = async () => {
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}`,
          { signal: controller.signal },
        );
        if (!alive) return;
        const p = res.data;
        if (p) {
          const pn = p.projectName || p.project_name || p.name || p.title || "";
          if (pn) setProjectName(pn);
        }
      } catch (err) {
        if (!axios.isCancel?.(err)) {
          console.error("Error fetching project for name:", err);
        }
      }
    };

    fetchProjectName();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [projectId]);

  // ✅ Available dates ONLY where scenarios exist
  const availableDates = useMemo(() => {
    const set = new Set();
    for (const s of scenarios) {
      const ymd = toLocalYMD(s?.createdAt);
      if (ymd) set.add(ymd);
    }
    return Array.from(set).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }, [scenarios]);

  const hasSelectedDate = Boolean(String(selectedDate || "").trim());
  const isSelectedDateValid = useMemo(() => {
    if (!hasSelectedDate) return true;
    return availableDates.includes(selectedDate);
  }, [availableDates, hasSelectedDate, selectedDate]);

  // Build module chips (+ counts)
  const modules = useMemo(() => {
    const counts = new Map();
    for (const s of scenarios) {
      const mods = getScenarioModules(s);
      if (mods.length === 0) {
        if (!counts.has(UNASSIGNED_ID)) {
          counts.set(UNASSIGNED_ID, {
            _id: UNASSIGNED_ID,
            name: UNASSIGNED_NAME,
            count: 0,
          });
        }
        counts.get(UNASSIGNED_ID).count += 1;
        continue;
      }
      const seen = new Set();
      for (const m of mods) {
        const id = String(m._id);
        if (seen.has(id)) continue;
        seen.add(id);
        if (!counts.has(id)) {
          counts.set(id, { _id: id, name: m.name || "", count: 0 });
        }
        counts.get(id).count += 1;
      }
    }
    return Array.from(counts.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
  }, [scenarios, getScenarioModules]);

  // ✅ Speed: defer heavy filtering while typing
  const dq = useDeferredValue(searchQuery);
  const dd = useDeferredValue(selectedDate);
  const dm = useDeferredValue(selectedModuleId);

  // Filter: module + date + smart search
  const filtered = useMemo(() => {
    if (dd && !availableDates.includes(dd)) return [];

    const tokens = tokenize(dq);

    return scenarios.filter((scenario) => {
      if (dd) {
        const ymd = toLocalYMD(scenario?.createdAt);
        if (ymd !== dd) return false;
      }

      if (dm) {
        const mods = getScenarioModules(scenario);
        if (dm === UNASSIGNED_ID) {
          if (mods.length !== 0) return false;
        } else {
          const ids = mods.map((m) => String(m._id));
          if (!ids.includes(String(dm))) return false;
        }
      }

      if (!tokens.length) return true;

      const hay = norm(
        [
          scenario.scenario_text || "",
          scenario.scenario_number || "",
          scenario?.createdBy?.name || "",
          scenario?.project?.project_name ||
            scenario?.project?.projectName ||
            "",
          getScenarioModules(scenario)
            .map((m) => m.name)
            .join(" "),
        ].join(" "),
      );

      return tokens.some((t) => hay.includes(t));
    });
  }, [availableDates, dd, dq, dm, scenarios, getScenarioModules]);

  useEffect(() => {
    setFilteredScenarioCount(filtered.length);
    const pages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    setTotalPages(pages);
    setCurrentPage((p) => Math.min(p, pages));
  }, [filtered, itemsPerPage]);

  const handleSort = useCallback(() => {
    setScenarios((prev) => {
      const sorted = [...prev].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "asc" ? dateB - dateA : dateA - dateB;
      });
      return sorted;
    });
    setSortOrder((s) => (s === "asc" ? "desc" : "asc"));
  }, [sortOrder]);

  const handlePageSizeChange = useCallback((e) => {
    const v = e.target.value;
    const next = v === "ALL" ? 1000000000 : Number(v);
    setItemsPerPage(next);
    setCurrentPage(1);
  }, []);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const pageSlice = useMemo(
    () => filtered.slice(indexOfFirst, indexOfLast),
    [filtered, indexOfFirst, indexOfLast],
  );

  const [renderCount, setRenderCount] = useState(60);
  useEffect(() => {
    setRenderCount(60);
  }, [currentPage, itemsPerPage, dq, dd, dm, view]);

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

  const handlePageChange = useCallback(
    (newPage) => setCurrentPage(newPage),
    [],
  );

  const handleDelete = useCallback(async (scenarioId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this scenario? This will delete all its history as well.",
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `${globalBackendRoute}/api/single-project/scenario/${scenarioId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      );
      alert("Scenario deleted successfully.");
      setScenarios((prev) => {
        const updated = prev.filter((s) => s._id !== scenarioId);
        setTotalScenarios(updated.length);
        return updated;
      });
    } catch (error) {
      console.error("Error deleting scenario:", error);
      alert("Error deleting scenario");
    }
  }, []);

  const onModuleClick = useCallback((id) => {
    setSelectedModuleId((prev) => (prev === id ? null : id));
    setCurrentPage(1);
  }, []);

  const clearModuleSelection = useCallback(() => {
    setSelectedModuleId(null);
    setCurrentPage(1);
  }, []);

  const clearDateSelection = useCallback(() => {
    setSelectedDate("");
    setCurrentPage(1);
  }, []);

  const ModuleChips = memo(function ModuleChips({ scenario, max = 3 }) {
    const mods = getScenarioModules(scenario);
    if (!mods.length) {
      return (
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700">
          {UNASSIGNED_NAME}
        </span>
      );
    }
    const show = mods.slice(0, max);
    const extra = mods.length - show.length;
    return (
      <span className="flex flex-wrap gap-1">
        {show.map((m) => (
          <span
            key={m._id}
            className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700"
          >
            {m.name || m._id}
          </span>
        ))}
        {extra > 0 && (
          <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600">
            +{extra}
          </span>
        )}
      </span>
    );
  });

  const Resizer = ({ onMouseDown }) => (
    <span
      onMouseDown={onMouseDown}
      className="absolute right-0 top-0 h-full w-2 cursor-col-resize select-none"
      title="Drag to resize"
    />
  );

  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        {/* Header / Controls */}
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div>
            <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
              All Scenarios for Project: {projectName || projectId}
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Total Scenarios: {totalScenarios}
            </p>

            {(searchQuery || selectedModuleId || selectedDate) && (
              <p className="text-xs text-gray-600">
                Showing {filteredScenarioCount} result(s)
                {searchQuery ? <> for “{searchQuery}”</> : null}
                {selectedModuleId ? " in selected module" : null}
                {selectedDate ? ` on ${selectedDate}` : null}
              </p>
            )}

            {hasSelectedDate && !isSelectedDateValid && (
              <p className="text-xs text-rose-600 mt-1">
                No scenarios were added on {selectedDate}.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* View toggles */}
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

            {/* Sort toggle (latest / oldest) */}
            <FaSort
              className={`text-lg cursor-pointer ${
                sortOrder === "desc" ? "text-indigo-600" : "text-gray-500"
              }`}
              onClick={handleSort}
              title={
                sortOrder === "asc"
                  ? "Sort by Latest First"
                  : "Sort by Oldest First"
              }
            />

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                className="pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none"
                placeholder="Search scenarios, modules, project, user..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                spellCheck={false}
              />
            </div>

            {/* Date filter */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                list="scenario-dates"
                className="px-2 py-1.5 text-sm border rounded-md focus:outline-none"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
                title="Filter by date"
              />
              <datalist id="scenario-dates">
                {availableDates.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>

              <button
                onClick={clearDateSelection}
                className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
                title="Clear date"
              >
                Clear
              </button>
            </div>

            {/* Rows per page */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600">Rows:</label>
              <select
                value={
                  itemsPerPage >= 1000000000 ? "ALL" : String(itemsPerPage)
                }
                onChange={handlePageSizeChange}
                className="px-2 py-1.5 text-sm border rounded-md focus:outline-none"
                title="Rows per page"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="40">40</option>
                <option value="60">60</option>
                <option value="ALL">All</option>
              </select>
            </div>

            <Link
              to={`/single-project/${projectId}`}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm"
            >
              Project Dashboard
            </Link>
          </div>
        </div>

        {/* Module chips row */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-slate-700">
              Filter by Module
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
                  className={`whitespace-nowrap px-3 py-1 rounded-full border text-[12px] ${
                    active
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
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
              {/* Header row */}
              <div
                className="relative grid items-center text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200 min-w-max"
                style={{ gridTemplateColumns }}
              >
                {[
                  "#",
                  "Scenario",
                  "Text",
                  "Modules",
                  "Project",
                  "Created By",
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

              <div className="divide-y divide-slate-200 min-w-max">
                {current.map((s, idx) => (
                  <div
                    key={s._id}
                    className="grid items-start text-[12px] px-3 py-2 resize-y overflow-visible"
                    style={{ gridTemplateColumns, minHeight: 42 }}
                    title="Drag bottom edge to resize row"
                  >
                    <div className="text-slate-700">
                      {indexOfFirst + idx + 1}
                    </div>

                    {/* ✅ wrap */}
                    <div className="text-slate-900 font-medium whitespace-normal break-words leading-snug">
                      {s.scenario_number}
                    </div>

                    {/* ✅ wrap */}
                    <div className="text-slate-700 whitespace-normal break-words leading-snug">
                      {s.scenario_text}
                    </div>

                    {/* ✅ wrap: remove truncate so chips can wrap */}
                    <div className="whitespace-normal break-words">
                      <ModuleChips scenario={s} />
                    </div>

                    {/* ✅ wrap */}
                    <div className="text-slate-700 whitespace-normal break-words leading-snug">
                      {s?.project?.project_name || s?.project?.projectName}
                    </div>

                    {/* ✅ wrap */}
                    <div className="text-indigo-700 font-semibold whitespace-normal break-words leading-snug">
                      {s?.createdBy?.name}
                    </div>

                    <div className="flex justify-center pt-0.5">
                      <Link
                        to={`/single-project/${projectId}/scenario-history/${s._id}`}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="View"
                      >
                        <FaEye className="text-sm" />
                      </Link>
                    </div>

                    <div className="flex justify-center pt-0.5">
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-rose-600 hover:text-rose-800"
                        title="Delete"
                      >
                        <FaTrashAlt className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
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
            {current.map((s) => (
              <div
                key={s._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                    <span>Scenario: {s.scenario_number}</span>
                  </div>
                  <div className="mt-1">
                    <ModuleChips scenario={s} />
                  </div>
                  <div className="text-sm text-gray-600 break-words whitespace-normal mt-1">
                    {s.scenario_text}
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <Link
                    to={`/single-project/${projectId}/scenario-history/${s._id}`}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    <FaEye className="text-sm" />
                  </Link>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-rose-500 hover:text-rose-700 text-sm"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
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
            {current.map((s) => (
              <div
                key={s._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                    <span>Scenario: {s.scenario_number}</span>
                  </div>
                  <div className="mt-1">
                    <ModuleChips scenario={s} />
                  </div>
                  <div className="text-sm text-gray-600 break-words whitespace-normal mt-1">
                    {s.scenario_text}
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <Link
                    to={`/single-project/${projectId}/scenario-history/${s._id}`}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    <FaEye className="text-sm" />
                  </Link>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-rose-500 hover:text-rose-700 text-sm"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
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
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <FaArrowRight className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
