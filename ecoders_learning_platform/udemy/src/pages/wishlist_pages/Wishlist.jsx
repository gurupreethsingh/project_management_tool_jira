// src/pages/wishlist_pages/Wishlist.jsx
import React, { useContext, useEffect, useState } from "react";
import Breadcrumb from "../../components/common_components/Breadcrumb";
import { WishlistContext } from "../../components/wishlist_components/WishlistContext";
import { CartContext } from "../../components/cart_components/CartContext";
import { AuthContext } from "../../components/auth_components/AuthManager";
import { useNavigate } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { FaTrash, FaCartPlus, FaBookmark, FaCheck } from "react-icons/fa";
import { FaPython, FaReact, FaJava, FaDatabase, FaRobot } from "react-icons/fa";

/* Icon picker (subtle, same palette vibe as AllCategories) */
function getCourseIconMeta(course) {
  const text = `${(course?.tags || []).join(" ")} ${
    course?.title || ""
  }`.toLowerCase();
  if (/java\b/.test(text)) return { Icon: FaJava, cls: "text-orange-500" };
  if (/python/.test(text)) return { Icon: FaPython, cls: "text-yellow-500" };
  if (/selenium|robot/.test(text))
    return { Icon: FaRobot, cls: "text-purple-700" };
  if (/(mysql|sql|db|database)/.test(text))
    return { Icon: FaDatabase, cls: "text-blue-500" };
  if (/react|web/.test(text)) return { Icon: FaReact, cls: "text-cyan-500" };
  return { Icon: FaReact, cls: "text-cyan-500" };
}

const Wishlist = () => {
  const {
    wishlistItems = [],
    removeFromWishlist,
    toggleSaveForLater,
    moveToCartFromWishlist,
    fetchWishlist,
  } = useContext(WishlistContext) || {};

  const { fetchServerCart } = useContext(CartContext) || {};
  const { isLoggedIn } = useContext(AuthContext) || { isLoggedIn: false };
  const navigate = useNavigate();

  // Hydrate wishlist like AllCategories (after login + on mount)
  useEffect(() => {
    if (isLoggedIn) fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);
  useEffect(() => {
    if (isLoggedIn) fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Responsive cols (same breakpoints as AllCategories)
  const [cols, setCols] = useState(4);
  useEffect(() => {
    const computeCols = () => {
      const w = window.innerWidth;
      if (w >= 1280) return 5;
      if (w >= 1024) return 4;
      if (w >= 768) return 3;
      if (w >= 640) return 2;
      return 1;
    };
    const onResize = () => setCols(computeCols());
    setCols(computeCols());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Rows & pagination (identical UX; default 1 row per page)
  const [rowsPerPage, setRowsPerPage] = useState(1);
  const [page, setPage] = useState(1);

  const items = wishlistItems;
  const pageSize = Math.max(1, (cols || 1) * (rowsPerPage || 1));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const visible = items.slice(startIdx, endIdx);

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));
  useEffect(() => setPage(1), [rowsPerPage, cols]);

  const buildPages = () => {
    const pages = [];
    const maxBtns = 7;
    if (totalPages <= maxBtns) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage > 4) pages.push("…");
    const s = Math.max(2, currentPage - 1),
      e = Math.min(totalPages - 1, currentPage + 1);
    for (let i = s; i <= e; i++) pages.push(i);
    if (currentPage < totalPages - 3) pages.push("…");
    pages.push(totalPages);
    return pages;
  };

  const handleCardClick = (courseId) => {
    const userId = localStorage.getItem("userId");
    if (userId) navigate(`/user-course/${userId}/${courseId}`);
    else navigate("/login");
  };

  const handleCheckoutNow = async (courseId) => {
    await moveToCartFromWishlist(courseId);
    if (fetchServerCart) await fetchServerCart();
    navigate("/checkout");
  };

  return (
    <div>
      <div className="blog_header_section">
        {/* ✅ Breadcrumb just like AllBlogs */}
        <Breadcrumb pageTitle="Wishlist" />

        {/* The rest keeps AllCategories' layout/spacing/colors/borders/fonts */}
        <div className="category_container container">
          <div className="px-4 md:px-8 lg:px-12 py-8">
            {/* Top-right status + rows selector */}
            <div className="flex items-center justify-end gap-4 mb-3">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">
                  {total === 0 ? 0 : startIdx + 1}–{endIdx}
                </span>{" "}
                of <span className="font-semibold">{total}</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Rows:</label>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value) || 1)}
                  className="text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </div>
            </div>

            {/* Cards area with top/bottom borders (exactly like AllCategories) */}
            <div className="border-t border-b py-5 container mx-auto">
              {total === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  Your wishlist is empty.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {visible.map((item) => {
                      const { Icon, cls } = getCourseIconMeta(item);
                      return (
                        <div
                          key={item._id}
                          className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-purple-300"
                          onClick={() => handleCardClick(item._id)}
                          title={item.title}
                        >
                          {/* Remove via filled-heart (same top-right control location) */}
                          <button
                            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
                            aria-label="Remove from Wishlist"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromWishlist(item._id);
                            }}
                            title="Remove from Wishlist"
                          >
                            <AiFillHeart className="w-5 h-5 text-red-500" />
                          </button>

                          {/* Icon */}
                          <div className="mb-4 flex justify-center">
                            <div className="h-16 w-16 flex items-center justify-center">
                              <Icon className={`text-4xl ${cls}`} />
                            </div>
                          </div>

                          <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                            {item.title}
                          </h3>

                          <div className="text-center mb-3">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {item.level || "Course"}
                            </span>
                          </div>

                          {item.savedForLater ? (
                            <div className="text-xs text-yellow-700 text-center mb-3">
                              <span className="inline-flex items-center gap-1">
                                <FaBookmark /> Saved for later
                              </span>
                            </div>
                          ) : null}

                          {/* Subtle action buttons (no dark colors) */}
                          <div className="mt-auto space-y-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveToCartFromWishlist(item._id);
                                if (fetchServerCart) fetchServerCart();
                              }}
                              className="w-full text-sm bg-purple-100 text-purple-700 py-2 rounded-full font-medium hover:bg-purple-200 transition"
                            >
                              <span className="inline-flex items-center gap-2 justify-center">
                                <FaCartPlus /> Move to Cart
                              </span>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCheckoutNow(item._id);
                              }}
                              className="w-full text-sm bg-emerald-100 text-emerald-700 py-2 rounded-full font-medium hover:bg-emerald-200 transition"
                            >
                              <span className="inline-flex items-center gap-2 justify-center">
                                <FaCheck /> Buy Now
                              </span>
                            </button>

                            <div className="flex justify-between gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSaveForLater(item._id);
                                }}
                                className="w-1/2 text-sm py-2 bg-yellow-100 text-yellow-700 rounded-full font-medium hover:bg-yellow-200 transition"
                              >
                                <span className="inline-flex items-center gap-1 justify-center">
                                  <FaBookmark />
                                  {item.savedForLater ? "Unsave" : "Save"}
                                </span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFromWishlist(item._id);
                                }}
                                className="w-1/2 text-sm py-2 bg-rose-100 text-rose-600 rounded-full font-medium hover:bg-rose-200 transition"
                              >
                                <span className="inline-flex items-center gap-1 justify-center">
                                  <FaTrash /> Remove
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination (identical to AllCategories) */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <button
                        onClick={() => goTo(1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-full border text-sm ${
                          currentPage === 1
                            ? "text-gray-400 border-gray-200 cursor-not-allowed"
                            : "text-purple-600 border-purple-200 hover:bg-purple-50"
                        }`}
                      >
                        « First
                      </button>
                      <button
                        onClick={() => goTo(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-full border text-sm ${
                          currentPage === 1
                            ? "text-gray-400 border-gray-200 cursor-not-allowed"
                            : "text-purple-600 border-purple-200 hover:bg-purple-50"
                        }`}
                      >
                        ‹ Prev
                      </button>

                      {buildPages().map((p, idx) =>
                        p === "…" ? (
                          <span
                            key={`dots-${idx}`}
                            className="px-2 text-gray-400 select-none"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => goTo(p)}
                            className={`min-w-[36px] px-3 py-1 rounded-full border text-sm transition ${
                              p === currentPage
                                ? "bg-purple-600 text-white border-purple-600 shadow"
                                : "text-purple-600 border-purple-200 hover:bg-purple-50"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}

                      <button
                        onClick={() => goTo(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-full border text-sm ${
                          currentPage === totalPages
                            ? "text-gray-400 border-gray-200 cursor-not-allowed"
                            : "text-purple-600 border-purple-200 hover:bg-purple-50"
                        }`}
                      >
                        Next ›
                      </button>
                      <button
                        onClick={() => goTo(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-full border text-sm ${
                          currentPage === totalPages
                            ? "text-gray-400 border-gray-200 cursor-not-allowed"
                            : "text-purple-600 border-purple-200 hover:bg-purple-50"
                        }`}
                      >
                        Last »
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
