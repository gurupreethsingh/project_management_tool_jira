// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const JWT_SECRET = process.env.JWT_SECRET || "ecoders_jwt_secret";

const protect = async (req, res, next) => {
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
  } catch (err) {
    console.error("JWT Error:", err.name, err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        code: "TOKEN_EXPIRED",
        message: "Token expired. Please login again.",
      });
    }

    return res.status(401).json({
      code: "TOKEN_INVALID",
      message: "Token verification failed",
    });
  }
};

const isAdmin = (req, res, next) =>
  req.user?.role === "admin"
    ? next()
    : res.status(403).json({ message: "Admin access denied" });

const isSuperadmin = (req, res, next) =>
  req.user?.role === "superadmin"
    ? next()
    : res.status(403).json({ message: "Superadmin access denied" });

const isAdminOrSuperadmin = (req, res, next) =>
  ["admin", "superadmin"].includes(req.user?.role)
    ? next()
    : res.status(403).json({ message: "Access denied" });

const isPMorAdmin = (req, res, next) =>
  ["project_manager", "admin", "superadmin"].includes(req.user?.role)
    ? next()
    : res.status(403).json({ message: "Access denied" });

const isDeveloperLead = (req, res, next) =>
  req.user?.role === "developer_lead"
    ? next()
    : res.status(403).json({ message: "Developer Lead access denied" });

const isTestLead = (req, res, next) =>
  req.user?.role === "test_lead"
    ? next()
    : res.status(403).json({ message: "Test Lead access denied" });

const isQALead = (req, res, next) =>
  req.user?.role === "qa_lead"
    ? next()
    : res.status(403).json({ message: "QA Lead access denied" });

const isBusinessAnalyst = (req, res, next) =>
  req.user?.role === "business_analyst"
    ? next()
    : res.status(403).json({ message: "Business Analyst access denied" });

const isDeveloper = (req, res, next) =>
  req.user?.role === "developer"
    ? next()
    : res.status(403).json({ message: "Developer access denied" });

const isTestEngineer = (req, res, next) =>
  req.user?.role === "test_engineer"
    ? next()
    : res.status(403).json({ message: "Test Engineer access denied" });

module.exports = {
  protect,
  isAdmin,
  isSuperadmin,
  isAdminOrSuperadmin,
  isPMorAdmin,
  isDeveloperLead,
  isTestLead,
  isQALead,
  isBusinessAnalyst,
  isDeveloper,
  isTestEngineer,
};
