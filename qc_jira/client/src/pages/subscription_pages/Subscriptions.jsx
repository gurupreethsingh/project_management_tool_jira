import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaSync,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "—");

const chipBase =
  "px-3 py-1 rounded-full text-sm border transition-colors cursor-pointer";
const chipActive = "bg-indigo-600 text-white border-indigo-600";
const chipInactive = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";

const Subscriptions = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");

  // UX / filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all"); // all | active | inactive
  const [refreshSpin, setRefreshSpin] = useState(false);

  // Per-row submitting (to disable just the clicked button)
  const [busyEmail, setBusyEmail] = useState("");

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";
  const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined;

  const fetchSubs = async () => {
    try {
      setLoading(true);
      setLoadErr("");
      const res = await axios.get(
        `${globalBackendRoute}/api/all-subscriptions`,
        { headers: authHeader }
      );
      const list = Array.isArray(res?.data) ? res.data : [];
      setRows(list);
    } catch (e) {
      console.error("Error fetching subscriptions:", e?.response || e);
      setLoadErr(
        e?.response?.data?.message || e?.message || "Failed to load data."
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // search + filter
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (status === "active" && !r.isActive) return false;
      if (status === "inactive" && r.isActive) return false;
      if (!query) return true;
      return String(r.email || "")
        .toLowerCase()
        .includes(query);
    });
  }, [rows, q, status]);

  const counts = useMemo(() => {
    let active = 0;
    let inactive = 0;
    for (const r of rows) {
      if (r.isActive) active++;
      else inactive++;
    }
    return { all: rows.length, active, inactive };
  }, [rows]);

  const toggleSubscription = async (email, isActive) => {
    if (isActive) {
      const confirmUnsubscribe = window.confirm(
        "Are you sure you want to unsubscribe?"
      );
      if (!confirmUnsubscribe) return;
    }

    try {
      setBusyEmail(email);

      // Optimistic UI update
      setRows((prev) =>
        prev.map((r) =>
          r.email === email
            ? {
                ...r,
                isActive: !isActive,
                canceledAt: !isActive ? null : new Date().toISOString(),
              }
            : r
        )
      );

      await axios.post(
        `${globalBackendRoute}/api/${isActive ? "unsubscribe" : "resubscribe"}`,
        { email },
        { headers: authHeader }
      );

      // Optional toast/alert: keep subtle UX
      // alert(isActive ? "You have successfully unsubscribed." : "You have successfully resubscribed!");
    } catch (e) {
      console.error("Error toggling subscription:", e?.response || e);
      // Rollback on error
      setRows((prev) =>
        prev.map((r) =>
          r.email === email
            ? { ...r, isActive, canceledAt: isActive ? r.canceledAt : null }
            : r
        )
      );
      alert(
        e?.response?.data?.message ||
          "Failed to update subscription. Please try again."
      );
    } finally {
      setBusyEmail("");
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Subscriptions</h1>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by email…"
                className="w-64 pl-9 pr-3 py-2 border rounded-md text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                className={`${chipBase} ${
                  status === "all" ? chipActive : chipInactive
                }`}
                onClick={() => setStatus("all")}
                title="Show all"
              >
                All <span className="ml-2">{counts.all}</span>
              </button>
              <button
                className={`${chipBase} ${
                  status === "active" ? chipActive : chipInactive
                }`}
                onClick={() => setStatus("active")}
                title="Show active"
              >
                Active <span className="ml-2">{counts.active}</span>
              </button>
              <button
                className={`${chipBase} ${
                  status === "inactive" ? chipActive : chipInactive
                }`}
                onClick={() => setStatus("inactive")}
                title="Show inactive"
              >
                Inactive <span className="ml-2">{counts.inactive}</span>
              </button>
            </div>

            <button
              onClick={async () => {
                setRefreshSpin(true);
                await fetchSubs();
                setRefreshSpin(false);
              }}
              className="inline-flex items-center px-3 py-2 border rounded-md text-sm bg-white hover:bg-gray-50"
              title="Refresh"
            >
              <FaSync className={`mr-2 ${refreshSpin ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          {loading ? (
            <div className="p-6 text-sm text-gray-600">Loading…</div>
          ) : loadErr ? (
            <div className="p-6 text-sm text-red-600">{loadErr}</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-sm text-gray-600">
              No subscriptions found.
            </div>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  {[
                    "Email ID",
                    "Status",
                    "Subscribed On",
                    "Unsubscribed On",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((subscription) => {
                  const isRowBusy = busyEmail === subscription.email;
                  return (
                    <tr
                      key={subscription._id || subscription.email}
                      className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subscription.email}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center gap-1 px-2 text-xs leading-5 font-semibold rounded-full ${
                            subscription.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {subscription.isActive ? (
                            <FaCheckCircle />
                          ) : (
                            <FaTimesCircle />
                          )}
                          {subscription.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(subscription.createdAt)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {subscription.canceledAt
                          ? formatDate(subscription.canceledAt)
                          : "—"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() =>
                            toggleSubscription(
                              subscription.email,
                              subscription.isActive
                            )
                          }
                          disabled={isRowBusy}
                          className={`px-4 py-2 text-sm font-medium rounded ${
                            subscription.isActive
                              ? "bg-red-100 text-red-700 hover:bg-red-600 hover:text-white"
                              : "bg-green-500 text-white hover:bg-green-600"
                          } ${
                            isRowBusy ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                          title={
                            subscription.isActive
                              ? "Unsubscribe"
                              : "Resubscribe"
                          }
                        >
                          {isRowBusy
                            ? "Working…"
                            : subscription.isActive
                            ? "Unsubscribe"
                            : "Resubscribe"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
