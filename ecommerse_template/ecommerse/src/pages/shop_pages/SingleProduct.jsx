// import React, {
//   useEffect,
//   useState,
//   useContext,
//   useMemo,
//   useCallback,
// } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import {
//   FaHeart,
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
// import { FaAmazonPay } from "react-icons/fa6";
// import { MdFindReplace } from "react-icons/md";
// import { CiDeliveryTruck } from "react-icons/ci";
// import { TbBrandBeats } from "react-icons/tb";
// import { PiAppleLogoThin } from "react-icons/pi";

// const SingleProduct = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { addToCart } = useContext(CartContext);
//   const [product, setProduct] = useState(null);
//   const [mainImage, setMainImage] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [zoomStyle, setZoomStyle] = useState({});
//   const [randomNum] = useState(Math.floor(Math.random() * 250) + 1);
//   const [showFullDesc, setShowFullDesc] = useState(false);
//   const [categoryProducts, setCategoryProducts] = useState([]);

//   const getImageUrl = useCallback((img) => {
//     if (!img) return "https://via.placeholder.com/150";
//     const fileName = img.replace(/\\/g, "/").split("/").pop();
//     return `${globalBackendRoute}/uploads/products/${fileName}`;
//   }, []);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axios.get(
//           `${globalBackendRoute}/api/get-single-added-product-by-id/${id}`
//         );
//         setProduct(res.data);
//         setMainImage(res.data.product_image);

//         if (res.data?.category?._id) {
//           const catId = res.data.category._id;
//           const productsRes = await axios.get(
//             `${globalBackendRoute}/api/get-products-by-category/${catId}`
//           );
//           setCategoryProducts(
//             productsRes.data.filter((p) => p._id !== res.data._id)
//           );
//         }
//       } catch (error) {
//         console.error("Failed to load product:", error.message);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   const images = useMemo(
//     () => [product?.product_image, ...(product?.all_product_images || [])],
//     [product]
//   );

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
//     [mainImage, getImageUrl]
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
//       type === "inc" ? prev + 1 : prev > 1 ? prev - 1 : 1
//     );
//   }, []);

//   const handleBuyNow = () => {
//     if (!product?.availability_status) {
//       toast.error("Out of Stock");
//       return;
//     }
//     addToCart({ ...product, quantity }); // adds to cart
//     navigate("/checkout"); // redirects to checkout
//   };

//   if (!product) {
//     return (
//       <div className="text-center text-xl text-gray-500 py-20">Loading...</div>
//     );
//   }

//   return (
//     <div className="py-10 px-4 space-y-12">
//       <div className="flex flex-col lg:flex-row gap-16">
//         <div className="w-full lg:w-1/2 flex flex-col gap-4">
//           <div>
//             {/* Image section: thumbnails + main image in a row */}
//             <div className="flex gap-4">
//               {/* Thumbnails */}
//               <div className="flex flex-col gap-2 max-h-[400px] overflow-hidden">
//                 {images.slice(0, 6).map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={getImageUrl(img)}
//                     alt={`thumb-${idx}`}
//                     onClick={() => setMainImage(img)}
//                     className="w-14 h-14 object-cover rounded border cursor-pointer hover:scale-105 transition duration-200"
//                   />
//                 ))}
//               </div>

//               {/* Main Image */}
//               <div className="flex-1 bg-white rounded shadow-md flex justify-center items-center">
//                 <div
//                   onMouseMove={handleZoom}
//                   onMouseLeave={() => setZoomStyle({})}
//                   className="w-full h-[300px] md:h-[400px] bg-no-repeat bg-center bg-contain"
//                   style={
//                     Object.keys(zoomStyle).length > 0
//                       ? zoomStyle
//                       : {
//                           backgroundImage: `url(${getImageUrl(mainImage)})`,
//                           backgroundSize: "contain",
//                         }
//                   }
//                 />
//               </div>
//             </div>
//             <p className="text-sm text-center text-blue-700 mt-4">
//               roll over the image to zoom
//             </p>
//           </div>

//           {/* Icons below the image section */}
//           <div className="flex justify-evenly flex-wrap gap-4">
//             {[
//               {
//                 icon: <FaAmazonPay className="h-10 w-10 text-yellow-500" />,
//                 label: "Cash/Pay on Delivery",
//               },
//               {
//                 icon: <MdFindReplace className="h-10 w-10 text-rose-600" />,
//                 label: "Replacement Available",
//               },
//               {
//                 icon: <CiDeliveryTruck className="h-10 w-10 text-green-500" />,
//                 label: "Delivery Partner",
//               },
//               {
//                 icon: <TbBrandBeats className="h-10 w-10 text-blue-500" />,
//                 label: "Brand Installation",
//               },
//               {
//                 icon: <PiAppleLogoThin className="h-10 w-10 text-purple-500" />,
//                 label: "Top Brands",
//               },
//             ].map((item, idx) => (
//               <div
//                 key={idx}
//                 className="flex flex-col items-center"
//                 title={item.label}
//               >
//                 {item.icon}
//                 <p className="text-sm text-center mt-1">{item.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Description */}
//         <div className="w-full lg:w-1/2 space-y-5">
//           <h1 className="text-4xl font-bold text-gray-900">
//             {product.product_name}
//           </h1>
//           <div>
//             <p
//               className={`text-gray-700 ${
//                 showFullDesc ? "" : "line-clamp-3"
//               } transition-all`}
//             >
//               {product.description}
//             </p>
//             {product.description.length > 100 && (
//               <button
//                 className="text-blue-600 font-semibold text-sm"
//                 onClick={() => setShowFullDesc(!showFullDesc)}
//               >
//                 {showFullDesc ? "Show Less" : "Read More"}
//               </button>
//             )}
//           </div>

//           <p>
//             <span className="font-extrabold text-xl">Brand: </span>
//             <span className="text-blue-500">{product.brand}</span>
//           </p>

//           <p>
//             <span className="font-extrabold text-xl">Category: </span>
//             <span className="text-blue-500">
//               {product.category?.category_name}
//             </span>
//           </p>

//           <div>
//             <p>
//               <strong>{randomNum}+ bought</strong> in past month.
//             </p>
//             <hr className="text-orange-600 " />
//             <div className="bg-red-600 inline-block text-white font-bold p-1 rounded mt-1">
//               Summer Sale
//             </div>
//           </div>

//           <div className="flex items-center gap-1 text-orange-500">
//             {[...Array(5)].map((_, idx) => (
//               <FaStar
//                 key={idx}
//                 className={`w-5 h-5 ${
//                   idx < Math.round(product.avg_rating)
//                     ? "text-orange-500"
//                     : "text-gray-300"
//                 }`}
//               />
//             ))}
//             <span className="ml-2 text-sm text-gray-600">
//               ({product.total_reviews} reviews)
//             </span>
//           </div>

//           <div className="flex items-center gap-4">
//             <h2 className="text-3xl font-bold text-gray-900 flex items-center">
//               <FaRupeeSign /> {product.selling_price}
//             </h2>
//             {product.display_price && (
//               <span className="text-lg line-through text-red-300 flex items-center">
//                 <FaRupeeSign /> {product.display_price}
//               </span>
//             )}
//           </div>
//           <small className="text-blue-900">
//             M.R.P :{" "}
//             <del>Rs. {product.selling_price + product.selling_price * 0.5}</del>
//           </small>
//           <p className="text-sm">Inclusive of all taxes</p>

//           {/* Quantity */}
//           <div className="flex items-center gap-3 mt-4">
//             <span className="text-sm text-gray-600">Qty:</span>
//             <button
//               onClick={() => changeQuantity("dec")}
//               className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
//             >
//               <FaMinus />
//             </button>
//             <span className="text-lg font-bold">{quantity}</span>
//             <button
//               onClick={() => changeQuantity("inc")}
//               className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
//             >
//               <FaPlus />
//             </button>
//           </div>

//           {/* Actions */}
//           <div className="flex flex-col sm:flex-row gap-4 mt-6">
//             <button
//               onClick={handleAddToCart}
//               className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-full font-bold text-lg flex items-center gap-2 hover:opacity-90"
//             >
//               <FaCartPlus /> Add to Cart
//             </button>
//             <button
//               onClick={handleBuyNow}
//               className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-bold text-lg flex items-center gap-2 hover:opacity-90"
//             >
//               <FaCartPlus /> Buy Now
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Icons */}

//       {/* Specs & Delivery */}
//       <div className="grid md:grid-cols-2 gap-12 bg-white p-6">
//         <div>
//           <h2 className="font-bold text-lg mb-3 text-orange-600">
//             Product Technical Information
//           </h2>
//           <ul className="text-gray-700 space-y-1">
//             <li className="border-b flex justify-between">
//               <strong>PRODUCT NAME:</strong> <span>{product.product_name}</span>
//             </li>
//             <li className="border-b flex justify-between">
//               <strong>SKU:</strong> <span>{product.sku}</span>
//             </li>
//             <li className="border-b flex justify-between">
//               <strong>Brand:</strong> <span>{product.brand}</span>
//             </li>
//             <li className="border-b flex justify-between">
//               <strong>Color:</strong> <span>{product.color}</span>
//             </li>
//             <li className="border-b flex justify-between">
//               <strong>Material:</strong> <span>{product.material}</span>
//             </li>
//             <li className="border-b flex justify-between">
//               <strong>Barcode:</strong> <span>{product.barcode}</span>
//             </li>
//             <li className="border-b flex justify-between">
//               <strong>Dimensions:</strong>{" "}
//               <span>
//                 {product.dimensions?.length} x {product.dimensions?.width} x{" "}
//                 {product.dimensions?.height} cm
//               </span>
//             </li>
//             <li className="border-b flex justify-between">
//               <strong>Stock Available:</strong> <span>{product.stock}</span>
//             </li>
//           </ul>
//         </div>
//         <div>
//           <h2 className="font-bold text-lg mb-3">Additional Information</h2>
//           <ul className="text-gray-700 space-y-1 mb-3">
//             <li className="border-b flex justify-between">
//               <strong>Manufacturer:</strong> <span>{product.product_name}</span>
//             </li>
//             <li className="border-b flex justify-between">
//               <strong>Outlet Code:</strong> <span>{product.outlet}</span>
//             </li>
//             <li className="border-b flex justify-between">
//               <strong>Category:</strong>{" "}
//               <span>{product.category?.category_name}</span>
//             </li>
//           </ul>
//           <h2 className="font-bold text-lg mb-3">Delivery & Returns</h2>
//           <ul className="text-gray-700 space-y-1">
//             <li className="border-b flex justify-between">
//               <strong>Delivery Estimate:</strong>{" "}
//               <span>{product.delivery_time_estimate}</span>
//             </li>
//             <li className="border-b flex justify-between">
//               <strong>Replacement Policy:</strong>{" "}
//               <span>{product.replacement_policy}</span>
//             </li>
//             <li className="border-b flex justify-between">
//               <strong>Country of Origin:</strong>{" "}
//               <span>{product.origin_country}</span>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Related Products */}
//       {categoryProducts.length > 0 && (
//         <div className="mt-16 relative">
//           <div className="flex justify-between items-center mb-2">
//             <h2 className="text-xl font-extrabold mt-3 mb-3">
//               Explore More from This Category
//             </h2>
//             <span className="text-sm text-gray-500">
//               Showing {categoryProducts.length} items
//             </span>
//           </div>

//           <div className="relative">
//             <button
//               className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
//               onClick={() => {
//                 document.getElementById("catCarousel").scrollLeft -= 300;
//               }}
//             >
//               &#10094;
//             </button>

//             <div
//               id="catCarousel"
//               className="flex gap-6 overflow-x-auto scroll-smooth px-2"
//               style={{ scrollbarWidth: "none" }}
//             >
//               {categoryProducts.map((item) => (
//                 <Link
//                   key={item._id}
//                   to={`/single-product/${item._id}`}
//                   className="min-w-[220px] border p-3 rounded shadow hover:shadow-md bg-white flex-shrink-0"
//                 >
//                   <img
//                     src={getImageUrl(item.product_image)}
//                     alt={item.product_name}
//                     className="w-full h-40 object-cover rounded"
//                   />
//                   <h4 className="mt-2 text-sm font-semibold truncate">
//                     {item.product_name}
//                   </h4>
//                   <div>
//                     <p className="text-orange-600 font-bold text-sm">
//                       ₹{item.selling_price}
//                     </p>
//                   </div>
//                 </Link>
//               ))}
//             </div>

//             <button
//               className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
//               onClick={() => {
//                 document.getElementById("catCarousel").scrollLeft += 300;
//               }}
//             >
//               &#10095;
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SingleProduct;

//

// ✅ file: src/pages/shop_pages/SingleProduct.jsx
// ✅ ONLY UI redesign (NO logic changes):
// - Same font as Shop (Plus Jakarta Sans)
// - Same orange→amber gradient buttons everywhere
// - Subtle colors (no bright blues/reds), no page bg gradients
// - Compact, modern, responsive, lots of tasteful animations
// - Price: selling dark, display price red + strike
// - Related carousel: no borders/shadows on cards, more gap, smoother arrows

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
  FaRegHeart,
  FaHeart,
} from "react-icons/fa";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import { toast } from "react-toastify";
import { CartContext } from "../../components/cart_components/CartContext";
import { motion, AnimatePresence } from "framer-motion";
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

const SingleProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [zoomStyle, setZoomStyle] = useState({});
  const [randomNum] = useState(Math.floor(Math.random() * 250) + 1);
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
          `${globalBackendRoute}/api/get-single-added-product-by-id/${id}`
        );
        setProduct(res.data);
        setMainImage(res.data.product_image);

        if (res.data?.category?._id) {
          const catId = res.data.category._id;
          const productsRes = await axios.get(
            `${globalBackendRoute}/api/get-products-by-category/${catId}`
          );
          setCategoryProducts(
            (productsRes.data || []).filter((p) => p._id !== res.data._id)
          );
        }
      } catch (error) {
        console.error("Failed to load product:", error.message);
      }
    };
    fetchProduct();
  }, [id]);

  const images = useMemo(
    () => [product?.product_image, ...(product?.all_product_images || [])],
    [product]
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
    [mainImage, getImageUrl]
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
      type === "inc" ? prev + 1 : prev > 1 ? prev - 1 : 1
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
  const rating = Math.round(product?.avg_rating || 0);

  return (
    <div className="sp-font sp-scope w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .sp-font{
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }

        /* ✅ same button style as your Shop */
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

        .priceSelling{
          color: rgb(15,23,42);
          font-weight: 900;
        }
        .priceMrp{
          color: rgb(239,68,68);
          font-weight: 800;
          text-decoration: line-through;
        }

        .hide-scrollbar::-webkit-scrollbar{ display:none; }
        .hide-scrollbar{ -ms-overflow-style:none; scrollbar-width:none; }

        /* thumbnails */
        .thumbActive{
          outline: 2px solid rgba(249,115,22,.65);
          outline-offset: 2px;
        }
      `}</style>

      {/* Top container */}
      <div className="w-full px-3 sm:px-5 lg:px-10 py-6">
        {/* compact breadcrumb/back */}
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

        {/* main section */}
        <div className="mt-5 flex flex-col lg:flex-row gap-12 xl:gap-16">
          {/* LEFT: images */}
          <div className="w-full lg:w-[52%]">
            <div className="flex gap-4">
              {/* thumbnails */}
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
                          "h-[58px] w-[58px] rounded-2xl overflow-hidden bg-slate-50",
                          "transition-transform hover:scale-[1.03]",
                          active ? "thumbActive" : "",
                        ].join(" ")}
                        title="Preview"
                        style={{ boxShadow: "none", border: "none" }}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`thumb-${idx}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    );
                  })}
              </div>

              {/* main image */}
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
                    className="w-full h-[320px] md:h-[420px] rounded-2xl bg-no-repeat bg-center"
                    style={
                      Object.keys(zoomStyle).length > 0
                        ? {
                            ...zoomStyle,
                            backgroundRepeat: "no-repeat",
                            backgroundColor: "rgba(248,250,252,.8)",
                          }
                        : {
                            backgroundImage: `url(${getImageUrl(mainImage)})`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundColor: "rgba(248,250,252,.8)",
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

                  {/* thumbnails on mobile */}
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
                              "h-[62px] w-[62px] rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0",
                              active ? "thumbActive" : "",
                            ].join(" ")}
                            title="Preview"
                          >
                            <img
                              src={getImageUrl(img)}
                              alt={`thumb-${idx}`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </button>
                        );
                      })}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* service icons row */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.25 }}
              className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {[
                {
                  icon: <FaAmazonPay className="h-7 w-7 text-slate-800" />,
                  label: "Cash/Pay on Delivery",
                },
                {
                  icon: <MdFindReplace className="h-7 w-7 text-slate-800" />,
                  label: "Replacement Available",
                },
                {
                  icon: <CiDeliveryTruck className="h-8 w-8 text-slate-800" />,
                  label: "Fast Delivery",
                },
                {
                  icon: <TbBrandBeats className="h-7 w-7 text-slate-800" />,
                  label: "Brand Support",
                },
                {
                  icon: <PiAppleLogoThin className="h-8 w-8 text-slate-800" />,
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

          {/* RIGHT: details */}
          <div className="w-full lg:w-[48%]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <h1 className="text-[26px] sm:text-[32px] font-extrabold tracking-tight text-slate-900">
                {product.product_name}
              </h1>

              {/* meta pills */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-[12px] font-extrabold text-slate-700">
                  <FiInfo /> {product.brand || "Brand"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-[12px] font-extrabold text-slate-700">
                  <FiPackage /> {product.category?.category_name || "Category"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-[12px] font-extrabold text-slate-700">
                  <RiShieldCheckLine /> Secure checkout
                </span>
              </div>

              {/* rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <FaStar
                      key={idx}
                      className={[
                        "w-4 h-4",
                        idx < rating ? "text-orange-500" : "text-slate-200",
                      ].join(" ")}
                    />
                  ))}
                </div>
                <span className="text-[12px] font-semibold text-slate-500">
                  ({product.total_reviews} reviews)
                </span>
                <span className="text-[12px] font-extrabold text-slate-700">
                  • {randomNum}+ bought recently
                </span>
              </div>

              {/* desc */}
              <div className="rounded-2xl bg-slate-50/60 px-4 py-4">
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

              {/* price */}
              <div className="flex items-end gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[28px] font-black priceSelling flex items-center gap-2">
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

              {/* small MRP line kept (your logic) */}
              <small className="text-slate-500 font-semibold">
                M.R.P :{" "}
                <del>
                  Rs. {product.selling_price + product.selling_price * 0.5}
                </del>
              </small>

              {/* quantity */}
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

              {/* actions */}
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

              {/* small reassurance row */}
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

        {/* specs + delivery (no bright bg) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.25 }}
          className="mt-12 grid md:grid-cols-2 gap-10"
        >
          <div
            className="rounded-3xl bg-white p-6"
            style={{ border: "1px solid rgb(241,245,249)", boxShadow: "none" }}
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
                <span className="text-slate-500 font-extrabold">MATERIAL</span>
                <span className="text-right">{product.material}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-slate-500 font-extrabold">BARCODE</span>
                <span className="text-right">{product.barcode}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-slate-500 font-extrabold">
                  DIMENSIONS
                </span>
                <span className="text-right">
                  {product.dimensions?.length} x {product.dimensions?.width} x{" "}
                  {product.dimensions?.height} cm
                </span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-slate-500 font-extrabold">STOCK</span>
                <span className="text-right">{product.stock}</span>
              </li>
            </ul>
          </div>

          <div
            className="rounded-3xl bg-white p-6"
            style={{ border: "1px solid rgb(241,245,249)", boxShadow: "none" }}
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
                <span className="text-slate-500 font-extrabold">CATEGORY</span>
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
                <span className="text-slate-500 font-extrabold">DELIVERY</span>
                <span className="text-right">
                  {product.delivery_time_estimate}
                </span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-slate-500 font-extrabold">
                  REPLACEMENT
                </span>
                <span className="text-right">{product.replacement_policy}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-slate-500 font-extrabold">ORIGIN</span>
                <span className="text-right">{product.origin_country}</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* related products */}
        {categoryProducts.length > 0 && (
          <div className="mt-14">
            <div className="flex items-end justify-between gap-4 mb-3">
              <div>
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
              {/* mobile arrows */}
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
                      border: "1px solid rgb(241,245,249)",
                      boxShadow: "none",
                    }}
                  >
                    <div className="p-3">
                      <div className="rounded-2xl overflow-hidden bg-slate-50">
                        <img
                          src={getImageUrl(item.product_image)}
                          alt={item.product_name}
                          className="w-full h-44 object-cover"
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
  );
};

export default SingleProduct;
