// import React, { useEffect, useMemo, useRef, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaChevronLeft, FaChevronRight, FaHistory } from "react-icons/fa";
// import globalBackendRoute from "../../config/Config";

// const getStoredToken = () =>
//   localStorage.getItem("token") ||
//   localStorage.getItem("authToken") ||
//   localStorage.getItem("userToken") ||
//   "";

// const getAxiosAuthConfig = () => {
//   const token = getStoredToken();
//   return token
//     ? {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     : {};
// };

// const getSafeNumber = (value, fallback = 0) => {
//   const n = Number(value);
//   return Number.isFinite(n) ? n : fallback;
// };

// const formatCurrency = (value) => {
//   const amount = getSafeNumber(value, 0);
//   return `₹${amount.toLocaleString("en-IN")}`;
// };

// const resolveProductImage = (product) => {
//   if (!product?.product_image) return "https://via.placeholder.com/600x600";
//   const file = String(product.product_image)
//     .replace(/\\/g, "/")
//     .split("/")
//     .pop();
//   return `${globalBackendRoute}/uploads/products/${file}`;
// };

// const getMainPrice = (product) => {
//   const selling = getSafeNumber(product?.selling_price, 0);
//   const display = getSafeNumber(product?.display_price, 0);
//   return selling || display || 0;
// };

// const getDisplayPrice = (product) => {
//   const display = getSafeNumber(product?.display_price, 0);
//   const selling = getSafeNumber(product?.selling_price, 0);
//   return display > selling ? display : 0;
// };

// const UserHistory = ({
//   title = "Recently Viewed",
//   limit = 20,
//   className = "",
//   cardWidth = 220,
// }) => {
//   const navigate = useNavigate();
//   const sliderRef = useRef(null);

//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const token = getStoredToken();

//   useEffect(() => {
//     const fetchHistory = async () => {
//       if (!token) {
//         setItems([]);
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);

//         const response = await axios.get(
//           `${globalBackendRoute}/api/user-history/my-history?limit=${limit}`,
//           getAxiosAuthConfig(),
//         );

//         const history = Array.isArray(response?.data?.history)
//           ? response.data.history
//           : [];

//         setItems(history);
//       } catch (error) {
//         console.error("UserHistory fetch error:", error);
//         setItems([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, [token, limit]);

//   const visibleItems = useMemo(() => {
//     return items.filter((item) => item?.product?._id);
//   }, [items]);

//   const handleScroll = (direction) => {
//     const el = sliderRef.current;
//     if (!el) return;

//     const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
//     el.scrollBy({
//       left: scrollAmount,
//       behavior: "smooth",
//     });
//   };

//   if (!token) return null;
//   if (!loading && visibleItems.length === 0) return null;

//   return (
//     <section className={`w-full ${className}`}>
//       <div className="rounded-3xl border border-orange-100 bg-white shadow-sm overflow-hidden">
//         <div className="px-4 sm:px-5 lg:px-6 py-4 border-b border-orange-100 bg-gradient-to-r from-orange-50/70 to-white">
//           <div className="flex items-center justify-between gap-3">
//             <div className="min-w-0">
//               <div className="flex items-center gap-2">
//                 <div className="h-9 w-9 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
//                   <FaHistory className="h-4 w-4" />
//                 </div>
//                 <div>
//                   <h3 className="text-[16px] sm:text-[18px] font-extrabold text-gray-900">
//                     {title}
//                   </h3>
//                   <p className="text-[11px] sm:text-[12px] text-gray-500">
//                     Your recently viewed products
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-2 shrink-0">
//               <button
//                 type="button"
//                 onClick={() => handleScroll("left")}
//                 className="h-10 w-10 rounded-full border border-orange-200 bg-white text-orange-600 hover:bg-orange-50 transition flex items-center justify-center"
//                 aria-label="Scroll left"
//               >
//                 <FaChevronLeft className="h-3.5 w-3.5" />
//               </button>

//               <button
//                 type="button"
//                 onClick={() => handleScroll("right")}
//                 className="h-10 w-10 rounded-full border border-orange-200 bg-white text-orange-600 hover:bg-orange-50 transition flex items-center justify-center"
//                 aria-label="Scroll right"
//               >
//                 <FaChevronRight className="h-3.5 w-3.5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="p-4 sm:p-5 lg:p-6">
//           {loading ? (
//             <div className="flex gap-4 overflow-hidden">
//               {Array.from({ length: 5 }).map((_, index) => (
//                 <div
//                   key={index}
//                   className="shrink-0 rounded-2xl border border-orange-100 bg-white overflow-hidden animate-pulse"
//                   style={{ width: `${cardWidth}px` }}
//                 >
//                   <div className="aspect-square bg-orange-50" />
//                   <div className="p-3">
//                     <div className="h-4 bg-orange-50 rounded mb-2" />
//                     <div className="h-3 bg-orange-50 rounded w-2/3 mb-2" />
//                     <div className="h-3 bg-orange-50 rounded w-1/2" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div
//               ref={sliderRef}
//               className="flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar"
//             >
//               {visibleItems.map((item) => {
//                 const product = item.product;
//                 const productId = product?._id;

//                 return (
//                   <div
//                     key={`${item._id}-${productId}`}
//                     className="shrink-0 rounded-2xl border border-orange-100 bg-white shadow-sm hover:shadow-md transition-transform duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
//                     style={{ width: `${cardWidth}px` }}
//                     onClick={() => navigate(`/single-product/${productId}`)}
//                     title={product?.product_name}
//                   >
//                     <div className="relative">
//                       <img
//                         src={resolveProductImage(product)}
//                         alt={product?.product_name}
//                         className="w-full aspect-square object-cover"
//                         loading="lazy"
//                       />
//                     </div>

//                     <div className="p-3">
//                       <h4 className="text-[12px] sm:text-[13px] font-extrabold text-gray-900 truncate">
//                         {product?.product_name}
//                       </h4>

//                       <div className="mt-1 text-[10.5px] text-gray-500 truncate">
//                         {String(product?.brand || "No Brand").toUpperCase()}
//                       </div>

//                       <div className="mt-2 flex items-center justify-between gap-2">
//                         <p className="text-orange-600 font-black text-[13px] sm:text-[14px] truncate">
//                           {formatCurrency(getMainPrice(product))}
//                         </p>

//                         {getDisplayPrice(product) > 0 && (
//                           <p className="text-gray-400 line-through text-[11px] sm:text-[12px] truncate">
//                             {formatCurrency(getDisplayPrice(product))}
//                           </p>
//                         )}
//                       </div>

//                       <div className="mt-2 text-[10px] sm:text-[11px] text-gray-400">
//                         Viewed: {new Date(item.viewedAt).toLocaleDateString()}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       <style>{`
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//         .hide-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default UserHistory;

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaHistory } from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const getStoredToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("userToken") ||
  "";

const getAxiosAuthConfig = () => {
  const token = getStoredToken();
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

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

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = getStoredToken();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await axios.get(
          `${globalBackendRoute}/api/user-history/my-history?limit=${limit}`,
          getAxiosAuthConfig(),
        );

        const history = Array.isArray(response?.data?.history)
          ? response.data.history
          : [];

        setItems(history);
      } catch (error) {
        console.error("UserHistory fetch error:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token, limit]);

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

  if (!token) return null;
  if (!loading && visibleItems.length === 0) return null;

  return (
    <section className={`w-full px-4 ${className}`}>
      <div className="rounded-2xl  bg-white overflow-hidden">
        <div className="px-3 sm:px-4 py-3 border-b border-orange-100 bg-gradient-to-r from-orange-50/70 to-white">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <FaHistory className="h-3.5 w-3.5" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-[14px] sm:text-[15px] font-extrabold text-gray-900 truncate">
                    {title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-500">
                    Your recently viewed products
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                className="h-8 w-8 rounded-full border border-orange-200 bg-white text-orange-600 hover:bg-orange-50 transition flex items-center justify-center"
                aria-label="Scroll left"
              >
                <FaChevronLeft className="h-3 w-3" />
              </button>

              <button
                type="button"
                onClick={() => handleScroll("right")}
                className="h-8 w-8 rounded-full border border-orange-200 bg-white text-orange-600 hover:bg-orange-50 transition flex items-center justify-center"
                aria-label="Scroll right"
              >
                <FaChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          {loading ? (
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="shrink-0 rounded-xl border border-orange-100 bg-white overflow-hidden animate-pulse"
                  style={{ width: `${cardWidth}px` }}
                >
                  <div className="aspect-square bg-orange-50" />
                  <div className="p-2.5">
                    <div className="h-3.5 bg-orange-50 rounded mb-2" />
                    <div className="h-3 bg-orange-50 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-orange-50 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              ref={sliderRef}
              className="flex gap-3 overflow-x-auto scroll-smooth hide-scrollbar"
            >
              {visibleItems.map((item) => {
                const product = item.product;
                const productId = product?._id;

                return (
                  <div
                    key={`${item._id}-${productId}`}
                    className="shrink-0 rounded-xl border border-orange-100 bg-white shadow-sm hover:shadow-md transition-transform duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
                    style={{ width: `${cardWidth}px` }}
                    onClick={() => navigate(`/single-product/${productId}`)}
                    title={product?.product_name}
                  >
                    <div className="relative">
                      <img
                        src={resolveProductImage(product)}
                        alt={product?.product_name}
                        className="w-full aspect-square object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-2.5">
                      <h4 className="text-[11px] sm:text-[12px] font-extrabold text-gray-900 truncate">
                        {product?.product_name}
                      </h4>

                      <div className="mt-1 text-[9.5px] sm:text-[10px] text-gray-500 truncate">
                        {String(product?.brand || "No Brand").toUpperCase()}
                      </div>

                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <p className="text-orange-600 font-black text-[12px] sm:text-[13px] truncate">
                          {formatCurrency(getMainPrice(product))}
                        </p>

                        {getDisplayPrice(product) > 0 && (
                          <p className="text-gray-400 line-through text-[10px] sm:text-[11px] truncate">
                            {formatCurrency(getDisplayPrice(product))}
                          </p>
                        )}
                      </div>

                      <div className="mt-1.5 text-[9px] sm:text-[10px] text-gray-400 truncate">
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
