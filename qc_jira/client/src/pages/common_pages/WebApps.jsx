import React from "react";
import { Link } from "react-router-dom";
import {
  FaMobileAlt,
  FaCheckCircle,
  FaTabletAlt,
  FaDesktop,
} from "react-icons/fa";
import { SiReact, SiJavascript, SiTailwindcss } from "react-icons/si";

export default function WebApps() {
  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
        <div className="absolute top-[-90px] left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[110px] opacity-80" />

        <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-9">
          <nav className="mb-2 text-xs sm:text-sm text-slate-500">
            <Link to="/homepage" className="hover:text-slate-900">
              Home
            </Link>{" "}
            <span className="mx-1">/</span>
            <Link to="/explore-solutions" className="hover:text-slate-900">
              Solutions
            </Link>{" "}
            <span className="mx-1">/</span>
            <span className="text-slate-700">Web &amp; mobile apps</span>
          </nav>

          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
                Web &amp; mobile platforms
              </h1>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl">
                Clean, fast interfaces for your teams and customers — designed
                for real operations, not just static demos.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                <SiReact className="text-[#61DAFB]" />
                <span>React</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                <SiTailwindcss className="text-[#38BDF8]" />
                <span>Tailwind</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="bg-white">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-9 lg:py-10 space-y-8">
          <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr),minmax(0,1fr)] gap-7">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">
                Patterns we specialise in
              </h2>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex gap-2">
                  <FaCheckCircle className="mt-[3px] text-indigo-500 text-xs" />
                  <span>Role-based dashboards and admin panels.</span>
                </li>
                <li className="flex gap-2">
                  <FaCheckCircle className="mt-[3px] text-emerald-500 text-xs" />
                  <span>Real-time data views using APIs and sockets.</span>
                </li>
                <li className="flex gap-2">
                  <FaCheckCircle className="mt-[3px] text-amber-500 text-xs" />
                  <span>Responsive layouts tuned for mobile and desktop.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 sm:p-6 bg-white shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center">
                  <FaMobileAlt className="text-xl text-emerald-300" />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Designed for all screens.
                </p>
              </div>
              <p className="text-sm text-slate-700">
                We optimise for quick loading, clear information hierarchy and
                predictable navigation — whether it&apos;s a project dashboard
                or an internal support tool.
              </p>

              <div className="mt-2 flex flex-wrap gap-3 text-[11px] sm:text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                  <FaDesktop className="text-indigo-500" />
                  <span>Desktop</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                  <FaTabletAlt className="text-purple-500" />
                  <span>Tablet</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                  <FaMobileAlt className="text-emerald-500" />
                  <span>Mobile</span>
                </span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 mb-3">
              Frontend stack we prefer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200 p-4 flex gap-3 items-start">
                <SiReact className="mt-1 text-2xl text-[#61DAFB]" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-900">
                    React-based UI
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-600">
                    Component-driven UIs that are easy to extend and maintain.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 flex gap-3 items-start">
                <SiJavascript className="mt-1 text-2xl text-[#F7DF1E]" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-900">
                    Modern JS
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-600">
                    Clean, modern JavaScript with best practices and patterns.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 flex gap-3 items-start">
                <SiTailwindcss className="mt-1 text-2xl text-[#38BDF8]" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-900">
                    TailwindCSS
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-600">
                    Utility-first styling for consistent and rapid UI builds.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
