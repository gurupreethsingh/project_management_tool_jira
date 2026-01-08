// file: src/pages/AboutUs.jsx
import React, { useMemo } from "react";
import {
  FaBolt,
  FaShieldAlt,
  FaTruck,
  FaUndoAlt,
  FaHeadset,
  FaStar,
  FaStore,
  FaTags,
  FaHeart,
  FaLeaf,
  FaUsers,
  FaGlobeAsia,
  FaCheckCircle,
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { MdOutlineVerified, MdOutlineLocalOffer } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";

/**
 * ✅ Redesigned About Us (single page, no layout switcher)
 * - Same font as Homepage (Plus Jakarta Sans)
 * - Modern e-commerce relevant content
 * - Animations (lightweight, CSS-based)
 * - Mobile-first + responsive
 * - Uses lots of react-icons
 */

export default function AboutUs() {
  const stats = useMemo(
    () => [
      { label: "Happy Customers", value: "120K+", icon: FaUsers },
      { label: "Products Available", value: "25K+", icon: FaStore },
      { label: "Cities Delivered", value: "500+", icon: FaGlobeAsia },
      { label: "Avg. Rating", value: "4.8/5", icon: FaStar },
    ],
    []
  );

  const pillars = useMemo(
    () => [
      {
        title: "Lightning Fast Delivery",
        desc: "Quick shipping on top picks with reliable tracking.",
        icon: FaTruck,
      },
      {
        title: "Secure Payments",
        desc: "Protected checkout with trusted payment options.",
        icon: RiSecurePaymentFill,
      },
      {
        title: "Easy Returns",
        desc: "Simple returns with a smooth, no-stress experience.",
        icon: FaUndoAlt,
      },
      {
        title: "Friendly Support",
        desc: "We’re here to help — fast responses, real humans.",
        icon: FaHeadset,
      },
    ],
    []
  );

  const values = useMemo(
    () => [
      {
        title: "Quality First",
        desc: "Curated listings and verified sellers for dependable products.",
        icon: MdOutlineVerified,
      },
      {
        title: "Great Deals",
        desc: "Daily discounts and seasonal offers — value you can trust.",
        icon: MdOutlineLocalOffer,
      },
      {
        title: "Customer Love",
        desc: "We build experiences people enjoy, not just transactions.",
        icon: FaHeart,
      },
      {
        title: "Responsible Shopping",
        desc: "Eco-aware choices and smarter packaging where possible.",
        icon: FaLeaf,
      },
    ],
    []
  );

  return (
    <div className="hp-font w-full min-h-screen ">
      {/* Font + animations (same font as Homepage) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .hp-font { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, 'Apple Color Emoji','Segoe UI Emoji'; }
        @keyframes floatIn { from { opacity:0; transform: translateY(14px);} to { opacity:1; transform: translateY(0);} }
        .float-in { animation: floatIn .45s ease-out both; }
        @keyframes shimmer { 0%{ filter:hue-rotate(0deg);} 100%{ filter:hue-rotate(360deg);} }
        .shimmer { animation: shimmer 2.4s linear infinite; }
        @keyframes softPulse { 0%,100%{ transform:scale(1);} 50%{ transform:scale(1.03);} }
        .pulse-soft { animation: softPulse 1.8s ease-in-out infinite; }
      `}</style>

      <div className="max-w-full mx-auto px-3 sm:px-6 lg:px-10">
        {/* HERO */}
        <section className="pt-8 sm:pt-10">
          <div className="relative overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_30px_80px_-55px_rgba(0,0,0,0.35)]">
            {/* glow blobs */}
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
            <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-amber-300/25 blur-3xl" />

            <div className="relative p-6 sm:p-10 lg:p-12 float-in">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-100/70 border border-orange-200 px-4 py-2">
                <HiOutlineSparkles className="text-orange-600 shimmer" />
                <span className="text-[12px] font-extrabold text-orange-700 uppercase tracking-wide">
                  About Our Store
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                  <h1 className="text-[30px] sm:text-[42px] lg:text-[48px] font-extrabold tracking-tight text-gray-900 leading-tight">
                    Modern shopping,{" "}
                    <span className="text-orange-600">built for speed</span> and{" "}
                    <span className="text-orange-600">trust</span>.
                  </h1>

                  <p className="mt-4 text-[13px] sm:text-[15px] text-gray-600 leading-relaxed max-w-[58ch]">
                    We’re an e-commerce platform focused on quality products,
                    smooth checkout, and fast delivery. From trending gadgets to
                    everyday essentials, we help you shop confidently — with
                    secure payments, easy returns, and responsive support.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-white border border-orange-100 px-4 py-3 shadow-sm">
                      <FaShieldAlt className="text-orange-600" />
                      <span className="text-[12px] font-extrabold text-gray-900">
                        Protected checkout
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-xl bg-white border border-orange-100 px-4 py-3 shadow-sm">
                      <FaTags className="text-orange-600" />
                      <span className="text-[12px] font-extrabold text-gray-900">
                        Daily deals
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-xl bg-white border border-orange-100 px-4 py-3 shadow-sm">
                      <FaBolt className="text-orange-600 pulse-soft" />
                      <span className="text-[12px] font-extrabold text-gray-900">
                        Fast experience
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats card */}
                <div className="rounded-2xl border border-orange-100 bg-white/80 backdrop-blur shadow-sm p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-extrabold text-gray-900 uppercase tracking-wide">
                      Our Impact
                    </p>
                    <span className="inline-flex items-center gap-2 text-[12px] font-extrabold text-orange-700">
                      <FaCheckCircle className="text-orange-600" />
                      Verified experience
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {stats.map((s) => {
                      const Icon = s.icon;
                      return (
                        <div
                          key={s.label}
                          className="rounded-2xl border border-orange-100 bg-orange-50/50 px-4 py-4 hover:bg-orange-50 transition"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-10 w-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center">
                              <Icon className="text-orange-600" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-[16px] sm:text-[18px] font-extrabold text-gray-900 leading-none">
                                {s.value}
                              </p>
                              <p className="text-[11px] sm:text-[12px] text-gray-600 font-semibold mt-1">
                                {s.label}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-2xl bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 rounded-xl bg-white border border-orange-200 flex items-center justify-center">
                        <FaStar className="text-orange-600" />
                      </span>
                      <div>
                        <p className="text-[12px] font-extrabold text-gray-900">
                          Rated by thousands of customers
                        </p>
                        <p className="text-[12px] text-gray-600">
                          Consistent quality + reliable delivery
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* trust ribbon */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    icon: FaTruck,
                    label: "Fast Delivery",
                    sub: "Tracking on every order",
                  },
                  {
                    icon: FaShieldAlt,
                    label: "Secure Payments",
                    sub: "Encrypted checkout",
                  },
                  {
                    icon: FaUndoAlt,
                    label: "Easy Returns",
                    sub: "Simple return flow",
                  },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <div
                      key={t.label}
                      className="rounded-2xl bg-white border border-orange-100 shadow-sm px-5 py-4 flex items-start gap-3 hover:shadow-md transition"
                    >
                      <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                        <Icon className="text-orange-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-extrabold text-gray-900">
                          {t.label}
                        </p>
                        <p className="text-[12px] text-gray-600 mt-0.5">
                          {t.sub}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* PILLARS */}
        <section className="mt-12 sm:mt-14">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-[22px] sm:text-[28px] font-extrabold text-gray-900 tracking-tight">
                What we focus on
              </h2>
              <p className="mt-1 text-[13px] sm:text-[14px] text-gray-600">
                The core things that keep shopping smooth and reliable.
              </p>
            </div>
            <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-4 py-2 text-[12px] font-extrabold text-orange-700">
              <FaStore className="text-orange-600" />
              Built for e-commerce
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-2xl bg-white border border-orange-100 shadow-sm p-5 hover:shadow-md transition float-in"
                >
                  <div className="h-12 w-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                    <Icon className="text-orange-600 text-[20px]" />
                  </div>
                  <h3 className="mt-4 text-[14px] font-extrabold text-gray-900">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-[12px] text-gray-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* VALUES */}
        <section className="mt-12 sm:mt-14">
          <div className="rounded-[28px] border border-orange-100 bg-white shadow-sm overflow-hidden">
            <div className="p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <h2 className="text-[22px] sm:text-[28px] font-extrabold text-gray-900 tracking-tight">
                    Our values
                  </h2>
                  <p className="mt-1 text-[13px] sm:text-[14px] text-gray-600">
                    The principles that guide everything we ship.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100/70 border border-orange-200 px-4 py-2 text-[12px] font-extrabold text-orange-700">
                  <FaHeart className="text-orange-600" />
                  Customer-first mindset
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {values.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div
                      key={v.title}
                      className="rounded-2xl bg-gradient-to-b from-orange-50/60 to-white border border-orange-100 p-5 hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-2xl bg-white border border-orange-100 flex items-center justify-center">
                          <Icon className="text-orange-600 text-[18px]" />
                        </div>
                        <p className="text-[13px] font-extrabold text-gray-900">
                          {v.title}
                        </p>
                      </div>
                      <p className="mt-3 text-[12px] text-gray-600 leading-relaxed">
                        {v.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Payment / trust strip */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    icon: FaShieldAlt,
                    title: "Shop with confidence",
                    desc: "Fraud protection + safe payments",
                  },
                  {
                    icon: FaTags,
                    title: "Real deals, real value",
                    desc: "Discounts you can trust",
                  },
                  {
                    icon: FaHeadset,
                    title: "Support that cares",
                    desc: "Quick help, clear answers",
                  },
                ].map((x) => {
                  const Icon = x.icon;
                  return (
                    <div
                      key={x.title}
                      className="rounded-2xl bg-white border border-orange-100 shadow-sm px-5 py-4 flex items-start gap-3"
                    >
                      <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                        <Icon className="text-orange-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-extrabold text-gray-900">
                          {x.title}
                        </p>
                        <p className="text-[12px] text-gray-600 mt-0.5">
                          {x.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* bottom subtle band */}
            <div className="px-6 sm:px-10 py-6 bg-gradient-to-r from-orange-50 to-amber-50 border-t border-orange-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-[12px] font-extrabold text-gray-900">
                  <FaCheckCircle className="text-orange-600" />
                  Verified sellers • Secure checkout • Easy returns
                </div>
                <div className="inline-flex items-center gap-2 text-[12px] font-extrabold text-orange-700">
                  <RiSecurePaymentFill className="text-orange-600" />
                  Encrypted payments & buyer protection
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 sm:mt-14 pb-14">
          <div className="rounded-[28px] bg-gradient-to-r from-orange-500 to-amber-400 text-white overflow-hidden shadow-lg shadow-orange-500/25">
            <div className="p-6 sm:p-10 relative">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="max-w-[680px]">
                  <h3 className="text-[22px] sm:text-[28px] font-extrabold tracking-tight">
                    Ready to explore our best deals?
                  </h3>
                  <p className="mt-2 text-white/90 text-[13px] sm:text-[14px] leading-relaxed">
                    Browse categories, search brands, and discover trending
                    products — all in a fast, modern shopping experience.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="/shop"
                    className="inline-flex items-center justify-center rounded-xl bg-white text-orange-700 font-extrabold px-6 py-3 shadow-sm hover:opacity-95 transition"
                  >
                    Shop Now →
                  </a>
                  <a
                    href="/contact-us"
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/25 text-white font-extrabold px-6 py-3 hover:bg-white/15 transition"
                  >
                    Contact Us
                  </a>
                </div>
              </div>

              <div className="relative mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: FaTruck, text: "Fast Delivery" },
                  { icon: FaShieldAlt, text: "Secure Checkout" },
                  { icon: FaTags, text: "Daily Deals" },
                  { icon: FaHeadset, text: "Quick Support" },
                ].map((b) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.text}
                      className="rounded-2xl bg-white/10 border border-white/20 px-4 py-3 flex items-center gap-2"
                    >
                      <Icon className="text-white" />
                      <span className="text-[12px] font-extrabold">
                        {b.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
