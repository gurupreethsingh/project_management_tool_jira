// "use client";

// import React, { memo } from "react";
// import { Link } from "react-router-dom";
// import {
//   FaMobileAlt,
//   FaCheckCircle,
//   FaTabletAlt,
//   FaDesktop,
// } from "react-icons/fa";
// import { SiReact, SiJavascript, SiTailwindcss } from "react-icons/si";

// // ✅ change filename if yours is different
// import webAppsBanner from "../../assets/images/web_banner4.jpg";

// const HERO_TAGS = ["WEB APPS", "MOBILE", "UI", "RESPONSIVE", "REACT"];

// const HERO_STYLE = {
//   backgroundImage: `url(${webAppsBanner})`,
// };

// const MAIN_HEADING_STYLE =
//   "text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 text-uppercase tracking-[0.1em]";

// const SUB_HEADING_STYLE = "text-sm sm:text-base font-semibold text-indigo-600";

// const BADGE_MAIN_HEADING_STYLE =
//   "text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700";

// const PARAGRAPH_STYLE = "text-sm sm:text-base text-slate-600 leading-relaxed";

// const SMALL_PARAGRAPH_STYLE =
//   "text-[12px] sm:text-xs text-slate-600 leading-relaxed";

// function WebApps() {
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
//                 Web &amp; mobile{" "}
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)]">
//                   platforms
//                 </span>
//               </h1>

//               <p className="mt-3 text-xs sm:text-sm md:text-base text-white/90 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
//                 Clean, fast interfaces for your teams and customers — designed
//                 for real operations, not just static demos.
//               </p>

//               <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 text-xs sm:text-sm text-black/90">
//                 <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
//                 React · Tailwind . Angular . Wordpress . Python . Java . Swift .
//                 Android Studios . React Native
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <main className="bg-white">
//         <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-9 lg:py-10 space-y-8">
//           <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr),minmax(0,1fr)] gap-7">
//             <div>
//               <h2 className={MAIN_HEADING_STYLE}>Patterns we specialise in</h2>
//               <ul className="space-y-3 text-sm text-slate-700 mt-3">
//                 <li className="flex gap-2">
//                   <FaCheckCircle className="mt-[3px] text-indigo-500" />
//                   <span className={PARAGRAPH_STYLE}>
//                     Role-based dashboards and admin panels.
//                   </span>
//                 </li>
//                 <li className="flex gap-2">
//                   <FaCheckCircle className="mt-[3px] text-emerald-500" />
//                   <span className={PARAGRAPH_STYLE}>
//                     Real-time data views using APIs and sockets.
//                   </span>
//                 </li>
//                 <li className="flex gap-2">
//                   <FaCheckCircle className="mt-[3px] text-amber-500" />
//                   <span className={PARAGRAPH_STYLE}>
//                     Responsive layouts tuned for mobile and desktop.
//                   </span>
//                 </li>
//               </ul>
//             </div>

//             <div className="rounded-2xl border border-slate-200 p-5 sm:p-6 bg-white shadow-sm flex flex-col gap-3">
//               <div className="flex items-center gap-2">
//                 <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center">
//                   <FaMobileAlt className="text-xl text-emerald-300" />
//                 </div>
//                 <p className={SUB_HEADING_STYLE}>Designed for all screens.</p>
//               </div>
//               <p className={PARAGRAPH_STYLE}>
//                 We optimise for quick loading, clear information hierarchy and
//                 predictable navigation — whether it&apos;s a project dashboard
//                 or an internal support tool.
//               </p>

//               <div className="mt-2 flex flex-wrap gap-3 text-[11px] sm:text-xs">
//                 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
//                   <FaDesktop className="text-indigo-500" />
//                   <span>Desktop</span>
//                 </span>
//                 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
//                   <FaTabletAlt className="text-purple-500" />
//                   <span>Tablet</span>
//                 </span>
//                 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
//                   <FaMobileAlt className="text-emerald-500" />
//                   <span>Mobile</span>
//                 </span>
//               </div>
//             </div>
//           </section>

//           <section>
//             <h2 className="text-sm sm:text-base font-semibold text-slate-900 mb-3">
//               Frontend stack we prefer
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div className="rounded-2xl border border-slate-200 p-4 flex gap-3 items-start">
//                 <SiReact className="mt-1 text-2xl text-[#61DAFB]" />
//                 <div>
//                   <p className="text-xs sm:text-sm font-medium text-slate-900">
//                     React-based UI
//                   </p>
//                   <p className="mt-1 text-[11px] sm:text-xs text-slate-600">
//                     Component-driven UIs that are easy to extend and maintain.
//                   </p>
//                 </div>
//               </div>
//               <div className="rounded-2xl border border-slate-200 p-4 flex gap-3 items-start">
//                 <SiJavascript className="mt-1 text-2xl text-[#F7DF1E]" />
//                 <div>
//                   <p className="text-xs sm:text-sm font-medium text-slate-900">
//                     Modern JS
//                   </p>
//                   <p className="mt-1 text-[11px] sm:text-xs text-slate-600">
//                     Clean, modern JavaScript with best practices and patterns.
//                   </p>
//                 </div>
//               </div>
//               <div className="rounded-2xl border border-slate-200 p-4 flex gap-3 items-start">
//                 <SiTailwindcss className="mt-1 text-2xl text-[#38BDF8]" />
//                 <div>
//                   <p className="text-xs sm:text-sm font-medium text-slate-900">
//                     TailwindCSS
//                   </p>
//                   <p className="mt-1 text-[11px] sm:text-xs text-slate-600">
//                     Utility-first styling for consistent and rapid UI builds.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default memo(WebApps);

"use client";

import React, { memo } from "react";
import ServicePageRenderer from "../../components/common_components/ServicePageRenderer";

function WebApps() {
  return <ServicePageRenderer serviceKey="web-apps" />;
}

export default memo(WebApps);
