// // import React, { useContext, useEffect } from "react";
// // import { WishlistContext } from "../../components/wishlist_components/WishlistContext";
// // import { CartContext } from "../../components/cart_components/CartContext";
// // import { FaTrash, FaCartPlus, FaBookmark, FaCheck } from "react-icons/fa";
// // import { useNavigate } from "react-router-dom";
// // import globalBackendRoute from "../../config/Config";
// // import { AuthContext } from "../../components/auth_components/AuthManager";
// // import { motion } from "framer-motion";
// // import { BsViewList } from "react-icons/bs";
// // import { RiArrowLeftSLine } from "react-icons/ri";

// // const Wishlist = () => {
// //   const {
// //     wishlistItems,
// //     removeFromWishlist,
// //     toggleSaveForLater,
// //     moveToCartFromWishlist,
// //     fetchWishlist,
// //   } = useContext(WishlistContext);

// //   const { addToCart, fetchServerCart } = useContext(CartContext);
// //   const { isLoggedIn } = useContext(AuthContext);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     if (isLoggedIn && wishlistItems.length === 0) {
// //       fetchWishlist();
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [isLoggedIn]);

// //   useEffect(() => {
// //     if (isLoggedIn) fetchWishlist();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const getImageUrl = (img) => {
// //     if (!img) return "https://via.placeholder.com/600x600";
// //     const normalized = String(img).replace(/\\/g, "/").split("/").pop();
// //     return `${globalBackendRoute}/uploads/products/${normalized}`;
// //   };

// //   const handleCheckoutNow = (item) => {
// //     addToCart(item);
// //     navigate("/checkout");
// //   };

// //   return (
// //     <div className="wl-font wl-scope w-full">
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
// //         .wl-font{
// //           font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
// //         }

// //         .btnOrange{
// //           border-radius: 9999px;
// //           background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36));
// //           padding: 0.7rem 1.1rem;
// //           color: white;
// //           font-weight: 800;
// //           font-size: 12px;
// //           box-shadow: 0 18px 30px -18px rgba(249,115,22,0.45);
// //           transition: opacity .15s ease, transform .15s ease;
// //         }
// //         .btnOrange:hover{ opacity: .95; }
// //         .btnOrange:active{ transform: scale(.99); }

// //         .btnGhost{
// //           border-radius: 9999px;
// //           padding: 0.7rem 1.0rem;
// //           font-weight: 800;
// //           font-size: 12px;
// //           color: rgb(30,41,59);
// //           background: rgba(241,245,249,.8);
// //           transition: background .15s ease, transform .15s ease;
// //         }
// //         .btnGhost:hover{ background: rgba(226,232,240,.95); }
// //         .btnGhost:active{ transform: scale(.99); }

// //         .priceSelling{ color: rgb(15,23,42); font-weight: 900; }
// //         .priceMrp{ color: rgb(239,68,68); font-weight: 800; text-decoration: line-through; }
// //       `}</style>

// //       <motion.div
// //         className="w-full px-3 sm:px-5 lg:px-10 py-6"
// //         initial={{ opacity: 0, y: 10 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.35 }}
// //       >
// //         {/* Header */}
// //         <div className="flex items-end justify-between gap-4">
// //           <div className="min-w-0">
// //             <button
// //               type="button"
// //               onClick={() => navigate(-1)}
// //               className="inline-flex items-center gap-2 text-[12px] font-extrabold text-slate-600 hover:text-slate-900 transition"
// //             >
// //               <RiArrowLeftSLine className="text-[16px]" />
// //               Back
// //             </button>

// //             <h1 className="mt-3 text-[22px] sm:text-[26px] font-extrabold text-slate-900 flex items-center gap-3">
// //               <BsViewList className="text-orange-500" />
// //               My Wishlist
// //               <span className="text-[12px] font-semibold text-slate-500">
// //                 ({wishlistItems.length})
// //               </span>
// //             </h1>
// //             <p className="mt-1 text-[12px] font-semibold text-slate-500">
// //               Save items, move to cart, or buy instantly.
// //             </p>
// //           </div>

// //           <button
// //             type="button"
// //             onClick={() => navigate("/shop")}
// //             className="hidden sm:inline-flex btnGhost"
// //           >
// //             Continue shopping
// //           </button>
// //         </div>

// //         {/* Empty state */}
// //         {wishlistItems.length === 0 ? (
// //           <motion.div
// //             className="text-center text-slate-500 mt-16"
// //             initial={{ opacity: 0, scale: 0.96 }}
// //             animate={{ opacity: 1, scale: 1 }}
// //           >
// //             <div className="inline-flex items-center gap-2 text-[12px] font-semibold">
// //               <span className="h-2 w-2 rounded-full bg-orange-500" />
// //               Your wishlist is empty.
// //             </div>

// //             <div className="mt-6">
// //               <button
// //                 type="button"
// //                 className="btnOrange"
// //                 onClick={() => navigate("/shop")}
// //               >
// //                 Browse products
// //               </button>
// //             </div>
// //           </motion.div>
// //         ) : (
// //           <>
// //             {/* Grid */}
// //             <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-10">
// //               {wishlistItems.map((item) => (
// //                 <motion.div
// //                   key={item._id}
// //                   className="rounded-3xl bg-white overflow-hidden"
// //                   style={{
// //                     border: "1px solid rgb(241,245,249)",
// //                     boxShadow: "none",
// //                   }}
// //                   initial={{ y: 14, opacity: 0 }}
// //                   animate={{ y: 0, opacity: 1 }}
// //                   transition={{ duration: 0.28 }}
// //                 >
// //                   <div
// //                     className="p-3 cursor-pointer"
// //                     onClick={() => navigate(`/single-product/${item._id}`)}
// //                     title="Open product"
// //                   >
// //                     <div className="rounded-2xl overflow-hidden bg-slate-50">
// //                       <img
// //                         src={getImageUrl(item.product_image)}
// //                         alt={item.product_name}
// //                         className="w-full aspect-square object-cover"
// //                         loading="lazy"
// //                         onError={(e) => {
// //                           e.target.onerror = null;
// //                           e.target.src = "https://via.placeholder.com/600x600";
// //                         }}
// //                       />
// //                     </div>

// //                     <div className="mt-3">
// //                       <h2 className="text-[13px] font-extrabold text-slate-900 truncate">
// //                         {item.product_name}
// //                       </h2>

// //                       <div className="mt-2 flex items-baseline gap-2">
// //                         <span className="priceSelling text-[14px]">
// //                           ₹{item.selling_price}
// //                         </span>
// //                         {item.display_price && (
// //                           <span className="priceMrp text-[12px]">
// //                             ₹{item.display_price}
// //                           </span>
// //                         )}
// //                       </div>

// //                       {item.savedForLater && (
// //                         <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-amber-700">
// //                           <FaBookmark className="text-amber-600" />
// //                           Saved for later
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>

// //                   {/* Actions */}
// //                   <div className="px-3 pb-4">
// //                     <div className="grid grid-cols-1 gap-2 mt-2">
// //                       <button
// //                         onClick={async () => {
// //                           await moveToCartFromWishlist(item._id);
// //                           fetchServerCart();
// //                         }}
// //                         className="btnOrange w-full inline-flex items-center justify-center gap-2"
// //                         type="button"
// //                       >
// //                         <FaCartPlus /> Move to Cart
// //                       </button>

// //                       <button
// //                         onClick={() => handleCheckoutNow(item)}
// //                         className="btnGhost w-full inline-flex items-center justify-center gap-2"
// //                         type="button"
// //                       >
// //                         <FaCheck /> Buy Now
// //                       </button>

// //                       <div className="grid grid-cols-2 gap-2 mt-1">
// //                         <button
// //                           onClick={() => toggleSaveForLater(item._id)}
// //                           className="btnGhost w-full inline-flex items-center justify-center gap-2"
// //                           type="button"
// //                         >
// //                           <FaBookmark />
// //                           {item.savedForLater ? "Unsave" : "Save"}
// //                         </button>

// //                         <button
// //                           onClick={() => removeFromWishlist(item._id)}
// //                           className="w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[12px] font-extrabold bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
// //                           type="button"
// //                         >
// //                           <FaTrash /> Remove
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </motion.div>
// //               ))}
// //             </div>

// //             <div className="mt-10 sm:hidden flex justify-center">
// //               <button
// //                 type="button"
// //                 onClick={() => navigate("/shop")}
// //                 className="btnGhost"
// //               >
// //                 Continue shopping
// //               </button>
// //             </div>
// //           </>
// //         )}
// //       </motion.div>
// //     </div>
// //   );
// // };

// // export default Wishlist;

// // ✅ file: src/pages/wishlist_pages/Wishlist.jsx  (use your exact path)
// // ✅ ONLY CHANGE: MOBILE VIEW matches CartPage mobile row style
// // ✅ Desktop view remains EXACTLY as your current desktop grid (sm+)
// // ✅ Logic unchanged

// import React, { useContext, useEffect } from "react";
// import { WishlistContext } from "../../components/wishlist_components/WishlistContext";
// import { CartContext } from "../../components/cart_components/CartContext";
// import {
//   FaTrash,
//   FaCartPlus,
//   FaBookmark,
//   FaCheck,
//   FaRupeeSign,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import globalBackendRoute from "../../config/Config";
// import { AuthContext } from "../../components/auth_components/AuthManager";
// import { motion } from "framer-motion";
// import { BsViewList } from "react-icons/bs";
// import { RiArrowLeftSLine } from "react-icons/ri";

// const Wishlist = () => {
//   const {
//     wishlistItems,
//     removeFromWishlist,
//     toggleSaveForLater,
//     moveToCartFromWishlist,
//     fetchWishlist,
//   } = useContext(WishlistContext);

//   const { addToCart, fetchServerCart } = useContext(CartContext);
//   const { isLoggedIn } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isLoggedIn && wishlistItems.length === 0) {
//       fetchWishlist();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isLoggedIn]);

//   useEffect(() => {
//     if (isLoggedIn) fetchWishlist();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const getImageUrl = (img) => {
//     if (!img) return "https://via.placeholder.com/600x600";
//     const normalized = String(img).replace(/\\/g, "/").split("/").pop();
//     return `${globalBackendRoute}/uploads/products/${normalized}`;
//   };

//   const handleCheckoutNow = (item) => {
//     addToCart(item);
//     navigate("/checkout");
//   };

//   return (
//     <div className="wl-font wl-scope w-full">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
//         .wl-font{
//           font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
//         }

//         .btnOrange{
//           border-radius: 9999px;
//           background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36));
//           padding: 0.7rem 1.1rem;
//           color: white;
//           font-weight: 800;
//           font-size: 12px;
//           box-shadow: 0 18px 30px -18px rgba(249,115,22,0.45);
//           transition: opacity .15s ease, transform .15s ease;
//         }
//         .btnOrange:hover{ opacity: .95; }
//         .btnOrange:active{ transform: scale(.99); }

//         .btnGhost{
//           border-radius: 9999px;
//           padding: 0.7rem 1.0rem;
//           font-weight: 800;
//           font-size: 12px;
//           color: rgb(30,41,59);
//           background: rgba(241,245,249,.8);
//           transition: background .15s ease, transform .15s ease;
//         }
//         .btnGhost:hover{ background: rgba(226,232,240,.95); }
//         .btnGhost:active{ transform: scale(.99); }

//         .priceSelling{ color: rgb(15,23,42); font-weight: 900; }
//         .priceMrp{ color: rgb(239,68,68); font-weight: 800; text-decoration: line-through; }
//       `}</style>

//       <motion.div
//         className="w-full px-3 sm:px-5 lg:px-10 py-6"
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.35 }}
//       >
//         {/* Header (unchanged) */}
//         <div className="flex items-end justify-between gap-4">
//           <div className="min-w-0">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="inline-flex items-center gap-2 text-[12px] font-extrabold text-slate-600 hover:text-slate-900 transition"
//             >
//               <RiArrowLeftSLine className="text-[16px]" />
//               Back
//             </button>

//             <h1 className="mt-3 text-[22px] sm:text-[26px] font-extrabold text-slate-900 flex items-center gap-3">
//               <BsViewList className="text-orange-500" />
//               My Wishlist
//               <span className="text-[12px] font-semibold text-slate-500">
//                 ({wishlistItems.length})
//               </span>
//             </h1>
//             <p className="mt-1 text-[12px] font-semibold text-slate-500">
//               Save items, move to cart, or buy instantly.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => navigate("/shop")}
//             className="hidden sm:inline-flex btnGhost"
//           >
//             Continue shopping
//           </button>
//         </div>

//         {/* Empty state (unchanged) */}
//         {wishlistItems.length === 0 ? (
//           <motion.div
//             className="text-center text-slate-500 mt-16"
//             initial={{ opacity: 0, scale: 0.96 }}
//             animate={{ opacity: 1, scale: 1 }}
//           >
//             <div className="inline-flex items-center gap-2 text-[12px] font-semibold">
//               <span className="h-2 w-2 rounded-full bg-orange-500" />
//               Your wishlist is empty.
//             </div>

//             <div className="mt-6">
//               <button
//                 type="button"
//                 className="btnOrange"
//                 onClick={() => navigate("/shop")}
//               >
//                 Browse products
//               </button>
//             </div>
//           </motion.div>
//         ) : (
//           <>
//             {/* ✅ MOBILE VIEW (matches CartPage row feel) */}
//             <div className="mt-8 sm:hidden">
//               <div className="flex flex-col gap-6">
//                 {wishlistItems.map((item) => (
//                   <motion.div
//                     key={item._id}
//                     className="bg-white rounded-3xl p-4"
//                     style={{
//                       border: "1px solid rgb(241,245,249)",
//                       boxShadow: "none",
//                     }}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.25 }}
//                   >
//                     {/* Product row (image left, details right) */}
//                     <div className="flex items-center gap-4">
//                       <div
//                         className="rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0"
//                         style={{
//                           width: 92,
//                           height: 92,
//                           border: "1px solid rgb(241,245,249)",
//                         }}
//                         onClick={() => navigate(`/single-product/${item._id}`)}
//                         title="Open product"
//                       >
//                         <img
//                           src={getImageUrl(item.product_image)}
//                           alt={item.product_name}
//                           className="w-full h-full object-cover"
//                           loading="lazy"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src =
//                               "https://via.placeholder.com/600x600";
//                           }}
//                         />
//                       </div>

//                       <div className="min-w-0 flex-1">
//                         <h2
//                           className="text-[14px] font-extrabold text-slate-900 truncate cursor-pointer"
//                           onClick={() =>
//                             navigate(`/single-product/${item._id}`)
//                           }
//                           title="Open product"
//                         >
//                           {item.product_name}
//                         </h2>

//                         <div className="mt-2 flex items-baseline gap-2">
//                           <span className="priceSelling text-[14px] inline-flex items-center gap-1">
//                             <FaRupeeSign /> {item.selling_price}
//                           </span>
//                           {item.display_price && (
//                             <span className="priceMrp text-[12px]">
//                               ₹{item.display_price}
//                             </span>
//                           )}
//                         </div>

//                         {item.savedForLater && (
//                           <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-amber-700">
//                             <FaBookmark className="text-amber-600" />
//                             Saved for later
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Actions (cart-like, stacked clean) */}
//                     <div className="mt-4 grid grid-cols-1 gap-2">
//                       <button
//                         onClick={async () => {
//                           await moveToCartFromWishlist(item._id);
//                           fetchServerCart();
//                         }}
//                         className="btnOrange w-full inline-flex items-center justify-center gap-2"
//                         type="button"
//                       >
//                         <FaCartPlus /> Move to Cart
//                       </button>

//                       <button
//                         onClick={() => handleCheckoutNow(item)}
//                         className="btnGhost w-full inline-flex items-center justify-center gap-2"
//                         type="button"
//                       >
//                         <FaCheck /> Buy Now
//                       </button>

//                       <div className="grid grid-cols-2 gap-2 mt-1">
//                         <button
//                           onClick={() => toggleSaveForLater(item._id)}
//                           className="btnGhost w-full inline-flex items-center justify-center gap-2"
//                           type="button"
//                         >
//                           <FaBookmark />
//                           {item.savedForLater ? "Unsave" : "Save"}
//                         </button>

//                         <button
//                           onClick={() => removeFromWishlist(item._id)}
//                           className="w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[12px] font-extrabold bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
//                           type="button"
//                         >
//                           <FaTrash /> Remove
//                         </button>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>

//               {/* Mobile continue shopping button (same as you had) */}
//               <div className="mt-10 flex justify-center">
//                 <button
//                   type="button"
//                   onClick={() => navigate("/shop")}
//                   className="btnGhost"
//                 >
//                   Continue shopping
//                 </button>
//               </div>
//             </div>

//             {/* ✅ DESKTOP VIEW (unchanged): your existing grid */}
//             <div className="hidden sm:grid mt-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-10">
//               {wishlistItems.map((item) => (
//                 <motion.div
//                   key={item._id}
//                   className="rounded-3xl bg-white overflow-hidden"
//                   style={{
//                     border: "1px solid rgb(241,245,249)",
//                     boxShadow: "none",
//                   }}
//                   initial={{ y: 14, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ duration: 0.28 }}
//                 >
//                   <div
//                     className="p-3 cursor-pointer"
//                     onClick={() => navigate(`/single-product/${item._id}`)}
//                     title="Open product"
//                   >
//                     <div className="rounded-2xl overflow-hidden bg-slate-50">
//                       <img
//                         src={getImageUrl(item.product_image)}
//                         alt={item.product_name}
//                         className="w-full aspect-square object-cover"
//                         loading="lazy"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = "https://via.placeholder.com/600x600";
//                         }}
//                       />
//                     </div>

//                     <div className="mt-3">
//                       <h2 className="text-[13px] font-extrabold text-slate-900 truncate">
//                         {item.product_name}
//                       </h2>

//                       <div className="mt-2 flex items-baseline gap-2">
//                         <span className="priceSelling text-[14px]">
//                           ₹{item.selling_price}
//                         </span>
//                         {item.display_price && (
//                           <span className="priceMrp text-[12px]">
//                             ₹{item.display_price}
//                           </span>
//                         )}
//                       </div>

//                       {item.savedForLater && (
//                         <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-amber-700">
//                           <FaBookmark className="text-amber-600" />
//                           Saved for later
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Actions (unchanged) */}
//                   <div className="px-3 pb-4">
//                     <div className="grid grid-cols-1 gap-2 mt-2">
//                       <button
//                         onClick={async () => {
//                           await moveToCartFromWishlist(item._id);
//                           fetchServerCart();
//                         }}
//                         className="btnOrange w-full inline-flex items-center justify-center gap-2"
//                         type="button"
//                       >
//                         <FaCartPlus /> Move to Cart
//                       </button>

//                       <button
//                         onClick={() => handleCheckoutNow(item)}
//                         className="btnGhost w-full inline-flex items-center justify-center gap-2"
//                         type="button"
//                       >
//                         <FaCheck /> Buy Now
//                       </button>

//                       <div className="grid grid-cols-2 gap-2 mt-1">
//                         <button
//                           onClick={() => toggleSaveForLater(item._id)}
//                           className="btnGhost w-full inline-flex items-center justify-center gap-2"
//                           type="button"
//                         >
//                           <FaBookmark />
//                           {item.savedForLater ? "Unsave" : "Save"}
//                         </button>

//                         <button
//                           onClick={() => removeFromWishlist(item._id)}
//                           className="w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[12px] font-extrabold bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
//                           type="button"
//                         >
//                           <FaTrash /> Remove
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default Wishlist;

// new updated wishlist page.

import React, {
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";
import { WishlistContext } from "../../components/wishlist_components/WishlistContext";
import { CartContext } from "../../components/cart_components/CartContext";
import {
  FaTrash,
  FaCartPlus,
  FaBookmark,
  FaCheck,
  FaRupeeSign,
  FaTh,
  FaThList,
  FaIdBadge,
  FaStar,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";
import { AuthContext } from "../../components/auth_components/AuthManager";
import { motion } from "framer-motion";
import { BsViewList } from "react-icons/bs";
import { RiArrowLeftSLine } from "react-icons/ri";
import { FiTruck, FiRefreshCw, FiSliders } from "react-icons/fi";
import { ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";

// --------------------------- helpers (match Shop) ---------------------------
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

function safeUpper(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.trim().toUpperCase();
  if (typeof v === "number" || typeof v === "boolean")
    return String(v).trim().toUpperCase();
  if (typeof v === "object") {
    if (typeof v.name === "string") return v.name.trim().toUpperCase();
    if (typeof v.title === "string") return v.title.trim().toUpperCase();
  }
  return "";
}

// ===============================================================
// ✅ WISHLIST (Shop-like layout: 3 views + pagination + count)
// ===============================================================
const Wishlist = () => {
  const {
    wishlistItems,
    removeFromWishlist,
    toggleSaveForLater,
    moveToCartFromWishlist,
    fetchWishlist,
  } = useContext(WishlistContext);

  const { addToCart, fetchServerCart } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");

  // ============================================================
  // ✅ FULL ROWS FIX (same as Shop)
  // ============================================================
  const [columns, setColumns] = useState(6);

  useEffect(() => {
    const computeCols = () => {
      const w = window.innerWidth;

      if (viewMode === "list") return 1;

      if (viewMode === "card") {
        if (w >= 1280) return 4;
        if (w >= 1024) return 3;
        if (w >= 640) return 2;
        return 1;
      }

      if (w >= 1536) return 6;
      if (w >= 1280) return 6;
      if (w >= 1024) return 5;
      if (w >= 768) return 4;
      if (w >= 640) return 3;
      return 2;
    };

    const update = () => setColumns(computeCols());
    update();

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [viewMode]);

  const rowsPerPage = viewMode === "grid" ? 2 : viewMode === "card" ? 2 : 14;
  const productsPerPage =
    viewMode === "list" ? 7 : Math.max(1, columns) * Math.max(1, rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [productsPerPage, viewMode, columns]);

  // ============================================================
  // ✅ Fetch logic unchanged
  // ============================================================
  useEffect(() => {
    if (isLoggedIn && wishlistItems.length === 0) {
      fetchWishlist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckoutNow = (item) => {
    addToCart(item);
    navigate("/checkout");
  };

  // ============================================================
  // ✅ Pagination slice + count line (same style as Shop)
  // ============================================================
  const totalCount = wishlistItems.length;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = wishlistItems.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const pageStart = totalCount === 0 ? 0 : indexOfFirstProduct + 1;
  const pageEnd = Math.min(indexOfLastProduct, totalCount);
  const showingNow = currentProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / productsPerPage));

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const viewButtons = useMemo(
    () => [
      { id: "grid", Icon: FaTh, label: "Grid" },
      { id: "card", Icon: FaIdBadge, label: "Cards" },
      { id: "list", Icon: FaThList, label: "List" },
    ],
    []
  );

  const onChangeView = useCallback((mode) => setViewMode(mode), []);

  return (
    <div className="wl-font w-full wl-scope">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .wl-font{
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }
        .btnOrange{
          border-radius: 9999px;
          background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36));
          padding: 0.6rem 1.1rem;
          color: white;
          font-weight: 800;
          font-size: 12px;
          box-shadow: 0 18px 30px -18px rgba(249,115,22,0.45);
          transition: opacity .15s ease, transform .15s ease, filter .15s ease;
          will-change: transform;
        }
        .btnOrange:hover{ opacity: .95; }
        .btnOrange:active{ transform: scale(.99); }

        .btnGhost{
          border-radius: 9999px;
          padding: 0.6rem 1.0rem;
          font-weight: 800;
          font-size: 12px;
          color: rgb(30,41,59);
          background: rgba(241,245,249,.8);
          transition: background .15s ease, transform .15s ease;
        }
        .btnGhost:hover{ background: rgba(226,232,240,.95); }
        .btnGhost:active{ transform: scale(.99); }

        .priceSelling{ color: rgb(15,23,42); font-weight: 900; }
        .priceMrp{ color: rgb(239,68,68); font-weight: 800; text-decoration: line-through; }

        .paginationWrap button.activePage{
          background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36)) !important;
          color: #fff !important;
          border: none !important;
          box-shadow: 0 18px 30px -18px rgba(249,115,22,0.40) !important;
          border-radius: 9999px !important;
        }

        /* ✅ ONLY LAPTOP/TABLET (640px to 1023px): make primary buttons smaller */
        @media (min-width: 640px) and (max-width: 1023px){
          .laptopCartBtn{
            padding: 0.5rem 0.9rem !important;
            font-size: 11px !important;
          }
          .laptopCartBtn svg{
            width: 14px !important;
            height: 14px !important;
          }
        }
      `}</style>

      {/* FULL WIDTH background + CONTENT WRAPPER gutters (same as Shop) */}
      <div className="w-full">
        <div className="w-full px-3 sm:px-6 lg:px-10 2xl:px-16 py-4 sm:py-6">
          <motion.div
            className="w-full max-w-[1700px] mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            {/* Header (Shop-style) */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 text-[12px] font-extrabold text-slate-600 hover:text-slate-900 transition"
                >
                  <RiArrowLeftSLine className="text-[16px]" />
                  Back
                </button>

                <div className="mt-3 flex items-center gap-2">
                  <BsViewList className="text-orange-500 text-[18px] sm:text-[20px]" />
                  <h1 className="text-[20px] sm:text-[24px] 2xl:text-[26px] font-extrabold tracking-tight text-slate-900">
                    My Wishlist
                  </h1>

                  <span className="hidden sm:inline text-[12px] font-semibold text-slate-500">
                    ({totalCount} items)
                  </span>
                </div>

                <div className="mt-1 text-[11px] sm:text-[12px] text-slate-500 font-medium">
                  {totalCount === 0 ? (
                    <span className="font-semibold text-slate-700">
                      Your wishlist is empty
                    </span>
                  ) : (
                    <>
                      Showing{" "}
                      <span className="font-semibold text-slate-700">
                        {pageStart}-{pageEnd}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-slate-700">
                        {totalCount}
                      </span>{" "}
                      items
                      <span className="hidden sm:inline">
                        {" "}
                        • On this page:{" "}
                        <span className="font-semibold text-slate-700">
                          {showingNow}
                        </span>{" "}
                        • Page{" "}
                        <span className="font-semibold text-slate-700">
                          {currentPage}
                        </span>
                        /
                        <span className="font-semibold text-slate-700">
                          {totalPages}
                        </span>
                      </span>
                    </>
                  )}
                </div>

                <p className="mt-1 text-[12px] font-semibold text-slate-500">
                  Save items, move to cart, or buy instantly.
                </p>
              </div>

              {/* Right side: View toggle + continue shopping */}
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end w-full lg:w-auto">
                <button
                  type="button"
                  onClick={() => navigate("/shop")}
                  className="hidden sm:inline-flex btnGhost w-full sm:w-auto justify-center"
                >
                  Continue shopping
                </button>

                <div className="inline-flex items-center gap-2 w-full lg:w-auto">
                  <span className="hidden sm:inline-flex items-center gap-2 text-[12px] font-semibold text-slate-600">
                    <FiSliders />
                    View
                  </span>

                  <div className="inline-flex w-full lg:w-auto items-center gap-1 rounded-2xl bg-slate-50 px-1.5 py-1.5 border border-slate-200">
                    {viewButtons.map(({ id, Icon, label }) => {
                      const active = viewMode === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => onChangeView(id)}
                          className={[
                            "inline-flex flex-1 lg:flex-none items-center justify-center gap-2 rounded-xl",
                            "px-3 py-2 text-[11px] sm:text-[12px] font-bold transition",
                            active
                              ? "bg-white text-slate-900"
                              : "text-slate-600 hover:text-slate-900",
                          ].join(" ")}
                          title={label}
                        >
                          <Icon
                            className={
                              active ? "text-orange-600" : "text-slate-500"
                            }
                          />
                          <span className="sm:hidden">{label}</span>
                          <span className="hidden sm:inline">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Empty state (Shop-like spacing) */}
            {totalCount === 0 ? (
              <motion.div
                className="text-center text-slate-500 mt-12 sm:mt-16"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="inline-flex items-center gap-2 text-[12px] font-semibold">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  Your wishlist is empty.
                </div>

                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    className="btnOrange"
                    onClick={() => navigate("/shop")}
                  >
                    Browse products
                  </button>
                  <button
                    type="button"
                    className="btnGhost sm:hidden"
                    onClick={() => navigate("/shop")}
                  >
                    Continue shopping
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Products (3 views) */}
                <div className="mt-6">
                  <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.16 }}
                  >
                    {viewMode === "grid" && (
                      <WishlistGridUI
                        items={currentProducts}
                        onOpen={(id) => navigate(`/single-product/${id}`)}
                        onMoveToCart={async (id) => {
                          await moveToCartFromWishlist(id);
                          fetchServerCart();
                        }}
                        onBuyNow={handleCheckoutNow}
                        onToggleSaveForLater={toggleSaveForLater}
                        onRemove={removeFromWishlist}
                      />
                    )}

                    {viewMode === "card" && (
                      <WishlistCardUI
                        items={currentProducts}
                        onOpen={(id) => navigate(`/single-product/${id}`)}
                        onMoveToCart={async (id) => {
                          await moveToCartFromWishlist(id);
                          fetchServerCart();
                        }}
                        onBuyNow={handleCheckoutNow}
                        onToggleSaveForLater={toggleSaveForLater}
                        onRemove={removeFromWishlist}
                      />
                    )}

                    {viewMode === "list" && (
                      <WishlistListUI
                        items={currentProducts}
                        onOpen={(id) => navigate(`/single-product/${id}`)}
                        onMoveToCart={async (id) => {
                          await moveToCartFromWishlist(id);
                          fetchServerCart();
                        }}
                        onBuyNow={handleCheckoutNow}
                        onToggleSaveForLater={toggleSaveForLater}
                        onRemove={removeFromWishlist}
                      />
                    )}
                  </motion.div>

                  {/* Pagination (same rule as Shop) */}
                  {totalCount > productsPerPage && (
                    <div className="mt-8 paginationWrap">
                      <Pagination
                        productsPerPage={productsPerPage}
                        totalProducts={totalCount}
                        currentPage={currentPage}
                        paginate={paginate}
                      />
                    </div>
                  )}

                  {/* Mobile continue shopping button (kept) */}
                  <div className="mt-10 sm:hidden flex justify-center">
                    <button
                      type="button"
                      onClick={() => navigate("/shop")}
                      className="btnGhost"
                    >
                      Continue shopping
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

// ===============================================================
// ✅ PAGINATION (ONLY 3 NUMBER BUTTONS + LEFT/RIGHT INDICATORS)
// ===============================================================
function Pagination({ productsPerPage, totalProducts, currentPage, paginate }) {
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  if (totalPages <= 1) return null;

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  let center = clamp(currentPage, 1, totalPages);
  let start = center - 1;
  let end = center + 1;

  if (start < 1) {
    start = 1;
    end = Math.min(3, totalPages);
  }
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, totalPages - 2);
  }

  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="flex justify-center mt-6">
      <nav className="inline-flex items-center gap-2 justify-center">
        <button
          type="button"
          onClick={() => canPrev && paginate(currentPage - 1)}
          disabled={!canPrev}
          className={[
            "h-10 w-10 rounded-full inline-flex items-center justify-center",
            "bg-white text-slate-700 hover:bg-slate-100 transition",
            "disabled:opacity-40 disabled:cursor-not-allowed",
          ].join(" ")}
          style={{ border: "1px solid rgb(226,232,240)" }}
          aria-label="Previous page"
          title="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {start > 1 && (
          <button
            type="button"
            onClick={() => paginate(1)}
            className="px-3 h-10 rounded-full text-[12px] font-extrabold bg-white text-slate-700 hover:bg-slate-100 transition"
            style={{ border: "1px solid rgb(226,232,240)" }}
            title="Go to first page"
          >
            1…
          </button>
        )}

        {pages.map((number) => {
          const active = currentPage === number;
          return (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={
                active
                  ? "activePage px-4 h-10 text-[12px] font-extrabold"
                  : "px-4 h-10 rounded-full text-[12px] font-extrabold bg-white text-slate-700 hover:bg-slate-100"
              }
              style={
                !active ? { border: "1px solid rgb(226,232,240)" } : undefined
              }
              aria-label={`Page ${number}`}
            >
              {number}
            </button>
          );
        })}

        {end < totalPages && (
          <button
            type="button"
            onClick={() => paginate(totalPages)}
            className="px-3 h-10 rounded-full text-[12px] font-extrabold bg-white text-slate-700 hover:bg-slate-100 transition"
            style={{ border: "1px solid rgb(226,232,240)" }}
            title="Go to last page"
          >
            …{totalPages}
          </button>
        )}

        <button
          type="button"
          onClick={() => canNext && paginate(currentPage + 1)}
          disabled={!canNext}
          className={[
            "h-10 w-10 rounded-full inline-flex items-center justify-center",
            "bg-white text-slate-700 hover:bg-slate-100 transition",
            "disabled:opacity-40 disabled:cursor-not-allowed",
          ].join(" ")}
          style={{ border: "1px solid rgb(226,232,240)" }}
          aria-label="Next page"
          title="Next"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
}

// ===============================================================
// ✅ 3 VIEWS (Grid / Card / List) - Shop-like spacing
// ===============================================================
function WishlistGridUI({
  items,
  onOpen,
  onMoveToCart,
  onBuyNow,
  onToggleSaveForLater,
  onRemove,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-10 lg:gap-y-12">
      {items.map((item, idx) => {
        const id = item?._id ?? `${idx}`;

        const selling = money(
          item?.selling_price ?? item?.price ?? item?.final_price
        );
        const mrp = money(
          item?.display_price ?? item?.actual_price ?? item?.mrp_price
        );

        const stock = item?.availability_status !== false;
        const rating = Number(item?.avg_rating ?? item?.rating ?? 4.3);
        const ratingText = Number.isFinite(rating) ? rating.toFixed(1) : "4.3";

        return (
          <motion.div
            key={id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.18 }}
            className="group relative rounded-2xl bg-white"
            style={{ boxShadow: "none", border: "1px solid rgb(241,245,249)" }}
          >
            <div
              className="p-3 cursor-pointer"
              onClick={() => onOpen(item._id)}
              title="Open product"
            >
              <div className="rounded-2xl overflow-hidden bg-slate-50">
                <img
                  src={resolveImage(item)}
                  alt={item?.product_name || "Wishlist item"}
                  loading="lazy"
                  className="w-full aspect-square object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/600x600";
                  }}
                />
              </div>

              <div className="mt-3 space-y-1.5">
                <h2 className="text-[13px] font-extrabold text-slate-900 truncate">
                  {item?.product_name || "Unnamed product"}
                </h2>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="priceSelling text-[14px] inline-flex items-center gap-1">
                    <FaRupeeSign /> {selling ?? "--"}
                  </span>
                  {mrp && mrp !== selling && (
                    <span className="priceMrp text-[12px] inline-flex items-center gap-1">
                      <FaRupeeSign /> {mrp}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <FaStar className="text-orange-500/90" />
                    {ratingText}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <FiTruck className="text-slate-500" />
                      Delivery
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FiRefreshCw className="text-slate-500" />
                      Return
                    </span>
                  </span>
                </div>

                {item?.savedForLater && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-amber-700">
                    <FaBookmark className="text-amber-600" />
                    Saved for later
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="px-3 pb-4">
              <div className="grid grid-cols-1 gap-2 mt-2">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    await onMoveToCart(item._id);
                  }}
                  className="btnOrange w-full inline-flex items-center justify-center gap-2 laptopCartBtn"
                  type="button"
                  disabled={!stock}
                  style={
                    !stock ? { opacity: 0.6, cursor: "not-allowed" } : undefined
                  }
                >
                  <FaCartPlus /> Move to Cart
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBuyNow(item);
                  }}
                  className="btnGhost w-full inline-flex items-center justify-center gap-2 laptopCartBtn"
                  type="button"
                >
                  <FaCheck /> Buy Now
                </button>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSaveForLater(item._id);
                    }}
                    className="btnGhost w-full inline-flex items-center justify-center gap-2 laptopCartBtn"
                    type="button"
                  >
                    <FaBookmark />
                    {item?.savedForLater ? "Unsave" : "Save"}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item._id);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[12px] font-extrabold bg-rose-50 text-rose-700 hover:bg-rose-100 transition laptopCartBtn"
                    type="button"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function WishlistCardUI({
  items,
  onOpen,
  onMoveToCart,
  onBuyNow,
  onToggleSaveForLater,
  onRemove,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 sm:gap-x-8 gap-y-10 sm:gap-y-12">
      {items.map((item) => {
        const selling = money(
          item?.selling_price ?? item?.price ?? item?.final_price
        );
        const mrp = money(
          item?.display_price ?? item?.actual_price ?? item?.mrp_price
        );

        const stock = item?.availability_status !== false;
        const rating = Number(item?.avg_rating ?? item?.rating ?? 4.4);
        const ratingText = Number.isFinite(rating) ? rating.toFixed(1) : "4.4";

        return (
          <motion.div
            key={item._id}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="relative group rounded-2xl bg-white overflow-hidden"
            style={{
              boxShadow: "none",
              border: "1px solid rgba(241,245,249,1)",
            }}
          >
            <div
              className="w-full h-52 sm:h-56 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => onOpen(item._id)}
              title="Open product"
            >
              <img
                src={resolveImage(item)}
                alt={item?.product_name || "Wishlist item"}
                loading="lazy"
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/600x600";
                }}
              />
            </div>

            <div className="p-4 space-y-2">
              <div onClick={() => onOpen(item._id)} className="cursor-pointer">
                <h3 className="text-[14px] sm:text-[15px] font-extrabold text-slate-900 truncate">
                  {item?.product_name || "Unnamed product"}
                </h3>

                <p className="text-[12px] text-slate-500 font-semibold truncate">
                  {safeUpper(item?.brand) ||
                    safeUpper(item?.category_name) ||
                    "POPULAR"}{" "}
                  • FAST DELIVERY • EASY RETURNS
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="priceSelling text-[15px] inline-flex items-center gap-1">
                      <FaRupeeSign /> {selling ?? "--"}
                    </span>
                    {mrp && mrp !== selling && (
                      <span className="priceMrp text-[12px] inline-flex items-center gap-1">
                        <FaRupeeSign /> {mrp}
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-slate-600">
                    <FaStar className="text-orange-500/90" />
                    {ratingText}
                  </span>
                </div>

                {item?.savedForLater && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-amber-700">
                    <FaBookmark className="text-amber-600" />
                    Saved for later
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2 pt-2">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    await onMoveToCart(item._id);
                  }}
                  className="btnOrange w-full inline-flex items-center justify-center gap-2 laptopCartBtn"
                  type="button"
                  disabled={!stock}
                  style={
                    !stock ? { opacity: 0.6, cursor: "not-allowed" } : undefined
                  }
                >
                  <FaCartPlus /> Move to Cart
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBuyNow(item);
                  }}
                  className="btnGhost w-full inline-flex items-center justify-center gap-2 laptopCartBtn"
                  type="button"
                >
                  <FaCheck /> Buy Now
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSaveForLater(item._id);
                    }}
                    className="btnGhost w-full inline-flex items-center justify-center gap-2 laptopCartBtn"
                    type="button"
                  >
                    <FaBookmark />
                    {item?.savedForLater ? "Unsave" : "Save"}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item._id);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[12px] font-extrabold bg-rose-50 text-rose-700 hover:bg-rose-100 transition laptopCartBtn"
                    type="button"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function WishlistListUI({
  items,
  onOpen,
  onMoveToCart,
  onBuyNow,
  onToggleSaveForLater,
  onRemove,
}) {
  return (
    <div className="space-y-10 sm:space-y-12">
      {items.map((item) => {
        const selling = money(
          item?.selling_price ?? item?.price ?? item?.final_price
        );
        const mrp = money(
          item?.display_price ?? item?.actual_price ?? item?.mrp_price
        );

        const stock = item?.availability_status !== false;
        const rating = Number(item?.avg_rating ?? item?.rating ?? 4.2);
        const ratingText = Number.isFinite(rating) ? rating.toFixed(1) : "4.2";

        return (
          <motion.div
            key={item._id}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.16 }}
            className="flex flex-col md:flex-row items-stretch md:items-center bg-white rounded-2xl transition group relative"
            style={{ boxShadow: "none", border: "1px solid rgb(241,245,249)" }}
          >
            <div
              onClick={() => onOpen(item._id)}
              className="w-full md:w-44 h-52 md:h-44 bg-slate-50 rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer"
              title="Open product"
            >
              <img
                src={resolveImage(item)}
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
              className="flex flex-col justify-center md:ml-6 mt-4 md:mt-0 w-full cursor-pointer px-3 md:px-0 pb-3 md:pb-0"
              title="Open product"
            >
              <h2 className="text-[16px] sm:text-[18px] font-extrabold text-slate-900 truncate">
                {item?.product_name || "Unnamed product"}
              </h2>

              <p className="text-slate-500 text-[12px] mt-1 line-clamp-2">
                {(item?.description || "").slice(0, 120)}
                {(item?.description || "").length > 120 ? "..." : ""}
              </p>

              <p className="mt-2 text-[11px] font-semibold text-slate-500">
                {safeUpper(item?.brand) ||
                  safeUpper(item?.category_name) ||
                  "BRANDED"}{" "}
                • FAST DELIVERY • EASY RETURNS
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <span className="priceSelling text-[15px] font-extrabold flex items-center gap-1">
                    <FaRupeeSign /> {selling ?? "--"}
                  </span>
                  {mrp && mrp !== selling && (
                    <span className="priceMrp text-[12px] font-extrabold flex items-center gap-1">
                      <FaRupeeSign /> {mrp}
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-slate-600">
                  <FaStar className="text-orange-500/90" />
                  {ratingText}
                </span>
              </div>

              {item?.savedForLater && (
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-amber-700 w-fit">
                  <FaBookmark className="text-amber-600" />
                  Saved for later
                </div>
              )}
            </div>

            <div className="flex-shrink-0 md:ml-6 px-3 pb-4 md:pb-0">
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    await onMoveToCart(item._id);
                  }}
                  disabled={!stock}
                  className={[
                    "btnOrange w-full md:w-auto inline-flex items-center justify-center gap-2 laptopCartBtn",
                    !stock ? "opacity-60 cursor-not-allowed" : "",
                  ].join(" ")}
                  type="button"
                >
                  <FaCartPlus />
                  Move to Cart
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBuyNow(item);
                  }}
                  className="btnGhost w-full md:w-auto inline-flex items-center justify-center gap-2 laptopCartBtn"
                  type="button"
                >
                  <FaCheck /> Buy Now
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSaveForLater(item._id);
                    }}
                    className="btnGhost w-full inline-flex items-center justify-center gap-2 laptopCartBtn"
                    type="button"
                  >
                    <FaBookmark />
                    {item?.savedForLater ? "Unsave" : "Save"}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item._id);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[12px] font-extrabold bg-rose-50 text-rose-700 hover:bg-rose-100 transition laptopCartBtn"
                    type="button"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
