// // ✅ file: src/components/cart_components/MiniCart.jsx

// import React, { useState, useRef, useEffect, useContext } from "react";
// import { CartContext } from "../../components/cart_components/CartContext";
// import { AuthContext } from "../../components/auth_components/AuthManager";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FaShoppingCart,
//   FaRupeeSign,
//   FaTrash,
//   FaMinus,
//   FaPlus,
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
// import globalBackendRoute from "../../config/Config";

// const MiniCart = () => {
//   const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

//   const { isLoggedIn } = useContext(AuthContext);

//   const [open, setOpen] = useState(false);
//   const cartRef = useRef(null);
//   const navigate = useNavigate();

//   const formatMoney = (value) => Number(value || 0).toFixed(2);

//   const getProductId = (item) => {
//     return item?.product?._id || item?.productId || item?._id;
//   };

//   const getSafeQuantity = (item) => {
//     const quantity = Number(item?.quantity || 1);
//     return quantity < 1 ? 1 : quantity;
//   };

//   const getMaxQuantity = (item) => {
//     const stock = Number(item?.stock || item?.product?.stock || 100);
//     const maxPurchaseQty = Number(
//       item?.max_purchase_qty || item?.product?.max_purchase_qty || stock || 100,
//     );

//     return Math.max(1, Math.min(stock || 100, maxPurchaseQty || 100));
//   };

//   const calculateSubtotal = (price, quantity) => {
//     return Number((Number(price || 0) * Number(quantity || 0)).toFixed(2));
//   };

//   const cartCount = cartItems.reduce(
//     (total, item) => total + getSafeQuantity(item),
//     0,
//   );

//   const cartTotal = cartItems.reduce((total, item) => {
//     const itemPrice = Number(
//       item?.selling_price || item?.product?.selling_price || 0,
//     );
//     const itemQuantity = getSafeQuantity(item);
//     return total + calculateSubtotal(itemPrice, itemQuantity);
//   }, 0);

//   const getImageUrl = (img) => {
//     if (img) {
//       const normalized = String(img).replace(/\\/g, "/").split("/").pop();
//       return `${globalBackendRoute}/uploads/products/${normalized}`;
//     }

//     return "https://via.placeholder.com/600x600";
//   };

//   const handlePlusClick = (e, item) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const productId = getProductId(item);
//     const currentQty = getSafeQuantity(item);
//     const maxQty = getMaxQuantity(item);

//     if (!productId) return;
//     if (currentQty >= maxQty) return;

//     updateQuantity(productId, currentQty + 1);
//   };

//   const handleMinusClick = (e, item) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const productId = getProductId(item);
//     const currentQty = getSafeQuantity(item);

//     if (!productId) return;

//     if (currentQty <= 1) {
//       removeFromCart(productId);
//       return;
//     }

//     updateQuantity(productId, currentQty - 1);
//   };

//   const handleRemoveClick = (e, item) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const productId = getProductId(item);
//     if (!productId) return;

//     removeFromCart(productId);
//   };

//   const handleOutsideClick = (e) => {
//     if (cartRef.current && !cartRef.current.contains(e.target)) {
//       setOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, []);

//   return (
//     <div className="mc-font mc-scope relative" ref={cartRef}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

//         .mc-font {
//           font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
//         }

//         .btnOrange {
//           border-radius: 9999px;
//           background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36));
//           padding: 0.75rem 1rem;
//           color: white;
//           font-weight: 800;
//           font-size: 12px;
//           box-shadow: 0 18px 30px -18px rgba(249,115,22,0.45);
//           transition: opacity .15s ease, transform .15s ease;
//         }

//         .btnOrange:hover {
//           opacity: .95;
//         }

//         .btnOrange:active {
//           transform: scale(.99);
//         }

//         .btnGhost {
//           border-radius: 9999px;
//           padding: 0.75rem 1rem;
//           font-weight: 800;
//           font-size: 12px;
//           color: rgb(30,41,59);
//           background: rgba(241,245,249,.9);
//           transition: background .15s ease, transform .15s ease;
//           border: 1px solid rgb(241,245,249);
//         }

//         .btnGhost:hover {
//           background: rgba(226,232,240,.95);
//         }

//         .btnGhost:active {
//           transform: scale(.99);
//         }

//         .mcCard {
//           border: 1px solid rgb(241,245,249);
//           box-shadow: 0 24px 80px -45px rgba(15,23,42,.35);
//         }

//         .mcScroll::-webkit-scrollbar {
//           width: 10px;
//         }

//         .mcScroll::-webkit-scrollbar-thumb {
//           background: rgba(148,163,184,.35);
//           border-radius: 9999px;
//         }

//         .mcScroll::-webkit-scrollbar-track {
//           background: transparent;
//         }

//         .qtyBtn {
//           height: 30px;
//           width: 30px;
//           border-radius: 9999px;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           background: rgb(248,250,252);
//           color: rgb(15,23,42);
//           border: 1px solid rgb(226,232,240);
//           transition: all .15s ease;
//         }

//         .qtyBtn:hover {
//           background: rgb(241,245,249);
//           transform: translateY(-1px);
//         }

//         .qtyBtn:disabled {
//           opacity: .45;
//           cursor: not-allowed;
//           transform: none;
//         }
//       `}</style>

//       <button
//         onClick={() => setOpen((prev) => !prev)}
//         className="relative p-2 rounded-full"
//         type="button"
//         aria-label="Open cart"
//       >
//         <FaShoppingCart className="w-7 h-7 text-orange-500 hover:scale-110 transition-transform duration-300" />

//         {cartCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full">
//             {cartCount}
//           </span>
//         )}
//       </button>

//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, y: -10, scale: 0.98 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -10, scale: 0.98 }}
//             transition={{ duration: 0.22 }}
//             className="absolute right-0 mt-3 w-[540px] max-w-[96vw] bg-white rounded-3xl z-50 p-4 mcCard"
//           >
//             <div className="flex items-center justify-between gap-3 mb-3">
//               <div className="min-w-0">
//                 <h2 className="text-[14px] font-extrabold text-slate-900">
//                   Cart Summary
//                 </h2>

//                 <p className="text-[12px] font-semibold text-slate-500">
//                   {cartItems.length === 0
//                     ? "No items yet"
//                     : `${cartCount} item(s) • quick checkout`}
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setOpen(false)}
//                 className="h-9 w-9 rounded-full bg-slate-50 hover:bg-slate-100 transition inline-flex items-center justify-center"
//                 style={{ border: "1px solid rgb(241,245,249)" }}
//                 aria-label="Close cart"
//               >
//                 ✕
//               </button>
//             </div>

//             {cartItems.length === 0 ? (
//               <div className="text-center text-slate-500 py-10">
//                 <FaShoppingCart className="w-12 h-12 mx-auto mb-3 text-slate-300" />

//                 <p className="text-[13px] font-extrabold">
//                   Your cart is empty!
//                 </p>

//                 <p className="mt-1 text-[12px] font-semibold text-slate-500">
//                   Add products to see them here.
//                 </p>

//                 <div className="mt-5">
//                   <Link
//                     to="/shop"
//                     onClick={() => setOpen(false)}
//                     className="btnGhost inline-flex justify-center w-full"
//                   >
//                     Browse products
//                   </Link>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1 mcScroll">
//                 {cartItems.map((item) => {
//                   const productId = getProductId(item);

//                   const productName =
//                     item?.product_name ||
//                     item?.product?.product_name ||
//                     "Product";

//                   const productImage =
//                     item?.product_image || item?.product?.product_image;

//                   const itemPrice = Number(
//                     item?.selling_price || item?.product?.selling_price || 0,
//                   );

//                   const itemQuantity = getSafeQuantity(item);
//                   const maxQuantity = getMaxQuantity(item);

//                   const itemSubtotal = calculateSubtotal(
//                     itemPrice,
//                     itemQuantity,
//                   );

//                   const isMaxReached = itemQuantity >= maxQuantity;

//                   return (
//                     <div
//                       key={productId}
//                       className="grid grid-cols-[64px_1fr_auto] gap-3 rounded-2xl bg-white p-3"
//                       style={{ border: "1px solid rgb(241,245,249)" }}
//                     >
//                       <div
//                         className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-50"
//                         style={{ border: "1px solid rgb(241,245,249)" }}
//                       >
//                         <img
//                           src={getImageUrl(productImage)}
//                           alt={productName}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src =
//                               "https://via.placeholder.com/600x600";
//                           }}
//                           loading="lazy"
//                         />
//                       </div>

//                       <div className="min-w-0">
//                         <h3 className="text-[13px] font-extrabold text-slate-900 truncate">
//                           {productName}
//                         </h3>

//                         <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] font-semibold text-slate-600">
//                           <span className="inline-flex items-center gap-1 font-extrabold text-slate-900">
//                             <FaRupeeSign /> {formatMoney(itemPrice)}
//                           </span>

//                           <span className="text-slate-400">×</span>

//                           <span className="font-extrabold">{itemQuantity}</span>

//                           {isMaxReached && (
//                             <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700">
//                               Max reached
//                             </span>
//                           )}
//                         </div>

//                         <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
//                           <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 p-1">
//                             <button
//                               type="button"
//                               onClick={(e) => handleMinusClick(e, item)}
//                               className="qtyBtn"
//                               aria-label="Decrease quantity"
//                               title={
//                                 itemQuantity <= 1
//                                   ? "Remove item"
//                                   : "Decrease quantity"
//                               }
//                             >
//                               <FaMinus className="text-[10px]" />
//                             </button>

//                             <span className="min-w-[34px] text-center text-[13px] font-black text-slate-900">
//                               {itemQuantity}
//                             </span>

//                             <button
//                               type="button"
//                               onClick={(e) => handlePlusClick(e, item)}
//                               disabled={isMaxReached}
//                               className="qtyBtn"
//                               aria-label="Increase quantity"
//                               title={
//                                 isMaxReached
//                                   ? "Maximum quantity reached"
//                                   : "Increase quantity"
//                               }
//                             >
//                               <FaPlus className="text-[10px]" />
//                             </button>
//                           </div>

//                           <div className="rounded-xl bg-slate-50 px-3 py-2">
//                             <p className="text-[10px] font-bold text-slate-500">
//                               Subtotal
//                             </p>

//                             <p className="inline-flex items-center gap-1 text-[13px] font-black text-slate-900">
//                               <FaRupeeSign /> {formatMoney(itemSubtotal)}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <button
//                         onClick={(e) => handleRemoveClick(e, item)}
//                         className="h-9 w-9 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 transition inline-flex items-center justify-center"
//                         type="button"
//                         aria-label="Remove item"
//                         title="Remove"
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             {cartItems.length > 0 && (
//               <div className="mt-4 border-t pt-4 space-y-3">
//                 <div className="flex justify-between items-center rounded-2xl bg-slate-50 px-4 py-3">
//                   <div>
//                     <span className="block text-[12px] font-extrabold text-slate-700">
//                       Cart Total
//                     </span>

//                     <span className="text-[11px] font-semibold text-slate-500">
//                       Quantity and subtotal updated live
//                     </span>
//                   </div>

//                   <span className="flex items-center gap-1 text-[17px] font-black text-slate-900">
//                     <FaRupeeSign /> {formatMoney(cartTotal)}
//                   </span>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   <Link
//                     to="/cart"
//                     onClick={() => setOpen(false)}
//                     className="btnOrange block w-full text-center"
//                   >
//                     View Cart
//                   </Link>

//                   <button
//                     className="btnGhost w-full"
//                     type="button"
//                     onClick={() => {
//                       setOpen(false);
//                       navigate(isLoggedIn ? "/checkout" : "/login");
//                     }}
//                   >
//                     Checkout
//                   </button>
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default MiniCart;

// ✅ file: src/components/cart_components/MiniCart.jsx

import React, { useState, useRef, useEffect, useContext } from "react";
import { CartContext } from "../../components/cart_components/CartContext";
import { AuthContext } from "../../components/auth_components/AuthManager";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaRupeeSign,
  FaTrash,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import globalBackendRoute from "../../config/Config";

const MiniCart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const cartRef = useRef(null);
  const navigate = useNavigate();

  const formatMoney = (value) => Number(value || 0).toFixed(2);

  const getProductId = (item) =>
    item?.product?._id || item?.productId || item?._id;

  const getSafeQuantity = (item) => {
    const quantity = Number(item?.quantity || 1);
    return quantity < 1 ? 1 : quantity;
  };

  const getMaxQuantity = (item) => {
    const stock = Number(item?.stock || item?.product?.stock || 100);
    const maxPurchaseQty = Number(
      item?.max_purchase_qty || item?.product?.max_purchase_qty || stock || 100,
    );
    return Math.max(1, Math.min(stock || 100, maxPurchaseQty || 100));
  };

  const calculateSubtotal = (price, quantity) =>
    Number((Number(price || 0) * Number(quantity || 0)).toFixed(2));

  const cartCount = cartItems.reduce(
    (total, item) => total + getSafeQuantity(item),
    0,
  );

  const cartTotal = cartItems.reduce((total, item) => {
    const itemPrice = Number(
      item?.selling_price || item?.product?.selling_price || 0,
    );
    return total + calculateSubtotal(itemPrice, getSafeQuantity(item));
  }, 0);

  const getImageUrl = (img) => {
    if (img) {
      const normalized = String(img).replace(/\\/g, "/").split("/").pop();
      return `${globalBackendRoute}/uploads/products/${normalized}`;
    }
    return "https://via.placeholder.com/600x600";
  };

  const handlePlusClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    const productId = getProductId(item);
    const currentQty = getSafeQuantity(item);
    const maxQty = getMaxQuantity(item);

    if (!productId || currentQty >= maxQty) return;

    updateQuantity(productId, currentQty + 1);
  };

  const handleMinusClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    const productId = getProductId(item);
    const currentQty = getSafeQuantity(item);

    if (!productId) return;

    if (currentQty <= 1) {
      removeFromCart(productId);
      return;
    }

    updateQuantity(productId, currentQty - 1);
  };

  const handleRemoveClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    const productId = getProductId(item);
    if (!productId) return;

    removeFromCart(productId);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="mc-font mc-scope relative" ref={cartRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .mc-font {
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }

        .btnOrange {
          border-radius: 9999px;
          background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36));
          padding: 0.75rem 1rem;
          color: white;
          font-weight: 800;
          font-size: 12px;
          box-shadow: 0 18px 30px -18px rgba(249,115,22,0.45);
          transition: opacity .15s ease, transform .15s ease;
        }

        .btnOrange:hover { opacity: .95; }
        .btnOrange:active { transform: scale(.99); }

        .btnGhost {
          border-radius: 9999px;
          padding: 0.75rem 1rem;
          font-weight: 800;
          font-size: 12px;
          color: rgb(30,41,59);
          background: rgba(241,245,249,.9);
          transition: background .15s ease, transform .15s ease;
          border: 1px solid rgb(241,245,249);
        }

        .btnGhost:hover { background: rgba(226,232,240,.95); }
        .btnGhost:active { transform: scale(.99); }

        .mcCard {
          border: 1px solid rgb(241,245,249);
          box-shadow: 0 24px 80px -45px rgba(15,23,42,.35);
        }

        .mcScroll::-webkit-scrollbar { width: 8px; }
        .mcScroll::-webkit-scrollbar-thumb {
          background: rgba(148,163,184,.35);
          border-radius: 9999px;
        }
        .mcScroll::-webkit-scrollbar-track { background: transparent; }

        .qtyBtn {
          height: 30px;
          width: 30px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgb(248,250,252);
          color: rgb(15,23,42);
          border: 1px solid rgb(226,232,240);
          transition: all .15s ease;
          flex-shrink: 0;
        }

        .qtyBtn:hover {
          background: rgb(241,245,249);
          transform: translateY(-1px);
        }

        .qtyBtn:disabled {
          opacity: .45;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 640px) {
          .mcMobilePanel {
            position: fixed !important;
            left: 10px !important;
            right: 10px !important;
            top: 72px !important;
            width: auto !important;
            max-width: calc(100vw - 20px) !important;
            max-height: calc(100vh - 90px) !important;
            overflow: hidden;
          }

          .mcItemCard {
            grid-template-columns: 56px 1fr !important;
          }

          .mcRemoveBtn {
            position: absolute;
            top: 10px;
            right: 10px;
          }

          .mcItemImage {
            height: 56px !important;
            width: 56px !important;
          }
        }
      `}</style>

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-full"
        type="button"
        aria-label="Open cart"
      >
        <FaShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500 hover:scale-110 transition-transform duration-300" />

        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] sm:text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="mcMobilePanel absolute right-0 mt-3 w-[540px] max-w-[96vw] bg-white rounded-3xl z-50 p-3 sm:p-4 mcCard"
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="min-w-0">
                <h2 className="text-[13px] sm:text-[14px] font-extrabold text-slate-900">
                  Cart Summary
                </h2>

                <p className="text-[11px] sm:text-[12px] font-semibold text-slate-500">
                  {cartItems.length === 0
                    ? "No items yet"
                    : `${cartCount} item(s) • quick checkout`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-slate-50 hover:bg-slate-100 transition inline-flex items-center justify-center flex-shrink-0"
                style={{ border: "1px solid rgb(241,245,249)" }}
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center text-slate-500 py-8 sm:py-10">
                <FaShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-slate-300" />

                <p className="text-[13px] font-extrabold">
                  Your cart is empty!
                </p>

                <p className="mt-1 text-[12px] font-semibold text-slate-500">
                  Add products to see them here.
                </p>

                <div className="mt-5">
                  <Link
                    to="/shop"
                    onClick={() => setOpen(false)}
                    className="btnGhost inline-flex justify-center w-full"
                  >
                    Browse products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[52vh] sm:max-h-[400px] overflow-y-auto pr-1 mcScroll">
                {cartItems.map((item) => {
                  const productId = getProductId(item);

                  const productName =
                    item?.product_name ||
                    item?.product?.product_name ||
                    "Product";

                  const productImage =
                    item?.product_image || item?.product?.product_image;

                  const itemPrice = Number(
                    item?.selling_price || item?.product?.selling_price || 0,
                  );

                  const itemQuantity = getSafeQuantity(item);
                  const maxQuantity = getMaxQuantity(item);
                  const itemSubtotal = calculateSubtotal(
                    itemPrice,
                    itemQuantity,
                  );
                  const isMaxReached = itemQuantity >= maxQuantity;

                  return (
                    <div
                      key={productId}
                      className="mcItemCard relative grid grid-cols-[64px_1fr_auto] gap-3 rounded-2xl bg-white p-3"
                      style={{ border: "1px solid rgb(241,245,249)" }}
                    >
                      <div
                        className="mcItemImage h-16 w-16 rounded-2xl overflow-hidden bg-slate-50"
                        style={{ border: "1px solid rgb(241,245,249)" }}
                      >
                        <img
                          src={getImageUrl(productImage)}
                          alt={productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/600x600";
                          }}
                          loading="lazy"
                        />
                      </div>

                      <div className="min-w-0 pr-8 sm:pr-0">
                        <h3 className="text-[12px] sm:text-[13px] font-extrabold text-slate-900 truncate">
                          {productName}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] sm:text-[12px] font-semibold text-slate-600">
                          <span className="inline-flex items-center gap-1 font-extrabold text-slate-900">
                            <FaRupeeSign /> {formatMoney(itemPrice)}
                          </span>

                          <span className="text-slate-400">×</span>

                          <span className="font-extrabold">{itemQuantity}</span>

                          {isMaxReached && (
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700">
                              Max reached
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex flex-col xs:flex-row sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 p-1">
                            <button
                              type="button"
                              onClick={(e) => handleMinusClick(e, item)}
                              className="qtyBtn"
                              aria-label="Decrease quantity"
                            >
                              <FaMinus className="text-[10px]" />
                            </button>

                            <span className="min-w-[34px] text-center text-[13px] font-black text-slate-900">
                              {itemQuantity}
                            </span>

                            <button
                              type="button"
                              onClick={(e) => handlePlusClick(e, item)}
                              disabled={isMaxReached}
                              className="qtyBtn"
                              aria-label="Increase quantity"
                            >
                              <FaPlus className="text-[10px]" />
                            </button>
                          </div>

                          <div className="w-full sm:w-auto rounded-xl bg-slate-50 px-3 py-2">
                            <p className="text-[10px] font-bold text-slate-500">
                              Subtotal
                            </p>

                            <p className="inline-flex items-center gap-1 text-[13px] font-black text-slate-900">
                              <FaRupeeSign /> {formatMoney(itemSubtotal)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleRemoveClick(e, item)}
                        className="mcRemoveBtn h-9 w-9 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 transition inline-flex items-center justify-center"
                        type="button"
                        aria-label="Remove item"
                        title="Remove"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {cartItems.length > 0 && (
              <div className="mt-4 border-t pt-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3">
                  <div>
                    <span className="block text-[12px] font-extrabold text-slate-700">
                      Cart Total
                    </span>

                    <span className="text-[11px] font-semibold text-slate-500">
                      Quantity and subtotal updated live
                    </span>
                  </div>

                  <span className="flex items-center gap-1 text-[16px] sm:text-[17px] font-black text-slate-900">
                    <FaRupeeSign /> {formatMoney(cartTotal)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    to="/cart"
                    onClick={() => setOpen(false)}
                    className="btnOrange block w-full text-center"
                  >
                    View Cart
                  </Link>

                  <button
                    className="btnGhost w-full"
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate(isLoggedIn ? "/checkout" : "/login");
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MiniCart;
