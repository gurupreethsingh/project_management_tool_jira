const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const os = require("os");

// ✅ Factory function to generate dynamic multer middleware
const getMulterUpload = (folder = "misc", maxCount = 10) => {
  const uploadDir = path.join(__dirname, "..", "uploads", folder); // OS-safe path

  // Ensure upload folder exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Use memory storage to compress before writing
  const storage = multer.memoryStorage();

  // File type filter
  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (.png, .jpg, .jpeg, .webp) are allowed"), false);
    }
  };

  // Multer middleware
  const upload = multer({ storage, fileFilter }).array("images", maxCount);

  // Wrapper middleware to compress and save
  return async (req, res, next) => {
    upload(req, res, async function (err) {
      if (err) return res.status(400).json({ error: err.message });

      try {
        // Replace req.files with compressed versions saved to disk
        const compressedFiles = [];

        for (const file of req.files) {
          const timestamp = Date.now();
          const safeName = file.originalname.replace(/\s+/g, "_");
          const filename = `${timestamp}_${safeName}`;
          const filepath = path.join(uploadDir, filename);

          // Compress and save image using Sharp
          await sharp(file.buffer)
            .resize({ width: 1200 }) // Resize if wider than 1200px
            .jpeg({ quality: 70 })   // Compress to 70% quality
            .toFile(filepath);

          compressedFiles.push({
            fieldname: file.fieldname,
            originalname: file.originalname,
            encoding: file.encoding,
            mimetype: file.mimetype,
            size: file.size,
            filename,
            path: filepath.replace(/\\/g, "/"), // Uniform path (Windows fix)
          });
        }

        req.files = compressedFiles; // replace with new info
        next();
      } catch (compressErr) {
        return res.status(500).json({ error: "Failed to process images", details: compressErr.message });
      }
    });
  };
};

module.exports = getMulterUpload;
