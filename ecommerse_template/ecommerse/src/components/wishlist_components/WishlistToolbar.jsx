import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const densityOptions = [
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
  { value: "tight", label: "Tight" },
];

const WishlistToolbar = React.memo(
  ({
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    density,
    setDensity,
    bulkLoading,
    hasItems,
    onSaveAll,
    onClearAll,
    onSelectPage,
    onDeselectPage,
    onSelectFiltered,
    onClearSelection,
    showSelectionTools,
  }) => {
    return (
      <div className="mt-4 rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-4">
        <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4 2xl:flex 2xl:flex-1 2xl:items-center 2xl:gap-2.5">
            <div className="sm:col-span-2 xl:col-span-1 2xl:min-w-[320px] 2xl:flex-[1.35]">
              <div className="relative">
                <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-slate-400" />
                <input
                  type="text"
                  placeholder="Search wishlist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-9 pr-10 text-[12px] font-semibold text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white"
                  aria-label="Search wishlist"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900"
                    aria-label="Clear search"
                  >
                    <FaTimes className="text-[10px]" />
                  </button>
                )}
              </div>
            </div>

            <div className="2xl:min-w-[170px] 2xl:flex-[0.6]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-[12px] font-semibold text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white"
                aria-label="Sort wishlist"
              >
                <option value="latest">Latest</option>
                <option value="name_asc">Name A-Z</option>
                <option value="name_desc">Name Z-A</option>
                <option value="price_low_high">Price Low-High</option>
                <option value="price_high_low">Price High-Low</option>
                <option value="saved_first">Saved First</option>
              </select>
            </div>

            <div className="2xl:min-w-[165px] 2xl:flex-[0.58]">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-[12px] font-semibold text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white"
                aria-label="Filter wishlist"
              >
                <option value="all">All Items</option>
                <option value="active">Active Only</option>
                <option value="saved">Saved for Later</option>
                <option value="instock">In Stock</option>
                <option value="outofstock">Out of Stock</option>
              </select>
            </div>

            <div className="2xl:min-w-[145px] 2xl:flex-[0.48]">
              <select
                value={density}
                onChange={(e) => setDensity(e.target.value)}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-[12px] font-semibold text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white"
                aria-label="Density mode"
              >
                {densityOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 2xl:flex 2xl:items-center 2xl:gap-2.5">
            <button
              type="button"
              onClick={onSaveAll}
              disabled={bulkLoading || !hasItems}
              className="h-11 rounded-2xl border border-amber-100 bg-amber-50 px-3 text-[11px] font-extrabold text-amber-700 transition hover:bg-amber-100 disabled:opacity-60 2xl:min-w-[104px]"
            >
              Save All
            </button>

            <button
              type="button"
              onClick={onClearAll}
              disabled={bulkLoading || !hasItems}
              className="h-11 rounded-2xl border border-rose-100 bg-rose-50 px-3 text-[11px] font-extrabold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60 2xl:min-w-[104px]"
            >
              Clear All
            </button>

            <button
              type="button"
              onClick={onSelectPage}
              disabled={!hasItems}
              className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-[11px] font-extrabold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 2xl:min-w-[112px]"
            >
              Select Page
            </button>

            <button
              type="button"
              onClick={onSelectFiltered}
              disabled={!hasItems}
              className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-[11px] font-extrabold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 2xl:min-w-[122px]"
            >
              Select Filtered
            </button>
          </div>
        </div>

        {showSelectionTools && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onDeselectPage}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-extrabold text-slate-700 transition hover:bg-slate-50"
            >
              Deselect Page
            </button>

            <button
              type="button"
              onClick={onClearSelection}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-extrabold text-slate-700 transition hover:bg-slate-50"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>
    );
  },
);

export default WishlistToolbar;
