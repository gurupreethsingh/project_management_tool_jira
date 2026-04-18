import React from "react";
import { motion } from "framer-motion";
import { FiHeart, FiTrash2, FiArrowUpRight } from "react-icons/fi";

const WishlistSaveForLater = ({
  items,
  backendRoute,
  onMoveToWishlist,
  onRemove,
  loading,
}) => {
  if (!items || items.length === 0) return null;

  const getImageUrl = (img) => {
    if (!img) return "";
    if (String(img).startsWith("http")) return img;
    return `${backendRoute}/${img}`;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
        <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_55%,#f8fafc_100%)] px-4 py-4 sm:px-5 lg:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-100 bg-white shadow-sm">
                <FiHeart className="text-[17px] text-orange-500" />
              </div>

              <div>
                <h2 className="text-[16px] font-extrabold tracking-tight text-slate-900 sm:text-[18px]">
                  Saved For Later
                </h2>
                <p className="mt-0.5 text-[11.5px] font-medium text-slate-500">
                  Items kept aside for later review and purchase.
                </p>
              </div>
            </div>

            <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-sm">
              {items.length} item{items.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 lg:p-5">
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="group overflow-hidden rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-sm transition duration-200 hover:-translate-y-[1px] hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)]"
              >
                <div className="flex h-full flex-col sm:flex-row items-center justify-center">
                  <div className="flex items-center justify-center min-w-[160px] h-[200px] p-3">
                    {item.product_image ? (
                      <img
                        src={getImageUrl(item.product_image)}
                        alt={item.product_name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[11px] font-bold text-slate-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex min-h-[190px] flex-1 flex-col p-4">
                    <div className="flex-1">
                      <p className="line-clamp-2 text-[14px] font-extrabold leading-snug text-slate-900">
                        {item.product_name}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {item.brand && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                            {item.brand}
                          </span>
                        )}

                        {item.category_name && (
                          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold text-orange-700">
                            {item.category_name}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-end gap-2">
                        <span className="text-[18px] font-extrabold text-slate-900">
                          ₹{item.selling_price}
                        </span>

                        {item.display_price &&
                          String(item.display_price) !==
                            String(item.selling_price) && (
                            <span className="text-[12px] font-semibold text-slate-400 line-through">
                              ₹{item.display_price}
                            </span>
                          )}
                      </div>

                      {item.description && (
                        <p className="mt-3 line-clamp-2 text-[11.5px] font-medium leading-relaxed text-slate-500">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onMoveToWishlist(item._id)}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-2 text-[11px] font-extrabold text-white transition hover:bg-slate-800 disabled:opacity-60"
                      >
                        <FiArrowUpRight className="text-[13px]" />
                        Move to wishlist
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemove(item._id)}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-2 text-[11px] font-extrabold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                      >
                        <FiTrash2 className="text-[13px]" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default WishlistSaveForLater;
