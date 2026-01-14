// // components/Header.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import { Menu } from "@headlessui/react";
// import { UserIcon, BellIcon } from "@heroicons/react/24/solid";
// import { CalendarDaysIcon } from "@heroicons/react/24/outline";
// import axios from "axios";
// import ecoders_logo from "../assets/ecoders_logo.png";
// import globalBackendRoute from "../config/Config";

// // ---------- Seen-events helpers (per user, stored in localStorage) ----------
// const SEEN_KEY = (uid) => `seenEvents:${uid}`;

// function getSeenSet(uid) {
//   if (!uid) return new Set();
//   try {
//     const raw = localStorage.getItem(SEEN_KEY(uid));
//     if (!raw) return new Set();
//     const arr = JSON.parse(raw);
//     return new Set(Array.isArray(arr) ? arr : []);
//   } catch {
//     return new Set();
//   }
// }
// function saveSeenSet(uid, set) {
//   if (!uid) return;
//   try {
//     localStorage.setItem(SEEN_KEY(uid), JSON.stringify(Array.from(set)));
//   } catch {}
// }
// function markEventSeen(uid, eventId) {
//   if (!uid || !eventId) return;
//   const s = getSeenSet(uid);
//   if (!s.has(eventId)) {
//     s.add(eventId);
//     saveSeenSet(uid, s);
//     try {
//       localStorage.setItem("app:lastEventSeenPing", String(Date.now()));
//     } catch {}
//     window.dispatchEvent(new Event("app:refreshBadges"));
//   }
// }
// // Extract /single-user-event/:id from a pathname
// function extractEventIdFromPath(pathname) {
//   const m = pathname.match(/\/single-user-event\/([^/?#]+)/i);
//   return m ? m[1] : null;
// }

// export default function Header() {
//   // --- NEW: sticky translucency on scroll ---
//   const [scrolled, setScrolled] = useState(false);
//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 6);
//     onScroll();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   // --- Your original state ---
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [isAdminOrSuperAdmin, setAdminOrSuperAdmin] = useState(false);

//   const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
//   const [unreadNotifCount, setUnreadNotifCount] = useState(0);
//   const [unseenUpcomingEventCount, setUnseenUpcomingEventCount] = useState(0);

//   const navigate = useNavigate();
//   const location = useLocation();

//   const API_BASE = globalBackendRoute;
//   const API = `${API_BASE}/api`;

//   // --- Existing optional "messages" count ---
//   const fetchUnreadMessages = async () => {
//     try {
//       const res = await axios.get(`${API}/messages/unread-count`);
//       setUnreadMessagesCount(res.data?.unreadCount ?? 0);
//     } catch (error) {
//       console.error("Error fetching unread messages:", error);
//       setUnreadMessagesCount(0);
//     }
//   };

//   // --- Notifications (existing) ---
//   const fetchNotificationCounts = async (uid, token) => {
//     if (!uid) return 0;
//     try {
//       const url = `${API}/count-notifications/${uid}`;
//       const res = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const unread = Number(res.data?.unread ?? 0);
//       return unread;
//     } catch (err) {
//       console.error("Notif count error:", {
//         message: err?.message,
//         status: err?.response?.status,
//         data: err?.response?.data,
//         url: err?.config?.url,
//       });
//       return 0;
//     }
//   };

//   const computeUnreadViaInbox = async (uid, token) => {
//     if (!uid) return 0;
//     try {
//       const url = `${API}/get-user-notifications/${uid}`;
//       const res = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const rows = Array.isArray(res.data) ? res.data : [];
//       const unread = rows.reduce((acc, n) => {
//         const status = n?.statusForUser || (n?.isRead ? "read" : "unread");
//         const hidden = n?.receipt?.isDeleted === true;
//         if (hidden) return acc;
//         const isUnread = !["read", "seen", "replied"].includes(
//           String(status || "").toLowerCase()
//         );
//         return acc + (isUnread ? 1 : 0);
//       }, 0);
//       return unread;
//     } catch (err) {
//       console.error("Inbox fallback error:", {
//         message: err?.message,
//         status: err?.response?.status,
//         data: err?.response?.data,
//         url: err?.config?.url,
//       });
//       return 0;
//     }
//   };

//   // --- Events: fetch upcoming visible events and compute UNSEEN count locally ---
//   const fetchUnseenUpcomingEventsCount = async (uid, role, token) => {
//     if (!uid) return 0;
//     try {
//       const nowIso = new Date().toISOString();
//       const url = `${API}/events/visible?userId=${encodeURIComponent(
//         uid
//       )}&role=${encodeURIComponent(role || "")}&startGte=${encodeURIComponent(
//         nowIso
//       )}&isPublished=true&limit=200`;

//       const res = await axios.get(url, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       const rows = Array.isArray(res.data?.data) ? res.data.data : [];

//       const seen = getSeenSet(uid);
//       const unseen = rows.reduce((acc, ev) => {
//         const id = ev?._id || ev?.id;
//         if (!id) return acc;
//         return acc + (seen.has(String(id)) ? 0 : 1);
//       }, 0);
//       return unseen;
//     } catch (err) {
//       console.error("Event unseen-count error:", {
//         message: err?.message,
//         status: err?.response?.status,
//         data: err?.response?.data,
//         url: err?.config?.url,
//       });
//       return 0;
//     }
//   };

//   // Make a one-call refresh the rest of the UI can use
//   const refreshBadgesNow = async () => {
//     const token = localStorage.getItem("token");
//     let userData = null;
//     try {
//       userData = JSON.parse(localStorage.getItem("user"));
//     } catch {}
//     if (!token || !userData) {
//       setUnreadNotifCount(0);
//       setUnseenUpcomingEventCount(0);
//       return;
//     }
//     const uid = userData?._id || userData?.id;

//     try {
//       const unread = await fetchNotificationCounts(uid, token);
//       const finalCount =
//         unread === 0 ? await computeUnreadViaInbox(uid, token) : unread;
//       setUnreadNotifCount(finalCount);
//     } catch {
//       setUnreadNotifCount(0);
//     }

//     try {
//       const cnt = await fetchUnseenUpcomingEventsCount(
//         uid,
//         userData.role,
//         token
//       );
//       setUnseenUpcomingEventCount(cnt);
//     } catch {
//       setUnseenUpcomingEventCount(0);
//     }
//   };

//   // --- Boot & react to route changes ---
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     let userData = null;
//     try {
//       userData = JSON.parse(localStorage.getItem("user"));
//     } catch {
//       userData = null;
//     }

//     if (!token || !userData) {
//       setIsLoggedIn(false);
//       setUser(null);
//       setUserName("");
//       setUserId(null);
//       setAdminOrSuperAdmin(false);
//       setUnreadNotifCount(0);
//       setUnreadMessagesCount(0);
//       setUnseenUpcomingEventCount(0);
//       return;
//     }

//     const uid = userData?._id || userData?.id;
//     setIsLoggedIn(true);
//     setUser(userData);
//     setUserName(userData.name || userData.fullName || "");
//     setUserId(uid);

//     if (userData.role === "admin" || userData.role === "superadmin") {
//       setAdminOrSuperAdmin(true);
//       fetchUnreadMessages();
//     } else {
//       setAdminOrSuperAdmin(false);
//     }

//     // mark event as seen if on single-user-event route
//     const eventIdOnRoute = extractEventIdFromPath(location.pathname);
//     if (eventIdOnRoute) {
//       markEventSeen(uid, eventIdOnRoute);
//     }

//     // Initial pulls / recompute badges
//     refreshBadgesNow();

//     // Listeners: manual refresh & cross-tab ping
//     const onRefresh = () => refreshBadgesNow();
//     window.addEventListener("app:refreshBadges", onRefresh);

//     const onStorage = (e) => {
//       if (e.key === "app:lastEventSeenPing") {
//         refreshBadgesNow();
//       }
//     };
//     window.addEventListener("storage", onStorage);

//     return () => {
//       window.removeEventListener("app:refreshBadges", onRefresh);
//       window.removeEventListener("storage", onStorage);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [location.pathname]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setIsLoggedIn(false);
//     setUser(null);
//     setUserName("");
//     setUserId(null);
//     setAdminOrSuperAdmin(false);
//     setUnreadNotifCount(0);
//     setUnreadMessagesCount(0);
//     setUnseenUpcomingEventCount(0);
//     navigate("/", { replace: true });
//   };

//   const getDashboardLink = (role) => {
//     const dashboardLinks = {
//       superadmin: "/super-admin-dashboard",
//       admin: "/admin-dashboard",
//       qa_lead: "/qa-dashboard",
//       test_engineer: "/test-engineer-dashboard",
//       developer: "/developer-dashboard",
//       developer_lead: "/developer-lead-dashboard",
//       project_manager: "/project-manager-dashboard",
//     };
//     return dashboardLinks[role] || "/dashboard";
//   };

//   return (
//     <header
//       className={[
//         "fixed inset-x-0 top-0 z-50 transition-all",
//         "py-2",
//         scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white",
//       ].join(" ")}
//     >
//       <nav
//         aria-label="Global"
//         className="mx-auto flex max-w-full items-center justify-between w-full px-4"
//       >
//         {/* Left: Logo */}
//         <div className="flex lg:flex-1">
//           <Link to="/" className="-m-1.5 p-1.5">
//             <span className="sr-only">ECODERS</span>
//             <img
//               alt="ECODERS"
//               src={
//                 ecoders_logo ||
//                 "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
//               }
//               className="h-12 md:h-16 w-auto"
//             />
//           </Link>
//         </div>

//         {/* Center: Nav links */}
//         <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-x-8 w-full whitespace-nowrap">
//           <Link
//             to="/"
//             className="text-sm font-semibold leading-6 text-gray-600"
//           >
//             Home
//           </Link>

//           {isLoggedIn && (
//             <>
//               {isAdminOrSuperAdmin ? (
//                 <>
//                   <Link
//                     to="/all-users"
//                     className="text-sm font-semibold leading-6 text-gray-700"
//                   >
//                     All Users
//                   </Link>
//                   <Link
//                     to={getDashboardLink(user.role)}
//                     className="text-sm font-semibold leading-6 text-gray-700"
//                   >
//                     Dashboard
//                   </Link>
//                 </>
//               ) : (
//                 <Link
//                   to={getDashboardLink(user.role)}
//                   className="text-sm font-semibold leading-6 text-gray-700"
//                 >
//                   Dashboard
//                 </Link>
//               )}
//             </>
//           )}

//           <Link
//             to="/all-blogs"
//             className="text-sm font-semibold leading-6 text-gray-700"
//           >
//             Blogs
//           </Link>
//           <Link
//             to="/contact"
//             className="text-sm font-semibold leading-6 text-gray-700"
//           >
//             Contact
//           </Link>
//           <Link
//             to="/about-us"
//             className="text-sm font-semibold leading-6 text-gray-700"
//           >
//             About Us
//           </Link>
//           <Link
//             to="/careers"
//             className="text-sm font-semibold leading-6 text-gray-700"
//           >
//             Careers
//           </Link>
//         </div>

//         {/* Right: Events + Notifications + User menu */}
//         <div className="flex items-center gap-4 lg:flex-1 lg:justify-end">
//           {isLoggedIn && (
//             <button
//               type="button"
//               onClick={() => navigate("/user-events")}
//               aria-label="Events"
//               className="relative inline-flex items-center justify-center rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               title="Your events"
//             >
//               <CalendarDaysIcon className="h-6 w-6 text-gray-700" />
//               {unseenUpcomingEventCount > 0 && (
//                 <span
//                   className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold"
//                   title={`${unseenUpcomingEventCount} new`}
//                 >
//                   {unseenUpcomingEventCount > 99
//                     ? "99+"
//                     : unseenUpcomingEventCount}
//                 </span>
//               )}
//             </button>
//           )}

//           {isLoggedIn && (
//             <button
//               type="button"
//               onClick={() => navigate("/user-notifications")}
//               aria-label="Notifications"
//               className="relative inline-flex items-center justify-center rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <BellIcon className="h-6 w-6 text-gray-700" />
//               {unreadNotifCount > 0 && (
//                 <span
//                   className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold"
//                   title={`${unreadNotifCount} unread`}
//                 >
//                   {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
//                 </span>
//               )}
//             </button>
//           )}

//           {isLoggedIn ? (
//             <Menu as="div" className="relative z-50">
//               <Menu.Button className="flex items-center text-sm font-semibold leading-6 text-gray-700">
//                 <UserIcon className="h-5 w-5 text-gray-700 mr-2" />
//                 {userName}
//                 {unreadMessagesCount > 0 && (
//                   <span className="ml-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
//                     {unreadMessagesCount}
//                   </span>
//                 )}
//               </Menu.Button>
//               <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
//                 <Menu.Item as="div">
//                   {({ active }) => (
//                     <Link
//                       to={`/profile/${userId}`}
//                       className={`block px-4 py-2 text-sm text-gray-700 ${
//                         active ? "bg-gray-100" : ""
//                       }`}
//                     >
//                       Profile
//                     </Link>
//                   )}
//                 </Menu.Item>

//                 {isAdminOrSuperAdmin && (
//                   <Menu.Item as="div">
//                     {({ active }) => (
//                       <Link
//                         to="/all-messages"
//                         className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${
//                           active ? "bg-gray-100" : ""
//                         }`}
//                       >
//                         View Messages
//                       </Link>
//                     )}
//                   </Menu.Item>
//                 )}

//                 <Menu.Item as="div">
//                   {({ active }) => (
//                     <Link
//                       to={getDashboardLink(user.role)}
//                       className={`block px-4 py-2 text-sm text-gray-700 ${
//                         active ? "bg-gray-100" : ""
//                       }`}
//                     >
//                       Dashboard
//                     </Link>
//                   )}
//                 </Menu.Item>

//                 {isAdminOrSuperAdmin && (
//                   <Menu.Item as="div">
//                     {({ active }) => (
//                       <Link
//                         to="/all-replies"
//                         className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${
//                           active ? "bg-gray-100" : ""
//                         }`}
//                       >
//                         All Replies
//                       </Link>
//                     )}
//                   </Menu.Item>
//                 )}

//                 <Menu.Item as="div">
//                   {({ active }) => (
//                     <button
//                       onClick={handleLogout}
//                       className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${
//                         active ? "bg-gray-100" : ""
//                       }`}
//                     >
//                       Log out
//                     </button>
//                   )}
//                 </Menu.Item>
//               </Menu.Items>
//             </Menu>
//           ) : (
//             <Link
//               to="/login"
//               className="text-sm font-semibold leading-6 text-gray-700"
//             >
//               Log in
//             </Link>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// }

// components/Header.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { UserIcon, BellIcon } from "@heroicons/react/24/solid";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import ecoders_logo from "../assets/ecoders_logo.png";
import globalBackendRoute from "../config/Config";

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

export default function Header() {
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

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [unseenUpcomingEventCount, setUnseenUpcomingEventCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE = globalBackendRoute;
  const API = `${API_BASE}/api`;

  const fetchUnreadMessages = async () => {
    try {
      const res = await axios.get(`${API}/messages/unread-count`);
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
      const unread = Number(res.data?.unread ?? 0);
      return unread;
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

  const refreshBadgesNow = async () => {
    const token = localStorage.getItem("token");
    let userData = null;
    try {
      userData = JSON.parse(localStorage.getItem("user"));
    } catch {}
    if (!token || !userData) {
      setUnreadNotifCount(0);
      setUnseenUpcomingEventCount(0);
      return;
    }
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
        token
      );
      setUnseenUpcomingEventCount(cnt);
    } catch {
      setUnseenUpcomingEventCount(0);
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
      setUnreadNotifCount(0);
      setUnreadMessagesCount(0);
      setUnseenUpcomingEventCount(0);
      return;
    }

    const uid = userData?._id || userData?.id;
    setIsLoggedIn(true);
    setUser(userData);
    setUserName(userData.name || userData.fullName || "");
    setUserId(uid);

    if (userData.role === "admin" || userData.role === "superadmin") {
      setAdminOrSuperAdmin(true);
      fetchUnreadMessages();
    } else {
      setAdminOrSuperAdmin(false);
    }

    const eventIdOnRoute = extractEventIdFromPath(location.pathname);
    if (eventIdOnRoute) {
      markEventSeen(uid, eventIdOnRoute);
    }

    refreshBadgesNow();

    const onRefresh = () => refreshBadgesNow();
    window.addEventListener("app:refreshBadges", onRefresh);

    const onStorage = (e) => {
      if (e.key === "app:lastEventSeenPing") {
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
    setIsLoggedIn(false);
    setUser(null);
    setUserName("");
    setUserId(null);
    setAdminOrSuperAdmin(false);
    setUnreadNotifCount(0);
    setUnreadMessagesCount(0);
    setUnseenUpcomingEventCount(0);
    navigate("/", { replace: true });
  };

  const getDashboardLink = (role) => {
    const dashboardLinks = {
      superadmin: "/super-admin-dashboard",
      admin: "/admin-dashboard",
      qa_lead: "/qa-dashboard",
      test_engineer: "/test-engineer-dashboard",
      developer: "/developer-dashboard",
      developer_lead: "/developer-lead-dashboard",
      project_manager: "/project-manager-dashboard",
    };
    return dashboardLinks[role] || "/dashboard";
  };

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all",
        "py-2",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white",
      ].join(" ")}
    >
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-full items-center justify-between w-full px-4"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">ECODERS</span>
            <img
              alt="ECODERS"
              src={
                ecoders_logo ||
                "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              }
              className="h-12 md:h-16 w-auto"
            />
          </Link>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-x-8 w-full whitespace-nowrap">
          <Link
            to="/"
            className="text-sm font-semibold leading-6 text-gray-600"
          >
            Home
          </Link>

          {isLoggedIn && (
            <>
              {isAdminOrSuperAdmin ? (
                <>
                  <Link
                    to="/all-users"
                    className="text-sm font-semibold leading-6 text-gray-700"
                  >
                    All Users
                  </Link>
                  <Link
                    to={getDashboardLink(user.role)}
                    className="text-sm font-semibold leading-6 text-gray-700"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <Link
                  to={getDashboardLink(user.role)}
                  className="text-sm font-semibold leading-6 text-gray-700"
                >
                  Dashboard
                </Link>
              )}
            </>
          )}

          <Link
            to="/all-blogs"
            className="text-sm font-semibold leading-6 text-gray-700"
          >
            Blogs
          </Link>
          <Link
            to="/contact"
            className="text-sm font-semibold leading-6 text-gray-700"
          >
            Contact
          </Link>
          <Link
            to="/about-us"
            className="text-sm font-semibold leading-6 text-gray-700"
          >
            About Us
          </Link>
          <Link
            to="/careers"
            className="text-sm font-semibold leading-6 text-gray-700"
          >
            Careers
          </Link>
        </div>

        <div className="flex items-center gap-4 lg:flex-1 lg:justify-end">
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => navigate("/user-events")}
              aria-label="Events"
              className="relative inline-flex items-center justify-center rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Your events"
            >
              <CalendarDaysIcon className="h-6 w-6 text-gray-700" />
              {unseenUpcomingEventCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold"
                  title={`${unseenUpcomingEventCount} new`}
                >
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
              onClick={() => navigate("/user-notifications")}
              aria-label="Notifications"
              className="relative inline-flex items-center justify-center rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <BellIcon className="h-6 w-6 text-gray-700" />
              {unreadNotifCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold"
                  title={`${unreadNotifCount} unread`}
                >
                  {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
                </span>
              )}
            </button>
          )}

          {isLoggedIn ? (
            <Menu as="div" className="relative z-50">
              <Menu.Button className="flex items-center text-sm font-semibold leading-6 text-gray-700">
                <UserIcon className="h-5 w-5 text-gray-700 mr-2" />
                {userName}
                {unreadMessagesCount > 0 && (
                  <span className="ml-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {unreadMessagesCount}
                  </span>
                )}
              </Menu.Button>

              <Menu.Items
                modal={false}
                className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
              >
                <Menu.Item as="div">
                  {({ active }) => (
                    <Link
                      to={`/profile/${userId}`}
                      className={`block px-4 py-2 text-sm text-gray-700 ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      Profile
                    </Link>
                  )}
                </Menu.Item>

                {isAdminOrSuperAdmin && (
                  <Menu.Item as="div">
                    {({ active }) => (
                      <Link
                        to="/all-messages"
                        className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${
                          active ? "bg-gray-100" : ""
                        }`}
                      >
                        View Messages
                      </Link>
                    )}
                  </Menu.Item>
                )}

                <Menu.Item as="div">
                  {({ active }) => (
                    <Link
                      to={getDashboardLink(user.role)}
                      className={`block px-4 py-2 text-sm text-gray-700 ${
                        active ? "bg-gray-100" : ""
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
                        className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${
                          active ? "bg-gray-100" : ""
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
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      Log out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          ) : (
            <Link
              to="/login"
              className="text-sm font-semibold leading-6 text-gray-700"
            >
              Log in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
