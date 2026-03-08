"use client";

import React from "react";
import {
  FaBrain,
  FaRobot,
  FaChartLine,
  FaMagic,
  FaLock,
  FaLink,
  FaNetworkWired,
  FaMobileAlt,
  FaCogs,
  FaCloud,
  FaArrowRight,
  FaCheckCircle,
  FaBug,
  FaChartBar,
  FaDesktop,
  FaTabletAlt,
} from "react-icons/fa";
import {
  SiTensorflow,
  SiPytorch,
  SiOpenai,
  SiHiveBlockchain,
  SiEthereum,
  SiJest,
  SiPostman,
  SiReact,
  SiJavascript,
  SiTailwindcss,
} from "react-icons/si";

import aiSystemsBanner from "../../assets/images/ai_banner.jpg";
import blockchainBanner from "../../assets/images/blockchain_banner.jpg";
import exploreSolutionsBanner from "../../assets/images/explore_solutions_banner.jpg";
import qaBanner from "../../assets/images/qa_banner.jpg";
import webAppsBanner from "../../assets/images/web_banner4.jpg";

export const ServicePagesData = {
  "ai-systems": {
    hero: {
      banner: aiSystemsBanner,
      tags: ["AI SYSTEMS", "AUTOMATION", "ML", "LLM APIs", "CLOUD"],
      titleStart: "AI systems &",
      titleHighlight: "automation",
      description:
        "We design AI components that plug into your existing tools: summarizing work, predicting risks, recommending next actions, and triggering automations.",
      statusText: "Production-focused · Model-agnostic",
    },

    introSection: {
      heading: "What we build with AI",
      list: [
        {
          icon: <FaCheckCircle className="mt-[3px] text-purple-500" />,
          text: "Task, ticket, and defect summarization directly inside your dashboards.",
        },
        {
          icon: <FaCheckCircle className="mt-[3px] text-indigo-500" />,
          text: "Ranking and recommendation models for priorities, owners, and next actions.",
        },
        {
          icon: <FaCheckCircle className="mt-[3px] text-pink-500" />,
          text: "Natural language interfaces over project data, logs, and knowledge bases.",
        },
        {
          icon: <FaCheckCircle className="mt-[3px] text-slate-900" />,
          text: 'Automation flows that trigger based on AI signals such as "high risk" or "urgent".',
        },
      ],
    },

    infoCard: {
      icon: <FaBrain className="text-xl text-yellow-300" />,
      title: "AI as part of your product, not a separate toy.",
      description:
        "We focus on predictable behavior, controllable prompts, and clear fallbacks so AI features feel like a reliable teammate, not a demo experiment.",
      chips: [
        {
          icon: <SiTensorflow className="text-[#FF6F00]" />,
          label: "TensorFlow",
        },
        {
          icon: <SiPytorch className="text-[#EE4C2C]" />,
          label: "PyTorch",
        },
        {
          icon: <SiOpenai className="text-[#00A67E]" />,
          label: "LLM APIs",
        },
      ],
    },

    featuresSection: {
      heading: "Typical AI patterns we implement",
      features: [
        {
          icon: <FaMagic className="mt-1 text-indigo-500" />,
          title: "Smart assist panels",
          description:
            'Inline AI "assist" for descriptions, comments, messages, and test cases.',
        },
        {
          icon: <FaChartLine className="mt-1 text-emerald-500" />,
          title: "Forecasts & insights",
          description:
            "Identify slow-moving items, blocked work, and likely schedule risks.",
        },
        {
          icon: <FaRobot className="mt-1 text-pink-500" />,
          title: "Automation bots",
          description:
            "Bots that watch your data and perform the repetitive actions automatically.",
        },
      ],
    },
  },

  blockchain: {
    hero: {
      banner: blockchainBanner,
      tags: ["BLOCKCHAIN", "SECURITY", "AUDIT", "WORKFLOWS", "TRUST"],
      titleStart: "Blockchain-backed",
      titleHighlight: "audit & workflows",
      description:
        "We use blockchain where it makes the most sense: tamper-proof logs for activities that must be provable, traceable, and secure.",
      statusText: "Immutable records",
    },

    introSection: {
      heading: "Where blockchain fits best",
      list: [
        {
          icon: <FaCheckCircle className="mt-[3px] text-emerald-500" />,
          text: "Release approvals and deployment logs that must be tamper-proof.",
        },
        {
          icon: <FaCheckCircle className="mt-[3px] text-sky-500" />,
          text: "Change management and configuration history across multiple environments.",
        },
        {
          icon: <FaCheckCircle className="mt-[3px] text-amber-500" />,
          text: "Asset and contract lifecycle tracking.",
        },
      ],
    },

    infoCard: {
      icon: <SiHiveBlockchain className="text-xl text-[#FF6F00]" />,
      title: "Security without a painful UX.",
      description:
        "Your users stay inside familiar interfaces while blockchain works beneath the surface to guarantee integrity.",
      chips: [
        {
          icon: <FaLock className="text-emerald-500" />,
          label: "Security first",
        },
        {
          icon: <SiEthereum className="text-[#627EEA]" />,
          label: "EVM-compatible",
        },
      ],
    },

    featuresSection: {
      heading: "Example patterns",
      features: [
        {
          icon: <FaLink className="mt-1 text-indigo-500" />,
          title: "Release ledger",
          description:
            "Every release is written to an immutable ledger with relevant metadata.",
        },
        {
          icon: <FaLock className="mt-1 text-rose-500" />,
          title: "Signature workflows",
          description:
            "Approvals recorded as blockchain-backed actions instead of emails.",
        },
        {
          icon: <SiHiveBlockchain className="mt-1 text-[#FF6F00]" />,
          title: "Immutable audit",
          description:
            "Full activity history that cannot be quietly edited or deleted.",
        },
      ],
    },
  },

  "explore-solutions": {
    hero: {
      banner: exploreSolutionsBanner,
      tags: ["SOLUTIONS", "SOFTWARE", "AI SYSTEMS", "BLOCKCHAIN", "CLOUD"],
      titleStart: "Explore our",
      titleHighlight: "software & AI solutions",
      description:
        "A quick overview of the core solution areas we work in. Dive into each to see practical examples, reusable patterns, and how we integrate with your existing stack.",
      statusText: "Cross-functional · Scalable · Product-focused",
    },

    introSection: {
      heading: "What we help teams build",
      list: [
        {
          icon: <FaCheckCircle className="mt-[3px] text-purple-500" />,
          text: "AI-driven systems that summarize work, recommend actions, and automate repetitive decisions.",
        },
        {
          icon: <FaCheckCircle className="mt-[3px] text-emerald-500" />,
          text: "Blockchain-backed workflows for immutable audits, approval trails, and secure record keeping.",
        },
        {
          icon: <FaCheckCircle className="mt-[3px] text-sky-500" />,
          text: "Web and mobile platforms that connect customers, admins, and internal operations.",
        },
        {
          icon: <FaCheckCircle className="mt-[3px] text-amber-500" />,
          text: "QA automation and cloud-ready delivery pipelines that improve reliability and release confidence.",
        },
      ],
    },

    infoCard: {
      icon: <FaCogs className="text-xl text-rose-400" />,
      title: "Solutions designed to work together, not in silos.",
      description:
        "We build connected solution ecosystems where software, AI, automation, cloud infrastructure, and operational tooling support each other as one practical business system.",
      chips: [
        {
          icon: <FaBrain className="text-purple-500" />,
          label: "AI systems",
        },
        {
          icon: <FaCloud className="text-indigo-500" />,
          label: "Cloud-ready",
        },
        {
          icon: <FaArrowRight className="text-slate-700" />,
          label: "Scalable delivery",
        },
      ],
    },

    featuresSection: {
      heading: "Core solution areas",
      features: [
        {
          icon: <FaBrain className="mt-1 text-purple-500" />,
          title: "AI Systems",
          description:
            "Summarization, recommendations, anomaly detection, and smart automations embedded directly into your tools.",
        },
        {
          icon: <FaNetworkWired className="mt-1 text-emerald-500" />,
          title: "Blockchain Engineering",
          description:
            "Immutable audit logs, approval workflows, and asset tracking with secure, tamper-proof records.",
        },
        {
          icon: <FaMobileAlt className="mt-1 text-sky-500" />,
          title: "Web & Mobile Platforms",
          description:
            "Responsive dashboards, admin spaces, and portals that keep teams and customers aligned.",
        },
        {
          icon: <FaCheckCircle className="mt-1 text-amber-500" />,
          title: "Software QA Automation",
          description:
            "Regression suites, API tests, and visual dashboards integrated into your CI/CD pipelines.",
        },
        {
          icon: <FaCloud className="mt-1 text-indigo-500" />,
          title: "Cloud & DevOps",
          description:
            "Cloud-native architectures, infrastructure as code, observability, and safe deployments.",
        },
        {
          icon: <FaCogs className="mt-1 text-rose-500" />,
          title: "Custom Software Solutions",
          description:
            "Custom-built platforms, integrations, and internal tools tailored to your exact workflows.",
        },
      ],
    },
  },

  "qa-automation": {
    hero: {
      banner: qaBanner,
      tags: ["QA", "AUTOMATION", "API TESTING", "CI/CD", "REPORTING"],
      titleStart: "Software QA &",
      titleHighlight: "automation",
      description:
        "We treat QA as an engineering discipline by combining automation, reporting, and CI/CD so quality becomes measurable, repeatable, and visible.",
      statusText: "Automation-first · CI-ready · Measurable quality",
    },

    introSection: {
      heading: "Our QA automation focus",
      list: [
        {
          icon: <FaCheckCircle className="mt-[3px] text-emerald-500" />,
          text: "Regression and smoke suites for the flows that matter most.",
        },
        {
          icon: <FaCheckCircle className="mt-[3px] text-orange-500" />,
          text: "API testing, contract testing, and reliable test data setup.",
        },
        {
          icon: <FaCheckCircle className="mt-[3px] text-indigo-500" />,
          text: "CI/CD integration with dashboards, reporting, and alerts.",
        },
        {
          icon: <FaCheckCircle className="mt-[3px] text-rose-500" />,
          text: "Clear defect visibility and quality metrics for every release cycle.",
        },
      ],
    },

    infoCard: {
      icon: <FaBug className="text-xl text-rose-300" />,
      title: "Catch issues before users do.",
      description:
        "From UI checks to backend contracts, we focus on the paths that actually matter and surface the results in a clear, visual, engineering-friendly way.",
      chips: [
        {
          icon: <SiJest className="text-[#99425B]" />,
          label: "Jest / unit",
        },
        {
          icon: <SiPostman className="text-[#FF6C37]" />,
          label: "API testing",
        },
        {
          icon: <FaChartBar className="text-emerald-500" />,
          label: "Coverage & reports",
        },
      ],
    },

    featuresSection: {
      heading: "Typical QA patterns we implement",
      features: [
        {
          icon: <FaBug className="mt-1 text-rose-500" />,
          title: "Regression suites",
          description:
            "Automated coverage for high-risk and high-traffic business flows.",
        },
        {
          icon: <SiPostman className="mt-1 text-[#FF6C37]" />,
          title: "API validation",
          description:
            "Endpoint checks, contract validation, and status/data assertions across services.",
        },
        {
          icon: <FaChartBar className="mt-1 text-emerald-500" />,
          title: "Reports & dashboards",
          description:
            "Readable execution summaries, defect trends, and release quality visibility.",
        },
      ],
    },
  },

  "web-apps": {
    hero: {
      banner: webAppsBanner,
      tags: ["WEB APPS", "MOBILE", "UI", "RESPONSIVE", "REACT"],
      titleStart: "Web & mobile",
      titleHighlight: "platforms",
      description:
        "Clean, fast interfaces for your teams and customers — designed for real operations, not just static demos.",
      statusText:
        "React · Tailwind · Angular · WordPress · Python · Java · Swift · Android Studio · React Native",
    },

    introSection: {
      heading: "Patterns we specialize in",
      list: [
        {
          icon: <FaCheckCircle className="mt-[3px] text-indigo-500" />,
          text: "Role-based dashboards and admin panels.",
        },
        {
          icon: <FaCheckCircle className="mt-[3px] text-emerald-500" />,
          text: "Real-time data views powered by APIs and sockets.",
        },
        {
          icon: <FaCheckCircle className="mt-[3px] text-amber-500" />,
          text: "Responsive layouts tuned for mobile, tablet, and desktop.",
        },
        {
          icon: <FaCheckCircle className="mt-[3px] text-purple-500" />,
          text: "Product interfaces designed for speed, clarity, and day-to-day operations.",
        },
      ],
    },

    infoCard: {
      icon: <FaMobileAlt className="text-xl text-emerald-300" />,
      title: "Designed for all screens.",
      description:
        "We optimize for quick loading, clear information hierarchy, and predictable navigation whether it is a project dashboard, customer portal, or internal support tool.",
      chips: [
        {
          icon: <FaDesktop className="text-indigo-500" />,
          label: "Desktop",
        },
        {
          icon: <FaTabletAlt className="text-purple-500" />,
          label: "Tablet",
        },
        {
          icon: <FaMobileAlt className="text-emerald-500" />,
          label: "Mobile",
        },
      ],
    },

    featuresSection: {
      heading: "Frontend stack we prefer",
      features: [
        {
          icon: <SiReact className="mt-1 text-2xl text-[#61DAFB]" />,
          title: "React-based UI",
          description:
            "Component-driven interfaces that are easy to extend and maintain.",
        },
        {
          icon: <SiJavascript className="mt-1 text-2xl text-[#F7DF1E]" />,
          title: "Modern JavaScript",
          description:
            "Clean, modern JavaScript with strong patterns and maintainable structure.",
        },
        {
          icon: <SiTailwindcss className="mt-1 text-2xl text-[#38BDF8]" />,
          title: "Tailwind CSS",
          description:
            "Utility-first styling for consistent, scalable, and fast UI delivery.",
        },
      ],
    },
  },
};

export default ServicePagesData;
