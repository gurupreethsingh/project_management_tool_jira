// controllers/CartController.js
const Cart = require("../models/CartModel");
const Course = require("../models/CourseModel");

/**
 * Pick a stable icon key on the frontend without storing images.
 * You can map these keys to icons (react-icons, lucide, heroicons, etc).
 * Strategy:
 *  - prefer first tag if present (e.g., "python", "ui-ux", "ml")
 *  - else use level (Beginner/Intermediate/Advanced)
 *  - else derive a stable bucket from slug to spread icons visually
 */
function pickIconKeyFromCourse(c) {
  if (Array.isArray(c.tags) && c.tags.length > 0) {
    const tag = String(c.tags[0])
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    return `tag-${tag}`;
  }
  if (c.level) {
    const lvl = String(c.level).toLowerCase();
    if (["beginner", "intermediate", "advanced"].includes(lvl)) {
      return `level-${lvl}`;
    }
  }
  // stable hash bucket from slug/title
  const s = (c.slug || c.title || "").toLowerCase();
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const bucket = (h % 8) + 1; // 1..8 buckets
  return `bucket-${bucket}`;
}

// ---------------------- Get Cart ----------------------
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate({
      path: "items.course",
      select: "title slug level tags published", // no price/image
    });

    if (!cart) return res.status(200).json({ items: [] });

    const items = cart.items
      .filter((it) => !!it.course)
      .map((item) => {
        const c = item.course;
        return {
          _id: c._id,
          title: c.title,
          level: c.level,
          slug: c.slug,
          tags: c.tags || [],
          published: !!c.published,
          iconKey: pickIconKeyFromCourse(c),
        };
      });

    res.json({ items });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------------- Add to Cart ----------------------
// Body: { courseId }
exports.addToCart = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: "courseId is required" });
    }

    const exists = await Course.exists({ _id: courseId });
    if (!exists) return res.status(404).json({ message: "Course not found" });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    const already = cart.items.some(
      (it) => String(it.course) === String(courseId)
    );
    if (!already) {
      cart.items.push({ course: courseId });
      await cart.save();
    }

    res.status(200).json({ message: "Course added to cart." });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------------- Update Cart Item ----------------------
// Deprecated: no quantity in cart
exports.updateCartItem = async (req, res) => {
  return res.status(400).json({
    message: "Cart does not support quantity for courses. Route deprecated.",
  });
};

// ---------------------- Remove Item ----------------------
// Params: /:courseId
exports.removeCartItem = async (req, res) => {
  try {
    const { courseId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const before = cart.items.length;
    cart.items = cart.items.filter(
      (it) => String(it.course) !== String(courseId)
    );

    if (cart.items.length === before) {
      return res.status(404).json({ message: "Course not in cart" });
    }

    await cart.save();
    res.status(200).json({ message: "Course removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------------- Clear Cart ----------------------
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------------- Sync Guest Cart ----------------------
// Body: { items } = array of courseIds or objects with { _id/courseId/course }
exports.syncCart = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "items must be an array" });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    // Normalize & dedupe
    const normalized = [];
    const seen = new Set();
    for (const it of items) {
      const id =
        typeof it === "string"
          ? it
          : it?._id || it?.courseId || it?.course || null;
      if (!id) continue;
      const key = String(id);
      if (seen.has(key)) continue;
      seen.add(key);
      normalized.push({ course: id });
    }

    cart.items = normalized;
    await cart.save();

    res
      .status(200)
      .json({ message: "Cart synchronized", itemCount: cart.items.length });
  } catch (error) {
    console.error("Cart sync error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
