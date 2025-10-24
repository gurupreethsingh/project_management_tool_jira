// controllers/UserController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const User = require("../models/UserModel");
const Project = require("../models/ProjectModel");

// ====== AUTH HELPERS (exported) ======
const JWT_SECRET = process.env.JWT_SECRET || "ecoders_jwt_secret";

exports.authenticateToken = (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
  }
  return res.status(401).json({ message: "No token provided" });
};

exports.requireAdmin = (req, res, next) => {
  if (req.user && ["admin", "superadmin"].includes(req.user.role))
    return next();
  return res.status(403).json({ error: "Permission denied" });
};

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) return res.status(401).json({ message: "User not found" });
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  return res.status(401).json({ message: "Not authorized, no token" });
};

// ====== AVATAR UPLOAD (multer) ======
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const user = await User.findById(req.params.id);
      let uploadFolder = "uploads/";
      if (user?.role) uploadFolder += user.role;
      else uploadFolder += "others";
      if (!fs.existsSync(uploadFolder))
        fs.mkdirSync(uploadFolder, { recursive: true });
      cb(null, uploadFolder);
    } catch (err) {
      cb(err);
    }
  },
  filename: function (_req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
exports.uploadAvatar = multer({ storage });

// ====== AUTH + USER CONTROLLERS ======
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

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
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const userToken = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
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
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: "User not found" });
    res.json(u);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (_req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  const { name, email, phone, street, city, state, postalCode, country } =
    req.body;
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ msg: "User not found" });

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

    res.status(200).json({ msg: "User updated successfully", user: u });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).send("Server error");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findByIdAndDelete(req.params.id);
    if (!userToDelete) return res.status(404).json({ error: "User not found" });

    if (userToDelete.avatar) {
      // avatar may already include folders; be defensive resolving
      const imagePath = path.isAbsolute(userToDelete.avatar)
        ? userToDelete.avatar
        : path.join(__dirname, "..", "uploads", userToDelete.avatar);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Error deleting image file:", err);
        });
      }
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// ====== USER LISTS ======
exports.listDevelopers = async (_req, res) => {
  try {
    const devs = await User.find({ role: "developer" });
    res.status(200).json(devs);
  } catch (error) {
    console.error("Error fetching developers:", error);
    res.status(500).json({ message: "Error fetching developers" });
  }
};

exports.listTestEngineers = async (_req, res) => {
  try {
    const tes = await User.find({ role: "test_engineer" });
    res.status(200).json(tes);
  } catch (error) {
    console.error("Error fetching test engineers:", error);
    res.status(500).json({ message: "Error fetching test engineers" });
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
    res.json({ totalDevelopers: agg[0]?.totalDevelopers || 0 });
  } catch (error) {
    console.error("Error fetching developers count:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.countByRole = (role) => async (_req, res) => {
  try {
    const total = await User.countDocuments({ role });
    res.json({
      [`total${role.replace(/(^|\_)(\w)/g, (_, __, c) => c.toUpperCase())}`]:
        total,
    });
  } catch (error) {
    console.error(`Error fetching ${role} count:`, error);
    res.status(500).json({ error: "Server error" });
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
    res.json({
      totalUsers,
      totalAdmins,
      totalSuperAdmins,
      totalQALeads,
      totalTestEngineers,
      totalDevelopers,
    });
  } catch (error) {
    console.error("Error fetching user counts:", error);
    res.status(500).json({ error: "Server error" });
  }
};
