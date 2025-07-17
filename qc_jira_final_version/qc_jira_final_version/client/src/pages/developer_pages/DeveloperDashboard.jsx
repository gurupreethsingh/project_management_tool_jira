import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaClipboardList,
  FaCalendarAlt,
  FaRegCalendarCheck,
  FaProjectDiagram,
  FaBug,
  FaThList,
  FaThLarge,
  FaTh,
} from "react-icons/fa"; // Import necessary icons
import { Link } from "react-router-dom";

const DeveloperDashboard = () => {
  const [view, setView] = useState("grid");
  const [assignedProjects, setAssignedProjects] = useState(0);
  const [assignedDefects, setAssignedDefects] = useState(0); // New state for assigned defects
  const [assignedEvents, setAssignedEvents] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [scheduledMeetings, setScheduledMeetings] = useState(0);

  // Get userId and role from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;
  const role = user ? user.role : "developer"; // Set default role as "developer"

  useEffect(() => {
    if (userId && role) {
      fetchCounts();
    } else {
      console.error("User ID or role not found in localStorage");
    }
  }, [userId, role]);

  // Fetch counts of assigned projects, defects, events, and meetings
  const fetchCounts = async () => {
    try {
      // Fetch project count for this user based on their role
      const response = await axios.get(
        `http://localhost:5000/user-project-count/${userId}?role=${role}`
      );
      const { assignedProjectsCount } = response.data;
      setAssignedProjects(assignedProjectsCount);

      // Fetch defect count for the logged-in developer
      const defectRes = await axios.get(
        `http://localhost:5000/developer-lead/${userId}/assigned-defects`
      );
      // setDefectCount(defectRes.data.defects.length);
      const assignedDefectsCount = defectRes.data.defects.length;
      setAssignedDefects(assignedDefectsCount);

      // You can add similar API calls for events, upcoming events, and meetings if needed
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
        title: "Assigned Projects",
        count: assignedProjects,
        icon: <FaProjectDiagram className="text-blue-500" />,
        linkText: "View Assigned Projects",
        link: `/user-assigned-projects/${userId}`, // Assuming the user is directed to a general page for their assigned projects
      },
      {
        title: "Assigned Defects", // New card for defects
        count: assignedDefects,
        icon: <FaBug className="text-red-500" />, // Use bug icon for defects
        linkText: "View Assigned Defects",
        link: `/single-project/${userId}/developer/${userId}/view-assigned-defects`, // Link to view assigned defects page
      },
      {
        title: "Assigned Events",
        count: assignedEvents,
        icon: <FaClipboardList className="text-green-500" />,
        linkText: "View Assigned Events",
        link: "/assigned-events",
      },
      {
        title: "Upcoming Events",
        count: upcomingEvents,
        icon: <FaRegCalendarCheck className="text-purple-500" />,
        linkText: "View Upcoming Events",
        link: "/upcoming-events",
      },
      {
        title: "Scheduled Meetings",
        count: scheduledMeetings,
        icon: <FaCalendarAlt className="text-orange-500" />,
        linkText: "View Scheduled Meetings",
        link: "/scheduled-meetings",
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
            Developer Dashboard
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

export default DeveloperDashboard;
