const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

// Middleware to protect routes using JWT
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "ecoders_jwt_secret");

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next(); // Allow access
    } catch (error) {
      return res.status(403).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to check if the user is admin or superadmin
const isAdminOrSuperadmin = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "admin" || req.user.role === "superadmin")
  ) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
};

module.exports = {
  protect,
  isAdminOrSuperadmin,
};
