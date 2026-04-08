import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import globalBackendRoute from "../config/Config";

const AuthContext = createContext();

const API_BASE_URL = `${globalBackendRoute}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();
const normalizeText = (value = "") => String(value).trim();

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch {
    return null;
  }
};

const getDashboardPathByRole = (role) => {
  if (role === "superadmin") return "/super-admin-dashboard";
  if (role === "user" || !role) return "/user-dashboard";
  return `/dashboard/${role}`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("travel_user")) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(
    localStorage.getItem("travel_token") || "",
  );
  const [loading, setLoading] = useState(true);

  const logoutTimerRef = useRef(null);
  const isRefreshingRef = useRef(false);
  const refreshSubscribersRef = useRef([]);

  const clearSession = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("travel_token");
    localStorage.removeItem("travel_user");
    delete api.defaults.headers.common.Authorization;

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const scheduleAutoLogout = (accessToken) => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    const decoded = parseJwt(accessToken);
    if (!decoded?.exp) return;

    const expiresAt = decoded.exp * 1000;
    const delay = expiresAt - Date.now();

    if (delay <= 0) {
      clearSession();
      return;
    }

    logoutTimerRef.current = setTimeout(() => {
      clearSession();
      window.location.href = "/login";
    }, delay);
  };

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      scheduleAutoLogout(token);
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  const subscribeTokenRefresh = (callback) => {
    refreshSubscribersRef.current.push(callback);
  };

  const onRefreshed = (newToken) => {
    refreshSubscribersRef.current.forEach((callback) => callback(newToken));
    refreshSubscribersRef.current = [];
  };

  const refreshAccessToken = async () => {
    const res = await axios.post(
      `${API_BASE_URL}/users/refresh-token`,
      {},
      { withCredentials: true },
    );

    const newToken = res?.data?.token || "";
    const newUser = res?.data?.user || null;

    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("travel_token", newToken);
    localStorage.setItem("travel_user", JSON.stringify(newUser));
    api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
    scheduleAutoLogout(newToken);

    return newToken;
  };

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const storedToken = localStorage.getItem("travel_token");
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error?.response?.status === 401 &&
          !originalRequest?._retry &&
          !originalRequest?.url?.includes("/users/login") &&
          !originalRequest?.url?.includes("/users/register") &&
          !originalRequest?.url?.includes("/users/refresh-token")
        ) {
          if (isRefreshingRef.current) {
            return new Promise((resolve) => {
              subscribeTokenRefresh((newToken) => {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                resolve(api(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          isRefreshingRef.current = true;

          try {
            const newToken = await refreshAccessToken();
            onRefreshed(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            clearSession();
            window.location.href = "/login";
            return Promise.reject(refreshError);
          } finally {
            isRefreshingRef.current = false;
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedToken = localStorage.getItem("travel_token");

        if (!storedToken) {
          setLoading(false);
          return;
        }

        api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;

        const res = await api.get("/users/me");
        const nextUser = res?.data?.user || null;

        setUser(nextUser);
        setToken(storedToken);
        localStorage.setItem("travel_user", JSON.stringify(nextUser));
        scheduleAutoLogout(storedToken);
      } catch (_error) {
        try {
          await refreshAccessToken();
        } catch {
          clearSession();
        }
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const register = async (payload) => {
    const sanitizedPayload = {
      fullName: normalizeText(payload?.fullName),
      email: normalizeEmail(payload?.email),
      password: String(payload?.password || ""),
    };

    const res = await api.post("/users/register", sanitizedPayload);

    const nextUser = res?.data?.user || null;
    const nextToken = res?.data?.token || "";

    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem("travel_token", nextToken);
    localStorage.setItem("travel_user", JSON.stringify(nextUser));
    api.defaults.headers.common.Authorization = `Bearer ${nextToken}`;
    scheduleAutoLogout(nextToken);

    return res.data;
  };

  const login = async (payload) => {
    const sanitizedPayload = {
      email: normalizeEmail(payload?.email),
      password: String(payload?.password || ""),
    };

    const res = await api.post("/users/login", sanitizedPayload);

    const nextUser = res?.data?.user || null;
    const nextToken = res?.data?.token || "";

    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem("travel_token", nextToken);
    localStorage.setItem("travel_user", JSON.stringify(nextUser));
    api.defaults.headers.common.Authorization = `Bearer ${nextToken}`;
    scheduleAutoLogout(nextToken);

    return res.data;
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch {
      // ignore logout API failure
    } finally {
      clearSession();
    }
  };

  const forgotPassword = async (email) => {
    const res = await api.post("/users/forgot-password", {
      email: normalizeEmail(email),
    });
    return res.data;
  };

  const resetPassword = async (tokenValue, password) => {
    const res = await api.put(`/users/reset-password/${tokenValue}`, {
      password: String(password || ""),
    });
    return res.data;
  };

  const fetchProfile = async () => {
    const res = await api.get("/users/me");
    const nextUser = res?.data?.user || null;
    setUser(nextUser);
    localStorage.setItem("travel_user", JSON.stringify(nextUser));
    return nextUser;
  };

  const updateProfile = async (payload) => {
    const res = await api.put("/users/update-profile", payload);
    const nextUser = res?.data?.user || null;
    setUser(nextUser);
    localStorage.setItem("travel_user", JSON.stringify(nextUser));
    return res.data;
  };

  const getAllUsers = async () => {
    const res = await api.get("/users/all-users");
    return res?.data?.users || [];
  };

  const updateUserRole = async (id, role) => {
    const res = await api.put(`/users/update-role/${id}`, {
      role: normalizeText(role).toLowerCase(),
    });
    return res.data;
  };

  const value = useMemo(
    () => ({
      api,
      user,
      token,
      loading,
      authLoading: loading,
      isAuthenticated: !!token,
      register,
      login,
      logout,
      forgotPassword,
      resetPassword,
      fetchProfile,
      updateProfile,
      getAllUsers,
      updateUserRole,
      getDashboardPathByRole,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export const PrivateRoute = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export const AdminRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  return isAuthenticated && user?.role === "superadmin" ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

export const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { loading, isAuthenticated, user, getDashboardPathByRole } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? (
    <Navigate to={getDashboardPathByRole(user?.role)} replace />
  ) : (
    children
  );
};
