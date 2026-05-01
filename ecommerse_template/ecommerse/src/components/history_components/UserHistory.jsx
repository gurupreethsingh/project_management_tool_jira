import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

const toDataValue = (value) => {
  if (value === null || value === undefined) return "";

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (item === null || item === undefined) return "";
        if (typeof item === "object") {
          return item._id || item.name || item.title || JSON.stringify(item);
        }
        return String(item);
      })
      .filter(Boolean)
      .join("|");
  }

  if (typeof value === "object") {
    if (value.$oid) return String(value.$oid);
    if (value._id) return String(value._id);
    if (value.name) return String(value.name);
    if (value.title) return String(value.title);
    if (value.product_name) return String(value.product_name);
    return JSON.stringify(value);
  }

  return String(value);
};

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (typeof value === "object") {
    if (value._id) return String(value._id);
    if (value.$oid) return String(value.$oid);

    try {
      return String(value);
    } catch {
      return "";
    }
  }

  return String(value);
};

const getCategoryName = (product) =>
  product?.category?.category_name ||
  product?.category?.name ||
  product?.category_name ||
  "";

const getSubcategoryName = (product) =>
  product?.subcategory?.subcategory_name ||
  product?.subcategory?.name ||
  product?.subcategory_name ||
  "";

const getProductAutomationAttrs = (
  product,
  viewModeName = "user-history",
  index = 0,
) => {
  const sellingPrice =
    product?.selling_price ?? product?.price ?? product?.final_price ?? "";

  const displayPrice =
    product?.display_price ?? product?.actual_price ?? product?.mrp_price ?? "";

  return {
    "data-testid": "history-product-card",
    "data-product-view": viewModeName,
    "data-product-index": toDataValue(index),

    "data-product-id": toDataValue(getId(product?._id)),
    "data-product-name": toDataValue(product?.product_name),
    "data-product-slug": toDataValue(product?.slug),
    "data-product-sku": toDataValue(product?.sku),
    "data-product-image": toDataValue(product?.product_image),
    "data-product-all-images": toDataValue(product?.all_product_images),
    "data-product-description": toDataValue(product?.description),

    "data-product-category-id": toDataValue(getId(product?.category)),
    "data-product-category-name": toDataValue(getCategoryName(product)),
    "data-product-subcategory-id": toDataValue(getId(product?.subcategory)),
    "data-product-subcategory-name": toDataValue(getSubcategoryName(product)),

    "data-product-brand": toDataValue(product?.brand),
    "data-product-barcode": toDataValue(product?.barcode),
    "data-product-stock": toDataValue(product?.stock),
    "data-product-warehouse-stock": toDataValue(product?.warehouse_stock),
    "data-product-total-sold": toDataValue(product?.total_products_sold),

    "data-product-outlet-id": toDataValue(getId(product?.outlet)),
    "data-product-vendor-id": toDataValue(getId(product?.vendor)),

    "data-product-length": toDataValue(product?.dimensions?.length),
    "data-product-width": toDataValue(product?.dimensions?.width),
    "data-product-height": toDataValue(product?.dimensions?.height),

    "data-product-color": toDataValue(product?.color),
    "data-product-material": toDataValue(product?.material),

    "data-product-ratings": toDataValue(product?.ratings ?? product?.rating),
    "data-product-avg-rating": toDataValue(product?.avg_rating),
    "data-product-total-reviews": toDataValue(product?.total_reviews),
    "data-product-reviews": toDataValue(product?.reviews),

    "data-product-tags": toDataValue(product?.tags),
    "data-product-section-to-appear": toDataValue(product?.section_to_appear),
    "data-product-featured": toDataValue(product?.featured),
    "data-product-new-arrival": toDataValue(product?.is_new_arrival),
    "data-product-trending": toDataValue(product?.is_trending),
    "data-product-availability-status": toDataValue(
      product?.availability_status,
    ),

    "data-product-discount": toDataValue(product?.discount),
    "data-product-min-purchase-qty": toDataValue(product?.min_purchase_qty),
    "data-product-max-purchase-qty": toDataValue(product?.max_purchase_qty),
    "data-product-delivery-time-estimate": toDataValue(
      product?.delivery_time_estimate,
    ),
    "data-product-replacement-policy": toDataValue(product?.replacement_policy),
    "data-product-origin-country": toDataValue(product?.origin_country),

    "data-product-pricing-rules": toDataValue(product?.pricing_rules),
    "data-product-campaign": toDataValue(product?.campaign),

    "data-product-orders": toDataValue(product?.orders),
    "data-product-purchases": toDataValue(product?.purchases),
    "data-product-returns": toDataValue(product?.returns),
    "data-product-wishlist-users": toDataValue(product?.wishlist_users),
    "data-product-questions": toDataValue(product?.questions),
    "data-product-related-products": toDataValue(product?.related_products),
    "data-product-bundles": toDataValue(product?.bundles),

    "data-product-vector-embedding": toDataValue(product?.vector_embedding),
    "data-product-popularity-score": toDataValue(
      product?.popularity_score ?? product?.views,
    ),

    "data-product-meta-title": toDataValue(product?.meta_title),
    "data-product-meta-description": toDataValue(product?.meta_description),

    "data-product-created-by": toDataValue(getId(product?.createdBy)),
    "data-product-updated-by": toDataValue(getId(product?.updatedBy)),
    "data-product-is-deleted": toDataValue(product?.isDeleted),
    "data-product-version": toDataValue(product?.version),
    "data-product-admin-notes": toDataValue(product?.admin_notes),

    "data-product-selling-price": toDataValue(sellingPrice),
    "data-product-display-price": toDataValue(displayPrice),
    "data-product-created-at": toDataValue(product?.createdAt),
    "data-product-updated-at": toDataValue(product?.updatedAt),
  };
};

const useResponsiveCardWidth = (defaultWidth) => {
  const [cardWidth, setCardWidth] = useState(defaultWidth);

  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth;

      if (width < 380) {
        setCardWidth(132);
      } else if (width < 480) {
        setCardWidth(145);
      } else if (width < 640) {
        setCardWidth(155);
      } else if (width < 768) {
        setCardWidth(165);
      } else {
        setCardWidth(defaultWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [defaultWidth]);

  return cardWidth;
};

const HistoryProductCard = memo(({ item, index, cardWidth, onOpenProduct }) => {
  const product = item?.product;
  const productId = product?._id;

  const mainPrice = useMemo(() => getMainPrice(product), [product]);
  const displayPrice = useMemo(() => getDisplayPrice(product), [product]);

  return (
    <div
      {...getProductAutomationAttrs(product, "user-history", index)}
      className="shrink-0 overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer"
      style={{ width: `${cardWidth}px` }}
      onClick={() => onOpenProduct(productId)}
      title={product?.product_name}
    >
      <div
        className="hidden"
        aria-hidden="true"
        data-testid="history-product-hidden-details"
        data-history-id={toDataValue(item?._id)}
        data-history-viewed-at={toDataValue(item?.viewedAt)}
        {...getProductAutomationAttrs(product, "user-history-hidden", index)}
      />

      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-white p-2.5 sm:p-4">
        <img
          src={resolveProductImage(product)}
          alt={product?.product_name || "Product"}
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </div>

      <div className="p-2 sm:p-2.5">
        <h4 className="truncate text-[10.5px] font-extrabold text-gray-900 sm:text-[12px]">
          {product?.product_name || "Unnamed Product"}
        </h4>

        <div className="mt-1 truncate text-[9px] text-gray-500 sm:text-[10px]">
          {String(product?.brand || "No Brand").toUpperCase()}
        </div>

        <div className="mt-1.5 flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <p className="truncate text-[11.5px] font-black text-orange-600 sm:text-[13px]">
            {formatCurrency(mainPrice)}
          </p>

          {displayPrice > 0 && (
            <p className="truncate text-[9.5px] text-gray-400 line-through sm:text-[11px]">
              {formatCurrency(displayPrice)}
            </p>
          )}
        </div>

        <div className="mt-1.5 truncate text-[8.5px] text-gray-400 sm:text-[10px]">
          Viewed:{" "}
          {item?.viewedAt
            ? new Date(item.viewedAt).toLocaleDateString()
            : "Recently"}
        </div>
      </div>
    </div>
  );
});

HistoryProductCard.displayName = "HistoryProductCard";

const UserHistory = memo(
  ({
    title = "Recently Viewed",
    limit = 20,
    className = "",
    cardWidth = 180,
  }) => {
    const navigate = useNavigate();
    const sliderRef = useRef(null);

    const responsiveCardWidth = useResponsiveCardWidth(cardWidth);

    const { isLoggedIn, loading } = useContext(AuthContext);

    const [items, setItems] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    useEffect(() => {
      let isMounted = true;
      const controller = new AbortController();

      const fetchHistory = async () => {
        if (loading) return;

        const token = getStoredToken();

        if (!isLoggedIn || !token) {
          if (isMounted) {
            setItems([]);
            setHistoryLoading(false);
          }
          return;
        }

        try {
          if (isMounted) setHistoryLoading(true);

          const response = await axios.get(
            `${globalBackendRoute}/api/user-history/my-history?limit=${limit}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: controller.signal,
            },
          );

          const history = Array.isArray(response?.data?.history)
            ? response.data.history
            : [];

          if (isMounted) {
            setItems(history);
          }
        } catch (error) {
          if (
            error?.name !== "CanceledError" &&
            error?.code !== "ERR_CANCELED"
          ) {
            console.error("UserHistory fetch error:", error);
          }

          if (isMounted) {
            setItems([]);
          }
        } finally {
          if (isMounted) {
            setHistoryLoading(false);
          }
        }
      };

      fetchHistory();

      return () => {
        isMounted = false;
        controller.abort();
      };
    }, [isLoggedIn, loading, limit]);

    const visibleItems = useMemo(() => {
      return items.filter((item) => item?.product?._id);
    }, [items]);

    const handleOpenProduct = useCallback(
      (productId) => {
        if (!productId) return;
        navigate(`/single-product/${productId}`);
      },
      [navigate],
    );

    const handleScroll = useCallback(
      (direction) => {
        const el = sliderRef.current;
        if (!el) return;

        const scrollAmount =
          direction === "left"
            ? -responsiveCardWidth * 3
            : responsiveCardWidth * 3;

        el.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      },
      [responsiveCardWidth],
    );

    if (loading) return null;
    if (!isLoggedIn) return null;
    if (!historyLoading && visibleItems.length === 0) return null;

    return (
      <section className={`w-full px-2 sm:px-4 ${className}`}>
        <div className="overflow-hidden rounded-2xl bg-white border border-orange-100">
          <div className="border-b border-orange-100 bg-gradient-to-r from-orange-50/70 to-white px-3 py-3 sm:px-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <FaHistory className="h-3.5 w-3.5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-[13px] font-extrabold text-gray-900 sm:text-[15px]">
                      {title}
                    </h3>
                    <p className="text-[10px] text-gray-500 sm:text-[11px]">
                      Your recently viewed products
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
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

          <div className="p-2.5 sm:p-4">
            {historyLoading ? (
              <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="shrink-0 overflow-hidden rounded-xl border border-orange-100 bg-white animate-pulse"
                    style={{ width: `${responsiveCardWidth}px` }}
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
                className="history-scrollbar flex gap-2.5 overflow-x-auto scroll-smooth overscroll-x-contain pb-1 sm:gap-3"
              >
                {visibleItems.map((item, index) => (
                  <HistoryProductCard
                    key={`${item?._id || index}-${item?.product?._id}`}
                    item={item}
                    index={index}
                    cardWidth={responsiveCardWidth}
                    onOpenProduct={handleOpenProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <style>{`
          .history-scrollbar {
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }

          .history-scrollbar::-webkit-scrollbar {
            display: none;
          }

          @media (max-width: 480px) {
            .history-scrollbar {
              scroll-snap-type: x proximity;
            }

            .history-scrollbar > div {
              scroll-snap-align: start;
            }
          }
        `}</style>
      </section>
    );
  },
);

UserHistory.displayName = "UserHistory";

export default UserHistory;
