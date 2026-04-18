import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaHistory } from "react-icons/fa";
import globalBackendRoute from "../../config/Config";
import { AuthContext } from "../auth_components/AuthManager";

const getStoredToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("userToken") ||
  "";

const getSafeNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const formatCurrency = (value) => {
  const amount = getSafeNumber(value, 0);
  return `₹${amount.toLocaleString("en-IN")}`;
};

const resolveProductImage = (product) => {
  if (!product?.product_image) return "https://via.placeholder.com/600x600";
  const file = String(product.product_image)
    .replace(/\\/g, "/")
    .split("/")
    .pop();
  return `${globalBackendRoute}/uploads/products/${file}`;
};

const getMainPrice = (product) => {
  const selling = getSafeNumber(product?.selling_price, 0);
  const display = getSafeNumber(product?.display_price, 0);
  return selling || display || 0;
};

const getDisplayPrice = (product) => {
  const display = getSafeNumber(product?.display_price, 0);
  const selling = getSafeNumber(product?.selling_price, 0);
  return display > selling ? display : 0;
};

const UserHistory = ({
  title = "Recently Viewed",
  limit = 20,
  className = "",
  cardWidth = 180,
}) => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const { isLoggedIn, loading } = useContext(AuthContext);

  const [items, setItems] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (loading) {
        return;
      }

      const token = getStoredToken();

      if (!isLoggedIn || !token) {
        setItems([]);
        setHistoryLoading(false);
        return;
      }

      try {
        setHistoryLoading(true);

        const response = await axios.get(
          `${globalBackendRoute}/api/user-history/my-history?limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const history = Array.isArray(response?.data?.history)
          ? response.data.history
          : [];

        setItems(history);
      } catch (error) {
        console.error("UserHistory fetch error:", error);
        setItems([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [isLoggedIn, loading, limit]);

  const visibleItems = useMemo(() => {
    return items.filter((item) => item?.product?._id);
  }, [items]);

  const handleScroll = (direction) => {
    const el = sliderRef.current;
    if (!el) return;

    const scrollAmount = direction === "left" ? -cardWidth * 3 : cardWidth * 3;
    el.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) return null;
  if (!isLoggedIn) return null;
  if (!historyLoading && visibleItems.length === 0) return null;

  return (
    <section className={`w-full px-4 ${className}`}>
      <div className="overflow-hidden rounded-2xl bg-white">
        <div className="border-b border-orange-100 bg-gradient-to-r from-orange-50/70 to-white px-3 py-3 sm:px-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <FaHistory className="h-3.5 w-3.5" />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-[14px] font-extrabold text-gray-900 sm:text-[15px]">
                    {title}
                  </h3>
                  <p className="text-[10px] text-gray-500 sm:text-[11px]">
                    Your recently viewed products
                  </p>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-600 transition hover:bg-orange-50"
                aria-label="Scroll left"
              >
                <FaChevronLeft className="h-3 w-3" />
              </button>

              <button
                type="button"
                onClick={() => handleScroll("right")}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-600 transition hover:bg-orange-50"
                aria-label="Scroll right"
              >
                <FaChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          {historyLoading ? (
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-orange-100 bg-white animate-pulse shrink-0"
                  style={{ width: `${cardWidth}px` }}
                >
                  <div className="aspect-square bg-orange-50" />
                  <div className="p-2.5">
                    <div className="mb-2 h-3.5 rounded bg-orange-50" />
                    <div className="mb-2 h-3 w-2/3 rounded bg-orange-50" />
                    <div className="h-3 w-1/2 rounded bg-orange-50" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              ref={sliderRef}
              className="hide-scrollbar flex gap-3 overflow-x-auto scroll-smooth"
            >
              {visibleItems.map((item) => {
                const product = item.product;
                const productId = product?._id;

                return (
                  <div
                    key={`${item._id}-${productId}`}
                    className="shrink-0 overflow-hidden rounded-xl border  bg-white shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer"
                    style={{ width: `${cardWidth}px` }}
                    onClick={() => navigate(`/single-product/${productId}`)}
                    title={product?.product_name}
                  >
                    <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-white via-white to-amber-50 p-3 sm:p-4">
                      <img
                        src={resolveProductImage(product)}
                        alt={product?.product_name}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-2.5">
                      <h4 className="truncate text-[11px] font-extrabold text-gray-900 sm:text-[12px]">
                        {product?.product_name}
                      </h4>

                      <div className="mt-1 truncate text-[9.5px] text-gray-500 sm:text-[10px]">
                        {String(product?.brand || "No Brand").toUpperCase()}
                      </div>

                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <p className="truncate text-[12px] font-black text-orange-600 sm:text-[13px]">
                          {formatCurrency(getMainPrice(product))}
                        </p>

                        {getDisplayPrice(product) > 0 && (
                          <p className="truncate text-[10px] text-gray-400 line-through sm:text-[11px]">
                            {formatCurrency(getDisplayPrice(product))}
                          </p>
                        )}
                      </div>

                      <div className="mt-1.5 truncate text-[9px] text-gray-400 sm:text-[10px]">
                        Viewed: {new Date(item.viewedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default UserHistory;
