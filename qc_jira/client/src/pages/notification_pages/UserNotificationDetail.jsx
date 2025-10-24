import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

const API = `${globalBackendRoute}/api`;

export default function UserNotificationDetail() {
  const { notificationId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

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
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        const found = rows.find((n) => n._id === notificationId);
        if (!found)
          setErr("Notification not found or not visible to this user.");
        else setItem(found);
      })
      .catch((e) => {
        console.error("detail get-user-notifications error:", e?.response || e);
        setErr(
          e?.response?.data?.message ||
            "Failed to load notification. Check server routes and auth."
        );
      })
      .finally(() => setLoading(false));
  }, [token, userId, notificationId]);

  // Mark as read on mount (best-effort)
  useEffect(() => {
    if (!token || !notificationId) return;
    axios
      .put(
        `${API}/mark-read/${notificationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .catch((e) => console.warn("detail mark-read failed:", e?.response || e));
  }, [token, notificationId]);

  const status = useMemo(() => {
    if (!item) return "";
    return (
      item?.receipt?.status ||
      item?.statusForUser ||
      (item?.isRead ? "read" : "unread")
    );
  }, [item]);

  if (!token || !userId) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-xl font-semibold">Notification</h1>
        <p className="text-red-600 mt-2">Please log in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notification</h1>
        <Link
          to="/user-notifications"
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back to notifications
        </Link>
      </div>

      {loading && <div className="mt-4 text-gray-500">Loading…</div>}
      {err && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
          {err}
        </div>
      )}

      {!loading && !err && item && (
        <div className="mt-4 rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="uppercase tracking-wide">
              {item.type || "notification"}
            </span>
            {item.priority && (
              <span className="text-xs rounded-full border px-2 py-0.5">
                {item.priority}
              </span>
            )}
            <span className="text-xs bg-gray-100 rounded px-2 py-0.5">
              {status}
            </span>
          </div>

          <div className="mt-2 text-gray-900 whitespace-pre-wrap">
            {item.message || <em className="text-gray-400">No message</em>}
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Created:{" "}
            {item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}
            {item.receiverRole ? ` • to role: ${item.receiverRole}` : null}
            {item.audience ? ` • audience: ${item.audience}` : null}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                axios
                  .put(
                    `${API}/mark-read/${item._id}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                  )
                  .finally(() => navigate("/user-notifications"));
              }}
              className="px-4 py-2 rounded bg-indigo-600 text-white text-sm"
            >
              Mark as Read & Back
            </button>

            <button
              onClick={() => {
                axios
                  .put(
                    `${API}/mark-seen/${item._id}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                  )
                  .finally(() => navigate("/user-notifications"));
              }}
              className="px-4 py-2 rounded border text-sm"
            >
              Mark as Seen & Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
