import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

const API = `${globalBackendRoute}/api`;

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
  { key: "seen", label: "Seen" },
  { key: "replied", label: "Replied" },
];

const chipStyles = "px-3 py-1 rounded-full text-sm border transition-colors";
const activeChip = "bg-indigo-600 text-white border-indigo-600";
const inactiveChip = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";

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
            "Failed to load notifications. Check server routes and auth."
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
    [raw]
  );

  const filtered = useMemo(() => {
    let rows = normalized.filter((n) => !n._hidden);
    if (filter !== "all") rows = rows.filter((n) => n._status === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((n) =>
        String(n.message || "")
          .toLowerCase()
          .includes(q)
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

  const openNotification = async (n) => {
    try {
      await axios.put(
        `${API}/mark-read/${n._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) {
      console.warn("mark-read pre-navigation failed:", e?.response || e);
    }
    navigate(`/user-notifications/${n._id}`, { state: { fromList: true } });
  };

  if (!token || !userId) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-xl font-semibold">Notifications</h1>
        <p className="text-red-600 mt-2">
          Please log in to view notifications.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Your Notifications</h1>
        <div className="flex items-center gap-2">
          <input
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
            placeholder="Search messages…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`${chipStyles} ${
              filter === f.key ? activeChip : inactiveChip
            }`}
            onClick={() => {
              setFilter(f.key);
              setPage(1);
            }}
            title={`Show ${f.label.toLowerCase()} notifications`}
          >
            {f.label}
            <span className="ml-2 inline-block rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        {loading
          ? "Loading…"
          : `${filtered.length} of ${counts.all} visible${
              search ? ` for “${search}”` : ""
            }`}
      </div>

      {err && (
        <div className="mt-3 p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200">
          {err}
        </div>
      )}

      <div className="mt-4 divide-y rounded-lg border overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-500">Fetching notifications…</div>
        ) : pageRows.length === 0 ? (
          <div className="p-6 text-gray-500">No notifications to show.</div>
        ) : (
          pageRows.map((n) => (
            <button
              key={n._id}
              onClick={() => openNotification(n)}
              className="w-full text-left p-4 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
              title="Open notification"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {n.type || "notification"}
                    </span>
                    {n.priority && (
                      <span className="text-xs rounded-full border px-2 py-0.5 text-gray-600">
                        {n.priority}
                      </span>
                    )}
                    {n._status === "unread" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-gray-800">
                    {n.message || <em className="text-gray-400">No message</em>}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : "—"}
                    {n.receiverRole ? ` • to role: ${n.receiverRole}` : null}
                    {n.audience ? ` • audience: ${n.audience}` : null}
                  </div>
                </div>
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  {n._status}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
