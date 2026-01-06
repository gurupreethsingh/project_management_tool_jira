// src/pages/common_pages/AboutUs.jsx
import React from "react";

// ✅ HERO PROPS FOR THIS PAGE (unique)
export const aboutUsHero = {
  heroTitle: "",
  heroSubtitle: "",
  showHero: true,
};

const SECTIONS = [
  {
    title: "Who we are",
    text: `ECODERS is an engineering-first team focused on building reliable, modern products. We work with startups and growing businesses to deliver AI solutions, web/mobile platforms, automation systems, and testing tools—built with clean design and scalable architecture.`,
  },
  {
    title: "What we do",
    text: `We help teams ship faster through strong fundamentals: thoughtful UI/UX, robust backend systems, performance-focused engineering, and automation-driven workflows. Our goal is to build systems that stay maintainable as your product and users grow.`,
  },
  {
    title: "How we work",
    text: `We follow a practical, transparent process—discovery, rapid prototyping, iterative delivery, and measurable improvements. You get clear communication, realistic timelines, and code that’s structured for long-term growth.`,
  },
  {
    title: "Why ECODERS",
    text: `Consistency, quality, and speed—without sacrificing maintainability. We care about shipping features that users love, and we back it with solid engineering practices, documentation, and a clean design system.`,
  },
];

const VALUES = [
  {
    title: "Quality & Consistency",
    text: "Clean UI, stable systems, and predictable delivery across every milestone.",
  },
  {
    title: "Ownership Mindset",
    text: "We build like it’s our product—focusing on maintainability and real-world outcomes.",
  },
  {
    title: "Transparent Communication",
    text: "Clear updates, clear timelines, and clarity around what’s next—always.",
  },
  {
    title: "Performance & Security",
    text: "Efficient, scalable code with security-first thinking and best practices.",
  },
];

export default function AboutUs() {
  return (
    <main
      className="
        min-h-screen bg-white
        [font-family:ui-sans-serif,system-ui,-apple-system,Segoe_UI,Roboto,Inter,Helvetica,Arial,'Apple_Color_Emoji','Segoe_UI_Emoji']
      "
    >
      {/* PAGE FRAME: same spacing system across all breakpoints */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ">
        {/* HERO (matches Contact/Home spacing & typography) */}
        <section className="pt-10 sm:pt-12 lg:pt-14">
          <div className="mx-auto w-full">
            <span className="text-indigo-700 font-light">About us &rarr; </span>
            <h1 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Building with clarity, quality, and speed
            </h1>

            <p className="mt-4 text-pretty text-sm leading-7 text-gray-600 sm:text-base">
              ECODERS helps teams build AI-driven products, modern web
              platforms, automation-first systems, and robust engineering
              solutions—crafted to scale.
            </p>

            {/* small action row (optional) */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#our-story"
                className="
                  inline-flex items-center justify-center rounded-full
                  bg-indigo-700 px-4 py-2 text-sm font-semibold text-white
                  shadow-sm hover:bg-indigo-600 focus:outline-none
                  focus-visible:ring-2 focus-visible:ring-indigo-600/40
                "
              >
                Our Story
              </a>
              <a
                href="#values"
                className="
                  inline-flex items-center justify-center rounded-full
                  bg-white px-4 py-2 text-sm font-semibold text-gray-900
                  ring-1 ring-gray-900/10 hover:bg-gray-50
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40
                "
              >
                Our Values
              </a>
            </div>
          </div>
        </section>

        {/* CONTENT CARD (same card system as Contact) */}
        <section className="py-10 sm:py-12 lg:py-14">
          <div className="mx-auto w-full">
            <div
              className="
                rounded-3xl bg-white/90 backdrop-blur
                ring-1 ring-gray-900/10 shadow-sm
                p-5 sm:p-6 lg:p-8
              "
            >
              {/* meta row */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-indigo-900">
                    About ECODERS
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Our story, approach, and what we stand for.
                  </p>
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  AboutUs
                </span>
              </div>

              {/* Long sections (same typography) */}
              <div id="our-story" className="mt-6 space-y-7 sm:space-y-8">
                {SECTIONS.map((s) => (
                  <article key={s.title} className="space-y-2">
                    <h3 className="text-base font-semibold tracking-tight text-gray-900 sm:text-lg">
                      {s.title}
                    </h3>
                    <p className="text-sm leading-7 text-gray-600 sm:text-base">
                      {s.text}
                    </p>
                  </article>
                ))}
              </div>

              {/* Values grid (same “extra card” styling you used) */}
              <div id="values" className="mt-10">
                <h3 className="text-base font-semibold tracking-tight text-gray-900 sm:text-lg">
                  Our values
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-600 sm:text-base">
                  These principles guide how we build, communicate, and deliver.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {VALUES.map((v) => (
                    <div
                      key={v.title}
                      className="
                        rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/10
                      "
                    >
                      <div className="text-sm font-semibold text-gray-900">
                        {v.title}
                      </div>
                      <p className="mt-2 text-sm leading-7 text-gray-600">
                        {v.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* footer row (same pattern) */}
              <div className="mt-10 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">
                  Want to collaborate? Visit the <code>/contact</code> page.
                </p>
                <div className="flex gap-2">
                  <a
                    href="/privacy-policy"
                    className="text-xs font-semibold text-indigo-900 hover:text-indigo-700"
                  >
                    Privacy Policy
                  </a>
                  <span className="text-xs text-indigo-300">·</span>
                  <a
                    href="mailto:contact@ecoders.in"
                    className="text-xs font-semibold text-indigo-900 hover:text-indigo-700"
                  >
                    contact@ecoders.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
