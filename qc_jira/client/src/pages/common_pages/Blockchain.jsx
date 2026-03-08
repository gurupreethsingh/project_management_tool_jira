// "use client";

// import React, { memo } from "react";
// import { Link } from "react-router-dom";
// import { FaCheckCircle, FaLock, FaLink } from "react-icons/fa";
// import { SiHiveBlockchain, SiEthereum } from "react-icons/si";

// // ✅ change filename if yours is different
// import blockchainBanner from "../../assets/images/blockchain_banner.jpg";

// const HERO_TAGS = ["BLOCKCHAIN", "SECURITY", "AUDIT", "WORKFLOWS", "TRUST"];

// const HERO_STYLE = {
//   backgroundImage: `url(${blockchainBanner})`,
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

// function Blockchain() {
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
//                 Blockchain-backed{" "}
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)]">
//                   audit &amp; workflows
//                 </span>
//               </h1>

//               <p className="mt-3 text-xs sm:text-sm md:text-base text-white/90 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
//                 We use blockchain where it makes the most sense: tamper-proof
//                 logs for activities that must be proveable, traceable and
//                 secure.
//               </p>

//               <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 text-xs sm:text-sm text-black/90">
//                 <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
//                 Immutable records
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
//               <h2 className={MAIN_HEADING_STYLE}>Where blockchain fits best</h2>
//               <ul className="space-y-3 text-sm text-slate-700 mt-5">
//                 <li className="flex gap-2">
//                   <FaCheckCircle className="mt-[3px] text-emerald-500" />
//                   <span className={LIST_PARAGRAPH_STYLE}>
//                     Release approvals and deployment logs that must be
//                     tamper-proof.
//                   </span>
//                 </li>
//                 <li className="flex gap-2">
//                   <FaCheckCircle className="mt-[3px] text-sky-500" />
//                   <span className={LIST_PARAGRAPH_STYLE}>
//                     Change management and configuration history across multiple
//                     environments.
//                   </span>
//                 </li>
//                 <li className="flex gap-2">
//                   <FaCheckCircle className="mt-[3px] text-amber-500" />
//                   <span className={LIST_PARAGRAPH_STYLE}>
//                     Asset and contract lifecycle tracking.
//                   </span>
//                 </li>
//                 <li className="flex gap-2">
//                   <FaCheckCircle className="mt-[3px] text-slate-900" />
//                   <span className={LIST_PARAGRAPH_STYLE}>
//                     Approval trails and audit logs that remain verifiable across
//                     teams and systems.
//                   </span>
//                 </li>
//               </ul>
//             </div>

//             <div className={PARENT_DIV_STYLE}>
//               <div className="flex items-center gap-2">
//                 <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center">
//                   <SiHiveBlockchain className="text-xl text-[#FF6F00]" />
//                 </div>
//                 <h3 className={BADGE_MAIN_HEADING_STYLE}>
//                   Security without a painful UX.
//                 </h3>
//               </div>
//               <p className={PARAGRAPH_STYLE}>
//                 Your users stay inside familiar interfaces while blockchain
//                 works beneath the surface to guarantee integrity, traceability
//                 and trust.
//               </p>

//               <div className="mt-2 flex flex-wrap gap-3 text-[11px] sm:text-xs">
//                 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
//                   <FaLock className="text-emerald-500" />
//                   <span>Security first</span>
//                 </span>
//                 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
//                   <SiEthereum className="text-[#627EEA]" />
//                   <span>EVM-compatible</span>
//                 </span>
//               </div>
//             </div>
//           </section>

//           <section>
//             <h2 className={MAIN_HEADING_STYLE}>Example patterns</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
//               <div className={SMALL_DIV_STYLE}>
//                 <FaLink className="mt-1 text-indigo-500" />
//                 <div>
//                   <h4 className={SUB_HEADING_STYLE}>Release ledger</h4>
//                   <p className={SMALL_PARAGRAPH_STYLE}>
//                     Every release is written to an immutable ledger with
//                     relevant metadata.
//                   </p>
//                 </div>
//               </div>

//               <div className={SMALL_DIV_STYLE}>
//                 <FaLock className="mt-1 text-rose-500" />
//                 <div>
//                   <h4 className={SUB_HEADING_STYLE}>Signature workflows</h4>
//                   <p className={SMALL_PARAGRAPH_STYLE}>
//                     Approvals recorded as blockchain-backed actions instead of
//                     scattered emails.
//                   </p>
//                 </div>
//               </div>

//               <div className={SMALL_DIV_STYLE}>
//                 <SiHiveBlockchain className="mt-1 text-[#FF6F00]" />
//                 <div>
//                   <h4 className={SUB_HEADING_STYLE}>Immutable audit</h4>
//                   <p className={SMALL_PARAGRAPH_STYLE}>
//                     Full activity history that can&apos;t be quietly edited or
//                     deleted later.
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

// export default memo(Blockchain);

//

"use client";

import React, { memo } from "react";
import ServicePageRenderer from "../../components/common_components/ServicePageRenderer";

function Blockchain() {
  return <ServicePageRenderer serviceKey="blockchain" />;
}

export default memo(Blockchain);
