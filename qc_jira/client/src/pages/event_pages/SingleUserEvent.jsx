// import React, { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";

// const API = `${globalBackendRoute}/api`;

// function getStoredUser() {
//   try {
//     const u = JSON.parse(localStorage.getItem("user"));
//     if (u && (u._id || u.id)) return u;
//   } catch {}
//   return null;
// }

// function stringifyId(v) {
//   if (!v) return "";
//   return typeof v === "string" ? v : String(v);
// }

// // Client-side visibility fallback
// function isVisibleToUser(event, userId, role) {
//   if (!event || event.isDeleted) return false;
//   const mode = String(event?.audience?.mode || "all").toLowerCase();
//   const roles = (event?.audience?.roles || []).map((r) =>
//     String(r).toLowerCase()
//   );
//   const users = (event?.audience?.users || []).map(stringifyId);
//   const roleLc = String(role || "").toLowerCase();
//   if (roleLc === "superadmin") return true;
//   if (mode === "all") return true;
//   if (mode === "roles") return roles.includes(roleLc);
//   if (mode === "users") return users.includes(stringifyId(userId));
//   return false;
// }

// export default function SingleUserEvent() {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [item, setItem] = useState(null);
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(true);

//   // UI states for RSVP + read
//   const [rsvp, setRsvp] = useState(null); // "accepted" | "declined" | null
//   const [markingRead, setMarkingRead] = useState(false);
//   const [markedRead, setMarkedRead] = useState(false);

//   const token =
//     localStorage.getItem("userToken") || localStorage.getItem("token") || "";

//   const user = getStoredUser();
//   const userId = stringifyId(user?._id || user?.id);
//   const role = user?.role || "";

//   // optional query param if you open this page from a specific notification
//   const search = new URLSearchParams(location.search);
//   const notifId = search.get("nid"); // e.g. /single-user-event/123?nid=abc

//   // Helper: fire a global event so Header can refresh its badges immediately
//   const refreshBadges = (detail = {}) => {
//     window.dispatchEvent(new CustomEvent("app:refreshBadges", { detail }));
//   };

//   // --- Load event (and attempt to mark as read right after a successful load)
//   useEffect(() => {
//     let mounted = true;

//     async function run() {
//       if (!token || !userId) {
//         if (mounted) {
//           setLoading(false);
//           setErr("Not authenticated.");
//         }
//         return;
//       }
//       setLoading(true);
//       setErr("");

//       const headers = token ? { Authorization: `Bearer ${token}` } : {};
//       const qs = new URLSearchParams({ userId, role });

//       try {
//         // 1) Preferred: server enforces visibility
//         const res1 = await axios.get(`${API}/events/${id}/visible?${qs}`, {
//           headers,
//         });
//         if (!mounted) return;
//         setItem(res1.data);
//         setErr("");
//       } catch {
//         // 2) Fallback: fetch raw event, then we check visibility here
//         try {
//           const res2 = await axios.get(`${API}/events/${id}`, { headers });
//           if (!mounted) return;

//           const ev = res2.data;
//           if (!ev || ev.isDeleted) {
//             setErr("Event is deleted or unavailable.");
//             setItem(null);
//           } else if (!isVisibleToUser(ev, userId, role)) {
//             setErr("Event not found or not visible to this user.");
//             setItem(null);
//           } else {
//             setItem(ev);
//             setErr("");
//           }
//         } catch (e2) {
//           if (!mounted) return;
//           const msg =
//             e2?.response?.data?.error ||
//             e2?.response?.data?.details ||
//             e2?.message ||
//             "Failed to load event.";
//           setErr(msg);
//           setItem(null);
//         }
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }

//     run();
//     return () => {
//       mounted = false;
//     };
//   }, [token, userId, role, id]);

//   // --- Auto mark as read after we *have* the event
//   useEffect(() => {
//     if (!item || markedRead) return;
//     (async () => {
//       try {
//         setMarkingRead(true);

//         const headers = token ? { Authorization: `Bearer ${token}` } : {};
//         // Try a few conventional endpoints — ignore errors (graceful fallback)
//         // 1) If you passed ?nid=<notificationId> when navigating here
//         if (notifId) {
//           try {
//             await axios.post(
//               `${API}/notifications/${encodeURIComponent(notifId)}/read`,
//               {},
//               { headers }
//             );
//           } catch {
//             // fallback variants commonly used
//             try {
//               await axios.post(
//                 `${API}/notifications/mark-read`,
//                 { id: notifId },
//                 { headers }
//               );
//             } catch {}
//           }
//         }

//         // 2) Optional: mark event "seen" for this user (if you add it on backend later)
//         try {
//           await axios.post(
//             `${API}/events/${encodeURIComponent(id)}/seen`,
//             { userId },
//             { headers }
//           );
//         } catch {
//           /* silently ignore if not implemented */
//         }

//         setMarkedRead(true);
//         refreshBadges({ notifications: true }); // make header re-pull counts
//       } finally {
//         setMarkingRead(false);
//       }
//     })();
//   }, [item, markedRead, notifId, id, token, userId]);

//   // --- RSVP handlers (optimistic UI; gracefully ignores if backend not implemented yet)
//   const sendRsvp = async (status) => {
//     if (!userId) return;
//     const headers = token ? { Authorization: `Bearer ${token}` } : {};
//     setRsvp(status); // optimistic
//     try {
//       // Proposed canonical endpoint (implement in backend when ready)
//       await axios.post(
//         `${API}/events/${encodeURIComponent(id)}/rsvp`,
//         { userId, status }, // "accepted" | "declined"
//         { headers }
//       );
//     } catch {
//       // common alternates people use; try & ignore errors
//       try {
//         await axios.post(
//           `${API}/events/${encodeURIComponent(id)}/attendees`,
//           { userId, status },
//           { headers }
//         );
//       } catch {}
//     }
//   };

//   const derived = useMemo(() => {
//     if (!item) return null;
//     const status = String(item.status || "scheduled").toLowerCase();
//     const start = item.startTime ? new Date(item.startTime) : null;
//     const end = item.endTime ? new Date(item.endTime) : null;
//     const now = new Date();

//     const isLiveByStatus = status === "live";
//     const isLiveByWindow =
//       !!start &&
//       !!end &&
//       start <= now &&
//       now <= end &&
//       ["scheduled", "live"].includes(status);

//     const isLive = isLiveByStatus || isLiveByWindow;
//     const isUpcoming =
//       !!start &&
//       start.getTime() > now.getTime() &&
//       item.isPublished &&
//       !item.isDeleted;

//     let location =
//       item?.location?.venue ||
//       item?.location?.meetingUrl ||
//       (item?.location?.kind === "virtual" ? "Online" : "") ||
//       "";

//     return { status, start, end, isLive, isUpcoming, location };
//   }, [item]);

//   if (!token || !userId) {
//     return (
//       <div className="max-w-3xl mx-auto p-4">
//         <h1 className="text-xl font-semibold">Event</h1>
//         <p className="text-red-600 mt-2">Please log in to view this page.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Event</h1>
//         <Link
//           to="/user-events"
//           className="text-sm text-indigo-600 hover:underline"
//         >
//           ← Back to events
//         </Link>
//       </div>

//       {loading && <div className="mt-4 text-gray-500">Loading…</div>}

//       {err && !loading && (
//         <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
//           {err}
//         </div>
//       )}

//       {!loading && !err && item && derived && (
//         <div className="mt-4 rounded-lg border p-4">
//           {/* Top badges */}
//           <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
//             <span className="uppercase tracking-wide">
//               {item.type || "event"}
//             </span>

//             {/* Status */}
//             <span className="text-xs rounded-full border px-2 py-0.5 capitalize">
//               {derived.status}
//             </span>

//             {/* UPCOMING / LIVE flags */}
//             {derived.isUpcoming && (
//               <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
//                 UPCOMING
//               </span>
//             )}
//             {derived.isLive && (
//               <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">
//                 LIVE
//               </span>
//             )}

//             {/* Published/Draft */}
//             <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100">
//               {item.isPublished ? "Published" : "Draft"}
//             </span>

//             {/* Marked read chip */}
//             {markedRead && (
//               <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200">
//                 Read
//               </span>
//             )}
//           </div>

//           {/* Title / Subtitle */}
//           <div className="mt-2">
//             <div className="text-lg font-semibold text-gray-900">
//               {item.title || "Untitled event"}
//             </div>
//             {item.subtitle && (
//               <div className="text-sm text-gray-600 mt-0.5">
//                 {item.subtitle}
//               </div>
//             )}
//           </div>

//           {/* Time / Location / Tags */}
//           <div className="mt-3 text-xs text-gray-500 space-y-1">
//             <div>
//               <span className="font-medium">When:</span>{" "}
//               {derived.start ? derived.start.toLocaleString() : "—"}
//               {derived.end ? ` – ${derived.end.toLocaleTimeString()}` : ""}
//             </div>
//             {derived.location && (
//               <div>
//                 <span className="font-medium">Where:</span> {derived.location}
//               </div>
//             )}
//             {Array.isArray(item.tags) && item.tags.length > 0 && (
//               <div>
//                 <span className="font-medium">Tags:</span>{" "}
//                 {item.tags.join(", ")}
//               </div>
//             )}
//           </div>

//           {/* Organizers */}
//           {Array.isArray(item.organizers) && item.organizers.length > 0 && (
//             <div className="mt-3 text-xs text-gray-700">
//               <span className="font-medium">Organizers:</span>{" "}
//               {item.organizers
//                 .map((o) => o?.name || o?.email || o?.role || "—")
//                 .join(", ")}
//             </div>
//           )}

//           {/* Description */}
//           <div className="mt-4 text-gray-900 whitespace-pre-wrap">
//             {item.description || (
//               <em className="text-gray-400">No description</em>
//             )}
//           </div>

//           {/* Actions */}
//           <div className="mt-6 flex flex-wrap gap-2">
//             <button
//               onClick={() => navigate("/user-events")}
//               className="px-4 py-2 rounded bg-indigo-600 text-white text-sm"
//             >
//               Back to Events
//             </button>

//             <button
//               onClick={() => navigate(-1)}
//               className="px-4 py-2 rounded border text-sm"
//             >
//               Go Back
//             </button>

//             {/* RSVP */}
//             <button
//               onClick={() => sendRsvp("accepted")}
//               className={`px-4 py-2 rounded text-sm ${
//                 rsvp === "accepted" ? "bg-green-600 text-white" : "border"
//               }`}
//             >
//               {rsvp === "accepted" ? "Accepted" : "Accept"}
//             </button>
//             <button
//               onClick={() => sendRsvp("declined")}
//               className={`px-4 py-2 rounded text-sm ${
//                 rsvp === "declined" ? "bg-red-600 text-white" : "border"
//               }`}
//             >
//               {rsvp === "declined" ? "Declined" : "Decline"}
//             </button>

//             {/* Mark as read (manual) */}
//             <button
//               onClick={() => {
//                 // Re-run the auto mark logic on-demand
//                 setMarkedRead(false);
//               }}
//               disabled={markingRead}
//               className="px-4 py-2 rounded border text-sm"
//               title="Mark this event/notification as read"
//             >
//               {markingRead
//                 ? "Marking…"
//                 : markedRead
//                 ? "Marked as read"
//                 : "Mark as read"}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

//

"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelopeOpenText,
  FaBroadcastTower,
  FaClock,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const API = `${globalBackendRoute}/api`;

const MAIN_HEADING_STYLE =
  "text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 text-uppercase tracking-[0.1em]";

const HERO_TAGS = ["EVENT", "DETAILS", "LIVE", "UPCOMING", "RSVP"];

const HERO_STYLE = {
  backgroundImage:
    "linear-gradient(135deg, rgba(79,70,229,0.92), rgba(168,85,247,0.88), rgba(236,72,153,0.84))",
};

function getStoredUser() {
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u && (u._id || u.id)) return u;
  } catch {}
  return null;
}

function stringifyId(v) {
  if (!v) return "";
  return typeof v === "string" ? v : String(v);
}

// Client-side visibility fallback
function isVisibleToUser(event, userId, role) {
  if (!event || event.isDeleted) return false;
  const mode = String(event?.audience?.mode || "all").toLowerCase();
  const roles = (event?.audience?.roles || []).map((r) =>
    String(r).toLowerCase(),
  );
  const users = (event?.audience?.users || []).map(stringifyId);
  const roleLc = String(role || "").toLowerCase();

  if (roleLc === "superadmin") return true;
  if (mode === "all") return true;
  if (mode === "roles") return roles.includes(roleLc);
  if (mode === "users") return users.includes(stringifyId(userId));

  return false;
}

const getStatusPillClass = (status) => {
  switch (status) {
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

export default function SingleUserEvent() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [rsvp, setRsvp] = useState(null);
  const [markingRead, setMarkingRead] = useState(false);
  const [markedRead, setMarkedRead] = useState(false);

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";

  const user = getStoredUser();
  const userId = stringifyId(user?._id || user?.id);
  const role = user?.role || "";

  const search = new URLSearchParams(location.search);
  const notifId = search.get("nid");

  const refreshBadges = useCallback((detail = {}) => {
    window.dispatchEvent(new CustomEvent("app:refreshBadges", { detail }));
  }, []);

  useEffect(() => {
    let mounted = true;

    async function run() {
      if (!token || !userId) {
        if (mounted) {
          setLoading(false);
          setErr("Not authenticated.");
        }
        return;
      }

      setLoading(true);
      setErr("");

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const qs = new URLSearchParams({ userId, role });

      try {
        const res1 = await axios.get(`${API}/events/${id}/visible?${qs}`, {
          headers,
        });

        if (!mounted) return;
        setItem(res1.data);
        setErr("");
      } catch {
        try {
          const res2 = await axios.get(`${API}/events/${id}`, { headers });

          if (!mounted) return;

          const ev = res2.data;

          if (!ev || ev.isDeleted) {
            setErr("Event is deleted or unavailable.");
            setItem(null);
          } else if (!isVisibleToUser(ev, userId, role)) {
            setErr("Event not found or not visible to this user.");
            setItem(null);
          } else {
            setItem(ev);
            setErr("");
          }
        } catch (e2) {
          if (!mounted) return;

          const msg =
            e2?.response?.data?.error ||
            e2?.response?.data?.details ||
            e2?.message ||
            "Failed to load event.";

          setErr(msg);
          setItem(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();

    return () => {
      mounted = false;
    };
  }, [token, userId, role, id]);

  useEffect(() => {
    if (!item || markedRead) return;

    (async () => {
      try {
        setMarkingRead(true);

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        if (notifId) {
          try {
            await axios.post(
              `${API}/notifications/${encodeURIComponent(notifId)}/read`,
              {},
              { headers },
            );
          } catch {
            try {
              await axios.post(
                `${API}/notifications/mark-read`,
                { id: notifId },
                { headers },
              );
            } catch {}
          }
        }

        try {
          await axios.post(
            `${API}/events/${encodeURIComponent(id)}/seen`,
            { userId },
            { headers },
          );
        } catch {}

        setMarkedRead(true);
        refreshBadges({ notifications: true });
      } finally {
        setMarkingRead(false);
      }
    })();
  }, [item, markedRead, notifId, id, token, userId, refreshBadges]);

  const sendRsvp = useCallback(
    async (status) => {
      if (!userId) return;

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      setRsvp(status);

      try {
        await axios.post(
          `${API}/events/${encodeURIComponent(id)}/rsvp`,
          { userId, status },
          { headers },
        );
      } catch {
        try {
          await axios.post(
            `${API}/events/${encodeURIComponent(id)}/attendees`,
            { userId, status },
            { headers },
          );
        } catch {}
      }
    },
    [userId, token, id],
  );

  const derived = useMemo(() => {
    if (!item) return null;

    const status = String(item.status || "scheduled").toLowerCase();
    const start = item.startTime ? new Date(item.startTime) : null;
    const end = item.endTime ? new Date(item.endTime) : null;
    const now = new Date();

    const isLiveByStatus = status === "live";
    const isLiveByWindow =
      !!start &&
      !!end &&
      start <= now &&
      now <= end &&
      ["scheduled", "live"].includes(status);

    const isLive = isLiveByStatus || isLiveByWindow;
    const isUpcoming =
      !!start &&
      start.getTime() > now.getTime() &&
      item.isPublished &&
      !item.isDeleted;

    const eventLocation =
      item?.location?.venue ||
      item?.location?.meetingUrl ||
      (item?.location?.kind === "virtual" ? "Online" : "") ||
      "";

    return { status, start, end, isLive, isUpcoming, location: eventLocation };
  }, [item]);

  if (!token || !userId) {
    return (
      <div className="service-page-wrap min-h-screen">
        <div className="service-main-container">
          <div className="service-parent-card">
            <h1 className={MAIN_HEADING_STYLE}>Event</h1>
            <p className="text-red-600 text-sm sm:text-base">
              Please log in to view this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="service-page-wrap min-h-screen">
      <section className="service-hero-section" style={HERO_STYLE}>
        <div className="service-hero-overlay-1" />
        <div className="service-hero-overlay-2" />
        <div className="service-hero-overlay-3" />

        <div className="service-hero-container">
          <div className="service-hero-layout">
            <div>
              <div className="service-tag-row">
                {HERO_TAGS.map((itemTag) => (
                  <span key={itemTag} className="service-tag-pill">
                    {itemTag}
                  </span>
                ))}
              </div>

              <h1 className="service-hero-title">
                Event{" "}
                <span className="service-hero-title-highlight">
                  details & actions
                </span>
              </h1>

              <p className="service-hero-text">
                View complete event information, check live or upcoming status,
                review organizers, and respond with RSVP actions.
              </p>

              <div className="service-hero-status">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Event details · RSVP · Read tracking
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                <span>
                  {derived?.isLive ? "Currently live" : "Event details"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-200" />
                <span>
                  {markedRead ? "Read tracked" : "Read status active"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="service-main-wrap">
        <div className="service-main-container">
          <div className="service-parent-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className={MAIN_HEADING_STYLE}>Single Event</h1>

              <Link
                to="/user-events"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                <FaArrowLeft className="text-xs" />
                Back to events
              </Link>
            </div>

            {loading && (
              <div className="mt-4 text-sm sm:text-base text-slate-500">
                Loading…
              </div>
            )}

            {err && !loading && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {err}
              </div>
            )}
          </div>

          {!loading && !err && item && derived && (
            <>
              <div className="service-grid-two">
                <div className="service-parent-card">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span className="service-badge-heading">
                      {item.type || "event"}
                    </span>

                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] sm:text-xs font-medium capitalize ${getStatusPillClass(
                        derived.status,
                      )}`}
                    >
                      {derived.status}
                    </span>

                    {derived.isUpcoming && (
                      <span className="inline-flex items-center rounded-full bg-blue-600 px-2.5 py-1 text-[10px] sm:text-xs font-bold text-white">
                        UPCOMING
                      </span>
                    )}

                    {derived.isLive && (
                      <span className="inline-flex items-center rounded-full bg-green-600 px-2.5 py-1 text-[10px] sm:text-xs font-bold text-white">
                        LIVE
                      </span>
                    )}

                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-slate-700">
                      {item.isPublished ? "Published" : "Draft"}
                    </span>

                    {markedRead && (
                      <span className="inline-flex items-center rounded-full bg-slate-200 px-2.5 py-1 text-[10px] sm:text-xs text-slate-700">
                        Read
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 leading-tight">
                      {item.title || "Untitled event"}
                    </h2>

                    {item.subtitle && (
                      <p className="mt-2 service-paragraph text-slate-600">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="service-grid-three">
                    <div className="service-small-card">
                      <span className="form-icon-badge">
                        <FaCalendarAlt className="text-xs" />
                      </span>
                      <div className="min-w-0">
                        <p className="service-badge-heading">When</p>
                        <p className="service-small-paragraph break-words">
                          {derived.start
                            ? derived.start.toLocaleString()
                            : "Not available"}
                          {derived.end
                            ? ` – ${derived.end.toLocaleTimeString()}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="service-small-card">
                      <span className="form-icon-badge">
                        <FaMapMarkerAlt className="text-xs" />
                      </span>
                      <div className="min-w-0">
                        <p className="service-badge-heading">Where</p>
                        <p className="service-small-paragraph break-words">
                          {derived.location || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="service-small-card">
                      <span className="form-icon-badge">
                        <FaTag className="text-xs" />
                      </span>
                      <div className="min-w-0">
                        <p className="service-badge-heading">Tags</p>
                        <p className="service-small-paragraph break-words">
                          {Array.isArray(item.tags) && item.tags.length > 0
                            ? item.tags.join(", ")
                            : "No tags"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {Array.isArray(item.organizers) &&
                    item.organizers.length > 0 && (
                      <div className="mt-5">
                        <p className="service-sub-heading">Organizers</p>
                        <div className="mt-3 space-y-3">
                          {item.organizers.map((o, index) => (
                            <div
                              key={`${o?._id || o?.email || o?.name || "org"}-${index}`}
                              className="service-small-card"
                            >
                              <span className="form-icon-badge">
                                <FaUserTie className="text-xs" />
                              </span>
                              <div className="min-w-0">
                                <p className="service-list-paragraph font-medium text-slate-900 break-words">
                                  {o?.name || "Organizer"}
                                </p>
                                <p className="service-small-paragraph break-words">
                                  {o?.email || o?.role || "—"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="mt-5">
                    <p className="service-sub-heading">Description</p>
                    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                      <div className="service-paragraph whitespace-pre-wrap text-slate-800">
                        {item.description || (
                          <em className="text-slate-400">No description</em>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="service-parent-card">
                    <p className="service-sub-heading">Event summary</p>

                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="inline-flex items-center gap-2 text-slate-600">
                          <FaBroadcastTower className="text-indigo-500" />
                          Status
                        </span>
                        <span className="font-medium text-slate-900 capitalize">
                          {derived.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="inline-flex items-center gap-2 text-slate-600">
                          <FaClock className="text-indigo-500" />
                          Schedule state
                        </span>
                        <span className="font-medium text-slate-900">
                          {derived.isLive
                            ? "Live now"
                            : derived.isUpcoming
                              ? "Upcoming"
                              : "Standard"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="inline-flex items-center gap-2 text-slate-600">
                          <FaCheckCircle className="text-indigo-500" />
                          Visibility
                        </span>
                        <span className="font-medium text-slate-900">
                          {item.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="inline-flex items-center gap-2 text-slate-600">
                          <FaEnvelopeOpenText className="text-indigo-500" />
                          Read state
                        </span>
                        <span className="font-medium text-slate-900">
                          {markedRead ? "Marked as read" : "Pending"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="inline-flex items-center gap-2 text-slate-600">
                          <FaUserTie className="text-indigo-500" />
                          Organizers
                        </span>
                        <span className="font-medium text-slate-900">
                          {item.organizers?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="service-parent-card">
                    <p className="service-sub-heading">Actions</p>

                    <div className="mt-4 flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={() => navigate("/user-events")}
                        className="primary-gradient-button w-full"
                      >
                        Back to Events
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                      >
                        Go Back
                      </button>

                      <button
                        type="button"
                        onClick={() => sendRsvp("accepted")}
                        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium shadow-sm transition ${
                          rsvp === "accepted"
                            ? "bg-green-600 text-white"
                            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <FaCheckCircle className="text-xs" />
                        {rsvp === "accepted" ? "Accepted" : "Accept"}
                      </button>

                      <button
                        type="button"
                        onClick={() => sendRsvp("declined")}
                        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium shadow-sm transition ${
                          rsvp === "declined"
                            ? "bg-red-600 text-white"
                            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <FaTimesCircle className="text-xs" />
                        {rsvp === "declined" ? "Declined" : "Decline"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMarkedRead(false);
                        }}
                        disabled={markingRead}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        title="Mark this event/notification as read"
                      >
                        {markingRead
                          ? "Marking…"
                          : markedRead
                            ? "Marked as read"
                            : "Mark as read"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
