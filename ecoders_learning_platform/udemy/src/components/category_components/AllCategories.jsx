import React, { useState, useEffect, useMemo, useContext } from "react";
import { FaPython, FaJava, FaDatabase, FaReact, FaRobot } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import { WishlistContext } from "../../components/wishlist_components/WishlistContext";
import { AuthContext } from "../../components/auth_components/AuthManager";

const AllCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryNames, setCategoryNames] = useState([]);
  const [catIdToName, setCatIdToName] = useState({});
  const [coursesRaw, setCoursesRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [cols, setCols] = useState(4);
  const [rowsPerPage, setRowsPerPage] = useState(1);
  const [page, setPage] = useState(1);

  // unified search term (from URL + header events)
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // wishlist + auth
  const {
    wishlistItems = [],
    addToWishlist = async () => {},
    removeFromWishlist = async () => {},
    addItemToLocalWishlist = () => {},
    removeItemFromLocalWishlist = () => {},
    fetchWishlist = () => {},
  } = useContext(WishlistContext) || {};

  const { isLoggedIn } = useContext(AuthContext) || { isLoggedIn: false };

  // ensure wishlist is loaded on this page (fixes: hearts after refresh)
  useEffect(() => {
    if (isLoggedIn) fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // responsive cols
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

  useEffect(() => {
    fetchAll();
  }, []);
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, rowsPerPage, cols]);

  // ---- URL <-> state sync for q ----
  const getQFromURL = (loc) => {
    const usp = new URLSearchParams(loc.search || "");
    return usp.get("q") || ""; // use `q` key
  };

  // when URL changes, update local search term & reset category to All
  useEffect(() => {
    const q = (getQFromURL(location) || "").trim();
    setSearchTerm(q);
    if (q) setSelectedCategory("All");
    setPage(1);
  }, [location]);

  // listen to global header events for live filtering
  useEffect(() => {
    const onSearch = (e) => {
      const term = (e?.detail || "").trim();
      setSearchTerm(term);
      // keep URL in sync
      const params = new URLSearchParams(location.search);
      if (term) params.set("q", term);
      else params.delete("q");
      navigate(
        { pathname: location.pathname, search: params.toString() },
        { replace: true }
      );
      setSelectedCategory("All");
      setPage(1);
    };
    window.addEventListener("ecoders:search", onSearch);
    return () => window.removeEventListener("ecoders:search", onSearch);
  }, [location.pathname, location.search, navigate]);

  // ---- fetchers ----
  const extractArray = (payload) => {
    const d = payload?.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.items)) return d.items;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.results)) return payload.results;
    return [];
  };
  const extractMeta = (payload) => payload?.data?.meta || payload?.meta || null;

  const fetchAll = async () => {
    setLoading(true);
    setErr(null);
    try {
      // categories
      const catRes = await axios.get(
        `${globalBackendRoute}/api/all-categories`
      );
      const cats = extractArray(catRes);
      const names = [];
      const map = {};
      cats.forEach((c) => {
        const name = typeof c === "string" ? c : c?.name || c?.category_name;
        if (name) names.push(name);
        const id = typeof c === "object" ? c?._id || c?.id : null;
        if (id && name) map[id] = name;
      });
      setCategoryNames(names.filter(Boolean));
      setCatIdToName(map);

      // courses
      let allCourses = [];
      let first = await axios.get(`${globalBackendRoute}/api/list-courses`, {
        params: { page: 1, limit: 5000, sortBy: "createdAt", order: "desc" },
      });
      let arr = extractArray(first);
      const meta = extractMeta(first);
      allCourses = arr;

      if (
        meta?.totalPages &&
        meta.totalPages > 1 &&
        arr.length < (meta.total || Infinity)
      ) {
        for (let p = 2; p <= meta.totalPages; p++) {
          const next = await axios.get(
            `${globalBackendRoute}/api/list-courses`,
            {
              params: {
                page: p,
                limit: meta.limit || 20,
                sortBy: meta.sortBy || "createdAt",
                order: meta.order || "desc",
              },
            }
          );
          allCourses = allCourses.concat(extractArray(next));
        }
      }
      setCoursesRaw(allCourses);
    } catch (e) {
      console.error("Error fetching:", e);
      setErr("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- helpers ----------
  const looksLikeObjectId = (v) =>
    typeof v === "string" && /^[a-f0-9]{24}$/i.test(v);

  const resolveCategoryName = (course) => {
    if (course?.category?.name) return course.category.name;
    if (course?.category?.category_name) return course.category.category_name;
    if (
      typeof course?.category === "string" &&
      !looksLikeObjectId(course.category)
    )
      return course.category;
    if (typeof course?.categoryName === "string") return course.categoryName;
    if (typeof course?.category_label === "string")
      return course.category_label;
    if (looksLikeObjectId(course?.category))
      return catIdToName[course.category] || "Uncategorized";
    if (looksLikeObjectId(course?.categoryId))
      return catIdToName[course.categoryId] || "Uncategorized";
    if (Array.isArray(course?.categories) && course.categories.length) {
      const c0 = course.categories[0];
      if (c0?.name) return c0.name;
      if (c0?.category_name) return c0.category_name;
      if (looksLikeObjectId(c0)) return catIdToName[c0] || "Uncategorized";
      if (typeof c0 === "string") return c0;
    }
    return "Uncategorized";
  };

  const determineIsPaid = (course) => {
    const price = Number(course?.price ?? 0);
    const accessType = (course?.accessType || course?.visibility || "")
      .toString()
      .toLowerCase();
    return price > 0 || accessType === "paid";
  };

  const getIconForCategory = (catName) => {
    const name = (catName || "").toLowerCase();
    if (name.includes("java"))
      return <FaJava className="text-4xl text-red-500" />;
    if (name.includes("python"))
      return <FaPython className="text-4xl text-yellow-500" />;
    if (name.includes("selenium"))
      return <FaRobot className="text-4xl text-purple-700" />;
    if (
      name.includes("mysql") ||
      name.includes("sql") ||
      name.includes("db") ||
      name.includes("database")
    )
      return <FaDatabase className="text-4xl text-blue-500" />;
    if (name.includes("react") || name.includes("web"))
      return <FaReact className="text-4xl text-cyan-500" />;
    return <FaReact className="text-4xl text-cyan-500" />;
  };

  const truncateTwoLines = (text) => {
    if (!text) return "Explore this course.";
    const s = String(text);
    return s.length > 180 ? s.slice(0, 180).trim() + "..." : s;
  };

  const normalizeCourse = (course) => {
    const categoryName = resolveCategoryName(course);
    const isPaid = determineIsPaid(course);
    const fallbackSlug = course?.title
      ? course.title.toLowerCase().replace(/\s+/g, "-")
      : "course";
    const tags = Array.isArray(course?.tags) ? course.tags : [];
    return {
      id: course?._id || course?.id || course?.slug || fallbackSlug,
      _id: course?._id || course?.id,
      title: course?.title || "Untitled Course",
      slug: course?.slug || fallbackSlug,
      category: categoryName,
      description: truncateTwoLines(
        course?.shortDescription || course?.description
      ),
      price: Number(course?.price ?? 0),
      isPaid,
      icon: getIconForCategory(categoryName),
      tags,
      _search_blob: [
        course?.title,
        course?.shortDescription,
        course?.description,
        categoryName,
        course?.slug,
        ...(tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    };
  };

  const courses = useMemo(
    () => coursesRaw.map(normalizeCourse),
    [coursesRaw, catIdToName]
  );

  // ----------- FUZZY SEARCH -----------
  // Bigram/Dice similarity for fuzzy match (0..1)
  const dice = (a, b) => {
    const s = (a || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ");
    const t = (b || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ");
    const bg = (str) => {
      const z = str.replace(/\s+/g, " ").trim();
      if (z.length < 2) return new Map([[z, 1]]);
      const m = new Map();
      for (let i = 0; i < z.length - 1; i++) {
        const g = z.slice(i, i + 2);
        m.set(g, (m.get(g) || 0) + 1);
      }
      return m;
    };
    const A = bg(s);
    const B = bg(t);
    let inter = 0;
    for (const [g, c] of A.entries()) {
      if (B.has(g)) inter += Math.min(c, B.get(g));
    }
    let sumA = 0,
      sumB = 0;
    for (const v of A.values()) sumA += v;
    for (const v of B.values()) sumB += v;
    if (sumA + sumB === 0) return 0;
    return (2 * inter) / (sumA + sumB);
  };

  const matchesFuzzy = (course, kw) => {
    const q = (kw || "").trim().toLowerCase();
    if (!q) return true;

    // token contains (any token) + fuzzy score on fields
    const tokens = q.split(/\s+/).filter(Boolean);
    const blob = course._search_blob || "";
    const fields = [
      course.title,
      course.description,
      course.category,
      course.slug,
      (course.tags || []).join(" "),
    ].filter(Boolean);

    // quick win: any token substring in blob
    if (tokens.some((t) => blob.includes(t))) return true;

    // fuzzy: keep if any field is similar enough
    const maxScore = fields.reduce((mx, f) => Math.max(mx, dice(q, f)), 0);

    // thresholds: shorter queries need higher similarity
    const tight = q.length <= 3 ? 0.55 : q.length <= 5 ? 0.45 : 0.35;

    return maxScore >= tight;
  };

  // filter + paginate
  const inCategory =
    selectedCategory === "All"
      ? courses
      : courses.filter((c) => c.category === selectedCategory);

  const filteredCourses = inCategory.filter((c) => matchesFuzzy(c, searchTerm));

  // pagination
  const [pageState, setPageState] = useState({ page });
  useEffect(() => setPageState({ page }), [page]); // keep simple

  const pageSize = Math.max(1, (cols || 1) * (rowsPerPage || 1));
  const total = filteredCourses.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const visible = filteredCourses.slice(startIdx, endIdx);
  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));

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

  // ---------- wishlist helpers on card ----------
  const isInWishlist = (courseId) => {
    const id = String(courseId || "");
    return (wishlistItems || []).some((w) => String(w._id) === id);
    // NOTE: Adjust matching shape if your wishlist stores different id field
  };

  const onHeartClick = async (e, course) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      const ok = window.confirm(
        "Please login to use wishlist. Go to login now?"
      );
      if (ok) navigate("/login");
      return;
    }
    const id = course._id || course.id;
    if (!id) return;

    // FULLY OPTIMISTIC TOGGLE + hard-sync
    if (isInWishlist(id)) {
      removeItemFromLocalWishlist(id);
      try {
        await removeFromWishlist(id);
      } finally {
        await fetchWishlist();
      }
    } else {
      addItemToLocalWishlist({
        _id: id,
        title: course.title,
        slug: course.slug,
        level: course.level,
        tags: course.tags || [],
        savedForLater: false,
        published: true,
      });
      try {
        await addToWishlist(id);
      } finally {
        await fetchWishlist();
      }
    }
  };

  return (
    <div className="category_container">
      <div className="px-4 md:px-8 lg:px-12 py-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`text-sm md:text-base px-3 py-1 font-medium border-b-2 transition whitespace-nowrap ${
              selectedCategory === "All"
                ? "text-purple-600 border-purple-600"
                : "text-gray-700 border-transparent hover:text-purple-600 hover:border-purple-600"
            }`}
          >
            All
          </button>
          {categoryNames.map((cat, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(cat)}
              className={`text-sm md:text-base px-3 py-1 font-medium border-b-2 transition whitespace-nowrap ${
                selectedCategory === cat
                  ? "text-purple-600 border-purple-600"
                  : "text-gray-700 border-transparent hover:text-purple-600 hover:border-purple-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Top-right status + rows selector */}
        <div className="flex items-center justify-end gap-4 mb-3">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold">
              {total === 0 ? 0 : startIdx + 1}–{endIdx}
            </span>{" "}
            of <span className="font-semibold">{total}</span>
            {searchTerm ? (
              <span className="ml-2 text-gray-500">
                (search: <span className="italic">"{searchTerm}"</span>)
              </span>
            ) : null}
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

        {/* Course Cards */}
        <div className="all_categories border-t border-b py-5 container mx-auto">
          {loading ? (
            <div className="text-center text-gray-500 py-10">
              Loading courses…
            </div>
          ) : err ? (
            <div className="text-center text-red-600 py-10">{err}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {visible.length === 0 ? (
                  <div className="col-span-full text-center text-gray-500">
                    No courses found
                    {searchTerm
                      ? ` for the search "${searchTerm}"`
                      : selectedCategory !== "All"
                      ? ` for "${selectedCategory}"`
                      : ""}
                  </div>
                ) : (
                  visible.map((course) => {
                    const inWish = isInWishlist(course._id || course.id);
                    return (
                      <div
                        key={course.id}
                        className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-purple-300"
                        onClick={() => {
                          const userId = localStorage.getItem("userId");
                          if (course.isPaid) {
                            if (userId)
                              navigate(`/user-course/${userId}/${course.id}`);
                            else
                              alert(
                                "Please log in to access this paid course."
                              );
                          } else {
                            navigate(
                              `/user-course/${course.slug}/${course.id}`
                            );
                          }
                        }}
                      >
                        {/* Heart button */}
                        <button
                          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
                          aria-label={
                            inWish ? "Remove from Wishlist" : "Add to Wishlist"
                          }
                          onClick={(e) => onHeartClick(e, course)}
                          title={
                            inWish ? "Remove from Wishlist" : "Add to Wishlist"
                          }
                        >
                          {inWish ? (
                            <AiFillHeart className="w-5 h-5 text-red-500" />
                          ) : (
                            <AiOutlineHeart className="w-5 h-5 text-black" />
                          )}
                        </button>

                        {course.isPaid && (
                          <span className="absolute top-3 left-3 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                            Paid
                          </span>
                        )}

                        <div className="mb-4 flex justify-center">
                          {course.icon}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                          {course.title}
                        </h3>

                        <p
                          className="text-sm text-gray-600 mb-4 text-center"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                          title={course.description}
                        >
                          {course.description}
                        </p>

                        <div className="mt-auto text-center text-sm text-purple-500 hover:underline ">
                          Start learning →
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pagination */}
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
  );
};

export default AllCategories;
