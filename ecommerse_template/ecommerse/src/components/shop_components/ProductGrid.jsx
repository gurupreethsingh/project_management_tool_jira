import React, { memo } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { RiShoppingCart2Line } from "react-icons/ri";
import { FiTruck, FiRefreshCw } from "react-icons/fi";
import globalBackendRoute from "../../config/Config";

function resolveImage(item) {
  if (!item?.product_image) return "https://via.placeholder.com/600x600";
  const file = String(item.product_image).replace(/\\/g, "/").split("/").pop();
  return `${globalBackendRoute}/uploads/products/${file}`;
}
function money(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString("en-IN");
}
function safeTrim(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v).trim();
  if (typeof v === "object") {
    if (typeof v.name === "string") return v.name.trim();
    if (typeof v.title === "string") return v.title.trim();
    return "";
  }
  return "";
}

const ProductGrid = memo(function ProductGrid({
  products,
  handleAddToCart,
  handleToggleWishlist,
  wishlist,
}) {
  return (
    <div
      className="
        grid
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        xl:grid-cols-6
        gap-6
      "
    >
      {products.map((p, idx) => {
        const id = p?._id ?? `${idx}`;
        const wishIds = Array.isArray(wishlist) ? wishlist : [];
        const inWish = wishIds.includes(p?._id);

        const selling = money(p?.selling_price ?? p?.price ?? p?.final_price);
        const mrp = money(p?.actual_price ?? p?.display_price ?? p?.mrp_price);

        const brand = safeTrim(p?.brand);
        const cat = safeTrim(p?.category_name ?? p?.category);
        const stock = !!p?.availability_status;

        return (
          <div
            key={id}
            className="group relative rounded-2xl bg-white transition-transform duration-200 hover:-translate-y-1"
            style={{ boxShadow: "none", border: "none" }}
          >
            {/* image */}
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={resolveImage(p)}
                alt={p?.product_name || "Product"}
                loading="lazy"
                className="w-full aspect-square object-cover"
              />

              {/* soft hover overlay */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/10 to-transparent" />

              {/* wishlist */}
              <button
                type="button"
                onClick={() => handleToggleWishlist(p)}
                className="absolute top-2 right-2 h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition hover:bg-white"
                aria-label="Toggle wishlist"
                title="Wishlist"
              >
                {inWish ? (
                  <FaHeart className="text-orange-700/75" />
                ) : (
                  <FaRegHeart className="text-slate-600" />
                )}
              </button>
            </div>

            {/* content */}
            <div className="mt-2 px-0.5">
              <p
                className="text-[12px] sm:text-[13px] font-extrabold text-slate-900 leading-snug truncate"
                title={p?.product_name}
              >
                {p?.product_name || "Unnamed product"}
              </p>

              {/* extra text */}
              <p className="mt-1 text-[11px] font-semibold text-slate-500 truncate">
                {brand || cat || "Popular pick"} •{" "}
                {stock ? "Fast delivery" : "Restocking soon"}
              </p>

              {/* prices (best + actual subtle) */}
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-[13px] sm:text-[14px] font-extrabold text-slate-900">
                  ₹{selling ?? "--"}
                </span>
                {mrp && mrp !== selling && (
                  <span className="text-[11px] font-semibold text-slate-400 line-through">
                    ₹{mrp}
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <span className="inline-flex items-center gap-1">
                  <FiTruck className="text-slate-500" />
                  Delivery
                </span>
                <span className="inline-flex items-center gap-1">
                  <FiRefreshCw className="text-slate-500" />
                  Easy return
                </span>
              </div>

              {/* ✅ Orange theme button but muted & modern (NOT bright) */}
              <button
                type="button"
                onClick={() => handleAddToCart(p)}
                className={[
                  "mt-3 w-full inline-flex items-center justify-center gap-2",
                  "rounded-xl px-3 py-2 text-[12px] font-extrabold",
                  "transition duration-200",
                  stock
                    ? "bg-orange-600/90 text-white hover:bg-orange-700"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed",
                ].join(" ")}
                style={
                  stock
                    ? {
                        boxShadow: "0 10px 25px -18px rgba(234, 88, 12, 0.65)",
                      }
                    : undefined
                }
              >
                <RiShoppingCart2Line className="text-[15px]" />
                Add to cart
              </button>

              {/* subtle orange underline */}
              <div className="mt-2 h-[2px] w-full rounded-full bg-orange-200/35" />
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default ProductGrid;
