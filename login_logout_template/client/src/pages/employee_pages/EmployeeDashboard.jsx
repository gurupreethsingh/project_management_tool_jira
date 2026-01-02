// src/pages/employee_pages/EmployeeDashboard.jsx
import React from "react";

// ✅ HERO PROPS FOR THIS PAGE (unique)
export const employeeDashboardHero = {
  heroTitle: "",
  heroSubtitle: "",
  showHero: true, // keep header background visible
};

export default function EmployeeDashboard() {
  return (
    <>
      <div className="flex flex-col justify-center px-6 py-12 lg:px-8 bg-transparent">
        {/* Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
          <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Employee Dashboard
          </h2>
          <p className="mt-2 text-center text-sm/6 text-gray-500">
            Overview of tasks, activity, and assigned work.
          </p>
        </div>

        {/* Dashboard content */}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-5xl">
          <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-gray-900/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Your Overview
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Dummy employee metrics (backend later).
                </p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                Employee
              </span>
            </div>

            {/* Stats grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Assigned Tasks", value: "12" },
                { title: "Completed Tasks", value: "34" },
                { title: "Pending Reviews", value: "5" },
                { title: "Projects", value: "3" },
                { title: "Team Messages", value: "8" },
                { title: "Status", value: "Active" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/10"
                >
                  <div className="text-xs font-semibold text-gray-500">
                    {item.title}
                  </div>
                  <div className="mt-2 text-2xl font-bold text-gray-900">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/profile"
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                View Profile
              </a>

              <a
                href="/update-profile"
                className="inline-flex items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm/6 font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Update Profile
              </a>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Tip: Replace dummy stats with real employee data after backend
              integration.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
