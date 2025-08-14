// import React from "react";
// import Breadcrumb from "../../components/common_components/Breadcrumb";

// const AllBlogs = () => {
//   return (
//     <div>
//       <div className="blogs_header_section">
//         <Breadcrumb pageTitle="Blog" />
//       </div>
//     </div>
//   );
// };

// export default AllBlogs;

//
//
//

// with images.

//
//
//

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   FaThList,
//   FaThLarge,
//   FaTh,
//   FaArrowLeft,
//   FaArrowRight,
//   FaCalendar,
//   FaTags,
//   FaUser,
//   FaBookOpen,
//   FaBook,
//   FaBlog,
//   FaFileAlt,
// } from "react-icons/fa";
// import { motion } from "framer-motion";
// import axios from "axios";
// import Breadcrumb from "../../components/common_components/Breadcrumb";
// import globalBackendRoute from "../../config/Config";

// const AllBlogs = () => {
//   const [view, setView] = useState("grid");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [blogs, setBlogs] = useState([]);
//   const [filteredBlogs, setFilteredBlogs] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response = await axios.get(`${globalBackendRoute}/api/all-blogs`);
//         setBlogs(response.data);
//         setFilteredBlogs(response.data);
//       } catch (error) {
//         console.error("Error fetching blogs:", error);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   const handleSearch = (event) => {
//     const value = event.target.value.toLowerCase();
//     setSearchTerm(value);

//     const filtered = blogs.filter((blog) => {
//       const titleMatch = blog.title?.toLowerCase().includes(value);
//       const authorMatch = blog.author?.name?.toLowerCase().includes(value);
//       const categoryMatch = blog.category?.toLowerCase().includes(value);
//       const tagsMatch = blog.tags?.some((tag) =>
//         tag.toLowerCase().includes(value)
//       );
//       return titleMatch || authorMatch || categoryMatch || tagsMatch;
//     });

//     setFilteredBlogs(filtered);
//     setCurrentPage(1);
//   };

//   const itemsPerPage = 6;
//   const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
//   const paginatedBlogs = filteredBlogs.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const goToNextPage = () => {
//     setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
//   };

//   const goToPreviousPage = () => {
//     setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
//   };

//   const iconStyle = {
//     list: view === "list" ? "text-blue-500" : "text-gray-500",
//     grid: view === "grid" ? "text-green-500" : "text-gray-500",
//     card: view === "card" ? "text-purple-500" : "text-gray-500",
//   };

//   const getImageUrl = (imagePath) => {
//     if (imagePath) {
//       const normalizedPath = imagePath
//         .replace(/\\/g, "/")
//         .split("uploads/")
//         .pop();
//       return `${globalBackendRoute}/uploads/${normalizedPath}`;
//     }
//     return "https://via.placeholder.com/150";
//   };

//   return (
//     <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//       <Breadcrumb pageTitle="Blog" />

//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <FaBlog /> Blogs
//         </h2>
//         <div className="flex space-x-4 items-center">
//           <input
//             type="text"
//             placeholder="Search blogs..."
//             value={searchTerm}
//             onChange={handleSearch}
//             className="w-64 rounded-md border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           />
//           <FaThList
//             className={`cursor-pointer ${iconStyle.list}`}
//             onClick={() => setView("list")}
//           />
//           <FaTh
//             className={`cursor-pointer ${iconStyle.card}`}
//             onClick={() => setView("card")}
//           />
//           <FaThLarge
//             className={`cursor-pointer ${iconStyle.grid}`}
//             onClick={() => setView("grid")}
//           />
//         </div>
//       </div>

//       <motion.div
//         className={`grid gap-6 ${
//           view === "list"
//             ? "grid-cols-1"
//             : view === "grid"
//             ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//             : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
//         }`}
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         {paginatedBlogs.map((blog) => (
//           <Link key={blog._id} to={`/single-blog/${blog._id}`}>
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className={`border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden ${
//                 view === "list" ? "flex items-center p-4" : ""
//               }`}
//             >
//               <img
//                 src={getImageUrl(blog.featuredImage)}
//                 alt={blog.title}
//                 className={`${
//                   view === "list"
//                     ? "w-24 h-24 object-cover mr-4"
//                     : "w-full h-48 object-cover mb-4"
//                 }`}
//               />
//               <div className={`${view === "list" ? "flex-1" : "p-4"}`}>
//                 <h3 className="text-lg font-bold text-gray-900 mb-2">
//                   {blog.title}
//                 </h3>
//                 <p className="text-sm text-gray-600 mb-2 flex items-center">
//                   <FaCalendar className="mr-1 text-yellow-500" />{" "}
//                   {new Date(blog.publishedDate).toLocaleDateString()}
//                 </p>
//                 <p className="text-sm text-gray-600 mb-2 flex items-center">
//                   <FaUser className="mr-1 text-red-500" /> {blog.author.name}
//                 </p>
//                 <p className="text-sm text-gray-600 mb-2 flex items-center">
//                   <FaTags className="mr-1 text-green-500" />{" "}
//                   {blog.tags.join(", ")}
//                 </p>
//                 {view !== "list" && (
//                   <p className="text-gray-700">{blog.summary}</p>
//                 )}
//               </div>
//             </motion.div>
//           </Link>
//         ))}
//       </motion.div>

//       {filteredBlogs.length === 0 && (
//         <p className="text-center text-gray-600 mt-6">No blogs found.</p>
//       )}

//       <div className="flex justify-between items-center mt-8">
//         <button
//           onClick={goToPreviousPage}
//           disabled={currentPage === 1}
//           className={`flex items-center space-x-2 px-4 py-2 rounded-md text-white ${
//             currentPage === 1
//               ? "bg-gray-300"
//               : "bg-indigo-600 hover:bg-indigo-500"
//           }`}
//         >
//           <FaArrowLeft />
//           <span>Previous</span>
//         </button>
//         <span className="text-gray-700">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={goToNextPage}
//           disabled={currentPage === totalPages}
//           className={`flex items-center space-x-2 px-4 py-2 rounded-md text-white ${
//             currentPage === totalPages
//               ? "bg-gray-300"
//               : "bg-indigo-600 hover:bg-indigo-500"
//           }`}
//         >
//           <span>Next</span>
//           <FaArrowRight />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AllBlogs;

//
//
//

// with icons.

//
//
//

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   FaThList,
//   FaThLarge,
//   FaTh,
//   FaArrowLeft,
//   FaArrowRight,
//   FaCalendar,
//   FaTags,
//   FaUser,
//   FaBlog,
//   FaFileAlt,
// } from "react-icons/fa";
// import { motion } from "framer-motion";
// import Breadcrumb from "../../components/common_components/Breadcrumb";

//
//
//
// // Dummy data image version.
//
//
//

//
// const dummyBlogs = [
//   {
//     _id: "1",
//     title: "Master React in 30 Days",
//     author: { name: "Alice" },
//     publishedDate: new Date(),
//     category: "Web Development",
//     tags: ["React", "JavaScript"],
//     summary: "Learn React with practical projects and exercises.",
//     featuredImage: "https://source.unsplash.com/random/800x600?react",
//   },
//   {
//     _id: "2",
//     title: "JavaScript ES6 Deep Dive",
//     author: { name: "Bob" },
//     publishedDate: new Date(),
//     category: "JavaScript",
//     tags: ["ES6", "Variables", "Promises"],
//     summary: "Master ES6 features with examples and use cases.",
//     featuredImage: "https://source.unsplash.com/random/800x600?javascript",
//   },
//   {
//     _id: "3",
//     title: "Getting Started with Python",
//     author: { name: "Charlie" },
//     publishedDate: new Date(),
//     category: "Python",
//     tags: ["Python", "Beginner"],
//     summary: "A beginner-friendly guide to learning Python.",
//     featuredImage: "https://source.unsplash.com/random/800x600?python",
//   },
//   {
//     _id: "4",
//     title: "DevOps for Beginners",
//     author: { name: "Dave" },
//     publishedDate: new Date(),
//     category: "DevOps",
//     tags: ["CI/CD", "Docker", "Jenkins"],
//     summary: "Understand the basics of CI/CD, Docker, and pipelines.",
//     featuredImage: "https://source.unsplash.com/random/800x600?devops",
//   },
//   {
//     _id: "5",
//     title: "Mastering MongoDB",
//     author: { name: "Eve" },
//     publishedDate: new Date(),
//     category: "Database",
//     tags: ["MongoDB", "NoSQL"],
//     summary: "Everything you need to know about MongoDB.",
//     featuredImage: "https://source.unsplash.com/random/800x600?mongodb",
//   },
//   {
//     _id: "6",
//     title: "Automation with Selenium",
//     author: { name: "Frank" },
//     publishedDate: new Date(),
//     category: "Testing",
//     tags: ["Selenium", "Java"],
//     summary: "Automate browser testing with Selenium and Java.",
//     featuredImage: "https://source.unsplash.com/random/800x600?selenium",
//   },
// ];

// const AllBlogs = () => {
//   const [view, setView] = useState("grid");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredBlogs, setFilteredBlogs] = useState(dummyBlogs);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     setFilteredBlogs(dummyBlogs);
//   }, []);

//   const handleSearch = (event) => {
//     const value = event.target.value.toLowerCase();
//     setSearchTerm(value);

//     const filtered = dummyBlogs.filter((blog) => {
//       const titleMatch = blog.title?.toLowerCase().includes(value);
//       const authorMatch = blog.author?.name?.toLowerCase().includes(value);
//       const categoryMatch = blog.category?.toLowerCase().includes(value);
//       const tagsMatch = blog.tags?.some((tag) =>
//         tag.toLowerCase().includes(value)
//       );
//       return titleMatch || authorMatch || categoryMatch || tagsMatch;
//     });

//     setFilteredBlogs(filtered);
//     setCurrentPage(1);
//   };

//   const itemsPerPage = 3;
//   const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
//   const paginatedBlogs = filteredBlogs.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const goToNextPage = () => {
//     setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
//   };

//   const goToPreviousPage = () => {
//     setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
//   };

//   const iconStyle = {
//     list: view === "list" ? "text-blue-500" : "text-gray-500",
//     grid: view === "grid" ? "text-green-500" : "text-gray-500",
//     card: view === "card" ? "text-purple-500" : "text-gray-500",
//   };

//   return (
//     <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//       <Breadcrumb pageTitle="Blog" />

//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <FaBlog /> Blogs
//         </h2>
//         <div className="flex space-x-4 items-center">
//           <input
//             type="text"
//             placeholder="Search blogs..."
//             value={searchTerm}
//             onChange={handleSearch}
//             className="w-64 rounded-md border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           />
//           <FaThList
//             className={`cursor-pointer ${iconStyle.list}`}
//             onClick={() => setView("list")}
//           />
//           <FaTh
//             className={`cursor-pointer ${iconStyle.card}`}
//             onClick={() => setView("card")}
//           />
//           <FaThLarge
//             className={`cursor-pointer ${iconStyle.grid}`}
//             onClick={() => setView("grid")}
//           />
//         </div>
//       </div>

//       <motion.div
//         className={`grid gap-6 ${
//           view === "list"
//             ? "grid-cols-1"
//             : view === "grid"
//             ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//             : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
//         }`}
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         {paginatedBlogs.map((blog) => (
//           <Link key={blog._id} to={`/single-blog/${blog._id}`}>
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className={`border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden ${
//                 view === "list" ? "flex items-center p-4" : ""
//               }`}
//             >
//               {view === "list" ? (
//                 <div className="mr-4 text-4xl text-indigo-600">
//                   <FaFileAlt />
//                 </div>
//               ) : (
//                 <img
//                   src={blog.featuredImage}
//                   alt={blog.title}
//                   className="w-full h-48 object-cover"
//                 />
//               )}
//               <div className={`${view === "list" ? "flex-1" : "p-4"}`}>
//                 <h3 className="text-lg font-bold text-gray-900 mb-2">
//                   {blog.title}
//                 </h3>
//                 <p className="text-sm text-gray-600 mb-2 flex items-center">
//                   <FaCalendar className="mr-1 text-yellow-500" />{" "}
//                   {new Date(blog.publishedDate).toLocaleDateString()}
//                 </p>
//                 <p className="text-sm text-gray-600 mb-2 flex items-center">
//                   <FaUser className="mr-1 text-red-500" /> {blog.author.name}
//                 </p>
//                 <p className="text-sm text-gray-600 mb-2 flex items-center">
//                   <FaTags className="mr-1 text-green-500" />{" "}
//                   {blog.tags.join(", ")}
//                 </p>
//                 {view !== "list" && (
//                   <p className="text-gray-700">{blog.summary}</p>
//                 )}
//               </div>
//             </motion.div>
//           </Link>
//         ))}
//       </motion.div>

//       {filteredBlogs.length === 0 && (
//         <p className="text-center text-gray-600 mt-6">No blogs found.</p>
//       )}

//       <div className="flex justify-between items-center mt-8">
//         <button
//           onClick={goToPreviousPage}
//           disabled={currentPage === 1}
//           className={`flex items-center space-x-2 px-4 py-2 rounded-md text-white ${
//             currentPage === 1
//               ? "bg-gray-300"
//               : "bg-indigo-600 hover:bg-indigo-500"
//           }`}
//         >
//           <FaArrowLeft />
//           <span>Previous</span>
//         </button>
//         <span className="text-gray-700">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={goToNextPage}
//           disabled={currentPage === totalPages}
//           className={`flex items-center space-x-2 px-4 py-2 rounded-md text-white ${
//             currentPage === totalPages
//               ? "bg-gray-300"
//               : "bg-indigo-600 hover:bg-indigo-500"
//           }`}
//         >
//           <span>Next</span>
//           <FaArrowRight />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AllBlogs;

//
//
//
//
//
// icons version of blogs.

//
//

//
//

import React from "react";
import Breadcrumb from "../../components/common_components/Breadcrumb";
import Blogs from "../../components/blog_components/Blogs";

const AllBlogs = () => {
  return (
    <div>
      <div className="blog_header_section">
        <Breadcrumb pageTitle="Blogs" />
        <Blogs />
      </div>
    </div>
  );
};

export default AllBlogs;
