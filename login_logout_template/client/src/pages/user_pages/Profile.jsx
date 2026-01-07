// src/pages/user_pages/Profile.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

// ✅ HERO PROPS (used by MainLayout)
export const profileHero = {
  heroTitle: "",
  heroSubtitle: "",
  showHero: true,
};

export default function Profile() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 90000 00000",
    role: "User",
  };

  const inputClass =
    "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 " +
    "ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 " +
    "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 " +
    "sm:text-sm/6";

  return (
    <>
      <div className="flex flex-col justify-center px-6 py-12 lg:px-8 bg-transparent">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <FaUser className="mx-auto h-10 w-10 text-indigo-600" />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            My Profile
          </h2>
          <p className="mt-2 text-center text-sm/6 text-gray-500">
            View your account details.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              Full name
            </label>
            <div className="mt-2">
              <input value={user.name} disabled className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input value={user.email} disabled className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              Phone
            </label>
            <div className="mt-2">
              <input value={user.phone} disabled className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              Role
            </label>
            <div className="mt-2">
              <input value={user.role} disabled className={inputClass} />
            </div>
          </div>

          <Link
            to="/update-profile"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Update Profile
          </Link>

          <p className="mt-6 text-center text-sm/6 text-gray-500">
            Back to{" "}
            <Link
              to="/user-dashboard"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Dashboard &rarr;
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
