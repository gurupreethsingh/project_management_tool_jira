// controllers/NotificationController.js
const mongoose = require("mongoose");
const NotificationMessage = require("../models/NotificationMessage");
const NotificationReceipt = require("../models/NotificationReceipt");
const User = require("../models/UserModel");

/**
 * Build a "visible to user" $match for NotificationMessage,
 * then we left-join per-user NotificationReceipt as needed.
 */
const visibleMessagesQuery = (userId, userRole) => ({
  isDeleted: false,
  $or: [
    { audience: "all" },
    { audience: "role", receiverRole: userRole },
    { audience: "user", receiver: new mongoose.Types.ObjectId(userId) },
  ],
});

/* =========================
 * CREATE / SEND
 * =======================*/

// 1) Broadcast to absolutely everyone (ONE doc)
exports.sendToAbsolutelyAll = async (req, res) => {
  try {
    const sender = req.user?._id;
    const { message, priority = "low", type = "task_update" } = req.body;

    if (!sender) return res.status(401).json({ message: "Unauthorized" });
    if (!message) return res.status(400).json({ message: "Message is required" });

    const doc = await NotificationMessage.create({
      audience: "all",
      sender,
      message,
      priority,
      type,
    });

    return res.status(200).json({ message: "Broadcast created", id: doc._id });
  } catch (error) {
    console.error("sendToAbsolutelyAll ERROR:", error);
    res.status(500).json({ message: "Error sending to all users", error: error.message });
  }
};

// 2) Broadcast to a role (ONE doc)
exports.sendNotificationToAll = async (req, res) => {
  try {
    const sender = req.user?._id;
    const { receiverRole, message, priority = "low", type = "task_update" } = req.body;

    if (!sender) return res.status(401).json({ message: "Unauthorized" });
    if (!receiverRole) return res.status(400).json({ message: "receiverRole is required" });
    if (!message) return res.status(400).json({ message: "Message is required" });

    const doc = await NotificationMessage.create({
      audience: "role",
      sender,
      receiverRole,
      message,
      priority,
      type,
    });

    return res.status(200).json({ message: "Role broadcast created", id: doc._id });
  } catch (error) {
    console.error("sendNotificationToAll ERROR:", error);
    res.status(500).json({ message: "Error sending notifications", error: error.message });
  }
};

// 3) Send to a single user (ONE doc)
exports.sendNotificationToOne = async (req, res) => {
  try {
    const sender = req.user?._id;
    const { receiver, receiverRole, message, priority = "low", type = "task_update" } = req.body;

    if (!sender) return res.status(401).json({ message: "Unauthorized" });
    if (!receiver || !mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({ message: "Invalid or missing receiver" });
    }
    if (!message) return res.status(400).json({ message: "Message is required" });

    const doc = await NotificationMessage.create({
      audience: "user",
      sender,
      receiver,
      receiverRole: receiverRole || undefined,
      message,
      priority,
      type,
    });

    return res.status(201).json({ message: "Notification created", id: doc._id });
  } catch (error) {
    console.error("sendNotificationToOne ERROR:", error);
    res.status(500).json({ message: "Error sending notification", error: error.message });
  }
};

/* =========================
 * USER INBOX / ACTIONS
 * =======================*/

// 4) Inbox for a user (messages + joined receipt)
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const pipeline = [
      { $match: visibleMessagesQuery(userId, user.role) },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "notificationreceipts",
          let: { msgId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$message", "$$msgId"] },
                    { $eq: ["$user", new mongoose.Types.ObjectId(userId)] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: "receipt",
        },
      },
      {
        $addFields: {
          receipt: { $arrayElemAt: ["$receipt", 0] },
          isRead: { $ifNull: [{ $arrayElemAt: ["$receipt.isRead", 0] }, false] },
          statusForUser: { $ifNull: [{ $arrayElemAt: ["$receipt.status", 0] }, "unread"] },
        },
      },
    ];

    const rows = await NotificationMessage.aggregate(pipeline);
    res.status(200).json(rows);
  } catch (error) {
    console.error("getUserNotifications ERROR:", error);
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
};

// 5) Mark as read (upsert receipt)
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const updated = await NotificationReceipt.findOneAndUpdate(
      { message: notificationId, user: userId },
      { isRead: true, status: "read", readAt: new Date(), isDeleted: false },
      { new: true, upsert: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("markAsRead ERROR:", error);
    res.status(500).json({ message: "Error marking as read", error: error.message });
  }
};

// 6) Mark as seen (upsert receipt)
exports.markAsSeen = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const updated = await NotificationReceipt.findOneAndUpdate(
      { message: notificationId, user: userId },
      { status: "seen", seenAt: new Date(), isDeleted: false },
      { new: true, upsert: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("markAsSeen ERROR:", error);
    res.status(500).json({ message: "Error marking as seen", error: error.message });
  }
};

// 7) Reply (upsert receipt)
exports.replyToNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { replyContent } = req.body;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const updated = await NotificationReceipt.findOneAndUpdate(
      { message: notificationId, user: userId },
      {
        status: "replied",
        reply: { content: replyContent, repliedAt: new Date() },
        isDeleted: false,
      },
      { new: true, upsert: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("replyToNotification ERROR:", error);
    res.status(500).json({ message: "Error replying", error: error.message });
  }
};

// 8) Soft delete for a user (hide via receipt)
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const updated = await NotificationReceipt.findOneAndUpdate(
      { message: notificationId, user: userId },
      { isDeleted: true },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Notification hidden for user", updated });
  } catch (error) {
    console.error("deleteNotification ERROR:", error);
    res.status(500).json({ message: "Error deleting", error: error.message });
  }
};

/* =========================
 * COUNTS
 * =======================*/

// 9) Per-user counts: total / unread / read / seen / replied (excludes hidden)
exports.countNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const matchMessages = visibleMessagesQuery(userId, user.role);

    const rows = await NotificationMessage.aggregate([
      { $match: matchMessages },
      {
        $lookup: {
          from: "notificationreceipts",
          let: { msgId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$message", "$$msgId"] },
                    { $eq: ["$user", new mongoose.Types.ObjectId(userId)] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: "receipt",
        },
      },
      { $addFields: { receipt: { $arrayElemAt: ["$receipt", 0] } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          read: {
            $sum: { $cond: [{ $eq: ["$receipt.status", "read"] }, 1, 0] },
          },
          seen: {
            $sum: { $cond: [{ $eq: ["$receipt.status", "seen"] }, 1, 0] },
          },
          replied: {
            $sum: { $cond: [{ $eq: ["$receipt.status", "replied"] }, 1, 0] },
          },
        },
      },
      {
        $addFields: {
          unread: {
            $subtract: [
              "$total",
              { $add: ["$read", "$seen", "$replied"] },
            ],
          },
        },
      },
      { $project: { _id: 0, total: 1, unread: 1, read: 1, seen: 1, replied: 1 } },
    ]);

    const result = rows[0] || { total: 0, unread: 0, read: 0, seen: 0, replied: 0 };
    res.status(200).json(result);
  } catch (error) {
    console.error("countNotifications ERROR:", error);
    res.status(500).json({ message: "Error counting notifications", error: error.message });
  }
};

// 10) Role counts: how many messages have been sent *to that role*
// Options: includeAll=true => counts also include global broadcasts
exports.countByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const includeAll = String(req.query.includeAll || "false") === "true";

    const match = { isDeleted: false, $or: [] };
    if (includeAll) match.$or.push({ audience: "all" });
    match.$or.push({ audience: "role", receiverRole: role });

    // If includeAll=false and $or has only one entry, simplify
    if (!includeAll) delete match.$or[0];

    const rows = await NotificationMessage.aggregate([
      { $match: match.$or ? match : { audience: "role", receiverRole: role, isDeleted: false } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byType: { $push: "$type" },
          byPriority: { $push: "$priority" },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          // Optional tiny breakdowns
          typeBreakdown: {
            $arrayToObject: {
              $map: {
                input: { $setUnion: ["$byType", []] },
                as: "t",
                in: [
                  "$$t",
                  { $size: { $filter: { input: "$byType", as: "x", cond: { $eq: ["$$x", "$$t"] } } } },
                ],
              },
            },
          },
          priorityBreakdown: {
            $arrayToObject: {
              $map: {
                input: { $setUnion: ["$byPriority", []] },
                as: "p",
                in: [
                  "$$p",
                  { $size: { $filter: { input: "$byPriority", as: "y", cond: { $eq: ["$$y", "$$p"] } } } },
                ],
              },
            },
          },
        },
      },
    ]);

    const result = rows[0] || { total: 0, typeBreakdown: {}, priorityBreakdown: {} };
    res.status(200).json(result);
  } catch (error) {
    console.error("countByRole ERROR:", error);
    res.status(500).json({ message: "Error counting role notifications", error: error.message });
  }
};

// 11) Admin global counts
exports.countAllMessages = async (_req, res) => {
  try {
    const rows = await NotificationMessage.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$audience",
          count: { $sum: 1 },
        },
      },
    ]);

    // reshape
    const counts = rows.reduce((acc, r) => {
      acc[r._id] = r.count;
      return acc;
    }, { all: 0, role: 0, user: 0 });

    counts.total = (counts.all || 0) + (counts.role || 0) + (counts.user || 0);

    res.status(200).json(counts);
  } catch (error) {
    console.error("countAllMessages ERROR:", error);
    res.status(500).json({ message: "Error counting all messages", error: error.message });
  }
};

/* =========================
 * LISTING (ADMIN / ROLE)
 * =======================*/

// 12) Admin list all messages (filters + pagination)
exports.adminListAllMessages = async (req, res) => {
  try {
    const {
      audience,           // "all" | "role" | "user"
      role,               // receiverRole filter
      type,               // "task_update" | "bug_report" | ...
      priority,           // "low" | "medium" | "high" | "urgent"
      from,               // ISO date
      to,                 // ISO date
      page = 1,
      limit = 20,
      sort = "-createdAt",
    } = req.query;

    const match = { isDeleted: false };
    if (audience) match.audience = audience;
    if (role) match.receiverRole = role;
    if (type) match.type = type;
    if (priority) match.priority = priority;

    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [rows, total] = await Promise.all([
      NotificationMessage.find(match)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      NotificationMessage.countDocuments(match),
    ]);

    res.status(200).json({
      data: rows,
      page: Number(page),
      limit: Number(limit),
      total,
    });
  } catch (error) {
    console.error("adminListAllMessages ERROR:", error);
    res.status(500).json({ message: "Error listing messages", error: error.message });
  }
};

// 13) Role list (messages addressed to that role; optional includeAll)
exports.listMessagesByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const {
      includeAll = "false",
      type,
      priority,
      page = 1,
      limit = 20,
      sort = "-createdAt",
    } = req.query;

    const includeGlobal = String(includeAll) === "true";

    const match = { isDeleted: false, $or: [] };
    if (includeGlobal) match.$or.push({ audience: "all" });
    match.$or.push({ audience: "role", receiverRole: role });

    if (!includeGlobal) {
      // only role audience
      delete match.$or; // simplify
      match.audience = "role";
      match.receiverRole = role;
    }

    if (type) match.type = type;
    if (priority) match.priority = priority;

    const skip = (Number(page) - 1) * Number(limit);

    const [rows, total] = await Promise.all([
      NotificationMessage.find(match)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      NotificationMessage.countDocuments(match),
    ]);

    res.status(200).json({
      data: rows,
      page: Number(page),
      limit: Number(limit),
      total,
    });
  } catch (error) {
    console.error("listMessagesByRole ERROR:", error);
    res.status(500).json({ message: "Error listing role messages", error: error.message });
  }
};
