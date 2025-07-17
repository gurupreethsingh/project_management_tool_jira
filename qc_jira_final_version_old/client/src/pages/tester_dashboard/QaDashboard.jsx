import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaProjectDiagram,
  FaUserShield,
  FaUserTie,
  FaUserCheck,
  FaUsersCog,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const QaDashboard = () => {
  const [view, setView] = useState("grid");
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalDevelopers, setTotalDevelopers] = useState(0);
  const [totalTestEngineers, setTotalTestEngineers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0); // Add totalUsers state

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      // Fetch project count
      const projectResponse = await axios.get(
        "http://localhost:5000/count-projects"
      );
      setTotalProjects(projectResponse.data.totalProjects);

      // Fetch all user counts (including roles and total users)
      const usersResponse = await axios.get(
        "http://localhost:5000/count-users"
      );
      const { totalUsers, totalAdmins, totalDevelopers, totalTestEngineers } =
        usersResponse.data;

      // Update states based on the response
      setTotalAdmins(totalAdmins);
      setTotalDevelopers(totalDevelopers);
      setTotalTestEngineers(totalTestEngineers);
      setTotalUsers(totalUsers); // Set total users
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const handleViewChange = (viewType) => {
    setView(viewType);
  };

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
        link: "/all-admins",
      },
      {
        title: "Total Developers",
        count: totalDevelopers,
        icon: <FaUserTie className="text-yellow-500" />,
        linkText: "View All Developers",
        link: "/all-developers",
      },
      {
        title: "Total Test Engineers",
        count: totalTestEngineers,
        icon: <FaUserCheck className="text-purple-500" />,
        linkText: "View All Test Engineers",
        link: "/all-test-engineers",
      },
      {
        title: "Total Users", // New card for total users
        count: totalUsers,
        icon: <FaUsersCog className="text-red-500" />,
        linkText: "View All Users",
        link: "/all-users",
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
            {/* Icon */}
            <div className="text-4xl mb-2 flex justify-center">{item.icon}</div>
            {/* Title */}
            <h3 className="text-xs font-semibold text-gray-600">
              {item.title}
            </h3>
            {/* Count */}
            <p className="text-2xl font-semibold text-indigo-600 mt-2">
              {item.count}
            </p>
            {/* Link */}
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

  const renderPagination = () => {
    // Placeholder for future pagination logic (if needed)
    return null;
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header with View Selection */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
          <h3 className="text-2xl font-bold text-start text-indigo-600">
            QA Dashboard
          </h3>

          {/* View Selection */}
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

        {/* Render Counts */}
        {renderCounts()}

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
};

export default QaDashboard;
