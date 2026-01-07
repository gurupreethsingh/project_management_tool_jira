import React from "react";
import { useNavigate, Link } from "react-router-dom";
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
    href: "/ai-systems",
    colorClass: "text-purple-500",
  },
  {
    name: "Blockchain Engineering",
    description:
      "Design tamper-proof audit trails, secure workflows and decentralized systems for critical processes.",
    icon: FaNetworkWired,
    href: "/blockchain",
    colorClass: "text-emerald-500",
  },
  {
    name: "Web & Mobile Platforms",
    description:
      "Craft fast, clean and scalable applications with modern UX, real-time dashboards and efficiency-focused features.",
    icon: FaMobileAlt,
    href: "/web-apps",
    colorClass: "text-sky-500",
  },
  {
    name: "Software QA Automation",
    description:
      "Establish automation-first QA pipelines with API testing, regression suites and CI/CD integration.",
    icon: FaCheckCircle,
    href: "/qa-automation",
    colorClass: "text-amber-500",
  },
  {
    name: "Custom Software Solutions",
    description:
      "Engineer tailored platforms, workflow tools and integrations aligned to your exact business operations.",
    icon: FaCogs,
    href: "/explore-solutions",
    colorClass: "text-rose-500",
  },
  {
    name: "Cloud & DevOps",
    description:
      "Deploy cloud-native architectures, automated pipelines and secure scalable environments for any product.",
    icon: FaCogs,
    href: "/explore-solutions",
    colorClass: "text-indigo-500",
  },
];

export default function Homepage() {
  const navigate = useNavigate();

  // for the right-side quick links box
  const quickLinks = [
    {
      label: "AI Systems",
      icon: FaBrain,
      href: "/ai-systems",
      colorClass: "text-purple-500",
    },
    {
      label: "Blockchain",
      icon: FaNetworkWired,
      href: "/blockchain",
      colorClass: "text-emerald-500",
    },
    {
      label: "Web Apps",
      icon: FaMobileAlt,
      href: "/web-apps",
      colorClass: "text-sky-500",
    },
    {
      label: "QA Automation",
      icon: FaCheckCircle,
      href: "/qa-automation",
      colorClass: "text-amber-500",
    },
  ];

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
                Software Development, AI & Blockchain
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
                <button
                  onClick={() => navigate("/explore-solutions")}
                  className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  Explore Solutions
                </button>

                <button
                  onClick={() => navigate("/projects")}
                  className="px-6 py-3 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                >
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
                  {quickLinks.map(
                    ({ label, icon: Icon, href, colorClass }, idx) => (
                      <Link
                        key={idx}
                        to={href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-sm hover:shadow-md"
                      >
                        <Icon className={`text-xl ${colorClass}`} />
                        <span className="text-sm font-medium text-slate-800">
                          {label}
                        </span>
                      </Link>
                    )
                  )}
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
                      {/* colourful icon inside dark pill */}
                      <Icon className={`text-xl ${feature.colorClass}`} />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {feature.name}
                    </h3>
                  </div>

                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>

                  <Link
                    to={feature.href}
                    className="mt-5 inline-flex items-center text-xs text-slate-500 group-hover:text-slate-900 transition-colors"
                  >
                    Learn more <FaArrowRight className="ml-2 text-xs" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
