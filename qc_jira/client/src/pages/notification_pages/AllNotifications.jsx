// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import {
//   FaSearch,
//   FaFilter,
//   FaSync,
//   FaThList,
//   FaThLarge,
//   FaTh,
//   FaArrowLeft,
//   FaArrowRight,
//   FaSortAmountDown,
// } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import globalBackendRoute from "../../config/Config";

// const AllNotifications = () => {
//   const navigate = useNavigate();

//   // View + Pagination
//   const [view, setView] = useState("grid");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(20);
//   const [total, setTotal] = useState(0);

//   // Filters / Search
//   const [search, setSearch] = useState("");
//   const [audience, setAudience] = useState("");
//   const [role, setRole] = useState("");
//   const [type, setType] = useState("");
//   const [priority, setPriority] = useState("");
//   const [status, setStatus] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [sort, setSort] = useState("-createdAt");

//   // Data
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadErr, setLoadErr] = useState("");

//   const token =
//     localStorage.getItem("userToken") || localStorage.getItem("token");
//   const canQuery = useMemo(() => !!token, [token]);
//   const authHeader = useMemo(
//     () => (token ? { Authorization: `Bearer ${token}` } : undefined),
//     [token]
//   );

//   const resetFilters = () => {
//     setSearch("");
//     setAudience("");
//     setRole("");
//     setType("");
//     setPriority("");
//     setStatus("");
//     setFromDate("");
//     setToDate("");
//     setSort("-createdAt");
//     setPage(1);
//     setLimit(20);
//   };

//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       setLoadErr("");

//       const params = { page, limit, sort };
//       if (search.trim()) params.search = search.trim();
//       if (audience) params.audience = audience;
//       if (role) params.role = role;
//       if (type) params.type = type;
//       if (priority) params.priority = priority;
//       if (status) params.status = status;
//       if (fromDate) params.from = fromDate;
//       if (toDate) params.to = toDate;

//       const res = await axios.get(`${globalBackendRoute}/api/admin/messages`, {
//         params,
//         headers: authHeader,
//       });

//       const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
//       const totalRows = Number(res?.data?.total || 0);

//       setData(rows);
//       setTotal(totalRows);
//     } catch (err) {
//       console.error("Fetch notifications failed:", err);
//       setLoadErr(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Failed to load notifications."
//       );
//       setData([]);
//       setTotal(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Effects
//   useEffect(() => {
//     if (!canQuery) return;
//     fetchNotifications();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     page,
//     limit,
//     audience,
//     role,
//     type,
//     priority,
//     status,
//     fromDate,
//     toDate,
//     sort,
//   ]);

//   // Debounce search
//   useEffect(() => {
//     if (!canQuery) return;
//     const t = setTimeout(() => {
//       setPage(1);
//       fetchNotifications();
//     }, 350);
//     return () => clearTimeout(t);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search]);

//   const totalPages = Math.max(1, Math.ceil(total / limit));
//   const nextPage = () => setPage((p) => Math.min(totalPages, p + 1));
//   const prevPage = () => setPage((p) => Math.max(1, p - 1));

//   const roleOptions = [
//     "accountant",
//     "admin",
//     "alumni_relations",
//     "business_analyst",
//     "content_creator",
//     "course_coordinator",
//     "customer_support",
//     "data_scientist",
//     "dean",
//     "department_head",
//     "developer",
//     "developer_lead",
//     "event_coordinator",
//     "exam_controller",
//     "hr_manager",
//     "intern",
//     "legal_advisor",
//     "librarian",
//     "maintenance_staff",
//     "marketing_manager",
//     "operations_manager",
//     "product_owner",
//     "project_manager",
//     "qa_lead",
//     "recruiter",
//     "registrar",
//     "researcher",
//     "sales_executive",
//     "student",
//     "superadmin",
//     "support_engineer",
//     "teacher",
//     "tech_lead",
//     "test_engineer",
//     "test_lead",
//     "user",
//     "ux_ui_designer",
//   ];
//   const typeOptions = [
//     "task_update",
//     "bug_report",
//     "comment",
//     "reply",
//     "alert",
//   ];
//   const priorityOptions = ["low", "medium", "high", "urgent"];
//   const statusOptions = ["unread", "read", "seen", "replied"];

//   const ItemCard = ({ n }) => (
//     <Link
//       to={`/notification/${n._id}`}
//       className="block bg-white border rounded-lg p-4 hover:shadow-md transition"
//     >
//       <div className="flex items-center justify-between mb-2">
//         <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
//           {n.audience}
//         </span>
//         <span className="text-xs text-gray-500">
//           {n.createdAt ? new Date(n.createdAt).toLocaleString() : "-"}
//         </span>
//       </div>
//       <div className="text-sm text-gray-600">
//         <div className="font-semibold text-gray-800 line-clamp-2">
//           {n.message || "—"}
//         </div>
//         <div className="mt-2 flex flex-wrap items-center gap-3">
//           {n.receiverRole && (
//             <span className="text-[11px] px-2 py-1 rounded bg-indigo-50 text-indigo-700">
//               Role: {n.receiverRole}
//             </span>
//           )}
//           {n.type && (
//             <span className="text-[11px] px-2 py-1 rounded bg-blue-50 text-blue-700">
//               {n.type}
//             </span>
//           )}
//           {n.priority && (
//             <span className="text-[11px] px-2 py-1 rounded bg-amber-50 text-amber-700">
//               {n.priority}
//             </span>
//           )}
//           {n.sender?.name && (
//             <span className="text-[11px] px-2 py-1 rounded bg-gray-100 text-gray-700">
//               From: {n.sender.name}
//             </span>
//           )}
//         </div>
//       </div>
//     </Link>
//   );

//   const ItemRow = ({ n }) => (
//     <tr className="hover:bg-gray-50">
//       <td className="px-4 py-2 whitespace-nowrap text-xs">
//         <Link
//           to={`/notification/${n._id}`}
//           className="text-indigo-600 underline"
//         >
//           {n._id}
//         </Link>
//       </td>
//       <td className="px-4 py-2 text-sm text-gray-800">{n.message || "—"}</td>
//       <td className="px-4 py-2 text-xs">{n.audience || "—"}</td>
//       <td className="px-4 py-2 text-xs">{n.receiverRole || "—"}</td>
//       <td className="px-4 py-2 text-xs">{n.type || "—"}</td>
//       <td className="px-4 py-2 text-xs">{n.priority || "—"}</td>
//       <td className="px-4 py-2 text-xs">{n.sender?.name || "—"}</td>
//       <td className="px-4 py-2 text-xs text-gray-500">
//         {n.createdAt ? new Date(n.createdAt).toLocaleString() : "—"}
//       </td>
//     </tr>
//   );

//   return (
//     <div className="py-16 sm:py-20">
//       <div className="mx-auto max-w-7xl px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
//           <h3 className="text-2xl font-bold text-start text-indigo-600">
//             All Notifications
//           </h3>
//           <div className="flex items-center space-x-3">
//             <FaThList
//               className={`text-xl cursor-pointer ${
//                 view === "list" ? "text-indigo-600" : "text-gray-600"
//               }`}
//               title="List view"
//               onClick={() => setView("list")}
//             />
//             <FaThLarge
//               className={`text-xl cursor-pointer ${
//                 view === "card" ? "text-indigo-600" : "text-gray-600"
//               }`}
//               title="Card view"
//               onClick={() => setView("card")}
//             />
//             <FaTh
//               className={`text-xl cursor-pointer ${
//                 view === "grid" ? "text-indigo-600" : "text-gray-600"
//               }`}
//               title="Grid view"
//               onClick={() => setView("grid")}
//             />
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white border rounded-lg p-4 mb-5">
//           <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
//             <div className="col-span-1 md:col-span-2 lg:col-span-2">
//               <label className="block text-xs font-semibold text-gray-600 mb-1">
//                 Search (message / sender / role)
//               </label>
//               <div className="relative">
//                 <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
//                 <input
//                   type="text"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
//                   placeholder="Type to search..."
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-gray-600 mb-1">
//                 Audience
//               </label>
//               <select
//                 value={audience}
//                 onChange={(e) => {
//                   setAudience(e.target.value);
//                   setPage(1);
//                 }}
//                 className="w-full px-3 py-2 border rounded-md text-sm"
//               >
//                 <option value="">All</option>
//                 {["all", "role", "user"].map((a) => (
//                   <option key={a} value={a}>
//                     {a}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-gray-600 mb-1">
//                 Receiver Role
//               </label>
//               <select
//                 value={role}
//                 onChange={(e) => {
//                   setRole(e.target.value);
//                   setPage(1);
//                 }}
//                 className="w-full px-3 py-2 border rounded-md text-sm"
//               >
//                 <option value="">Any</option>
//                 {roleOptions.map((r) => (
//                   <option key={r} value={r}>
//                     {r}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-gray-600 mb-1">
//                 Type
//               </label>
//               <select
//                 value={type}
//                 onChange={(e) => {
//                   setType(e.target.value);
//                   setPage(1);
//                 }}
//                 className="w-full px-3 py-2 border rounded-md text-sm"
//               >
//                 <option value="">Any</option>
//                 {typeOptions.map((t) => (
//                   <option key={t} value={t}>
//                     {t}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-gray-600 mb-1">
//                 Priority
//               </label>
//               <select
//                 value={priority}
//                 onChange={(e) => {
//                   setPriority(e.target.value);
//                   setPage(1);
//                 }}
//                 className="w-full px-3 py-2 border rounded-md text-sm"
//               >
//                 <option value="">Any</option>
//                 {["low", "medium", "high", "urgent"].map((p) => (
//                   <option key={p} value={p}>
//                     {p}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-gray-600 mb-1">
//                 Status
//               </label>
//               <select
//                 value={status}
//                 onChange={(e) => {
//                   setStatus(e.target.value);
//                   setPage(1);
//                 }}
//                 className="w-full px-3 py-2 border rounded-md text-sm"
//               >
//                 <option value="">Any</option>
//                 {statusOptions.map((s) => (
//                   <option key={s} value={s}>
//                     {s}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-gray-600 mb-1">
//                 From
//               </label>
//               <input
//                 type="date"
//                 value={fromDate}
//                 onChange={(e) => {
//                   setFromDate(e.target.value);
//                   setPage(1);
//                 }}
//                 className="w-full px-3 py-2 border rounded-md text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-gray-600 mb-1">
//                 To
//               </label>
//               <input
//                 type="date"
//                 value={toDate}
//                 onChange={(e) => {
//                   setToDate(e.target.value);
//                   setPage(1);
//                 }}
//                 className="w-full px-3 py-2 border rounded-md text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-gray-600 mb-1">
//                 Sort
//               </label>
//               <div className="relative">
//                 <FaSortAmountDown className="absolute left-3 top-2.5 text-gray-400" />
//                 <select
//                   value={sort}
//                   onChange={(e) => {
//                     setSort(e.target.value);
//                     setPage(1);
//                   }}
//                   className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
//                 >
//                   <option value="-createdAt">Newest first</option>
//                   <option value="createdAt">Oldest first</option>
//                   <option value="priority">Priority (low→high)</option>
//                   <option value="-priority">Priority (high→low)</option>
//                   <option value="type">Type (A→Z)</option>
//                   <option value="-type">Type (Z→A)</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex items-end gap-2">
//               <button
//                 type="button"
//                 onClick={resetFilters}
//                 className="inline-flex items-center px-3 py-2 border rounded-md text-sm bg-white hover:bg-gray-50"
//               >
//                 <FaFilter className="mr-2" /> Reset
//               </button>
//               <button
//                 type="button"
//                 onClick={fetchNotifications}
//                 className="inline-flex items-center px-3 py-2 border rounded-md text-sm bg-white hover:bg-gray-50"
//               >
//                 <FaSync className={`mr-2 ${loading ? "animate-spin" : ""}`} />{" "}
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="bg-white border rounded-lg p-0">
//           {loading && <div className="p-6 text-sm text-gray-600">Loading…</div>}
//           {!loading && loadErr && (
//             <div className="p-6 text-sm text-red-600">{loadErr}</div>
//           )}
//           {!loading && !loadErr && data.length === 0 && (
//             <div className="p-6 text-sm text-gray-600">
//               No notifications found.
//             </div>
//           )}

//           {!loading && !loadErr && data.length > 0 && (
//             <>
//               {view === "list" && (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         {[
//                           "ID",
//                           "Message",
//                           "Audience",
//                           "Role",
//                           "Type",
//                           "Priority",
//                           "Sender",
//                           "Created",
//                         ].map((h) => (
//                           <th
//                             key={h}
//                             className="px-4 py-2 text-left text-xs font-semibold text-gray-600"
//                           >
//                             {h}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100 bg-white">
//                       {data.map((n) => (
//                         <ItemRow key={n._id} n={n} />
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {view === "card" && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
//                   {data.map((n) => (
//                     <ItemCard key={n._id} n={n} />
//                   ))}
//                 </div>
//               )}

//               {view === "grid" && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
//                   {data.map((n) => (
//                     <ItemCard key={n._id} n={n} />
//                   ))}
//                 </div>
//               )}

//               <div className="flex items-center justify-between px-4 py-3 border-t">
//                 <div className="text-xs text-gray-600">
//                   Page <span className="font-semibold">{page}</span> of{" "}
//                   <span className="font-semibold">{totalPages}</span> • Total:{" "}
//                   <span className="font-semibold">{total}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <select
//                     value={limit}
//                     onChange={(e) => {
//                       setLimit(Number(e.target.value));
//                       setPage(1);
//                     }}
//                     className="px-2 py-1 border rounded text-xs"
//                   >
//                     {[10, 20, 30, 50].map((n) => (
//                       <option key={n} value={n}>
//                         {n} / page
//                       </option>
//                     ))}
//                   </select>

//                   <button
//                     onClick={prevPage}
//                     disabled={page <= 1}
//                     className={`inline-flex items-center px-3 py-1 border rounded text-xs ${
//                       page <= 1
//                         ? "opacity-50 cursor-not-allowed"
//                         : "bg-white hover:bg-gray-50"
//                     }`}
//                   >
//                     <FaArrowLeft className="mr-2" /> Prev
//                   </button>
//                   <button
//                     onClick={nextPage}
//                     disabled={page >= totalPages}
//                     className={`inline-flex items-center px-3 py-1 border rounded text-xs ${
//                       page >= totalPages
//                         ? "opacity-50 cursor-not-allowed"
//                         : "bg-white hover:bg-gray-50"
//                     }`}
//                   >
//                     Next <FaArrowRight className="ml-2" />
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         <div className="mt-6 flex items-center justify-between">
//           <button
//             onClick={() => navigate(-1)}
//             className="text-sm text-indigo-600 hover:text-indigo-800 underline"
//           >
//             Go Back
//           </button>
//           <Link
//             to="/create-notification"
//             className="text-sm text-indigo-600 hover:text-indigo-800 underline"
//           >
//             Create Notification
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllNotifications;

//

"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaFilter,
  FaSync,
  FaThList,
  FaThLarge,
  FaTh,
  FaArrowLeft,
  FaArrowRight,
  FaSortAmountDown,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";
import notificationsBanner from "../../assets/images/profile_banner.jpg"; // change if needed

const AllNotifications = () => {
  const navigate = useNavigate();

  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [audience, setAudience] = useState("");
  const [role, setRole] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sort, setSort] = useState("-createdAt");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState("");

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token");
  const canQuery = useMemo(() => !!token, [token]);
  const authHeader = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token],
  );

  const HERO_TAGS = [
    "NOTIFICATIONS",
    "ADMIN",
    "FILTERS",
    "AUDIENCE",
    "MESSAGES",
  ];
  const HERO_STYLE = {
    backgroundImage: `url(${notificationsBanner})`,
  };

  const resetFilters = () => {
    setSearch("");
    setAudience("");
    setRole("");
    setType("");
    setPriority("");
    setStatus("");
    setFromDate("");
    setToDate("");
    setSort("-createdAt");
    setPage(1);
    setLimit(20);
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setLoadErr("");

      const params = { page, limit, sort };
      if (search.trim()) params.search = search.trim();
      if (audience) params.audience = audience;
      if (role) params.role = role;
      if (type) params.type = type;
      if (priority) params.priority = priority;
      if (status) params.status = status;
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const res = await axios.get(`${globalBackendRoute}/api/admin/messages`, {
        params,
        headers: authHeader,
      });

      const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
      const totalRows = Number(res?.data?.total || 0);

      setData(rows);
      setTotal(totalRows);
    } catch (err) {
      console.error("Fetch notifications failed:", err);
      setLoadErr(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load notifications.",
      );
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canQuery) return;
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    limit,
    audience,
    role,
    type,
    priority,
    status,
    fromDate,
    toDate,
    sort,
  ]);

  useEffect(() => {
    if (!canQuery) return;
    const t = setTimeout(() => {
      setPage(1);
      fetchNotifications();
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const nextPage = () => setPage((p) => Math.min(totalPages, p + 1));
  const prevPage = () => setPage((p) => Math.max(1, p - 1));

  const roleOptions = [
    "accountant",
    "admin",
    "alumni_relations",
    "business_analyst",
    "content_creator",
    "course_coordinator",
    "customer_support",
    "data_scientist",
    "dean",
    "department_head",
    "developer",
    "developer_lead",
    "event_coordinator",
    "exam_controller",
    "hr_manager",
    "intern",
    "legal_advisor",
    "librarian",
    "maintenance_staff",
    "marketing_manager",
    "operations_manager",
    "product_owner",
    "project_manager",
    "qa_lead",
    "recruiter",
    "registrar",
    "researcher",
    "sales_executive",
    "student",
    "superadmin",
    "support_engineer",
    "teacher",
    "tech_lead",
    "test_engineer",
    "test_lead",
    "user",
    "ux_ui_designer",
  ];
  const typeOptions = [
    "task_update",
    "bug_report",
    "comment",
    "reply",
    "alert",
  ];
  const priorityOptions = ["low", "medium", "high", "urgent"];
  const statusOptions = ["unread", "read", "seen", "replied"];

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [page, totalPages]);

  const ItemCard = ({ n }) => (
    <Link
      to={`/notification/${n._id}`}
      className="block bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition"
    >
      <div className="flex items-center justify-between mb-2 gap-2">
        <span className="text-[10px] sm:text-xs font-semibold text-indigo-600 uppercase tracking-[0.14em]">
          {n.audience}
        </span>
        <span className="text-[10px] sm:text-xs text-slate-500">
          {n.createdAt ? new Date(n.createdAt).toLocaleString() : "-"}
        </span>
      </div>

      <div className="font-semibold text-slate-800 text-sm line-clamp-2">
        {n.message || "—"}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {n.receiverRole && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
            Role: {n.receiverRole}
          </span>
        )}
        {n.type && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-700">
            {n.type}
          </span>
        )}
        {n.priority && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-amber-50 text-amber-700">
            {n.priority}
          </span>
        )}
        {n.sender?.name && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-700">
            From: {n.sender.name}
          </span>
        )}
      </div>
    </Link>
  );

  const ItemRow = ({ n }) => (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3 whitespace-nowrap text-xs border-b border-slate-200">
        <Link
          to={`/notification/${n._id}`}
          className="text-indigo-600 underline"
        >
          {n._id}
        </Link>
      </td>
      <td className="px-4 py-3 text-sm text-slate-800 border-b border-slate-200">
        {n.message || "—"}
      </td>
      <td className="px-4 py-3 text-xs border-b border-slate-200">
        {n.audience || "—"}
      </td>
      <td className="px-4 py-3 text-xs border-b border-slate-200">
        {n.receiverRole || "—"}
      </td>
      <td className="px-4 py-3 text-xs border-b border-slate-200">
        {n.type || "—"}
      </td>
      <td className="px-4 py-3 text-xs border-b border-slate-200">
        {n.priority || "—"}
      </td>
      <td className="px-4 py-3 text-xs border-b border-slate-200">
        {n.sender?.name || "—"}
      </td>
      <td className="px-4 py-3 text-xs text-slate-500 border-b border-slate-200">
        {n.createdAt ? new Date(n.createdAt).toLocaleString() : "—"}
      </td>
    </tr>
  );

  return (
    <div className="service-page-wrap min-h-screen">
      <section className="service-hero-section" style={HERO_STYLE}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/50" />
        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-black/30 via-black/10 to-black/30" />
        <div className="service-hero-overlay-3" />

        <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                {HERO_TAGS.map((item) => (
                  <span key={item} className="service-tag-pill">
                    {item}
                  </span>
                ))}
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight leading-tight text-white">
                All{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
                  notifications & filters
                </span>
              </h1>

              <p className="mt-2 text-[11px] sm:text-xs md:text-sm text-white/90 max-w-2xl leading-relaxed">
                Browse all notifications, filter by audience, role, type,
                priority, and status, then inspect them in table, card, or grid
                view.
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 text-[11px] sm:text-xs text-white">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Notifications · Filters · Search · Pagination
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaThList
                className={`text-lg cursor-pointer ${
                  view === "list" ? "text-white" : "text-white/70"
                }`}
                title="List view"
                onClick={() => setView("list")}
              />
              <FaThLarge
                className={`text-lg cursor-pointer ${
                  view === "card" ? "text-white" : "text-white/70"
                }`}
                title="Card view"
                onClick={() => setView("card")}
              />
              <FaTh
                className={`text-lg cursor-pointer ${
                  view === "grid" ? "text-white" : "text-white/70"
                }`}
                title="Grid view"
                onClick={() => setView("grid")}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-5 sm:py-6 lg:py-7 space-y-5">
          <div className="service-parent-card">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="md:col-span-2 lg:col-span-2">
                <label className="form-label">Search</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-input pl-9"
                    placeholder="Type to search..."
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Audience</label>
                <select
                  value={audience}
                  onChange={(e) => {
                    setAudience(e.target.value);
                    setPage(1);
                  }}
                  className="form-input"
                >
                  <option value="">All</option>
                  {["all", "role", "user"].map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Receiver Role</label>
                <select
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setPage(1);
                  }}
                  className="form-input"
                >
                  <option value="">Any</option>
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Type</label>
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setPage(1);
                  }}
                  className="form-input"
                >
                  <option value="">Any</option>
                  {typeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => {
                    setPriority(e.target.value);
                    setPage(1);
                  }}
                  className="form-input"
                >
                  <option value="">Any</option>
                  {priorityOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Status</label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="form-input"
                >
                  <option value="">Any</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">From</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setPage(1);
                  }}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">To</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setPage(1);
                  }}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Sort</label>
                <div className="relative">
                  <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                    className="form-input pl-9"
                  >
                    <option value="-createdAt">Newest first</option>
                    <option value="createdAt">Oldest first</option>
                    <option value="priority">Priority (low→high)</option>
                    <option value="-priority">Priority (high→low)</option>
                    <option value="type">Type (A→Z)</option>
                    <option value="-type">Type (Z→A)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white hover:bg-slate-50"
                >
                  <FaFilter className="mr-2" /> Reset
                </button>
                <button
                  type="button"
                  onClick={fetchNotifications}
                  className="inline-flex items-center px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white hover:bg-slate-50"
                >
                  <FaSync className={`mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            {loading && (
              <div className="p-6 text-sm text-slate-600">Loading…</div>
            )}
            {!loading && loadErr && (
              <div className="p-6 text-sm text-red-600">{loadErr}</div>
            )}
            {!loading && !loadErr && data.length === 0 && (
              <div className="p-6 text-sm text-slate-600">
                No notifications found.
              </div>
            )}

            {!loading && !loadErr && data.length > 0 && (
              <>
                {view === "list" && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0">
                      <thead>
                        <tr className="bg-slate-50">
                          {[
                            "ID",
                            "Message",
                            "Audience",
                            "Role",
                            "Type",
                            "Priority",
                            "Sender",
                            "Created",
                          ].map((h) => (
                            <th
                              key={h}
                              className="px-4 py-3 text-left text-xs font-semibold text-slate-600 border-b border-slate-200"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((n) => (
                          <ItemRow key={n._id} n={n} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {view === "card" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {data.map((n) => (
                      <ItemCard key={n._id} n={n} />
                    ))}
                  </div>
                )}

                {view === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                    {data.map((n) => (
                      <ItemCard key={n._id} n={n} />
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-t border-slate-200">
                  <div className="text-[11px] sm:text-sm text-slate-700">
                    Page <span className="font-semibold">{page}</span> of{" "}
                    <span className="font-semibold">{totalPages}</span> • Total:{" "}
                    <span className="font-semibold">{total}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                      }}
                      className="px-2 py-2 border border-slate-200 rounded-lg text-xs"
                    >
                      {[10, 20, 30, 50].map((n) => (
                        <option key={n} value={n}>
                          {n} / page
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={prevPage}
                      disabled={page <= 1}
                      className={`inline-flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-lg border text-xs font-medium transition ${
                        page <= 1
                          ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50"
                      }`}
                    >
                      <FaArrowLeft className="mr-2" /> Prev
                    </button>

                    {pageNumbers.map((pageNo) => (
                      <button
                        key={pageNo}
                        type="button"
                        onClick={() => setPage(pageNo)}
                        className={`inline-flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-lg text-xs font-medium transition ${
                          page === pageNo
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {pageNo}
                      </button>
                    ))}

                    <button
                      onClick={nextPage}
                      disabled={page >= totalPages}
                      className={`inline-flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-lg border text-xs font-medium transition ${
                        page >= totalPages
                          ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50"
                      }`}
                    >
                      Next <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-indigo-600 hover:text-indigo-800 underline"
            >
              Go Back
            </button>
            <Link
              to="/create-notification"
              className="text-sm text-indigo-600 hover:text-indigo-800 underline"
            >
              Create Notification
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllNotifications;
