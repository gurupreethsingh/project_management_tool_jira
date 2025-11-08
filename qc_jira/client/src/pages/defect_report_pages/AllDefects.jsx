// // // // import React, { useEffect, useState, useMemo } from "react";
// // // // import axios from "axios";
// // // // import { FaThList, FaThLarge, FaTh, FaSearch, FaEye } from "react-icons/fa";
// // // // import { useParams, Link } from "react-router-dom";
// // // // import globalBackendRoute from "../../config/Config";

// // // // export default function AllDefects() {
// // // //   const { projectId } = useParams();

// // // //   // auth (optional; matches your other pages)
// // // //   const token =
// // // //     localStorage.getItem("userToken") || localStorage.getItem("token") || "";
// // // //   const authHeader = useMemo(
// // // //     () => (token ? { Authorization: `Bearer ${token}` } : undefined),
// // // //     [token]
// // // //   );

// // // //   const [defects, setDefects] = useState([]);
// // // //   const [view, setView] = useState("grid");
// // // //   const [searchQuery, setSearchQuery] = useState("");
// // // //   const [filteredDefects, setFilteredDefects] = useState([]);

// // // //   // Priority counts: low, medium, high
// // // //   const [priorityCounts, setPriorityCounts] = useState({
// // // //     low: 0,
// // // //     medium: 0,
// // // //     high: 0,
// // // //   });

// // // //   // Severity counts: minor, major, critical, blocker
// // // //   const [severityCounts, setSeverityCounts] = useState({
// // // //     minor: 0,
// // // //     major: 0,
// // // //     critical: 0,
// // // //     blocker: 0,
// // // //   });

// // // //   // Status counts: Open/New, Assigned, In-progress, Fixed, Re-opened, Closed
// // // //   const [statusCounts, setStatusCounts] = useState({
// // // //     openNew: 0,
// // // //     assigned: 0,
// // // //     inProgress: 0,
// // // //     fixed: 0,
// // // //     reopened: 0,
// // // //     closed: 0,
// // // //   });

// // // //   const colors = {
// // // //     low: "bg-teal-200 text-teal-800",
// // // //     medium: "bg-yellow-200 text-yellow-800",
// // // //     high: "bg-red-200 text-red-800",
// // // //   };

// // // //   const severityColors = {
// // // //     minor: "bg-purple-200 text-purple-800",
// // // //     major: "bg-orange-200 text-orange-800",
// // // //     critical: "bg-red-300 text-red-800",
// // // //     blocker: "bg-gray-400 text-gray-800",
// // // //   };

// // // //   const statusColors = {
// // // //     "Open/New": "bg-red-200 text-red-800",
// // // //     Assigned: "bg-yellow-200 text-yellow-800",
// // // //     "In-progress": "bg-blue-200 text-blue-800",
// // // //     Fixed: "bg-green-200 text-green-800",
// // // //     "Re-opened": "bg-purple-200 text-purple-800",
// // // //     Closed: "bg-gray-300 text-gray-800",
// // // //   };

// // // //   // Fetch defects data
// // // //   useEffect(() => {
// // // //     const fetchDefects = async () => {
// // // //       try {
// // // //         const response = await axios.get(
// // // //           `${globalBackendRoute}/api/single-project/${projectId}/all-defects`,
// // // //           { headers: authHeader }
// // // //         );
// // // //         const defectsData = response.data || [];
// // // //         setDefects(defectsData);
// // // //         setFilteredDefects(defectsData);

// // // //         // Initialize counts
// // // //         const _priorityCounts = { low: 0, medium: 0, high: 0 };
// // // //         const _severityCounts = { minor: 0, major: 0, critical: 0, blocker: 0 };
// // // //         const _statusCounts = {
// // // //           openNew: 0,
// // // //           assigned: 0,
// // // //           inProgress: 0,
// // // //           fixed: 0,
// // // //           reopened: 0,
// // // //           closed: 0,
// // // //         };

// // // //         // Calculate counts
// // // //         defectsData.forEach((defect) => {
// // // //           const priority = (defect.priority || "").toLowerCase();
// // // //           if (priority in _priorityCounts) _priorityCounts[priority]++;

// // // //           const severity = (defect.severity || "").toLowerCase();
// // // //           if (severity in _severityCounts) _severityCounts[severity]++;

// // // //           switch (defect.status) {
// // // //             case "Open/New":
// // // //               _statusCounts.openNew++;
// // // //               break;
// // // //             case "Assigned":
// // // //               _statusCounts.assigned++;
// // // //               break;
// // // //             case "In-progress":
// // // //               _statusCounts.inProgress++;
// // // //               break;
// // // //             case "Fixed":
// // // //               _statusCounts.fixed++;
// // // //               break;
// // // //             case "Re-opened":
// // // //               _statusCounts.reopened++;
// // // //               break;
// // // //             case "Closed":
// // // //               _statusCounts.closed++;
// // // //               break;
// // // //             default:
// // // //               break;
// // // //           }
// // // //         });

// // // //         setPriorityCounts(_priorityCounts);
// // // //         setSeverityCounts(_severityCounts);
// // // //         setStatusCounts(_statusCounts);
// // // //       } catch (error) {
// // // //         console.error("Error fetching defects:", error);
// // // //       }
// // // //     };
// // // //     fetchDefects();
// // // //   }, [projectId, authHeader]);

// // // //   // Filter by priority
// // // //   const filterDefects = (priority) => {
// // // //     if (priority === "all") {
// // // //       setFilteredDefects(defects);
// // // //     } else {
// // // //       setFilteredDefects(
// // // //         defects.filter(
// // // //           (defect) => (defect.priority || "").toLowerCase() === priority
// // // //         )
// // // //       );
// // // //     }
// // // //   };

// // // //   // Filter by severity
// // // //   const filterBySeverity = (severity) => {
// // // //     if (severity === "all") {
// // // //       setFilteredDefects(defects);
// // // //     } else {
// // // //       setFilteredDefects(
// // // //         defects.filter(
// // // //           (defect) => (defect.severity || "").toLowerCase() === severity
// // // //         )
// // // //       );
// // // //     }
// // // //   };

// // // //   // Filter by status
// // // //   const filterByStatus = (status) => {
// // // //     if (status === "all") {
// // // //       setFilteredDefects(defects);
// // // //     } else {
// // // //       setFilteredDefects(defects.filter((defect) => defect.status === status));
// // // //     }
// // // //   };

// // // //   // Combine search with current dataset
// // // //   useEffect(() => {
// // // //     let filtered = defects;

// // // //     if (searchQuery) {
// // // //       filtered = filtered.filter((defect) =>
// // // //         [defect.test_case_name, defect.module_name, defect.status]
// // // //           .filter(Boolean)
// // // //           .map((field) => field.toLowerCase())
// // // //           .some((field) => field.includes(searchQuery.toLowerCase()))
// // // //       );
// // // //     }

// // // //     setFilteredDefects(filtered);
// // // //   }, [searchQuery, defects]);

// // // //   const getStatusColor = (status) =>
// // // //     statusColors[status] || "bg-gray-100 text-gray-800";

// // // //   const getImageUrl = (bugImage) => {
// // // //     if (bugImage) {
// // // //       const normalizedPath = bugImage
// // // //         .replace(/\\/g, "/")
// // // //         .split("uploads/")
// // // //         .pop();
// // // //       return `${globalBackendRoute}/uploads/${normalizedPath}`;
// // // //     }
// // // //     return "https://via.placeholder.com/150";
// // // //   };

// // // //   return (
// // // //     <div className="bg-white py-8 sm:py-12">
// // // //       <div className="mx-auto max-w-7xl px-4 lg:px-6">
// // // //         {/* Header */}
// // // //         <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4">
// // // //           <div className="flex items-center space-x-2">
// // // //             <h2 className="font-medium tracking-tight text-gray-700">
// // // //               All Project Defects ({defects.length} total)
// // // //             </h2>
// // // //           </div>

// // // //           <div className="flex flex-wrap items-center justify-center space-x-2">
// // // //             <FaThList
// // // //               className={`text-sm cursor-pointer ${
// // // //                 view === "list" ? "text-indigo-500" : "text-gray-500"
// // // //               }`}
// // // //               onClick={() => setView("list")}
// // // //             />
// // // //             <FaThLarge
// // // //               className={`text-sm cursor-pointer ${
// // // //                 view === "card" ? "text-indigo-500" : "text-gray-500"
// // // //               }`}
// // // //               onClick={() => setView("card")}
// // // //             />
// // // //             <FaTh
// // // //               className={`text-sm cursor-pointer ${
// // // //                 view === "grid" ? "text-indigo-500" : "text-gray-500"
// // // //               }`}
// // // //               onClick={() => setView("grid")}
// // // //             />

// // // //             <div className="relative">
// // // //               <FaSearch className="absolute left-2 top-2 text-gray-400" />
// // // //               <input
// // // //                 type="text"
// // // //                 className="pl-8 pr-2 py-1 border border-gray-300 rounded-md focus:outline-none"
// // // //                 placeholder="Search defects..."
// // // //                 value={searchQuery}
// // // //                 onChange={(e) => setSearchQuery(e.target.value)}
// // // //               />
// // // //             </div>

// // // //             <div className="relative">
// // // //               <Link
// // // //                 to={`/single-project/${projectId}`}
// // // //                 className=" btn btn-sm bg-indigo-600 hover:bg-indigo-800 font-semibold text-white"
// // // //               >
// // // //                 Project Dashboard
// // // //               </Link>
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* Filters */}
// // // //         <div className="flex flex-wrap justify-center items-center mt-3 space-x-2">
// // // //           <button
// // // //             onClick={() => filterDefects("low")}
// // // //             className={`text-xs px-2 py-1 rounded ${colors.low}`}
// // // //           >
// // // //             Low ({priorityCounts.low})
// // // //           </button>
// // // //           <button
// // // //             onClick={() => filterDefects("medium")}
// // // //             className={`text-xs px-2 py-1 rounded ${colors.medium}`}
// // // //           >
// // // //             Medium ({priorityCounts.medium})
// // // //           </button>
// // // //           <button
// // // //             onClick={() => filterDefects("high")}
// // // //             className={`text-xs px-2 py-1 rounded ${colors.high}`}
// // // //           >
// // // //             High ({priorityCounts.high})
// // // //           </button>

// // // //           <button
// // // //             onClick={() => filterBySeverity("minor")}
// // // //             className={`text-xs px-2 py-1 rounded ${severityColors.minor}`}
// // // //           >
// // // //             Minor ({severityCounts.minor})
// // // //           </button>
// // // //           <button
// // // //             onClick={() => filterBySeverity("major")}
// // // //             className={`text-xs px-2 py-1 rounded ${severityColors.major}`}
// // // //           >
// // // //             Major ({severityCounts.major})
// // // //           </button>
// // // //           <button
// // // //             onClick={() => filterBySeverity("critical")}
// // // //             className={`text-xs px-2 py-1 rounded ${severityColors.critical}`}
// // // //           >
// // // //             Critical ({severityCounts.critical})
// // // //           </button>
// // // //           <button
// // // //             onClick={() => filterBySeverity("blocker")}
// // // //             className={`text-xs px-2 py-1 rounded ${severityColors.blocker}`}
// // // //           >
// // // //             Blocker ({severityCounts.blocker})
// // // //           </button>

// // // //           <button
// // // //             onClick={() => filterByStatus("Open/New")}
// // // //             className={`text-xs px-2 py-1 rounded ${statusColors["Open/New"]}`}
// // // //           >
// // // //             Open/New ({statusCounts.openNew})
// // // //           </button>
// // // //           <button
// // // //             onClick={() => filterByStatus("Assigned")}
// // // //             className={`text-xs px-2 py-1 rounded ${statusColors.Assigned}`}
// // // //           >
// // // //             Assigned ({statusCounts.assigned})
// // // //           </button>
// // // //           <button
// // // //             onClick={() => filterByStatus("In-progress")}
// // // //             className={`text-xs px-2 py-1 rounded ${statusColors["In-progress"]}`}
// // // //           >
// // // //             In-progress ({statusCounts.inProgress})
// // // //           </button>
// // // //           <button
// // // //             onClick={() => filterByStatus("Fixed")}
// // // //             className={`text-xs px-2 py-1 rounded ${statusColors.Fixed}`}
// // // //           >
// // // //             Fixed ({statusCounts.fixed})
// // // //           </button>
// // // //           <button
// // // //             onClick={() => filterByStatus("Re-opened")}
// // // //             className={`text-xs px-2 py-1 rounded ${statusColors["Re-opened"]}`}
// // // //           >
// // // //             Re-opened ({statusCounts.reopened})
// // // //           </button>
// // // //           <button
// // // //             onClick={() => filterByStatus("Closed")}
// // // //             className={`text-xs px-2 py-1 rounded ${statusColors.Closed}`}
// // // //           >
// // // //             Closed ({statusCounts.closed})
// // // //           </button>

// // // //           <button
// // // //             onClick={() => filterByStatus("all")}
// // // //             className="text-xs px-2 py-1 rounded bg-gray-200"
// // // //           >
// // // //             All
// // // //           </button>
// // // //         </div>

// // // //         {/* Defects Display */}
// // // //         <div className="mt-6">
// // // //           {view === "grid" && (
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
// // // //               {filteredDefects
// // // //                 .filter((defect) =>
// // // //                   [defect.test_case_name, defect.module_name, defect.status]
// // // //                     .filter(Boolean)
// // // //                     .map((field) => field.toLowerCase())
// // // //                     .some((field) => field.includes(searchQuery.toLowerCase()))
// // // //                 )
// // // //                 .map((defect) => (
// // // //                   <Link
// // // //                     to={`/single-project/${projectId}/defect/${defect._id}`}
// // // //                     key={defect._id}
// // // //                     className="flex flex-col items-start relative"
// // // //                   >
// // // //                     <img
// // // //                       src={getImageUrl(defect.bug_picture)}
// // // //                       alt={defect.test_case_name}
// // // //                       className="w-full h-32 object-cover rounded-md"
// // // //                     />
// // // //                     <h3 className="mt-2 text-xs font-medium text-gray-800 text-left">
// // // //                       {defect.test_case_name}
// // // //                     </h3>
// // // //                     <p className="text-xs text-gray-600 text-left">
// // // //                       Module: {defect.module_name}
// // // //                     </p>
// // // //                     <p
// // // //                       className={`text-xs p-1 rounded ${getStatusColor(
// // // //                         defect.status
// // // //                       )}`}
// // // //                     >
// // // //                       Status: {defect.status}
// // // //                     </p>
// // // //                   </Link>
// // // //                 ))}
// // // //             </div>
// // // //           )}

// // // //           {view === "card" && (
// // // //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// // // //               {filteredDefects
// // // //                 .filter((defect) =>
// // // //                   [defect.test_case_name, defect.module_name, defect.status]
// // // //                     .filter(Boolean)
// // // //                     .map((field) => field.toLowerCase())
// // // //                     .some((field) => field.includes(searchQuery.toLowerCase()))
// // // //                 )
// // // //                 .map((defect) => (
// // // //                   <Link
// // // //                     to={`/single-project/${projectId}/defect/${defect._id}`}
// // // //                     key={defect._id}
// // // //                     className="flex flex-col items-start bg-white rounded-lg shadow"
// // // //                   >
// // // //                     <img
// // // //                       src={getImageUrl(defect.bug_picture)}
// // // //                       alt={defect.test_case_name}
// // // //                       className="w-full h-40 object-cover rounded-md"
// // // //                     />
// // // //                     <h3 className="mt-2 text-sm font-medium text-gray-800 text-left">
// // // //                       {defect.test_case_name}
// // // //                     </h3>
// // // //                     <p className="text-xs text-gray-600 text-left">
// // // //                       Module: {defect.module_name}
// // // //                     </p>
// // // //                     <p
// // // //                       className={`text-xs p-1 rounded ${getStatusColor(
// // // //                         defect.status
// // // //                       )}`}
// // // //                     >
// // // //                       Status: {defect.status}
// // // //                     </p>
// // // //                   </Link>
// // // //                 ))}
// // // //             </div>
// // // //           )}

// // // //           {view === "list" && (
// // // //             <div className="mt-10 space-y-6">
// // // //               {filteredDefects
// // // //                 .filter((defect) =>
// // // //                   [defect.test_case_name, defect.module_name, defect.status]
// // // //                     .filter(Boolean)
// // // //                     .map((field) => field.toLowerCase())
// // // //                     .some((field) => field.includes(searchQuery.toLowerCase()))
// // // //                 )
// // // //                 .map((defect) => (
// // // //                   <div
// // // //                     key={defect._id}
// // // //                     className="flex items-center justify-between bg-white rounded-lg shadow relative p-4"
// // // //                   >
// // // //                     <div className="flex flex-1 space-x-4">
// // // //                       <div className="w-16 h-16">
// // // //                         <img
// // // //                           src={getImageUrl(defect.bug_picture)}
// // // //                           alt={defect.test_case_name}
// // // //                           className="w-full h-full object-cover rounded-md"
// // // //                         />
// // // //                       </div>

// // // //                       <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
// // // //                         <span className="text-sm font-semibold text-gray-600">
// // // //                           Test Case Name
// // // //                         </span>
// // // //                         <span className="text-sm text-gray-900">
// // // //                           {defect.test_case_name}
// // // //                         </span>
// // // //                       </div>

// // // //                       <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
// // // //                         <span className="text-sm font-semibold text-gray-600">
// // // //                           Test Case Number
// // // //                         </span>
// // // //                         <span className="text-sm text-gray-900">
// // // //                           {defect.test_case_number}
// // // //                         </span>
// // // //                       </div>

// // // //                       <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
// // // //                         <span className="text-sm font-semibold text-gray-600">
// // // //                           Module
// // // //                         </span>
// // // //                         <span className="text-sm text-gray-900">
// // // //                           {defect.module_name}
// // // //                         </span>
// // // //                       </div>

// // // //                       <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
// // // //                         <span className="text-sm font-semibold text-gray-600">
// // // //                           Status
// // // //                         </span>
// // // //                         <span
// // // //                           className={`text-sm font-bold ${
// // // //                             defect.status === "Closed"
// // // //                               ? "text-green-500"
// // // //                               : "text-red-500"
// // // //                           }`}
// // // //                         >
// // // //                           {defect.status}
// // // //                         </span>
// // // //                       </div>
// // // //                     </div>

// // // //                     <div className="flex space-x-4 items-center w-2/12">
// // // //                       <Link
// // // //                         to={`/single-project/${projectId}/defect/${defect._id}`}
// // // //                         className="text-blue-400 hover:text-blue-500 text-sm"
// // // //                       >
// // // //                         <FaEye className="text-lg" />
// // // //                       </Link>

// // // //                       <Link
// // // //                         to={`/bug-history/${defect._id}`}
// // // //                         className="text-gray-600 hover:text-gray-800 text-sm"
// // // //                       >
// // // //                         <span className="inline-flex items-center">
// // // //                           <FaThList className="mr-2" />
// // // //                           Bug History
// // // //                         </span>
// // // //                       </Link>
// // // //                     </div>
// // // //                   </div>
// // // //                 ))}
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // //

// // // //

// // // //

// // // import React, { useEffect, useMemo, useState } from "react";
// // // import axios from "axios";
// // // import {
// // //   FaThList,
// // //   FaThLarge,
// // //   FaTh,
// // //   FaSearch,
// // //   FaEye,
// // //   FaSort,
// // // } from "react-icons/fa";
// // // import { useParams, Link } from "react-router-dom";
// // // import globalBackendRoute from "../../config/Config";

// // // /* ---------- Search utils (aligned with other pages) ---------- */
// // // const STOP_WORDS = new Set([
// // //   "a",
// // //   "an",
// // //   "the",
// // //   "and",
// // //   "or",
// // //   "of",
// // //   "in",
// // //   "on",
// // //   "at",
// // //   "to",
// // //   "for",
// // //   "with",
// // //   "by",
// // //   "from",
// // //   "is",
// // //   "are",
// // //   "was",
// // //   "were",
// // //   "be",
// // //   "been",
// // //   "being",
// // //   "i",
// // //   "you",
// // //   "he",
// // //   "she",
// // //   "it",
// // //   "we",
// // //   "they",
// // //   "me",
// // //   "him",
// // //   "her",
// // //   "us",
// // //   "them",
// // //   "this",
// // //   "that",
// // //   "these",
// // //   "those",
// // //   "there",
// // //   "here",
// // //   "please",
// // //   "pls",
// // //   "plz",
// // //   "show",
// // //   "find",
// // //   "search",
// // //   "look",
// // //   "list",
// // //   "named",
// // //   "called",
// // //   "bug",
// // //   "bugs",
// // //   "defect",
// // //   "defects",
// // //   "issue",
// // //   "issues",
// // // ]);

// // // const norm = (s = "") =>
// // //   String(s)
// // //     .toLowerCase()
// // //     .normalize("NFD")
// // //     .replace(/[\u0300-\u036f]/g, ""); // strip accents

// // // const tokenize = (raw) => {
// // //   const trimmed = String(raw || "").trim();
// // //   if (!trimmed) return [];
// // //   return trimmed
// // //     .split(/\s+/)
// // //     .map(norm)
// // //     .filter(Boolean)
// // //     .filter((t) => !STOP_WORDS.has(t));
// // // };
// // // /* ------------------------------------------------------------ */

// // // const priorityColors = {
// // //   low: "bg-teal-200 text-teal-800",
// // //   medium: "bg-yellow-200 text-yellow-800",
// // //   high: "bg-red-200 text-red-800",
// // // };

// // // const severityColors = {
// // //   minor: "bg-purple-200 text-purple-800",
// // //   major: "bg-orange-200 text-orange-800",
// // //   critical: "bg-red-300 text-red-800",
// // //   blocker: "bg-gray-400 text-gray-800",
// // // };

// // // const statusColors = {
// // //   "Open/New": "bg-red-200 text-red-800",
// // //   Assigned: "bg-yellow-200 text-yellow-800",
// // //   "In-progress": "bg-blue-200 text-blue-800",
// // //   Fixed: "bg-green-200 text-green-800",
// // //   "Re-opened": "bg-purple-200 text-purple-800",
// // //   Closed: "bg-gray-300 text-gray-800",
// // // };

// // // const getStatusColor = (status) =>
// // //   statusColors[status] || "bg-gray-100 text-gray-800";

// // // const getImageUrl = (bugImage) => {
// // //   if (bugImage) {
// // //     const normalizedPath = String(bugImage)
// // //       .replace(/\\/g, "/")
// // //       .split("uploads/")
// // //       .pop();
// // //     return `${globalBackendRoute}/uploads/${normalizedPath}`;
// // //   }
// // //   return "https://via.placeholder.com/150";
// // // };

// // // export default function AllDefects() {
// // //   const { projectId } = useParams();

// // //   // auth
// // //   const token =
// // //     localStorage.getItem("userToken") || localStorage.getItem("token") || "";
// // //   const authHeader = useMemo(
// // //     () => (token ? { Authorization: `Bearer ${token}` } : undefined),
// // //     [token]
// // //   );

// // //   const [defects, setDefects] = useState([]);
// // //   const [view, setView] = useState("grid"); // grid | card | list

// // //   const [searchQuery, setSearchQuery] = useState(""); // raw
// // //   const [debouncedQuery, setDebouncedQuery] = useState("");

// // //   const [sortOrder, setSortOrder] = useState("desc"); // desc = latest first

// // //   // Filters
// // //   const [priorityFilter, setPriorityFilter] = useState("all"); // low|medium|high|all
// // //   const [severityFilter, setSeverityFilter] = useState("all"); // minor|major|critical|blocker|all
// // //   const [statusFilter, setStatusFilter] = useState("all"); // one of status or all

// // //   // Summary counts
// // //   const [priorityCounts, setPriorityCounts] = useState({
// // //     low: 0,
// // //     medium: 0,
// // //     high: 0,
// // //   });
// // //   const [severityCounts, setSeverityCounts] = useState({
// // //     minor: 0,
// // //     major: 0,
// // //     critical: 0,
// // //     blocker: 0,
// // //   });
// // //   const [statusCounts, setStatusCounts] = useState({
// // //     openNew: 0,
// // //     assigned: 0,
// // //     inProgress: 0,
// // //     fixed: 0,
// // //     reopened: 0,
// // //     closed: 0,
// // //   });

// // //   // ---- Fetch defects ----
// // //   useEffect(() => {
// // //     const fetchDefects = async () => {
// // //       try {
// // //         const response = await axios.get(
// // //           `${globalBackendRoute}/api/single-project/${projectId}/all-defects`,
// // //           { headers: authHeader }
// // //         );
// // //         const defectsData = Array.isArray(response.data)
// // //           ? response.data
// // //           : response.data?.defects || [];
// // //         setDefects(defectsData);

// // //         // Init counts from full dataset
// // //         const _priority = { low: 0, medium: 0, high: 0 };
// // //         const _severity = { minor: 0, major: 0, critical: 0, blocker: 0 };
// // //         const _status = {
// // //           openNew: 0,
// // //           assigned: 0,
// // //           inProgress: 0,
// // //           fixed: 0,
// // //           reopened: 0,
// // //           closed: 0,
// // //         };

// // //         defectsData.forEach((d) => {
// // //           const p = (d.priority || "").toLowerCase();
// // //           if (_priority[p] !== undefined) _priority[p] += 1;

// // //           const s = (d.severity || "").toLowerCase();
// // //           if (_severity[s] !== undefined) _severity[s] += 1;

// // //           switch (d.status) {
// // //             case "Open/New":
// // //               _status.openNew += 1;
// // //               break;
// // //             case "Assigned":
// // //               _status.assigned += 1;
// // //               break;
// // //             case "In-progress":
// // //               _status.inProgress += 1;
// // //               break;
// // //             case "Fixed":
// // //               _status.fixed += 1;
// // //               break;
// // //             case "Re-opened":
// // //               _status.reopened += 1;
// // //               break;
// // //             case "Closed":
// // //               _status.closed += 1;
// // //               break;
// // //             default:
// // //               break;
// // //           }
// // //         });

// // //         setPriorityCounts(_priority);
// // //         setSeverityCounts(_severity);
// // //         setStatusCounts(_status);
// // //       } catch (error) {
// // //         console.error("Error fetching defects:", error);
// // //         setDefects([]);
// // //       }
// // //     };
// // //     fetchDefects();
// // //   }, [projectId, authHeader]);

// // //   // ---- Debounce search ----
// // //   useEffect(() => {
// // //     const t = setTimeout(() => setDebouncedQuery(searchQuery), 180);
// // //     return () => clearTimeout(t);
// // //   }, [searchQuery]);

// // //   // ---- Combined filter + sort ----
// // //   const filteredDefects = useMemo(() => {
// // //     const tokens = tokenize(debouncedQuery);

// // //     let rows = defects.filter((d) => {
// // //       // Priority filter
// // //       if (priorityFilter !== "all") {
// // //         const p = (d.priority || "").toLowerCase();
// // //         if (p !== priorityFilter) return false;
// // //       }

// // //       // Severity filter
// // //       if (severityFilter !== "all") {
// // //         const s = (d.severity || "").toLowerCase();
// // //         if (s !== severityFilter) return false;
// // //       }

// // //       // Status filter
// // //       if (statusFilter !== "all") {
// // //         if ((d.status || "") !== statusFilter) return false;
// // //       }

// // //       // Search filter
// // //       if (!tokens.length) return true;

// // //       const hay = norm(
// // //         [
// // //           d.test_case_name || "",
// // //           d.test_case_number || "",
// // //           d.module_name || "",
// // //           d.status || "",
// // //           d.priority || "",
// // //           d.severity || "",
// // //           d.bug_id || "",
// // //           d.bug_title || "",
// // //           d.bug_summary || "",
// // //           d.bug_description || "",
// // //         ].join(" ")
// // //       );

// // //       return tokens.some((t) => hay.includes(t));
// // //     });

// // //     // Sort by createdAt (newest / oldest)
// // //     rows = rows.slice().sort((a, b) => {
// // //       const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
// // //       const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
// // //       return sortOrder === "asc" ? da - db : db - da;
// // //     });

// // //     return rows;
// // //   }, [
// // //     defects,
// // //     debouncedQuery,
// // //     priorityFilter,
// // //     severityFilter,
// // //     statusFilter,
// // //     sortOrder,
// // //   ]);

// // //   // ---- Filter helpers (for chips & controls) ----
// // //   const togglePriority = (val) =>
// // //     setPriorityFilter((prev) => (prev === val ? "all" : val));
// // //   const toggleSeverity = (val) =>
// // //     setSeverityFilter((prev) => (prev === val ? "all" : val));
// // //   const toggleStatus = (val) =>
// // //     setStatusFilter((prev) => (prev === val ? "all" : val));

// // //   const clearAllFilters = () => {
// // //     setPriorityFilter("all");
// // //     setSeverityFilter("all");
// // //     setStatusFilter("all");
// // //     setSearchQuery("");
// // //   };

// // //   const totalDefects = defects.length;
// // //   const filteredCount = filteredDefects.length;

// // //   // ---- Render ----
// // //   return (
// // //     <div className="bg-white py-10 sm:py-12">
// // //       <div className="mx-auto container px-2 sm:px-3 lg:px-4">
// // //         {/* Header / Controls */}
// // //         <div className="flex justify-between items-center gap-3 flex-wrap">
// // //           <div>
// // //             <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
// // //               All Defects for Project: {projectId}
// // //             </h2>
// // //             <p className="text-xs text-gray-600 mt-1">
// // //               Total Defects: {totalDefects}
// // //             </p>
// // //             {(searchQuery ||
// // //               priorityFilter !== "all" ||
// // //               severityFilter !== "all" ||
// // //               statusFilter !== "all") && (
// // //               <p className="text-xs text-gray-600">
// // //                 Showing {filteredCount} result(s)
// // //                 {searchQuery && <> for “{searchQuery}”</>}
// // //                 {priorityFilter !== "all" && <> · Priority: {priorityFilter}</>}
// // //                 {severityFilter !== "all" && <> · Severity: {severityFilter}</>}
// // //                 {statusFilter !== "all" && <> · Status: {statusFilter}</>}
// // //               </p>
// // //             )}

// // //             {/* Quick summary pills */}
// // //             <p className="text-[11px] text-slate-600 mt-1 flex flex-wrap gap-1">
// // //               <span
// // //                 className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${priorityColors.low}`}
// // //               >
// // //                 Low: {priorityCounts.low}
// // //               </span>
// // //               <span
// // //                 className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${priorityColors.medium}`}
// // //               >
// // //                 Medium: {priorityCounts.medium}
// // //               </span>
// // //               <span
// // //                 className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${priorityColors.high}`}
// // //               >
// // //                 High: {priorityCounts.high}
// // //               </span>

// // //               <span
// // //                 className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${severityColors.minor}`}
// // //               >
// // //                 Minor: {severityCounts.minor}
// // //               </span>
// // //               <span
// // //                 className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${severityColors.major}`}
// // //               >
// // //                 Major: {severityCounts.major}
// // //               </span>
// // //               <span
// // //                 className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${severityColors.critical}`}
// // //               >
// // //                 Critical: {severityCounts.critical}
// // //               </span>
// // //               <span
// // //                 className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${severityColors.blocker}`}
// // //               >
// // //                 Blocker: {severityCounts.blocker}
// // //               </span>
// // //             </p>
// // //           </div>

// // //           {/* Right controls: views + search + sort + dashboard */}
// // //           <div className="flex items-center gap-3 flex-wrap">
// // //             {/* View toggles */}
// // //             <FaThList
// // //               className={`text-lg cursor-pointer ${
// // //                 view === "list" ? "text-blue-500" : "text-gray-500"
// // //               }`}
// // //               onClick={() => setView("list")}
// // //               title="List view"
// // //             />
// // //             <FaThLarge
// // //               className={`text-lg cursor-pointer ${
// // //                 view === "card" ? "text-blue-500" : "text-gray-500"
// // //               }`}
// // //               onClick={() => setView("card")}
// // //               title="Card view"
// // //             />
// // //             <FaTh
// // //               className={`text-lg cursor-pointer ${
// // //                 view === "grid" ? "text-blue-500" : "text-gray-500"
// // //               }`}
// // //               onClick={() => setView("grid")}
// // //               title="Grid view"
// // //             />

// // //             {/* Search (smart behavior via tokenize/debouncedQuery) */}
// // //             <div className="relative">
// // //               <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
// // //               <input
// // //                 type="text"
// // //                 className="pl-9 pr-3 py-1.5 text-sm border rounded-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
// // //                 placeholder="Search defects (module, status, text...)"
// // //                 value={searchQuery}
// // //                 onChange={(e) => setSearchQuery(e.target.value)}
// // //                 spellCheck={false}
// // //               />
// // //             </div>

// // //             {/* Sort newest/oldest */}
// // //             <button
// // //               onClick={() =>
// // //                 setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
// // //               }
// // //               className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-xs sm:text-sm inline-flex items-center"
// // //               title="Sort by created date"
// // //             >
// // //               <FaSort className="mr-1" />
// // //               {sortOrder === "asc" ? "Oldest first" : "Newest first"}
// // //             </button>

// // //             {/* Clear filters */}
// // //             <button
// // //               onClick={clearAllFilters}
// // //               className="px-2.5 py-1.5 border border-slate-300 text-[10px] sm:text-xs rounded-md hover:bg-slate-50"
// // //               title="Clear all filters & search"
// // //             >
// // //               Clear
// // //             </button>

// // //             {/* Project Dashboard link */}
// // //             <Link
// // //               to={`/single-project/${projectId}`}
// // //               className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-xs sm:text-sm"
// // //             >
// // //               Project Dashboard
// // //             </Link>
// // //           </div>
// // //         </div>

// // //         {/* Filter chips row (more options related to defects/bugs) */}
// // //         <div className="mt-4">
// // //           <div className="flex items-center justify-between mb-2">
// // //             <h3 className="text-xs font-semibold text-slate-700">
// // //               Filter by Priority / Severity / Status
// // //             </h3>
// // //           </div>

// // //           <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 text-[11px]">
// // //             {/* Priority chips */}
// // //             <button
// // //               onClick={() => togglePriority("low")}
// // //               className={`px-3 py-1 rounded-full border ${
// // //                 priorityFilter === "low"
// // //                   ? "bg-teal-500 text-white border-teal-500"
// // //                   : "bg-slate-50 text-slate-700 border-slate-200"
// // //               }`}
// // //             >
// // //               Low ({priorityCounts.low})
// // //             </button>
// // //             <button
// // //               onClick={() => togglePriority("medium")}
// // //               className={`px-3 py-1 rounded-full border ${
// // //                 priorityFilter === "medium"
// // //                   ? "bg-yellow-500 text-white border-yellow-500"
// // //                   : "bg-slate-50 text-slate-700 border-slate-200"
// // //               }`}
// // //             >
// // //               Medium ({priorityCounts.medium})
// // //             </button>
// // //             <button
// // //               onClick={() => togglePriority("high")}
// // //               className={`px-3 py-1 rounded-full border ${
// // //                 priorityFilter === "high"
// // //                   ? "bg-red-500 text-white border-red-500"
// // //                   : "bg-slate-50 text-slate-700 border-slate-200"
// // //               }`}
// // //             >
// // //               High ({priorityCounts.high})
// // //             </button>

// // //             {/* Severity chips */}
// // //             <button
// // //               onClick={() => toggleSeverity("minor")}
// // //               className={`px-3 py-1 rounded-full border ${
// // //                 severityFilter === "minor"
// // //                   ? "bg-purple-500 text-white border-purple-500"
// // //                   : "bg-slate-50 text-slate-700 border-slate-200"
// // //               }`}
// // //             >
// // //               Minor ({severityCounts.minor})
// // //             </button>
// // //             <button
// // //               onClick={() => toggleSeverity("major")}
// // //               className={`px-3 py-1 rounded-full border ${
// // //                 severityFilter === "major"
// // //                   ? "bg-orange-500 text-white border-orange-500"
// // //                   : "bg-slate-50 text-slate-700 border-slate-200"
// // //               }`}
// // //             >
// // //               Major ({severityCounts.major})
// // //             </button>
// // //             <button
// // //               onClick={() => toggleSeverity("critical")}
// // //               className={`px-3 py-1 rounded-full border ${
// // //                 severityFilter === "critical"
// // //                   ? "bg-red-500 text-white border-red-500"
// // //                   : "bg-slate-50 text-slate-700 border-slate-200"
// // //               }`}
// // //             >
// // //               Critical ({severityCounts.critical})
// // //             </button>
// // //             <button
// // //               onClick={() => toggleSeverity("blocker")}
// // //               className={`px-3 py-1 rounded-full border ${
// // //                 severityFilter === "blocker"
// // //                   ? "bg-gray-600 text-white border-gray-600"
// // //                   : "bg-slate-50 text-slate-700 border-slate-200"
// // //               }`}
// // //             >
// // //               Blocker ({severityCounts.blocker})
// // //             </button>

// // //             {/* Status chips */}
// // //             <button
// // //               onClick={() => toggleStatus("Open/New")}
// // //               className={`px-3 py-1 rounded-full border ${
// // //                 statusFilter === "Open/New"
// // //                   ? "bg-red-500 text-white border-red-500"
// // //                   : "bg-slate-50 text-slate-700 border-slate-200"
// // //               }`}
// // //             >
// // //               Open/New ({statusCounts.openNew})
// // //             </button>
// // //             <button
// // //               onClick={() => toggleStatus("Assigned")}
// // //               className={`px-3 py-1 rounded-full border ${
// // //                 statusFilter === "Assigned"
// // //                   ? "bg-yellow-500 text-white border-yellow-500"
// // //                   : "bg-slate-50 text-slate-700 border-slate-200"
// // //               }`}
// // //             >
// // //               Assigned ({statusCounts.assigned})
// // //             </button>
// // //             <button
// // //               onClick={() => toggleStatus("In-progress")}
// // //               className={`px-3 py-1 rounded-full border ${
// // //                 statusFilter === "In-progress"
// // //                   ? "bg-blue-500 text-white border-blue-500"
// // //                   : "bg-slate-50 text-slate-700 border-slate-200"
// // //               }`}
// // //             >
// // //               In-progress ({statusCounts.inProgress})
// // //             </button>
// // //             <button
// // //               onClick={() => toggleStatus("Fixed")}
// // //               className={`px-3 py-1 rounded-full border ${
// // //                 statusFilter === "Fixed"
// // //                   ? "bg-green-500 text-white border-green-500"
// // //                   : "bg-slate-50 text-slate-700 border-slate-200"
// // //               }`}
// // //             >
// // //               Fixed ({statusCounts.fixed})
// // //             </button>
// // //             <button
// // //               onClick={() => toggleStatus("Re-opened")}
// // //               className={`px-3 py-1 rounded-full border ${
// // //                 statusFilter === "Re-opened"
// // //                   ? "bg-purple-500 text-white border-purple-500"
// // //                   : "bg-slate-50 text-slate-700 border-slate-200"
// // //               }`}
// // //             >
// // //               Re-opened ({statusCounts.reopened})
// // //             </button>
// // //             <button
// // //               onClick={() => toggleStatus("Closed")}
// // //               className={`px-3 py-1 rounded-full border ${
// // //                 statusFilter === "Closed"
// // //                   ? "bg-gray-500 text-white border-gray-500"
// // //                   : "bg-slate-50 text-slate-700 border-slate-200"
// // //               }`}
// // //             >
// // //               Closed ({statusCounts.closed})
// // //             </button>

// // //             {/* All statuses */}
// // //             <button
// // //               onClick={() => setStatusFilter("all")}
// // //               className={`px-3 py-1 rounded-full border ${
// // //                 statusFilter === "all"
// // //                   ? "bg-slate-800 text-white border-slate-800"
// // //                   : "bg-slate-50 text-slate-700 border-slate-200"
// // //               }`}
// // //             >
// // //               All Statuses
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* Defects Display */}
// // //         <div className="mt-6">
// // //           {/* GRID VIEW */}
// // //           {view === "grid" && (
// // //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
// // //               {filteredDefects.map((defect) => (
// // //                 <Link
// // //                   to={`/single-project/${projectId}/defect/${defect._id}`}
// // //                   key={defect._id}
// // //                   className="flex flex-col items-start bg-white rounded-lg shadow p-2"
// // //                 >
// // //                   <img
// // //                     src={getImageUrl(defect.bug_picture)}
// // //                     alt={defect.test_case_name}
// // //                     className="w-full h-28 object-cover rounded-md"
// // //                   />
// // //                   <h3 className="mt-2 text-xs font-semibold text-gray-800 line-clamp-2">
// // //                     {defect.test_case_name || "Untitled Defect"}
// // //                   </h3>
// // //                   <p className="text-[10px] text-gray-600">
// // //                     Module: {defect.module_name || "-"}
// // //                   </p>
// // //                   <p
// // //                     className={`mt-1 text-[10px] px-1.5 py-0.5 rounded ${getStatusColor(
// // //                       defect.status
// // //                     )}`}
// // //                   >
// // //                     {defect.status || "Unknown"}
// // //                   </p>
// // //                 </Link>
// // //               ))}
// // //               {!filteredDefects.length && (
// // //                 <div className="col-span-full text-sm text-slate-500">
// // //                   No defects match your filters.
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )}

// // //           {/* CARD VIEW */}
// // //           {view === "card" && (
// // //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// // //               {filteredDefects.map((defect) => (
// // //                 <Link
// // //                   to={`/single-project/${projectId}/defect/${defect._id}`}
// // //                   key={defect._id}
// // //                   className="bg-white rounded-lg shadow p-3 flex flex-col"
// // //                 >
// // //                   <img
// // //                     src={getImageUrl(defect.bug_picture)}
// // //                     alt={defect.test_case_name}
// // //                     className="w-full h-32 object-cover rounded-md"
// // //                   />
// // //                   <h3 className="mt-2 text-sm font-semibold text-gray-800 line-clamp-2">
// // //                     {defect.test_case_name || "Untitled Defect"}
// // //                   </h3>
// // //                   <p className="text-xs text-gray-600">
// // //                     Test Case: {defect.test_case_number || "-"}
// // //                   </p>
// // //                   <p className="text-xs text-gray-600">
// // //                     Module: {defect.module_name || "-"}
// // //                   </p>
// // //                   <div className="mt-1 flex flex-wrap gap-1 text-[9px]">
// // //                     {defect.priority && (
// // //                       <span
// // //                         className={`px-1.5 py-0.5 rounded ${
// // //                           priorityColors[
// // //                             (defect.priority || "").toLowerCase()
// // //                           ] || "bg-slate-200 text-slate-800"
// // //                         }`}
// // //                       >
// // //                         Priority: {defect.priority}
// // //                       </span>
// // //                     )}
// // //                     {defect.severity && (
// // //                       <span
// // //                         className={`px-1.5 py-0.5 rounded ${
// // //                           severityColors[
// // //                             (defect.severity || "").toLowerCase()
// // //                           ] || "bg-slate-200 text-slate-800"
// // //                         }`}
// // //                       >
// // //                         Severity: {defect.severity}
// // //                       </span>
// // //                     )}
// // //                     <span
// // //                       className={`px-1.5 py-0.5 rounded ${getStatusColor(
// // //                         defect.status
// // //                       )}`}
// // //                     >
// // //                       {defect.status || "Unknown"}
// // //                     </span>
// // //                   </div>
// // //                 </Link>
// // //               ))}
// // //               {!filteredDefects.length && (
// // //                 <div className="col-span-full text-sm text-slate-500">
// // //                   No defects match your filters.
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )}

// // //           {/* LIST VIEW */}
// // //           {view === "list" && (
// // //             <div className="mt-4 space-y-3">
// // //               {filteredDefects.map((defect) => (
// // //                 <div
// // //                   key={defect._id}
// // //                   className="flex items-center justify-between bg-white rounded-lg shadow p-3 gap-3"
// // //                 >
// // //                   <div className="flex items-center gap-3 flex-1">
// // //                     <div className="w-14 h-14 flex-shrink-0">
// // //                       <img
// // //                         src={getImageUrl(defect.bug_picture)}
// // //                         alt={defect.test_case_name}
// // //                         className="w-full h-full object-cover rounded-md"
// // //                       />
// // //                     </div>

// // //                     <div className="flex flex-col flex-1 gap-1 text-xs">
// // //                       <div className="flex gap-2">
// // //                         <div className="w-1/3">
// // //                           <div className="text-[10px] text-gray-500">
// // //                             Test Case Name
// // //                           </div>
// // //                           <div className="font-semibold text-gray-800 line-clamp-2">
// // //                             {defect.test_case_name || "-"}
// // //                           </div>
// // //                         </div>
// // //                         <div className="w-1/5">
// // //                           <div className="text-[10px] text-gray-500">
// // //                             Test Case #
// // //                           </div>
// // //                           <div className="text-gray-800">
// // //                             {defect.test_case_number || "-"}
// // //                           </div>
// // //                         </div>
// // //                         <div className="w-1/5">
// // //                           <div className="text-[10px] text-gray-500">
// // //                             Module
// // //                           </div>
// // //                           <div className="text-gray-800">
// // //                             {defect.module_name || "-"}
// // //                           </div>
// // //                         </div>
// // //                         <div className="w-1/5">
// // //                           <div className="text-[10px] text-gray-500">
// // //                             Priority / Severity
// // //                           </div>
// // //                           <div className="text-gray-800">
// // //                             {(defect.priority || "-") +
// // //                               " / " +
// // //                               (defect.severity || "-")}
// // //                           </div>
// // //                         </div>
// // //                       </div>

// // //                       <div className="flex items-center gap-2 mt-1">
// // //                         <span
// // //                           className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(
// // //                             defect.status
// // //                           )}`}
// // //                         >
// // //                           {defect.status || "Unknown"}
// // //                         </span>
// // //                       </div>
// // //                     </div>
// // //                   </div>

// // //                   <div className="flex flex-col items-end gap-1 text-[10px]">
// // //                     <Link
// // //                       to={`/single-project/${projectId}/defect/${defect._id}`}
// // //                       className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
// // //                       title="View defect"
// // //                     >
// // //                       <FaEye className="text-sm" />
// // //                       <span>View</span>
// // //                     </Link>
// // //                     <Link
// // //                       to={`/bug-history/${defect._id}`}
// // //                       className="text-gray-600 hover:text-gray-900"
// // //                     >
// // //                       Bug History
// // //                     </Link>
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //               {!filteredDefects.length && (
// // //                 <div className="text-sm text-slate-500">
// // //                   No defects match your filters.
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // //

// // //

// // //
// // //

// // import React, { useEffect, useMemo, useState } from "react";
// // import axios from "axios";
// // import {
// //   FaThList,
// //   FaThLarge,
// //   FaTh,
// //   FaSearch,
// //   FaEye,
// //   FaSort,
// // } from "react-icons/fa";
// // import { useParams, Link } from "react-router-dom";
// // import globalBackendRoute from "../../config/Config";

// // /* ---------- Search utils (aligned with other pages) ---------- */
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
// //   "named",
// //   "called",
// //   "bug",
// //   "bugs",
// //   "defect",
// //   "defects",
// //   "issue",
// //   "issues",
// // ]);

// // const norm = (s = "") =>
// //   String(s)
// //     .toLowerCase()
// //     .normalize("NFD")
// //     .replace(/[\u0300-\u036f]/g, ""); // strip accents

// // const tokenize = (raw) => {
// //   const trimmed = String(raw || "").trim();
// //   if (!trimmed) return [];
// //   return trimmed
// //     .split(/\s+/)
// //     .map(norm)
// //     .filter(Boolean)
// //     .filter((t) => !STOP_WORDS.has(t));
// // };
// // /* ------------------------------------------------------------ */

// // const priorityColors = {
// //   low: "bg-teal-200 text-teal-800",
// //   medium: "bg-yellow-200 text-yellow-800",
// //   high: "bg-red-200 text-red-800",
// // };

// // const severityColors = {
// //   minor: "bg-purple-200 text-purple-800",
// //   major: "bg-orange-200 text-orange-800",
// //   critical: "bg-red-300 text-red-800",
// //   blocker: "bg-gray-400 text-gray-800",
// // };

// // const statusColors = {
// //   "Open/New": "bg-red-200 text-red-800",
// //   Assigned: "bg-yellow-200 text-yellow-800",
// //   "In-progress": "bg-blue-200 text-blue-800",
// //   Fixed: "bg-green-200 text-green-800",
// //   "Re-opened": "bg-purple-200 text-purple-800",
// //   Closed: "bg-gray-300 text-gray-800",
// // };

// // const getStatusColor = (status) =>
// //   statusColors[status] || "bg-gray-100 text-gray-800";

// // const getImageUrl = (bugImage) => {
// //   if (bugImage) {
// //     const normalizedPath = String(bugImage)
// //       .replace(/\\/g, "/")
// //       .split("uploads/")
// //       .pop();
// //     return `${globalBackendRoute}/uploads/${normalizedPath}`;
// //   }
// //   return "https://via.placeholder.com/150";
// // };

// // export default function AllDefects() {
// //   const { projectId } = useParams();

// //   // auth
// //   const token =
// //     localStorage.getItem("userToken") || localStorage.getItem("token") || "";
// //   const authHeader = useMemo(
// //     () => (token ? { Authorization: `Bearer ${token}` } : undefined),
// //     [token]
// //   );

// //   const [defects, setDefects] = useState([]);
// //   const [view, setView] = useState("list"); // default LIST view
// //   const [projectName, setProjectName] = useState("");

// //   const [searchQuery, setSearchQuery] = useState(""); // raw
// //   const [debouncedQuery, setDebouncedQuery] = useState("");

// //   const [sortOrder, setSortOrder] = useState("desc"); // desc = latest first

// //   // Filters
// //   const [priorityFilter, setPriorityFilter] = useState("all"); // low|medium|high|all
// //   const [severityFilter, setSeverityFilter] = useState("all"); // minor|major|critical|blocker|all
// //   const [statusFilter, setStatusFilter] = useState("all"); // status or all

// //   // Summary counts
// //   const [priorityCounts, setPriorityCounts] = useState({
// //     low: 0,
// //     medium: 0,
// //     high: 0,
// //   });
// //   const [severityCounts, setSeverityCounts] = useState({
// //     minor: 0,
// //     major: 0,
// //     critical: 0,
// //     blocker: 0,
// //   });
// //   const [statusCounts, setStatusCounts] = useState({
// //     openNew: 0,
// //     assigned: 0,
// //     inProgress: 0,
// //     fixed: 0,
// //     reopened: 0,
// //     closed: 0,
// //   });

// //   // ---- Fetch defects ----
// //   useEffect(() => {
// //     const fetchDefects = async () => {
// //       try {
// //         const response = await axios.get(
// //           `${globalBackendRoute}/api/single-project/${projectId}/all-defects`,
// //           { headers: authHeader }
// //         );
// //         const defectsData = Array.isArray(response.data)
// //           ? response.data
// //           : response.data?.defects || [];
// //         setDefects(defectsData);

// //         // Project name (best-effort from defects)
// //         if (defectsData.length) {
// //           const any = defectsData[0];
// //           const pName =
// //             any?.project?.project_name ||
// //             any?.project_name ||
// //             any?.projectTitle ||
// //             "";
// //           if (pName) setProjectName(pName);
// //         }

// //         // Init counts from full dataset
// //         const _priority = { low: 0, medium: 0, high: 0 };
// //         const _severity = { minor: 0, major: 0, critical: 0, blocker: 0 };
// //         const _status = {
// //           openNew: 0,
// //           assigned: 0,
// //           inProgress: 0,
// //           fixed: 0,
// //           reopened: 0,
// //           closed: 0,
// //         };

// //         defectsData.forEach((d) => {
// //           const p = (d.priority || "").toLowerCase();
// //           if (_priority[p] !== undefined) _priority[p] += 1;

// //           const s = (d.severity || "").toLowerCase();
// //           if (_severity[s] !== undefined) _severity[s] += 1;

// //           switch (d.status) {
// //             case "Open/New":
// //               _status.openNew += 1;
// //               break;
// //             case "Assigned":
// //               _status.assigned += 1;
// //               break;
// //             case "In-progress":
// //               _status.inProgress += 1;
// //               break;
// //             case "Fixed":
// //               _status.fixed += 1;
// //               break;
// //             case "Re-opened":
// //               _status.reopened += 1;
// //               break;
// //             case "Closed":
// //               _status.closed += 1;
// //               break;
// //             default:
// //               break;
// //           }
// //         });

// //         setPriorityCounts(_priority);
// //         setSeverityCounts(_severity);
// //         setStatusCounts(_status);
// //       } catch (error) {
// //         console.error("Error fetching defects:", error);
// //         setDefects([]);
// //       }
// //     };
// //     fetchDefects();
// //   }, [projectId, authHeader]);

// //   // ---- Debounce search ----
// //   useEffect(() => {
// //     const t = setTimeout(() => setDebouncedQuery(searchQuery), 180);
// //     return () => clearTimeout(t);
// //   }, [searchQuery]);

// //   // ---- Combined filter + sort ----
// //   const filteredDefects = useMemo(() => {
// //     const tokens = tokenize(debouncedQuery);

// //     let rows = defects.filter((d) => {
// //       // Priority filter
// //       if (priorityFilter !== "all") {
// //         const p = (d.priority || "").toLowerCase();
// //         if (p !== priorityFilter) return false;
// //       }

// //       // Severity filter
// //       if (severityFilter !== "all") {
// //         const s = (d.severity || "").toLowerCase();
// //         if (s !== severityFilter) return false;
// //       }

// //       // Status filter
// //       if (statusFilter !== "all") {
// //         if ((d.status || "") !== statusFilter) return false;
// //       }

// //       // Search filter
// //       if (!tokens.length) return true;

// //       const hay = norm(
// //         [
// //           d.test_case_name || "",
// //           d.test_case_number || "",
// //           d.module_name || "",
// //           d.status || "",
// //           d.priority || "",
// //           d.severity || "",
// //           d.bug_id || "",
// //           d.bug_title || "",
// //           d.bug_summary || "",
// //           d.bug_description || "",
// //         ].join(" ")
// //       );

// //       return tokens.some((t) => hay.includes(t));
// //     });

// //     // Sort by createdAt (newest / oldest)
// //     rows = rows.slice().sort((a, b) => {
// //       const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
// //       const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
// //       return sortOrder === "asc" ? da - db : db - da;
// //     });

// //     return rows;
// //   }, [
// //     defects,
// //     debouncedQuery,
// //     priorityFilter,
// //     severityFilter,
// //     statusFilter,
// //     sortOrder,
// //   ]);

// //   // ---- Filter helpers ----
// //   const togglePriority = (val) =>
// //     setPriorityFilter((prev) => (prev === val ? "all" : val));
// //   const toggleSeverity = (val) =>
// //     setSeverityFilter((prev) => (prev === val ? "all" : val));
// //   const toggleStatus = (val) =>
// //     setStatusFilter((prev) => (prev === val ? "all" : val));

// //   const clearAllFilters = () => {
// //     setPriorityFilter("all");
// //     setSeverityFilter("all");
// //     setStatusFilter("all");
// //     setSearchQuery("");
// //   };

// //   const totalDefects = defects.length;
// //   const filteredCount = filteredDefects.length;

// //   return (
// //     <div className="bg-white py-10 sm:py-12">
// //       <div className="mx-auto container px-2 sm:px-3 lg:px-4">
// //         {/* Header / Controls */}
// //         <div className="flex justify-between items-center gap-3 flex-wrap">
// //           <div>
// //             <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
// //               All Defects for Project: {projectName || projectId}
// //             </h2>
// //             <p className="text-xs text-gray-600 mt-1">
// //               Total Defects: {totalDefects}
// //             </p>
// //             {(searchQuery ||
// //               priorityFilter !== "all" ||
// //               severityFilter !== "all" ||
// //               statusFilter !== "all") && (
// //               <p className="text-xs text-gray-600">
// //                 Showing {filteredCount} result(s)
// //                 {searchQuery && <> for “{searchQuery}”</>}
// //                 {priorityFilter !== "all" && <> · Priority: {priorityFilter}</>}
// //                 {severityFilter !== "all" && <> · Severity: {severityFilter}</>}
// //                 {statusFilter !== "all" && <> · Status: {statusFilter}</>}
// //               </p>
// //             )}

// //             {/* Quick summary pills */}
// //             <p className="text-[11px] text-slate-600 mt-1 flex flex-wrap gap-1">
// //               <span
// //                 className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${priorityColors.low}`}
// //               >
// //                 Low: {priorityCounts.low}
// //               </span>
// //               <span
// //                 className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${priorityColors.medium}`}
// //               >
// //                 Medium: {priorityCounts.medium}
// //               </span>
// //               <span
// //                 className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${priorityColors.high}`}
// //               >
// //                 High: {priorityCounts.high}
// //               </span>

// //               <span
// //                 className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${severityColors.minor}`}
// //               >
// //                 Minor: {severityCounts.minor}
// //               </span>
// //               <span
// //                 className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${severityColors.major}`}
// //               >
// //                 Major: {severityCounts.major}
// //               </span>
// //               <span
// //                 className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${severityColors.critical}`}
// //               >
// //                 Critical: {severityCounts.critical}
// //               </span>
// //               <span
// //                 className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${severityColors.blocker}`}
// //               >
// //                 Blocker: {severityCounts.blocker}
// //               </span>
// //             </p>
// //           </div>

// //           {/* Right controls: views + search + sort + dashboard */}
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

// //             {/* Search */}
// //             <div className="relative">
// //               <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
// //               <input
// //                 type="text"
// //                 className="pl-9 pr-3 py-1.5 text-sm border rounded-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
// //                 placeholder="Search defects (module, status, text...)"
// //                 value={searchQuery}
// //                 onChange={(e) => setSearchQuery(e.target.value)}
// //                 spellCheck={false}
// //               />
// //             </div>

// //             {/* Sort newest/oldest */}
// //             <button
// //               onClick={() =>
// //                 setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
// //               }
// //               className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-xs sm:text-sm inline-flex items-center"
// //               title="Sort by created date"
// //             >
// //               <FaSort className="mr-1" />
// //               {sortOrder === "asc" ? "Oldest first" : "Newest first"}
// //             </button>

// //             {/* Clear filters */}
// //             <button
// //               onClick={clearAllFilters}
// //               className="px-2.5 py-1.5 border border-slate-300 text-[10px] sm:text-xs rounded-md hover:bg-slate-50"
// //               title="Clear all filters & search"
// //             >
// //               Clear
// //             </button>

// //             {/* Project Dashboard */}
// //             <Link
// //               to={`/single-project/${projectId}`}
// //               className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-xs sm:text-sm"
// //             >
// //               Project Dashboard
// //             </Link>
// //           </div>
// //         </div>

// //         {/* Filter chips row */}
// //         <div className="mt-4">
// //           <div className="flex items-center justify-between mb-2">
// //             <h3 className="text-xs font-semibold text-slate-700">
// //               Filter by Priority / Severity / Status
// //             </h3>
// //           </div>

// //           <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 text-[11px]">
// //             {/* Priority chips */}
// //             <button
// //               onClick={() => togglePriority("low")}
// //               className={`px-3 py-1 rounded-full border ${
// //                 priorityFilter === "low"
// //                   ? "bg-teal-500 text-white border-teal-500"
// //                   : "bg-slate-50 text-slate-700 border-slate-200"
// //               }`}
// //             >
// //               Low ({priorityCounts.low})
// //             </button>
// //             <button
// //               onClick={() => togglePriority("medium")}
// //               className={`px-3 py-1 rounded-full border ${
// //                 priorityFilter === "medium"
// //                   ? "bg-yellow-500 text-white border-yellow-500"
// //                   : "bg-slate-50 text-slate-700 border-slate-200"
// //               }`}
// //             >
// //               Medium ({priorityCounts.medium})
// //             </button>
// //             <button
// //               onClick={() => togglePriority("high")}
// //               className={`px-3 py-1 rounded-full border ${
// //                 priorityFilter === "high"
// //                   ? "bg-red-500 text-white border-red-500"
// //                   : "bg-slate-50 text-slate-700 border-slate-200"
// //               }`}
// //             >
// //               High ({priorityCounts.high})
// //             </button>

// //             {/* Severity chips */}
// //             <button
// //               onClick={() => toggleSeverity("minor")}
// //               className={`px-3 py-1 rounded-full border ${
// //                 severityFilter === "minor"
// //                   ? "bg-purple-500 text-white border-purple-500"
// //                   : "bg-slate-50 text-slate-700 border-slate-200"
// //               }`}
// //             >
// //               Minor ({severityCounts.minor})
// //             </button>
// //             <button
// //               onClick={() => toggleSeverity("major")}
// //               className={`px-3 py-1 rounded-full border ${
// //                 severityFilter === "major"
// //                   ? "bg-orange-500 text-white border-orange-500"
// //                   : "bg-slate-50 text-slate-700 border-slate-200"
// //               }`}
// //             >
// //               Major ({severityCounts.major})
// //             </button>
// //             <button
// //               onClick={() => toggleSeverity("critical")}
// //               className={`px-3 py-1 rounded-full border ${
// //                 severityFilter === "critical"
// //                   ? "bg-red-500 text-white border-red-500"
// //                   : "bg-slate-50 text-slate-700 border-slate-200"
// //               }`}
// //             >
// //               Critical ({severityCounts.critical})
// //             </button>
// //             <button
// //               onClick={() => toggleSeverity("blocker")}
// //               className={`px-3 py-1 rounded-full border ${
// //                 severityFilter === "blocker"
// //                   ? "bg-gray-600 text-white border-gray-600"
// //                   : "bg-slate-50 text-slate-700 border-slate-200"
// //               }`}
// //             >
// //               Blocker ({severityCounts.blocker})
// //             </button>

// //             {/* Status chips */}
// //             <button
// //               onClick={() => toggleStatus("Open/New")}
// //               className={`px-3 py-1 rounded-full border ${
// //                 statusFilter === "Open/New"
// //                   ? "bg-red-500 text-white border-red-500"
// //                   : "bg-slate-50 text-slate-700 border-slate-200"
// //               }`}
// //             >
// //               Open/New ({statusCounts.openNew})
// //             </button>
// //             <button
// //               onClick={() => toggleStatus("Assigned")}
// //               className={`px-3 py-1 rounded-full border ${
// //                 statusFilter === "Assigned"
// //                   ? "bg-yellow-500 text-white border-yellow-500"
// //                   : "bg-slate-50 text-slate-700 border-slate-200"
// //               }`}
// //             >
// //               Assigned ({statusCounts.assigned})
// //             </button>
// //             <button
// //               onClick={() => toggleStatus("In-progress")}
// //               className={`px-3 py-1 rounded-full border ${
// //                 statusFilter === "In-progress"
// //                   ? "bg-blue-500 text-white border-blue-500"
// //                   : "bg-slate-50 text-slate-700 border-slate-200"
// //               }`}
// //             >
// //               In-progress ({statusCounts.inProgress})
// //             </button>
// //             <button
// //               onClick={() => toggleStatus("Fixed")}
// //               className={`px-3 py-1 rounded-full border ${
// //                 statusFilter === "Fixed"
// //                   ? "bg-green-500 text-white border-green-500"
// //                   : "bg-slate-50 text-slate-700 border-slate-200"
// //               }`}
// //             >
// //               Fixed ({statusCounts.fixed})
// //             </button>
// //             <button
// //               onClick={() => toggleStatus("Re-opened")}
// //               className={`px-3 py-1 rounded-full border ${
// //                 statusFilter === "Re-opened"
// //                   ? "bg-purple-500 text-white border-purple-500"
// //                   : "bg-slate-50 text-slate-700 border-slate-200"
// //               }`}
// //             >
// //               Re-opened ({statusCounts.reopened})
// //             </button>
// //             <button
// //               onClick={() => toggleStatus("Closed")}
// //               className={`px-3 py-1 rounded-full border ${
// //                 statusFilter === "Closed"
// //                   ? "bg-gray-500 text-white border-gray-500"
// //                   : "bg-slate-50 text-slate-700 border-slate-200"
// //               }`}
// //             >
// //               Closed ({statusCounts.closed})
// //             </button>

// //             {/* All statuses */}
// //             <button
// //               onClick={() => setStatusFilter("all")}
// //               className={`px-3 py-1 rounded-full border ${
// //                 statusFilter === "all"
// //                   ? "bg-slate-800 text-white border-slate-800"
// //                   : "bg-slate-50 text-slate-700 border-slate-200"
// //               }`}
// //             >
// //               All Statuses
// //             </button>
// //           </div>
// //         </div>

// //         {/* LIST VIEW (default, AllTestCases-style) */}
// //         {view === "list" && (
// //           <div className="mt-5">
// //             {/* Header row */}
// //             <div className="grid grid-cols-[56px,1.4fr,1.1fr,1fr,0.9fr,0.9fr,0.9fr,60px] items-center text-[11px] sm:text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200">
// //               <div>#</div>
// //               <div>Defect / Bug Title</div>
// //               <div>Test Case</div>
// //               <div>Module</div>
// //               <div>Priority</div>
// //               <div>Severity</div>
// //               <div>Status</div>
// //               <div className="text-center">View</div>
// //             </div>

// //             {/* Rows */}
// //             <div className="divide-y divide-slate-200">
// //               {filteredDefects.map((defect, idx) => {
// //                 const pKey = (defect.priority || "").toLowerCase();
// //                 const sKey = (defect.severity || "").toLowerCase();
// //                 const statusClass = getStatusColor(defect.status);

// //                 return (
// //                   <div
// //                     key={defect._id}
// //                     className="grid grid-cols-[56px,1.4fr,1.1fr,1fr,0.9fr,0.9fr,0.9fr,60px] items-center text-[10px] sm:text-[12px] px-3 py-2"
// //                   >
// //                     {/* # */}
// //                     <div className="text-slate-700">{idx + 1}</div>

// //                     {/* Defect / Bug Title */}
// //                     <div className="text-slate-900 font-medium line-clamp-2 pr-2">
// //                       {defect.test_case_name ||
// //                         defect.bug_title ||
// //                         defect.bug_summary ||
// //                         "Untitled Defect"}
// //                     </div>

// //                     {/* Test Case */}
// //                     <div className="text-slate-700 truncate pr-2">
// //                       {defect.test_case_number || "-"}
// //                     </div>

// //                     {/* Module */}
// //                     <div className="truncate pr-2">
// //                       <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[9px] font-medium text-indigo-700">
// //                         {defect.module_name || "Unassigned"}
// //                       </span>
// //                     </div>

// //                     {/* Priority */}
// //                     <div className="pr-2">
// //                       {defect.priority ? (
// //                         <span
// //                           className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] ${
// //                             priorityColors[pKey] ||
// //                             "bg-slate-200 text-slate-800"
// //                           }`}
// //                         >
// //                           {defect.priority}
// //                         </span>
// //                       ) : (
// //                         <span className="text-slate-500 text-[9px]">-</span>
// //                       )}
// //                     </div>

// //                     {/* Severity */}
// //                     <div className="pr-2">
// //                       {defect.severity ? (
// //                         <span
// //                           className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] ${
// //                             severityColors[sKey] ||
// //                             "bg-slate-200 text-slate-800"
// //                           }`}
// //                         >
// //                           {defect.severity}
// //                         </span>
// //                       ) : (
// //                         <span className="text-slate-500 text-[9px]">-</span>
// //                       )}
// //                     </div>

// //                     {/* Status */}
// //                     <div className="pr-2">
// //                       <span
// //                         className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold ${statusClass}`}
// //                       >
// //                         {defect.status || "Unknown"}
// //                       </span>
// //                     </div>

// //                     {/* View */}
// //                     <div className="flex justify-center">
// //                       <Link
// //                         to={`/single-project/${projectId}/defect/${defect._id}`}
// //                         className="text-indigo-600 hover:text-indigo-800"
// //                         title="View defect"
// //                       >
// //                         <FaEye className="text-sm" />
// //                       </Link>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //               {!filteredDefects.length && (
// //                 <div className="px-3 py-4 text-sm text-slate-500">
// //                   No defects match your filters.
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         )}

// //         {/* GRID VIEW */}
// //         {view === "grid" && (
// //           <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
// //             {filteredDefects.map((defect) => (
// //               <Link
// //                 to={`/single-project/${projectId}/defect/${defect._id}`}
// //                 key={defect._id}
// //                 className="flex flex-col items-start bg-white rounded-lg shadow p-2"
// //               >
// //                 <img
// //                   src={getImageUrl(defect.bug_picture)}
// //                   alt={defect.test_case_name}
// //                   className="w-full h-28 object-cover rounded-md"
// //                 />
// //                 <h3 className="mt-2 text-xs font-semibold text-gray-800 line-clamp-2">
// //                   {defect.test_case_name ||
// //                     defect.bug_title ||
// //                     defect.bug_summary ||
// //                     "Untitled Defect"}
// //                 </h3>
// //                 <p className="text-[10px] text-gray-600">
// //                   Module: {defect.module_name || "-"}
// //                 </p>
// //                 <p
// //                   className={`mt-1 text-[10px] px-1.5 py-0.5 rounded ${getStatusColor(
// //                     defect.status
// //                   )}`}
// //                 >
// //                   {defect.status || "Unknown"}
// //                 </p>
// //               </Link>
// //             ))}
// //             {!filteredDefects.length && (
// //               <div className="col-span-full text-sm text-slate-500">
// //                 No defects match your filters.
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* CARD VIEW */}
// //         {view === "card" && (
// //           <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //             {filteredDefects.map((defect) => (
// //               <Link
// //                 to={`/single-project/${projectId}/defect/${defect._id}`}
// //                 key={defect._id}
// //                 className="bg-white rounded-lg shadow p-3 flex flex-col"
// //               >
// //                 <img
// //                   src={getImageUrl(defect.bug_picture)}
// //                   alt={defect.test_case_name}
// //                   className="w-full h-32 object-cover rounded-md"
// //                 />
// //                 <h3 className="mt-2 text-sm font-semibold text-gray-800 line-clamp-2">
// //                   {defect.test_case_name ||
// //                     defect.bug_title ||
// //                     defect.bug_summary ||
// //                     "Untitled Defect"}
// //                 </h3>
// //                 <p className="text-xs text-gray-600">
// //                   Test Case: {defect.test_case_number || "-"}
// //                 </p>
// //                 <p className="text-xs text-gray-600">
// //                   Module: {defect.module_name || "-"}
// //                 </p>
// //                 <div className="mt-1 flex flex-wrap gap-1 text-[9px]">
// //                   {defect.priority && (
// //                     <span
// //                       className={`px-1.5 py-0.5 rounded ${
// //                         priorityColors[(defect.priority || "").toLowerCase()] ||
// //                         "bg-slate-200 text-slate-800"
// //                       }`}
// //                     >
// //                       Priority: {defect.priority}
// //                     </span>
// //                   )}
// //                   {defect.severity && (
// //                     <span
// //                       className={`px-1.5 py-0.5 rounded ${
// //                         severityColors[(defect.severity || "").toLowerCase()] ||
// //                         "bg-slate-200 text-slate-800"
// //                       }`}
// //                     >
// //                       Severity: {defect.severity}
// //                     </span>
// //                   )}
// //                   <span
// //                     className={`px-1.5 py-0.5 rounded ${getStatusColor(
// //                       defect.status
// //                     )}`}
// //                   >
// //                     {defect.status || "Unknown"}
// //                   </span>
// //                 </div>
// //               </Link>
// //             ))}
// //             {!filteredDefects.length && (
// //               <div className="col-span-full text-sm text-slate-500">
// //                 No defects match your filters.
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// //

// // src/pages/defects/AllDefects.jsx

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
//   FaEye,
// } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import globalBackendRoute from "../../config/Config";

// const cls = (...a) => a.filter(Boolean).join(" ");

// /* ---------- Search utils (aligned with your style) ---------- */
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
// /* ------------------------------------------------------------ */

// const priorityColors = {
//   low: "bg-teal-100 text-teal-700",
//   medium: "bg-yellow-100 text-yellow-700",
//   high: "bg-red-100 text-red-700",
// };

// const severityColors = {
//   minor: "bg-purple-100 text-purple-700",
//   major: "bg-orange-100 text-orange-700",
//   critical: "bg-red-100 text-red-700",
//   blocker: "bg-slate-300 text-slate-800",
// };

// const statusColors = {
//   "Open/New": "bg-red-100 text-red-700",
//   Assigned: "bg-yellow-100 text-yellow-700",
//   "In-progress": "bg-blue-100 text-blue-700",
//   Fixed: "bg-green-100 text-green-700",
//   "Re-opened": "bg-purple-100 text-purple-700",
//   Closed: "bg-slate-200 text-slate-800",
// };

// const getStatusBadge = (status) =>
//   statusColors[status] || "bg-slate-100 text-slate-700";

// const getIdSafe = (x) => {
//   if (!x) return "";
//   if (typeof x === "string") return x;
//   if (typeof x === "object") return String(x._id || x.id || x);
//   return String(x);
// };

// export default function AllDefects() {
//   const { projectId } = useParams();
//   const api = `${globalBackendRoute}/api`;

//   // -------- auth --------
//   const token =
//     localStorage.getItem("userToken") || localStorage.getItem("token") || "";
//   const authHeader = useMemo(
//     () => (token ? { Authorization: `Bearer ${token}` } : undefined),
//     [token]
//   );

//   // ---------- state ----------
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadErr, setLoadErr] = useState("");
//   const [projectName, setProjectName] = useState("");

//   // View & paging
//   const [sortOrder, setSortOrder] = useState("desc"); // by createdAt
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10); // rows per page

//   // Filters
//   const [search, setSearch] = useState("");
//   const [priorityFilter, setPriorityFilter] = useState(""); // "", "low", "medium", "high"
//   const [severityFilter, setSeverityFilter] = useState(""); // "", "minor", ...
//   const [statusFilter, setStatusFilter] = useState(""); // "", exact status

//   // Counts
//   const [priorityCounts, setPriorityCounts] = useState({
//     low: 0,
//     medium: 0,
//     high: 0,
//   });
//   const [severityCounts, setSeverityCounts] = useState({
//     minor: 0,
//     major: 0,
//     critical: 0,
//     blocker: 0,
//   });
//   const [statusCounts, setStatusCounts] = useState({
//     openNew: 0,
//     assigned: 0,
//     inProgress: 0,
//     fixed: 0,
//     reopened: 0,
//     closed: 0,
//   });

//   // ---------- fetch defects ----------
//   const fetchAll = async () => {
//     try {
//       setLoading(true);
//       setLoadErr("");

//       const res = await axios.get(
//         `${api}/single-project/${projectId}/all-defects`,
//         { headers: authHeader }
//       );

//       const arr = Array.isArray(res.data)
//         ? res.data
//         : Array.isArray(res.data?.defects)
//         ? res.data.defects
//         : [];

//       setRows(arr);

//       // Try to get project name from any defect
//       if (arr.length) {
//         const any = arr[0];
//         const nameCandidate =
//           any?.project?.project_name ||
//           any?.project_name ||
//           any?.projectTitle ||
//           "";
//         if (nameCandidate) setProjectName(nameCandidate);
//       }

//       // counts
//       const p = { low: 0, medium: 0, high: 0 };
//       const sv = { minor: 0, major: 0, critical: 0, blocker: 0 };
//       const st = {
//         openNew: 0,
//         assigned: 0,
//         inProgress: 0,
//         fixed: 0,
//         reopened: 0,
//         closed: 0,
//       };

//       for (const d of arr) {
//         const pr = (d.priority || "").toLowerCase();
//         if (p[pr] !== undefined) p[pr] += 1;

//         const se = (d.severity || "").toLowerCase();
//         if (sv[se] !== undefined) sv[se] += 1;

//         switch (d.status) {
//           case "Open/New":
//             st.openNew += 1;
//             break;
//           case "Assigned":
//             st.assigned += 1;
//             break;
//           case "In-progress":
//             st.inProgress += 1;
//             break;
//           case "Fixed":
//             st.fixed += 1;
//             break;
//           case "Re-opened":
//             st.reopened += 1;
//             break;
//           case "Closed":
//             st.closed += 1;
//             break;
//           default:
//             break;
//         }
//       }

//       setPriorityCounts(p);
//       setSeverityCounts(sv);
//       setStatusCounts(st);
//     } catch (e) {
//       console.error("Defects load error:", e?.response || e);
//       setLoadErr(e?.response?.data?.message || "Failed to load defects.");
//       setRows([]);
//       setPriorityCounts({ low: 0, medium: 0, high: 0 });
//       setSeverityCounts({ minor: 0, major: 0, critical: 0, blocker: 0 });
//       setStatusCounts({
//         openNew: 0,
//         assigned: 0,
//         inProgress: 0,
//         fixed: 0,
//         reopened: 0,
//         closed: 0,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAll();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [projectId]);

//   // ---------- filter + search + sort ----------
//   const filtered = useMemo(() => {
//     const tokens = tokenize(search);

//     let out = rows.slice();

//     if (priorityFilter) {
//       const want = priorityFilter.toLowerCase();
//       out = out.filter((d) => (d.priority || "").toLowerCase() === want);
//     }

//     if (severityFilter) {
//       const want = severityFilter.toLowerCase();
//       out = out.filter((d) => (d.severity || "").toLowerCase() === want);
//     }

//     if (statusFilter) {
//       out = out.filter((d) => (d.status || "") === statusFilter);
//     }

//     if (tokens.length) {
//       out = out.filter((d) => {
//         const hay = norm(
//           [
//             d.bug_id,
//             d.bug_title,
//             d.bug_summary,
//             d.bug_description,
//             d.test_case_name,
//             d.test_case_number,
//             d.module_name,
//             d.status,
//             d.priority,
//             d.severity,
//             d.assigned_to,
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
//       return sortOrder === "desc" ? bTs - aTs : aTs - bTs;
//     });

//     return out;
//   }, [rows, priorityFilter, severityFilter, statusFilter, search, sortOrder]);

//   // ---------- pagination ----------
//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

//   useEffect(() => {
//     setPage((p) => Math.min(p, totalPages));
//   }, [totalPages]);

//   // ---------- filters helpers ----------
//   const togglePriority = (val) =>
//     setPriorityFilter((prev) => (prev === val ? "" : val));
//   const toggleSeverity = (val) =>
//     setSeverityFilter((prev) => (prev === val ? "" : val));
//   const toggleStatus = (val) =>
//     setStatusFilter((prev) => (prev === val ? "" : val));

//   const clearAllFilters = () => {
//     setPriorityFilter("");
//     setSeverityFilter("");
//     setStatusFilter("");
//     setSearch("");
//     setPage(1);
//   };

//   // ---------- exports (client-side) ----------
//   const exportCSV = () => {
//     if (!filtered.length) {
//       alert("No defects to export.");
//       return;
//     }

//     const data = filtered.map((d) => ({
//       id: d._id,
//       projectId,
//       bugId: d.bug_id || "",
//       title:
//         d.bug_title || d.test_case_name || d.bug_summary || "Untitled Defect",
//       summary: (d.bug_summary || "").replace(/\n/g, " "),
//       description: (d.bug_description || "").replace(/\n/g, " "),
//       module: d.module_name || "",
//       testCaseName: d.test_case_name || "",
//       testCaseNumber: d.test_case_number || "",
//       priority: d.priority || "",
//       severity: d.severity || "",
//       status: d.status || "",
//       assignedTo: d.assigned_to || "",
//       createdAt: d.createdAt
//         ? moment(d.createdAt).format("YYYY-MM-DD HH:mm")
//         : "",
//       updatedAt: d.updatedAt
//         ? moment(d.updatedAt).format("YYYY-MM-DD HH:mm")
//         : "",
//     }));

//     const header = Object.keys(data[0]).join(",");
//     const body = data
//       .map((row) =>
//         Object.values(row)
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
//     a.download = `defects_${projectId}_${moment().format("YYYYMMDD_HHmm")}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const exportXLSX = () => {
//     if (!filtered.length) {
//       alert("No defects to export.");
//       return;
//     }

//     const data = filtered.map((d) => ({
//       ID: d._id,
//       ProjectId: projectId,
//       BugId: d.bug_id || "",
//       Title:
//         d.bug_title || d.test_case_name || d.bug_summary || "Untitled Defect",
//       Summary: (d.bug_summary || "").replace(/\n/g, " "),
//       Description: (d.bug_description || "").replace(/\n/g, " "),
//       Module: d.module_name || "",
//       TestCaseName: d.test_case_name || "",
//       TestCaseNumber: d.test_case_number || "",
//       Priority: d.priority || "",
//       Severity: d.severity || "",
//       Status: d.status || "",
//       AssignedTo: d.assigned_to || "",
//       CreatedAt: d.createdAt
//         ? moment(d.createdAt).format("YYYY-MM-DD HH:mm")
//         : "",
//       UpdatedAt: d.updatedAt
//         ? moment(d.updatedAt).format("YYYY-MM-DD HH:mm")
//         : "",
//     }));

//     const ws = XLSX.utils.json_to_sheet(data, { skipHeader: false });
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Defects");

//     ws["!cols"] = [
//       { wch: 24 },
//       { wch: 16 },
//       { wch: 16 },
//       { wch: 32 },
//       { wch: 40 },
//       { wch: 80 },
//       { wch: 18 },
//       { wch: 26 },
//       { wch: 18 },
//       { wch: 14 },
//       { wch: 14 },
//       { wch: 16 },
//       { wch: 22 },
//       { wch: 22 },
//     ];

//     const filename = `defects_${projectId}_${moment().format(
//       "YYYYMMDD_HHmm"
//     )}.xlsx`;
//     XLSX.writeFile(wb, filename);
//   };

//   // ---------- server XLSX export (adjust endpoint as needed) ----------
//   const exportServerXLSX = async () => {
//     try {
//       const params = new URLSearchParams();
//       if (projectId) params.set("projectId", projectId);
//       if (priorityFilter) params.set("priority", priorityFilter);
//       if (severityFilter) params.set("severity", severityFilter);
//       if (statusFilter) params.set("status", statusFilter);
//       if (search) params.set("search", search);
//       params.set("order", sortOrder);

//       // 🔧 Adjust this endpoint to match your backend route if different:
//       const url = `${api}/defects/export.xlsx?${params.toString()}`;

//       const res = await axios.get(url, {
//         headers: authHeader,
//         responseType: "arraybuffer",
//         validateStatus: () => true,
//       });

//       const ct = (res.headers["content-type"] || "").toLowerCase();
//       const isXlsx = ct.includes(
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//       );

//       if (!isXlsx || res.status < 200 || res.status >= 300) {
//         let msg = `Export failed (status ${res.status}).`;
//         try {
//           const decoder = new TextDecoder("utf-8");
//           const text = decoder.decode(new Uint8Array(res.data || []));
//           try {
//             const j = JSON.parse(text);
//             msg += `\n${j.message || text}`;
//           } catch {
//             msg += `\n${text.slice(0, 400)}`;
//           }
//         } catch {}
//         alert(msg);
//         return;
//       }

//       const blob = new Blob([res.data], { type: ct });
//       const a = document.createElement("a");
//       a.href = URL.createObjectURL(blob);
//       a.download = `defects_${projectId}_${moment().format(
//         "YYYYMMDD_HHmm"
//       )}.xlsx`;
//       a.click();
//       URL.revokeObjectURL(a.href);
//     } catch (e) {
//       console.error("Server export failed:", e);
//       alert(`Server export failed: ${e?.message || e}`);
//     }
//   };

//   // ---------- UI ----------
//   return (
//     <div className="bg-white py-6 sm:py-8 text-[13px]">
//       <div className="mx-auto container px-2 sm:px-3 lg:px-4">
//         {/* Top bar: match attendance layout */}
//         <div className="flex items-center justify-between gap-2 flex-wrap">
//           <div className="min-w-[220px]">
//             <h2 className="font-semibold tracking-tight text-indigo-600 text-[16px]">
//               Defects — {projectName || `Project ${projectId}`}
//             </h2>
//             <div className="text-[11px] text-gray-600">
//               {loading
//                 ? "Loading…"
//                 : `Total: ${rows.length} | Showing: ${filtered.length}`}
//             </div>
//           </div>

//           <div className="flex items-center gap-2 flex-wrap">
//             {/* Sort icon (createdAt asc/desc) */}
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

//             {/* View icons (only list is active; others just visual for consistency) */}
//             <FaThList
//               className={cls("text-lg cursor-pointer text-indigo-600")}
//               title="List"
//             />
//             <FaThLarge
//               className={cls("text-lg text-gray-400 cursor-not-allowed")}
//               title="Card view disabled"
//             />
//             <FaTh
//               className={cls("text-lg text-gray-400 cursor-not-allowed")}
//               title="Grid view disabled"
//             />

//             {/* Search */}
//             <div className="relative">
//               <FaSearch className="absolute left-2 top-2.5 text-gray-400" />
//               <input
//                 className="pl-7 pr-2 py-1.5 border rounded-md w-[240px]"
//                 placeholder="Search defects (title, module, status…)"
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
//                 title="Rows per page"
//               >
//                 {[5, 10, 20, 40, 60, 100].map((n) => (
//                   <option key={n} value={n}>
//                     {n}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Export: client XLSX */}
//             <button
//               onClick={exportXLSX}
//               className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
//               title="Export Excel (filtered, client-side)"
//             >
//               <FaDownload />
//               <span className="hidden sm:inline">Export (Client)</span>
//             </button>

//             {/* Export: server XLSX */}
//             <button
//               onClick={exportServerXLSX}
//               className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
//               title="Export Excel from server"
//             >
//               <FaDownload />
//               <span className="hidden sm:inline">Export (Server)</span>
//             </button>

//             {/* Export: CSV */}
//             <button
//               onClick={exportCSV}
//               className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
//               title="Export CSV (filtered)"
//             >
//               <FaDownload />
//               <span className="hidden sm:inline">Export CSV</span>
//             </button>

//             {/* Refresh */}
//             <button
//               onClick={fetchAll}
//               className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
//               title="Refresh"
//             >
//               <FaSync />
//               <span className="hidden sm:inline">Refresh</span>
//             </button>

//             {/* Back to project dashboard */}
//             <Link
//               to={`/single-project/${projectId}`}
//               className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-[11px]"
//             >
//               Project Dashboard
//             </Link>
//           </div>
//         </div>

//         {/* Filters & chips: Priority / Severity / Status */}
//         <div className="mt-3 space-y-2">
//           <div className="flex items-center justify-between">
//             <h3 className="text-xs font-semibold text-slate-700">
//               Filter by Priority / Severity / Status
//             </h3>
//             <button
//               className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
//               onClick={clearAllFilters}
//             >
//               Clear All Filters
//             </button>
//           </div>

//           {/* Priority chips */}
//           <div className="flex gap-2 overflow-x-auto pb-1 text-[11px]">
//             <button
//               onClick={() => {
//                 togglePriority("low");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 priorityFilter === "low"
//                   ? "bg-teal-500 text-white border-teal-500"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               Low ({priorityCounts.low})
//             </button>
//             <button
//               onClick={() => {
//                 togglePriority("medium");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 priorityFilter === "medium"
//                   ? "bg-yellow-500 text-white border-yellow-500"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               Medium ({priorityCounts.medium})
//             </button>
//             <button
//               onClick={() => {
//                 togglePriority("high");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 priorityFilter === "high"
//                   ? "bg-red-500 text-white border-red-500"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               High ({priorityCounts.high})
//             </button>
//           </div>

//           {/* Severity chips */}
//           <div className="flex gap-2 overflow-x-auto pb-1 text-[11px]">
//             <button
//               onClick={() => {
//                 toggleSeverity("minor");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 severityFilter === "minor"
//                   ? "bg-purple-500 text-white border-purple-500"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               Minor ({severityCounts.minor})
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
//               Major ({severityCounts.major})
//             </button>
//             <button
//               onClick={() => {
//                 toggleSeverity("critical");
//                 setPage(1);
//               }}
//               className={cls(
//                 "px-3 py-1 rounded-full border",
//                 severityFilter === "critical"
//                   ? "bg-red-500 text-white border-red-500"
//                   : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//               )}
//             >
//               Critical ({severityCounts.critical})
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
//               Blocker ({severityCounts.blocker})
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
//                   ? "bg-red-500 text-white border-red-500"
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
//                   ? "bg-yellow-500 text-white border-yellow-500"
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
//                   ? "bg-green-500 text-white border-green-500"
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
//         </div>

//         {/* Content: ONLY LIST VIEW (attendance-style table) */}
//         {loading ? (
//           <div className="mt-6 text-sm text-gray-600">Loading…</div>
//         ) : loadErr ? (
//           <div className="mt-6 text-sm text-red-600">{loadErr}</div>
//         ) : (
//           <div className="mt-4 space-y-2">
//             {/* header row */}
//             <div className="grid grid-cols-[40px,1.8fr,1.2fr,1.2fr,0.9fr,0.9fr,1fr,70px] items-center text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200">
//               <div>#</div>
//               <div>Defect / Bug Title</div>
//               <div>Test Case</div>
//               <div>Module</div>
//               <div>Priority</div>
//               <div>Severity</div>
//               <div>Status</div>
//               <div className="text-center">View</div>
//             </div>

//             {/* rows */}
//             <div className="divide-y divide-slate-100">
//               {pageRows.map((d, idx) => {
//                 const prKey = (d.priority || "").toLowerCase();
//                 const svKey = (d.severity || "").toLowerCase();
//                 const statusClass = getStatusBadge(d.status);

//                 return (
//                   <div
//                     key={d._id || `${idx}-${getIdSafe(d.bug_id)}`}
//                     className="grid grid-cols-[40px,1.8fr,1.2fr,1.2fr,0.9fr,0.9fr,1fr,70px] items-center text-[12px] px-3 py-2"
//                   >
//                     {/* index */}
//                     <div className="text-slate-700">
//                       {(page - 1) * pageSize + idx + 1}
//                     </div>

//                     {/* title / summary */}
//                     <div className="text-slate-900 font-medium line-clamp-2 pr-2">
//                       {d.bug_title ||
//                         d.test_case_name ||
//                         d.bug_summary ||
//                         d.bug_id ||
//                         "Untitled Defect"}
//                     </div>

//                     {/* test case */}
//                     <div className="text-slate-700 truncate pr-2">
//                       {d.test_case_number || d.test_case_name || "—"}
//                     </div>

//                     {/* module */}
//                     <div className="truncate pr-2">
//                       <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
//                         {d.module_name || "Unassigned"}
//                       </span>
//                     </div>

//                     {/* priority */}
//                     <div className="pr-2">
//                       {d.priority ? (
//                         <span
//                           className={cls(
//                             "inline-flex items-center px-2 py-0.5 rounded-full text-[10px]",
//                             priorityColors[prKey] ||
//                               "bg-slate-100 text-slate-700"
//                           )}
//                         >
//                           {d.priority}
//                         </span>
//                       ) : (
//                         <span className="text-slate-400 text-[10px]">—</span>
//                       )}
//                     </div>

//                     {/* severity */}
//                     <div className="pr-2">
//                       {d.severity ? (
//                         <span
//                           className={cls(
//                             "inline-flex items-center px-2 py-0.5 rounded-full text-[10px]",
//                             severityColors[svKey] ||
//                               "bg-slate-100 text-slate-700"
//                           )}
//                         >
//                           {d.severity}
//                         </span>
//                       ) : (
//                         <span className="text-slate-400 text-[10px]">—</span>
//                       )}
//                     </div>

//                     {/* status */}
//                     <div className="pr-2">
//                       <span
//                         className={cls(
//                           "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold",
//                           statusClass
//                         )}
//                       >
//                         {d.status || "Unknown"}
//                       </span>
//                     </div>

//                     {/* view */}
//                     <div className="flex justify-center">
//                       <Link
//                         to={`/single-project/${projectId}/defect/${d._id}`}
//                         className="text-indigo-600 hover:text-indigo-800"
//                         title="View defect details"
//                       >
//                         <FaEye className="text-sm" />
//                       </Link>
//                     </div>
//                   </div>
//                 );
//               })}

//               {!pageRows.length && (
//                 <div className="text-center text-[12px] text-slate-500 py-6">
//                   No defects match your filters.
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
// }

//

//

//

// src/pages/defects/AllDefects.jsx

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
  FaSync,
  FaDownload,
  FaEye,
} from "react-icons/fa";
import * as XLSX from "xlsx";
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
/* ---------------------------------- */

/* ---------- Color maps ---------- */
// Priority
const priorityColors = {
  low: "bg-emerald-100 text-emerald-700 border-emerald-300",
  medium: "bg-amber-100 text-amber-700 border-amber-300",
  high: "bg-rose-100 text-rose-700 border-rose-300",
};

// Severity
const severityColors = {
  minor: "bg-sky-100 text-sky-700 border-sky-300",
  major: "bg-orange-100 text-orange-700 border-orange-300",
  critical: "bg-red-100 text-red-700 border-red-300",
  blocker: "bg-slate-300 text-slate-800 border-slate-400",
};

// Status
const statusColors = {
  "Open/New": "bg-rose-100 text-rose-700 border-rose-300",
  Assigned: "bg-amber-100 text-amber-700 border-amber-300",
  "In-progress": "bg-blue-100 text-blue-700 border-blue-300",
  Fixed: "bg-emerald-100 text-emerald-700 border-emerald-300",
  "Re-opened": "bg-purple-100 text-purple-700 border-purple-300",
  Closed: "bg-slate-200 text-slate-800 border-slate-300",
};

const getStatusBadge = (status) =>
  statusColors[status] || "bg-slate-100 text-slate-700 border-slate-200";

const getIdSafe = (x) => {
  if (!x) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x._id || x.id || x);
  return String(x);
};

// Avatar / image
const getImageUrl = (bugImage) => {
  if (bugImage) {
    const normalizedPath = String(bugImage)
      .replace(/\\/g, "/")
      .split("uploads/")
      .pop();
    return `${globalBackendRoute}/uploads/${normalizedPath}`;
  }
  return "https://via.placeholder.com/80x80?text=Bug";
};

export default function AllDefects() {
  const { projectId } = useParams();
  const api = `${globalBackendRoute}/api`;

  // auth
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";
  const authHeader = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token]
  );

  // state
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [projectName, setProjectName] = useState("");

  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState(""); // low/medium/high
  const [severityFilter, setSeverityFilter] = useState(""); // minor/major/...
  const [statusFilter, setStatusFilter] = useState(""); // exact status

  const [priorityCounts, setPriorityCounts] = useState({
    low: 0,
    medium: 0,
    high: 0,
  });
  const [severityCounts, setSeverityCounts] = useState({
    minor: 0,
    major: 0,
    critical: 0,
    blocker: 0,
  });
  const [statusCounts, setStatusCounts] = useState({
    openNew: 0,
    assigned: 0,
    inProgress: 0,
    fixed: 0,
    reopened: 0,
    closed: 0,
  });

  // fetch
  const fetchAll = async () => {
    try {
      setLoading(true);
      setLoadErr("");

      const res = await axios.get(
        `${api}/single-project/${projectId}/all-defects`,
        { headers: authHeader }
      );

      const arr = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.defects)
        ? res.data.defects
        : [];

      setRows(arr);

      // project name
      if (arr.length) {
        const any = arr[0];
        const nameCandidate =
          any?.project?.project_name ||
          any?.project_name ||
          any?.projectTitle ||
          "";
        if (nameCandidate) setProjectName(nameCandidate);
      }

      // counts
      const p = { low: 0, medium: 0, high: 0 };
      const sv = { minor: 0, major: 0, critical: 0, blocker: 0 };
      const st = {
        openNew: 0,
        assigned: 0,
        inProgress: 0,
        fixed: 0,
        reopened: 0,
        closed: 0,
      };

      for (const d of arr) {
        const pr = (d.priority || "").toLowerCase();
        if (p[pr] !== undefined) p[pr] += 1;

        const se = (d.severity || "").toLowerCase();
        if (sv[se] !== undefined) sv[se] += 1;

        switch (d.status) {
          case "Open/New":
            st.openNew += 1;
            break;
          case "Assigned":
            st.assigned += 1;
            break;
          case "In-progress":
            st.inProgress += 1;
            break;
          case "Fixed":
            st.fixed += 1;
            break;
          case "Re-opened":
            st.reopened += 1;
            break;
          case "Closed":
            st.closed += 1;
            break;
          default:
            break;
        }
      }

      setPriorityCounts(p);
      setSeverityCounts(sv);
      setStatusCounts(st);
    } catch (e) {
      console.error("Defects load error:", e?.response || e);
      setLoadErr(e?.response?.data?.message || "Failed to load defects.");
      setRows([]);
      setPriorityCounts({ low: 0, medium: 0, high: 0 });
      setSeverityCounts({ minor: 0, major: 0, critical: 0, blocker: 0 });
      setStatusCounts({
        openNew: 0,
        assigned: 0,
        inProgress: 0,
        fixed: 0,
        reopened: 0,
        closed: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // filter + search + sort
  const filtered = useMemo(() => {
    const tokens = tokenize(search);
    let out = rows.slice();

    if (priorityFilter) {
      const want = priorityFilter.toLowerCase();
      out = out.filter((d) => (d.priority || "").toLowerCase() === want);
    }

    if (severityFilter) {
      const want = severityFilter.toLowerCase();
      out = out.filter((d) => (d.severity || "").toLowerCase() === want);
    }

    if (statusFilter) {
      out = out.filter((d) => (d.status || "") === statusFilter);
    }

    if (tokens.length) {
      out = out.filter((d) => {
        const hay = norm(
          [
            d.bug_id,
            d.bug_title,
            d.bug_summary,
            d.bug_description,
            d.test_case_name,
            d.test_case_number,
            d.module_name,
            d.status,
            d.priority,
            d.severity,
            d.assigned_to,
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
      return sortOrder === "desc" ? bTs - aTs : aTs - bTs;
    });

    return out;
  }, [rows, priorityFilter, severityFilter, statusFilter, search, sortOrder]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  // filter helpers
  const togglePriority = (val) =>
    setPriorityFilter((prev) => (prev === val ? "" : val));
  const toggleSeverity = (val) =>
    setSeverityFilter((prev) => (prev === val ? "" : val));
  const toggleStatus = (val) =>
    setStatusFilter((prev) => (prev === val ? "" : val));

  const clearAllFilters = () => {
    setPriorityFilter("");
    setSeverityFilter("");
    setStatusFilter("");
    setSearch("");
    setPage(1);
  };

  // exports
  const exportCSV = () => {
    if (!filtered.length) {
      alert("No defects to export.");
      return;
    }

    const data = filtered.map((d) => ({
      id: d._id,
      projectId,
      bugId: d.bug_id || "",
      title:
        d.bug_title || d.test_case_name || d.bug_summary || "Untitled Defect",
      summary: (d.bug_summary || "").replace(/\n/g, " "),
      description: (d.bug_description || "").replace(/\n/g, " "),
      module: d.module_name || "",
      testCaseName: d.test_case_name || "",
      testCaseNumber: d.test_case_number || "",
      priority: d.priority || "",
      severity: d.severity || "",
      status: d.status || "",
      assignedTo: d.assigned_to || "",
      createdAt: d.createdAt
        ? moment(d.createdAt).format("YYYY-MM-DD HH:mm")
        : "",
      updatedAt: d.updatedAt
        ? moment(d.updatedAt).format("YYYY-MM-DD HH:mm")
        : "",
    }));

    const header = Object.keys(data[0]).join(",");
    const body = data
      .map((row) =>
        Object.values(row)
          .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([header + "\n" + body], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `defects_${projectId}_${moment().format("YYYYMMDD_HHmm")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportXLSX = () => {
    if (!filtered.length) {
      alert("No defects to export.");
      return;
    }

    const data = filtered.map((d) => ({
      ID: d._id,
      ProjectId: projectId,
      BugId: d.bug_id || "",
      Title:
        d.bug_title || d.test_case_name || d.bug_summary || "Untitled Defect",
      Summary: (d.bug_summary || "").replace(/\n/g, " "),
      Description: (d.bug_description || "").replace(/\n/g, " "),
      Module: d.module_name || "",
      TestCaseName: d.test_case_name || "",
      TestCaseNumber: d.test_case_number || "",
      Priority: d.priority || "",
      Severity: d.severity || "",
      Status: d.status || "",
      AssignedTo: d.assigned_to || "",
      CreatedAt: d.createdAt
        ? moment(d.createdAt).format("YYYY-MM-DD HH:mm")
        : "",
      UpdatedAt: d.updatedAt
        ? moment(d.updatedAt).format("YYYY-MM-DD HH:mm")
        : "",
    }));

    const ws = XLSX.utils.json_to_sheet(data, { skipHeader: false });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Defects");

    ws["!cols"] = [
      { wch: 24 },
      { wch: 16 },
      { wch: 16 },
      { wch: 32 },
      { wch: 40 },
      { wch: 80 },
      { wch: 18 },
      { wch: 26 },
      { wch: 18 },
      { wch: 14 },
      { wch: 14 },
      { wch: 16 },
      { wch: 22 },
      { wch: 22 },
    ];

    const filename = `defects_${projectId}_${moment().format(
      "YYYYMMDD_HHmm"
    )}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const exportServerXLSX = async () => {
    try {
      const params = new URLSearchParams();
      if (projectId) params.set("projectId", projectId);
      if (priorityFilter) params.set("priority", priorityFilter);
      if (severityFilter) params.set("severity", severityFilter);
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("search", search);
      params.set("order", sortOrder);

      // adjust if your backend route differs
      const url = `${api}/defects/export.xlsx?${params.toString()}`;

      const res = await axios.get(url, {
        headers: authHeader,
        responseType: "arraybuffer",
        validateStatus: () => true,
      });

      const ct = (res.headers["content-type"] || "").toLowerCase();
      const isXlsx = ct.includes(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      if (!isXlsx || res.status < 200 || res.status >= 300) {
        let msg = `Export failed (status ${res.status}).`;
        try {
          const decoder = new TextDecoder("utf-8");
          const text = decoder.decode(new Uint8Array(res.data || []));
          try {
            const j = JSON.parse(text);
            msg += `\n${j.message || text}`;
          } catch {
            msg += `\n${text.slice(0, 400)}`;
          }
        } catch {}
        alert(msg);
        return;
      }

      const blob = new Blob([res.data], { type: ct });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `defects_${projectId}_${moment().format(
        "YYYYMMDD_HHmm"
      )}.xlsx`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error("Server export failed:", e);
      alert(`Server export failed: ${e?.message || e}`);
    }
  };

  // UI
  return (
    <div className="bg-white py-6 sm:py-8 text-[13px]">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="min-w-[220px]">
            <h2 className="font-semibold tracking-tight text-indigo-600 text-[16px]">
              Defects — {projectName || `Project ${projectId}`}
            </h2>
            <div className="text-[11px] text-gray-600">
              {loading
                ? "Loading…"
                : `Total: ${rows.length} | Showing: ${filtered.length}`}
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

            {/* View icons (list only active) */}
            <FaThList
              className={cls("text-lg cursor-pointer text-indigo-600")}
              title="List"
            />
            <FaThLarge
              className="text-lg text-gray-300 cursor-not-allowed"
              title="Card view disabled"
            />
            <FaTh
              className="text-lg text-gray-300 cursor-not-allowed"
              title="Grid view disabled"
            />

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-2 top-2.5 text-gray-400" />
              <input
                className="pl-7 pr-2 py-1.5 border rounded-md w-[240px]"
                placeholder="Search defects (title, module, status…)"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Rows */}
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

            {/* Export buttons */}
            <button
              onClick={exportXLSX}
              className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
              title="Export Excel (client, filtered)"
            >
              <FaDownload />
              <span className="hidden sm:inline">Export (Client)</span>
            </button>

            <button
              onClick={exportServerXLSX}
              className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
              title="Export Excel (server)"
            >
              <FaDownload />
              <span className="hidden sm:inline">Export (Server)</span>
            </button>

            <button
              onClick={exportCSV}
              className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
              title="Export CSV (filtered)"
            >
              <FaDownload />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Refresh */}
            <button
              onClick={fetchAll}
              className="px-2 py-1.5 border rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
              title="Refresh"
            >
              <FaSync />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Project Dashboard */}
            <Link
              to={`/single-project/${projectId}`}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-[11px]"
            >
              Project Dashboard
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-700">
              Filter by Priority / Severity / Status
            </h3>
            <button
              className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
              onClick={clearAllFilters}
            >
              Clear All Filters
            </button>
          </div>

          {/* Priority */}
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
              Low ({priorityCounts.low})
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
              Medium ({priorityCounts.medium})
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
              High ({priorityCounts.high})
            </button>
          </div>

          {/* Severity */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-[11px]">
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
              Minor ({severityCounts.minor})
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
              Major ({severityCounts.major})
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
              Critical ({severityCounts.critical})
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
              Blocker ({severityCounts.blocker})
            </button>
          </div>

          {/* Status */}
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
        </div>

        {/* List view with avatar */}
        {loading ? (
          <div className="mt-6 text-sm text-gray-600">Loading…</div>
        ) : loadErr ? (
          <div className="mt-6 text-sm text-red-600">{loadErr}</div>
        ) : (
          <div className="mt-4 space-y-2">
            {/* header row: #, img, title, tc, module, priority, severity, status, view */}
            <div className="grid grid-cols-[36px,40px,1.7fr,1.2fr,1.2fr,0.9fr,0.9fr,1fr,70px] items-center text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200">
              <div>#</div>
              <div></div>
              <div>Defect / Bug Title</div>
              <div>Test Case</div>
              <div>Module</div>
              <div>Priority</div>
              <div>Severity</div>
              <div>Status</div>
              <div className="text-center">View</div>
            </div>

            <div className="divide-y divide-slate-100">
              {pageRows.map((d, idx) => {
                const prKey = (d.priority || "").toLowerCase();
                const svKey = (d.severity || "").toLowerCase();
                const statusClass = getStatusBadge(d.status);

                return (
                  <div
                    key={d._id || `${idx}-${getIdSafe(d.bug_id)}`}
                    className="grid grid-cols-[36px,40px,1.7fr,1.2fr,1.2fr,0.9fr,0.9fr,1fr,70px] items-center text-[12px] px-3 py-2"
                  >
                    {/* index */}
                    <div className="text-slate-700">
                      {(page - 1) * pageSize + idx + 1}
                    </div>

                    {/* avatar */}
                    <div className="flex items-center justify-center">
                      <img
                        src={getImageUrl(d.bug_picture)}
                        alt="Bug"
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                    </div>

                    {/* title */}
                    <div className="text-slate-900 font-medium line-clamp-2 pr-2">
                      {d.bug_title ||
                        d.test_case_name ||
                        d.bug_summary ||
                        d.bug_id ||
                        "Untitled Defect"}
                    </div>

                    {/* test case */}
                    <div className="text-slate-700 truncate pr-2">
                      {d.test_case_number || d.test_case_name || "—"}
                    </div>

                    {/* module */}
                    <div className="truncate pr-2">
                      <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                        {d.module_name || "Unassigned"}
                      </span>
                    </div>

                    {/* priority */}
                    <div className="pr-2">
                      {d.priority ? (
                        <span
                          className={cls(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border",
                            priorityColors[prKey] ||
                              "bg-slate-100 text-slate-700 border-slate-200"
                          )}
                        >
                          {d.priority}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">—</span>
                      )}
                    </div>

                    {/* severity */}
                    <div className="pr-2">
                      {d.severity ? (
                        <span
                          className={cls(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border",
                            severityColors[svKey] ||
                              "bg-slate-100 text-slate-700 border-slate-200"
                          )}
                        >
                          {d.severity}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">—</span>
                      )}
                    </div>

                    {/* status */}
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

                    {/* view */}
                    <div className="flex justify-center">
                      <Link
                        to={`/single-project/${projectId}/defect/${d._id}`}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="View defect details"
                      >
                        <FaEye className="text-sm" />
                      </Link>
                    </div>
                  </div>
                );
              })}

              {!pageRows.length && (
                <div className="text-center text-[12px] text-slate-500 py-6">
                  No defects match your filters.
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
}
