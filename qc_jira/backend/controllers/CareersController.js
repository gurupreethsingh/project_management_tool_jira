// controllers/CareersController.js
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const nodemailer = require("nodemailer");

const CareerApplication = require("../models/CareersModel");

// ====== MULTER STORAGE (uploads/careers/...) ======
const CAREERS_UPLOAD_ROOT = path.join(__dirname, "..", "uploads", "careers");

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    try {
      const dest = CAREERS_UPLOAD_ROOT;
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      cb(null, dest);
    } catch (err) {
      cb(err);
    }
  },
  filename: function (_req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/[^\w.\-]/g, "_");
    cb(null, unique + "-" + safeName);
  },
});

const fileFilter = (_req, file, cb) => {
  // Allow most docs & images; you can tighten this later.
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];
  if (!allowed.includes(file.mimetype)) {
    return cb(
      new Error("Unsupported file type. Please upload PDF/DOC/PNG/JPG."),
      false
    );
  }
  cb(null, true);
};

exports.uploadCareersFiles = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file
    files: 10,
  },
}).array("files", 10);

// ====== MAILER SETUP ======
let transporter = null;
function getTransporter() {
  if (transporter) return transporter;

  // Expect env like:
  // MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_FROM
  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_SECURE, MAIL_FROM } =
    process.env;

  if (!MAIL_HOST || !MAIL_PORT) {
    console.warn("[careers] Mail transport not fully configured.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    secure: MAIL_SECURE === "true", // true for 465, false for others
    auth: MAIL_USER
      ? {
          user: MAIL_USER,
          pass: MAIL_PASS,
        }
      : undefined,
  });

  transporter.verify().catch((err) => {
    console.warn("[careers] Mail transport verify failed:", err.message);
  });

  transporter._defaultFrom = MAIL_FROM || MAIL_USER;

  return transporter;
}

async function sendMailSafe(options) {
  const t = getTransporter();
  if (!t) {
    console.warn("[careers] Skipping email send; transporter not configured.");
    return false;
  }
  try {
    await t.sendMail(options);
    return true;
  } catch (err) {
    console.error("[careers] Email send failed:", err.message);
    return false;
  }
}

// ====== CONTROLLERS ======

/**
 * POST /api/careers/apply
 * Public endpoint – no login required.
 * Uses uploadCareersFiles middleware for files.
 */
exports.apply = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      applyType,
      desiredRole,
      experienceLevel,
      preferredLocation,
      portfolioUrl,
      linkedinUrl,
      aboutYou,
      jobId,
    } = req.body;

    if (!fullName || !email || !aboutYou || !applyType) {
      return res.status(400).json({
        status: false,
        message: "fullName, email, applyType and aboutYou are required.",
      });
    }

    const filesMeta = (req.files || []).map((f) => {
      const relPath = path
        .relative(path.join(__dirname, ".."), f.path)
        .replace(/\\/g, "/");
      return {
        fieldName: f.fieldname,
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
        path: relPath,
        url: `/uploads/${relPath.replace(/^uploads\//, "")}`,
      };
    });

    const doc = new CareerApplication({
      fullName,
      email,
      phone,
      applyType: applyType === "job" ? "job" : "internship",
      desiredRole,
      experienceLevel,
      preferredLocation,
      portfolioUrl,
      linkedinUrl,
      aboutYou,
      jobId: jobId || null,
      files: filesMeta,
      ipAddress:
        req.headers["x-forwarded-for"] || req.connection.remoteAddress || null,
      userAgent: req.headers["user-agent"] || null,
    });

    await doc.save();

    // ✅ No email sending here at all

    return res.status(201).json({
      status: true,
      message: "Application submitted successfully.",
      applicationId: doc._id,
    });
  } catch (err) {
    console.error("[careers.apply] error:", err);
    return res.status(500).json({
      status: false,
      message: "Server error while submitting application.",
    });
  }
};

/**
 * GET /api/careers
 * Admin only – list applications with filters, sorting & pagination.
 */
exports.list = async (req, res) => {
  try {
    const {
      status,
      applyType,
      q,
      fromDate,
      toDate,
      sort = "-createdAt",
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { isDeleted: false };

    if (status && status !== "all") filter.status = status;
    if (applyType && applyType !== "all") filter.applyType = applyType;

    if (q) {
      const regex = new RegExp(q.trim(), "i");
      filter.$or = [
        { fullName: regex },
        { email: regex },
        { desiredRole: regex },
        { experienceLevel: regex },
        { preferredLocation: regex },
        { aboutYou: regex },
      ];
    }

    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 200);

    const [items, total] = await Promise.all([
      CareerApplication.find(filter)
        .sort(sort)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      CareerApplication.countDocuments(filter),
    ]);

    return res.json({
      status: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      items,
    });
  } catch (err) {
    console.error("[careers.list] error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Error fetching applications." });
  }
};

/**
 * GET /api/careers/:id
 * Admin only – get one application.
 */
exports.getById = async (req, res) => {
  try {
    const app = await CareerApplication.findById(req.params.id);
    if (!app || app.isDeleted) {
      return res
        .status(404)
        .json({ status: false, message: "Application not found." });
    }
    return res.json({ status: true, item: app });
  } catch (err) {
    console.error("[careers.getById] error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Error fetching application." });
  }
};

/**
 * PATCH /api/careers/:id/status
 * Admin only – accept / reject / shortlist / on_hold.
 * Optional: send status email to applicant.
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status, internalNotes, sendEmail } = req.body;
    const allowed = [
      "pending",
      "shortlisted",
      "accepted",
      "rejected",
      "on_hold",
    ];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        status: false,
        message: "Invalid status value.",
      });
    }

    const app = await CareerApplication.findById(req.params.id);
    if (!app || app.isDeleted) {
      return res
        .status(404)
        .json({ status: false, message: "Application not found." });
    }

    app.status = status;
    if (internalNotes !== undefined) {
      app.internalNotes = internalNotes;
    }

    if (req.user && req.user.id) {
      app.reviewedBy = req.user.id;
      app.reviewedAt = new Date();
    }

    await app.save();

    // Send status update email if requested
    if (sendEmail && app.email) {
      const friendly =
        status === "accepted"
          ? "accepted"
          : status === "rejected"
          ? "not moving forward"
          : status === "shortlisted"
          ? "shortlisted for next steps"
          : status === "on_hold"
          ? "kept on hold for now"
          : "under review";

      const sent = await sendMailSafe({
        from: getTransporter()?._defaultFrom,
        to: app.email,
        subject: `Update on your application to Ecoders`,
        text: `Hi ${app.fullName},

This is an update regarding your ${app.applyType} application with Ecoders.

Current status: ${friendly}.

If you have any questions, feel free to reply to this email.

Best,
Ecoders Careers`,
      });

      if (sent) {
        app.statusEmailSent = true;
        await app.save();
      }
    }

    return res.json({ status: true, message: "Status updated.", item: app });
  } catch (err) {
    console.error("[careers.updateStatus] error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Error updating status." });
  }
};

/**
 * PATCH /api/careers/:id
 * Admin only – generic update (notes, links, etc).
 */
exports.update = async (req, res) => {
  try {
    const updates = {};
    const allowedFields = [
      "desiredRole",
      "experienceLevel",
      "preferredLocation",
      "portfolioUrl",
      "linkedinUrl",
      "internalNotes",
    ];

    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const app = await CareerApplication.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: updates },
      { new: true }
    );

    if (!app) {
      return res
        .status(404)
        .json({ status: false, message: "Application not found." });
    }

    return res.json({
      status: true,
      message: "Application updated.",
      item: app,
    });
  } catch (err) {
    console.error("[careers.update] error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Error updating application." });
  }
};

/**
 * DELETE /api/careers/:id
 * Admin only – soft delete (keeps data but hides in UI).
 */
exports.softDelete = async (req, res) => {
  try {
    const app = await CareerApplication.findById(req.params.id);
    if (!app || app.isDeleted) {
      return res
        .status(404)
        .json({ status: false, message: "Application not found." });
    }
    app.isDeleted = true;
    await app.save();
    return res.json({ status: true, message: "Application deleted (soft)." });
  } catch (err) {
    console.error("[careers.softDelete] error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Error deleting application." });
  }
};

/**
 * POST /api/careers/bulk-status
 * Admin only – bulk status update.
 * body: { ids: [], status: "accepted" }
 */
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || !ids.length) {
      return res
        .status(400)
        .json({ status: false, message: "No IDs provided." });
    }
    const allowed = [
      "pending",
      "shortlisted",
      "accepted",
      "rejected",
      "on_hold",
    ];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        status: false,
        message: "Invalid status value.",
      });
    }

    const result = await CareerApplication.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      {
        $set: {
          status,
          reviewedBy: req.user ? req.user.id : undefined,
          reviewedAt: new Date(),
        },
      }
    );

    return res.json({
      status: true,
      message: "Bulk status update completed.",
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err) {
    console.error("[careers.bulkUpdateStatus] error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Error in bulk status update." });
  }
};

/**
 * POST /api/careers/bulk-delete
 * Admin only – soft delete multiple.
 */
exports.bulkSoftDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length) {
      return res
        .status(400)
        .json({ status: false, message: "No IDs provided." });
    }

    const result = await CareerApplication.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      { $set: { isDeleted: true } }
    );

    return res.json({
      status: true,
      message: "Bulk delete completed.",
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err) {
    console.error("[careers.bulkSoftDelete] error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Error in bulk delete." });
  }
};

/**
 * GET /api/careers/counts
 * Admin – summary counts (status + type).
 */
exports.countsSummary = async (_req, res) => {
  try {
    const [byStatus, byType, total] = await Promise.all([
      CareerApplication.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      CareerApplication.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: "$applyType", count: { $sum: 1 } } },
      ]),
      CareerApplication.countDocuments({ isDeleted: false }),
    ]);

    const statusMap = {};
    byStatus.forEach((s) => {
      statusMap[s._id] = s.count;
    });

    const typeMap = {};
    byType.forEach((t) => {
      typeMap[t._id] = t.count;
    });

    return res.json({
      status: true,
      total,
      byStatus: statusMap,
      byType: typeMap,
    });
  } catch (err) {
    console.error("[careers.countsSummary] error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Error fetching counts." });
  }
};

/**
 * GET /api/careers/:id/files/:fileId
 * Admin – stream a specific uploaded file.
 */
exports.downloadFile = async (req, res) => {
  try {
    const app = await CareerApplication.findById(req.params.id);
    if (!app || app.isDeleted) {
      return res
        .status(404)
        .json({ status: false, message: "Application not found." });
    }

    const file = app.files.id(req.params.fileId);
    if (!file) {
      return res
        .status(404)
        .json({ status: false, message: "File not found." });
    }

    const absPath = path.join(__dirname, "..", file.path);
    if (!fs.existsSync(absPath)) {
      return res
        .status(404)
        .json({ status: false, message: "File not found on disk." });
    }

    return res.download(absPath, file.originalName);
  } catch (err) {
    console.error("[careers.downloadFile] error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Error downloading file." });
  }
};

/**
 * POST /api/careers/:id/email
 * Admin only – send a custom email to the applicant.
 * body: { subject, body, status? }
 * - if status is provided, update status too.
 */
exports.sendEmail = async (req, res) => {
  try {
    const { subject, body, status } = req.body;

    if (!subject || !body) {
      return res
        .status(400)
        .json({ status: false, message: "subject and body are required." });
    }

    const app = await CareerApplication.findById(req.params.id);
    if (!app || app.isDeleted) {
      return res
        .status(404)
        .json({ status: false, message: "Application not found." });
    }

    if (!app.email) {
      return res
        .status(400)
        .json({ status: false, message: "Application has no email address." });
    }

    // Optional status update (accept/reject/shortlist/on_hold/pending)
    const allowedStatuses = [
      "pending",
      "shortlisted",
      "accepted",
      "rejected",
      "on_hold",
    ];
    if (status && allowedStatuses.includes(status)) {
      app.status = status;
      if (req.user && req.user.id) {
        app.reviewedBy = req.user.id;
        app.reviewedAt = new Date();
      }
      await app.save();
    }

    const ok = await sendMailSafe({
      from: getTransporter()?._defaultFrom,
      to: app.email,
      subject,
      text: body,
    });

    if (!ok) {
      return res.status(500).json({
        status: false,
        message: "Failed to send email (mailer not configured or error).",
      });
    }

    app.statusEmailSent = true;
    await app.save();

    return res.json({
      status: true,
      message: "Email sent successfully.",
      item: app,
    });
  } catch (err) {
    console.error("[careers.sendEmail] error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Error sending email." });
  }
};
