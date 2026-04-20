// controllers/UserController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const User = require("../models/UserModel");
const Project = require("../models/ProjectModel");

// ====== AUTH HELPERS ======
const JWT_SECRET = process.env.JWT_SECRET || "ecoders_jwt_secret";

// Keep this only if you still want lightweight token-only validation for some routes.
// Otherwise you can remove it later. For now, keeping it avoids breaking features.
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      code: "NO_TOKEN",
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        code: "TOKEN_EXPIRED",
        message: "Token expired. Please login again.",
      });
    }

    return res.status(401).json({
      code: "TOKEN_INVALID",
      message: "Invalid token.",
    });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (req.user && ["admin", "superadmin"].includes(req.user.role)) {
    return next();
  }

  return res.status(403).json({ error: "Permission denied" });
};

// Keeping this to avoid breaking any existing imports.
// Internally it now behaves consistently.
exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      code: "NO_TOKEN",
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        code: "TOKEN_EXPIRED",
        message: "Token expired. Please login again.",
      });
    }

    return res.status(401).json({
      code: "TOKEN_INVALID",
      message: "Not authorized, token failed",
    });
  }
};

// ====== SEARCH / PAGINATION HELPERS ======
const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "of",
  "in",
  "on",
  "at",
  "to",
  "for",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "me",
  "him",
  "her",
  "us",
  "them",
  "this",
  "that",
  "these",
  "those",
  "there",
  "here",
  "please",
  "pls",
  "plz",
  "show",
  "find",
  "search",
  "look",
  "list",
  "user",
  "users",
  "role",
  "named",
  "called",
]);

const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const tokenize = (raw = "") => {
  const trimmed = String(raw).trim().toLowerCase();
  if (!trimmed) return [];

  return trimmed
    .split(/\s+/)
    .filter(Boolean)
    .filter((t) => !STOP_WORDS.has(t));
};

// ====== AVATAR UPLOAD (multer) ======
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const user = await User.findById(req.params.id);
      let uploadFolder = "uploads/";

      if (user?.role) uploadFolder += user.role;
      else uploadFolder += "others";

      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }

      cb(null, uploadFolder);
    } catch (err) {
      cb(err);
    }
  },

  filename: function (_req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});

exports.uploadAvatar = multer({ storage });

// ====== AUTH + USER CONTROLLERS ======
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.json({
      status: true,
      userToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const u = await User.findById(req.params.id);

    if (!u) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(u);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ====== OPTIMIZED ALL USERS ======
exports.getAllUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100,
    );
    const sort = req.query.sort === "desc" ? -1 : 1;
    const rawSearch = req.query.search || "";

    const tokens = tokenize(rawSearch);

    let query = {};

    if (tokens.length > 0) {
      query = {
        $and: tokens.map((token) => {
          const safe = escapeRegex(token);

          return {
            $or: [
              { name: { $regex: safe, $options: "i" } },
              { email: { $regex: safe, $options: "i" } },
              { role: { $regex: safe, $options: "i" } },
            ],
          };
        }),
      };
    }

    const totalUsers = await User.countDocuments(query);

    const users = await User.find(query)
      .sort({ name: sort, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.json({
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalUsers / limit)),
      limit,
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    return res.status(500).json({
      message: "Server error",
      users: [],
      totalUsers: 0,
      currentPage: 1,
      totalPages: 1,
      limit: 10,
    });
  }
};

exports.updateUser = async (req, res) => {
  const { name, email, phone, street, city, state, postalCode, country } =
    req.body;

  try {
    const u = await User.findById(req.params.id);

    if (!u) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (name) u.name = name;
    if (email) u.email = email;
    if (phone) u.phone = phone;

    if (street || city || state || postalCode || country) {
      u.address = u.address || {};

      if (street) u.address.street = street;
      if (city) u.address.city = city;
      if (state) u.address.state = state;
      if (postalCode) u.address.postalCode = postalCode;
      if (country) u.address.country = country;
    }

    if (req.file) {
      const uploadFolder = `uploads/${u.role || "others"}`;
      u.avatar = `${uploadFolder}/${req.file.filename}`;
    }

    u.updatedAt = Date.now();

    await u.save();

    return res.status(200).json({
      msg: "User updated successfully",
      user: u,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).send("Server error");
  }
};

// ====== UPDATE USER ROLE ======
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    user.updatedAt = Date.now();

    await user.save();

    return res.status(200).json({
      message: `User role updated successfully to ${role}`,
      user,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findByIdAndDelete(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userToDelete.avatar) {
      const imagePath = path.isAbsolute(userToDelete.avatar)
        ? userToDelete.avatar
        : path.join(__dirname, "..", userToDelete.avatar);

      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Error deleting image file:", err);
        });
      }
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
};

// ====== USER LISTS ======
exports.listDevelopers = async (_req, res) => {
  try {
    const devs = await User.find({ role: "developer" });
    return res.status(200).json(devs);
  } catch (error) {
    console.error("Error fetching developers:", error);
    return res.status(500).json({ message: "Error fetching developers" });
  }
};

exports.listTestEngineers = async (_req, res) => {
  try {
    const tes = await User.find({ role: "test_engineer" });
    return res.status(200).json(tes);
  } catch (error) {
    console.error("Error fetching test engineers:", error);
    return res.status(500).json({ message: "Error fetching test engineers" });
  }
};

// ====== COUNTS ======
exports.countDevelopersFromProjects = async (_req, res) => {
  try {
    const agg = await Project.aggregate([
      { $unwind: "$developers" },
      { $group: { _id: "$developers" } },
      { $count: "totalDevelopers" },
    ]);

    return res.json({ totalDevelopers: agg[0]?.totalDevelopers || 0 });
  } catch (error) {
    console.error("Error fetching developers count:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.countByRole = (role) => async (_req, res) => {
  try {
    const total = await User.countDocuments({ role });

    return res.json({
      [`total${role.replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase())}`]:
        total,
    });
  } catch (error) {
    console.error(`Error fetching ${role} count:`, error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.countUsersSummary = async (_req, res) => {
  try {
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalSuperAdmins = await User.countDocuments({ role: "superadmin" });
    const totalQALeads = await User.countDocuments({ role: "qa_lead" });
    const totalTestEngineers = await User.countDocuments({
      role: "test_engineer",
    });
    const totalDevelopers = await User.countDocuments({ role: "developer" });
    const totalUsers = await User.countDocuments({});

    return res.json({
      totalUsers,
      totalAdmins,
      totalSuperAdmins,
      totalQALeads,
      totalTestEngineers,
      totalDevelopers,
    });
  } catch (error) {
    console.error("Error fetching user counts:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// ====== APPROVER / REVIEW LISTS ======
exports.listApproverEligibleUsers = async (_req, res) => {
  try {
    const roles = [
      "superadmin",
      "admin",
      "test_lead",
      "developer_lead",
      "develpment_lead",
      "business_analyst",
      "Business_analyst",
      "qa_lead",
    ];

    const users = await User.find({ role: { $in: roles } }).select(
      "_id name email role",
    );

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching approver-eligible users:", error);
    return res.status(500).json({ message: "Error fetching approvers" });
  }
};

const APPROVER_ROLES = [
  "superadmin",
  "admin",
  "test_lead",
  "developer_lead",
  "business_analyst",
  "qa_lead",
];

/** All users for "Reviewed By" dropdown (id, name, role) */
exports.listAllForReview = async (_req, res) => {
  try {
    const users = await User.find({}, "_id name role").sort({ name: 1 }).lean();
    return res.json(users);
  } catch (e) {
    console.error("listAllForReview error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

/** Only approvers for "Approved By" dropdown (id, name, role) */
exports.listApprovers = async (_req, res) => {
  try {
    const users = await User.find(
      { role: { $in: APPROVER_ROLES } },
      "_id name role",
    )
      .sort({ name: 1 })
      .lean();

    return res.json(users);
  } catch (e) {
    console.error("listApprovers error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};
