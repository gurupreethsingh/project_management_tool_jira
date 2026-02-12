import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaFont,
  FaSearch,
  FaClock,
  FaListUl,
  FaCheckCircle,
  FaKeyboard,
  FaFilter,
  FaCopy,
} from "react-icons/fa";

const TOPICS = [
  {
    group: "Locate & Read Text",
    icon: FaSearch,
    colorClass: "text-sky-500",
    items: [
      "Get visible text from element (getText())",
      "Read text inside nested tags (span/b/strong/em)",
      "Read dynamic text after API/UI update",
      "Read hidden text via textContent",
      "Read placeholder text (getAttribute('placeholder'))",
      "Read input value (getAttribute('value'))",
      "Read attribute text (title, aria-label, data-*)",
      "Read tooltip text on hover",
      "Read toast/notification text",
      "Read modal/popup text",
    ],
  },
  {
    group: "Verify Text (Assertions)",
    icon: FaCheckCircle,
    colorClass: "text-emerald-500",
    items: [
      "Verify exact text match",
      "Verify partial / contains text",
      "Verify starts-with / ends-with text",
      "Case-insensitive text verification",
      "Trim + normalize spaces before compare",
      "Ignore punctuation / special characters compare",
      "Verify multi-line text (line breaks)",
      "Verify text across multiple elements (list assertions)",
      "Verify occurrence count (how many times text appears)",
      "Verify table cell text by row & column",
    ],
  },
  {
    group: "Wait for Text",
    icon: FaClock,
    colorClass: "text-amber-500",
    items: [
      "Wait until element contains expected text",
      "Wait until exact text appears",
      "Wait until text changes (old → new)",
      "Wait until text disappears",
      "Wait until any one of multiple texts appears (A or B)",
      "Wait until list count changes (dynamic list)",
      "Wait for page title text",
      "Wait for URL contains expected keyword",
      "Fluent wait / polling for text",
      "Custom JS wait for textContent update",
    ],
  },
  {
    group: "Lists & Collections",
    icon: FaListUl,
    colorClass: "text-purple-500",
    items: [
      "Get all texts from list (ul/li)",
      "Find any list member by text and click",
      "Get first/last item text",
      "Filter list items by partial text",
      "Sort list and verify order (A-Z / Z-A)",
      "Extract list texts and compare with expected array",
      "Get dropdown options text (Select)",
      "Verify selected dropdown option text",
      "Find table row by text and click action button",
      "Validate paginated list text",
    ],
  },
  {
    group: "Input Text Operations",
    icon: FaKeyboard,
    colorClass: "text-rose-500",
    items: [
      "Type into input (sendKeys)",
      "Clear input and type new value",
      "Append text (do not clear)",
      "Select-all and replace (CTRL+A)",
      "Backspace/delete behavior checks",
      "Copy/Paste using keyboard (CTRL+C / CTRL+V)",
      "Paste using clipboard methods (Robot/Actions)",
      "Type into contenteditable div",
      "Type into textarea and verify character count",
      "Readonly/disabled input validation",
    ],
  },
];

function Pill({ children }) {
  return (
    <span className="px-3 py-1 text-[11px] font-medium rounded-full bg-slate-900 text-white">
      {children}
    </span>
  );
}

export default function TextOperationsForSelenium() {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("All");

  const groups = useMemo(() => ["All", ...TOPICS.map((t) => t.group)], []);

  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase();

    return TOPICS.map((section) => {
      const matchGroup = activeGroup === "All" || activeGroup === section.group;

      const items = section.items.filter((item) => {
        if (!q) return true;
        return item.toLowerCase().includes(q);
      });

      return matchGroup ? { ...section, items } : { ...section, items: [] };
    }).filter((section) => section.items.length > 0);
  }, [query, activeGroup]);

  const totalCount = useMemo(() => {
    return filteredTopics.reduce((sum, sec) => sum + sec.items.length, 0);
  }, [filteredTopics]);

  return (
    <div className="bg-white text-slate-900">
      {/* ========================= HERO ========================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50" />
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20">
          {/* badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Pill>SELENIUM</Pill>
            <Pill>TEXT OPERATIONS</Pill>
            <Pill>WAITING</Pill>
            <Pill>ASSERTIONS</Pill>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* left */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-slate-900">
                Selenium Practice: Text Operations
                <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  Real-world UI text scenarios
                </span>
              </h1>

              <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-600 max-w-xl leading-relaxed">
                Practice locating, verifying, waiting, and interacting with text
                across dynamic UI components—lists, tables, toasts, modals,
                inputs, and contenteditable regions.
              </p>

              <div className="mt-7 flex flex-wrap gap-4">
                <a
                  href="#topics"
                  className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  Start Practicing
                </a>
              </div>
            </div>

            {/* right */}
            <div className="relative">
              <div className="rounded-3xl bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 p-6 sm:p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm sm:text-base font-medium">
                    <span className="text-slate-900">Quick practice </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                      checklist
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FaFont />
                    <span className="font-medium">{totalCount} items</span>
                  </div>
                </div>

                {/* search */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search topics (e.g., contains, tooltip, list, wait)..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:w-60">
                    <div className="relative">
                      <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <select
                        value={activeGroup}
                        onChange={(e) => setActiveGroup(e.target.value)}
                        className="w-full appearance-none pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                      >
                        {groups.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        ▼
                      </span>
                    </div>
                  </div>
                </div>

                {/* tiny tips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                      <FaCopy className="text-sm text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        Copy/Paste drills
                      </div>
                      <div className="text-xs text-slate-600">
                        CTRL+C / CTRL+V, select-all replace
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                      <FaClock className="text-sm text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        Waiting drills
                      </div>
                      <div className="text-xs text-slate-600">
                        text appears / changes / disappears
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 leading-relaxed">
                  Tip: ask students to write one automation script per item and
                  maintain a single reusable helper for waits + assertions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= TOPIC GRID ======================= */}
      <section id="topics" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900">
                Text Operations Topics
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
                Pick a section and implement small Selenium scripts. Focus on
                stable locators, robust waits, and clean assertions.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="px-3 py-1 rounded-full border border-slate-200 bg-white">
                Responsive
              </span>
              <span className="px-3 py-1 rounded-full border border-slate-200 bg-white">
                Fast UI
              </span>
              <span className="px-3 py-1 rounded-full border border-slate-200 bg-white">
                Tailwind
              </span>
            </div>
          </div>

          {filteredTopics.length === 0 ? (
            <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
              <div className="text-sm font-semibold text-slate-900">
                No results found
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Try a different keyword (example: <b>contains</b>,{" "}
                <b>tooltip</b>, <b>wait</b>, <b>list</b>).
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredTopics.map((section, idx) => {
                const Icon = section.icon;
                return (
                  <div
                    key={idx}
                    className="group border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-md group-hover:scale-105 transition-all">
                        <Icon className={`text-xl ${section.colorClass}`} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-slate-900 truncate">
                          {section.group}
                        </h3>
                        <div className="text-xs text-slate-500">
                          {section.items.length} practice items
                        </div>
                      </div>
                    </div>

                    <ul className="mt-4 space-y-2">
                      {section.items.map((item) => (
                        <li
                          key={item}
                          className="text-sm text-slate-700 leading-relaxed flex gap-2"
                        >
                          <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 inline-flex items-center text-xs text-slate-500 group-hover:text-slate-900 transition-colors">
                      Build script examples{" "}
                      <FaArrowRight className="ml-2 text-xs" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
