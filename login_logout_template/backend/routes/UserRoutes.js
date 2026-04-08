const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  updateUserRole,
} = require("../controllers/UserController");

const { requireSignIn, isSuperAdmin } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

router.get("/me", requireSignIn, getMyProfile);
router.put("/update-profile", requireSignIn, updateMyProfile);

router.get("/all-users", requireSignIn, isSuperAdmin, getAllUsers);
router.put("/update-role/:id", requireSignIn, isSuperAdmin, updateUserRole);

module.exports = router;
