// src/pages/super_admin_pages/AllSubscriptions.jsx
import React, { useMemo, useState } from "react";
import { FaBell } from "react-icons/fa";

// ✅ HERO PROPS
export const allSubscriptionsHero = {
  heroTitle: "",
  heroSubtitle: "",
  showHero: true,
};

export default function AllSubscriptions() {
  const initialRows = useMemo(
    () => [
      {
        id: "sub_1",
        name: "John Doe",
        email: "john@example.com",
        subscribedAt: "2025-12-15",
        isActive: true,
      },
      {
        id: "sub_2",
        name: "Jane Smith",
        email: "jane@example.com",
        subscribedAt: "2025-10-01",
        isActive: false,
      },
      {
        id: "sub_3",
        name: "Admin",
        email: "admin@ecoders.in",
        subscribedAt: "2025-11-20",
        isActive: true,
      },
    ],
    []
  );

  const [rows, setRows] = useState(initialRows);
  const [alert, setAlert] = useState("");

  function toggleSubscription(id) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );

    const row = rows.find((r) => r.id === id);
    setAlert(
      row?.isActive
        ? `Subscription removed for ${row.email}`
        : `Subscription reinstated for ${row.email}`
    );

    setTimeout(() => setAlert(""), 2000);
  }

  const badgeClass = (active) =>
    active
      ? "bg-green-50 text-green-700 ring-1 ring-green-200"
      : "bg-gray-100 text-gray-700 ring-1 ring-gray-200";

  const buttonClass = (active) =>
    active
      ? "bg-amber-50 text-amber-700 hover:bg-amber-100 ring-1 ring-amber-200"
      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-1 ring-emerald-200";

  return (
    <>
      <div className="flex flex-col justify-center px-6 py-12 lg:px-8 bg-transparent">
        {/* Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            All Subscriptions
          </h2>
        </div>

        {/* Card */}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-5xl">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaBell className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-semibold text-gray-900">
                  Subscriptions
                </span>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                Super Admin
              </span>
            </div>

            {/* Alert */}
            {alert && (
              <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700 ring-1 ring-gray-200">
                {alert}
              </div>
            )}

            {/* Table */}
            <div className="mt-6 overflow-hidden rounded-xl ring-1 ring-gray-900/10">
              <div className="grid grid-cols-4 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700">
                <div>Name</div>
                <div>Email</div>
                <div>Subscribed Date</div>
                <div className="text-right">Action</div>
              </div>

              {rows.map((u) => (
                <div
                  key={u.id}
                  className="grid grid-cols-4 items-center px-4 py-3 text-sm text-gray-600 border-t border-gray-100"
                >
                  <div className="flex items-center gap-2 font-medium text-gray-900">
                    {u.name}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs ${badgeClass(
                        u.isActive
                      )}`}
                    >
                      {u.isActive ? "Active" : "Removed"}
                    </span>
                  </div>

                  <div>{u.email}</div>
                  <div>{u.subscribedAt}</div>

                  <div className="text-right">
                    <button
                      onClick={() => toggleSubscription(u.id)}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold ${buttonClass(
                        u.isActive
                      )}`}
                    >
                      {u.isActive ? "Remove" : "Reinstate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Tip: Persist subscription state in DB and audit admin actions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
