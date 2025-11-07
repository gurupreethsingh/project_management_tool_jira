import React from "react";
import {
  FaCloud,
  FaCodeBranch,
  FaCheckCircle,
  FaShieldAlt,
  FaHandsHelping,
  FaTools,
  FaCogs,
  FaBrain,
  FaServer,
  FaBug,
  FaBuilding,
  FaRocket,
} from "react-icons/fa";

/** Responsive, mobile-first icon tiles with subtle colors */
const whoTiles = [
  { icon: FaCloud, caption: "Cloud-native platforms", color: "text-sky-500" },
  {
    icon: FaCodeBranch,
    caption: "Automated CI/CD pipelines",
    color: "text-indigo-500",
  },
  {
    icon: FaCheckCircle,
    caption: "Quality engineering at scale",
    color: "text-emerald-500",
  },
  {
    icon: FaShieldAlt,
    caption: "Secure SDLC & compliance",
    color: "text-rose-500",
  },
];

const valueTiles = [
  {
    icon: FaHandsHelping,
    caption: "Customer impact over complexity",
    color: "text-violet-500",
  },
  {
    icon: FaTools,
    caption: "Craft, clarity, ownership",
    color: "text-amber-500",
  },
];

const teamTiles = [
  {
    icon: FaCogs,
    caption: "Product & platform engineering",
    color: "text-indigo-500",
  },
  { icon: FaBrain, caption: "Data/AI & analytics", color: "text-fuchsia-500" },
  { icon: FaServer, caption: "DevOps & SRE", color: "text-sky-500" },
  { icon: FaBug, caption: "QA automation & security", color: "text-rose-500" },
];

const clientTiles = [
  {
    icon: FaBuilding,
    caption: "ISVs & SaaS scale-ups",
    color: "text-slate-500",
  },
  {
    icon: FaRocket,
    caption: "Enterprises & startups",
    color: "text-emerald-500",
  },
];

const Tiles = ({ items, align = "start" }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
    {items.map((t, i) => {
      const Icon = t.icon;
      return (
        <div key={i} className={`flex flex-col items-center`}>
          <div
            className={[
              "bg-slate-50 rounded-xl shadow-sm",
              "aspect-square w-28 sm:w-36 md:w-44 lg:w-52",
              "flex items-center justify-center",
            ].join(" ")}
            aria-label={t.caption}
          >
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

export default function Layout1() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 pb-10 space-y-10">
      {/* Who we are */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-3/5">
          <Tiles items={whoTiles} />
        </div>
        <div className="md:w-2/5">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Who We Are
          </h3>
          <p className="text-gray-600 text-sm sm:text-base leading-6 mt-2">
            We help teams <b>design, build, and scale</b> modern software—from{" "}
            <b>APIs & apps</b> to <b>cloud platforms</b> and{" "}
            <b>observability</b>. Our playbooks cover <b>secure SDLC</b>,{" "}
            <b>DevOps automation</b>, <b>SRE reliability</b>, and <b>data/AI</b>
            .
          </p>
          <ul className="mt-3 text-gray-600 text-sm leading-6 list-disc ms-4">
            <li>React/Next.js, Node, Java, .NET, Python, Go</li>
            <li>AWS/Azure/GCP, Kubernetes, Terraform</li>
            <li>CI/CD, GitOps, Observability, Incidents</li>
            <li>Automation, Performance, Security testing</li>
            <li>ETL, Feature Stores, MLOps</li>
            <li>UX Research & Design Systems</li>
          </ul>
        </div>
      </div>

      {/* Our values */}
      <div className="flex flex-col md:flex-row-reverse gap-6">
        <div className="md:w-1/2">
          <Tiles items={valueTiles} />
        </div>
        <div className="md:w-1/2">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 text-right md:text-right">
            Our Values
          </h3>
          <ul className="text-gray-600 text-sm leading-6 space-y-2 mt-2 text-right">
            <li>
              <b>Outcomes over outputs:</b> measurable value, not just code.
            </li>
            <li>
              <b>Reliability by design:</b> testing & observability from day
              one.
            </li>
            <li>
              <b>Security everywhere:</b> threat modeling, SAST/DAST, SBOM.
            </li>
            <li>
              <b>Continuous improvement:</b> post-mortems, runbooks, humane
              on-call.
            </li>
          </ul>
        </div>
      </div>

      {/* Our team */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-3/5">
          <Tiles items={teamTiles} />
        </div>
        <div className="md:w-2/5">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Our Team
          </h3>
          <p className="text-gray-600 text-sm sm:text-base leading-6 mt-2">
            Cross-functional squads led by <b>EMs</b> & <b>Tech Leads</b>,
            partnered with <b>UX</b>, <b>QA</b>, <b>DevOps/SRE</b>, and{" "}
            <b>PMO</b>.
          </p>
        </div>
      </div>

      {/* Clients & partners */}
      <div className="flex flex-col md:flex-row-reverse gap-6">
        <div className="md:w-1/2">
          <Tiles items={clientTiles} />
        </div>
        <div className="md:w-1/2">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 text-right md:text-right">
            Clients & Partners
          </h3>
          <p className="text-gray-600 text-sm sm:text-base leading-6 mt-2 text-right">
            We work with startups, ISVs, and enterprises—partnering with
            hyperscalers, observability, and security platforms (with{" "}
            <b>FinOps</b> visibility).
          </p>
        </div>
      </div>
    </section>
  );
}
