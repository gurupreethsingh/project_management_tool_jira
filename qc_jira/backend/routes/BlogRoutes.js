// routes/BlogRoutes.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const {
  blogUpload,
  addBlog,
  getAllBlogs,
  getBlogById,
} = require("../controllers/BlogController");

const router = express.Router();

// Multer storage for blog featured images
const blogstorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const uploadDir = "uploads/blogs";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const blogupload = multer({ storage: blogstorage });

// Add a new blog
router.post("/add-blog", blogUpload.single("featuredImage"), addBlog);

// Fetch all blogs
router.get("/all-blogs", getAllBlogs);

// Fetch a single blog by ID
router.get("/single-blogs/:id", getBlogById);

module.exports = router;
