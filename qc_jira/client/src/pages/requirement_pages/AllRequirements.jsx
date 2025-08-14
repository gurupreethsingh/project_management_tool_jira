// src/pages/requirements/AllRequirements.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import {
//   FaThList,
//   FaThLarge,
//   FaTh,
//   FaSearch,
//   FaTrashAlt,
//   FaSitemap,
//   FaFolderOpen,
//   FaHashtag,
//   FaCalendarAlt,
//   FaInfoCircle,
//   FaTag,
// } from "react-icons/fa";
// import globalBackendRoute from "../../config/Config";

// // ✅ Routes aligned to your Express router mounted at /api
// const GET_ALL_REQS = `${globalBackendRoute}/api/requirements`;
// const GET_REQS_BY_PROJECT = (pid) =>
//   `${globalBackendRoute}/api/projects/${pid}/requirements`;
// const GET_REQS_BY_MODULE = (pid, m) =>
//   `${globalBackendRoute}/api/projects/${pid}/modules/${encodeURIComponent(
//     m
//   )}/requirements`;

// // Client-side route for opening a single requirement page in your React app
// const SINGLE_REQUIREMENT_ROUTE = (id) => `/single-requirement/${id}`;

// export default function AllRequirements() {
//   const { projectId, moduleName } = useParams();
//   const navigate = useNavigate();

//   const [requirements, setRequirements] = useState([]);
//   const [view, setView] = useState("list"); // ✅ default: list
//   const [searchQuery, setSearchQuery] = useState("");

//   // Filters
//   const [moduleFilter, setModuleFilter] = useState("All");
//   const [reqNumberFilter, setReqNumberFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");

//   // Sorting
//   const [sortBy, setSortBy] = useState("Newest");

//   // Fetch data depending on route params
//   useEffect(() => {
//     const fetchRequirements = async () => {
//       try {
//         let url = GET_ALL_REQS;
//         if (projectId && moduleName)
//           url = GET_REQS_BY_MODULE(projectId, moduleName);
//         else if (projectId) url = GET_REQS_BY_PROJECT(projectId);

//         const token = localStorage.getItem("token");
//         const config = token
//           ? { headers: { Authorization: `Bearer ${token}` } }
//           : {};
//         const res = await axios.get(url, config);
//         setRequirements(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Error fetching requirements:", err);
//         setRequirements([]);
//       }
//     };
//     fetchRequirements();
//   }, [projectId, moduleName]);

//   // Sync dropdown to URL moduleName (if present)
//   useEffect(() => {
//     if (moduleName) setModuleFilter(moduleName);
//     else setModuleFilter("All");
//   }, [moduleName]);

//   const getCoverImage = (req) => {
//     const first =
//       Array.isArray(req.images) && req.images.length ? req.images[0] : null;
//     if (!first) return "https://via.placeholder.com/600x400?text=Requirement";
//     const normalizedPath = String(first)
//       .replace(/\\/g, "/")
//       .split("uploads/")
//       .pop();
//     return `${globalBackendRoute}/uploads/${normalizedPath}`;
//   };

//   const openSingle = (id) => navigate(SINGLE_REQUIREMENT_ROUTE(id));

//   // Build filter options
//   const moduleOptions = useMemo(() => {
//     const set = new Set();
//     requirements.forEach((r) => r.module_name && set.add(r.module_name));
//     const arr = Array.from(set).sort((a, b) => a.localeCompare(b));
//     return ["All", ...arr];
//   }, [requirements]);

//   const statusOptions = useMemo(() => {
//     const set = new Set();
//     requirements.forEach((r) => set.add(r.status ?? "Unknown"));
//     return ["All", ...Array.from(set)];
//   }, [requirements]);

//   // Apply client-side search/filters/sort
//   const filteredAndSorted = useMemo(() => {
//     const q = searchQuery.trim().toLowerCase();

//     let arr = requirements.filter((r) => {
//       const fields = [
//         r.project_name,
//         r.requirement_number,
//         r.build_name_or_number,
//         r.module_name,
//         r.requirement_title,
//         r.description,
//       ]
//         .filter(Boolean)
//         .map((s) => String(s).toLowerCase());

//       const matchesSearch = q.length === 0 || fields.some((f) => f.includes(q));
//       const matchesModule =
//         moduleFilter === "All" ||
//         String(r.module_name ?? "").toLowerCase() ===
//           moduleFilter.toLowerCase();
//       const reqNo = String(r.requirement_number ?? "");
//       const matchesReqNumber =
//         reqNumberFilter.trim().length === 0 ||
//         reqNo.toLowerCase().includes(reqNumberFilter.trim().toLowerCase());
//       const statusValue = (r.status ?? "Unknown").toLowerCase();
//       const matchesStatus =
//         statusFilter === "All" || statusValue === statusFilter.toLowerCase();

//       return (
//         matchesSearch && matchesModule && matchesReqNumber && matchesStatus
//       );
//     });

//     arr.sort((a, b) => {
//       switch (sortBy) {
//         case "Newest":
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         case "Oldest":
//           return new Date(a.createdAt) - new Date(b.createdAt);
//         case "Module A→Z":
//           return String(a.module_name ?? "").localeCompare(
//             String(b.module_name ?? "")
//           );
//         case "Module Z→A":
//           return String(b.module_name ?? "").localeCompare(
//             String(a.module_name ?? "")
//           );
//         case "Req# ↑":
//           return String(a.requirement_number ?? "").localeCompare(
//             String(b.requirement_number ?? ""),
//             undefined,
//             { numeric: true, sensitivity: "base" }
//           );
//         case "Req# ↓":
//           return String(b.requirement_number ?? "").localeCompare(
//             String(a.requirement_number ?? ""),
//             undefined,
//             { numeric: true, sensitivity: "base" }
//           );
//         default:
//           return 0;
//       }
//     });

//     return arr;
//   }, [
//     requirements,
//     searchQuery,
//     moduleFilter,
//     reqNumberFilter,
//     statusFilter,
//     sortBy,
//   ]);

//   const clearFilters = () => {
//     setModuleFilter("All");
//     setReqNumberFilter("");
//     setStatusFilter("All");
//     setSortBy("Newest");
//     setSearchQuery("");
//     if (projectId && moduleName) navigate(`/all-requirements/${projectId}`);
//   };

//   const onModuleChange = (val) => {
//     setModuleFilter(val);
//     if (!projectId) return;
//     if (val === "All") navigate(`/all-requirements/${projectId}`);
//     else
//       navigate(
//         `/all-requirements/${projectId}/module/${encodeURIComponent(val)}`
//       );
//   };

//   // ---------- DELETE HANDLER ----------
//   const handleDelete = async (e, id, title) => {
//     e.stopPropagation();
//     const ok = window.confirm(
//       `Delete this requirement${
//         title ? `: "${title}"` : ""
//       }? This cannot be undone.`
//     );
//     if (!ok) return;

//     try {
//       const token = localStorage.getItem("token");
//       const config = token
//         ? { headers: { Authorization: `Bearer ${token}` } }
//         : {};
//       await axios.delete(
//         `${globalBackendRoute}/api/requirements/${id}`,
//         config
//       );
//       setRequirements((prev) => prev.filter((r) => r._id !== id));
//       alert("Requirement deleted successfully.");
//     } catch (err) {
//       console.error("Delete failed:", err?.response?.data || err.message);
//       alert(
//         `Failed to delete requirement${
//           err?.response?.data?.error ? `: ${err.response.data.error}` : ""
//         }`
//       );
//     }
//   };

//   const StatBadge = ({
//     label,
//     icon: Icon,
//     color = "text-gray-700",
//     bg = "bg-gray-100",
//     border = "border",
//   }) => (
//     <span
//       className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${bg} ${color} ${border}`}
//     >
//       {Icon ? <Icon className="opacity-80" /> : null}
//       {label}
//     </span>
//   );

//   // ---------- Item renderers (module → image → details) ----------
//   const ModuleHeader = ({ module }) => (
//     <div className="flex items-center gap-2">
//       <FaSitemap className="text-indigo-600" />
//       <span className="font-semibold text-gray-900 capitalize">
//         {module || "(no module)"}
//       </span>
//     </div>
//   );

//   // Header row inside each item: index + module (left) | delete (right)
//   const ItemHeaderBar = ({ index, module, onDelete }) => (
//     <div className="w-full flex items-center justify-between">
//       <div className="flex items-center gap-2">
//         <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full bg-purple-100 text-purple-700 border border-purple-300">
//           {index + 1}
//         </span>
//         <ModuleHeader module={module} />
//       </div>
//       <button
//         onClick={onDelete}
//         className="p-1.5 rounded-md bg-white hover:bg-gray-50 shadow border"
//         title="Delete requirement"
//       >
//         <FaTrashAlt className="text-red-600" />
//       </button>
//     </div>
//   );

//   const RequirementCard = ({ r, index }) => (
//     <div
//       onClick={() => openSingle(r._id)}
//       className="flex flex-col items-start bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer"
//     >
//       {/* Header bar (no absolute; prevents overlap) */}
//       <div className="px-3 pt-3 w-full">
//         <ItemHeaderBar
//           index={index}
//           module={r.module_name}
//           onDelete={(e) => handleDelete(e, r._id, r.requirement_title)}
//         />
//       </div>

//       {/* Image */}
//       <img
//         src={getCoverImage(r)}
//         alt={r.requirement_title || "Requirement"}
//         className="w-full h-40 object-cover rounded-md mt-2 px-3"
//       />

//       {/* Details */}
//       <div className="p-3 w-full">
//         <div className="flex items-center gap-2 text-sm text-gray-900 font-semibold">
//           <FaFolderOpen className="text-teal-600" />
//           <span className="line-clamp-1">
//             {r.requirement_title || "(Untitled Requirement)"}
//           </span>
//         </div>

//         <p className="mt-1 text-sm text-gray-600 line-clamp-2 flex items-start gap-2">
//           <FaInfoCircle className="mt-0.5 text-amber-600 flex-shrink-0" />
//           <span>{r.description || "No description"}</span>
//         </p>

//         <div className="mt-2 flex items-center gap-2 flex-wrap">
//           {r.project_name && (
//             <StatBadge
//               icon={FaFolderOpen}
//               label={`Project: ${r.project_name}`}
//               color="text-sky-800"
//               bg="bg-sky-100"
//               border="border-sky-200"
//             />
//           )}
//           {r.requirement_number && (
//             <StatBadge
//               icon={FaHashtag}
//               label={`Req#: ${r.requirement_number}`}
//               color="text-emerald-800"
//               bg="bg-emerald-100"
//               border="border-emerald-200"
//             />
//           )}
//           <StatBadge
//             icon={FaCalendarAlt}
//             label={`Created: ${new Date(r.createdAt).toLocaleDateString()}`}
//             color="text-fuchsia-800"
//             bg="bg-fuchsia-100"
//             border="border-fuchsia-200"
//           />
//           <StatBadge
//             icon={FaTag}
//             label={`Status: ${r.status ?? "Unknown"}`}
//             color="text-rose-800"
//             bg="bg-rose-100"
//             border="border-rose-200"
//           />
//         </div>
//       </div>
//     </div>
//   );

//   const RequirementRow = ({ r, index }) => (
//     <div
//       onClick={() => openSingle(r._id)}
//       className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer p-3"
//     >
//       {/* Header bar */}
//       <ItemHeaderBar
//         index={index}
//         module={r.module_name}
//         onDelete={(e) => handleDelete(e, r._id, r.requirement_title)}
//       />

//       {/* Image */}
//       <img
//         src={getCoverImage(r)}
//         alt={r.requirement_title || "Requirement"}
//         className="w-full h-40 object-cover rounded-md mt-2"
//       />

//       {/* Details */}
//       <div className="mt-3">
//         <div className="flex items-center gap-2 text-base text-gray-900 font-semibold">
//           <FaFolderOpen className="text-teal-600" />
//           <span className="line-clamp-1">
//             {r.requirement_title || "(Untitled Requirement)"}
//           </span>
//         </div>
//         <p className="text-sm text-gray-600 line-clamp-2 flex items-start gap-2 mt-1">
//           <FaInfoCircle className="mt-0.5 text-amber-600 flex-shrink-0" />
//           <span>{r.description || "No description"}</span>
//         </p>
//         <div className="mt-2 flex items-center gap-2 flex-wrap">
//           {r.project_name && (
//             <StatBadge
//               icon={FaFolderOpen}
//               label={`Project: ${r.project_name}`}
//               color="text-sky-800"
//               bg="bg-sky-100"
//               border="border-sky-200"
//             />
//           )}
//           {r.requirement_number && (
//             <StatBadge
//               icon={FaHashtag}
//               label={`Req#: ${r.requirement_number}`}
//               color="text-emerald-800"
//               bg="bg-emerald-100"
//               border="border-emerald-200"
//             />
//           )}
//           <StatBadge
//             icon={FaCalendarAlt}
//             label={`Created: ${new Date(r.createdAt).toLocaleDateString()}`}
//             color="text-fuchsia-800"
//             bg="bg-fuchsia-100"
//             border="border-fuchsia-200"
//           />
//           <StatBadge
//             icon={FaTag}
//             label={`Status: ${r.status ?? "Unknown"}`}
//             color="text-rose-800"
//             bg="bg-rose-100"
//             border="border-rose-200"
//           />
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="bg-white py-12 sm:py-14">
//       <div className="mx-auto max-w-7xl px-6 lg:px-8">
//         {/* Header + Controls (no blank left area) */}
//         <div className="flex items-center gap-3 flex-wrap">
//           <div className="flex items-center gap-3">
//             <h2 className="text-left text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//               {projectId
//                 ? moduleName
//                   ? `Requirements · ${moduleName}`
//                   : "Project Requirements"
//                 : "All Requirements"}
//             </h2>
//             {projectId && (
//               <Link
//                 to={`/all-requirements/${projectId}`}
//                 className="text-xs sm:text-sm text-indigo-600 underline"
//               >
//                 View all modules
//               </Link>
//             )}
//           </div>

//           {/* Controls live on the RIGHT; no placeholder left */}
//           <div className="flex items-center gap-2 flex-wrap ml-auto">
//             {/* Search */}
//             <div className="relative">
//               <FaSearch className="absolute left-2 top-2.5 text-gray-400" />
//               <input
//                 type="text"
//                 className="pl-8 pr-3 py-1.5 border rounded-md focus:outline-none text-sm"
//                 placeholder="Search..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             {/* Module Filter */}
//             <select
//               className="border rounded-md px-2 py-1.5 text-sm bg-indigo-50 border-indigo-200 text-indigo-800"
//               value={moduleFilter}
//               onChange={(e) => onModuleChange(e.target.value)}
//               title="Filter by module"
//             >
//               {moduleOptions.map((m) => (
//                 <option key={m} value={m}>
//                   {m}
//                 </option>
//               ))}
//             </select>

//             {/* Req# filter */}
//             <input
//               type="text"
//               className="border rounded-md px-2 py-1.5 text-sm"
//               placeholder="Req# contains..."
//               value={reqNumberFilter}
//               onChange={(e) => setReqNumberFilter(e.target.value)}
//               title="Filter by requirement number"
//             />

//             {/* Status */}
//             <select
//               className="border rounded-md px-2 py-1.5 text-sm bg-emerald-50 border-emerald-200 text-emerald-800"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               title="Filter by status"
//             >
//               {statusOptions.map((s) => (
//                 <option key={s} value={s}>
//                   {s}
//                 </option>
//               ))}
//             </select>

//             {/* Sort */}
//             <select
//               className="border rounded-md px-2 py-1.5 text-sm bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800"
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               title="Sort by"
//             >
//               <option>Newest</option>
//               <option>Oldest</option>
//               <option>Module A→Z</option>
//               <option>Module Z→A</option>
//               <option>Req# ↑</option>
//               <option>Req# ↓</option>
//             </select>

//             <button
//               onClick={clearFilters}
//               className="px-3 py-1.5 rounded-md border hover:bg-gray-50 text-sm bg-rose-50 border-rose-200 text-rose-800"
//               title="Clear all filters"
//             >
//               Clear
//             </button>

//             {/* View toggles on the RIGHT */}
//             <div className="flex items-center gap-2">
//               <button
//                 className={`text-base p-1.5 rounded-md border ${
//                   view === "list"
//                     ? "bg-indigo-100 text-indigo-700 border-indigo-200"
//                     : "bg-white text-gray-600"
//                 }`}
//                 onClick={() => setView("list")}
//                 title="List view"
//               >
//                 <FaThList />
//               </button>
//               <button
//                 className={`text-base p-1.5 rounded-md border ${
//                   view === "card"
//                     ? "bg-indigo-100 text-indigo-700 border-indigo-200"
//                     : "bg-white text-gray-600"
//                 }`}
//                 onClick={() => setView("card")}
//                 title="Large card view"
//               >
//                 <FaThLarge />
//               </button>
//               <button
//                 className={`text-base p-1.5 rounded-md border ${
//                   view === "grid"
//                     ? "bg-indigo-100 text-indigo-700 border-indigo-200"
//                     : "bg-white text-gray-600"
//                 }`}
//                 onClick={() => setView("grid")}
//                 title="Grid view"
//               >
//                 <FaTh />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="mt-8">
//           {view === "grid" && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//               {filteredAndSorted.map((r, idx) => (
//                 <div key={r._id} className="flex flex-col items-start">
//                   <RequirementCard r={r} index={idx} />
//                 </div>
//               ))}
//             </div>
//           )}

//           {view === "card" && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//               {filteredAndSorted.map((r, idx) => (
//                 <div
//                   key={r._id}
//                   className="flex flex-col items-start bg-white rounded-lg shadow"
//                 >
//                   <RequirementCard r={r} index={idx} />
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* ✅ TRUE LIST: vertical stack, no grid columns */}
//           {view === "list" && (
//             <div className="space-y-5">
//               {filteredAndSorted.map((r, idx) => (
//                 <div key={r._id}>
//                   <RequirementRow r={r} index={idx} />
//                 </div>
//               ))}
//             </div>
//           )}

//           {filteredAndSorted.length === 0 && (
//             <div className="text-center text-gray-500">
//               No requirements found.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

//

// src/pages/requirements/AllRequirements.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaSearch,
  FaTrashAlt,
  FaSitemap,
  FaFolderOpen,
  FaHashtag,
  FaCalendarAlt,
  FaInfoCircle,
  FaTag,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

// ✅ Routes aligned to your Express router mounted at /api
const GET_ALL_REQS = `${globalBackendRoute}/api/requirements`;
const GET_REQS_BY_PROJECT = (pid) =>
  `${globalBackendRoute}/api/projects/${pid}/requirements`;
const GET_REQS_BY_MODULE = (pid, m) =>
  `${globalBackendRoute}/api/projects/${pid}/modules/${encodeURIComponent(
    m
  )}/requirements`;

// Client-side route for opening a single requirement page in your React app
const SINGLE_REQUIREMENT_ROUTE = (id) => `/single-requirement/${id}`;

export default function AllRequirements() {
  const { projectId, moduleName } = useParams();
  const navigate = useNavigate();

  const [requirements, setRequirements] = useState([]);
  const [view, setView] = useState("list"); // default: list
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [moduleFilter, setModuleFilter] = useState("All");
  const [reqNumberFilter, setReqNumberFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Sorting
  const [sortBy, setSortBy] = useState("Newest");

  // Fetch data depending on route params
  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        let url = GET_ALL_REQS;
        if (projectId && moduleName)
          url = GET_REQS_BY_MODULE(projectId, moduleName);
        else if (projectId) url = GET_REQS_BY_PROJECT(projectId);

        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const res = await axios.get(url, config);
        setRequirements(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching requirements:", err);
        setRequirements([]);
      }
    };
    fetchRequirements();
  }, [projectId, moduleName]);

  // Sync dropdown to URL moduleName (if present)
  useEffect(() => {
    if (moduleName) setModuleFilter(moduleName);
    else setModuleFilter("All");
  }, [moduleName]);

  const getCoverImage = (req) => {
    const first =
      Array.isArray(req.images) && req.images.length ? req.images[0] : null;
    if (!first) return "https://via.placeholder.com/600x400?text=Requirement";
    const normalizedPath = String(first)
      .replace(/\\/g, "/")
      .split("uploads/")
      .pop();
    return `${globalBackendRoute}/uploads/${normalizedPath}`;
  };

  const openSingle = (id) => navigate(SINGLE_REQUIREMENT_ROUTE(id));

  // Build filter options
  const moduleOptions = useMemo(() => {
    const set = new Set();
    requirements.forEach((r) => r.module_name && set.add(r.module_name));
    const arr = Array.from(set).sort((a, b) => a.localeCompare(b));
    return ["All", ...arr];
  }, [requirements]);

  const statusOptions = useMemo(() => {
    const set = new Set();
    requirements.forEach((r) => set.add(r.status ?? "Unknown"));
    return ["All", ...Array.from(set)];
  }, [requirements]);

  // Apply client-side search/filters/sort
  const filteredAndSorted = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let arr = requirements.filter((r) => {
      const fields = [
        r.project_name,
        r.requirement_number,
        r.build_name_or_number,
        r.module_name,
        r.requirement_title,
        r.description,
      ]
        .filter(Boolean)
        .map((s) => String(s).toLowerCase());

      const matchesSearch = q.length === 0 || fields.some((f) => f.includes(q));
      const matchesModule =
        moduleFilter === "All" ||
        String(r.module_name ?? "").toLowerCase() ===
          moduleFilter.toLowerCase();
      const reqNo = String(r.requirement_number ?? "");
      const matchesReqNumber =
        reqNumberFilter.trim().length === 0 ||
        reqNo.toLowerCase().includes(reqNumberFilter.trim().toLowerCase());
      const statusValue = (r.status ?? "Unknown").toLowerCase();
      const matchesStatus =
        statusFilter === "All" || statusValue === statusFilter.toLowerCase();

      return (
        matchesSearch && matchesModule && matchesReqNumber && matchesStatus
      );
    });

    arr.sort((a, b) => {
      switch (sortBy) {
        case "Newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "Oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "Module A→Z":
          return String(a.module_name ?? "").localeCompare(
            String(b.module_name ?? "")
          );
        case "Module Z→A":
          return String(b.module_name ?? "").localeCompare(
            String(a.module_name ?? "")
          );
        case "Req# ↑":
          return String(a.requirement_number ?? "").localeCompare(
            String(b.requirement_number ?? ""),
            undefined,
            { numeric: true, sensitivity: "base" }
          );
        case "Req# ↓":
          return String(b.requirement_number ?? "").localeCompare(
            String(a.requirement_number ?? ""),
            undefined,
            { numeric: true, sensitivity: "base" }
          );
        default:
          return 0;
      }
    });

    return arr;
  }, [
    requirements,
    searchQuery,
    moduleFilter,
    reqNumberFilter,
    statusFilter,
    sortBy,
  ]);

  const clearFilters = () => {
    setModuleFilter("All");
    setReqNumberFilter("");
    setStatusFilter("All");
    setSortBy("Newest");
    setSearchQuery("");
    if (projectId && moduleName) navigate(`/all-requirements/${projectId}`);
  };

  const onModuleChange = (val) => {
    setModuleFilter(val);
    if (!projectId) return;
    if (val === "All") navigate(`/all-requirements/${projectId}`);
    else
      navigate(
        `/all-requirements/${projectId}/module/${encodeURIComponent(val)}`
      );
  };

  // ---------- DELETE HANDLER ----------
  const handleDelete = async (e, id, title) => {
    e.stopPropagation();
    const ok = window.confirm(
      `Delete this requirement${
        title ? `: "${title}"` : ""
      }? This cannot be undone.`
    );
    if (!ok) return;

    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      await axios.delete(
        `${globalBackendRoute}/api/requirements/${id}`,
        config
      );
      setRequirements((prev) => prev.filter((r) => r._id !== id));
      alert("Requirement deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err?.response?.data || err.message);
      alert(
        `Failed to delete requirement${
          err?.response?.data?.error ? `: ${err.response.data.error}` : ""
        }`
      );
    }
  };

  const StatBadge = ({
    label,
    icon: Icon,
    color = "text-gray-700",
    bg = "bg-gray-100",
    border = "border",
  }) => (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${bg} ${color} ${border}`}
    >
      {Icon ? <Icon className="opacity-80" /> : null}
      {label}
    </span>
  );

  // ---------- Item renderers (module → image → details) ----------
  const ModuleHeader = ({ module }) => (
    <div className="flex items-center gap-2">
      <FaSitemap className="text-indigo-600" />
      <span className="font-semibold text-gray-900 capitalize">
        {module || "(no module)"}
      </span>
    </div>
  );

  // Header row inside each item: index + module (left) | delete (right)
  const ItemHeaderBar = ({ index, module, onDelete }) => (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full bg-purple-100 text-purple-700 border border-purple-300">
          {index + 1}
        </span>
        <ModuleHeader module={module} />
      </div>
      <button
        onClick={onDelete}
        className="p-1.5 rounded-md bg-white hover:bg-gray-50 shadow border"
        title="Delete requirement"
      >
        <FaTrashAlt className="text-red-600" />
      </button>
    </div>
  );

  const RequirementCard = ({ r, index }) => (
    <div
      onClick={() => openSingle(r._id)}
      className="flex flex-col items-start bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer"
    >
      {/* Header bar */}
      <div className="px-3 pt-3 w-full">
        <ItemHeaderBar
          index={index}
          module={r.module_name}
          onDelete={(e) => handleDelete(e, r._id, r.requirement_title)}
        />
      </div>

      {/* Image */}
      <img
        src={getCoverImage(r)}
        alt={r.requirement_title || "Requirement"}
        className="w-full h-40 object-cover rounded-md mt-2 px-3"
      />

      {/* Details */}
      <div className="p-3 w-full">
        <div className="flex items-center gap-2 text-sm text-gray-900 font-semibold">
          <FaFolderOpen className="text-teal-600" />
          <span className="line-clamp-1">
            {r.requirement_title || "(Untitled Requirement)"}
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-600 line-clamp-2 flex items-start gap-2">
          <FaInfoCircle className="mt-0.5 text-amber-600 flex-shrink-0" />
          <span>{r.description || "No description"}</span>
        </p>

        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {r.project_name && (
            <StatBadge
              icon={FaFolderOpen}
              label={`Project: ${r.project_name}`}
              color="text-sky-800"
              bg="bg-sky-100"
              border="border-sky-200"
            />
          )}
          {r.requirement_number && (
            <StatBadge
              icon={FaHashtag}
              label={`Req#: ${r.requirement_number}`}
              color="text-emerald-800"
              bg="bg-emerald-100"
              border="border-emerald-200"
            />
          )}
          <StatBadge
            icon={FaCalendarAlt}
            label={`Created: ${new Date(r.createdAt).toLocaleDateString()}`}
            color="text-fuchsia-800"
            bg="bg-fuchsia-100"
            border="border-fuchsia-200"
          />
          <StatBadge
            icon={FaTag}
            label={`Status: ${r.status ?? "Unknown"}`}
            color="text-rose-800"
            bg="bg-rose-100"
            border="border-rose-200"
          />
        </div>
      </div>
    </div>
  );

  // ✅ UPDATED: List view layout — tiny image LEFT, all content RIGHT
  const RequirementRow = ({ r, index }) => (
    <div
      onClick={() => openSingle(r._id)}
      className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer p-3"
    >
      {/* Row: thumbnail + content */}
      <div className="flex items-center gap-3">
        {/* Small left thumbnail */}
        <img
          src={getCoverImage(r)}
          alt={r.requirement_title || "Requirement"}
          className="w-16 h-16 object-cover rounded-md flex-shrink-0"
        />

        {/* Right side content */}
        <div className="flex-1 p-3">
          {/* Header bar (index + module on left, delete on right) */}
          <ItemHeaderBar
            index={index}
            module={r.module_name}
            onDelete={(e) => handleDelete(e, r._id, r.requirement_title)}
          />

          {/* Title */}
          <div className="mt-2 flex items-center gap-2 text-base text-gray-900 font-semibold">
            <FaFolderOpen className="text-teal-600" />
            <span className="line-clamp-1">
              {r.requirement_title || "(Untitled Requirement)"}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 flex items-start gap-2 mt-1">
            <FaInfoCircle className="mt-0.5 text-amber-600 flex-shrink-0" />
            <span>{r.description || "No description"}</span>
          </p>

          {/* Badges */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {r.project_name && (
              <StatBadge
                icon={FaFolderOpen}
                label={`Project: ${r.project_name}`}
                color="text-sky-800"
                bg="bg-sky-100"
                border="border-sky-200"
              />
            )}
            {r.requirement_number && (
              <StatBadge
                icon={FaHashtag}
                label={`Req#: ${r.requirement_number}`}
                color="text-emerald-800"
                bg="bg-emerald-100"
                border="border-emerald-200"
              />
            )}
            <StatBadge
              icon={FaCalendarAlt}
              label={`Created: ${new Date(r.createdAt).toLocaleDateString()}`}
              color="text-fuchsia-800"
              bg="bg-fuchsia-100"
              border="border-fuchsia-200"
            />
            <StatBadge
              icon={FaTag}
              label={`Status: ${r.status ?? "Unknown"}`}
              color="text-rose-800"
              bg="bg-rose-100"
              border="border-rose-200"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header + Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <h2 className="text-left text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {projectId
                ? moduleName
                  ? `Requirements · ${moduleName}`
                  : "Project Requirements"
                : "All Requirements"}
            </h2>
            {projectId && (
              <Link
                to={`/all-requirements/${projectId}`}
                className="text-xs sm:text-sm text-indigo-600 underline"
              >
                View all modules
              </Link>
            )}
          </div>

          {/* Controls on the RIGHT */}
          <div className="flex items-center gap-2 flex-wrap ml-auto">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-2 top-2.5 text-gray-400" />
              <input
                type="text"
                className="pl-8 pr-3 py-1.5 border rounded-md focus:outline-none text-sm"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Module Filter */}
            <select
              className="border rounded-md px-2 py-1.5 text-sm bg-indigo-50 border-indigo-200 text-indigo-800"
              value={moduleFilter}
              onChange={(e) => onModuleChange(e.target.value)}
              title="Filter by module"
            >
              {moduleOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* Req# filter */}
            <input
              type="text"
              className="border rounded-md px-2 py-1.5 text-sm"
              placeholder="Req# contains..."
              value={reqNumberFilter}
              onChange={(e) => setReqNumberFilter(e.target.value)}
              title="Filter by requirement number"
            />

            {/* Status */}
            <select
              className="border rounded-md px-2 py-1.5 text-sm bg-emerald-50 border-emerald-200 text-emerald-800"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              title="Filter by status"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="border rounded-md px-2 py-1.5 text-sm bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              title="Sort by"
            >
              <option>Newest</option>
              <option>Oldest</option>
              <option>Module A→Z</option>
              <option>Module Z→A</option>
              <option>Req# ↑</option>
              <option>Req# ↓</option>
            </select>

            <button
              onClick={clearFilters}
              className="px-3 py-1.5 rounded-md border hover:bg-gray-50 text-sm bg-rose-50 border-rose-200 text-rose-800"
              title="Clear all filters"
            >
              Clear
            </button>

            {/* View toggles */}
            <div className="flex items-center gap-2">
              <button
                className={`text-base p-1.5 rounded-md border ${
                  view === "list"
                    ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                    : "bg-white text-gray-600"
                }`}
                onClick={() => setView("list")}
                title="List view"
              >
                <FaThList />
              </button>
              <button
                className={`text-base p-1.5 rounded-md border ${
                  view === "card"
                    ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                    : "bg-white text-gray-600"
                }`}
                onClick={() => setView("card")}
                title="Large card view"
              >
                <FaThLarge />
              </button>
              <button
                className={`text-base p-1.5 rounded-md border ${
                  view === "grid"
                    ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                    : "bg-white text-gray-600"
                }`}
                onClick={() => setView("grid")}
                title="Grid view"
              >
                <FaTh />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {filteredAndSorted.map((r, idx) => (
                <div key={r._id} className="flex flex-col items-start">
                  <RequirementCard r={r} index={idx} />
                </div>
              ))}
            </div>
          )}

          {view === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAndSorted.map((r, idx) => (
                <div
                  key={r._id}
                  className="flex flex-col items-start bg-white rounded-lg shadow"
                >
                  <RequirementCard r={r} index={idx} />
                </div>
              ))}
            </div>
          )}

          {/* TRUE LIST: vertical stack with small thumbnail left */}
          {view === "list" && (
            <div className="space-y-5">
              {filteredAndSorted.map((r, idx) => (
                <div key={r._id}>
                  <RequirementRow r={r} index={idx} />
                </div>
              ))}
            </div>
          )}

          {filteredAndSorted.length === 0 && (
            <div className="text-center text-gray-500">
              No requirements found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
