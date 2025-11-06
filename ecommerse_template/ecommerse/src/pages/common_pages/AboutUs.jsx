// file: src/pages/AboutUs.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { FaTh, FaThLarge, FaThList } from "react-icons/fa";
import Layout1 from "./Layout1";
import Layout2 from "./Layout2";
import Layout3 from "./Layout3";

/**
 * Icon-only layout switcher (transparent buttons):
 * - No bg on icons/buttons
 * - Per-icon accent colors (indigo / emerald / amber)
 * - Selected = brighter icon + thin colored underline
 * - Keyboard: 1/2/3 and ArrowLeft/Right
 * - Persists selection in localStorage
 */

const OPTIONS = [
  { id: "Layout 1", title: "Grid view", icon: FaTh,       active: "text-indigo-600", hover: "hover:text-indigo-500" },
  { id: "Layout 2", title: "Large grid", icon: FaThLarge, active: "text-emerald-600", hover: "hover:text-emerald-500" },
  { id: "Layout 3", title: "List view",  icon: FaThList,  active: "text-amber-600",  hover: "hover:text-amber-500" },
];

export default function AboutUs() {
  const [selectedLayout, setSelectedLayout] = useState(() => {
    return localStorage.getItem("aboutus_layout") || "Layout 1";
  });

  useEffect(() => {
    localStorage.setItem("aboutus_layout", selectedLayout);
  }, [selectedLayout]);

  // Hotkeys: 1/2/3 + arrows; ignore when typing in fields
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "1") setSelectedLayout("Layout 1");
      if (e.key === "2") setSelectedLayout("Layout 2");
      if (e.key === "3") setSelectedLayout("Layout 3");
      if (e.key === "ArrowRight") cycle(1);
      if (e.key === "ArrowLeft") cycle(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ids = useMemo(() => OPTIONS.map((o) => o.id), []);
  const cycle = (delta) => {
    const i = ids.indexOf(selectedLayout);
    const next = ids[(i + delta + ids.length) % ids.length];
    setSelectedLayout(next);
  };

  const renderLayout = useCallback(() => {
    switch (selectedLayout) {
      case "Layout 1": return <Layout1 />;
      case "Layout 2": return <Layout2 />;
      case "Layout 3": return <Layout3 />;
      default:         return <Layout1 />;
    }
  }, [selectedLayout]);

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Icon Toggle */}
      <div className="w-full flex justify-end px-3 py-3">
        <IconToggle
          options={OPTIONS}
          value={selectedLayout}
          onChange={setSelectedLayout}
          onCycle={cycle}
        />
      </div>

      {renderLayout()}
    </div>
  );
}

/* ---------------- UI Pieces ---------------- */

function IconToggle({ options, value, onChange }) {
  const currentIndex = options.findIndex((o) => o.id === value);

  // Arrow key support when the toolbar is focused (optional):
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      const next = options[(currentIndex + 1) % options.length];
      onChange(next.id);
    }
    if (e.key === "ArrowLeft") {
      const prev = options[(currentIndex - 1 + options.length) % options.length];
      onChange(prev.id);
    }
  };

  return (
    <div
      role="toolbar"
      aria-label="Select layout"
      className="inline-flex items-center gap-1"
      onKeyDown={onKeyDown}
    >
      {options.map((opt, i) => {
        const active = opt.id === value;
        const Icon = opt.icon;

        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={active}
            aria-current={active ? "true" : undefined}
            title={`${opt.title} (press ${i + 1})`}
            onClick={() => onChange(opt.id)}
            className={[
              // Transparent button, no bg
              "relative inline-flex items-center justify-center w-10 h-9",
              "rounded-md transition focus:outline-none focus:ring-2 focus:ring-slate-300",
              "bg-transparent", // ensure no background
            ].join(" ")}
          >
            {/* ICON */}
            <Icon
              size={18}
              className={[
                active ? opt.active : "text-slate-500",
                !active ? opt.hover : "", // hover only when not active
                "transition-colors"
              ].join(" ")}
            />

            {/* Underline indicator (only when active) */}
            {active && (
              <span
                aria-hidden
                className={[
                  "pointer-events-none absolute left-2 right-2 -bottom-1 h-0.5 rounded-full",
                  // match icon color
                  opt.active.replace("text-", "bg-"),
                ].join(" ")}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
