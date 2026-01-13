import React, { useState } from "react";
import axios from "axios";
import { CalendarDaysIcon, HandRaisedIcon } from "@heroicons/react/24/outline";

// ✅ use the shared API base
import globalBackendRoute from "../config/Config";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("weekly");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${globalBackendRoute}/api/subscribe`, {
        email,
        subscriptionType,
      });
      setMessage(response.data.message);
      setEmail("");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div>
      <div className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 lg:max-w-none lg:grid-cols-2">
            {/* LEFT */}
            <div className="max-w-xl lg:max-w-lg">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Subscribe to Our Newsletter
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Stay informed about the latest updates in our software,
                automation, testing practices, and product improvements.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-6 flex max-w-md gap-x-3"
              >
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>

                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-w-0 flex-auto rounded-md border border-gray-300 bg-white px-3.5 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 sm:text-sm"
                />

                <button
                  type="submit"
                  className="flex-none rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Subscribe
                </button>
              </form>

              {message && (
                <p className="mt-4 text-sm text-emerald-600">{message}</p>
              )}
            </div>

            {/* RIGHT */}
            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
              <div className="flex flex-col items-start">
                <div className="rounded-md bg-white p-2 border border-gray-300">
                  <CalendarDaysIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-gray-800"
                  />
                </div>
                <dt className="mt-4 font-semibold text-gray-900">
                  Monthly Updates
                </dt>
                <dd className="mt-2 leading-7 text-gray-600">
                  Receive curated updates on product releases, QA automation,
                  testing strategies, and engineering progress.
                </dd>
              </div>

              <div className="flex flex-col items-start">
                <div className="rounded-md bg-white p-2 border border-gray-300">
                  <HandRaisedIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-gray-800"
                  />
                </div>
                <dt className="mt-4 font-semibold text-gray-900">No Spam</dt>
                <dd className="mt-2 leading-7 text-gray-600">
                  We respect your privacy. Only relevant and meaningful updates
                  — unsubscribe anytime.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
