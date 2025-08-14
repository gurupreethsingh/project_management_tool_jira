// const Blog = require("../models/BlogModel");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");

// // Configure Multer for blog image uploads
// const blogStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = "uploads/blogs";
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const blogUpload = multer({ storage: blogStorage });

// // Add a new blog
// const addBlog = async (req, res) => {
//   try {
//     const {
//       title,
//       body,
//       author,
//       summary,
//       tags,
//       category,
//       seoTitle,
//       metaDescription,
//       published,
//     } = req.body;

//     // Store only the relative path for the image
//     const featuredImage = req.file ? req.file.path.replace(/\\/g, "/") : "";

//     const newBlog = new Blog({
//       title,
//       body,
//       author,
//       summary,
//       tags,
//       category,
//       seoTitle,
//       metaDescription,
//       published,
//       featuredImage,
//       publishedDate: published ? new Date() : null,
//     });

//     await newBlog.save();
//     res.status(201).json({ message: "Blog added successfully", blog: newBlog });
//   } catch (error) {
//     console.error("Error adding blog:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // Fetch all blogs
// const getAllBlogs = async (req, res) => {
//   try {
//     const blogs = await Blog.find().lean();

//     // Add server URL to the featuredImage path if needed
//     const modifiedBlogs = blogs.map((blog) => {
//       if (blog.featuredImage) {
//         blog.featuredImage = `${req.protocol}://${req.get("host")}/${
//           blog.featuredImage
//         }`;
//       }
//       return blog;
//     });

//     res.status(200).json(modifiedBlogs);
//   } catch (error) {
//     console.error("Error fetching blogs:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // Fetch a single blog by ID
// const getBlogById = async (req, res) => {
//   try {
//     const blogId = req.params.id;

//     const blog = await Blog.findById(blogId)
//       .populate("author", "name")
//       .populate("comments.postedBy", "name");

//     if (!blog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     res.status(200).json(blog);
//   } catch (error) {
//     console.error("Error fetching blog:", error);
//     res
//       .status(500)
//       .json({ message: "An error occurred while fetching the blog" });
//   }
// };

// module.exports = {
//   blogUpload,
//   addBlog,
//   getAllBlogs,
//   getBlogById,
// };



//

//

// till here original code.
 
//

//

const Blog = require("../models/BlogModel");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// ---- Multer storage for blog image uploads ----
const blogStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/blogs";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const blogUpload = multer({ storage: blogStorage });

// ---- Helpers ----
const toBool = (val) => {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    const v = val.toLowerCase();
    return v === "true" || v === "1" || v === "yes";
  }
  return false;
};

const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  return String(tags)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
};

// ---- Add a new blog ----
// Make sure your route uses: blogUpload.single("featuredImage")
const addBlog = async (req, res) => {
  try {
    const {
      title,
      body,
      author,
      summary,
      tags,
      category,
      seoTitle,
      metaDescription,
      published,
      code,          // NEW
      explanation,   // NEW
    } = req.body;

    const publishedBool = toBool(published);
    const tagArray = normalizeTags(tags);

    // Store only the relative path for the image (as before)
    const featuredImage = req.file ? req.file.path.replace(/\\/g, "/") : "";

    const newBlog = new Blog({
      title,
      body,
      code: code || "",
      explanation: explanation || "",
      author,
      summary,
      tags: tagArray,
      category: category?.trim() || "",
      seoTitle,
      metaDescription,
      published: publishedBool,
      featuredImage,
      publishedDate: publishedBool ? new Date() : null,
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog added successfully", blog: newBlog });
  } catch (error) {
    console.error("Error adding blog:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ---- Fetch all blogs ----
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name") // <-- get { _id, name }
      .lean();

    const base = `${req.protocol}://${req.get("host")}`;

    const normalizeTags = (tags) => {
      if (!tags) return [];
      if (Array.isArray(tags)) return tags.filter(Boolean);
      return String(tags)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    };

    const modifiedBlogs = blogs.map((blog) => {
      if (blog.featuredImage) {
        blog.featuredImage = `${base}/${blog.featuredImage.replace(/\\/g, "/")}`;
      }
      blog.tags = normalizeTags(blog.tags);
      return blog;
    });

    res.status(200).json(modifiedBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Server error" });
  }
};



// ---- Fetch a single blog by ID ----
const getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;

    const blogDoc = await Blog.findById(blogId)
      .populate("author", "name")
      .populate("comments.postedBy", "name")
      .lean();

    if (!blogDoc) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const base = `${req.protocol}://${req.get("host")}`;
    if (blogDoc.featuredImage) {
      blogDoc.featuredImage = `${base}/${blogDoc.featuredImage}`;
    }

    // normalize tags to array
    blogDoc.tags = Array.isArray(blogDoc.tags)
      ? blogDoc.tags
      : normalizeTags(blogDoc.tags);

    res.status(200).json(blogDoc);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the blog" });
  }
};

module.exports = {
  blogUpload,
  addBlog,
  getAllBlogs,
  getBlogById,
};
