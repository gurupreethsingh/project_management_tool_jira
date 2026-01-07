// src/pages/common_pages/Homepage.jsx
import React from "react";

// ✅ HERO PROPS FOR THIS PAGE (unique)
export const homepageHero = {
  heroTitle: "Welcome to ECODERS  - Build. Scale. Innovate.",
  heroSubtitle:
    "From AI solutions to modern web platforms, we help teams ship faster with reliable engineering and clean design.",
  showHero: true,
  // heroBg: optional (if you want custom background per page)
  // heroBg: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2400&q=70",
};

const SECTIONS = [
  {
    title: "Lorem Ipsum",
    text: `Lorem Ipsum "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..." 
"There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain..."`,
  },
  {
    title: "What is Lorem Ipsum?",
    text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`,
  },
  {
    title: "Why do we use it?",
    text: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
  },
  {
    title: "Where does it come from?",
    text: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage.`,
  },
  {
    title: "Where can I get some?",
    text: `There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.`,
  },
];

const Homepage = () => {
  return (
    <main
      className="
        min-h-screen bg-white
        [font-family:ui-sans-serif,system-ui,-apple-system,Segoe_UI,Roboto,Inter,Helvetica,Arial,'Apple_Color_Emoji','Segoe_UI_Emoji']
      "
    >
      {/* PAGE FRAME: same spacing system across all breakpoints */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ">
        {/* HERO */}
        <section className="pt-10 sm:pt-12 lg:pt-14">
          <div className="mx-auto w-full">
            <h1 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Modern, consistent layout (Desktop + Mobile)
            </h1>

            <p className="mt-4 text-pretty text-sm leading-7 text-gray-600 sm:text-base">
              This page keeps the same content width, spacing rhythm, and card
              styling across mobile and desktop — only typography scales
              slightly to fit the screen.
            </p>

            {/* small action row (optional) */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="
                  inline-flex items-center justify-center rounded-full
                  bg-indigo-700 px-4 py-2 text-sm font-semibold text-white
                  shadow-sm hover:bg-indigo-600 focus:outline-none
                  focus-visible:ring-2 focus-visible:ring-indigo-600/40
                "
              >
                Primary Action
              </button>
              <button
                type="button"
                className="
                  inline-flex items-center justify-center rounded-full
                  bg-white px-4 py-2 text-sm font-semibold text-gray-900
                  ring-1 ring-gray-900/10 hover:bg-gray-50
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40
                "
              >
                Secondary Action
              </button>
            </div>
          </div>
        </section>

        {/* CONTENT CARD (consistent on all breakpoints) */}
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
                  <h2 className="text-sm font-semibold tracking-tight text-gray-900">
                    Article Content
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Consistent padding, spacing, and readable width.
                  </p>
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  Responsive
                </span>
              </div>

              <div className="mt-6 space-y-7 sm:space-y-8">
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

              {/* footer row */}
              <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">
                  Need more sections? Add to <code>SECTIONS</code>.
                </p>
                <div className="flex gap-2">
                  <a
                    href="/privacy-policy"
                    className="text-xs font-semibold text-indigo-900 hover:text-indigo-700"
                  >
                    Privacy Policy
                  </a>
                  <span className="text-xs text-gray-300">·</span>
                  <a
                    href="/contact"
                    className="text-xs font-semibold text-indigo-900 hover:text-indigo-700"
                  >
                    ecoders.ai.services@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* EXTRA SCROLL AREA (so you can see header transparency while scrolling) */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="
                    rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/10
                  "
                >
                  <div className="text-sm font-semibold text-gray-900">
                    Card #{i}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    Extra content blocks to test scrolling behavior while
                    keeping spacing consistent on mobile and desktop.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Homepage;
