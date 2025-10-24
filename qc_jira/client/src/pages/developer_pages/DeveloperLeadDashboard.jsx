import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaProjectDiagram,
  FaUserTie,
  FaBug,
  FaBell,
  FaClipboardList,
  FaUsers,
  FaChartPie,
  FaTasks,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

const DeveloperLeadDashboard = () => {
  const [view, setView] = useState("grid");
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalDevelopers, setTotalDevelopers] = useState(0);
  const [assignedTasks, setAssignedTasks] = useState(0);
  const [defectCount, setDefectCount] = useState(0);
  const [notifications, setNotifications] = useState(0);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCounts = async () => {
    try {
      const projectRes = await axios.get(
        `${globalBackendRoute}/api/count-projects`
      );
      setTotalProjects(projectRes.data.totalProjects || 0);

      const developerRes = await axios.get(
        `${globalBackendRoute}/api/count-developers`
      );
      setTotalDevelopers(developerRes.data.totalDevelopers || 0);

      const tasksRes = await axios.get(
        `${globalBackendRoute}/api/developer-lead/${userId}/assigned-tasks`
      );
      setAssignedTasks((tasksRes.data?.tasks || []).length);

      const defectRes = await axios.get(
        `${globalBackendRoute}/api/developer-lead/${userId}/assigned-defects`
      );
      setDefectCount((defectRes.data?.defects || []).length);

      const notificationRes = await axios.get(
        `${globalBackendRoute}/api/user/${userId}`
      );
      setNotifications(notificationRes.data?.notifications || 0);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const handleViewChange = (viewType) => {
    setView(viewType);
  };

  const renderCards = () => {
    const cards = [
      {
        title: "Total Projects",
        count: totalProjects,
        icon: <FaProjectDiagram className="text-blue-500" />,
        linkText: "View All Projects",
        link: "/all-projects",
      },
      {
        title: "Total Developers",
        count: totalDevelopers,
        icon: <FaUserTie className="text-green-500" />,
        linkText: "View All Developers",
        link: "/all-developers",
      },
      {
        title: "Assigned Tasks",
        count: assignedTasks,
        icon: <FaTasks className="text-purple-500" />,
        linkText: "View My Tasks",
        link: `/developer/${userId}/tasks`,
      },
      {
        title: "Defects Assigned",
        count: defectCount,
        icon: <FaBug className="text-red-500" />,
        linkText: "View My Defects",
        link: `/developer/${userId}/defects`,
      },
      {
        title: "Notifications",
        count: notifications,
        icon: <FaBell className="text-yellow-500" />,
        linkText: "Notification Center",
        link: `/developer/${userId}/notifications`,
      },
      {
        title: "Reports & Analysis",
        count: "→",
        icon: <FaChartPie className="text-indigo-500" />,
        linkText: "Open Reports",
        link: `/developer/${userId}/reports`,
      },
    ];

    return (
      <div
        className={`${
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : view === "card"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            : "space-y-4"
        }`}
      >
        {cards.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 shadow-lg rounded-lg flex flex-col items-center relative"
          >
            <div className="text-4xl mb-2 flex justify-center">{item.icon}</div>
            <h3 className="text-xs font-semibold text-gray-600">
              {item.title}
            </h3>
            <p className="text-2xl font-semibold text-indigo-600 mt-2">
              {item.count}
            </p>
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
        {/* Header with View Selection */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
          <h3 className="text-2xl font-bold text-start text-indigo-600">
            Developer Lead Dashboard
          </h3>

          {/* View Toggle */}
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

        {/* Cards Section */}
        {renderCards()}
      </div>
    </div>
  );
};

export default DeveloperLeadDashboard;
