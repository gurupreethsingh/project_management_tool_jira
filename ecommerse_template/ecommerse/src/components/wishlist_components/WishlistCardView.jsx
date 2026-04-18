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

function safeUpper(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim().toUpperCase();
}

const WishlistCardView = React.memo(
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
        ? "gap-5"
        : density === "tight"
          ? "gap-3"
          : "gap-4";

    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ${gapClass}`}
      >
        {items.map((item) => {
          const selling = money(item?.selling_price);
          const mrp = money(item?.display_price);
          const stock = item?.availability_status !== false;
          const rating = Number(item?.avg_rating ?? item?.rating ?? 4.4);
          const ratingText = Number.isFinite(rating)
            ? rating.toFixed(1)
            : "4.4";
          const checked = selectedSet.has(String(item._id));

          return (
            <article
              key={item._id}
              className="relative group rounded-2xl bg-white overflow-hidden border border-slate-100 content-visibility-auto"
              style={{ containIntrinsicSize: "320px 440px" }}
            >
              <div className="absolute left-2.5 top-2.5 z-10">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleSelect(item._id)}
                  className="h-4 w-4 accent-orange-500"
                  aria-label={`Select ${item?.product_name || "wishlist item"}`}
                />
              </div>

              <div
                className="w-full h-40 sm:h-44 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={() => onOpen(item._id)}
                title="Open product"
              >
                <img
                  src={resolveImage(item, backendRoute)}
                  alt={item?.product_name || "Wishlist item"}
                  loading="lazy"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/600x600";
                  }}
                />
              </div>

              <div className="p-3 space-y-1.5">
                <div
                  onClick={() => onOpen(item._id)}
                  className="cursor-pointer"
                >
                  <h3 className="text-[13px] sm:text-[14px] font-extrabold text-slate-900 line-clamp-2">
                    {item?.product_name || "Unnamed product"}
                  </h3>

                  <p className="text-[10.5px] text-slate-500 font-semibold truncate">
                    {safeUpper(item?.brand) ||
                      safeUpper(item?.category_name) ||
                      "POPULAR"}{" "}
                    • FAST DELIVERY
                  </p>

                  <div className="flex items-center justify-between pt-0.5 gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[13px] font-black text-slate-900 inline-flex items-center gap-0.5">
                        <FaRupeeSign className="text-[11px]" />{" "}
                        {selling ?? "--"}
                      </span>
                      {mrp && mrp !== selling && (
                        <span className="text-[10.5px] font-extrabold text-rose-500 line-through inline-flex items-center gap-0.5">
                          <FaRupeeSign className="text-[10px]" /> {mrp}
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10.5px] font-extrabold text-slate-600 shrink-0">
                      <FaStar className="text-orange-500/90 text-[10px]" />
                      {ratingText}
                    </span>
                  </div>

                  {item?.savedForLater && (
                    <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold text-amber-700">
                      <FaBookmark className="text-amber-600 text-[10px]" />
                      Saved
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-1.5 pt-1">
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
                    Move to Cart
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

export default WishlistCardView;
