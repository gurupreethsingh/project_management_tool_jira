import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaCartPlus,
  FaRupeeSign,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import { toast } from "react-toastify";
import { CartContext } from "../../components/cart_components/CartContext";
import { motion } from "framer-motion";
import { FaAmazonPay } from "react-icons/fa6";
import { MdFindReplace } from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci";
import { TbBrandBeats } from "react-icons/tb";
import { PiAppleLogoThin } from "react-icons/pi";
import {
  FiChevronLeft,
  FiChevronRight,
  FiInfo,
  FiPackage,
} from "react-icons/fi";
import { RiShieldCheckLine, RiArrowLeftSLine } from "react-icons/ri";

const getStoredToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("userToken") ||
  "";

const getRatingValue = (item) => {
  const value =
    item?.rating ??
    item?.stars ??
    item?.star ??
    item?.ratingValue ??
    item?.value ??
    0;

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const getProductRatings = (product) => {
  const reviews = Array.isArray(product?.reviews)
    ? product.reviews
    : Array.isArray(product?.ratings)
      ? product.ratings
      : [];

  const calculatedTotalReviews = reviews.length;

  const calculatedAvgRating =
    calculatedTotalReviews > 0
      ? reviews.reduce((sum, item) => sum + getRatingValue(item), 0) /
        calculatedTotalReviews
      : 0;

  const totalReviews = Number(
    product?.total_reviews ??
      product?.totalReviews ??
      product?.total_ratings ??
      product?.totalRatings ??
      product?.review_count ??
      product?.reviewCount ??
      product?.rating_count ??
      product?.ratingCount ??
      calculatedTotalReviews ??
      0,
  );

  const avgRating = Number(
    product?.avg_rating ??
      product?.average_rating ??
      product?.averageRating ??
      product?.avgRating ??
      product?.rating_average ??
      product?.ratingAverage ??
      product?.rating ??
      calculatedAvgRating ??
      0,
  );

  const safeTotalReviews = Number.isFinite(totalReviews)
    ? totalReviews
    : calculatedTotalReviews;

  const safeAvgRating = Number.isFinite(avgRating)
    ? avgRating
    : calculatedAvgRating;

  return {
    reviews,
    totalReviews: safeTotalReviews,
    avgRating: safeAvgRating,
    roundedRating: Math.round(safeAvgRating),
  };
};

const SingleProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [zoomStyle, setZoomStyle] = useState({});
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState([]);

  const getImageUrl = useCallback((img) => {
    if (!img) return "https://via.placeholder.com/600x600";
    const fileName = String(img).replace(/\\/g, "/").split("/").pop();
    return `${globalBackendRoute}/uploads/products/${fileName}`;
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/get-single-added-product-by-id/${id}`,
        );

        const productData = res.data?.product || res.data?.data || res.data;

        setProduct(productData);
        setMainImage(productData.product_image);

        if (productData?.category?._id) {
          const catId = productData.category._id;
          const productsRes = await axios.get(
            `${globalBackendRoute}/api/get-products-by-category/${catId}`,
          );
          setCategoryProducts(
            (productsRes.data || []).filter((p) => p._id !== productData._id),
          );
        }
      } catch (error) {
        console.error("Failed to load product:", error.message);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const saveViewHistory = async () => {
      const token = getStoredToken();
      if (!token || !product?._id) return;

      try {
        await axios.post(
          `${globalBackendRoute}/api/user-history/add-view`,
          { productId: product._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (error) {
        console.error("Failed to save product view history:", error);
      }
    };

    saveViewHistory();
  }, [product?._id]);

  const images = useMemo(
    () => [product?.product_image, ...(product?.all_product_images || [])],
    [product],
  );

  const handleZoom = useCallback(
    (e) => {
      const { offsetX, offsetY, target } = e.nativeEvent;
      const { offsetWidth, offsetHeight } = target;
      const x = (offsetX / offsetWidth) * 100;
      const y = (offsetY / offsetHeight) * 100;

      setZoomStyle({
        backgroundImage: `url(${getImageUrl(mainImage)})`,
        backgroundPosition: `${x}% ${y}%`,
        backgroundSize: "200%",
      });
    },
    [mainImage, getImageUrl],
  );

  const handleAddToCart = useCallback(() => {
    if (product?.availability_status) {
      addToCart({ ...product, quantity });
    } else {
      toast.error("Out of Stock");
    }
  }, [product, quantity, addToCart]);

  const changeQuantity = useCallback((type) => {
    setQuantity((prev) =>
      type === "inc" ? prev + 1 : prev > 1 ? prev - 1 : 1,
    );
  }, []);

  const handleBuyNow = () => {
    if (!product?.availability_status) {
      toast.error("Out of Stock");
      return;
    }
    addToCart({ ...product, quantity });
    navigate("/checkout");
  };

  const scrollCarousel = (dir) => {
    const el = document.getElementById("catCarousel");
    if (!el) return;
    el.scrollLeft += dir * 340;
  };

  if (!product) {
    return (
      <div className="w-full py-20 text-center">
        <div className="inline-flex items-center gap-2 text-slate-500 font-semibold">
          <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          Loading product...
        </div>
      </div>
    );
  }

  const selling = product?.selling_price ?? product?.price ?? "";
  const display = product?.display_price ?? "";
  const { totalReviews, avgRating, roundedRating } = getProductRatings(product);

  return (
    <div className="sp-font sp-scope w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .sp-font{
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }

        .btnOrange{
          border-radius: 9999px;
          background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36));
          padding: 0.75rem 1.25rem;
          color: white;
          font-weight: 800;
          font-size: 14px;
          box-shadow: 0 18px 30px -18px rgba(249,115,22,0.45);
          transition: opacity .15s ease, transform .15s ease;
        }
        .btnOrange:hover{ opacity: .95; }
        .btnOrange:active{ transform: scale(.99); }

        .btnGhost{
          border-radius: 9999px;
          padding: 0.75rem 1.1rem;
          font-weight: 800;
          font-size: 13px;
          color: rgb(30,41,59);
          background: rgba(241,245,249,.7);
          transition: background .15s ease, transform .15s ease;
        }
        .btnGhost:hover{ background: rgba(226,232,240,.9); }
        .btnGhost:active{ transform: scale(.99); }

        .priceSelling{ color: rgb(15,23,42); font-weight: 900; }
        .priceMrp{ color: rgb(239,68,68); font-weight: 800; text-decoration: line-through; }

        .hide-scrollbar::-webkit-scrollbar{ display:none; }
        .hide-scrollbar{ -ms-overflow-style:none; scrollbar-width:none; }

        .thumbActive{
          outline: 2px solid rgba(249,115,22,.65);
          outline-offset: 2px;
        }
      `}</style>

      <div className="w-full">
        <div className="w-full px-3 sm:px-6 lg:px-10 2xl:px-16 py-5 sm:py-6">
          <div className="w-full max-w-[1700px] mx-auto">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-[12px] font-extrabold text-slate-600 hover:text-slate-900 transition"
              >
                <RiArrowLeftSLine className="text-[16px]" />
                Back
              </button>

              <div className="hidden sm:flex items-center gap-2 text-[12px] font-semibold text-slate-500">
                <FiPackage />
                <span className="truncate max-w-[56ch]">
                  {product.category?.category_name || "Category"} •{" "}
                  {product.brand || "Brand"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col lg:flex-row gap-10 xl:gap-14 2xl:gap-16">
              <div className="w-full lg:w-[52%]">
                <div className="flex gap-4">
                  <div className="hidden sm:flex flex-col gap-3">
                    {images
                      .filter(Boolean)
                      .slice(0, 7)
                      .map((img, idx) => {
                        const active = img === mainImage;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setMainImage(img)}
                            className={[
                              "h-[58px] w-[58px] rounded-2xl overflow-hidden bg-white",
                              "transition-transform hover:scale-[1.03]",
                              active ? "thumbActive" : "",
                            ].join(" ")}
                            title="Preview"
                            style={{
                              boxShadow: "none",
                              border: "1px solid rgb(241,245,249)",
                            }}
                          >
                            <img
                              src={getImageUrl(img)}
                              alt={`thumb-${idx}`}
                              className="h-full w-full object-contain"
                              loading="lazy"
                            />
                          </button>
                        );
                      })}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 rounded-3xl bg-white"
                    style={{
                      boxShadow: "none",
                      border: "1px solid rgb(241,245,249)",
                    }}
                  >
                    <div className="p-3 sm:p-4">
                      <div
                        onMouseMove={handleZoom}
                        onMouseLeave={() => setZoomStyle({})}
                        className="w-full h-[300px] sm:h-[340px] md:h-[420px] rounded-2xl bg-no-repeat bg-center overflow-hidden"
                        style={
                          Object.keys(zoomStyle).length > 0
                            ? {
                                ...zoomStyle,
                                backgroundRepeat: "no-repeat",
                                backgroundColor: "#ffffff",
                              }
                            : {
                                backgroundImage: `url(${getImageUrl(mainImage)})`,
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundColor: "#ffffff",
                              }
                        }
                      />

                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-[12px] font-semibold text-slate-500">
                          Hover to zoom
                        </p>

                        <span
                          className={[
                            "text-[12px] font-extrabold",
                            product.availability_status
                              ? "text-emerald-700"
                              : "text-red-600",
                          ].join(" ")}
                        >
                          {product.availability_status
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </div>

                      <div className="sm:hidden mt-4 flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                        {images
                          .filter(Boolean)
                          .slice(0, 10)
                          .map((img, idx) => {
                            const active = img === mainImage;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setMainImage(img)}
                                className={[
                                  "h-[62px] w-[62px] rounded-2xl overflow-hidden bg-white flex-shrink-0",
                                  active ? "thumbActive" : "",
                                ].join(" ")}
                                title="Preview"
                                style={{
                                  border: "1px solid rgb(241,245,249)",
                                }}
                              >
                                <img
                                  src={getImageUrl(img)}
                                  alt={`thumb-${idx}`}
                                  className="h-full w-full object-contain"
                                  loading="lazy"
                                />
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.25 }}
                  className="hidden lg:grid mt-6 grid-cols-5 gap-4"
                >
                  {[
                    {
                      icon: <FaAmazonPay className="h-7 w-7 text-slate-800" />,
                      label: "Cash/Pay on Delivery",
                    },
                    {
                      icon: (
                        <MdFindReplace className="h-7 w-7 text-slate-800" />
                      ),
                      label: "Replacement Available",
                    },
                    {
                      icon: (
                        <CiDeliveryTruck className="h-8 w-8 text-slate-800" />
                      ),
                      label: "Fast Delivery",
                    },
                    {
                      icon: <TbBrandBeats className="h-7 w-7 text-slate-800" />,
                      label: "Brand Support",
                    },
                    {
                      icon: (
                        <PiAppleLogoThin className="h-8 w-8 text-slate-800" />
                      ),
                      label: "Top Brands",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-slate-50/70 px-3 py-3 text-center"
                      style={{
                        boxShadow: "none",
                        border: "1px solid rgb(241,245,249)",
                      }}
                      title={item.label}
                    >
                      <div className="flex justify-center">{item.icon}</div>
                      <p className="mt-2 text-[11px] font-extrabold text-slate-700 leading-snug">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </div>

              <div className="w-full lg:w-[48%]">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-extrabold tracking-tight text-slate-900">
                    {product.product_name}
                  </h1>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-[12px] font-extrabold text-slate-700">
                      <FiInfo /> {product.brand || "Brand"}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-[12px] font-extrabold text-slate-700">
                      <FiPackage />{" "}
                      {product.category?.category_name || "Category"}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-[12px] font-extrabold text-slate-700">
                      <RiShieldCheckLine />{" "}
                      {product.subcategory?.subcategory_name || "Sub-Category"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, idx) => (
                        <FaStar
                          key={idx}
                          className={[
                            "w-4 h-4",
                            idx < roundedRating
                              ? "text-orange-500"
                              : "text-slate-200",
                          ].join(" ")}
                        />
                      ))}
                    </div>

                    <span className="text-[12px] font-extrabold text-slate-700">
                      {avgRating.toFixed(1)} / 5
                    </span>

                    <span className="text-[12px] font-semibold text-slate-500">
                      ({totalReviews}{" "}
                      {totalReviews === 1 ? "review" : "reviews"})
                    </span>
                  </div>

                  <div className="rounded-2xl bg-slate-50/60 ">
                    <p
                      className={[
                        "text-[13px] leading-relaxed text-slate-700 font-medium",
                        showFullDesc ? "" : "line-clamp-4",
                      ].join(" ")}
                    >
                      {product.description}
                    </p>
                    {product.description?.length > 120 && (
                      <button
                        className="mt-2 text-[12px] font-extrabold text-slate-900 hover:text-orange-600 transition"
                        onClick={() => setShowFullDesc(!showFullDesc)}
                        type="button"
                      >
                        {showFullDesc ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>

                  <div className="flex items-end gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[26px] sm:text-[28px] font-black priceSelling flex items-center gap-2">
                        <FaRupeeSign />
                        {selling}
                      </span>
                      {!!display && (
                        <span className="text-[14px] priceMrp flex items-center gap-1">
                          <FaRupeeSign />
                          {display}
                        </span>
                      )}
                    </div>

                    <div className="text-[12px] text-slate-500 font-semibold">
                      Inclusive of all taxes
                    </div>
                  </div>

                  <small className="text-slate-500 font-semibold">
                    M.R.P :{" "}
                    <del>
                      Rs. {product.selling_price + product.selling_price * 0.5}
                    </del>
                  </small>

                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-extrabold text-slate-600 uppercase">
                      Qty
                    </span>

                    <div
                      className="inline-flex items-center rounded-full bg-slate-50"
                      style={{ border: "1px solid rgb(241,245,249)" }}
                    >
                      <button
                        onClick={() => changeQuantity("dec")}
                        className="h-10 w-10 inline-flex items-center justify-center rounded-full text-slate-700 hover:text-slate-900 transition"
                        type="button"
                        aria-label="Decrease quantity"
                      >
                        <FaMinus />
                      </button>

                      <span className="w-10 text-center text-[14px] font-black text-slate-900">
                        {quantity}
                      </span>

                      <button
                        onClick={() => changeQuantity("inc")}
                        className="h-10 w-10 inline-flex items-center justify-center rounded-full text-slate-700 hover:text-slate-900 transition"
                        type="button"
                        aria-label="Increase quantity"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleAddToCart}
                      className="btnOrange inline-flex items-center justify-center gap-2"
                      type="button"
                    >
                      <FaCartPlus />
                      Add to Cart
                    </motion.button>

                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleBuyNow}
                      className="btnOrange inline-flex items-center justify-center gap-2"
                      type="button"
                    >
                      <FaCartPlus />
                      Buy Now
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-2xl bg-slate-50/70 px-4 py-3">
                      <p className="text-[12px] font-extrabold text-slate-800">
                        Fast Delivery
                      </p>
                      <p className="text-[12px] font-semibold text-slate-500">
                        Reliable shipping partner
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50/70 px-4 py-3">
                      <p className="text-[12px] font-extrabold text-slate-800">
                        Easy Returns
                      </p>
                      <p className="text-[12px] font-semibold text-slate-500">
                        Smooth replacement policy
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.25 }}
              className="mt-10 sm:mt-12 grid md:grid-cols-2 gap-6 sm:gap-10"
            >
              <div
                className="rounded-3xl bg-white p-5 sm:p-6"
                style={{
                  border: "1px solid rgb(241,245,249)",
                  boxShadow: "none",
                }}
              >
                <h2 className="flex items-center gap-2 font-extrabold text-[14px] text-slate-900 mb-4">
                  <FiPackage className="text-orange-600" />
                  Product Technical Information
                </h2>

                <ul className="text-[12px] text-slate-700 font-semibold space-y-3">
                  <li className="flex justify-between gap-4">
                    <span className="text-slate-500 font-extrabold">
                      PRODUCT NAME
                    </span>
                    <span className="text-right">{product.product_name}</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-slate-500 font-extrabold">SKU</span>
                    <span className="text-right">{product.sku}</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-slate-500 font-extrabold">BRAND</span>
                    <span className="text-right">{product.brand}</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-slate-500 font-extrabold">COLOR</span>
                    <span className="text-right">{product.color}</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-slate-500 font-extrabold">
                      MATERIAL
                    </span>
                    <span className="text-right">{product.material}</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-slate-500 font-extrabold">
                      BARCODE
                    </span>
                    <span className="text-right">{product.barcode}</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-slate-500 font-extrabold">
                      DIMENSIONS
                    </span>
                    <span className="text-right">
                      {product.dimensions?.length} x {product.dimensions?.width}{" "}
                      x {product.dimensions?.height} cm
                    </span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-slate-500 font-extrabold">STOCK</span>
                    <span className="text-right">{product.stock}</span>
                  </li>
                </ul>
              </div>

              <div
                className="rounded-3xl bg-white p-5 sm:p-6"
                style={{
                  border: "1px solid rgb(241,245,249)",
                  boxShadow: "none",
                }}
              >
                <h2 className="flex items-center gap-2 font-extrabold text-[14px] text-slate-900 mb-4">
                  <FiInfo className="text-orange-600" />
                  Additional Information
                </h2>

                <ul className="text-[12px] text-slate-700 font-semibold space-y-3">
                  <li className="flex justify-between gap-4">
                    <span className="text-slate-500 font-extrabold">
                      MANUFACTURER
                    </span>
                    <span className="text-right">{product.product_name}</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-slate-500 font-extrabold">
                      OUTLET CODE
                    </span>
                    <span className="text-right">{product.outlet}</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-slate-500 font-extrabold">
                      CATEGORY
                    </span>
                    <span className="text-right">
                      {product.category?.category_name}
                    </span>
                  </li>
                </ul>

                <h2 className="flex items-center gap-2 font-extrabold text-[14px] text-slate-900 mt-6 mb-4">
                  <CiDeliveryTruck className="text-orange-600" />
                  Delivery & Returns
                </h2>

                <ul className="text-[12px] text-slate-700 font-semibold space-y-3">
                  <li className="flex justify-between gap-4">
                    <span className="text-slate-500 font-extrabold">
                      DELIVERY
                    </span>
                    <span className="text-right">
                      {product.delivery_time_estimate}
                    </span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-slate-500 font-extrabold">
                      REPLACEMENT
                    </span>
                    <span className="text-right">
                      {product.replacement_policy}
                    </span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-slate-500 font-extrabold">
                      ORIGIN
                    </span>
                    <span className="text-right">{product.origin_country}</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {categoryProducts.length > 0 && (
              <div className="mt-12 sm:mt-14">
                <div className="flex items-end justify-between gap-4 mb-3">
                  <div className="rounded-2xl border-b border-orange-100 bg-gradient-to-r from-orange-50/70 to-white px-3 py-3 sm:px-4">
                    <h2 className="text-[18px] font-extrabold text-slate-900">
                      Explore More from This Category
                    </h2>
                    <p className="text-[12px] font-semibold text-slate-500">
                      {categoryProducts.length} items
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => scrollCarousel(-1)}
                      className="btnGhost inline-flex items-center gap-2"
                    >
                      <FiChevronLeft />
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollCarousel(1)}
                      className="btnGhost inline-flex items-center gap-2"
                    >
                      Next
                      <FiChevronRight />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    className="sm:hidden absolute -left-1 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur inline-flex items-center justify-center"
                    style={{
                      border: "1px solid rgb(241,245,249)",
                      boxShadow: "none",
                    }}
                    onClick={() => scrollCarousel(-1)}
                    aria-label="Scroll left"
                  >
                    <FiChevronLeft />
                  </button>

                  <div
                    id="catCarousel"
                    className="flex gap-8 overflow-x-auto scroll-smooth hide-scrollbar py-2"
                  >
                    {categoryProducts.map((item) => (
                      <Link
                        key={item._id}
                        to={`/single-product/${item._id}`}
                        className="min-w-[240px] sm:min-w-[260px] bg-white flex-shrink-0 rounded-3xl overflow-hidden"
                        style={{
                          border: "1px solid rgb(213, 222, 231)",
                          boxShadow: "none",
                        }}
                      >
                        <div className="p-3">
                          <div className="rounded-2xl overflow-hidden bg-white">
                            <img
                              src={getImageUrl(item.product_image)}
                              alt={item.product_name}
                              className="w-full h-44 object-contain bg-white"
                              loading="lazy"
                            />
                          </div>

                          <h4 className="mt-3 text-[13px] font-extrabold text-slate-900 truncate">
                            {item.product_name}
                          </h4>

                          <p className="mt-1 text-[12px] font-semibold text-slate-500 truncate">
                            {item.brand ||
                              item.category?.category_name ||
                              "Popular"}{" "}
                            • Fast delivery
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="priceSelling text-[14px] flex items-center gap-1">
                              <FaRupeeSign /> {item.selling_price}
                            </span>
                            {!!item.display_price && (
                              <span className="priceMrp text-[12px] flex items-center gap-1">
                                <FaRupeeSign /> {item.display_price}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="sm:hidden absolute -right-1 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur inline-flex items-center justify-center"
                    style={{
                      border: "1px solid rgb(241,245,249)",
                      boxShadow: "none",
                    }}
                    onClick={() => scrollCarousel(1)}
                    aria-label="Scroll right"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;

// till here original.

// // showing all the attributes of the single product.
// import React, {
//   useEffect,
//   useState,
//   useContext,
//   useMemo,
//   useCallback,
// } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import {
//   FaStar,
//   FaCartPlus,
//   FaRupeeSign,
//   FaMinus,
//   FaPlus,
// } from "react-icons/fa";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";
// import { toast } from "react-toastify";
// import { CartContext } from "../../components/cart_components/CartContext";
// import { motion } from "framer-motion";
// import { FaAmazonPay } from "react-icons/fa6";
// import { MdFindReplace } from "react-icons/md";
// import { CiDeliveryTruck } from "react-icons/ci";
// import { TbBrandBeats } from "react-icons/tb";
// import { PiAppleLogoThin } from "react-icons/pi";
// import {
//   FiChevronLeft,
//   FiChevronRight,
//   FiInfo,
//   FiPackage,
//   FiTag,
//   FiMessageCircle,
//   FiSettings,
//   FiSend,
//   FiChevronDown,
//   FiChevronUp,
// } from "react-icons/fi";
// import { RiShieldCheckLine, RiArrowLeftSLine } from "react-icons/ri";

// const getStoredToken = () =>
//   localStorage.getItem("token") ||
//   localStorage.getItem("authToken") ||
//   localStorage.getItem("userToken") ||
//   "";

// const getRatingValue = (item) => {
//   const value =
//     item?.rating ??
//     item?.stars ??
//     item?.star ??
//     item?.ratingValue ??
//     item?.value ??
//     0;

//   const numberValue = Number(value);
//   return Number.isFinite(numberValue) ? numberValue : 0;
// };

// const getProductRatings = (product) => {
//   const reviews = Array.isArray(product?.reviews)
//     ? product.reviews
//     : Array.isArray(product?.ratings)
//       ? product.ratings
//       : [];

//   const calculatedTotalReviews = reviews.length;

//   const calculatedAvgRating =
//     calculatedTotalReviews > 0
//       ? reviews.reduce((sum, item) => sum + getRatingValue(item), 0) /
//         calculatedTotalReviews
//       : 0;

//   const totalReviews = Number(
//     product?.total_reviews ??
//       product?.totalReviews ??
//       product?.total_ratings ??
//       product?.totalRatings ??
//       product?.review_count ??
//       product?.reviewCount ??
//       product?.rating_count ??
//       product?.ratingCount ??
//       calculatedTotalReviews ??
//       0,
//   );

//   const avgRating = Number(
//     product?.avg_rating ??
//       product?.average_rating ??
//       product?.averageRating ??
//       product?.avgRating ??
//       product?.rating_average ??
//       product?.ratingAverage ??
//       product?.rating ??
//       calculatedAvgRating ??
//       0,
//   );

//   const safeTotalReviews = Number.isFinite(totalReviews)
//     ? totalReviews
//     : calculatedTotalReviews;

//   const safeAvgRating = Number.isFinite(avgRating)
//     ? avgRating
//     : calculatedAvgRating;

//   return {
//     reviews,
//     totalReviews: safeTotalReviews,
//     avgRating: safeAvgRating,
//     roundedRating: Math.round(safeAvgRating),
//   };
// };

// const formatDate = (value) => {
//   if (!value) return "N/A";
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return "N/A";

//   return date.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const showValue = (value, fallback = "N/A") => {
//   if (value === null || value === undefined || value === "") return fallback;
//   if (typeof value === "boolean") return value ? "Yes" : "No";
//   return value;
// };

// const getDisplayName = (value, fallback = "User") => {
//   if (!value) return fallback;
//   if (typeof value === "string") return value;
//   return (
//     value.name || value.fullName || value.username || value.email || fallback
//   );
// };

// const InfoCard = ({ title, icon, children }) => (
//   <div
//     className="rounded-3xl bg-white p-5 sm:p-6"
//     style={{
//       border: "1px solid rgb(241,245,249)",
//       boxShadow: "none",
//     }}
//   >
//     <h2 className="flex items-center gap-2 font-extrabold text-[14px] text-slate-900 mb-4">
//       {icon}
//       {title}
//     </h2>
//     {children}
//   </div>
// );

// const InfoRow = ({ label, value }) => (
//   <li className="flex justify-between gap-4 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
//     <span className="text-slate-500 font-extrabold uppercase">{label}</span>
//     <span className="text-right font-bold text-slate-800 break-words">
//       {showValue(value)}
//     </span>
//   </li>
// );

// const ProductQuestionAnswers = ({ product, setProduct }) => {
//   const [questionText, setQuestionText] = useState("");
//   const [answerTextByQuestion, setAnswerTextByQuestion] = useState({});
//   const [questionSubmitting, setQuestionSubmitting] = useState(false);
//   const [answerSubmittingId, setAnswerSubmittingId] = useState("");

//   const questions = Array.isArray(product?.questions) ? product.questions : [];

//   const syncProductFromResponse = (res) => {
//     const updatedProduct = res.data?.product || res.data?.data || res.data;
//     if (updatedProduct?._id) {
//       setProduct(updatedProduct);
//     }
//   };

//   const handleAskQuestion = async () => {
//     const question = questionText.trim();

//     if (!question) {
//       toast.error("Please write your question.");
//       return;
//     }

//     if (!product?._id) {
//       toast.error("Product not found.");
//       return;
//     }

//     try {
//       setQuestionSubmitting(true);

//       const res = await axios.post(
//         `${globalBackendRoute}/api/products/${product._id}/questions`,
//         { question },
//       );

//       syncProductFromResponse(res);
//       setQuestionText("");
//       toast.success(res.data?.message || "Question submitted successfully.");
//     } catch (error) {
//       console.error("Question submit error:", error);
//       toast.error(
//         error?.response?.data?.message ||
//           "Unable to submit question. Please try again.",
//       );
//     } finally {
//       setQuestionSubmitting(false);
//     }
//   };

//   const handleAnswerQuestion = async (questionId) => {
//     const token = getStoredToken();
//     const answer = String(answerTextByQuestion[questionId] || "").trim();

//     if (!token) {
//       toast.error("Please login to answer this question.");
//       return;
//     }

//     if (!answer) {
//       toast.error("Please write your answer.");
//       return;
//     }

//     try {
//       setAnswerSubmittingId(questionId);

//       const res = await axios.post(
//         `${globalBackendRoute}/api/products/${product._id}/questions/${questionId}/answers`,
//         { answer },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       syncProductFromResponse(res);
//       setAnswerTextByQuestion((prev) => ({
//         ...prev,
//         [questionId]: "",
//       }));
//       toast.success(res.data?.message || "Answer submitted successfully.");
//     } catch (error) {
//       console.error("Answer submit error:", error);

//       const message = String(
//         error?.response?.data?.message || "",
//       ).toLowerCase();

//       if (
//         error?.response?.status === 401 ||
//         message.includes("token") ||
//         message.includes("unauthorized") ||
//         message.includes("jwt")
//       ) {
//         toast.error("Please login to answer this question.");
//         return;
//       }

//       toast.error(
//         error?.response?.data?.message ||
//           "Unable to submit answer. Please try again.",
//       );
//     } finally {
//       setAnswerSubmittingId("");
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: "-60px" }}
//       transition={{ duration: 0.25 }}
//       className="mt-10 sm:mt-12 rounded-3xl bg-white p-5 sm:p-6"
//       style={{
//         border: "1px solid rgb(241,245,249)",
//         boxShadow: "none",
//       }}
//     >
//       <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
//         <div>
//           <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-orange-600">
//             Product Q&A
//           </p>
//           <h2 className="mt-2 flex items-center gap-2 text-[20px] sm:text-[24px] font-black text-slate-900">
//             <FiMessageCircle className="text-orange-600" />
//             Customer Questions & Answers
//           </h2>
//           <p className="mt-1 text-[12px] font-semibold text-slate-500">
//             Anyone can ask a question. Login is required only for answering.
//           </p>
//         </div>

//         <div className="rounded-2xl bg-orange-50 px-4 py-3">
//           <p className="text-[12px] font-extrabold text-slate-500 uppercase">
//             Total Questions
//           </p>
//           <p className="text-[24px] font-black text-slate-900">
//             {questions.length}
//           </p>
//         </div>
//       </div>

//       <div className="mt-6 rounded-3xl bg-slate-50 p-4">
//         <label className="text-[12px] font-extrabold text-slate-700">
//           Ask a Question
//         </label>

//         <textarea
//           value={questionText}
//           onChange={(e) => setQuestionText(e.target.value)}
//           rows={3}
//           placeholder="Example: Is this product compatible with my device?"
//           className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white p-3 text-[13px] font-semibold text-slate-700 outline-none focus:border-orange-400"
//         />

//         <div className="mt-3 flex justify-end">
//           <button
//             type="button"
//             disabled={questionSubmitting}
//             onClick={handleAskQuestion}
//             className="btnOrange inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
//           >
//             <FiSend />
//             {questionSubmitting ? "Submitting..." : "Submit Question"}
//           </button>
//         </div>
//       </div>

//       <div className="mt-6 max-h-[430px] overflow-y-auto pr-2 hide-scrollbar">
//         {questions.length > 0 ? (
//           <div className="space-y-4">
//             {questions.map((item, index) => {
//               const questionId = item?._id || String(index);
//               const answers = Array.isArray(item?.answers)
//                 ? item.answers
//                 : item?.answer
//                   ? [
//                       {
//                         answer: item.answer,
//                         user: item.answeredBy,
//                         createdAt: item.answeredAt,
//                       },
//                     ]
//                   : [];

//               return (
//                 <div
//                   key={questionId}
//                   className="rounded-3xl bg-slate-50 p-4"
//                   style={{
//                     border: "1px solid rgb(241,245,249)",
//                   }}
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className="h-8 w-8 flex-shrink-0 rounded-full bg-orange-100 text-orange-700 inline-flex items-center justify-center text-[12px] font-black">
//                       Q{index + 1}
//                     </div>

//                     <div className="flex-1">
//                       <p className="text-[14px] font-black text-slate-900">
//                         {showValue(item?.question)}
//                       </p>

//                       <p className="mt-1 text-[11px] font-bold text-slate-400">
//                         Asked by {getDisplayName(item?.user, "Customer")} •{" "}
//                         {formatDate(item?.createdAt)}
//                       </p>

//                       <div className="mt-4 space-y-3">
//                         {answers.length > 0 ? (
//                           answers.map((answerItem, answerIndex) => (
//                             <div
//                               key={answerItem?._id || answerIndex}
//                               className="rounded-2xl bg-white p-3"
//                             >
//                               <p className="text-[12px] font-bold text-slate-700">
//                                 {showValue(answerItem?.answer)}
//                               </p>
//                               <p className="mt-2 text-[11px] font-bold text-slate-400">
//                                 Answered by{" "}
//                                 {getDisplayName(
//                                   answerItem?.user ||
//                                     answerItem?.answeredBy ||
//                                     item?.answeredBy,
//                                   "User",
//                                 )}{" "}
//                                 •{" "}
//                                 {formatDate(
//                                   answerItem?.createdAt ||
//                                     answerItem?.answeredAt ||
//                                     item?.answeredAt,
//                                 )}
//                               </p>
//                             </div>
//                           ))
//                         ) : (
//                           <p className="rounded-2xl bg-white p-3 text-[12px] font-bold text-slate-500">
//                             No answers yet. Be the first to answer.
//                           </p>
//                         )}
//                       </div>

//                       <div className="mt-4 rounded-2xl bg-white p-3">
//                         <label className="text-[11px] font-extrabold uppercase text-slate-500">
//                           Write an answer
//                         </label>

//                         <textarea
//                           value={answerTextByQuestion[questionId] || ""}
//                           onChange={(e) =>
//                             setAnswerTextByQuestion((prev) => ({
//                               ...prev,
//                               [questionId]: e.target.value,
//                             }))
//                           }
//                           rows={2}
//                           placeholder="Login is required to submit an answer."
//                           className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white p-3 text-[12px] font-semibold text-slate-700 outline-none focus:border-orange-400"
//                         />

//                         <div className="mt-3 flex justify-end">
//                           <button
//                             type="button"
//                             disabled={answerSubmittingId === questionId}
//                             onClick={() => handleAnswerQuestion(questionId)}
//                             className="rounded-full bg-slate-900 px-4 py-2 text-[12px] font-extrabold text-white transition hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
//                           >
//                             {answerSubmittingId === questionId
//                               ? "Submitting..."
//                               : "Submit Answer"}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="rounded-3xl bg-slate-50 p-6 text-center">
//             <p className="text-[13px] font-bold text-slate-500">
//               No questions yet. Ask the first question about this product.
//             </p>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// const ProductFullDetails = ({ product }) => {
//   const [showDetails, setShowDetails] = useState(false);

//   const warehouseStock = Array.isArray(product.warehouse_stock)
//     ? product.warehouse_stock
//     : [];

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: "-60px" }}
//       transition={{ duration: 0.25 }}
//       className="mt-10 sm:mt-12"
//     >
//       <div
//         className="rounded-3xl bg-white p-5 sm:p-6"
//         style={{
//           border: "1px solid rgb(241,245,249)",
//           boxShadow: "none",
//         }}
//       >
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-orange-600">
//               Product Details
//             </p>
//             <h2 className="mt-2 text-[20px] sm:text-[24px] font-black text-slate-900">
//               Complete Product Information
//             </h2>
//             <p className="mt-1 text-[12px] font-semibold text-slate-500">
//               View technical, pricing, delivery, stock, outlet and vendor
//               information.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => setShowDetails((prev) => !prev)}
//             className="btnGhost inline-flex items-center justify-center gap-2"
//           >
//             {showDetails ? (
//               <>
//                 <FiChevronUp />
//                 Show Less
//               </>
//             ) : (
//               <>
//                 <FiChevronDown />
//                 Show More
//               </>
//             )}
//           </button>
//         </div>

//         {!showDetails && (
//           <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
//             <div className="rounded-2xl bg-slate-50 p-4">
//               <p className="text-[11px] font-extrabold text-slate-400 uppercase">
//                 SKU
//               </p>
//               <p className="mt-1 text-[13px] font-black text-slate-900">
//                 {showValue(product.sku)}
//               </p>
//             </div>

//             <div className="rounded-2xl bg-slate-50 p-4">
//               <p className="text-[11px] font-extrabold text-slate-400 uppercase">
//                 Brand
//               </p>
//               <p className="mt-1 text-[13px] font-black text-slate-900">
//                 {showValue(product.brand)}
//               </p>
//             </div>

//             <div className="rounded-2xl bg-slate-50 p-4">
//               <p className="text-[11px] font-extrabold text-slate-400 uppercase">
//                 Stock
//               </p>
//               <p className="mt-1 text-[13px] font-black text-slate-900">
//                 {showValue(product.stock)}
//               </p>
//             </div>

//             <div className="rounded-2xl bg-slate-50 p-4">
//               <p className="text-[11px] font-extrabold text-slate-400 uppercase">
//                 Origin
//               </p>
//               <p className="mt-1 text-[13px] font-black text-slate-900">
//                 {showValue(product.origin_country)}
//               </p>
//             </div>
//           </div>
//         )}

//         {showDetails && (
//           <div className="mt-6 grid md:grid-cols-2 gap-6 sm:gap-10">
//             <InfoCard
//               title="Product Technical Information"
//               icon={<FiPackage className="text-orange-600" />}
//             >
//               <ul className="text-[12px] text-slate-700 font-semibold space-y-3">
//                 <InfoRow label="Product Name" value={product.product_name} />
//                 <InfoRow label="Slug" value={product.slug} />
//                 <InfoRow label="SKU" value={product.sku} />
//                 <InfoRow label="Brand" value={product.brand} />
//                 <InfoRow label="Barcode" value={product.barcode} />
//                 <InfoRow label="Color" value={product.color} />
//                 <InfoRow label="Material" value={product.material} />
//                 <InfoRow
//                   label="Dimensions"
//                   value={`${showValue(product.dimensions?.length)} x ${showValue(
//                     product.dimensions?.width,
//                   )} x ${showValue(product.dimensions?.height)} cm`}
//                 />
//                 <InfoRow label="Version" value={product.version} />
//               </ul>
//             </InfoCard>

//             <InfoCard
//               title="Pricing & Purchase Rules"
//               icon={<FiTag className="text-orange-600" />}
//             >
//               <ul className="text-[12px] text-slate-700 font-semibold space-y-3">
//                 <InfoRow
//                   label="Display Price"
//                   value={`₹${showValue(product.display_price)}`}
//                 />
//                 <InfoRow
//                   label="Selling Price"
//                   value={`₹${showValue(product.selling_price)}`}
//                 />
//                 <InfoRow
//                   label="Discount"
//                   value={`${showValue(product.discount, 0)}%`}
//                 />
//                 <InfoRow
//                   label="Minimum Purchase Qty"
//                   value={product.min_purchase_qty}
//                 />
//                 <InfoRow
//                   label="Maximum Purchase Qty"
//                   value={product.max_purchase_qty}
//                 />
//                 <InfoRow
//                   label="Availability"
//                   value={
//                     product.availability_status ? "In Stock" : "Out of Stock"
//                   }
//                 />
//                 <InfoRow label="Stock" value={product.stock} />
//                 <InfoRow
//                   label="Total Products Sold"
//                   value={product.total_products_sold}
//                 />
//               </ul>
//             </InfoCard>

//             <InfoCard
//               title="Delivery, Outlet & Vendor"
//               icon={<CiDeliveryTruck className="text-orange-600" />}
//             >
//               <ul className="text-[12px] text-slate-700 font-semibold space-y-3">
//                 <InfoRow
//                   label="Delivery Estimate"
//                   value={product.delivery_time_estimate}
//                 />
//                 <InfoRow
//                   label="Replacement Policy"
//                   value={product.replacement_policy}
//                 />
//                 <InfoRow
//                   label="Origin Country"
//                   value={product.origin_country}
//                 />
//                 <InfoRow
//                   label="Outlet"
//                   value={product.outlet?._id || product.outlet}
//                 />
//                 <InfoRow
//                   label="Vendor"
//                   value={product.vendor?._id || product.vendor}
//                 />
//               </ul>
//             </InfoCard>

//             <InfoCard
//               title="Warehouse Stock"
//               icon={<FiSettings className="text-orange-600" />}
//             >
//               {warehouseStock.length > 0 ? (
//                 <div className="space-y-3 max-h-[260px] overflow-y-auto pr-2 hide-scrollbar">
//                   {warehouseStock.map((item, index) => (
//                     <div
//                       key={item?._id || index}
//                       className="rounded-2xl bg-slate-50 p-3"
//                     >
//                       <p className="text-[12px] font-extrabold text-slate-500">
//                         Warehouse {index + 1}
//                       </p>
//                       <p className="mt-1 text-[12px] font-bold text-slate-800">
//                         ID:{" "}
//                         {showValue(
//                           item?.warehouse_id?._id || item?.warehouse_id,
//                         )}
//                       </p>
//                       <p className="mt-1 text-[12px] font-bold text-slate-800">
//                         Stock: {showValue(item?.stock)}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-[12px] font-bold text-slate-500">
//                   No warehouse stock available.
//                 </p>
//               )}
//             </InfoCard>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// const SingleProduct = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { addToCart } = useContext(CartContext);

//   const [product, setProduct] = useState(null);
//   const [mainImage, setMainImage] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [zoomStyle, setZoomStyle] = useState({});
//   const [showFullDesc, setShowFullDesc] = useState(false);
//   const [categoryProducts, setCategoryProducts] = useState([]);

//   const getImageUrl = useCallback((img) => {
//     if (!img) return "https://via.placeholder.com/600x600";
//     const fileName = String(img).replace(/\\/g, "/").split("/").pop();
//     return `${globalBackendRoute}/uploads/products/${fileName}`;
//   }, []);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axios.get(
//           `${globalBackendRoute}/api/get-single-added-product-by-id/${id}`,
//         );

//         const productData = res.data?.product || res.data?.data || res.data;

//         setProduct(productData);
//         setMainImage(productData.product_image);

//         if (productData?.category?._id) {
//           const catId = productData.category._id;
//           const productsRes = await axios.get(
//             `${globalBackendRoute}/api/get-products-by-category/${catId}`,
//           );
//           setCategoryProducts(
//             (productsRes.data || []).filter((p) => p._id !== productData._id),
//           );
//         }
//       } catch (error) {
//         console.error("Failed to load product:", error.message);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   useEffect(() => {
//     const saveViewHistory = async () => {
//       const token = getStoredToken();
//       if (!token || !product?._id) return;

//       try {
//         await axios.post(
//           `${globalBackendRoute}/api/user-history/add-view`,
//           { productId: product._id },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           },
//         );
//       } catch (error) {
//         console.error("Failed to save product view history:", error);
//       }
//     };

//     saveViewHistory();
//   }, [product?._id]);

//   const images = useMemo(() => {
//     const rawImages = [
//       product?.product_image,
//       ...(Array.isArray(product?.all_product_images)
//         ? product.all_product_images
//         : []),
//     ].filter(Boolean);

//     const uniqueImages = [...new Set(rawImages)];

//     if (!product?.product_image) return uniqueImages;

//     const filledImages = [...uniqueImages];

//     while (filledImages.length < 6) {
//       filledImages.push(product.product_image);
//     }

//     return filledImages.slice(0, 6);
//   }, [product]);

//   const handleZoom = useCallback(
//     (e) => {
//       const { offsetX, offsetY, target } = e.nativeEvent;
//       const { offsetWidth, offsetHeight } = target;
//       const x = (offsetX / offsetWidth) * 100;
//       const y = (offsetY / offsetHeight) * 100;

//       setZoomStyle({
//         backgroundImage: `url(${getImageUrl(mainImage)})`,
//         backgroundPosition: `${x}% ${y}%`,
//         backgroundSize: "200%",
//       });
//     },
//     [mainImage, getImageUrl],
//   );

//   const handleAddToCart = useCallback(() => {
//     if (product?.availability_status) {
//       addToCart({ ...product, quantity });
//     } else {
//       toast.error("Out of Stock");
//     }
//   }, [product, quantity, addToCart]);

//   const changeQuantity = useCallback((type) => {
//     setQuantity((prev) =>
//       type === "inc" ? prev + 1 : prev > 1 ? prev - 1 : 1,
//     );
//   }, []);

//   const handleBuyNow = () => {
//     if (!product?.availability_status) {
//       toast.error("Out of Stock");
//       return;
//     }
//     addToCart({ ...product, quantity });
//     navigate("/checkout");
//   };

//   const scrollCarousel = (dir) => {
//     const el = document.getElementById("catCarousel");
//     if (!el) return;
//     el.scrollLeft += dir * 340;
//   };

//   if (!product) {
//     return (
//       <div className="w-full py-20 text-center">
//         <div className="inline-flex items-center gap-2 text-slate-500 font-semibold">
//           <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
//           Loading product...
//         </div>
//       </div>
//     );
//   }

//   const selling = product?.selling_price ?? product?.price ?? "";
//   const display = product?.display_price ?? "";
//   const { totalReviews, avgRating, roundedRating } = getProductRatings(product);

//   return (
//     <div className="sp-font sp-scope w-full">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

//         .sp-font{
//           font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
//         }

//         .btnOrange{
//           border-radius: 9999px;
//           background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36));
//           padding: 0.75rem 1.25rem;
//           color: white;
//           font-weight: 800;
//           font-size: 14px;
//           box-shadow: 0 18px 30px -18px rgba(249,115,22,0.45);
//           transition: opacity .15s ease, transform .15s ease;
//         }

//         .btnOrange:hover{ opacity: .95; }
//         .btnOrange:active{ transform: scale(.99); }

//         .btnGhost{
//           border-radius: 9999px;
//           padding: 0.75rem 1.1rem;
//           font-weight: 800;
//           font-size: 13px;
//           color: rgb(30,41,59);
//           background: rgba(241,245,249,.7);
//           transition: background .15s ease, transform .15s ease;
//         }

//         .btnGhost:hover{ background: rgba(226,232,240,.9); }
//         .btnGhost:active{ transform: scale(.99); }

//         .priceSelling{ color: rgb(15,23,42); font-weight: 900; }
//         .priceMrp{ color: rgb(239,68,68); font-weight: 800; text-decoration: line-through; }

//         .hide-scrollbar::-webkit-scrollbar{ display:none; }
//         .hide-scrollbar{ -ms-overflow-style:none; scrollbar-width:none; }

//         .thumbActive{
//           outline: 2px solid rgba(249,115,22,.65);
//           outline-offset: 2px;
//         }
//       `}</style>

//       <div className="w-full">
//         <div className="w-full px-3 sm:px-6 lg:px-10 2xl:px-16 py-5 sm:py-6">
//           <div className="w-full max-w-[1700px] mx-auto">
//             <div className="flex items-center justify-between gap-3">
//               <button
//                 type="button"
//                 onClick={() => navigate(-1)}
//                 className="inline-flex items-center gap-2 text-[12px] font-extrabold text-slate-600 hover:text-slate-900 transition"
//               >
//                 <RiArrowLeftSLine className="text-[16px]" />
//                 Back
//               </button>

//               <div className="hidden sm:flex items-center gap-2 text-[12px] font-semibold text-slate-500">
//                 <FiPackage />
//                 <span className="truncate max-w-[56ch]">
//                   {product.category?.category_name || "Category"} •{" "}
//                   {product.brand || "Brand"}
//                 </span>
//               </div>
//             </div>

//             <div className="mt-6 flex flex-col lg:flex-row gap-10 xl:gap-14 2xl:gap-16">
//               <div className="w-full lg:w-[52%]">
//                 <div className="flex gap-4">
//                   <div className="hidden sm:flex flex-col gap-3">
//                     {images.map((img, idx) => {
//                       const active = img === mainImage;

//                       return (
//                         <button
//                           key={`${img}-${idx}`}
//                           type="button"
//                           onClick={() => setMainImage(img)}
//                           className={[
//                             "h-[58px] w-[58px] rounded-2xl overflow-hidden bg-white",
//                             "transition-transform hover:scale-[1.03]",
//                             active ? "thumbActive" : "",
//                           ].join(" ")}
//                           title="Preview"
//                           style={{
//                             boxShadow: "none",
//                             border: "1px solid rgb(241,245,249)",
//                           }}
//                         >
//                           <img
//                             src={getImageUrl(img)}
//                             alt={`thumb-${idx}`}
//                             className="h-full w-full object-contain"
//                             loading="lazy"
//                           />
//                         </button>
//                       );
//                     })}
//                   </div>

//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.25 }}
//                     className="flex-1 rounded-3xl bg-white"
//                     style={{
//                       boxShadow: "none",
//                       border: "1px solid rgb(241,245,249)",
//                     }}
//                   >
//                     <div className="p-3 sm:p-4">
//                       <div
//                         onMouseMove={handleZoom}
//                         onMouseLeave={() => setZoomStyle({})}
//                         className="w-full h-[300px] sm:h-[340px] md:h-[420px] rounded-2xl bg-no-repeat bg-center overflow-hidden"
//                         style={
//                           Object.keys(zoomStyle).length > 0
//                             ? {
//                                 ...zoomStyle,
//                                 backgroundRepeat: "no-repeat",
//                                 backgroundColor: "#ffffff",
//                               }
//                             : {
//                                 backgroundImage: `url(${getImageUrl(
//                                   mainImage,
//                                 )})`,
//                                 backgroundSize: "contain",
//                                 backgroundRepeat: "no-repeat",
//                                 backgroundPosition: "center",
//                                 backgroundColor: "#ffffff",
//                               }
//                         }
//                       />

//                       <div className="mt-3 flex items-center justify-between">
//                         <p className="text-[12px] font-semibold text-slate-500">
//                           Hover to zoom
//                         </p>

//                         <span
//                           className={[
//                             "text-[12px] font-extrabold",
//                             product.availability_status
//                               ? "text-emerald-700"
//                               : "text-red-600",
//                           ].join(" ")}
//                         >
//                           {product.availability_status
//                             ? "In Stock"
//                             : "Out of Stock"}
//                         </span>
//                       </div>

//                       <div className="sm:hidden mt-4 flex gap-3 overflow-x-auto hide-scrollbar pb-1">
//                         {images.map((img, idx) => {
//                           const active = img === mainImage;

//                           return (
//                             <button
//                               key={`${img}-mobile-${idx}`}
//                               type="button"
//                               onClick={() => setMainImage(img)}
//                               className={[
//                                 "h-[62px] w-[62px] rounded-2xl overflow-hidden bg-white flex-shrink-0",
//                                 active ? "thumbActive" : "",
//                               ].join(" ")}
//                               title="Preview"
//                               style={{
//                                 border: "1px solid rgb(241,245,249)",
//                               }}
//                             >
//                               <img
//                                 src={getImageUrl(img)}
//                                 alt={`thumb-${idx}`}
//                                 className="h-full w-full object-contain"
//                                 loading="lazy"
//                               />
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   </motion.div>
//                 </div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 8 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.08, duration: 0.25 }}
//                   className="hidden lg:grid mt-6 grid-cols-5 gap-4"
//                 >
//                   {[
//                     {
//                       icon: <FaAmazonPay className="h-7 w-7 text-slate-800" />,
//                       label: "Cash/Pay on Delivery",
//                     },
//                     {
//                       icon: (
//                         <MdFindReplace className="h-7 w-7 text-slate-800" />
//                       ),
//                       label: "Replacement Available",
//                     },
//                     {
//                       icon: (
//                         <CiDeliveryTruck className="h-8 w-8 text-slate-800" />
//                       ),
//                       label: "Fast Delivery",
//                     },
//                     {
//                       icon: <TbBrandBeats className="h-7 w-7 text-slate-800" />,
//                       label: "Brand Support",
//                     },
//                     {
//                       icon: (
//                         <PiAppleLogoThin className="h-8 w-8 text-slate-800" />
//                       ),
//                       label: "Top Brands",
//                     },
//                   ].map((item, idx) => (
//                     <div
//                       key={idx}
//                       className="rounded-2xl bg-slate-50/70 px-3 py-3 text-center"
//                       style={{
//                         boxShadow: "none",
//                         border: "1px solid rgb(241,245,249)",
//                       }}
//                       title={item.label}
//                     >
//                       <div className="flex justify-center">{item.icon}</div>
//                       <p className="mt-2 text-[11px] font-extrabold text-slate-700 leading-snug">
//                         {item.label}
//                       </p>
//                     </div>
//                   ))}
//                 </motion.div>
//               </div>

//               <div className="w-full lg:w-[48%]">
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.25 }}
//                   className="space-y-5"
//                 >
//                   <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-extrabold tracking-tight text-slate-900">
//                     {product.product_name}
//                   </h1>

//                   <div className="flex flex-wrap gap-2">
//                     <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-[12px] font-extrabold text-slate-700">
//                       <FiInfo /> {product.brand || "Brand"}
//                     </span>
//                     <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-[12px] font-extrabold text-slate-700">
//                       <FiPackage />{" "}
//                       {product.category?.category_name || "Category"}
//                     </span>
//                     <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-[12px] font-extrabold text-slate-700">
//                       <RiShieldCheckLine />{" "}
//                       {product.subcategory?.subcategory_name || "Sub-Category"}
//                     </span>
//                   </div>

//                   <div className="flex flex-wrap items-center gap-2">
//                     <div className="flex items-center gap-1">
//                       {[...Array(5)].map((_, idx) => (
//                         <FaStar
//                           key={idx}
//                           className={[
//                             "w-4 h-4",
//                             idx < roundedRating
//                               ? "text-orange-500"
//                               : "text-slate-200",
//                           ].join(" ")}
//                         />
//                       ))}
//                     </div>

//                     <span className="text-[12px] font-extrabold text-slate-700">
//                       {avgRating.toFixed(1)} / 5
//                     </span>

//                     <span className="text-[12px] font-semibold text-slate-500">
//                       ({totalReviews}{" "}
//                       {totalReviews === 1 ? "review" : "reviews"})
//                     </span>
//                   </div>

//                   <div className="rounded-2xl bg-slate-50/60 ">
//                     <p
//                       className={[
//                         "text-[13px] leading-relaxed text-slate-700 font-medium",
//                         showFullDesc ? "" : "line-clamp-4",
//                       ].join(" ")}
//                     >
//                       {product.description}
//                     </p>
//                     {product.description?.length > 120 && (
//                       <button
//                         className="mt-2 text-[12px] font-extrabold text-slate-900 hover:text-orange-600 transition"
//                         onClick={() => setShowFullDesc(!showFullDesc)}
//                         type="button"
//                       >
//                         {showFullDesc ? "Show less" : "Read more"}
//                       </button>
//                     )}
//                   </div>

//                   <div className="flex items-end gap-4 flex-wrap">
//                     <div className="flex items-center gap-2">
//                       <span className="text-[26px] sm:text-[28px] font-black priceSelling flex items-center gap-2">
//                         <FaRupeeSign />
//                         {selling}
//                       </span>
//                       {!!display && (
//                         <span className="text-[14px] priceMrp flex items-center gap-1">
//                           <FaRupeeSign />
//                           {display}
//                         </span>
//                       )}
//                     </div>

//                     <div className="text-[12px] text-slate-500 font-semibold">
//                       Inclusive of all taxes
//                     </div>
//                   </div>

//                   <small className="text-slate-500 font-semibold">
//                     M.R.P :{" "}
//                     <del>
//                       Rs. {product.selling_price + product.selling_price * 0.5}
//                     </del>
//                   </small>

//                   <div className="flex items-center gap-3">
//                     <span className="text-[12px] font-extrabold text-slate-600 uppercase">
//                       Qty
//                     </span>

//                     <div
//                       className="inline-flex items-center rounded-full bg-slate-50"
//                       style={{ border: "1px solid rgb(241,245,249)" }}
//                     >
//                       <button
//                         onClick={() => changeQuantity("dec")}
//                         className="h-10 w-10 inline-flex items-center justify-center rounded-full text-slate-700 hover:text-slate-900 transition"
//                         type="button"
//                         aria-label="Decrease quantity"
//                       >
//                         <FaMinus />
//                       </button>

//                       <span className="w-10 text-center text-[14px] font-black text-slate-900">
//                         {quantity}
//                       </span>

//                       <button
//                         onClick={() => changeQuantity("inc")}
//                         className="h-10 w-10 inline-flex items-center justify-center rounded-full text-slate-700 hover:text-slate-900 transition"
//                         type="button"
//                         aria-label="Increase quantity"
//                       >
//                         <FaPlus />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
//                     <motion.button
//                       whileHover={{ y: -1 }}
//                       whileTap={{ scale: 0.99 }}
//                       onClick={handleAddToCart}
//                       className="btnOrange inline-flex items-center justify-center gap-2"
//                       type="button"
//                     >
//                       <FaCartPlus />
//                       Add to Cart
//                     </motion.button>

//                     <motion.button
//                       whileHover={{ y: -1 }}
//                       whileTap={{ scale: 0.99 }}
//                       onClick={handleBuyNow}
//                       className="btnOrange inline-flex items-center justify-center gap-2"
//                       type="button"
//                     >
//                       <FaCartPlus />
//                       Buy Now
//                     </motion.button>
//                   </div>

//                   <div className="grid grid-cols-2 gap-3 pt-2">
//                     <div className="rounded-2xl bg-slate-50/70 px-4 py-3">
//                       <p className="text-[12px] font-extrabold text-slate-800">
//                         Fast Delivery
//                       </p>
//                       <p className="text-[12px] font-semibold text-slate-500">
//                         Reliable shipping partner
//                       </p>
//                     </div>
//                     <div className="rounded-2xl bg-slate-50/70 px-4 py-3">
//                       <p className="text-[12px] font-extrabold text-slate-800">
//                         Easy Returns
//                       </p>
//                       <p className="text-[12px] font-semibold text-slate-500">
//                         Smooth replacement policy
//                       </p>
//                     </div>
//                   </div>
//                 </motion.div>
//               </div>
//             </div>

//             <ProductFullDetails product={product} />

//             <ProductQuestionAnswers product={product} setProduct={setProduct} />

//             {categoryProducts.length > 0 && (
//               <div className="mt-12 sm:mt-14">
//                 <div className="flex items-end justify-between gap-4 mb-3">
//                   <div className="rounded-2xl border-b border-orange-100 bg-gradient-to-r from-orange-50/70 to-white px-3 py-3 sm:px-4">
//                     <h2 className="text-[18px] font-extrabold text-slate-900">
//                       Explore More from This Category
//                     </h2>
//                     <p className="text-[12px] font-semibold text-slate-500">
//                       {categoryProducts.length} items
//                     </p>
//                   </div>

//                   <div className="hidden sm:flex items-center gap-2">
//                     <button
//                       type="button"
//                       onClick={() => scrollCarousel(-1)}
//                       className="btnGhost inline-flex items-center gap-2"
//                     >
//                       <FiChevronLeft />
//                       Prev
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => scrollCarousel(1)}
//                       className="btnGhost inline-flex items-center gap-2"
//                     >
//                       Next
//                       <FiChevronRight />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="relative">
//                   <button
//                     type="button"
//                     className="sm:hidden absolute -left-1 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur inline-flex items-center justify-center"
//                     style={{
//                       border: "1px solid rgb(241,245,249)",
//                       boxShadow: "none",
//                     }}
//                     onClick={() => scrollCarousel(-1)}
//                     aria-label="Scroll left"
//                   >
//                     <FiChevronLeft />
//                   </button>

//                   <div
//                     id="catCarousel"
//                     className="flex gap-8 overflow-x-auto scroll-smooth hide-scrollbar py-2"
//                   >
//                     {categoryProducts.map((item) => (
//                       <Link
//                         key={item._id}
//                         to={`/single-product/${item._id}`}
//                         className="min-w-[240px] sm:min-w-[260px] bg-white flex-shrink-0 rounded-3xl overflow-hidden"
//                         style={{
//                           border: "1px solid rgb(213, 222, 231)",
//                           boxShadow: "none",
//                         }}
//                       >
//                         <div className="p-3">
//                           <div className="rounded-2xl overflow-hidden bg-white">
//                             <img
//                               src={getImageUrl(item.product_image)}
//                               alt={item.product_name}
//                               className="w-full h-44 object-contain bg-white"
//                               loading="lazy"
//                             />
//                           </div>

//                           <h4 className="mt-3 text-[13px] font-extrabold text-slate-900 truncate">
//                             {item.product_name}
//                           </h4>

//                           <p className="mt-1 text-[12px] font-semibold text-slate-500 truncate">
//                             {item.brand ||
//                               item.category?.category_name ||
//                               "Popular"}{" "}
//                             • Fast delivery
//                           </p>

//                           <div className="mt-2 flex items-center gap-2">
//                             <span className="priceSelling text-[14px] flex items-center gap-1">
//                               <FaRupeeSign /> {item.selling_price}
//                             </span>
//                             {!!item.display_price && (
//                               <span className="priceMrp text-[12px] flex items-center gap-1">
//                                 <FaRupeeSign /> {item.display_price}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </Link>
//                     ))}
//                   </div>

//                   <button
//                     type="button"
//                     className="sm:hidden absolute -right-1 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur inline-flex items-center justify-center"
//                     style={{
//                       border: "1px solid rgb(241,245,249)",
//                       boxShadow: "none",
//                     }}
//                     onClick={() => scrollCarousel(1)}
//                     aria-label="Scroll right"
//                   >
//                     <FiChevronRight />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SingleProduct;
