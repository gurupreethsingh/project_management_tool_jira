// // import React from "react";
// // import { FaArrowRight } from "react-icons/fa";
// // import { Link } from "react-router-dom";

// // const projects = [
// //   {
// //     name: "AI-Powered Project Management",
// //     description:
// //       "A full project management platform with AI-driven task insights, risk flags, and automated status summaries for each sprint.",
// //     image:
// //       "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200",
// //     url: "https://example.com/ai-project-management",
// //     tags: ["AI Systems", "Dashboards", "Automation"],
// //   },
// //   {
// //     name: "Blockchain Release Audit Trail",
// //     description:
// //       "Immutable blockchain-based audit trail for releases, approvals and configuration changes across multiple environments.",
// //     image:
// //       "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1200",
// //     url: "https://example.com/blockchain-audit",
// //     tags: ["Blockchain", "Security", "Compliance"],
// //   },
// //   {
// //     name: "Real-Time Web & Mobile Analytics",
// //     description:
// //       "Responsive web and mobile interfaces that surface live metrics, error trends and deployment health in a single view.",
// //     image:
// //       "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200",
// //     url: "https://example.com/web-mobile-analytics",
// //     tags: ["Web Apps", "Mobile", "Cloud"],
// //   },
// //   {
// //     name: "QA Automation Command Center",
// //     description:
// //       "Central hub for running regression suites, API tests and visualizing CI/CD pipeline performance and defect flow.",
// //     image:
// //       "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200",
// //     url: "https://example.com/qa-automation",
// //     tags: ["QA Automation", "CI/CD", "Dashboards"],
// //   },
// //   // Add / replace with your real projects as needed
// // ];

// // export default function Projects() {
// //   return (
// //     <div className="bg-white min-h-screen text-slate-900">
// //       {/* HERO */}
// //       <section className="relative overflow-hidden border-b border-slate-100">
// //         <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
// //         <div className="absolute top-[-90px] left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] opacity-80" />

// //         <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
// //           {/* Breadcrumbs */}
// //           <nav className="mb-3 text-xs sm:text-sm text-slate-500">
// //             <Link to="/homepage" className="hover:text-slate-900">
// //               Home
// //             </Link>{" "}
// //             <span className="mx-1">/</span>
// //             <span className="text-slate-700">Projects</span>
// //           </nav>

// //           <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">
// //             <div>
// //               <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
// //                 Projects &amp; product work
// //               </h1>
// //               <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl">
// //                 A snapshot of the platforms, tools and systems we&apos;ve
// //                 crafted — from AI-powered dashboards to blockchain-backed audit
// //                 trails and automation command centers.
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       {/* PROJECT GRID */}
// //       <main className="bg-white">
// //         <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-14">
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
// //             {projects.map((project) => (
// //               <a
// //                 key={project.name}
// //                 href={project.url}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden"
// //               >
// //                 {/* Image */}
// //                 <div className="relative h-40 sm:h-48 w-full overflow-hidden">
// //                   <img
// //                     src={project.image}
// //                     alt={project.name}
// //                     className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
// //                   />
// //                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-70 group-hover:opacity-60 transition-opacity" />
// //                   <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
// //                     {project.tags?.map((tag) => (
// //                       <span
// //                         key={tag}
// //                         className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/85 text-slate-900 backdrop-blur"
// //                       >
// //                         {tag}
// //                       </span>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* Content */}
// //                 <div className="flex-1 p-5 sm:p-6 flex flex-col">
// //                   <h2 className="text-sm sm:text-base font-semibold text-slate-900">
// //                     {project.name}
// //                   </h2>
// //                   <p className="mt-2 text-[13px] sm:text-sm text-slate-600 leading-relaxed flex-1">
// //                     {project.description}
// //                   </p>

// //                   <div className="mt-4 flex items-center text-xs font-medium text-slate-700 group-hover:text-slate-900">
// //                     Open project site
// //                     <FaArrowRight className="ml-2 text-[11px]" />
// //                   </div>
// //                 </div>
// //               </a>
// //             ))}
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }

// //

// "use client";

// import React, { memo } from "react";
// import { FaArrowRight } from "react-icons/fa";
// import { Link } from "react-router-dom";

// import projectsBanner from "../../assets/images/projects_banner.jpg";

// const HERO_TAGS = ["PROJECTS", "PRODUCTS", "AI SYSTEMS", "BLOCKCHAIN", "CLOUD"];

// const HERO_STYLE = {
//   backgroundImage: `url(${projectsBanner})`,
// };

// const projects = [
//   {
//     name: "AI-Powered Project Management",
//     description:
//       "A full project management platform with AI-driven task insights, risk flags, and automated status summaries for each sprint.",
//     image:
//       "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200",
//     url: "https://example.com/ai-project-management",
//     tags: ["AI Systems", "Dashboards", "Automation"],
//   },
//   {
//     name: "Blockchain Release Audit Trail",
//     description:
//       "Immutable blockchain-based audit trail for releases, approvals, and configuration changes across multiple environments.",
//     image:
//       "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1200",
//     url: "https://example.com/blockchain-audit",
//     tags: ["Blockchain", "Security", "Compliance"],
//   },
//   {
//     name: "Real-Time Web & Mobile Analytics",
//     description:
//       "Responsive web and mobile interfaces that surface live metrics, error trends, and deployment health in a single view.",
//     image:
//       "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200",
//     url: "https://example.com/web-mobile-analytics",
//     tags: ["Web Apps", "Mobile", "Cloud"],
//   },
//   {
//     name: "QA Automation Command Center",
//     description:
//       "A central hub for running regression suites, API tests, and visualizing CI/CD pipeline performance and defect flow.",
//     image:
//       "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200",
//     url: "https://example.com/qa-automation",
//     tags: ["QA Automation", "CI/CD", "Dashboards"],
//   },
// ];

// function Projects() {
//   return (
//     <div className="service-page-wrap min-h-screen">
//       {/* HERO */}
//       <section className="service-hero-section" style={HERO_STYLE}>
//         <div className="service-hero-overlay-1" />
//         <div className="service-hero-overlay-2" />
//         <div className="service-hero-overlay-3" />

//         <div className="service-hero-container">
//           <div className="service-hero-layout">
//             <div>
//               <div className="service-tag-row">
//                 {HERO_TAGS.map((item) => (
//                   <span key={item} className="service-tag-pill">
//                     {item}
//                   </span>
//                 ))}
//               </div>

//               <h1 className="service-hero-title">
//                 Projects &amp;{" "}
//                 <span className="service-hero-title-highlight">
//                   product work
//                 </span>
//               </h1>

//               <p className="service-hero-text">
//                 A snapshot of the platforms, tools, and systems we have crafted
//                 — from AI-powered dashboards to blockchain-backed audit trails
//                 and automation command centers.
//               </p>

//               <div className="service-hero-status">
//                 <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
//                 Product-focused · Scalable · Engineering-led
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
//               <div className="flex items-center gap-2">
//                 <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
//                 <span>Real-world delivery</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="h-2 w-2 rounded-full bg-slate-200" />
//                 <span>Software · AI · Cloud</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* MAIN */}
//       <main className="service-main-wrap">
//         <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
//           <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr),minmax(0,1fr)] gap-10 lg:gap-12 items-start">
//             {/* LEFT */}
//             <section>
//               <h2 className="service-main-heading">What these projects show</h2>

//               <div className="glass-card mt-5 px-5 sm:px-6 py-5 sm:py-6">
//                 <p className="service-badge-heading">Project highlights</p>

//                 <div className="mt-4 space-y-4">
//                   <p className="service-paragraph">
//                     These examples reflect the type of systems we build across
//                     software engineering, automation, cloud delivery, and
//                     applied AI.
//                   </p>

//                   <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
//                     <p className="text-sm font-semibold text-slate-900">
//                       Built for real operations
//                     </p>
//                     <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
//                       We focus on systems that support actual team workflows,
//                       reporting, decision-making, and day-to-day execution.
//                     </p>
//                   </div>

//                   <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
//                     <p className="text-sm font-semibold text-slate-900">
//                       Scalable architecture patterns
//                     </p>
//                     <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
//                       The work spans dashboards, automation centers, blockchain
//                       traceability, and multi-platform interfaces that can grow
//                       with business needs.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* RIGHT */}
//             <section>
//               <h2 className="service-main-heading">Featured projects</h2>

//               <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7">
//                 {projects.map((project) => (
//                   <a
//                     key={project.name}
//                     href={project.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden"
//                   >
//                     <div className="relative h-40 sm:h-48 w-full overflow-hidden">
//                       <img
//                         src={project.image}
//                         alt={project.name}
//                         className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-70 group-hover:opacity-60 transition-opacity" />
//                       <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
//                         {project.tags?.map((tag) => (
//                           <span
//                             key={tag}
//                             className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/85 text-slate-900 backdrop-blur"
//                           >
//                             {tag}
//                           </span>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="flex-1 p-5 sm:p-6 flex flex-col">
//                       <h2 className="text-sm sm:text-base font-semibold text-slate-900">
//                         {project.name}
//                       </h2>
//                       <p className="mt-2 text-[13px] sm:text-sm text-slate-600 leading-relaxed flex-1">
//                         {project.description}
//                       </p>

//                       <div className="mt-4 flex items-center text-xs font-medium text-slate-700 group-hover:text-slate-900">
//                         Open project site
//                         <FaArrowRight className="ml-2 text-[11px]" />
//                       </div>
//                     </div>
//                   </a>
//                 ))}
//               </div>
//             </section>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default memo(Projects);

//

"use client";

import React, { useEffect, useMemo, useState, memo } from "react";
import { Link } from "react-router-dom";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaArrowLeft,
  FaArrowRight,
  FaSearch,
  FaBlog,
  FaSortAmountDownAlt,
  FaSortAmountUpAlt,
  FaTags,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

import projectsBanner from "../../assets/images/projects_banner.jpg";

const MAIN_HEADING_STYLE =
  "text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 text-uppercase tracking-[0.1em]";

const HERO_TAGS = ["PROJECTS", "PRODUCTS", "AI SYSTEMS", "BLOCKCHAIN", "CLOUD"];

const HERO_STYLE = {
  backgroundImage: `url(${projectsBanner})`,
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "of",
  "in",
  "on",
  "at",
  "to",
  "for",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "me",
  "him",
  "her",
  "us",
  "them",
  "this",
  "that",
  "these",
  "those",
  "there",
  "here",
  "please",
  "pls",
  "plz",
  "show",
  "showing",
  "find",
  "search",
  "look",
  "list",
  "project",
  "projects",
  "product",
  "products",
  "all",
  "any",
  "me",
  "my",
]);

const projects = [
  {
    id: "proj-001",
    name: "AI-Powered Project Management",
    description:
      "A full project management platform with AI-driven task insights, risk flags, and automated status summaries for each sprint.",
    image:
      "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://example.com/ai-project-management",
    tags: ["AI Systems", "Dashboards", "Automation"],
    category: "AI Platform",
    client: "Enterprise Teams",
  },
  {
    id: "proj-002",
    name: "Blockchain Release Audit Trail",
    description:
      "Immutable blockchain-based audit trail for releases, approvals, and configuration changes across multiple environments.",
    image:
      "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://example.com/blockchain-audit",
    tags: ["Blockchain", "Security", "Compliance"],
    category: "Blockchain",
    client: "Regulated Operations",
  },
  {
    id: "proj-003",
    name: "Real-Time Web & Mobile Analytics",
    description:
      "Responsive web and mobile interfaces that surface live metrics, error trends, and deployment health in a single view.",
    image:
      "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://example.com/web-mobile-analytics",
    tags: ["Web Apps", "Mobile", "Cloud"],
    category: "Analytics",
    client: "Digital Products",
  },
  {
    id: "proj-004",
    name: "QA Automation Command Center",
    description:
      "A central hub for running regression suites, API tests, and visualizing CI/CD pipeline performance and defect flow.",
    image:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://example.com/qa-automation",
    tags: ["QA Automation", "CI/CD", "Dashboards"],
    category: "Automation",
    client: "Engineering Teams",
  },
  {
    id: "proj-005",
    name: "Cloud Infrastructure Monitoring Hub",
    description:
      "A centralized cloud observability portal for incidents, uptime checks, resource trends, and operational health tracking.",
    image:
      "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://example.com/cloud-monitoring",
    tags: ["Cloud", "DevOps", "Monitoring"],
    category: "Cloud",
    client: "Infrastructure Teams",
  },
  {
    id: "proj-006",
    name: "AI Resume Intelligence Platform",
    description:
      "An AI system that ranks, filters, and analyzes resumes against job descriptions to support faster and more accurate hiring workflows.",
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://example.com/resume-intelligence",
    tags: ["AI", "HR Tech", "Ranking"],
    category: "AI Product",
    client: "Recruitment Teams",
  },
  {
    id: "proj-007",
    name: "Multi-Tenant Learning Platform",
    description:
      "A scalable education platform with role-based dashboards, course flows, progress tracking, and AI-enhanced learner assistance.",
    image:
      "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://example.com/learning-platform",
    tags: ["EdTech", "AI", "Dashboards"],
    category: "Learning Platform",
    client: "Institutions",
  },
  {
    id: "proj-008",
    name: "Defect Analytics & Triage Suite",
    description:
      "An engineering insights suite that groups failures, tracks recurring issues, and highlights defect trends across releases.",
    image:
      "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://example.com/defect-analytics",
    tags: ["QA", "Analytics", "Reporting"],
    category: "Quality Engineering",
    client: "Product Teams",
  },
  {
    id: "proj-009",
    name: "Customer Operations Dashboard",
    description:
      "A unified customer operations dashboard that combines ticketing, SLAs, escalations, and service metrics into one interface.",
    image:
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://example.com/customer-ops",
    tags: ["Support", "Operations", "KPIs"],
    category: "Operations",
    client: "Service Teams",
  },
  {
    id: "proj-010",
    name: "Document Workflow Automation",
    description:
      "A digital workflow engine for approvals, records, reminders, and audit-ready movement of business documents.",
    image:
      "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://example.com/document-workflow",
    tags: ["Workflow", "Automation", "Compliance"],
    category: "Business Process",
    client: "Admin Teams",
  },
  {
    id: "proj-011",
    name: "Retail Commerce Experience Suite",
    description:
      "A modern commerce experience featuring product discovery, promotions, analytics, and streamlined order journeys.",
    image:
      "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://example.com/retail-commerce",
    tags: ["E-Commerce", "Frontend", "Growth"],
    category: "Commerce",
    client: "Retail Brands",
  },
  {
    id: "proj-012",
    name: "Executive KPI Visualization Board",
    description:
      "A leadership-focused KPI board for organization-wide visibility into growth, delivery, stability, and operational efficiency.",
    image:
      "https://images.pexels.com/photos/7947758/pexels-photo-7947758.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://example.com/executive-kpi",
    tags: ["Leadership", "Dashboards", "Insights"],
    category: "Reporting",
    client: "Executives",
  },
];

function ProjectThumb({ src, alt, isList }) {
  const [broken, setBroken] = useState(false);

  const commonWrap =
    "overflow-hidden rounded-md flex items-center justify-center bg-slate-50";
  const listSize = "w-24 h-24 flex-shrink-0 mr-4";
  const gridSize = "w-full h-48";
  const iconSize = isList
    ? "w-10 h-10 sm:w-12 sm:h-12"
    : "w-14 h-14 sm:w-16 sm:h-16";

  if (!src || broken) {
    return (
      <div className={`${commonWrap} ${isList ? listSize : gridSize}`}>
        <FaBlog className={`text-slate-400 ${iconSize}`} />
      </div>
    );
  }

  return (
    <div className={isList ? listSize : gridSize}>
      <img
        src={src}
        alt={alt || "project"}
        className="w-full h-full object-cover rounded-md"
        onError={() => setBroken(true)}
        loading="lazy"
      />
    </div>
  );
}

function Projects() {
  const [view, setView] = useState("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setItemsPerPage(view === "list" ? 6 : 12);
      } else if (width >= 1024) {
        setItemsPerPage(view === "list" ? 5 : 8);
      } else if (width >= 768) {
        setItemsPerPage(view === "list" ? 4 : 6);
      } else {
        setItemsPerPage(4);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, [view]);

  const filteredProjects = useMemo(() => {
    const normalized = (searchTerm || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    const tokens = normalized
      ? normalized
          .split(" ")
          .map((t) => t.trim())
          .filter((t) => t && !STOP_WORDS.has(t))
      : [];

    const sorted = [...projects].sort((a, b) => {
      const nameA = (a?.name || "").toLowerCase();
      const nameB = (b?.name || "").toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    if (!tokens.length) return sorted;

    return sorted.filter((project) => {
      const haystack = [
        project?.name || "",
        project?.description || "",
        project?.category || "",
        project?.client || "",
        Array.isArray(project?.tags) ? project.tags.join(" ") : "",
        project?.url || "",
      ]
        .join(" ")
        .toLowerCase();

      return tokens.every((t) => haystack.includes(t));
    });
  }, [searchTerm, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / itemsPerPage),
  );

  const paginatedProjects = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, currentPage, itemsPerPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder, view, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const toggleSortOrder = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goToPage = (page) => setCurrentPage(page);

  const iconStyle = {
    list: view === "list" ? "text-blue-500" : "text-gray-500",
    grid: view === "grid" ? "text-green-500" : "text-gray-500",
    card: view === "card" ? "text-purple-500" : "text-gray-500",
  };

  const visiblePageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

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
                Projects &{" "}
                <span className="service-hero-title-highlight">
                  product work
                </span>
              </h1>

              <p className="service-hero-text">
                A snapshot of the platforms, tools, and systems we have crafted
                — from AI-powered dashboards to blockchain-backed audit trails
                and automation command centers.
              </p>

              <div className="service-hero-status">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Product-focused · Scalable · Engineering-led
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                <span>Real-world delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-200" />
                <span>Software · AI · Cloud</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IDENTICAL MAIN STRUCTURE */}
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* SINGLE ROW: All Projects | Search | Showing... | Sort | Views */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <h1 className={MAIN_HEADING_STYLE}>All Projects</h1>

          <div className="relative flex-1 min-w-[180px] max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Search by project name, tag, category, client, keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-full border border-gray-300 text-gray-900 text-xs sm:text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <p className="text-[11px] sm:text-xs text-gray-500 whitespace-nowrap">
              Showing {paginatedProjects.length} of {filteredProjects.length}{" "}
              projects
            </p>

            <button
              onClick={toggleSortOrder}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
              title={
                sortOrder === "asc"
                  ? "Sorted: A to Z. Click to switch."
                  : "Sorted: Z to A. Click to switch."
              }
            >
              {sortOrder === "asc" ? (
                <FaSortAmountDownAlt className="text-indigo-600 text-sm" />
              ) : (
                <FaSortAmountUpAlt className="text-indigo-600 text-sm" />
              )}
            </button>

            <FaThList
              className={`cursor-pointer text-sm ${iconStyle.list}`}
              onClick={() => setView("list")}
              title="List view"
            />
            <FaTh
              className={`cursor-pointer text-sm ${iconStyle.card}`}
              onClick={() => setView("card")}
              title="Compact cards"
            />
            <FaThLarge
              className={`cursor-pointer text-sm ${iconStyle.grid}`}
              onClick={() => setView("grid")}
              title="Grid view"
            />
          </div>
        </div>

        <motion.div
          className={`grid gap-6 ${
            view === "list"
              ? "grid-cols-1"
              : view === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {paginatedProjects.map((project) => {
            const isList = view === "list";

            return (
              <motion.a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden h-full flex flex-col ${
                  isList ? "sm:flex-row p-4 items-center" : ""
                }`}
              >
                <ProjectThumb
                  src={project.image}
                  alt={project.name}
                  isList={isList}
                />

                <div
                  className={`${
                    isList
                      ? "flex-1 flex flex-col"
                      : "p-4 flex flex-col flex-grow"
                  }`}
                >
                  <div className="text-left space-y-1 flex-shrink-0">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                      {project.name}
                    </h3>

                    {project.category && (
                      <p className="text-xs text-gray-600 flex items-center">
                        <FaBlog className="mr-1 text-indigo-500" />
                        {project.category}
                      </p>
                    )}

                    {project.client && (
                      <p className="text-xs text-gray-600 flex items-center">
                        <FaExternalLinkAlt className="mr-1 text-red-500" />
                        {project.client}
                      </p>
                    )}

                    {project.tags?.length > 0 && (
                      <p className="text-xs text-gray-600 flex items-center">
                        <FaTags className="mr-1 text-green-500" />
                        {project.tags.join(", ")}
                      </p>
                    )}
                  </div>

                  {view !== "list" && project?.description?.trim() && (
                    <p className="text-gray-700 mt-2 text-xs sm:text-sm line-clamp-3 flex-shrink-0">
                      {project.description}
                    </p>
                  )}

                  {view === "list" && project?.description?.trim() && (
                    <p className="text-gray-700 mt-2 text-xs sm:text-sm line-clamp-2 flex-shrink-0">
                      {project.description}
                    </p>
                  )}

                  <div className="flex-grow" />

                  <div className="mt-4 inline-flex items-center text-xs font-medium text-indigo-600">
                    Open project site
                    <FaArrowRight className="ml-2 text-[11px]" />
                  </div>
                </div>
              </motion.a>
            );
          })}
        </motion.div>

        {filteredProjects.length === 0 && (
          <p className="text-center text-gray-600 mt-6">No projects found.</p>
        )}

        {/* IMPROVED PAGINATION */}
        {filteredProjects.length > 0 && (
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`inline-flex items-center justify-center min-w-[40px] h-10 px-3 rounded-md text-sm font-medium transition ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-500"
                }`}
                aria-label="Previous page"
              >
                <FaArrowLeft />
              </button>

              {visiblePageNumbers[0] > 1 && (
                <>
                  <button
                    onClick={() => goToPage(1)}
                    className="min-w-[40px] h-10 px-3 rounded-md border border-slate-200 bg-white text-slate-700 text-sm hover:bg-slate-50"
                  >
                    1
                  </button>
                  {visiblePageNumbers[0] > 2 && (
                    <span className="px-1 text-slate-400">...</span>
                  )}
                </>
              )}

              {visiblePageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`min-w-[40px] h-10 px-3 rounded-md text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              {visiblePageNumbers[visiblePageNumbers.length - 1] <
                totalPages && (
                <>
                  {visiblePageNumbers[visiblePageNumbers.length - 1] <
                    totalPages - 1 && (
                    <span className="px-1 text-slate-400">...</span>
                  )}
                  <button
                    onClick={() => goToPage(totalPages)}
                    className="min-w-[40px] h-10 px-3 rounded-md border border-slate-200 bg-white text-slate-700 text-sm hover:bg-slate-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`inline-flex items-center justify-center min-w-[40px] h-10 px-3 rounded-md text-sm font-medium transition ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-500"
                }`}
                aria-label="Next page"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(Projects);
