"use client";

import React, { memo } from "react";
import {
  FaBug,
  FaCheckCircle,
  FaCode,
  FaLink,
  FaClock,
  FaFont,
  FaExclamationTriangle,
  FaWindowMaximize,
  FaMousePointer,
  FaKeyboard,
  FaListAlt,
  FaExternalLinkAlt,
  FaCogs,
  FaChartBar,
  FaDatabase,
  FaCloud,
  FaTools,
  FaServer,
  FaDesktop,
  FaTabletAlt,
  FaMobileAlt,
  FaProjectDiagram,
  FaVial,
} from "react-icons/fa";
import {
  SiJest,
  SiPostman,
  SiJenkins,
  SiGithub,
  SiGit,
  SiMysql,
  SiMongodb,
  SiPython,
  SiPlaywright,
} from "react-icons/si";
import qaBanner from "../../assets/images/qa_banner.jpg";

const HERO_TAGS = [
  "QA",
  "AUTOMATION",
  "API TESTING",
  "DATABASE TESTING",
  "CI/CD",
  "REPORTING",
];

const HERO_STYLE = {
  backgroundImage: `url(${qaBanner})`,
};

const QA_HIGHLIGHTS = [
  "Manual testing for complete software validation before release",
  "Automation testing for web applications and repeated business flows",
  "Hybrid framework design for scalable enterprise automation",
  "BDD framework implementation for readable collaboration-driven testing",
  "Selenium automation using Java and Python-based frameworks",
  "Pytest-based automation patterns for Python ecosystems",
  "Playwright automation for fast and modern UI testing",
  "API testing using Postman and Rest Assured",
  "Database testing for MySQL, Oracle and NoSQL MongoDB",
  "Regression, smoke, sanity, functional, integration and end-to-end testing",
  "Cross-browser, responsive, mobile, tablet and desktop validation",
  "CI/CD integration using Jenkins, Git and GitHub",
];

const FRAMEWORK_GROUPS = [
  {
    title: "Frameworks we work with",
    items: [
      "Hybrid framework",
      "BDD framework",
      "Selenium with Java",
      "Pytest using Python",
      "Playwright framework",
      "Manual + automation testing",
    ],
  },
  {
    title: "API, DB and backend validation",
    items: [
      "API testing",
      "Rest Assured framework",
      "Postman collections",
      "MySQL database testing",
      "Oracle database testing",
      "MongoDB / NoSQL database testing",
    ],
  },
  {
    title: "Delivery and release support",
    items: [
      "Jenkins pipeline integration",
      "Git and GitHub workflow support",
      "Regression reporting",
      "Defect tracking support",
      "Release validation",
      "Quality dashboards and visibility",
    ],
  },
];

const TECH_STACK = [
  {
    label: "Hybrid Framework",
    icon: <FaProjectDiagram className="text-indigo-500" />,
  },
  {
    label: "BDD Framework",
    icon: <FaCode className="text-purple-500" />,
  },
  {
    label: "Selenium Java",
    icon: <FaCogs className="text-sky-500" />,
  },
  {
    label: "Pytest / Python",
    icon: <SiPython className="text-blue-500" />,
  },
  {
    label: "Playwright",
    icon: <SiPlaywright className="text-emerald-500" />,
  },
  {
    label: "API Testing",
    icon: <SiPostman className="text-[#FF6C37]" />,
  },
  {
    label: "Rest Assured",
    icon: <FaServer className="text-rose-500" />,
  },
  {
    label: "MySQL",
    icon: <SiMysql className="text-blue-600" />,
  },
  {
    label: "Oracle DB",
    icon: <FaDatabase className="text-red-500" />,
  },
  {
    label: "MongoDB",
    icon: <SiMongodb className="text-green-600" />,
  },
  {
    label: "Jenkins",
    icon: <SiJenkins className="text-orange-500" />,
  },
  {
    label: "Git & GitHub",
    icon: (
      <span className="inline-flex items-center gap-1">
        <SiGit className="text-red-500" />
        <SiGithub className="text-slate-800" />
      </span>
    ),
  },
  {
    label: "Manual Testing",
    icon: <FaVial className="text-pink-500" />,
  },
  {
    label: "Automation Testing",
    icon: <FaBug className="text-amber-500" />,
  },
  {
    label: "CI/CD Ready",
    icon: <FaCloud className="text-indigo-500" />,
  },
  {
    label: "Coverage & Reports",
    icon: <FaChartBar className="text-emerald-500" />,
  },
];

const PRACTICE_PAGES = [
  {
    title: "Text Operations",
    path: "/text-operations",
    icon: <FaFont className="text-indigo-500" />,
    description:
      "Typing, clearing, getting text, value extraction, placeholders, and text validations.",
  },
  {
    title: "Alert Operations",
    path: "/alert-operations",
    icon: <FaExclamationTriangle className="text-amber-500" />,
    description:
      "Accept, dismiss, prompt handling, alert text checks and popup validation flows.",
  },
  {
    title: "Frame Operations",
    path: "/frame-operations",
    icon: <FaWindowMaximize className="text-sky-500" />,
    description:
      "Frame switching, nested frame handling and validations inside iframes.",
  },
  {
    title: "Scroll Operations",
    path: "/scroll-operations",
    icon: <FaDesktop className="text-emerald-500" />,
    description:
      "Scroll to element, top, bottom, lazy-loaded sections and viewport checks.",
  },
  {
    title: "Dropdown Operations",
    path: "/dropdown-operations",
    icon: <FaListAlt className="text-purple-500" />,
    description:
      "Single select, multi-select and custom dropdown automation patterns.",
  },
  {
    title: "Input Field Operations",
    path: "/input-field-operations",
    icon: <FaKeyboard className="text-pink-500" />,
    description:
      "Field states, placeholder checks, typing restrictions and input validations.",
  },
  {
    title: "Click Operations",
    path: "/click-operations",
    icon: <FaMousePointer className="text-rose-500" />,
    description:
      "Normal click, JS click, action click and safe clickability handling.",
  },
  {
    title: "Wait Operations",
    path: "/wait-operations",
    icon: <FaClock className="text-orange-500" />,
    description:
      "Thread.sleep, implicit wait, explicit wait, FluentWait and Playwright waiting.",
  },
  {
    title: "Broken Links Operations",
    path: "/broken-links-operations",
    icon: <FaLink className="text-cyan-500" />,
    description:
      "Find links, validate href values, inspect HTTP codes and report broken URLs.",
  },
];

function QaAutomation() {
  return (
    <div className="service-page-wrap min-h-screen">
      {/* HERO */}
      <section className="service-hero-section" style={HERO_STYLE}>
        <div className="service-hero-overlay-1" />
        <div className="service-hero-overlay-2" />
        <div className="service-hero-overlay-3" />

        <div className="service-hero-container">
          <div className="service-hero-layout">
            <div>
              <div className="service-tag-row">
                {HERO_TAGS.map((item) => (
                  <span key={item} className="service-tag-pill">
                    {item}
                  </span>
                ))}
              </div>

              <h1 className="service-hero-title">
                Software QA, testing &{" "}
                <span className="service-hero-title-highlight">
                  automation excellence
                </span>
              </h1>

              <p className="service-hero-text">
                One of the most powerful works of ECODERS is complete quality
                engineering for software delivery — covering manual testing,
                automation frameworks, API validation, database testing, CI/CD
                integration, reporting, and release confidence across real-world
                applications.
              </p>

              <div className="service-hero-status">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Manual + Automation · UI + API + DB · Delivery-ready quality
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                <span>Hybrid · BDD · Selenium · Playwright</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-200" />
                <span>API · DB · CI/CD · Reporting</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="service-main-wrap">
        <div className="service-main-container">
          {/* OVERVIEW */}
          <section className="service-grid-two">
            <div className="service-parent-card">
              <p className="service-badge-heading">ECODERS QA strength</p>
              <h2 className="service-main-heading">
                Complete testing work for software delivery
              </h2>
              <p className="service-paragraph">
                ECODERS supports the full quality lifecycle a company may need
                while delivering an application — from manual validation and UI
                automation to API checks, database testing, reporting,
                responsive validation, and pipeline-ready execution support.
              </p>

              <div className="space-y-3 mt-2">
                {QA_HIGHLIGHTS.map((item) => (
                  <div key={item} className="service-small-card">
                    <FaCheckCircle className="mt-1 text-emerald-500" />
                    <p className="service-list-paragraph">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card px-5 sm:px-6 py-5 sm:py-6">
              <p className="service-badge-heading">Why it matters</p>
              <h3 className="mt-2 text-base sm:text-lg font-semibold text-slate-900">
                Catch issues before users do
              </h3>
              <p className="mt-3 service-paragraph">
                From UI flows and backend contracts to MySQL, Oracle and MongoDB
                validations, the goal is to make quality measurable, repeatable,
                visible and dependable before the software reaches production
                users.
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Company delivery needs
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Functional testing, automation coverage, API and DB checks,
                    release validation, responsive testing, reporting and CI/CD
                    support.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    ECODERS demonstration area
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Students can use the practice pages below to learn key QA
                    and Selenium operation topics in separate focused modules.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FRAMEWORK / TOOL GROUPS */}
          <section>
            <h2 className="service-main-heading">
              Frameworks, tools and testing areas
            </h2>
            <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-5">
              {FRAMEWORK_GROUPS.map((group) => (
                <div key={group.title} className="service-parent-card">
                  <p className="service-badge-heading">{group.title}</p>
                  <div className="mt-2 space-y-3">
                    {group.items.map((item) => (
                      <div key={item} className="service-small-card">
                        <FaCheckCircle className="mt-1 text-indigo-500" />
                        <p className="service-list-paragraph">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* STACK ICON CARDS */}
          <section>
            <h2 className="service-main-heading">Technology coverage stack</h2>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
              {TECH_STACK.map((item) => (
                <div
                  key={item.label}
                  className="service-parent-card min-h-[110px] items-center justify-center text-center"
                >
                  <div className="text-lg sm:text-xl">{item.icon}</div>
                  <p className="text-sm font-medium text-slate-800 leading-snug">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* RESPONSIVE TESTING NOTE */}
          <section className="service-parent-card">
            <p className="service-badge-heading">Responsive quality focus</p>
            <h2 className="service-main-heading">
              Testing across every major screen type
            </h2>
            <p className="service-paragraph">
              Real software quality is not limited to desktop-only validation.
              ECODERS also considers responsive behavior, element visibility,
              clickability, alignment, layout stability and interaction quality
              across desktop, tablet and mobile views.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-700">
                <FaDesktop className="text-indigo-500" />
                <span>Desktop</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-700">
                <FaTabletAlt className="text-purple-500" />
                <span>Tablet</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-700">
                <FaMobileAlt className="text-emerald-500" />
                <span>Mobile</span>
              </div>
            </div>
          </section>

          {/* PRACTICE PAGES */}
          <section>
            <div>
              <p className="service-badge-heading">Demonstration topics</p>
              <h2 className="service-main-heading">
                Practice pages for students
              </h2>
              <p className="service-paragraph mt-2">
                Below are the topic pages currently available in the ECODERS QA
                practice area. Each topic opens in a separate tab for focused
                learning and hands-on testing demonstration.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {PRACTICE_PAGES.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noreferrer"
                  className="group service-parent-card hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                      {item.icon}
                    </div>
                    <FaExternalLinkAlt className="text-xs text-slate-400 group-hover:text-slate-700 transition-colors mt-1" />
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 service-small-paragraph">
                      {item.description}
                    </p>
                  </div>

                  <div className="inline-flex items-center text-xs sm:text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                    Open practice page
                    <FaExternalLinkAlt className="ml-2 text-[11px]" />
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* DELIVERY NOTE */}
          <section className="service-parent-card">
            <div className="flex items-start gap-3">
              <FaTools className="mt-1 text-slate-900" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  End-to-end QA delivery support
                </h2>
                <p className="mt-2 service-paragraph">
                  ECODERS can support the kind of testing work companies need
                  while delivering software or applications: requirement
                  understanding, test scenario preparation, manual testing,
                  automation scripting, API and database validation, pipeline
                  integration, release verification, reporting and ongoing
                  quality visibility.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default memo(QaAutomation);
