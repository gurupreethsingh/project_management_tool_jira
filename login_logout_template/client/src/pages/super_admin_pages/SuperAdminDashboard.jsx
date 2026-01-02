// src/pages/super_admin_pages/SuperDashboard.jsx
import React from "react";

// ✅ HERO PROPS FOR THIS PAGE (unique)
export const superAdminDashboardHero = {
  heroTitle: "",
  heroSubtitle: "",
  showHero: true,
};

export default function SuperAdminDashboard() {
  return (
    <>
      <div className="flex flex-col justify-center px-6 py-12 lg:px-8 bg-transparent">
        <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
          <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Super Admin Dashboard
          </h2>
          <p className="mt-2 text-center text-sm/6 text-gray-500">
            Dummy dashboard — connect backend later.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-5xl">
          <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-gray-900/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Overview
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Quick stats and admin actions.
                </p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                Super Admin
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Total Users", value: "1,248" },
                { title: "Employees", value: "38" },
                { title: "Admins", value: "4" },
                { title: "Active Sessions", value: "112" },
                { title: "New Signups (7d)", value: "56" },
                { title: "System Health", value: "OK" },
              ].map((k) => (
                <div
                  key={k.title}
                  className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/10"
                >
                  <div className="text-xs font-semibold text-gray-500">
                    {k.title}
                  </div>
                  <div className="mt-2 text-2xl font-bold text-gray-900">
                    {k.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/all-users"
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Manage Users
              </a>
              <a
                href="/update-role"
                className="inline-flex items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm/6 font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Update Role
              </a>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Tip: Swap stats with real metrics + charts later.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
