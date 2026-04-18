const mongoose = require("mongoose");
const Wishlist = require("../models/WishlistModel");
const Cart = require("../models/CartModel");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function normalizeProductIds(productIds = []) {
  if (!Array.isArray(productIds)) return [];
  return [
    ...new Set(productIds.filter((id) => isValidObjectId(id)).map(String)),
  ];
}

async function getOrCreateWishlist(userId) {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = new Wishlist({ user: userId, items: [] });
    await wishlist.save();
  }
  return wishlist;
}

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
    await cart.save();
  }
  return cart;
}

function formatWishlistResponse(wishlist) {
  if (!wishlist || !Array.isArray(wishlist.items)) {
    return { items: [] };
  }

  return {
    items: wishlist.items
      .filter((item) => item.product)
      .map((item) => ({
        _id: item.product._id,
        product_name: item.product.product_name,
        selling_price: item.product.selling_price,
        display_price: item.product.display_price,
        product_image: item.product.product_image,
        availability_status: item.product.availability_status,
        brand: item.product.brand,
        category_name: item.product.category_name,
        description: item.product.description,
        savedForLater: item.savedForLater,
        addedAt: item.addedAt || null,
      })),
  };
}

// ======================================================
// GET WISHLIST
// ======================================================
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
      path: "items.product",
      select:
        "product_name selling_price display_price product_image availability_status brand category_name description",
    });

    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }

    return res.status(200).json(formatWishlistResponse(wishlist));
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// ADD TO WISHLIST
// ======================================================
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId || !isValidObjectId(productId)) {
      return res.status(400).json({ message: "Valid productId is required" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, items: [] });
    }

    const exists = wishlist.items.some(
      (item) => String(item.product) === String(productId),
    );

    if (exists) {
      return res.status(409).json({ message: "Item already in wishlist" });
    }

    wishlist.items.push({
      product: productId,
      savedForLater: false,
      addedAt: new Date(),
    });

    await wishlist.save();

    return res.status(200).json({ message: "Added to wishlist" });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// REMOVE SINGLE ITEM FROM WISHLIST
// ======================================================
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId || !isValidObjectId(productId)) {
      return res.status(400).json({ message: "Valid productId is required" });
    }

    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const beforeCount = wishlist.items.length;

    wishlist.items = wishlist.items.filter(
      (item) => String(item.product) !== String(productId),
    );

    if (beforeCount === wishlist.items.length) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    await wishlist.save();

    return res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// CLEAR ENTIRE WISHLIST
// ======================================================
exports.clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(200).json({ message: "Wishlist already empty" });
    }

    wishlist.items = [];
    await wishlist.save();

    return res.status(200).json({ message: "Wishlist cleared successfully" });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// BULK REMOVE FROM WISHLIST
// ======================================================
exports.bulkRemoveFromWishlist = async (req, res) => {
  try {
    const productIds = normalizeProductIds(req.body.productIds);

    if (!productIds.length) {
      return res.status(400).json({ message: "productIds array is required" });
    }

    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(
      (item) => !productIds.includes(String(item.product)),
    );

    await wishlist.save();

    return res.status(200).json({
      message: "Selected items removed from wishlist",
    });
  } catch (error) {
    console.error("Error bulk removing wishlist items:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// TOGGLE SINGLE SAVE FOR LATER
// ======================================================
exports.toggleSaveForLater = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId || !isValidObjectId(productId)) {
      return res.status(400).json({ message: "Valid productId is required" });
    }

    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const item = wishlist.items.find(
      (entry) => String(entry.product) === String(productId),
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.savedForLater = !item.savedForLater;
    await wishlist.save();

    return res.status(200).json({
      message: "Updated save for later status",
      savedForLater: item.savedForLater,
    });
  } catch (error) {
    console.error("Error updating save for later:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// BULK SAVE FOR LATER / UNSAVE
// ======================================================
exports.bulkSaveForLater = async (req, res) => {
  try {
    const productIds = normalizeProductIds(req.body.productIds);
    const { savedForLater = true } = req.body;

    if (!productIds.length) {
      return res.status(400).json({ message: "productIds array is required" });
    }

    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items.forEach((item) => {
      if (productIds.includes(String(item.product))) {
        item.savedForLater = Boolean(savedForLater);
      }
    });

    await wishlist.save();

    return res.status(200).json({
      message: savedForLater
        ? "Selected items marked as saved for later"
        : "Selected items removed from saved for later",
    });
  } catch (error) {
    console.error("Error bulk updating save for later:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// MARK ALL AS SAVE FOR LATER / UNSAVE
// ======================================================
exports.saveAllForLater = async (req, res) => {
  try {
    const { savedForLater = true } = req.body;

    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items.forEach((item) => {
      item.savedForLater = Boolean(savedForLater);
    });

    await wishlist.save();

    return res.status(200).json({
      message: savedForLater
        ? "All wishlist items saved for later"
        : "All wishlist items unsaved",
    });
  } catch (error) {
    console.error("Error saving all for later:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// MOVE SINGLE ITEM TO CART
// ======================================================
exports.moveToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId || !isValidObjectId(productId)) {
      return res.status(400).json({ message: "Valid productId is required" });
    }

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const itemIndex = wishlist.items.findIndex(
      (item) => String(item.product) === String(productId),
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not in wishlist" });
    }

    const cart = await getOrCreateCart(req.user.id);

    const existingCartItem = cart.items.find(
      (ci) => String(ci.product) === String(productId),
    );

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    wishlist.items.splice(itemIndex, 1);

    await cart.save();
    await wishlist.save();

    return res.status(200).json({ message: "Moved to cart" });
  } catch (error) {
    console.error("Error moving to cart:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// BULK MOVE TO CART
// ======================================================
exports.bulkMoveToCart = async (req, res) => {
  try {
    const productIds = normalizeProductIds(req.body.productIds);

    if (!productIds.length) {
      return res.status(400).json({ message: "productIds array is required" });
    }

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const cart = await getOrCreateCart(req.user.id);

    for (const productId of productIds) {
      const existsInWishlist = wishlist.items.some(
        (item) => String(item.product) === String(productId),
      );

      if (!existsInWishlist) continue;

      const existingCartItem = cart.items.find(
        (ci) => String(ci.product) === String(productId),
      );

      if (existingCartItem) {
        existingCartItem.quantity += 1;
      } else {
        cart.items.push({ product: productId, quantity: 1 });
      }
    }

    wishlist.items = wishlist.items.filter(
      (item) => !productIds.includes(String(item.product)),
    );

    await cart.save();
    await wishlist.save();

    return res.status(200).json({
      message: "Selected wishlist items moved to cart",
    });
  } catch (error) {
    console.error("Error bulk moving to cart:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// BULK CHECKOUT ITEMS
// (moves selected wishlist items to cart, then frontend can open checkout)
// ======================================================
exports.bulkCheckoutItems = async (req, res) => {
  try {
    const productIds = normalizeProductIds(req.body.productIds);

    if (!productIds.length) {
      return res.status(400).json({ message: "productIds array is required" });
    }

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const cart = await getOrCreateCart(req.user.id);

    for (const productId of productIds) {
      const existsInWishlist = wishlist.items.some(
        (item) => String(item.product) === String(productId),
      );

      if (!existsInWishlist) continue;

      const existingCartItem = cart.items.find(
        (ci) => String(ci.product) === String(productId),
      );

      if (existingCartItem) {
        existingCartItem.quantity += 1;
      } else {
        cart.items.push({ product: productId, quantity: 1 });
      }
    }

    wishlist.items = wishlist.items.filter(
      (item) => !productIds.includes(String(item.product)),
    );

    await cart.save();
    await wishlist.save();

    return res.status(200).json({
      message: "Selected wishlist items added to cart for checkout",
      redirectTo: "/checkout",
    });
  } catch (error) {
    console.error("Error bulk checkout from wishlist:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
