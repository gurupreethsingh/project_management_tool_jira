// src/pages/user_pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaKey } from "react-icons/fa";

// ✅ HERO PROPS FOR THIS PAGE
export const forgotPasswordHero = {
  heroTitle: "",
  heroSubtitle: "",
  showHero: true, // keep header background visible
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
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
          <FaKey className="mx-auto h-10 w-10 text-indigo-600" />

          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Forgot your password?
          </h2>

          <p className="mt-2 text-center text-sm/6 text-gray-500">
            Enter your registered email and we’ll send a reset link.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {!submitted ? (
            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email address
                </label>

                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Send reset link
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-lg bg-green-50 p-4 ring-1 ring-green-200">
              <p className="text-sm text-green-800">
                ✅ If an account exists for <strong>{email}</strong>, a password
                reset link has been sent.
              </p>
            </div>
          )}

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
