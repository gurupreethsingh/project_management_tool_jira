import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const projects = [
  {
    name: "AI-Powered Project Management",
    description:
      "A full project management platform with AI-driven task insights, risk flags, and automated status summaries for each sprint.",
    image:
      "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://example.com/ai-project-management",
    tags: ["AI Systems", "Dashboards", "Automation"],
  },
  {
    name: "Blockchain Release Audit Trail",
    description:
      "Immutable blockchain-based audit trail for releases, approvals and configuration changes across multiple environments.",
    image:
      "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://example.com/blockchain-audit",
    tags: ["Blockchain", "Security", "Compliance"],
  },
  {
    name: "Real-Time Web & Mobile Analytics",
    description:
      "Responsive web and mobile interfaces that surface live metrics, error trends and deployment health in a single view.",
    image:
      "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://example.com/web-mobile-analytics",
    tags: ["Web Apps", "Mobile", "Cloud"],
  },
  {
    name: "QA Automation Command Center",
    description:
      "Central hub for running regression suites, API tests and visualizing CI/CD pipeline performance and defect flow.",
    image:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://example.com/qa-automation",
    tags: ["QA Automation", "CI/CD", "Dashboards"],
  },
  // Add / replace with your real projects as needed
];

export default function Projects() {
  return (
    <div className="bg-white min-h-screen text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
        <div className="absolute top-[-90px] left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] opacity-80" />

        <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
          {/* Breadcrumbs */}
          <nav className="mb-3 text-xs sm:text-sm text-slate-500">
            <Link to="/homepage" className="hover:text-slate-900">
              Home
            </Link>{" "}
            <span className="mx-1">/</span>
            <span className="text-slate-700">Projects</span>
          </nav>

          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
                Projects &amp; product work
              </h1>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl">
                A snapshot of the platforms, tools and systems we&apos;ve
                crafted — from AI-powered dashboards to blockchain-backed audit
                trails and automation command centers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT GRID */}
      <main className="bg-white">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {projects.map((project) => (
              <a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-40 sm:h-48 w-full overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-70 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                    {project.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/85 text-slate-900 backdrop-blur"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col">
                  <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                    {project.name}
                  </h2>
                  <p className="mt-2 text-[13px] sm:text-sm text-slate-600 leading-relaxed flex-1">
                    {project.description}
                  </p>

                  <div className="mt-4 flex items-center text-xs font-medium text-slate-700 group-hover:text-slate-900">
                    Open project site
                    <FaArrowRight className="ml-2 text-[11px]" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
