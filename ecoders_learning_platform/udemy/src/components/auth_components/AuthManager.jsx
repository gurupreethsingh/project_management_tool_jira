// Client-side auth manager for React apps (JWT + Axios header + route guards)

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

/* =========================
 * Utils
 * =======================*/

const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

// Remove leading "Bearer " and trim
const sanitizeToken = (t) => {
  if (!t || typeof t !== "string") return null;
  return t.replace(/^Bearer\s+/i, "").trim() || null;
};

// Robust token decoder (browser + SSR safe, no external deps)
export const decodeToken = (token) => {
  try {
    if (!token || typeof token !== "string" || !token.includes(".")) return null;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = isBrowser
      ? atob(base64)
      : Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
};

// Expiry checker
const isDecodedExpired = (decoded) => {
  if (!decoded || !decoded.exp) return false;
  return Date.now() >= decoded.exp * 1000;
};

// Manage Axios default Authorization header
const setAxiosAuthHeader = (token) => {
  const clean = sanitizeToken(token);
  if (clean) {
    axios.defaults.headers.common.Authorization = `Bearer ${clean}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

// Add exactly one Axios request interceptor (even with HMR/fast refresh)
if (isBrowser && !window.__AXIOS_AUTH_INTERCEPTOR_ADDED__) {
  axios.interceptors.request.use((config) => {
    // If caller didn't set Authorization, add from localStorage (sanitized)
    if (!config.headers?.Authorization) {
      const raw = localStorage.getItem("token");
      const clean = sanitizeToken(raw);
      if (clean) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${clean}`;
      }
    } else {
      // Prevent "Bearer Bearer <token>"
      const val = String(config.headers.Authorization);
      if (/^Bearer\s+Bearer\s+/i.test(val)) {
        config.headers.Authorization = val.replace(/^Bearer\s+/i, "Bearer ");
      }
      const afterBearer = val.replace(/^Bearer\s+/i, "");
      if (/^Bearer\s+/i.test(afterBearer)) {
        config.headers.Authorization = `Bearer ${afterBearer.replace(/^Bearer\s+/i, "")}`;
      }
    }
    return config;
  });
  window.__AXIOS_AUTH_INTERCEPTOR_ADDED__ = true;
}

/* =========================
 * React Context
 * =======================*/

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const initialTokenRaw = isBrowser ? localStorage.getItem("token") : null;
  const initialToken = sanitizeToken(initialTokenRaw);
  const initialUser = initialToken ? decodeToken(initialToken) : null;

  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(initialUser);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(initialUser) && !isDecodedExpired(initialUser)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAxiosAuthHeader(token);
    setIsLoggedIn(Boolean(user) && !isDecodedExpired(user));
    setLoading(false);

    if (!isBrowser) return;

    const onStorage = (e) => {
      if (e.key === "token") {
        const raw = localStorage.getItem("token");
        const clean = sanitizeToken(raw);
        const decoded = clean ? decodeToken(clean) : null;

        if (clean !== raw) {
          if (clean) localStorage.setItem("token", clean);
          else localStorage.removeItem("token");
        }

        setToken(clean);
        setUser(decoded);
        setAxiosAuthHeader(clean);
        setIsLoggedIn(Boolean(decoded) && !isDecodedExpired(decoded));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (newTokenRaw) => {
    const clean = sanitizeToken(newTokenRaw);
    if (isBrowser) {
      if (clean) localStorage.setItem("token", clean);
      else localStorage.removeItem("token");
    }
    setToken(clean);
    const decoded = clean ? decodeToken(clean) : null;
    setUser(decoded);
    setIsLoggedIn(Boolean(decoded) && !isDecodedExpired(decoded));
    setAxiosAuthHeader(clean);
  };

  const logout = () => {
    if (isBrowser) localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setAxiosAuthHeader(null);
  };

  const userId = useMemo(() => {
    if (!user) return null;
    return user._id || user.id || user.userId || null;
  }, [user]);

  const role = useMemo(() => (user ? user.role || null : null), [user]);

  const value = useMemo(
    () => ({
      loading,
      isLoggedIn,
      user,
      userId,
      role,
      token, // already sanitized
      login,
      logout,
    }),
    [loading, isLoggedIn, user, userId, role, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* =========================
 * Hooks & Helpers
 * =======================*/

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};

export const getTokenUserId = () => {
  if (!isBrowser) return null;
  const clean = sanitizeToken(localStorage.getItem("token"));
  const d = clean ? decodeToken(clean) : null;
  return d?._id || d?.id || d?.userId || null;
};

export const getTokenUserRole = () => {
  if (!isBrowser) return null;
  const clean = sanitizeToken(localStorage.getItem("token"));
  const d = clean ? decodeToken(clean) : null;
  return d?.role || null;
};

export const getAuthorizationHeader = () => {
  if (!isBrowser) return {};
  const clean = sanitizeToken(localStorage.getItem("token"));
  return clean ? { Authorization: `Bearer ${clean}` } : {};
};

/* =========================
 * Route Guards (React Router v6+)
 * =======================*/

export const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { loading, isLoggedIn, role } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: "You need to log in to access this page." }}
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{ message: "You do not have permission to access this page." }}
      />
    );
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { isLoggedIn, role } = useAuth();

  if (isLoggedIn && role) {
    switch (role) {
      case "student":
        return <Navigate to="/student-dashboard" replace />;
      case "instructor":
        return <Navigate to="/instructor-dashboard" replace />;
      case "superadmin":
        return <Navigate to="/superadmin-dashboard" replace />;
      case "admin":
        return <Navigate to="/admin-dashboard" replace />;
      default:
        return <Navigate to="/user-dashboard" replace />;
    }
  }

  return children;
};
