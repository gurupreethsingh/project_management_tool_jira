import React from "react";
import { Navigate } from "react-router-dom";

const isTokenExpired = (token) => {
  try {
    if (!token) return true;

    const payloadPart = token.split(".")[1];
    if (!payloadPart) return true;

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));

    if (!payload.exp) return true;

    return Date.now() >= payload.exp * 1000;
  } catch (error) {
    return true;
  }
};

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  let user = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch (error) {
    localStorage.removeItem("user");
    user = null;
  }

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
