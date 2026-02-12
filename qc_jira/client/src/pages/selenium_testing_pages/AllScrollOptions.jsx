// AllScrollOptions.jsx (FULL FILE — ECODERS style, responsive, fast, Selenium-practice ready)
// ✅ Covers: scroll down/up, scroll by pixels, scroll to element, smooth scroll, scrollIntoView,
// scroll within a scrollable div, infinite-ish list (append items), and “back to top”.
// ✅ Adds clear ids/data attributes for Selenium.

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaBullseye,
  FaMousePointer,
  FaListUl,
  FaPlus,
  FaCompressArrowsAlt,
  FaInfoCircle,
} from "react-icons/fa";

function Badge({ children }) {
  return (
    <span className="px-3 py-1 text-[11px] font-medium rounded-full border border-slate-200 bg-white text-slate-700">
      {children}
    </span>
  );
}

function Card({
  icon: Icon,
  title,
  desc,
  children,
  toneClass = "text-indigo-400",
}) {
  return (
    <div className="group border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-md group-hover:scale-105 transition-all">
          <Icon className={`text-xl ${toneClass}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export default function AllScrollOptions() {
  const [lastAction, setLastAction] = useState("None");
  const [px, setPx] = useState(400);

  const targetRef = useRef(null);
  const bottomRef = useRef(null);
  const scrollBoxRef = useRef(null);
  const scrollBoxTargetRef = useRef(null);

  const [items, setItems] = useState(() =>
    Array.from({ length: 25 }, (_, i) => `Item #${i + 1}`),
  );

  const actions = useMemo(
    () => ({
      scrollDown: () => {
        setLastAction("window.scrollBy(0, 600)");
        window.scrollBy({ top: 600, left: 0, behavior: "smooth" });
      },
      scrollUp: () => {
        setLastAction("window.scrollBy(0, -600)");
        window.scrollBy({ top: -600, left: 0, behavior: "smooth" });
      },
      scrollToTop: () => {
        setLastAction("window.scrollTo(0, 0)");
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      },
      scrollToBottom: () => {
        setLastAction("Scroll to page bottom element");
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      },
      scrollByPixels: () => {
        const amt = Math.max(0, Number(px) || 0);
        setLastAction(`window.scrollBy(0, ${amt})`);
        window.scrollBy({ top: amt, left: 0, behavior: "smooth" });
      },
      scrollByPixelsUp: () => {
        const amt = Math.max(0, Number(px) || 0);
        setLastAction(`window.scrollBy(0, -${amt})`);
        window.scrollBy({ top: -amt, left: 0, behavior: "smooth" });
      },
      scrollToElement: () => {
        setLastAction("element.scrollIntoView()");
        targetRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      },
      scrollToElementTop: () => {
        setLastAction("element.scrollIntoView(block=start)");
        targetRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      },
      scrollToElementBottom: () => {
        setLastAction("element.scrollIntoView(block=end)");
        targetRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      },
      scrollBoxDown: () => {
        setLastAction("Scroll inside scrollable div (down)");
        const el = scrollBoxRef.current;
        if (!el) return;
        el.scrollBy({ top: 160, left: 0, behavior: "smooth" });
      },
      scrollBoxUp: () => {
        setLastAction("Scroll inside scrollable div (up)");
        const el = scrollBoxRef.current;
        if (!el) return;
        el.scrollBy({ top: -160, left: 0, behavior: "smooth" });
      },
      scrollBoxToTarget: () => {
        setLastAction("Scroll to element inside scrollable div");
        scrollBoxTargetRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      },
      addMoreItems: () => {
        setLastAction("Append list items (simulate infinite scroll)");
        setItems((prev) => {
          const start = prev.length;
          const more = Array.from(
            { length: 15 },
            (_, i) => `Item #${start + i + 1}`,
          );
          return [...prev, ...more];
        });
      },
    }),
    [px],
  );

  useEffect(() => {
    // lightweight “scroll spy” just to show students scroll changes
    const onScroll = () => {
      // keep it super light, no setState on every pixel
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50" />
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
          <div className="flex flex-wrap gap-2 mb-4">
            {["SELENIUM", "SCROLL", "WINDOW", "ELEMENT"].map((item) => (
              <span
                key={item}
                className="px-3 py-1 text-[11px] font-medium rounded-full bg-slate-900 text-white"
              >
                {item}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
            Scroll Practice Lab
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Every Scroll Option for Selenium
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Practice scrolling the window and scrolling inside containers:
            scrollBy pixels, scrollTo top/bottom, scrollIntoView for elements,
            and “infinite” list expansion.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>
              Last action: <span className="font-semibold">{lastAction}</span>
            </Badge>
            <Badge>
              Target element id:{" "}
              <span className="font-semibold">scroll-target</span>
            </Badge>
          </div>

          {/* QUICK CONTROLS */}
          <div className="mt-7 rounded-3xl bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <FaInfoCircle className="text-slate-500" />
                  Quick Scroll Controls
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  Use these buttons for fast Selenium scripts.
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    id="btn-scroll-down"
                    onClick={actions.scrollDown}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <FaArrowDown className="inline mr-2 text-sm" />
                    Scroll Down
                  </button>

                  <button
                    id="btn-scroll-up"
                    onClick={actions.scrollUp}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                  >
                    <FaArrowUp className="inline mr-2 text-sm" />
                    Scroll Up
                  </button>

                  <button
                    id="btn-scroll-to-target"
                    onClick={actions.scrollToElement}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                  >
                    <FaBullseye className="inline mr-2 text-sm" />
                    Scroll To Target
                  </button>

                  <button
                    id="btn-scroll-bottom"
                    onClick={actions.scrollToBottom}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                  >
                    <FaArrowDown className="inline mr-2 text-sm" />
                    Scroll To Bottom
                  </button>

                  <button
                    id="btn-scroll-top"
                    onClick={actions.scrollToTop}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                  >
                    <FaArrowUp className="inline mr-2 text-sm" />
                    Back To Top
                  </button>
                </div>
              </div>

              <div className="w-full lg:w-[360px]">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold text-slate-700">
                    Scroll by Pixels
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      id="input-scroll-px"
                      type="number"
                      min={0}
                      value={px}
                      onChange={(e) => setPx(e.target.value)}
                      className="w-28 px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                    />
                    <button
                      id="btn-scroll-by-px"
                      onClick={actions.scrollByPixels}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      Scroll Down
                    </button>
                    <button
                      id="btn-scroll-by-px-up"
                      onClick={actions.scrollByPixelsUp}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                    >
                      Up
                    </button>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    Practice JS: <code>window.scrollBy(0, pixels)</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="py-10 sm:py-14 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7">
            <Card
              icon={FaBullseye}
              title="1) Scroll to Element (scrollIntoView)"
              desc="Scroll to a specific element. Use center/start/end blocks."
              toneClass="text-indigo-400"
            >
              <div className="flex flex-wrap gap-3">
                <button
                  id="btn-into-center"
                  onClick={actions.scrollToElement}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Center
                </button>
                <button
                  id="btn-into-start"
                  onClick={actions.scrollToElementTop}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                >
                  Start
                </button>
                <button
                  id="btn-into-end"
                  onClick={actions.scrollToElementBottom}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                >
                  End
                </button>
              </div>

              {/* a tall spacer to make scrolling meaningful */}
              <div className="mt-5 h-64 sm:h-72 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-sm text-slate-500">
                Spacer block (scroll area)
              </div>

              <div
                ref={targetRef}
                id="scroll-target"
                data-testid="scroll-target"
                className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
              >
                <div className="text-sm font-semibold text-emerald-900">
                  ✅ Target Element (scroll-target)
                </div>
                <div className="mt-1 text-sm text-emerald-800">
                  Selenium can scroll here then click / read text.
                </div>
              </div>
            </Card>

            <Card
              icon={FaMousePointer}
              title="2) Scroll Window (Up/Down / Pixels)"
              desc="Practice window scrolling by fixed steps and custom pixels."
              toneClass="text-sky-400"
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold text-slate-700">
                  Examples
                </div>
                <ul className="mt-2 text-sm text-slate-600 space-y-1">
                  <li>
                    <span className="text-slate-500">•</span>{" "}
                    <code>window.scrollTo(0, 0)</code>
                  </li>
                  <li>
                    <span className="text-slate-500">•</span>{" "}
                    <code>window.scrollTo(0, document.body.scrollHeight)</code>
                  </li>
                  <li>
                    <span className="text-slate-500">•</span>{" "}
                    <code>window.scrollBy(0, 600)</code>
                  </li>
                </ul>
              </div>

              <div className="mt-5 h-72 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-sm text-slate-500">
                Keep scrolling… more content below
              </div>

              <div className="mt-5 text-[11px] text-slate-500">
                Tip: In Selenium, you can use JavaScriptExecutor or
                Actions/PageDown keys.
              </div>
            </Card>

            <Card
              icon={FaCompressArrowsAlt}
              title="3) Scroll Inside a Container (Scrollable Div)"
              desc="This is important: scrolling a div is different from scrolling the window."
              toneClass="text-amber-400"
            >
              <div className="flex flex-wrap gap-3">
                <button
                  id="btn-box-down"
                  onClick={actions.scrollBoxDown}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <FaArrowDown className="inline mr-2" />
                  Scroll Box Down
                </button>
                <button
                  id="btn-box-up"
                  onClick={actions.scrollBoxUp}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                >
                  <FaArrowUp className="inline mr-2" />
                  Scroll Box Up
                </button>
                <button
                  id="btn-box-target"
                  onClick={actions.scrollBoxToTarget}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                >
                  <FaBullseye className="inline mr-2" />
                  Box → Target
                </button>
              </div>

              <div
                ref={scrollBoxRef}
                id="scroll-box"
                className="mt-5 h-[260px] rounded-2xl border border-slate-200 bg-white overflow-auto"
              >
                <div className="p-4 space-y-3">
                  {Array.from({ length: 18 }, (_, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
                    >
                      ScrollBox Row #{i + 1}
                    </div>
                  ))}

                  <div
                    ref={scrollBoxTargetRef}
                    id="scroll-box-target"
                    className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900"
                  >
                    ✅ ScrollBox Target (scroll-box-target)
                  </div>

                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={`b-${i}`}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
                    >
                      ScrollBox Tail Row #{i + 1}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-500">
                Selenium: scroll container using JS:{" "}
                <code>element.scrollTop</code> / <code>scrollBy</code>
              </div>
            </Card>

            <Card
              icon={FaListUl}
              title="4) Infinite-ish List (Append Items)"
              desc="Simulate long pages where more content loads (practice scrolling + finding last item)."
              toneClass="text-emerald-400"
            >
              <div className="flex flex-wrap gap-3">
                <button
                  id="btn-add-items"
                  onClick={actions.addMoreItems}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <FaPlus className="inline mr-2" />
                  Add 15 Items
                </button>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="p-4 space-y-2">
                  {items.map((it, idx) => (
                    <div
                      key={it}
                      id={`list-item-${idx + 1}`}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                    >
                      {it}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-500">
                Selenium: scroll until element located, then interact.
              </div>
            </Card>
          </div>

          {/* Bottom marker for “scroll to bottom” */}
          <div
            ref={bottomRef}
            id="page-bottom"
            className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center"
          >
            <div className="text-sm font-semibold text-slate-900">
              ✅ Page Bottom Marker
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Selenium can scroll here using scrollIntoView or
              document.body.scrollHeight.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
