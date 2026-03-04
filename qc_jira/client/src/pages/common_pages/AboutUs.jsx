// import React from "react";
// import {
//   FaProjectDiagram,
//   FaCloud,
//   FaRobot,
//   FaUsers,
//   FaBolt,
//   FaMedal,
//   FaHandsHelping,
// } from "react-icons/fa";

// export default function AboutUs() {
//   return (
//     <div className="bg-white min-h-screen text-slate-900">
//       {/* HERO — MATCHES HOMEPAGE STYLE (LIGHT, MODERN, GRADIENT TEXT) */}
//       <section className="relative overflow-hidden border-b border-slate-100">
//         <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
//         <div className="absolute top-[-90px] left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] opacity-80" />

//         <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
//           <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-end md:justify-between">
//             <div>
//               <div className="mb-3 flex flex-wrap gap-2">
//                 {["ABOUT", "SOFTWARE", "AI SYSTEMS", "BLOCKCHAIN", "CLOUD"].map(
//                   (item) => (
//                     <span
//                       key={item}
//                       className="px-3 py-1 text-[11px] font-medium rounded-full bg-slate-900 text-white"
//                     >
//                       {item}
//                     </span>
//                   ),
//                 )}
//               </div>

//               <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
//                 We build focused{" "}
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
//                   software, AI &amp; blockchain
//                 </span>{" "}
//                 systems for real teams
//               </h1>
//               <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl leading-relaxed">
//                 Our work is centred around modern software products – project
//                 platforms, automation tools, AI-assisted dashboards and
//                 cloud-native systems – designed to be stable, scalable and
//                 genuinely useful day-to-day.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* MAIN CONTENT */}
//       <main className="bg-white">
//         <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12 space-y-10 lg:space-y-14">
//           {/* WHO WE ARE + STATS */}
//           <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1.1fr)] gap-6 lg:gap-10 items-start">
//             {/* Left: text */}
//             <div>
//               <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900">
//                 Who we are
//               </h2>
//               <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
//                 We are a technology-driven software company focused on{" "}
//                 <span className="font-semibold text-slate-900">
//                   building real products
//                 </span>{" "}
//                 – not just prototypes. Our work spans{" "}
//                 <span className="font-semibold text-slate-900">
//                   AI &amp; automation
//                 </span>
//                 ,{" "}
//                 <span className="font-semibold text-slate-900">
//                   cloud-native systems
//                 </span>{" "}
//                 and{" "}
//                 <span className="font-semibold text-slate-900">
//                   modern web platforms
//                 </span>{" "}
//                 that power everyday operations for teams and businesses.
//               </p>
//               <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
//                 We take complex workflows – projects, tasks, approvals,
//                 operations – and turn them into clean, intuitive tools. Product
//                 thinking, engineering discipline and long-term ownership guide
//                 everything we ship.
//               </p>
//             </div>

//             {/* Right: company snapshot (cleaner, more modern card) */}
//             <div className="rounded-3xl bg-white shadow-sm border border-slate-200 px-5 sm:px-6 py-5 sm:py-6">
//               <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
//                 Company snapshot
//               </p>
//               <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4 text-center">
//                 <div className="flex flex-col items-center">
//                   <span className="text-xl sm:text-2xl font-semibold text-slate-900">
//                     20+
//                   </span>
//                   <span className="mt-1 text-[11px] sm:text-xs text-slate-500">
//                     Products &amp; tools designed
//                   </span>
//                 </div>
//                 <div className="flex flex-col items-center">
//                   <span className="text-xl sm:text-2xl font-semibold text-slate-900">
//                     50+
//                   </span>
//                   <span className="mt-1 text-[11px] sm:text-xs text-slate-500">
//                     Projects delivered
//                   </span>
//                 </div>
//                 <div className="flex flex-col items-center">
//                   <span className="text-xl sm:text-2xl font-semibold text-slate-900">
//                     10+
//                   </span>
//                   <span className="mt-1 text-[11px] sm:text-xs text-slate-500">
//                     Industries served
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-[11px] sm:text-xs text-slate-600">
//                 <div className="flex items-center gap-2">
//                   <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
//                     <FaCloud className="text-sm" />
//                   </span>
//                   <span>Cloud-native architecture &amp; microservices</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
//                     <FaRobot className="text-sm" />
//                   </span>
//                   <span>AI &amp; automation embedded into workflows</span>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* WHAT WE BUILD */}
//           <section>
//             <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900 mb-4 sm:mb-5">
//               What we build
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
//               {/* Card 1 */}
//               <article className="group rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
//                 <div className="flex items-center gap-3 sm:gap-4 mb-3">
//                   <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
//                     <FaProjectDiagram className="text-xl sm:text-2xl" />
//                   </div>
//                   <h3 className="text-sm sm:text-base font-semibold text-slate-900">
//                     Project &amp; operations platforms
//                   </h3>
//                 </div>
//                 <p className="text-[13px] sm:text-sm text-slate-600 leading-relaxed">
//                   Custom tools for project tracking, task management, approvals
//                   and real-time visibility – designed around how your team
//                   actually works.
//                 </p>
//               </article>

//               {/* Card 2 */}
//               <article className="group rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
//                 <div className="flex items-center gap-3 sm:gap-4 mb-3">
//                   <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
//                     <FaCloud className="text-xl sm:text-2xl" />
//                   </div>
//                   <h3 className="text-sm sm:text-base font-semibold text-slate-900">
//                     AI, cloud &amp; blockchain solutions
//                   </h3>
//                 </div>
//                 <p className="text-[13px] sm:text-sm text-slate-600 leading-relaxed">
//                   Intelligent services, automation pipelines and secure
//                   cloud-native systems leveraging AI, blockchain and modern
//                   infrastructure.
//                 </p>
//               </article>

//               {/* Card 3 */}
//               <article className="group rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
//                 <div className="flex items-center gap-3 sm:gap-4 mb-3">
//                   <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
//                     <FaBolt className="text-xl sm:text-2xl" />
//                   </div>
//                   <h3 className="text-sm sm:text-base font-semibold text-slate-900">
//                     Automation &amp; internal tools
//                   </h3>
//                 </div>
//                 <p className="text-[13px] sm:text-sm text-slate-600 leading-relaxed">
//                   Internal dashboards, automation scripts, integration layers
//                   and bots that remove repetitive work and speed up delivery.
//                 </p>
//               </article>
//             </div>
//           </section>

//           {/* HOW WE WORK */}
//           <section>
//             <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900 mb-4 sm:mb-5">
//               How we work with teams
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5">
//               <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 text-center">
//                 <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
//                   01 · Discover
//                 </p>
//                 <p className="mt-2 text-xs sm:text-sm text-slate-700">
//                   Understand goals, pain points, existing tools and constraints.
//                 </p>
//               </div>
//               <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 text-center">
//                 <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
//                   02 · Design
//                 </p>
//                 <p className="mt-2 text-xs sm:text-sm text-slate-700">
//                   Map workflows into clear interfaces, data models and system
//                   architecture.
//                 </p>
//               </div>
//               <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 text-center">
//                 <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
//                   03 · Build
//                 </p>
//                 <p className="mt-2 text-xs sm:text-sm text-slate-700">
//                   Implement, integrate and harden the product with reviews and
//                   automation.
//                 </p>
//               </div>
//               <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 text-center">
//                 <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
//                   04 · Evolve
//                 </p>
//                 <p className="mt-2 text-xs sm:text-sm text-slate-700">
//                   Iterate with feedback, metrics and continuous improvement
//                   cycles.
//                 </p>
//               </div>
//             </div>
//           </section>

//           {/* TEAM & CULTURE / ACHIEVEMENTS */}
//           <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr),minmax(0,1.1fr)] gap-6 lg:gap-10 items-start">
//             {/* Team / culture */}
//             <div>
//               <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900 mb-4 sm:mb-5">
//                 Our team &amp; culture
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
//                 <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 flex gap-3 sm:gap-4">
//                   <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
//                     <FaUsers className="text-base" />
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-semibold text-slate-900">
//                       Cross-functional teams
//                     </h3>
//                     <p className="mt-1 text-[12px] sm:text-xs text-slate-600 leading-relaxed">
//                       Engineers, product thinkers, designers and data folks
//                       working together from day one instead of in silos.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 flex gap-3 sm:gap-4">
//                   <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
//                     <FaHandsHelping className="text-base" />
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-semibold text-slate-900">
//                       Partnership mindset
//                     </h3>
//                     <p className="mt-1 text-[12px] sm:text-xs text-slate-600 leading-relaxed">
//                       We don&apos;t just deliver a codebase; we help shape
//                       roadmaps, priorities and long-term product strategy.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 flex gap-3 sm:gap-4">
//                   <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
//                     <FaRobot className="text-base" />
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-semibold text-slate-900">
//                       Automation-first thinking
//                     </h3>
//                     <p className="mt-1 text-[12px] sm:text-xs text-slate-600 leading-relaxed">
//                       Whenever we see repetitive manual work, we ask how we can
//                       automate, integrate or augment it with AI.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 flex gap-3 sm:gap-4">
//                   <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
//                     <FaMedal className="text-base" />
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-semibold text-slate-900">
//                       Engineering discipline
//                     </h3>
//                     <p className="mt-1 text-[12px] sm:text-xs text-slate-600 leading-relaxed">
//                       Reviews, version control, environments and observability
//                       are built into our process, not added later.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Achievements / highlight card */}
//             <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 lg:p-7">
//               <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
//                 Achievements &amp; milestones
//               </p>
//               <ul className="mt-4 space-y-3 text-[13px] sm:text-sm text-slate-700">
//                 <li className="flex gap-2">
//                   <span className="mt-[6px] inline-block h-1.5 w-1.5 rounded-full bg-slate-900" />
//                   <span>
//                     Rolled out end-to-end project platforms for multiple teams,
//                     covering planning, execution and reporting.
//                   </span>
//                 </li>
//                 <li className="flex gap-2">
//                   <span className="mt-[6px] inline-block h-1.5 w-1.5 rounded-full bg-slate-500" />
//                   <span>
//                     Delivered AI-enabled modules that generate summaries,
//                     insights and dashboards from operational data.
//                   </span>
//                 </li>
//                 <li className="flex gap-2">
//                   <span className="mt-[6px] inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
//                   <span>
//                     Built reusable components and internal toolkits that reduce
//                     time-to-launch for new projects and features.
//                   </span>
//                 </li>
//               </ul>

//               <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-[12px] sm:text-xs text-slate-700">
//                 <span className="font-semibold text-slate-900">Our goal:</span>{" "}
//                 build software that becomes a long-term asset for your
//                 organisation – reliable, easy to evolve, and tightly aligned
//                 with how your teams operate.
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }

// with background image.

"use client";

import React from "react";
import {
  FaProjectDiagram,
  FaCloud,
  FaRobot,
  FaUsers,
  FaBolt,
  FaMedal,
  FaHandsHelping,
} from "react-icons/fa";

// ✅ OS-independent, build-safe import (Windows + Linux server safe)
import aboutBanner from "../../assets/images/about_banner.jpg"; // ✅ change filename if yours is different

export default function AboutUs() {
  return (
    <div className="bg-white min-h-screen text-slate-900">
      {/* HERO — WITH BACKGROUND IMAGE (MORE VISIBLE) */}
      <section
        className="relative overflow-hidden border-b border-slate-100 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${aboutBanner})`,
        }}
      >
        {/* ✅ Light overlay kept minimal so image is VERY visible,
            but adds enough contrast for text */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-white/15 to-white/35" />

        {/* ✅ Extra contrast layer behind text only (not full screen) */}
        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-black/35 via-black/10 to-transparent" />

        {/* ✅ Subtle glow (kept, but not overpowering) */}
        <div className="absolute top-[-90px] left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-300/20 via-purple-300/20 to-pink-300/20 blur-[120px] opacity-70" />

        <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-16">
          <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                {["ABOUT", "SOFTWARE", "AI SYSTEMS", "BLOCKCHAIN", "CLOUD"].map(
                  (item) => (
                    <span
                      key={item}
                      className="px-3 py-1 text-[11px] font-medium rounded-full bg-black/65 text-white backdrop-blur-sm border border-white/20"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>

              {/* ✅ Text made white + shadow for visibility */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]">
                We build focused{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)]">
                  software, AI &amp; blockchain
                </span>{" "}
                systems for real teams
              </h1>

              <p className="mt-3 text-xs sm:text-sm md:text-base text-white/90 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                Our work is centred around modern software products – project
                platforms, automation tools, AI-assisted dashboards and
                cloud-native systems – designed to be stable, scalable and
                genuinely useful day-to-day.
              </p>

              {/* ✅ Small glass strip behind text (optional premium look) */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 text-xs sm:text-sm text-black/90">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Building products, not prototypes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="bg-white">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12 space-y-10 lg:space-y-14">
          {/* WHO WE ARE + STATS */}
          <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1.1fr)] gap-6 lg:gap-10 items-start">
            {/* Left: text */}
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900">
                Who we are
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                We are a technology-driven software company focused on{" "}
                <span className="font-semibold text-slate-900">
                  building real products
                </span>{" "}
                – not just prototypes. Our work spans{" "}
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
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                We take complex workflows – projects, tasks, approvals,
                operations – and turn them into clean, intuitive tools. Product
                thinking, engineering discipline and long-term ownership guide
                everything we ship.
              </p>
            </div>

            {/* Right: company snapshot (cleaner, more modern card) */}
            <div className="rounded-3xl bg-white shadow-sm border border-slate-200 px-5 sm:px-6 py-5 sm:py-6">
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Company snapshot
              </p>
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

          {/* WHAT WE BUILD */}
          <section>
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900 mb-4 sm:mb-5">
              What we build
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {/* Card 1 */}
              <article className="group rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-center gap-3 sm:gap-4 mb-3">
                  <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
                    <FaProjectDiagram className="text-xl sm:text-2xl" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                    Project &amp; operations platforms
                  </h3>
                </div>
                <p className="text-[13px] sm:text-sm text-slate-600 leading-relaxed">
                  Custom tools for project tracking, task management, approvals
                  and real-time visibility – designed around how your team
                  actually works.
                </p>
              </article>

              {/* Card 2 */}
              <article className="group rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-center gap-3 sm:gap-4 mb-3">
                  <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
                    <FaCloud className="text-xl sm:text-2xl" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                    AI, cloud &amp; blockchain solutions
                  </h3>
                </div>
                <p className="text-[13px] sm:text-sm text-slate-600 leading-relaxed">
                  Intelligent services, automation pipelines and secure
                  cloud-native systems leveraging AI, blockchain and modern
                  infrastructure.
                </p>
              </article>

              {/* Card 3 */}
              <article className="group rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-center gap-3 sm:gap-4 mb-3">
                  <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
                    <FaBolt className="text-xl sm:text-2xl" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                    Automation &amp; internal tools
                  </h3>
                </div>
                <p className="text-[13px] sm:text-sm text-slate-600 leading-relaxed">
                  Internal dashboards, automation scripts, integration layers
                  and bots that remove repetitive work and speed up delivery.
                </p>
              </article>
            </div>
          </section>

          {/* HOW WE WORK */}
          <section>
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900 mb-4 sm:mb-5">
              How we work with teams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5">
              <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 text-center">
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  01 · Discover
                </p>
                <p className="mt-2 text-xs sm:text-sm text-slate-700">
                  Understand goals, pain points, existing tools and constraints.
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 text-center">
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  02 · Design
                </p>
                <p className="mt-2 text-xs sm:text-sm text-slate-700">
                  Map workflows into clear interfaces, data models and system
                  architecture.
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 text-center">
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  03 · Build
                </p>
                <p className="mt-2 text-xs sm:text-sm text-slate-700">
                  Implement, integrate and harden the product with reviews and
                  automation.
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 text-center">
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  04 · Evolve
                </p>
                <p className="mt-2 text-xs sm:text-sm text-slate-700">
                  Iterate with feedback, metrics and continuous improvement
                  cycles.
                </p>
              </div>
            </div>
          </section>

          {/* TEAM & CULTURE / ACHIEVEMENTS */}
          <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr),minmax(0,1.1fr)] gap-6 lg:gap-10 items-start">
            {/* Team / culture */}
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900 mb-4 sm:mb-5">
                Our team &amp; culture
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 flex gap-3 sm:gap-4">
                  <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                    <FaUsers className="text-base" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Cross-functional teams
                    </h3>
                    <p className="mt-1 text-[12px] sm:text-xs text-slate-600 leading-relaxed">
                      Engineers, product thinkers, designers and data folks
                      working together from day one instead of in silos.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 flex gap-3 sm:gap-4">
                  <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                    <FaHandsHelping className="text-base" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Partnership mindset
                    </h3>
                    <p className="mt-1 text-[12px] sm:text-xs text-slate-600 leading-relaxed">
                      We don&apos;t just deliver a codebase; we help shape
                      roadmaps, priorities and long-term product strategy.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 flex gap-3 sm:gap-4">
                  <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                    <FaRobot className="text-base" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Automation-first thinking
                    </h3>
                    <p className="mt-1 text-[12px] sm:text-xs text-slate-600 leading-relaxed">
                      Whenever we see repetitive manual work, we ask how we can
                      automate, integrate or augment it with AI.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 flex gap-3 sm:gap-4">
                  <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                    <FaMedal className="text-base" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Engineering discipline
                    </h3>
                    <p className="mt-1 text-[12px] sm:text-xs text-slate-600 leading-relaxed">
                      Reviews, version control, environments and observability
                      are built into our process, not added later.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements / highlight card */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 lg:p-7">
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Achievements &amp; milestones
              </p>
              <ul className="mt-4 space-y-3 text-[13px] sm:text-sm text-slate-700">
                <li className="flex gap-2">
                  <span className="mt-[6px] inline-block h-1.5 w-1.5 rounded-full bg-slate-900" />
                  <span>
                    Rolled out end-to-end project platforms for multiple teams,
                    covering planning, execution and reporting.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] inline-block h-1.5 w-1.5 rounded-full bg-slate-500" />
                  <span>
                    Delivered AI-enabled modules that generate summaries,
                    insights and dashboards from operational data.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span>
                    Built reusable components and internal toolkits that reduce
                    time-to-launch for new projects and features.
                  </span>
                </li>
              </ul>

              <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-[12px] sm:text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Our goal:</span>{" "}
                build software that becomes a long-term asset for your
                organisation – reliable, easy to evolve, and tightly aligned
                with how your teams operate.
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
