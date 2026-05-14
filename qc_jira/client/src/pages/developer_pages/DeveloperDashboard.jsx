import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaClipboardList,
  FaRegCalendarCheck,
  FaProjectDiagram,
  FaBug,
  FaThList,
  FaThLarge,
  FaTh,
  FaCodeBranch,
  FaUsers,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
};

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const DeveloperDashboard = () => {
  const [view, setView] = useState("grid");
  const [assignedProjects, setAssignedProjects] = useState(0);
  const [assignedDefects, setAssignedDefects] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [assignedProjectsList, setAssignedProjectsList] = useState([]);
  const [error, setError] = useState("");

  const user = getUser();
  const userId = user?._id || user?.id;
  const role = user?.role || "developer";

  useEffect(() => {
    if (userId && role) {
      fetchCounts();
    } else {
      setError("User ID or role not found. Please login again.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, role]);

  const fetchCounts = async () => {
    try {
      setError("");

      const projectCountRes = await axios.get(
        `${globalBackendRoute}/api/user-project-count/${userId}?role=${encodeURIComponent(
          role,
        )}`,
        authHeaders(),
      );

      setAssignedProjects(
        Number(projectCountRes?.data?.assignedProjectsCount || 0),
      );

      try {
        const assignedProjectsRes = await axios.get(
          `${globalBackendRoute}/api/user-assigned-projects/${userId}`,
          authHeaders(),
        );

        const projects =
          assignedProjectsRes?.data?.assignedProjects ||
          assignedProjectsRes?.data?.projects ||
          [];

        setAssignedProjectsList(projects);
      } catch (projectListErr) {
        console.error("Assigned projects list error:", projectListErr);
      }

      try {
        const defectEndpoint =
          role === "developer_lead"
            ? `${globalBackendRoute}/api/developer-lead/${userId}/assigned-defects`
            : `${globalBackendRoute}/api/developer/${userId}/assigned-defects`;

        const defectRes = await axios.get(defectEndpoint, authHeaders());

        setAssignedDefects(
          Array.isArray(defectRes?.data?.defects)
            ? defectRes.data.defects.length
            : Number(defectRes?.data?.count || 0),
        );
      } catch (defectErr) {
        console.error("Assigned defects count error:", defectErr);
        setAssignedDefects(0);
      }

      try {
        const attendanceRes = await axios.get(
          `${globalBackendRoute}/api/count-attendance/employee/${userId}`,
          authHeaders(),
        );

        setAttendanceCount(Number(attendanceRes?.data?.count || 0));
      } catch (attendanceErr) {
        console.error("Attendance count error:", attendanceErr);
        setAttendanceCount(0);
      }
    } catch (error) {
      console.error("Error fetching developer dashboard data:", error);
      setError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to fetch dashboard data.",
      );
    }
  };

  const handleViewChange = (viewType) => {
    setView(viewType);
  };

  const dashboardTitle =
    role === "developer_lead"
      ? "Developer Lead Dashboard"
      : "Developer Dashboard";

  const counts = [
    {
      title: "Assigned Projects",
      count: assignedProjects,
      icon: <FaProjectDiagram className="text-blue-500" />,
      linkText: "View Assigned Projects",
      link: `/user-assigned-projects/${userId}`,
    },
    {
      title: "Assigned Defects",
      count: assignedDefects,
      icon: <FaBug className="text-red-500" />,
      linkText: "Select Project First",
      link: `/user-assigned-projects/${userId}`,
    },
    {
      title: "Mark Attendance",
      count: attendanceCount,
      icon: <FaRegCalendarCheck className="text-green-600" />,
      linkText: "Go to Attendance",
      link: "/create-attendance",
    },
    {
      title: "Role",
      count: role === "developer_lead" ? "Lead" : "Dev",
      icon: <FaCodeBranch className="text-purple-500" />,
      linkText: "View Profile",
      link: `/profile/${userId}`,
    },
    {
      title: "Project Members",
      count: assignedProjectsList.length,
      icon: <FaUsers className="text-orange-500" />,
      linkText: "View Projects",
      link: `/user-assigned-projects/${userId}`,
    },
  ];

  const renderCounts = () => {
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
            className={`bg-white p-4 shadow-lg rounded-lg ${
              view === "list"
                ? "flex flex-row items-center justify-between"
                : "flex flex-col items-center"
            }`}
          >
            <div className="text-4xl mb-2 flex justify-center">{item.icon}</div>

            <div className={view === "list" ? "flex-1 ml-4" : "text-center"}>
              <h3 className="text-xs font-semibold text-gray-600">
                {item.title}
              </h3>

              <p className="text-2xl font-semibold text-indigo-600 mt-2">
                {item.count}
              </p>

              <Link
                to={item.link}
                state={{
                  message:
                    item.title === "Assigned Defects"
                      ? "Please select a project to view project-specific assigned defects."
                      : undefined,
                }}
                className="mt-2 inline-block text-xs text-indigo-600 hover:text-indigo-800"
              >
                {item.linkText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
          <div>
            <h3 className="text-2xl font-bold text-start text-indigo-600">
              {dashboardTitle}
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Logged in as:{" "}
              <span className="font-semibold text-gray-800">{role}</span>
            </p>
          </div>

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

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {renderCounts()}
      </div>
    </div>
  );
};

export default DeveloperDashboard;
