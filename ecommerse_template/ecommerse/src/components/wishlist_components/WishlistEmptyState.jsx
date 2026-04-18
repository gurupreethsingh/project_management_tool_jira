import React from "react";

const WishlistEmptyState = ({
  isFiltered = false,
  onBrowse,
  onClearFilters,
}) => {
  return (
    <div className="text-center text-slate-500 mt-10 sm:mt-12">
      <div className="inline-flex items-center gap-2 text-[11px] font-semibold">
        <span className="h-2 w-2 rounded-full bg-orange-500" />
        {isFiltered
          ? "No items match your current search or filter."
          : "Your wishlist is empty."}
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
        {isFiltered && (
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-extrabold text-slate-700 hover:bg-slate-100"
            onClick={onClearFilters}
          >
            Clear filters
          </button>
        )}

        <button
          type="button"
          className="rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-2.5 text-[11px] font-extrabold text-white"
          onClick={onBrowse}
        >
          Browse products
        </button>
      </div>
    </div>
  );
};

export default WishlistEmptyState;
