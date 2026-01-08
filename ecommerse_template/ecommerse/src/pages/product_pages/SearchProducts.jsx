// import React, { useState, useEffect, useContext } from "react";
// import FiltersSidebar from "../../components/shop_components/FiltersSidebar";
// import ProductGrid from "../../components/shop_components/ProductGrid";
// import ProductCard from "../../components/shop_components/ProductCard";
// import ProductList from "../../components/shop_components/ProductList";
// import Pagination from "../../components/shop_components/Pagination";
// import { CartContext } from "../../components/cart_components/CartContext";
// import { WishlistContext } from "../../components/wishlist_components/WishlistContext";
// import { AuthContext } from "../../components/auth_components/AuthManager";
// import axios from "axios";
// import { useLocation } from "react-router-dom";
// import globalBackendRoute from "../../config/Config";
// import { motion } from "framer-motion";
// import { FaTh, FaThList, FaIdBadge } from "react-icons/fa";
// import { toast } from "react-toastify";

// let debounceTimeout;

// const SearchProducts = () => {
//   const location = useLocation();
//   const [query, setQuery] = useState("");
//   const [allProducts, setAllProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [viewMode, setViewMode] = useState("grid");
//   const [localWishlist, setLocalWishlist] = useState([]);
//   const [showAnimatedMsg, setShowAnimatedMsg] = useState(false);
//   const [animatedMsgProductName, setAnimatedMsgProductName] = useState("");

//   const { addToCart } = useContext(CartContext);
//   const { isLoggedIn } = useContext(AuthContext);
//   const { wishlistItems, addToWishlist, removeFromWishlist, fetchWishlist } =
//     useContext(WishlistContext);

//   const productsPerPage =
//     viewMode === "grid" ? 12 : viewMode === "card" ? 9 : 10;

//   useEffect(() => {
//     const currentQuery =
//       new URLSearchParams(location.search).get("query") || "";
//     setQuery(currentQuery);
//   }, [location.search]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(
//           `${globalBackendRoute}/api/all-added-products`
//         );
//         const products = res.data || [];
//         setAllProducts(products);
//         await fetchWishlist();
//       } catch (error) {
//         console.error("Failed to fetch products:", error.message);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const ids = wishlistItems.map((item) => item._id || item.product?._id);
//     setLocalWishlist(ids);
//   }, [wishlistItems]);

//   useEffect(() => {
//     clearTimeout(debounceTimeout);
//     debounceTimeout = setTimeout(() => {
//       const lowerQuery = query.toLowerCase().trim();
//       if (!lowerQuery) {
//         setFilteredProducts(allProducts);
//         return;
//       }

//       const filtered = allProducts.filter((product) => {
//         const name = product.product_name?.toLowerCase() || "";
//         const desc = product.description?.toLowerCase() || "";
//         const brand = product.brand?.toLowerCase() || "";
//         const category = product.category?.category_name?.toLowerCase() || "";
//         const tags = (product.tags || []).map((tag) => tag.toLowerCase());
//         return (
//           name.includes(lowerQuery) ||
//           desc.includes(lowerQuery) ||
//           brand.includes(lowerQuery) ||
//           category.includes(lowerQuery) ||
//           tags.some((tag) => tag.includes(lowerQuery))
//         );
//       });

//       setFilteredProducts(filtered.length > 0 ? filtered : allProducts);
//     }, 300);

//     return () => clearTimeout(debounceTimeout);
//   }, [query, allProducts]);

//   const handleFilterChange = (newFilteredProducts) => {
//     setFilteredProducts(newFilteredProducts);
//     setCurrentPage(1);
//   };

//   const handleWishlistToggle = async (product) => {
//     const productId = product._id;
//     const productName = product.product_name;

//     if (!isLoggedIn) {
//       toast.info("Please log in to use the wishlist", {
//         position: "top-center",
//         autoClose: 2000,
//       });
//       return;
//     }

//     try {
//       const alreadyInWishlist = localWishlist.includes(productId);
//       if (alreadyInWishlist) {
//         await removeFromWishlist(productId);
//         setAnimatedMsgProductName(`❌ ${productName} removed from wishlist`);
//       } else {
//         await addToWishlist(productId, product);
//         setAnimatedMsgProductName(`✨ ${productName} added to wishlist`);
//       }

//       await fetchWishlist();
//       setShowAnimatedMsg(true);
//       setTimeout(() => setShowAnimatedMsg(false), 2000);
//     } catch (err) {
//       console.error("Error in wishlist toggle:", err);
//     }
//   };

//   const handleAddToCart = (product) => {
//     if (product.availability_status) {
//       addToCart(product);
//     } else {
//       toast.error("Cannot add. Product is Out of Stock!", { autoClose: 1200 });
//     }
//   };

//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = filteredProducts.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   );
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div className="py-10 px-4 flex flex-col lg:flex-row gap-4 animate-fadeIn">
//       {showAnimatedMsg && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -10 }}
//           className="fixed top-20 right-4 z-50 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-4 py-2 rounded-full shadow-lg animate-pulse"
//         >
//           {animatedMsgProductName}
//         </motion.div>
//       )}

//       <motion.div
//         initial={{ x: -100, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.6 }}
//         className="w-full lg:w-1/4"
//       >
//         <FiltersSidebar
//           allProducts={allProducts}
//           onFilterChange={handleFilterChange}
//           initialQuery={query}
//         />
//       </motion.div>

//       <motion.div
//         initial={{ x: 100, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.6 }}
//         className="w-full lg:w-3/4"
//       >
//         <div className="flex items-center justify-between mb-6">
//           <motion.h1
//             className="text-3xl font-extrabold text-gray-800 tracking-wide"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//           >
//             {query ? `Results for "${query}"` : "Explore Products"}
//           </motion.h1>

//           <div className="flex items-center gap-2">
//             <span className="text-sm text-gray-500 hidden md:inline">
//               ({filteredProducts.length} items)
//             </span>
//             <div className="flex gap-2 ml-3">
//               <button
//                 onClick={() => setViewMode("grid")}
//                 className={`p-2 rounded-full border ${
//                   viewMode === "grid"
//                     ? "bg-gray-900 text-white"
//                     : "text-gray-600"
//                 }`}
//               >
//                 <FaTh />
//               </button>
//               <button
//                 onClick={() => setViewMode("card")}
//                 className={`p-2 rounded-full border ${
//                   viewMode === "card"
//                     ? "bg-gray-900 text-white"
//                     : "text-gray-600"
//                 }`}
//               >
//                 <FaIdBadge />
//               </button>
//               <button
//                 onClick={() => setViewMode("list")}
//                 className={`p-2 rounded-full border ${
//                   viewMode === "list"
//                     ? "bg-gray-900 text-white"
//                     : "text-gray-600"
//                 }`}
//               >
//                 <FaThList />
//               </button>
//             </div>
//           </div>
//         </div>

//         {currentProducts.length === 0 ? (
//           <motion.p
//             className="text-center text-gray-400 mt-20"
//             initial={{ scale: 0.8 }}
//             animate={{ scale: 1 }}
//           >
//             No products found matching "{query}"!
//           </motion.p>
//         ) : (
//           <>
//             <motion.div
//               key={viewMode}
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.4 }}
//             >
//               {viewMode === "grid" && (
//                 <ProductGrid
//                   products={currentProducts}
//                   handleAddToCart={handleAddToCart}
//                   handleToggleWishlist={handleWishlistToggle}
//                   wishlist={localWishlist}
//                 />
//               )}
//               {viewMode === "card" && (
//                 <ProductCard
//                   products={currentProducts}
//                   handleAddToCart={handleAddToCart}
//                   handleToggleWishlist={handleWishlistToggle}
//                   wishlist={localWishlist}
//                 />
//               )}
//               {viewMode === "list" && (
//                 <ProductList
//                   products={currentProducts}
//                   handleAddToCart={handleAddToCart}
//                   handleToggleWishlist={handleWishlistToggle}
//                   wishlist={localWishlist}
//                 />
//               )}
//             </motion.div>

//             {filteredProducts.length > productsPerPage && (
//               <motion.div
//                 className="mt-10"
//                 initial={{ y: 30, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//               >
//                 <Pagination
//                   productsPerPage={productsPerPage}
//                   totalProducts={filteredProducts.length}
//                   currentPage={currentPage}
//                   paginate={paginate}
//                 />
//               </motion.div>
//             )}
//           </>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default SearchProducts;

//

// ✅ file: src/pages/shop_pages/SearchProducts.jsx
// ✅ UI ONLY update: makes SearchProducts layout 100% IDENTICAL to your Shop page layout
// ✅ NO FUNCTIONALITY changes:
// - Uses your existing SearchProducts logic (query from URL, debounce search, wishlist/cart, pagination, view modes)
// - Keeps FiltersSidebar / ProductGrid / ProductCard / ProductList / Pagination components exactly as-is
// ✅ UI matches Shop:
// - Same font + same btnOrange style + same gaps (sidebar ↔ main) + same header row + same view toggle pills
// - Same toast bubble style (white blur box with orange dot)
// - Same container spacing + sticky sidebar wrapper
// NOTE: This file assumes your Shop page has the same visual system. We’re copying the same shell UI.

import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import FiltersSidebar from "../../components/shop_components/FiltersSidebar";
import ProductGrid from "../../components/shop_components/ProductGrid";
import ProductCard from "../../components/shop_components/ProductCard";
import ProductList from "../../components/shop_components/ProductList";
import Pagination from "../../components/shop_components/Pagination";
import { CartContext } from "../../components/cart_components/CartContext";
import { WishlistContext } from "../../components/wishlist_components/WishlistContext";
import { AuthContext } from "../../components/auth_components/AuthManager";
import axios from "axios";
import { useLocation } from "react-router-dom";
import globalBackendRoute from "../../config/Config";
import { motion, AnimatePresence } from "framer-motion";
import { FaTh, FaThList, FaIdBadge } from "react-icons/fa";
import { toast } from "react-toastify";

// header icons (same vibe as Shop)
import { FiSliders } from "react-icons/fi";
import { RiShoppingBag3Line } from "react-icons/ri";

let debounceTimeout;

const SearchProducts = () => {
  const location = useLocation();

  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [localWishlist, setLocalWishlist] = useState([]);
  const [showAnimatedMsg, setShowAnimatedMsg] = useState(false);
  const [animatedMsgProductName, setAnimatedMsgProductName] = useState("");

  const { addToCart } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);
  const { wishlistItems, addToWishlist, removeFromWishlist, fetchWishlist } =
    useContext(WishlistContext);

  const productsPerPage =
    viewMode === "grid" ? 12 : viewMode === "card" ? 9 : 10;

  // ✅ read query from URL ?query=
  useEffect(() => {
    const currentQuery =
      new URLSearchParams(location.search).get("query") || "";
    setQuery(currentQuery);
  }, [location.search]);

  // ✅ fetch products + wishlist (same as before)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/all-added-products`
        );
        const products = res.data || [];
        setAllProducts(products);
        await fetchWishlist();
      } catch (error) {
        console.error("Failed to fetch products:", error.message);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ local wishlist cache (same as before)
  useEffect(() => {
    const ids = wishlistItems.map((item) => item._id || item.product?._id);
    setLocalWishlist(ids);
  }, [wishlistItems]);

  // ✅ debounce search (same as before)
  useEffect(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const lowerQuery = query.toLowerCase().trim();
      if (!lowerQuery) {
        setFilteredProducts(allProducts);
        return;
      }

      const filtered = allProducts.filter((product) => {
        const name = product.product_name?.toLowerCase() || "";
        const desc = product.description?.toLowerCase() || "";
        const brand = product.brand?.toLowerCase() || "";
        const category = product.category?.category_name?.toLowerCase() || "";
        const tags = (product.tags || []).map((tag) => tag.toLowerCase());
        return (
          name.includes(lowerQuery) ||
          desc.includes(lowerQuery) ||
          brand.includes(lowerQuery) ||
          category.includes(lowerQuery) ||
          tags.some((tag) => tag.includes(lowerQuery))
        );
      });

      setFilteredProducts(filtered.length > 0 ? filtered : allProducts);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query, allProducts]);

  const handleFilterChange = (newFilteredProducts) => {
    setFilteredProducts(newFilteredProducts);
    setCurrentPage(1);
  };

  const handleWishlistToggle = async (product) => {
    const productId = product._id;
    const productName = product.product_name;

    if (!isLoggedIn) {
      toast.info("Please log in to use the wishlist", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      const alreadyInWishlist = localWishlist.includes(productId);
      if (alreadyInWishlist) {
        await removeFromWishlist(productId);
        setAnimatedMsgProductName(`❌ ${productName} removed from wishlist`);
      } else {
        await addToWishlist(productId, product);
        setAnimatedMsgProductName(`✨ ${productName} added to wishlist`);
      }

      await fetchWishlist();
      setShowAnimatedMsg(true);
      setTimeout(() => setShowAnimatedMsg(false), 1600);
    } catch (err) {
      console.error("Error in wishlist toggle:", err);
    }
  };

  const handleAddToCart = (product) => {
    if (product.availability_status) {
      addToCart(product);
    } else {
      toast.error("Cannot add. Product is Out of Stock!", { autoClose: 1200 });
    }
  };

  // ✅ pagination (same)
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalCount = filteredProducts.length;
  const pageStart = totalCount === 0 ? 0 : indexOfFirstProduct + 1;
  const pageEnd = Math.min(indexOfLastProduct, totalCount);

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
    <div className="shop-font w-full shop-scope">
      {/* ✅ exact same base styles as Shop shell */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .shop-font{
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }

        /* ✅ Your exact button theme */
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

        /* ✅ PRICE COLORS (global within shop scope) */
        .shop-scope .priceSelling{
          color: rgb(15,23,42);
          font-weight: 900;
        }
        .shop-scope .priceMrp{
          color: rgb(239,68,68);
          font-weight: 800;
          text-decoration: line-through;
        }

        /* Sidebar wrapper (to match Shop) */
        .sidebarWrap{
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
        }

        /* Pagination active button (in case Pagination uses button classes) */
        .paginationWrap button.activePage{
          background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36)) !important;
          color: #fff !important;
          border: none !important;
          box-shadow: 0 18px 30px -18px rgba(249,115,22,0.40) !important;
          border-radius: 9999px !important;
        }
      `}</style>

      {/* ✅ EXACT toast bubble like Shop */}
      <AnimatePresence>
        {showAnimatedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed top-20 right-4 z-50"
          >
            <div className="rounded-xl bg-white/95 backdrop-blur border border-slate-200 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                <p className="text-[12px] font-semibold text-slate-800">
                  {animatedMsgProductName}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ EXACT same container + header layout as Shop */}
      <div className="w-full px-3 sm:px-5 lg:px-8 py-4">
        {/* header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <RiShoppingBag3Line className="text-slate-800" />
              <h1 className="text-[20px] sm:text-[24px] font-extrabold tracking-tight text-slate-900">
                {query ? `Results for "${query}"` : "Explore Products"}
              </h1>
              <span className="hidden sm:inline text-[12px] font-semibold text-slate-500">
                ({totalCount} items)
              </span>
            </div>

            <div className="mt-1 text-[12px] text-slate-500 font-medium">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {pageStart}-{pageEnd}
              </span>
            </div>
          </div>

          {/* view buttons */}
          <div className="inline-flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-2 text-[12px] font-semibold text-slate-600">
              <FiSliders />
              View
            </span>

            <div className="inline-flex items-center gap-1 rounded-2xl bg-slate-50 px-1.5 py-1.5 border border-slate-200">
              {viewButtons.map(({ id, Icon, label }) => {
                const active = viewMode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onChangeView(id)}
                    className={[
                      "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-bold transition",
                      active
                        ? "bg-white text-slate-900"
                        : "text-slate-600 hover:text-slate-900",
                    ].join(" ")}
                    title={label}
                  >
                    <Icon
                      className={active ? "text-orange-600" : "text-slate-500"}
                    />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ✅ EXACT same sidebar+main layout + big gap like Shop */}
        <div className="mt-4 flex flex-col lg:flex-row gap-14 xl:gap-16 2xl:gap-20">
          {/* Sidebar */}
          <aside className="w-full lg:w-[320px] xl:w-[340px] sidebarWrap">
            <div className="sticky top-20">
              <FiltersSidebar
                allProducts={allProducts}
                onFilterChange={handleFilterChange}
                initialQuery={query}
              />
            </div>
          </aside>

          {/* Main */}
          <main className="w-full flex-1">
            {currentProducts.length === 0 ? (
              <motion.p
                className="text-center text-slate-400 mt-20 text-[13px] font-semibold"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                No products found matching "{query}"!
              </motion.p>
            ) : (
              <>
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.16 }}
                >
                  {viewMode === "grid" && (
                    <ProductGrid
                      products={currentProducts}
                      handleAddToCart={handleAddToCart}
                      handleToggleWishlist={handleWishlistToggle}
                      wishlist={localWishlist}
                    />
                  )}
                  {viewMode === "card" && (
                    <ProductCard
                      products={currentProducts}
                      handleAddToCart={handleAddToCart}
                      handleToggleWishlist={handleWishlistToggle}
                      wishlist={localWishlist}
                    />
                  )}
                  {viewMode === "list" && (
                    <ProductList
                      products={currentProducts}
                      handleAddToCart={handleAddToCart}
                      handleToggleWishlist={handleWishlistToggle}
                      wishlist={localWishlist}
                    />
                  )}
                </motion.div>

                {filteredProducts.length > productsPerPage && (
                  <motion.div
                    className="mt-6 paginationWrap"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Pagination
                      productsPerPage={productsPerPage}
                      totalProducts={filteredProducts.length}
                      currentPage={currentPage}
                      paginate={paginate}
                    />
                  </motion.div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchProducts;
