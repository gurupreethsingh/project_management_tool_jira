// // // // import React from "react";
// // // // import { FaArrowRight } from "react-icons/fa";
// // // // import ai from "../../assets/home_page/ai.jpg";
// // // // import block_chain from "../../assets/home_page/block_chain.jpg";
// // // // import chat_gpt from "../../assets/home_page/chat_gpt.jpg";
// // // // import deep_learning from "../../assets/home_page/deep_learning.jpg";
// // // // import code from "../../assets/home_page/code.jpg";
// // // // import robot from "../../assets/home_page/robot.jpg";

// // // // const features = [
// // // //   {
// // // //     name: "AI and Machine Learning Solutions",
// // // //     description:
// // // //       "Transform your business with cutting-edge AI and machine learning solutions designed to optimize operations and enhance decision-making.",
// // // //     link: "/ai-ml-solutions",
// // // //     icon: <FaArrowRight className="text-indigo-600" />,
// // // //   },
// // // //   {
// // // //     name: "Blockchain Development",
// // // //     description:
// // // //       "Build secure, scalable, and efficient blockchain solutions tailored to meet the demands of today’s digital economy.",
// // // //     link: "/blockchain-development",
// // // //     icon: <FaArrowRight className="text-indigo-600" />,
// // // //   },
// // // //   {
// // // //     name: "Web and Mobile Applications",
// // // //     description:
// // // //       "Develop responsive, user-friendly web and mobile applications that engage customers and drive business growth.",
// // // //     link: "/web-mobile-apps",
// // // //     icon: <FaArrowRight className="text-indigo-600" />,
// // // //   },
// // // //   {
// // // //     name: "Software Testing and QA",
// // // //     description:
// // // //       "Ensure the reliability and performance of your software with our comprehensive testing and quality assurance services.",
// // // //     link: "/software-testing",
// // // //     icon: <FaArrowRight className="text-indigo-600" />,
// // // //   },
// // // //   {
// // // //     name: "Custom Client Solutions",
// // // //     description:
// // // //       "Leverage our expertise in MERN, Next.js, and WordPress to create tailored solutions that meet your unique business needs.",
// // // //     link: "/custom-client-solutions",
// // // //     icon: <FaArrowRight className="text-indigo-600" />,
// // // //   },
// // // //   {
// // // //     name: "Training and Placement Services",
// // // //     description:
// // // //       "Empower your team with hands-on training and real-world project experience, supported by our industry-leading placement services.",
// // // //     link: "/training-placement",
// // // //     icon: <FaArrowRight className="text-indigo-600" />,
// // // //   },
// // // // ];

// // // // export default function Homepage() {
// // // //   return (
// // // //     <div className="bg-white">
// // // //       {/* wider, consistent with rest of app */}
// // // //       <div className="mx-auto container px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
// // // //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-10 items-start">
// // // //           {/* Left: text + features */}
// // // //           <div>
// // // //             <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-700">
// // // //               Empowering Businesses with Innovative Software Solutions
// // // //             </h2>
// // // //             <p className="mt-4 text-sm md:text-base text-gray-500 leading-relaxed">
// // // //               We are a leading software company committed to driving business
// // // //               transformation through technology. With expertise in AI,
// // // //               blockchain, web and mobile applications, software testing, and
// // // //               custom client solutions, we empower organizations to innovate and
// // // //               thrive in a competitive market. Our solutions are designed to be
// // // //               robust, scalable, and aligned with your strategic goals, ensuring
// // // //               you stay ahead of the curve in today&apos;s rapidly evolving
// // // //               digital landscape. Partner with us to unlock new opportunities and
// // // //               achieve sustainable growth.
// // // //             </p>

// // // //             <dl className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
// // // //               {features.map((feature) => (
// // // //                 <div
// // // //                   key={feature.name}
// // // //                   className="border-t border-gray-200 pt-3"
// // // //                 >
// // // //                   <dt className="font-medium text-gray-800 flex items-center justify-between gap-3">
// // // //                     <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-[11px] md:text-xs text-indigo-700 font-semibold">
// // // //                       {feature.name}
// // // //                     </span>
// // // //                     {feature.icon}
// // // //                   </dt>
// // // //                   <dd className="mt-2 text-xs md:text-sm text-gray-500">
// // // //                     {feature.description}
// // // //                   </dd>
// // // //                 </div>
// // // //               ))}
// // // //             </dl>
// // // //           </div>

// // // //           {/* Right: image grid */}
// // // //           <div className="grid grid-cols-2 grid-rows-2 gap-4 lg:gap-5 mt-4 lg:mt-0">
// // // //             <img
// // // //               alt="AI and Machine Learning"
// // // //               src={ai}
// // // //               className="rounded-lg bg-gray-100 object-cover w-full h-full"
// // // //             />
// // // //             <img
// // // //               alt="Blockchain Development"
// // // //               src={robot}
// // // //               className="rounded-lg bg-gray-100 object-cover w-full h-full"
// // // //             />
// // // //             <img
// // // //               alt="Web and Mobile Applications"
// // // //               src={chat_gpt}
// // // //               className="rounded-lg bg-gray-100 object-cover w-full h-full"
// // // //             />
// // // //             <img
// // // //               alt="Software Testing"
// // // //               src={deep_learning}
// // // //               className="rounded-lg bg-gray-100 object-cover w-full h-full"
// // // //             />
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // import React from "react";
// // // import {
// // //   FaArrowRight,
// // //   FaBrain,
// // //   FaNetworkWired,
// // //   FaMobileAlt,
// // //   FaCheckCircle,
// // //   FaCogs,
// // //   FaChalkboardTeacher,
// // // } from "react-icons/fa";

// // // const features = [
// // //   {
// // //     name: "AI and Machine Learning Solutions",
// // //     description:
// // //       "Transform your business with cutting-edge AI and machine learning solutions designed to optimize operations and enhance decision-making.",
// // //     link: "/ai-ml-solutions",
// // //     icon: FaBrain,
// // //   },
// // //   {
// // //     name: "Blockchain Development",
// // //     description:
// // //       "Build secure, scalable, and efficient blockchain solutions tailored to meet the demands of today’s digital economy.",
// // //     link: "/blockchain-development",
// // //     icon: FaNetworkWired,
// // //   },
// // //   {
// // //     name: "Web and Mobile Applications",
// // //     description:
// // //       "Develop responsive, user-friendly web and mobile applications that engage customers and drive business growth.",
// // //     link: "/web-mobile-apps",
// // //     icon: FaMobileAlt,
// // //   },
// // //   {
// // //     name: "Software Testing and QA",
// // //     description:
// // //       "Ensure the reliability and performance of your software with our comprehensive testing and quality assurance services.",
// // //     link: "/software-testing",
// // //     icon: FaCheckCircle,
// // //   },
// // //   {
// // //     name: "Custom Client Solutions",
// // //     description:
// // //       "Leverage our expertise in MERN, Next.js, and WordPress to create tailored solutions that meet your unique business needs.",
// // //     link: "/custom-client-solutions",
// // //     icon: FaCogs,
// // //   },
// // //   {
// // //     name: "Training and Placement Services",
// // //     description:
// // //       "Empower your team with hands-on training and real-world project experience, supported by our industry-leading placement services.",
// // //     link: "/training-placement",
// // //     icon: FaChalkboardTeacher,
// // //   },
// // // ];

// // // export default function Homepage() {
// // //   return (
// // //     <div className="bg-slate-950 min-h-screen text-slate-50">
// // //       {/* HERO */}
// // //       <section className="relative overflow-hidden">
// // //         {/* gradient background */}
// // //         <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700" />

// // //         {/* blurred accent blobs */}
// // //         <div className="pointer-events-none absolute -top-10 -right-16 h-56 w-56 rounded-full bg-pink-400/40 blur-3xl" />
// // //         <div className="pointer-events-none absolute bottom-0 -left-10 h-64 w-64 rounded-full bg-indigo-500/40 blur-3xl" />

// // //         <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20">
// // //           <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] gap-10 lg:gap-14 items-center">
// // //             {/* Left: main copy (unchanged text) */}
// // //             <div>
// // //               <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-pink-200 mb-4">
// // //                 SOFTWARE · AI · BLOCKCHAIN · CLOUD
// // //               </p>

// // //               <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug lg:leading-tight">
// // //                 Empowering Businesses with Innovative Software Solutions
// // //               </h1>

// // //               <p className="mt-4 text-xs sm:text-sm md:text-base text-slate-100/90 leading-relaxed">
// // //                 We are a leading software company committed to driving business
// // //                 transformation through technology. With expertise in AI,
// // //                 blockchain, web and mobile applications, software testing, and
// // //                 custom client solutions, we empower organizations to innovate
// // //                 and thrive in a competitive market. Our solutions are designed
// // //                 to be robust, scalable, and aligned with your strategic goals,
// // //                 ensuring you stay ahead of the curve in today&apos;s rapidly
// // //                 evolving digital landscape. Partner with us to unlock new
// // //                 opportunities and achieve sustainable growth.
// // //               </p>

// // //               <div className="mt-6 flex flex-wrap gap-3 text-[11px] sm:text-xs">
// // //                 <span className="inline-flex items-center rounded-full bg-indigo-500/80 px-4 py-1.5 font-semibold tracking-tight shadow shadow-indigo-900/60">
// // //                   AI · Blockchain · Web & Mobile
// // //                 </span>
// // //                 <span className="inline-flex items-center rounded-full border border-pink-300/60 bg-pink-500/10 px-4 py-1.5 font-medium text-pink-100">
// // //                   Testing · QA · Training
// // //                 </span>
// // //               </div>
// // //             </div>

// // //             {/* Right: stacked modern cards with icons */}
// // //             <div className="flex flex-col gap-4 sm:gap-5">
// // //               <div className="rounded-2xl border border-indigo-500/40 bg-slate-950/40 backdrop-blur-md px-5 py-4 shadow-xl shadow-indigo-950/70">
// // //                 <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-indigo-200">
// // //                   What we deliver
// // //                 </p>
// // //                 <p className="mt-2 text-sm sm:text-base font-semibold text-slate-50">
// // //                   Intelligent, secure, scalable solutions designed around your
// // //                   business goals.
// // //                 </p>
// // //               </div>

// // //               <div className="grid grid-cols-2 gap-3 sm:gap-4">
// // //                 <div className="rounded-xl border border-purple-400/40 bg-purple-900/40 px-4 py-4 flex flex-col gap-3">
// // //                   <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-400 via-purple-400 to-pink-400 text-slate-950 shadow-md shadow-slate-900/80">
// // //                     <FaBrain />
// // //                   </div>
// // //                   <div className="text-[11px] sm:text-xs text-slate-100/90">
// // //                     AI & Machine Learning
// // //                   </div>
// // //                 </div>

// // //                 <div className="rounded-xl border border-pink-400/40 bg-pink-900/40 px-4 py-4 flex flex-col gap-3">
// // //                   <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400 text-slate-950 shadow-md shadow-slate-900/80">
// // //                     <FaNetworkWired />
// // //                   </div>
// // //                   <div className="text-[11px] sm:text-xs text-slate-100/90">
// // //                     Blockchain & Secure Systems
// // //                   </div>
// // //                 </div>

// // //                 <div className="rounded-xl border border-indigo-400/40 bg-indigo-900/40 px-4 py-4 flex flex-col gap-3">
// // //                   <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-400 via-pink-400 to-purple-400 text-slate-950 shadow-md shadow-slate-900/80">
// // //                     <FaMobileAlt />
// // //                   </div>
// // //                   <div className="text-[11px] sm:text-xs text-slate-100/90">
// // //                     Web & Mobile Apps
// // //                   </div>
// // //                 </div>

// // //                 <div className="rounded-xl border border-slate-400/40 bg-slate-900/60 px-4 py-4 flex flex-col gap-3">
// // //                   <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-purple-400 via-indigo-400 to-pink-400 text-slate-950 shadow-md shadow-slate-900/80">
// // //                     <FaCheckCircle />
// // //                   </div>
// // //                   <div className="text-[11px] sm:text-xs text-slate-100/90">
// // //                     Testing · QA · Reliability
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* subtle divider line */}
// // //           <div className="mt-10 sm:mt-12 h-px w-full bg-gradient-to-r from-transparent via-slate-200/30 to-transparent" />
// // //         </div>
// // //       </section>

// // //       {/* FEATURE GRID */}
// // //       <section className="bg-slate-950">
// // //         <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-18">
// // //           <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7 sm:mb-10">
// // //             <div>
// // //               <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-50">
// // //                 Services we specialise in
// // //               </h2>
// // //               <p className="mt-2 text-[11px] sm:text-xs md:text-sm text-slate-400 max-w-xl">
// // //                 From concept to deployment, we cover the full lifecycle —
// // //                 strategy, development, testing, and training.
// // //               </p>
// // //             </div>
// // //             <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-400">
// // //               <span className="inline-block h-2 w-2 rounded-full bg-pink-400" />
// // //               <span className="inline-block h-2 w-2 rounded-full bg-purple-400" />
// // //               <span className="inline-block h-2 w-2 rounded-full bg-indigo-400" />
// // //               <span className="uppercase tracking-[0.2em] ml-2">
// // //                 Pink · Purple · Indigo
// // //               </span>
// // //             </div>
// // //           </div>

// // //           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
// // //             {features.map((feature) => {
// // //               const Icon = feature.icon;
// // //               return (
// // //                 <article
// // //                   key={feature.name}
// // //                   className="group relative flex flex-col rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950/90 p-4 sm:p-5 hover:border-pink-500/70 hover:shadow-[0_18px_60px_-35px_rgba(248,113,181,0.9)] transition-all duration-200"
// // //                 >
// // //                   {/* top row */}
// // //                   <div className="flex items-start gap-3">
// // //                     <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-slate-900/80">
// // //                       <Icon className="text-sm sm:text-base" />
// // //                     </div>
// // //                     <div className="flex-1">
// // //                       <h3 className="text-xs sm:text-sm font-semibold text-slate-50 leading-snug">
// // //                         {feature.name}
// // //                       </h3>
// // //                     </div>
// // //                   </div>

// // //                   {/* description */}
// // //                   <p className="mt-3 text-[11px] sm:text-sm text-slate-300 leading-relaxed flex-1">
// // //                     {feature.description}
// // //                   </p>

// // //                   {/* bottom row – keep link text but don’t change behaviour */}
// // //                   <div className="mt-4 flex items-center justify-between text-[10px] sm:text-xs text-slate-400">
// // //                     <span className="truncate max-w-[70%]">{feature.link}</span>
// // //                     <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 group-hover:border-pink-400 group-hover:bg-gradient-to-tr group-hover:from-pink-500 group-hover:via-purple-500 group-hover:to-indigo-500 group-hover:text-white transition-all duration-200">
// // //                       <FaArrowRight className="text-[11px]" />
// // //                     </span>
// // //                   </div>

// // //                   {/* gradient border overlay on hover */}
// // //                   <div className="pointer-events-none absolute inset-px rounded-2xl border border-transparent group-hover:border-pink-400/60 group-hover:shadow-[0_0_0_1px_rgba(139,92,246,0.4)] transition-all duration-200" />
// // //                 </article>
// // //               );
// // //             })}
// // //           </div>
// // //         </div>
// // //       </section>
// // //     </div>
// // //   );
// // // }

// // // till here darker theme.

// // // lighter theme.

// // import React from "react";
// // import {
// //   FaArrowRight,
// //   FaBrain,
// //   FaNetworkWired,
// //   FaMobileAlt,
// //   FaCheckCircle,
// //   FaCogs,
// //   FaChalkboardTeacher,
// // } from "react-icons/fa";

// // const features = [
// //   {
// //     name: "AI and Machine Learning Solutions",
// //     description:
// //       "Transform your business with cutting-edge AI and machine learning solutions designed to optimize operations and enhance decision-making.",
// //     link: "/ai-ml-solutions",
// //     icon: FaBrain,
// //   },
// //   {
// //     name: "Blockchain Development",
// //     description:
// //       "Build secure, scalable, and efficient blockchain solutions tailored to meet the demands of today’s digital economy.",
// //     link: "/blockchain-development",
// //     icon: FaNetworkWired,
// //   },
// //   {
// //     name: "Web and Mobile Applications",
// //     description:
// //       "Develop responsive, user-friendly web and mobile applications that engage customers and drive business growth.",
// //     link: "/web-mobile-apps",
// //     icon: FaMobileAlt,
// //   },
// //   {
// //     name: "Software Testing and QA",
// //     description:
// //       "Ensure the reliability and performance of your software with our comprehensive testing and quality assurance services.",
// //     link: "/software-testing",
// //     icon: FaCheckCircle,
// //   },
// //   {
// //     name: "Custom Client Solutions",
// //     description:
// //       "Leverage our expertise in MERN, Next.js, and WordPress to create tailored solutions that meet your unique business needs.",
// //     link: "/custom-client-solutions",
// //     icon: FaCogs,
// //   },
// //   {
// //     name: "Training and Placement Services",
// //     description:
// //       "Empower your team with hands-on training and real-world project experience, supported by our industry-leading placement services.",
// //     link: "/training-placement",
// //     icon: FaChalkboardTeacher,
// //   },
// // ];

// // export default function Homepage() {
// //   return (
// //     <div className="bg-white min-h-screen text-slate-700">
// //       {/* HERO SECTION — LIGHT GRADIENT */}
// //       <section className="relative overflow-hidden">
// //         {/* Soft gradient background */}
// //         <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400" />

// //         {/* soft blurred color blobs */}
// //         <div className="pointer-events-none absolute -top-10 -right-16 h-56 w-56 rounded-full bg-pink-200/50 blur-3xl" />
// //         <div className="pointer-events-none absolute bottom-0 -left-10 h-64 w-64 rounded-full bg-indigo-200/50 blur-3xl" />

// //         <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20">
// //           <div className=" mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] gap-10 lg:gap-14 items-center">
// //             {/* LEFT — TEXT (UNCHANGED CONTENT) */}
// //             <div>
// //               <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-pink-500 mb-4">
// //                 SOFTWARE · AI · BLOCKCHAIN · CLOUD
// //               </p>

// //               <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 leading-snug lg:leading-tight">
// //                 Empowering Businesses with Innovative Software Solutions
// //               </h1>

// //               <p className="mt-4 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-semibold">
// //                 We are a leading software company committed to driving business
// //                 transformation through technology. With expertise in AI,
// //                 blockchain, web and mobile applications, software testing, and
// //                 custom client solutions, we empower organizations to innovate
// //                 and thrive in a competitive market.
// //               </p>

// //               <div className="mt-6 flex flex-wrap gap-3 text-[11px] sm:text-xs">
// //                 <span className="inline-flex items-center rounded-full bg-indigo-200 px-4 py-1.5 font-semibold tracking-tight text-indigo-700 shadow">
// //                   AI · Blockchain · Web & Mobile
// //                 </span>
// //                 <span className="inline-flex items-center rounded-full bg-pink-200 px-4 py-1.5 font-medium text-pink-700 shadow">
// //                   Testing · QA · Training
// //                 </span>
// //               </div>
// //             </div>

// //             {/* RIGHT — MODERN CARDS */}
// //             <div className="flex flex-col gap-4 sm:gap-5">
// //               <div className="rounded-2xl border border-indigo-200 bg-white/70 backdrop-blur-sm px-5 py-4 shadow">
// //                 <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-indigo-500">
// //                   What we deliver
// //                 </p>
// //                 <p className="mt-2 text-sm sm:text-base font-semibold text-slate-700">
// //                   Intelligent, secure, scalable solutions designed around your
// //                   business goals.
// //                 </p>
// //               </div>

// //               <div className="grid grid-cols-2 gap-3 sm:gap-4">
// //                 {/* CARD 1 */}
// //                 <div className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-4 flex flex-col gap-3 shadow-sm">
// //                   <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-300 via-purple-300 to-pink-300 text-slate-700 shadow">
// //                     <FaBrain />
// //                   </div>
// //                   <div className="text-[11px] sm:text-xs text-slate-700">
// //                     AI & Machine Learning
// //                   </div>
// //                 </div>

// //                 {/* CARD 2 */}
// //                 <div className="rounded-xl border border-pink-200 bg-pink-50 px-4 py-4 flex flex-col gap-3 shadow-sm">
// //                   <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-300 text-slate-700 shadow">
// //                     <FaNetworkWired />
// //                   </div>
// //                   <div className="text-[11px] sm:text-xs text-slate-700">
// //                     Blockchain & Secure Systems
// //                   </div>
// //                 </div>

// //                 {/* CARD 3 */}
// //                 <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-4 flex flex-col gap-3 shadow-sm">
// //                   <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-300 via-pink-300 to-purple-300 text-slate-700 shadow">
// //                     <FaMobileAlt />
// //                   </div>
// //                   <div className="text-[11px] sm:text-xs text-slate-700">
// //                     Web & Mobile Apps
// //                   </div>
// //                 </div>

// //                 {/* CARD 4 */}
// //                 <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 flex flex-col gap-3 shadow-sm">
// //                   <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-purple-300 via-indigo-300 to-pink-300 text-slate-700 shadow">
// //                     <FaCheckCircle />
// //                   </div>
// //                   <div className="text-[11px] sm:text-xs text-slate-700">
// //                     Testing · QA · Reliability
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Light divider */}
// //           <div className="mt-10 sm:mt-12 h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
// //         </div>
// //       </section>

// //       {/* FEATURE GRID — LIGHT VERSION */}
// //       <section className="bg-gradient-to-br from-white via-indigo-50 to-purple-50">
// //         <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-18">
// //           {/* Section Header */}
// //           <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7 sm:mb-10">
// //             <div>
// //               <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-800">
// //                 Services we specialise in
// //               </h2>
// //               <p className="mt-2 text-[11px] sm:text-xs md:text-sm text-slate-500 max-w-xl font-semibold">
// //                 From concept to deployment, we cover the full lifecycle —
// //                 strategy, development, testing, and training.
// //               </p>
// //             </div>

// //             <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500">
// //               <span className="inline-block h-2 w-2 rounded-full bg-pink-400" />
// //               <span className="inline-block h-2 w-2 rounded-full bg-purple-400" />
// //               <span className="inline-block h-2 w-2 rounded-full bg-indigo-400" />
// //               <span className="uppercase tracking-[0.2em] ml-2"></span>
// //             </div>
// //           </div>

// //           {/* Feature Cards */}
// //           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
// //             {features.map((feature) => {
// //               const Icon = feature.icon;
// //               return (
// //                 <article
// //                   key={feature.name}
// //                   className="group relative flex flex-col rounded-2xl border border-indigo-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all"
// //                 >
// //                   <div className="flex items-start gap-3">
// //                     <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-300 via-purple-300 to-pink-300 text-slate-700 shadow">
// //                       <Icon className="text-sm sm:text-base" />
// //                     </div>
// //                     <h3 className="text-xs sm:text-sm font-semibold text-slate-800">
// //                       {feature.name}
// //                     </h3>
// //                   </div>

// //                   <p className="mt-3 text-[11px] sm:text-sm text-slate-600 leading-relaxed flex-1">
// //                     {feature.description}
// //                   </p>

// //                   <div className="mt-4 flex items-center justify-between text-[10px] sm:text-xs text-slate-500">
// //                     <span className="truncate max-w-[70%]">{feature.link}</span>
// //                     <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white border border-indigo-300 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition">
// //                       <FaArrowRight className="text-[11px]" />
// //                     </span>
// //                   </div>
// //                 </article>
// //               );
// //             })}
// //           </div>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }

// import React from "react";
// import {
//   FaArrowRight,
//   FaBrain,
//   FaNetworkWired,
//   FaMobileAlt,
//   FaCheckCircle,
//   FaCogs,
//   FaChalkboardTeacher,
// } from "react-icons/fa";

// const features = [
//   {
//     name: "AI and Machine Learning Solutions",
//     description:
//       "Transform your business with cutting-edge AI and machine learning solutions designed to optimize operations and enhance decision-making.",
//     link: "/ai-ml-solutions",
//     icon: FaBrain,
//   },
//   {
//     name: "Blockchain Development",
//     description:
//       "Build secure, scalable, and efficient blockchain solutions tailored to meet the demands of today’s digital economy.",
//     link: "/blockchain-development",
//     icon: FaNetworkWired,
//   },
//   {
//     name: "Web and Mobile Applications",
//     description:
//       "Develop responsive, user-friendly web and mobile applications that engage customers and drive business growth.",
//     link: "/web-mobile-apps",
//     icon: FaMobileAlt,
//   },
//   {
//     name: "Software Testing and QA",
//     description:
//       "Ensure the reliability and performance of your software with our comprehensive testing and quality assurance services.",
//     link: "/software-testing",
//     icon: FaCheckCircle,
//   },
//   {
//     name: "Custom Client Solutions",
//     description:
//       "Leverage our expertise in MERN, Next.js, and WordPress to create tailored solutions that meet your unique business needs.",
//     link: "/custom-client-solutions",
//     icon: FaCogs,
//   },
//   {
//     name: "Training and Placement Services",
//     description:
//       "Empower your team with hands-on training and real-world project experience, supported by our industry-leading placement services.",
//     link: "/training-placement",
//     icon: FaChalkboardTeacher,
//   },
// ];

// export default function Homepage() {
//   return (
//     <div className="bg-white min-h-screen text-slate-700">
//       {/* HERO SECTION — LIGHT GRADIENT */}
//       <section className="relative overflow-hidden">
//         {/* Soft gradient background */}
//         <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400" />

//         {/* soft blurred color blobs */}
//         <div className="pointer-events-none absolute -top-10 -right-16 h-56 w-56 rounded-full bg-pink-200/50 blur-3xl" />
//         <div className="pointer-events-none absolute bottom-0 -left-10 h-64 w-64 rounded-full bg-indigo-200/50 blur-3xl" />

//         <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20">
//           <div className="mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] gap-10 lg:gap-16 items-center">
//             {/* LEFT — TEXT (UNCHANGED CONTENT) */}
//             <div>
//               <p className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.35em] text-pink-100 mb-4">
//                 SOFTWARE · AI · BLOCKCHAIN · CLOUD
//               </p>

//               <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-sm leading-snug lg:leading-tight">
//                 Empowering Businesses with Innovative Software Solutions
//               </h1>

//               <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-50/90 leading-relaxed max-w-2xl">
//                 We are a leading software company committed to driving business
//                 transformation through technology. With expertise in AI,
//                 blockchain, web and mobile applications, software testing, and
//                 custom client solutions, we empower organizations to innovate
//                 and thrive in a competitive market.
//               </p>

//               {/* Modern chips instead of old pills */}
//               <div className="mt-7 flex flex-wrap gap-3 text-xs sm:text-sm">
//                 <button className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-5 py-2 font-semibold tracking-tight text-slate-800 shadow-sm backdrop-blur-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition">
//                   <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-400 via-purple-400 to-pink-400 text-white text-xs">
//                     <FaBrain />
//                   </span>
//                   <span>AI · Blockchain · Web &amp; Mobile</span>
//                 </button>

//                 <button className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-5 py-2 font-semibold text-slate-800 shadow-sm backdrop-blur-sm hover:bg-pink-500 hover:text-white hover:border-pink-500 transition">
//                   <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400 text-white text-xs">
//                     <FaCheckCircle />
//                   </span>
//                   <span>Testing · QA · Training</span>
//                 </button>
//               </div>
//             </div>

//             {/* RIGHT — MODERN CARDS WITH BIG ICONS */}
//             <div className="flex flex-col gap-5 sm:gap-6">
//               <div className="rounded-2xl border border-indigo-100 bg-white/80 backdrop-blur-sm px-6 py-5 shadow-md">
//                 <p className="text-[12px] sm:text-sm uppercase tracking-[0.2em] text-indigo-500">
//                   What we deliver
//                 </p>
//                 <p className="mt-3 text-sm sm:text-base lg:text-lg font-semibold text-slate-800">
//                   Intelligent, secure, scalable solutions designed around your
//                   business goals.
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-4 sm:gap-5">
//                 {/* CARD 1 */}
//                 <div className="rounded-2xl border border-purple-200 bg-purple-50/90 px-4 py-5 flex flex-col gap-4 shadow-sm">
//                   <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-300 via-purple-300 to-pink-300 text-slate-800 shadow-md">
//                     <FaBrain className="text-3xl" />
//                   </div>
//                   <div className="text-[13px] sm:text-sm font-semibold text-slate-800">
//                     AI &amp; Machine Learning
//                   </div>
//                 </div>

//                 {/* CARD 2 */}
//                 <div className="rounded-2xl border border-pink-200 bg-pink-50/90 px-4 py-5 flex flex-col gap-4 shadow-sm">
//                   <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-300 text-slate-800 shadow-md">
//                     <FaNetworkWired className="text-3xl" />
//                   </div>
//                   <div className="text-[13px] sm:text-sm font-semibold text-slate-800">
//                     Blockchain &amp; Secure Systems
//                   </div>
//                 </div>

//                 {/* CARD 3 */}
//                 <div className="rounded-2xl border border-indigo-200 bg-indigo-50/90 px-4 py-5 flex flex-col gap-4 shadow-sm">
//                   <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-300 via-pink-300 to-purple-300 text-slate-800 shadow-md">
//                     <FaMobileAlt className="text-3xl" />
//                   </div>
//                   <div className="text-[13px] sm:text-sm font-semibold text-slate-800">
//                     Web &amp; Mobile Apps
//                   </div>
//                 </div>

//                 {/* CARD 4 */}
//                 <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 flex flex-col gap-4 shadow-sm">
//                   <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-300 via-indigo-300 to-pink-300 text-slate-800 shadow-md">
//                     <FaCheckCircle className="text-3xl" />
//                   </div>
//                   <div className="text-[13px] sm:text-sm font-semibold text-slate-800">
//                     Testing · QA · Reliability
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Light divider */}
//           <div className="mt-12 sm:mt-14 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
//         </div>
//       </section>

//       {/* FEATURE GRID — LIGHT VERSION */}
//       <section className="bg-gradient-to-br from-white via-indigo-50 to-purple-50">
//         <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20">
//           {/* Section Header */}
//           <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
//             <div>
//               <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-800">
//                 Services we specialise in
//               </h2>
//               <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl font-medium">
//                 From concept to deployment, we cover the full lifecycle —
//                 strategy, development, testing, and training.
//               </p>
//             </div>

//             <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500">
//               <span className="inline-block h-2 w-2 rounded-full bg-pink-400" />
//               <span className="inline-block h-2 w-2 rounded-full bg-purple-400" />
//               <span className="inline-block h-2 w-2 rounded-full bg-indigo-400" />
//             </div>
//           </div>

//           {/* Feature Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-7">
//             {features.map((feature) => {
//               const Icon = feature.icon;
//               return (
//                 <article
//                   key={feature.name}
//                   className="group relative flex flex-col rounded-2xl border border-indigo-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
//                 >
//                   <div className="flex items-start gap-4">
//                     <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-300 via-purple-300 to-pink-300 text-slate-800 shadow-md">
//                       <Icon className="text-2xl" />
//                     </div>
//                     <h3 className="text-sm sm:text-base font-semibold text-slate-900">
//                       {feature.name}
//                     </h3>
//                   </div>

//                   <p className="mt-4 text-[13px] sm:text-sm md:text-base text-slate-600 leading-relaxed flex-1">
//                     {feature.description}
//                   </p>

//                   <div className="mt-5 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
//                     <span className="truncate max-w-[70%]">{feature.link}</span>
//                     <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-indigo-300 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition">
//                       <FaArrowRight className="text-xs" />
//                     </span>
//                   </div>
//                 </article>
//               );
//             })}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

//

// import React from "react";
// import {
//   FaArrowRight,
//   FaBrain,
//   FaNetworkWired,
//   FaMobileAlt,
//   FaCheckCircle,
//   FaCogs,
//   FaChalkboardTeacher,
// } from "react-icons/fa";

// const features = [
//   {
//     name: "AI and Machine Learning Solutions",
//     description:
//       "Use AI and machine learning to automate repetitive work: smart project insights, test-case generation, defect triage, and intelligent dashboards that keep your teams aligned.",
//     link: "/ai-ml-solutions",
//     icon: FaBrain,
//   },
//   {
//     name: "Blockchain Development",
//     description:
//       "Implement secure, tamper-proof audit trails for your projects using blockchain — from approvals and releases to contract and asset tracking across distributed teams.",
//     link: "/blockchain-development",
//     icon: FaNetworkWired,
//   },
//   {
//     name: "Web and Mobile Applications",
//     description:
//       "Build responsive project management portals, admin panels, and mobile apps that give real-time visibility into tasks, timelines, sprints, and delivery status.",
//     link: "/web-mobile-apps",
//     icon: FaMobileAlt,
//   },
//   {
//     name: "Software Testing and QA",
//     description:
//       "Design automation-first QA frameworks: regression suites, API testing, CI/CD integration, and detailed defect reporting that keeps your releases stable and predictable.",
//     link: "/software-testing",
//     icon: FaCheckCircle,
//   },
//   {
//     name: "Custom Client Solutions",
//     description:
//       "Create tailored project management tools, workflow automation, and integration layers that match your exact business processes and team structure.",
//     link: "/custom-client-solutions",
//     icon: FaCogs,
//   },
//   {
//     name: "Training and Placement Services",
//     description:
//       "Upskill teams in QA automation, project management tools, and modern software development practices — with real projects and strong placement support.",
//     link: "/training-placement",
//     icon: FaChalkboardTeacher,
//   },
// ];

// export default function Homepage() {
//   return (
//     <div className="bg-white min-h-screen text-slate-700">
//       {/* HERO SECTION — LIGHT GRADIENT */}
//       <section className="relative overflow-hidden">
//         {/* Soft gradient background */}
//         <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-600" />

//         {/* soft blurred color blobs */}
//         <div className="pointer-events-none absolute -top-10 -right-16 h-56 w-56 rounded-full bg-pink-200/50 blur-3xl" />
//         <div className="pointer-events-none absolute bottom-0 -left-10 h-64 w-64 rounded-full bg-indigo-200/50 blur-3xl" />

//         <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
//           <div className="mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] gap-10 lg:gap-16 items-center">
//             {/* LEFT — TEXT */}
//             <div>
//               <p className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.35em] text-pink-100 mb-4">
//                 SOFTWARE · AI · BLOCKCHAIN · CLOUD · PROJECT MANAGEMENT ·
//                 AUTOMATION
//               </p>

//               <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-sm leading-snug lg:leading-tight">
//                 Empowering Businesses with Innovative Project &amp; Automation
//                 Solutions
//               </h1>

//               <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-50/90 leading-relaxed max-w-2xl">
//                 We design and build modern project management platforms,
//                 automation-first workflows, and intelligent dashboards — backed
//                 by software development, AI, blockchain, cloud, and strong QA
//                 practices. From planning and execution to testing and release,
//                 we help your teams work smarter, faster, and with complete
//                 visibility.
//               </p>

//               {/* Modern chips */}
//               <div className="mt-7 flex flex-wrap gap-3 text-xs sm:text-sm">
//                 <button className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-5 py-2 font-semibold tracking-tight text-slate-800 shadow-sm backdrop-blur-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition">
//                   <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-400 via-purple-400 to-pink-400 text-white text-xs">
//                     <FaBrain />
//                   </span>
//                   <span>AI · Automation · Project Dashboards</span>
//                 </button>

//                 <button className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-5 py-2 font-semibold text-slate-800 shadow-sm backdrop-blur-sm hover:bg-pink-500 hover:text-white hover:border-pink-500 transition">
//                   <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400 text-white text-xs">
//                     <FaCheckCircle />
//                   </span>
//                   <span>Testing · QA Automation · Training</span>
//                 </button>
//               </div>
//             </div>

//             {/* RIGHT — MODERN CARDS WITH BIG ICONS */}
//             <div className="flex flex-col gap-5 sm:gap-6">
//               <div className="rounded-2xl border border-indigo-100 bg-white/80 backdrop-blur-sm px-6 py-3 shadow-md">
//                 <p className="text-[12px] sm:text-sm uppercase tracking-[0.2em] text-indigo-500">
//                   What we deliver
//                 </p>
//                 <p className="mt-3 text-sm sm:text-base lg:text-lg font-semibold text-slate-800">
//                   End-to-end project management tools, automation pipelines, and
//                   QA platforms that connect your teams and keep every release on
//                   track.
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-4 sm:gap-5">
//                 {/* CARD 1 */}
//                 <div className="rounded-2xl border border-purple-200 bg-purple-50/90 px-4 py-5 flex flex-col gap-4 shadow-sm text-center items-center">
//                   <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-300 via-purple-300 to-pink-300 text-slate-800 shadow-md">
//                     <FaBrain className="text-3xl" />
//                   </div>
//                   <div className="text-[13px] sm:text-sm font-semibold text-slate-800">
//                     AI &amp; Smart Automation
//                   </div>
//                 </div>

//                 {/* CARD 2 */}
//                 <div className="rounded-2xl border border-pink-200 bg-pink-50/90 px-4 py-5 flex flex-col gap-4 shadow-sm  text-center items-center">
//                   <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-300 text-slate-800 shadow-md">
//                     <FaNetworkWired className="text-3xl" />
//                   </div>
//                   <div className="text-[13px] sm:text-sm font-semibold text-slate-800">
//                     Secure Tracking &amp; Blockchain
//                   </div>
//                 </div>

//                 {/* CARD 3 */}
//                 <div className="rounded-2xl border border-indigo-200 bg-indigo-50/90 px-4 py-5 flex flex-col gap-4 shadow-sm  text-center items-center">
//                   <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-300 via-pink-300 to-purple-300 text-slate-800 shadow-md">
//                     <FaMobileAlt className="text-3xl" />
//                   </div>
//                   <div className="text-[13px] sm:text-sm font-semibold text-slate-800">
//                     PM Dashboards &amp; Apps
//                   </div>
//                 </div>

//                 {/* CARD 4 */}
//                 <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 flex flex-col gap-4 shadow-sm  text-center items-center">
//                   <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-300 via-indigo-300 to-pink-300 text-slate-800 shadow-md">
//                     <FaCheckCircle className="text-3xl" />
//                   </div>
//                   <div className="text-[13px] sm:text-sm font-semibold text-slate-800">
//                     Testing · QA · Reliability
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Light divider */}
//           <div className="mt-12 sm:mt-14 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
//         </div>
//       </section>

//       {/* FEATURE GRID — LIGHT VERSION */}
//       <section className="bg-white">
//         <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20">
//           {/* Section Header */}
//           <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
//             <div>
//               <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-800">
//                 Services we specialise in
//               </h2>
//               <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl font-medium">
//                 We bring software development, AI, blockchain, cloud, and
//                 automation together to build powerful project management tools,
//                 QA platforms, and training ecosystems.
//               </p>
//             </div>

//             <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500">
//               <span className="inline-block h-2 w-2 rounded-full bg-pink-400" />
//               <span className="inline-block h-2 w-2 rounded-full bg-purple-400" />
//               <span className="inline-block h-2 w-2 rounded-full bg-indigo-400" />
//             </div>
//           </div>

//           {/* Feature Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-7">
//             {features.map((feature) => {
//               const Icon = feature.icon;
//               return (
//                 <article
//                   key={feature.name}
//                   className="group relative flex flex-col rounded-2xl border border-indigo-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
//                 >
//                   <div className="flex items-start gap-4">
//                     <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-300 via-purple-300 to-pink-300 text-slate-800 shadow-md">
//                       <Icon className="text-2xl" />
//                     </div>
//                     <h3 className="text-sm sm:text-base font-semibold text-slate-900">
//                       {feature.name}
//                     </h3>
//                   </div>

//                   <p className="mt-4 text-[13px] sm:text-sm md:text-base text-slate-600 leading-relaxed flex-1">
//                     {feature.description}
//                   </p>

//                   <div className="mt-5 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
//                     <span className="truncate max-w-[70%]">{feature.link}</span>
//                     <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-indigo-300 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition">
//                       <FaArrowRight className="text-xs" />
//                     </span>
//                   </div>
//                 </article>
//               );
//             })}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

import React from "react";
import {
  FaArrowRight,
  FaBrain,
  FaNetworkWired,
  FaMobileAlt,
  FaCheckCircle,
  FaCogs,
} from "react-icons/fa";

const features = [
  {
    name: "AI & Machine Learning",
    description:
      "Build intelligent systems that automate project workflows, generate insights and elevate decision-making.",
    icon: FaBrain,
  },
  {
    name: "Blockchain Engineering",
    description:
      "Design tamper-proof audit trails, secure workflows and decentralized systems for critical processes.",
    icon: FaNetworkWired,
  },
  {
    name: "Web & Mobile Platforms",
    description:
      "Craft fast, clean and scalable applications with modern UX, real-time dashboards and efficiency-focused features.",
    icon: FaMobileAlt,
  },
  {
    name: "Software QA Automation",
    description:
      "Establish automation-first QA pipelines with API testing, regression suites and CI/CD integration.",
    icon: FaCheckCircle,
  },
  {
    name: "Custom Software Solutions",
    description:
      "Engineer tailored platforms, workflow tools and integrations aligned to your exact business operations.",
    icon: FaCogs,
  },
  {
    name: "Cloud & DevOps",
    description:
      "Deploy cloud-native architectures, automated pipelines and secure scalable environments for any product.",
    icon: FaCogs,
  },
];

export default function Homepage() {
  return (
    <div className="bg-white text-slate-900">
      {/* ========================= HERO SECTION ========================= */}
      <section className="relative overflow-hidden">
        {/* subtle animated gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50" />
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20">
          {/* TOP BADGES */}
          <div className="flex flex-wrap gap-2 mb-4">
            {["SOFTWARE", "AI SYSTEMS", "BLOCKCHAIN", "CLOUD"].map((item) => (
              <span
                key={item}
                className="px-3 py-1 text-[11px] font-medium rounded-full bg-slate-900 text-white"
              >
                {item}
              </span>
            ))}
          </div>

          {/* MAIN HERO GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* LEFT TEXT BLOCK */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-slate-900">
                Software, AI & Blockchain
                <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  Built for Modern Businesses
                </span>
              </h1>

              <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-600 max-w-xl leading-relaxed">
                We create powerful software ecosystems—AI-driven dashboards,
                blockchain-secured workflows, smart automation and clean, modern
                web applications designed for speed, clarity and scale.
              </p>

              {/* CALL TO ACTION BUTTONS */}
              <div className="mt-7 flex flex-wrap gap-4">
                <button className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                  Explore Solutions
                </button>

                <button className="px-6 py-3 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition">
                  View Projects
                </button>
              </div>
            </div>

            {/* RIGHT — SLEEK FEATURE PREVIEW BOX */}
            <div className="relative">
              <div className="rounded-3xl bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 p-6 sm:p-8 flex flex-col gap-6">
                <div className="text-sm sm:text-base font-medium">
                  <span className="text-slate-900">Innovation powered by</span>{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                    AI · Blockchain · Cloud
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "AI Systems", icon: FaBrain },
                    { label: "Blockchain", icon: FaNetworkWired },
                    { label: "Web Apps", icon: FaMobileAlt },
                    { label: "QA Automation", icon: FaCheckCircle },
                  ].map(({ label, icon: Icon }, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-sm hover:shadow-md"
                    >
                      <Icon className="text-slate-700 text-xl" />
                      <span className="text-sm font-medium text-slate-800">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= FEATURE GRID ======================= */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 mb-8">
            What We Build
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-md group-hover:scale-105 transition-all">
                      <Icon className="text-xl" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {feature.name}
                    </h3>
                  </div>

                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="mt-5 flex items-center text-xs text-slate-500 group-hover:text-slate-900 transition-colors">
                    Learn more <FaArrowRight className="ml-2 text-xs" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
