// routes/OrderRoutes.js
const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/OrderController");

let { verifyToken, verifyTokenOptional, requireRole } = require("../middleware/authMiddleware");

// If your auth does not export requireRole, define a tiny fallback
if (!requireRole) {
  requireRole = (roles = []) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (roles.length > 0) {
      const role = (req.user.role || "").toLowerCase();
      if (!roles.map(r => String(r).toLowerCase()).includes(role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }
    next();
  };
}

/* -------------------------- CREATE / CHECKOUT -------------------------- */

// POST /api/place-order (guest or logged-in)
router.post("/place-order", verifyTokenOptional, ctrl.placeOrder);

// POST /api/create-order (admin/manual create)
router.post(
  "/create-order",
  verifyToken,
  requireRole(["admin", "superadmin"]),
  ctrl.createOrder
);

/* --------------------------------- READ -------------------------------- */

// GET /api/get-order-by-id/:id
router.get(
  "/get-order-by-id/:id",
  verifyToken,
  requireRole(["admin", "superadmin"]),
  ctrl.getOrderById
);

// GET /api/list-orders
router.get(
  "/list-orders",
  verifyToken,
  requireRole(["admin", "superadmin"]),
  ctrl.listOrders
);

// GET /api/my-orders (current user's orders)
router.get("/my-orders", verifyToken, ctrl.myOrders);

/* -------------------------------- UPDATE -------------------------------- */

// PATCH /api/update-order/:id
router.patch(
  "/update-order/:id",
  verifyToken,
  requireRole(["admin", "superadmin"]),
  ctrl.updateOrder
);

// PATCH /api/mark-payment-status/:id
router.patch(
  "/mark-payment-status/:id",
  verifyToken,
  requireRole(["admin", "superadmin"]),
  ctrl.markPaymentStatus
);

// PATCH /api/update-order-status/:id
router.patch(
  "/update-order-status/:id",
  verifyToken,
  requireRole(["admin", "superadmin"]),
  ctrl.updateOrderStatus
);

// PATCH /api/archive-order/:id
router.patch(
  "/archive-order/:id",
  verifyToken,
  requireRole(["admin", "superadmin"]),
  ctrl.archiveOrder
);

/* -------------------------------- DELETE -------------------------------- */

// DELETE /api/delete-order/:id
router.delete(
  "/delete-order/:id",
  verifyToken,
  requireRole(["admin", "superadmin"]),
  ctrl.deleteOrder
);

/* --------------------------- COUNTS & STATS ---------------------------- */

// GET /api/count-orders
router.get(
  "/count-orders",
  verifyToken,
  requireRole(["admin", "superadmin"]),
  ctrl.countOrders
);

// GET /api/summary
router.get(
  "/summary",
  verifyToken,
  requireRole(["admin", "superadmin"]),
  ctrl.summary
);

// GET /api/revenue-by-interval
router.get(
  "/revenue-by-interval",
  verifyToken,
  requireRole(["admin", "superadmin"]),
  ctrl.revenueByInterval
);

// GET /api/top-courses
router.get(
  "/top-courses",
  verifyToken,
  requireRole(["admin", "superadmin"]),
  ctrl.topCourses
);

/* ---------------------------- BULK OPERATIONS --------------------------- */

// POST /api/bulk-update-status
router.post(
  "/bulk-update-status",
  verifyToken,
  requireRole(["admin", "superadmin"]),
  ctrl.bulkUpdateStatus
);

// POST /api/bulk-mark-payment-status
router.post(
  "/bulk-mark-payment-status",
  verifyToken,
  requireRole(["admin", "superadmin"]),
  ctrl.bulkMarkPaymentStatus
);

// POST /api/bulk-archive
router.post(
  "/bulk-archive",
  verifyToken,
  requireRole(["admin", "superadmin"]),
  ctrl.bulkArchive
);

// POST /api/bulk-delete
router.post(
  "/bulk-delete",
  verifyToken,
  requireRole(["admin", "superadmin"]),
  ctrl.bulkDelete
);

/* -------------------------------- EXPORT -------------------------------- */

// GET /api/export-json
router.get(
  "/export-json",
  verifyToken,
  requireRole(["admin", "superadmin"]),
  ctrl.exportJson
);

module.exports = router;
