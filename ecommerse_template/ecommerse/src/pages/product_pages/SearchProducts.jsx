// // ✅ file: src/pages/shop_pages/SearchProducts.jsx
// // ✅ FULL UPDATED CODE (NO BLANK PAGE EVER)
// //
// // ✅ What changed (without breaking anything you already have):
// // 1) Search runs FIRST (exact same debounce + URL ?query logic)
// // 2) If search has 0 matches ➜ fallback mode activates:
// //    - page behaves EXACTLY like Shop page (shows ALL products)
// //    - sidebar behaves EXACTLY like Shop sidebar (tree from products, hides empty cats/subcats)
// //    - clicking category shows category + its subcategory products
// //    - category name click toggles dropdown (same as chevron)
// //    - only ONE category dropdown open at a time
// //    - FULL ROWS FIX: productsPerPage is multiple of columns (identical to Shop)
// // 3) Does NOT remove any existing search page functionality.
// // 4) Also filters out isDeleted products (same safety as Shop)
// //
// // ✅ IMPORTANT:
// // - Sidebar always receives the correct base list:
// //   - If matches found => base = matched products
// //   - If no matches => base = ALL products (shop mode)
// // - Filters apply on top of that base (same as your search page requirement)

// import React, {
//   useState,
//   useEffect,
//   useContext,
//   useMemo,
//   useCallback,
// } from "react";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "react-toastify";
// import { AuthContext } from "../../components/auth_components/AuthManager";
// import { CartContext } from "../../components/cart_components/CartContext";
// import { WishlistContext } from "../../components/wishlist_components/WishlistContext";
// import { useLocation, useNavigate } from "react-router-dom";

// // icons
// import {
//   ChevronDown,
//   ChevronRight,
//   Tags,
//   ListFilter,
//   IndianRupee,
// } from "lucide-react";
// import * as Slider from "@radix-ui/react-slider";
// import {
//   FaTh,
//   FaThList,
//   FaIdBadge,
//   FaRegHeart,
//   FaHeart,
//   FaRupeeSign,
//   FaStar,
// } from "react-icons/fa";
// import { RiShoppingCart2Line, RiShoppingBag3Line } from "react-icons/ri";
// import { FiTruck, FiRefreshCw, FiSliders } from "react-icons/fi";

// let debounceTimeout;

// // --------------------------- helpers ---------------------------
// function resolveImage(item) {
//   if (!item?.product_image) return "https://via.placeholder.com/600x600";
//   const file = String(item.product_image).replace(/\\/g, "/").split("/").pop();
//   return `${globalBackendRoute}/uploads/products/${file}`;
// }
// function money(v) {
//   if (v === null || v === undefined || v === "") return null;
//   const n = Number(v);
//   if (Number.isNaN(n)) return String(v);
//   return n.toLocaleString("en-IN");
// }
// function safeUpper(v) {
//   if (v === null || v === undefined) return "";
//   if (typeof v === "string") return v.trim().toUpperCase();
//   if (typeof v === "number" || typeof v === "boolean")
//     return String(v).trim().toUpperCase();
//   if (typeof v === "object") {
//     if (typeof v.name === "string") return v.name.trim().toUpperCase();
//     if (typeof v.title === "string") return v.title.trim().toUpperCase();
//     if (typeof v.category_name === "string")
//       return v.category_name.trim().toUpperCase();
//     if (typeof v.subcategory_name === "string")
//       return v.subcategory_name.trim().toUpperCase();
//   }
//   return "";
// }

// // ✅ robust id reader (works for ObjectId string OR populated doc)
// function getId(val) {
//   if (!val) return "";
//   if (typeof val === "string") return val;
//   if (typeof val === "object") {
//     if (val._id) return String(val._id);
//     try {
//       return String(val);
//     } catch {
//       return "";
//     }
//   }
//   return String(val);
// }

// function getCategoryIdFromProduct(p) {
//   return getId(p?.category?._id || p?.category);
// }
// function getSubcategoryIdFromProduct(p) {
//   return getId(p?.subcategory?._id || p?.subcategory);
// }
// function getCategoryNameFromProduct(p) {
//   return safeUpper(
//     p?.category?.category_name || p?.category?.name || p?.category_name
//   );
// }
// function getSubcategoryNameFromProduct(p) {
//   return safeUpper(p?.subcategory?.subcategory_name || p?.subcategory_name);
// }

// // ===============================================================
// // ✅ MAIN SEARCH PAGE (Shop-like fallback when no results)
// // ===============================================================
// export default function SearchProducts() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [query, setQuery] = useState("");
//   const [allProducts, setAllProducts] = useState([]);

//   // ✅ searchedBaseProducts = actual search matches (or empty if none)
//   const [searchedBaseProducts, setSearchedBaseProducts] = useState([]);

//   // ✅ baseForSidebarAndFiltering = either searchedBaseProducts (if found) OR allProducts (fallback)
//   const [baseProducts, setBaseProducts] = useState([]);

//   // ✅ filteredProducts = sidebar filters applied on top of baseProducts
//   const [filteredProducts, setFilteredProducts] = useState([]);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [viewMode, setViewMode] = useState("grid");

//   const [showAnimatedMsg, setShowAnimatedMsg] = useState(false);
//   const [animatedMsgProductName, setAnimatedMsgProductName] = useState("");
//   const [localWishlist, setLocalWishlist] = useState([]);

//   const { isLoggedIn } = useContext(AuthContext);
//   const { addToCart } = useContext(CartContext);
//   const { wishlistItems, addToWishlist, removeFromWishlist, fetchWishlist } =
//     useContext(WishlistContext);

//   // ============================================================
//   // ✅ FULL ROWS FIX (same as Shop.jsx)
//   // productsPerPage becomes (columns * rowsPerPage) based on current viewport + viewMode
//   // ============================================================
//   const [columns, setColumns] = useState(6);

//   useEffect(() => {
//     const computeCols = () => {
//       const w = window.innerWidth;

//       if (viewMode === "list") return 1;

//       // card view columns (matches: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)
//       if (viewMode === "card") {
//         if (w >= 1280) return 4; // xl
//         if (w >= 1024) return 3; // lg
//         if (w >= 640) return 2; // sm
//         return 1;
//       }

//       // grid view columns (matches: grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6)
//       if (w >= 1280) return 6; // xl
//       if (w >= 1024) return 5; // lg
//       if (w >= 768) return 4; // md
//       if (w >= 640) return 3; // sm
//       return 2; // base
//     };

//     const update = () => setColumns(computeCols());
//     update();

//     window.addEventListener("resize", update);
//     return () => window.removeEventListener("resize", update);
//   }, [viewMode]);

//   const rowsPerPage = viewMode === "grid" ? 3 : viewMode === "card" ? 3 : 14;

//   const productsPerPage =
//     viewMode === "list" ? 14 : Math.max(1, columns) * Math.max(1, rowsPerPage);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [productsPerPage, viewMode, columns]);

//   // ✅ read ?query= from URL
//   useEffect(() => {
//     const q = new URLSearchParams(location.search).get("query") || "";
//     setQuery(q);
//   }, [location.search]);

//   // ✅ fetch products + wishlist
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(
//           `${globalBackendRoute}/api/all-added-products`
//         );
//         const products = res.data || [];

//         // ✅ Show only active products (same safety as Shop)
//         const active = products.filter((p) => p?.isDeleted !== true);

//         setAllProducts(active);
//         setSearchedBaseProducts(active);
//         setBaseProducts(active);
//         setFilteredProducts(active);
//       } catch (error) {
//         console.error("Failed to fetch products:", error?.message || error);
//       }
//     };

//     fetchData();
//     fetchWishlist();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ✅ local wishlist ids cache
//   useEffect(() => {
//     const ids = wishlistItems.map((item) => item._id || item.product?._id);
//     setLocalWishlist(ids);
//   }, [wishlistItems]);

//   // ✅ debounce search -> searchedBaseProducts
//   useEffect(() => {
//     clearTimeout(debounceTimeout);

//     debounceTimeout = setTimeout(() => {
//       const lowerQuery = String(query || "")
//         .toLowerCase()
//         .trim();

//       // if query empty => show all (same as shop)
//       if (!lowerQuery) {
//         setSearchedBaseProducts(allProducts);
//         setBaseProducts(allProducts);
//         setFilteredProducts(allProducts);
//         setCurrentPage(1);
//         return;
//       }

//       const matched = allProducts.filter((product) => {
//         const name = product.product_name?.toLowerCase() || "";
//         const desc = product.description?.toLowerCase() || "";
//         const brand = product.brand?.toLowerCase() || "";
//         const category =
//           product.category?.category_name?.toLowerCase() ||
//           product.category_name?.toLowerCase() ||
//           "";
//         const subcategory =
//           product.subcategory?.subcategory_name?.toLowerCase() ||
//           product.subcategory_name?.toLowerCase() ||
//           "";
//         const tags = (product.tags || []).map((tag) =>
//           String(tag).toLowerCase()
//         );

//         return (
//           name.includes(lowerQuery) ||
//           desc.includes(lowerQuery) ||
//           brand.includes(lowerQuery) ||
//           category.includes(lowerQuery) ||
//           subcategory.includes(lowerQuery) ||
//           tags.some((tag) => tag.includes(lowerQuery))
//         );
//       });

//       // ✅ KEEP ORIGINAL SEARCH FEATURE:
//       // searchedBaseProducts stays as "real matches"
//       setSearchedBaseProducts(matched);

//       // ✅ NEW REQUIREMENT:
//       // If no match => fallback to ALL products (shop mode, no blank page)
//       const base = matched.length > 0 ? matched : allProducts;

//       setBaseProducts(base);
//       setFilteredProducts(base);
//       setCurrentPage(1);
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
//         setAnimatedMsgProductName(`${productName} removed from wishlist`);
//       } else {
//         await addToWishlist(productId, product);
//         setAnimatedMsgProductName(`${productName} added to wishlist`);
//       }

//       await fetchWishlist();
//       setShowAnimatedMsg(true);
//       setTimeout(() => setShowAnimatedMsg(false), 1600);
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

//   // pagination
//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = filteredProducts.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   );
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const totalCount = filteredProducts.length;
//   const pageStart = totalCount === 0 ? 0 : indexOfFirstProduct + 1;
//   const pageEnd = Math.min(indexOfLastProduct, totalCount);
//   const showingNow = currentProducts.length;
//   const totalPages = Math.max(1, Math.ceil(totalCount / productsPerPage));

//   const isFallback = useMemo(() => {
//     const q = String(query || "").trim();
//     if (!q) return false;
//     return searchedBaseProducts.length === 0 && allProducts.length > 0;
//   }, [query, searchedBaseProducts.length, allProducts.length]);

//   const viewButtons = useMemo(
//     () => [
//       { id: "grid", Icon: FaTh, label: "Grid" },
//       { id: "card", Icon: FaIdBadge, label: "Cards" },
//       { id: "list", Icon: FaThList, label: "List" },
//     ],
//     []
//   );

//   const onChangeView = useCallback((mode) => setViewMode(mode), []);

//   return (
//     <div className="shop-font w-full shop-scope">
//       {/* ✅ EXACT SAME CSS AS Shop.jsx */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

//         .shop-font{
//           font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
//         }

//         .btnOrange{
//           border-radius: 9999px;
//           background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36));
//           padding: 0.6rem 1.1rem;
//           color: white;
//           font-weight: 800;
//           font-size: 12px;
//           box-shadow: 0 18px 30px -18px rgba(249,115,22,0.45);
//           transition: opacity .15s ease, transform .15s ease, filter .15s ease;
//           will-change: transform;
//         }
//         .btnOrange:hover{ opacity: .95; }
//         .btnOrange:active{ transform: scale(.99); }

//         .shop-scope .priceSelling{ color: rgb(15,23,42); font-weight: 900; }
//         .shop-scope .priceMrp{ color: rgb(239,68,68); font-weight: 800; text-decoration: line-through; }

//         .sidebarWrap{ background: transparent !important; box-shadow: none !important; border: none !important; }

//         .sidebarWrap .forceOrange,
//         .sidebarWrap button.forceOrange{
//           border-radius: 9999px !important;
//           background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36)) !important;
//           color: #fff !important;
//           font-weight: 800 !important;
//           font-size: 12px !important;
//           box-shadow: 0 18px 30px -18px rgba(249,115,22,0.40) !important;
//           border: none !important;
//         }

//         .paginationWrap button.activePage{
//           background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36)) !important;
//           color: #fff !important;
//           border: none !important;
//           box-shadow: 0 18px 30px -18px rgba(249,115,22,0.40) !important;
//           border-radius: 9999px !important;
//         }

//         .tightCaps{ letter-spacing: .06em; }
//       `}</style>

//       {/* ✅ toast bubble identical */}
//       <AnimatePresence>
//         {showAnimatedMsg && (
//           <motion.div
//             initial={{ opacity: 0, y: -10, scale: 0.98 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -8, scale: 0.98 }}
//             transition={{ duration: 0.18 }}
//             className="fixed top-20 right-4 z-50"
//           >
//             <div className="rounded-xl bg-white/95 backdrop-blur border border-slate-200 px-3 py-2">
//               <div className="flex items-center gap-2">
//                 <span className="h-2 w-2 rounded-full bg-orange-500" />
//                 <p className="text-[12px] font-semibold text-slate-800">
//                   {animatedMsgProductName}
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="w-full px-3 sm:px-5 lg:px-8 py-4">
//         <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
//           <div className="min-w-0">
//             <div className="flex items-center gap-2">
//               <RiShoppingBag3Line className="text-slate-800" />
//               <h1 className="text-[20px] sm:text-[24px] font-extrabold tracking-tight text-slate-900">
//                 {query ? `Results for "${query}"` : "Explore Products"}
//               </h1>

//               <span className="hidden sm:inline text-[12px] font-semibold text-slate-500">
//                 ({totalCount} items)
//               </span>
//             </div>

//             <div className="mt-1 text-[12px] text-slate-500 font-medium">
//               {totalCount === 0 ? (
//                 <span className="font-semibold text-slate-700">
//                   No products found
//                 </span>
//               ) : (
//                 <>
//                   Showing{" "}
//                   <span className="font-semibold text-slate-700">
//                     {pageStart}-{pageEnd}
//                   </span>{" "}
//                   of{" "}
//                   <span className="font-semibold text-slate-700">
//                     {totalCount}
//                   </span>{" "}
//                   products
//                   <span className="hidden sm:inline">
//                     {" "}
//                     • On this page:{" "}
//                     <span className="font-semibold text-slate-700">
//                       {showingNow}
//                     </span>{" "}
//                     • Page{" "}
//                     <span className="font-semibold text-slate-700">
//                       {currentPage}
//                     </span>
//                     /
//                     <span className="font-semibold text-slate-700">
//                       {totalPages}
//                     </span>
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* ✅ friendly notice when fallback happens (no blank page) */}
//             {isFallback && (
//               <div className="mt-2 text-[12px] font-semibold text-slate-600">
//                 No exact matches for{" "}
//                 <span className="text-slate-900 font-extrabold">"{query}"</span>
//                 . Showing all products — use filters to refine.
//               </div>
//             )}
//           </div>

//           <div className="inline-flex items-center gap-2">
//             <span className="hidden sm:inline-flex items-center gap-2 text-[12px] font-semibold text-slate-600">
//               <FiSliders />
//               View
//             </span>

//             <div className="inline-flex items-center gap-1 rounded-2xl bg-slate-50 px-1.5 py-1.5 border border-slate-200">
//               {viewButtons.map(({ id, Icon, label }) => {
//                 const active = viewMode === id;
//                 return (
//                   <button
//                     key={id}
//                     type="button"
//                     onClick={() => onChangeView(id)}
//                     className={[
//                       "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-bold transition",
//                       active
//                         ? "bg-white text-slate-900"
//                         : "text-slate-600 hover:text-slate-900",
//                     ].join(" ")}
//                     title={label}
//                   >
//                     <Icon
//                       className={active ? "text-orange-600" : "text-slate-500"}
//                     />
//                     <span className="hidden sm:inline">{label}</span>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         <div className="mt-4 flex flex-col lg:flex-row gap-14 xl:gap-16 2xl:gap-20">
//           {/* SIDEBAR */}
//           <aside className="w-full lg:w-[320px] xl:w-[340px] sidebarWrap">
//             <div className="sticky top-20">
//               {/* ✅ IMPORTANT: sidebar receives baseProducts (matches or fallback all) */}
//               <FiltersSidebar
//                 allProducts={baseProducts}
//                 onFilterChange={handleFilterChange}
//                 initialQuery={query}
//               />
//             </div>
//           </aside>

//           {/* PRODUCTS */}
//           <main className="w-full flex-1">
//             <motion.div
//               key={viewMode}
//               initial={{ opacity: 0, scale: 0.99 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.16 }}
//             >
//               {viewMode === "grid" && (
//                 <ProductsGridUI
//                   products={currentProducts}
//                   wishlist={localWishlist}
//                   onToggleWishlist={handleWishlistToggle}
//                   onAddToCart={handleAddToCart}
//                   onOpen={(id) => navigate(`/single-product/${id}`)}
//                 />
//               )}

//               {viewMode === "card" && (
//                 <ProductsCardUI
//                   products={currentProducts}
//                   wishlist={localWishlist}
//                   onToggleWishlist={handleWishlistToggle}
//                   onAddToCart={handleAddToCart}
//                   onOpen={(id) => navigate(`/single-product/${id}`)}
//                 />
//               )}

//               {viewMode === "list" && (
//                 <ProductsListUI
//                   products={currentProducts}
//                   wishlist={localWishlist}
//                   onToggleWishlist={handleWishlistToggle}
//                   onAddToCart={handleAddToCart}
//                   onOpen={(id) => navigate(`/single-product/${id}`)}
//                 />
//               )}
//             </motion.div>

//             {filteredProducts.length > productsPerPage && (
//               <div className="mt-6 paginationWrap">
//                 <Pagination
//                   productsPerPage={productsPerPage}
//                   totalProducts={filteredProducts.length}
//                   currentPage={currentPage}
//                   paginate={paginate}
//                 />
//               </div>
//             )}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ===============================================================
// // ✅ FILTER SIDEBAR (IDENTICAL LOGIC TO Shop.jsx)
// // - hides categories/subcategories that have 0 products
// // - clicking category shows ALL products in category + its subcategories
// // - robust ids for populated/raw
// // - category name click toggles dropdown (same as chevron)
// // - only ONE dropdown open at a time
// // ===============================================================
// function FiltersSidebar({ allProducts, onFilterChange, initialQuery }) {
//   const [categoriesTree, setCategoriesTree] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [expandedCategories, setExpandedCategories] = useState({});
//   const [expandedBrands, setExpandedBrands] = useState(false);

//   const [selectedBrands, setSelectedBrands] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedSubCategory, setSelectedSubCategory] = useState(null);

//   const [minPrice, setMinPrice] = useState(0);
//   const [maxPrice, setMaxPrice] = useState(1000);
//   const [tempPriceRange, setTempPriceRange] = useState([0, 1000]);

//   const [sortOption, setSortOption] = useState("");

//   // ✅ Build sidebar tree from products (so no empty cats/subcats)
//   useEffect(() => {
//     const buildTreeFromProducts = () => {
//       const active = (allProducts || []).filter((p) => p?.isDeleted !== true);

//       const map = new Map();

//       for (const p of active) {
//         const catId = getCategoryIdFromProduct(p);
//         const subId = getSubcategoryIdFromProduct(p);

//         if (!catId && !subId) continue;

//         const catName = getCategoryNameFromProduct(p) || "UNCATEGORIZED";

//         if (!map.has(catId || "UNCAT")) {
//           map.set(catId || "UNCAT", {
//             categoryId: catId || "UNCAT",
//             categoryName: safeUpper(catName || "UNCATEGORIZED"),
//             subMap: new Map(),
//           });
//         }

//         const node = map.get(catId || "UNCAT");

//         if (subId) {
//           const subName = getSubcategoryNameFromProduct(p) || "OTHERS";
//           if (!node.subMap.has(subId)) {
//             node.subMap.set(subId, {
//               id: subId,
//               name: safeUpper(subName),
//             });
//           }
//         }
//       }

//       const tree = Array.from(map.values())
//         .map((c) => ({
//           categoryId: String(c.categoryId),
//           categoryName: String(c.categoryName || "").toUpperCase(),
//           subcategories: Array.from(c.subMap.values()).sort((a, b) =>
//             String(a.name).localeCompare(String(b.name))
//           ),
//         }))
//         .sort((a, b) =>
//           String(a.categoryName).localeCompare(String(b.categoryName))
//         );

//       setCategoriesTree(tree);
//     };

//     buildTreeFromProducts();
//   }, [allProducts]);

//   useEffect(() => {
//     if (allProducts.length > 0) {
//       const brandSet = new Set();
//       allProducts.forEach((p) => {
//         if (p?.brand && String(p.brand).trim() !== "") {
//           brandSet.add(String(p.brand).trim().toUpperCase());
//         }
//       });
//       setBrands([...brandSet]);

//       const prices = allProducts
//         .map((p) => p?.selling_price ?? p?.price ?? 0)
//         .filter((p) => Number(p) > 0);
//       const minP = prices.length ? Math.floor(Math.min(...prices)) : 0;
//       const maxP = prices.length ? Math.ceil(Math.max(...prices)) : 1000;
//       setMinPrice(minP);
//       setMaxPrice(maxP);
//       setTempPriceRange([minP, maxP]);
//     }
//   }, [allProducts]);

//   // ✅ helper: open exactly one category at a time (or close all)
//   const openOnlyThisCategory = useCallback((catName, open) => {
//     setExpandedCategories(() => {
//       if (!open) return {};
//       return { [catName]: true };
//     });
//   }, []);

//   // ✅ initial query matching (category/subcategory/brand)
//   useEffect(() => {
//     if (!initialQuery || categoriesTree.length === 0) return;

//     const q = initialQuery.trim().toLowerCase();
//     if (!q) return;

//     let matched = false;

//     for (const cat of categoriesTree) {
//       if (String(cat.categoryName || "").toLowerCase() === q) {
//         setSelectedCategory(cat.categoryId);
//         setSelectedSubCategory(null);

//         if ((cat.subcategories || []).length > 0) {
//           openOnlyThisCategory(cat.categoryName, true);
//         } else {
//           openOnlyThisCategory("", false);
//         }

//         matched = true;
//         break;
//       }

//       for (const sub of cat.subcategories || []) {
//         if (String(sub.name || "").toLowerCase() === q) {
//           setSelectedSubCategory(sub.id);
//           setSelectedCategory(null);

//           if ((cat.subcategories || []).length > 0) {
//             openOnlyThisCategory(cat.categoryName, true);
//           }

//           matched = true;
//           break;
//         }
//       }
//       if (matched) break;
//     }

//     if (!matched && brands.length > 0) {
//       const brandMatch = brands.find((b) => String(b).toLowerCase() === q);
//       if (brandMatch) setSelectedBrands([brandMatch]);
//     }
//   }, [initialQuery, categoriesTree, brands, openOnlyThisCategory]);

//   useEffect(() => {
//     applyFilters();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     selectedCategory,
//     selectedSubCategory,
//     selectedBrands,
//     tempPriceRange,
//     sortOption,
//     categoriesTree,
//   ]);

//   const applyFilters = () => {
//     let filtered = [...allProducts].filter((p) => p?.isDeleted !== true);

//     if (selectedCategory) {
//       const selectedCatId = String(selectedCategory);

//       const catNode = categoriesTree.find(
//         (c) => String(c.categoryId) === selectedCatId
//       );

//       const subIdsUnderCat = new Set(
//         (catNode?.subcategories || []).map((s) => String(s.id))
//       );

//       filtered = filtered.filter((p) => {
//         const productCatId = String(getCategoryIdFromProduct(p));
//         const productSubId = String(getSubcategoryIdFromProduct(p));

//         return (
//           productCatId === selectedCatId || subIdsUnderCat.has(productSubId)
//         );
//       });
//     }

//     if (selectedSubCategory) {
//       const selectedSubId = String(selectedSubCategory);
//       filtered = filtered.filter(
//         (p) => String(getSubcategoryIdFromProduct(p)) === selectedSubId
//       );
//     }

//     if (selectedBrands.length > 0) {
//       filtered = filtered.filter((p) =>
//         selectedBrands.includes(String(p?.brand || "").toUpperCase())
//       );
//     }

//     filtered = filtered.filter((p) => {
//       const price = p?.selling_price ?? p?.price ?? 0;
//       return price >= tempPriceRange[0] && price <= tempPriceRange[1];
//     });

//     filtered.sort((a, b) => {
//       const priceA = a?.selling_price ?? a?.price ?? 0;
//       const priceB = b?.selling_price ?? b?.price ?? 0;

//       if (sortOption === "priceLowHigh") return priceA - priceB;
//       if (sortOption === "priceHighLow") return priceB - priceA;
//       if (sortOption === "latest")
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       if (sortOption === "oldest")
//         return new Date(a.createdAt) - new Date(b.createdAt);
//       if (sortOption === "popularity") return (b.views ?? 0) - (a.views ?? 0);
//       return 0;
//     });

//     onFilterChange(filtered);
//   };

//   const handleClearFilters = () => {
//     setSelectedBrands([]);
//     setSelectedCategory(null);
//     setSelectedSubCategory(null);
//     setTempPriceRange([minPrice, maxPrice]);
//     setSortOption("");
//     setExpandedCategories({});
//     onFilterChange(allProducts.filter((p) => p?.isDeleted !== true));
//   };

//   const isActive = (id, current) => String(id) === String(current);

//   // ✅ NEW: toggle single category open/close (only one open at a time)
//   const toggleSingleCategory = (catName) => {
//     setExpandedCategories((prev) => {
//       const isOpen = !!prev[catName];
//       if (isOpen) return {};
//       return { [catName]: true };
//     });
//   };

//   return (
//     <motion.div
//       className="w-full rounded-xl space-y-6"
//       initial={{ opacity: 0, y: 18 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.28 }}
//     >
//       <div className="flex justify-center">
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={handleClearFilters}
//           className="btnOrange w-full uppercase forceOrange"
//         >
//           Clear Filters
//         </motion.button>
//       </div>

//       {/* Categories */}
//       <div>
//         <div className="flex items-center gap-2 mb-2 font-extrabold text-slate-700 uppercase text-[12px] tightCaps">
//           <ListFilter size={16} /> Categories
//         </div>

//         <div className="space-y-1">
//           {categoriesTree.map((cat, idx) => {
//             const hasSubs = (cat.subcategories || []).length > 0;
//             const isOpen = !!expandedCategories[cat.categoryName];

//             return (
//               <div key={idx}>
//                 <div className="flex items-center justify-between text-[12px] font-extrabold text-slate-700 uppercase tightCaps">
//                   {/* ✅ Clicking category selects + toggles dropdown (same as Shop) */}
//                   <span
//                     className={`cursor-pointer transition ${
//                       isActive(cat.categoryId, selectedCategory)
//                         ? "text-orange-600"
//                         : "hover:text-slate-900"
//                     }`}
//                     onClick={() => {
//                       setSelectedCategory(cat.categoryId);
//                       setSelectedSubCategory(null);

//                       if (hasSubs) {
//                         toggleSingleCategory(cat.categoryName);
//                       } else {
//                         setExpandedCategories({});
//                       }
//                     }}
//                   >
//                     {cat.categoryName}
//                   </span>

//                   {hasSubs && (
//                     <motion.span
//                       className="cursor-pointer"
//                       onClick={() => toggleSingleCategory(cat.categoryName)}
//                       animate={{ rotate: isOpen ? 90 : 0 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <ChevronRight className="w-4 h-4" />
//                     </motion.span>
//                   )}
//                 </div>

//                 <AnimatePresence initial={false}>
//                   {hasSubs && isOpen && (
//                     <motion.div
//                       className="pl-4 mt-1 space-y-1"
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: "auto", opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       transition={{ duration: 0.28 }}
//                     >
//                       {cat.subcategories.map((subcat, idx2) => (
//                         <div
//                           key={idx2}
//                           className={`text-[12px] uppercase cursor-pointer transition font-bold tightCaps ${
//                             isActive(subcat.id, selectedSubCategory)
//                               ? "text-orange-600"
//                               : "text-slate-500 hover:text-slate-900"
//                           }`}
//                           onClick={() => {
//                             setSelectedSubCategory(subcat.id);
//                             setSelectedCategory(null);
//                           }}
//                         >
//                           {subcat.name}
//                         </div>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Brands */}
//       <div>
//         <div className="flex items-center gap-2 mb-2 font-extrabold text-slate-700 uppercase text-[12px] tightCaps">
//           <Tags size={16} /> Brands
//         </div>

//         <div
//           className="flex items-center justify-between text-[12px] font-extrabold text-slate-700 uppercase cursor-pointer tightCaps"
//           onClick={() => setExpandedBrands((prev) => !prev)}
//         >
//           <span>All Brands</span>
//           {expandedBrands ? (
//             <ChevronDown size={16} />
//           ) : (
//             <ChevronRight size={16} />
//           )}
//         </div>

//         <AnimatePresence>
//           {expandedBrands && (
//             <motion.div
//               className="pl-4 mt-2 space-y-2"
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ duration: 0.28 }}
//             >
//               {brands.map((brand, idx) => (
//                 <div
//                   key={idx}
//                   className={`flex items-center gap-2 uppercase transition font-extrabold cursor-pointer text-[12px] tightCaps ${
//                     selectedBrands.includes(brand)
//                       ? "text-orange-600"
//                       : "text-slate-700 hover:text-slate-900"
//                   }`}
//                   onClick={() => {
//                     let updated = [...selectedBrands];
//                     if (updated.includes(brand))
//                       updated = updated.filter((b) => b !== brand);
//                     else updated.push(brand);
//                     setSelectedBrands(updated);
//                   }}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedBrands.includes(brand)}
//                     readOnly
//                     className="accent-orange-500"
//                   />
//                   <span className="truncate">{brand}</span>
//                 </div>
//               ))}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Price Range */}
//       <div>
//         <div className="flex items-center gap-2 mb-2 font-extrabold text-slate-700 uppercase text-[12px] tightCaps">
//           <IndianRupee size={16} /> Price Range
//         </div>

//         <div className="px-2">
//           <Slider.Root
//             className="relative flex items-center select-none touch-none w-full h-5"
//             min={minPrice}
//             max={maxPrice}
//             step={10}
//             value={tempPriceRange}
//             onValueChange={(value) => setTempPriceRange(value)}
//           >
//             <Slider.Track className="bg-slate-200 relative grow rounded-full h-2">
//               <Slider.Range className="absolute bg-orange-500 rounded-full h-full" />
//             </Slider.Track>
//             <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-orange-500 rounded-full focus:outline-none" />
//             <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-orange-500 rounded-full focus:outline-none" />
//           </Slider.Root>

//           <div className="text-[12px] flex justify-between mt-2 text-slate-600 font-bold uppercase tightCaps">
//             <span>₹{tempPriceRange[0]}</span>
//             <span>₹{tempPriceRange[1]}</span>
//           </div>
//         </div>
//       </div>

//       {/* Sort By */}
//       <div>
//         <div className="flex items-center gap-2 mb-3 font-extrabold text-slate-700 uppercase text-[12px] tightCaps">
//           <ListFilter size={16} /> Sort By
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 6 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.22 }}
//           className="flex flex-wrap gap-2"
//         >
//           {[
//             { value: "", label: "Default" },
//             { value: "priceLowHigh", label: "Price ↑" },
//             { value: "priceHighLow", label: "Price ↓" },
//             { value: "latest", label: "Newest" },
//             { value: "oldest", label: "Oldest" },
//             { value: "popularity", label: "Popular" },
//           ].map((option) => {
//             const active = sortOption === option.value;
//             return (
//               <motion.button
//                 key={option.value}
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.97 }}
//                 onClick={() => setSortOption(option.value)}
//                 className={
//                   active
//                     ? "btnOrange uppercase forceOrange"
//                     : "rounded-full px-3 py-2 text-[11px] font-extrabold uppercase bg-slate-100 text-slate-700 hover:bg-slate-200"
//                 }
//                 style={!active ? { boxShadow: "none" } : undefined}
//               >
//                 {option.label}
//               </motion.button>
//             );
//           })}
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// }

// // ===============================================================
// // ✅ PAGINATION (exact same as Shop.jsx)
// // ===============================================================
// function Pagination({ productsPerPage, totalProducts, currentPage, paginate }) {
//   const totalPages = Math.ceil(totalProducts / productsPerPage);
//   if (totalPages <= 1) return null;

//   const pageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

//   return (
//     <div className="flex justify-center mt-6">
//       <nav className="inline-flex flex-wrap gap-2">
//         {pageNumbers.map((number) => {
//           const active = currentPage === number;
//           return (
//             <button
//               key={number}
//               onClick={() => paginate(number)}
//               className={
//                 active
//                   ? "activePage px-4 py-2 text-[12px] font-extrabold"
//                   : "px-4 py-2 rounded-full text-[12px] font-extrabold bg-white text-slate-700 hover:bg-slate-100"
//               }
//               style={
//                 !active ? { border: "1px solid rgb(226,232,240)" } : undefined
//               }
//             >
//               {number}
//             </button>
//           );
//         })}
//       </nav>
//     </div>
//   );
// }

// // ===============================================================
// // ✅ PRODUCT UIs (same as Shop.jsx)
// // ===============================================================
// function ProductsGridUI({
//   products,
//   wishlist,
//   onToggleWishlist,
//   onAddToCart,
//   onOpen,
// }) {
//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  xl:grid-cols-6  gap-x-8 xl:gap-x-10  gap-y-12 xl:gap-y-14">
//       {products.map((p, idx) => {
//         const id = p?._id ?? `${idx}`;
//         const inWish = Array.isArray(wishlist)
//           ? wishlist.includes(p?._id)
//           : false;

//         const selling = money(p?.selling_price ?? p?.price ?? p?.final_price);
//         const mrp = money(p?.actual_price ?? p?.display_price ?? p?.mrp_price);
//         const brand = safeUpper(p?.brand);
//         const cat = safeUpper(p?.category_name ?? p?.category);
//         const stock = !!p?.availability_status;

//         const rating = Number(p?.rating ?? p?.avg_rating ?? 4.3);
//         const ratingText = Number.isFinite(rating) ? rating.toFixed(1) : "4.3";

//         return (
//           <motion.div
//             key={id}
//             whileHover={{ y: -4 }}
//             transition={{ duration: 0.18 }}
//             className="group relative rounded-2xl bg-white"
//             style={{ boxShadow: "none", border: "none" }}
//           >
//             <div
//               className="relative rounded-2xl overflow-hidden cursor-pointer"
//               onClick={() => onOpen(p?._id)}
//             >
//               <img
//                 src={resolveImage(p)}
//                 alt={p?.product_name || "Product"}
//                 loading="lazy"
//                 className="w-full aspect-square object-cover"
//               />

//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onToggleWishlist(p);
//                 }}
//                 className="absolute top-2 right-2 h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition hover:bg-white"
//                 aria-label="Toggle wishlist"
//                 title="Wishlist"
//                 style={{ boxShadow: "none", border: "none" }}
//               >
//                 {inWish ? (
//                   <FaHeart className="text-orange-600" />
//                 ) : (
//                   <FaRegHeart className="text-slate-600" />
//                 )}
//               </button>
//             </div>

//             <div className="mt-3 px-0.5 space-y-1.5">
//               <p className="text-[12px] sm:text-[13px] font-extrabold text-slate-900 leading-snug truncate">
//                 {p?.product_name || "Unnamed product"}
//               </p>

//               <p className="mt-1 text-[11px] font-semibold text-slate-500 truncate">
//                 {brand || cat || "POPULAR PICK"} •{" "}
//                 {stock ? "FAST DELIVERY" : "RESTOCKING"}
//               </p>

//               <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
//                 <span className="inline-flex items-center gap-1">
//                   <FaStar className="text-orange-500/90" />
//                   {ratingText}
//                 </span>
//                 <span className="inline-flex items-center gap-2">
//                   <span className="inline-flex items-center gap-1">
//                     <FiTruck className="text-slate-500" />
//                     Delivery
//                   </span>
//                   <span className="inline-flex items-center gap-1">
//                     <FiRefreshCw className="text-slate-500" />
//                     Return
//                   </span>
//                 </span>
//               </div>

//               <div className="mt-2 flex items-baseline gap-2">
//                 <span className="priceSelling text-[13px] sm:text-[14px]">
//                   ₹{selling ?? "--"}
//                 </span>
//                 {mrp && mrp !== selling && (
//                   <span className="priceMrp text-[11px]">₹{mrp}</span>
//                 )}
//               </div>

//               <button
//                 type="button"
//                 onClick={() => onAddToCart(p)}
//                 disabled={!stock}
//                 className={[
//                   "mt-3 w-full inline-flex items-center justify-center gap-2",
//                   "rounded-full px-5 py-2.5 text-white font-extrabold text-[12px]",
//                   "shadow-lg shadow-orange-500/25 hover:opacity-95 active:scale-[0.99] transition",
//                   stock
//                     ? "bg-gradient-to-r from-orange-500 to-amber-400"
//                     : "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none",
//                 ].join(" ")}
//               >
//                 <RiShoppingCart2Line className="text-[15px]" />
//                 {stock ? "Add to cart" : "Out of stock"}
//               </button>
//             </div>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// }

// function ProductsCardUI({
//   products,
//   wishlist,
//   onToggleWishlist,
//   onAddToCart,
//   onOpen,
// }) {
//   return (
//     <div className=" grid  grid-cols-1  sm:grid-cols-2  lg:grid-cols-3  xl:grid-cols-4  gap-x-10 xl:gap-x-12  gap-y-14 xl:gap-y-16">
//       {products.map((product) => {
//         const inWish = Array.isArray(wishlist)
//           ? wishlist.includes(product._id)
//           : false;

//         const selling = money(
//           product?.selling_price ?? product?.price ?? product?.final_price
//         );
//         const mrp = money(
//           product?.display_price ?? product?.actual_price ?? product?.mrp_price
//         );

//         const brand = safeUpper(product?.brand);
//         const cat = safeUpper(product?.category_name ?? product?.category);
//         const stock = !!product?.availability_status;

//         const rating = Number(product?.rating ?? product?.avg_rating ?? 4.4);
//         const ratingText = Number.isFinite(rating) ? rating.toFixed(1) : "4.4";

//         return (
//           <motion.div
//             key={product._id}
//             whileHover={{ y: -6, scale: 1.01 }}
//             transition={{ duration: 0.2 }}
//             className="relative group rounded-2xl bg-white overflow-hidden"
//             style={{
//               boxShadow: "none",
//               border: "1px solid rgba(241,245,249,1)",
//             }}
//           >
//             <div className="absolute top-3 right-3 z-20">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onToggleWishlist(product);
//                 }}
//                 className="bg-white/90 backdrop-blur p-2 rounded-full transition"
//                 style={{
//                   boxShadow: "none",
//                   border: "1px solid rgba(241,245,249,1)",
//                 }}
//               >
//                 {inWish ? (
//                   <FaHeart className="w-5 h-5 text-orange-600" />
//                 ) : (
//                   <FaRegHeart className="w-5 h-5 text-slate-500" />
//                 )}
//               </button>
//             </div>

//             <div
//               className="w-full h-56 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer"
//               onClick={() => onOpen(product._id)}
//             >
//               <img
//                 src={resolveImage(product)}
//                 alt={product.product_name}
//                 loading="lazy"
//                 className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
//               />
//             </div>

//             <div
//               onClick={() => onOpen(product._id)}
//               className="p-4 space-y-2 cursor-pointer"
//             >
//               <h3 className="text-[15px] font-extrabold text-slate-900 truncate">
//                 {product.product_name}
//               </h3>

//               <p className="text-[12px] text-slate-500 font-semibold truncate">
//                 {brand || cat || "POPULAR"} • FAST DELIVERY • EASY RETURNS
//               </p>

//               <p className="text-[12px] text-slate-500 line-clamp-2">
//                 {(product.description || "").slice(0, 90)}
//                 {(product.description || "").length > 90 ? "..." : ""}
//               </p>

//               <div className="flex items-center justify-between pt-1">
//                 <div className="flex items-center gap-2">
//                   <span className="priceSelling text-[15px] inline-flex items-center gap-1">
//                     <FaRupeeSign /> {selling ?? "--"}
//                   </span>
//                   {mrp && mrp !== selling && (
//                     <span className="priceMrp text-[12px] inline-flex items-center gap-1">
//                       <FaRupeeSign /> {mrp}
//                     </span>
//                   )}
//                 </div>

//                 <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-slate-600">
//                   <FaStar className="text-orange-500/90" />
//                   {ratingText}
//                 </span>
//               </div>

//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onAddToCart(product);
//                 }}
//                 disabled={!stock}
//                 className={[
//                   "w-full mt-3 py-2.5 text-center rounded-full font-extrabold text-[12px]",
//                   "shadow-lg shadow-orange-500/25 hover:opacity-95 active:scale-[0.99] transition",
//                   stock
//                     ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white"
//                     : "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none",
//                 ].join(" ")}
//               >
//                 {stock ? (
//                   <span className="inline-flex items-center justify-center gap-2">
//                     <RiShoppingCart2Line className="text-[15px]" />
//                     Add to Cart
//                   </span>
//                 ) : (
//                   "Out of Stock"
//                 )}
//               </button>
//             </div>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// }

// function ProductsListUI({
//   products,
//   wishlist,
//   onToggleWishlist,
//   onAddToCart,
//   onOpen,
// }) {
//   return (
//     <div className="space-y-14">
//       {products.map((product) => {
//         const inWish = Array.isArray(wishlist)
//           ? wishlist.includes(product._id)
//           : false;

//         const selling = money(
//           product?.selling_price ?? product?.price ?? product?.final_price
//         );
//         const mrp = money(
//           product?.display_price ?? product?.actual_price ?? product?.mrp_price
//         );
//         const stock = !!product?.availability_status;

//         const rating = Number(product?.rating ?? product?.avg_rating ?? 4.2);
//         const ratingText = Number.isFinite(rating) ? rating.toFixed(1) : "4.2";

//         return (
//           <motion.div
//             key={product._id}
//             whileHover={{ y: -2 }}
//             transition={{ duration: 0.16 }}
//             className="flex flex-col md:flex-row items-center bg-white rounded-2xl transition group relative"
//             style={{ boxShadow: "none", border: "1px solid rgb(241,245,249)" }}
//           >
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onToggleWishlist(product);
//               }}
//               className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full"
//               style={{
//                 boxShadow: "none",
//                 border: "1px solid rgb(241,245,249)",
//               }}
//               aria-label="Toggle wishlist"
//             >
//               {inWish ? (
//                 <FaHeart className="w-5 h-5 text-orange-600" />
//               ) : (
//                 <FaRegHeart className="w-5 h-5 text-slate-500" />
//               )}
//             </button>

//             <div
//               onClick={() => onOpen(product._id)}
//               className="w-full md:w-44 h-44 bg-slate-50 rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer"
//             >
//               <img
//                 src={resolveImage(product)}
//                 alt={product.product_name}
//                 className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
//                 loading="lazy"
//               />
//             </div>

//             <div
//               onClick={() => onOpen(product._id)}
//               className="flex flex-col justify-center md:ml-6 mt-4 md:mt-0 w-full cursor-pointer"
//             >
//               <h2 className="text-[16px] sm:text-[18px] font-extrabold text-slate-900 truncate">
//                 {product.product_name}
//               </h2>

//               <p className="text-slate-500 text-[12px] mt-1 line-clamp-2">
//                 {(product.description || "").slice(0, 120)}
//                 {(product.description || "").length > 120 ? "..." : ""}
//               </p>

//               <p className="mt-2 text-[11px] font-semibold text-slate-500">
//                 {safeUpper(product.brand) ||
//                   safeUpper(product.category_name) ||
//                   "BRANDED"}{" "}
//                 • FAST DELIVERY • EASY RETURNS
//               </p>

//               <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
//                 <div className="flex items-center gap-4">
//                   <span className="priceSelling text-[15px] font-extrabold flex items-center gap-1">
//                     <FaRupeeSign /> {selling ?? "--"}
//                   </span>
//                   {mrp && mrp !== selling && (
//                     <span className="priceMrp text-[12px] font-extrabold flex items-center gap-1">
//                       <FaRupeeSign /> {mrp}
//                     </span>
//                   )}
//                 </div>

//                 <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-slate-600">
//                   <FaStar className="text-orange-500/90" />
//                   {ratingText}
//                 </span>
//               </div>
//             </div>

//             <div className="flex-shrink-0 md:ml-6 mt-4 md:mt-0">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onAddToCart(product);
//                 }}
//                 disabled={!stock}
//                 className={[
//                   "inline-flex items-center justify-center gap-2",
//                   "rounded-full px-5 py-2.5 text-white font-extrabold text-[12px]",
//                   "shadow-lg shadow-orange-500/25 hover:opacity-95 active:scale-[0.99] transition",
//                   stock
//                     ? "bg-gradient-to-r from-orange-500 to-amber-400"
//                     : "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none",
//                 ].join(" ")}
//               >
//                 <RiShoppingCart2Line />
//                 {stock ? "Add to Cart" : "Out of Stock"}
//               </button>
//             </div>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// }

//

// ✅ file: src/pages/shop_pages/SearchProducts.jsx
// ✅ FULL UPDATED CODE (NO BLANK PAGE EVER) + ✅ MOBILE FILTER DRAWER (Amazon/Flipkart)
// ✅ Desktop: same (sidebar visible)
// ✅ Mobile: sidebar hidden -> "Filters" sticky bar -> drawer opens with SAME FiltersSidebar
// ✅ Includes: overlay click close, ESC close, body scroll lock, extra bottom padding so bar won’t cover content

import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { AuthContext } from "../../components/auth_components/AuthManager";
import { CartContext } from "../../components/cart_components/CartContext";
import { WishlistContext } from "../../components/wishlist_components/WishlistContext";
import { useLocation, useNavigate } from "react-router-dom";

// icons
import {
  ChevronDown,
  ChevronRight,
  Tags,
  ListFilter,
  IndianRupee,
  X,
} from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import {
  FaTh,
  FaThList,
  FaIdBadge,
  FaRegHeart,
  FaHeart,
  FaRupeeSign,
  FaStar,
} from "react-icons/fa";
import { RiShoppingCart2Line, RiShoppingBag3Line } from "react-icons/ri";
import { FiTruck, FiRefreshCw, FiSliders, FiFilter } from "react-icons/fi";

let debounceTimeout;

// --------------------------- helpers ---------------------------
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
    if (typeof v.category_name === "string")
      return v.category_name.trim().toUpperCase();
    if (typeof v.subcategory_name === "string")
      return v.subcategory_name.trim().toUpperCase();
  }
  return "";
}
function getId(val) {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    if (val._id) return String(val._id);
    try {
      return String(val);
    } catch {
      return "";
    }
  }
  return String(val);
}
function getCategoryIdFromProduct(p) {
  return getId(p?.category?._id || p?.category);
}
function getSubcategoryIdFromProduct(p) {
  return getId(p?.subcategory?._id || p?.subcategory);
}
function getCategoryNameFromProduct(p) {
  return safeUpper(
    p?.category?.category_name || p?.category?.name || p?.category_name
  );
}
function getSubcategoryNameFromProduct(p) {
  return safeUpper(p?.subcategory?.subcategory_name || p?.subcategory_name);
}

// ===============================================================
// ✅ MAIN SEARCH PAGE (Shop-like fallback when no results) + Mobile Drawer
// ===============================================================
export default function SearchProducts() {
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);

  const [searchedBaseProducts, setSearchedBaseProducts] = useState([]);
  const [baseProducts, setBaseProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");

  const [showAnimatedMsg, setShowAnimatedMsg] = useState(false);
  const [animatedMsgProductName, setAnimatedMsgProductName] = useState("");
  const [localWishlist, setLocalWishlist] = useState([]);

  // ✅ NEW: Mobile filter drawer (same as Shop.jsx)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const { isLoggedIn } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, addToWishlist, removeFromWishlist, fetchWishlist } =
    useContext(WishlistContext);

  // ✅ lock body scroll when drawer open + ESC close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsFilterDrawerOpen(false);
    };

    if (isFilterDrawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isFilterDrawerOpen]);

  // ============================================================
  // ✅ FULL ROWS FIX (same as Shop.jsx)
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

  const rowsPerPage = viewMode === "grid" ? 3 : viewMode === "card" ? 3 : 14;
  const productsPerPage =
    viewMode === "list" ? 14 : Math.max(1, columns) * Math.max(1, rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [productsPerPage, viewMode, columns]);

  // ✅ read ?query= from URL
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("query") || "";
    setQuery(q);
  }, [location.search]);

  // ✅ fetch products + wishlist
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/all-added-products`
        );
        const products = res.data || [];
        const active = products.filter((p) => p?.isDeleted !== true);

        setAllProducts(active);
        setSearchedBaseProducts(active);
        setBaseProducts(active);
        setFilteredProducts(active);
      } catch (error) {
        console.error("Failed to fetch products:", error?.message || error);
      }
    };

    fetchData();
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ local wishlist ids cache
  useEffect(() => {
    const ids = wishlistItems.map((item) => item._id || item.product?._id);
    setLocalWishlist(ids);
  }, [wishlistItems]);

  // ✅ debounce search -> searchedBaseProducts
  useEffect(() => {
    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(() => {
      const lowerQuery = String(query || "")
        .toLowerCase()
        .trim();

      if (!lowerQuery) {
        setSearchedBaseProducts(allProducts);
        setBaseProducts(allProducts);
        setFilteredProducts(allProducts);
        setCurrentPage(1);
        return;
      }

      const matched = allProducts.filter((product) => {
        const name = product.product_name?.toLowerCase() || "";
        const desc = product.description?.toLowerCase() || "";
        const brand = product.brand?.toLowerCase() || "";
        const category =
          product.category?.category_name?.toLowerCase() ||
          product.category_name?.toLowerCase() ||
          "";
        const subcategory =
          product.subcategory?.subcategory_name?.toLowerCase() ||
          product.subcategory_name?.toLowerCase() ||
          "";
        const tags = (product.tags || []).map((tag) =>
          String(tag).toLowerCase()
        );

        return (
          name.includes(lowerQuery) ||
          desc.includes(lowerQuery) ||
          brand.includes(lowerQuery) ||
          category.includes(lowerQuery) ||
          subcategory.includes(lowerQuery) ||
          tags.some((tag) => tag.includes(lowerQuery))
        );
      });

      setSearchedBaseProducts(matched);

      const base = matched.length > 0 ? matched : allProducts;
      setBaseProducts(base);
      setFilteredProducts(base);
      setCurrentPage(1);
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
        setAnimatedMsgProductName(`${productName} removed from wishlist`);
      } else {
        await addToWishlist(productId, product);
        setAnimatedMsgProductName(`${productName} added to wishlist`);
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

  // pagination
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
  const showingNow = currentProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / productsPerPage));

  const isFallback = useMemo(() => {
    const q = String(query || "").trim();
    if (!q) return false;
    return searchedBaseProducts.length === 0 && allProducts.length > 0;
  }, [query, searchedBaseProducts.length, allProducts.length]);

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
      {/* ✅ EXACT SAME CSS AS Shop.jsx */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .shop-font{
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

        .shop-scope .priceSelling{ color: rgb(15,23,42); font-weight: 900; }
        .shop-scope .priceMrp{ color: rgb(239,68,68); font-weight: 800; text-decoration: line-through; }

        .sidebarWrap{ background: transparent !important; box-shadow: none !important; border: none !important; }

        .sidebarWrap .forceOrange,
        .sidebarWrap button.forceOrange{
          border-radius: 9999px !important;
          background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36)) !important;
          color: #fff !important;
          font-weight: 800 !important;
          font-size: 12px !important;
          box-shadow: 0 18px 30px -18px rgba(249,115,22,0.40) !important;
          border: none !important;
        }

        .paginationWrap button.activePage{
          background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36)) !important;
          color: #fff !important;
          border: none !important;
          box-shadow: 0 18px 30px -18px rgba(249,115,22,0.40) !important;
          border-radius: 9999px !important;
        }

        .tightCaps{ letter-spacing: .06em; }
      `}</style>

      {/* ✅ Mobile Filter Drawer (same as Shop.jsx) */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 h-full w-[92%] max-w-[420px] z-[70] bg-white shadow-2xl"
              initial={{ x: 420 }}
              animate={{ x: 0 }}
              exit={{ x: 420 }}
              transition={{ type: "tween", duration: 0.22 }}
            >
              <div className="h-full flex flex-col">
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiFilter className="text-slate-800" />
                    <p className="text-[14px] font-extrabold text-slate-900">
                      Filters
                    </p>
                    <span className="text-[12px] font-semibold text-slate-500">
                      ({totalCount})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 inline-flex items-center justify-center"
                    aria-label="Close filters"
                  >
                    <X className="h-5 w-5 text-slate-800" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <FiltersSidebar
                    allProducts={baseProducts}
                    onFilterChange={handleFilterChange}
                    initialQuery={query}
                  />
                </div>

                <div className="px-4 py-3 border-t border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="w-full rounded-full px-4 py-3 text-[12px] font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-400 shadow-lg shadow-orange-500/20 active:scale-[0.99]"
                  >
                    Show Results
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ✅ toast bubble identical */}
      <AnimatePresence>
        {showAnimatedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed top-16 sm:top-20 right-3 sm:right-4 z-50"
          >
            <div className="rounded-xl bg-white/95 backdrop-blur border border-slate-200 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                <p className="text-[11px] sm:text-[12px] font-semibold text-slate-800">
                  {animatedMsgProductName}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ FULL WIDTH background + CONTENT WRAPPER gutters (same as Shop.jsx) */}
      <div className="w-full">
        <div className="w-full px-3 sm:px-6 lg:px-10 2xl:px-16 py-4 sm:py-6">
          <div className="w-full max-w-[1700px] mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <RiShoppingBag3Line className="text-slate-800 text-[18px] sm:text-[20px]" />
                  <h1 className="text-[20px] sm:text-[24px] 2xl:text-[26px] font-extrabold tracking-tight text-slate-900 truncate">
                    {query ? `Results for "${query}"` : "Explore Products"}
                  </h1>

                  <span className="hidden sm:inline text-[12px] font-semibold text-slate-500">
                    ({totalCount} items)
                  </span>
                </div>

                <div className="mt-1 text-[11px] sm:text-[12px] text-slate-500 font-medium">
                  {totalCount === 0 ? (
                    <span className="font-semibold text-slate-700">
                      No products found
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
                      products
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

                {isFallback && (
                  <div className="mt-2 text-[12px] font-semibold text-slate-600">
                    No exact matches for{" "}
                    <span className="text-slate-900 font-extrabold">
                      "{query}"
                    </span>
                    . Showing all products — use filters to refine.
                  </div>
                )}
              </div>

              {/* View Toggle */}
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
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Layout */}
            <div className="mt-6 flex flex-col lg:flex-row gap-6 md:gap-10 xl:gap-14">
              {/* ✅ Desktop sidebar only */}
              <aside className="hidden lg:block w-full lg:w-[320px] xl:w-[340px] sidebarWrap">
                <div className="lg:sticky lg:top-20">
                  <FiltersSidebar
                    allProducts={baseProducts}
                    onFilterChange={handleFilterChange}
                    initialQuery={query}
                  />
                </div>
              </aside>

              {/* PRODUCTS */}
              <main className="w-full flex-1">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.16 }}
                >
                  {viewMode === "grid" && (
                    <ProductsGridUI
                      products={currentProducts}
                      wishlist={localWishlist}
                      onToggleWishlist={handleWishlistToggle}
                      onAddToCart={handleAddToCart}
                      onOpen={(id) => navigate(`/single-product/${id}`)}
                    />
                  )}

                  {viewMode === "card" && (
                    <ProductsCardUI
                      products={currentProducts}
                      wishlist={localWishlist}
                      onToggleWishlist={handleWishlistToggle}
                      onAddToCart={handleAddToCart}
                      onOpen={(id) => navigate(`/single-product/${id}`)}
                    />
                  )}

                  {viewMode === "list" && (
                    <ProductsListUI
                      products={currentProducts}
                      wishlist={localWishlist}
                      onToggleWishlist={handleWishlistToggle}
                      onAddToCart={handleAddToCart}
                      onOpen={(id) => navigate(`/single-product/${id}`)}
                    />
                  )}
                </motion.div>

                {filteredProducts.length > productsPerPage && (
                  <div className="mt-8 paginationWrap">
                    <Pagination
                      productsPerPage={productsPerPage}
                      totalProducts={filteredProducts.length}
                      currentPage={currentPage}
                      paginate={paginate}
                    />
                  </div>
                )}

                {/* ✅ extra bottom space so sticky mobile bar doesn’t cover content */}
                <div className="h-20 lg:hidden" />
              </main>
            </div>
          </div>
        </div>

        {/* ✅ Mobile sticky filter bar (same as Shop.jsx) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[55]">
          <div className="mx-auto max-w-[1700px] px-3 sm:px-6 pb-3">
            <div className="rounded-2xl bg-white/95 backdrop-blur border border-slate-200 shadow-lg px-3 py-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[12px] font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-400 shadow-lg shadow-orange-500/20 active:scale-[0.99]"
                >
                  <FiFilter className="text-[16px]" />
                  Filters
                </button>

                <div className="shrink-0 rounded-full bg-slate-100 px-4 py-3 text-[12px] font-extrabold text-slate-800">
                  {totalCount} items
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===============================================================
// ✅ FILTER SIDEBAR (IDENTICAL LOGIC TO Shop.jsx)
// ===============================================================
function FiltersSidebar({ allProducts, onFilterChange, initialQuery }) {
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [brands, setBrands] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedBrands, setExpandedBrands] = useState(false);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [tempPriceRange, setTempPriceRange] = useState([0, 1000]);

  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const buildTreeFromProducts = () => {
      const active = (allProducts || []).filter((p) => p?.isDeleted !== true);
      const map = new Map();

      for (const p of active) {
        const catId = getCategoryIdFromProduct(p);
        const subId = getSubcategoryIdFromProduct(p);
        if (!catId && !subId) continue;

        const catName = getCategoryNameFromProduct(p) || "UNCATEGORIZED";
        if (!map.has(catId || "UNCAT")) {
          map.set(catId || "UNCAT", {
            categoryId: catId || "UNCAT",
            categoryName: safeUpper(catName || "UNCATEGORIZED"),
            subMap: new Map(),
          });
        }

        const node = map.get(catId || "UNCAT");
        if (subId) {
          const subName = getSubcategoryNameFromProduct(p) || "OTHERS";
          if (!node.subMap.has(subId)) {
            node.subMap.set(subId, { id: subId, name: safeUpper(subName) });
          }
        }
      }

      const tree = Array.from(map.values())
        .map((c) => ({
          categoryId: String(c.categoryId),
          categoryName: String(c.categoryName || "").toUpperCase(),
          subcategories: Array.from(c.subMap.values()).sort((a, b) =>
            String(a.name).localeCompare(String(b.name))
          ),
        }))
        .sort((a, b) =>
          String(a.categoryName).localeCompare(String(b.categoryName))
        );

      setCategoriesTree(tree);
    };

    buildTreeFromProducts();
  }, [allProducts]);

  useEffect(() => {
    if (allProducts.length > 0) {
      const brandSet = new Set();
      allProducts.forEach((p) => {
        if (p?.brand && String(p.brand).trim() !== "") {
          brandSet.add(String(p.brand).trim().toUpperCase());
        }
      });
      setBrands([...brandSet]);

      const prices = allProducts
        .map((p) => p?.selling_price ?? p?.price ?? 0)
        .filter((p) => Number(p) > 0);
      const minP = prices.length ? Math.floor(Math.min(...prices)) : 0;
      const maxP = prices.length ? Math.ceil(Math.max(...prices)) : 1000;
      setMinPrice(minP);
      setMaxPrice(maxP);
      setTempPriceRange([minP, maxP]);
    }
  }, [allProducts]);

  const openOnlyThisCategory = useCallback((catName, open) => {
    setExpandedCategories(() => {
      if (!open) return {};
      return { [catName]: true };
    });
  }, []);

  useEffect(() => {
    if (!initialQuery || categoriesTree.length === 0) return;
    const q = initialQuery.trim().toLowerCase();
    if (!q) return;

    let matched = false;

    for (const cat of categoriesTree) {
      if (String(cat.categoryName || "").toLowerCase() === q) {
        setSelectedCategory(cat.categoryId);
        setSelectedSubCategory(null);
        if ((cat.subcategories || []).length > 0) {
          openOnlyThisCategory(cat.categoryName, true);
        } else {
          openOnlyThisCategory("", false);
        }
        matched = true;
        break;
      }

      for (const sub of cat.subcategories || []) {
        if (String(sub.name || "").toLowerCase() === q) {
          setSelectedSubCategory(sub.id);
          setSelectedCategory(null);
          if ((cat.subcategories || []).length > 0) {
            openOnlyThisCategory(cat.categoryName, true);
          }
          matched = true;
          break;
        }
      }
      if (matched) break;
    }

    if (!matched && brands.length > 0) {
      const brandMatch = brands.find((b) => String(b).toLowerCase() === q);
      if (brandMatch) setSelectedBrands([brandMatch]);
    }
  }, [initialQuery, categoriesTree, brands, openOnlyThisCategory]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCategory,
    selectedSubCategory,
    selectedBrands,
    tempPriceRange,
    sortOption,
    categoriesTree,
  ]);

  const applyFilters = () => {
    let filtered = [...allProducts].filter((p) => p?.isDeleted !== true);

    if (selectedCategory) {
      const selectedCatId = String(selectedCategory);
      const catNode = categoriesTree.find(
        (c) => String(c.categoryId) === selectedCatId
      );

      const subIdsUnderCat = new Set(
        (catNode?.subcategories || []).map((s) => String(s.id))
      );

      filtered = filtered.filter((p) => {
        const productCatId = String(getCategoryIdFromProduct(p));
        const productSubId = String(getSubcategoryIdFromProduct(p));
        return (
          productCatId === selectedCatId || subIdsUnderCat.has(productSubId)
        );
      });
    }

    if (selectedSubCategory) {
      const selectedSubId = String(selectedSubCategory);
      filtered = filtered.filter(
        (p) => String(getSubcategoryIdFromProduct(p)) === selectedSubId
      );
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) =>
        selectedBrands.includes(String(p?.brand || "").toUpperCase())
      );
    }

    filtered = filtered.filter((p) => {
      const price = p?.selling_price ?? p?.price ?? 0;
      return price >= tempPriceRange[0] && price <= tempPriceRange[1];
    });

    filtered.sort((a, b) => {
      const priceA = a?.selling_price ?? a?.price ?? 0;
      const priceB = b?.selling_price ?? b?.price ?? 0;

      if (sortOption === "priceLowHigh") return priceA - priceB;
      if (sortOption === "priceHighLow") return priceB - priceA;
      if (sortOption === "latest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOption === "popularity") return (b.views ?? 0) - (a.views ?? 0);
      return 0;
    });

    onFilterChange(filtered);
  };

  const handleClearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setTempPriceRange([minPrice, maxPrice]);
    setSortOption("");
    setExpandedCategories({});
    onFilterChange(allProducts.filter((p) => p?.isDeleted !== true));
  };

  const isActive = (id, current) => String(id) === String(current);

  const toggleSingleCategory = (catName) => {
    setExpandedCategories((prev) => {
      const isOpen = !!prev[catName];
      if (isOpen) return {};
      return { [catName]: true };
    });
  };

  return (
    <motion.div
      className="w-full rounded-xl space-y-6"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
    >
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClearFilters}
          className="btnOrange w-full uppercase forceOrange"
        >
          Clear Filters
        </motion.button>
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center gap-2 mb-2 font-extrabold text-slate-700 uppercase text-[12px] tightCaps">
          <ListFilter size={16} /> Categories
        </div>

        <div className="space-y-1">
          {categoriesTree.map((cat, idx) => {
            const hasSubs = (cat.subcategories || []).length > 0;
            const isOpen = !!expandedCategories[cat.categoryName];

            return (
              <div key={idx}>
                <div className="flex items-center justify-between text-[12px] font-extrabold text-slate-700 uppercase tightCaps">
                  <span
                    className={`cursor-pointer transition ${
                      isActive(cat.categoryId, selectedCategory)
                        ? "text-orange-600"
                        : "hover:text-slate-900"
                    }`}
                    onClick={() => {
                      setSelectedCategory(cat.categoryId);
                      setSelectedSubCategory(null);

                      if (hasSubs) {
                        toggleSingleCategory(cat.categoryName);
                      } else {
                        setExpandedCategories({});
                      }
                    }}
                  >
                    {cat.categoryName}
                  </span>

                  {hasSubs && (
                    <motion.span
                      className="cursor-pointer"
                      onClick={() => toggleSingleCategory(cat.categoryName)}
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.span>
                  )}
                </div>

                <AnimatePresence initial={false}>
                  {hasSubs && isOpen && (
                    <motion.div
                      className="pl-4 mt-1 space-y-1"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28 }}
                    >
                      {cat.subcategories.map((subcat, idx2) => (
                        <div
                          key={idx2}
                          className={`text-[12px] uppercase cursor-pointer transition font-bold tightCaps ${
                            isActive(subcat.id, selectedSubCategory)
                              ? "text-orange-600"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                          onClick={() => {
                            setSelectedSubCategory(subcat.id);
                            setSelectedCategory(null);
                          }}
                        >
                          {subcat.name}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div>
        <div className="flex items-center gap-2 mb-2 font-extrabold text-slate-700 uppercase text-[12px] tightCaps">
          <Tags size={16} /> Brands
        </div>

        <div
          className="flex items-center justify-between text-[12px] font-extrabold text-slate-700 uppercase cursor-pointer tightCaps"
          onClick={() => setExpandedBrands((prev) => !prev)}
        >
          <span>All Brands</span>
          {expandedBrands ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </div>

        <AnimatePresence>
          {expandedBrands && (
            <motion.div
              className="pl-4 mt-2 space-y-2"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              {brands.map((brand, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 uppercase transition font-extrabold cursor-pointer text-[12px] tightCaps ${
                    selectedBrands.includes(brand)
                      ? "text-orange-600"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                  onClick={() => {
                    let updated = [...selectedBrands];
                    if (updated.includes(brand))
                      updated = updated.filter((b) => b !== brand);
                    else updated.push(brand);
                    setSelectedBrands(updated);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    readOnly
                    className="accent-orange-500"
                  />
                  <span className="truncate">{brand}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center gap-2 mb-2 font-extrabold text-slate-700 uppercase text-[12px] tightCaps">
          <IndianRupee size={16} /> Price Range
        </div>

        <div className="px-2">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            min={minPrice}
            max={maxPrice}
            step={10}
            value={tempPriceRange}
            onValueChange={(value) => setTempPriceRange(value)}
          >
            <Slider.Track className="bg-slate-200 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-orange-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-orange-500 rounded-full focus:outline-none" />
            <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-orange-500 rounded-full focus:outline-none" />
          </Slider.Root>

          <div className="text-[12px] flex justify-between mt-2 text-slate-600 font-bold uppercase tightCaps">
            <span>₹{tempPriceRange[0]}</span>
            <span>₹{tempPriceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <div className="flex items-center gap-2 mb-3 font-extrabold text-slate-700 uppercase text-[12px] tightCaps">
          <ListFilter size={16} /> Sort By
        </div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="flex flex-wrap gap-2"
        >
          {[
            { value: "", label: "Default" },
            { value: "priceLowHigh", label: "Price ↑" },
            { value: "priceHighLow", label: "Price ↓" },
            { value: "latest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
            { value: "popularity", label: "Popular" },
          ].map((option) => {
            const active = sortOption === option.value;
            return (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSortOption(option.value)}
                className={
                  active
                    ? "btnOrange uppercase forceOrange"
                    : "rounded-full px-3 py-2 text-[11px] font-extrabold uppercase bg-slate-100 text-slate-700 hover:bg-slate-200"
                }
                style={!active ? { boxShadow: "none" } : undefined}
              >
                {option.label}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ===============================================================
// ✅ PAGINATION
// ===============================================================
function Pagination({ productsPerPage, totalProducts, currentPage, paginate }) {
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <div className="flex justify-center mt-6">
      <nav className="inline-flex flex-wrap gap-2 justify-center">
        {pageNumbers.map((number) => {
          const active = currentPage === number;
          return (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={
                active
                  ? "activePage px-4 py-2 text-[12px] font-extrabold"
                  : "px-4 py-2 rounded-full text-[12px] font-extrabold bg-white text-slate-700 hover:bg-slate-100"
              }
              style={
                !active ? { border: "1px solid rgb(226,232,240)" } : undefined
              }
            >
              {number}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ===============================================================
// ✅ PRODUCT UIs (same spacing as Shop.jsx)
// ===============================================================
function ProductsGridUI({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onOpen,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-10 lg:gap-y-12">
      {products.map((p, idx) => {
        const id = p?._id ?? `${idx}`;
        const inWish = Array.isArray(wishlist)
          ? wishlist.includes(p?._id)
          : false;

        const selling = money(p?.selling_price ?? p?.price ?? p?.final_price);
        const mrp = money(p?.actual_price ?? p?.display_price ?? p?.mrp_price);
        const brand = safeUpper(p?.brand);
        const cat = safeUpper(p?.category_name ?? p?.category);
        const stock = !!p?.availability_status;

        const rating = Number(p?.rating ?? p?.avg_rating ?? 4.3);
        const ratingText = Number.isFinite(rating) ? rating.toFixed(1) : "4.3";

        return (
          <motion.div
            key={id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.18 }}
            className="group relative rounded-2xl bg-white"
            style={{ boxShadow: "none", border: "none" }}
          >
            <div
              className="relative rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => onOpen(p?._id)}
            >
              <img
                src={resolveImage(p)}
                alt={p?.product_name || "Product"}
                loading="lazy"
                className="w-full aspect-square object-cover"
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(p);
                }}
                className="absolute top-2 right-2 h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition hover:bg-white"
                aria-label="Toggle wishlist"
                title="Wishlist"
                style={{ boxShadow: "none", border: "none" }}
              >
                {inWish ? (
                  <FaHeart className="text-orange-600" />
                ) : (
                  <FaRegHeart className="text-slate-600" />
                )}
              </button>
            </div>

            <div className="mt-3 px-0.5 space-y-1.5">
              <p className="text-[12px] sm:text-[13px] font-extrabold text-slate-900 leading-snug truncate">
                {p?.product_name || "Unnamed product"}
              </p>

              <p className="mt-1 text-[11px] font-semibold text-slate-500 truncate">
                {brand || cat || "POPULAR PICK"} •{" "}
                {stock ? "FAST DELIVERY" : "RESTOCKING"}
              </p>

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

              <div className="mt-2 flex items-baseline gap-2">
                <span className="priceSelling text-[13px] sm:text-[14px]">
                  ₹{selling ?? "--"}
                </span>
                {mrp && mrp !== selling && (
                  <span className="priceMrp text-[11px]">₹{mrp}</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => onAddToCart(p)}
                disabled={!stock}
                className={[
                  "mt-3 w-full inline-flex items-center justify-center gap-2",
                  "rounded-full px-4 sm:px-5 py-2.5 text-white font-extrabold text-[11.5px] sm:text-[12px]",
                  "shadow-lg shadow-orange-500/25 hover:opacity-95 active:scale-[0.99] transition",
                  stock
                    ? "bg-gradient-to-r from-orange-500 to-amber-400"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none",
                ].join(" ")}
              >
                <RiShoppingCart2Line className="text-[15px]" />
                {stock ? "Add to cart" : "Out of stock"}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function ProductsCardUI({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onOpen,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 sm:gap-x-8 gap-y-10 sm:gap-y-12">
      {products.map((product) => {
        const inWish = Array.isArray(wishlist)
          ? wishlist.includes(product._id)
          : false;

        const selling = money(
          product?.selling_price ?? product?.price ?? product?.final_price
        );
        const mrp = money(
          product?.display_price ?? product?.actual_price ?? product?.mrp_price
        );

        const brand = safeUpper(product?.brand);
        const cat = safeUpper(product?.category_name ?? product?.category);
        const stock = !!product?.availability_status;

        const rating = Number(product?.rating ?? product?.avg_rating ?? 4.4);
        const ratingText = Number.isFinite(rating) ? rating.toFixed(1) : "4.4";

        return (
          <motion.div
            key={product._id}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="relative group rounded-2xl bg-white overflow-hidden"
            style={{
              boxShadow: "none",
              border: "1px solid rgba(241,245,249,1)",
            }}
          >
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(product);
                }}
                className="bg-white/90 backdrop-blur p-2 rounded-full transition"
                style={{
                  boxShadow: "none",
                  border: "1px solid rgba(241,245,249,1)",
                }}
              >
                {inWish ? (
                  <FaHeart className="w-5 h-5 text-orange-600" />
                ) : (
                  <FaRegHeart className="w-5 h-5 text-slate-500" />
                )}
              </button>
            </div>

            <div
              className="w-full h-52 sm:h-56 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => onOpen(product._id)}
            >
              <img
                src={resolveImage(product)}
                alt={product.product_name}
                loading="lazy"
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div
              onClick={() => onOpen(product._id)}
              className="p-4 space-y-2 cursor-pointer"
            >
              <h3 className="text-[14px] sm:text-[15px] font-extrabold text-slate-900 truncate">
                {product.product_name}
              </h3>

              <p className="text-[12px] text-slate-500 font-semibold truncate">
                {brand || cat || "POPULAR"} • FAST DELIVERY • EASY RETURNS
              </p>

              <p className="text-[12px] text-slate-500 line-clamp-2">
                {(product.description || "").slice(0, 90)}
                {(product.description || "").length > 90 ? "..." : ""}
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

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                disabled={!stock}
                className={[
                  "w-full mt-3 py-2.5 text-center rounded-full font-extrabold text-[12px]",
                  "shadow-lg shadow-orange-500/25 hover:opacity-95 active:scale-[0.99] transition",
                  stock
                    ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none",
                ].join(" ")}
              >
                {stock ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <RiShoppingCart2Line className="text-[15px]" />
                    Add to Cart
                  </span>
                ) : (
                  "Out of Stock"
                )}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function ProductsListUI({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onOpen,
}) {
  return (
    <div className="space-y-10 sm:space-y-12">
      {products.map((product) => {
        const inWish = Array.isArray(wishlist)
          ? wishlist.includes(product._id)
          : false;

        const selling = money(
          product?.selling_price ?? product?.price ?? product?.final_price
        );
        const mrp = money(
          product?.display_price ?? product?.actual_price ?? product?.mrp_price
        );
        const stock = !!product?.availability_status;

        const rating = Number(product?.rating ?? product?.avg_rating ?? 4.2);
        const ratingText = Number.isFinite(rating) ? rating.toFixed(1) : "4.2";

        return (
          <motion.div
            key={product._id}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.16 }}
            className="flex flex-col md:flex-row items-stretch md:items-center bg-white rounded-2xl transition group relative"
            style={{ boxShadow: "none", border: "1px solid rgb(241,245,249)" }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full"
              style={{
                boxShadow: "none",
                border: "1px solid rgb(241,245,249)",
              }}
              aria-label="Toggle wishlist"
            >
              {inWish ? (
                <FaHeart className="w-5 h-5 text-orange-600" />
              ) : (
                <FaRegHeart className="w-5 h-5 text-slate-500" />
              )}
            </button>

            <div
              onClick={() => onOpen(product._id)}
              className="w-full md:w-44 h-52 md:h-44 bg-slate-50 rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer"
            >
              <img
                src={resolveImage(product)}
                alt={product.product_name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            <div
              onClick={() => onOpen(product._id)}
              className="flex flex-col justify-center md:ml-6 mt-4 md:mt-0 w-full cursor-pointer px-3 md:px-0 pb-3 md:pb-0"
            >
              <h2 className="text-[16px] sm:text-[18px] font-extrabold text-slate-900 truncate">
                {product.product_name}
              </h2>

              <p className="text-slate-500 text-[12px] mt-1 line-clamp-2">
                {(product.description || "").slice(0, 120)}
                {(product.description || "").length > 120 ? "..." : ""}
              </p>

              <p className="mt-2 text-[11px] font-semibold text-slate-500">
                {safeUpper(product.brand) ||
                  safeUpper(product.category_name) ||
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
            </div>

            <div className="flex-shrink-0 md:ml-6 px-3 pb-4 md:pb-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                disabled={!stock}
                className={[
                  "w-full md:w-auto inline-flex items-center justify-center gap-2",
                  "rounded-full px-5 py-2.5 text-white font-extrabold text-[12px]",
                  "shadow-lg shadow-orange-500/25 hover:opacity-95 active:scale-[0.99] transition",
                  stock
                    ? "bg-gradient-to-r from-orange-500 to-amber-400"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none",
                ].join(" ")}
              >
                <RiShoppingCart2Line />
                {stock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
