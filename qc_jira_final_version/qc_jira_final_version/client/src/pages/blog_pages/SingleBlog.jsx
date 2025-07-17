import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaTh,
  FaAlignLeft,
  FaAlignRight,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const SingleBlog = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null); // State to hold the single blog data
  const [relatedBlogs, setRelatedBlogs] = useState([]); // State for related blogs
  const [filteredBlogs, setFilteredBlogs] = useState([]); // State for filtered blogs (search)
  const [view, setView] = useState("right-sidebar"); // Set initial view to "right-sidebar"
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/single-blogs/${id}`
        );
        setBlog(response.data);
      } catch (error) {
        console.error(
          "Error fetching the blog:",
          error.response || error.message
        );
      }
    };

    fetchBlog();
  }, [id]);

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/all-blogs");
        setRelatedBlogs(response.data);
        setFilteredBlogs(response.data);
      } catch (error) {
        console.error("Error fetching related blogs:", error);
      }
    };

    fetchRelatedBlogs();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = relatedBlogs.filter((b) =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    } else {
      setFilteredBlogs(relatedBlogs);
    }
  }, [searchTerm, relatedBlogs]);

  const navigateToBlog = (id) => {
    navigate(`/single-blog/${id}`);
  };

  const renderSidebar = () => (
    <div className="p-4 mt-4 lg:w-80 border border-gray-200 rounded-md">
      {/* Search Field */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Other Posts */}
      <h3 className="text-lg font-bold mb-4 text-left border-b">
        Latest Blogs
      </h3>
      <ul className="mb-4">
        {filteredBlogs
          .filter((relatedBlog) => relatedBlog._id !== blog?._id) // Exclude the current blog
          .map((relatedBlog) => (
            <li
              key={relatedBlog._id}
              className="flex items-center mb-4 cursor-pointer border-b"
              onClick={() => navigateToBlog(relatedBlog._id)}
            >
              <img
                src={
                  relatedBlog.featuredImage || "https://via.placeholder.com/100"
                }
                alt={relatedBlog.title}
                className="w-12 h-12 mr-2 rounded-md"
              />
              <div className="text-sm">
                <Link to={`/single-blog/${relatedBlog._id}`}>
                  {relatedBlog.title}
                </Link>
              </div>
            </li>
          ))}
      </ul>

      {/* Categories Section */}
      <h3 className="text-lg font-bold mb-2 text-left border-b">Categories</h3>
      <ul className="mb-4">
        {blog && blog.category && (
          <li key={blog.category} className="mb-2 text-left">
            {blog.category}
          </li>
        )}
      </ul>

      {/* Tags Section */}
      <h3 className="text-lg font-bold mb-2 text-left border-b">Tags</h3>
      <div className="flex flex-wrap">
        {blog &&
          blog.tags &&
          blog.tags.map((tag, index) => (
            <button
              key={index}
              className="text-xs bg-gray-200 text-gray-700 p-2 mr-2 mb-2 rounded"
            >
              {tag}
            </button>
          ))}
      </div>
    </div>
  );

  const handlePreviousNextNavigation = (direction) => {
    const currentIndex = relatedBlogs.findIndex((b) => b._id === blog?._id);

    if (direction === "previous") {
      const previousIndex =
        currentIndex === 0 ? relatedBlogs.length - 1 : currentIndex - 1;
      navigateToBlog(relatedBlogs[previousIndex]._id);
    } else if (direction === "next") {
      const nextIndex =
        currentIndex === relatedBlogs.length - 1 ? 0 : currentIndex + 1;
      navigateToBlog(relatedBlogs[nextIndex]._id);
    }
  };

  if (!blog) return <div>Loading...</div>; // Show loading state

  return (
    <motion.div
      className="max-w-7xl mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">{blog.title}</h1>
        <div className="flex space-x-2">
          <FaTh
            className={`cursor-pointer ${
              view === "wide" ? "text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setView("wide")}
          />
          <FaAlignLeft
            className={`cursor-pointer ${
              view === "left-sidebar" ? "text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setView("left-sidebar")}
          />
          <FaAlignRight
            className={`cursor-pointer ${
              view === "right-sidebar" ? "text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setView("right-sidebar")}
          />
        </div>
      </div>
      <p className="text-gray-600 mb-4 text-left">{`Published on ${new Date(
        blog.publishedDate
      ).toLocaleDateString()}`}</p>

      <div className="flex lg:flex-row flex-col">
        {/* Sidebar on the left for "left-sidebar" view */}
        {view === "left-sidebar" && (
          <>
            <div className="lg:w-1/4 w-full lg:mr-8 mb-8 lg:mb-0 order-1">
              {renderSidebar()}
            </div>
            <div className="flex-1 lg:order-2 order-2">
              <motion.img
                src={
                  blog.featuredImage
                    ? `http://localhost:5000/${blog.featuredImage.replace(
                        /\\/g,
                        "/"
                      )}`
                    : "https://via.placeholder.com/800x400"
                }
                alt={blog.title}
                className="w-full h-auto p-4 object-cover rounded-5xl"
                style={{ borderRadius: "30px" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              <div className="text-lg text-gray-800 mb-8 text-left p-5">
                {blog.body}
              </div>
              <motion.div
                className="flex justify-center space-x-4 items-center mt-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handlePreviousNextNavigation("previous")}
                >
                  <FaArrowLeft className="text-gray-500 hover:text-blue-500" />
                  <span className="ml-2 text-gray-700">Previous</span>
                </div>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handlePreviousNextNavigation("next")}
                >
                  <span className="mr-2 text-gray-700">Next</span>
                  <FaArrowRight className="text-gray-500 hover:text-blue-500" />
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Sidebar on the right for "right-sidebar" view */}
        {view === "right-sidebar" && (
          <>
            <div className="flex-1 lg:order-1 order-2">
              <motion.img
                src={
                  blog.featuredImage
                    ? `http://localhost:5000/${blog.featuredImage.replace(
                        /\\/g,
                        "/"
                      )}`
                    : "https://via.placeholder.com/800x400"
                }
                alt={blog.title}
                className="w-full h-auto p-4 object-cover rounded-5xl"
                style={{ borderRadius: "30px" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              <div className="text-lg text-gray-800 mb-8 text-left p-5">
                {blog.body}
              </div>
              <motion.div
                className="flex justify-center space-x-4 items-center mt-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handlePreviousNextNavigation("previous")}
                >
                  <FaArrowLeft className="text-gray-500 hover:text-blue-500" />
                  <span className="ml-2 text-gray-700">Previous</span>
                </div>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handlePreviousNextNavigation("next")}
                >
                  <span className="mr-2 text-gray-700">Next</span>
                  <FaArrowRight className="text-gray-500 hover:text-blue-500" />
                </div>
              </motion.div>
            </div>
            <div className="lg:w-1/4 w-full lg:ml-8 mb-8 lg:mb-0 order-2 lg:order-3">
              {renderSidebar()}
            </div>
          </>
        )}

        {/* Center content for "wide" view */}
        {view === "wide" && (
          <div className="flex-1">
            <motion.img
              src={
                blog.featuredImage
                  ? `http://localhost:5000/${blog.featuredImage.replace(
                      /\\/g,
                      "/"
                    )}`
                  : "https://via.placeholder.com/800x400"
              }
              alt={blog.title}
              className="w-full h-auto p-4 object-cover rounded-5xl"
              style={{ borderRadius: "30px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />

            <div className="text-lg text-gray-800 mb-8 text-left p-5">
              {blog.body}
            </div>
            <motion.div
              className="flex justify-center space-x-4 items-center mt-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="flex items-center cursor-pointer"
                onClick={() => handlePreviousNextNavigation("previous")}
              >
                <FaArrowLeft className="text-gray-500 hover:text-blue-500" />
                <span className="ml-2 text-gray-700">Previous</span>
              </div>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => handlePreviousNextNavigation("next")}
              >
                <span className="mr-2 text-gray-700">Next</span>
                <FaArrowRight className="text-gray-500 hover:text-blue-500" />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SingleBlog;
