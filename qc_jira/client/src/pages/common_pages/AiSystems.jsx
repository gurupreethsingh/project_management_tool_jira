import React from "react";
import { Link } from "react-router-dom";
import {
  FaBrain,
  FaRobot,
  FaChartLine,
  FaMagic,
  FaCheckCircle,
} from "react-icons/fa";
import { SiTensorflow, SiPytorch, SiOpenai } from "react-icons/si";

export default function AiSystems() {
  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
        <div className="absolute top-[-90px] left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[110px] opacity-80" />

        <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-9">
          <nav className="mb-2 text-xs sm:text-sm text-slate-500">
            <Link to="/homepage" className="hover:text-slate-900">
              Home
            </Link>{" "}
            <span className="mx-1">/</span>
            <Link to="/explore-solutions" className="hover:text-slate-900">
              Solutions
            </Link>{" "}
            <span className="mx-1">/</span>
            <span className="text-slate-700">AI systems</span>
          </nav>

          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
                AI systems &amp; automation
              </h1>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl">
                We design AI components that plug into your existing tools:
                summarising work, predicting risks, recommending next actions
                and triggering automations.
              </p>
            </div>

            <div className="flex items-center gap-3 text-[11px] sm:text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span>Production-focused</span>
              </span>
              <span className="hidden sm:inline-block">·</span>
              <span className="hidden sm:inline-block">Model-agnostic</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="bg-white">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-9 lg:py-10 space-y-8 lg:space-y-9">
          {/* What we do + Highlight */}
          <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr),minmax(0,1fr)] gap-7 lg:gap-8">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">
                What we build with AI
              </h2>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex gap-2">
                  <FaCheckCircle className="mt-[3px] text-purple-500 text-xs" />
                  <span>
                    Task, ticket and defect summarisation directly inside your
                    dashboards.
                  </span>
                </li>
                <li className="flex gap-2">
                  <FaCheckCircle className="mt-[3px] text-indigo-500 text-xs" />
                  <span>
                    Ranking &amp; recommendation models for priorities, owners
                    and next actions.
                  </span>
                </li>
                <li className="flex gap-2">
                  <FaCheckCircle className="mt-[3px] text-pink-500 text-xs" />
                  <span>
                    Natural language interfaces over project data, logs and
                    knowledge bases.
                  </span>
                </li>
                <li className="flex gap-2">
                  <FaCheckCircle className="mt-[3px] text-slate-900 text-xs" />
                  <span>
                    Automation flows that trigger based on AI signals (e.g.
                    &quot;high risk&quot; or &quot;urgent&quot;).
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 sm:p-6 bg-white shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center">
                  <FaBrain className="text-xl text-yellow-300" />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  AI as part of your product, not a separate toy.
                </p>
              </div>
              <p className="text-sm text-slate-700">
                We focus on predictable behaviour, controllable prompts and
                clear fallbacks — so AI features feel like a reliable teammate,
                not a demo experiment.
              </p>

              <div className="mt-2 flex flex-wrap gap-3 text-[11px] sm:text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                  <SiTensorflow className="text-[#FF6F00]" />
                  <span>TensorFlow</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                  <SiPytorch className="text-[#EE4C2C]" />
                  <span>PyTorch</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                  <SiOpenai className="text-[#00A67E]" />
                  <span>LLM APIs</span>
                </span>
              </div>
            </div>
          </section>

          {/* Patterns */}
          <section>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 mb-3">
              Typical AI patterns we implement
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200 p-4 flex gap-3 items-start">
                <FaMagic className="mt-1 text-indigo-500" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-900">
                    Smart assist panels
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-600">
                    Inline AI &quot;assist&quot; for descriptions, comments,
                    messages and test cases.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 flex gap-3 items-start">
                <FaChartLine className="mt-1 text-emerald-500" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-900">
                    Forecasts &amp; insights
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-600">
                    Identify slow-moving items, blocked work and likely schedule
                    risks.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 flex gap-3 items-start">
                <FaRobot className="mt-1 text-pink-500" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-900">
                    Automation bots
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-600">
                    Bots that watch your data and perform the boring actions
                    automatically.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
