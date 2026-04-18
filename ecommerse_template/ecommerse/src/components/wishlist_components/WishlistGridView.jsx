import React from "react";
import {
  FaBookmark,
  FaCartPlus,
  FaCheck,
  FaRupeeSign,
  FaStar,
  FaTrash,
} from "react-icons/fa";

function resolveImage(item, backendRoute) {
  if (!item?.product_image) return "https://via.placeholder.com/600x600";
  const file = String(item.product_image).replace(/\\/g, "/").split("/").pop();
  return `${backendRoute}/uploads/products/${file}`;
}

function money(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString("en-IN");
}

const WishlistGridView = React.memo(
  ({
    items,
    selectedSet,
    density,
    backendRoute,
    onToggleSelect,
    onOpen,
    onMoveToCart,
    onBuyNow,
    onToggleSaveForLater,
    onRemove,
  }) => {
    const gapClass =
      density === "comfortable"
        ? "gap-4 sm:gap-5"
        : density === "tight"
          ? "gap-2.5 sm:gap-3"
          : "gap-3 sm:gap-4";

    return (
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 ${gapClass}`}
      >
        {items.map((item, idx) => {
          const id = item?._id ?? `${idx}`;
          const selling = money(item?.selling_price);
          const mrp = money(item?.display_price);
          const stock = item?.availability_status !== false;
          const rating = Number(item?.avg_rating ?? item?.rating ?? 4.3);
          const ratingText = Number.isFinite(rating)
            ? rating.toFixed(1)
            : "4.3";
          const checked = selectedSet.has(String(id));

          return (
            <article
              key={id}
              className="group relative rounded-2xl bg-white border border-slate-100 content-visibility-auto"
              style={{ containIntrinsicSize: "260px 420px" }}
            >
              <div className="absolute left-2.5 top-2.5 z-10">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleSelect(id)}
                  className="h-4 w-4 accent-orange-500"
                  aria-label={`Select ${item?.product_name || "wishlist item"}`}
                />
              </div>

              <div
                className="p-2.5 cursor-pointer"
                onClick={() => onOpen(item._id)}
                title="Open product"
              >
                <div className="rounded-xl overflow-hidden bg-slate-50">
                  <img
                    src={resolveImage(item, backendRoute)}
                    alt={item?.product_name || "Wishlist item"}
                    loading="lazy"
                    className="w-full aspect-square object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/600x600";
                    }}
                  />
                </div>

                <div className="mt-2.5 space-y-1">
                  <h2 className="text-[12px] sm:text-[12.5px] font-extrabold text-slate-900 line-clamp-2 min-h-[34px]">
                    {item?.product_name || "Unnamed product"}
                  </h2>

                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-[13px] font-black text-slate-900 inline-flex items-center gap-0.5">
                      <FaRupeeSign className="text-[11px]" /> {selling ?? "--"}
                    </span>
                    {mrp && mrp !== selling && (
                      <span className="text-[10.5px] font-extrabold text-rose-500 line-through inline-flex items-center gap-0.5">
                        <FaRupeeSign className="text-[10px]" /> {mrp}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                    <span className="inline-flex items-center gap-1">
                      <FaStar className="text-orange-500/90 text-[10px]" />
                      {ratingText}
                    </span>
                    <span
                      className={stock ? "text-emerald-600" : "text-rose-600"}
                    >
                      {stock ? "In Stock" : "Out"}
                    </span>
                  </div>

                  {item?.savedForLater && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold text-amber-700">
                      <FaBookmark className="text-amber-600 text-[10px]" />
                      Saved
                    </div>
                  )}
                </div>
              </div>

              <div className="px-2.5 pb-2.5">
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    onClick={() => onMoveToCart(item._id)}
                    className="rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-3 py-2.5 text-[11px] font-extrabold text-white inline-flex items-center justify-center gap-1.5"
                    type="button"
                    disabled={!stock}
                    style={
                      !stock
                        ? { opacity: 0.6, cursor: "not-allowed" }
                        : undefined
                    }
                  >
                    <FaCartPlus />
                    Cart
                  </button>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => onBuyNow(item)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] font-extrabold text-slate-700 inline-flex items-center justify-center gap-1.5"
                      type="button"
                    >
                      <FaCheck />
                      Buy
                    </button>

                    <button
                      onClick={() => onToggleSaveForLater(item._id)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] font-extrabold text-slate-700 inline-flex items-center justify-center gap-1.5"
                      type="button"
                    >
                      <FaBookmark />
                      {item?.savedForLater ? "Unsave" : "Save"}
                    </button>
                  </div>

                  <button
                    onClick={() => onRemove(item._id)}
                    className="rounded-full bg-rose-50 px-3 py-2.5 text-[11px] font-extrabold text-rose-700 inline-flex items-center justify-center gap-1.5"
                    type="button"
                  >
                    <FaTrash />
                    Remove
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  },
);

export default WishlistGridView;
