// src/components/common_components/MainLayout.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Header from "../header_components/Header";
import Footer from "../footer_components/Footer";
import Breadcrumb from "./Breadcrumb";
import ScrollToTopButton from "./ScrollToTopButton";

import Homepage, { homepageHero } from "../../pages/common_pages/Homepage";
import PageNotFound, {
  pageNotFoundHero,
} from "../../pages/common_pages/PageNotFound";

import Contact, { contactHero } from "../../pages/contact_pages/Contact";
import AboutUs, { aboutUsHero } from "../../pages/common_pages/AboutUs";
import PrivacyPolicy, {
  privacyPolicyHero,
} from "../../pages/common_pages/PrivacyPolicy";

// ✅ User/Auth pages (your folders)
import Login, { loginHero } from "../../pages/user_pages/Login";
import Register, { registerHero } from "../../pages/user_pages/Register";
import ForgotPassword, {
  forgotPasswordHero,
} from "../../pages/user_pages/ForgotPassword";

// ✅ User pages
import UserDashboard, {
  userDashboardHero,
} from "../../pages/user_pages/UserDashboard";
import Profile, { profileHero } from "../../pages/user_pages/Profile";
import UpdateProfile, {
  updateProfileHero,
} from "../../pages/user_pages/UpdateProfile";

// ✅ Super Admin pages
import AllUsers, { allUsersHero } from "../../pages/super_admin_pages/AllUsers";
import UpdateRole, {
  updateRoleHero,
} from "../../pages/super_admin_pages/UpdateRole";
import SuperAdminDashboard, {
  superAdminDashboardHero,
} from "../../pages/super_admin_pages/SuperAdminDashboard";

// ✅ Employee pages
import EmployeeDashboard, {
  employeeDashboardHero,
} from "../../pages/employee_pages/EmployeeDashboard";

import AllSubscriptions, {
  allSubscriptionsHero,
} from "../subscription_components/AllSubscriptions";

/* -------------------------------------------------------------------------- */
/* PAGE TITLE CONFIG                                                          */
/* -------------------------------------------------------------------------- */
const TITLE_MAP = {
  "/": "Homepage",
  "/home": "Homepage",
  "/homepage": "Homepage",

  "/contact": "Contact",
  "/about": "AboutUs",
  "/about-us": "AboutUs",
  "/privacy-policy": "PrivacyPolicy",

  "/login": "Login",
  "/sign-in": "Login",
  "/register": "Register",
  "/forgot-password": "ForgotPassword",

  "/user-dashboard": "UserDashboard",
  "/profile": "Profile",
  "/update-profile": "UpdateProfile",

  "/all-users": "AllUsers",
  "/update-role": "UpdateRole",
  "/super-admin-dashboard": "SuperAdminDashboard",
  "/employee-dashboard": "EmployeeDashboard",

  "/all-subscriptions": "AllSubscriptions",

  "/page-not-found": "404",
  "/404": "404",
};

function isBlank(s) {
  return s == null || String(s).trim() === "";
}

function LayoutInner() {
  const location = useLocation();

  /* ---------------------------------------------------------------------- */
  /* PAGE TITLE HANDLING (INLINE)                                            */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    const pageTitle = TITLE_MAP[location.pathname];
    document.title = pageTitle ? `Ecoders - ${pageTitle}` : "Ecoders";
  }, [location.pathname]);

  /* ---------------------------------------------------------------------- */
  /* HERO CONFIG HANDLING                                                    */
  /* ---------------------------------------------------------------------- */

  // ✅ Default hero: keep header background visible (hero container ON),
  // but decide text visibility separately.
  let heroConfig = {
    heroTitle: "",
    heroSubtitle: "",
    showHero: true,
    heroBg: "",
  };

  // ✅ Route → Hero map (uses your exact routes)
  const HERO_BY_PATH = {
    "/": homepageHero,
    "/home": homepageHero,
    "/homepage": homepageHero,

    "/contact": contactHero,
    "/about": aboutUsHero,
    "/about-us": aboutUsHero,
    "/privacy-policy": privacyPolicyHero,

    "/login": loginHero,
    "/sign-in": loginHero,
    "/register": registerHero,
    "/forgot-password": forgotPasswordHero,

    "/user-dashboard": userDashboardHero,
    "/profile": profileHero,
    "/update-profile": updateProfileHero,

    "/all-users": allUsersHero,
    "/update-role": updateRoleHero,
    "/super-admin-dashboard": superAdminDashboardHero,
    "/employee-dashboard": employeeDashboardHero,

    "/all-subscriptions": allSubscriptionsHero,

    "/page-not-found": pageNotFoundHero,
    "/404": pageNotFoundHero,
  };

  // ✅ If route has explicit hero config, use it
  if (HERO_BY_PATH[location.pathname]) {
    heroConfig = HERO_BY_PATH[location.pathname];
  }

  // ✅ Unknown route → 404 hero
  const knownPaths = Object.keys(HERO_BY_PATH);
  if (!knownPaths.includes(location.pathname)) {
    heroConfig = pageNotFoundHero;
  }

  // ✅ Decide hero text visibility only (do NOT kill background)
  const showHeroText = !(
    isBlank(heroConfig?.heroTitle) && isBlank(heroConfig?.heroSubtitle)
  );

  return (
    <>
      <Header
        currentPath={location.pathname}
        isLoggedIn={false}
        {...heroConfig}
        showHeroText={showHeroText}
      />

      <Breadcrumb />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* User */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />

        {/* Super Admin / Employee */}
        <Route path="/all-users" element={<AllUsers />} />
        <Route path="/update-role" element={<UpdateRole />} />
        <Route
          path="/super-admin-dashboard"
          element={<SuperAdminDashboard />}
        />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/all-subscriptions" element={<AllSubscriptions />} />

        {/* 404 */}
        <Route path="/page-not-found" element={<PageNotFound />} />
        <Route path="/404" element={<PageNotFound />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <Footer />
      <ScrollToTopButton />
    </>
  );
}

export default function MainLayout() {
  return (
    <Router>
      <LayoutInner />
    </Router>
  );
}
