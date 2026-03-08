import React, { memo, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBrain,
  FaNetworkWired,
  FaMobileAlt,
  FaCheckCircle,
  FaCogs,
  FaUsers,
  FaHandshake,
  FaGlobe,
  FaWordpress,
  FaRobot,
  FaChartLine,
  FaShieldAlt,
  FaCode,
} from "react-icons/fa";

// ✅ OS-independent, build-safe import (works on Windows + Linux server)
import homepageBanner from "../../assets/images/homepage_banner4.jpg";

// import homepageBanner from "../../assets/images/qa_banner.jpg";
// import homepageBanner from "../../assets/images/profile_banner.jpg";
// import homepageBanner from "../../assets/images/ecoders_ai_image.png";

const FEATURES = [
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

const TEAM_HIGHLIGHTS = [
  {
    title: "Multi-Stack Engineering Team",
    description:
      "ECODERS brings together specialists across AI, blockchain, web platforms, mobile-ready interfaces, WordPress development and software testing to build complete digital ecosystems.",
    icon: FaUsers,
    colorClass: "text-indigo-500",
  },
  {
    title: "Business-Focused Delivery",
    description:
      "Our team designs solutions around real client workflows—combining architecture, UI/UX, automation, integrations and quality assurance from planning to deployment.",
    icon: FaHandshake,
    colorClass: "text-pink-500",
  },
  {
    title: "Innovation with Execution",
    description:
      "We do not just prototype ideas. We engineer scalable systems with measurable outcomes, cleaner operations, stronger visibility and long-term maintainability.",
    icon: FaCode,
    colorClass: "text-emerald-500",
  },
];

const CLIENT_SECTORS = [
  {
    name: "Startups & Founders",
    description:
      "Rapid MVPs, scalable product foundations, AI-enabled workflows and modern business websites for emerging ventures.",
    icon: FaRocketSafe,
    colorClass: "text-violet-500",
  },
  {
    name: "Enterprises & Operations Teams",
    description:
      "Workflow automation, dashboards, blockchain-backed traceability, QA systems and cloud-first platforms for business-critical processes.",
    icon: FaShieldAlt,
    colorClass: "text-sky-500",
  },
  {
    name: "Education & Training Organizations",
    description:
      "Learning systems, academic portals, AI-driven support tools, internship platforms and content-rich WordPress or custom web solutions.",
    icon: FaGlobe,
    colorClass: "text-amber-500",
  },
];

const LATEST_TRENDS = [
  {
    title: "AI-Powered Business Systems",
    description:
      "Organizations are moving from static dashboards to AI-driven assistants, prediction tools, smart recommendations and automated business insights.",
    icon: FaRobot,
    colorClass: "text-purple-500",
  },
  {
    title: "Blockchain for Trust & Traceability",
    description:
      "Modern platforms increasingly use blockchain-inspired audit flows and tamper-resistant records to strengthen compliance and accountability.",
    icon: FaNetworkWired,
    colorClass: "text-emerald-500",
  },
  {
    title: "High-Performance Web, Mobile & WordPress Experiences",
    description:
      "Clean design, mobile-first development, SEO-friendly content systems and lightning-fast websites are now essential for business growth.",
    icon: FaWordpress,
    colorClass: "text-sky-500",
  },
  {
    title: "Automation-First Quality Engineering",
    description:
      "Software testing is shifting toward smarter automation, regression reliability, API validation and CI/CD-integrated quality pipelines.",
    icon: FaChartLine,
    colorClass: "text-amber-500",
  },
];

const HERO_TAGS = ["SOFTWARE", "AI SYSTEMS", "BLOCKCHAIN", "CLOUD"];

const HERO_STYLE = {
  backgroundImage: `url(${homepageBanner})`,
};

const MAIN_HEADING_STYLE =
  "text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 text-uppercase tracking-[0.1em]";

const BADGE_MAIN_HEADING_STYLE =
  "text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700";

const PRIMARY_PARAGRAPH_STYLE = "mt-4 text-sm text-slate-600 leading-relaxed";

function Homepage() {
  const navigate = useNavigate();

  const quickLinks = useMemo(
    () => [
      {
        label: "AI Driven Systems",
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
        label: "Web/Mobile Apps",
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
    ],
    [],
  );

  return (
    <div className="bg-white text-slate-900">
      {/* ========================= HERO SECTION ========================= */}
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={HERO_STYLE}
      >
        {/* ✅ lighter overlays so image is more visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/10 to-white/8" />
        <div className="absolute inset-0 bg-black/5" />

        {/* subtle glow */}
        <div className="absolute inset-0" />
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-72 w-72 sm:h-80 sm:w-80 lg:h-96 lg:w-96 rounded-full animate-pulse opacity-20 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 md:py-14 lg:py-16 xl:py-20">
          {/* TOP BADGES */}
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
            {HERO_TAGS.map((item) => (
              <span
                key={item}
                className="px-3 py-1 text-[10px] sm:text-[11px] font-medium rounded-full bg-slate-900/80 text-white backdrop-blur-sm border border-white/20"
              >
                {item}
              </span>
            ))}
          </div>

          {/* MAIN HERO GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.15fr),minmax(320px,0.85fr)] gap-6 sm:gap-8 lg:gap-10 xl:gap-14 items-stretch">
            {/* LEFT TEXT BLOCK */}
            <div className="flex">
              <div className="w-full self-center rounded-2xl sm:rounded-3xl bg-white/22 backdrop-blur-md border border-white/25 shadow-[0_8px_40px_rgba(15,23,42,0.08)] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                <h1 className="text-2xl min-[420px]:text-3xl sm:text-4xl lg:text-5xl xl:text-[3.35rem] font-semibold tracking-tight leading-[1.12] text-slate-900">
                  Software Development, AI & Blockchain
                  <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    Built for Modern Businesses
                  </span>
                </h1>

                <p className="mt-4 w-full min-[480px]:w-auto px-5 sm:px-6 py-3 rounded-xl border border-slate-300 bg-white/50 backdrop-blur-sm text-sm font-base hover:bg-slate-100/80 transition">
                  ECODERS creates powerful software ecosystems—AI-driven
                  dashboards, blockchain-secured workflows, smart automation,
                  WordPress experiences, software testing frameworks and clean,
                  modern web applications designed for speed, clarity and scale.
                </p>

                {/* CALL TO ACTION BUTTONS */}
                <div className="mt-6 sm:mt-7 flex flex-col min-[480px]:flex-row flex-wrap gap-3 sm:gap-4">
                  <button
                    onClick={() => navigate("/explore-solutions")}
                    className="w-full min-[480px]:w-auto px-5 sm:px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                  >
                    Explore Solutions
                  </button>

                  <button
                    onClick={() => navigate("/projects")}
                    className="w-full min-[480px]:w-auto px-5 sm:px-6 py-3 rounded-xl border border-slate-300 bg-white/50 backdrop-blur-sm text-sm font-medium hover:bg-slate-100/80 transition"
                  >
                    View Projects
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT — SLEEK FEATURE PREVIEW BOX */}
            <div className="relative flex">
              <div className="w-full self-center rounded-2xl sm:rounded-3xl bg-white/35 backdrop-blur-xl shadow-xl p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col gap-4 sm:gap-5">
                <div className="text-sm sm:text-base font-medium leading-relaxed">
                  <span className="text-slate-900">Innovation powered by</span>{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                    AI · Blockchain · Cloud
                  </span>
                </div>

                <div className="grid grid-cols-1 min-[500px]:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4">
                  {quickLinks.map(
                    ({ label, icon: Icon, href, colorClass }, idx) => (
                      <Link
                        key={idx}
                        to={href}
                        className="group relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-slate-200/80 bg-white/72 backdrop-blur-sm shadow-sm
                                   transition-all duration-200 ease-out
                                   hover:bg-white/88 hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.01]
                                   active:translate-y-0 active:scale-[0.99]"
                      >
                        <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <span className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-slate-100/80 to-transparent rotate-12 translate-x-[-120%] group-hover:translate-x-[260%] transition-transform duration-700" />
                        </span>

                        <div className="flex items-center gap-3 min-w-0">
                          <Icon
                            className={`shrink-0 text-lg sm:text-xl ${colorClass} transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3`}
                          />
                          <span className="text-sm font-medium text-slate-800 leading-snug">
                            {label}
                          </span>
                        </div>

                        <FaArrowRight className="shrink-0 text-xs text-slate-400 opacity-0 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= FEATURE GRID ======================= */}
      {/* <section className="py-10 sm:py-12 lg:py-16 xl:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className={MAIN_HEADING_STYLE}>What We Build</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 mt-5">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group border border-slate-200 rounded-2xl p-5 sm:p-6 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-md group-hover:scale-105 transition-all">
                      <Icon
                        className={`text-lg sm:text-xl ${feature.colorClass}`}
                      />
                    </div>
                    <h3 className={BADGE_MAIN_HEADING_STYLE}>{feature.name}</h3>
                  </div>

                  <p className={PRIMARY_PARAGRAPH_STYLE}>
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
      </section> */}

      {/* ======================= OUR TEAM SECTION ======================= */}
      <section className="py-10 sm:py-12 lg:py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className={BADGE_MAIN_HEADING_STYLE}>Our Team</p>
            <h2 className={`${MAIN_HEADING_STYLE} mt-2`}>
              Built by a team that understands business and engineering
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              ECODERS is powered by a practical engineering team focused on
              AI-driven solutions, blockchain systems, web and mobile
              development, WordPress platforms and software testing. We combine
              strategy, design, development and QA to deliver solutions that are
              visually strong, technically reliable and aligned to real business
              goals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 mt-8">
            {TEAM_HIGHLIGHTS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                      <Icon className={`text-lg ${item.colorClass}`} />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================= CLIENT SECTION ======================= */}
      <section className="py-10 sm:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className={BADGE_MAIN_HEADING_STYLE}>Clients We Support</p>
            <h2 className={`${MAIN_HEADING_STYLE} mt-2`}>
              Solutions designed for different business environments
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              We work with teams that need speed, reliability and modern digital
              systems. From startups and educators to enterprise operations,
              ECODERS builds platforms that combine AI, blockchain, web
              technology, WordPress flexibility and quality engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 mt-8">
            {CLIENT_SECTORS.map((client, index) => {
              const Icon = client.icon;
              return (
                <div
                  key={index}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 shadow-sm hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                      <Icon className={`text-lg ${client.colorClass}`} />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                        {client.name}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {client.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================= LATEST TRENDS SECTION ======================= */}
      <section className="py-10 sm:py-12 lg:py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className={BADGE_MAIN_HEADING_STYLE}>Latest Trends</p>
            <h2 className={`${MAIN_HEADING_STYLE} mt-2`}>
              Where modern software delivery is heading
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              ECODERS stays aligned with the technologies shaping the next wave
              of digital products—AI-enabled systems, blockchain-backed trust,
              high-performance web and mobile experiences, WordPress-driven
              business websites and automation-focused software testing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mt-8">
            {LATEST_TRENDS.map((trend, index) => {
              const Icon = trend.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                      <Icon
                        className={`text-lg sm:text-xl ${trend.colorClass}`}
                      />
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                        {trend.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {trend.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 px-5 py-6 sm:px-6 sm:py-7 text-white shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="max-w-3xl">
                <h3 className="text-base sm:text-lg font-semibold">
                  Build with ECODERS
                </h3>
                <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                  From AI systems and blockchain engineering to web/mobile
                  development, WordPress platforms and software testing, we help
                  organizations move from ideas to scalable products with
                  clarity and confidence.
                </p>
              </div>

              <div className="flex flex-col min-[480px]:flex-row gap-3">
                <button
                  onClick={() => navigate("/contact")}
                  className="px-5 py-3 rounded-xl bg-white text-slate-900 text-sm font-medium hover:bg-slate-100 transition"
                >
                  Talk to Us
                </button>

                <button
                  onClick={() => navigate("/projects")}
                  className="px-5 py-3 rounded-xl border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition"
                >
                  See Our Work
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FaRocketSafe(props) {
  return <FaArrowRight {...props} />;
}

export default memo(Homepage);
