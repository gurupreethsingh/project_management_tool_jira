// // import React, {
// //   useEffect,
// //   useState,
// //   useMemo,
// //   useCallback,
// //   useRef,
// // } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import Masonry from "react-masonry-css";
// // import globalBackendRoute from "../../config/Config";
// // import one from "../../assets/images/1.jpg";
// // import two from "../../assets/images/2.jpg";
// // import three from "../../assets/images/3.jpg";

// // const carouselSlides = [
// //   { image: one, title: "Summer Collection 2025" },
// //   { image: two, title: "Smart Gadgets at Unbeatable Prices" },
// //   { image: three, title: "New Arrivals Just Dropped!" },
// // ];

// // const Homepage = () => {
// //   const [categories, setCategories] = useState([]);
// //   const [brands, setBrands] = useState([]);
// //   const [featuredProducts, setFeaturedProducts] = useState([]);
// //   const [brandedProducts, setBrandedProducts] = useState([]);
// //   const [visibleCategories, setVisibleCategories] = useState(0);

// //   const navigate = useNavigate();
// //   const categoryCarouselRef = useRef(null);
// //   const brandProductsCarouselRef = useRef(null);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const [catRes, prodRes] = await Promise.all([
// //           axios.get(`${globalBackendRoute}/api/all-categories`),
// //           axios.get(`${globalBackendRoute}/api/all-added-products`),
// //         ]);

// //         setCategories(catRes.data);

// //         const allProducts = prodRes.data;
// //         const shuffled = [...allProducts]
// //           .sort(() => 0.5 - Math.random())
// //           .slice(0, 5);
// //         setFeaturedProducts(shuffled);

// //         const brandSet = new Set();
// //         const branded = [];

// //         for (const p of allProducts) {
// //           if (p.brand?.trim()) {
// //             const brand = p.brand.trim().toUpperCase();
// //             if (!brandSet.has(brand)) brandSet.add(brand);
// //             branded.push(p);
// //           }
// //         }

// //         setBrands([...brandSet]);
// //         setBrandedProducts(branded);
// //       } catch (err) {
// //         console.error("Homepage Fetch Error:", err);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   const handleClick = useCallback(
// //     (name) => navigate(`/search-products?query=${encodeURIComponent(name)}`),
// //     [navigate]
// //   );

// //   const breakpointColumnsObj = useMemo(
// //     () => ({
// //       default: 5,
// //       1100: 3,
// //       768: 2,
// //       500: 1,
// //     }),
// //     []
// //   );

// //   // Calculate visible categories
// //   useEffect(() => {
// //     const updateVisibleCategories = () => {
// //       const el = categoryCarouselRef.current;
// //       if (el) {
// //         const containerWidth = el.offsetWidth;
// //         const itemWidth = 200 + 16; // min-w-[200px] + gap-4 (16px)
// //         const visibleCount = Math.floor(containerWidth / itemWidth);
// //         setVisibleCategories(visibleCount);
// //       }
// //     };

// //     updateVisibleCategories();
// //     window.addEventListener("resize", updateVisibleCategories);
// //     return () => window.removeEventListener("resize", updateVisibleCategories);
// //   }, [categories]);

// //   return (
// //     <div className="bg-white relative">
// //       {/* === HERO SLIDER === */}
// //       <div className="relative">
// //         <div
// //           id="carouselExampleDark"
// //           className="carousel slide"
// //           data-bs-ride="carousel"
// //         >
// //           <div className="carousel-inner">
// //             {carouselSlides.map((slide, idx) => (
// //               <div
// //                 key={idx}
// //                 className={`carousel-item ${idx === 0 ? "active" : ""}`}
// //                 data-bs-interval="5000"
// //               >
// //                 <img
// //                   src={slide.image}
// //                   className="d-block w-100 rounded-5"
// //                   alt={slide.title}
// //                   loading="lazy"
// //                   style={{ height: "60vh", objectFit: "cover" }}
// //                 />
// //                 <div className="carousel-caption d-none d-md-block animate__animated animate__fadeInUp">
// //                   <h5 className="fw-bold bg-white bg-opacity-50 px-4 py-2 rounded text-gray-900">
// //                     {slide.title}
// //                   </h5>
// //                   <a
// //                     href="/shop"
// //                     className="inline-block mt-3 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
// //                   >
// //                     Shop Now
// //                   </a>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>

// //           <div className="carousel-indicators">
// //             {[0, 1, 2].map((idx) => (
// //               <button
// //                 key={idx}
// //                 type="button"
// //                 data-bs-target="#carouselExampleDark"
// //                 data-bs-slide-to={idx}
// //                 className={idx === 0 ? "active" : ""}
// //                 aria-current={idx === 0 ? "true" : "false"}
// //                 aria-label={`Slide ${idx + 1}`}
// //               ></button>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* === CATEGORY CAROUSEL === */}
// //       <section className="py-10 px-4 bg-white">
// //         <div className="flex justify-between items-center mb-6">
// //           <h2 className="text-3xl font-bold text-center">
// //             Explore Our Categories
// //           </h2>
// //           <span className="text-sm text-gray-500">
// //             Showing {Math.min(visibleCategories, categories.length)} of{" "}
// //             {categories.length} categories
// //           </span>
// //         </div>
// //         <div className="relative">
// //           <button
// //             className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
// //             onClick={() => {
// //               const el = categoryCarouselRef.current;
// //               if (el) {
// //                 el.scrollBy({ left: -300, behavior: "smooth" });
// //               }
// //             }}
// //           >
// //             &#10094;
// //           </button>
// //           <div
// //             id="categoryCarousel"
// //             ref={categoryCarouselRef}
// //             className="flex gap-4 overflow-x-auto scroll-smooth px-2 hide-scrollbar"
// //           >
// //             {categories.map((cat, index) => (
// //               <div
// //                 key={`${cat._id}-${index}`}
// //                 className="min-w-[200px] rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer flex-shrink-0"
// //                 onClick={() => handleClick(cat.category_name)}
// //               >
// //                 <img
// //                   src={`${globalBackendRoute}/${cat.category_image}`}
// //                   alt={cat.category_name}
// //                   className="w-full h-40 object-cover"
// //                   loading="lazy"
// //                 />
// //                 <div className="text-center bg-black text-white py-2 text-xs sm:text-sm font-semibold uppercase truncate">
// //                   {cat.category_name}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //           <button
// //             className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
// //             onClick={() => {
// //               const el = categoryCarouselRef.current;
// //               if (el) {
// //                 el.scrollBy({ left: 300, behavior: "smooth" });
// //               }
// //             }}
// //           >
// //             &#10095;
// //           </button>
// //         </div>
// //       </section>

// //       {/* === BRANDS SECTION === */}
// //       <section className="py-10 px-4 bg-gray-50">
// //         <h2 className="text-3xl font-bold text-center mb-6">Popular Brands</h2>
// //         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
// //           {brands.map((brand, idx) => (
// //             <div
// //               key={idx}
// //               onClick={() => handleClick(brand)}
// //               className="bg-white p-4 shadow-md rounded-lg hover:bg-orange-100 hover:scale-105 transition cursor-pointer text-center"
// //             >
// //               <span
// //                 className="text-xs sm:text-sm md:text-base lg:text-sm font-semibold uppercase text-orange-500 block truncate"
// //                 title={brand}
// //               >
// //                 {brand}
// //               </span>
// //             </div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* === BRAND PRODUCTS === */}
// //       {brandedProducts.length > 0 && (
// //         <section className="mt-16 mb-16 relative">
// //           <div className="flex justify-between items-center mb-2">
// //             <h2 className="text-xl font-extrabold text-gray-800">
// //               Explore Products from Popular Brands
// //             </h2>
// //             <span className="text-sm text-gray-500">
// //               Showing {brandedProducts.length} items
// //             </span>
// //           </div>
// //           <div className="relative">
// //             <button
// //               className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full"
// //               onClick={() => {
// //                 const el = brandProductsCarouselRef.current;
// //                 if (el) {
// //                   el.scrollBy({ left: -300, behavior: "smooth" });
// //                 }
// //               }}
// //             >
// //               &#10094;
// //             </button>
// //             <div
// //               id="brandProductsCarousel"
// //               ref={brandProductsCarouselRef}
// //               className="flex gap-6 overflow-x-auto scroll-smooth px-2 hide-scrollbar"
// //             >
// //               {brandedProducts.map((item) => (
// //                 <div
// //                   key={item._id}
// //                   className="min-w-[220px] border p-3 rounded shadow hover:shadow-md bg-white flex-shrink-0 cursor-pointer text-center"
// //                   onClick={() => navigate(`/single-product/${item._id}`)}
// //                 >
// //                   <img
// //                     src={
// //                       item.product_image
// //                         ? `${globalBackendRoute}/uploads/products/${item.product_image
// //                             .replace(/\\/g, "/")
// //                             .split("/")
// //                             .pop()}`
// //                         : "https://via.placeholder.com/150"
// //                     }
// //                     alt={item.product_name}
// //                     className="w-full h-40 object-cover rounded"
// //                     loading="lazy"
// //                   />
// //                   <h4 className="mt-2 text-sm font-semibold truncate">
// //                     {item.product_name}
// //                   </h4>
// //                   <p className="text-orange-600 font-bold text-sm">
// //                     ₹{item.selling_price}
// //                   </p>
// //                 </div>
// //               ))}
// //             </div>
// //             <button
// //               className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full"
// //               onClick={() => {
// //                 const el = brandProductsCarouselRef.current;
// //                 if (el) {
// //                   el.scrollBy({ left: 300, behavior: "smooth" });
// //                 }
// //               }}
// //             >
// //               &#10095;
// //             </button>
// //           </div>
// //         </section>
// //       )}
// //     </div>
// //   );
// // };

// // export default Homepage;

// // old homepage

// import React, {
//   useEffect,
//   useState,
//   useMemo,
//   useCallback,
//   useRef,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Masonry from "react-masonry-css"; // kept (even if unused) so you don't lose anything
// import globalBackendRoute from "../../config/Config";
// import one from "../../assets/images/1.jpg";
// import two from "../../assets/images/2.jpg";
// import three from "../../assets/images/3.jpg";

// const carouselSlides = [
//   { image: one, title: "Summer Collection 2025" },
//   { image: two, title: "Smart Gadgets at Unbeatable Prices" },
//   { image: three, title: "New Arrivals Just Dropped!" },
// ];

// /** ---------- Animated Purchase Toast (bottom-left) ---------- **/
// const PurchaseToast = ({ show, payload }) => {
//   if (!payload) return null;

//   const initials = (payload.user || "U")
//     .split(" ")
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((w) => w[0]?.toUpperCase())
//     .join("");

//   return (
//     <div
//       className={[
//         "fixed bottom-6 left-6 z-[9999] w-[92vw] max-w-[360px]",
//         "transition-all duration-500 ease-out",
//         show
//           ? "opacity-100 translate-y-0"
//           : "opacity-0 translate-y-6 pointer-events-none",
//       ].join(" ")}
//       aria-live="polite"
//     >
//       {/* glow */}
//       <div className="absolute -inset-2 rounded-2xl bg-orange-500/20 blur-xl" />

//       <div
//         className={[
//           "relative overflow-hidden rounded-2xl border border-orange-200/70",
//           "bg-white/90 backdrop-blur-xl shadow-2xl",
//         ].join(" ")}
//       >
//         {/* animated top bar */}
//         <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 animate-[shimmer_2.2s_linear_infinite]" />

//         <div className="p-4 flex gap-3 items-start">
//           <div className="shrink-0">
//             <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 text-white flex items-center justify-center font-black shadow-md">
//               {initials || "U"}
//             </div>
//           </div>

//           <div className="min-w-0">
//             <p className="text-[13px] text-gray-700">
//               <span className="font-extrabold text-gray-900">
//                 {payload.user}
//               </span>{" "}
//               purchased{" "}
//               <span className="font-extrabold text-orange-600">
//                 {payload.product}
//               </span>
//               .
//             </p>
//             <p className="mt-1 text-[11px] text-gray-500 flex items-center gap-2">
//               <span className="inline-flex items-center gap-1">
//                 <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
//                 Verified order
//               </span>
//               <span>•</span>
//               <span>{payload.when}</span>
//             </p>

//             {/* progress */}
//             <div className="mt-3 h-1.5 w-full rounded-full bg-orange-100 overflow-hidden">
//               <div className="h-full w-full bg-gradient-to-r from-orange-500 to-amber-400 animate-[toastProgress_5s_linear_forwards]" />
//             </div>
//           </div>
//         </div>

//         {/* subtle corner decoration */}
//         <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-500/15 blur-2xl" />
//       </div>

//       {/* keyframes */}
//       <style>{`
//         @keyframes shimmer {
//           0% { filter: hue-rotate(0deg); }
//           100% { filter: hue-rotate(360deg); }
//         }
//         @keyframes toastProgress {
//           from { transform: translateX(-100%); }
//           to { transform: translateX(0%); }
//         }
//       `}</style>
//     </div>
//   );
// };

// const Homepage = () => {
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [brandedProducts, setBrandedProducts] = useState([]);
//   const [visibleCategories, setVisibleCategories] = useState(0);

//   // toast state
//   const [toastShow, setToastShow] = useState(false);
//   const [toastPayload, setToastPayload] = useState(null);

//   const navigate = useNavigate();
//   const categoryCarouselRef = useRef(null);
//   const brandProductsCarouselRef = useRef(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [catRes, prodRes] = await Promise.all([
//           axios.get(`${globalBackendRoute}/api/all-categories`),
//           axios.get(`${globalBackendRoute}/api/all-added-products`),
//         ]);

//         setCategories(catRes.data);

//         const allProducts = prodRes.data;
//         const shuffled = [...allProducts]
//           .sort(() => 0.5 - Math.random())
//           .slice(0, 5);
//         setFeaturedProducts(shuffled);

//         const brandSet = new Set();
//         const branded = [];

//         for (const p of allProducts) {
//           if (p.brand?.trim()) {
//             const brand = p.brand.trim().toUpperCase();
//             if (!brandSet.has(brand)) brandSet.add(brand);
//             branded.push(p);
//           }
//         }

//         setBrands([...brandSet]);
//         setBrandedProducts(branded);
//       } catch (err) {
//         console.error("Homepage Fetch Error:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleClick = useCallback(
//     (name) => navigate(`/search-products?query=${encodeURIComponent(name)}`),
//     [navigate]
//   );

//   const breakpointColumnsObj = useMemo(
//     () => ({
//       default: 5,
//       1100: 3,
//       768: 2,
//       500: 1,
//     }),
//     []
//   );

//   // Calculate visible categories (kept)
//   useEffect(() => {
//     const updateVisibleCategories = () => {
//       const el = categoryCarouselRef.current;
//       if (el) {
//         const containerWidth = el.offsetWidth;
//         const itemWidth = 240 + 16; // updated card width + gap (keeps same logic)
//         const visibleCount = Math.max(
//           1,
//           Math.floor(containerWidth / itemWidth)
//         );
//         setVisibleCategories(visibleCount);
//       }
//     };

//     updateVisibleCategories();
//     window.addEventListener("resize", updateVisibleCategories);
//     return () => window.removeEventListener("resize", updateVisibleCategories);
//   }, [categories]);

//   /** ---------- Purchase Toast scheduler ---------- **/
//   const toastPool = useMemo(
//     () => ({
//       users: [
//         "Aarav Mehta",
//         "Diya Sharma",
//         "Karthik Reddy",
//         "Ananya Gupta",
//         "Rohan Iyer",
//         "Meera Nair",
//         "Ishaan Verma",
//         "Sneha Kapoor",
//         "Vikram Singh",
//         "Priya Kulkarni",
//       ],
//       products: [
//         "Wireless Earbuds Pro",
//         "Smartwatch Series X",
//         "Minimal Sneakers",
//         "Premium Hoodie",
//         "Gaming Mouse RGB",
//         "Leather Backpack",
//         "4K Action Camera",
//         "Bluetooth Speaker Mini",
//         "Skincare Combo Kit",
//         "Stainless Water Bottle",
//       ],
//       when: ["just now", "1 min ago", "2 mins ago", "moments ago"],
//     }),
//     []
//   );

//   const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

//   const showToastOnce = useCallback(() => {
//     const payload = {
//       user: pickRandom(toastPool.users),
//       product: pickRandom(toastPool.products),
//       when: pickRandom(toastPool.when),
//     };
//     setToastPayload(payload);
//     setToastShow(true);

//     // visible for 5 seconds
//     const hideT = setTimeout(() => setToastShow(false), 5000);
//     return () => clearTimeout(hideT);
//   }, [toastPool]);

//   useEffect(() => {
//     // first toast appears after a short delay
//     const firstDelay = 8000; // 8s after landing
//     let intervalId = null;

//     const firstId = setTimeout(() => {
//       showToastOnce();
//       // thereafter: every 3–4 minutes (randomized each cycle)
//       const scheduleNext = () => {
//         const nextMs = (3 + Math.random()) * 60 * 1000; // 3.0 to 4.0 minutes
//         intervalId = setTimeout(() => {
//           showToastOnce();
//           scheduleNext();
//         }, nextMs);
//       };
//       scheduleNext();
//     }, firstDelay);

//     return () => {
//       clearTimeout(firstId);
//       if (intervalId) clearTimeout(intervalId);
//     };
//   }, [showToastOnce]);

//   /** ---------- Helpers ---------- **/
//   const resolveProductImage = (item) => {
//     if (!item?.product_image) return "https://via.placeholder.com/600x600";
//     const file = item.product_image.replace(/\\/g, "/").split("/").pop();
//     return `${globalBackendRoute}/uploads/products/${file}`;
//   };

//   return (
//     <div className=" min-h-screen relative">
//       {/* Modern font + page theme */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
//         .hp-font { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, 'Apple Color Emoji','Segoe UI Emoji'; }
//         .hide-scrollbar::-webkit-scrollbar { display: none; }
//         .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>

//       {/* Toast */}
//       <PurchaseToast show={toastShow} payload={toastPayload} />

//       {/* Outer container (wider) */}
//       <div className="hp-font max-w-full mx-auto px-3 sm:px-6 lg:px-10">
//         {/* === HERO SLIDER (modern overlay) === */}
//         <section className="">
//           <div className="relative overflow-hidden rounded-[28px] shadow-[0_30px_80px_-50px_rgba(0,0,0,0.45)]">
//             <div
//               id="carouselExampleDark"
//               className="carousel slide"
//               data-bs-ride="carousel"
//             >
//               <div className="carousel-inner">
//                 {carouselSlides.map((slide, idx) => (
//                   <div
//                     key={idx}
//                     className={`carousel-item ${idx === 0 ? "active" : ""}`}
//                     data-bs-interval="5000"
//                   >
//                     <div className="relative">
//                       <img
//                         src={slide.image}
//                         className="d-block w-100"
//                         alt={slide.title}
//                         loading="lazy"
//                         style={{
//                           height: "68vh",
//                           objectFit: "cover",
//                         }}
//                       />
//                       {/* gradient overlay */}
//                       <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/30 to-orange-500/20" />
//                       {/* content */}
//                       <div className="absolute inset-0 flex items-end">
//                         <div className="w-full p-6 sm:p-10">
//                           <div className="max-w-[720px]">
//                             <div className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white px-4 py-2 text-[12px] sm:text-[13px] backdrop-blur-md border border-white/20">
//                               <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
//                               Trending picks • Limited-time offers
//                             </div>

//                             <h1 className="mt-4 text-white font-extrabold leading-tight tracking-tight text-[30px] sm:text-[44px] md:text-[52px]">
//                               {slide.title}
//                             </h1>

//                             <p className="mt-3 text-white/85 text-[13px] sm:text-[15px] md:text-[16px] leading-relaxed">
//                               Shop the latest deals with premium quality, fast
//                               delivery, and curated collections designed for
//                               you.
//                             </p>

//                             <div className="mt-5 flex flex-wrap gap-3">
//                               <a
//                                 href="/shop"
//                                 className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-3 shadow-lg shadow-orange-500/30 transition"
//                               >
//                                 Shop Now
//                                 <span className="text-lg">→</span>
//                               </a>
//                               <button
//                                 onClick={() => navigate("/shop")}
//                                 className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold px-5 py-3 border border-white/20 backdrop-blur-md transition"
//                               >
//                                 Explore Deals
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="carousel-indicators mb-4">
//                 {[0, 1, 2].map((idx) => (
//                   <button
//                     key={idx}
//                     type="button"
//                     data-bs-target="#carouselExampleDark"
//                     data-bs-slide-to={idx}
//                     className={idx === 0 ? "active" : ""}
//                     aria-current={idx === 0 ? "true" : "false"}
//                     aria-label={`Slide ${idx + 1}`}
//                   ></button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* === QUICK VALUE STRIP === */}
//         <section className="mt-6">
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//             {[
//               {
//                 title: "Fast Delivery",
//                 desc: "Quick shipping on top picks",
//               },
//               {
//                 title: "Best Prices",
//                 desc: "Deals curated daily for you",
//               },
//               {
//                 title: "Secure Checkout",
//                 desc: "Protected payments & support",
//               },
//             ].map((x) => (
//               <div
//                 key={x.title}
//                 className="rounded-2xl bg-white border border-orange-100 shadow-sm px-5 py-4 flex items-center justify-between"
//               >
//                 <div>
//                   <p className="font-extrabold text-gray-900">{x.title}</p>
//                   <p className="text-[12px] text-gray-500 mt-0.5">{x.desc}</p>
//                 </div>
//                 <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-black">
//                   ✓
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* === CATEGORY CAROUSEL (modern cards) === */}
//         <section className="mt-10">
//           <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
//             <div>
//               <h2 className="text-[26px] sm:text-[32px] font-extrabold text-gray-900 tracking-tight">
//                 Explore Categories
//               </h2>
//               <p className="text-gray-600 text-[13px] sm:text-[14px] mt-1">
//                 Tap any category to instantly search products.
//               </p>
//             </div>
//             <div className="text-[12px] text-gray-500">
//               Showing{" "}
//               <span className="font-bold text-gray-800">
//                 {Math.min(visibleCategories, categories.length)}
//               </span>{" "}
//               of{" "}
//               <span className="font-bold text-gray-800">
//                 {categories.length}
//               </span>{" "}
//               categories
//             </div>
//           </div>

//           <div className="relative">
//             {/* left */}
//             <button
//               className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur border border-orange-100 shadow-md px-3 py-2 rounded-full hover:scale-105 transition"
//               onClick={() => {
//                 const el = categoryCarouselRef.current;
//                 if (el) el.scrollBy({ left: -420, behavior: "smooth" });
//               }}
//               aria-label="Scroll categories left"
//               type="button"
//             >
//               &#10094;
//             </button>

//             <div
//               ref={categoryCarouselRef}
//               className="flex gap-4 overflow-x-auto scroll-smooth px-1 py-2 hide-scrollbar"
//             >
//               {categories.map((cat, index) => (
//                 <div
//                   key={`${cat._id}-${index}`}
//                   className={[
//                     "min-w-[240px] sm:min-w-[260px]",
//                     "rounded-2xl overflow-hidden cursor-pointer flex-shrink-0",
//                     "bg-white border border-orange-100 shadow-sm hover:shadow-md",
//                     "transition-transform duration-300 hover:-translate-y-1",
//                   ].join(" ")}
//                   onClick={() => handleClick(cat.category_name)}
//                   title={cat.category_name}
//                 >
//                   <div className="relative">
//                     <img
//                       src={`${globalBackendRoute}/${cat.category_image}`}
//                       alt={cat.category_name}
//                       className="w-full h-[150px] object-cover"
//                       loading="lazy"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
//                     <div className="absolute bottom-3 left-3 right-3">
//                       <div className="flex items-center justify-between gap-2">
//                         <span className="text-white font-extrabold text-[14px] truncate">
//                           {cat.category_name}
//                         </span>
//                         <span className="bg-orange-500/90 text-white text-[11px] font-bold px-2 py-1 rounded-full">
//                           Shop
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="p-3">
//                     <p className="text-[12px] text-gray-600">
//                       Discover top-rated items in{" "}
//                       <span className="font-bold text-gray-900">
//                         {cat.category_name}
//                       </span>
//                       .
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* right */}
//             <button
//               className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur border border-orange-100 shadow-md px-3 py-2 rounded-full hover:scale-105 transition"
//               onClick={() => {
//                 const el = categoryCarouselRef.current;
//                 if (el) el.scrollBy({ left: 420, behavior: "smooth" });
//               }}
//               aria-label="Scroll categories right"
//               type="button"
//             >
//               &#10095;
//             </button>
//           </div>
//         </section>

//         {/* === BRANDS SECTION (chips style) === */}
//         <section className="mt-12">
//           <div className="flex items-end justify-between gap-3 mb-5">
//             <div>
//               <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 tracking-tight">
//                 Popular Brands
//               </h2>
//               <p className="text-gray-600 text-[13px] sm:text-[14px] mt-1">
//                 Quick search by brand — tap to view matching products.
//               </p>
//             </div>
//             <div className="hidden sm:block text-[12px] text-gray-500">
//               {brands.length} brands
//             </div>
//           </div>

//           <div className="rounded-2xl bg-white border border-orange-100 shadow-sm p-4 sm:p-5">
//             <div className="flex flex-wrap gap-3">
//               {brands.map((brand, idx) => (
//                 <button
//                   key={idx}
//                   type="button"
//                   onClick={() => handleClick(brand)}
//                   title={brand}
//                   className={[
//                     "group inline-flex items-center gap-2",
//                     "rounded-full border border-orange-200 bg-orange-50",
//                     "px-4 py-2 text-[12px] sm:text-[13px]",
//                     "font-extrabold uppercase text-orange-700",
//                     "hover:bg-orange-500 hover:text-white hover:border-orange-500",
//                     "transition",
//                   ].join(" ")}
//                 >
//                   <span className="truncate max-w-[150px]">{brand}</span>
//                   <span className="opacity-70 group-hover:opacity-100">→</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* === BRAND PRODUCTS (premium horizontal cards) === */}
//         {brandedProducts.length > 0 && (
//           <section className="mt-14 mb-16">
//             <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
//               <div>
//                 <h2 className="text-[22px] sm:text-[28px] font-extrabold text-gray-900 tracking-tight">
//                   Explore Products from Popular Brands
//                 </h2>
//                 <p className="text-gray-600 text-[13px] sm:text-[14px] mt-1">
//                   Scroll sideways to browse — click any product to view details.
//                 </p>
//               </div>
//               <span className="text-[12px] text-gray-500">
//                 Showing{" "}
//                 <span className="font-bold text-gray-800">
//                   {brandedProducts.length}
//                 </span>{" "}
//                 items
//               </span>
//             </div>

//             <div className="relative">
//               <button
//                 className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur border border-orange-100 shadow-md px-3 py-2 rounded-full hover:scale-105 transition"
//                 onClick={() => {
//                   const el = brandProductsCarouselRef.current;
//                   if (el) el.scrollBy({ left: -520, behavior: "smooth" });
//                 }}
//                 aria-label="Scroll brand products left"
//                 type="button"
//               >
//                 &#10094;
//               </button>

//               <div
//                 ref={brandProductsCarouselRef}
//                 className="flex gap-5 overflow-x-auto scroll-smooth px-1 py-2 hide-scrollbar"
//               >
//                 {brandedProducts.map((item) => (
//                   <div
//                     key={item._id}
//                     className={[
//                       "min-w-[240px] sm:min-w-[270px]",
//                       "rounded-2xl border border-orange-100",
//                       "bg-white shadow-sm hover:shadow-md",
//                       "transition-transform duration-300 hover:-translate-y-1",
//                       "cursor-pointer flex-shrink-0 overflow-hidden",
//                     ].join(" ")}
//                     onClick={() => navigate(`/single-product/${item._id}`)}
//                     title={item.product_name}
//                   >
//                     <div className="relative">
//                       <img
//                         src={resolveProductImage(item)}
//                         alt={item.product_name}
//                         className="w-full h-[180px] object-cover"
//                         loading="lazy"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
//                       <div className="absolute top-3 left-3">
//                         <span className="rounded-full bg-orange-500/95 text-white text-[11px] font-extrabold px-3 py-1 shadow">
//                           HOT
//                         </span>
//                       </div>
//                     </div>

//                     <div className="p-4">
//                       <h4 className="text-[14px] font-extrabold text-gray-900 truncate">
//                         {item.product_name}
//                       </h4>

//                       <div className="mt-2 flex items-center justify-between">
//                         <p className="text-orange-600 font-black text-[15px]">
//                           ₹{item.selling_price}
//                         </p>
//                         <span className="text-[12px] text-gray-500 font-semibold">
//                           View →
//                         </span>
//                       </div>

//                       <div className="mt-3 flex items-center gap-2">
//                         <span className="h-2 w-2 rounded-full bg-green-500" />
//                         <p className="text-[12px] text-gray-600">
//                           Available • Fast delivery
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <button
//                 className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur border border-orange-100 shadow-md px-3 py-2 rounded-full hover:scale-105 transition"
//                 onClick={() => {
//                   const el = brandProductsCarouselRef.current;
//                   if (el) el.scrollBy({ left: 520, behavior: "smooth" });
//                 }}
//                 aria-label="Scroll brand products right"
//                 type="button"
//               >
//                 &#10095;
//               </button>
//             </div>
//           </section>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Homepage;

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Masonry from "react-masonry-css"; // kept (even if unused) so you don't lose anything
import globalBackendRoute from "../../config/Config";
import one from "../../assets/images/1.jpg";
import two from "../../assets/images/2.jpg";
import three from "../../assets/images/3.jpg";

const carouselSlides = [
  { image: one, title: "Summer Collection 2025" },
  { image: two, title: "Smart Gadgets at Unbeatable Prices" },
  { image: three, title: "New Arrivals Just Dropped!" },
];

/** ---------- Animated Purchase Toast (bottom-left) ---------- **/
const PurchaseToast = ({ show, payload }) => {
  if (!payload) return null;

  const initials = (payload.user || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={[
        "fixed bottom-6 left-6 z-[9999] w-[92vw] max-w-[360px]",
        "transition-all duration-500 ease-out",
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6 pointer-events-none",
      ].join(" ")}
      aria-live="polite"
    >
      <div className="absolute -inset-2 rounded-2xl bg-orange-500/20 blur-xl" />

      <div className="relative overflow-hidden rounded-2xl border border-orange-200/70 bg-white/90 backdrop-blur-xl shadow-2xl">
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 animate-[shimmer_2.2s_linear_infinite]" />

        <div className="p-4 flex gap-3 items-start">
          <div className="shrink-0">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 text-white flex items-center justify-center font-black shadow-md">
              {initials || "U"}
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-[13px] text-gray-700">
              <span className="font-extrabold text-gray-900">
                {payload.user}
              </span>{" "}
              purchased{" "}
              <span className="font-extrabold text-orange-600">
                {payload.product}
              </span>
              .
            </p>

            <p className="mt-1 text-[11px] text-gray-500 flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Verified order
              </span>
              <span>•</span>
              <span>{payload.when}</span>
            </p>

            <div className="mt-3 h-1.5 w-full rounded-full bg-orange-100 overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-orange-500 to-amber-400 animate-[toastProgress_5s_linear_forwards]" />
            </div>
          </div>
        </div>

        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-500/15 blur-2xl" />
      </div>

      <style>{`
        @keyframes shimmer { 0% { filter:hue-rotate(0deg);} 100% { filter:hue-rotate(360deg);} }
        @keyframes toastProgress { from { transform: translateX(-100%);} to { transform: translateX(0%);} }
      `}</style>
    </div>
  );
};

const Homepage = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [brandedProducts, setBrandedProducts] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState(0);

  // toast state
  const [toastShow, setToastShow] = useState(false);
  const [toastPayload, setToastPayload] = useState(null);

  // ✅ NEW: grid show-more state (for branded products)
  const [showAllBrandProducts, setShowAllBrandProducts] = useState(false);

  // ✅ NEW: responsive columns count so we can guarantee "2 rows always"
  const [brandGridCols, setBrandGridCols] = useState(6);

  const navigate = useNavigate();
  const categoryCarouselRef = useRef(null);

  // kept (even if unused now)
  const brandProductsCarouselRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${globalBackendRoute}/api/all-categories`),
          axios.get(`${globalBackendRoute}/api/all-added-products`),
        ]);

        setCategories(catRes.data);

        const allProducts = prodRes.data;
        const shuffled = [...allProducts]
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
        setFeaturedProducts(shuffled);

        const brandSet = new Set();
        const branded = [];

        for (const p of allProducts) {
          if (p.brand?.trim()) {
            const brand = p.brand.trim().toUpperCase();
            if (!brandSet.has(brand)) brandSet.add(brand);
            branded.push(p);
          }
        }

        setBrands([...brandSet]);
        setBrandedProducts(branded);
      } catch (err) {
        console.error("Homepage Fetch Error:", err);
      }
    };

    fetchData();
  }, []);

  const handleClick = useCallback(
    (name) => navigate(`/search-products?query=${encodeURIComponent(name)}`),
    [navigate]
  );

  const breakpointColumnsObj = useMemo(
    () => ({
      default: 5,
      1100: 3,
      768: 2,
      500: 1,
    }),
    []
  );

  // Calculate visible categories (kept)
  useEffect(() => {
    const updateVisibleCategories = () => {
      const el = categoryCarouselRef.current;
      if (el) {
        const containerWidth = el.offsetWidth;
        const itemWidth = 240 + 16;
        const visibleCount = Math.max(
          1,
          Math.floor(containerWidth / itemWidth)
        );
        setVisibleCategories(visibleCount);
      }
    };

    updateVisibleCategories();
    window.addEventListener("resize", updateVisibleCategories);
    return () => window.removeEventListener("resize", updateVisibleCategories);
  }, [categories]);

  /** ✅ NEW: compute brand grid columns based on screen width
   *  Requirement: mobile must have at least 2 columns always.
   *  And desktop should show 5–6 per row.
   */
  useEffect(() => {
    const computeCols = () => {
      const w = window.innerWidth;

      // mobile: always 2 cols
      if (w < 640) return 2; // <sm
      if (w < 768) return 3; // sm
      if (w < 1024) return 4; // md
      if (w < 1280) return 5; // lg
      return 6; // xl+
    };

    const apply = () => setBrandGridCols(computeCols());
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  /** ---------- Purchase Toast scheduler ---------- **/
  const toastPool = useMemo(
    () => ({
      users: [
        "Aarav Mehta",
        "Diya Sharma",
        "Karthik Reddy",
        "Ananya Gupta",
        "Rohan Iyer",
        "Meera Nair",
        "Ishaan Verma",
        "Sneha Kapoor",
        "Vikram Singh",
        "Priya Kulkarni",
      ],
      products: [
        "Wireless Earbuds Pro",
        "Smartwatch Series X",
        "Minimal Sneakers",
        "Premium Hoodie",
        "Gaming Mouse RGB",
        "Leather Backpack",
        "4K Action Camera",
        "Bluetooth Speaker Mini",
        "Skincare Combo Kit",
        "Stainless Water Bottle",
      ],
      when: ["just now", "1 min ago", "2 mins ago", "moments ago"],
    }),
    []
  );

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const showToastOnce = useCallback(() => {
    const payload = {
      user: pickRandom(toastPool.users),
      product: pickRandom(toastPool.products),
      when: pickRandom(toastPool.when),
    };
    setToastPayload(payload);
    setToastShow(true);

    const hideT = setTimeout(() => setToastShow(false), 5000);
    return () => clearTimeout(hideT);
  }, [toastPool]);

  useEffect(() => {
    const firstDelay = 8000;
    let intervalId = null;

    const firstId = setTimeout(() => {
      showToastOnce();
      const scheduleNext = () => {
        const nextMs = (3 + Math.random()) * 60 * 1000; // 3–4 mins
        intervalId = setTimeout(() => {
          showToastOnce();
          scheduleNext();
        }, nextMs);
      };
      scheduleNext();
    }, firstDelay);

    return () => {
      clearTimeout(firstId);
      if (intervalId) clearTimeout(intervalId);
    };
  }, [showToastOnce]);

  /** ---------- Helpers ---------- **/
  const resolveProductImage = (item) => {
    if (!item?.product_image) return "https://via.placeholder.com/600x600";
    const file = item.product_image.replace(/\\/g, "/").split("/").pop();
    return `${globalBackendRoute}/uploads/products/${file}`;
  };

  /** ✅ NEW: "2 rows always" count (based on computed columns) */
  const brandInitialCount = useMemo(() => {
    const cols = Math.max(2, brandGridCols); // safety
    return cols * 2; // at least 2 rows visible always
  }, [brandGridCols]);

  const brandVisibleProducts = useMemo(() => {
    if (showAllBrandProducts) return brandedProducts;
    return brandedProducts.slice(0, brandInitialCount);
  }, [brandedProducts, showAllBrandProducts, brandInitialCount]);

  const hasMoreBrandProducts =
    brandedProducts.length > brandVisibleProducts.length;

  return (
    <div className="min-h-screen relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .hp-font { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, 'Apple Color Emoji','Segoe UI Emoji'; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <PurchaseToast show={toastShow} payload={toastPayload} />

      <div className="hp-font max-w-full mx-auto px-3 sm:px-6 lg:px-10">
        {/* === HERO SLIDER (modern overlay) === */}
        <section>
          <div className="relative overflow-hidden rounded-[28px] shadow-[0_30px_80px_-50px_rgba(0,0,0,0.45)]">
            <div
              id="carouselExampleDark"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {carouselSlides.map((slide, idx) => (
                  <div
                    key={idx}
                    className={`carousel-item ${idx === 0 ? "active" : ""}`}
                    data-bs-interval="5000"
                  >
                    <div className="relative">
                      <img
                        src={slide.image}
                        className="d-block w-100"
                        alt={slide.title}
                        loading="lazy"
                        style={{ height: "68vh", objectFit: "cover" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/30 to-orange-500/20" />
                      <div className="absolute inset-0 flex items-end">
                        <div className="w-full p-6 sm:p-10">
                          <div className="max-w-[720px]">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white px-4 py-2 text-[12px] sm:text-[13px] backdrop-blur-md border border-white/20">
                              <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                              Trending picks • Limited-time offers
                            </div>

                            <h1 className="mt-4 text-white font-extrabold leading-tight tracking-tight text-[30px] sm:text-[44px] md:text-[52px]">
                              {slide.title}
                            </h1>

                            <p className="mt-3 text-white/85 text-[13px] sm:text-[15px] md:text-[16px] leading-relaxed">
                              Shop the latest deals with premium quality, fast
                              delivery, and curated collections designed for
                              you.
                            </p>

                            <div className="mt-5 flex flex-wrap gap-3">
                              <a
                                href="/shop"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-3 shadow-lg shadow-orange-500/30 transition"
                              >
                                Shop Now <span className="text-lg">→</span>
                              </a>
                              <button
                                onClick={() => navigate("/shop")}
                                className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold px-5 py-3 border border-white/20 backdrop-blur-md transition"
                              >
                                Explore Deals
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="carousel-indicators mb-4">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    data-bs-target="#carouselExampleDark"
                    data-bs-slide-to={idx}
                    className={idx === 0 ? "active" : ""}
                    aria-current={idx === 0 ? "true" : "false"}
                    aria-label={`Slide ${idx + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* === QUICK VALUE STRIP === */}
        <section className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: "Fast Delivery", desc: "Quick shipping on top picks" },
              { title: "Best Prices", desc: "Deals curated daily for you" },
              {
                title: "Secure Checkout",
                desc: "Protected payments & support",
              },
            ].map((x) => (
              <div
                key={x.title}
                className="rounded-2xl bg-white border border-orange-100 shadow-sm px-5 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-extrabold text-gray-900">{x.title}</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">{x.desc}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-black">
                  ✓
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* === CATEGORY CAROUSEL (modern cards) === */}
        <section className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-[26px] sm:text-[32px] font-extrabold text-gray-900 tracking-tight">
                Explore Categories
              </h2>
              <p className="text-gray-600 text-[13px] sm:text-[14px] mt-1">
                Tap any category to instantly search products.
              </p>
            </div>
            <div className="text-[12px] text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-800">
                {Math.min(visibleCategories, categories.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-800">
                {categories.length}
              </span>{" "}
              categories
            </div>
          </div>

          <div className="relative">
            <button
              className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur border border-orange-100 shadow-md px-3 py-2 rounded-full hover:scale-105 transition"
              onClick={() => {
                const el = categoryCarouselRef.current;
                if (el) el.scrollBy({ left: -420, behavior: "smooth" });
              }}
              aria-label="Scroll categories left"
              type="button"
            >
              &#10094;
            </button>

            <div
              ref={categoryCarouselRef}
              className="flex gap-4 overflow-x-auto scroll-smooth px-1 py-2 hide-scrollbar"
            >
              {categories.map((cat, index) => (
                <div
                  key={`${cat._id}-${index}`}
                  className={[
                    "min-w-[240px] sm:min-w-[260px]",
                    "rounded-2xl overflow-hidden cursor-pointer flex-shrink-0",
                    "bg-white border border-orange-100 shadow-sm hover:shadow-md",
                    "transition-transform duration-300 hover:-translate-y-1",
                  ].join(" ")}
                  onClick={() => handleClick(cat.category_name)}
                  title={cat.category_name}
                >
                  <div className="relative">
                    <img
                      src={`${globalBackendRoute}/${cat.category_image}`}
                      alt={cat.category_name}
                      className="w-full h-[150px] object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white font-extrabold text-[14px] truncate">
                          {cat.category_name}
                        </span>
                        <span className="bg-orange-500/90 text-white text-[11px] font-bold px-2 py-1 rounded-full">
                          Shop
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[12px] text-gray-600">
                      Discover top-rated items in{" "}
                      <span className="font-bold text-gray-900">
                        {cat.category_name}
                      </span>
                      .
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur border border-orange-100 shadow-md px-3 py-2 rounded-full hover:scale-105 transition"
              onClick={() => {
                const el = categoryCarouselRef.current;
                if (el) el.scrollBy({ left: 420, behavior: "smooth" });
              }}
              aria-label="Scroll categories right"
              type="button"
            >
              &#10095;
            </button>
          </div>
        </section>

        {/* === BRANDS SECTION (chips style) === */}
        <section className="mt-12">
          <div className="flex items-end justify-between gap-3 mb-5">
            <div>
              <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 tracking-tight">
                Popular Brands
              </h2>
              <p className="text-gray-600 text-[13px] sm:text-[14px] mt-1">
                Quick search by brand — tap to view matching products.
              </p>
            </div>
            <div className="hidden sm:block text-[12px] text-gray-500">
              {brands.length} brands
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-orange-100 shadow-sm p-4 sm:p-5">
            <div className="flex flex-wrap gap-3">
              {brands.map((brand, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleClick(brand)}
                  title={brand}
                  className={[
                    "group inline-flex items-center gap-2",
                    "rounded-full border border-orange-200 bg-orange-50",
                    "px-4 py-2 text-[12px] sm:text-[13px]",
                    "font-extrabold uppercase text-orange-700",
                    "hover:bg-orange-500 hover:text-white hover:border-orange-500",
                    "transition",
                  ].join(" ")}
                >
                  <span className="truncate max-w-[150px]">{brand}</span>
                  <span className="opacity-70 group-hover:opacity-100">→</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ UPDATED: BRAND PRODUCTS as GRID (no slider) */}
        {brandedProducts.length > 0 && (
          <section className="mt-14 mb-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-[22px] sm:text-[28px] font-extrabold text-gray-900 tracking-tight">
                  Explore Products from Popular Brands
                </h2>
                <p className="text-gray-600 text-[13px] sm:text-[14px] mt-1">
                  Click any product to view details.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[12px] text-gray-500">
                  Showing{" "}
                  <span className="font-bold text-gray-800">
                    {brandVisibleProducts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-800">
                    {brandedProducts.length}
                  </span>
                </span>

                {/* Show all / Show less */}
                {(hasMoreBrandProducts || showAllBrandProducts) && (
                  <button
                    type="button"
                    onClick={() => setShowAllBrandProducts((v) => !v)}
                    className="text-[12px] font-extrabold text-orange-600 hover:text-orange-700 underline underline-offset-4"
                  >
                    {showAllBrandProducts ? "Show less ←" : "Show all →"}
                  </button>
                )}
              </div>
            </div>

            {/* Grid:
                - mobile ALWAYS 2 cols (requirement)
                - medium+ becomes 4, 5, 6
                - we also slice items so 2 rows are ALWAYS visible
            */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {brandVisibleProducts.map((item) => (
                <div
                  key={item._id}
                  className={[
                    "rounded-2xl border border-orange-100 bg-white shadow-sm hover:shadow-md",
                    "transition-transform duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden",
                  ].join(" ")}
                  onClick={() => navigate(`/single-product/${item._id}`)}
                  title={item.product_name}
                >
                  <div className="relative">
                    <img
                      src={resolveProductImage(item)}
                      alt={item.product_name}
                      className="w-full aspect-square object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-orange-500/95 text-white text-[10px] font-extrabold px-3 py-1 shadow">
                        HOT
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <h4 className="text-[12.5px] font-extrabold text-gray-900 truncate">
                      {item.product_name}
                    </h4>

                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <p className="text-orange-600 font-black text-[13px] truncate">
                        ₹{item.selling_price}
                      </p>
                      <span className="text-[11px] text-gray-500 font-semibold">
                        View →
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      <p className="text-[11px] text-gray-600 truncate">
                        Available • Fast delivery
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional bottom "Show all" as well (UX on long pages) */}
            {(hasMoreBrandProducts || showAllBrandProducts) && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllBrandProducts((v) => !v)}
                  className="rounded-full border border-orange-200 bg-orange-50 px-6 py-2.5 text-[12px] font-extrabold text-orange-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
                >
                  {showAllBrandProducts ? "Show less ←" : "Show all →"}
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Homepage;
