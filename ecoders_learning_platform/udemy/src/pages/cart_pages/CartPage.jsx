// src/pages/cart_pages/CartPage.jsx
import React, { useContext } from "react";
import { CartContext } from "../../components/cart_components/CartContext";
import Breadcrumb from "../../components/common_components/Breadcrumb";
import { useNavigate } from "react-router-dom";

import { FaTrash, FaBookOpen } from "react-icons/fa";
import {
  FaPython,
  FaReact,
  FaJava,
  FaDatabase,
  FaRobot,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaCode,
} from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io5";
import {
  TbBrandTypescript,
  TbBrandNextjs,
  TbBrandCSharp,
} from "react-icons/tb";

/* Map server iconKey => a subtle icon/color */
function iconFromKey(iconKey = "", tags = []) {
  const key = String(iconKey || "").toLowerCase();
  const icon = (Icon, cls) => ({ Icon, cls });

  if (key.startsWith("tag-")) {
    const tag = key.slice(4);
    if (/python/.test(tag)) return icon(FaPython, "text-yellow-500");
    if (/react/.test(tag)) return icon(FaReact, "text-cyan-500");
    if (/java\b/.test(tag)) return icon(FaJava, "text-orange-500");
    if (/(mysql|sql|db|database)/.test(tag))
      return icon(FaDatabase, "text-blue-500");
    if (/selenium|robot/.test(tag)) return icon(FaRobot, "text-purple-700");
    if (/node/.test(tag)) return icon(FaNodeJs, "text-green-600");
    if (/typescript|ts\b/.test(tag))
      return icon(TbBrandTypescript, "text-blue-600");
    if (/next/.test(tag)) return icon(TbBrandNextjs, "text-gray-900");
    if (/csharp|c#/.test(tag)) return icon(TbBrandCSharp, "text-violet-600");
    if (/html/.test(tag)) return icon(FaHtml5, "text-orange-500");
    if (/css/.test(tag)) return icon(FaCss3Alt, "text-blue-500");
    if (/javascript|js\b/.test(tag))
      return icon(IoLogoJavascript, "text-yellow-500");
  }

  if (key.startsWith("level-")) {
    return icon(FaBookOpen, "text-indigo-600");
  }

  if (key.startsWith("bucket-")) {
    const b = Number(key.replace("bucket-", ""));
    const buckets = [
      icon(FaReact, "text-cyan-500"),
      icon(FaPython, "text-yellow-500"),
      icon(FaJava, "text-orange-500"),
      icon(FaDatabase, "text-blue-500"),
      icon(FaRobot, "text-purple-700"),
      icon(FaNodeJs, "text-green-600"),
      icon(FaHtml5, "text-orange-500"),
      icon(FaCss3Alt, "text-blue-500"),
    ];
    return buckets[(b - 1 + buckets.length) % buckets.length];
  }

  return icon(FaCode, "text-gray-500");
}

/** Small chip for a tag/topic */
const TopicChip = ({ label }) => (
  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
    {label}
  </span>
);

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems = [],
    removeFromCart,
    cartLoading,
  } = useContext(CartContext);

  const userId = localStorage.getItem("userId");
  const openCourse = (courseId) => {
    if (userId) navigate(`/user-course/${userId}/${courseId}`);
    else navigate("/login");
  };

  const proceedToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="">
      {/* Breadcrumb (same component you use elsewhere) */}
      <div className="blog_header_section">
        <Breadcrumb pageTitle="Cart" />
      </div>

      <div className="px-4 md:px-8 lg:px-12 py-8 container">
        {/* Top summary line (subtle, matches your other pages) */}
        <div className="flex items-center justify-end gap-4 mb-3">
          <div className="text-sm text-gray-600">
            Items in cart:{" "}
            <span className="font-semibold">{cartItems.length}</span>
          </div>
        </div>

        {/* Two-column layout: list on left, summary on right (stacks on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Cart items list */}
          <section className="lg:col-span-2">
            <div className="border rounded-xl overflow-hidden bg-white">
              <div className="px-4 py-3 border-b bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-700 tracking-tight">
                  Courses in your cart
                </h2>
              </div>

              {cartLoading ? (
                <div className="text-center text-gray-500 py-10">
                  Loading cart…
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  Your cart is empty.
                </div>
              ) : (
                <ul className="divide-y">
                  {cartItems.map((item) => {
                    const { Icon, cls } = iconFromKey(item.iconKey, item.tags);
                    const topics = Array.isArray(item.tags)
                      ? item.tags.slice(0, 4)
                      : [];

                    return (
                      <li
                        key={item._id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-4 py-4 hover:bg-gray-50"
                      >
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center">
                            <Icon className={`text-2xl ${cls}`} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <h3
                              className="text-base font-semibold text-gray-800 line-clamp-2"
                              title={item.title}
                            >
                              {item.title || "Untitled Course"}
                            </h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap">
                              {item.level || "Course"}
                            </span>
                          </div>

                          {/* Topics (from tags) */}
                          {topics.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {topics.map((t, idx) => (
                                <TopicChip key={idx} label={String(t)} />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => openCourse(item._id)}
                            className="flex-1 sm:flex-none text-sm px-3 py-2 rounded-full bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition"
                          >
                            Open
                          </button>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="flex-1 sm:flex-none text-sm px-3 py-2 rounded-full bg-rose-100 text-rose-600 font-medium hover:bg-rose-200 transition inline-flex items-center justify-center gap-1"
                            title="Remove from cart"
                            aria-label="Remove from cart"
                          >
                            <FaTrash className="text-[12px]" />
                            Remove
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>

          {/* RIGHT: Summary / CTA */}
          <aside className="lg:col-span-1">
            <div className="border rounded-xl bg-white overflow-hidden lg:sticky lg:top-24">
              <div className="px-4 py-3 border-b bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700 tracking-tight">
                  Summary
                </h3>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Courses</span>
                  <span className="font-semibold text-gray-800">
                    {cartItems.length}
                  </span>
                </div>

                {/* Hint text since price is deactivated */}
                <p className="text-xs text-gray-500 leading-relaxed">
                  Pricing is currently disabled. You can still proceed to
                  checkout to continue your enrollment flow.
                </p>

                <button
                  onClick={proceedToCheckout}
                  disabled={cartItems.length === 0}
                  className={`w-full mt-2 text-sm py-2 rounded-full font-semibold transition 
                    ${
                      cartItems.length === 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
