"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import notificationsBanner from "../../assets/images/profile_banner.jpg"; // change if needed

const API = `${globalBackendRoute}/api`;

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
  { key: "seen", label: "Seen" },
  { key: "replied", label: "Replied" },
];

const getNotifId = (n) => String(n?._id || n?.id || "");

export default function UserNotifications() {
  const navigate = useNavigate();
  const [raw, setRaw] = useState([]);
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

  const [seenLocal, setSeenLocal] = useState(() => new Set());
  const seenStorageKey = userId ? `seenNotifs:${userId}` : null;

  const HERO_TAGS = ["NOTIFICATIONS", "USER", "READ", "SEEN", "STATUS"];
  const HERO_STYLE = {
    backgroundImage: `url(${notificationsBanner})`,
  };

  useEffect(() => {
    if (!seenStorageKey) return;
    try {
      const arr = JSON.parse(localStorage.getItem(seenStorageKey) || "[]");
      if (Array.isArray(arr)) setSeenLocal(new Set(arr.map(String)));
    } catch {
      setSeenLocal(new Set());
    }
  }, [seenStorageKey]);

  const markSeenLocal = (id) => {
    if (!seenStorageKey || !id) return;
    setSeenLocal((prev) => {
      const next = new Set(prev);
      next.add(String(id));
      localStorage.setItem(seenStorageKey, JSON.stringify([...next]));
      return next;
    });
  };

  useEffect(() => {
    if (!token || !userId) {
      setLoading(false);
      setErr("Not authenticated.");
      return;
    }

    setLoading(true);
    setErr("");

    axios
      .get(`${API}/get-user-notifications/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRaw(Array.isArray(res.data) ? res.data : []))
      .catch((e) => {
        console.error("get-user-notifications error:", e?.response || e);
        setErr(
          e?.response?.data?.message ||
            "Failed to load notifications. Check server routes and auth.",
        );
      })
      .finally(() => setLoading(false));
  }, [token, userId]);

  const normalized = useMemo(
    () =>
      raw.map((n) => {
        const status = (
          n?.receipt?.status ||
          n?.statusForUser ||
          (n?.isRead ? "read" : "unread")
        )?.toLowerCase();

        return {
          ...n,
          _status: status,
          _hidden: n?.receipt?.isDeleted === true,
        };
      }),
    [raw],
  );

  const filtered = useMemo(() => {
    let rows = normalized.filter((n) => !n._hidden);

    if (filter !== "all") rows = rows.filter((n) => n._status === filter);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((n) =>
        String(n.message || "")
          .toLowerCase()
          .includes(q),
      );
    }

    return rows;
  }, [normalized, filter, search]);

  const counts = useMemo(() => {
    const base = { all: 0, unread: 0, read: 0, seen: 0, replied: 0 };

    for (const n of normalized) {
      if (n._hidden) continue;
      base.all += 1;

      if (n._status === "read") base.read += 1;
      else if (n._status === "seen") base.seen += 1;
      else if (n._status === "replied") base.replied += 1;
      else base.unread += 1;
    }

    return base;
  }, [normalized]);

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

  const openNotification = async (n) => {
    const id = getNotifId(n);
    markSeenLocal(id);

    try {
      await axios.put(
        `${API}/mark-read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (e) {
      console.warn("mark-read pre-navigation failed:", e?.response || e);
    }

    navigate(`/user-notifications/${id}`, { state: { fromList: true } });
  };

  const getFilterButtonClass = (active) =>
    active
      ? "inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-white shadow-sm"
      : "inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50";

  if (!token || !userId) {
    return (
      <div className="service-page-wrap min-h-screen">
        <div className="service-main-container">
          <div className="service-parent-card">
            <h1 className="service-main-heading">Notifications</h1>
            <p className="text-red-600 mt-2">
              Please log in to view notifications.
            </p>
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

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight leading-tight text-white">
                Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
                  notifications & status
                </span>
              </h1>

              <p className="mt-2 text-[11px] sm:text-xs md:text-sm text-white/90 max-w-2xl leading-relaxed">
                Review all your notifications, filter by read state, search
                messages, and open individual details.
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 text-[11px] sm:text-xs text-white">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Notifications · Search · Filters · Pagination
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-5 sm:py-6 lg:py-7 space-y-5">
          <div className="service-parent-card">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="service-main-heading">Your Notifications</h1>

              <div className="relative flex-1 min-w-[220px] max-w-md">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  className="w-full pl-8 pr-3 py-2 rounded-full border border-slate-300 text-slate-900 text-xs sm:text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="Search messages..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <div className="ml-auto flex items-center gap-3">
                <p className="text-[11px] sm:text-xs text-slate-500 whitespace-nowrap">
                  Showing {filtered.length} of {counts.all}
                </p>

                <button
                  type="button"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 transition"
                  title="Sorted by latest"
                  aria-label="Sorted by latest"
                >
                  <FaSortAmountDownAlt className="text-indigo-600 text-xs" />
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={getFilterButtonClass(filter === f.key)}
                  onClick={() => {
                    setFilter(f.key);
                    setPage(1);
                  }}
                  title={`Show ${f.label.toLowerCase()} notifications`}
                >
                  <span>{f.label}</span>
                  <span
                    className={`ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] sm:text-[10px] ${
                      filter === f.key
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {counts[f.key]}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 text-sm text-slate-500">
              {loading
                ? "Loading notifications…"
                : `${filtered.length} of ${counts.all} visible${
                    search ? ` for “${search}”` : ""
                  }`}
            </div>

            {err && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {err}
              </div>
            )}
          </div>

          <div className="glass-card overflow-hidden">
            {loading ? (
              <div className="p-6 text-slate-500">Fetching notifications…</div>
            ) : pageRows.length === 0 ? (
              <div className="p-6 text-slate-500">
                No notifications to show.
              </div>
            ) : (
              <motion.div
                className="divide-y divide-slate-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
              >
                {pageRows.map((n) => {
                  const id = getNotifId(n);
                  const serverReadish =
                    n._status === "read" ||
                    n._status === "seen" ||
                    n._status === "replied";
                  const isSeen = serverReadish || seenLocal.has(id);

                  const seenClasses = isSeen
                    ? "bg-slate-50 hover:bg-slate-100 border-l-4 border-slate-200"
                    : "bg-white hover:bg-slate-50 border-l-4 border-transparent";

                  return (
                    <button
                      key={id}
                      onClick={() => openNotification(n)}
                      className={`w-full text-left p-4 sm:p-5 transition duration-200 ${seenClasses}`}
                      title="Open notification"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-slate-900">
                              {n.type || "notification"}
                            </span>

                            {n.priority && (
                              <span className="text-xs rounded-full border px-2 py-0.5 text-slate-600">
                                {n.priority}
                              </span>
                            )}

                            {(!isSeen || n._status === "unread") && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                                NEW
                              </span>
                            )}
                          </div>

                          <div className="mt-2 text-slate-800">
                            {n.message || (
                              <em className="text-slate-400">No message</em>
                            )}
                          </div>

                          <div className="mt-2 text-xs text-slate-500">
                            {n.createdAt
                              ? new Date(n.createdAt).toLocaleString()
                              : "—"}
                            {n.receiverRole
                              ? ` • to role: ${n.receiverRole}`
                              : null}
                            {n.audience ? ` • audience: ${n.audience}` : null}
                          </div>
                        </div>

                        <div className="text-xs uppercase tracking-wide text-slate-500 text-right">
                          {n._status}
                          {isSeen && (
                            <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                              Seen
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
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
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`inline-flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-lg border text-xs font-medium transition ${
                      page === 1
                        ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50"
                    }`}
                  >
                    <FaArrowLeft />
                  </button>

                  {pageNumbers.map((pageNo) => (
                    <button
                      key={pageNo}
                      type="button"
                      onClick={() => setPage(pageNo)}
                      className={`inline-flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-lg text-xs font-medium transition ${
                        page === pageNo
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {pageNo}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={`inline-flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-lg border text-xs font-medium transition ${
                      page === totalPages
                        ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50"
                    }`}
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
