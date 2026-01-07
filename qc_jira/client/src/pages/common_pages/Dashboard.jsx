// src/pages/common_pages/Dashboard.jsx
import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaUserCircle,
  FaEdit,
  FaFolderOpen,
  FaClipboardList,
  FaBug,
  FaPlusCircle,
  FaTasks,
  FaHistory,
  FaBell,
  FaCalendarAlt,
  FaFileAlt,
  FaCogs,
  FaChartLine,
  FaUsers,
  FaProjectDiagram,
  FaTools,
  FaGraduationCap,
  FaLaptopCode,
  FaHandshake,
  FaBriefcase,
  FaMoneyBillWave,
  FaRegLightbulb,
  FaRegCommentDots,
  FaEnvelopeOpenText,
  FaShieldAlt,
} from "react-icons/fa";

/**
 * ✅ Redesigned USER Dashboard (QC-JIRA)
 * - Mimics your sample page style: colors, typography, spacing, layout vibe
 * - No external links (only react-router <Link />)
 * - Focus: "user pages" only (safe for any logged-in user)
 * - Shows: what user can do in your QC-JIRA product + navigation tiles
 * - Includes special links: internships/jobs (paid/free), sample projects
 *
 * NOTE:
 * - Keep your route names as per App.jsx you shared.
 * - Some routes require params (/:id, /:projectId). For those, we provide
 *   "Open from inside project/profile pages" style CTAs or use placeholder IDs.
 * - If you have AuthManager/user context, you can replace the fallback IDs below.
 */

export default function Dashboard() {
  const navigate = useNavigate();

  // TODO: Replace these with real user state (AuthManager / redux / context)
  const user = useMemo(
    () => ({
      id: "me", // replace with actual userId if available
      name: "User",
      role: "customer", // not required, just informative
      email: "user@example.com",
    }),
    []
  );

  const safeLinks = useMemo(
    () => [
      {
        label: "My Profile",
        description: "View your account details and role access.",
        icon: FaUserCircle,
        href: `/profile/${user.id}`,
        colorClass: "text-indigo-500",
      },
      {
        label: "Update Profile",
        description: "Edit your name, password and personal info.",
        icon: FaEdit,
        href: `/update-profile/${user.id}`,
        colorClass: "text-purple-500",
      },
      {
        label: "My Assigned Projects",
        description: "See the projects you’re part of and jump in quickly.",
        icon: FaFolderOpen,
        href: `/user-assigned-projects/${user.id}`,
        colorClass: "text-sky-500",
      },
      {
        label: "All Projects",
        description: "Browse active projects you have access to.",
        icon: FaProjectDiagram,
        href: `/all-projects`,
        colorClass: "text-emerald-500",
      },
      {
        label: "All Reports",
        description: "Open generated reports for your work and audits.",
        icon: FaFileAlt,
        href: `/all-reports`,
        colorClass: "text-amber-500",
      },
      {
        label: "My Notifications",
        description: "Track updates: tasks, defects, comments and deadlines.",
        icon: FaBell,
        href: `/user-notifications`,
        colorClass: "text-rose-500",
      },
      {
        label: "User Events",
        description: "Your timelines, scheduled events and milestones.",
        icon: FaCalendarAlt,
        href: `/user-events`,
        colorClass: "text-indigo-500",
      },
      {
        label: "Careers",
        description: "Apply for roles & internships (paid and free).",
        icon: FaBriefcase,
        href: `/careers`,
        colorClass: "text-emerald-500",
      },
      {
        label: "Projects Showcase",
        description: "Ask for sample projects & reference builds.",
        icon: FaLaptopCode,
        href: `/projects`,
        colorClass: "text-sky-500",
      },
      {
        label: "Contact Us",
        description: "Raise queries, request demos, ask for sample projects.",
        icon: FaRegCommentDots,
        href: `/contact`,
        colorClass: "text-amber-500",
      },
    ],
    [user.id]
  );

  const qcJiraActivities = useMemo(
    () => [
      {
        name: "Projects & Modules",
        description:
          "Navigate into projects, explore scope and move across modules like requirements, scenarios, test cases, defects and tasks.",
        icon: FaProjectDiagram,
        href: "/all-projects",
        colorClass: "text-indigo-500",
      },
      {
        name: "Requirements Tracking",
        description:
          "View requirement lists, drill into requirement details and track change-ready items.",
        icon: FaClipboardList,
        href: "/all-projects",
        hint: "Open a project → Requirements",
        colorClass: "text-emerald-500",
      },
      {
        name: "Scenarios & Test Cases",
        description:
          "Review scenarios, open test case dashboards, traceability and test execution readiness.",
        icon: FaTools,
        href: "/all-projects",
        hint: "Open a project → Scenarios/Test Cases",
        colorClass: "text-sky-500",
      },
      {
        name: "Defects & Bug History",
        description:
          "Report defects, track status changes and inspect bug history for audit trails.",
        icon: FaBug,
        href: "/all-projects",
        hint: "Open a project → Defects",
        colorClass: "text-rose-500",
      },
      {
        name: "Tasks & Progress",
        description:
          "View tasks inside projects, check your assigned tasks and track task history.",
        icon: FaTasks,
        href: "/all-projects",
        hint: "Open a project → Tasks",
        colorClass: "text-amber-500",
      },
      {
        name: "Reports & Analytics",
        description:
          "Open generated reports for overall QA progress, timelines and quality metrics.",
        icon: FaChartLine,
        href: "/all-reports",
        colorClass: "text-purple-500",
      },
      {
        name: "Notifications",
        description:
          "Stay updated on assignments, defect movements, replies and system updates.",
        icon: FaBell,
        href: "/user-notifications",
        colorClass: "text-rose-500",
      },
      {
        name: "Events & Milestones",
        description:
          "Track project events, important dates, releases and QA milestones.",
        icon: FaCalendarAlt,
        href: "/user-events",
        colorClass: "text-emerald-500",
      },
    ],
    []
  );

  const specialActions = useMemo(
    () => [
      {
        title: "Apply for Internship (Free)",
        description:
          "Get internship tasks, mentorship and portfolio guidance (unpaid track).",
        icon: FaHandshake,
        href: "/careers",
        badge: "FREE",
        badgeClass: "bg-slate-900 text-white",
        colorClass: "text-sky-500",
      },
      {
        title: "Apply for Internship (Paid)",
        description:
          "Paid internship openings with real product work and measurable deliverables.",
        icon: FaMoneyBillWave,
        href: "/careers",
        badge: "PAID",
        badgeClass: "bg-slate-900 text-white",
        colorClass: "text-emerald-500",
      },
      {
        title: "Apply for Job",
        description:
          "Explore open roles and apply with your portfolio and GitHub links.",
        icon: FaBriefcase,
        href: "/careers",
        badge: "HIRING",
        badgeClass: "bg-slate-900 text-white",
        colorClass: "text-amber-500",
      },
      {
        title: "Request Sample Projects",
        description:
          "Ask for sample QC-JIRA setups, automation frameworks and reference projects.",
        icon: FaRegLightbulb,
        href: "/projects",
        badge: "SAMPLES",
        badgeClass: "bg-slate-900 text-white",
        colorClass: "text-purple-500",
      },
    ],
    []
  );

  const quickLinks = useMemo(
    () => [
      {
        label: "My Profile",
        icon: FaUserCircle,
        href: `/profile/${user.id}`,
        colorClass: "text-indigo-500",
      },
      {
        label: "My Projects",
        icon: FaFolderOpen,
        href: `/user-assigned-projects/${user.id}`,
        colorClass: "text-sky-500",
      },
      {
        label: "Notifications",
        icon: FaBell,
        href: "/user-notifications",
        colorClass: "text-rose-500",
      },
      {
        label: "Reports",
        icon: FaFileAlt,
        href: "/all-reports",
        colorClass: "text-amber-500",
      },
    ],
    [user.id]
  );

  return (
    <div className="bg-white text-slate-900">
      {/* ========================= HERO SECTION ========================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50" />
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20">
          {/* TOP BADGES */}
          <div className="flex flex-wrap gap-2 mb-4">
            {["QC-JIRA", "TASKS", "DEFECTS", "TEST CASES", "REPORTS"].map(
              (item) => (
                <span
                  key={item}
                  className="px-3 py-1 text-[11px] font-medium rounded-full bg-slate-900 text-white"
                >
                  {item}
                </span>
              )
            )}
          </div>

          {/* MAIN HERO GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* LEFT TEXT BLOCK */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-slate-900">
                Your QC-JIRA Workspace
                <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  Track Quality. Ship Confidently.
                </span>
              </h1>

              <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-600 max-w-xl leading-relaxed">
                Manage projects, requirements, scenarios, test cases, tasks and
                defects in one place. Use your dashboard to jump directly to
                what you need — fast, clean and audit-ready.
              </p>

              {/* CALL TO ACTION BUTTONS */}
              <div className="mt-7 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate(`/user-assigned-projects/${user.id}`)}
                  className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  Open My Projects
                </button>

                <button
                  onClick={() => navigate("/user-notifications")}
                  className="px-6 py-3 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                >
                  View Notifications
                </button>
              </div>

              {/* SMALL META */}
              <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
                  <FaShieldAlt className="text-slate-600" />
                  Role-aware access
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
                  <FaHistory className="text-slate-600" />
                  History & traceability
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
                  <FaEnvelopeOpenText className="text-slate-600" />
                  Updates & replies
                </span>
              </div>
            </div>

            {/* RIGHT — QUICK LINKS BOX */}
            <div className="relative">
              <div className="rounded-3xl bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 p-6 sm:p-8 flex flex-col gap-6">
                <div className="text-sm sm:text-base font-medium">
                  <span className="text-slate-900">Quick navigation</span>{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                    Dashboard shortcuts
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {quickLinks.map(
                    ({ label, icon: Icon, href, colorClass }, idx) => (
                      <Link
                        key={idx}
                        to={href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-sm hover:shadow-md"
                      >
                        <Icon className={`text-xl ${colorClass}`} />
                        <span className="text-sm font-medium text-slate-800">
                          {label}
                        </span>
                      </Link>
                    )
                  )}
                </div>

                {/* Helpful hint (no external link) */}
                <div className="text-xs text-slate-500 leading-relaxed border border-slate-200 rounded-2xl p-4 bg-slate-50">
                  Tip: Open a project to access scenarios, test cases, defects
                  and tasks inside that project workspace.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= QC-JIRA ACTIVITIES GRID ======================= */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 mb-2">
            What you can do in QC-JIRA
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-3xl">
            These are the main activities available to you as a logged-in user.
            Some actions open inside projects.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {qcJiraActivities.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="group border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-md group-hover:scale-105 transition-all">
                      <Icon className={`text-xl ${item.colorClass}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-slate-900 truncate">
                        {item.name}
                      </h3>
                      {item.hint ? (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.hint}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  <Link
                    to={item.href}
                    className="mt-5 inline-flex items-center text-xs text-slate-500 group-hover:text-slate-900 transition-colors"
                  >
                    Open <FaArrowRight className="ml-2 text-xs" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================= USER NAVIGATION (ONLY USER-SAFE PAGES) ======================= */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 mb-2">
            User navigation
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-3xl">
            Quick access to your pages (no admin/QA/dev role pages shown here).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {safeLinks.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  to={item.href}
                  className="group border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-md group-hover:scale-105 transition-all">
                      <Icon className={`text-xl ${item.colorClass}`} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {item.label}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 inline-flex items-center text-xs text-slate-500 group-hover:text-slate-900 transition-colors">
                    Go <FaArrowRight className="ml-2 text-xs" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================= SPECIAL ACTIONS (Careers / Internships / Samples) ======================= */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 mb-2">
            Special actions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-3xl">
            Apply for jobs or internships (paid/free), or request sample
            projects — all inside your application.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7">
            {specialActions.map((card, i) => {
              const Icon = card.icon;
              return (
                <Link
                  key={i}
                  to={card.href}
                  className="group border border-slate-200 rounded-3xl p-6 sm:p-8 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-md group-hover:scale-105 transition-all">
                        <Icon className={`text-xl ${card.colorClass}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                            {card.title}
                          </h3>
                          <span
                            className={`px-3 py-1 text-[11px] font-medium rounded-full ${card.badgeClass}`}
                          >
                            {card.badge}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xl">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    <FaArrowRight className="text-slate-400 group-hover:text-slate-900 transition-colors mt-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================= FOOTER MINI PANEL ======================= */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                Want a guided tour of QC-JIRA?
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-2xl">
                Use Contact Us to request a demo, sample project setup, or
                training on requirements → scenarios → test cases → defects →
                reports workflow.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/contact")}
                className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                Contact Support
              </button>

              <button
                onClick={() => navigate("/projects")}
                className="px-6 py-3 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
              >
                View Sample Projects
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
