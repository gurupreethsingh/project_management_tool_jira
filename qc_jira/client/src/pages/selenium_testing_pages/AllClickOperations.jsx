// AllClickOperations.jsx (FULL FILE — ECODERS style, responsive, fast, Selenium-practice ready)
// ✅ Covers: left click, double click, right click (context menu), click & hold, release,
// long press simulation, click offset, disabled click, JS click,
// open link in new tab, hover reveal, drag-and-drop mini.
// ✅ Adds stable ids/data-testid for Selenium locators.

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaMousePointer,
  FaRegHandPointer,
  FaHandRock,
  FaLink,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
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

export default function AllClickOperations() {
  const [log, setLog] = useState([]);
  const [hoverOpen, setHoverOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });
  const [holdOn, setHoldOn] = useState(false);
  const [offsetMsg, setOffsetMsg] = useState(
    "Click inside the box (shows offsets).",
  );
  const dropRef = useRef(null);
  const dragRef = useRef(null);

  const push = (msg) => {
    setLog((prev) => [msg, ...prev].slice(0, 12));
  };

  useEffect(() => {
    const onDocClick = () => setContextOpen(false);
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const onContextMenu = (e) => {
    e.preventDefault();
    setContextOpen(true);
    setContextPos({ x: e.clientX, y: e.clientY });
    push("Right click (contextmenu) triggered");
  };

  const onDouble = () => push("Double click triggered");
  const onSingle = () => push("Single click triggered");

  const onMouseDownHold = () => {
    setHoldOn(true);
    push("Click & Hold (mouseDown) started");
  };
  const onMouseUpHold = () => {
    if (holdOn) push("Release (mouseUp) done");
    setHoldOn(false);
  };

  const onLongPress = () => {
    push("Long press simulated (pointerdown > 800ms)");
  };

  // long press timer
  const lpRef = useRef(null);
  const startLP = () => {
    clearTimeout(lpRef.current);
    lpRef.current = setTimeout(onLongPress, 800);
  };
  const endLP = () => clearTimeout(lpRef.current);

  const onOffsetClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setOffsetMsg(`Clicked at offset x=${x}px, y=${y}px`);
    push(`Click offset: x=${x}, y=${y}`);
  };

  // HTML5 drag drop (simple)
  const onDragStart = (e) => {
    e.dataTransfer.setData("text/plain", "DRAG_TOKEN");
    push("Drag started");
  };
  const onDragOver = (e) => e.preventDefault();
  const onDrop = (e) => {
    e.preventDefault();
    const token = e.dataTransfer.getData("text/plain");
    if (token === "DRAG_TOKEN") {
      push("Dropped successfully into drop zone");
    } else {
      push("Drop failed (token mismatch)");
    }
  };

  const jsClick = () => {
    const el = document.getElementById("btn-js-click-target");
    if (el) el.click();
    push("Triggered JS click() on target button");
  };

  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50" />
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
          <div className="flex flex-wrap gap-2 mb-4">
            {["SELENIUM", "CLICKS", "ACTIONS", "MOUSE"].map((item) => (
              <span
                key={item}
                className="px-3 py-1 text-[11px] font-medium rounded-full bg-slate-900 text-white"
              >
                {item}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900">
            Click Operations Practice
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Every Type of Click for Selenium
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Practice single click, double click, right click, click & hold,
            offset clicks, hover reveal, open in new tab, JS click, and
            drag-drop basics.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>
              Tip: Use Selenium <span className="font-semibold">Actions</span>{" "}
              for right click, double click, clickAndHold, moveByOffset.
            </Badge>
          </div>

          {/* LOG */}
          <div className="mt-6 rounded-3xl bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FaInfoCircle className="text-slate-500" />
                Event Log (latest first)
              </div>
              <button
                id="btn-clear-log"
                onClick={() => setLog([])}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50 transition"
              >
                Clear
              </button>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                {log.length ? (
                  <ul className="space-y-2">
                    {log.map((l, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-slate-400">•</span>
                        <span className="break-words">{l}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-slate-500">No events yet.</div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold text-slate-700">
                  Quick JS Click (demo)
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    id="btn-js-click"
                    onClick={jsClick}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    Trigger JS click()
                  </button>

                  <button
                    id="btn-js-click-target"
                    onClick={() => push("Target button clicked ✅")}
                    className="px-5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition"
                  >
                    Target Button
                  </button>
                </div>

                <div className="mt-3 text-[11px] text-slate-500">
                  Practice: JS executor click vs normal click when element is
                  overlapped.
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
              icon={FaMousePointer}
              title="1) Single / Double Click"
              desc="Standard click and doubleClick actions."
              toneClass="text-sky-400"
            >
              <div className="flex flex-wrap gap-3">
                <button
                  id="btn-single-click"
                  onClick={onSingle}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Single Click
                </button>
                <button
                  id="btn-double-click"
                  onDoubleClick={onDouble}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                >
                  Double Click
                </button>
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Selenium: Actions.doubleClick(element).perform()
              </div>
            </Card>

            <Card
              icon={FaRegHandPointer}
              title="2) Right Click (Context Menu)"
              desc="Triggers contextmenu. Practice Actions.contextClick()."
              toneClass="text-amber-400"
            >
              <div
                id="right-click-area"
                onContextMenu={onContextMenu}
                className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 select-none"
              >
                Right click inside this area
                <div className="mt-2 text-[11px] text-amber-800">
                  (Selenium: Actions.contextClick(element).perform())
                </div>
              </div>

              {contextOpen ? (
                <div
                  id="context-menu"
                  className="fixed z-50 rounded-2xl border border-slate-200 bg-white shadow-xl p-2 w-56"
                  style={{ left: contextPos.x, top: contextPos.y }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {[
                    { id: "ctx-copy", label: "Copy" },
                    { id: "ctx-paste", label: "Paste" },
                    { id: "ctx-delete", label: "Delete" },
                  ].map((i) => (
                    <button
                      key={i.id}
                      id={i.id}
                      onClick={() => {
                        push(`Context menu: ${i.label} clicked`);
                        setContextOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-slate-50 transition"
                    >
                      {i.label}
                    </button>
                  ))}
                  <button
                    id="ctx-close"
                    onClick={() => setContextOpen(false)}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-slate-50 transition flex items-center gap-2"
                  >
                    <FaTimes className="text-slate-500" /> Close
                  </button>
                </div>
              ) : null}
            </Card>

            <Card
              icon={FaHandRock}
              title="3) Click & Hold / Release + Long Press"
              desc="Practice clickAndHold(), release(), long press simulation."
              toneClass="text-purple-400"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div
                  id="hold-area"
                  onMouseDown={onMouseDownHold}
                  onMouseUp={onMouseUpHold}
                  onMouseLeave={onMouseUpHold}
                  onPointerDown={startLP}
                  onPointerUp={endLP}
                  onPointerLeave={endLP}
                  className={`flex-1 rounded-2xl border p-5 select-none ${
                    holdOn
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {holdOn ? "Holding..." : "Click & hold here"}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    Long press triggers after ~800ms
                  </div>
                </div>

                <button
                  id="btn-release"
                  onClick={() => {
                    setHoldOn(false);
                    push("Manual release button clicked");
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition h-fit"
                >
                  Release (manual)
                </button>
              </div>

              <div className="mt-3 text-[11px] text-slate-500">
                Selenium: Actions.clickAndHold(el).pause().release().perform()
              </div>
            </Card>

            <Card
              icon={FaMousePointer}
              title="4) Click by Offset (inside a box)"
              desc="Practice moveByOffset / click at exact position."
              toneClass="text-sky-400"
            >
              <div
                id="offset-box"
                onClick={onOffsetClick}
                className="rounded-2xl border border-slate-200 bg-white p-6 select-none"
              >
                <div className="text-sm font-semibold text-slate-900">
                  Offset Box
                </div>
                <div className="mt-2 text-sm text-slate-600">{offsetMsg}</div>
                <div className="mt-2 text-[11px] text-slate-500">
                  Selenium: Actions.moveToElement(el, xOffset,
                  yOffset).click().perform()
                </div>
              </div>
            </Card>

            <Card
              icon={FaLink}
              title="5) Links + New Tab"
              desc="Practice clicking links and switching windows/tabs."
              toneClass="text-emerald-400"
            >
              <div className="flex flex-wrap gap-3">
                <a
                  id="link-same-tab"
                  href="#same-tab"
                  onClick={() =>
                    push("Same-tab link clicked (hash navigation)")
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                >
                  Same Tab Link{" "}
                  <FaExternalLinkAlt className="text-xs text-slate-500" />
                </a>

                <a
                  id="link-new-tab"
                  href="about:blank"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => push("New-tab link clicked")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Open New Tab <FaExternalLinkAlt className="text-xs" />
                </a>
              </div>

              <div className="mt-3 text-[11px] text-slate-500">
                Selenium: getWindowHandles(), switchTo().window(handle)
              </div>
            </Card>

            <Card
              icon={FaRegHandPointer}
              title="6) Hover Reveal"
              desc="Practice moveToElement() to reveal hidden content."
              toneClass="text-amber-400"
            >
              <div
                id="hover-box"
                onMouseEnter={() => setHoverOpen(true)}
                onMouseLeave={() => setHoverOpen(false)}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="text-sm font-semibold text-slate-900">
                  Hover here
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Hidden button appears on hover.
                </div>

                {hoverOpen ? (
                  <button
                    id="hover-reveal-btn"
                    onClick={() => push("Hover-reveal button clicked ✅")}
                    className="mt-4 px-5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition"
                  >
                    Revealed Button
                  </button>
                ) : (
                  <div className="mt-4 text-[11px] text-slate-500">
                    (Button hidden)
                  </div>
                )}
              </div>

              <div className="mt-3 text-[11px] text-slate-500">
                Selenium: Actions.moveToElement(hoverBox).perform()
              </div>
            </Card>

            <Card
              icon={FaCheckCircle}
              title="7) Drag & Drop (HTML5 basic)"
              desc="Simple drag-drop targets. Selenium often uses Actions dragAndDrop or JS workarounds."
              toneClass="text-indigo-400"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  id="drag-source"
                  ref={dragRef}
                  draggable
                  onDragStart={onDragStart}
                  className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 cursor-grab active:cursor-grabbing select-none"
                >
                  Drag Me
                  <div className="mt-2 text-[11px] text-slate-500">
                    draggable=true
                  </div>
                </div>

                <div
                  id="drop-zone"
                  ref={dropRef}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800 select-none"
                >
                  Drop Zone
                  <div className="mt-2 text-[11px] text-emerald-700">
                    (accepts token)
                  </div>
                </div>
              </div>
            </Card>

            <Card
              icon={FaExclamationTriangle}
              title="8) Disabled Click (negative test)"
              desc="Clicking disabled controls should not fire."
              toneClass="text-rose-400"
            >
              <div className="flex flex-wrap gap-3">
                <button
                  id="btn-disabled"
                  disabled
                  className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-500 text-sm font-medium cursor-not-allowed"
                >
                  Disabled Button
                </button>

                <button
                  id="btn-enabled"
                  onClick={() => push("Enabled button clicked ✅")}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Enabled Button
                </button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
