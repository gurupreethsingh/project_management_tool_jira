import React from "react";

// ✅ HERO PROPS FOR THIS PAGE (used by MainLayout)
export const allUsersHero = {
  heroTitle: "",
  heroSubtitle: "",
  showHero: true, // keep header background visible
};

export default function AllUsers() {
  return (
    <>
      {/* ✅ Same structure as Login / UpdateRole */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-8 bg-transparent">
        {/* Page header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
          <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            All Users
          </h2>
        </div>

        {/* Main card */}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-5xl">
          <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-gray-900/10">
            {/* Card header */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Users Table
                </div>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                Super Admin
              </span>
            </div>

            {/* Table */}
            <div className="mt-6 overflow-hidden rounded-xl ring-1 ring-gray-900/10">
              <div className="grid grid-cols-4 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700">
                <div>Name</div>
                <div>Email</div>
                <div>Role</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Dummy rows */}
              {[
                { name: "John Doe", email: "john@example.com", role: "User" },
                {
                  name: "Jane Smith",
                  email: "jane@example.com",
                  role: "Employee",
                },
                {
                  name: "Admin",
                  email: "admin@ecoders.in",
                  role: "SuperAdmin",
                },
              ].map((u, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-4 items-center px-4 py-3 text-sm text-gray-600 border-t border-gray-100"
                >
                  <div className="font-medium text-gray-900">{u.name}</div>
                  <div>{u.email}</div>
                  <div>{u.role}</div>
                  <div className="text-right">
                    <a
                      href="/update-role"
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Update Role
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Tip: Replace dummy rows with API data, pagination, and search.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
