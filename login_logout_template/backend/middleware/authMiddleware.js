const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const ACCESS_TOKEN_SECRET =
  process.env.JWT_SECRET || "dev_access_secret_change_me";

const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in requireSignIn middleware:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

const checkRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access.",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to access this resource.",
        });
      }

      next();
    } catch (error) {
      console.log("Error in role authorization middleware:", error);

      return res.status(500).json({
        success: false,
        message: "Authorization check failed.",
      });
    }
  };
};

const isSuperAdmin = checkRoles("superadmin");
const isAdmin = checkRoles("superadmin");
const adminMiddleware = checkRoles("superadmin");
const authorizeRoles = (...roles) => checkRoles(...roles);

module.exports = {
  requireSignIn,
  requireSignin: requireSignIn,
  isAuthenticatedUser: requireSignIn,
  protect: requireSignIn,
  verifyToken: requireSignIn,
  isSuperAdmin,
  isAdmin,
  adminMiddleware,
  authorizeRoles,
};
