// src/pages/admin/SuperAdminDashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaProjectDiagram,
  FaUserShield,
  FaUserTie,
  FaUserCheck,
  FaUsersCog,
  FaThList,
  FaThLarge,
  FaTh,
  FaRegCalendarCheck,
  FaCalendarAlt,
  FaFileAlt, // ✅ NEW
} from "react-icons/fa";
import { Link } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

const SuperAdminDashboard = () => {
  const [view, setView] = useState("grid");

  const [totalProjects, setTotalProjects] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalDevelopers, setTotalDevelopers] = useState(0);
  const [totalTestEngineers, setTotalTestEngineers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);

  const [notifCounts, setNotifCounts] = useState({
    total: 0,
    all: 0,
    role: 0,
    user: 0,
  });

  // ✅ New: careers counts (internship / job)
  const [careerCounts, setCareerCounts] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    accepted: 0,
    rejected: 0,
    on_hold: 0,
    internship: 0,
    job: 0,
  });

  // ✅ NEW: report counts
  const [totalReports, setTotalReports] = useState(0);
  const [hasUnviewedReports, setHasUnviewedReports] = useState(false);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      // ---- Projects
      const projectResponse = await axios.get(
        `${globalBackendRoute}/api/count-projects`
      );
      setTotalProjects(projectResponse?.data?.totalProjects || 0);

      // ---- Users
      const usersResponse = await axios.get(
        `${globalBackendRoute}/api/count-users`
      );
      const {
        totalUsers: _totalUsers,
        totalAdmins: _totalAdmins,
        totalDevelopers: _totalDevelopers,
        totalTestEngineers: _totalTestEngineers,
      } = usersResponse.data || {};
      setTotalAdmins(_totalAdmins || 0);
      setTotalDevelopers(_totalDevelopers || 0);
      setTotalTestEngineers(_totalTestEngineers || 0);
      setTotalUsers(_totalUsers || 0);

      // ---- Events
      const eventsResponse = await axios.get(
        `${globalBackendRoute}/api/events/count/all`
      );
      setTotalEvents(eventsResponse?.data?.total || 0);

      // ✅ ---- Reports (no auth required by default)
      try {
        // total reports
        const reportsTotalRes = await axios.get(
          `${globalBackendRoute}/api/reports/count`
        );
        const total = reportsTotalRes?.data?.data?.total || 0;
        setTotalReports(total);

        // unviewed reports
        const reportsUnviewedRes = await axios.get(
          `${globalBackendRoute}/api/reports/count`,
          {
            params: { isViewed: false },
          }
        );
        const unviewed = reportsUnviewedRes?.data?.data?.total || 0;
        setHasUnviewedReports(unviewed > 0);
      } catch (err) {
        console.warn("Error fetching report counts:", err?.message);
      }

      // ---- Token (for admin-protected APIs)
      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      if (!token) {
        console.warn(
          "No token found in localStorage ('userToken' | 'token'). Admin counts that need auth may fail."
        );
        return;
      }

      const authHeaders = { Authorization: `Bearer ${token}` };

      // ---- Notifications
      try {
        const notificationResponse = await axios.get(
          `${globalBackendRoute}/api/counts/admin/all`,
          { headers: authHeaders }
        );
        const counts = notificationResponse?.data || {};
        setNotifCounts({
          total: counts.total || 0,
          all: counts.all || 0,
          role: counts.role || 0,
          user: counts.user || 0,
        });
      } catch (err) {
        console.warn("Error fetching notification counts:", err?.message);
      }

      // ---- Careers (internship + job counts)
      try {
        const careersResponse = await axios.get(
          `${globalBackendRoute}/api/careers/counts`,
          { headers: authHeaders }
        );
        const careersData = careersResponse?.data || {};
        const byStatus = careersData.byStatus || {};
        const byType = careersData.byType || {};

        setCareerCounts({
          total: careersData.total || 0,
          pending: byStatus.pending || 0,
          shortlisted: byStatus.shortlisted || 0,
          accepted: byStatus.accepted || 0,
          rejected: byStatus.rejected || 0,
          on_hold: byStatus.on_hold || 0,
          internship: byType.internship || 0,
          job: byType.job || 0,
        });
      } catch (err) {
        console.warn("Error fetching careers counts:", err?.message);
      }
    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
    }
  };

  const handleViewChange = (viewType) => setView(viewType);

  const renderCounts = () => {
    const counts = [
      {
        title: "Total Projects",
        count: totalProjects,
        icon: <FaProjectDiagram className="text-blue-500" />,
        linkText: "Project Dashboard",
        link: "/all-projects",
      },
      {
        title: "Total Admins",
        count: totalAdmins,
        icon: <FaUserShield className="text-green-500" />,
        linkText: "View All Admins",
        link: "/all-users",
      },
      {
        title: "Total Developers",
        count: totalDevelopers,
        icon: <FaUserTie className="text-yellow-500" />,
        linkText: "View All Developers",
        link: "/all-users",
      },
      {
        title: "Total Test Engineers",
        count: totalTestEngineers,
        icon: <FaUserCheck className="text-purple-500" />,
        linkText: "View All Test Engineers",
        link: "/all-users",
      },
      {
        title: "View Attendance",
        count: undefined,
        icon: <FaRegCalendarCheck className="text-green-600" />,
        linkText: "Go to Attendance",
        link: "/view-all-attendance",
      },
      {
        title: "Total Users",
        count: totalUsers,
        icon: <FaUsersCog className="text-red-500" />,
        linkText: "View All Users",
        link: "/all-users",
      },
      {
        title: "Notifications",
        count: notifCounts.total,
        icon: <FaUsersCog className="text-pink-500" />,
        linkText: "Create Notifications",
        link: "/create-notification",
      },

      // ✅ NEW: Reports card with red dot if any unviewed
      {
        title: "Reports",
        count: totalReports,
        icon: <FaFileAlt className="text-rose-500" />,
        linkText: "View All Reports",
        link: "/all-reports",
        showUnreadDot: hasUnviewedReports,
      },

      // ✅ Split careers into two cards
      {
        title: "Internship Applications",
        count: careerCounts.internship,
        icon: <FaUserTie className="text-teal-500" />,
        linkText: "View Applications",
        link: "/all-careers-applications",
      },
      {
        title: "Job Applications",
        count: careerCounts.job,
        icon: <FaUserTie className="text-orange-500" />,
        linkText: "View Applications",
        link: "/all-careers-applications",
      },

      // Events card
      {
        title: "Total Events",
        count: totalEvents,
        icon: <FaCalendarAlt className="text-indigo-500" />,
        linkText: "Create Event",
        link: "/create-event",
      },
    ];

    return (
      <div
        className={`${
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            : view === "card"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            : "space-y-4"
        }`}
      >
        {counts.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 shadow-lg rounded-lg flex flex-col items-center relative"
          >
            {/* ✅ Red dot for unread reports */}
            {item.showUnreadDot && (
              <span className="absolute top-2 right-2 h-3 w-3 rounded-full bg-red-500" />
            )}

            <div className="text-4xl mb-2 flex justify-center">{item.icon}</div>
            <h3 className="text-xs font-semibold text-gray-600">
              {item.title}
            </h3>
            {typeof item.count !== "undefined" && (
              <p className="text-2xl font-semibold text-indigo-600 mt-2">
                {item.count}
              </p>
            )}
            <Link
              to={item.link}
              className="mt-2 text-xs text-indigo-600 hover:text-indigo-800"
            >
              {item.linkText}
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto container px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
          <h3 className="text-2xl font-bold text-start text-indigo-600">
            Super Admin Dashboard
          </h3>
          <div className="flex space-x-4 justify-center md:justify-start">
            <FaThList
              className={`text-xl cursor-pointer ${
                view === "list" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => handleViewChange("list")}
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${
                view === "card" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => handleViewChange("card")}
            />
            <FaTh
              className={`text-xl cursor-pointer ${
                view === "grid" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => handleViewChange("grid")}
            />
          </div>
        </div>

        {/* Counts */}
        {renderCounts()}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
