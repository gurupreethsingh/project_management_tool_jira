// // import React, { useEffect, useState } from "react";
// // import { useParams, Link } from "react-router-dom";
// // import axios from "axios";
// // import {
// //   FaThList,
// //   FaThLarge,
// //   FaSearch,
// //   FaArrowLeft,
// //   FaArrowRight,
// // } from "react-icons/fa";
// // import globalBackendRoute from "../../config/Config";

// // const DeveloperAssignedDefects = () => {
// //   const { projectId } = useParams();
// //   const [defects, setDefects] = useState([]);
// //   const [view, setView] = useState("list"); // Toggle between list and card view
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [filteredDefects, setFilteredDefects] = useState([]);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [cardsPerPage, setCardsPerPage] = useState(6);

// //   // Count states for status types
// //   const [statusCounts, setStatusCounts] = useState({
// //     open: 0,
// //     fixed: 0,
// //     pending: 0,
// //     reopened: 0,
// //     unableToFix: 0,
// //   });

// //   useEffect(() => {
// //     fetchAssignedDefects();
// //     adjustCardsPerPage();
// //     window.addEventListener("resize", adjustCardsPerPage);

// //     return () => {
// //       window.removeEventListener("resize", adjustCardsPerPage);
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [projectId, view]);

// //   const fetchAssignedDefects = async () => {
// //     try {
// //       // Fetch the logged-in user from localStorage
// //       const loggedInUser = JSON.parse(localStorage.getItem("user"));

// //       if (!loggedInUser || !loggedInUser.id) {
// //         console.error("No logged-in user found in localStorage.");
// //         return;
// //       }

// //       // Fetch defects assigned to the logged-in developer
// //       const response = await axios.get(
// //         `${globalBackendRoute}/api/single-project/${projectId}/developer/${loggedInUser.id}/view-assigned-defects`
// //       );

// //       const defectsData = response.data;
// //       setDefects(defectsData);
// //       setFilteredDefects(defectsData);
// //       setTotalPages(Math.ceil(defectsData.length / cardsPerPage));

// //       // Calculate status counts
// //       const nextStatusCounts = {
// //         open: defectsData.filter((d) => d.status === "Open/New").length,
// //         fixed: defectsData.filter((d) => d.status === "Fixed").length,
// //         pending: defectsData.filter((d) => d.status === "Pending").length,
// //         reopened: defectsData.filter((d) => d.status === "Re-opened").length,
// //         unableToFix: defectsData.filter((d) => d.status === "Unable-To-Fix")
// //           .length,
// //       };
// //       setStatusCounts(nextStatusCounts);
// //     } catch (error) {
// //       console.error("Error fetching assigned defects:", error.message);
// //     }
// //   };

// //   const adjustCardsPerPage = () => {
// //     const width = window.innerWidth;

// //     if (view === "card") {
// //       if (width >= 1920) setCardsPerPage(6);
// //       else if (width >= 1366) setCardsPerPage(6);
// //       else setCardsPerPage(4);
// //     } else if (view === "list") {
// //       setCardsPerPage(6);
// //     }
// //   };

// //   const getNumberOfColumns = (viewType) => {
// //     const width = window.innerWidth;
// //     if (viewType === "grid" || viewType === "card") {
// //       if (width >= 1920) return "grid-cols-3";
// //       if (width >= 1366) return "grid-cols-2";
// //       return "grid-cols-1";
// //     }
// //   };

// //   useEffect(() => {
// //     // Make search case-insensitive and search through multiple fields
// //     const searchFilteredDefects = defects.filter((item) =>
// //       [
// //         item.defectId?.toString(),
// //         item.defectBugId?.toString(),
// //         item.expectedResult,
// //         item.moduleName,
// //         item.assignedBy,
// //       ]
// //         .filter(Boolean)
// //         .some((field) =>
// //           field.toLowerCase().includes(searchQuery.toLowerCase())
// //         )
// //     );

// //     setFilteredDefects(searchFilteredDefects);
// //     setTotalPages(Math.ceil(searchFilteredDefects.length / cardsPerPage));
// //   }, [searchQuery, defects, cardsPerPage]);

// //   const handlePageChange = (newPage) => {
// //     setCurrentPage(newPage);
// //   };

// //   const renderGridOrCardView = (viewType) => {
// //     const columnClass = getNumberOfColumns(viewType);

// //     return (
// //       <div className={`grid ${columnClass} gap-4 mt-10`}>
// //         {filteredDefects
// //           .slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)
// //           .map((defect, index) => (
// //             <div
// //               key={index}
// //               className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
// //             >
// //               <div>
// //                 <div className="text-sm font-semibold text-gray-600">
// //                   SL No: {defect.defectBugId}
// //                 </div>
// //                 <div className="text-sm text-gray-600">
// //                   Defect Number: {defect.defectNumber}
// //                 </div>
// //                 <div className="text-sm text-gray-600">
// //                   Expected Result: {defect.expectedResult}
// //                 </div>
// //                 <div className="text-sm text-gray-600">
// //                   Module Name: {defect.moduleName}
// //                 </div>
// //                 <div className="text-sm text-gray-600">
// //                   Assigned By: {defect.assignedBy}
// //                 </div>
// //                 <div className="text-sm text-gray-600">
// //                   Status:{" "}
// //                   {defect.status === "Fail" ? (
// //                     <span className="text-red-500">{defect.status}</span>
// //                   ) : (
// //                     <span className="text-green-500">{defect.status}</span>
// //                   )}
// //                 </div>
// //               </div>
// //               <Link
// //                 to={`/single-project/${defect.projectId}/defect/${defect.defectId}`}
// //                 className="text-blue-500 mt-2 inline-block"
// //               >
// //                 View Defect Details
// //               </Link>
// //             </div>
// //           ))}
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="bg-white py-16 sm:py-20">
// //       <div className="mx-auto max-w-7xl px-6 lg:px-8">
// //         <div className="flex justify-between items-center flex-wrap">
// //           <div>
// //             <h2 className="text-left font-semibold tracking-tight text-indigo-600 sm:text-1xl">
// //               Developer&apos;s Assigned Defects for Project: {projectId}
// //             </h2>
// //           </div>
// //           <div className="flex items-center space-x-4 flex-wrap">
// //             <FaThList
// //               className={`text-xl cursor-pointer ${
// //                 view === "list" ? "text-blue-400" : "text-gray-500"
// //               }`}
// //               onClick={() => setView("list")}
// //             />
// //             <FaThLarge
// //               className={`text-xl cursor-pointer ${
// //                 view === "card" ? "text-blue-400" : "text-gray-500"
// //               }`}
// //               onClick={() => setView("card")}
// //             />
// //             <div className="relative">
// //               <FaSearch className="absolute left-3 top-3 text-gray-400" />
// //               <input
// //                 type="text"
// //                 className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
// //                 placeholder="Search..."
// //                 value={searchQuery}
// //                 onChange={(e) => setSearchQuery(e.target.value)}
// //               />
// //             </div>
// //             <div>
// //               <Link
// //                 to={`/single-project/${projectId}`}
// //                 className="bg-indigo-700 text-white px-3 py-1 rounded-md hover:bg-indigo-900"
// //               >
// //                 Project Dashboard
// //               </Link>
// //             </div>
// //           </div>
// //         </div>

// //         {view === "list" ? (
// //           <div className="mt-10 space-y-6">
// //             {filteredDefects
// //               .slice(
// //                 (currentPage - 1) * cardsPerPage,
// //                 currentPage * cardsPerPage
// //               )
// //               .map((defect, index) => (
// //                 <div
// //                   key={index}
// //                   className="flex items-center justify-between bg-white rounded-lg shadow p-4"
// //                 >
// //                   <div className="flex flex-1 space-x-4">
// //                     <div className="flex flex-col w-1/12 border-r pr-2">
// //                       <span className="text-sm font-semibold text-gray-600">
// //                         Sl No
// //                       </span>
// //                       <span className="text-sm text-gray-900">{index + 1}</span>
// //                     </div>
// //                     <div className="flex flex-col w-1/12 border-r pr-2">
// //                       <span className="text-sm font-semibold text-gray-600">
// //                         Module Name
// //                       </span>
// //                       <span className="text-sm text-gray-900">
// //                         {defect.moduleName}
// //                       </span>
// //                     </div>
// //                     <div className="flex flex-col w-4/12 border-r pr-2">
// //                       <span className="text-sm font-semibold text-gray-600">
// //                         Defect Number
// //                       </span>
// //                       <span className="text-sm text-gray-900">
// //                         {defect.defectBugId}
// //                       </span>
// //                     </div>
// //                     <div className="flex flex-col w-4/12 border-r pr-2">
// //                       <span className="text-sm font-semibold text-gray-600">
// //                         Expected Result
// //                       </span>
// //                       <span className="text-sm text-gray-900">
// //                         {defect.expectedResult}
// //                       </span>
// //                     </div>

// //                     <div className="flex flex-col w-4/12 border-r pr-2">
// //                       <span className="text-sm font-semibold text-gray-600">
// //                         Assigned By
// //                       </span>
// //                       <span className="text-sm text-gray-900">
// //                         {defect.assignedBy}
// //                       </span>
// //                     </div>
// //                   </div>
// //                   <Link
// //                     to={`/single-project/${defect.projectId}/defect/${defect.defectId}`}
// //                     className="text-white btn btn-sm bg-indigo-700 hover:bg-indigo-900"
// //                   >
// //                     View Defect Details
// //                   </Link>
// //                 </div>
// //               ))}
// //           </div>
// //         ) : (
// //           renderGridOrCardView(view)
// //         )}

// //         <div className="flex justify-center items-center space-x-2 mt-10">
// //           <button
// //             className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
// //             disabled={currentPage === 1}
// //             onClick={() => handlePageChange(currentPage - 1)}
// //           >
// //             <FaArrowLeft className="text-xl" />
// //           </button>
// //           <span>
// //             Page {currentPage} of {totalPages}
// //           </span>
// //           <button
// //             className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
// //             disabled={currentPage === totalPages}
// //             onClick={() => handlePageChange(currentPage + 1)}
// //           >
// //             <FaArrowRight className="text-xl" />
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DeveloperAssignedDefects;

// // old code.

// // src/pages/defect_pages/DeveloperAssignedDefects.jsx

// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import {
//   FaSearch,
//   FaArrowLeft,
//   FaArrowRight,
//   FaSortAmountDownAlt,
//   FaSortAmountUpAlt,
//   FaSync,
//   FaEye,
// } from "react-icons/fa";
// import globalBackendRoute from "../../config/Config";

// const cls = (...a) => a.filter(Boolean).join(" ");

// /* ---------- Search utils ---------- */
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
//   "named",
//   "called",
//   "bug",
//   "bugs",
//   "defect",
//   "defects",
//   "issue",
//   "issues",
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

// /* ---------- Color maps ---------- */
// const priorityColors = {
//   low: "bg-emerald-100 text-emerald-700 border-emerald-300",
//   medium: "bg-amber-100 text-amber-700 border-amber-300",
//   high: "bg-rose-100 text-rose-700 border-rose-300",
// };

// const severityColors = {
//   minor: "bg-sky-100 text-sky-700 border-sky-300",
//   major: "bg-orange-100 text-orange-700 border-orange-300",
//   critical: "bg-red-100 text-red-700 border-red-300",
//   blocker: "bg-slate-300 text-slate-800 border-slate-400",
// };

// const statusColors = {
//   "Open/New": "bg-rose-100 text-rose-700 border-rose-300",
//   Assigned: "bg-amber-100 text-amber-700 border-amber-300",
//   "In-progress": "bg-blue-100 text-blue-700 border-blue-300",
//   "In-Progress": "bg-blue-100 text-blue-700 border-blue-300",
//   Fixed: "bg-emerald-100 text-emerald-700 border-emerald-300",
//   "Re-opened": "bg-purple-100 text-purple-700 border-purple-300",
//   Reopened: "bg-purple-100 text-purple-700 border-purple-300",
//   Closed: "bg-slate-200 text-slate-800 border-slate-300",
//   Pending: "bg-amber-50 text-amber-700 border-amber-200",
//   "Unable-To-Fix": "bg-slate-100 text-slate-700 border-slate-200",
//   "Unable-To-fix": "bg-slate-100 text-slate-700 border-slate-200",
// };

// const getStatusBadge = (status) =>
//   statusColors[status] || "bg-slate-100 text-slate-700 border-slate-200";

// /* ---------- Priority / Severity helpers ---------- */
// const getPriorityValue = (d) =>
//   d.priority || d.defectPriority || d.bug_priority || d.defect_priority || "";

// const getSeverityValue = (d) =>
//   d.severity || d.defectSeverity || d.bug_severity || d.defect_severity || "";

// /* ---------- Role abbreviation + label helpers ---------- */
// const ROLE_ABBREV = {
//   superadmin: "SA",
//   "super-admin": "SA",
//   admin: "AD",
//   project_manager: "PM",
//   "project-manager": "PM",
//   pm: "PM",
//   qa_lead: "QAL",
//   "qa-lead": "QAL",
//   qalead: "QAL",
//   test_engineer: "TE",
//   "test-engineer": "TE",
//   tester: "TE",
//   developer: "DEV",
//   dev: "DEV",
//   frontend_developer: "FE",
//   backend_developer: "BE",
//   fullstack_developer: "FS",
//   client: "CL",
//   user: "USR",
// };

// const looksLikeObjectId = (v) =>
//   typeof v === "string" && /^[a-fA-F0-9]{24}$/.test(v);

// const formatUserLabel = (userLike) => {
//   if (!userLike) return "—";

//   if (typeof userLike === "string") {
//     if (looksLikeObjectId(userLike)) return "—";
//     return userLike;
//   }

//   const name =
//     userLike.fullName ||
//     userLike.name ||
//     `${userLike.firstName || ""} ${userLike.lastName || ""}`.trim() ||
//     userLike.username ||
//     userLike.email ||
//     "";

//   const roleKey = (
//     userLike.role ||
//     userLike.user_role ||
//     userLike.userRole ||
//     ""
//   )
//     .toString()
//     .toLowerCase();

//   const abbrev = ROLE_ABBREV[roleKey];

//   if (name && abbrev) return `${name} (${abbrev})`;
//   if (name) return name;
//   if (abbrev) return abbrev;

//   return "—";
// };

// const extractAssignedUserObject = (d) =>
//   d.assignedToUser ||
//   d.assigned_to_user ||
//   d.assignedByUser ||
//   d.assigned_by_user ||
//   d.assignedUser ||
//   d.assigned_user ||
//   d.assignedPerson ||
//   d.assigned_person ||
//   d.assignedByDetails ||
//   d.assigned_by_details ||
//   null;

// const getAssignedPersonLabel = (d) => {
//   const obj = extractAssignedUserObject(d);
//   if (obj) return formatUserLabel(obj);

//   if (d.assignedToName) return formatUserLabel(d.assignedToName);
//   if (d.assigned_by_name) return formatUserLabel(d.assigned_by_name);
//   if (d.assignedByName) return formatUserLabel(d.assignedByName);

//   if (d.assignedTo && !looksLikeObjectId(d.assignedTo))
//     return formatUserLabel(d.assignedTo);
//   if (d.assigned_to && !looksLikeObjectId(d.assigned_to))
//     return formatUserLabel(d.assigned_to);
//   if (d.assignedBy && !looksLikeObjectId(d.assignedBy))
//     return formatUserLabel(d.assignedBy);
//   if (d.assigned_by && !looksLikeObjectId(d.assigned_by))
//     return formatUserLabel(d.assigned_by);

//   return "—";
// };

// /* =================================================================== */

// const DeveloperAssignedDefects = () => {
//   const { projectId } = useParams();

//   const [projectName, setProjectName] = useState("");
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadErr, setLoadErr] = useState("");

//   const [sortOrder, setSortOrder] = useState("desc");
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [priorityFilter, setPriorityFilter] = useState("");
//   const [severityFilter, setSeverityFilter] = useState("");

//   const [statusCounts, setStatusCounts] = useState({
//     openNew: 0,
//     assigned: 0,
//     inProgress: 0,
//     fixed: 0,
//     reopened: 0,
//     closed: 0,
//     pending: 0,
//     unableToFix: 0,
//   });

//   const token =
//     localStorage.getItem("userToken") || localStorage.getItem("token") || "";
//   const authHeader = useMemo(
//     () => (token ? { Authorization: `Bearer ${token}` } : undefined),
//     [token]
//   );

//   /* ---------- Fetch assigned defects ---------- */
//   const fetchAll = async () => {
//     try {
//       setLoading(true);
//       setLoadErr("");

//       const loggedInUser = JSON.parse(localStorage.getItem("user"));
//       if (!loggedInUser || !loggedInUser.id) {
//         setLoadErr("No logged-in user found.");
//         setRows([]);
//         return;
//       }

//       const url = `${globalBackendRoute}/api/single-project/${projectId}/developer/${loggedInUser.id}/view-assigned-defects`;
//       const res = await axios.get(url, { headers: authHeader });

//       const arr = Array.isArray(res.data)
//         ? res.data
//         : Array.isArray(res.data?.defects)
//         ? res.data.defects
//         : [];

//       // Debug (optional)
//       // console.log("Assigned defects API response:", res.data);
//       // console.log("Parsed rows:", arr);

//       setRows(arr);

//       if (arr.length) {
//         const d = arr[0];
//         const pName =
//           d.projectName ||
//           d.project_name ||
//           d.project_title ||
//           d.projectTitle ||
//           d.project?.project_name ||
//           "";
//         setProjectName(pName || `Project ${projectId}`);
//       } else {
//         setProjectName(`Project ${projectId}`);
//       }

//       const sc = {
//         openNew: 0,
//         assigned: 0,
//         inProgress: 0,
//         fixed: 0,
//         reopened: 0,
//         closed: 0,
//         pending: 0,
//         unableToFix: 0,
//       };

//       for (const d of arr) {
//         const s = (d.status || "").trim();
//         if (s === "Open/New" || s === "Open" || s === "New") sc.openNew += 1;
//         else if (s === "Assigned") sc.assigned += 1;
//         else if (s === "In-progress" || s === "In-Progress") sc.inProgress += 1;
//         else if (s === "Fixed") sc.fixed += 1;
//         else if (s === "Re-opened" || s === "Reopened") sc.reopened += 1;
//         else if (s === "Closed") sc.closed += 1;
//         else if (s === "Pending") sc.pending += 1;
//         else if (s === "Unable-To-Fix" || s === "Unable-To-fix")
//           sc.unableToFix += 1;
//       }

//       setStatusCounts(sc);
//     } catch (e) {
//       console.error("Assigned defects load error:", e?.response || e);
//       setLoadErr(
//         e?.response?.data?.message ||
//           "Failed to load assigned defects. Please try again."
//       );
//       setRows([]);
//       setStatusCounts({
//         openNew: 0,
//         assigned: 0,
//         inProgress: 0,
//         fixed: 0,
//         reopened: 0,
//         closed: 0,
//         pending: 0,
//         unableToFix: 0,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAll();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [projectId]);

//   /* ---------- Filter + Search + Sort ---------- */
//   const filtered = useMemo(() => {
//     const tokens = tokenize(search);
//     let out = rows.slice();

//     if (statusFilter) {
//       out = out.filter((d) => (d.status || "") === statusFilter);
//     }

//     if (priorityFilter) {
//       const want = priorityFilter.toLowerCase();
//       out = out.filter((d) => getPriorityValue(d).toLowerCase() === want);
//     }

//     if (severityFilter) {
//       const want = severityFilter.toLowerCase();
//       out = out.filter((d) => getSeverityValue(d).toLowerCase() === want);
//     }

//     if (tokens.length) {
//       out = out.filter((d) => {
//         const hay = norm(
//           [
//             d.defectBugId,
//             d.defectNumber,
//             d.defectId,
//             d.bugId,
//             d.bug_id,
//             d.moduleName,
//             d.module_name,
//             d.expectedResult,
//             d.expected_result,
//             d.actualResult,
//             d.status,
//             getPriorityValue(d),
//             getSeverityValue(d),
//             getAssignedPersonLabel(d),
//           ]
//             .filter(Boolean)
//             .join(" ")
//         );
//         return tokens.every((t) => hay.includes(t));
//       });
//     }

//     out.sort((a, b) => {
//       const aTs = a.createdAt ? new Date(a.createdAt).getTime() : 0;
//       const bTs = b.createdAt ? new Date(b.createdAt).getTime() : 0;
//       const delta = bTs - aTs;
//       return sortOrder === "desc" ? delta : -delta;
//     });

//     return out;
//   }, [rows, search, statusFilter, priorityFilter, severityFilter, sortOrder]);

//   /* ---------- Pagination ---------- */
//   const totalPages = Math.max(
//     1,
//     Math.ceil((filtered.length || 1) / (pageSize || 10))
//   );
//   const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

//   useEffect(() => {
//     setPage((p) => Math.min(p, totalPages));
//   }, [totalPages]);

//   /* ---------- Helpers ---------- */
//   const toggleStatus = (val) =>
//     setStatusFilter((prev) => (prev === val ? "" : val));
//   const togglePriority = (val) =>
//     setPriorityFilter((prev) => (prev === val ? "" : val));
//   const toggleSeverity = (val) =>
//     setSeverityFilter((prev) => (prev === val ? "" : val));

//   const clearAllFilters = () => {
//     setStatusFilter("");
//     setPriorityFilter("");
//     setSeverityFilter("");
//     setSearch("");
//     setPage(1);
//   };

//   /* ---------- UI ---------- */
//   return (
//     <div className="bg-white py-6 sm:py-8 text-[13px]">
//       <div className="mx-auto container px-2 sm:px-3 lg:px-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between gap-2 flex-wrap">
//           <div className="min-w-[220px]">
//             <h2 className="font-semibold tracking-tight text-indigo-600 text-[16px]">
//               My Assigned Defects — {projectName || `Project ${projectId}`}
//             </h2>
//             <div className="text-[11px] text-gray-600">
//               {loading
//                 ? "Loading…"
//                 : `Total Assigned: ${rows.length} | Showing: ${filtered.length}`}
//             </div>

//             {/* Quick summary badges */}
//             <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-slate-700">
//               <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200">
//                 Open/New: {statusCounts.openNew}
//               </span>
//               <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">
//                 Assigned: {statusCounts.assigned}
//               </span>
//               <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
//                 In-progress: {statusCounts.inProgress}
//               </span>
//               <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
//                 Fixed: {statusCounts.fixed}
//               </span>
//               <span className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200">
//                 Re-opened: {statusCounts.reopened}
//               </span>
//               <span className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200">
//                 Closed: {statusCounts.closed}
//               </span>
//             </div>
//           </div>

//           {/* Right-side controls */}
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

//             {/* Search */}
//             <div className="relative">
//               <FaSearch className="absolute left-2 top-2.5 text-gray-400" />
//               <input
//                 className="pl-7 pr-2 py-1.5 border rounded-md w-[230px]"
//                 placeholder="Search (ID, module, status, assigned…)"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//               />
//             </div>

//             {/* Rows per page */}
//             <div className="flex items-center gap-1">
//               <span className="text-[11px] text-slate-600">Rows</span>
//               <select
//                 value={pageSize}
//                 onChange={(e) => {
//                   setPageSize(Number(e.target.value));
//                   setPage(1);
//                 }}
//                 className="px-2 py-1.5 border rounded-md"
//               >
//                 {[5, 10, 20, 40, 60].map((n) => (
//                   <option key={n} value={n}>
//                     {n}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Refresh */}
//             <button
//               onClick={fetchAll}
//               className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
//               title="Refresh assigned defects"
//             >
//               <FaSync />
//               <span className="hidden sm:inline text-[11px]">Refresh</span>
//             </button>

//             {/* Navigation */}
//             <Link
//               to={`/single-project/${projectId}/all-defects`}
//               className="px-3 py-1.5 bg-slate-50 border rounded-md hover:bg-slate-100 text-[11px]"
//             >
//               All Defects
//             </Link>
//             <Link
//               to={`/single-project/${projectId}`}
//               className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-[11px]"
//             >
//               Project Dashboard
//             </Link>
//           </div>
//         </div>

//         {/* Quick Filters */}
//         <div className="mt-3 space-y-2">
//           <div className="flex items-center justify-between">
//             <h3 className="text-xs font-semibold text-slate-700">
//               Quick Filters
//             </h3>
//             <button
//               onClick={clearAllFilters}
//               className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
//             >
//               Clear All Filters
//             </button>
//           </div>

//           {/* Status chips */}
//           <div className="flex gap-2 overflow-x-auto pb-1 text-[11px]">
//             <button
//               onClick={() => {
//                 toggleStatus("Open/New");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 statusFilter === "Open/New"
//                   ? "bg-rose-500 text-white border-rose-500"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               Open/New ({statusCounts.openNew})
//             </button>
//             <button
//               onClick={() => {
//                 toggleStatus("Assigned");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 statusFilter === "Assigned"
//                   ? "bg-amber-500 text-white border-amber-500"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               Assigned ({statusCounts.assigned})
//             </button>
//             <button
//               onClick={() => {
//                 toggleStatus("In-progress");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 statusFilter === "In-progress"
//                   ? "bg-blue-500 text-white border-blue-500"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               In-progress ({statusCounts.inProgress})
//             </button>
//             <button
//               onClick={() => {
//                 toggleStatus("Fixed");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 statusFilter === "Fixed"
//                   ? "bg-emerald-500 text-white border-emerald-500"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               Fixed ({statusCounts.fixed})
//             </button>
//             <button
//               onClick={() => {
//                 toggleStatus("Re-opened");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 statusFilter === "Re-opened"
//                   ? "bg-purple-500 text-white border-purple-500"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               Re-opened ({statusCounts.reopened})
//             </button>
//             <button
//               onClick={() => {
//                 toggleStatus("Closed");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 statusFilter === "Closed"
//                   ? "bg-slate-600 text-white border-slate-600"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               Closed ({statusCounts.closed})
//             </button>
//             <button
//               onClick={() => {
//                 setStatusFilter("");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 !statusFilter
//                   ? "bg-indigo-600 text-white border-indigo-600"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               All Statuses
//             </button>
//           </div>

//           {/* Priority & Severity chips */}
//           <div className="flex gap-2 overflow-x-auto pb-1 text-[11px]">
//             {/* Priority */}
//             <button
//               onClick={() => {
//                 togglePriority("low");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 priorityFilter === "low"
//                   ? "bg-emerald-500 text-white border-emerald-500"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               Low
//             </button>
//             <button
//               onClick={() => {
//                 togglePriority("medium");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 priorityFilter === "medium"
//                   ? "bg-amber-500 text-white border-amber-500"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               Medium
//             </button>
//             <button
//               onClick={() => {
//                 togglePriority("high");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 priorityFilter === "high"
//                   ? "bg-rose-500 text-white border-rose-500"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               High
//             </button>

//             {/* Severity */}
//             <button
//               onClick={() => {
//                 toggleSeverity("minor");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 severityFilter === "minor"
//                   ? "bg-sky-500 text-white border-sky-500"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               Minor
//             </button>
//             <button
//               onClick={() => {
//                 toggleSeverity("major");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 severityFilter === "major"
//                   ? "bg-orange-500 text-white border-orange-500"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               Major
//             </button>
//             <button
//               onClick={() => {
//                 toggleSeverity("critical");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 severityFilter === "critical"
//                   ? "bg-red-600 text-white border-red-600"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               Critical
//             </button>
//             <button
//               onClick={() => {
//                 toggleSeverity("blocker");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 severityFilter === "blocker"
//                   ? "bg-slate-700 text-white border-slate-700"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               Blocker
//             </button>
//           </div>
//         </div>

//         {/* List view */}
//         {loading ? (
//           <div className="mt-6 text-sm text-gray-600">Loading…</div>
//         ) : loadErr ? (
//           <div className="mt-6 text-sm text-red-600">{loadErr}</div>
//         ) : (
//           <div className="mt-4 space-y-2">
//             {/* Header row */}
//             <div className="grid grid-cols-[40px,1.8fr,1.3fr,1.4fr,0.9fr,0.9fr,1.1fr,1.4fr,70px] items-center text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200">
//               <div>#</div>
//               <div>Defect / Bug ID</div>
//               <div>Module</div>
//               <div>Expected Result</div>
//               <div>Priority</div>
//               <div>Severity</div>
//               <div>Status</div>
//               <div>Assigned Person</div>
//               <div className="text-center">View</div>
//             </div>

//             {/* Rows */}
//             <div className="divide-y divide-slate-100">
//               {pageRows.map((d, idx) => {
//                 const priorityVal = getPriorityValue(d);
//                 const severityVal = getSeverityValue(d);
//                 const prKey = priorityVal.toLowerCase();
//                 const svKey = severityVal.toLowerCase();
//                 const statusClass = getStatusBadge(d.status);

//                 const defectIdForView = d.defectId || d._id;
//                 const projectIdForView = d.projectId || projectId;

//                 const displayId =
//                   d.defectBugId ||
//                   d.bugId ||
//                   d.bug_id ||
//                   defectIdForView ||
//                   "Untitled Defect";

//                 const assignedLabel = getAssignedPersonLabel(d);

//                 return (
//                   <div
//                     key={`${defectIdForView || idx}-${d.defectBugId || ""}`}
//                     className="grid grid-cols-[40px,1.8fr,1.3fr,1.4fr,0.9fr,0.9fr,1.1fr,1.4fr,70px] items-center text-[12px] px-3 py-2"
//                   >
//                     {/* # */}
//                     <div className="text-slate-700">
//                       {(page - 1) * pageSize + idx + 1}
//                     </div>

//                     {/* Defect / Bug ID */}
//                     <div className="text-slate-900 font-medium line-clamp-2 pr-2">
//                       {displayId}
//                     </div>

//                     {/* Module */}
//                     <div className="truncate pr-2">
//                       <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
//                         {d.moduleName || d.module_name || "Unassigned"}
//                       </span>
//                     </div>

//                     {/* Expected Result */}
//                     <div className="text-slate-700 line-clamp-2 pr-2">
//                       {d.expectedResult || d.expected_result || "—"}
//                     </div>

//                     {/* Priority */}
//                     <div className="pr-2">
//                       {priorityVal ? (
//                         <span
//                           className={cls(
//                             "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border",
//                             priorityColors[prKey] ||
//                               "bg-slate-100 text-slate-700 border-slate-200"
//                           )}
//                         >
//                           {priorityVal}
//                         </span>
//                       ) : (
//                         <span className="text-slate-400 text-[10px]">—</span>
//                       )}
//                     </div>

//                     {/* Severity */}
//                     <div className="pr-2">
//                       {severityVal ? (
//                         <span
//                           className={cls(
//                             "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border",
//                             severityColors[svKey] ||
//                               "bg-slate-100 text-slate-700 border-slate-200"
//                           )}
//                         >
//                           {severityVal}
//                         </span>
//                       ) : (
//                         <span className="text-slate-400 text-[10px]">—</span>
//                       )}
//                     </div>

//                     {/* Status */}
//                     <div className="pr-2">
//                       <span
//                         className={cls(
//                           "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
//                           statusClass
//                         )}
//                       >
//                         {d.status || "Unknown"}
//                       </span>
//                     </div>

//                     {/* Assigned Person */}
//                     <div className="text-slate-700 truncate pr-2">
//                       {assignedLabel}
//                     </div>

//                     {/* View */}
//                     <div className="flex justify-center">
//                       {defectIdForView ? (
//                         <Link
//                           to={`/single-project/${projectIdForView}/defect/${defectIdForView}`}
//                           className="text-indigo-600 hover:text-indigo-800"
//                           title="View defect details"
//                         >
//                           <FaEye className="text-sm" />
//                         </Link>
//                       ) : (
//                         <span className="text-slate-400 text-[10px]">N/A</span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}

//               {!pageRows.length && (
//                 <div className="text-center text-[12px] text-slate-500 py-6">
//                   No assigned defects match your filters.
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Pagination */}
//         {!loading && !loadErr && filtered.length > 0 && (
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
// };

// export default DeveloperAssignedDefects;

//

//

import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaSortAmountDownAlt,
  FaSortAmountUpAlt,
  FaSync,
  FaEye,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const cls = (...a) => a.filter(Boolean).join(" ");

/* ---------- Search utils ---------- */
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
  "named",
  "called",
  "bug",
  "bugs",
  "defect",
  "defects",
  "issue",
  "issues",
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

/* ---------- Color maps ---------- */
const priorityColors = {
  low: "bg-emerald-100 text-emerald-700 border-emerald-300",
  medium: "bg-amber-100 text-amber-700 border-amber-300",
  high: "bg-rose-100 text-rose-700 border-rose-300",
};

const severityColors = {
  minor: "bg-sky-100 text-sky-700 border-sky-300",
  major: "bg-orange-100 text-orange-700 border-orange-300",
  critical: "bg-red-100 text-red-700 border-red-300",
  blocker: "bg-slate-300 text-slate-800 border-slate-400",
};

const statusColors = {
  "Open/New": "bg-rose-100 text-rose-700 border-rose-300",
  Assigned: "bg-amber-100 text-amber-700 border-amber-300",
  "In-progress": "bg-blue-100 text-blue-700 border-blue-300",
  "In-Progress": "bg-blue-100 text-blue-700 border-blue-300",
  Fixed: "bg-emerald-100 text-emerald-700 border-emerald-300",
  "Re-opened": "bg-purple-100 text-purple-700 border-purple-300",
  Reopened: "bg-purple-100 text-purple-700 border-purple-300",
  Closed: "bg-slate-200 text-slate-800 border-slate-300",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  "Unable-To-Fix": "bg-slate-100 text-slate-700 border-slate-200",
  "Unable-To-fix": "bg-slate-100 text-slate-700 border-slate-200",
};

const getStatusBadge = (status) =>
  statusColors[status] || "bg-slate-100 text-slate-700 border-slate-200";

/* ---------- Priority / Severity helpers ---------- */
const getPriorityValue = (d) =>
  d.priority || d.defectPriority || d.bug_priority || d.defect_priority || "";

const getSeverityValue = (d) =>
  d.severity || d.defectSeverity || d.bug_severity || d.defect_severity || "";

/* ---------- Role abbreviation + label helpers ---------- */
const ROLE_ABBREV = {
  superadmin: "SA",
  "super-admin": "SA",
  admin: "AD",
  project_manager: "PM",
  "project-manager": "PM",
  pm: "PM",
  qa_lead: "QAL",
  "qa-lead": "QAL",
  qalead: "QAL",
  test_engineer: "TE",
  "test-engineer": "TE",
  tester: "TE",
  developer: "DEV",
  dev: "DEV",
  frontend_developer: "FE",
  backend_developer: "BE",
  fullstack_developer: "FS",
  client: "CL",
  user: "USR",
};

const looksLikeObjectId = (v) =>
  typeof v === "string" && /^[a-fA-F0-9]{24}$/.test(v);

const formatUserLabel = (userLike) => {
  if (!userLike) return "—";

  if (typeof userLike === "string") {
    if (looksLikeObjectId(userLike)) return "—";
    return userLike;
  }

  const name =
    userLike.fullName ||
    userLike.name ||
    `${userLike.firstName || ""} ${userLike.lastName || ""}`.trim() ||
    userLike.username ||
    userLike.email ||
    "";

  const roleKey = (
    userLike.role ||
    userLike.user_role ||
    userLike.userRole ||
    ""
  )
    .toString()
    .toLowerCase();

  const abbrev = ROLE_ABBREV[roleKey];

  if (name && abbrev) return `${name} (${abbrev})`;
  if (name) return name;
  if (abbrev) return abbrev;

  return "—";
};

const extractAssignedUserObject = (d) =>
  d.assignedToUser ||
  d.assigned_to_user ||
  d.assignedByUser ||
  d.assigned_by_user ||
  d.assignedUser ||
  d.assigned_user ||
  d.assignedPerson ||
  d.assigned_person ||
  d.assignedByDetails ||
  d.assigned_by_details ||
  null;

const getAssignedPersonLabel = (d) => {
  const obj = extractAssignedUserObject(d);
  if (obj) return formatUserLabel(obj);

  if (d.assignedToName) return formatUserLabel(d.assignedToName);
  if (d.assigned_by_name) return formatUserLabel(d.assigned_by_name);
  if (d.assignedByName) return formatUserLabel(d.assignedByName);

  if (d.assignedTo && !looksLikeObjectId(d.assignedTo))
    return formatUserLabel(d.assignedTo);
  if (d.assigned_to && !looksLikeObjectId(d.assigned_to))
    return formatUserLabel(d.assigned_to);
  if (d.assignedBy && !looksLikeObjectId(d.assignedBy))
    return formatUserLabel(d.assignedBy);
  if (d.assigned_by && !looksLikeObjectId(d.assigned_by))
    return formatUserLabel(d.assigned_by);

  return "—";
};

/* =================================================================== */

const DeveloperAssignedDefects = () => {
  const { projectId, developerId } = useParams();

  const [projectName, setProjectName] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");

  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");

  const [statusCounts, setStatusCounts] = useState({
    openNew: 0,
    assigned: 0,
    inProgress: 0,
    fixed: 0,
    reopened: 0,
    closed: 0,
    pending: 0,
    unableToFix: 0,
  });

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";
  const authHeader = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token]
  );

  /* ---------- Fetch assigned defects ---------- */
  const fetchAll = async () => {
    try {
      setLoading(true);
      setLoadErr("");

      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      const effectiveDeveloperId =
        developerId || (loggedInUser && loggedInUser.id);

      if (!effectiveDeveloperId) {
        setLoadErr("No logged-in user found.");
        setRows([]);
        return;
      }

      // Route shape: /api/single-project/:projectId/developer/:developerId/view-assigned-defects
      // Backend ignores projectId for filtering; uses assignedTo (like dashboard).
      const safeProjectId = projectId || "all";
      const url = `${globalBackendRoute}/api/single-project/${safeProjectId}/developer/${effectiveDeveloperId}/view-assigned-defects`;

      const res = await axios.get(url, { headers: authHeader });

      const arr = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.defects)
        ? res.data.defects
        : [];

      setRows(arr);

      // Derive project label (fallback to "All Projects" if mixed/none)
      if (arr.length) {
        const names = Array.from(
          new Set(
            arr
              .map(
                (d) =>
                  d.projectName ||
                  d.project_name ||
                  d.project_title ||
                  d.projectTitle ||
                  d.project?.project_name
              )
              .filter(Boolean)
          )
        );

        if (names.length === 1) {
          setProjectName(names[0]);
        } else if (names.length > 1) {
          setProjectName("Multiple Projects");
        } else {
          setProjectName("All Projects");
        }
      } else {
        setProjectName("All Projects");
      }

      // Status counts
      const sc = {
        openNew: 0,
        assigned: 0,
        inProgress: 0,
        fixed: 0,
        reopened: 0,
        closed: 0,
        pending: 0,
        unableToFix: 0,
      };

      for (const d of arr) {
        const s = (d.status || "").trim();
        if (s === "Open/New" || s === "Open" || s === "New") sc.openNew += 1;
        else if (s === "Assigned") sc.assigned += 1;
        else if (s === "In-progress" || s === "In-Progress") sc.inProgress += 1;
        else if (s === "Fixed") sc.fixed += 1;
        else if (s === "Re-opened" || s === "Reopened") sc.reopened += 1;
        else if (s === "Closed") sc.closed += 1;
        else if (s === "Pending") sc.pending += 1;
        else if (s === "Unable-To-Fix" || s === "Unable-To-fix")
          sc.unableToFix += 1;
      }

      setStatusCounts(sc);
    } catch (e) {
      console.error("Assigned defects load error:", e?.response || e);
      setLoadErr(
        e?.response?.data?.message ||
          "Failed to load assigned defects. Please try again."
      );
      setRows([]);
      setStatusCounts({
        openNew: 0,
        assigned: 0,
        inProgress: 0,
        fixed: 0,
        reopened: 0,
        closed: 0,
        pending: 0,
        unableToFix: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, developerId]);

  /* ---------- Filter + Search + Sort ---------- */
  const filtered = useMemo(() => {
    const tokens = tokenize(search);
    let out = rows.slice();

    if (statusFilter) {
      out = out.filter((d) => (d.status || "") === statusFilter);
    }

    if (priorityFilter) {
      const want = priorityFilter.toLowerCase();
      out = out.filter((d) => getPriorityValue(d).toLowerCase() === want);
    }

    if (severityFilter) {
      const want = severityFilter.toLowerCase();
      out = out.filter((d) => getSeverityValue(d).toLowerCase() === want);
    }

    if (tokens.length) {
      out = out.filter((d) => {
        const hay = norm(
          [
            d.defectBugId,
            d.defectNumber,
            d.defectId,
            d.bugId,
            d.bug_id,
            d.moduleName,
            d.module_name,
            d.expectedResult,
            d.expected_result,
            d.actualResult,
            d.status,
            getPriorityValue(d),
            getSeverityValue(d),
            getAssignedPersonLabel(d),
          ]
            .filter(Boolean)
            .join(" ")
        );
        return tokens.every((t) => hay.includes(t));
      });
    }

    out.sort((a, b) => {
      const aTs = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTs = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      const delta = bTs - aTs;
      return sortOrder === "desc" ? delta : -delta;
    });

    return out;
  }, [rows, search, statusFilter, priorityFilter, severityFilter, sortOrder]);

  /* ---------- Pagination ---------- */
  const totalPages = Math.max(
    1,
    Math.ceil((filtered.length || 1) / (pageSize || 10))
  );
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  /* ---------- Helpers ---------- */
  const toggleStatus = (val) =>
    setStatusFilter((prev) => (prev === val ? "" : val));
  const togglePriority = (val) =>
    setPriorityFilter((prev) => (prev === val ? "" : val));
  const toggleSeverity = (val) =>
    setSeverityFilter((prev) => (prev === val ? "" : val));

  const clearAllFilters = () => {
    setStatusFilter("");
    setPriorityFilter("");
    setSeverityFilter("");
    setSearch("");
    setPage(1);
  };

  /* ---------- UI ---------- */
  return (
    <div className="bg-white py-6 sm:py-8 text-[13px]">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="min-w-[220px]">
            <h2 className="font-semibold tracking-tight text-indigo-600 text-[16px]">
              My Assigned Defects — {projectName}
            </h2>
            <div className="text-[11px] text-gray-600">
              {loading
                ? "Loading…"
                : `Total Assigned: ${rows.length} | Showing: ${filtered.length}`}
            </div>

            {/* Quick summary badges */}
            <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-slate-700">
              <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200">
                Open/New: {statusCounts.openNew}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">
                Assigned: {statusCounts.assigned}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                In-progress: {statusCounts.inProgress}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                Fixed: {statusCounts.fixed}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200">
                Re-opened: {statusCounts.reopened}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200">
                Closed: {statusCounts.closed}
              </span>
            </div>
          </div>

          {/* Right-side controls */}
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

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-2 top-2.5 text-gray-400" />
              <input
                className="pl-7 pr-2 py-1.5 border rounded-md w-[230px]"
                placeholder="Search (ID, module, status, assigned…)"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Rows per page */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-600">Rows</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1.5 border rounded-md"
              >
                {[5, 10, 20, 40, 60].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh */}
            <button
              onClick={fetchAll}
              className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
              title="Refresh assigned defects"
            >
              <FaSync />
              <span className="hidden sm:inline text-[11px]">Refresh</span>
            </button>

            {/* Navigation */}
            <Link
              to="/developer-dashboard"
              className="px-3 py-1.5 bg-slate-50 border rounded-md hover:bg-slate-100 text-[11px]"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-700">
              Quick Filters
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
            >
              Clear All Filters
            </button>
          </div>

          {/* Status chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-[11px]">
            <button
              onClick={() => {
                toggleStatus("Open/New");
                setPage(1);
              }}
              className={cls(
                "px-3 py-1 rounded-full border",
                statusFilter === "Open/New"
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              )}
            >
              Open/New ({statusCounts.openNew})
            </button>
            <button
              onClick={() => {
                toggleStatus("Assigned");
                setPage(1);
              }}
              className={cls(
                "px-3 py-1 rounded-full border",
                statusFilter === "Assigned"
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              )}
            >
              Assigned ({statusCounts.assigned})
            </button>
            <button
              onClick={() => {
                toggleStatus("In-progress");
                setPage(1);
              }}
              className={cls(
                "px-3 py-1 rounded-full border",
                statusFilter === "In-progress"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              )}
            >
              In-progress ({statusCounts.inProgress})
            </button>
            <button
              onClick={() => {
                toggleStatus("Fixed");
                setPage(1);
              }}
              className={cls(
                "px-3 py-1 rounded-full border",
                statusFilter === "Fixed"
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              )}
            >
              Fixed ({statusCounts.fixed})
            </button>
            <button
              onClick={() => {
                toggleStatus("Re-opened");
                setPage(1);
              }}
              className={cls(
                "px-3 py-1 rounded-full border",
                statusFilter === "Re-opened"
                  ? "bg-purple-500 text-white border-purple-500"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              )}
            >
              Re-opened ({statusCounts.reopened})
            </button>
            <button
              onClick={() => {
                toggleStatus("Closed");
                setPage(1);
              }}
              className={cls(
                "px-3 py-1 rounded-full border",
                statusFilter === "Closed"
                  ? "bg-slate-600 text-white border-slate-600"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              )}
            >
              Closed ({statusCounts.closed})
            </button>
            <button
              onClick={() => {
                setStatusFilter("");
                setPage(1);
              }}
              className={cls(
                "px-3 py-1 rounded-full border",
                !statusFilter
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              )}
            >
              All Statuses
            </button>
          </div>

          {/* Priority & Severity chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-[11px]">
            <button
              onClick={() => {
                togglePriority("low");
                setPage(1);
              }}
              className={cls(
                "px-3 py-1 rounded-full border",
                priorityFilter === "low"
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              )}
            >
              Low
            </button>
            <button
              onClick={() => {
                togglePriority("medium");
                setPage(1);
              }}
              className={cls(
                "px-3 py-1 rounded-full border",
                priorityFilter === "medium"
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              )}
            >
              Medium
            </button>
            <button
              onClick={() => {
                togglePriority("high");
                setPage(1);
              }}
              className={cls(
                "px-3 py-1 rounded-full border",
                priorityFilter === "high"
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              )}
            >
              High
            </button>

            <button
              onClick={() => {
                toggleSeverity("minor");
                setPage(1);
              }}
              className={cls(
                "px-3 py-1 rounded-full border",
                severityFilter === "minor"
                  ? "bg-sky-500 text-white border-sky-500"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              )}
            >
              Minor
            </button>
            <button
              onClick={() => {
                toggleSeverity("major");
                setPage(1);
              }}
              className={cls(
                "px-3 py-1 rounded-full border",
                severityFilter === "major"
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              )}
            >
              Major
            </button>
            <button
              onClick={() => {
                toggleSeverity("critical");
                setPage(1);
              }}
              className={cls(
                "px-3 py-1 rounded-full border",
                severityFilter === "critical"
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              )}
            >
              Critical
            </button>
            <button
              onClick={() => {
                toggleSeverity("blocker");
                setPage(1);
              }}
              className={cls(
                "px-3 py-1 rounded-full border",
                severityFilter === "blocker"
                  ? "bg-slate-700 text-white border-slate-700"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              )}
            >
              Blocker
            </button>
          </div>
        </div>

        {/* List view */}
        {loading ? (
          <div className="mt-6 text-sm text-gray-600">Loading…</div>
        ) : loadErr ? (
          <div className="mt-6 text-sm text-red-600">{loadErr}</div>
        ) : (
          <div className="mt-4 space-y-2">
            {/* Header row */}
            <div className="grid grid-cols-[40px,1.8fr,1.3fr,1.4fr,0.9fr,0.9fr,1.1fr,1.4fr,70px] items-center text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200">
              <div>#</div>
              <div>Defect / Bug ID</div>
              <div>Module</div>
              <div>Expected Result</div>
              <div>Priority</div>
              <div>Severity</div>
              <div>Status</div>
              <div>Assigned Person</div>
              <div className="text-center">View</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100">
              {pageRows.map((d, idx) => {
                const priorityVal = getPriorityValue(d);
                const severityVal = getSeverityValue(d);
                const prKey = priorityVal.toLowerCase();
                const svKey = severityVal.toLowerCase();
                const statusClass = getStatusBadge(d.status);

                const defectIdForView = d.defectId || d._id;
                const projectIdForView =
                  d.projectId || d.project_id || projectId || "unknown";

                const displayId =
                  d.defectBugId ||
                  d.bugId ||
                  d.bug_id ||
                  defectIdForView ||
                  "Untitled Defect";

                const assignedLabel = getAssignedPersonLabel(d);

                return (
                  <div
                    key={`${defectIdForView || idx}-${d.defectBugId || ""}`}
                    className="grid grid-cols-[40px,1.8fr,1.3fr,1.4fr,0.9fr,0.9fr,1.1fr,1.4fr,70px] items-center text-[12px] px-3 py-2"
                  >
                    {/* # */}
                    <div className="text-slate-700">
                      {(page - 1) * pageSize + idx + 1}
                    </div>

                    {/* Defect / Bug ID */}
                    <div className="text-slate-900 font-medium line-clamp-2 pr-2">
                      {displayId}
                    </div>

                    {/* Module */}
                    <div className="truncate pr-2">
                      <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                        {d.moduleName || d.module_name || "Unassigned"}
                      </span>
                    </div>

                    {/* Expected Result */}
                    <div className="text-slate-700 line-clamp-2 pr-2">
                      {d.expectedResult || d.expected_result || "—"}
                    </div>

                    {/* Priority */}
                    <div className="pr-2">
                      {priorityVal ? (
                        <span
                          className={cls(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border",
                            priorityColors[prKey] ||
                              "bg-slate-100 text-slate-700 border-slate-200"
                          )}
                        >
                          {priorityVal}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">—</span>
                      )}
                    </div>

                    {/* Severity */}
                    <div className="pr-2">
                      {severityVal ? (
                        <span
                          className={cls(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border",
                            severityColors[svKey] ||
                              "bg-slate-100 text-slate-700 border-slate-200"
                          )}
                        >
                          {severityVal}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">—</span>
                      )}
                    </div>

                    {/* Status */}
                    <div className="pr-2">
                      <span
                        className={cls(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                          statusClass
                        )}
                      >
                        {d.status || "Unknown"}
                      </span>
                    </div>

                    {/* Assigned Person */}
                    <div className="text-slate-700 truncate pr-2">
                      {assignedLabel}
                    </div>

                    {/* View */}
                    <div className="flex justify-center">
                      {defectIdForView ? (
                        <Link
                          to={`/single-project/${projectIdForView}/defect/${defectIdForView}`}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="View defect details"
                        >
                          <FaEye className="text-sm" />
                        </Link>
                      ) : (
                        <span className="text-slate-400 text-[10px]">N/A</span>
                      )}
                    </div>
                  </div>
                );
              })}

              {!pageRows.length && (
                <div className="text-center text-[12px] text-slate-500 py-6">
                  No assigned defects match your filters.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && !loadErr && filtered.length > 0 && (
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
};

export default DeveloperAssignedDefects;
