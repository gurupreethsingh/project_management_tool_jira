// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import {
//   FaTh,
//   FaAlignLeft,
//   FaAlignRight,
//   FaArrowLeft,
//   FaArrowRight,
//   FaRegImage, // ✅ placeholder icon
// } from "react-icons/fa";
// import { motion } from "framer-motion";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";

// // Safe client-side slug fallback (in case server didn't send blog.slug)
// const makeSlug = (title, serverSlug) => {
//   if (serverSlug && typeof serverSlug === "string" && serverSlug.length > 0) {
//     return serverSlug;
//   }
//   if (!title) return "blog";
//   return String(title)
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-");
// };

// // ✅ Reusable icon fallback (no image file needed)
// const ImageFallback = ({ className = "" }) => (
//   <div
//     className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
//     aria-label="Image not available"
//     role="img"
//   >
//     <FaRegImage className="text-4xl" />
//   </div>
// );

// const Blog = () => {
//   // route: /single-blog/:slug/:id
//   const { slug, id } = useParams();
//   const navigate = useNavigate();

//   const [view, setView] = useState("right-sidebar");
//   const [searchTerm, setSearchTerm] = useState("");

//   const [blog, setBlog] = useState(null);
//   const [allBlogs, setAllBlogs] = useState([]);
//   const [filteredBlogs, setFilteredBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [fetchErr, setFetchErr] = useState("");

//   // --- helpers ---
//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return ""; // ✅ no dog fallback
//     try {
//       const pathStr = String(imagePath);
//       if (/^https?:\/\//i.test(pathStr)) return pathStr; // already absolute (from API)
//       const normalized = pathStr.replace(/\\/g, "/");
//       const tail = normalized.split("uploads/").pop();
//       if (!tail) return "";
//       return `${globalBackendRoute}/uploads/${tail}`;
//     } catch {
//       return "";
//     }
//   };

//   const toTagArray = (tags) => {
//     if (!tags) return [];
//     if (Array.isArray(tags)) return tags;
//     return String(tags)
//       .split(",")
//       .map((t) => t.trim())
//       .filter(Boolean);
//   };

//   // Extract ```fenced code``` blocks (optional, in case body still includes code)
//   const extractCodeBlocks = (bodyText) => {
//     if (!bodyText) return { cleanedBody: "", codeBlocks: [] };
//     const text = String(bodyText);
//     const codeBlocks = [];
//     const regex = /```(?:\w+)?\n([\s\S]*?)```/g;
//     let cleaned = text;
//     let m;
//     while ((m = regex.exec(text)) !== null) {
//       codeBlocks.push(m[1].trim());
//     }
//     cleaned = cleaned.replace(regex, "").trim();
//     return { cleanedBody: cleaned, codeBlocks };
//   };

//   // Turn remaining body into Q/A sections (your original UX)
//   const preprocessBody = (text) => {
//     if (!text) return [];
//     const paragraphs = String(text).split("\n");
//     const sections = [];
//     let current = [];
//     paragraphs.forEach((p) => {
//       const trimmed = p.trim();
//       if (!trimmed) return;
//       if (trimmed.endsWith("?")) {
//         if (current.length) sections.push(current);
//         current = [{ type: "question", text: trimmed }];
//       } else if (current.length > 0 && current[0].type === "question") {
//         sections.push([{ type: "answer", text: trimmed }]);
//         current = [];
//       } else {
//         current.push({ type: "text", text: trimmed });
//       }
//     });
//     if (current.length) sections.push(current);
//     return sections;
//   };

//   // --- fetch single blog (by id; slug is just for the URL) ---
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       setLoading(true);
//       setFetchErr("");
//       try {
//         const { data } = await axios.get(
//           `${globalBackendRoute}/api/single-blogs/${id}`
//         );
//         if (cancelled) return;

//         const { cleanedBody, codeBlocks } = extractCodeBlocks(data?.body || "");
//         const processed = preprocessBody(cleanedBody);

//         setBlog({
//           ...data,
//           processedBody: processed,
//           codeBlocks, // from body fences (optional)
//           tags: toTagArray(data?.tags),
//           code: data?.code || "", // structured fields
//           explanation: data?.explanation || "",
//         });
//       } catch (err) {
//         console.error("Error fetching blog:", err?.response || err?.message);
//         if (!cancelled) setFetchErr("Failed to load blog. Please try again.");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [id]);

//   // --- fetch all blogs for sidebar + prev/next ---
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const { data } = await axios.get(`${globalBackendRoute}/api/all-blogs`);
//         if (cancelled) return;
//         const normalized = Array.isArray(data)
//           ? data.map((b) => ({ ...b, tags: toTagArray(b?.tags) }))
//           : [];
//         setAllBlogs(normalized);
//         setFilteredBlogs(normalized);
//       } catch (err) {
//         console.error("Error fetching all blogs:", err);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // --- filter sidebar by title ---
//   useEffect(() => {
//     if (!searchTerm) {
//       setFilteredBlogs(allBlogs);
//       return;
//     }
//     const term = searchTerm.toLowerCase();
//     setFilteredBlogs(
//       allBlogs.filter((b) => (b?.title || "").toLowerCase().includes(term))
//     );
//   }, [searchTerm, allBlogs]);

//   // --- prev/next ---
//   const prevNext = useMemo(() => {
//     if (!blog || allBlogs.length === 0) return { prev: null, next: null };
//     const idx = allBlogs.findIndex((b) => b._id === blog._id);
//     if (idx === -1) return { prev: null, next: null };
//     const prevIndex = idx === 0 ? allBlogs.length - 1 : idx - 1;
//     const nextIndex = idx === allBlogs.length - 1 ? 0 : idx + 1;
//     return { prev: allBlogs[prevIndex], next: allBlogs[nextIndex] };
//   }, [blog, allBlogs]);

//   const renderDescription = () =>
//     blog?.processedBody?.map((section, idx) => (
//       <div key={idx} className="mb-8">
//         {section.map((item, i) =>
//           item.type === "question" ? (
//             <p key={i} className="font-bold text-lg mb-4 mt-6 break-words">
//               {item.text}
//             </p>
//           ) : item.type === "answer" ? (
//             <blockquote
//               key={i}
//               className="border-l-4 border-blue-500 pl-4 text-gray-700 italic mb-6 break-words"
//             >
//               {item.text}
//             </blockquote>
//           ) : (
//             <p key={i} className="text-gray-800 text-lg mb-4 break-words">
//               {item.text}
//             </p>
//           )
//         )}
//       </div>
//     ));

//   // DIV-based code block (gray, bulletproof & wraps — no horizontal scroll)
//   const CodeBlock = ({ code }) => (
//     <div
//       className="rounded-md mb-4"
//       style={{
//         background: "#e5e7eb", // gray-200
//         color: "#111827", // gray-900
//         fontFamily:
//           'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
//         fontSize: "0.875rem",
//         lineHeight: 1.5,
//         padding: "1rem",
//         whiteSpace: "pre-wrap", // wrap lines
//         overflowWrap: "anywhere", // break long tokens
//         wordBreak: "break-word", // safety
//         maxWidth: "100%", // never exceed container
//         overflowX: "hidden", // never show horizontal scrollbar
//       }}
//     >
//       {code}
//     </div>
//   );

//   const renderCodeAndExplanation = () => {
//     const hasSeparateCode = !!blog?.code;
//     const hasFencedCode =
//       Array.isArray(blog?.codeBlocks) && blog.codeBlocks.length > 0;
//     const hasExplanation = !!blog?.explanation;

//     if (!hasSeparateCode && !hasFencedCode && !hasExplanation) return null;

//     return (
//       <div
//         className="mt-10 p-6 rounded-xl shadow-md border border-gray-200"
//         style={{ background: "#f3f4f6" }} // gray-100 container
//       >
//         <h3 className="text-2xl font-bold mb-4 text-gray-900">Code Example:</h3>

//         {hasSeparateCode && <CodeBlock code={blog.code} />}

//         {hasFencedCode &&
//           blog.codeBlocks.map((block, idx) => (
//             <CodeBlock key={idx} code={block} />
//           ))}

//         {hasExplanation && (
//           <>
//             <h4 className="text-lg font-semibold mb-2">Explanation:</h4>
//             <p className="text-gray-800 whitespace-pre-wrap break-words">
//               {blog.explanation}
//             </p>
//           </>
//         )}
//       </div>
//     );
//   };

//   // Build the correct URL with slug + id
//   const blogPath = (b) =>
//     `/single-blog/${makeSlug(b?.title, b?.slug)}/${b?._id}`;

//   const renderSidebar = () => (
//     <div className="p-4 mt-4 lg:w-80 border border-gray-200 rounded-md overflow-x-hidden">
//       <input
//         type="text"
//         placeholder="Search blogs..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full p-2 border border-gray-300 rounded mb-4"
//       />
//       <h3 className="text-lg font-bold mb-4 border-b text-left">
//         Latest Blogs
//       </h3>
//       <ul className="mb-4">
//         {filteredBlogs
//           .filter((b) => b._id !== blog?._id)
//           .map((b) => {
//             const src = getImageUrl(b.featuredImage);
//             return (
//               <li
//                 key={b._id}
//                 className="flex items-center mb-4 cursor-pointer border-b"
//                 onClick={() => navigate(blogPath(b))}
//               >
//                 {/* ✅ if no image => show icon box */}
//                 {src ? (
//                   <img
//                     src={src}
//                     alt={b.title}
//                     className="w-12 h-12 mr-2 rounded-md object-cover"
//                     onError={(e) => {
//                       e.currentTarget.style.display = "none";
//                       const next = e.currentTarget.nextSibling;
//                       if (next) next.style.display = "flex";
//                     }}
//                   />
//                 ) : null}

//                 {/* fallback icon (hidden if image loads) */}
//                 <ImageFallback
//                   className="w-12 h-12 mr-2 rounded-md"
//                   // if src exists, hide initially (will show only if onError hides img)
//                   // if src missing, show immediately
//                   style={src ? { display: "none" } : undefined}
//                 />

//                 <div className="text-sm break-words">
//                   <Link to={blogPath(b)}>{b.title}</Link>
//                 </div>
//               </li>
//             );
//           })}
//       </ul>
//       <h3 className="text-lg font-bold mb-2 border-b text-left">Category</h3>
//       <p className="mb-4 break-words">{blog?.category}</p>
//       <h3 className="text-lg font-bold mb-2 border-b text-left">Tags</h3>
//       <div className="flex flex-wrap">
//         {toTagArray(blog?.tags).map((tag, i) => (
//           <span
//             key={i}
//             className="bg-gray-200 text-gray-700 text-xs px-2 py-1 mr-2 mb-2 rounded"
//           >
//             {tag}
//           </span>
//         ))}
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto p-4">
//         <p className="text-center text-gray-600">Loading…</p>
//       </div>
//     );
//   }

//   if (fetchErr || !blog) {
//     return (
//       <div className="max-w-7xl mx-auto p-4">
//         <p className="text-center text-red-600">{fetchErr || "Not found."}</p>
//       </div>
//     );
//   }

//   const mainSrc = getImageUrl(blog.featuredImage);

//   return (
//     <motion.div
//       className="max-w-7xl mx-auto p-4 border-b overflow-x-hidden" // ⬅️ no horizontal scroll
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="flex justify-between items-center mb-2">
//         <h1 className="text-3xl font-bold break-words">{blog.title}</h1>
//         <div className="flex space-x-2">
//           <FaTh
//             onClick={() => setView("wide")}
//             className={`cursor-pointer ${
//               view === "wide" ? "text-blue-500" : "text-gray-500"
//             }`}
//           />
//           <FaAlignLeft
//             onClick={() => setView("left-sidebar")}
//             className={`cursor-pointer ${
//               view === "left-sidebar" ? "text-blue-500" : "text-gray-500"
//             }`}
//           />
//           <FaAlignRight
//             onClick={() => setView("right-sidebar")}
//             className={`cursor-pointer ${
//               view === "right-sidebar" ? "text-blue-500" : "text-gray-500"
//             }`}
//           />
//         </div>
//       </div>

//       <p className="text-gray-600 mb-4 text-left">
//         Published on{" "}
//         {blog?.publishedDate
//           ? new Date(blog.publishedDate).toLocaleDateString()
//           : "—"}
//       </p>

//       <div className="flex lg:flex-row flex-col">
//         {view === "left-sidebar" && (
//           <div className="lg:w-1/4 w-full lg:mr-8 mb-8">{renderSidebar()}</div>
//         )}

//         <div className="flex-1 p-3 overflow-x-hidden">
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.4 }}
//             className="w-full mb-8"
//           >
//             {/* ✅ if no image => show placeholder */}
//             {mainSrc ? (
//               <>
//                 <img
//                   src={mainSrc}
//                   alt={blog.title}
//                   className="w-full max-h-[500px] object-cover rounded-xl shadow-md max-w-full"
//                   onError={(e) => {
//                     e.currentTarget.style.display = "none";
//                     const next = e.currentTarget.nextSibling;
//                     if (next) next.style.display = "flex";
//                   }}
//                 />
//                 <ImageFallback
//                   className="w-full max-h-[500px] rounded-xl shadow-md"
//                   style={{ display: "none" }}
//                 />
//               </>
//             ) : (
//               <ImageFallback className="w-full h-[320px] rounded-xl shadow-md" />
//             )}
//           </motion.div>

//           <div className="p-3 w-full whitespace-pre-wrap break-words overflow-x-hidden">
//             {renderDescription()}
//             {renderCodeAndExplanation()}
//           </div>

//           <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
//             <button
//               onClick={() => prevNext.prev && navigate(blogPath(prevNext.prev))}
//               className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center shadow disabled:opacity-50"
//               disabled={!prevNext.prev}
//             >
//               <FaArrowLeft className="mr-2" />
//               <span className="text-sm font-medium text-left break-words">
//                 {prevNext.prev?.title || "Previous"}
//               </span>
//             </button>

//             <button
//               onClick={() => prevNext.next && navigate(blogPath(prevNext.next))}
//               className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center shadow disabled:opacity-50"
//               disabled={!prevNext.next}
//             >
//               <span className="text-sm font-medium text-right break-words">
//                 {prevNext.next?.title || "Next"}
//               </span>
//               <FaArrowRight className="ml-2" />
//             </button>
//           </div>
//         </div>

//         {view === "right-sidebar" && (
//           <div className="lg:w-1/4 w-full lg:ml-8 mb-8">{renderSidebar()}</div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default Blog;

//

// ✅ file: src/pages/blog_pages/Blog.jsx
// ✅ ONLY UI redesign (NO logic/feature changes)
// ✅ Orange theme applied everywhere (accents, borders, buttons, tags, focus rings)
// ✅ Keeps your layout modes, sidebar, prev/next, image fallbacks, code blocks, etc.

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FaTh,
  FaAlignLeft,
  FaAlignRight,
  FaArrowLeft,
  FaArrowRight,
  FaRegImage,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

// Safe client-side slug fallback (in case server didn't send blog.slug)
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

const Blog = () => {
  // route: /single-blog/:slug/:id
  const { slug, id } = useParams();
  const navigate = useNavigate();

  const [view, setView] = useState("right-sidebar");
  const [searchTerm, setSearchTerm] = useState("");

  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState("");

  // --- helpers ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    try {
      const pathStr = String(imagePath);
      if (/^https?:\/\//i.test(pathStr)) return pathStr;
      const normalized = pathStr.replace(/\\/g, "/");
      const tail = normalized.split("uploads/").pop();
      if (!tail) return "";
      return `${globalBackendRoute}/uploads/${tail}`;
    } catch {
      return "";
    }
  };

  const toTagArray = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    return String(tags)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  // Extract ```fenced code``` blocks (optional, in case body still includes code)
  const extractCodeBlocks = (bodyText) => {
    if (!bodyText) return { cleanedBody: "", codeBlocks: [] };
    const text = String(bodyText);
    const codeBlocks = [];
    const regex = /```(?:\w+)?\n([\s\S]*?)```/g;
    let cleaned = text;
    let m;
    while ((m = regex.exec(text)) !== null) {
      codeBlocks.push(m[1].trim());
    }
    cleaned = cleaned.replace(regex, "").trim();
    return { cleanedBody: cleaned, codeBlocks };
  };

  // Turn remaining body into Q/A sections (your original UX)
  const preprocessBody = (text) => {
    if (!text) return [];
    const paragraphs = String(text).split("\n");
    const sections = [];
    let current = [];
    paragraphs.forEach((p) => {
      const trimmed = p.trim();
      if (!trimmed) return;
      if (trimmed.endsWith("?")) {
        if (current.length) sections.push(current);
        current = [{ type: "question", text: trimmed }];
      } else if (current.length > 0 && current[0].type === "question") {
        sections.push([{ type: "answer", text: trimmed }]);
        current = [];
      } else {
        current.push({ type: "text", text: trimmed });
      }
    });
    if (current.length) sections.push(current);
    return sections;
  };

  // --- fetch single blog (by id; slug is just for the URL) ---
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setFetchErr("");
      try {
        const { data } = await axios.get(
          `${globalBackendRoute}/api/single-blogs/${id}`
        );
        if (cancelled) return;

        const { cleanedBody, codeBlocks } = extractCodeBlocks(data?.body || "");
        const processed = preprocessBody(cleanedBody);

        setBlog({
          ...data,
          processedBody: processed,
          codeBlocks,
          tags: toTagArray(data?.tags),
          code: data?.code || "",
          explanation: data?.explanation || "",
        });
      } catch (err) {
        console.error("Error fetching blog:", err?.response || err?.message);
        if (!cancelled) setFetchErr("Failed to load blog. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // --- fetch all blogs for sidebar + prev/next ---
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get(`${globalBackendRoute}/api/all-blogs`);
        if (cancelled) return;
        const normalized = Array.isArray(data)
          ? data.map((b) => ({ ...b, tags: toTagArray(b?.tags) }))
          : [];
        setAllBlogs(normalized);
        setFilteredBlogs(normalized);
      } catch (err) {
        console.error("Error fetching all blogs:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // --- filter sidebar by title ---
  useEffect(() => {
    if (!searchTerm) {
      setFilteredBlogs(allBlogs);
      return;
    }
    const term = searchTerm.toLowerCase();
    setFilteredBlogs(
      allBlogs.filter((b) => (b?.title || "").toLowerCase().includes(term))
    );
  }, [searchTerm, allBlogs]);

  // --- prev/next ---
  const prevNext = useMemo(() => {
    if (!blog || allBlogs.length === 0) return { prev: null, next: null };
    const idx = allBlogs.findIndex((b) => b._id === blog._id);
    if (idx === -1) return { prev: null, next: null };
    const prevIndex = idx === 0 ? allBlogs.length - 1 : idx - 1;
    const nextIndex = idx === allBlogs.length - 1 ? 0 : idx + 1;
    return { prev: allBlogs[prevIndex], next: allBlogs[nextIndex] };
  }, [blog, allBlogs]);

  const renderDescription = () =>
    blog?.processedBody?.map((section, idx) => (
      <div key={idx} className="mb-8">
        {section.map((item, i) =>
          item.type === "question" ? (
            <p
              key={i}
              className="font-bold text-lg mb-4 mt-6 break-words text-gray-900"
            >
              {item.text}
            </p>
          ) : item.type === "answer" ? (
            <blockquote
              key={i}
              className="border-l-4 border-orange-500 pl-4 text-gray-700 italic mb-6 break-words bg-orange-50/60 rounded-r-lg py-2"
            >
              {item.text}
            </blockquote>
          ) : (
            <p key={i} className="text-gray-800 text-lg mb-4 break-words">
              {item.text}
            </p>
          )
        )}
      </div>
    ));

  // DIV-based code block (orange theme, wraps — no horizontal scroll)
  const CodeBlock = ({ code }) => (
    <div
      className="rounded-xl mb-4 border border-orange-200 shadow-sm"
      style={{
        background: "#fff7ed", // orange-50
        color: "#111827",
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: "0.875rem",
        lineHeight: 1.5,
        padding: "1rem",
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      {code}
    </div>
  );

  const renderCodeAndExplanation = () => {
    const hasSeparateCode = !!blog?.code;
    const hasFencedCode =
      Array.isArray(blog?.codeBlocks) && blog.codeBlocks.length > 0;
    const hasExplanation = !!blog?.explanation;

    if (!hasSeparateCode && !hasFencedCode && !hasExplanation) return null;

    return (
      <div className="mt-10 p-6 rounded-2xl shadow-sm border border-orange-200 bg-orange-50">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-2xl font-bold text-gray-900">Code Example</h3>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
            Orange Theme
          </span>
        </div>

        {hasSeparateCode && <CodeBlock code={blog.code} />}

        {hasFencedCode &&
          blog.codeBlocks.map((block, idx) => (
            <CodeBlock key={idx} code={block} />
          ))}

        {hasExplanation && (
          <>
            <h4 className="text-lg font-semibold mb-2 text-gray-900">
              Explanation
            </h4>
            <p className="text-gray-800 whitespace-pre-wrap break-words">
              {blog.explanation}
            </p>
          </>
        )}
      </div>
    );
  };

  // Build the correct URL with slug + id
  const blogPath = (b) =>
    `/single-blog/${makeSlug(b?.title, b?.slug)}/${b?._id}`;

  const renderSidebar = () => (
    <div className="p-4 mt-4 lg:w-80 border border-orange-200 rounded-2xl overflow-x-hidden bg-white shadow-sm">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2.5 border border-orange-200 rounded-xl bg-orange-50/40 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
        />
      </div>

      <h3 className="text-lg font-bold mb-4 border-b border-orange-100 text-left pb-2 text-gray-900">
        Latest Blogs
      </h3>

      <ul className="mb-4">
        {filteredBlogs
          .filter((b) => b._id !== blog?._id)
          .map((b) => {
            const src = getImageUrl(b.featuredImage);
            return (
              <li
                key={b._id}
                className="flex items-center mb-4 cursor-pointer border-b border-orange-100 pb-3 hover:bg-orange-50/60 rounded-xl px-2 transition-colors"
                onClick={() => navigate(blogPath(b))}
              >
                {src ? (
                  <img
                    src={src}
                    alt={b.title}
                    className="w-12 h-12 mr-2 rounded-xl object-cover border border-orange-100"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const next = e.currentTarget.nextSibling;
                      if (next) next.style.display = "flex";
                    }}
                  />
                ) : null}

                <ImageFallback
                  className="w-12 h-12 mr-2 rounded-xl border border-orange-100"
                  style={src ? { display: "none" } : undefined}
                />

                <div className="text-sm break-words">
                  <Link
                    to={blogPath(b)}
                    className="text-gray-800 hover:text-orange-600 font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {b.title}
                  </Link>
                </div>
              </li>
            );
          })}
      </ul>

      <h3 className="text-lg font-bold mb-2 border-b border-orange-100 text-left pb-2 text-gray-900">
        Category
      </h3>
      <p className="mb-4 break-words text-gray-700">{blog?.category}</p>

      <h3 className="text-lg font-bold mb-2 border-b border-orange-100 text-left pb-2 text-gray-900">
        Tags
      </h3>

      <div className="flex flex-wrap">
        {toTagArray(blog?.tags).map((tag, i) => (
          <span
            key={i}
            className="bg-orange-50 text-orange-700 text-xs px-2.5 py-1 mr-2 mb-2 rounded-full border border-orange-200"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-8">
          <p className="text-center text-orange-700 font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  if (fetchErr || !blog) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <p className="text-center text-red-700 font-medium">
            {fetchErr || "Not found."}
          </p>
        </div>
      </div>
    );
  }

  const mainSrc = getImageUrl(blog.featuredImage);

  return (
    <motion.div
      className="max-w-7xl mx-auto p-4 border-b border-orange-100 overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3 gap-3">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold break-words text-gray-900">
            {blog.title}
          </h1>
          <div className="mt-1 inline-flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
              Blog
            </span>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex space-x-2 shrink-0 bg-white border border-orange-200 rounded-xl p-2 shadow-sm">
          <FaTh
            onClick={() => setView("wide")}
            className={`cursor-pointer transition-colors ${
              view === "wide" ? "text-orange-600" : "text-gray-400"
            } hover:text-orange-600`}
            title="Wide"
          />
          <FaAlignLeft
            onClick={() => setView("left-sidebar")}
            className={`cursor-pointer transition-colors ${
              view === "left-sidebar" ? "text-orange-600" : "text-gray-400"
            } hover:text-orange-600`}
            title="Left sidebar"
          />
          <FaAlignRight
            onClick={() => setView("right-sidebar")}
            className={`cursor-pointer transition-colors ${
              view === "right-sidebar" ? "text-orange-600" : "text-gray-400"
            } hover:text-orange-600`}
            title="Right sidebar"
          />
        </div>
      </div>

      <p className="text-gray-600 mb-4 text-left">
        Published on{" "}
        <span className="text-gray-800 font-medium">
          {blog?.publishedDate
            ? new Date(blog.publishedDate).toLocaleDateString()
            : "—"}
        </span>
      </p>

      <div className="flex lg:flex-row flex-col">
        {view === "left-sidebar" && (
          <div className="lg:w-1/4 w-full lg:mr-8 mb-8">{renderSidebar()}</div>
        )}

        {/* Main */}
        <div className="flex-1 p-3 overflow-x-hidden">
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="w-full mb-8"
          >
            {mainSrc ? (
              <>
                <img
                  src={mainSrc}
                  alt={blog.title}
                  className="w-full max-h-[500px] object-cover rounded-2xl shadow-sm max-w-full border border-orange-100"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const next = e.currentTarget.nextSibling;
                    if (next) next.style.display = "flex";
                  }}
                />
                <ImageFallback
                  className="w-full max-h-[500px] rounded-2xl shadow-sm border border-orange-100"
                  style={{ display: "none" }}
                />
              </>
            ) : (
              <ImageFallback className="w-full h-[320px] rounded-2xl shadow-sm border border-orange-100" />
            )}
          </motion.div>

          {/* Content */}
          <div className="p-4 w-full whitespace-pre-wrap break-words overflow-x-hidden bg-white rounded-2xl border border-orange-100 shadow-sm">
            {renderDescription()}
            {renderCodeAndExplanation()}
          </div>

          {/* Prev / Next */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
            <button
              onClick={() => prevNext.prev && navigate(blogPath(prevNext.prev))}
              className="px-5 py-3 bg-orange-50 hover:bg-orange-100 text-orange-800 rounded-2xl flex items-center border border-orange-200 shadow-sm disabled:opacity-50 disabled:hover:bg-orange-50 transition-colors w-full sm:w-auto"
              disabled={!prevNext.prev}
            >
              <FaArrowLeft className="mr-2" />
              <span className="text-sm font-semibold text-left break-words">
                {prevNext.prev?.title || "Previous"}
              </span>
            </button>

            <button
              onClick={() => prevNext.next && navigate(blogPath(prevNext.next))}
              className="px-5 py-3 bg-orange-50 hover:bg-orange-100 text-orange-800 rounded-2xl flex items-center border border-orange-200 shadow-sm disabled:opacity-50 disabled:hover:bg-orange-50 transition-colors w-full sm:w-auto"
              disabled={!prevNext.next}
            >
              <span className="text-sm font-semibold text-right break-words">
                {prevNext.next?.title || "Next"}
              </span>
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>

        {view === "right-sidebar" && (
          <div className="lg:w-1/4 w-full lg:ml-8 mb-8">{renderSidebar()}</div>
        )}
      </div>
    </motion.div>
  );
};

export default Blog;
