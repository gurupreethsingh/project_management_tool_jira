import React from "react";
import { Link } from "react-router-dom";
import {
  FaBrain,
  FaNetworkWired,
  FaMobileAlt,
  FaCheckCircle,
  FaCogs,
  FaCloud,
  FaArrowRight,
} from "react-icons/fa";

const solutions = [
  {
    name: "AI Systems",
    description:
      "Summarisation, recommendations, anomaly detection and smart automations embedded directly into your tools.",
    href: "/ai-systems",
    icon: FaBrain,
    colorClass: "text-purple-500",
  },
  {
    name: "Blockchain Engineering",
    description:
      "Immutable audit logs, approval workflows and asset tracking with secure, tamper-proof records.",
    href: "/blockchain",
    icon: FaNetworkWired,
    colorClass: "text-emerald-500",
  },
  {
    name: "Web & Mobile Platforms",
    description:
      "Responsive dashboards, admin spaces and portals that keep teams and customers aligned.",
    href: "/web-apps",
    icon: FaMobileAlt,
    colorClass: "text-sky-500",
  },
  {
    name: "Software QA Automation",
    description:
      "Regression suites, API tests and visual dashboards wired into your CI/CD pipelines.",
    href: "/qa-automation",
    icon: FaCheckCircle,
    colorClass: "text-amber-500",
  },
  {
    name: "Cloud & DevOps",
    description:
      "Cloud-native architectures, infrastructure-as-code, observability and safe deployments.",
    href: "/explore-solutions",
    icon: FaCloud,
    colorClass: "text-indigo-500",
  },
  {
    name: "Custom Software Solutions",
    description:
      "Custom-built platforms, integrations and internal tools tuned to your exact workflows.",
    href: "/explore-solutions",
    icon: FaCogs,
    colorClass: "text-rose-500",
  },
];

export default function ExploreSolutions() {
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
            <span className="text-slate-700">Explore solutions</span>
          </nav>

          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
                Explore our software &amp; AI solutions
              </h1>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl">
                A quick overview of the core solution areas we work in — you can
                dive into each to see examples, patterns and how we plug into
                your existing stack.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION GRID */}
      <main className="bg-white">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-9 lg:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {solutions.map((solution) => {
              const Icon = solution.icon;
              return (
                <Link
                  key={solution.name}
                  to={solution.href}
                  className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 p-6 flex flex-col"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-md group-hover:scale-105 transition-transform">
                      <Icon className={`text-xl ${solution.colorClass}`} />
                    </div>
                    <h2 className="text-base font-semibold text-slate-900">
                      {solution.name}
                    </h2>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed flex-1">
                    {solution.description}
                  </p>
                  <span className="mt-4 inline-flex items-center text-xs font-medium text-slate-700 group-hover:text-slate-900">
                    View details
                    <FaArrowRight className="ml-2 text-[11px]" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
