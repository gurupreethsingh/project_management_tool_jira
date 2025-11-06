// src/pages/dashboards/TestEngineerDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaProjectDiagram,
  FaTasks,
  FaCalendarAlt,
  FaThList,
  FaThLarge,
  FaTh,
  FaRegCalendarCheck,
  FaBell,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

const HEX24 = /^[0-9a-fA-F]{24}$/;

/* =========================
   Helpers copied/adapted from Header.jsx
   ========================= */
// Seen-events helpers (per user, stored in localStorage)
const SEEN_KEY = (uid) => `seenEvents:${uid}`;
function getSeenSet(uid) {
  if (!uid) return new Set();
  try {
    const raw = localStorage.getItem(SEEN_KEY(uid));
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

// Notifications count (primary endpoint + inbox fallback)
async function fetchNotificationCounts(API, uid, token) {
  if (!uid) return 0;
  try {
    const url = `${API}/count-notifications/${uid}`;
    const res = await axios.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return Number(res.data?.unread ?? 0);
  } catch (err) {
    // soft fail → 0 (will try fallback)
    return 0;
  }
}

async function computeUnreadViaInbox(API, uid, token) {
  if (!uid) return 0;
  try {
    const url = `${API}/get-user-notifications/${uid}`;
    const res = await axios.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const rows = Array.isArray(res.data) ? res.data : [];
    const unread = rows.reduce((acc, n) => {
      const status = n?.statusForUser || (n?.isRead ? "read" : "unread");
      const hidden = n?.receipt?.isDeleted === true;
      if (hidden) return acc;
      const isUnread = !["read", "seen", "replied"].includes(
        String(status || "").toLowerCase()
      );
      return acc + (isUnread ? 1 : 0);
    }, 0);
    return unread;
  } catch {
    return 0;
  }
}

// Events: unseen upcoming by comparing visible events with seen set
async function fetchUnseenUpcomingEventsCount(API, uid, role, token) {
  if (!uid) return 0;
  try {
    const nowIso = new Date().toISOString();
    const url = `${API}/events/visible?userId=${encodeURIComponent(
      uid
    )}&role=${encodeURIComponent(role || "")}&startGte=${encodeURIComponent(
      nowIso
    )}&isPublished=true&limit=200`;
    const res = await axios.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const rows = Array.isArray(res.data?.data) ? res.data.data : [];
    const seen = getSeenSet(uid);
    const unseen = rows.reduce((acc, ev) => {
      const id = ev?._id || ev?.id;
      if (!id) return acc;
      return acc + (seen.has(String(id)) ? 0 : 1);
    }, 0);
    return unseen;
  } catch {
    return 0;
  }
}

/* =========================
   Existing helpers
   ========================= */
function resolveProjectId(obj) {
  if (!obj || typeof obj !== "object") return "";
  const candidates = [
    obj._id,
    obj.id,
    obj.projectId,
    obj.project_id,
    obj.project_id_str,
    obj?.project?._id,
    obj?.project?.id,
    obj?.project?.projectId,
  ].filter(Boolean);

  for (const c of candidates) {
    const s = String(c);
    if (HEX24.test(s)) return s;
  }
  return "";
}

export default function TestEngineerDashboard() {
  const [view, setView] = useState("grid");
  const [assignedProjects, setAssignedProjects] = useState(0);
  const [assignedTasks, setAssignedTasks] = useState(0);

  // RENAMED/REWIRED:
  const [unseenUpcomingEvents, setUnseenUpcomingEvents] = useState(0); // Events card (active)
  const [unreadNotifications, setUnreadNotifications] = useState(0); // Notification card (replaces Meetings)

  const [attendanceCount, setAttendanceCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [projectIdForTasks, setProjectIdForTasks] = useState("");

  const navigate = useNavigate();

  // --- user / auth ---
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);
  const token = localStorage.getItem("token") || "";
  const userId = user ? user.id || user._id : null;
  const role = user ? user.role : null;
  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  const API = `${globalBackendRoute}/api`;

  // --- active statuses for count + link ---
  const activeStatuses = useMemo(
    () => ["new", "pending", "in-progress", "ongoing"],
    []
  );
  const statusQuery = `status=${encodeURIComponent(activeStatuses.join(","))}`;

  // Load saved project id OR fetch first assigned
  useEffect(() => {
    const saved = localStorage.getItem("lastProjectId");
    if (HEX24.test(saved || "")) setProjectIdForTasks(saved);

    let ignore = false;
    const fetchFirstAssignedProject = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/user-assigned-projects/${userId}`,
          { headers: authHeaders }
        );
        const list = Array.isArray(res.data) ? res.data : [];
        if (ignore || list.length === 0) return;

        let pid = "";
        for (let i = 0; i < Math.min(list.length, 3); i++) {
          pid = resolveProjectId(list[i]);
          if (pid) break;
        }

        if (pid) {
          setProjectIdForTasks(pid);
          localStorage.setItem("lastProjectId", pid);
        }
      } catch (e) {
        console.warn("Could not fetch user-assigned projects:", e?.message);
      }
    };
    fetchFirstAssignedProject();
    return () => {
      ignore = true;
    };
  }, [userId, authHeaders]);

  // Counts
  useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (!userId || !role) return;
      try {
        setLoading(true);

        // projects count
        const projRes = await axios.get(
          `${globalBackendRoute}/api/user-project-count/${userId}?role=${encodeURIComponent(
            role
          )}`,
          { headers: authHeaders }
        );
        if (!ignore)
          setAssignedProjects(projRes?.data?.assignedProjectsCount || 0);

        // attendance (robust: try base route, then /attendance/, then fallback list)
        let attCount = 0;
        try {
          const r1 = await axios.get(
            `${globalBackendRoute}/api/count-attendance/employee/${userId}`,
            { headers: authHeaders }
          );
          attCount = r1?.data?.count || 0;
        } catch (e1) {
          if (e1?.response?.status === 404) {
            try {
              const r2 = await axios.get(
                `${globalBackendRoute}/api/attendance/count-attendance/employee/${userId}`,
                { headers: authHeaders }
              );
              attCount = r2?.data?.count || 0;
            } catch (e2) {
              if (e2?.response?.status === 404) {
                const listRes = await axios.get(
                  `${globalBackendRoute}/api/attendance/view-all-attendance`,
                  {
                    headers: authHeaders,
                    params: { employee: userId, limit: 1, page: 1 },
                  }
                );
                attCount = listRes?.data?.total || 0;
              } else {
                throw e2;
              }
            }
          } else {
            throw e1;
          }
        }
        if (!ignore) setAttendanceCount(attCount);

        // assigned tasks (active only) — take total
        const tasksRes = await axios.get(`${globalBackendRoute}/api/tasks`, {
          headers: authHeaders,
          params: {
            assignedTo: userId,
            status: activeStatuses.join(","),
            page: 1,
            limit: 1,
            select: "_id",
            sort: "-updatedAt",
          },
        });
        if (!ignore) setAssignedTasks(tasksRes?.data?.total ?? 0);

        // --- NEW: Unread Notifications count ---
        const primaryUnread = await fetchNotificationCounts(API, userId, token);
        const unread =
          primaryUnread === 0
            ? await computeUnreadViaInbox(API, userId, token)
            : primaryUnread;
        if (!ignore) setUnreadNotifications(unread);

        // --- NEW: Unseen Upcoming Events count ---
        const unseenCnt = await fetchUnseenUpcomingEventsCount(
          API,
          userId,
          role,
          token
        );
        if (!ignore) setUnseenUpcomingEvents(unseenCnt);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, [userId, role, authHeaders, activeStatuses, API, token]);

  const handleViewChange = (v) => setView(v);

  const goToAssignedTasks = async () => {
    try {
      let pid = projectIdForTasks;

      if (!HEX24.test(pid || "")) {
        const res = await axios.get(
          `${globalBackendRoute}/api/user-assigned-projects/${userId}`,
          { headers: authHeaders }
        );
        const list = Array.isArray(res.data) ? res.data : [];
        for (let i = 0; i < Math.min(list.length, 5); i++) {
          const maybe = resolveProjectId(list[i]);
          if (HEX24.test(maybe)) {
            pid = maybe;
            break;
          }
        }
        if (HEX24.test(pid)) {
          localStorage.setItem("lastProjectId", pid);
          setProjectIdForTasks(pid);
        }
      }

      if (HEX24.test(pid || "")) {
        navigate(
          `/single-project/${pid}/user-assigned-tasks/${userId}?${statusQuery}`
        );
      } else {
        navigate(`/user-assigned-projects/${userId}`);
      }
    } catch (e) {
      console.error("Navigation to assigned tasks failed:", e?.message);
      navigate(`/user-assigned-projects/${userId}`);
    }
  };

  const cardBase =
    "bg-white/90 border border-slate-100 p-4 sm:p-5 shadow-sm rounded-xl flex flex-col items-center justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-center";
  const titleBase = "text-sm font-semibold text-slate-600 mb-1";
  const countBase = "text-2xl font-bold text-indigo-600 mb-2";
  const iconWrap =
    "h-12 w-12 rounded-full flex items-center justify-center mb-3 shadow";

  const cards = [
    {
      title: "Assigned Projects",
      count: assignedProjects,
      icon: (
        <div className={`${iconWrap} bg-blue-50`}>
          <FaProjectDiagram className="text-blue-500 text-xl" />
        </div>
      ),
      cta: {
        type: "link",
        label: "View Assigned Projects",
        to: `/user-assigned-projects/${userId}`,
      },
    },
    {
      title: "Assigned Tasks",
      count: assignedTasks,
      icon: (
        <div className={`${iconWrap} bg-emerald-50`}>
          <FaTasks className="text-emerald-600 text-xl" />
        </div>
      ),
      cta: {
        type: "button",
        label: "View Assigned Tasks",
        onClick: goToAssignedTasks,
      },
    },
    // --- ACTIVATED EVENTS CARD ---
    {
      title: "Upcoming Events",
      count: unseenUpcomingEvents,
      icon: (
        <div className={`${iconWrap} bg-purple-50`}>
          <FaCalendarAlt className="text-purple-600 text-xl" />
        </div>
      ),
      cta: { type: "link", label: "View Events", to: "/user-events" },
    },
    // --- REPLACED MEETINGS WITH NOTIFICATIONS ---
    {
      title: "Notifications",
      count: unreadNotifications,
      icon: (
        <div className={`${iconWrap} bg-amber-50`}>
          <FaBell className="text-amber-600 text-xl" />
        </div>
      ),
      cta: {
        type: "link",
        label: "View Notifications",
        to: "/user-notifications",
      },
    },
    {
      title: "Mark Attendance",
      count: attendanceCount,
      icon: (
        <div className={`${iconWrap} bg-green-50`}>
          <FaRegCalendarCheck className="text-green-600 text-xl" />
        </div>
      ),
      cta: {
        type: "link",
        label: "Go to Attendance",
        to: "/create-attendance",
      },
    },
  ];

  const gridClass =
    view === "grid"
      ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5"
      : view === "card"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      : "space-y-3";

  return (
    <div className="py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-indigo-600">
            Test Engineer Dashboard
          </h3>
          <div className="flex items-center gap-2">
            <button
              className={`rounded-lg border px-2.5 py-1.5 text-sm flex items-center gap-2 ${
                view === "list"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-slate-200 text-slate-600 hover:text-slate-800"
              }`}
              onClick={() => setView("list")}
            >
              <FaThList className="text-base" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              className={`rounded-lg border px-2.5 py-1.5 text-sm flex items-center gap-2 ${
                view === "card"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-slate-200 text-slate-600 hover:text-slate-800"
              }`}
              onClick={() => setView("card")}
            >
              <FaThLarge className="text-base" />
              <span className="hidden sm:inline">Card</span>
            </button>
            <button
              className={`rounded-lg border px-2.5 py-1.5 text-sm flex items-center gap-2 ${
                view === "grid"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-slate-200 text-slate-600 hover:text-slate-800"
              }`}
              onClick={() => setView("grid")}
            >
              <FaTh className="text-base" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className={gridClass}>
          {cards.map((c, idx) => (
            <div
              key={idx}
              className={cardBase}
              style={{ alignItems: "stretch" }}
            >
              <div className="flex flex-col items-center">
                {c.icon}
                <h3 className={titleBase}>{c.title}</h3>
                <p className={countBase}>
                  {loading ? <span className="opacity-60">…</span> : c.count}
                </p>
              </div>

              {c.cta?.type === "link" && (
                <Link
                  to={c.cta.to}
                  className="mt-1 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                >
                  {c.cta.label}
                </Link>
              )}

              {c.cta?.type === "button" && (
                <button
                  onClick={c.cta.onClick}
                  className="mt-1 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                >
                  {c.cta.label}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
