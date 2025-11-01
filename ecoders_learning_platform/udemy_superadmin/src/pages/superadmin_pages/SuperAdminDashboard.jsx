// // // import React, { useEffect, useState, useMemo } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import axios from "axios";
// // // import { jwtDecode } from "jwt-decode";
// // // import {
// // //   FaThList,
// // //   FaThLarge,
// // //   FaTh,
// // //   FaCog,
// // //   FaPlus,
// // //   FaBoxOpen,
// // //   FaUserCheck,
// // //   FaUserClock,
// // //   FaUserTimes,
// // //   FaEnvelope,
// // // } from "react-icons/fa";

// // // import globalBackendRoute from "@/config/Config.js";
// // // import SearchBar from "../../components/common_components/SearchBar";
// // // import LeftSidebarNav from "../../components/common_components/LeftSidebarNav";
// // // import DashboardCard from "../../components/common_components/DashboardCard";
// // // import DashboardLayout from "../../components/common_components/DashboardLayout";
// // // import iconMap from "../../components/common_components/iconMap.jsx";
// // // import stopwords from "../../components/common_components/stopwords.jsx";

// // // /* ---------------- UI helpers ---------------- */
// // // const colorPalette = [
// // //   "bg-indigo-50",
// // //   "bg-blue-50",
// // //   "bg-green-50",
// // //   "bg-amber-50",
// // //   "bg-pink-50",
// // //   "bg-purple-50",
// // //   "bg-teal-50",
// // //   "bg-rose-50",
// // //   "bg-cyan-50",
// // //   "bg-lime-50",
// // // ];
// // // const colorForKey = (key = "") => {
// // //   const s = String(key);
// // //   let sum = 0;
// // //   for (let i = 0; i < s.length; i++)
// // //     sum = (sum + s.charCodeAt(i)) % colorPalette.length;
// // //   return colorPalette[sum];
// // // };
// // // const coerceNumber = (v, fallback = 0) => {
// // //   const n = Number(v);
// // //   return Number.isFinite(n) ? n : fallback;
// // // };

// // // /* ---------------- HARD DEFAULTS so cards never vanish ----------------
// // //    Add "activities" here. If backend doesn't send it yet, we still render 0 and
// // //    try a resilient fallback to find the real count.
// // // --------------------------------------------------------------------- */
// // // const DEFAULT_COUNT_KEYS = {
// // //   blogs: 0,
// // //   categories: 0,
// // //   contacts: 0,
// // //   courses: 0,
// // //   degrees: 0,
// // //   exams: 0,
// // //   instructors: 0,
// // //   notifications: 0,
// // //   questions: 0,
// // //   quizzes: 0,
// // //   semesters: 0,
// // //   subcategories: 0,
// // //   users: 0,
// // //   students: 0,
// // //   activities: 0,
// // //   admissions: 0,
// // // };

// // // const SuperadminDashboard = () => {
// // //   const navigate = useNavigate();

// // //   const [search, setSearch] = useState("");
// // //   const [view, setView] = useState("grid");
// // //   const [userId, setUserId] = useState(null);

// // //   // counts for the main cards (always seeded with defaults)
// // //   const [counts, setCounts] = useState(DEFAULT_COUNT_KEYS);

// // //   // instructor app/status breakdown (optional section)
// // //   const [instructorCounts, setInstructorCounts] = useState({
// // //     pending: 0,
// // //     approved: 0,
// // //     rejected: 0,
// // //     active: 0,
// // //     inactive: 0,
// // //   });

// // //   // message counters for the Unread Messages quick card
// // //   const [msgTotal, setMsgTotal] = useState(0);
// // //   const [msgUnread, setMsgUnread] = useState(0);

// // //   /* ---------------- Auth ---------------- */
// // //   useEffect(() => {
// // //     const token = localStorage.getItem("token");
// // //     if (!token) return navigate("/my-account");
// // //     try {
// // //       const decoded = jwtDecode(token);
// // //       setUserId(decoded.id);
// // //     } catch {
// // //       navigate("/my-account");
// // //     }
// // //   }, [navigate]);

// // //   /* ---------------- Dashboard counts (resilient) ---------------- */
// // //   useEffect(() => {
// // //     const fetchCounts = async () => {
// // //       // Helper to robustly extract a count number from different API shapes
// // //       const pickCount = (data) => {
// // //         if (data == null) return 0;
// // //         if (typeof data === "number") return coerceNumber(data, 0);
// // //         if (Array.isArray(data)) return data.length;
// // //         if (typeof data === "object") {
// // //           if (typeof data.total !== "undefined")
// // //             return coerceNumber(data.total, 0);
// // //           if (typeof data.count !== "undefined")
// // //             return coerceNumber(data.count, 0);
// // //           if (data.data) {
// // //             if (typeof data.data.total !== "undefined")
// // //               return coerceNumber(data.data.total, 0);
// // //             if (typeof data.data.count !== "undefined")
// // //               return coerceNumber(data.data.count, 0);
// // //             if (Array.isArray(data.data)) return data.data.length || 0;
// // //           }
// // //         }
// // //         return 0;
// // //       };

// // //       // Fallback attempts to get Activities count if /api/dashboard-counts doesn't include it
// // //       const tryActivitiesCount = async () => {
// // //         const candidates = [
// // //           `${globalBackendRoute}/api/activities/count`,
// // //           `${globalBackendRoute}/api/activities/get-activities-count`,
// // //           `${globalBackendRoute}/api/activities/total`,
// // //           `${globalBackendRoute}/api/activities`, // list endpoint -> length
// // //           `${globalBackendRoute}/api/all-activities`,
// // //           `${globalBackendRoute}/api/activities/list`,
// // //         ];
// // //         for (const url of candidates) {
// // //           try {
// // //             const res = await axios.get(url);
// // //             const n = pickCount(res?.data);
// // //             if (Number.isFinite(n) && n >= 0) return n;
// // //           } catch (_) {
// // //             /* keep trying */
// // //           }
// // //         }
// // //         return 0;
// // //       };

// // //       try {
// // //         const res = await axios.get(
// // //           `${globalBackendRoute}/api/dashboard-counts`
// // //         );
// // //         const payload = res.data || {};
// // //         const coerced = Object.fromEntries(
// // //           Object.entries(payload).map(([k, v]) => [k, coerceNumber(v, 0)])
// // //         );

// // //         // Start with defaults, then overlay server values
// // //         let out = { ...DEFAULT_COUNT_KEYS, ...coerced };

// // //         // If activities is missing or NaN, attempt fallback strategy
// // //         if (!Number.isFinite(out.activities) || (out.activities ?? 0) < 0) {
// // //           const aCount = await tryActivitiesCount();
// // //           out.activities = coerceNumber(aCount, 0);
// // //         }

// // //         setCounts(out);
// // //       } catch (err) {
// // //         console.error("Failed to fetch dashboard counts", err);

// // //         // Worst case: show defaults, but still try to find activities count so the card has data
// // //         const aCount = await (async () => {
// // //           try {
// // //             return await tryActivitiesCount();
// // //           } catch {
// // //             return 0;
// // //           }
// // //         })();

// // //         setCounts({
// // //           ...DEFAULT_COUNT_KEYS,
// // //           activities: coerceNumber(aCount, 0),
// // //         });
// // //       }
// // //     };

// // //     fetchCounts();
// // //   }, []);

// // //   /* ---------------- Instructor counts (optional) ---------------- */
// // //   useEffect(() => {
// // //     const fetchInstructorCounts = async () => {
// // //       try {
// // //         const res = await axios.get(
// // //           `${globalBackendRoute}/api/instructors/counts`
// // //         );
// // //         if (res.data?.success && res.data?.data) {
// // //           const d = res.data.data;
// // //           setInstructorCounts({
// // //             pending: coerceNumber(d.pending, 0),
// // //             approved: coerceNumber(d.approved, 0),
// // //             rejected: coerceNumber(d.rejected, 0),
// // //             active: coerceNumber(d.active, 0),
// // //             inactive: coerceNumber(d.inactive, 0),
// // //           });
// // //         } else {
// // //           setInstructorCounts({
// // //             pending: 0,
// // //             approved: 0,
// // //             rejected: 0,
// // //             active: 0,
// // //             inactive: 0,
// // //           });
// // //         }
// // //       } catch (err) {
// // //         console.error("Failed to fetch instructor counts", err);
// // //         setInstructorCounts({
// // //           pending: 0,
// // //           approved: 0,
// // //           rejected: 0,
// // //           active: 0,
// // //           inactive: 0,
// // //         });
// // //       }
// // //     };
// // //     fetchInstructorCounts();
// // //   }, []);

// // //   /* ---------------- Messages quick counters (unread + total) ---------------- */
// // //   useEffect(() => {
// // //     let timer;
// // //     const fetchContactCounts = async () => {
// // //       try {
// // //         // Unread
// // //         const unreadRes = await axios.get(
// // //           `${globalBackendRoute}/api/messages/unread-count`
// // //         );
// // //         const unread =
// // //           coerceNumber(unreadRes.data?.unreadCount, 0) ??
// // //           coerceNumber(unreadRes.data?.count, 0) ??
// // //           coerceNumber(unreadRes.data?.data?.unread, 0);
// // //         setMsgUnread(unread);

// // //         // Total (with robust fallbacks)
// // //         let total = 0;
// // //         try {
// // //           const totalRes = await axios.get(
// // //             `${globalBackendRoute}/api/messages/get-messages-count`
// // //           );
// // //           if (typeof totalRes.data === "object" && totalRes.data) {
// // //             if (typeof totalRes.data.total !== "undefined")
// // //               total = coerceNumber(totalRes.data.total, 0);
// // //             else if (typeof totalRes.data.count !== "undefined")
// // //               total = coerceNumber(totalRes.data.count, 0);
// // //             else if (
// // //               totalRes.data.data &&
// // //               typeof totalRes.data.data.total !== "undefined"
// // //             )
// // //               total = coerceNumber(totalRes.data.data.total, 0);
// // //             else total = 0;
// // //           }
// // //         } catch {
// // //           try {
// // //             const allRes = await axios.get(
// // //               `${globalBackendRoute}/api/all-messages`
// // //             );
// // //             const arr = Array.isArray(allRes.data)
// // //               ? allRes.data
// // //               : allRes.data?.data || [];
// // //             total = arr.length || 0;
// // //           } catch {
// // //             total = 0;
// // //           }
// // //         }
// // //         setMsgTotal(total);
// // //       } catch (err) {
// // //         console.error("Failed to fetch contact message counts", err);
// // //         setMsgUnread(0);
// // //         setMsgTotal(0);
// // //       }
// // //     };

// // //     fetchContactCounts();
// // //     timer = setInterval(fetchContactCounts, 30000);
// // //     const onVis = () =>
// // //       document.visibilityState === "visible" && fetchContactCounts();
// // //     document.addEventListener("visibilitychange", onVis);
// // //     return () => {
// // //       clearInterval(timer);
// // //       document.removeEventListener("visibilitychange", onVis);
// // //     };
// // //   }, []);

// // //   /* ---------------- Cards from counts (never drop zeros) ---------------- */
// // //   const baseCards = useMemo(
// // //     () =>
// // //       Object.entries(counts).map(([key, value]) => {
// // //         const title = key
// // //           .replace(/_/g, " ")
// // //           .replace(/\b\w/g, (c) => c.toUpperCase());
// // //         return {
// // //           key,
// // //           title,
// // //           value: coerceNumber(value, 0),
// // //           link: `/all-${key}`, // e.g. /all-activities
// // //           icon: iconMap[key] || <FaBoxOpen className="text-indigo-600" />,
// // //           bgColor: colorForKey(key),
// // //         };
// // //       }),
// // //     [counts]
// // //   );

// // //   /* ---------------- Instructor breakdown (optional add-ons) ---------------- */
// // //   const instructorBreakdownCards = useMemo(() => {
// // //     const d = instructorCounts || {};
// // //     return [
// // //       {
// // //         key: "instructors_pending",
// // //         title: "Instructor Applicants (Pending)",
// // //         value: coerceNumber(d.pending, 0),
// // //         link: `/all-instructors-applications?status=pending`,
// // //         icon: <FaUserClock className="text-yellow-600" />,
// // //         bgColor: "bg-yellow-50",
// // //       },
// // //       {
// // //         key: "instructors_approved",
// // //         title: "Instructors (Approved)",
// // //         value: coerceNumber(d.approved, 0),
// // //         link: `/all-instructors-applications?status=approved`,
// // //         icon: <FaUserCheck className="text-green-600" />,
// // //         bgColor: "bg-green-50",
// // //       },
// // //       {
// // //         key: "instructors_rejected",
// // //         title: "Instructors (Rejected)",
// // //         value: coerceNumber(d.rejected, 0),
// // //         link: `/all-instructors-applications?status=rejected`,
// // //         icon: <FaUserTimes className="text-red-600" />,
// // //         bgColor: "bg-rose-50",
// // //       },
// // //     ];
// // //   }, [instructorCounts]);

// // //   /* ---------------- Unread Messages quick card (with red dot) ---------------- */
// // //   const unreadQuickCard = useMemo(
// // //     () => ({
// // //       key: "unread_messages", // distinct from "contacts" in baseCards
// // //       title: "Unread Messages", // renamed
// // //       value: coerceNumber(msgUnread, 0), // show UNREAD as the card value
// // //       link: "/all-messages",
// // //       icon: <FaEnvelope className="text-emerald-600" />,
// // //       bgColor: "bg-emerald-50",
// // //     }),
// // //     [msgUnread]
// // //   );

// // //   // Compose all cards; avoid duplicates via "first wins" rule
// // //   const allCards = useMemo(() => {
// // //     const ordered = [
// // //       unreadQuickCard, // shows unread count + red dot
// // //       ...baseCards, // includes "Contacts" (total messages) from counts
// // //       ...instructorBreakdownCards,
// // //     ];
// // //     const byKey = {};
// // //     for (const c of ordered) if (c && !byKey[c.key]) byKey[c.key] = c;
// // //     return Object.values(byKey);
// // //   }, [unreadQuickCard, baseCards, instructorBreakdownCards]);

// // //   // Search
// // //   const filteredCards =
// // //     search.trim() === ""
// // //       ? allCards
// // //       : allCards.filter((card) => {
// // //           const text = `${card.title} ${card.value}`.toLowerCase();
// // //           const queryWords = search
// // //             .toLowerCase()
// // //             .split(/\s+/)
// // //             .filter((word) => word && !stopwords.includes(word));
// // //           return queryWords.some(
// // //             (word) =>
// // //               text.includes(word) || text.includes(word.replace(/s$/, ""))
// // //           );
// // //         });

// // //   return (
// // //     <div className="fullWidth py-6">
// // //       <div className="containerWidth">
// // //         {/* Header */}
// // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap mb-6 gap-4">
// // //           <h1 className="headingText">Superadmin Dashboard</h1>
// // //           <div className="flex items-center flex-wrap gap-3">
// // //             <FaThList
// // //               className={`text-xl cursor-pointer ${
// // //                 view === "list" ? "text-indigo-600" : "text-gray-600"
// // //               }`}
// // //               onClick={() => setView("list")}
// // //             />
// // //             <FaThLarge
// // //               className={`text-xl cursor-pointer ${
// // //                 view === "card" ? "text-indigo-600" : "text-gray-600"
// // //               }`}
// // //               onClick={() => setView("card")}
// // //             />
// // //             <FaTh
// // //               className={`text-xl cursor-pointer ${
// // //                 view === "grid" ? "text-indigo-600" : "text-gray-600"
// // //               }`}
// // //               onClick={() => setView("grid")}
// // //             />
// // //             <SearchBar
// // //               value={search}
// // //               onChange={(e) => setSearch(e.target.value)}
// // //               placeholder="Search cards..."
// // //             />
// // //           </div>
// // //         </div>

// // //         {/* Layout */}
// // //         <DashboardLayout
// // //           left={
// // //             <LeftSidebarNav
// // //               navigate={navigate}
// // //               items={[
// // //                 {
// // //                   label: "Account Settings",
// // //                   icon: <FaCog className="text-indigo-600" />,
// // //                   path: `/profile/${userId}`,
// // //                 },

// // //                 {
// // //                   label: "Add Blog",
// // //                   icon: <FaPlus className="text-red-600" />,
// // //                   path: "/add-blog",
// // //                 },
// // //                 {
// // //                   label: "Add Category",
// // //                   icon: <FaPlus className="text-orange-400" />,
// // //                   path: "/add-category",
// // //                 },
// // //                 {
// // //                   label: "Add Sub Category",
// // //                   icon: <FaPlus className="text-orange-600" />,
// // //                   path: "/add-sub-category",
// // //                 },
// // //                 {
// // //                   label: "Add Degree",
// // //                   icon: <FaBoxOpen className="text-green-600" />,
// // //                   path: "/create-degree",
// // //                 },
// // //                 {
// // //                   label: "Add Semesters",
// // //                   icon: <FaPlus className="text-orange-600" />,
// // //                   path: "/create-semester",
// // //                 }, // route name kept to your existing
// // //                 {
// // //                   label: "Create Course",
// // //                   icon: <FaPlus className="text-green-400" />,
// // //                   path: "/create-course",
// // //                 },
// // //                 {
// // //                   label: "Create Exam",
// // //                   icon: <FaPlus className="text-green-600" />,
// // //                   path: "/create-exam",
// // //                 },
// // //                 {
// // //                   label: "Create Student",
// // //                   icon: <FaPlus className="text-green-600" />,
// // //                   path: "/student-register",
// // //                 },
// // //                 {
// // //                   label: "Create Quiz",
// // //                   icon: <FaPlus className="text-green-600" />,
// // //                   path: "/create-quiz",
// // //                 },
// // //                 {
// // //                   label: "Create Question",
// // //                   icon: <FaPlus className="text-fuchsia-600" />,
// // //                   path: "/create-question",
// // //                 },
// // //                 {
// // //                   label: "Create Notification",
// // //                   icon: <FaPlus className="text-purple-500" />,
// // //                   path: "/create-notification",
// // //                 },
// // //                 {
// // //                   label: "Create Activity",
// // //                   icon: <FaPlus className="text-purple-800" />,
// // //                   path: "/create-activity",
// // //                 },
// // //                 {
// // //                   label: "Create Admission",
// // //                   icon: <FaPlus className="text-indigo-600" />,
// // //                   path: "/create-admission",
// // //                 },

// // //                 {
// // //                   label: "Create Attendance",
// // //                   icon: <FaPlus className="text-purple-800" />,
// // //                   path: "/create-attendance",
// // //                 },
// // //               ]}
// // //             />
// // //           }
// // //           right={
// // //             <div
// // //               className={`${
// // //                 view === "grid"
// // //                   ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
// // //                   : view === "card"
// // //                   ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
// // //                   : "space-y-4"
// // //               }`}
// // //             >
// // //               {filteredCards.map((card) => {
// // //                 const cardEl = (
// // //                   <DashboardCard
// // //                     key={card.key}
// // //                     card={card}
// // //                     view={view}
// // //                     onClick={() => navigate(card.link)}
// // //                   />
// // //                 );

// // //                 // Red dot for unread messages
// // //                 if (
// // //                   card.key === "unread_messages" &&
// // //                   coerceNumber(card.value, 0) > 0
// // //                 ) {
// // //                   return (
// // //                     <div
// // //                       key={card.key}
// // //                       className="relative"
// // //                       onClick={() => navigate(card.link)}
// // //                     >
// // //                       {cardEl}
// // //                       <span
// // //                         title={`${card.value} unread`}
// // //                         className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 ring-2 ring-white"
// // //                       />
// // //                     </div>
// // //                   );
// // //                 }
// // //                 return cardEl;
// // //               })}
// // //             </div>
// // //           }
// // //         />
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default SuperadminDashboard;

// // // // till here original code.

// // //

// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import globalBackendRoute from "@/config/Config.js";

// import DashboardLayout from "../../components/common_components/DashboardLayout";
// import DashboardCard from "../../components/common_components/DashboardCard";

// import SuperadminToolbar from "../../components/superadmin_components/SuperadminToolbar";
// import SuperadminSidebar from "../../components/superadmin_components/SuperadminSidebar";
// import SuperadminCards from "../../components/superadmin_components/SuperadminCards";
// import PaginationLite from "../../components/common_components/PaginationLite";

// import {
//   buildIcon,
//   DEFAULT_COUNT_KEYS,
//   coerceNumber,
// } from "../../components/superadmin_components/dashboardIcons";
// import stopwords from "../../components/common_components/stopwords.jsx";

// const SuperadminDashboard = () => {
//   const navigate = useNavigate();

//   // auth
//   const [userId, setUserId] = useState(null);
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return navigate("/my-account");
//     try {
//       const decoded = jwtDecode(token);
//       setUserId(decoded.id);
//     } catch (err) {
//       navigate("/my-account");
//     }
//   }, [navigate]);

//   // data state
//   const [counts, setCounts] = useState(DEFAULT_COUNT_KEYS);
//   const [instructorCounts, setInstructorCounts] = useState({
//     pending: 0,
//     approved: 0,
//     rejected: 0,
//     active: 0,
//     inactive: 0,
//   });
//   const [msgUnread, setMsgUnread] = useState(0);

//   // UI state
//   const [view, setView] = useState("grid"); // grid | card | list
//   const [search, setSearch] = useState("");
//   const [rowsPerPage, setRowsPerPage] = useState(15);
//   const [sortBy, setSortBy] = useState("title_asc"); // title_asc | title_desc | count_asc | count_desc
//   const [page, setPage] = useState(1);

//   const [navFilter, setNavFilter] = useState(""); // sidebar input

//   // Fetch counts (resilient)
//   useEffect(() => {
//     const pickCount = (data) => {
//       if (data == null) return 0;
//       if (typeof data === "number") return coerceNumber(data, 0);
//       if (Array.isArray(data)) return data.length;
//       if (typeof data === "object") {
//         if (data.total !== undefined) return coerceNumber(data.total, 0);
//         if (data.count !== undefined) return coerceNumber(data.count, 0);
//         if (data.data) {
//           if (data.data.total !== undefined)
//             return coerceNumber(data.data.total, 0);
//           if (data.data.count !== undefined)
//             return coerceNumber(data.data.count, 0);
//           if (Array.isArray(data.data)) return data.data.length || 0;
//         }
//       }
//       return 0;
//     };

//     const tryActivitiesCount = async () => {
//       const urls = [
//         `${globalBackendRoute}/api/activities/count`,
//         `${globalBackendRoute}/api/activities/get-activities-count`,
//         `${globalBackendRoute}/api/activities/total`,
//         `${globalBackendRoute}/api/activities`,
//         `${globalBackendRoute}/api/all-activities`,
//         `${globalBackendRoute}/api/activities/list`,
//       ];
//       for (const u of urls) {
//         try {
//           const r = await axios.get(u);
//           const n = pickCount(r?.data);
//           if (Number.isFinite(n) && n >= 0) return n;
//         } catch (e) {}
//       }
//       return 0;
//     };

//     const load = async () => {
//       try {
//         const res = await axios.get(
//           `${globalBackendRoute}/api/dashboard-counts`
//         );
//         const raw = res.data || {};
//         const coerced = Object.fromEntries(
//           Object.entries(raw).map(([k, v]) => [k, coerceNumber(v, 0)])
//         );
//         let out = { ...DEFAULT_COUNT_KEYS, ...coerced };
//         if (!Number.isFinite(out.activities) || (out.activities ?? 0) < 0) {
//           out.activities = await tryActivitiesCount();
//         }
//         setCounts(out);
//       } catch (err) {
//         let a = 0;
//         try {
//           const r = await axios.get(
//             `${globalBackendRoute}/api/activities/count`
//           );
//           a = pickCount(r?.data);
//         } catch (e) {}
//         setCounts({ ...DEFAULT_COUNT_KEYS, activities: a });
//       }
//     };
//     load();
//   }, []);

//   // Instructor breakdown
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const r = await axios.get(
//           `${globalBackendRoute}/api/instructors/counts`
//         );
//         const d = r?.data?.data || {};
//         setInstructorCounts({
//           pending: coerceNumber(d.pending, 0),
//           approved: coerceNumber(d.approved, 0),
//           rejected: coerceNumber(d.rejected, 0),
//           active: coerceNumber(d.active, 0),
//           inactive: coerceNumber(d.inactive, 0),
//         });
//       } catch (err) {}
//     };
//     load();
//   }, []);

//   // Messages (unread)
//   useEffect(() => {
//     let t;
//     const load = async () => {
//       try {
//         const r = await axios.get(
//           `${globalBackendRoute}/api/messages/unread-count`
//         );
//         const unread =
//           coerceNumber(r.data?.unreadCount, 0) ??
//           coerceNumber(r.data?.count, 0) ??
//           coerceNumber(r.data?.data?.unread, 0);
//         setMsgUnread(unread);
//       } catch (err) {}
//     };
//     load();
//     t = setInterval(load, 30000);
//     const onVis = () => document.visibilityState === "visible" && load();
//     document.addEventListener("visibilitychange", onVis);
//     return () => {
//       clearInterval(t);
//       document.removeEventListener("visibilitychange", onVis);
//     };
//   }, []);

//   // Compose cards (consistent icons & subtle tones)
//   const baseCards = useMemo(() => {
//     return Object.entries(counts).map(([key, value]) => {
//       const title = key
//         .replace(/_/g, " ")
//         .replace(/\b\w/g, (c) => c.toUpperCase());
//       return {
//         key,
//         title,
//         value: coerceNumber(value, 0),
//         link: `/all-${key}`,
//         icon: buildIcon(key),
//       };
//     });
//   }, [counts]);

//   const breakdownCards = useMemo(
//     () => [
//       {
//         key: "instructors_pending",
//         title: "Instructor Applicants (Pending)",
//         value: coerceNumber(instructorCounts.pending, 0),
//         link: "/all-instructors-applications?status=pending",
//         icon: buildIcon("instructors_pending"),
//       },
//       {
//         key: "instructors_approved",
//         title: "Instructors (Approved)",
//         value: coerceNumber(instructorCounts.approved, 0),
//         link: "/all-instructors-applications?status=approved",
//         icon: buildIcon("instructors_approved"),
//       },
//       {
//         key: "instructors_rejected",
//         title: "Instructors (Rejected)",
//         value: coerceNumber(instructorCounts.rejected, 0),
//         link: "/all-instructors-applications?status=rejected",
//         icon: buildIcon("instructors_rejected"),
//       },
//     ],
//     [instructorCounts]
//   );

//   const unreadCard = useMemo(
//     () => ({
//       key: "unread_messages",
//       title: "Unread Messages",
//       value: coerceNumber(msgUnread, 0),
//       link: "/all-messages",
//       icon: buildIcon("unread_messages"),
//     }),
//     [msgUnread]
//   );

//   const allCards = useMemo(() => {
//     const ordered = [unreadCard, ...baseCards, ...breakdownCards];
//     const seen = {};
//     return ordered.filter((c) => {
//       if (!c) return false;
//       if (seen[c.key]) return false;
//       seen[c.key] = true;
//       return true;
//     });
//   }, [unreadCard, baseCards, breakdownCards]);

//   // Search + sort + pagination
//   const searched = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return allCards;
//     const words = q.split(/\s+/).filter((w) => w && !stopwords.includes(w));
//     return allCards.filter((c) => {
//       const hay = `${c.title} ${c.value}`.toLowerCase();
//       return words.some(
//         (w) => hay.includes(w) || hay.includes(w.replace(/s$/, ""))
//       );
//     });
//   }, [allCards, search]);

//   const sorted = useMemo(() => {
//     const list = [...searched];
//     switch (sortBy) {
//       case "title_desc":
//         list.sort((a, b) => String(b.title).localeCompare(String(a.title)));
//         break;
//       case "count_asc":
//         list.sort((a, b) => (a.value || 0) - (b.value || 0));
//         break;
//       case "count_desc":
//         list.sort((a, b) => (b.value || 0) - (a.value || 0));
//         break;
//       case "title_asc":
//       default:
//         list.sort((a, b) => String(a.title).localeCompare(String(b.title)));
//         break;
//     }
//     return list;
//   }, [searched, sortBy]);

//   useEffect(() => setPage(1), [search, sortBy, rowsPerPage]);

//   const total = sorted.length;
//   const totalPages = Math.max(1, Math.ceil(total / Math.max(1, rowsPerPage)));
//   const currentPage = Math.min(page, totalPages);
//   const start = (currentPage - 1) * rowsPerPage;
//   const end = Math.min(start + rowsPerPage, total);
//   const visible = sorted.slice(start, end);

//   const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));
//   const buildPages = () => {
//     const pages = [];
//     const maxBtns = 7;
//     if (totalPages <= maxBtns) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//       return pages;
//     }
//     pages.push(1);
//     if (currentPage > 4) pages.push("…");
//     const s = Math.max(2, currentPage - 1);
//     const e = Math.min(totalPages - 1, currentPage + 1);
//     for (let i = s; i <= e; i++) pages.push(i);
//     if (currentPage < totalPages - 3) pages.push("…");
//     pages.push(totalPages);
//     return pages;
//   };

//   // sidebar nav items (original, with improved icons)
//   const sidebarItems = [
//     { label: "Add Blog", path: "/add-blog", iconKey: "add_blog" },
//     { label: "Add Category", path: "/add-category", iconKey: "add_category" },
//     {
//       label: "Add Sub Category",
//       path: "/add-sub-category",
//       iconKey: "add_subcategory",
//     },
//     { label: "Add Degree", path: "/create-degree", iconKey: "degree" },
//     {
//       label: "Add Semesters",
//       path: "/create-semester",
//       iconKey: "semester_add",
//     },
//     { label: "Create Course", path: "/create-course", iconKey: "course_add" },
//     { label: "Create Exam", path: "/create-exam", iconKey: "exam_add" },
//     {
//       label: "Create Student",
//       path: "/student-register",
//       iconKey: "student_add",
//     },
//     { label: "Create Quiz", path: "/create-quiz", iconKey: "quiz_add" },
//     {
//       label: "Create Question",
//       path: "/create-question",
//       iconKey: "question_add",
//     },
//     {
//       label: "Create Notification",
//       path: "/create-notification",
//       iconKey: "notification_add",
//     },
//     {
//       label: "Create Activity",
//       path: "/create-activity",
//       iconKey: "activity_add",
//     },
//     {
//       label: "Create Admission",
//       path: "/create-admission",
//       iconKey: "admission_add",
//     },
//     {
//       label: "Create Attendance",
//       path: "/create-attendance",
//       iconKey: "attendance_add",
//     },
//   ].map((it) => ({ ...it, icon: buildIcon(it.iconKey) }));

//   return (
//     <div className="fullWidth py-6">
//       <div className="containerWidth">
//         <SuperadminToolbar
//           view={view}
//           setView={setView}
//           search={search}
//           setSearch={setSearch}
//           rowsPerPage={rowsPerPage}
//           setRowsPerPage={setRowsPerPage}
//           sortBy={sortBy}
//           setSortBy={setSortBy}
//           showingCount={visible.length}
//           totalCount={total}
//         />

//         <DashboardLayout
//           left={
//             <SuperadminSidebar
//               items={sidebarItems}
//               navFilter={navFilter}
//               setNavFilter={setNavFilter}
//               navigate={navigate}
//             />
//           }
//           right={
//             <>
//               <SuperadminCards
//                 items={visible}
//                 view={view}
//                 onClick={(link) => navigate(link)}
//                 DashboardCard={DashboardCard}
//               />

//               {totalPages > 1 && (
//                 <PaginationLite
//                   page={currentPage}
//                   totalPages={totalPages}
//                   buildPages={buildPages}
//                   goTo={goTo}
//                 />
//               )}
//             </>
//           }
//         />
//       </div>

//       {/* subtle sidebar scrollbar */}
//       <style>{`
//         .custom-scroll::-webkit-scrollbar { width: 8px; }
//         .custom-scroll::-webkit-scrollbar-thumb { background-color: rgba(99,102,241,.25); border-radius: 9999px; }
//         .custom-scroll::-webkit-scrollbar-track { background-color: rgba(0,0,0,.03); border-radius: 9999px; }
//       `}</style>
//     </div>
//   );
// };

// export default SuperadminDashboard;

// navigation layotu.

//

// src/pages/superadmin_pages/SuperadminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import globalBackendRoute from "@/config/Config.js";

import DashboardCard from "../../components/common_components/DashboardCard";
import SuperadminToolbar from "../../components/superadmin_components/SuperadminToolbar";
import SuperadminSidebar from "../../components/superadmin_components/SuperadminSidebar";
import SuperadminCards from "../../components/superadmin_components/SuperadminCards";
import PaginationLite from "../../components/common_components/PaginationLite";

import {
  buildIcon,
  DEFAULT_COUNT_KEYS,
  coerceNumber,
} from "../../components/superadmin_components/dashboardIcons";
import stopwords from "../../components/common_components/stopwords.jsx";

const SuperadminDashboard = () => {
  const navigate = useNavigate();

  // auth
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/my-account");
    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    } catch {
      navigate("/my-account");
    }
  }, [navigate]);

  // data state
  const [counts, setCounts] = useState(DEFAULT_COUNT_KEYS);
  const [instructorCounts, setInstructorCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    active: 0,
    inactive: 0,
  });
  const [msgUnread, setMsgUnread] = useState(0);

  // UI state
  const [view, setView] = useState("grid"); // grid | card | list
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [sortBy, setSortBy] = useState("title_asc");
  const [page, setPage] = useState(1);
  const [navFilter, setNavFilter] = useState("");

  // Fetch counts (resilient)
  useEffect(() => {
    const pickCount = (data) => {
      if (data == null) return 0;
      if (typeof data === "number") return coerceNumber(data, 0);
      if (Array.isArray(data)) return data.length;
      if (typeof data === "object") {
        if (data.total !== undefined) return coerceNumber(data.total, 0);
        if (data.count !== undefined) return coerceNumber(data.count, 0);
        if (data.data) {
          if (data.data.total !== undefined)
            return coerceNumber(data.data.total, 0);
          if (data.data.count !== undefined)
            return coerceNumber(data.data.count, 0);
          if (Array.isArray(data.data)) return data.data.length || 0;
        }
      }
      return 0;
    };

    const tryActivitiesCount = async () => {
      const urls = [
        `${globalBackendRoute}/api/activities/count`,
        `${globalBackendRoute}/api/activities/get-activities-count`,
        `${globalBackendRoute}/api/activities/total`,
        `${globalBackendRoute}/api/activities`,
        `${globalBackendRoute}/api/all-activities`,
        `${globalBackendRoute}/api/activities/list`,
      ];
      for (const u of urls) {
        try {
          const r = await axios.get(u);
          const n = pickCount(r?.data);
          if (Number.isFinite(n) && n >= 0) return n;
        } catch {}
      }
      return 0;
    };

    const load = async () => {
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/dashboard-counts`
        );
        const raw = res.data || {};
        const coerced = Object.fromEntries(
          Object.entries(raw).map(([k, v]) => [k, coerceNumber(v, 0)])
        );
        let out = { ...DEFAULT_COUNT_KEYS, ...coerced };
        if (!Number.isFinite(out.activities) || (out.activities ?? 0) < 0) {
          out.activities = await tryActivitiesCount();
        }
        setCounts(out);
      } catch {
        let a = 0;
        try {
          const r = await axios.get(
            `${globalBackendRoute}/api/activities/count`
          );
          a = pickCount(r?.data);
        } catch {}
        setCounts({ ...DEFAULT_COUNT_KEYS, activities: a });
      }
    };
    load();
  }, []);

  // Instructor breakdown
  useEffect(() => {
    const load = async () => {
      try {
        const r = await axios.get(
          `${globalBackendRoute}/api/instructors/counts`
        );
        const d = r?.data?.data || {};
        setInstructorCounts({
          pending: coerceNumber(d.pending, 0),
          approved: coerceNumber(d.approved, 0),
          rejected: coerceNumber(d.rejected, 0),
          active: coerceNumber(d.active, 0),
          inactive: coerceNumber(d.inactive, 0),
        });
      } catch {}
    };
    load();
  }, []);

  // Messages (unread)
  useEffect(() => {
    let t;
    const load = async () => {
      try {
        const r = await axios.get(
          `${globalBackendRoute}/api/messages/unread-count`
        );
        const unread =
          coerceNumber(r.data?.unreadCount, 0) ??
          coerceNumber(r.data?.count, 0) ??
          coerceNumber(r.data?.data?.unread, 0);
        setMsgUnread(unread);
      } catch {}
    };
    load();
    t = setInterval(load, 30000);
    const onVis = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Compose cards
  const baseCards = useMemo(
    () =>
      Object.entries(counts).map(([key, value]) => {
        const title = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return {
          key,
          title,
          value: coerceNumber(value, 0),
          link: `/all-${key}`,
          icon: buildIcon(key),
        };
      }),
    [counts]
  );

  const breakdownCards = useMemo(
    () => [
      {
        key: "instructors_pending",
        title: "Instructor Applicants (Pending)",
        value: coerceNumber(instructorCounts.pending, 0),
        link: "/all-instructors-applications?status=pending",
        icon: buildIcon("instructors_pending"),
      },
      {
        key: "instructors_approved",
        title: "Instructors (Approved)",
        value: coerceNumber(instructorCounts.approved, 0),
        link: "/all-instructors-applications?status=approved",
        icon: buildIcon("instructors_approved"),
      },
      {
        key: "instructors_rejected",
        title: "Instructors (Rejected)",
        value: coerceNumber(instructorCounts.rejected, 0),
        link: "/all-instructors-applications?status=rejected",
        icon: buildIcon("instructors_rejected"),
      },
    ],
    [instructorCounts]
  );

  const unreadCard = useMemo(
    () => ({
      key: "unread_messages",
      title: "Unread Messages",
      value: coerceNumber(msgUnread, 0),
      link: "/all-messages",
      icon: buildIcon("unread_messages"),
    }),
    [msgUnread]
  );

  const allCards = useMemo(() => {
    const ordered = [unreadCard, ...baseCards, ...breakdownCards];
    const seen = {};
    return ordered.filter((c) => {
      if (!c) return false;
      if (seen[c.key]) return false;
      seen[c.key] = true;
      return true;
    });
  }, [unreadCard, baseCards, breakdownCards]);

  // Search + sort + pagination
  const searched = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allCards;
    const words = q.split(/\s+/).filter((w) => w && !stopwords.includes(w));
    return allCards.filter((c) => {
      const hay = `${c.title} ${c.value}`.toLowerCase();
      return words.some(
        (w) => hay.includes(w) || hay.includes(w.replace(/s$/, ""))
      );
    });
  }, [allCards, search]);

  const sorted = useMemo(() => {
    const list = [...searched];
    switch (sortBy) {
      case "title_desc":
        list.sort((a, b) => String(b.title).localeCompare(String(a.title)));
        break;
      case "count_asc":
        list.sort((a, b) => (a.value || 0) - (b.value || 0));
        break;
      case "count_desc":
        list.sort((a, b) => (b.value || 0) - (a.value || 0));
        break;
      case "title_asc":
      default:
        list.sort((a, b) => String(a.title).localeCompare(String(b.title)));
        break;
    }
    return list;
  }, [searched, sortBy]);

  useEffect(() => setPage(1), [search, sortBy, rowsPerPage]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, rowsPerPage)));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * rowsPerPage;
  const end = Math.min(start + rowsPerPage, total);
  const visible = sorted.slice(start, end);

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));
  const buildPages = () => {
    const pages = [];
    const maxBtns = 7;
    if (totalPages <= maxBtns) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage > 4) pages.push("…");
    const s = Math.max(2, currentPage - 1);
    const e = Math.min(totalPages - 1, currentPage + 1);
    for (let i = s; i <= e; i++) pages.push(i);
    if (currentPage < totalPages - 3) pages.push("…");
    pages.push(totalPages);
    return pages;
  };

  const sidebarItems = [
    { label: "Add Blog", path: "/add-blog", iconKey: "add_blog" },
    { label: "Add Category", path: "/add-category", iconKey: "add_category" },
    {
      label: "Add Sub Category",
      path: "/add-sub-category",
      iconKey: "add_subcategory",
    },
    { label: "Add Degree", path: "/create-degree", iconKey: "degree" },
    {
      label: "Add Semesters",
      path: "/create-semester",
      iconKey: "semester_add",
    },
    { label: "Create Course", path: "/create-course", iconKey: "course_add" },
    { label: "Create Exam", path: "/create-exam", iconKey: "exam_add" },
    {
      label: "Create Student",
      path: "/student-register",
      iconKey: "student_add",
    },
    { label: "Create Quiz", path: "/create-quiz", iconKey: "quiz_add" },
    {
      label: "Create Question",
      path: "/create-question",
      iconKey: "question_add",
    },
    {
      label: "Create Notification",
      path: "/create-notification",
      iconKey: "notification_add",
    },
    {
      label: "Create Activity",
      path: "/create-activity",
      iconKey: "activity_add",
    },
    {
      label: "Create Admission",
      path: "/create-admission",
      iconKey: "admission_add",
    },
    {
      label: "Create Attendance",
      path: "/create-attendance",
      iconKey: "attendance_add",
    },
  ].map((it) => ({ ...it, icon: buildIcon(it.iconKey) }));

  return (
    <div className="fullWidth py-4">
      <div className="containerWidth flex flex-col gap-4 min-h-[calc(100vh-2rem)]">
        {/* 1) Toolbar at top */}
        <SuperadminToolbar
          view={view}
          setView={setView}
          search={search}
          setSearch={setSearch}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showingCount={visible.length}
          totalCount={total}
        />

        {/* 2) Sidebar converted to horizontal navigation links */}
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <SuperadminSidebar
            items={sidebarItems}
            navFilter={navFilter}
            setNavFilter={setNavFilter}
            navigate={navigate}
            variant="row"
          />
        </div>

        {/* 3) Cards section */}
        <div className="min-h-0">
          <SuperadminCards
            items={visible}
            view={view}
            onClick={(link) => navigate(link)}
            DashboardCard={DashboardCard}
          />
        </div>

        {/* 4) Pagination (navigation) */}
        {totalPages > 1 && (
          <div className="pt-1">
            <PaginationLite
              page={currentPage}
              totalPages={totalPages}
              buildPages={buildPages}
              goTo={goTo}
            />
          </div>
        )}
      </div>

      {/* consistent custom scrollbars */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { height: 8px; width: 8px; }
        .custom-scroll::-webkit-scrollbar-thumb { background-color: rgba(99,102,241,.25); border-radius: 9999px; }
        .custom-scroll::-webkit-scrollbar-track { background-color: rgba(0,0,0,.03); border-radius: 9999px; }
      `}</style>
    </div>
  );
};

export default SuperadminDashboard;
