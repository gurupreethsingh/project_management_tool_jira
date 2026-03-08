// "use client";

// import React, { memo } from "react";
// import { Link } from "react-router-dom";
// import {
//   FaBrain,
//   FaNetworkWired,
//   FaMobileAlt,
//   FaCheckCircle,
//   FaCogs,
//   FaCloud,
//   FaArrowRight,
// } from "react-icons/fa";

// // ✅ change filename if yours is different
// import exploreSolutionsBanner from "../../assets/images/explore_solutions_banner.jpg";

// const HERO_TAGS = [
//   "SOLUTIONS",
//   "SOFTWARE",
//   "AI SYSTEMS",
//   "BLOCKCHAIN",
//   "CLOUD",
// ];

// const HERO_STYLE = {
//   backgroundImage: `url(${exploreSolutionsBanner})`,
// };

// const SOLUTIONS = [
//   {
//     name: "AI Systems",
//     description:
//       "Summarisation, recommendations, anomaly detection and smart automations embedded directly into your tools.",
//     href: "/ai-systems",
//     icon: FaBrain,
//     colorClass: "text-purple-500",
//   },
//   {
//     name: "Blockchain Engineering",
//     description:
//       "Immutable audit logs, approval workflows and asset tracking with secure, tamper-proof records.",
//     href: "/blockchain",
//     icon: FaNetworkWired,
//     colorClass: "text-emerald-500",
//   },
//   {
//     name: "Web & Mobile Platforms",
//     description:
//       "Responsive dashboards, admin spaces and portals that keep teams and customers aligned.",
//     href: "/web-apps",
//     icon: FaMobileAlt,
//     colorClass: "text-sky-500",
//   },
//   {
//     name: "Software QA Automation",
//     description:
//       "Regression suites, API tests and visual dashboards wired into your CI/CD pipelines.",
//     href: "/qa-automation",
//     icon: FaCheckCircle,
//     colorClass: "text-amber-500",
//   },
//   {
//     name: "Cloud & DevOps",
//     description:
//       "Cloud-native architectures, infrastructure-as-code, observability and safe deployments.",
//     href: "/explore-solutions",
//     icon: FaCloud,
//     colorClass: "text-indigo-500",
//   },
//   {
//     name: "Custom Software Solutions",
//     description:
//       "Custom-built platforms, integrations and internal tools tuned to your exact workflows.",
//     href: "/explore-solutions",
//     icon: FaCogs,
//     colorClass: "text-rose-500",
//   },
// ];

// function ExploreSolutions() {
//   return (
//     <div className="bg-white text-slate-900">
//       <section
//         className="relative overflow-hidden border-b border-slate-100 bg-cover bg-center bg-no-repeat"
//         style={HERO_STYLE}
//       >
//         <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-white/15 to-white/35" />
//         <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-black/35 via-black/10 to-transparent" />
//         <div className="absolute top-[-90px] left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-300/20 via-purple-300/20 to-pink-300/20 blur-[120px] opacity-70" />

//         <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-16">
//           <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-end md:justify-between">
//             <div>
//               <div className="mb-3 flex flex-wrap gap-2">
//                 {HERO_TAGS.map((item) => (
//                   <span
//                     key={item}
//                     className="px-3 py-1 text-[11px] font-medium rounded-full bg-black/65 text-white backdrop-blur-sm border border-white/20"
//                   >
//                     {item}
//                   </span>
//                 ))}
//               </div>

//               <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]">
//                 Explore our{" "}
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)]">
//                   software &amp; AI solutions
//                 </span>
//               </h1>

//               <p className="mt-3 text-xs sm:text-sm md:text-base text-white/90 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
//                 A quick overview of the core solution areas we work in — you can
//                 dive into each to see examples, patterns and how we plug into
//                 your existing stack.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       <main className="bg-white">
//         <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-9 lg:py-10">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
//             {SOLUTIONS.map((solution) => {
//               const Icon = solution.icon;
//               return (
//                 <Link
//                   key={solution.name}
//                   to={solution.href}
//                   className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 p-6 flex flex-col"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-md group-hover:scale-105 transition-transform">
//                       <Icon className={`text-xl ${solution.colorClass}`} />
//                     </div>
//                     <h2 className="text-base font-semibold text-slate-900">
//                       {solution.name}
//                     </h2>
//                   </div>
//                   <p className="mt-3 text-sm text-slate-600 leading-relaxed flex-1">
//                     {solution.description}
//                   </p>
//                   <span className="mt-4 inline-flex items-center text-xs font-medium text-slate-700 group-hover:text-slate-900">
//                     View details
//                     <FaArrowRight className="ml-2 text-[11px]" />
//                   </span>
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default memo(ExploreSolutions);

//

"use client";

import React, { memo } from "react";
import ServicePageRenderer from "../../components/common_components/ServicePageRenderer";

function ExploreSolutions() {
  return <ServicePageRenderer serviceKey="explore-solutions" />;
}

export default memo(ExploreSolutions);
