import React from "react";
import { FaBookmark, FaCartPlus, FaCheck, FaTrash } from "react-icons/fa";

const WishlistBulkActions = React.memo(
  ({ selectedCount, loading, onMoveToCart, onCheckout, onSave, onRemove }) => {
    if (!selectedCount) return null;

    return (
      <>
        <div className="hidden md:block mt-3 rounded-2xl border border-orange-200 bg-orange-50/70 p-2.5 sm:p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[11.5px] font-extrabold text-slate-800">
              {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onMoveToCart}
                disabled={loading}
                className="rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-2.5 text-[11px] font-extrabold text-white inline-flex items-center gap-1.5 disabled:opacity-60"
              >
                <FaCartPlus />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={onCheckout}
                disabled={loading}
                className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-extrabold text-slate-700 inline-flex items-center gap-1.5 disabled:opacity-60"
              >
                <FaCheck />
                Checkout
              </button>

              <button
                type="button"
                onClick={onSave}
                disabled={loading}
                className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-extrabold text-slate-700 inline-flex items-center gap-1.5 disabled:opacity-60"
              >
                <FaBookmark />
                Save
              </button>

              <button
                type="button"
                onClick={onRemove}
                disabled={loading}
                className="rounded-full bg-rose-50 px-4 py-2.5 text-[11px] font-extrabold text-rose-700 inline-flex items-center gap-1.5 disabled:opacity-60"
              >
                <FaTrash />
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden fixed bottom-3 left-2.5 right-2.5 z-40 rounded-2xl border border-orange-200 bg-white/95 backdrop-blur-sm shadow-lg p-2.5">
          <div className="text-[11px] font-extrabold text-slate-800 mb-2">
            {selectedCount} selected
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onMoveToCart}
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-3 py-2.5 text-[11px] font-extrabold text-white inline-flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <FaCartPlus />
              Cart
            </button>

            <button
              type="button"
              onClick={onCheckout}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[11px] font-extrabold text-slate-700 inline-flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <FaCheck />
              Checkout
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[11px] font-extrabold text-slate-700 inline-flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <FaBookmark />
              Save
            </button>

            <button
              type="button"
              onClick={onRemove}
              disabled={loading}
              className="rounded-xl bg-rose-50 px-3 py-2.5 text-[11px] font-extrabold text-rose-700 inline-flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <FaTrash />
              Remove
            </button>
          </div>
        </div>
      </>
    );
  },
);

export default WishlistBulkActions;
