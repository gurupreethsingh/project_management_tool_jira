import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaBug, FaCogs, FaChartBar } from "react-icons/fa";
import { SiJest, SiPostman } from "react-icons/si";

export default function QaAutomation() {
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
            <span className="text-slate-700">QA automation</span>
          </nav>

          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
                Software QA &amp; automation
              </h1>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl">
                We treat QA as an engineering discipline — combining automation,
                reporting and CI/CD so quality becomes measurable and
                repeatable.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                <SiJest className="text-[#99425B]" />
                <span>Jest / unit</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                <SiPostman className="text-[#FF6C37]" />
                <span>API testing</span>
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
                Our QA automation focus
              </h2>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex gap-2">
                  <FaCheckCircle className="mt-[3px] text-emerald-500 text-xs" />
                  <span>Regression and smoke suites for key flows.</span>
                </li>
                <li className="flex gap-2">
                  <FaCheckCircle className="mt-[3px] text-orange-500 text-xs" />
                  <span>
                    API testing, contract testing and test data setup.
                  </span>
                </li>
                <li className="flex gap-2">
                  <FaCheckCircle className="mt-[3px] text-indigo-500 text-xs" />
                  <span>CI/CD integration with dashboards and alerts.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 sm:p-6 bg-white shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center">
                  <FaBug className="text-xl text-rose-300" />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Catch issues before users do.
                </p>
              </div>
              <p className="text-sm text-slate-700">
                From UI checks to backend contracts, we aim to cover the paths
                that actually matter — and surface results in a clear, visual
                way.
              </p>

              <div className="mt-2 flex flex-wrap gap-3 text-[11px] sm:text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                  <FaCogs className="text-indigo-500" />
                  <span>Integrated with CI</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                  <FaChartBar className="text-emerald-500" />
                  <span>Coverage &amp; reports</span>
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
