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
  FaCalendarAlt, // 👈 added
  FaCalendarPlus, // 👈 (optional if you want to use elsewhere)
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
  const [totalEvents, setTotalEvents] = useState(0); // 👈 added

  const [notifCounts, setNotifCounts] = useState({
    total: 0,
    all: 0,
    role: 0,
    user: 0,
  });

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

      // ---- Events (from your routes/EventRoutes.js -> GET /events/count/all)
      // assuming your server is mounted at /api
      const eventsResponse = await axios.get(
        `${globalBackendRoute}/api/events/count/all`
      );
      // expect { total: number } — safeguard fallback to 0
      setTotalEvents(eventsResponse?.data?.total || 0);

      // ---- Notifications (needs token if your API is protected)
      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      if (!token) {
        console.warn(
          "No token found in localStorage ('userToken' | 'token'). Admin notification counts may 401."
        );
      } else {
        const notificationResponse = await axios.get(
          `${globalBackendRoute}/api/counts/admin/all`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const counts = notificationResponse?.data || {};
        setNotifCounts({
          total: counts.total || 0,
          all: counts.all || 0,
          role: counts.role || 0,
          user: counts.user || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
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
      // -------- NEW: Events card (like Notifications) --------
      {
        title: "Total Events",
        count: totalEvents,
        icon: <FaCalendarAlt className="text-indigo-500" />,
        linkText: "Create Event",
        link: "/create-event", // adjust if your route differs
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
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
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
