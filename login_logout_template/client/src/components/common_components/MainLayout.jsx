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

// contact page routes
import Contact, { contactHero } from "../../pages/contact_pages/Contact";
import SingleReply, {
  singleReplyHero,
} from "../../pages/contact_pages/SingleReply";
import AboutUs, { aboutUsHero } from "../../pages/common_pages/AboutUs";
import PrivacyPolicy, {
  privacyPolicyHero,
} from "../../pages/common_pages/PrivacyPolicy";
import Solutions, { solutionsHero } from "../../pages/common_pages/Solutions";
import AIML, { aimlHero } from "../../pages/common_pages/AIML";
import Technology, {
  technologyHero,
} from "../../pages/common_pages/Technology";
import ERP, { erpHero } from "../../pages/common_pages/ERP";
import CyberSecurity, {
  cyberSecurityHero,
} from "../../pages/common_pages/CyberSecurity";
import UIUXDesign, {
  uiuxDesignHero,
} from "../../pages/common_pages/UIUXDesign";
import DigitalTransformation, {
  digitalTransformationHero,
} from "../../pages/common_pages/DigitalTransformation";

import Login, { loginHero } from "../../pages/user_pages/Login";
import Register, { registerHero } from "../../pages/user_pages/Register";
import ForgotPassword, {
  forgotPasswordHero,
} from "../../pages/user_pages/ForgotPassword";
import ResetPassword, {
  resetPasswordHero,
} from "../../pages/user_pages/ResetPassword";

import UserDashboard, {
  userDashboardHero,
} from "../../pages/user_pages/UserDashboard";
import Profile, { profileHero } from "../../pages/user_pages/Profile";
import UpdateProfile, {
  updateProfileHero,
} from "../../pages/user_pages/UpdateProfile";

import AllUsers, { allUsersHero } from "../../pages/user_pages/AllUsers";
import UpdateRole, { updateRoleHero } from "../../pages/user_pages/UpdateRole";
import SuperAdminDashboard, {
  superAdminDashboardHero,
} from "../../pages/super_admin_pages/SuperAdminDashboard";

import EmployeeDashboard, {
  employeeDashboardHero,
} from "../../pages/employee_pages/EmployeeDashboard";

import RoleDashboard, {
  roleDashboardHero,
} from "../../pages/role_pages/RoleDashboard";

import AllSubscriptions, {
  allSubscriptionsHero,
} from "../subscription_components/AllSubscriptions";

import {
  AuthProvider,
  PrivateRoute,
  AdminRoute,
  PublicRoute,
  useAuth,
} from "../../managers/AuthManager";

import MessagesList, {
  allMessagesHero,
} from "../../pages/contact_pages/AllMessages";
import AllReplies, {
  allRepliesHero,
} from "../../pages/contact_pages/AllReplies";
import ReplyMessage, {
  replyMessageHero,
} from "../../pages/contact_pages/ReplyMessage";

const TITLE_MAP = {
  "/": "Homepage",
  "/home": "Homepage",
  "/homepage": "Homepage",

  "/contact": "Contact",
  "/about": "AboutUs",
  "/about-us": "AboutUs",
  "/solutions": "Solutions",
  "/ai-ml": "AI & ML",
  "/technology": "Technology",
  "/erp": "ERP",
  "/cyber-security": "Cyber Security",
  "/ui-ux-design": "UI UX Design",
  "/digital-transformation": "Digital Transformation",
  "/privacy-policy": "PrivacyPolicy",

  "/login": "Login",
  "/sign-in": "Login",
  "/register": "Register",
  "/forgot-password": "ForgotPassword",
  "/reset-password/:token": "ResetPassword",

  "/user-dashboard": "UserDashboard",
  "/profile": "Profile",
  "/update-profile": "UpdateProfile",

  "/all-users": "AllUsers",
  "/update-role/:id": "UpdateRole",
  "/super-admin-dashboard": "SuperAdminDashboard",
  "/employee-dashboard": "EmployeeDashboard",
  "/dashboard/:role": "RoleDashboard",

  "/all-subscriptions": "AllSubscriptions",

  "/all-messages": "AllMessages",
  "/all-replies": "AllReplies",
  "/single-reply/:id": "SingleReply",
  "/reply-message/:id": "ReplyMessage",

  "/page-not-found": "404",
  "/404": "404",
};

function isBlank(s) {
  return s == null || String(s).trim() === "";
}

function resolveMetaPath(pathname) {
  if (pathname.startsWith("/reset-password/")) return "/reset-password/:token";
  if (pathname.startsWith("/update-role/")) return "/update-role/:id";
  if (pathname.startsWith("/dashboard/")) return "/dashboard/:role";
  if (pathname.startsWith("/single-reply/")) return "/single-reply/:id";
  if (pathname.startsWith("/reply-message/")) return "/reply-message/:id";
  return pathname;
}

function LayoutInner() {
  const location = useLocation();
  const { user } = useAuth();

  const resolvedPath = resolveMetaPath(location.pathname);

  useEffect(() => {
    const pageTitle = TITLE_MAP[resolvedPath];
    document.title = pageTitle ? `Ecoders - ${pageTitle}` : "Ecoders";
  }, [resolvedPath]);

  let heroConfig = {
    heroTitle: "",
    heroSubtitle: "",
    showHero: true,
    heroBg: "",
  };

  const HERO_BY_PATH = {
    "/": homepageHero,
    "/home": homepageHero,
    "/homepage": homepageHero,

    "/contact": contactHero,
    "/about": aboutUsHero,
    "/about-us": aboutUsHero,
    "/solutions": solutionsHero,
    "/ai-ml": aimlHero,
    "/technology": technologyHero,
    "/erp": erpHero,
    "/cyber-security": cyberSecurityHero,
    "/ui-ux-design": uiuxDesignHero,
    "/digital-transformation": digitalTransformationHero,
    "/privacy-policy": privacyPolicyHero,

    "/login": loginHero,
    "/sign-in": loginHero,
    "/register": registerHero,
    "/forgot-password": forgotPasswordHero,
    "/reset-password/:token": resetPasswordHero,

    "/user-dashboard": userDashboardHero,
    "/profile": profileHero,
    "/update-profile": updateProfileHero,

    "/all-users": allUsersHero,
    "/update-role/:id": updateRoleHero,
    "/super-admin-dashboard": superAdminDashboardHero,
    "/employee-dashboard": employeeDashboardHero,
    "/dashboard/:role": roleDashboardHero,

    "/all-subscriptions": allSubscriptionsHero,

    "/all-messages": allMessagesHero,
    "/all-replies": allRepliesHero,
    "/single-reply/:id": singleReplyHero,
    "/reply-message/:id": replyMessageHero,

    "/page-not-found": pageNotFoundHero,
    "/404": pageNotFoundHero,
  };

  if (HERO_BY_PATH[resolvedPath]) {
    heroConfig = HERO_BY_PATH[resolvedPath];
  }

  const knownPaths = Object.keys(HERO_BY_PATH);
  if (!knownPaths.includes(resolvedPath)) {
    heroConfig = pageNotFoundHero;
  }

  const showHeroText = !(
    isBlank(heroConfig?.heroTitle) && isBlank(heroConfig?.heroSubtitle)
  );

  return (
    <>
      <Header
        currentPath={location.pathname}
        isLoggedIn={!!user}
        user={user || { name: "User", avatarUrl: "" }}
        {...heroConfig}
        showHeroText={showHeroText}
      />

      <Breadcrumb />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/about-us" element={<AboutUs />} />

        <Route path="/solutions" element={<Solutions />} />
        <Route path="/ai-ml" element={<AIML />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/erp" element={<ERP />} />
        <Route path="/cyber-security" element={<CyberSecurity />} />
        <Route path="/ui-ux-design" element={<UIUXDesign />} />
        <Route
          path="/digital-transformation"
          element={<DigitalTransformation />}
        />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/sign-in"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/user-dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/update-profile"
          element={
            <PrivateRoute>
              <UpdateProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoute>
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/:role"
          element={
            <PrivateRoute>
              <RoleDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/all-subscriptions"
          element={
            <PrivateRoute>
              <AllSubscriptions />
            </PrivateRoute>
          }
        />

        <Route
          path="/all-users"
          element={
            <AdminRoute>
              <AllUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/update-role/:id"
          element={
            <AdminRoute>
              <UpdateRole />
            </AdminRoute>
          }
        />
        <Route
          path="/super-admin-dashboard"
          element={
            <AdminRoute>
              <SuperAdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/all-messages"
          element={
            <AdminRoute>
              <MessagesList />
            </AdminRoute>
          }
        />
        <Route
          path="/all-replies"
          element={
            <AdminRoute>
              <AllReplies />
            </AdminRoute>
          }
        />
        <Route
          path="/single-reply/:id"
          element={
            <AdminRoute>
              <SingleReply />
            </AdminRoute>
          }
        />
        <Route
          path="/reply-message/:id"
          element={
            <AdminRoute>
              <ReplyMessage />
            </AdminRoute>
          }
        />

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
    <AuthProvider>
      <Router>
        <LayoutInner />
      </Router>
    </AuthProvider>
  );
}
