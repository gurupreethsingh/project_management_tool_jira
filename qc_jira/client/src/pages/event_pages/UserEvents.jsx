"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
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
import eventsBanner from "../../assets/images/profile_banner.jpg"; // change if needed

const API = `${globalBackendRoute}/api`;

const FILTERS = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "live", label: "Live" },
  { key: "scheduled", label: "Scheduled" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "postponed", label: "Postponed" },
];

const MAIN_HEADING_STYLE =
  "text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 text-uppercase tracking-[0.1em]";

const HERO_TAGS = ["EVENTS", "SCHEDULES", "LIVE", "UPCOMING", "TRACKING"];

const HERO_STYLE = {
  backgroundImage: `url(${eventsBanner})`,
};

const getEventId = (e) => String(e?._id || e?.id || "");

const getFilterButtonClass = (active) =>
  active
    ? "inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-white shadow-sm"
    : "inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50";

const getStatusBadgeClass = (status) => {
  switch (String(status || "").toLowerCase()) {
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

export default function UserEvents() {
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
  const role = user?.role || "";

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

  const markSeen = useCallback(
    (id) => {
      if (!seenStorageKey || !id) return;

      setSeen((prev) => {
        const next = new Set(prev);
        next.add(String(id));
        localStorage.setItem(seenStorageKey, JSON.stringify([...next]));
        return next;
      });
    },
    [seenStorageKey],
  );

  useEffect(() => {
    if (!token || !userId) {
      setLoading(false);
      setErr("Not authenticated.");
      return;
    }

    setLoading(true);
    setErr("");

    const params = new URLSearchParams({
      userId,
      role,
      sort: "startTime",
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
            "Failed to load events.",
        );
      })
      .finally(() => setLoading(false));
  }, [token, userId, role]);

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

      const location =
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

    rows.sort((a, b) => {
      const at = a._start ? a._start.getTime() : 0;
      const bt = b._start ? b._start.getTime() : 0;
      return at - bt;
    });

    return rows;
  }, [normalized, filter, search]);

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

  const openEvent = useCallback(
    (ev) => {
      const id = getEventId(ev);
      markSeen(id);
      navigate(`/single-user-event/${id}`, { state: { fromList: true } });
    },
    [markSeen, navigate],
  );

  const goToNextPage = useCallback(() => {
    setPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  const goToPreviousPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const goToPage = useCallback((pageNo) => {
    setPage(pageNo);
  }, []);

  if (!token || !userId) {
    return (
      <div className="service-page-wrap min-h-screen">
        <div className="service-main-container">
          <div className="service-parent-card">
            <h1 className={MAIN_HEADING_STYLE}>Events</h1>
            <p className="text-red-600 text-sm sm:text-base">
              Please log in to view your events.
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

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight leading-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]">
                Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
                  events & schedules
                </span>
              </h1>

              <p className="mt-2 text-[11px] sm:text-xs md:text-sm text-white/90 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                Explore visible events, search quickly, track live and upcoming
                sessions, and open any event to view details.
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 text-[11px] sm:text-xs text-white">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Events · Filters · Search · Pagination
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-[11px] sm:text-xs text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                <span>{counts.live} live</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-200" />
                <span>{counts.upcoming} upcoming</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-5 sm:py-6 lg:py-7 space-y-5">
          <div className="rounded-2xl border border-slate-200 p-4 sm:p-5 bg-white shadow-sm flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className={MAIN_HEADING_STYLE}>All Events</h1>

              <div className="relative flex-1 min-w-[180px] max-w-md">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]" />
                <input
                  className="w-full pl-8 pr-3 py-2 rounded-full border border-slate-300 text-slate-900 text-[11px] sm:text-xs shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="Search title, description, tags..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <p className="text-[10px] sm:text-[11px] text-slate-500 whitespace-nowrap">
                  Showing {filtered.length} of {counts.all}
                </p>

                <button
                  type="button"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 transition"
                  title="Sorted by start time"
                  aria-label="Sorted by start time"
                >
                  <FaSortAmountDownAlt className="text-indigo-600 text-xs" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={getFilterButtonClass(filter === f.key)}
                  onClick={() => {
                    setFilter(f.key);
                    setPage(1);
                  }}
                  title={`Show ${f.label.toLowerCase()} events`}
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

            <div className="text-[11px] sm:text-xs text-slate-500">
              {loading
                ? "Loading events…"
                : `${filtered.length} of ${counts.all} visible${
                    search ? ` for “${search}”` : ""
                  }`}
            </div>

            {err && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] sm:text-xs text-red-700">
                {err}
              </div>
            )}
          </div>

          <div className="glass-card overflow-hidden">
            {loading ? (
              <div className="p-6 text-center text-sm text-slate-500">
                Fetching events…
              </div>
            ) : pageRows.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                No events to show.
              </div>
            ) : (
              <>
                <div className="hidden lg:block overflow-x-auto">
                  <motion.table
                    className="min-w-full border-separate border-spacing-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                  >
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 border-b border-slate-200">
                          Event Name
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 border-b border-slate-200">
                          Date & Time
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 border-b border-slate-200">
                          Location
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 border-b border-slate-200">
                          Tags
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 border-b border-slate-200">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 border-b border-slate-200">
                          Summary
                        </th>
                        <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 border-b border-slate-200">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {pageRows.map((e, index) => {
                        const id = getEventId(e);
                        const isSeen = seen.has(id);

                        return (
                          <tr
                            key={id}
                            className={`transition ${
                              isSeen
                                ? "bg-slate-50 hover:bg-slate-100"
                                : index % 2 === 0
                                  ? "bg-white hover:bg-slate-50"
                                  : "bg-slate-50/50 hover:bg-slate-50"
                            }`}
                          >
                            <td className="px-4 py-3 align-top border-b border-slate-200">
                              <div className="min-w-0">
                                <p className="text-[12px] font-semibold text-slate-900 break-words">
                                  {e.title || "Untitled event"}
                                </p>
                                {e.subtitle ? (
                                  <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">
                                    {e.subtitle}
                                  </p>
                                ) : e.description ? (
                                  <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">
                                    {String(e.description).length > 90
                                      ? `${String(e.description).slice(0, 90)}…`
                                      : e.description}
                                  </p>
                                ) : (
                                  <p className="mt-1 text-[11px] italic text-slate-400">
                                    No details
                                  </p>
                                )}
                              </div>
                            </td>

                            <td className="px-4 py-3 align-top border-b border-slate-200">
                              <div className="text-[11px] text-slate-700 leading-relaxed">
                                <div>
                                  {e._start
                                    ? e._start.toLocaleString()
                                    : "Not available"}
                                </div>
                                {e._end && (
                                  <div className="text-slate-500">
                                    {e._end.toLocaleTimeString()}
                                  </div>
                                )}
                              </div>
                            </td>

                            <td className="px-4 py-3 align-top border-b border-slate-200">
                              <p className="text-[11px] text-slate-700 break-words">
                                {e._location || "Not specified"}
                              </p>
                            </td>

                            <td className="px-4 py-3 align-top border-b border-slate-200">
                              <p className="text-[11px] text-slate-700 break-words">
                                {Array.isArray(e.tags) && e.tags.length > 0
                                  ? e.tags.join(", ")
                                  : "No tags"}
                              </p>
                            </td>

                            <td className="px-4 py-3 align-top border-b border-slate-200">
                              <div className="flex flex-wrap gap-1.5">
                                <span
                                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${getStatusBadgeClass(
                                    e._status,
                                  )}`}
                                >
                                  {e._status}
                                </span>

                                {e._isUpcoming && (
                                  <span className="inline-flex items-center rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                    UPCOMING
                                  </span>
                                )}

                                {e._isLive && (
                                  <span className="inline-flex items-center rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                    LIVE
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="px-4 py-3 align-top border-b border-slate-200">
                              <div className="space-y-1 text-[11px] text-slate-700">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-slate-500">
                                    Organizers
                                  </span>
                                  <span className="font-medium">
                                    {e.organizers?.length || 0}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-slate-500">
                                    Visibility
                                  </span>
                                  <span
                                    className={
                                      e.isPublished
                                        ? "font-medium text-indigo-600"
                                        : "font-medium text-slate-400"
                                    }
                                  >
                                    {e.isPublished ? "Published" : "Draft"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-slate-500">Seen</span>
                                  <span
                                    className={
                                      isSeen
                                        ? "font-medium text-slate-700"
                                        : "font-medium text-slate-400"
                                    }
                                  >
                                    {isSeen ? "Seen" : "Unseen"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3 align-middle text-center border-b border-slate-200">
                              <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm hover:brightness-110"
                                onClick={() => openEvent(e)}
                              >
                                View event
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </motion.table>
                </div>

                <div className="lg:hidden divide-y divide-slate-200">
                  {pageRows.map((e) => {
                    const id = getEventId(e);
                    const isSeen = seen.has(id);

                    return (
                      <div
                        key={id}
                        className={`p-4 space-y-3 ${
                          isSeen ? "bg-slate-50" : "bg-white"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-900">
                            {e.title || "Untitled event"}
                          </h3>

                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${getStatusBadgeClass(
                              e._status,
                            )}`}
                          >
                            {e._status}
                          </span>

                          {e._isUpcoming && (
                            <span className="inline-flex items-center rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                              UPCOMING
                            </span>
                          )}

                          {e._isLive && (
                            <span className="inline-flex items-center rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white">
                              LIVE
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div className="rounded-lg border border-slate-200 bg-white p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-700">
                              Date & Time
                            </p>
                            <p className="mt-1 text-slate-700 break-words">
                              {e._start
                                ? e._start.toLocaleString()
                                : "Not available"}
                              {e._end
                                ? ` – ${e._end.toLocaleTimeString()}`
                                : ""}
                            </p>
                          </div>

                          <div className="rounded-lg border border-slate-200 bg-white p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-700">
                              Location
                            </p>
                            <p className="mt-1 text-slate-700 break-words">
                              {e._location || "Not specified"}
                            </p>
                          </div>

                          <div className="rounded-lg border border-slate-200 bg-white p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-700">
                              Tags
                            </p>
                            <p className="mt-1 text-slate-700 break-words">
                              {Array.isArray(e.tags) && e.tags.length > 0
                                ? e.tags.join(", ")
                                : "No tags"}
                            </p>
                          </div>

                          <div className="rounded-lg border border-slate-200 bg-white p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-700">
                              Summary
                            </p>
                            <div className="mt-1 space-y-1 text-slate-700">
                              <div className="flex items-center justify-between gap-2">
                                <span>Organizers</span>
                                <span>{e.organizers?.length || 0}</span>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <span>Visibility</span>
                                <span>
                                  {e.isPublished ? "Published" : "Draft"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <span>Seen</span>
                                <span>{isSeen ? "Seen" : "Unseen"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-3 py-2 text-[11px] font-medium text-white shadow-sm hover:brightness-110"
                          onClick={() => openEvent(e)}
                        >
                          View event
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
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
                    onClick={goToPreviousPage}
                    disabled={page === 1}
                    className={`inline-flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-lg border text-xs font-medium transition ${
                      page === 1
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
                        className="inline-flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition"
                      >
                        1
                      </button>
                      {pageNumbers[0] > 2 && (
                        <span className="px-1 text-slate-400 text-xs">...</span>
                      )}
                    </>
                  )}

                  {pageNumbers.map((pageNo) => (
                    <button
                      key={pageNo}
                      type="button"
                      onClick={() => goToPage(pageNo)}
                      className={`inline-flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-lg text-xs font-medium transition ${
                        page === pageNo
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {pageNo}
                    </button>
                  ))}

                  {pageNumbers[pageNumbers.length - 1] < totalPages && (
                    <>
                      {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                        <span className="px-1 text-slate-400 text-xs">...</span>
                      )}
                      <button
                        type="button"
                        onClick={() => goToPage(totalPages)}
                        className="inline-flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={goToNextPage}
                    disabled={page === totalPages}
                    className={`inline-flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-lg border text-xs font-medium transition ${
                      page === totalPages
                        ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50"
                    }`}
                    aria-label="Go to next page"
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
