import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WishlistPagination = React.memo(
  ({ productsPerPage, totalProducts, currentPage, paginate }) => {
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    if (totalPages <= 1) return null;

    const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

    let center = clamp(currentPage, 1, totalPages);
    let start = center - 1;
    let end = center + 1;

    if (start < 1) {
      start = 1;
      end = Math.min(3, totalPages);
    }
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, totalPages - 2);
    }

    const pages = [];
    for (let p = start; p <= end; p++) pages.push(p);

    const canPrev = currentPage > 1;
    const canNext = currentPage < totalPages;

    return (
      <div className="flex justify-center mt-4">
        <nav className="inline-flex items-center gap-1.5 justify-center flex-wrap">
          <button
            type="button"
            onClick={() => canPrev && paginate(currentPage - 1)}
            disabled={!canPrev}
            className="h-9 w-9 rounded-full inline-flex items-center justify-center bg-white text-slate-700 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200"
            aria-label="Previous page"
            title="Previous"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>

          {start > 1 && (
            <button
              type="button"
              onClick={() => paginate(1)}
              className="px-3 h-9 rounded-full text-[11px] font-extrabold bg-white text-slate-700 hover:bg-slate-100 transition border border-slate-200"
            >
              1…
            </button>
          )}

          {pages.map((number) => {
            const active = currentPage === number;
            return (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={
                  active
                    ? "px-3.5 h-9 rounded-full text-[11px] font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-400"
                    : "px-3.5 h-9 rounded-full text-[11px] font-extrabold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }
                aria-label={`Page ${number}`}
              >
                {number}
              </button>
            );
          })}

          {end < totalPages && (
            <button
              type="button"
              onClick={() => paginate(totalPages)}
              className="px-3 h-9 rounded-full text-[11px] font-extrabold bg-white text-slate-700 hover:bg-slate-100 transition border border-slate-200"
            >
              …{totalPages}
            </button>
          )}

          <button
            type="button"
            onClick={() => canNext && paginate(currentPage + 1)}
            disabled={!canNext}
            className="h-9 w-9 rounded-full inline-flex items-center justify-center bg-white text-slate-700 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200"
            aria-label="Next page"
            title="Next"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </nav>
      </div>
    );
  },
);

export default WishlistPagination;
