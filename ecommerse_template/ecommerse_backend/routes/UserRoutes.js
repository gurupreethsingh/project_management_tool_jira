const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const User = require("../models/UserModel.js");
const { verifyToken } = require("../middleware/AuthMiddleware");

const {
  register,
  login,
  verifyLoggedInUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserCounts,
  getAllUsers,
  updateUserRoleAndPrivileges,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getUserCountsByRole,
} = require("../controllers/UserController");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const user = await User.findById(req.params.id);
      const role = user?.role || "others";

      const uploadFolder = path.join("uploads", role);

      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }

      cb(null, uploadFolder);
    } catch (err) {
      cb(err);
    }
  },

  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

const upload = multer({ storage });

router.post("/register", register);
router.post("/login", login);

router.get("/verify-token", verifyToken, verifyLoggedInUser);

router.get("/getUserById/:id", getUserById);
router.get("/single-user/:id", getUserById);

router.put("/update-profile/:id", upload.single("avatar"), updateUser);
router.delete("/delete-user/:id", deleteUser);

router.get("/getUserCounts", getUserCounts);
router.get("/getUserCountsByRole", getUserCountsByRole);
router.get("/all-users", getAllUsers);

router.put("/update-user-role/:id", updateUserRoleAndPrivileges);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

module.exports = router;
