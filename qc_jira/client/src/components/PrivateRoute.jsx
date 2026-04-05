import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const parseJwt = (token) => {
  try {
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payloadPart = parts[1];
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(base64));

    return decodedPayload;
  } catch (error) {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = parseJwt(token);

  if (!payload || !payload.exp) {
    return true;
  }

  return Date.now() >= payload.exp * 1000;
};

const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  let user = null;

  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch (error) {
    clearAuthStorage();
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (!token || !user) {
    clearAuthStorage();
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (isTokenExpired(token)) {
    clearAuthStorage();
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
