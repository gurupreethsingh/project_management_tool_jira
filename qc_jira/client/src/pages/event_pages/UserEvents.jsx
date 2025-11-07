// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";

// const API = `${globalBackendRoute}/api`;

// // Status filters (aligned with your EventModel/Controller)
// const FILTERS = [
//   { key: "all", label: "All" },
//   { key: "upcoming", label: "Upcoming" }, // startTime > now, published & not deleted
//   { key: "live", label: "Live" },         // status: live (or within time window)
//   { key: "scheduled", label: "Scheduled" },
//   { key: "completed", label: "Completed" },
//   { key: "cancelled", label: "Cancelled" },
//   { key: "postponed", label: "Postponed" },
// ];

// const chipStyles =
//   "px-3 py-1 rounded-full text-sm border transition-colors";
// const activeChip = "bg-indigo-600 text-white border-indigo-600";
// const inactiveChip =
//   "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";

// export default function UserEvents() {
//   const navigate = useNavigate();

//   const [raw, setRaw] = useState([]);     // events as returned by API
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   const [filter, setFilter] = useState("all");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const pageSize = 10;

//   const token =
//     localStorage.getItem("userToken") ||
//     localStorage.getItem("token") ||
//     "";

//   let user = null;
//   try {
//     user = JSON.parse(localStorage.getItem("user"));
//   } catch {
//     user = null;
//   }
//   const userId = user?._id || user?.id;
//   const role = user?.role || "";

//   useEffect(() => {
//     if (!token || !userId) {
//       setLoading(false);
//       setErr("Not authenticated.");
//       return;
//     }

//     setLoading(true);
//     setErr("");

//     // We use /events/visible, request a reasonably large page to allow local filtering & counts.
//     // Server supports page+limit; we just need total or a chunk. We'll use limit=200 by default.
//     const params = new URLSearchParams({
//       userId,
//       role,
//       sort: "startTime", // upcoming first (ascending)
//       limit: "200",
//       page: "1",
//       isPublished: "true", // for badge-like experience; remove if you want drafts too
//     });

//     axios
//       .get(`${API}/events/visible?${params.toString()}`, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       })
//       .then((res) => {
//         const rows = Array.isArray(res.data?.data) ? res.data.data : [];
//         setRaw(rows);
//       })
//       .catch((e) => {
//         console.error("events/visible error:", e?.response || e);
//         setErr(
//           e?.response?.data?.error ||
//             e?.response?.data?.details ||
//             e?.message ||
//             "Failed to load events."
//         );
//       })
//       .finally(() => setLoading(false));
//   }, [token, userId, role]);

//   // Normalize rows with derived properties for filtering
//   const normalized = useMemo(() => {
//     const now = new Date();
//     return raw.map((ev) => {
//       const status = String(ev?.status || "scheduled").toLowerCase();
//       const start = ev?.startTime ? new Date(ev.startTime) : null;
//       const end = ev?.endTime ? new Date(ev.endTime) : null;

//       const isUpcoming =
//         !!start && start.getTime() > now.getTime() && ev?.isPublished && !ev?.isDeleted;

//       const isLiveByStatus = status === "live";
//       const isLiveByWindow =
//         !!start && !!end && start <= now && now <= end && ["scheduled", "live"].includes(status);

//       // visible label for location
//       let location =
//         ev?.location?.venue ||
//         ev?.location?.meetingUrl ||
//         (ev?.location?.kind === "virtual" ? "Online" : "") ||
//         "";

//       return {
//         ...ev,
//         _status: status,
//         _isUpcoming: isUpcoming,
//         _isLive: isLiveByStatus || isLiveByWindow,
//         _start: start,
//         _end: end,
//         _location: location,
//       };
//     });
//   }, [raw]);

//   // Apply filter + search
//   const filtered = useMemo(() => {
//     let rows = normalized.slice();

//     if (filter !== "all") {
//       switch (filter) {
//         case "upcoming":
//           rows = rows.filter((e) => e._isUpcoming);
//           break;
//         case "live":
//           rows = rows.filter((e) => e._isLive);
//           break;
//         default:
//           rows = rows.filter((e) => e._status === filter);
//       }
//     }

//     if (search.trim()) {
//       const q = search.trim().toLowerCase();
//       rows = rows.filter((e) => {
//         const title = String(e.title || "").toLowerCase();
//         const desc = String(e.description || "").toLowerCase();
//         const tags = Array.isArray(e.tags) ? e.tags.join(" ").toLowerCase() : "";
//         return title.includes(q) || desc.includes(q) || tags.includes(q);
//       });
//     }

//     // Always keep in a sensible order: upcoming first
//     rows.sort((a, b) => {
//       const at = a._start ? a._start.getTime() : 0;
//       const bt = b._start ? b._start.getTime() : 0;
//       return at - bt;
//     });

//     return rows;
//   }, [normalized, filter, search]);

//   // Counts for chips
//   const counts = useMemo(() => {
//     const base = {
//       all: 0,
//       upcoming: 0,
//       live: 0,
//       scheduled: 0,
//       completed: 0,
//       cancelled: 0,
//       postponed: 0,
//     };
//     for (const e of normalized) {
//       base.all += 1;
//       if (e._isUpcoming) base.upcoming += 1;
//       if (e._isLive) base.live += 1;
//       if (e._status === "scheduled") base.scheduled += 1;
//       if (e._status === "completed") base.completed += 1;
//       if (e._status === "cancelled") base.cancelled += 1;
//       if (e._status === "postponed") base.postponed += 1;
//     }
//     return base;
//   }, [normalized]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

//   const openEvent = (ev) => {
//     // navigate to your event details route; change if your route differs
//     navigate(`/single-user-event/${ev._id}`, { state: { fromList: true } });
//   };

//   if (!token || !userId) {
//     return (
//       <div className="max-w-5xl mx-auto p-4">
//         <h1 className="text-xl font-semibold">Events</h1>
//         <p className="text-red-600 mt-2">Please log in to view your events.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-4">
//       {/* Header row */}
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <h1 className="text-2xl font-bold">Your Events</h1>
//         <div className="flex items-center gap-2">
//           <input
//             className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
//             placeholder="Search title, description, tags…"
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(1);
//             }}
//           />
//         </div>
//       </div>

//       {/* Filter chips */}
//       <div className="flex items-center gap-2 mt-4 flex-wrap">
//         {FILTERS.map((f) => (
//           <button
//             key={f.key}
//             className={`${chipStyles} ${
//               filter === f.key ? activeChip : inactiveChip
//             }`}
//             onClick={() => {
//               setFilter(f.key);
//               setPage(1);
//             }}
//             title={`Show ${f.label.toLowerCase()} events`}
//           >
//             {f.label}
//             <span className="ml-2 inline-block rounded-full bg-white/20 px-2 py-0.5 text-xs">
//               {counts[f.key]}
//             </span>
//           </button>
//         ))}
//       </div>

//       {/* Meta line */}
//       <div className="mt-4 text-sm text-gray-500">
//         {loading
//           ? "Loading…"
//           : `${filtered.length} of ${counts.all} visible${
//               search ? ` for “${search}”` : ""
//             }`}
//       </div>

//       {/* Error */}
//       {err && (
//         <div className="mt-3 p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200">
//           {err}
//         </div>
//       )}

//       {/* List */}
//       <div className="mt-4 divide-y rounded-lg border overflow-hidden">
//         {loading ? (
//           <div className="p-6 text-gray-500">Fetching events…</div>
//         ) : pageRows.length === 0 ? (
//           <div className="p-6 text-gray-500">No events to show.</div>
//         ) : (
//           pageRows.map((e) => (
//             <button
//               key={e._id}
//               onClick={() => openEvent(e)}
//               className="w-full text-left p-4 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
//               title="Open event"
//             >
//               <div className="flex items-start justify-between gap-3">
//                 <div>
//                   {/* Title + status chips */}
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-medium text-gray-900">
//                       {e.title || "Untitled event"}
//                     </span>

//                     {/* status */}
//                     {e._status && (
//                       <span className="text-xs rounded-full border px-2 py-0.5 text-gray-600 capitalize">
//                         {e._status}
//                       </span>
//                     )}

//                     {/* “UPCOMING” & “LIVE” flags */}
//                     {e._isUpcoming && (
//                       <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
//                         UPCOMING
//                       </span>
//                     )}
//                     {e._isLive && (
//                       <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">
//                         LIVE
//                       </span>
//                     )}
//                   </div>

//                   {/* Subtitle / Description preview */}
//                   <div className="mt-1 text-gray-800">
//                     {e.subtitle ? (
//                       <span className="text-gray-700">{e.subtitle}</span>
//                     ) : e.description ? (
//                       <span className="text-gray-700">
//                         {String(e.description).length > 160
//                           ? `${String(e.description).slice(0, 160)}…`
//                           : e.description}
//                       </span>
//                     ) : (
//                       <em className="text-gray-400">No details</em>
//                     )}
//                   </div>

//                   {/* Meta line: time, location, tags */}
//                   <div className="mt-1 text-xs text-gray-500">
//                     {e._start
//                       ? `${e._start.toLocaleString()}`
//                       : "—"}{" "}
//                     {e._end ? `– ${e._end.toLocaleTimeString()}` : ""}
//                     {e._location ? ` • ${e._location}` : ""}
//                     {Array.isArray(e.tags) && e.tags.length > 0 ? (
//                       <span> • tags: {e.tags.join(", ")}</span>
//                     ) : null}
//                   </div>
//                 </div>

//                 {/* Right side: tiny summary */}
//                 <div className="text-xs uppercase tracking-wide text-gray-500 text-right">
//                   {e.organizers?.length
//                     ? `${e.organizers.length} org`
//                     : ""}
//                   {e.isPublished ? (
//                     <div className="mt-1 text-[10px] font-semibold text-indigo-600">
//                       Published
//                     </div>
//                   ) : (
//                     <div className="mt-1 text-[10px] text-gray-400">
//                       Draft
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </button>
//           ))
//         )}
//       </div>

//       {/* Pagination */}
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
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

const API = `${globalBackendRoute}/api`;

// Status filters (aligned with your EventModel/Controller)
const FILTERS = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" }, // startTime > now, published & not deleted
  { key: "live", label: "Live" }, // status: live (or within time window)
  { key: "scheduled", label: "Scheduled" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "postponed", label: "Postponed" },
];

const chipStyles = "px-3 py-1 rounded-full text-sm border transition-colors";
const activeChip = "bg-indigo-600 text-white border-indigo-600";
const inactiveChip = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";

// ---- helpers ----
const getEventId = (e) => String(e?._id || e?.id || "");
// -----------------

export default function UserEvents() {
  const navigate = useNavigate();

  const [raw, setRaw] = useState([]); // events as returned by API
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }
  const userId = user?._id || user?.id;
  const role = user?.role || "";

  // ---- Seen state (stored per-user in localStorage) ----
  const [seen, setSeen] = useState(() => new Set());
  const seenStorageKey = userId ? `seenEvents:${userId}` : null;

  useEffect(() => {
    if (!seenStorageKey) return;
    try {
      const arr = JSON.parse(localStorage.getItem(seenStorageKey) || "[]");
      if (Array.isArray(arr)) setSeen(new Set(arr.map(String)));
    } catch {
      setSeen(new Set());
    }
  }, [seenStorageKey]);

  const markSeen = (id) => {
    if (!seenStorageKey || !id) return;
    setSeen((prev) => {
      const next = new Set(prev);
      next.add(String(id));
      localStorage.setItem(seenStorageKey, JSON.stringify([...next]));
      return next;
    });
  };
  // ------------------------------------------------------

  useEffect(() => {
    if (!token || !userId) {
      setLoading(false);
      setErr("Not authenticated.");
      return;
    }

    setLoading(true);
    setErr("");

    // We use /events/visible, request a reasonably large page to allow local filtering & counts.
    const params = new URLSearchParams({
      userId,
      role,
      sort: "startTime", // upcoming first (ascending)
      limit: "200",
      page: "1",
      isPublished: "true",
    });

    axios
      .get(`${API}/events/visible?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        const rows = Array.isArray(res.data?.data) ? res.data.data : [];
        setRaw(rows);
      })
      .catch((e) => {
        console.error("events/visible error:", e?.response || e);
        setErr(
          e?.response?.data?.error ||
            e?.response?.data?.details ||
            e?.message ||
            "Failed to load events."
        );
      })
      .finally(() => setLoading(false));
  }, [token, userId, role]);

  // Normalize rows with derived properties for filtering
  const normalized = useMemo(() => {
    const now = new Date();
    return raw.map((ev) => {
      const status = String(ev?.status || "scheduled").toLowerCase();
      const start = ev?.startTime ? new Date(ev.startTime) : null;
      const end = ev?.endTime ? new Date(ev.endTime) : null;

      const isUpcoming =
        !!start &&
        start.getTime() > now.getTime() &&
        ev?.isPublished &&
        !ev?.isDeleted;

      const isLiveByStatus = status === "live";
      const isLiveByWindow =
        !!start &&
        !!end &&
        start <= now &&
        now <= end &&
        ["scheduled", "live"].includes(status);

      // visible label for location
      let location =
        ev?.location?.venue ||
        ev?.location?.meetingUrl ||
        (ev?.location?.kind === "virtual" ? "Online" : "") ||
        "";

      return {
        ...ev,
        _status: status,
        _isUpcoming: isUpcoming,
        _isLive: isLiveByStatus || isLiveByWindow,
        _start: start,
        _end: end,
        _location: location,
      };
    });
  }, [raw]);

  // Apply filter + search
  const filtered = useMemo(() => {
    let rows = normalized.slice();

    if (filter !== "all") {
      switch (filter) {
        case "upcoming":
          rows = rows.filter((e) => e._isUpcoming);
          break;
        case "live":
          rows = rows.filter((e) => e._isLive);
          break;
        default:
          rows = rows.filter((e) => e._status === filter);
      }
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((e) => {
        const title = String(e.title || "").toLowerCase();
        const desc = String(e.description || "").toLowerCase();
        const tags = Array.isArray(e.tags)
          ? e.tags.join(" ").toLowerCase()
          : "";
        return title.includes(q) || desc.includes(q) || tags.includes(q);
      });
    }

    // Always keep in a sensible order: upcoming first
    rows.sort((a, b) => {
      const at = a._start ? a._start.getTime() : 0;
      const bt = b._start ? b._start.getTime() : 0;
      return at - bt;
    });

    return rows;
  }, [normalized, filter, search]);

  // Counts for chips
  const counts = useMemo(() => {
    const base = {
      all: 0,
      upcoming: 0,
      live: 0,
      scheduled: 0,
      completed: 0,
      cancelled: 0,
      postponed: 0,
    };
    for (const e of normalized) {
      base.all += 1;
      if (e._isUpcoming) base.upcoming += 1;
      if (e._isLive) base.live += 1;
      if (e._status === "scheduled") base.scheduled += 1;
      if (e._status === "completed") base.completed += 1;
      if (e._status === "cancelled") base.cancelled += 1;
      if (e._status === "postponed") base.postponed += 1;
    }
    return base;
  }, [normalized]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openEvent = (ev) => {
    const id = getEventId(ev);
    // Mark as seen before navigating so the color updates on return
    markSeen(id);
    navigate(`/single-user-event/${id}`, { state: { fromList: true } });
  };

  if (!token || !userId) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-xl font-semibold">Events</h1>
        <p className="text-red-600 mt-2">Please log in to view your events.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Your Events</h1>
        <div className="flex items-center gap-2">
          <input
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
            placeholder="Search title, description, tags…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`${chipStyles} ${
              filter === f.key ? activeChip : inactiveChip
            }`}
            onClick={() => {
              setFilter(f.key);
              setPage(1);
            }}
            title={`Show ${f.label.toLowerCase()} events`}
          >
            {f.label}
            <span className="ml-2 inline-block rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Meta line */}
      <div className="mt-4 text-sm text-gray-500">
        {loading
          ? "Loading…"
          : `${filtered.length} of ${counts.all} visible${
              search ? ` for “${search}”` : ""
            }`}
      </div>

      {/* Error */}
      {err && (
        <div className="mt-3 p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200">
          {err}
        </div>
      )}

      {/* List */}
      <div className="mt-4 divide-y rounded-lg border overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-500">Fetching events…</div>
        ) : pageRows.length === 0 ? (
          <div className="p-6 text-gray-500">No events to show.</div>
        ) : (
          pageRows.map((e) => {
            const id = getEventId(e);
            const isSeen = seen.has(id);
            // Neutral white/gray palette for seen vs unseen
            const seenClasses = isSeen
              ? "bg-gray-50 hover:bg-gray-100 border-l-4 border-gray-200"
              : "bg-white hover:bg-gray-50 border-l-4 border-transparent";

            return (
              <button
                key={id}
                onClick={() => openEvent(e)}
                className={`w-full text-left p-4 focus:outline-none transition-colors ${seenClasses}`}
                title="Open event"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {/* Title + status chips */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {e.title || "Untitled event"}
                      </span>

                      {/* status */}
                      {e._status && (
                        <span className="text-xs rounded-full border px-2 py-0.5 text-gray-600 capitalize">
                          {e._status}
                        </span>
                      )}

                      {/* “UPCOMING” & “LIVE” flags (left unchanged) */}
                      {e._isUpcoming && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                          UPCOMING
                        </span>
                      )}
                      {e._isLive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">
                          LIVE
                        </span>
                      )}
                    </div>

                    {/* Subtitle / Description preview */}
                    <div className="mt-1 text-gray-800">
                      {e.subtitle ? (
                        <span className="text-gray-700">{e.subtitle}</span>
                      ) : e.description ? (
                        <span className="text-gray-700">
                          {String(e.description).length > 160
                            ? `${String(e.description).slice(0, 160)}…`
                            : e.description}
                        </span>
                      ) : (
                        <em className="text-gray-400">No details</em>
                      )}
                    </div>

                    {/* Meta line: time, location, tags */}
                    <div className="mt-1 text-xs text-gray-500">
                      {e._start ? `${e._start.toLocaleString()}` : "—"}{" "}
                      {e._end ? `– ${e._end.toLocaleTimeString()}` : ""}
                      {e._location ? ` • ${e._location}` : ""}
                      {Array.isArray(e.tags) && e.tags.length > 0 ? (
                        <span> • tags: {e.tags.join(", ")}</span>
                      ) : null}
                    </div>
                  </div>

                  {/* Right side: tiny summary */}
                  <div className="text-xs uppercase tracking-wide text-gray-500 text-right">
                    {e.organizers?.length ? `${e.organizers.length} org` : ""}
                    {e.isPublished ? (
                      <div className="mt-1 text-[10px] font-semibold text-indigo-600">
                        Published
                      </div>
                    ) : (
                      <div className="mt-1 text-[10px] text-gray-400">
                        Draft
                      </div>
                    )}
                    {/* Neutral "Seen" label */}
                    {isSeen && (
                      <div className="mt-1 text-[10px] uppercase tracking-wider text-gray-500">
                        Seen
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
