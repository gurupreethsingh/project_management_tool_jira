import React from "react";

const PaginationLite = ({ page, totalPages, buildPages, goTo }) => {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        onClick={() => goTo(1)}
        disabled={page === 1}
        className={`px-3 py-1 rounded-full border text-sm ${
          page === 1
            ? "text-slate-400 border-slate-200 cursor-not-allowed"
            : "text-slate-700 border-slate-200 hover:bg-slate-50"
        }`}
      >
        « First
      </button>
      <button
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        className={`px-3 py-1 rounded-full border text-sm ${
          page === 1
            ? "text-slate-400 border-slate-200 cursor-not-allowed"
            : "text-slate-700 border-slate-200 hover:bg-slate-50"
        }`}
      >
        ‹ Prev
      </button>

      {buildPages().map((p, idx) =>
        p === "…" ? (
          <span key={`dots-${idx}`} className="px-2 text-slate-400 select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={`min-w-[36px] px-3 py-1 rounded-full border text-sm transition ${
              p === page
                ? "bg-slate-900 text-white border-slate-900 shadow"
                : "text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        className={`px-3 py-1 rounded-full border text-sm ${
          page === totalPages
            ? "text-slate-400 border-slate-200 cursor-not-allowed"
            : "text-slate-700 border-slate-200 hover:bg-slate-50"
        }`}
      >
        Next ›
      </button>
      <button
        onClick={() => goTo(totalPages)}
        disabled={page === totalPages}
        className={`px-3 py-1 rounded-full border text-sm ${
          page === totalPages
            ? "text-slate-400 border-slate-200 cursor-not-allowed"
            : "text-slate-700 border-slate-200 hover:bg-slate-50"
        }`}
      >
        Last »
      </button>
    </div>
  );
};

export default PaginationLite;
