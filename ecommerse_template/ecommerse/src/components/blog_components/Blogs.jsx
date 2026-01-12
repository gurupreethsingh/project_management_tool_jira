// ✅ file: src/pages/blog_pages/Blogs.jsx
// ✅ ONLY UI redesign (NO logic/feature changes)
// ✅ Orange theme applied (search, borders, accents, pagination, cards, tags)

import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaArrowLeft,
  FaArrowRight,
  FaCalendar,
  FaTags,
  FaUser,
  FaSearch,
  FaRegImage,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

// ✅ Reusable icon fallback (no image file needed)
const ImageFallback = ({ className = "", style }) => (
  <div
    className={`flex items-center justify-center bg-orange-50 text-orange-300 ${className}`}
    style={style}
    aria-label="Image not available"
    role="img"
  >
    <FaRegImage className="text-4xl" />
  </div>
);

export default function Blogs() {
  const [view, setView] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // --- helpers ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    try {
      const normalized = String(imagePath).replace(/\\/g, "/");
      if (/^https?:\/\//i.test(normalized)) return normalized;
      const tail = normalized.split("uploads/").pop();
      if (!tail) return "";
      return `${globalBackendRoute}/uploads/${tail}`;
    } catch {
      return "";
    }
  };

  const toArrayTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    return String(tags)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  const makeSlug = (title, serverSlug) => {
    if (serverSlug && typeof serverSlug === "string" && serverSlug.length > 0) {
      return serverSlug;
    }
    if (!title) return "blog";
    return String(title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // --- fetch blogs ---
  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      setFetchError("");
      try {
        const res = await axios.get(`${globalBackendRoute}/api/all-blogs`);
        if (isMounted) setBlogs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        if (isMounted) setFetchError("Failed to load blogs. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // --- search + sort ---
  const filteredBlogs = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return blogs
      .filter((blog) => {
        const titleMatch = blog?.title?.toLowerCase().includes(search);
        const categoryMatch = blog?.category?.toLowerCase().includes(search);
        const tagsArr = toArrayTags(blog?.tags);
        const tagsMatch = tagsArr.some((t) => t.toLowerCase().includes(search));

        const authorName =
          (blog?.author && typeof blog.author === "object"
            ? blog.author.name || blog.author.fullName || blog.author.username
            : blog?.author) || "";

        const authorMatch = String(authorName).toLowerCase().includes(search);
        return titleMatch || categoryMatch || tagsMatch || authorMatch;
      })
      .sort((a, b) => {
        const da = a?.publishedDate ? new Date(a.publishedDate) : new Date(0);
        const db = b?.publishedDate ? new Date(b.publishedDate) : new Date(0);
        return db - da; // newest first
      });
  }, [blogs, searchTerm]);

  // --- pagination ---
  const itemsPerPage = 6;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / itemsPerPage)
  );
  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBlogs.slice(start, start + itemsPerPage);
  }, [filteredBlogs, currentPage]);

  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  // --- icon styles ---
  const iconStyle = {
    list: view === "list" ? "text-orange-600" : "text-gray-400",
    grid: view === "grid" ? "text-orange-600" : "text-gray-400",
    card: view === "card" ? "text-orange-600" : "text-gray-400",
  };

  // Reset to first page on search change
  useEffect(() => setCurrentPage(1), [searchTerm]);

  return (
    <div className="max-w-9xl mx-auto py-12 px-4 sm:px-6 lg:px-8 border-b border-orange-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="block-heading">
          <h2 className="font-bold text-xl text-gray-900">All Blogs</h2>
          <p className="text-sm text-gray-600 mt-1">
            Browse insights, tutorials, and updates in a clean orange theme.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-orange-200 bg-orange-50/40 px-4 py-2.5 pr-10 text-gray-900 shadow-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-300 sm:text-sm"
          />
          <FaSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-orange-400" />
        </div>

        {/* Count + View Switcher */}
        <div className="flex items-center space-x-4 bg-white border border-orange-200 rounded-2xl px-4 py-2 shadow-sm">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {paginatedBlogs.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {filteredBlogs.length}
            </span>
          </p>

          <div className="w-px h-6 bg-orange-100" />

          <FaThList
            className={`cursor-pointer ${iconStyle.list} hover:text-orange-600 transition-colors`}
            onClick={() => setView("list")}
            title="List view"
          />
          <FaTh
            className={`cursor-pointer ${iconStyle.card} hover:text-orange-600 transition-colors`}
            onClick={() => setView("card")}
            title="Card view"
          />
          <FaThLarge
            className={`cursor-pointer ${iconStyle.grid} hover:text-orange-600 transition-colors`}
            onClick={() => setView("grid")}
            title="Grid view"
          />
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-8">
          <p className="text-center text-orange-700 font-medium">
            Loading blogs…
          </p>
        </div>
      )}

      {fetchError && !loading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <p className="text-center text-red-700 font-medium">{fetchError}</p>
        </div>
      )}

      {/* Blog Cards */}
      {!loading && !fetchError && (
        <>
          <motion.div
            className={`grid gap-6 ${
              view === "list"
                ? "grid-cols-1"
                : view === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {paginatedBlogs.map((blog) => {
              const tagsArr = toArrayTags(blog?.tags);

              const authorName =
                (blog?.author && typeof blog.author === "object"
                  ? blog.author.name ||
                    blog.author.fullName ||
                    blog.author.username
                  : blog?.author) || "Unknown";

              const displayDate = blog?.publishedDate
                ? new Date(blog.publishedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—";

              const slug = makeSlug(blog?.title, blog?.slug);
              const imgSrc = getImageUrl(blog?.featuredImage);

              return (
                <Link key={blog._id} to={`/single-blog/${slug}/${blog._id}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`border border-orange-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden h-full flex flex-col ${
                      view === "list" ? "sm:flex-row p-4 items-center" : ""
                    }`}
                  >
                    {/* Image / Icon fallback */}
                    <div
                      className={`${
                        view === "list"
                          ? "w-24 h-24 flex-shrink-0 mr-4"
                          : "w-full h-48"
                      }`}
                    >
                      {imgSrc ? (
                        <>
                          <img
                            src={imgSrc}
                            alt={blog?.title || "blog"}
                            className="w-full h-full object-cover rounded-xl border border-orange-100"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const next = e.currentTarget.nextSibling;
                              if (next) next.style.display = "flex";
                            }}
                          />
                          <ImageFallback
                            className="w-full h-full rounded-xl border border-orange-100"
                            style={{ display: "none" }}
                          />
                        </>
                      ) : (
                        <ImageFallback className="w-full h-full rounded-xl border border-orange-100" />
                      )}
                    </div>

                    {/* Content */}
                    <div
                      className={`${
                        view === "list"
                          ? "flex-1 flex flex-col"
                          : "p-4 flex flex-col flex-grow"
                      }`}
                    >
                      <div className="text-left space-y-2 flex-shrink-0">
                        <h3 className="text-lg font-bold text-gray-900">
                          {blog?.title || "Untitled"}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3">
                          {displayDate !== "—" && (
                            <p className="text-sm text-gray-600 flex items-center">
                              <FaCalendar className="mr-1 text-orange-500" />
                              {displayDate}
                            </p>
                          )}

                          <p className="text-sm text-gray-600 flex items-center">
                            <FaUser className="mr-1 text-orange-500" />
                            {authorName}
                          </p>
                        </div>

                        {tagsArr.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {tagsArr.slice(0, 3).map((t, idx) => (
                              <span
                                key={`${t}-${idx}`}
                                className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200"
                              >
                                {t}
                              </span>
                            ))}
                            {tagsArr.length > 3 && (
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                                +{tagsArr.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {view !== "list" && blog?.summary?.trim() && (
                        <p className="text-gray-700 mt-3 line-clamp-3 flex-shrink-0">
                          {blog.summary}
                        </p>
                      )}

                      <div className="flex-grow" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>

          {filteredBlogs.length === 0 && (
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-8 mt-6">
              <p className="text-center text-orange-700 font-medium">
                No blogs found.
              </p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-semibold border transition-colors shadow-sm ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 border-gray-200"
                  : "bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100"
              }`}
              title="Previous page"
            >
              <FaArrowLeft />
            </button>

            <span className="text-gray-700 font-medium">
              Page{" "}
              <span className="font-semibold text-gray-900">{currentPage}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">{totalPages}</span>
            </span>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-semibold border transition-colors shadow-sm ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 border-gray-200"
                  : "bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100"
              }`}
              title="Next page"
            >
              <FaArrowRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
