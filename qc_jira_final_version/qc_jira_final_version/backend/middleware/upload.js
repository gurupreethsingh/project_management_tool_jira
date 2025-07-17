const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Factory function to generate dynamic multer middleware
const getMulterUpload = (folder = "misc", maxCount = 10) => {
  // Ensure folder exists
  const destination = `uploads/${folder}`;
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Define storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      const safeName = file.originalname.replace(/\s+/g, "_");
      cb(null, `${timestamp}_${safeName}`);
    },
  });

  // File type filtering
  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (.png, .jpg, .jpeg, .webp) are allowed"), false);
    }
  };

  return multer({ storage, fileFilter }).array("images", maxCount);
};

module.exports = getMulterUpload;
