// // src/pages/users/AllUsers.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import {
//   FaThList,
//   FaThLarge,
//   FaTh,
//   FaSearch,
//   FaUserCircle,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import globalBackendRoute from "../../config/Config";

// // Stop-words to ignore inside the query
// const STOP_WORDS = new Set([
//   "a",
//   "an",
//   "the",
//   "and",
//   "or",
//   "of",
//   "in",
//   "on",
//   "at",
//   "to",
//   "for",
//   "with",
//   "by",
//   "from",
//   "is",
//   "are",
//   "was",
//   "were",
//   "be",
//   "been",
//   "being",
//   "i",
//   "you",
//   "he",
//   "she",
//   "it",
//   "we",
//   "they",
//   "me",
//   "him",
//   "her",
//   "us",
//   "them",
//   "this",
//   "that",
//   "these",
//   "those",
//   "there",
//   "here",
//   "please",
//   "pls",
//   "plz",
//   "show",
//   "find",
//   "search",
//   "look",
//   "list",
//   "user",
//   "users",
//   "role",
//   "named",
//   "called",
// ]);

// // Normalize strings for matching (lowercase + strip accents/diacritics)
// const norm = (s = "") =>
//   String(s)
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, ""); // remove diacritics

// // Tokenize the query; trim outer spaces, split by whitespace, drop stop-words
// const tokenize = (raw) => {
//   const trimmed = String(raw || "").trim(); // remove front/back spaces
//   if (!trimmed) return [];
//   return trimmed
//     .split(/\s+/) // split on any whitespace block
//     .map(norm)
//     .filter(Boolean)
//     .filter((t) => !STOP_WORDS.has(t)); // drop stop-words
// };

// export default function AllUsers() {
//   const [users, setUsers] = useState([]);
//   const [view, setView] = useState("grid"); // "grid" | "card" | "list"
//   const [searchQuery, setSearchQuery] = useState(""); // raw input (kept as typed)
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get(`${globalBackendRoute}/api/all-users`)
//       .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
//       .catch((err) => {
//         console.error("Error fetching users:", err);
//         setUsers([]);
//       });
//   }, []);

//   const getImageUrl = (avatar) => {
//     if (avatar) {
//       const normalized = String(avatar)
//         .replace(/\\/g, "/")
//         .split("uploads/")
//         .pop();
//       return `${globalBackendRoute}/uploads/${normalized}`;
//     }
//     return null;
//   };

//   const handleUserClick = (id) => navigate(`/single-user/${id}`);

//   // Build a filtered list using a TRIMMED, tokenized query
//   const filteredUsers = useMemo(() => {
//     const tokens = tokenize(searchQuery); // uses TRIMMED copy internally
//     if (!tokens.length) return users; // empty or all-stop-words => show all

//     return users.filter((u) => {
//       // Build a searchable haystack across attributes
//       const hay = norm(
//         [u?.name || "", u?.email || "", u?.role || ""].join(" ")
//       );

//       // Match if ANY token occurs in ANY attribute (OR across tokens)
//       return tokens.some((t) => hay.includes(t));
//     });
//   }, [users, searchQuery]);

//   const UserCard = ({ user }) => {
//     const imgUrl = getImageUrl(user?.avatar);

//     return (
//       <div
//         onClick={() => handleUserClick(user?._id)}
//         className="cursor-pointer flex flex-col items-start relative hover:shadow-lg transition border rounded-lg p-2"
//       >
//         {imgUrl ? (
//           <img
//             src={imgUrl}
//             alt={user?.name}
//             className="w-full h-48 object-cover rounded-lg"
//           />
//         ) : (
//           <div className="w-full h-48 flex items-center justify-center bg-slate-100 rounded-lg">
//             <FaUserCircle className="text-slate-400 text-6xl" />
//           </div>
//         )}
//         <h3 className="mt-2 text-md font-semibold text-gray-900">
//           {user?.name}
//         </h3>
//         <p className="text-sm text-gray-600">{user?.email}</p>
//         <p className="text-sm text-gray-600">{user?.role}</p>
//       </div>
//     );
//   };

//   return (
//     <div className="bg-white py-10 sm:py-16">
//       <div className="mx-auto container px-6 lg:px-8">
//         {/* Header / Controls */}
//         <div className="flex justify-between items-center flex-wrap gap-4">
//           <h2 className="text-3xl font-bold text-gray-900">All Users</h2>
//           <div className="flex items-center space-x-4">
//             <FaThList
//               className={`text-xl cursor-pointer ${
//                 view === "list" ? "text-indigo-600" : "text-gray-500"
//               }`}
//               onClick={() => setView("list")}
//               title="List view"
//             />
//             <FaThLarge
//               className={`text-xl cursor-pointer ${
//                 view === "card" ? "text-indigo-600" : "text-gray-500"
//               }`}
//               onClick={() => setView("card")}
//               title="Card view"
//             />
//             <FaTh
//               className={`text-xl cursor-pointer ${
//                 view === "grid" ? "text-indigo-600" : "text-gray-500"
//               }`}
//               onClick={() => setView("grid")}
//               title="Grid view"
//             />

//             {/* Search (keeps raw input; matching uses a TRIMMED copy internally) */}
//             <div className="relative">
//               <FaSearch className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search name, email, role…"
//                 className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 spellCheck={false}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="mt-10">
//           {view === "grid" && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//               {filteredUsers.map((user) => (
//                 <UserCard key={user?._id} user={user} />
//               ))}
//               {!filteredUsers.length && (
//                 <div className="col-span-full text-sm text-slate-500">
//                   No users match your search.
//                 </div>
//               )}
//             </div>
//           )}

//           {view === "card" && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredUsers.map((user) => (
//                 <UserCard key={user?._id} user={user} />
//               ))}
//               {!filteredUsers.length && (
//                 <div className="col-span-full text-sm text-slate-500">
//                   No users match your search.
//                 </div>
//               )}
//             </div>
//           )}

//           {view === "list" && (
//             <div className="space-y-4">
//               {filteredUsers.map((user) => (
//                 <div
//                   key={user?._id}
//                   onClick={() => handleUserClick(user?._id)}
//                   className="cursor-pointer flex items-center gap-4 bg-white border rounded-lg p-4 hover:shadow-md"
//                 >
//                   {getImageUrl(user?.avatar) ? (
//                     <img
//                       src={getImageUrl(user?.avatar)}
//                       alt={user?.name}
//                       className="w-24 h-24 object-cover rounded-lg"
//                     />
//                   ) : (
//                     <FaUserCircle className="text-slate-400 text-6xl" />
//                   )}
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       {user?.name}
//                     </h3>
//                     <p className="text-sm text-gray-600">{user?.email}</p>
//                     <p className="text-sm text-gray-600">{user?.role}</p>
//                   </div>
//                 </div>
//               ))}

//               {!filteredUsers.length && (
//                 <div className="text-sm text-slate-500">
//                   No users match your search.
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

//

"use client";

import React, { useEffect, useMemo, useState, memo } from "react";
import axios from "axios";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaSearch,
  FaUserCircle,
  FaArrowLeft,
  FaArrowRight,
  FaUser,
  FaEnvelope,
  FaIdBadge,
  FaSortAmountDownAlt,
  FaSortAmountUpAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";
import blogsBanner from "../../assets/images/profile_banner.jpg";

const MAIN_HEADING_STYLE =
  "text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 text-uppercase tracking-[0.1em]";

const HERO_TAGS = ["USERS", "MEMBERS", "ACCOUNTS", "ROLES", "DIRECTORY"];

const HERO_STYLE = {
  backgroundImage: `url(${blogsBanner})`,
};

// Stop-words to ignore inside the query
const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "of",
  "in",
  "on",
  "at",
  "to",
  "for",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "me",
  "him",
  "her",
  "us",
  "them",
  "this",
  "that",
  "these",
  "those",
  "there",
  "here",
  "please",
  "pls",
  "plz",
  "show",
  "find",
  "search",
  "look",
  "list",
  "user",
  "users",
  "role",
  "named",
  "called",
]);

// Normalize strings for matching (lowercase + strip accents/diacritics)
const norm = (s = "") =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// Tokenize the query; trim outer spaces, split by whitespace, drop stop-words
const tokenize = (raw) => {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return [];
  return trimmed
    .split(/\s+/)
    .map(norm)
    .filter(Boolean)
    .filter((t) => !STOP_WORDS.has(t));
};

function UserThumb({ src, alt, isList }) {
  const [broken, setBroken] = useState(false);

  const commonWrap =
    "overflow-hidden rounded-md flex items-center justify-center bg-slate-50";
  const listSize = "w-24 h-24 flex-shrink-0 mr-4";
  const gridSize = "w-full h-48";
  const iconSize = isList
    ? "w-10 h-10 sm:w-12 sm:h-12"
    : "w-14 h-14 sm:w-16 sm:h-16";

  if (!src || broken) {
    return (
      <div className={`${commonWrap} ${isList ? listSize : gridSize}`}>
        <FaUserCircle className={`text-slate-400 ${iconSize}`} />
      </div>
    );
  }

  return (
    <div className={isList ? listSize : gridSize}>
      <img
        src={src}
        alt={alt || "user"}
        className="w-full h-full object-cover rounded-md"
        onError={() => setBroken(true)}
        loading="lazy"
      />
    </div>
  );
}

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("grid"); // "grid" | "card" | "list"
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setLoading(true);
      setFetchError("");

      try {
        const res = await axios.get(`${globalBackendRoute}/api/all-users`);
        if (isMounted) setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching users:", err);
        if (isMounted) {
          setUsers([]);
          setFetchError("Failed to load users. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const getImageUrl = (avatar) => {
    if (avatar) {
      const normalized = String(avatar)
        .replace(/\\/g, "/")
        .split("uploads/")
        .pop();
      return `${globalBackendRoute}/uploads/${normalized}`;
    }
    return null;
  };

  const handleUserClick = (id) => navigate(`/single-user/${id}`);

  const filteredUsers = useMemo(() => {
    const tokens = tokenize(searchQuery);

    let result = users;

    if (tokens.length) {
      result = users.filter((u) => {
        const hay = norm(
          [u?.name || "", u?.email || "", u?.role || ""].join(" "),
        );
        return tokens.some((t) => hay.includes(t));
      });
    }

    return [...result].sort((a, b) => {
      const aName = norm(a?.name || "");
      const bName = norm(b?.name || "");
      return sortOrder === "asc"
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    });
  }, [users, searchQuery, sortOrder]);

  const getItemsPerPage = () => {
    const width = window.innerWidth;

    if (view === "list") {
      if (width >= 1280) return 8;
      if (width >= 1024) return 6;
      if (width >= 768) return 5;
      return 4;
    }

    if (view === "grid") {
      if (width >= 1280) return 10;
      if (width >= 1024) return 8;
      if (width >= 768) return 6;
      return 4;
    }

    if (width >= 1280) return 12;
    if (width >= 1024) return 8;
    if (width >= 768) return 6;
    return 4;
  };

  const itemsPerPage = getItemsPerPage();
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / itemsPerPage),
  );

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goToPage = (page) => setCurrentPage(page);

  const iconStyle = {
    list: view === "list" ? "text-blue-500" : "text-gray-500",
    grid: view === "grid" ? "text-green-500" : "text-gray-500",
    card: view === "card" ? "text-purple-500" : "text-gray-500",
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder, view]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="service-page-wrap min-h-screen">
      {/* HERO */}
      <section className="service-hero-section" style={HERO_STYLE}>
        <div className="service-hero-overlay-1" />
        <div className="service-hero-overlay-2" />
        <div className="service-hero-overlay-3" />

        <div className="service-hero-container">
          <div className="service-hero-layout">
            <div>
              <div className="service-tag-row">
                {HERO_TAGS.map((item) => (
                  <span key={item} className="service-tag-pill">
                    {item}
                  </span>
                ))}
              </div>

              <h1 className="service-hero-title">
                User{" "}
                <span className="service-hero-title-highlight">
                  directory & accounts
                </span>
              </h1>

              <p className="service-hero-text">
                Browse all registered users, view roles, search members quickly,
                and explore the user directory in grid, card, or list views.
              </p>

              <div className="service-hero-status">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                User management · Profiles · Roles
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                <span>User directory</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-200" />
                <span>Roles · Search · Profiles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* SINGLE ROW */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <h1 className={MAIN_HEADING_STYLE}>All Users</h1>

          <div className="relative flex-1 min-w-[180px] max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Search by name, email, role..."
              className="w-full pl-8 pr-3 py-2 rounded-full border border-gray-300 text-gray-900 text-xs sm:text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <p className="text-[11px] sm:text-xs text-gray-500 whitespace-nowrap">
              Showing {paginatedUsers.length} of {filteredUsers.length} users
            </p>

            <button
              type="button"
              onClick={toggleSortOrder}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 transition"
              title={
                sortOrder === "asc"
                  ? "Currently sorted: A to Z"
                  : "Currently sorted: Z to A"
              }
              aria-label={
                sortOrder === "asc" ? "Sorted A to Z" : "Sorted Z to A"
              }
            >
              {sortOrder === "asc" ? (
                <FaSortAmountDownAlt className="text-indigo-600 text-sm" />
              ) : (
                <FaSortAmountUpAlt className="text-indigo-600 text-sm" />
              )}
            </button>

            <FaThList
              className={`cursor-pointer text-sm ${iconStyle.list}`}
              onClick={() => setView("list")}
              title="List view"
            />
            <FaTh
              className={`cursor-pointer text-sm ${iconStyle.card}`}
              onClick={() => setView("card")}
              title="Compact cards"
            />
            <FaThLarge
              className={`cursor-pointer text-sm ${iconStyle.grid}`}
              onClick={() => setView("grid")}
              title="Grid view"
            />
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <p className="text-center text-gray-600 mt-6">Loading users…</p>
        )}
        {fetchError && !loading && (
          <p className="text-center text-red-600 mt-6">{fetchError}</p>
        )}

        {/* User Cards */}
        {!loading && !fetchError && (
          <>
            <motion.div
              className={`grid gap-6 ${
                view === "list"
                  ? "grid-cols-1"
                  : view === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {paginatedUsers.map((user) => {
                const isList = view === "list";
                const imgUrl = getImageUrl(user?.avatar);

                return (
                  <div
                    key={user?._id}
                    onClick={() => handleUserClick(user?._id)}
                    className="cursor-pointer"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden h-full flex flex-col ${
                        isList ? "sm:flex-row p-4 items-center" : ""
                      }`}
                    >
                      <UserThumb
                        src={imgUrl}
                        alt={user?.name}
                        isList={isList}
                      />

                      <div
                        className={`${
                          isList
                            ? "flex-1 flex flex-col"
                            : "p-4 flex flex-col flex-grow"
                        }`}
                      >
                        <div className="text-left space-y-1 flex-shrink-0">
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                            {user?.name || "Unnamed User"}
                          </h3>

                          {user?.email && (
                            <p className="text-xs text-gray-600 flex items-center">
                              <FaEnvelope className="mr-1 text-yellow-500" />
                              {user.email}
                            </p>
                          )}

                          {user?.role && (
                            <p className="text-xs text-gray-600 flex items-center">
                              <FaIdBadge className="mr-1 text-green-500" />
                              {user.role}
                            </p>
                          )}

                          {!user?.role && (
                            <p className="text-xs text-gray-600 flex items-center">
                              <FaUser className="mr-1 text-red-500" />
                              User
                            </p>
                          )}
                        </div>

                        {view !== "list" && (
                          <p className="text-gray-700 mt-2 text-xs sm:text-sm line-clamp-3 flex-shrink-0">
                            Click to view full user details and profile
                            information.
                          </p>
                        )}

                        <div className="flex-grow" />
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>

            {filteredUsers.length === 0 && (
              <p className="text-center text-gray-600 mt-6">
                No users match your search.
              </p>
            )}

            {/* Pagination */}
            {filteredUsers.length > 0 && (
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-700">
                  Page <span className="font-semibold">{currentPage}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center justify-center min-w-[42px] h-10 px-3 rounded-lg border text-sm font-medium transition ${
                      currentPage === 1
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
                        className="inline-flex items-center justify-center min-w-[42px] h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
                      >
                        1
                      </button>
                      {pageNumbers[0] > 2 && (
                        <span className="px-1 text-slate-400">...</span>
                      )}
                    </>
                  )}

                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => goToPage(page)}
                      className={`inline-flex items-center justify-center min-w-[42px] h-10 px-3 rounded-lg text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {pageNumbers[pageNumbers.length - 1] < totalPages && (
                    <>
                      {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                        <span className="px-1 text-slate-400">...</span>
                      )}
                      <button
                        type="button"
                        onClick={() => goToPage(totalPages)}
                        className="inline-flex items-center justify-center min-w-[42px] h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center justify-center min-w-[42px] h-10 px-3 rounded-lg border text-sm font-medium transition ${
                      currentPage === totalPages
                        ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50"
                    }`}
                    aria-label="Go to next page"
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default memo(AllUsers);
