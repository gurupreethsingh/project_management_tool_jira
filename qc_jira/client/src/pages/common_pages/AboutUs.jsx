import React, { useEffect, useMemo, useState, useCallback } from "react";
import { FaTh, FaThLarge, FaThList } from "react-icons/fa";
import Layout1 from "./Layout1";
import Layout2 from "./Layout2";
import Layout3 from "./Layout3";

const OPTIONS = [
  {
    id: "Layout 1",
    title: "Grid view",
    icon: FaTh,
    active: "text-indigo-600",
    hover: "hover:text-indigo-500",
  },
  {
    id: "Layout 2",
    title: "Large grid",
    icon: FaThLarge,
    active: "text-emerald-600",
    hover: "hover:text-emerald-500",
  },
  {
    id: "Layout 3",
    title: "List view",
    icon: FaThList,
    active: "text-amber-600",
    hover: "hover:text-amber-500",
  },
];

export default function AboutUs() {
  const [selectedLayout, setSelectedLayout] = useState(() => {
    return localStorage.getItem("aboutus_layout") || "Layout 1";
  });

  useEffect(() => {
    localStorage.setItem("aboutus_layout", selectedLayout);
  }, [selectedLayout]);

  const ids = useMemo(() => OPTIONS.map((o) => o.id), []);
  const cycle = (delta) => {
    const i = ids.indexOf(selectedLayout);
    const next = ids[(i + delta + ids.length) % ids.length];
    setSelectedLayout(next);
  };

  // Hotkeys: 1/2/3 + arrows; ignore while typing
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      )
        return;
      if (e.key === "1") setSelectedLayout("Layout 1");
      if (e.key === "2") setSelectedLayout("Layout 2");
      if (e.key === "3") setSelectedLayout("Layout 3");
      if (e.key === "ArrowRight") cycle(1);
      if (e.key === "ArrowLeft") cycle(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderLayout = useCallback(() => {
    switch (selectedLayout) {
      case "Layout 1":
        return <Layout1 />;
      case "Layout 2":
        return <Layout2 />;
      case "Layout 3":
        return <Layout3 />;
      default:
        return <Layout1 />;
    }
  }, [selectedLayout]);

  return (
    <div className="container mx-auto min-h-screen bg-white">
      {/* Title row with inline icon toggle */}
      <div className="w-full px-4 sm:px-6 lg:px-10 py-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-gray-800 text-2xl sm:text-3xl">
            About Us
          </h2>
          <IconToggle
            options={OPTIONS}
            value={selectedLayout}
            onChange={setSelectedLayout}
          />
        </div>
      </div>

      {renderLayout()}
    </div>
  );
}

/* ---------------- UI Pieces ---------------- */

function IconToggle({ options, value, onChange }) {
  const currentIndex = options.findIndex((o) => o.id === value);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      const next = options[(currentIndex + 1) % options.length];
      onChange(next.id);
    }
    if (e.key === "ArrowLeft") {
      const prev =
        options[(currentIndex - 1 + options.length) % options.length];
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
              "relative inline-flex items-center justify-center w-10 h-9",
              "rounded-md transition focus:outline-none focus:ring-2 focus:ring-slate-300",
              "bg-transparent",
            ].join(" ")}
          >
            <Icon
              size={18}
              className={[
                active ? opt.active : "text-slate-500",
                !active ? opt.hover : "",
                "transition-colors",
              ].join(" ")}
            />
            {active && (
              <span
                aria-hidden
                className={[
                  "pointer-events-none absolute left-2 right-2 -bottom-1 h-0.5 rounded-full",
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
