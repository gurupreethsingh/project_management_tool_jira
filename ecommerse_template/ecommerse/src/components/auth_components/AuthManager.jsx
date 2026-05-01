import React, { createContext, useState, useEffect, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

export const AuthContext = createContext();

const TOKEN_KEYS = ["token", "authToken", "userToken"];

const getStoredToken = () => {
  for (const key of TOKEN_KEYS) {
    const token = localStorage.getItem(key);
    if (token) return token;
  }
  return "";
};

const clearStoredTokens = () => {
  TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
};

const isTokenExpired = (decodedToken) => {
  if (!decodedToken?.exp) return true;
  const currentTimeInSeconds = Date.now() / 1000;
  return decodedToken.exp <= currentTimeInSeconds;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionMessage, setSessionMessage] = useState("");

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) return null;

      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error("Token decoding failed:", error);
      return null;
    }
  };

  const logout = (message = "") => {
    clearStoredTokens();
    setUser(null);
    setIsLoggedIn(false);

    if (message) {
      setSessionMessage(message);
    }
  };

  const validateTokenWithBackend = async (token) => {
    const response = await fetch(`${globalBackendRoute}/api/verify-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Token invalid or expired");
    }

    return response.json();
  };

  const checkAuthStatus = async () => {
    try {
      const token = getStoredToken();

      if (!token) {
        setUser(null);
        setIsLoggedIn(false);
        return;
      }

      const decoded = decodeToken(token);

      if (!decoded || isTokenExpired(decoded)) {
        logout("Your session expired. Please login again.");
        return;
      }

      const data = await validateTokenWithBackend(token);

      setUser(data.user || decoded);
      setIsLoggedIn(true);
      setSessionMessage("");
    } catch (error) {
      console.error("Auth validation failed:", error);
      logout("Your session expired. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // login
  const login = async (token) => {
    localStorage.setItem("token", token);

    const decoded = decodeToken(token);

    if (!decoded || isTokenExpired(decoded)) {
      logout("Login session is invalid. Please login again.");
      return false;
    }

    try {
      const data = await validateTokenWithBackend(token);

      setUser(data.user || decoded);
      setIsLoggedIn(true);
      setSessionMessage("");

      const localCart = JSON.parse(localStorage.getItem("cart")) || [];

      if (localCart.length > 0) {
        await fetch(`${globalBackendRoute}/api/cart/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: localCart }),
        });

        localStorage.removeItem("cart");
      }

      return true;
    } catch (error) {
      console.error("Login validation/cart sync failed:", error);
      logout("Login failed or session expired. Please login again.");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        loading,
        sessionMessage,
        setSessionMessage,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isLoggedIn, user, loading, sessionMessage } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/home"
        replace
        state={{
          message: sessionMessage || "You need to log in to access this page.",
        }}
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
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
  const { isLoggedIn, user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (isLoggedIn && user?.role) {
    return (
      <Navigate to="/dashboard" replace state={{ from: location.pathname }} />
    );
  }

  return children;
};
