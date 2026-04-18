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

const WishlistListView = React.memo(
  ({
    items,
    backendRoute,
    selectedSet,
    onToggleSelect,
    onOpen,
    onMoveToCart,
    onBuyNow,
    onToggleSaveForLater,
    onRemove,
  }) => {
    return (
      <div className="space-y-3">
        {items.map((item) => {
          const selling = money(item?.selling_price);
          const mrp = money(item?.display_price);
          const stock = item?.availability_status !== false;
          const rating = Number(item?.avg_rating ?? item?.rating ?? 4.2);
          const ratingText = Number.isFinite(rating)
            ? rating.toFixed(1)
            : "4.2";
          const checked = selectedSet.has(String(item._id));

          return (
            <article
              key={item._id}
              className="flex flex-col lg:flex-row items-stretch lg:items-center bg-white rounded-2xl transition group relative border border-slate-100 content-visibility-auto"
              style={{ containIntrinsicSize: "260px 220px" }}
            >
              <div className="px-3 pt-3 lg:pt-0 lg:pl-3 flex items-start lg:items-center">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleSelect(item._id)}
                  className="h-4 w-4 accent-orange-500"
                  aria-label={`Select ${item?.product_name || "wishlist item"}`}
                />
              </div>

              <div className="flex flex-col sm:flex-row w-full">
                <div
                  onClick={() => onOpen(item._id)}
                  className="w-full sm:w-32 lg:w-36 h-32 sm:h-28 lg:h-28 bg-slate-50 rounded-xl overflow-hidden flex justify-center items-center cursor-pointer m-3 mb-2 sm:mb-3"
                  title="Open product"
                >
                  <img
                    src={resolveImage(item, backendRoute)}
                    alt={item?.product_name || "Wishlist item"}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/600x600";
                    }}
                  />
                </div>

                <div
                  onClick={() => onOpen(item._id)}
                  className="flex flex-col justify-center w-full cursor-pointer px-3 sm:px-0 pb-3 sm:py-3"
                  title="Open product"
                >
                  <h2 className="text-[14px] sm:text-[15px] font-extrabold text-slate-900 line-clamp-2">
                    {item?.product_name || "Unnamed product"}
                  </h2>

                  <p className="text-slate-500 text-[10.5px] mt-1 line-clamp-2">
                    {(item?.description || "").slice(0, 90)}
                    {(item?.description || "").length > 90 ? "..." : ""}
                  </p>

                  <p className="mt-1.5 text-[10.5px] font-semibold text-slate-500 line-clamp-1">
                    {safeUpper(item?.brand) ||
                      safeUpper(item?.category_name) ||
                      "BRANDED"}{" "}
                    • FAST DELIVERY • EASY RETURNS
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span className="text-[13px] font-black text-slate-900 inline-flex items-center gap-0.5">
                      <FaRupeeSign className="text-[11px]" /> {selling ?? "--"}
                    </span>

                    {mrp && mrp !== selling && (
                      <span className="text-[10.5px] font-extrabold text-rose-500 line-through inline-flex items-center gap-0.5">
                        <FaRupeeSign className="text-[10px]" /> {mrp}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 text-[10.5px] font-extrabold text-slate-600">
                      <FaStar className="text-orange-500/90 text-[10px]" />
                      {ratingText}
                    </span>

                    <span
                      className={`text-[10px] font-extrabold ${
                        stock ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {stock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  {item?.savedForLater && (
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold text-amber-700 w-fit">
                      <FaBookmark className="text-amber-600 text-[10px]" />
                      Saved for later
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 lg:w-[220px] px-3 pb-3 lg:pb-0 lg:pr-3">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
                  <button
                    onClick={() => onMoveToCart(item._id)}
                    disabled={!stock}
                    className="rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-3 py-2.5 text-[11px] font-extrabold text-white inline-flex items-center justify-center gap-1.5 disabled:opacity-60"
                    type="button"
                  >
                    <FaCartPlus />
                    Cart
                  </button>

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

export default WishlistListView;
