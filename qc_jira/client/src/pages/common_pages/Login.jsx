"use client";

import React, { memo, useCallback, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserShield,
} from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import globalBackendRoute from "../../config/Config";

import loginBanner from "../../assets/images/login_banner.jpg";

const HERO_TAGS = ["LOGIN", "SECURE ACCESS", "DASHBOARD", "ROLE-BASED"];

const HERO_STYLE = {
  backgroundImage: `url(${loginBanner})`,
};

const normalizeRole = (role) =>
  String(role || "")
    .trim()
    .toLowerCase();

const getDashboardLinkByRole = (role) => {
  const normalizedRole = normalizeRole(role);

  const dashboardLinks = {
    superadmin: "/super-admin-dashboard",
    admin: "/admin-dashboard",

    qa_lead: "/qa-dashboard",

    test_engineer: "/test-engineer-dashboard",

    developer: "/developer-dashboard",
    developer_lead: "/developer-dashboard",
    tech_lead: "/developer-dashboard",

    project_manager: "/project-manager-dashboard",

    accountant: "/dashboard",
    alumni_relations: "/dashboard",
    business_analyst: "/dashboard",
    content_creator: "/dashboard",
    course_coordinator: "/dashboard",
    customer_support: "/dashboard",
    data_scientist: "/dashboard",
    dean: "/dashboard",
    department_head: "/dashboard",
    event_coordinator: "/dashboard",
    exam_controller: "/dashboard",
    hr_manager: "/dashboard",
    hr: "/dashboard",
    intern: "/dashboard",
    legal_advisor: "/dashboard",
    librarian: "/dashboard",
    maintenance_staff: "/dashboard",
    marketing_manager: "/dashboard",
    operations_manager: "/dashboard",
    product_owner: "/dashboard",
    recruiter: "/dashboard",
    registrar: "/dashboard",
    researcher: "/dashboard",
    sales_executive: "/dashboard",
    student: "/dashboard",
    support_engineer: "/dashboard",
    teacher: "/dashboard",
    user: "/dashboard",
    ux_ui_designer: "/dashboard",
  };

  return dashboardLinks[normalizedRole] || "/dashboard";
};

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      try {
        const response = await axios.post(
          `${globalBackendRoute}/api/login`,
          formData,
        );

        const { userToken, user } = response.data;

        if (userToken && user) {
          const userId = user?._id || user?.id || "";
          const dashboardPath = getDashboardLinkByRole(user.role);

          localStorage.setItem("token", userToken);
          localStorage.setItem("userId", userId);
          localStorage.setItem("user", JSON.stringify(user));

          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new Event("app:refreshBadges"));

          navigate(dashboardPath, { replace: true });
        } else {
          setError("Login failed. Please try again.");
        }
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "An error occurred. Please try again.";
        setError(message);
      }
    },
    [formData, navigate],
  );

  return (
    <div className="service-page-wrap min-h-screen">
      {/* HERO */}
      <section className="service-hero-section" style={HERO_STYLE}>
        <div className="service-hero-overlay-1" />
        <div className="service-hero-overlay-2" />
        <div className="service-hero-overlay-3" />

        <div className="service-hero-container">
          <div className="service-hero-layout">
            <div>
              <div className="service-tag-row">
                {HERO_TAGS.map((item) => (
                  <span key={item} className="service-tag-pill">
                    {item}
                  </span>
                ))}
              </div>

              <h1 className="service-hero-title">
                Sign in to your{" "}
                <span className="service-hero-title-highlight">
                  account dashboard
                </span>
              </h1>

              <p className="service-hero-text">
                Access your workspace securely and continue with your assigned
                dashboards, tools, and project workflows.
              </p>

              <div className="service-hero-status">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Secure role-based access
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                <span>Encrypted login flow</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-200" />
                <span>Role-based redirection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr),minmax(0,1fr)] gap-10 lg:gap-12 items-start">
            {/* LEFT */}
            <section>
              <h2 className="service-main-heading">Access your account</h2>

              <div className="glass-card mt-5 px-5 sm:px-6 py-5 sm:py-6">
                <p className="service-badge-heading">Secure sign in</p>

                <div className="mt-4 space-y-4">
                  <p className="service-paragraph">
                    Sign in using your registered email address and password to
                    access your dashboard and role-specific tools.
                  </p>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                        <FaUserShield className="text-base" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Role-based navigation
                        </p>
                        <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          After successful login, you will be redirected
                          automatically to the correct dashboard based on your
                          account role.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                        <MdLogin className="text-base" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Need help signing in?
                        </p>
                        <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Use the forgot password option if you cannot access
                          your account, or register if you are a new user.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT */}
            <section>
              <h2 className="service-main-heading">Login form</h2>

              <div className="glass-card mt-5 p-5 sm:p-6 lg:p-7">
                <p className="service-badge-heading">Sign in</p>
                <p className="mt-3 form-help-text">
                  Enter your email and password to continue to your account.
                </p>

                <form onSubmit={handleSubmit} className="mx-auto max-w-xl mt-6">
                  <div className="grid grid-cols-1 gap-y-5">
                    <div>
                      <label htmlFor="email" className="form-label">
                        <span className="form-icon-badge">
                          <FaEnvelope className="text-[11px]" />
                        </span>
                        Email address
                      </label>
                      <div className="mt-2.5">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          autoComplete="email"
                          className="form-input"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <label htmlFor="password" className="form-label">
                          <span className="form-icon-badge">
                            <FaLock className="text-[11px]" />
                          </span>
                          Password
                        </label>

                        <div className="text-xs sm:text-sm">
                          <Link
                            to="/forgot-password"
                            className="font-semibold text-slate-900 underline underline-offset-2 hover:text-slate-700"
                          >
                            Forgot password?
                          </Link>
                        </div>
                      </div>

                      <div className="mt-2.5 relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={formData.password}
                          onChange={handleChange}
                          autoComplete="current-password"
                          className="form-input pr-12"
                          placeholder="Enter your password"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-800"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          title={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <div className="mt-8 text-center">
                    <button type="submit" className="primary-gradient-button">
                      Sign in
                    </button>
                  </div>

                  <p className="mt-8 text-center text-sm text-slate-500">
                    Need an account?{" "}
                    <Link
                      to="/register"
                      className="font-semibold text-slate-900 underline underline-offset-2 hover:text-slate-700"
                    >
                      Register
                    </Link>
                  </p>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default memo(Login);
