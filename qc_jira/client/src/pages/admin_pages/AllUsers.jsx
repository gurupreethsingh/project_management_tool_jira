"use client";

import React, { useEffect, useMemo, useState, useCallback, memo } from "react";
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
import profileBanner from "../../assets/images/profile_banner.jpg";

const MAIN_HEADING_STYLE =
  "text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 text-uppercase tracking-[0.1em]";

const HERO_TAGS = ["USERS", "MEMBERS", "ACCOUNTS", "ROLES", "DIRECTORY"];

const HERO_STYLE = {
  backgroundImage: `url(${profileBanner})`,
};

const getImageUrl = (avatar) => {
  if (!avatar) return null;
  const normalized = String(avatar).replace(/\\/g, "/").split("uploads/").pop();
  return normalized ? `${globalBackendRoute}/uploads/${normalized}` : null;
};

const getItemsPerPageFor = (width, view) => {
  if (view === "list") {
    if (width >= 1280) return 10;
    if (width >= 1024) return 8;
    if (width >= 768) return 6;
    return 5;
  }

  if (view === "grid") {
    if (width >= 1280) return 10;
    if (width >= 1024) return 8;
    if (width >= 640) return 6;
    return 4;
  }

  if (width >= 1280) return 12;
  if (width >= 1024) return 9;
  if (width >= 640) return 6;
  return 4;
};

const UserThumb = memo(function UserThumb({ src, alt, isList }) {
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
});

const UserCard = memo(function UserCard({ user, view, onOpen }) {
  const isList = view === "list";
  const imgUrl = getImageUrl(user?.avatar);

  return (
    <div onClick={() => onOpen(user?._id)} className="cursor-pointer h-full">
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden h-full flex flex-col ${
          isList ? "sm:flex-row p-4 items-center" : ""
        }`}
      >
        <UserThumb src={imgUrl} alt={user?.name} isList={isList} />

        <div
          className={`${
            isList ? "flex-1 flex flex-col" : "p-4 flex flex-col flex-grow"
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

            {user?.role ? (
              <p className="text-xs text-gray-600 flex items-center">
                <FaIdBadge className="mr-1 text-green-500" />
                {user.role}
              </p>
            ) : (
              <p className="text-xs text-gray-600 flex items-center">
                <FaUser className="mr-1 text-red-500" />
                User
              </p>
            )}
          </div>

          {view !== "list" && (
            <p className="text-gray-700 mt-2 text-xs sm:text-sm line-clamp-3 flex-shrink-0">
              Click to view full user details and profile information.
            </p>
          )}

          <div className="flex-grow" />
        </div>
      </motion.div>
    </div>
  );
});

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let rafId = null;

    const onResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setViewportWidth(window.innerWidth);
      });
    };

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const itemsPerPage = useMemo(
    () => getItemsPerPageFor(viewportWidth, view),
    [viewportWidth, view],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, sortOrder, view, itemsPerPage]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setLoading(true);
      setFetchError("");

      try {
        const res = await axios.get(`${globalBackendRoute}/api/all-users`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearchQuery,
            sort: sortOrder,
          },
        });

        const payload = res?.data || {};
        const fetchedUsers = Array.isArray(payload.users)
          ? payload.users
          : Array.isArray(payload.data)
            ? payload.data
            : Array.isArray(payload)
              ? payload
              : [];

        const total =
          typeof payload.totalUsers === "number"
            ? payload.totalUsers
            : typeof payload.total === "number"
              ? payload.total
              : fetchedUsers.length;

        if (isMounted) {
          setUsers(fetchedUsers);
          setTotalUsers(total);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        if (isMounted) {
          setUsers([]);
          setTotalUsers(0);
          setFetchError("Failed to load users. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [currentPage, itemsPerPage, debouncedSearchQuery, sortOrder]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalUsers / itemsPerPage)),
    [totalUsers, itemsPerPage],
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleUserClick = useCallback(
    (id) => {
      navigate(`/single-user/${id}`);
    },
    [navigate],
  );

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  }, [totalPages]);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((p) => Math.max(p - 1, 1));
  }, []);

  const goToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  const iconStyle = useMemo(
    () => ({
      list: view === "list" ? "text-blue-500" : "text-gray-500",
      grid: view === "grid" ? "text-green-500" : "text-gray-500",
      card: view === "card" ? "text-purple-500" : "text-gray-500",
    }),
    [view],
  );

  const setListView = useCallback(() => setView("list"), []);
  const setCardView = useCallback(() => setView("card"), []);
  const setGridView = useCallback(() => setView("grid"), []);

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

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <h1 className={MAIN_HEADING_STYLE}>All Users</h1>

          <div className="relative flex-1 min-w-[180px] max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Search by name, email, role..."
              className="w-full pl-8 pr-3 py-2 rounded-full border border-gray-300 text-gray-900 text-xs sm:text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              value={searchQuery}
              onChange={handleSearchChange}
              spellCheck={false}
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <p className="text-[11px] sm:text-xs text-gray-500 whitespace-nowrap">
              Showing {users.length} of {totalUsers} users
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
              onClick={setListView}
              title="List view"
            />
            <FaTh
              className={`cursor-pointer text-sm ${iconStyle.card}`}
              onClick={setCardView}
              title="Compact cards"
            />
            <FaThLarge
              className={`cursor-pointer text-sm ${iconStyle.grid}`}
              onClick={setGridView}
              title="Grid view"
            />
          </div>
        </div>

        {loading && (
          <p className="text-center text-gray-600 mt-6">Loading users…</p>
        )}
        {fetchError && !loading && (
          <p className="text-center text-red-600 mt-6">{fetchError}</p>
        )}

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
              {users.map((user) => (
                <UserCard
                  key={user?._id}
                  user={user}
                  view={view}
                  onOpen={handleUserClick}
                />
              ))}
            </motion.div>

            {totalUsers === 0 && (
              <p className="text-center text-gray-600 mt-6">
                No users match your search.
              </p>
            )}

            {totalUsers > 0 && (
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
