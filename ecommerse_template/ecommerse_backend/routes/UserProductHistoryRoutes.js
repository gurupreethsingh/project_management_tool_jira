const express = require("express");
const router = express.Router();

const userProductHistoryController = require("../controllers/UserProductHistoryController");
const { verifyToken } = require("../middleware/AuthMiddleware");

// add viewed product to history
router.post(
  "/add-view",
  verifyToken,
  userProductHistoryController.addProductViewToHistory,
);

// get logged-in user's history
router.get(
  "/my-history",
  verifyToken,
  userProductHistoryController.getMyProductHistory,
);

// clear logged-in user's history
router.delete(
  "/clear-history",
  verifyToken,
  userProductHistoryController.clearMyProductHistory,
);

module.exports = router;
