// import React, { useContext, useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { BsViewList } from "react-icons/bs";
// import { RiArrowLeftSLine } from "react-icons/ri";
// import { FiShoppingCart, FiTrash2, FiHeart, FiEye } from "react-icons/fi";
// import { AuthContext } from "../../components/auth_components/AuthManager";
// import { CartContext } from "../../components/cart_components/CartContext";
// import globalBackendRoute from "../../config/Config";

// import useWishlistAnalytics from "../../hooks/wishlist/useWishlistAnalytics";
// import useWishlistData from "../../hooks/wishlist/useWishlistData";
// import useWishlistFilters from "../../hooks/wishlist/useWishlistFilters";
// import useWishlistSelection from "../../hooks/wishlist/useWishlistSelection";

// import WishlistToolbar from "../../components/wishlist_components/WishlistToolbar";
// import WishlistPagination from "../../components/wishlist_components/WishlistPagination";
// import WishlistSkeleton from "../../components/wishlist_components/WishlistSkeleton";
// import WishlistEmptyState from "../../components/wishlist_components/WishlistEmptyState";
// import WishlistSaveForLater from "../../components/wishlist_components/WishlistSaveForLater";

// const cardMotion = {
//   initial: { opacity: 0, y: 10, scale: 0.985 },
//   animate: { opacity: 1, y: 0, scale: 1 },
//   whileHover: { y: -3, scale: 1.01 },
//   transition: { duration: 0.22, ease: "easeOut" },
// };

// const Wishlist = () => {
//   const navigate = useNavigate();
//   const { isLoggedIn } = useContext(AuthContext);
//   const { addToCart, fetchServerCart } = useContext(CartContext);

//   const analytics = useWishlistAnalytics();

//   const {
//     wishlistItems,
//     isLoading,
//     isFetching,
//     isError,
//     refetchWishlist,
//     removeItem,
//     toggleSaveForLater,
//     moveSingleToCart,
//     bulkMoveToCart,
//     bulkCheckout,
//     bulkSaveForLater,
//     saveAllForLater,
//     bulkRemove,
//     clearWishlist,
//     isMutating,
//   } = useWishlistData({
//     enabled: isLoggedIn,
//     onCartRefresh: fetchServerCart,
//     analytics,
//   });

//   const activeWishlistItems = useMemo(
//     () => wishlistItems.filter((item) => !item.savedForLater),
//     [wishlistItems],
//   );

//   const savedForLaterItems = useMemo(
//     () => wishlistItems.filter((item) => item.savedForLater),
//     [wishlistItems],
//   );

//   const {
//     searchTerm,
//     setSearchTerm,
//     sortBy,
//     setSortBy,
//     filterBy,
//     setFilterBy,
//     density,
//     setDensity,
//     filteredSortedItems,
//   } = useWishlistFilters(activeWishlistItems);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [columns, setColumns] = useState(3);

//   useEffect(() => {
//     const computeCols = () => {
//       const w = window.innerWidth;
//       if (w >= 1536) return 3;
//       if (w >= 1280) return 3;
//       if (w >= 1024) return 2;
//       if (w >= 640) return 2;
//       return 1;
//     };

//     const update = () => setColumns(computeCols());
//     update();

//     window.addEventListener("resize", update);
//     return () => window.removeEventListener("resize", update);
//   }, []);

//   const rowsPerPage = density === "tight" ? 2 : density === "compact" ? 2 : 2;
//   const productsPerPage = Math.max(1, columns) * Math.max(1, rowsPerPage);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [productsPerPage, columns, searchTerm, sortBy, filterBy, density]);

//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

//   const currentProducts = useMemo(
//     () => filteredSortedItems.slice(indexOfFirstProduct, indexOfLastProduct),
//     [filteredSortedItems, indexOfFirstProduct, indexOfLastProduct],
//   );

//   const {
//     selectedIds,
//     selectedSet,
//     selectedCount,
//     toggleSelectOne,
//     selectAllVisible,
//     deselectAllVisible,
//     replaceSelection,
//     clearSelection,
//     removeFromSelection,
//   } = useWishlistSelection(currentProducts);

//   const filteredIds = useMemo(
//     () => filteredSortedItems.map((item) => String(item._id)),
//     [filteredSortedItems],
//   );

//   const totalCount = filteredSortedItems.length;
//   const totalWishlistCount = activeWishlistItems.length;
//   const totalSavedForLaterCount = savedForLaterItems.length;
//   const overallWishlistCount = wishlistItems.length;

//   const pageStart = totalCount === 0 ? 0 : indexOfFirstProduct + 1;
//   const pageEnd = Math.min(indexOfLastProduct, totalCount);
//   const totalPages = Math.max(1, Math.ceil(totalCount / productsPerPage));

//   const handleCheckoutNow = (item) => {
//     addToCart(item);
//     analytics.track("wishlist_buy_now_single", { productId: item?._id });
//     navigate("/checkout");
//   };

//   const handleOpenProduct = (id) => {
//     analytics.track("wishlist_open_product", { productId: id });
//     navigate(`/single-product/${id}`);
//   };

//   const handleSelectFiltered = () => {
//     replaceSelection(filteredIds);
//   };

//   const resetFilters = () => {
//     setSearchTerm("");
//     setSortBy("latest");
//     setFilterBy("all");
//   };

//   const handleSingleMoveToCart = (id) =>
//     moveSingleToCart(id).then(() => removeFromSelection(id));

//   const handleSingleRemove = (id) =>
//     removeItem(id).then(() => removeFromSelection(id));

//   const handleBulkMoveToCart = () =>
//     bulkMoveToCart(selectedIds).then(() => clearSelection());

//   const handleBulkCheckout = () =>
//     bulkCheckout(selectedIds).then(() => {
//       clearSelection();
//       navigate("/checkout");
//     });

//   const handleBulkSaveForLater = () =>
//     bulkSaveForLater({
//       productIds: selectedIds,
//       savedForLater: true,
//     }).then(() => clearSelection());

//   const handleBulkRemove = () =>
//     bulkRemove(selectedIds).then(() => clearSelection());

//   const getImageUrl = (img) => {
//     if (!img) return "";
//     if (String(img).startsWith("http")) return img;
//     return `${globalBackendRoute}/${img}`;
//   };

//   if (!isLoggedIn) {
//     return (
//       <div className="min-h-[60vh] w-full bg-slate-50 px-3 py-10 sm:px-5">
//         <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
//           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
//             <FiHeart className="text-[22px]" />
//           </div>

//           <h2 className="mt-4 text-[20px] font-extrabold tracking-tight text-slate-900">
//             Please sign in to view your wishlist
//           </h2>

//           <p className="mt-2 text-[13px] font-medium text-slate-500">
//             Your wishlist is saved to your account.
//           </p>

//           <button
//             type="button"
//             onClick={() => navigate("/login")}
//             className="mt-5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-2.5 text-[12px] font-extrabold text-white shadow-sm transition hover:scale-[1.01]"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen"
//       aria-busy={isLoading || isFetching || isMutating}
//     >
//       <div className="mx-auto w-full max-w-[1560px] px-3 py-4 sm:px-4 lg:px-6 xl:px-8">
//         <motion.div
//           initial={{ opacity: 0, y: 8 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.22 }}
//         >
//           <div className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur">
//             <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#fff7ed_45%,#fff1f2_100%)] px-4 py-2 sm:px-3 sm:py-4 lg:px-6">
//               <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
//                 <div className="min-w-0">
//                   <button
//                     type="button"
//                     onClick={() => navigate(-1)}
//                     className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-slate-600 transition hover:text-slate-900"
//                   >
//                     <RiArrowLeftSLine className="text-[15px]" />
//                     Back
//                   </button>

//                   <div className="mt-3 flex flex-wrap items-center gap-3">
//                     <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-100 bg-white shadow-sm">
//                       <BsViewList className="text-[18px] text-orange-500" />
//                     </div>

//                     <div>
//                       <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900 sm:text-[26px] xl:text-[30px]">
//                         My Wishlist
//                       </h1>
//                     </div>

//                     <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold text-slate-700 shadow-sm">
//                       {overallWishlistCount} total
//                     </span>
//                   </div>

//                   <div className="mt-4 flex flex-wrap gap-2.5">
//                     <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm">
//                       Active{" "}
//                       <span className="font-extrabold text-slate-900">
//                         {totalWishlistCount}
//                       </span>
//                     </div>

//                     <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm">
//                       Saved for later{" "}
//                       <span className="font-extrabold text-slate-900">
//                         {totalSavedForLaterCount}
//                       </span>
//                     </div>

//                     {totalCount > 0 && (
//                       <>
//                         <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm">
//                           Showing{" "}
//                           <span className="font-extrabold text-slate-900">
//                             {pageStart}-{pageEnd}
//                           </span>{" "}
//                           of{" "}
//                           <span className="font-extrabold text-slate-900">
//                             {totalCount}
//                           </span>
//                         </div>

//                         <div className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm sm:block">
//                           Page{" "}
//                           <span className="font-extrabold text-slate-900">
//                             {currentPage}
//                           </span>
//                           /
//                           <span className="font-extrabold text-slate-900">
//                             {totalPages}
//                           </span>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap items-center gap-2">
//                   <button
//                     type="button"
//                     onClick={() => navigate("/shop")}
//                     className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50"
//                   >
//                     Continue shopping
//                   </button>
//                 </div>
//               </div>

//               <div className="rounded-[24px]  bg-white p-3 shadow-sm sm:p-4">
//                 <WishlistToolbar
//                   searchTerm={searchTerm}
//                   setSearchTerm={setSearchTerm}
//                   sortBy={sortBy}
//                   setSortBy={setSortBy}
//                   filterBy={filterBy}
//                   setFilterBy={setFilterBy}
//                   density={density}
//                   setDensity={setDensity}
//                   bulkLoading={isMutating}
//                   hasItems={filteredSortedItems.length > 0}
//                   onSaveAll={() => saveAllForLater(true)}
//                   onClearAll={() => clearWishlist()}
//                   onSelectPage={selectAllVisible}
//                   onDeselectPage={deselectAllVisible}
//                   onSelectFiltered={handleSelectFiltered}
//                   onClearSelection={clearSelection}
//                   showSelectionTools={selectedCount > 0}
//                 />

//                 {selectedCount > 0 && (
//                   <div className="mt-3 flex justify-start">
//                     <div className="flex w-full flex-wrap items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50/80 px-3 py-2.5 shadow-sm">
//                       <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-slate-800">
//                         {selectedCount} selected
//                       </span>

//                       <button
//                         type="button"
//                         disabled={isMutating}
//                         onClick={handleBulkMoveToCart}
//                         className="inline-flex items-center justify-center gap-1.5 rounded-full bg-orange-500 px-3.5 py-2 text-[11px] font-extrabold text-white transition hover:bg-orange-600 disabled:opacity-60"
//                       >
//                         <FiShoppingCart className="text-[13px]" />
//                         Move to cart
//                       </button>

//                       <button
//                         type="button"
//                         disabled={isMutating}
//                         onClick={handleBulkCheckout}
//                         className="rounded-full bg-slate-900 px-3.5 py-2 text-[11px] font-extrabold text-white transition hover:bg-slate-800 disabled:opacity-60"
//                       >
//                         Buy now
//                       </button>

//                       <button
//                         type="button"
//                         disabled={isMutating}
//                         onClick={handleBulkSaveForLater}
//                         className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[11px] font-extrabold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
//                       >
//                         <FiHeart className="text-[13px]" />
//                         Save for later
//                       </button>

//                       <button
//                         type="button"
//                         disabled={isMutating}
//                         onClick={handleBulkRemove}
//                         className="inline-flex items-center justify-center gap-1.5 rounded-full border border-rose-200 bg-white px-3.5 py-2 text-[11px] font-extrabold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
//                       >
//                         <FiTrash2 className="text-[13px]" />
//                         Remove
//                       </button>

//                       <button
//                         type="button"
//                         onClick={clearSelection}
//                         className="ml-auto rounded-full px-2 py-2 text-[11px] font-bold text-slate-500 transition hover:text-slate-700"
//                       >
//                         Clear
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
//               {isLoading ? (
//                 <WishlistSkeleton count={8} />
//               ) : isError ? (
//                 <div className="rounded-[24px] border border-rose-100 bg-rose-50 p-6 text-center">
//                   <p className="text-[13px] font-extrabold text-rose-700">
//                     Could not load wishlist.
//                   </p>
//                   <button
//                     type="button"
//                     onClick={() => refetchWishlist()}
//                     className="mt-3 rounded-full border border-rose-200 bg-white px-4 py-2.5 text-[11px] font-extrabold text-rose-700"
//                   >
//                     Retry
//                   </button>
//                 </div>
//               ) : totalCount === 0 ? (
//                 <>
//                   <WishlistEmptyState
//                     isFiltered={activeWishlistItems.length > 0}
//                     onBrowse={() => navigate("/shop")}
//                     onClearFilters={resetFilters}
//                   />

//                   <WishlistSaveForLater
//                     items={savedForLaterItems}
//                     backendRoute={globalBackendRoute}
//                     loading={isMutating}
//                     onMoveToWishlist={(id) => toggleSaveForLater(id)}
//                     onRemove={(id) => removeItem(id)}
//                   />
//                 </>
//               ) : (
//                 <>
//                   <div className="rounded-[28px]   p-3 shadow-[0_12px_35px_rgba(15,23,42,0.05)] sm:p-4 lg:p-5">
//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
//                       {currentProducts.map((item, index) => {
//                         const isSelected = selectedSet.has(String(item._id));

//                         return (
//                           <motion.div
//                             key={item._id}
//                             initial={cardMotion.initial}
//                             animate={cardMotion.animate}
//                             whileHover={cardMotion.whileHover}
//                             transition={{
//                               ...cardMotion.transition,
//                               delay: index * 0.03,
//                             }}
//                             className="group overflow-hidden rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-sm"
//                           >
//                             <div className="relative flex h-full flex-col sm:flex-row items-center justify-center">
//                               <motion.button
//                                 type="button"
//                                 whileTap={{ scale: 0.92 }}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   toggleSelectOne(String(item._id));
//                                 }}
//                                 className={`absolute left-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-extrabold shadow-sm transition ${
//                                   isSelected
//                                     ? "border-slate-900 bg-slate-900 text-white"
//                                     : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
//                                 }`}
//                               >
//                                 {isSelected ? "✓" : ""}
//                               </motion.button>

//                               <div className="flex items-center justify-center min-w-[160px] h-[200px] p-3">
//                                 {item.product_image ? (
//                                   <motion.img
//                                     src={getImageUrl(item.product_image)}
//                                     alt={item.product_name}
//                                     className="h-full w-full object-contain"
//                                     whileHover={{ scale: 1.04 }}
//                                     transition={{ duration: 0.25 }}
//                                   />
//                                 ) : (
//                                   <div className="flex h-full w-full items-center justify-center text-[11px] font-bold text-slate-400">
//                                     No image
//                                   </div>
//                                 )}
//                               </div>

//                               <div className="flex min-h-[190px] flex-1 flex-col p-4">
//                                 <div className="flex-1">
//                                   <p className="line-clamp-2 text-[14px] font-extrabold leading-snug text-slate-900">
//                                     {item.product_name}
//                                   </p>

//                                   <div className="mt-2 flex flex-wrap items-center gap-2">
//                                     {item.brand && (
//                                       <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
//                                         {item.brand}
//                                       </span>
//                                     )}

//                                     {item.category_name && (
//                                       <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold text-orange-700">
//                                         {item.category_name}
//                                       </span>
//                                     )}
//                                   </div>

//                                   <div className="mt-3 flex items-end gap-2">
//                                     <span className="text-[18px] font-extrabold text-slate-900">
//                                       ₹{item.selling_price}
//                                     </span>

//                                     {item.display_price &&
//                                       String(item.display_price) !==
//                                         String(item.selling_price) && (
//                                         <span className="text-[12px] font-semibold text-slate-400 line-through">
//                                           ₹{item.display_price}
//                                         </span>
//                                       )}
//                                   </div>

//                                   {item.description && (
//                                     <p className="mt-3 line-clamp-2 text-[11.5px] font-medium leading-relaxed text-slate-500">
//                                       {item.description}
//                                     </p>
//                                   )}
//                                 </div>

//                                 <div className="mt-4 flex flex-wrap gap-2">
//                                   <motion.button
//                                     type="button"
//                                     whileTap={{ scale: 0.96 }}
//                                     onClick={() =>
//                                       handleSingleMoveToCart(item._id)
//                                     }
//                                     className="inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-2 text-[11px] font-extrabold text-white transition hover:bg-slate-800"
//                                   >
//                                     <FiShoppingCart className="text-[13px]" />
//                                     Move to cart
//                                   </motion.button>

//                                   <motion.button
//                                     type="button"
//                                     whileTap={{ scale: 0.96 }}
//                                     onClick={() => handleCheckoutNow(item)}
//                                     className="inline-flex items-center justify-center gap-1.5 rounded-full bg-orange-500 px-3.5 py-2 text-[11px] font-extrabold text-white transition hover:bg-orange-600"
//                                   >
//                                     <FiEye className="text-[13px]" />
//                                     Buy now
//                                   </motion.button>

//                                   <motion.button
//                                     type="button"
//                                     whileTap={{ scale: 0.96 }}
//                                     onClick={() => toggleSaveForLater(item._id)}
//                                     className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[11px] font-extrabold text-slate-700 transition hover:bg-slate-50"
//                                   >
//                                     <FiHeart className="text-[13px]" />
//                                     Save
//                                   </motion.button>

//                                   <motion.button
//                                     type="button"
//                                     whileTap={{ scale: 0.96 }}
//                                     onClick={() => handleSingleRemove(item._id)}
//                                     className="inline-flex items-center justify-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-2 text-[11px] font-extrabold text-rose-700 transition hover:bg-rose-100"
//                                   >
//                                     <FiTrash2 className="text-[13px]" />
//                                     Remove
//                                   </motion.button>
//                                 </div>

//                                 <div className="mt-3 flex items-center justify-between gap-3">
//                                   <button
//                                     type="button"
//                                     onClick={() => handleOpenProduct(item._id)}
//                                     className="text-[10px] font-bold text-slate-500 transition hover:text-slate-800"
//                                   >
//                                     View product
//                                   </button>

//                                   <span className="text-[9px] font-semibold text-slate-400">
//                                     ID: {String(item._id).slice(-6)}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                           </motion.div>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   {totalCount > productsPerPage && (
//                     <div className="mt-5">
//                       <WishlistPagination
//                         productsPerPage={productsPerPage}
//                         totalProducts={totalCount}
//                         currentPage={currentPage}
//                         paginate={setCurrentPage}
//                       />
//                     </div>
//                   )}

//                   <WishlistSaveForLater
//                     items={savedForLaterItems}
//                     backendRoute={globalBackendRoute}
//                     loading={isMutating}
//                     onMoveToWishlist={(id) => toggleSaveForLater(id)}
//                     onRemove={(id) => removeItem(id)}
//                   />

//                   <div className="mt-6 flex justify-center sm:hidden">
//                     <button
//                       type="button"
//                       onClick={() => navigate("/shop")}
//                       className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50"
//                     >
//                       Continue shopping
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Wishlist;

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BsViewList } from "react-icons/bs";
import { RiArrowLeftSLine } from "react-icons/ri";
import { FiShoppingCart, FiTrash2, FiHeart, FiEye } from "react-icons/fi";
import { AuthContext } from "../../components/auth_components/AuthManager";
import { CartContext } from "../../components/cart_components/CartContext";
import globalBackendRoute from "../../config/Config";

import useWishlistAnalytics from "../../hooks/wishlist/useWishlistAnalytics";
import useWishlistData from "../../hooks/wishlist/useWishlistData";
import useWishlistFilters from "../../hooks/wishlist/useWishlistFilters";
import useWishlistSelection from "../../hooks/wishlist/useWishlistSelection";

import WishlistToolbar from "../../components/wishlist_components/WishlistToolbar";
import WishlistPagination from "../../components/wishlist_components/WishlistPagination";
import WishlistSkeleton from "../../components/wishlist_components/WishlistSkeleton";
import WishlistEmptyState from "../../components/wishlist_components/WishlistEmptyState";
import WishlistSaveForLater from "../../components/wishlist_components/WishlistSaveForLater";

const cardMotion = {
  initial: { opacity: 0, y: 10, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: { y: -3, scale: 1.01 },
  transition: { duration: 0.22, ease: "easeOut" },
};

const Wishlist = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const { addToCart, fetchServerCart } = useContext(CartContext);

  const analytics = useWishlistAnalytics();

  const {
    wishlistItems,
    isLoading,
    isFetching,
    isError,
    refetchWishlist,
    removeItem,
    toggleSaveForLater,
    moveSingleToCart,
    bulkMoveToCart,
    bulkCheckout,
    bulkSaveForLater,
    saveAllForLater,
    bulkRemove,
    clearWishlist,
    isMutating,
  } = useWishlistData({
    enabled: isLoggedIn,
    onCartRefresh: fetchServerCart,
    analytics,
  });

  const activeWishlistItems = useMemo(
    () => wishlistItems.filter((item) => !item.savedForLater),
    [wishlistItems],
  );

  const savedForLaterItems = useMemo(
    () => wishlistItems.filter((item) => item.savedForLater),
    [wishlistItems],
  );

  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    density,
    setDensity,
    filteredSortedItems,
  } = useWishlistFilters(activeWishlistItems);

  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const computeCols = () => {
      const w = window.innerWidth;
      if (w >= 1536) return 3;
      if (w >= 1280) return 3;
      if (w >= 1024) return 2;
      if (w >= 640) return 2;
      return 1;
    };

    const update = () => setColumns(computeCols());
    update();

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const rowsPerPage = density === "tight" ? 2 : density === "compact" ? 2 : 2;
  const productsPerPage = Math.max(1, columns) * Math.max(1, rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [productsPerPage, columns, searchTerm, sortBy, filterBy, density]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = useMemo(
    () => filteredSortedItems.slice(indexOfFirstProduct, indexOfLastProduct),
    [filteredSortedItems, indexOfFirstProduct, indexOfLastProduct],
  );

  const {
    selectedIds,
    selectedSet,
    selectedCount,
    toggleSelectOne,
    selectAllVisible,
    deselectAllVisible,
    replaceSelection,
    clearSelection,
    removeFromSelection,
  } = useWishlistSelection(currentProducts);

  const filteredIds = useMemo(
    () => filteredSortedItems.map((item) => String(item._id)),
    [filteredSortedItems],
  );

  const totalCount = filteredSortedItems.length;
  const totalWishlistCount = activeWishlistItems.length;
  const totalSavedForLaterCount = savedForLaterItems.length;
  const overallWishlistCount = wishlistItems.length;

  const pageStart = totalCount === 0 ? 0 : indexOfFirstProduct + 1;
  const pageEnd = Math.min(indexOfLastProduct, totalCount);
  const totalPages = Math.max(1, Math.ceil(totalCount / productsPerPage));

  const handleCheckoutNow = (item) => {
    addToCart(item);
    analytics.track("wishlist_buy_now_single", { productId: item?._id });
    navigate("/checkout");
  };

  const handleOpenProduct = (id) => {
    analytics.track("wishlist_open_product", { productId: id });
    navigate(`/single-product/${id}`);
  };

  const handleSelectFiltered = () => {
    replaceSelection(filteredIds);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSortBy("latest");
    setFilterBy("all");
  };

  const handleSingleMoveToCart = (id) =>
    moveSingleToCart(id).then(() => removeFromSelection(id));

  const handleSingleRemove = (id) =>
    removeItem(id).then(() => removeFromSelection(id));

  const handleBulkMoveToCart = () =>
    bulkMoveToCart(selectedIds).then(() => clearSelection());

  const handleBulkCheckout = () =>
    bulkCheckout(selectedIds).then(() => {
      clearSelection();
      navigate("/checkout");
    });

  const handleBulkSaveForLater = () =>
    bulkSaveForLater({
      productIds: selectedIds,
      savedForLater: true,
    }).then(() => clearSelection());

  const handleBulkRemove = () =>
    bulkRemove(selectedIds).then(() => clearSelection());

  const getImageUrl = (img) => {
    if (!img) return "";
    if (String(img).startsWith("http")) return img;
    return `${globalBackendRoute}/${img}`;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] w-full bg-slate-50 px-3 py-8 sm:px-5 sm:py-10">
        <div className="mx-auto max-w-3xl rounded-[24px] border border-slate-200 bg-white p-5 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:rounded-[28px] sm:p-7">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
            <FiHeart className="text-[22px]" />
          </div>

          <h2 className="mt-4 text-[18px] font-extrabold tracking-tight text-slate-900 sm:text-[20px]">
            Please sign in to view your wishlist
          </h2>

          <p className="mt-2 text-[12px] font-medium text-slate-500 sm:text-[13px]">
            Your wishlist is saved to your account.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-2.5 text-[12px] font-extrabold text-white shadow-sm transition hover:scale-[1.01]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      aria-busy={isLoading || isFetching || isMutating}
    >
      <div className="mx-auto w-full max-w-[1560px] px-2 py-3 sm:px-4 sm:py-4 lg:px-6 xl:px-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:rounded-[26px] lg:rounded-[30px]">
            <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#fff7ed_45%,#fff1f2_100%)] px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
              <div className="flex flex-col gap-4 sm:gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-slate-600 transition hover:text-slate-900"
                  >
                    <RiArrowLeftSLine className="text-[15px]" />
                    Back
                  </button>

                  <div className="mt-3 flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-100 bg-white shadow-sm sm:h-11 sm:w-11">
                      <BsViewList className="text-[17px] text-orange-500 sm:text-[18px]" />
                    </div>

                    <div className="min-w-0">
                      <h1 className="text-[20px] font-extrabold tracking-tight text-slate-900 sm:text-[24px] xl:text-[30px]">
                        My Wishlist
                      </h1>
                    </div>

                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold text-slate-700 shadow-sm sm:text-[11px]">
                      {overallWishlistCount} total
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600 shadow-sm sm:text-[11px]">
                      Active{" "}
                      <span className="font-extrabold text-slate-900">
                        {totalWishlistCount}
                      </span>
                    </div>

                    <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600 shadow-sm sm:text-[11px]">
                      Saved for later{" "}
                      <span className="font-extrabold text-slate-900">
                        {totalSavedForLaterCount}
                      </span>
                    </div>

                    {totalCount > 0 && (
                      <>
                        <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600 shadow-sm sm:text-[11px]">
                          Showing{" "}
                          <span className="font-extrabold text-slate-900">
                            {pageStart}-{pageEnd}
                          </span>{" "}
                          of{" "}
                          <span className="font-extrabold text-slate-900">
                            {totalCount}
                          </span>
                        </div>

                        <div className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm sm:block">
                          Page{" "}
                          <span className="font-extrabold text-slate-900">
                            {currentPage}
                          </span>
                          /
                          <span className="font-extrabold text-slate-900">
                            {totalPages}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate("/shop")}
                    className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
                  >
                    Continue shopping
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-[20px] bg-white p-2.5 shadow-sm sm:rounded-[24px] sm:p-4">
                <WishlistToolbar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  filterBy={filterBy}
                  setFilterBy={setFilterBy}
                  density={density}
                  setDensity={setDensity}
                  bulkLoading={isMutating}
                  hasItems={filteredSortedItems.length > 0}
                  onSaveAll={() => saveAllForLater(true)}
                  onClearAll={() => clearWishlist()}
                  onSelectPage={selectAllVisible}
                  onDeselectPage={deselectAllVisible}
                  onSelectFiltered={handleSelectFiltered}
                  onClearSelection={clearSelection}
                  showSelectionTools={selectedCount > 0}
                />

                {selectedCount > 0 && (
                  <div className="mt-3 flex justify-start">
                    <div className="flex w-full flex-col gap-2 rounded-2xl border border-orange-100 bg-orange-50/80 px-3 py-3 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 sm:px-3 sm:py-2.5">
                      <span className="w-fit rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-slate-800">
                        {selectedCount} selected
                      </span>

                      <button
                        type="button"
                        disabled={isMutating}
                        onClick={handleBulkMoveToCart}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-orange-500 px-3.5 py-2 text-[11px] font-extrabold text-white transition hover:bg-orange-600 disabled:opacity-60 sm:w-auto"
                      >
                        <FiShoppingCart className="text-[13px]" />
                        Move to cart
                      </button>

                      <button
                        type="button"
                        disabled={isMutating}
                        onClick={handleBulkCheckout}
                        className="w-full rounded-full bg-slate-900 px-3.5 py-2 text-[11px] font-extrabold text-white transition hover:bg-slate-800 disabled:opacity-60 sm:w-auto"
                      >
                        Buy now
                      </button>

                      <button
                        type="button"
                        disabled={isMutating}
                        onClick={handleBulkSaveForLater}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[11px] font-extrabold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 sm:w-auto"
                      >
                        <FiHeart className="text-[13px]" />
                        Save for later
                      </button>

                      <button
                        type="button"
                        disabled={isMutating}
                        onClick={handleBulkRemove}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-rose-200 bg-white px-3.5 py-2 text-[11px] font-extrabold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 sm:w-auto"
                      >
                        <FiTrash2 className="text-[13px]" />
                        Remove
                      </button>

                      <button
                        type="button"
                        onClick={clearSelection}
                        className="rounded-full px-2 py-2 text-left text-[11px] font-bold text-slate-500 transition hover:text-slate-700 sm:ml-auto sm:text-center"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-2.5 py-3 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
              {isLoading ? (
                <WishlistSkeleton count={8} />
              ) : isError ? (
                <div className="rounded-[24px] border border-rose-100 bg-rose-50 p-6 text-center">
                  <p className="text-[13px] font-extrabold text-rose-700">
                    Could not load wishlist.
                  </p>
                  <button
                    type="button"
                    onClick={() => refetchWishlist()}
                    className="mt-3 rounded-full border border-rose-200 bg-white px-4 py-2.5 text-[11px] font-extrabold text-rose-700"
                  >
                    Retry
                  </button>
                </div>
              ) : totalCount === 0 ? (
                <>
                  <WishlistEmptyState
                    isFiltered={activeWishlistItems.length > 0}
                    onBrowse={() => navigate("/shop")}
                    onClearFilters={resetFilters}
                  />

                  <WishlistSaveForLater
                    items={savedForLaterItems}
                    backendRoute={globalBackendRoute}
                    loading={isMutating}
                    onMoveToWishlist={(id) => toggleSaveForLater(id)}
                    onRemove={(id) => removeItem(id)}
                  />
                </>
              ) : (
                <>
                  <div className="rounded-[22px] p-1.5 shadow-[0_12px_35px_rgba(15,23,42,0.05)] sm:rounded-[28px] sm:p-4 lg:p-5">
                    <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {currentProducts.map((item, index) => {
                        const isSelected = selectedSet.has(String(item._id));

                        return (
                          <motion.div
                            key={item._id}
                            initial={cardMotion.initial}
                            animate={cardMotion.animate}
                            whileHover={cardMotion.whileHover}
                            transition={{
                              ...cardMotion.transition,
                              delay: index * 0.03,
                            }}
                            className="group overflow-hidden rounded-[20px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-sm sm:rounded-[24px]"
                          >
                            <div className="relative flex h-full flex-col md:flex-col lg:flex-col xl:flex-row">
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.92 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSelectOne(String(item._id));
                                }}
                                className={`absolute left-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-extrabold shadow-sm transition ${
                                  isSelected
                                    ? "border-slate-900 bg-slate-900 text-white"
                                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                                }`}
                              >
                                {isSelected ? "✓" : ""}
                              </motion.button>

                              <div className="flex h-[180px] w-full items-center justify-center border-b border-slate-100 bg-white/60 p-4 sm:h-[210px] md:h-[220px] xl:min-w-[160px] xl:w-[190px] xl:border-b-0 xl:border-r xl:p-3">
                                {item.product_image ? (
                                  <motion.img
                                    src={getImageUrl(item.product_image)}
                                    alt={item.product_name}
                                    className="h-full w-full object-contain"
                                    whileHover={{ scale: 1.04 }}
                                    transition={{ duration: 0.25 }}
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[11px] font-bold text-slate-400">
                                    No image
                                  </div>
                                )}
                              </div>

                              <div className="flex min-h-[190px] flex-1 flex-col p-3.5 sm:p-4">
                                <div className="flex-1">
                                  <p className="line-clamp-2 pr-6 text-[13px] font-extrabold leading-snug text-slate-900 sm:text-[14px]">
                                    {item.product_name}
                                  </p>

                                  <div className="mt-2 flex flex-wrap items-center gap-2">
                                    {item.brand && (
                                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-600 sm:text-[10px]">
                                        {item.brand}
                                      </span>
                                    )}

                                    {item.category_name && (
                                      <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold text-orange-700 sm:text-[10px]">
                                        {item.category_name}
                                      </span>
                                    )}
                                  </div>

                                  <div className="mt-3 flex flex-wrap items-end gap-2">
                                    <span className="text-[17px] font-extrabold text-slate-900 sm:text-[18px]">
                                      ₹{item.selling_price}
                                    </span>

                                    {item.display_price &&
                                      String(item.display_price) !==
                                        String(item.selling_price) && (
                                        <span className="text-[11px] font-semibold text-slate-400 line-through sm:text-[12px]">
                                          ₹{item.display_price}
                                        </span>
                                      )}
                                  </div>

                                  {item.description && (
                                    <p className="mt-3 line-clamp-2 text-[11px] font-medium leading-relaxed text-slate-500 sm:text-[11.5px]">
                                      {item.description}
                                    </p>
                                  )}
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                                  <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() =>
                                      handleSingleMoveToCart(item._id)
                                    }
                                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-900 px-3 py-2.5 text-[10px] font-extrabold text-white transition hover:bg-slate-800 sm:px-3.5 sm:py-2 sm:text-[11px]"
                                  >
                                    <FiShoppingCart className="text-[12px] sm:text-[13px]" />
                                    Move to cart
                                  </motion.button>

                                  <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => handleCheckoutNow(item)}
                                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-orange-500 px-3 py-2.5 text-[10px] font-extrabold text-white transition hover:bg-orange-600 sm:px-3.5 sm:py-2 sm:text-[11px]"
                                  >
                                    <FiEye className="text-[12px] sm:text-[13px]" />
                                    Buy now
                                  </motion.button>

                                  <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => toggleSaveForLater(item._id)}
                                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2.5 text-[10px] font-extrabold text-slate-700 transition hover:bg-slate-50 sm:px-3.5 sm:py-2 sm:text-[11px]"
                                  >
                                    <FiHeart className="text-[12px] sm:text-[13px]" />
                                    Save
                                  </motion.button>

                                  <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => handleSingleRemove(item._id)}
                                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-2.5 text-[10px] font-extrabold text-rose-700 transition hover:bg-rose-100 sm:px-3.5 sm:py-2 sm:text-[11px]"
                                  >
                                    <FiTrash2 className="text-[12px] sm:text-[13px]" />
                                    Remove
                                  </motion.button>
                                </div>

                                <div className="mt-3 flex items-center justify-between gap-3">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenProduct(item._id)}
                                    className="text-[10px] font-bold text-slate-500 transition hover:text-slate-800"
                                  >
                                    View product
                                  </button>

                                  <span className="text-[9px] font-semibold text-slate-400">
                                    ID: {String(item._id).slice(-6)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {totalCount > productsPerPage && (
                    <div className="mt-5">
                      <WishlistPagination
                        productsPerPage={productsPerPage}
                        totalProducts={totalCount}
                        currentPage={currentPage}
                        paginate={setCurrentPage}
                      />
                    </div>
                  )}

                  <WishlistSaveForLater
                    items={savedForLaterItems}
                    backendRoute={globalBackendRoute}
                    loading={isMutating}
                    onMoveToWishlist={(id) => toggleSaveForLater(id)}
                    onRemove={(id) => removeItem(id)}
                  />

                  <div className="mt-6 flex justify-center sm:hidden">
                    <button
                      type="button"
                      onClick={() => navigate("/shop")}
                      className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      Continue shopping
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Wishlist;
