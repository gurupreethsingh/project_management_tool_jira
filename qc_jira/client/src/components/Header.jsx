import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu } from "@headlessui/react";
import axios from "axios";
import ecoders_logo from "../assets/ecoders_logo.png";
import globalBackendRoute from "../config/Config";
import TopHeader from "./TopHeader";

import {
  UserIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

const SEEN_KEY = (uid) => `seenEvents:${uid}`;

/* ---------- seen helpers ---------- */
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

function saveSeenSet(uid, set) {
  if (!uid) return;
  try {
    localStorage.setItem(SEEN_KEY(uid), JSON.stringify(Array.from(set)));
  } catch {}
}

function markEventSeen(uid, eventId) {
  if (!uid || !eventId) return;
  const s = getSeenSet(uid);
  if (!s.has(eventId)) {
    s.add(eventId);
    saveSeenSet(uid, s);
    try {
      localStorage.setItem("app:lastEventSeenPing", String(Date.now()));
    } catch {}
    window.dispatchEvent(new Event("app:refreshBadges"));
  }
}

function extractEventIdFromPath(pathname) {
  const m = pathname.match(/\/single-user-event\/([^/?#]+)/i);
  return m ? m[1] : null;
}
/* -------------------------------- */

const normalizeRole = (role) =>
  String(role || "")
    .trim()
    .toLowerCase();

const getDashboardLinkByRole = (role) => {
  const normalizedRole = normalizeRole(role);

  const dashboardLinks = {
    superadmin: "/super-admin-dashboard",
    admin: "/admin-dashboard",

    qa_lead: "/qa-dashboard",

    test_engineer: "/test-engineer-dashboard",

    developer: "/developer-dashboard",
    developer_lead: "/developer-dashboard",
    tech_lead: "/developer-dashboard",

    project_manager: "/project-manager-dashboard",

    accountant: "/dashboard",
    alumni_relations: "/dashboard",
    business_analyst: "/dashboard",
    content_creator: "/dashboard",
    course_coordinator: "/dashboard",
    customer_support: "/dashboard",
    data_scientist: "/dashboard",
    dean: "/dashboard",
    department_head: "/dashboard",
    event_coordinator: "/dashboard",
    exam_controller: "/dashboard",
    hr_manager: "/dashboard",
    hr: "/dashboard",
    intern: "/dashboard",
    legal_advisor: "/dashboard",
    librarian: "/dashboard",
    maintenance_staff: "/dashboard",
    marketing_manager: "/dashboard",
    operations_manager: "/dashboard",
    product_owner: "/dashboard",
    recruiter: "/dashboard",
    registrar: "/dashboard",
    researcher: "/dashboard",
    sales_executive: "/dashboard",
    student: "/dashboard",
    support_engineer: "/dashboard",
    teacher: "/dashboard",
    user: "/dashboard",
    ux_ui_designer: "/dashboard",
  };

  return dashboardLinks[normalizedRole] || "/dashboard";
};

export default function Header() {
  const headerBarRef = useRef(null);
  const badgeRefreshInFlightRef = useRef(false);
  const lastBadgeRefreshAtRef = useRef(0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAdminOrSuperAdmin, setAdminOrSuperAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [unseenUpcomingEventCount, setUnseenUpcomingEventCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE = globalBackendRoute;
  const API = `${API_BASE}/api`;

  const fetchUnreadMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/messages/unread-count`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setUnreadMessagesCount(res.data?.unreadCount ?? 0);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
      setUnreadMessagesCount(0);
    }
  };

  const fetchNotificationCounts = async (uid, token) => {
    if (!uid) return 0;
    try {
      const url = `${API}/count-notifications/${uid}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return Number(res.data?.unread ?? 0);
    } catch (err) {
      console.error("Notif count error:", {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
        url: err?.config?.url,
      });
      return 0;
    }
  };

  const computeUnreadViaInbox = async (uid, token) => {
    if (!uid) return 0;
    try {
      const url = `${API}/get-user-notifications/${uid}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rows = Array.isArray(res.data) ? res.data : [];
      return rows.reduce((acc, n) => {
        const status = n?.statusForUser || (n?.isRead ? "read" : "unread");
        const hidden = n?.receipt?.isDeleted === true;
        if (hidden) return acc;
        const isUnread = !["read", "seen", "replied"].includes(
          String(status || "").toLowerCase(),
        );
        return acc + (isUnread ? 1 : 0);
      }, 0);
    } catch (err) {
      console.error("Inbox fallback error:", {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
        url: err?.config?.url,
      });
      return 0;
    }
  };

  const fetchUnseenUpcomingEventsCount = async (uid, role, token) => {
    if (!uid) return 0;
    try {
      const nowIso = new Date().toISOString();
      const url = `${API}/events/visible?userId=${encodeURIComponent(
        uid,
      )}&role=${encodeURIComponent(role || "")}&startGte=${encodeURIComponent(
        nowIso,
      )}&isPublished=true&limit=200`;

      const res = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const rows = Array.isArray(res.data?.data) ? res.data.data : [];

      const seen = getSeenSet(uid);
      return rows.reduce((acc, ev) => {
        const id = ev?._id || ev?.id;
        if (!id) return acc;
        return acc + (seen.has(String(id)) ? 0 : 1);
      }, 0);
    } catch (err) {
      console.error("Event unseen-count error:", {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
        url: err?.config?.url,
      });
      return 0;
    }
  };

  const refreshBadgesNow = async ({ force = false } = {}) => {
    const now = Date.now();

    // Prevent many badge API calls during fast route changes/clicks.
    // force=true is used after explicit badge refresh events.
    if (!force && now - lastBadgeRefreshAtRef.current < 15000) return;
    if (badgeRefreshInFlightRef.current) return;

    const token = localStorage.getItem("token");
    let userData = null;
    try {
      userData = JSON.parse(localStorage.getItem("user"));
    } catch {
      userData = null;
    }

    if (!token || !userData) {
      setUnreadNotifCount(0);
      setUnseenUpcomingEventCount(0);
      return;
    }

    badgeRefreshInFlightRef.current = true;
    lastBadgeRefreshAtRef.current = now;

    const uid = userData?._id || userData?.id;

    try {
      const unread = await fetchNotificationCounts(uid, token);
      const finalCount =
        unread === 0 ? await computeUnreadViaInbox(uid, token) : unread;
      setUnreadNotifCount(finalCount);
    } catch {
      setUnreadNotifCount(0);
    }

    try {
      const cnt = await fetchUnseenUpcomingEventsCount(
        uid,
        userData.role,
        token,
      );
      setUnseenUpcomingEventCount(cnt);
    } catch {
      setUnseenUpcomingEventCount(0);
    } finally {
      badgeRefreshInFlightRef.current = false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    let userData = null;

    try {
      userData = JSON.parse(localStorage.getItem("user"));
    } catch {
      userData = null;
    }

    if (!token || !userData) {
      setIsLoggedIn(false);
      setUser(null);
      setUserName("");
      setUserId(null);
      setAdminOrSuperAdmin(false);
      setIsSuperAdmin(false);
      setUnreadNotifCount(0);
      setUnreadMessagesCount(0);
      setUnseenUpcomingEventCount(0);
      return;
    }

    const uid = userData?._id || userData?.id;
    const role = normalizeRole(userData?.role);

    setIsLoggedIn(true);
    setUser(userData);
    setUserName(userData.name || userData.fullName || "");
    setUserId(uid);
    setAdminOrSuperAdmin(role === "admin" || role === "superadmin");
    setIsSuperAdmin(role === "superadmin");

    if (role === "admin" || role === "superadmin") {
      fetchUnreadMessages();
    } else {
      setUnreadMessagesCount(0);
    }

    const eventIdOnRoute = extractEventIdFromPath(location.pathname);
    if (eventIdOnRoute) markEventSeen(uid, eventIdOnRoute);

    refreshBadgesNow();

    const onRefresh = () => refreshBadgesNow({ force: true });
    window.addEventListener("app:refreshBadges", onRefresh);

    const onStorage = (e) => {
      if (
        !e ||
        e.key === "app:lastEventSeenPing" ||
        e.key === "user" ||
        e.key === "token"
      ) {
        refreshBadgesNow();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("app:refreshBadges", onRefresh);
      window.removeEventListener("storage", onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUser(null);
    setUserName("");
    setUserId(null);
    setAdminOrSuperAdmin(false);
    setIsSuperAdmin(false);
    setUnreadNotifCount(0);
    setUnreadMessagesCount(0);
    setUnseenUpcomingEventCount(0);
    navigate("/", { replace: true });
  };

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const dashboardRoute = useMemo(
    () => getDashboardLinkByRole(user?.role),
    [user?.role],
  );

  useEffect(() => {
    if (!headerBarRef.current) return;
    const el = headerBarRef.current;

    let raf = 0;
    const setVar = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = el.getBoundingClientRect().height;
        const next = `${Math.ceil(h)}px`;
        const cur = getComputedStyle(document.documentElement).getPropertyValue(
          "--header-h",
        );
        if (cur.trim() !== next) {
          document.documentElement.style.setProperty("--header-h", next);
        }
      });
    };

    setVar();
    const ro = new ResizeObserver(() => setVar());
    ro.observe(el);

    window.addEventListener("resize", setVar);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navLink =
    "text-sm font-semibold text-gray-600 hover:text-purple-600 transition-colors";

  const iconBtn =
    "relative rounded-full p-2 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition";

  const headerTopStyle = {
    top: "var(--topbar-h, 48px)",
    zIndex: 2147483000,
    pointerEvents: "auto",
  };

  const mobilePanelTopStyle = {
    top: "calc(var(--topbar-h, 48px) + var(--header-h, 56px))",
    maxHeight: "calc(100vh - var(--topbar-h, 48px) - var(--header-h, 56px))",
    zIndex: 2147483001,
    pointerEvents: "auto",
  };

  const goTo = (path, options = {}) => {
    const { replace = false } = options;

    setMenuOpen(false);

    if (!path) return;

    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate(path, { replace });

    // Safety fallback for pages with heavy overlays/animations that may block SPA updates.
    window.setTimeout(() => {
      if (window.location.pathname !== path) {
        window.location.assign(path);
      }
    }, 120);
  };

  const desktopNavButton = `${navLink} bg-transparent border-0 p-0 cursor-pointer`;
  const mobileNavButton =
    "block w-full text-left text-sm font-semibold text-gray-700 hover:text-purple-600 bg-transparent border-0 p-0";

  return (
    <>
      <TopHeader />

      <header
        data-main-header="true"
        className={[
          "fixed inset-x-0 z-[2147483000] pointer-events-auto transition-all",
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-md"
            : "bg-white shadow-md",
        ].join(" ")}
        style={headerTopStyle}
      >
        <div
          ref={headerBarRef}
          className="max-w-screen-3xl mx-auto px-3 sm:px-4"
        >
          <div className="flex items-center justify-between py-2">
            <Link
              to="/home"
              className="flex items-center gap-2 sm:gap-3 min-w-0"
              aria-label="Ecoders Home"
            >
              {ecoders_logo ? (
                <img
                  src={ecoders_logo}
                  alt="ECODERS"
                  className="h-10 sm:h-11 md:h-12 w-auto"
                />
              ) : null}
              <div className="text-lg sm:text-xl font-extrabold tracking-tight text-purple-700 truncate">
                ECODERS
              </div>
            </Link>

            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                className="p-2 rounded hover:bg-purple-50"
              >
                {menuOpen ? (
                  <XMarkIcon className="h-7 w-7 text-purple-700" />
                ) : (
                  <Bars3Icon className="h-7 w-7 text-purple-700" />
                )}
              </button>
            </div>

            <div className="hidden md:flex flex-1 justify-between items-center ml-10">
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => goTo("/")}
                  className={desktopNavButton}
                >
                  Home
                </button>

                {isLoggedIn && (
                  <>
                    {isAdminOrSuperAdmin ? (
                      <>
                        <button
                          type="button"
                          onClick={() => goTo("/all-users")}
                          className={desktopNavButton}
                        >
                          All Users
                        </button>
                        <button
                          type="button"
                          onClick={() => goTo(dashboardRoute)}
                          className={desktopNavButton}
                        >
                          Dashboard
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => goTo(dashboardRoute)}
                        className={desktopNavButton}
                      >
                        Dashboard
                      </button>
                    )}
                  </>
                )}

                <button
                  type="button"
                  onClick={() => goTo("/all-blogs")}
                  className={desktopNavButton}
                >
                  Blogs
                </button>
                <button
                  type="button"
                  onClick={() => goTo("/contact")}
                  className={desktopNavButton}
                >
                  Contact
                </button>
                <button
                  type="button"
                  onClick={() => goTo("/about-us")}
                  className={desktopNavButton}
                >
                  About Us
                </button>
                <button
                  type="button"
                  onClick={() => goTo("/careers")}
                  className={desktopNavButton}
                >
                  Careers
                </button>
              </div>

              <div className="flex items-center gap-4">
                {isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => goTo("/user-events")}
                    aria-label="Events"
                    title="Your events"
                    className={iconBtn}
                  >
                    <CalendarDaysIcon className="h-6 w-6 text-purple-700" />
                    {unseenUpcomingEventCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5 min-w-[20px] h-[20px] flex items-center justify-center">
                        {unseenUpcomingEventCount > 99
                          ? "99+"
                          : unseenUpcomingEventCount}
                      </span>
                    )}
                  </button>
                )}

                {isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => goTo("/user-notifications")}
                    aria-label="Notifications"
                    title="Notifications"
                    className={iconBtn}
                  >
                    <BellIcon className="h-6 w-6 text-purple-700" />
                    {unreadNotifCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 min-w-[20px] h-[20px] flex items-center justify-center">
                        {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
                      </span>
                    )}
                  </button>
                )}

                {!isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goTo("/login")}
                      className="rounded-full h-9 w-9 flex items-center justify-center hover:bg-purple-50"
                      title="Login"
                      aria-label="Login"
                    >
                      <UserIcon className="h-6 w-6 text-purple-700" />
                    </button>
                    <button
                      type="button"
                      onClick={() => goTo("/login")}
                      className={desktopNavButton}
                    >
                      Login
                    </button>
                  </div>
                ) : (
                  <Menu as="div" className="relative z-[2147483001]">
                    <Menu.Button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-purple-50 transition">
                      <UserIcon className="h-7 w-7 text-purple-700" />
                      <span className="text-sm font-semibold text-gray-700 max-w-[140px] truncate">
                        {userName || "User"}
                      </span>

                      {unreadMessagesCount > 0 && (
                        <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                          {unreadMessagesCount > 99
                            ? "99+"
                            : unreadMessagesCount}
                        </span>
                      )}
                    </Menu.Button>

                    <Menu.Items
                      modal={false}
                      className="absolute right-0 z-[2147483002] mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none border"
                    >
                      <Menu.Item as="div">
                        {({ active }) => (
                          <Link
                            to={`/profile/${userId}`}
                            className={`block px-4 py-2 text-sm ${
                              active ? "bg-purple-50" : ""
                            }`}
                          >
                            Profile
                          </Link>
                        )}
                      </Menu.Item>

                      <Menu.Item as="div">
                        {({ active }) => (
                          <Link
                            to="/view-all-todo-list"
                            className={`block px-4 py-2 text-sm ${
                              active ? "bg-purple-50" : ""
                            }`}
                          >
                            View All ToDo Tasks
                          </Link>
                        )}
                      </Menu.Item>

                      <Menu.Item as="div">
                        {({ active }) => (
                          <Link
                            to="/create-todo-list"
                            className={`block px-4 py-2 text-sm ${
                              active ? "bg-purple-50" : ""
                            }`}
                          >
                            Create To Do Task List
                          </Link>
                        )}
                      </Menu.Item>

                      {isAdminOrSuperAdmin && (
                        <Menu.Item as="div">
                          {({ active }) => (
                            <Link
                              to="/all-messages"
                              className={`block px-4 py-2 text-sm ${
                                active ? "bg-purple-50" : ""
                              }`}
                            >
                              View Messages
                            </Link>
                          )}
                        </Menu.Item>
                      )}

                      {isSuperAdmin && (
                        <Menu.Item as="div">
                          {({ active }) => (
                            <Link
                              to="/all-careers-applications"
                              className={`block px-4 py-2 text-sm ${
                                active ? "bg-purple-50" : ""
                              }`}
                            >
                              All Careers Applications
                            </Link>
                          )}
                        </Menu.Item>
                      )}

                      <Menu.Item as="div">
                        {({ active }) => (
                          <Link
                            to={dashboardRoute}
                            className={`block px-4 py-2 text-sm ${
                              active ? "bg-purple-50" : ""
                            }`}
                          >
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>

                      {isAdminOrSuperAdmin && (
                        <Menu.Item as="div">
                          {({ active }) => (
                            <Link
                              to="/all-replies"
                              className={`block px-4 py-2 text-sm ${
                                active ? "bg-purple-50" : ""
                              }`}
                            >
                              All Replies
                            </Link>
                          )}
                        </Menu.Item>
                      )}

                      <Menu.Item as="div">
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`block w-full text-left px-4 py-2 text-sm font-semibold text-red-600 ${
                              active ? "bg-purple-50" : ""
                            }`}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-[2147482998] bg-black/20 md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          <div
            className="
              fixed inset-x-0 z-[2147483001] md:hidden
              bg-white border-t shadow
              px-4 py-4 space-y-3
              overflow-auto
            "
            style={mobilePanelTopStyle}
          >
            <button
              type="button"
              className={mobileNavButton}
              onClick={() => goTo("/")}
            >
              Home
            </button>

            {isLoggedIn && (
              <>
                <button
                  type="button"
                  className={mobileNavButton}
                  onClick={() => goTo("/view-all-todo-list")}
                >
                  View All ToDo Tasks
                </button>

                <button
                  type="button"
                  className={mobileNavButton}
                  onClick={() => goTo("/create-todo-list")}
                >
                  Create To Do Task List
                </button>
              </>
            )}

            {isLoggedIn && (
              <>
                {isAdminOrSuperAdmin ? (
                  <>
                    <button
                      type="button"
                      className={mobileNavButton}
                      onClick={() => goTo("/all-users")}
                    >
                      All Users
                    </button>
                    <button
                      type="button"
                      className={mobileNavButton}
                      onClick={() => goTo(dashboardRoute)}
                    >
                      Dashboard
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={mobileNavButton}
                    onClick={() => goTo(dashboardRoute)}
                  >
                    Dashboard
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              className={mobileNavButton}
              onClick={() => goTo("/all-blogs")}
            >
              Blogs
            </button>
            <button
              type="button"
              className={mobileNavButton}
              onClick={() => goTo("/contact")}
            >
              Contact
            </button>
            <button
              type="button"
              className={mobileNavButton}
              onClick={() => goTo("/about-us")}
            >
              About Us
            </button>
            <button
              type="button"
              className={mobileNavButton}
              onClick={() => goTo("/careers")}
            >
              Careers
            </button>

            {isLoggedIn && isSuperAdmin && (
              <button
                type="button"
                className={mobileNavButton}
                onClick={() => goTo("/all-careers-applications")}
              >
                All Careers Applications
              </button>
            )}

            <div className="flex items-center justify-around pt-2">
              {isLoggedIn && (
                <button
                  type="button"
                  onClick={() => {
                    goTo("/user-events");
                  }}
                  className="relative p-2 rounded-full hover:bg-purple-50"
                  aria-label="Events"
                  title="Events"
                >
                  <CalendarDaysIcon className="h-7 w-7 text-purple-700" />
                  {unseenUpcomingEventCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center">
                      {unseenUpcomingEventCount > 99
                        ? "99+"
                        : unseenUpcomingEventCount}
                    </span>
                  )}
                </button>
              )}

              {isLoggedIn && (
                <button
                  type="button"
                  onClick={() => {
                    goTo("/user-notifications");
                  }}
                  className="relative p-2 rounded-full hover:bg-purple-50"
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <BellIcon className="h-7 w-7 text-purple-700" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center">
                      {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
                    </span>
                  )}
                </button>
              )}

              {!isLoggedIn ? (
                <button
                  onClick={() => {
                    goTo("/login");
                  }}
                  className="flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-800"
                  aria-label="Login"
                >
                  <UserIcon className="h-6 w-6" />
                  Login
                </button>
              ) : (
                <button
                  onClick={() => {
                    goTo(`/profile/${userId}`);
                  }}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-purple-600"
                  aria-label="Profile"
                >
                  <UserIcon className="h-6 w-6 text-purple-700" />
                  {userName || "User"}
                </button>
              )}
            </div>

            {isLoggedIn && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left text-sm font-semibold text-red-600 hover:bg-purple-50 rounded px-3 py-2"
              >
                Logout
              </button>
            )}
          </div>
        </>
      )}

      <div
        style={{
          height: "calc(var(--topbar-h,48px) + var(--header-h,56px))",
        }}
      />
    </>
  );
}
