// src/pages/user_pages/UserDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

// ✅ HERO PROPS FOR THIS PAGE (named export used in MainLayout)
export const userDashboardHero = {
  heroTitle: "",
  heroSubtitle: "",
  showHero: true, // keep header background visible
};

export default function UserDashboard() {
  const cards = [
    { title: "Profile", desc: "View your account details.", to: "/profile" },
    {
      title: "Update Profile",
      desc: "Edit your name, email, and phone.",
      to: "/update-profile",
    },
    {
      title: "Employee Dashboard",
      desc: "Dummy navigation link (role-based later).",
      to: "/employee-dashboard",
    },
  ];

  return (
    <>
      <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-transparent">
        <div className="sm:mx-auto sm:w-full sm:max-w-5xl">
          <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            User Dashboard
          </h2>
          <p className="mt-2 text-center text-sm/6 text-gray-500">
            Quick access to your account pages (dummy UI).
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-5xl">
          <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-gray-900/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Quick actions
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Connect real data after backend integration.
                </p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                User
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((c) => (
                <Link
                  key={c.title}
                  to={c.to}
                  className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/10 hover:ring-indigo-200 transition"
                >
                  <div className="text-sm font-semibold text-gray-900">
                    {c.title}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{c.desc}</p>
                  <div className="mt-4 text-xs font-semibold text-indigo-600">
                    Open →
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Back to Home
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm/6 font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Logout (Dummy)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
