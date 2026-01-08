// ✅ file: src/pages/shop_pages/Shop.jsx
// ✅ SINGLE FILE: Shop + FiltersSidebar + Pagination + Product views (grid/card/list)
// ✅ NO FUNCTIONALITY LOST (logic preserved):
// - FiltersSidebar logic preserved (categories/subcategories/brands/price/sort/clear + initialQuery match)
// - Wishlist + Cart logic preserved
// - Pagination logic preserved
// - View modes preserved
// ✅ UI requirements satisfied:
// - Your exact orange→amber gradient button style used for: Clear Filters, Sort buttons, Pagination, Add to Cart, etc.
// - Prices: selling = dark, display/MRP = red + line-through
// - Full width, more gap between sidebar and main
// - Sidebar: no bright gradients, no shadow/border, modern compact typography
// - Product tiles: no border/shadow in grid; compact layout (>=5 columns on desktop, min 2 columns on mobile)
// - Lots of subtle animations (fast, optimized)
// NOTE: Requires: lucide-react, @radix-ui/react-slider, framer-motion, react-icons, react-router-dom, axios, toastify
// NOTE: Keep your existing contexts + backend routes the same.

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
import { useNavigate, useSearchParams } from "react-router-dom";

// icons
import {
  ChevronDown,
  ChevronRight,
  Tags,
  ListFilter,
  IndianRupee,
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
import { FiTruck, FiRefreshCw, FiSliders, FiZap } from "react-icons/fi";

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
  }
  return "";
}

// ===============================================================
// ✅ MAIN SHOP
// ===============================================================
export default function Shop() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");

  const [showAnimatedMsg, setShowAnimatedMsg] = useState(false);
  const [animatedMsgProductName, setAnimatedMsgProductName] = useState("");
  const [localWishlist, setLocalWishlist] = useState([]);

  const { isLoggedIn } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, addToWishlist, removeFromWishlist, fetchWishlist } =
    useContext(WishlistContext);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const productsPerPage =
    viewMode === "grid" ? 20 : viewMode === "card" ? 14 : 14;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/all-added-products`
        );
        const products = res.data || [];
        setAllProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error.message);
      }
    };
    fetchData();
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchWishlist();
      setLocalWishlist(wishlistItems.map((item) => item._id));
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlistItems.length]);

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

    const wishlistIds = wishlistItems.map(
      (item) => item._id || item.product?._id
    );

    try {
      if (wishlistIds.includes(productId)) {
        await removeFromWishlist(productId);
        await fetchWishlist();
      } else {
        const success = await addToWishlist(productId, product);
        if (success) await fetchWishlist();
      }

      setAnimatedMsgProductName(
        wishlistIds.includes(productId)
          ? `${productName} removed from wishlist`
          : `${productName} added to wishlist`
      );
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

        /* ✅ PRICE COLORS (global within shop) */
        .shop-scope .priceSelling{
          color: rgb(15,23,42);
          font-weight: 900;
        }
        .shop-scope .priceMrp{
          color: rgb(239,68,68);
          font-weight: 800;
          text-decoration: line-through;
        }

        /* Sidebar: remove bright backgrounds/shadows/borders wherever possible */
        .sidebarWrap{
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
        }

        /* Force ALL sidebar primary action buttons to your gradient (Clear, Sort pills if buttons) */
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

        /* Pagination active button */
        .paginationWrap button.activePage{
          background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36)) !important;
          color: #fff !important;
          border: none !important;
          box-shadow: 0 18px 30px -18px rgba(249,115,22,0.40) !important;
          border-radius: 9999px !important;
        }

        /* Minor typography tightening */
        .tightCaps{ letter-spacing: .06em; }

        /* Performance: reduce paint-heavy stuff */
        .no-shadow{ box-shadow:none !important; }
      `}</style>

      {/* toast */}
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

      <div className="w-full px-3 sm:px-5 lg:px-8 py-4">
        {/* header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <RiShoppingBag3Line className="text-slate-800" />
              <h1 className="text-[20px] sm:text-[24px] font-extrabold tracking-tight text-slate-900">
                Shop
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

        {/* ✅ More gap between sidebar and main */}
        <div className="mt-4 flex flex-col lg:flex-row gap-14 xl:gap-16 2xl:gap-20">
          {/* SIDEBAR (merged) */}
          <aside className="w-full lg:w-[320px] xl:w-[340px] sidebarWrap">
            <div className="sticky top-20">
              <FiltersSidebar
                allProducts={allProducts}
                onFilterChange={handleFilterChange}
                initialQuery={initialQuery}
              />
            </div>
          </aside>

          {/* PRODUCTS (merged rendering) */}
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
              <div className="mt-6 paginationWrap">
                <Pagination
                  productsPerPage={productsPerPage}
                  totalProducts={filteredProducts.length}
                  currentPage={currentPage}
                  paginate={paginate}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ===============================================================
// ✅ MERGED FILTER SIDEBAR (same logic as your file)
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
    fetchCategoriesAndSubcategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      fetchBrands();
      calculatePriceRange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProducts]);

  useEffect(() => {
    if (
      !initialQuery ||
      allProducts.length === 0 ||
      categoriesTree.length === 0 ||
      brands.length === 0
    )
      return;

    const q = initialQuery.toLowerCase();
    let matched = false;

    for (let cat of categoriesTree) {
      if (cat.categoryName.toLowerCase() === q) {
        setSelectedCategory(cat.categoryId);
        setSelectedSubCategory(null);
        matched = true;
        break;
      }

      for (let sub of cat.subcategories) {
        if (sub.name.toLowerCase() === q) {
          setSelectedSubCategory(sub.id);
          setSelectedCategory(null);
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      const brandMatch = brands.find((b) => b.toLowerCase() === q);
      if (brandMatch) setSelectedBrands([brandMatch]);
    }
  }, [initialQuery, allProducts, categoriesTree, brands]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCategory,
    selectedSubCategory,
    selectedBrands,
    tempPriceRange,
    sortOption,
  ]);

  const fetchCategoriesAndSubcategories = async () => {
    try {
      const [catRes, subCatRes] = await Promise.all([
        axios.get(`${globalBackendRoute}/api/all-categories`),
        axios.get(`${globalBackendRoute}/api/all-subcategories`),
      ]);
      const categories = catRes.data || [];
      const subcategories = subCatRes.data || [];

      const tree = categories.map((cat) => ({
        categoryId: cat._id,
        categoryName: String(cat.name || "").toUpperCase(),
        subcategories: subcategories
          .filter((sub) => sub.category?._id === cat._id)
          .map((sub) => ({
            id: sub._id,
            name: String(sub.subcategory_name || "").toUpperCase(),
          })),
      }));

      setCategoriesTree(tree);
    } catch (error) {
      console.error("Failed to fetch categories/subcategories:", error);
    }
  };

  const fetchBrands = () => {
    const brandSet = new Set();
    allProducts.forEach((p) => {
      if (p.brand && String(p.brand).trim() !== "") {
        brandSet.add(String(p.brand).trim().toUpperCase());
      }
    });
    setBrands([...brandSet]);
  };

  const calculatePriceRange = () => {
    const prices = allProducts
      .map((p) => p.selling_price ?? p.price ?? 0)
      .filter((p) => Number(p) > 0);

    const minP = prices.length ? Math.floor(Math.min(...prices)) : 0;
    const maxP = prices.length ? Math.ceil(Math.max(...prices)) : 1000;
    setMinPrice(minP);
    setMaxPrice(maxP);
    setTempPriceRange([minP, maxP]);
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category?._id === selectedCategory);
    }

    // Subcategory filter
    if (selectedSubCategory) {
      filtered = filtered.filter(
        (p) => p.subcategory?._id === selectedSubCategory
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) =>
        selectedBrands.includes(String(p.brand || "").toUpperCase())
      );
    }

    // Price range filter
    filtered = filtered.filter((p) => {
      const price = p.selling_price ?? p.price ?? 0;
      return price >= tempPriceRange[0] && price <= tempPriceRange[1];
    });

    // Sorting logic (same)
    filtered.sort((a, b) => {
      const priceA = a.selling_price ?? a.price ?? 0;
      const priceB = b.selling_price ?? b.price ?? 0;

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
    onFilterChange(allProducts);
  };

  const isActive = (id, current) => id === current;

  return (
    <motion.div
      className="w-full space-y-6"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      style={{ boxShadow: "none", border: "none" }}
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
          {categoriesTree.map((cat, idx) => (
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
                  }}
                >
                  {cat.categoryName}
                </span>

                <motion.span
                  className="cursor-pointer"
                  onClick={() =>
                    setExpandedCategories((prev) => ({
                      ...prev,
                      [cat.categoryName]: !prev[cat.categoryName],
                    }))
                  }
                  animate={{
                    rotate: expandedCategories[cat.categoryName] ? 90 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.span>
              </div>

              <AnimatePresence initial={false}>
                {expandedCategories[cat.categoryName] && (
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
          ))}
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
// ✅ MERGED PAGINATION (same logic, themed)
// ===============================================================
function Pagination({ productsPerPage, totalProducts, currentPage, paginate }) {
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <div className="flex justify-center mt-6">
      <nav className="inline-flex flex-wrap gap-2">
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
// ✅ PRODUCT UIs (merged from grid/card/list)
// ===============================================================
function ProductsGridUI({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onOpen,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  xl:grid-cols-6  gap-x-8 xl:gap-x-10  gap-y-12 xl:gap-y-14">
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
            style={{ boxShadow: "none", border: "none" }} // ✅ no border/shadow in grid
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
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/10 to-transparent" />

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
              <p
                className="text-[12px] sm:text-[13px] font-extrabold text-slate-900 leading-snug truncate"
                title={p?.product_name}
              >
                {p?.product_name || "Unnamed product"}
              </p>

              {/* extra text under product */}
              <p className="mt-1 text-[11px] font-semibold text-slate-500 truncate">
                {brand || cat || "POPULAR PICK"} •{" "}
                {stock ? "FAST DELIVERY" : "RESTOCKING"}
              </p>

              {/* extra meta row */}
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <span className="inline-flex items-center gap-1">
                  <FaStar className="text-orange-500/90" />
                  {ratingText}
                </span>
                <span className="inline-flex items-center gap-2">
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
                  "rounded-full px-5 py-2.5 text-white font-extrabold text-[12px]",
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
  // ✅ card mode: includes your requested ProductCard UI but modernized:
  // - Removes heavy border/shadow brightness
  // - Uses orange theme button
  // - Prices: selling dark, MRP red
  return (
    <div className=" grid  grid-cols-1  sm:grid-cols-2  lg:grid-cols-3  xl:grid-cols-4  gap-x-10 xl:gap-x-12  gap-y-14 xl:gap-y-16">
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
              border: "1px solid rgba(241,245,249,1)", // very subtle (not red)
            }}
          >
            {/* Wishlist Icon */}
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

            {/* Image Section */}
            <div
              className="w-full h-56 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => onOpen(product._id)}
            >
              <img
                src={resolveImage(product)}
                alt={product.product_name}
                loading="lazy"
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Info Section */}
            <div
              onClick={() => onOpen(product._id)}
              className="p-4 space-y-2 cursor-pointer"
            >
              <h3 className="text-[15px] font-extrabold text-slate-900 truncate">
                {product.product_name}
              </h3>

              {/* extra text */}
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
    <div className="space-y-14">
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
            className="flex flex-col md:flex-row items-center bg-white  rounded-2xl transition group relative"
            style={{
              boxShadow: "none",
              border: "1px solid rgb(241,245,249)",
            }}
          >
            {/* wishlist */}
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

            {/* image */}
            <div
              onClick={() => onOpen(product._id)}
              className="w-full md:w-44 h-44 bg-slate-50 rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer"
            >
              <img
                src={resolveImage(product)}
                alt={product.product_name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* info */}
            <div
              onClick={() => onOpen(product._id)}
              className="flex flex-col justify-center md:ml-6 mt-4 md:mt-0 w-full cursor-pointer"
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

            {/* add to cart */}
            <div className="flex-shrink-0 md:ml-6 mt-4 md:mt-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                disabled={!stock}
                className={[
                  "inline-flex items-center justify-center gap-2",
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
