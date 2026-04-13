const mongoose = require("mongoose");
const UserProductHistory = require("../models/UserProductHistoryModel");
const Product = require("../models/ProductModel");

/**
 * POST /api/user-history/add-view
 * body: { productId }
 *
 * Behavior:
 * - login required
 * - if same product already exists in history for this user,
 *   just update viewedAt so it moves to the top
 * - otherwise create a new row
 */
exports.addProductViewToHistory = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    if (!productId) {
      return res.status(400).json({ message: "productId is required." });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId." });
    }

    const productExists = await Product.findOne({
      _id: productId,
      isDeleted: false,
    }).select("_id");

    if (!productExists) {
      return res.status(404).json({ message: "Product not found." });
    }

    const updated = await UserProductHistory.findOneAndUpdate(
      { user: userId, product: productId },
      {
        $set: {
          viewedAt: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      message: "Product view saved to history.",
      history: updated,
    });
  } catch (error) {
    console.error("addProductViewToHistory error:", error);
    return res.status(500).json({
      message: "Failed to save product view history.",
    });
  }
};

/**
 * GET /api/user-history/my-history?limit=20
 *
 * Returns logged-in user's browsing history
 * newest first
 */
exports.getMyProductHistory = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 20, 50));

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    const history = await UserProductHistory.find({ user: userId })
      .sort({ viewedAt: -1 })
      .limit(limit)
      .populate({
        path: "product",
        match: { isDeleted: false },
        populate: [
          { path: "category", select: "category_name" },
          { path: "subcategory", select: "sub_category_name" },
          { path: "vendor", select: "name vendor_name" },
        ],
      });

    const cleaned = history
      .filter((item) => item.product)
      .map((item) => ({
        _id: item._id,
        viewedAt: item.viewedAt,
        product: item.product,
      }));

    return res.status(200).json({
      count: cleaned.length,
      history: cleaned,
    });
  } catch (error) {
    console.error("getMyProductHistory error:", error);
    return res.status(500).json({
      message: "Failed to fetch product history.",
    });
  }
};

/**
 * DELETE /api/user-history/clear-history
 *
 * Clears logged-in user's history
 */
exports.clearMyProductHistory = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    await UserProductHistory.deleteMany({ user: userId });

    return res.status(200).json({
      message: "User product history cleared successfully.",
    });
  } catch (error) {
    console.error("clearMyProductHistory error:", error);
    return res.status(500).json({
      message: "Failed to clear product history.",
    });
  }
};
