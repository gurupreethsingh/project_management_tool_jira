const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/WishlistController");
const { verifyToken } = require("../middleware/AuthMiddleware");

router.get("/get-wishlist", verifyToken, wishlistController.getWishlist);
router.post("/add-to-wishlist", verifyToken, wishlistController.addToWishlist);

router.delete(
  "/remove-from-wishlist/:productId",
  verifyToken,
  wishlistController.removeFromWishlist,
);

router.patch(
  "/toggle-save-for-later/:productId",
  verifyToken,
  wishlistController.toggleSaveForLater,
);

router.post("/move-to-cart", verifyToken, wishlistController.moveToCart);

// added routes
router.delete(
  "/bulk/remove",
  verifyToken,
  wishlistController.bulkRemoveFromWishlist,
);

router.delete("/clear", verifyToken, wishlistController.clearWishlist);

router.patch(
  "/bulk/save-for-later",
  verifyToken,
  wishlistController.bulkSaveForLater,
);

router.patch(
  "/save-all-for-later",
  verifyToken,
  wishlistController.saveAllForLater,
);

router.post(
  "/bulk/move-to-cart",
  verifyToken,
  wishlistController.bulkMoveToCart,
);

router.post(
  "/bulk/checkout",
  verifyToken,
  wishlistController.bulkCheckoutItems,
);

module.exports = router;
