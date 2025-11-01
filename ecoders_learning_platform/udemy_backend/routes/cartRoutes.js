const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");
const { verifyToken } = require("../middleware/AuthMiddleware");

// Get cart items
router.get("/get-cart-items", verifyToken, cartController.getCart);

// Add to cart (body: { courseId })
router.post("/add-to-cart", verifyToken, cartController.addToCart);

// Update cart item — deprecated (no quantity)
router.patch("/update-cart/:courseId", verifyToken, cartController.updateCartItem);

// Remove cart item
router.delete("/remove-cart-item/:courseId", verifyToken, cartController.removeCartItem);

// Clear cart
router.delete("/clear-cart", verifyToken, cartController.clearCart);

// Sync guest cart
router.post("/sync-cart", verifyToken, cartController.syncCart);

module.exports = router;
