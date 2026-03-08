// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";

// const API = `${globalBackendRoute}/api`;

// const chip = "px-3 py-1 rounded-full text-sm border transition-colors";
// const active = "bg-indigo-600 text-white border-indigo-600";
// const inactive = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";

// export default function AllEvents() {
//   const navigate = useNavigate();
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [selected, setSelected] = useState({}); // _id:boolean
//   const [page, setPage] = useState(1);
//   const pageSize = 12;

//   const token =
//     localStorage.getItem("userToken") || localStorage.getItem("token") || "";

//   const fetchAll = async () => {
//     if (!token) {
//       setErr("Not authenticated.");
//       setLoading(false);
//       return;
//     }
//     setLoading(true);
//     setErr("");
//     try {
//       const res = await axios.get(
//         `${API}/events?page=1&limit=200&sort=-createdAt`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = Array.isArray(res.data?.data) ? res.data.data : [];
//       setRows(data);
//     } catch (e) {
//       console.error("list events error:", e?.response || e);
//       setErr(
//         e?.response?.data?.error ||
//           e?.response?.data?.details ||
//           e?.message ||
//           "Failed to load events."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAll();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // SHOW ALL EVENTS (no creator filter)
//   const allEvents = useMemo(() => rows, [rows]);

//   const filtered = useMemo(() => {
//     let out = allEvents;
//     if (statusFilter !== "all") {
//       out = out.filter(
//         (e) => String(e.status || "").toLowerCase() === statusFilter
//       );
//     }
//     if (search.trim()) {
//       const q = search.trim().toLowerCase();
//       out = out.filter(
//         (e) =>
//           String(e.title || "")
//             .toLowerCase()
//             .includes(q) ||
//           String(e.description || "")
//             .toLowerCase()
//             .includes(q) ||
//           (Array.isArray(e.tags) &&
//             e.tags.some((t) => String(t).toLowerCase().includes(q)))
//       );
//     }
//     return out;
//   }, [allEvents, search, statusFilter]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

//   const toggleAllOnPage = (checked) => {
//     const next = { ...selected };
//     for (const ev of pageRows) next[ev._id] = checked;
//     setSelected(next);
//   };

//   const pickSelectedIds = () =>
//     Object.keys(selected).filter((id) => selected[id]);

//   // ---------- BULK ACTIONS ----------
//   const bulk = async (endpoint, body = {}) => {
//     const ids = pickSelectedIds();
//     if (ids.length === 0) return;
//     try {
//       await axios.post(
//         `${API}/events/bulk/${endpoint}`,
//         { ids, ...body },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       await fetchAll();
//       setSelected({});
//     } catch (e) {
//       console.error(`bulk ${endpoint} error:`, e?.response || e);
//       alert(
//         e?.response?.data?.error ||
//           e?.response?.data?.details ||
//           e?.message ||
//           `Bulk ${endpoint} failed`
//       );
//     }
//   };

//   // ---------- ITEM CARDS ----------
//   const Card = ({ ev }) => {
//     const start = ev.startTime ? new Date(ev.startTime) : null;
//     const end = ev.endTime ? new Date(ev.endTime) : null;
//     const isDeleted = ev.isDeleted;
//     const isPublished = ev.isPublished;
//     return (
//       <div
//         className="border rounded-lg p-4 hover:shadow-sm transition bg-white cursor-pointer"
//         onClick={() => navigate(`/single-event/${ev._id}`)}
//         title="Open event"
//       >
//         <div className="flex items-start justify-between gap-3">
//           <div className="min-w-0">
//             <div className="flex items-center gap-2 flex-wrap">
//               <h3 className="font-semibold text-gray-900 truncate">
//                 {ev.title || "Untitled event"}
//               </h3>
//               <span className="text-xs border rounded px-2 py-0.5 capitalize">
//                 {String(ev.status || "scheduled")}
//               </span>
//               <span
//                 className={`text-[10px] rounded px-2 py-0.5 ${
//                   isPublished
//                     ? "bg-green-100 text-green-700"
//                     : "bg-gray-100 text-gray-700"
//                 }`}
//               >
//                 {isPublished ? "Published" : "Draft"}
//               </span>
//               {isDeleted && (
//                 <span className="text-[10px] rounded px-2 py-0.5 bg-red-100 text-red-700">
//                   Deleted
//                 </span>
//               )}
//             </div>
//             <div className="text-xs text-gray-600 mt-1">
//               {start ? start.toLocaleString() : "—"}
//               {end ? ` – ${end.toLocaleTimeString()}` : ""}
//             </div>
//             <div className="text-sm text-gray-700 mt-2 line-clamp-2">
//               {ev.description || (
//                 <em className="text-gray-400">No description</em>
//               )}
//             </div>
//             {Array.isArray(ev.tags) && ev.tags.length > 0 && (
//               <div className="text-xs text-gray-500 mt-2">
//                 <span className="font-medium">Tags:</span> {ev.tags.join(", ")}
//               </div>
//             )}
//           </div>

//           <input
//             type="checkbox"
//             className="mt-1"
//             checked={!!selected[ev._id]}
//             onClick={(e) => e.stopPropagation()}
//             onChange={(e) =>
//               setSelected((p) => ({ ...p, [ev._id]: e.target.checked }))
//             }
//             title="Select for bulk actions"
//           />
//         </div>

//         <div className="mt-3 flex gap-2">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               navigate(`/single-event/${ev._id}`);
//             }}
//             className="px-3 py-1.5 text-sm rounded border"
//             title="Open"
//           >
//             Open
//           </button>
//           <button
//             onClick={async (e) => {
//               e.stopPropagation();
//               const url = `${API}/events/${ev._id}/${
//                 ev.isPublished ? "unpublish" : "publish"
//               }`;
//               try {
//                 await axios.post(
//                   url,
//                   {},
//                   { headers: { Authorization: `Bearer ${token}` } }
//                 );
//                 await fetchAll();
//               } catch (e2) {
//                 alert(e2?.response?.data?.error || e2?.message || "Failed");
//               }
//             }}
//             className="px-3 py-1.5 text-sm rounded border"
//           >
//             {ev.isPublished ? "Unpublish" : "Publish"}
//           </button>
//           {!ev.isDeleted ? (
//             <button
//               onClick={async (e) => {
//                 e.stopPropagation();
//                 if (!window.confirm("Soft delete this event?")) return;
//                 try {
//                   await axios.delete(`${API}/events/${ev._id}`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                   });
//                   await fetchAll();
//                 } catch (e2) {
//                   alert(
//                     e2?.response?.data?.error || e2?.message || "Delete failed"
//                   );
//                 }
//               }}
//               className="px-3 py-1.5 text-sm rounded border text-red-700"
//             >
//               Soft Delete
//             </button>
//           ) : (
//             <>
//               <button
//                 onClick={async (e) => {
//                   e.stopPropagation();
//                   try {
//                     await axios.post(
//                       `${API}/events/${ev._id}/restore`,
//                       {},
//                       { headers: { Authorization: `Bearer ${token}` } }
//                     );
//                     await fetchAll();
//                   } catch (e2) {
//                     alert(
//                       e2?.response?.data?.error ||
//                         e2?.message ||
//                         "Restore failed"
//                     );
//                   }
//                 }}
//                 className="px-3 py-1.5 text-sm rounded border"
//               >
//                 Restore
//               </button>
//               <button
//                 onClick={async (e) => {
//                   e.stopPropagation();
//                   if (!window.confirm("Hard delete permanently?")) return;
//                   try {
//                     await axios.delete(`${API}/events/${ev._id}/hard`, {
//                       headers: { Authorization: `Bearer ${token}` },
//                     });
//                     await fetchAll();
//                   } catch (e2) {
//                     alert(
//                       e2?.response?.data?.error ||
//                         e2?.message ||
//                         "Hard delete failed"
//                     );
//                   }
//                 }}
//                 className="px-3 py-1.5 text-sm rounded border text-red-700"
//               >
//                 Hard Delete
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   };

//   if (!token) {
//     return (
//       <div className="max-w-6xl mx-auto p-4">
//         <h1 className="text-2xl font-bold">All Events</h1>
//         <p className="text-red-600 mt-2">Please log in.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <div className="flex items-center justify-between gap-3 flex-wrap">
//         <h1 className="text-2xl font-bold">All Events</h1>
//         <input
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
//           placeholder="Search title, description, tags…"
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setPage(1);
//           }}
//         />
//       </div>

//       <div className="flex items-center gap-2 mt-4 flex-wrap">
//         {["all", "scheduled", "live", "completed", "cancelled"].map((k) => (
//           <button
//             key={k}
//             className={`${chip} ${statusFilter === k ? active : inactive}`}
//             onClick={() => {
//               setStatusFilter(k);
//               setPage(1);
//             }}
//             title={`Filter ${k}`}
//           >
//             {k[0].toUpperCase() + k.slice(1)}
//           </button>
//         ))}
//       </div>

//       <div className="mt-4 text-sm text-gray-500">
//         {loading ? "Loading…" : `${filtered.length} event(s)`}
//       </div>

//       {err && (
//         <div className="mt-3 p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200">
//           {err}
//         </div>
//       )}

//       {/* Bulk actions */}
//       <div className="mt-4 flex items-center gap-2 flex-wrap">
//         <button
//           className="px-3 py-1.5 text-sm rounded border"
//           onClick={() => toggleAllOnPage(true)}
//         >
//           Select Page
//         </button>
//         <button
//           className="px-3 py-1.5 text-sm rounded border"
//           onClick={() => toggleAllOnPage(false)}
//         >
//           Clear Page
//         </button>
//         <span className="text-sm text-gray-600 ml-2">
//           {pickSelectedIds().length} selected
//         </span>
//         <div className="ml-auto flex items-center gap-2">
//           <button
//             onClick={() => bulk("publish")}
//             className="px-3 py-1.5 text-sm rounded border"
//           >
//             Bulk Publish
//           </button>
//           <button
//             onClick={() => bulk("unpublish")}
//             className="px-3 py-1.5 text-sm rounded border"
//           >
//             Bulk Unpublish
//           </button>
//           <button
//             onClick={() => bulk("status", { status: "scheduled" })}
//             className="px-3 py-1.5 text-sm rounded border"
//           >
//             Set Scheduled
//           </button>
//           <button
//             onClick={() => bulk("status", { status: "live" })}
//             className="px-3 py-1.5 text-sm rounded border"
//           >
//             Set Live
//           </button>
//           <button
//             onClick={() => bulk("status", { status: "completed" })}
//             className="px-3 py-1.5 text-sm rounded border"
//           >
//             Set Completed
//           </button>
//           <button
//             onClick={() => bulk("status", { status: "cancelled" })}
//             className="px-3 py-1.5 text-sm rounded border"
//           >
//             Set Cancelled
//           </button>
//           <button
//             onClick={() => bulk("soft-delete")}
//             className="px-3 py-1.5 text-sm rounded border text-red-700"
//           >
//             Bulk Soft Delete
//           </button>
//           <button
//             onClick={() => bulk("restore")}
//             className="px-3 py-1.5 text-sm rounded border"
//           >
//             Bulk Restore
//           </button>
//           <button
//             onClick={() => bulk("hard-delete")}
//             className="px-3 py-1.5 text-sm rounded border text-red-700"
//           >
//             Bulk Hard Delete
//           </button>
//         </div>
//       </div>

//       {/* Grid */}
//       <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//         {loading ? (
//           <div className="col-span-full text-gray-500">Fetching events…</div>
//         ) : pageRows.length === 0 ? (
//           <div className="col-span-full text-gray-500">No events.</div>
//         ) : (
//           pageRows.map((ev) => <Card key={ev._id} ev={ev} />)
//         )}
//       </div>

//       {totalPages > 1 && (
//         <div className="mt-4 flex items-center justify-center gap-2">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span className="text-sm text-gray-600">
//             Page {page} of {totalPages}
//           </span>
//           <button
//             disabled={page === totalPages}
//             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

//

"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaSortAmountDownAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import globalBackendRoute from "../../config/Config";
import eventsBanner from "../../assets/images/profile_banner.jpg"; // change if needed

const API = `${globalBackendRoute}/api`;

const FILTERS = [
  { key: "all", label: "All" },
  { key: "scheduled", label: "Scheduled" },
  { key: "live", label: "Live" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const MAIN_HEADING_STYLE =
  "text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 text-uppercase tracking-[0.1em]";

const HERO_TAGS = ["EVENTS", "ADMIN", "PUBLISH", "DELETE", "TRACKING"];

const HERO_STYLE = {
  backgroundImage: `url(${eventsBanner})`,
};

const getFilterButtonClass = (active) =>
  active
    ? "inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-white shadow-sm"
    : "inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50";

const getStatusBadgeClass = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "live":
      return "bg-green-50 text-green-700 border-green-200";
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    case "postponed":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "scheduled":
    default:
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
  }
};

export default function AllEvents() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState({});
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";

  const fetchAll = useCallback(async () => {
    if (!token) {
      setErr("Not authenticated.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErr("");

    try {
      const res = await axios.get(
        `${API}/events?page=1&limit=200&sort=-createdAt`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setRows(data);
    } catch (e) {
      console.error("list events error:", e?.response || e);
      setErr(
        e?.response?.data?.error ||
          e?.response?.data?.details ||
          e?.message ||
          "Failed to load events.",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const allEvents = useMemo(() => rows, [rows]);

  const filtered = useMemo(() => {
    let out = allEvents;

    if (statusFilter !== "all") {
      out = out.filter(
        (e) => String(e.status || "").toLowerCase() === statusFilter,
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      out = out.filter(
        (e) =>
          String(e.title || "")
            .toLowerCase()
            .includes(q) ||
          String(e.description || "")
            .toLowerCase()
            .includes(q) ||
          (Array.isArray(e.tags) &&
            e.tags.some((t) => String(t).toLowerCase().includes(q))),
      );
    }

    return out;
  }, [allEvents, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

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

  const toggleAllOnPage = (checked) => {
    const next = { ...selected };
    for (const ev of pageRows) next[ev._id] = checked;
    setSelected(next);
  };

  const pickSelectedIds = () =>
    Object.keys(selected).filter((id) => selected[id]);

  const bulk = async (endpoint, body = {}) => {
    const ids = pickSelectedIds();
    if (ids.length === 0) return;

    try {
      await axios.post(
        `${API}/events/bulk/${endpoint}`,
        { ids, ...body },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await fetchAll();
      setSelected({});
    } catch (e) {
      console.error(`bulk ${endpoint} error:`, e?.response || e);
      alert(
        e?.response?.data?.error ||
          e?.response?.data?.details ||
          e?.message ||
          `Bulk ${endpoint} failed`,
      );
    }
  };

  const openEvent = useCallback(
    (ev) => {
      navigate(`/single-event/${ev._id}`);
    },
    [navigate],
  );

  const goToNextPage = useCallback(() => {
    setPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  const goToPreviousPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const goToPage = useCallback((pageNo) => {
    setPage(pageNo);
  }, []);

  if (!token) {
    return (
      <div className="service-page-wrap min-h-screen">
        <div className="service-main-container">
          <div className="service-parent-card">
            <h1 className={MAIN_HEADING_STYLE}>All Events</h1>
            <p className="text-red-600 text-sm sm:text-base">Please log in.</p>
          </div>
        </div>
      </div>
    );
  }

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

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight leading-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]">
                All{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
                  events & actions
                </span>
              </h1>

              <p className="mt-2 text-[11px] sm:text-xs md:text-sm text-white/90 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                View all events, search quickly, filter by status, and manage
                publish, restore, and delete actions from one place.
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 text-[11px] sm:text-xs text-white">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Events · Filters · Bulk actions · Pagination
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-[11px] sm:text-xs text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                <span>{filtered.length} filtered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-200" />
                <span>{pickSelectedIds().length} selected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-5 sm:py-6 lg:py-7 space-y-5">
          <div className="rounded-2xl border border-slate-200 p-4 sm:p-5 bg-white shadow-sm flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className={MAIN_HEADING_STYLE}>All Events</h1>

              <div className="relative flex-1 min-w-[180px] max-w-md">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]" />
                <input
                  className="w-full pl-8 pr-3 py-2 rounded-full border border-slate-300 text-slate-900 text-[11px] sm:text-xs shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="Search title, description, tags..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <p className="text-[10px] sm:text-[11px] text-slate-500 whitespace-nowrap">
                  Showing {filtered.length} of {rows.length}
                </p>

                <button
                  type="button"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 transition"
                  title="Sorted by created date"
                  aria-label="Sorted by created date"
                >
                  <FaSortAmountDownAlt className="text-indigo-600 text-xs" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={getFilterButtonClass(statusFilter === f.key)}
                  onClick={() => {
                    setStatusFilter(f.key);
                    setPage(1);
                  }}
                  title={`Filter ${f.label.toLowerCase()}`}
                >
                  <span>{f.label}</span>
                </button>
              ))}
            </div>

            <div className="text-[11px] sm:text-xs text-slate-500">
              {loading ? "Loading events…" : `${filtered.length} event(s)`}
            </div>

            {err && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] sm:text-xs text-red-700">
                {err}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 sm:p-5 bg-white shadow-sm flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                onClick={() => toggleAllOnPage(true)}
              >
                Select Page
              </button>

              <button
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                onClick={() => toggleAllOnPage(false)}
              >
                Clear Page
              </button>

              <span className="text-[11px] sm:text-xs text-slate-600 ml-1">
                {pickSelectedIds().length} selected
              </span>

              <div className="w-full xl:w-auto xl:ml-auto flex flex-wrap gap-2">
                <button
                  onClick={() => bulk("publish")}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Bulk Publish
                </button>
                <button
                  onClick={() => bulk("unpublish")}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Bulk Unpublish
                </button>
                <button
                  onClick={() => bulk("status", { status: "scheduled" })}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Set Scheduled
                </button>
                <button
                  onClick={() => bulk("status", { status: "live" })}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Set Live
                </button>
                <button
                  onClick={() => bulk("status", { status: "completed" })}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Set Completed
                </button>
                <button
                  onClick={() => bulk("status", { status: "cancelled" })}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Set Cancelled
                </button>
                <button
                  onClick={() => bulk("soft-delete")}
                  className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[11px] sm:text-xs font-medium text-red-700 shadow-sm hover:bg-red-50"
                >
                  Bulk Soft Delete
                </button>
                <button
                  onClick={() => bulk("restore")}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Bulk Restore
                </button>
                <button
                  onClick={() => bulk("hard-delete")}
                  className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[11px] sm:text-xs font-medium text-red-700 shadow-sm hover:bg-red-50"
                >
                  Bulk Hard Delete
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            {loading ? (
              <div className="p-6 text-center text-sm text-slate-500">
                Fetching events…
              </div>
            ) : pageRows.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                No events.
              </div>
            ) : (
              <>
                <div className="hidden lg:block overflow-x-auto">
                  <motion.table
                    className="min-w-full border-separate border-spacing-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                  >
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 border-b border-slate-200">
                          Select
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 border-b border-slate-200">
                          Event Name
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 border-b border-slate-200">
                          Date & Time
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 border-b border-slate-200">
                          Tags
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 border-b border-slate-200">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 border-b border-slate-200">
                          Publish
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 border-b border-slate-200">
                          Delete State
                        </th>
                        <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 border-b border-slate-200">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {pageRows.map((ev, index) => {
                        const start = ev.startTime
                          ? new Date(ev.startTime)
                          : null;
                        const end = ev.endTime ? new Date(ev.endTime) : null;
                        const isDeleted = ev.isDeleted;
                        const isPublished = ev.isPublished;

                        return (
                          <tr
                            key={ev._id}
                            className={`transition ${
                              index % 2 === 0
                                ? "bg-white hover:bg-slate-50"
                                : "bg-slate-50/50 hover:bg-slate-50"
                            }`}
                          >
                            <td className="px-4 py-3 align-middle text-center border-b border-slate-200">
                              <input
                                type="checkbox"
                                checked={!!selected[ev._id]}
                                onChange={(e) =>
                                  setSelected((p) => ({
                                    ...p,
                                    [ev._id]: e.target.checked,
                                  }))
                                }
                                title="Select for bulk actions"
                              />
                            </td>

                            <td className="px-4 py-3 align-top border-b border-slate-200">
                              <div className="min-w-0">
                                <button
                                  type="button"
                                  onClick={() => openEvent(ev)}
                                  className="text-left text-[12px] font-semibold text-slate-900 break-words hover:text-indigo-600"
                                  title="Open event"
                                >
                                  {ev.title || "Untitled event"}
                                </button>

                                {ev.description ? (
                                  <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">
                                    {String(ev.description).length > 90
                                      ? `${String(ev.description).slice(0, 90)}…`
                                      : ev.description}
                                  </p>
                                ) : (
                                  <p className="mt-1 text-[11px] italic text-slate-400">
                                    No description
                                  </p>
                                )}
                              </div>
                            </td>

                            <td className="px-4 py-3 align-top border-b border-slate-200">
                              <div className="text-[11px] text-slate-700 leading-relaxed">
                                <div>
                                  {start ? start.toLocaleString() : "—"}
                                </div>
                                {end && (
                                  <div className="text-slate-500">
                                    {end.toLocaleTimeString()}
                                  </div>
                                )}
                              </div>
                            </td>

                            <td className="px-4 py-3 align-top border-b border-slate-200">
                              <p className="text-[11px] text-slate-700 break-words">
                                {Array.isArray(ev.tags) && ev.tags.length > 0
                                  ? ev.tags.join(", ")
                                  : "No tags"}
                              </p>
                            </td>

                            <td className="px-4 py-3 align-top border-b border-slate-200">
                              <span
                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${getStatusBadgeClass(
                                  ev.status || "scheduled",
                                )}`}
                              >
                                {String(ev.status || "scheduled")}
                              </span>
                            </td>

                            <td className="px-4 py-3 align-top border-b border-slate-200">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                  isPublished
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {isPublished ? "Published" : "Draft"}
                              </span>
                            </td>

                            <td className="px-4 py-3 align-top border-b border-slate-200">
                              {isDeleted ? (
                                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-red-100 text-red-700">
                                  Deleted
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700">
                                  Active
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3 align-middle text-center border-b border-slate-200">
                              <div className="flex flex-wrap items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEvent(ev)}
                                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                                  title="Open"
                                >
                                  Open
                                </button>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    const url = `${API}/events/${ev._id}/${
                                      ev.isPublished ? "unpublish" : "publish"
                                    }`;

                                    try {
                                      await axios.post(
                                        url,
                                        {},
                                        {
                                          headers: {
                                            Authorization: `Bearer ${token}`,
                                          },
                                        },
                                      );
                                      await fetchAll();
                                    } catch (e2) {
                                      alert(
                                        e2?.response?.data?.error ||
                                          e2?.message ||
                                          "Failed",
                                      );
                                    }
                                  }}
                                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                                >
                                  {ev.isPublished ? "Unpublish" : "Publish"}
                                </button>

                                {!ev.isDeleted ? (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      if (
                                        !window.confirm(
                                          "Soft delete this event?",
                                        )
                                      )
                                        return;

                                      try {
                                        await axios.delete(
                                          `${API}/events/${ev._id}`,
                                          {
                                            headers: {
                                              Authorization: `Bearer ${token}`,
                                            },
                                          },
                                        );
                                        await fetchAll();
                                      } catch (e2) {
                                        alert(
                                          e2?.response?.data?.error ||
                                            e2?.message ||
                                            "Delete failed",
                                        );
                                      }
                                    }}
                                    className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[11px] font-medium text-red-700 shadow-sm hover:bg-red-50"
                                  >
                                    Soft Delete
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        try {
                                          await axios.post(
                                            `${API}/events/${ev._id}/restore`,
                                            {},
                                            {
                                              headers: {
                                                Authorization: `Bearer ${token}`,
                                              },
                                            },
                                          );
                                          await fetchAll();
                                        } catch (e2) {
                                          alert(
                                            e2?.response?.data?.error ||
                                              e2?.message ||
                                              "Restore failed",
                                          );
                                        }
                                      }}
                                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                                    >
                                      Restore
                                    </button>

                                    <button
                                      type="button"
                                      onClick={async () => {
                                        if (
                                          !window.confirm(
                                            "Hard delete permanently?",
                                          )
                                        )
                                          return;

                                        try {
                                          await axios.delete(
                                            `${API}/events/${ev._id}/hard`,
                                            {
                                              headers: {
                                                Authorization: `Bearer ${token}`,
                                              },
                                            },
                                          );
                                          await fetchAll();
                                        } catch (e2) {
                                          alert(
                                            e2?.response?.data?.error ||
                                              e2?.message ||
                                              "Hard delete failed",
                                          );
                                        }
                                      }}
                                      className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[11px] font-medium text-red-700 shadow-sm hover:bg-red-50"
                                    >
                                      Hard Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </motion.table>
                </div>

                <div className="lg:hidden divide-y divide-slate-200">
                  {pageRows.map((ev) => {
                    const start = ev.startTime ? new Date(ev.startTime) : null;
                    const end = ev.endTime ? new Date(ev.endTime) : null;
                    const isDeleted = ev.isDeleted;
                    const isPublished = ev.isPublished;

                    return (
                      <div key={ev._id} className="p-4 space-y-3 bg-white">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => openEvent(ev)}
                              className="text-left text-sm font-semibold text-slate-900 hover:text-indigo-600"
                            >
                              {ev.title || "Untitled event"}
                            </button>

                            {ev.description ? (
                              <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">
                                {String(ev.description).length > 110
                                  ? `${String(ev.description).slice(0, 110)}…`
                                  : ev.description}
                              </p>
                            ) : (
                              <p className="mt-1 text-[11px] italic text-slate-400">
                                No description
                              </p>
                            )}
                          </div>

                          <input
                            type="checkbox"
                            checked={!!selected[ev._id]}
                            onChange={(e) =>
                              setSelected((p) => ({
                                ...p,
                                [ev._id]: e.target.checked,
                              }))
                            }
                            title="Select for bulk actions"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${getStatusBadgeClass(
                              ev.status || "scheduled",
                            )}`}
                          >
                            {String(ev.status || "scheduled")}
                          </span>

                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              isPublished
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {isPublished ? "Published" : "Draft"}
                          </span>

                          {isDeleted && (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-red-100 text-red-700">
                              Deleted
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div className="rounded-lg border border-slate-200 bg-white p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-700">
                              Date & Time
                            </p>
                            <p className="mt-1 text-slate-700 break-words">
                              {start ? start.toLocaleString() : "—"}
                              {end ? ` – ${end.toLocaleTimeString()}` : ""}
                            </p>
                          </div>

                          <div className="rounded-lg border border-slate-200 bg-white p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-700">
                              Tags
                            </p>
                            <p className="mt-1 text-slate-700 break-words">
                              {Array.isArray(ev.tags) && ev.tags.length > 0
                                ? ev.tags.join(", ")
                                : "No tags"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                            onClick={() => openEvent(ev)}
                          >
                            Open
                          </button>

                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                            onClick={async () => {
                              const url = `${API}/events/${ev._id}/${
                                ev.isPublished ? "unpublish" : "publish"
                              }`;

                              try {
                                await axios.post(
                                  url,
                                  {},
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  },
                                );
                                await fetchAll();
                              } catch (e2) {
                                alert(
                                  e2?.response?.data?.error ||
                                    e2?.message ||
                                    "Failed",
                                );
                              }
                            }}
                          >
                            {ev.isPublished ? "Unpublish" : "Publish"}
                          </button>

                          {!ev.isDeleted ? (
                            <button
                              type="button"
                              className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-2 text-[11px] font-medium text-red-700 shadow-sm hover:bg-red-50"
                              onClick={async () => {
                                if (!window.confirm("Soft delete this event?"))
                                  return;

                                try {
                                  await axios.delete(
                                    `${API}/events/${ev._id}`,
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    },
                                  );
                                  await fetchAll();
                                } catch (e2) {
                                  alert(
                                    e2?.response?.data?.error ||
                                      e2?.message ||
                                      "Delete failed",
                                  );
                                }
                              }}
                            >
                              Soft Delete
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                                onClick={async () => {
                                  try {
                                    await axios.post(
                                      `${API}/events/${ev._id}/restore`,
                                      {},
                                      {
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      },
                                    );
                                    await fetchAll();
                                  } catch (e2) {
                                    alert(
                                      e2?.response?.data?.error ||
                                        e2?.message ||
                                        "Restore failed",
                                    );
                                  }
                                }}
                              >
                                Restore
                              </button>

                              <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-2 text-[11px] font-medium text-red-700 shadow-sm hover:bg-red-50"
                                onClick={async () => {
                                  if (
                                    !window.confirm("Hard delete permanently?")
                                  )
                                    return;

                                  try {
                                    await axios.delete(
                                      `${API}/events/${ev._id}/hard`,
                                      {
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      },
                                    );
                                    await fetchAll();
                                  } catch (e2) {
                                    alert(
                                      e2?.response?.data?.error ||
                                        e2?.message ||
                                        "Hard delete failed",
                                    );
                                  }
                                }}
                              >
                                Hard Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {totalPages > 1 && (
            <div className="rounded-2xl border border-slate-200 p-4 bg-white shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-[11px] sm:text-sm text-slate-700">
                  Page <span className="font-semibold">{page}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousPage}
                    disabled={page === 1}
                    className={`inline-flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-lg border text-xs font-medium transition ${
                      page === 1
                        ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50"
                    }`}
                    aria-label="Go to previous page"
                  >
                    <FaArrowLeft />
                  </button>

                  {pageNumbers[0] > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => goToPage(1)}
                        className="inline-flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition"
                      >
                        1
                      </button>
                      {pageNumbers[0] > 2 && (
                        <span className="px-1 text-slate-400 text-xs">...</span>
                      )}
                    </>
                  )}

                  {pageNumbers.map((pageNo) => (
                    <button
                      key={pageNo}
                      type="button"
                      onClick={() => goToPage(pageNo)}
                      className={`inline-flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-lg text-xs font-medium transition ${
                        page === pageNo
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {pageNo}
                    </button>
                  ))}

                  {pageNumbers[pageNumbers.length - 1] < totalPages && (
                    <>
                      {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                        <span className="px-1 text-slate-400 text-xs">...</span>
                      )}
                      <button
                        type="button"
                        onClick={() => goToPage(totalPages)}
                        className="inline-flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={goToNextPage}
                    disabled={page === totalPages}
                    className={`inline-flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-lg border text-xs font-medium transition ${
                      page === totalPages
                        ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50"
                    }`}
                    aria-label="Go to next page"
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
