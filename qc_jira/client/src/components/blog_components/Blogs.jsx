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
  FaBlog,
  FaSortAmountDownAlt,
  FaSortAmountUpAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "of",
  "in",
  "on",
  "at",
  "to",
  "for",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "me",
  "him",
  "her",
  "us",
  "them",
  "this",
  "that",
  "these",
  "those",
  "there",
  "here",
  "please",
  "pls",
  "plz",
  "show",
  "showing",
  "find",
  "search",
  "look",
  "list",
  "blog",
  "blogs",
  "all",
  "any",
  "me",
  "my",
]);

function getImageUrl(imagePath) {
  if (!imagePath) return null;
  try {
    const normalized = String(imagePath).replace(/\\/g, "/");
    const tail = normalized.split("uploads/").pop();
    if (!tail) return null;
    return `${globalBackendRoute}/uploads/${tail}`;
  } catch {
    return null;
  }
}

function BlogThumb({ src, alt, isList }) {
  const [broken, setBroken] = useState(false);
  const commonWrap =
    "overflow-hidden rounded-md flex items-center justify-center bg-slate-50";
  const listSize = "w-24 h-24 flex-shrink-0 mr-4";
  const gridSize = "w-full h-48";
  const iconSize = isList
    ? "w-10 h-10 sm:w-12 sm:h-12"
    : "w-14 h-14 sm:w-16 sm:h-16";

  if (!src || broken) {
    return (
      <div className={`${commonWrap} ${isList ? listSize : gridSize}`}>
        <FaBlog className={`text-slate-400 ${iconSize}`} />
      </div>
    );
  }

  return (
    <div className={isList ? listSize : gridSize}>
      <img
        src={src}
        alt={alt || "blog"}
        className="w-full h-full object-cover rounded-md"
        onError={() => setBroken(true)}
        loading="lazy"
      />
    </div>
  );
}

export default function Blogs() {
  const [view, setView] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" latest→oldest, "asc" oldest→latest
  const [currentPage, setCurrentPage] = useState(1);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const toArrayTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    return String(tags)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  const makeSlug = (title, serverSlug) => {
    if (serverSlug && typeof serverSlug === "string" && serverSlug.length > 0)
      return serverSlug;
    if (!title) return "blog";
    return String(title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

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

  const filteredBlogs = useMemo(() => {
    // Normalize search input: collapse spaces, trim, lowercase
    const normalized = (searchTerm || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    // Tokenize & drop stopwords: this is what powers "show java blogs"
    const tokens = normalized
      ? normalized
          .split(" ")
          .map((t) => t.trim())
          .filter((t) => t && !STOP_WORDS.has(t))
      : [];

    // Sort first (by date)
    const sorted = [...blogs].sort((a, b) => {
      const da = a?.publishedDate ? new Date(a.publishedDate) : new Date(0);
      const db = b?.publishedDate ? new Date(b.publishedDate) : new Date(0);
      return sortOrder === "desc" ? db - da : da - db;
    });

    // If nothing meaningful to search (only stopwords / empty) → just return sorted
    if (!tokens.length) return sorted;

    return sorted.filter((blog) => {
      const title = blog?.title || "";
      const category = blog?.category || "";
      const tagsArr = toArrayTags(blog?.tags);
      const summary = blog?.summary || "";
      const content = blog?.content || "";
      const slug = makeSlug(blog?.title, blog?.slug);

      const authorName =
        (blog?.author && typeof blog.author === "object"
          ? blog.author.name || blog.author.fullName || blog.author.username
          : blog?.author) || "";

      const dateText = blog?.publishedDate
        ? new Date(blog.publishedDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "";

      const haystack = [
        title,
        category,
        tagsArr.join(" "),
        authorName,
        summary,
        content,
        slug,
        dateText,
      ]
        .join(" ")
        .toLowerCase();

      // Match if *all* tokens appear somewhere in the haystack
      return tokens.every((t) => haystack.includes(t));
    });
  }, [blogs, searchTerm, sortOrder]);

  const getItemsPerPage = () => {
    const width = window.innerWidth;

    if (width >= 1280) return 9; // 3 × 3
    if (width >= 1024) return 8; // 4 × 2
    if (width >= 768) return 6; // 3 × 2
    return 4; // 2 × 2
  };

  const itemsPerPage = getItemsPerPage();
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

  const iconStyle = {
    list: view === "list" ? "text-blue-500" : "text-gray-500",
    grid: view === "grid" ? "text-green-500" : "text-gray-500",
    card: view === "card" ? "text-purple-500" : "text-gray-500",
  };

  useEffect(() => setCurrentPage(1), [searchTerm, sortOrder, view]);

  const toggleSortOrder = () =>
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 border-b">
      {/* SINGLE ROW: All Blogs | Search | Showing... | Sort | Views */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* All Blogs label */}
        <h1 className="text-2xl font-semibold whitespace-nowrap">All Blogs</h1>

        {/* Search pill */}
        <div className="relative flex-1 min-w-[180px] max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search by title, tag, author, date, keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-full border border-gray-300 text-gray-900 text-xs sm:text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
          />
        </div>

        {/* Right side group */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Showing text */}
          <p className="text-[11px] sm:text-xs text-gray-500 whitespace-nowrap">
            Showing {paginatedBlogs.length} of {filteredBlogs.length} blogs
          </p>

          {/* Sort icon/button */}
          <button
            onClick={toggleSortOrder}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
            title={
              sortOrder === "desc"
                ? "Sorted: Latest to Oldest. Click to switch."
                : "Sorted: Oldest to Latest. Click to switch."
            }
          >
            {sortOrder === "desc" ? (
              <FaSortAmountDownAlt className="text-indigo-600 text-sm" />
            ) : (
              <FaSortAmountUpAlt className="text-indigo-600 text-sm" />
            )}
          </button>

          {/* View icons */}
          <FaThList
            className={`cursor-pointer text-sm ${iconStyle.list}`}
            onClick={() => setView("list")}
            title="List view"
          />
          <FaTh
            className={`cursor-pointer text-sm ${iconStyle.card}`}
            onClick={() => setView("card")}
            title="Compact cards"
          />
          <FaThLarge
            className={`cursor-pointer text-sm ${iconStyle.grid}`}
            onClick={() => setView("grid")}
            title="Grid view"
          />
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <p className="text-center text-gray-600 mt-6">Loading blogs…</p>
      )}
      {fetchError && !loading && (
        <p className="text-center text-red-600 mt-6">{fetchError}</p>
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
            transition={{ duration: 0.4 }}
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
              const imageSrc = getImageUrl(blog?.featuredImage);
              const isList = view === "list";

              return (
                <Link key={blog._id} to={`/single-blog/${slug}/${blog._id}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden h-full flex flex-col ${
                      isList ? "sm:flex-row p-4 items-center" : ""
                    }`}
                  >
                    <BlogThumb
                      src={imageSrc}
                      alt={blog?.title}
                      isList={isList}
                    />

                    <div
                      className={`${
                        isList
                          ? "flex-1 flex flex-col"
                          : "p-4 flex flex-col flex-grow"
                      }`}
                    >
                      <div className="text-left space-y-1 flex-shrink-0">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                          {blog?.title || "Untitled"}
                        </h3>

                        {displayDate !== "—" && (
                          <p className="text-xs text-gray-600 flex items-center">
                            <FaCalendar className="mr-1 text-yellow-500" />
                            {displayDate}
                          </p>
                        )}

                        <p className="text-xs text-gray-600 flex items-center">
                          <FaUser className="mr-1 text-red-500" />
                          {authorName}
                        </p>

                        {tagsArr.length > 0 && (
                          <p className="text-xs text-gray-600 flex items-center">
                            <FaTags className="mr-1 text-green-500" />
                            {tagsArr.join(", ")}
                          </p>
                        )}
                      </div>

                      {view !== "list" && blog?.summary?.trim() && (
                        <p className="text-gray-700 mt-2 text-xs sm:text-sm line-clamp-3 flex-shrink-0">
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
            <p className="text-center text-gray-600 mt-6">No blogs found.</p>
          )}

          {/* Pagination */}
          {filteredBlogs.length > 0 && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-white text-sm ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                <FaArrowLeft />
              </button>
              <span className="text-gray-700 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-white text-sm ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                <FaArrowRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
