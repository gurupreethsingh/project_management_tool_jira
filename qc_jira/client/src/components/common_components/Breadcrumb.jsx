import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ pageTitle }) => {
  const crumbRef = useRef(null);

  // ✅ Keep --crumb-h synced (breadcrumb can wrap on mobile)
  useEffect(() => {
    if (!crumbRef.current) return;
    const el = crumbRef.current;

    let raf = 0;
    const setVar = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = el.getBoundingClientRect().height;
        const next = `${Math.ceil(h)}px`;
        const cur = getComputedStyle(document.documentElement).getPropertyValue(
          "--crumb-h",
        );
        if (cur.trim() !== next) {
          document.documentElement.style.setProperty("--crumb-h", next);
        }
      });
    };

    setVar();
    const ro = new ResizeObserver(() => setVar());
    ro.observe(el);

    window.addEventListener("resize", setVar);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
      cancelAnimationFrame(raf);
    };
  }, [pageTitle]);

  return (
    <nav
      ref={crumbRef}
      className="w-full py-2 text-xs sm:text-sm font-medium text-slate-600"
      aria-label="Breadcrumb"
    >
      {/* ✅ Mobile visible: horizontal scroll if long */}
      <ol className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        <li className="shrink-0">
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Ecoders
          </Link>
        </li>
        <li className="text-slate-500 shrink-0">/</li>

        <li className="text-slate-800 truncate max-w-[70vw] sm:max-w-[60vw]">
          {pageTitle}
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
