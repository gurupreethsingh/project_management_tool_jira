// controllers/WishlistController.js
const mongoose = require("mongoose");
const Wishlist = require("../models/WishlistModel");
const Cart = require("../models/CartModel");
const Course = require("../models/CourseModel");

// Helpers
const safeId = (v) => (v && typeof v === "object" ? v._id : v);
const getUserId = (req) =>
  req?.user?._id || req?.user?.id || req?.user?.userId || null;

// ---------------------- GET /wishlist ----------------------
// Returns only course-related fields (no price, no images) + savedForLater
exports.getWishlist = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: "items.course",
      select:
        "title slug level durationInHours category subCategory instructor averageRating published",
    });

    if (!wishlist) return res.json({ items: [] });

    const items = (wishlist.items || [])
      .filter((it) => it.course) // populated and not deleted
      .map((it) => {
        const c = it.course;
        return {
          _id: safeId(c),
          title: c.title,
          slug: c.slug,
          level: c.level,
          durationInHours: c.durationInHours ?? 0,
          category: c.category,
          subCategory: c.subCategory,
          instructor: c.instructor,
          averageRating: c.averageRating ?? 0,
          published: !!c.published,
          savedForLater: !!it.savedForLater,
        };
      });

    return res.json({ items });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ---------------------- POST /wishlist ----------------------
// body: { courseId }
exports.addToWishlist = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { courseId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid courseId" });
    }

    // ensure course exists
    const course = await Course.findById(courseId).select("_id");
    if (!course) return res.status(404).json({ message: "Course not found" });

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) wishlist = new Wishlist({ user: userId, items: [] });

    const exists = wishlist.items.some(
      (item) => String(item.course) === String(courseId)
    );
    if (exists)
      return res.status(409).json({ message: "Course already in wishlist" });

    wishlist.items.push({ course: courseId });
    await wishlist.save();

    return res.status(200).json({ message: "Added to wishlist" });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ---------------------- DELETE /wishlist/:courseId ----------------------
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid courseId" });
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const before = wishlist.items.length;
    wishlist.items = wishlist.items.filter(
      (item) => String(item.course) !== String(courseId)
    );

    if (wishlist.items.length === before) {
      return res.status(404).json({ message: "Course not in wishlist" });
    }

    await wishlist.save();
    return res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ---------------------- PATCH /wishlist/toggle-save-for-later/:courseId ----------------------
exports.toggleSaveForLater = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid courseId" });
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const item = wishlist.items.find(
      (it) => String(it.course) === String(courseId)
    );
    if (!item) {
      return res.status(404).json({ message: "Course not in wishlist" });
    }

    item.savedForLater = !item.savedForLater;
    await wishlist.save();

    return res.status(200).json({
      message: "Updated save-for-later status",
      savedForLater: item.savedForLater,
    });
  } catch (error) {
    console.error("Error updating save for later:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ---------------------- POST /wishlist/move-to-cart ----------------------
// body: { courseId }
// - No quantity for courses
// - Do not duplicate if already in cart
exports.moveToCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { courseId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid courseId" });
    }

    // Ensure the course exists
    const course = await Course.findById(courseId).select("_id");
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Get user's wishlist & find the item
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    const itemIndex = wishlist.items.findIndex(
      (it) => String(it.course) === String(courseId)
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Course not in wishlist" });
    }

    // Prepare / get cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    // If already in cart, just remove from wishlist
    const existsInCart = cart.items.some(
      (ci) => String(ci.course) === String(courseId)
    );
    if (existsInCart) {
      wishlist.items.splice(itemIndex, 1);
      await wishlist.save();
      return res
        .status(200)
        .json({ message: "Course already in cart; removed from wishlist" });
    }

    // Add to cart (single item; no quantity)
    cart.items.push({ course: courseId });

    // Remove from wishlist after adding
    wishlist.items.splice(itemIndex, 1);

    await cart.save();
    await wishlist.save();

    return res.status(200).json({ message: "Moved to cart" });
  } catch (error) {
    console.error("Error moving to cart:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
