const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/WishlistController");
const { verifyToken } = require("../middleware/AuthMiddleware");

// GET current user's wishlist
// Response returns course fields (title, slug, level, tags, etc.; no price/image)
router.get("/get-wishlist", verifyToken, wishlistController.getWishlist);

// Add to wishlist (body: { courseId })
router.post("/add-to-wishlist", verifyToken, wishlistController.addToWishlist);

// Remove from wishlist
router.delete("/remove-from-wishlist/:courseId", verifyToken, wishlistController.removeFromWishlist);

// Toggle save-for-later
router.patch("/toggle-save-for-later/:courseId", verifyToken, wishlistController.toggleSaveForLater);

// Move from wishlist to cart (body: { courseId })
router.post("/move-to-cart", verifyToken, wishlistController.moveToCart);

module.exports = router;
