// AllDropdownTypes.jsx (FULL FILE — ECODERS style, responsive, fast, Selenium-practice ready)
// ✅ Covers: native <select> single, native <select multiple>, grouped options,
// searchable custom dropdown, async/dynamic options, dependent dropdowns (country->state),
// datalist (autocomplete), and “disabled option” cases.
// ✅ Adds stable ids + simple UI to practice selectByVisibleText/value/index and custom dropdown clicking.

import React, { useEffect, useMemo, useState } from "react";
import {
  FaChevronDown,
  FaSearch,
  FaListAlt,
  FaLayerGroup,
  FaSyncAlt,
  FaInfoCircle,
  FaBan,
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

export default function AllDropdownTypes() {
  const [status, setStatus] = useState("Ready");

  // Native selects
  const [course, setCourse] = useState("selenium");
  const [multi, setMulti] = useState(["java", "api"]);
  const [grouped, setGrouped] = useState("chrome");

  // Dependent dropdowns
  const [country, setCountry] = useState("IN");
  const [state, setState] = useState("KA");

  // Custom searchable dropdown
  const [customOpen, setCustomOpen] = useState(false);
  const [customQuery, setCustomQuery] = useState("");
  const [customValue, setCustomValue] = useState("Selenium Basics");

  // Dynamic options
  const [loading, setLoading] = useState(false);
  const [dynOptions, setDynOptions] = useState([
    { value: "p1", label: "Project 1" },
    { value: "p2", label: "Project 2" },
  ]);
  const [dynPick, setDynPick] = useState("p1");

  const statesByCountry = useMemo(
    () => ({
      IN: [
        { value: "KA", label: "Karnataka" },
        { value: "TN", label: "Tamil Nadu" },
        { value: "MH", label: "Maharashtra" },
      ],
      US: [
        { value: "CA", label: "California" },
        { value: "NY", label: "New York" },
        { value: "TX", label: "Texas" },
      ],
      AE: [
        { value: "DU", label: "Dubai" },
        { value: "AZ", label: "Abu Dhabi" },
      ],
    }),
    [],
  );

  useEffect(() => {
    const options = statesByCountry[country] || [];
    const exists = options.some((o) => o.value === state);
    if (!exists) setState(options[0]?.value || "");
  }, [country, state, statesByCountry]);

  const customOptions = useMemo(
    () => [
      "Selenium Basics",
      "Selenium Advanced",
      "TestNG Framework",
      "Cucumber BDD",
      "API Testing - REST Assured",
      "Playwright Intro",
      "XPath Mastery",
    ],
    [],
  );

  const filteredCustom = useMemo(() => {
    const q = customQuery.trim().toLowerCase();
    if (!q) return customOptions;
    return customOptions.filter((x) => x.toLowerCase().includes(q));
  }, [customOptions, customQuery]);

  const toggleMulti = (val) => {
    setMulti((prev) => {
      const set = new Set(prev);
      set.has(val) ? set.delete(val) : set.add(val);
      return Array.from(set);
    });
  };

  const reloadDynamic = async () => {
    setLoading(true);
    setStatus("Loading dynamic options...");
    // simulate server delay
    setTimeout(() => {
      const now = Date.now();
      const next = [
        { value: `pA-${now}`, label: `Dynamic A (${now})` },
        { value: `pB-${now}`, label: `Dynamic B (${now})` },
        { value: `pC-${now}`, label: `Dynamic C (${now})` },
      ];
      setDynOptions(next);
      setDynPick(next[0].value);
      setLoading(false);
      setStatus("Dynamic options loaded ✅");
    }, 900);
  };

  useEffect(() => {
    const onDocClick = () => setCustomOpen(false);
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50" />
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
          <div className="flex flex-wrap gap-2 mb-4">
            {["SELENIUM", "DROPDOWNS", "SELECT", "CUSTOM UI"].map((item) => (
              <span
                key={item}
                className="px-3 py-1 text-[11px] font-medium rounded-full bg-slate-900 text-white"
              >
                {item}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900">
            Dropdown Types Practice
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Native Select + Custom Dropdowns + Dynamic
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Practice every dropdown style: native <code>&lt;select&gt;</code>{" "}
            (single/multi), grouped options, dependent dropdowns, searchable
            custom dropdown, datalist autocomplete, disabled options, and
            dynamic options loading.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>
              Status: <span className="font-semibold">{status}</span>
            </Badge>
            <Badge>Native select: selectByVisibleText/value/index</Badge>
            <Badge>Custom dropdown: click + filter + select item</Badge>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="py-10 sm:py-14 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7">
            {/* Native single select */}
            <Card
              icon={FaListAlt}
              title="1) Native Select (Single)"
              desc="Classic HTML <select>. Best for Selenium Select class."
              toneClass="text-sky-400"
            >
              <label className="text-xs font-semibold text-slate-700">
                Course
              </label>
              <select
                id="sel-course"
                value={course}
                onChange={(e) => {
                  setCourse(e.target.value);
                  setStatus(`Selected course: ${e.target.value}`);
                }}
                className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
              >
                <option value="selenium">Selenium</option>
                <option value="testng">TestNG</option>
                <option value="cucumber">Cucumber</option>
                <option value="api">REST Assured</option>
              </select>

              <div className="mt-3 text-[11px] text-slate-500">
                Selenium:{" "}
                <code>new Select(el).selectByVisibleText("Selenium")</code>
              </div>
            </Card>

            {/* Native multi select */}
            <Card
              icon={FaLayerGroup}
              title="2) Native Select (Multiple)"
              desc="Multi-select list. Practice selecting multiple items."
              toneClass="text-purple-400"
            >
              <label className="text-xs font-semibold text-slate-700">
                Skills (multi)
              </label>
              <select
                id="sel-multi"
                multiple
                value={multi}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(
                    (o) => o.value,
                  );
                  setMulti(selected);
                  setStatus(`Multi selected: ${selected.join(", ") || "-"}`);
                }}
                className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm min-h-[140px]"
              >
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="api">API Testing</option>
                <option value="ui">UI Automation</option>
                <option value="sql">SQL</option>
              </select>

              <div className="mt-3 text-[11px] text-slate-500">
                Selenium: Select.getAllSelectedOptions() / deselectAll()
              </div>

              {/* quick toggles (useful for custom selection practice too) */}
              <div className="mt-4 flex flex-wrap gap-2">
                {["java", "python", "api", "ui", "sql"].map((v) => (
                  <button
                    key={v}
                    id={`btn-toggle-${v}`}
                    onClick={() => {
                      toggleMulti(v);
                      setStatus(`Toggled: ${v}`);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${
                      multi.includes(v)
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {v.toUpperCase()}
                  </button>
                ))}
              </div>
            </Card>

            {/* Grouped options */}
            <Card
              icon={FaLayerGroup}
              title="3) Grouped Options (optgroup)"
              desc="Select with option groups (browser types / devices)."
              toneClass="text-emerald-400"
            >
              <label className="text-xs font-semibold text-slate-700">
                Browser
              </label>
              <select
                id="sel-grouped"
                value={grouped}
                onChange={(e) => {
                  setGrouped(e.target.value);
                  setStatus(`Grouped selected: ${e.target.value}`);
                }}
                className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
              >
                <optgroup label="Desktop Browsers">
                  <option value="chrome">Chrome</option>
                  <option value="firefox">Firefox</option>
                  <option value="edge">Edge</option>
                </optgroup>
                <optgroup label="Mobile">
                  <option value="android">Android Chrome</option>
                  <option value="ios">iOS Safari</option>
                </optgroup>
              </select>

              <div className="mt-3 text-[11px] text-slate-500">
                Selenium Select works same with optgroup.
              </div>
            </Card>

            {/* Dependent dropdown */}
            <Card
              icon={FaListAlt}
              title="4) Dependent Dropdown (Country → State)"
              desc="State options change based on country selection."
              toneClass="text-amber-400"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Country
                  </label>
                  <select
                    id="sel-country"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setStatus(`Country changed: ${e.target.value}`);
                    }}
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                  >
                    <option value="IN">India</option>
                    <option value="US">USA</option>
                    <option value="AE">UAE</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    State
                  </label>
                  <select
                    id="sel-state"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setStatus(`State changed: ${e.target.value}`);
                    }}
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                  >
                    {(statesByCountry[country] || []).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-500">
                Selenium: select country, then wait for state options to
                refresh.
              </div>
            </Card>

            {/* Custom searchable dropdown */}
            <Card
              icon={FaSearch}
              title="5) Custom Searchable Dropdown (Non-Select)"
              desc="This is not a native <select>. Automate by clicking and selecting list items."
              toneClass="text-indigo-400"
            >
              <div className="relative">
                <label className="text-xs font-semibold text-slate-700">
                  Module
                </label>

                <button
                  id="custom-dd-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCustomOpen((p) => !p);
                    setStatus("Custom dropdown toggled");
                  }}
                  className="mt-2 w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm hover:bg-slate-50 transition"
                >
                  <span className="truncate">{customValue}</span>
                  <FaChevronDown className="text-slate-500" />
                </button>

                {customOpen ? (
                  <div
                    id="custom-dd-menu"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute z-40 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden"
                  >
                    <div className="p-3 border-b border-slate-200">
                      <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                          id="custom-dd-search"
                          value={customQuery}
                          onChange={(e) => setCustomQuery(e.target.value)}
                          placeholder="Search..."
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                        />
                      </div>
                    </div>

                    <div className="max-h-56 overflow-auto p-2">
                      {filteredCustom.length ? (
                        filteredCustom.map((opt) => (
                          <button
                            key={opt}
                            id={`custom-opt-${opt.replace(/\s+/g, "-").toLowerCase()}`}
                            onClick={() => {
                              setCustomValue(opt);
                              setCustomOpen(false);
                              setCustomQuery("");
                              setStatus(`Custom selected: ${opt}`);
                            }}
                            className="w-full text-left px-3 py-2.5 rounded-xl text-sm hover:bg-slate-50 transition"
                          >
                            {opt}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-3 text-sm text-slate-500">
                          No results
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-3 text-[11px] text-slate-500">
                Selenium: click toggle → type search → click option element
              </div>
            </Card>

            {/* Dynamic options */}
            <Card
              icon={FaSyncAlt}
              title="6) Dynamic / Async Options"
              desc="Options refresh after “API” load. Practice waits."
              toneClass="text-sky-400"
            >
              <div className="flex flex-wrap items-center gap-3">
                <button
                  id="btn-reload-dynamic"
                  disabled={loading}
                  onClick={reloadDynamic}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60"
                >
                  {loading ? "Loading..." : "Reload Options"}
                </button>

                <select
                  id="sel-dynamic"
                  value={dynPick}
                  onChange={(e) => {
                    setDynPick(e.target.value);
                    setStatus(`Dynamic picked: ${e.target.value}`);
                  }}
                  className="min-w-[220px] px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                >
                  {dynOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 text-[11px] text-slate-500">
                Selenium: wait until options count changes or text appears.
              </div>
            </Card>

            {/* Datalist */}
            <Card
              icon={FaSearch}
              title="7) Datalist Autocomplete"
              desc="Looks like dropdown, but it’s an input with suggestions."
              toneClass="text-emerald-400"
            >
              <label className="text-xs font-semibold text-slate-700">
                Search Tool
              </label>
              <input
                id="inp-datalist"
                list="tools"
                placeholder="Type 'S...' "
                onChange={(e) => setStatus(`Datalist typed: ${e.target.value}`)}
                className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
              />
              <datalist id="tools">
                <option value="Selenium" />
                <option value="TestNG" />
                <option value="Cucumber" />
                <option value="Playwright" />
                <option value="Postman" />
              </datalist>

              <div className="mt-3 text-[11px] text-slate-500">
                Selenium: treat it like input; sendKeys full value.
              </div>
            </Card>

            {/* Disabled option */}
            <Card
              icon={FaBan}
              title="8) Disabled Option / Disabled Dropdown"
              desc="Negative tests for disabled options."
              toneClass="text-rose-400"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Disabled option inside select
                  </label>
                  <select
                    id="sel-disabled-option"
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                    onChange={(e) => setStatus(`Selected: ${e.target.value}`)}
                    defaultValue="ok1"
                  >
                    <option value="ok1">Active Option 1</option>
                    <option value="disabled1" disabled>
                      Disabled Option (cannot select)
                    </option>
                    <option value="ok2">Active Option 2</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Entire dropdown disabled
                  </label>
                  <select
                    id="sel-disabled"
                    disabled
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm cursor-not-allowed"
                  >
                    <option>Disabled Select</option>
                  </select>
                  <div className="mt-2 text-[11px] text-slate-500">
                    Selenium: verify disabled attribute.
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <FaInfoCircle className="text-slate-500" />
              Selenium Notes
            </div>
            <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="text-slate-500">•</span> Native select: use{" "}
                <code>Select</code> class.
              </li>
              <li className="flex gap-2">
                <span className="text-slate-500">•</span> Custom dropdown: click
                + locate list item.
              </li>
              <li className="flex gap-2">
                <span className="text-slate-500">•</span> Dynamic: wait for
                option presence/text.
              </li>
              <li className="flex gap-2">
                <span className="text-slate-500">•</span> Dependent: select
                parent then wait child options.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
