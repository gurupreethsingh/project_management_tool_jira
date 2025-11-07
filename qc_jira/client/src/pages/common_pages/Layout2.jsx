import React from "react";
import {
  FaMobileAlt,
  FaPlug,
  FaCheckDouble,
  FaCloud,
  FaChartLine,
  FaLifeRing,
  FaShieldAlt,
  FaCogs,
  FaSyncAlt,
  FaPalette,
  FaServer,
  FaTools,
  FaBug,
  FaBrain,
  FaBuilding,
  FaMoneyBillAlt,
  FaGraduationCap,
  FaLock,
} from "react-icons/fa";

const whoTiles = [
  {
    icon: FaMobileAlt,
    caption: "Modern web & mobile",
    color: "text-indigo-500",
  },
  {
    icon: FaPlug,
    caption: "API-first architectures",
    color: "text-emerald-500",
  },
  {
    icon: FaCheckDouble,
    caption: "Automated testing",
    color: "text-amber-500",
  },
  { icon: FaCloud, caption: "Cloud platforms", color: "text-sky-500" },
  {
    icon: FaChartLine,
    caption: "Observability & SRE",
    color: "text-violet-500",
  },
];

const valuesTiles = [
  {
    icon: FaLifeRing,
    caption: "Design for reliability",
    color: "text-slate-500",
  },
  { icon: FaShieldAlt, caption: "Security in depth", color: "text-rose-500" },
  { icon: FaCogs, caption: "Automation everywhere", color: "text-fuchsia-500" },
  {
    icon: FaSyncAlt,
    caption: "Lean, iterative delivery",
    color: "text-teal-500",
  },
];

const teamTiles = [
  { icon: FaPalette, caption: "Frontend & UX", color: "text-pink-500" },
  { icon: FaServer, caption: "Backend & APIs", color: "text-indigo-500" },
  { icon: FaTools, caption: "DevOps & SRE", color: "text-sky-500" },
  { icon: FaBug, caption: "QA automation", color: "text-rose-500" },
  { icon: FaBrain, caption: "Data/AI", color: "text-violet-500" },
];

const clientTiles = [
  { icon: FaBuilding, caption: "SaaS & ISVs", color: "text-slate-500" },
  {
    icon: FaMoneyBillAlt,
    caption: "Fintech & retail",
    color: "text-emerald-500",
  },
  {
    icon: FaGraduationCap,
    caption: "Healthcare & edtech",
    color: "text-indigo-500",
  },
  { icon: FaCloud, caption: "Cloud partners", color: "text-sky-500" },
  { icon: FaLock, caption: "Security ecosystem", color: "text-amber-500" },
];

const Tiles = ({
  items,
  cols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-5",
}) => (
  <div className={`grid ${cols} gap-3`}>
    {items.map((t, i) => {
      const Icon = t.icon;
      return (
        <div key={i} className="flex flex-col items-center">
          <div className="bg-slate-50 rounded-xl shadow-sm aspect-square w-24 sm:w-32 md:w-36 lg:w-40 flex items-center justify-center">
            <Icon className={`w-2/3 h-2/3 ${t.color}`} />
          </div>
          <p className="text-gray-600 text-xs sm:text-sm text-center mt-2">
            {t.caption}
          </p>
        </div>
      );
    })}
  </div>
);

export default function Layout2() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 pb-10 space-y-10">
      <div className="space-y-4">
        <Tiles items={whoTiles} />
        <div className="text-center px-2">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Who We Are
          </h3>
          <p className="text-gray-600 text-sm sm:text-base leading-6 mt-2">
            We build <b>scalable software</b> that lasts—composable
            architectures, robust APIs, and delightful UX. Our approach blends{" "}
            <b>product thinking</b> with <b>engineering rigor</b>.
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 text-sm">
            <span>• Product & Platform Engineering</span>
            <span>• Cloud/Kubernetes & IaC</span>
            <span>• DevOps, CI/CD, GitOps</span>
            <span>• SRE, Observability, Incident Mgmt</span>
            <span>• Test Automation, Performance</span>
            <span>• AppSec, Compliance, SBOM</span>
            <span>• Data Eng, Analytics & MLOps</span>
            <span>• UX Research & Design Systems</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Tiles items={valuesTiles} cols="grid-cols-2 sm:grid-cols-4" />
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center">
          Our Values
        </h3>
        <ul className="text-gray-600 text-sm sm:text-base text-center leading-6 space-y-2 mt-1 px-2">
          <li>
            <b>Clarity:</b> ADRs/RFCs & design reviews.
          </li>
          <li>
            <b>Automation:</b> pipelines, tests, policies as code.
          </li>
          <li>
            <b>Reliability:</b> SLIs/SLOs, chaos drills.
          </li>
          <li>
            <b>Security:</b> shift-left, least privilege, hygiene.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <Tiles items={teamTiles} />
        <div className="text-center px-2">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Our Team
          </h3>
          <p className="text-gray-600 text-sm sm:text-base leading-6 mt-2">
            Multi-disciplinary squads anchored by <b>PM/EM/Tech Leads</b>,
            supported by Architecture, Security, QA and SRE guilds.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Tiles items={clientTiles} />
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center">
          Clients & Partners
        </h3>
        <p className="text-gray-600 text-sm sm:text-base text-center leading-6 mt-1 px-2">
          We partner with cloud providers, observability stacks, security
          vendors, and CI/CD platforms to deliver faster with guardrails.
        </p>
      </div>
    </section>
  );
}
