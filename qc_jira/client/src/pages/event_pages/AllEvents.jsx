import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

const API = `${globalBackendRoute}/api`;

const chip = "px-3 py-1 rounded-full text-sm border transition-colors";
const active = "bg-indigo-600 text-white border-indigo-600";
const inactive = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";

export default function AllEvents() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState({}); // _id:boolean
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";

  const fetchAll = async () => {
    if (!token) {
      setErr("Not authenticated.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const res = await axios.get(
        `${API}/events?page=1&limit=200&sort=-createdAt`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setRows(data);
    } catch (e) {
      console.error("list events error:", e?.response || e);
      setErr(
        e?.response?.data?.error ||
          e?.response?.data?.details ||
          e?.message ||
          "Failed to load events."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SHOW ALL EVENTS (no creator filter)
  const allEvents = useMemo(() => rows, [rows]);

  const filtered = useMemo(() => {
    let out = allEvents;
    if (statusFilter !== "all") {
      out = out.filter(
        (e) => String(e.status || "").toLowerCase() === statusFilter
      );
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      out = out.filter(
        (e) =>
          String(e.title || "")
            .toLowerCase()
            .includes(q) ||
          String(e.description || "")
            .toLowerCase()
            .includes(q) ||
          (Array.isArray(e.tags) &&
            e.tags.some((t) => String(t).toLowerCase().includes(q)))
      );
    }
    return out;
  }, [allEvents, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleAllOnPage = (checked) => {
    const next = { ...selected };
    for (const ev of pageRows) next[ev._id] = checked;
    setSelected(next);
  };

  const pickSelectedIds = () =>
    Object.keys(selected).filter((id) => selected[id]);

  // ---------- BULK ACTIONS ----------
  const bulk = async (endpoint, body = {}) => {
    const ids = pickSelectedIds();
    if (ids.length === 0) return;
    try {
      await axios.post(
        `${API}/events/bulk/${endpoint}`,
        { ids, ...body },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchAll();
      setSelected({});
    } catch (e) {
      console.error(`bulk ${endpoint} error:`, e?.response || e);
      alert(
        e?.response?.data?.error ||
          e?.response?.data?.details ||
          e?.message ||
          `Bulk ${endpoint} failed`
      );
    }
  };

  // ---------- ITEM CARDS ----------
  const Card = ({ ev }) => {
    const start = ev.startTime ? new Date(ev.startTime) : null;
    const end = ev.endTime ? new Date(ev.endTime) : null;
    const isDeleted = ev.isDeleted;
    const isPublished = ev.isPublished;
    return (
      <div
        className="border rounded-lg p-4 hover:shadow-sm transition bg-white cursor-pointer"
        onClick={() => navigate(`/single-event/${ev._id}`)}
        title="Open event"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 truncate">
                {ev.title || "Untitled event"}
              </h3>
              <span className="text-xs border rounded px-2 py-0.5 capitalize">
                {String(ev.status || "scheduled")}
              </span>
              <span
                className={`text-[10px] rounded px-2 py-0.5 ${
                  isPublished
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {isPublished ? "Published" : "Draft"}
              </span>
              {isDeleted && (
                <span className="text-[10px] rounded px-2 py-0.5 bg-red-100 text-red-700">
                  Deleted
                </span>
              )}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {start ? start.toLocaleString() : "—"}
              {end ? ` – ${end.toLocaleTimeString()}` : ""}
            </div>
            <div className="text-sm text-gray-700 mt-2 line-clamp-2">
              {ev.description || (
                <em className="text-gray-400">No description</em>
              )}
            </div>
            {Array.isArray(ev.tags) && ev.tags.length > 0 && (
              <div className="text-xs text-gray-500 mt-2">
                <span className="font-medium">Tags:</span> {ev.tags.join(", ")}
              </div>
            )}
          </div>

          <input
            type="checkbox"
            className="mt-1"
            checked={!!selected[ev._id]}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              setSelected((p) => ({ ...p, [ev._id]: e.target.checked }))
            }
            title="Select for bulk actions"
          />
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/single-event/${ev._id}`);
            }}
            className="px-3 py-1.5 text-sm rounded border"
            title="Open"
          >
            Open
          </button>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              const url = `${API}/events/${ev._id}/${
                ev.isPublished ? "unpublish" : "publish"
              }`;
              try {
                await axios.post(
                  url,
                  {},
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                await fetchAll();
              } catch (e2) {
                alert(e2?.response?.data?.error || e2?.message || "Failed");
              }
            }}
            className="px-3 py-1.5 text-sm rounded border"
          >
            {ev.isPublished ? "Unpublish" : "Publish"}
          </button>
          {!ev.isDeleted ? (
            <button
              onClick={async (e) => {
                e.stopPropagation();
                if (!window.confirm("Soft delete this event?")) return;
                try {
                  await axios.delete(`${API}/events/${ev._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  await fetchAll();
                } catch (e2) {
                  alert(
                    e2?.response?.data?.error || e2?.message || "Delete failed"
                  );
                }
              }}
              className="px-3 py-1.5 text-sm rounded border text-red-700"
            >
              Soft Delete
            </button>
          ) : (
            <>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await axios.post(
                      `${API}/events/${ev._id}/restore`,
                      {},
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    await fetchAll();
                  } catch (e2) {
                    alert(
                      e2?.response?.data?.error ||
                        e2?.message ||
                        "Restore failed"
                    );
                  }
                }}
                className="px-3 py-1.5 text-sm rounded border"
              >
                Restore
              </button>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!window.confirm("Hard delete permanently?")) return;
                  try {
                    await axios.delete(`${API}/events/${ev._id}/hard`, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    await fetchAll();
                  } catch (e2) {
                    alert(
                      e2?.response?.data?.error ||
                        e2?.message ||
                        "Hard delete failed"
                    );
                  }
                }}
                className="px-3 py-1.5 text-sm rounded border text-red-700"
              >
                Hard Delete
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  if (!token) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold">All Events</h1>
        <p className="text-red-600 mt-2">Please log in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">All Events</h1>
        <input
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
          placeholder="Search title, description, tags…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        {["all", "scheduled", "live", "completed", "cancelled"].map((k) => (
          <button
            key={k}
            className={`${chip} ${statusFilter === k ? active : inactive}`}
            onClick={() => {
              setStatusFilter(k);
              setPage(1);
            }}
            title={`Filter ${k}`}
          >
            {k[0].toUpperCase() + k.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        {loading ? "Loading…" : `${filtered.length} event(s)`}
      </div>

      {err && (
        <div className="mt-3 p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200">
          {err}
        </div>
      )}

      {/* Bulk actions */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <button
          className="px-3 py-1.5 text-sm rounded border"
          onClick={() => toggleAllOnPage(true)}
        >
          Select Page
        </button>
        <button
          className="px-3 py-1.5 text-sm rounded border"
          onClick={() => toggleAllOnPage(false)}
        >
          Clear Page
        </button>
        <span className="text-sm text-gray-600 ml-2">
          {pickSelectedIds().length} selected
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => bulk("publish")}
            className="px-3 py-1.5 text-sm rounded border"
          >
            Bulk Publish
          </button>
          <button
            onClick={() => bulk("unpublish")}
            className="px-3 py-1.5 text-sm rounded border"
          >
            Bulk Unpublish
          </button>
          <button
            onClick={() => bulk("status", { status: "scheduled" })}
            className="px-3 py-1.5 text-sm rounded border"
          >
            Set Scheduled
          </button>
          <button
            onClick={() => bulk("status", { status: "live" })}
            className="px-3 py-1.5 text-sm rounded border"
          >
            Set Live
          </button>
          <button
            onClick={() => bulk("status", { status: "completed" })}
            className="px-3 py-1.5 text-sm rounded border"
          >
            Set Completed
          </button>
          <button
            onClick={() => bulk("status", { status: "cancelled" })}
            className="px-3 py-1.5 text-sm rounded border"
          >
            Set Cancelled
          </button>
          <button
            onClick={() => bulk("soft-delete")}
            className="px-3 py-1.5 text-sm rounded border text-red-700"
          >
            Bulk Soft Delete
          </button>
          <button
            onClick={() => bulk("restore")}
            className="px-3 py-1.5 text-sm rounded border"
          >
            Bulk Restore
          </button>
          <button
            onClick={() => bulk("hard-delete")}
            className="px-3 py-1.5 text-sm rounded border text-red-700"
          >
            Bulk Hard Delete
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-gray-500">Fetching events…</div>
        ) : pageRows.length === 0 ? (
          <div className="col-span-full text-gray-500">No events.</div>
        ) : (
          pageRows.map((ev) => <Card key={ev._id} ev={ev} />)
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
