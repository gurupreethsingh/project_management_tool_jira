// routes/UserRoutes.js
const express = require("express");
const {
  register,
  login,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  authenticateToken,
  requireAdmin,
  protect,
  uploadAvatar,
  listDevelopers,
  listTestEngineers,
  countDevelopersFromProjects,
  countByRole,
  countUsersSummary,
} = require("../controllers/UserController");

const router = express.Router();

// ===== AUTH + PROFILE =====
router.post("/register", register);
router.post("/login", login);
router.get("/user/:id", getUserById); // keep legacy path
router.get("/get-user/:id", getUserById); // keep both variants for compatibility
router.get("/all-users", getAllUsers);

router.put("/update-user/:id", uploadAvatar.single("avatar"), updateUser);

router.delete("/delete-user/:id", authenticateToken, requireAdmin, deleteUser);

// ===== USER LISTS =====
router.get("/users/developers", listDevelopers);
router.get("/users/test-engineers", listTestEngineers);

// ===== COUNTS =====
router.get("/count-developers", countDevelopersFromProjects);
router.get("/count-test-engineers", countByRole("test_engineer"));
router.get("/count-admins", countByRole("admin"));
router.get("/count-accountants", countByRole("accountant"));
router.get("/count-alumni-relations", countByRole("alumni_relations"));
router.get("/count-business-analysts", countByRole("business_analyst"));
router.get("/count-content-creators", countByRole("content_creator"));
router.get("/count-customer-support", countByRole("customer_support"));
router.get("/count-data-scientists", countByRole("data_scientist"));
router.get("/count-deans", countByRole("dean"));
router.get("/count-department-heads", countByRole("department_head"));
router.get("/count-event-coordinators", countByRole("event_coordinator"));
router.get("/count-exam-controllers", countByRole("exam_controller"));
router.get("/count-hr-managers", countByRole("hr_manager"));
router.get("/count-users", countUsersSummary);

module.exports = router;
