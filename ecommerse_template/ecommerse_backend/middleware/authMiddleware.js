const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "ecoders_jwt_secret",
    );

    req.user = {
      ...decoded,
      _id: decoded._id || decoded.id || decoded.userId,
      id: decoded.id || decoded._id || decoded.userId,
    };

    return next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token. Please login again.",
    });
  }
};

exports.verifyTokenOptional = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      ...decoded,
      _id: decoded._id || decoded.id || decoded.userId,
      id: decoded.id || decoded._id || decoded.userId,
    };

    return next();
  } catch (err) {
    req.user = null;
    return next();
  }
};

exports.isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Access denied. Superadmin only." });
  }

  return next();
};
