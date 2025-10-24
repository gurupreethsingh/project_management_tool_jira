import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

const API = `${globalBackendRoute}/api`;

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
    String(r).toLowerCase()
  );
  const users = (event?.audience?.users || []).map(stringifyId);
  const roleLc = String(role || "").toLowerCase();
  if (roleLc === "superadmin") return true;
  if (mode === "all") return true;
  if (mode === "roles") return roles.includes(roleLc);
  if (mode === "users") return users.includes(stringifyId(userId));
  return false;
}

export default function SingleUserEvent() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // UI states for RSVP + read
  const [rsvp, setRsvp] = useState(null); // "accepted" | "declined" | null
  const [markingRead, setMarkingRead] = useState(false);
  const [markedRead, setMarkedRead] = useState(false);

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";

  const user = getStoredUser();
  const userId = stringifyId(user?._id || user?.id);
  const role = user?.role || "";

  // optional query param if you open this page from a specific notification
  const search = new URLSearchParams(location.search);
  const notifId = search.get("nid"); // e.g. /single-user-event/123?nid=abc

  // Helper: fire a global event so Header can refresh its badges immediately
  const refreshBadges = (detail = {}) => {
    window.dispatchEvent(new CustomEvent("app:refreshBadges", { detail }));
  };

  // --- Load event (and attempt to mark as read right after a successful load)
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
        // 1) Preferred: server enforces visibility
        const res1 = await axios.get(`${API}/events/${id}/visible?${qs}`, {
          headers,
        });
        if (!mounted) return;
        setItem(res1.data);
        setErr("");
      } catch {
        // 2) Fallback: fetch raw event, then we check visibility here
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

  // --- Auto mark as read after we *have* the event
  useEffect(() => {
    if (!item || markedRead) return;
    (async () => {
      try {
        setMarkingRead(true);

        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        // Try a few conventional endpoints — ignore errors (graceful fallback)
        // 1) If you passed ?nid=<notificationId> when navigating here
        if (notifId) {
          try {
            await axios.post(
              `${API}/notifications/${encodeURIComponent(notifId)}/read`,
              {},
              { headers }
            );
          } catch {
            // fallback variants commonly used
            try {
              await axios.post(
                `${API}/notifications/mark-read`,
                { id: notifId },
                { headers }
              );
            } catch {}
          }
        }

        // 2) Optional: mark event "seen" for this user (if you add it on backend later)
        try {
          await axios.post(
            `${API}/events/${encodeURIComponent(id)}/seen`,
            { userId },
            { headers }
          );
        } catch {
          /* silently ignore if not implemented */
        }

        setMarkedRead(true);
        refreshBadges({ notifications: true }); // make header re-pull counts
      } finally {
        setMarkingRead(false);
      }
    })();
  }, [item, markedRead, notifId, id, token, userId]);

  // --- RSVP handlers (optimistic UI; gracefully ignores if backend not implemented yet)
  const sendRsvp = async (status) => {
    if (!userId) return;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    setRsvp(status); // optimistic
    try {
      // Proposed canonical endpoint (implement in backend when ready)
      await axios.post(
        `${API}/events/${encodeURIComponent(id)}/rsvp`,
        { userId, status }, // "accepted" | "declined"
        { headers }
      );
    } catch {
      // common alternates people use; try & ignore errors
      try {
        await axios.post(
          `${API}/events/${encodeURIComponent(id)}/attendees`,
          { userId, status },
          { headers }
        );
      } catch {}
    }
  };

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

    let location =
      item?.location?.venue ||
      item?.location?.meetingUrl ||
      (item?.location?.kind === "virtual" ? "Online" : "") ||
      "";

    return { status, start, end, isLive, isUpcoming, location };
  }, [item]);

  if (!token || !userId) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-xl font-semibold">Event</h1>
        <p className="text-red-600 mt-2">Please log in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Event</h1>
        <Link
          to="/user-events"
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back to events
        </Link>
      </div>

      {loading && <div className="mt-4 text-gray-500">Loading…</div>}

      {err && !loading && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
          {err}
        </div>
      )}

      {!loading && !err && item && derived && (
        <div className="mt-4 rounded-lg border p-4">
          {/* Top badges */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="uppercase tracking-wide">
              {item.type || "event"}
            </span>

            {/* Status */}
            <span className="text-xs rounded-full border px-2 py-0.5 capitalize">
              {derived.status}
            </span>

            {/* UPCOMING / LIVE flags */}
            {derived.isUpcoming && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                UPCOMING
              </span>
            )}
            {derived.isLive && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">
                LIVE
              </span>
            )}

            {/* Published/Draft */}
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100">
              {item.isPublished ? "Published" : "Draft"}
            </span>

            {/* Marked read chip */}
            {markedRead && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200">
                Read
              </span>
            )}
          </div>

          {/* Title / Subtitle */}
          <div className="mt-2">
            <div className="text-lg font-semibold text-gray-900">
              {item.title || "Untitled event"}
            </div>
            {item.subtitle && (
              <div className="text-sm text-gray-600 mt-0.5">
                {item.subtitle}
              </div>
            )}
          </div>

          {/* Time / Location / Tags */}
          <div className="mt-3 text-xs text-gray-500 space-y-1">
            <div>
              <span className="font-medium">When:</span>{" "}
              {derived.start ? derived.start.toLocaleString() : "—"}
              {derived.end ? ` – ${derived.end.toLocaleTimeString()}` : ""}
            </div>
            {derived.location && (
              <div>
                <span className="font-medium">Where:</span> {derived.location}
              </div>
            )}
            {Array.isArray(item.tags) && item.tags.length > 0 && (
              <div>
                <span className="font-medium">Tags:</span>{" "}
                {item.tags.join(", ")}
              </div>
            )}
          </div>

          {/* Organizers */}
          {Array.isArray(item.organizers) && item.organizers.length > 0 && (
            <div className="mt-3 text-xs text-gray-700">
              <span className="font-medium">Organizers:</span>{" "}
              {item.organizers
                .map((o) => o?.name || o?.email || o?.role || "—")
                .join(", ")}
            </div>
          )}

          {/* Description */}
          <div className="mt-4 text-gray-900 whitespace-pre-wrap">
            {item.description || (
              <em className="text-gray-400">No description</em>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => navigate("/user-events")}
              className="px-4 py-2 rounded bg-indigo-600 text-white text-sm"
            >
              Back to Events
            </button>

            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded border text-sm"
            >
              Go Back
            </button>

            {/* RSVP */}
            <button
              onClick={() => sendRsvp("accepted")}
              className={`px-4 py-2 rounded text-sm ${
                rsvp === "accepted" ? "bg-green-600 text-white" : "border"
              }`}
            >
              {rsvp === "accepted" ? "Accepted" : "Accept"}
            </button>
            <button
              onClick={() => sendRsvp("declined")}
              className={`px-4 py-2 rounded text-sm ${
                rsvp === "declined" ? "bg-red-600 text-white" : "border"
              }`}
            >
              {rsvp === "declined" ? "Declined" : "Decline"}
            </button>

            {/* Mark as read (manual) */}
            <button
              onClick={() => {
                // Re-run the auto mark logic on-demand
                setMarkedRead(false);
              }}
              disabled={markingRead}
              className="px-4 py-2 rounded border text-sm"
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
      )}
    </div>
  );
}
