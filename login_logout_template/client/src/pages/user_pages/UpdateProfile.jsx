// src/pages/user_pages/UpdateProfile.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";

// ✅ HERO PROPS (used by MainLayout)
export const updateProfileHero = {
  heroTitle: "",
  heroSubtitle: "",
  showHero: true,
};

export default function UpdateProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 90000 00000",
  });

  function onSubmit(e) {
    e.preventDefault();
    alert("Dummy: Profile updated!");
    navigate("/profile");
  }

  const inputClass =
    "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 " +
    "ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 " +
    "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 " +
    "sm:text-sm/6";

  return (
    <>
      <div className="flex flex-col justify-center px-6 py-12 lg:px-8 bg-transparent">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <FaUserEdit className="mx-auto h-10 w-10 text-indigo-600" />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Update Profile
          </h2>
          <p className="mt-2 text-center text-sm/6 text-gray-500">
            Update your account details.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={onSubmit} className="space-y-6" noValidate>
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Full name
              </label>
              <div className="mt-2">
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Phone
              </label>
              <div className="mt-2">
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save changes
            </button>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Cancel and go back to{" "}
            <Link
              to="/profile"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Profile &rarr;
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
