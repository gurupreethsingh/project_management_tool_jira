const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const User = require("../models/UserModel.js");
const {
  register,
  registerStudent,
  login,
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
  getUsersByRole,
  getInstructors,
  getAuthors,
  getStudents,
} = require("../controllers/UserController");

// Set up multer storage for handling file uploads
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
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

router.post("/register", register);
router.post("/register-student", registerStudent);
router.post("/login", login);
router.get("/getUserById/:id", getUserById);
router.put("/update-profile/:id", upload.single("avatar"), updateUser);
router.delete("/delete-user/:id", deleteUser);
router.get("/getUserCounts", getUserCounts);
router.get("/all-users", getAllUsers);
router.get("/single-user/:id", getUserById);
router.put("/update-user-role/:id", updateUserRoleAndPrivileges);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.get("/getUserCountsByRole", getUserCountsByRole);
router.get("/get-users-by-role", getUsersByRole);
router.get("/get-instructors", getInstructors);
router.get("/instructors", getInstructors);
router.get("/get-authors", getAuthors);
router.get("/get-students", getStudents);

module.exports = router;
