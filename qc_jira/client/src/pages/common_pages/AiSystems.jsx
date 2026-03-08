// "use client";

// import React, { memo } from "react";
// import { Link } from "react-router-dom";
// import {
//   FaBrain,
//   FaRobot,
//   FaChartLine,
//   FaMagic,
//   FaCheckCircle,
// } from "react-icons/fa";
// import { SiTensorflow, SiPytorch, SiOpenai } from "react-icons/si";

// // ✅ change filename if yours is different
// import aiSystemsBanner from "../../assets/images/ai_banner.jpg";

// const HERO_TAGS = ["AI SYSTEMS", "AUTOMATION", "ML", "LLM APIs", "CLOUD"];

// const HERO_STYLE = {
//   backgroundImage: `url(${aiSystemsBanner})`,
// };

// const MAIN_HEADING_STYLE =
//   "text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 uppercase";

// const SUB_HEADING_STYLE = "text-sm sm:text-base font-semibold text-indigo-600";

// const BADGE_MAIN_HEADING_STYLE =
//   "text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700";

// const PARAGRAPH_STYLE = "text-sm sm:text-base text-slate-600 leading-relaxed";

// const SMALL_PARAGRAPH_STYLE =
//   "text-[12px] sm:text-xs text-slate-600 leading-relaxed";

// const LIST_PARAGRAPH_STYLE = "text-[13px] sm:text-sm text-slate-700";

// const PARENT_DIV_STYLE =
//   "rounded-2xl border border-slate-200 p-5 sm:p-6 bg-white shadow-sm flex flex-col gap-3";

// const SMALL_DIV_STYLE =
//   "rounded-2xl border border-slate-200 p-4 flex gap-3 items-start";

// function AiSystems() {
//   return (
//     <div className="bg-white text-slate-900">
//       {/* HERO */}
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
//                 AI systems &amp;{" "}
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)]">
//                   automation
//                 </span>
//               </h1>

//               <p className="mt-3 text-xs sm:text-sm md:text-base text-white/90 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
//                 We design AI components that plug into your existing tools:
//                 summarising work, predicting risks, recommending next actions
//                 and triggering automations.
//               </p>

//               <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 text-xs sm:text-sm text-black/90">
//                 <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
//                 Production-focused · Model-agnostic
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CONTENT */}
//       <main className="bg-white">
//         <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-9 lg:py-10 space-y-8 lg:space-y-9">
//           <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr),minmax(0,1fr)] gap-7 lg:gap-8">
//             <div>
//               <h2 className={MAIN_HEADING_STYLE}>What we build with AI</h2>
//               <ul className="space-y-3 text-sm text-slate-700 mt-5">
//                 <li className="flex gap-2">
//                   <FaCheckCircle className="mt-[3px] text-purple-500" />
//                   <span className={LIST_PARAGRAPH_STYLE}>
//                     Task, ticket and defect summarisation directly inside your
//                     dashboards.
//                   </span>
//                 </li>
//                 <li className="flex gap-2">
//                   <FaCheckCircle className="mt-[3px] text-indigo-500" />
//                   <span className={LIST_PARAGRAPH_STYLE}>
//                     Ranking &amp; recommendation models for priorities, owners
//                     and next actions.
//                   </span>
//                 </li>
//                 <li className="flex gap-2">
//                   <FaCheckCircle className="mt-[3px] text-pink-500" />
//                   <span className={LIST_PARAGRAPH_STYLE}>
//                     Natural language interfaces over project data, logs and
//                     knowledge bases.
//                   </span>
//                 </li>
//                 <li className="flex gap-2">
//                   <FaCheckCircle className="mt-[3px] text-slate-900" />
//                   <span className={LIST_PARAGRAPH_STYLE}>
//                     Automation flows that trigger based on AI signals (e.g.
//                     &quot;high risk&quot; or &quot;urgent&quot;).
//                   </span>
//                 </li>
//               </ul>
//             </div>

//             <div className={PARENT_DIV_STYLE}>
//               <div className="flex items-center gap-2">
//                 <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center">
//                   <FaBrain className="text-xl text-yellow-300" />
//                 </div>
//                 <h3 className={BADGE_MAIN_HEADING_STYLE}>
//                   AI as part of your product, not a separate toy.
//                 </h3>
//               </div>
//               <p className={PARAGRAPH_STYLE}>
//                 We focus on predictable behaviour, controllable prompts and
//                 clear fallbacks — so AI features feel like a reliable teammate,
//                 not a demo experiment.
//               </p>

//               <div className="mt-2 flex flex-wrap gap-3 text-[11px] sm:text-xs">
//                 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
//                   <SiTensorflow className="text-[#FF6F00]" />
//                   <span>TensorFlow</span>
//                 </span>
//                 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
//                   <SiPytorch className="text-[#EE4C2C]" />
//                   <span>PyTorch</span>
//                 </span>
//                 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
//                   <SiOpenai className="text-[#00A67E]" />
//                   <span>LLM APIs</span>
//                 </span>
//               </div>
//             </div>
//           </section>

//           <section>
//             <h2 className={MAIN_HEADING_STYLE}>
//               Typical AI patterns we implement
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
//               <div className={SMALL_DIV_STYLE}>
//                 <FaMagic className="mt-1 text-indigo-500" />
//                 <div>
//                   <h4 className={SUB_HEADING_STYLE}>Smart assist panels</h4>
//                   <p className={SMALL_PARAGRAPH_STYLE}>
//                     Inline AI &quot;assist&quot; for descriptions, comments,
//                     messages and test cases.
//                   </p>
//                 </div>
//               </div>
//               <div className={SMALL_DIV_STYLE}>
//                 <FaChartLine className="mt-1 text-emerald-500" />
//                 <div>
//                   <h4 className={SUB_HEADING_STYLE}>
//                     Forecasts &amp; insights
//                   </h4>
//                   <p className={SMALL_PARAGRAPH_STYLE}>
//                     Identify slow-moving items, blocked work and likely schedule
//                     risks.
//                   </p>
//                 </div>
//               </div>
//               <div className={SMALL_DIV_STYLE}>
//                 <FaRobot className="mt-1 text-pink-500" />
//                 <div>
//                   <p className={SUB_HEADING_STYLE}>Automation bots</p>
//                   <p className={SMALL_PARAGRAPH_STYLE}>
//                     Bots that watch your data and perform the boring actions
//                     automatically.
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

// export default memo(AiSystems);

// //

// // much smaller code.

// //

// // "use client";

// // import React, { memo } from "react";
// // import {
// //   FaBrain,
// //   FaRobot,
// //   FaChartLine,
// //   FaMagic,
// //   FaCheckCircle,
// // } from "react-icons/fa";
// // import { SiTensorflow, SiPytorch, SiOpenai } from "react-icons/si";

// // import ServiceHero from "../../components/common_components/ServiceHero";
// // import ServiceInfoCard from "../../components/common_components/ServiceInfoCard";
// // import ServiceFeatureCard from "../../components/common_components/ServiceFeatureCard";

// // import aiSystemsBanner from "../../assets/images/ai_banner.jpg";

// // const HERO_TAGS = ["AI SYSTEMS", "AUTOMATION", "ML", "LLM APIs", "CLOUD"];

// // function AiSystems() {
// //   return (
// //     <div className="service-page-wrap">
// //       <ServiceHero
// //         banner={aiSystemsBanner}
// //         tags={HERO_TAGS}
// //         titleStart="AI systems &"
// //         titleHighlight="automation"
// //         description="We design AI components that plug into your existing tools: summarising work, predicting risks, recommending next actions and triggering automations."
// //         statusText="Production-focused · Model-agnostic"
// //       />

// //       <main className="service-main-wrap">
// //         <div className="service-main-container">
// //           <section className="service-grid-two">
// //             <div>
// //               <h2 className="service-main-heading">What we build with AI</h2>

// //               <ul className="space-y-3 text-sm text-slate-700 mt-5">
// //                 <li className="flex gap-2">
// //                   <FaCheckCircle className="mt-[3px] text-purple-500" />
// //                   <span className="service-list-paragraph">
// //                     Task, ticket and defect summarisation directly inside your
// //                     dashboards.
// //                   </span>
// //                 </li>

// //                 <li className="flex gap-2">
// //                   <FaCheckCircle className="mt-[3px] text-indigo-500" />
// //                   <span className="service-list-paragraph">
// //                     Ranking &amp; recommendation models for priorities, owners
// //                     and next actions.
// //                   </span>
// //                 </li>

// //                 <li className="flex gap-2">
// //                   <FaCheckCircle className="mt-[3px] text-pink-500" />
// //                   <span className="service-list-paragraph">
// //                     Natural language interfaces over project data, logs and
// //                     knowledge bases.
// //                   </span>
// //                 </li>

// //                 <li className="flex gap-2">
// //                   <FaCheckCircle className="mt-[3px] text-slate-900" />
// //                   <span className="service-list-paragraph">
// //                     Automation flows that trigger based on AI signals such as
// //                     high risk or urgent conditions.
// //                   </span>
// //                 </li>
// //               </ul>
// //             </div>

// //             <ServiceInfoCard
// //               icon={<FaBrain className="text-xl text-yellow-300" />}
// //               title="AI as part of your product, not a separate toy."
// //               description="We focus on predictable behaviour, controllable prompts and clear fallbacks — so AI features feel like a reliable teammate, not a demo experiment."
// //               chips={[
// //                 {
// //                   icon: <SiTensorflow className="text-[#FF6F00]" />,
// //                   label: "TensorFlow",
// //                 },
// //                 {
// //                   icon: <SiPytorch className="text-[#EE4C2C]" />,
// //                   label: "PyTorch",
// //                 },
// //                 {
// //                   icon: <SiOpenai className="text-[#00A67E]" />,
// //                   label: "LLM APIs",
// //                 },
// //               ]}
// //             />
// //           </section>

// //           <section>
// //             <h2 className="service-main-heading">
// //               Typical AI patterns we implement
// //             </h2>

// //             <div className="service-grid-three">
// //               <ServiceFeatureCard
// //                 icon={<FaMagic className="mt-1 text-indigo-500" />}
// //                 title="Smart assist panels"
// //                 description='Inline AI "assist" for descriptions, comments, messages and test cases.'
// //               />

// //               <ServiceFeatureCard
// //                 icon={<FaChartLine className="mt-1 text-emerald-500" />}
// //                 title="Forecasts & insights"
// //                 description="Identify slow-moving items, blocked work and likely schedule risks."
// //               />

// //               <ServiceFeatureCard
// //                 icon={<FaRobot className="mt-1 text-pink-500" />}
// //                 title="Automation bots"
// //                 description="Bots that watch your data and perform the boring actions automatically."
// //               />
// //             </div>
// //           </section>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }

// // export default memo(AiSystems);

"use client";

import React, { memo } from "react";
import ServicePageRenderer from "../../components/common_components/ServicePageRenderer";

function AiSystems() {
  return <ServicePageRenderer serviceKey="ai-systems" />;
}

export default memo(AiSystems);
