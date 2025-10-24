import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaClipboardList,
  FaProjectDiagram,
  FaUserShield,
  FaUserTie,
  FaUserCheck,
  FaUsersCog,
  FaThList,
  FaThLarge,
  FaTh,
  FaRegCalendarCheck,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

const AdminDashboard = () => {
  const [view, setView] = useState("grid");
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalDevelopers, setTotalDevelopers] = useState(0);
  const [totalTestEngineers, setTotalTestEngineers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const projectResponse = await axios.get(
        `${globalBackendRoute}/api/count-projects`
      );
      setTotalProjects(projectResponse.data.totalProjects);

      const adminsResponse = await axios.get(
        `${globalBackendRoute}/api/count-admins`
      );
      setTotalAdmins(adminsResponse.data.totalAdmins);

      const developersResponse = await axios.get(
        `${globalBackendRoute}/api/count-developers`
      );
      setTotalDevelopers(developersResponse.data.totalDevelopers);

      const testEngineersResponse = await axios.get(
        `${globalBackendRoute}/api/count-test-engineers`
      );
      setTotalTestEngineers(testEngineersResponse.data.totalTestEngineers);

      const usersResponse = await axios.get(
        `${globalBackendRoute}/api/count-users`
      );
      setTotalUsers(usersResponse.data.totalUsers);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching counts:", error);
      setLoading(false);
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
        title: "View Attendance",
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
            {item.count !== undefined && (
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
          <h3 className="text-2xl font-bold text-start text-indigo-600">
            Admin Dashboard
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

        {loading ? (
          <p className="text-center text-gray-500">Loading dashboard data...</p>
        ) : (
          renderCounts()
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
