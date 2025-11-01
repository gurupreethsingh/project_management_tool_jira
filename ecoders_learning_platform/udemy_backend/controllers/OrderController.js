// controllers/OrderController.js
const mongoose = require("mongoose");
const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const Course = require("../models/CourseModel");

/* ------------------------------ helpers ------------------------------ */

const asObjectId = (v) => {
  try {
    return v && mongoose.Types.ObjectId.isValid(v)
      ? new mongoose.Types.ObjectId(String(v))
      : null;
  } catch {
    return null;
  }
};

const asBool = (v) => {
  if (v === true || v === false) return v;
  if (typeof v === "string") {
    const s = v.toLowerCase().trim();
    if (["true", "1", "yes", "y", "on"].includes(s)) return true;
    if (["false", "0", "no", "n", "off"].includes(s)) return false;
  }
  return undefined;
};

const asNum = (v, def = undefined) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

const asDate = (v) => {
  const d = v ? new Date(v) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
};

/** Build a mongo filter object from req.query (admin list) */
const buildFilter = (q) => {
  const filter = {};

  // user (ObjectId)
  if (q.user) {
    const oid = asObjectId(q.user);
    if (oid) filter.user = oid;
    else if (q.user === "null") filter.user = null; // guest orders
  }

  // orderCode exact or regex
  if (q.orderCode) {
    filter.orderCode = new RegExp(String(q.orderCode).trim(), "i");
  }

  // paymentStatus / orderStatus
  if (q.paymentStatus) filter.paymentStatus = q.paymentStatus;
  if (q.orderStatus) filter.orderStatus = q.orderStatus;

  // currency
  if (q.currency) filter.currency = String(q.currency).toUpperCase();

  // isArchived
  if (q.isArchived !== undefined) {
    const b = asBool(q.isArchived);
    if (b !== undefined) filter.isArchived = b;
  }

  // confirmed (presence of confirmedAt)
  if (q.confirmed !== undefined) {
    const b = asBool(q.confirmed);
    if (b === true) filter.confirmedAt = { $exists: true, $ne: null };
    if (b === false) filter.$or = [{ confirmedAt: { $exists: false } }, { confirmedAt: null }];
  }

  // totalAmount range
  const minTotal = asNum(q.minTotal);
  const maxTotal = asNum(q.maxTotal);
  if (minTotal != null || maxTotal != null) {
    filter.totalAmount = {};
    if (minTotal != null) filter.totalAmount.$gte = minTotal;
    if (maxTotal != null) filter.totalAmount.$lte = maxTotal;
  }

  // itemCount range
  const minItems = asNum(q.minItems);
  const maxItems = asNum(q.maxItems);
  if (minItems != null || maxItems != null) {
    filter.itemCount = {};
    if (minItems != null) filter.itemCount.$gte = minItems;
    if (maxItems != null) filter.itemCount.$lte = maxItems;
  }

  // course filter inside items
  if (q.course || q.courseId) {
    const cid = asObjectId(q.course || q.courseId);
    if (cid) filter["items.course"] = cid;
  }

  // guest info
  if (q.guestEmail) filter.guestEmail = new RegExp(String(q.guestEmail).trim(), "i");
  if (q.guestPhone) filter.guestPhone = new RegExp(String(q.guestPhone).trim(), "i");
  if (q.guestName) filter.guestName = new RegExp(String(q.guestName).trim(), "i");

  // items.product_name fuzzy
  if (q.product) {
    filter["items.product_name"] = new RegExp(String(q.product).trim(), "i");
  }

  // generic q: search orderCode, guest fields, product_name
  if (q.q) {
    const r = new RegExp(String(q.q).trim(), "i");
    filter.$or = [
      { orderCode: r },
      { guestName: r },
      { guestEmail: r },
      { guestPhone: r },
      { "items.product_name": r },
    ];
  }

  // createdAt date range
  const start = asDate(q.startDate);
  const end = asDate(q.endDate);
  if (start || end) {
    filter.createdAt = {};
    if (start) filter.createdAt.$gte = start;
    if (end) {
      // end of day if only a date supplied
      const e = new Date(end);
      if (q.endDate && !q.endDate.includes("T")) {
        e.setHours(23, 59, 59, 999);
      }
      filter.createdAt.$lte = e;
    }
  }

  return filter;
};

/* ------------------------------ CREATE ------------------------------- */

/**
 * Place order from CheckoutPage payload (supports logged-in and guest).
 * Body: { billingAddress, shippingAddress, items, totalAmount, guestName?, guestEmail?, guestPhone? }
 * For logged-in users (req.user), also:
 *  - enroll user to courses
 *  - clear their cart
 */
// ---- helpers to build items & run the actual writes (with or without session) ----
async function buildOrderItemsFromCart(items, session) {
  // items may be {_id} or {course}
  const courseIds = [
    ...new Set(items.map((it) => String(it.course || it._id || "")).filter(Boolean)),
  ];

  const courses = await Course.find({ _id: { $in: courseIds } })
    .select("_id title slug level category subCategory price thumbnail tags")
    .lean()
    .session(session || null);

  const byId = new Map(courses.map((c) => [String(c._id), c]));
  const orderItems = [];

  for (const raw of items) {
    const id = String(raw.course || raw._id || "");
    if (!id || !byId.has(id)) continue;
    const c = byId.get(id);
    orderItems.push({
      course: c._id,
      product_name: c.title || raw.title || "Course",
      selling_price: Number(c.price || 0),
      quantity: 1,
      product_image: c.thumbnail || undefined,
      snapshot: {
        slug: c.slug,
        level: c.level,
        category: c.category,
        subCategory: c.subCategory,
        tags: Array.isArray(c.tags) ? c.tags : [],
      },
    });
  }

  return { orderItems, courseIds };
}

async function performOrderWrites({
  userId,
  billingAddress,
  shippingAddress,
  items,
  totalAmount,
  guestName,
  guestEmail,
  guestPhone,
  session, // optional
}) {
  const { orderItems, courseIds } = await buildOrderItemsFromCart(items, session);
  if (orderItems.length === 0) {
    const err = new Error("No valid courses to order.");
    err.status = 400;
    throw err;
  }

  const [order] = await Order.create(
    [
      {
        user: userId || null,
        billingAddress,
        shippingAddress,
        items: orderItems,
        totalAmount: Number(totalAmount || 0),
        currency: "INR",
        paymentStatus: "Pending",
        orderStatus: "Processing",
        guestName: userId ? undefined : guestName,
        guestEmail: userId ? undefined : guestEmail,
        guestPhone: userId ? undefined : guestPhone,
      },
    ],
    session ? { session } : {}
  );

  // For logged-in users: enroll + clear cart
  if (userId) {
    await Course.updateMany(
      { _id: { $in: courseIds } },
      { $addToSet: { enrolledStudents: { studentId: userId } } },
      session ? { session } : {}
    );
    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      session ? { session } : {}
    );
  }

  return order;
}

// ------------------------------ CREATE -------------------------------

exports.placeOrder = async (req, res) => {
  const userId = req.user?._id || null;
  const {
    billingAddress,
    shippingAddress,
    items = [],
    totalAmount = 0,
    guestName,
    guestEmail,
    guestPhone,
  } = req.body || {};

  if (!billingAddress || !shippingAddress) {
    return res.status(400).json({ message: "Billing and shipping addresses are required." });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "No items to order." });
  }

  // 1) Try transactional flow first
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const order = await performOrderWrites({
      userId,
      billingAddress,
      shippingAddress,
      items,
      totalAmount,
      guestName,
      guestEmail,
      guestPhone,
      session,
    });

    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({ message: "Order placed successfully.", order });
  } catch (err) {
    // If the error is "transactions not supported", fall back to non-transactional writes
    const isTxnUnsupported =
      err?.code === 20 ||
      err?.codeName === "IllegalOperation" ||
      /Transaction numbers are only allowed on a replica set member or mongos/i.test(err?.errmsg || err?.message || "");

    try {
      if (session) {
        if (session.inTransaction()) await session.abortTransaction();
        session.endSession();
      }
    } catch (_) {}

    if (!isTxnUnsupported) {
      console.error("placeOrder error:", err);
      const status = err.status || 500;
      return res.status(status).json({ message: err.message || "Failed to place order." });
    }

    // 2) Fallback: non-transactional (works on standalone MongoDB)
    try {
      const order = await performOrderWrites({
        userId,
        billingAddress,
        shippingAddress,
        items,
        totalAmount,
        guestName,
        guestEmail,
        guestPhone,
        session: null,
      });
      return res.status(201).json({ message: "Order placed successfully.", order });
    } catch (err2) {
      console.error("placeOrder (fallback) error:", err2);
      const status = err2.status || 500;
      return res.status(status).json({ message: err2.message || "Failed to place order." });
    }
  }
};


/**
 * Admin/manual create (rarely used). Accepts a full order payload.
 * Typically you should prefer placeOrder above.
 */
exports.createOrder = async (req, res) => {
  try {
    const payload = req.body || {};
    const order = await Order.create(payload);
    res.status(201).json({ order });
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(400).json({ message: err.message || "Failed to create order." });
  }
};

/* ------------------------------- READ -------------------------------- */

exports.getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id)
      .populate({ path: "user", select: "name email" })
      .populate({ path: "items.course", select: "title slug price thumbnail" });
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json({ order });
  } catch (err) {
    console.error("getOrderById error:", err);
    res.status(500).json({ message: "Failed to fetch order." });
  }
};

exports.listOrders = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const page = Math.max(1, asNum(req.query.page, 1));
    const limit = Math.max(1, Math.min(200, asNum(req.query.limit, 20)));
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = (String(req.query.order || "desc").toLowerCase() === "asc" ? 1 : -1);

    const cursor = Order.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    if (asBool(req.query.populate)) {
      cursor
        .populate({ path: "user", select: "name email" })
        .populate({ path: "items.course", select: "title slug price thumbnail" });
    }

    const [items, total] = await Promise.all([
      cursor.lean(),
      Order.countDocuments(filter),
    ]);

    res.json({
      items,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    console.error("listOrders error:", err);
    res.status(500).json({ message: "Failed to list orders." });
  }
};

/** User-scoped listing (e.g., /api/my-orders) */
exports.myOrders = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const page = Math.max(1, asNum(req.query.page, 1));
    const limit = Math.max(1, Math.min(100, asNum(req.query.limit, 20)));

    const [items, total] = await Promise.all([
      Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({ path: "items.course", select: "title slug thumbnail" })
        .lean(),
      Order.countDocuments({ user: userId }),
    ]);

    res.json({
      items,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    console.error("myOrders error:", err);
    res.status(500).json({ message: "Failed to list user orders." });
  }
};

/* ------------------------------ UPDATE ------------------------------- */

/** Update order fields (whitelisted) */
exports.updateOrder = async (req, res) => {
  try {
    const id = req.params.id;

    // whitelist fields to protect integrity
    const {
      billingAddress,
      shippingAddress,
      paymentStatus,
      orderStatus,
      isArchived,
      guestName,
      guestEmail,
      guestPhone,
      currency,
      totalAmount, // allow admins to adjust
      confirmedAt,
    } = req.body || {};

    const patch = {};
    if (billingAddress) patch.billingAddress = billingAddress;
    if (shippingAddress) patch.shippingAddress = shippingAddress;
    if (paymentStatus) patch.paymentStatus = paymentStatus;
    if (orderStatus) patch.orderStatus = orderStatus;
    if (isArchived !== undefined) patch.isArchived = !!isArchived;
    if (guestName !== undefined) patch.guestName = guestName;
    if (guestEmail !== undefined) patch.guestEmail = guestEmail;
    if (guestPhone !== undefined) patch.guestPhone = guestPhone;
    if (currency) patch.currency = String(currency).toUpperCase();
    if (totalAmount != null) patch.totalAmount = Number(totalAmount) || 0;
    if (confirmedAt !== undefined) patch.confirmedAt = confirmedAt ? new Date(confirmedAt) : null;

    // NOTE: Typically we do NOT allow changing items after creation.
    // If you must support it, add careful logic to recalc itemCount/total etc.

    const order = await Order.findByIdAndUpdate(id, { $set: patch }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json({ order });
  } catch (err) {
    console.error("updateOrder error:", err);
    res.status(400).json({ message: err.message || "Failed to update order." });
  }
};

/** Mark payment status (and stamp confirmedAt when Paid) */
exports.markPaymentStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { paymentStatus } = req.body || {};
    if (!paymentStatus) return res.status(400).json({ message: "paymentStatus required." });

    const patch = { paymentStatus };
    if (paymentStatus === "Paid") patch.confirmedAt = new Date();

    const order = await Order.findByIdAndUpdate(id, { $set: patch }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found." });

    res.json({ order });
  } catch (err) {
    console.error("markPaymentStatus error:", err);
    res.status(400).json({ message: err.message || "Failed to update payment status." });
  }
};

/** Update orderStatus only */
exports.updateOrderStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { orderStatus } = req.body || {};
    if (!orderStatus) return res.status(400).json({ message: "orderStatus required." });

    const order = await Order.findByIdAndUpdate(id, { $set: { orderStatus } }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found." });

    res.json({ order });
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    res.status(400).json({ message: err.message || "Failed to update order status." });
  }
};

/** Archive/unarchive */
exports.archiveOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const { isArchived = true } = req.body || {};
    const order = await Order.findByIdAndUpdate(id, { $set: { isArchived: !!isArchived } }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json({ order });
  } catch (err) {
    console.error("archiveOrder error:", err);
    res.status(400).json({ message: err.message || "Failed to archive order." });
  }
};

/* ------------------------------ DELETE ------------------------------- */

exports.deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json({ message: "Order deleted.", order });
  } catch (err) {
    console.error("deleteOrder error:", err);
    res.status(500).json({ message: "Failed to delete order." });
  }
};

/* ------------------------------ COUNTS ------------------------------- */

/** Count with optional same filters */
exports.countOrders = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const total = await Order.countDocuments(filter);

    // counts by paymentStatus & orderStatus in one go
    const [byPayment, byStatus] = await Promise.all([
      Order.aggregate([
        { $match: filter },
        { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: filter },
        { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
      ]),
    ]);

    res.json({
      total,
      byPaymentStatus: Object.fromEntries(byPayment.map((x) => [x._id, x.count])),
      byOrderStatus: Object.fromEntries(byStatus.map((x) => [x._id, x.count])),
    });
  } catch (err) {
    console.error("countOrders error:", err);
    res.status(500).json({ message: "Failed to count orders." });
  }
};

/** Summary (revenue, average ticket, within same filter/date range) */
exports.summary = async (req, res) => {
  try {
    const filter = buildFilter(req.query);

    const agg = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalItems: { $sum: "$itemCount" },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const s = agg[0] || { totalOrders: 0, totalItems: 0, totalAmount: 0 };
    const avgOrderValue = s.totalOrders ? s.totalAmount / s.totalOrders : 0;

    res.json({
      totalOrders: s.totalOrders,
      totalItems: s.totalItems,
      totalAmount: s.totalAmount,
      avgOrderValue,
    });
  } catch (err) {
    console.error("summary error:", err);
    res.status(500).json({ message: "Failed to compute summary." });
  }
};

/** Revenue grouped by day (or custom interval via `group=day|month|year`) */
exports.revenueByInterval = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const group = (req.query.group || "day").toLowerCase();

    let groupSpec;
    if (group === "month") groupSpec = { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } };
    else if (group === "year") groupSpec = { y: { $year: "$createdAt" } };
    else groupSpec = { y: { $year: "$createdAt" }, m: { $month: "$createdAt" }, d: { $dayOfMonth: "$createdAt" } };

    const data = await Order.aggregate([
      { $match: filter },
      { $group: { _id: groupSpec, revenue: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
      { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
    ]);

    res.json({ group, data });
  } catch (err) {
    console.error("revenueByInterval error:", err);
    res.status(500).json({ message: "Failed to compute revenue aggregation." });
  }
};

/** Top courses by order count (within filters/date range) */
exports.topCourses = async (req, res) => {
  try {
    const filter = buildFilter(req.query);

    const data = await Order.aggregate([
      { $match: filter },
      { $unwind: "$items" },
      { $group: { _id: "$items.course", orders: { $sum: 1 }, qty: { $sum: "$items.quantity" } } },
      { $sort: { orders: -1 } },
      { $limit: asNum(req.query.limit, 10) },
    ]);

    // enrich with course title/slug
    const ids = data.map((x) => x._id).filter(Boolean);
    const courses = await Course.find({ _id: { $in: ids } })
      .select("title slug thumbnail")
      .lean();
    const byId = new Map(courses.map((c) => [String(c._id), c]));

    const result = data.map((row) => ({
      courseId: row._id,
      orders: row.orders,
      quantity: row.qty,
      course: byId.get(String(row._id)) || null,
    }));

    res.json({ items: result });
  } catch (err) {
    console.error("topCourses error:", err);
    res.status(500).json({ message: "Failed to compute top courses." });
  }
};

/* --------------------------- BULK OPERATIONS -------------------------- */

exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { ids = [], orderStatus } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids array required." });
    }
    if (!orderStatus) return res.status(400).json({ message: "orderStatus required." });

    const _ids = ids.map(asObjectId).filter(Boolean);
    const r = await Order.updateMany({ _id: { $in: _ids } }, { $set: { orderStatus } });
    res.json({ matched: r.matchedCount ?? r.n, modified: r.modifiedCount ?? r.nModified });
  } catch (err) {
    console.error("bulkUpdateStatus error:", err);
    res.status(500).json({ message: "Failed to bulk update status." });
  }
};

exports.bulkMarkPaymentStatus = async (req, res) => {
  try {
    const { ids = [], paymentStatus } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids array required." });
    }
    if (!paymentStatus) return res.status(400).json({ message: "paymentStatus required." });

    const _ids = ids.map(asObjectId).filter(Boolean);

    // if Paid, also set confirmedAt
    const set = { paymentStatus };
    if (paymentStatus === "Paid") set.confirmedAt = new Date();

    const r = await Order.updateMany({ _id: { $in: _ids } }, { $set: set });
    res.json({ matched: r.matchedCount ?? r.n, modified: r.modifiedCount ?? r.nModified });
  } catch (err) {
    console.error("bulkMarkPaymentStatus error:", err);
    res.status(500).json({ message: "Failed to bulk update payment status." });
  }
};

exports.bulkArchive = async (req, res) => {
  try {
    const { ids = [], isArchived = true } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids array required." });
    }
    const _ids = ids.map(asObjectId).filter(Boolean);
    const r = await Order.updateMany({ _id: { $in: _ids } }, { $set: { isArchived: !!isArchived } });
    res.json({ matched: r.matchedCount ?? r.n, modified: r.modifiedCount ?? r.nModified });
  } catch (err) {
    console.error("bulkArchive error:", err);
    res.status(500).json({ message: "Failed to bulk archive." });
  }
};

exports.bulkDelete = async (req, res) => {
  try {
    const { ids = [] } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids array required." });
    }
    const _ids = ids.map(asObjectId).filter(Boolean);
    const r = await Order.deleteMany({ _id: { $in: _ids } });
    res.json({ deleted: r.deletedCount ?? 0 });
  } catch (err) {
    console.error("bulkDelete error:", err);
    res.status(500).json({ message: "Failed to bulk delete." });
  }
};

/* ------------------------------ EXTRAS ------------------------------- */

/** Export plain JSON list using same filters (for CSV export, convert on client) */
exports.exportJson = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const items = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "name email" })
      .populate({ path: "items.course", select: "title slug price thumbnail" })
      .lean();

    res.json({ items });
  } catch (err) {
    console.error("exportJson error:", err);
    res.status(500).json({ message: "Failed to export." });
  }
};
