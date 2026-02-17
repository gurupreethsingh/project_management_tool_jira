// ✅ file: src/pages/home_pages/Homepage.jsx
// ✅ ONLY LOGIC CHANGE (UI unchanged):
// - "Show all" -> "Show more" (adds next rows)
// - Mobile (<640px): show 4 rows initially, then +4 rows per click
// - Desktop (>=640px): show 2 rows initially, then +2 rows per click
// - No external CSS changes, no UI redesign

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Masonry from "react-masonry-css"; // kept (even if unused)
import globalBackendRoute from "../../config/Config";

import one from "../../assets/images/1.jpg";
import two from "../../assets/images/2.jpg";
import three from "../../assets/images/3.jpg";

import {
  FaApple,
  FaLaptop,
  FaMobileAlt,
  FaTshirt,
  FaShoePrints,
  FaCouch,
  FaPumpSoap,
  FaHamburger,
  FaCarrot,
  FaBaby,
  FaGamepad,
  FaBook,
  FaBolt,
  FaTools,
  FaMedkit,
  FaGem,
  FaHeadphones,
  FaCamera,
  FaShoppingBag,
} from "react-icons/fa";

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
        "fixed bottom-4 left-3 sm:bottom-6 sm:left-6 z-[9999]",
        "w-[92vw] max-w-[360px]",
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

        <div className="p-3 sm:p-4 flex gap-3 items-start">
          <div className="shrink-0">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 text-white flex items-center justify-center font-black shadow-md">
              {initials || "U"}
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-[12.5px] sm:text-[13px] text-gray-700">
              <span className="font-extrabold text-gray-900">
                {payload.user}
              </span>{" "}
              purchased{" "}
              <span className="font-extrabold text-orange-600">
                {payload.product}
              </span>
              .
            </p>

            <p className="mt-1 text-[10.5px] sm:text-[11px] text-gray-500 flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Verified order
              </span>
              <span>•</span>
              <span>{payload.when}</span>
            </p>

            <div className="mt-2.5 sm:mt-3 h-1.5 w-full rounded-full bg-orange-100 overflow-hidden">
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

/** ---------- Inline SVG icons ---------- **/
const IconTruck = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M3 7h11v10H3V7Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M14 10h4l3 3v4h-7v-7Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M18 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

const IconTag = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M3 10V4h6l11 11-6 6L3 10Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 7.5h.01"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
  </svg>
);

const IconCard = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M3 7.5C3 6.12 4.12 5 5.5 5h13C19.88 5 21 6.12 21 7.5v9C21 17.88 19.88 19 18.5 19h-13C4.12 19 3 17.88 3 16.5v-9Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M3 9h18" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M7 15h4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/** ✅ Brand -> Icon mapping */
const getBrandIcon = (brand) => {
  const b = String(brand || "").toLowerCase();

  if (/(apple|iphone|ipad|mac|airpods)/.test(b)) return FaApple;
  if (/(samsung|oneplus|oppo|vivo|realme|xiaomi|redmi|mi|pixel|nokia)/.test(b))
    return FaMobileAlt;
  if (/(sony|jbl|boat|bose|sennheiser|headphone|earbud|earphone)/.test(b))
    return FaHeadphones;
  if (/(canon|nikon|gopro|camera|dji)/.test(b)) return FaCamera;
  if (/(hp|dell|lenovo|asus|acer|msi|laptop|thinkpad|ideapad)/.test(b))
    return FaLaptop;

  if (/(nike|adidas|puma|reebok|skechers|shoe|footwear)/.test(b))
    return FaShoePrints;
  if (
    /(zara|hm|h&m|levis|peter england|allen solly|tshirt|shirt|clothing|fashion)/.test(
      b,
    )
  )
    return FaTshirt;

  if (/(ikea|sofa|furniture|home|decor|couch)/.test(b)) return FaCouch;
  if (/(bosch|philips|havells|bajaj|appliance|electronics|power)/.test(b))
    return FaBolt;
  if (/(tools|drill|dewalt|stanley)/.test(b)) return FaTools;

  if (
    /(nivea|lakme|maybelline|loreal|garnier|beauty|cosmetic|skincare|makeup)/.test(
      b,
    )
  )
    return FaPumpSoap;
  if (/(pharma|medicine|med|health|vitamin)/.test(b)) return FaMedkit;

  if (/(burger|mcd|kfc|snack|chips|food|pizza)/.test(b)) return FaHamburger;
  if (/(grocery|organic|farm|fresh|vegetable|veggie)/.test(b)) return FaCarrot;

  if (/(baby|kids|child)/.test(b)) return FaBaby;
  if (/(toy|lego|game|gaming|playstation|xbox)/.test(b)) return FaGamepad;

  if (/(book|novel|penguin|harper|oxford)/.test(b)) return FaBook;
  if (/(jewel|gold|silver|diamond)/.test(b)) return FaGem;

  return FaShoppingBag;
};

const Homepage = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [brandedProducts, setBrandedProducts] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState(0);

  const [toastShow, setToastShow] = useState(false);
  const [toastPayload, setToastPayload] = useState(null);

  const [brandGridCols, setBrandGridCols] = useState(6);

  const navigate = useNavigate();
  const categoryCarouselRef = useRef(null);
  const brandProductsCarouselRef = useRef(null); // kept

  /** ✅ Marquee refs/state */
  const marqueeViewportRef = useRef(null);
  const marqueeTrackRef = useRef(null);
  const marqueeSetRef = useRef(null); // measure width of one set
  const resumeTimerRef = useRef(null);

  const [marqueeReady, setMarqueeReady] = useState(false);
  const [marqueeDurationSec, setMarqueeDurationSec] = useState(28); // updated by screen/width
  const [marqueePaused, setMarqueePaused] = useState(false);

  // drag
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0); // px
  const offsetPxRef = useRef(0); // px (0..setWidth)
  const setWidthRef = useRef(1);

  const handleClick = useCallback(
    (name) => navigate(`/search-products?query=${encodeURIComponent(name)}`),
    [navigate],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${globalBackendRoute}/api/all-categories`),
          axios.get(`${globalBackendRoute}/api/all-added-products`),
        ]);

        setCategories(catRes.data || []);

        const allProducts = prodRes.data || [];
        const shuffled = [...allProducts]
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
        setFeaturedProducts(shuffled);

        const brandSet = new Set();
        const branded = [];

        for (const p of allProducts) {
          if (p?.brand?.trim()) {
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

  useEffect(() => {
    const updateVisibleCategories = () => {
      const el = categoryCarouselRef.current;
      if (el) {
        const containerWidth = el.offsetWidth;
        const itemWidth = 240 + 16;
        const visibleCount = Math.max(
          1,
          Math.floor(containerWidth / itemWidth),
        );
        setVisibleCategories(visibleCount);
      }
    };

    updateVisibleCategories();
    window.addEventListener("resize", updateVisibleCategories);
    return () => window.removeEventListener("resize", updateVisibleCategories);
  }, [categories]);

  useEffect(() => {
    const computeCols = () => {
      const w = window.innerWidth;
      if (w < 640) return 2;
      if (w < 768) return 3;
      if (w < 1024) return 4;
      if (w < 1280) return 5;
      return 6;
    };

    const apply = () => setBrandGridCols(computeCols());
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

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
    [],
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
        const nextMs = (3 + Math.random()) * 60 * 1000;
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

  const resolveProductImage = (item) => {
    if (!item?.product_image) return "https://via.placeholder.com/600x600";
    const file = item.product_image.replace(/\\/g, "/").split("/").pop();
    return `${globalBackendRoute}/uploads/products/${file}`;
  };

  /** ✅ Build marquee duration from (setWidth / pxPerSec) => duration */
  const computeMarqueeDuration = useCallback(() => {
    const setEl = marqueeSetRef.current;
    if (!setEl) return;

    const setWidth = setEl.getBoundingClientRect().width || 1;
    setWidthRef.current = Math.max(1, setWidth);

    // px/sec targets (smooth, visible, no jerk)
    const w = window.innerWidth;
    const pxPerSec = w < 640 ? 50 : w < 1024 ? 50 : 50;

    const dur = Math.max(10, Math.round((setWidth / pxPerSec) * 10) / 10);
    setMarqueeDurationSec(dur);

    offsetPxRef.current =
      ((offsetPxRef.current % setWidth) + setWidth) % setWidth;
    setMarqueeReady(true);
  }, []);

  useEffect(() => {
    if (!brands.length) return;
    const t = setTimeout(() => computeMarqueeDuration(), 0);
    window.addEventListener("resize", computeMarqueeDuration);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", computeMarqueeDuration);
    };
  }, [brands, computeMarqueeDuration]);

  /** ✅ pause/resume helpers */
  const pauseMarquee = useCallback(() => {
    setMarqueePaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, []);

  const resumeMarqueeLater = useCallback((ms = 900) => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setMarqueePaused(false);
    }, ms);
  }, []);

  /** ✅ Apply transform for manual drag offset (0..setWidth) */
  const applyManualOffset = useCallback(() => {
    const track = marqueeTrackRef.current;
    const setWidth = setWidthRef.current || 1;
    if (!track) return;

    const o = ((offsetPxRef.current % setWidth) + setWidth) % setWidth;
    offsetPxRef.current = o;

    track.style.transform = `translate3d(${-o}px, 0, 0)`;
  }, []);

  /** ✅ Drag handlers (mouse + touch) */
  const onDown = (clientX) => {
    const setWidth = setWidthRef.current || 1;

    isDownRef.current = true;
    pauseMarquee();

    startXRef.current = clientX;
    startOffsetRef.current =
      ((offsetPxRef.current % setWidth) + setWidth) % setWidth;

    applyManualOffset();
  };

  const onMove = (clientX) => {
    if (!isDownRef.current) return;
    const dx = clientX - startXRef.current;

    offsetPxRef.current = startOffsetRef.current - dx;
    applyManualOffset();
  };

  const onUp = () => {
    if (!isDownRef.current) return;
    isDownRef.current = false;
    resumeMarqueeLater(900);
  };

  useEffect(() => {
    const viewport = marqueeViewportRef.current;
    if (!viewport) return;
    viewport.style.setProperty("--marqueeOffset", `${-offsetPxRef.current}px`);
  }, [marqueePaused, marqueeDurationSec, marqueeReady]);

  /** ✅ Desktop check (you already had this) */
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 640 : false,
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ============================
  // ✅ NEW: Brand products "Show more" logic (NO UI change)
  // ============================
  const brandCols = useMemo(() => Math.max(2, brandGridCols), [brandGridCols]);

  // Mobile: 4 rows initially, +4 rows each click
  // Desktop: 2 rows initially, +2 rows each click
  const initialRows = useMemo(() => (isDesktop ? 2 : 4), [isDesktop]);
  const stepRows = useMemo(() => (isDesktop ? 2 : 4), [isDesktop]);

  const initialCount = useMemo(
    () => brandCols * initialRows,
    [brandCols, initialRows],
  );

  const stepCount = useMemo(() => brandCols * stepRows, [brandCols, stepRows]);

  const [brandVisibleCount, setBrandVisibleCount] = useState(0);

  // Reset visible count when products/cols/breakpoint change
  useEffect(() => {
    setBrandVisibleCount(Math.min(brandedProducts.length, initialCount));
  }, [brandedProducts.length, initialCount]);

  const brandVisibleProducts = useMemo(() => {
    return brandedProducts.slice(0, brandVisibleCount);
  }, [brandedProducts, brandVisibleCount]);

  const hasMoreBrandProducts = brandedProducts.length > brandVisibleCount;

  const handleShowMoreBrands = () => {
    setBrandVisibleCount((prev) =>
      Math.min(brandedProducts.length, prev + stepCount),
    );
  };

  return (
    <div className="min-h-screen relative bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .hp-font { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, 'Apple Color Emoji','Segoe UI Emoji'; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        #carouselExampleDark .carousel-indicators { margin-bottom: 0.75rem; }
        #carouselExampleDark .carousel-indicators [data-bs-target]{ width: 10px; height: 10px; border-radius: 999px; }

        @media (min-width: 640px) and (max-width: 1024px){
          #carouselExampleDark .carousel-indicators { margin-bottom: 0.55rem; }
          #carouselExampleDark .carousel-indicators [data-bs-target]{ width: 8px; height: 8px; }
        }

        /* ✅ MOBILE: indicators smaller + move to TOP with spacing */
        @media (max-width: 639px){
          #carouselExampleDark .carousel-indicators{
            top: 10px;
            bottom: auto;
            margin-bottom: 0;
            gap: 8px;
          }
          #carouselExampleDark .carousel-indicators [data-bs-target]{
            width: 7px;
            height: 7px;
            margin: 0 4px;
          }
        }

        /* ✅ GPU smooth marquee */
        .brandViewport{
          --marqueeOffset: 0px;
          overflow: hidden;
          position: relative;
          touch-action: pan-y;
        }
        .brandTrack{
          display: flex;
          align-items: center;
          gap: 12px;
          width: max-content;
          will-change: transform;
          transform: translate3d(var(--marqueeOffset), 0, 0);
          backface-visibility: hidden;
        }
        .brandTrack.run{
          animation: brandMarquee linear infinite;
          animation-duration: var(--marqueeDur);
          animation-play-state: running;
        }
        .brandTrack.pause{
          animation-play-state: paused;
        }
        @keyframes brandMarquee{
          from { transform: translate3d(var(--marqueeOffset), 0, 0); }
          to   { transform: translate3d(calc(var(--marqueeOffset) - var(--setWidth)), 0, 0); }
        }

        @media (prefers-reduced-motion: reduce){
          .brandTrack.run{ animation: none; }
        }
      `}</style>

      <PurchaseToast show={toastShow} payload={toastPayload} />

      <div className="hp-font w-full max-w-none px-2 sm:px-4 md:px-6 lg:px-6 xl:px-8">
        {/* === HERO SLIDER === */}
        <section className="pt-2 sm:pt-4">
          <div className="relative overflow-hidden rounded-2xl lg:rounded-[26px] shadow-[0_30px_80px_-50px_rgba(0,0,0,0.45)]">
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
                        style={{
                          height: "clamp(300px, 52vh, 680px)",
                          objectFit: "cover",
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/75 via-black/35 to-orange-500/15" />

                      <div className="absolute inset-0 flex items-end">
                        <div className="w-full p-4 sm:p-6 md:p-7 lg:p-10 pb-9 sm:pb-10">
                          <div className="max-w-[760px]">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-[12px] md:text-[12px] backdrop-blur-md border border-white/20">
                              <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                              Trending picks • Limited-time offers
                            </div>

                            <h1 className="mt-3 text-white font-extrabold leading-tight tracking-tight text-[22px] sm:text-[28px] md:text-[34px] lg:text-[52px]">
                              {slide.title}
                            </h1>

                            <p className="mt-2 text-white/85 text-[12px] sm:text-[12px] md:text-[13px] lg:text-[16px] leading-relaxed max-w-[58ch]">
                              Shop the latest deals with premium quality, fast
                              delivery, and curated collections designed for
                              you.
                            </p>

                            <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-2">
                              <a
                                href="/shop"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold
                                           px-4 py-2.5 sm:px-4 sm:py-2 md:px-4 md:py-2 lg:px-6 lg:py-3
                                           text-[12px] sm:text-[12px] md:text-[12px] lg:text-[14px]
                                           shadow-lg shadow-orange-500/30 transition w-full sm:w-auto"
                              >
                                Shop Now{" "}
                                <span className="text-lg leading-none">→</span>
                              </a>

                              {/* ✅ Hide Explore Deals on MOBILE only */}
                              <button
                                onClick={() => navigate("/shop")}
                                className="hidden sm:inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold
                                           px-4 py-2.5 sm:px-4 sm:py-2 md:px-4 md:py-2 lg:px-6 lg:py-3
                                           text-[12px] sm:text-[12px] md:text-[12px] lg:text-[14px]
                                           border border-white/20 backdrop-blur-md transition w-full sm:w-auto"
                                type="button"
                              >
                                Explore Deals
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-10 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="carousel-indicators">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    data-bs-target="#carouselExampleDark"
                    data-bs-slide-to={idx}
                    className={idx === 0 ? "active" : ""}
                    aria-current={idx === 0 ? "true" : "false"}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ✅ QUICK VALUE STRIP: hidden on MOBILE */}
        <section className="mt-4 sm:mt-5 hidden sm:block">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {[
              {
                title: "Fast Delivery",
                desc: "Quick shipping on top picks",
                icon: IconTruck,
              },
              {
                title: "Best Prices",
                desc: "Deals curated daily for you",
                icon: IconTag,
              },
              {
                title: "Secure Checkout",
                desc: "Protected payments & support",
                icon: IconCard,
              },
            ].map((x) => {
              const Ico = x.icon;
              return (
                <div
                  key={x.title}
                  className="rounded-2xl bg-white border border-orange-100 shadow-sm px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-extrabold text-gray-900 text-[13px] sm:text-[13px] md:text-[13px] lg:text-[15px] truncate">
                      {x.title}
                    </p>
                    <p className="text-[11px] sm:text-[11px] md:text-[11px] lg:text-[12px] text-gray-500 mt-0.5 leading-snug">
                      {x.desc}
                    </p>
                  </div>
                  <div className="shrink-0 h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                    <Ico className="h-5 w-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* === CATEGORY CAROUSEL === */}
        <section className="m-8 sm:mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
            <div>
              <h2 className="text-[18px] sm:text-[22px] md:text-[26px] lg:text-[32px] font-extrabold text-gray-900 tracking-tight">
                Explore Categories
              </h2>

              {/* ✅ Hide in MOBILE */}
              <p className="hidden sm:block text-gray-600 text-[12px] sm:text-[12px] md:text-[13px] lg:text-[14px] mt-1">
                Tap any category to instantly search products.
              </p>
            </div>

            {/* ✅ Hide in MOBILE */}
            <div className="hidden sm:block text-[11px] sm:text-[11px] md:text-[11px] lg:text-[12px] text-gray-500">
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
              className="absolute -left-1 sm:-left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur border border-orange-100 shadow-md px-2.5 py-2 rounded-full hover:scale-105 transition"
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
              className="flex gap-3 overflow-x-auto scroll-smooth px-1 py-2 hide-scrollbar"
            >
              {categories.map((cat, index) => (
                <div
                  key={`${cat._id}-${index}`}
                  className={[
                    "min-w-[200px] sm:min-w-[220px] md:min-w-[240px] lg:min-w-[260px]",
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
                      className="w-full h-[115px] sm:h-[130px] md:h-[140px] lg:h-[150px] object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white font-extrabold text-[12.5px] sm:text-[13px] lg:text-[14px] truncate">
                          {cat.category_name}
                        </span>
                        <span className="bg-orange-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                          Shop
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-[11px] sm:text-[11px] md:text-[11.5px] lg:text-[12px] text-gray-600">
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
              className="absolute -right-1 sm:-right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur border border-orange-100 shadow-md px-2.5 py-2 rounded-full hover:scale-105 transition"
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

        {/* ✅ BRANDS SECTION */}
        <section className="m-10 sm:mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
            <div>
              <h2 className="text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px] font-extrabold text-gray-900 tracking-tight">
                Popular Brands
              </h2>

              {/* ✅ Hide in MOBILE */}
              <p className="hidden sm:block text-gray-600 text-[12px] sm:text-[12px] md:text-[13px] lg:text-[14px] mt-1">
                Smooth infinite marquee • drag / swipe anytime • tap to search
              </p>
            </div>

            {/* ✅ Hide in MOBILE (117 brands) */}
            <div className="hidden sm:block text-[11px] text-gray-500">
              {brands.length} brands
            </div>
          </div>

          <div className="rounded-2xl bg-white overflow-hidden">
            <div
              ref={marqueeViewportRef}
              className="brandViewport px-1 sm:px-2 py-2.5 sm:py-3 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={(e) => onDown(e.clientX)}
              onMouseMove={(e) => onMove(e.clientX)}
              onMouseUp={onUp}
              onMouseLeave={onUp}
              onTouchStart={(e) => {
                const x = e.touches?.[0]?.clientX ?? 0;
                onDown(x);
              }}
              onTouchMove={(e) => {
                const x = e.touches?.[0]?.clientX ?? 0;
                onMove(x);
              }}
              onTouchEnd={onUp}
              onTouchCancel={onUp}
              aria-label="Brands marquee"
              style={{
                ["--marqueeDur"]: `${marqueeDurationSec}s`,
                ["--setWidth"]: `${setWidthRef.current}px`,
              }}
            >
              <div
                ref={marqueeTrackRef}
                className={[
                  "brandTrack",
                  marqueeReady ? "run" : "",
                  marqueePaused ? "pause" : "",
                ].join(" ")}
              >
                <div
                  ref={marqueeSetRef}
                  className="flex items-center gap-2.5 sm:gap-3 w-max"
                >
                  {brands.map((brand, idx) => {
                    const Icon = getBrandIcon(brand);
                    return (
                      <button
                        key={`a-${brand}-${idx}`}
                        type="button"
                        onClick={() => handleClick(brand)}
                        title={brand}
                        className={[
                          "group flex-shrink-0",
                          "rounded-2xl",
                          "bg-orange-50 hover:bg-orange-100",
                          "transition",
                          "px-3 py-2 sm:px-3.5 sm:py-2.5",
                        ].join(" ")}
                      >
                        <div className="flex flex-col items-center justify-center gap-1 min-w-[116px] sm:min-w-[132px] md:min-w-[140px]">
                          <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-white flex items-center justify-center text-orange-600">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="uppercase font-extrabold text-gray-800 text-[11px] lg:text-[13px] truncate max-w-[120px]">
                              {brand}
                            </span>
                            <span className="text-orange-600/70 group-hover:text-orange-700 transition text-[12px]">
                              →
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div
                  className="flex items-center gap-2.5 sm:gap-3 w-max"
                  aria-hidden="true"
                >
                  {brands.map((brand, idx) => {
                    const Icon = getBrandIcon(brand);
                    return (
                      <button
                        key={`b-${brand}-${idx}`}
                        type="button"
                        onClick={() => handleClick(brand)}
                        title={brand}
                        className={[
                          "group flex-shrink-0",
                          "rounded-2xl",
                          "bg-orange-50 hover:bg-orange-100",
                          "transition",
                          "px-3 py-2 sm:px-3.5 sm:py-2.5",
                        ].join(" ")}
                      >
                        <div className="flex flex-col items-center justify-center gap-1 min-w-[116px] sm:min-w-[132px] md:min-w-[140px]">
                          <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-white flex items-center justify-center text-orange-600">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="uppercase font-extrabold text-gray-800 text-[11px] lg:text-[13px] truncate max-w-[120px]">
                              {brand}
                            </span>
                            <span className="text-orange-600/70 group-hover:text-orange-700 transition text-[12px]">
                              →
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === BRAND PRODUCTS GRID === */}
        {brandedProducts.length > 0 && (
          <section
            style={{
              margin: isDesktop ? "2.5rem" : "0",
              marginTop: isDesktop ? "3.5rem" : "0",
              marginBottom: isDesktop ? "4rem" : "0",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-[18px] sm:text-[22px] md:text-[26px] lg:text-[28px] font-extrabold text-gray-900 tracking-tight">
                  Explore Products from Popular Brands
                </h2>

                {/* ✅ Hide in MOBILE */}
                <p className="hidden sm:block text-gray-600 text-[12px] sm:text-[12px] md:text-[13px] lg:text-[14px] mt-1">
                  Click any product to view details.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-gray-500">
                  Showing{" "}
                  <span className="font-bold text-gray-800">
                    {brandVisibleProducts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-800">
                    {brandedProducts.length}
                  </span>
                </span>

                {/* ✅ Show more (desktop & mobile) */}
                {hasMoreBrandProducts && (
                  <button
                    type="button"
                    onClick={handleShowMoreBrands}
                    className="text-[11px] font-extrabold text-orange-600 hover:text-orange-700 underline underline-offset-4"
                  >
                    Show more →
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
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
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                      {/* <span className="rounded-full bg-orange-500/95 text-white text-[9.5px] sm:text-[10px] font-extrabold px-2.5 py-1 shadow">
                        HOT
                      </span> */}
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-3">
                    <h4 className="text-[12px] sm:text-[12.5px] font-extrabold text-gray-900 truncate">
                      {item.product_name}
                    </h4>

                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <p className="text-orange-600 font-black text-[12.5px] sm:text-[13px] truncate">
                        ₹{item.selling_price}
                      </p>
                      <span className="text-[10.5px] sm:text-[11px] text-gray-500 font-semibold">
                        View →
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      <p className="text-[10.5px] sm:text-[11px] text-gray-600 truncate">
                        Available • Fast delivery
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Bottom "Show more" button keeps SAME UI */}
            {hasMoreBrandProducts && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleShowMoreBrands}
                  className="rounded-full border border-orange-200 bg-orange-50 px-6 py-2.5
                             text-[12px] sm:text-[12px] md:text-[12px] lg:text-[13px]
                             font-extrabold text-orange-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
                >
                  Show more →
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
