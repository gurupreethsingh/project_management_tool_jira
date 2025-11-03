// middleware/auth.js
const jwt = require("jsonwebtoken");

const AUTH_DEBUG = String(process.env.AUTH_DEBUG || "").toLowerCase() === "true";

/** Extract a raw token from Authorization header (supports a few messy cases) */
function extractBearerToken(req) {
  let hdr = req.headers.authorization || req.headers.Authorization;

  // Express can join duplicate headers with comma; normalize to string
  if (Array.isArray(hdr)) hdr = hdr.join(", ");
  if (typeof hdr !== "string") hdr = String(hdr || "");

  if (!hdr) return null;

  // If there are multiple comma-separated values, take the last one (most specific)
  const lastPart = hdr.split(",").map(s => s.trim()).filter(Boolean).pop() || "";

  // Accept "Bearer <token>" or just "<token>"
  let raw = lastPart.replace(/^Bearer\s+/i, "").trim();

  // Strip accidental surrounding quotes
  raw = raw.replace(/^"(.+)"$/, "$1").replace(/^'(.+)'$/, "$1").trim();

  return raw || null;
}

/** Normalize decoded JWT into a consistent user object */
function normalizeUser(decoded) {
  const role =
    typeof decoded.role === "string" ? decoded.role.toLowerCase() : null;
  const _id = decoded._id || decoded.id || decoded.userId;
  const id = decoded.id || decoded._id || decoded.userId;
  return { ...decoded, _id, id, role };
}

exports.verifyToken = (req, res, next) => {
  try {
    const fromHeader = extractBearerToken(req);
    const fromCookie =
      (req.cookies && (req.cookies.token || req.cookies.jwt)) || null;
    const fromHeaderAlt = req.headers["x-auth-token"];
    const token = fromHeader || fromHeaderAlt || fromCookie;

    if (AUTH_DEBUG) {
      console.log("[auth] verifyToken for", req.method, req.originalUrl, {
        hasAuthHeader: Boolean(req.headers.authorization || req.headers.Authorization),
        hasXAuthToken: Boolean(fromHeaderAlt),
        hasCookie: Boolean(fromCookie),
        tokenPreview: token ? `${String(token).slice(0, 16)}...` : null,
      });
    }

    if (!token) {
      if (AUTH_DEBUG) console.warn("[auth] 401 No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      clockTolerance: 30, // tolerate small clock skews
    });
    const user = normalizeUser(decoded);

    if (!user._id) {
      if (AUTH_DEBUG) console.warn("[auth] 401 Token missing user id");
      return res.status(401).json({ message: "Token missing user id" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (AUTH_DEBUG) console.error("[auth] verifyToken error:", err?.name, err?.message);
    if (err?.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};

exports.verifyTokenOptional = (req, _res, next) => {
  try {
    const fromHeader = extractBearerToken(req);
    const fromCookie =
      (req.cookies && (req.cookies.token || req.cookies.jwt)) || null;
    const fromHeaderAlt = req.headers["x-auth-token"];
    const token = fromHeader || fromHeaderAlt || fromCookie;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      clockTolerance: 30,
    });
    const user = normalizeUser(decoded);
    req.user = user._id ? user : null;
    next();
  } catch (err) {
    if (AUTH_DEBUG) console.warn("[auth] optional token invalid/expired:", err?.name);
    req.user = null;
    next();
  }
};

/** Optional: role guard; export if you want to use it */
exports.requireRole = (roles = []) => (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (roles.length > 0) {
      const role = (req.user.role || "").toLowerCase();
      if (!roles.map(r => String(r).toLowerCase()).includes(role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }
    next();
  } catch {
    return res.status(500).json({ message: "Auth check failed" });
  }
};
