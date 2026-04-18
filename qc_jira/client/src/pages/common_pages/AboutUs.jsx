"use client";

import React, { memo } from "react";
import {
  FaProjectDiagram,
  FaCloud,
  FaRobot,
  FaUsers,
  FaBolt,
  FaMedal,
  FaHandsHelping,
} from "react-icons/fa";

import aboutBanner from "../../assets/images/about_banner.jpg";

const HERO_TAGS = ["ABOUT", "SOFTWARE", "AI SYSTEMS", "BLOCKCHAIN", "CLOUD"];

const HERO_STYLE = {
  backgroundImage: `url(${aboutBanner})`,
};

function AboutUs() {
  return (
    <div className="service-page-wrap min-h-screen">
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
                We build focused{" "}
                <span className="service-hero-title-highlight">
                  software, AI &amp; blockchain
                </span>{" "}
                systems for real teams
              </h1>

              <p className="service-hero-text">
                Our work is centered around modern software products — project
                platforms, automation tools, AI-assisted dashboards, and
                cloud-native systems — designed to be stable, scalable, and
                genuinely useful day to day.
              </p>

              <div className="service-hero-status">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Building products, not prototypes
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12 space-y-10 lg:space-y-14">
          <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1.1fr)] gap-6 lg:gap-10 items-start">
            <div>
              <h2 className="service-main-heading">Who we are</h2>
              <p className="mt-3 service-paragraph">
                We are a technology-driven software company focused on{" "}
                <span className="font-semibold text-slate-900">
                  building real products
                </span>{" "}
                — not just prototypes. Our work spans{" "}
                <span className="font-semibold text-slate-900">
                  AI &amp; automation
                </span>
                ,{" "}
                <span className="font-semibold text-slate-900">
                  cloud-native systems
                </span>{" "}
                and{" "}
                <span className="font-semibold text-slate-900">
                  modern web platforms
                </span>{" "}
                that power everyday operations for teams and businesses.
              </p>
              <p className="mt-3 service-paragraph">
                We take complex workflows — projects, tasks, approvals, and
                operations — and turn them into clean, intuitive tools. Product
                thinking, engineering discipline, and long-term ownership guide
                everything we ship.
              </p>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm px-5 sm:px-6 py-5 sm:py-6">
              <p className="service-badge-heading">Company snapshot</p>

              <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-semibold text-slate-900">
                    20+
                  </span>
                  <span className="mt-1 text-[11px] sm:text-xs text-slate-500">
                    Products &amp; tools designed
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-semibold text-slate-900">
                    50+
                  </span>
                  <span className="mt-1 text-[11px] sm:text-xs text-slate-500">
                    Projects delivered
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-semibold text-slate-900">
                    10+
                  </span>
                  <span className="mt-1 text-[11px] sm:text-xs text-slate-500">
                    Industries served
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-[11px] sm:text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
                    <FaCloud className="text-sm" />
                  </span>
                  <span>Cloud-native architecture &amp; microservices</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
                    <FaRobot className="text-sm" />
                  </span>
                  <span>AI &amp; automation embedded into workflows</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="service-main-heading">What we build</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mt-5">
              <article className="group rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-center gap-3 sm:gap-4 mb-3">
                  <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
                    <FaProjectDiagram className="text-xl sm:text-2xl" />
                  </div>
                  <h3 className="service-sub-heading">
                    Project &amp; operations platforms
                  </h3>
                </div>
                <p className="service-list-paragraph">
                  Custom tools for project tracking, task management, approvals,
                  and real-time visibility — designed around how your team
                  actually works.
                </p>
              </article>

              <article className="group rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-center gap-3 sm:gap-4 mb-3">
                  <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
                    <FaCloud className="text-xl sm:text-2xl" />
                  </div>
                  <h3 className="service-sub-heading">
                    AI, cloud &amp; blockchain solutions
                  </h3>
                </div>
                <p className="service-list-paragraph">
                  Intelligent services, automation pipelines, and secure
                  cloud-native systems leveraging AI, blockchain, and modern
                  infrastructure.
                </p>
              </article>

              <article className="group rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-center gap-3 sm:gap-4 mb-3">
                  <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
                    <FaBolt className="text-xl sm:text-2xl" />
                  </div>
                  <h3 className="service-sub-heading">
                    Automation &amp; internal tools
                  </h3>
                </div>
                <p className="service-list-paragraph">
                  Internal dashboards, automation scripts, integration layers,
                  and bots that remove repetitive work and speed up delivery.
                </p>
              </article>
            </div>
          </section>

          <section>
            <h2 className="service-main-heading">How we work with teams</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5 mt-5">
              {[
                [
                  "01 · Discover",
                  "Understand goals, pain points, existing tools, and constraints.",
                ],
                [
                  "02 · Design",
                  "Map workflows into clear interfaces, data models, and system architecture.",
                ],
                [
                  "03 · Build",
                  "Implement, integrate, and harden the product with reviews and automation.",
                ],
                [
                  "04 · Evolve",
                  "Iterate with feedback, metrics, and continuous improvement cycles.",
                ],
              ].map(([title, desc]) => (
                <div
                  key={title}
                  className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 text-center"
                >
                  <p className="service-badge-heading">{title}</p>
                  <p className="mt-2 text-xs sm:text-sm text-slate-700">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr),minmax(0,1.1fr)] gap-6 lg:gap-10 items-start">
            <div>
              <h2 className="service-main-heading">Our team &amp; culture</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-5">
                {[
                  [
                    FaUsers,
                    "Cross-functional teams",
                    "Engineers, product thinkers, designers, and data specialists working together from day one instead of in silos.",
                  ],
                  [
                    FaHandsHelping,
                    "Partnership mindset",
                    "We do not just deliver a codebase; we help shape roadmaps, priorities, and long-term product strategy.",
                  ],
                  [
                    FaRobot,
                    "Automation-first thinking",
                    "Whenever we see repetitive manual work, we ask how it can be automated, integrated, or augmented with AI.",
                  ],
                  [
                    FaMedal,
                    "Engineering discipline",
                    "Reviews, version control, environments, and observability are built into our process, not added later.",
                  ],
                ].map(([Icon, title, desc]) => (
                  <div
                    key={title}
                    className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 flex gap-3 sm:gap-4"
                  >
                    <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                      <Icon className="text-base" />
                    </div>
                    <div>
                      <h3 className="service-badge-heading">{title}</h3>
                      <p className="mt-1 service-small-paragraph">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 lg:p-7">
              <p className="service-badge-heading">
                Achievements &amp; milestones
              </p>

              <ul className="mt-4 space-y-3 text-[13px] sm:text-sm text-slate-700">
                <li className="flex gap-2">
                  <span className="mt-[6px] inline-block h-1.5 w-1.5 rounded-full bg-slate-900" />
                  <span>
                    Rolled out end-to-end project platforms for multiple teams,
                    covering planning, execution, and reporting.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] inline-block h-1.5 w-1.5 rounded-full bg-slate-500" />
                  <span>
                    Delivered AI-enabled modules that generate summaries,
                    insights, and dashboards from operational data.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] inline-block h-1.5 w-1.5 rounded-full bg-slate-500" />
                  <span>
                    Built reusable components and internal toolkits that reduce
                    time to launch for new projects and features.
                  </span>
                </li>
              </ul>

              <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-[12px] sm:text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Our goal:</span>{" "}
                build software that becomes a long-term asset for your
                organization — reliable, easy to evolve, and tightly aligned
                with how your teams operate.
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default memo(AboutUs);
