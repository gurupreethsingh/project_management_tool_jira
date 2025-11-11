import React from "react";
import {
  FaCubes,
  FaLayerGroup,
  FaShippingFast,
  FaLifeRing,
  FaShieldAlt,
  FaUserTie,
  FaTools,
  FaBug,
  FaBuilding,
  FaRocket,
} from "react-icons/fa";

const whoTiles = [
  {
    icon: FaCubes,
    caption: "Composable architectures",
    color: "text-indigo-500",
  },
  {
    icon: FaLayerGroup,
    caption: "Platform engineering",
    color: "text-sky-500",
  },
  {
    icon: FaShippingFast,
    caption: "Continuous delivery",
    color: "text-emerald-500",
  },
];

const valuesTiles = [
  { icon: FaLifeRing, caption: "Reliability first", color: "text-violet-500" },
  { icon: FaShieldAlt, caption: "Security by default", color: "text-rose-500" },
];

const teamTiles = [
  {
    icon: FaUserTie,
    caption: "Engineering leadership",
    color: "text-slate-600",
  },
  { icon: FaTools, caption: "DevOps/SRE guilds", color: "text-sky-500" },
  { icon: FaBug, caption: "QA & AppSec", color: "text-amber-500" },
];

const clientTiles = [
  { icon: FaBuilding, caption: "ISVs & SaaS", color: "text-slate-500" },
  {
    icon: FaRocket,
    caption: "Enterprises & startups",
    color: "text-emerald-500",
  },
];

const Grid = ({
  items,
  cols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-3",
}) => (
  <div className={`grid ${cols} gap-3`}>
    {items.map((t, i) => {
      const Icon = t.icon;
      return (
        <div key={i} className="flex flex-col items-center">
          <div className="bg-slate-50 rounded-xl shadow-sm aspect-square w-28 sm:w-36 md:w-44 flex items-center justify-center">
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

export default function Layout3() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 pb-10 space-y-10">
      {/* Who we are */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="order-2 md:order-1">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Who We Are
          </h3>
          <p className="text-gray-600 text-sm sm:text-base leading-6 mt-2">
            We help organisations <b>ship faster and safer</b> with{" "}
            <b>API-first engineering</b>, <b>cloud platforms</b>, and{" "}
            <b>automated delivery pipelines</b>—anchored in{" "}
            <b>measurable outcomes</b>.
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 text-sm">
            <span>• Product/Platform Engineering</span>
            <span>• Cloud, Containers, IaC</span>
            <span>• DevOps, CI/CD, GitOps</span>
            <span>• SRE, SLIs/SLOs, On-call</span>
            <span>• QA Automation & Performance</span>
            <span>• AppSec & Compliance</span>
            <span>• Data Eng/AI/MLOps</span>
            <span>• UX Research & Design</span>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <Grid items={whoTiles} cols="grid-cols-3" />
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:order-1">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 text-right">
            Our Values
          </h3>
          <ul className="text-gray-600 text-sm leading-6 text-right space-y-2 mt-2">
            <li>
              <b>Engineering excellence:</b> ADRs, reviews, perf budgets.
            </li>
            <li>
              <b>Reliability:</b> observability, chaos drills, capacity
              planning.
            </li>
            <li>
              <b>Security:</b> SBOM, SAST/DAST, supply-chain hardening.
            </li>
            <li>
              <b>Ownership:</b> SLAs, post-mortems, continuous learning.
            </li>
          </ul>
        </div>
        <div className="md:order-2">
          <Grid items={valuesTiles} cols="grid-cols-2" />
        </div>
      </div>

      {/* Team */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:order-2">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Our Team
          </h3>
          <p className="text-gray-600 text-sm sm:text-base leading-6 mt-2">
            Squads blend <b>engineering leadership</b>, <b>DevOps/SRE</b>,{" "}
            <b>QA/AppSec</b>, and <b>product/UX</b>—backed by PMO.
          </p>
        </div>
        <div className="md:order-1">
          <Grid items={teamTiles} cols="grid-cols-3" />
        </div>
      </div>

      {/* Clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:order-1">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 text-right">
            Clients & Partners
          </h3>
          <p className="text-gray-600 text-sm sm:text-base leading-6 text-right mt-2">
            From <b>SaaS/ISVs</b> to <b>regulated enterprises</b>, we co-create
            with cloud, security, and observability partners.
          </p>
        </div>
        <div className="md:order-2">
          <Grid items={clientTiles} cols="grid-cols-2" />
        </div>
      </div>
    </section>
  );
}
