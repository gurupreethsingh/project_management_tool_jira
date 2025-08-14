// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   FaClipboardList,
//   FaProjectDiagram,
//   FaUserShield,
//   FaUserTie,
//   FaUserCheck,
//   FaUsersCog,
//   FaThList,
//   FaThLarge,
//   FaTh,
//   FaRegCalendar,
//   FaRegCalendarCheck,
// } from "react-icons/fa"; // Import necessary icons
// import { Link } from "react-router-dom";
// import globalBackendRoute from "../../config/Config";

// const SuperAdminDashboard = () => {
//   const [view, setView] = useState("grid");
//   const [totalProjects, setTotalProjects] = useState(0);
//   const [totalAdmins, setTotalAdmins] = useState(0);
//   const [totalDevelopers, setTotalDevelopers] = useState(0);
//   const [totalTestEngineers, setTotalTestEngineers] = useState(0);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [totalNotifications, setTotalNotifications] = useState(0);

//   useEffect(() => {
//     fetchCounts();
//   }, []);

//   const fetchCounts = async () => {
//     try {
//       const projectResponse = await axios.get(
//         `${globalBackendRoute}/count-projects`
//       );
//       setTotalProjects(projectResponse.data.totalProjects);

//       const usersResponse = await axios.get(
//         `${globalBackendRoute}/count-users`
//       );

//       const notificationResponse = await axios.get(
//         `${globalBackendRoute}/api/counts/admin/all`
//       );

//       setTotalNotifications(notificationResponse);
//       console.log(notificationResponse);

//       const { totalUsers, totalAdmins, totalDevelopers, totalTestEngineers } =
//         usersResponse.data;

//       setTotalAdmins(totalAdmins);
//       setTotalDevelopers(totalDevelopers);
//       setTotalTestEngineers(totalTestEngineers);
//       setTotalUsers(totalUsers);
//     } catch (error) {
//       console.error("Error fetching counts:", error);
//     }
//   };

//   const handleViewChange = (viewType) => {
//     setView(viewType);
//   };

//   const renderCounts = () => {
//     const counts = [
//       {
//         title: "Total Projects",
//         count: totalProjects,
//         icon: <FaProjectDiagram className="text-blue-500" />,
//         linkText: "Project Dashboard",
//         link: "/all-projects",
//       },
//       {
//         title: "Total Admins",
//         count: totalAdmins,
//         icon: <FaUserShield className="text-green-500" />,
//         linkText: "View All Admins",
//         link: "/all-admins",
//       },
//       {
//         title: "Total Developers",
//         count: totalDevelopers,
//         icon: <FaUserTie className="text-yellow-500" />,
//         linkText: "View All Developers",
//         link: "/all-developers",
//       },
//       {
//         title: "Total Test Engineers",
//         count: totalTestEngineers,
//         icon: <FaUserCheck className="text-purple-500" />,
//         linkText: "View All Test Engineers",
//         link: "/all-test-engineers",
//       },
//       {
//         title: "View Attendance",
//         icon: <FaRegCalendarCheck className="text-green-600" />,
//         linkText: "Go to Attendance",
//         link: "/view-all-attendance",
//       },
//       {
//         title: "Total Users",
//         count: totalUsers,
//         icon: <FaUsersCog className="text-red-500" />,
//         linkText: "View All Users",
//         link: "/all-users",
//       },
//       {
//         title: "Notifications",
//         icon: <FaUsersCog className="text-pink-500" />,
//         linkText: "Create Notifications",
//         link: "/create-notification",
//       },
//     ];

//     return (
//       <div
//         className={`${
//           view === "grid"
//             ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
//             : view === "card"
//             ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
//             : "space-y-4"
//         }`}
//       >
//         {counts.map((item, index) => (
//           <div
//             key={index}
//             className="bg-white p-4 shadow-lg rounded-lg flex flex-col items-center relative"
//           >
//             {/* Icon */}
//             <div className="text-4xl mb-2 flex justify-center">{item.icon}</div>
//             {/* Title */}
//             <h3 className="text-xs font-semibold text-gray-600">
//               {item.title}
//             </h3>
//             {/* Count */}
//             <p className="text-2xl font-semibold text-indigo-600 mt-2">
//               {item.count}
//             </p>
//             {/* Link */}
//             <Link
//               to={item.link}
//               className="mt-2 text-xs text-indigo-600 hover:text-indigo-800"
//             >
//               {item.linkText}
//             </Link>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const renderPagination = () => {
//     return null; // Placeholder for future pagination logic
//   };

//   return (
//     <div className="py-16 sm:py-20">
//       <div className="mx-auto max-w-7xl px-6 lg:px-8">
//         {/* Header with View Selection */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
//           <h3 className="text-2xl font-bold text-start text-indigo-600">
//             Super Admin Dashboard
//           </h3>

//           {/* View Selection */}
//           <div className="flex space-x-4 justify-center md:justify-start">
//             <FaThList
//               className={`text-xl cursor-pointer ${
//                 view === "list" ? "text-indigo-600" : "text-gray-600"
//               }`}
//               onClick={() => handleViewChange("list")}
//             />
//             <FaThLarge
//               className={`text-xl cursor-pointer ${
//                 view === "card" ? "text-indigo-600" : "text-gray-600"
//               }`}
//               onClick={() => handleViewChange("card")}
//             />
//             <FaTh
//               className={`text-xl cursor-pointer ${
//                 view === "grid" ? "text-indigo-600" : "text-gray-600"
//               }`}
//               onClick={() => handleViewChange("grid")}
//             />
//           </div>
//         </div>

//         {/* Render Counts */}
//         {renderCounts()}

//         {/* Pagination */}
//         {renderPagination()}
//       </div>
//     </div>
//   );
// };

// export default SuperAdminDashboard;

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

  // notifications summary (from /api/counts/admin/all)
  const [notifCounts, setNotifCounts] = useState({
    total: 0,
    all: 0,
    role: 0,
    user: 0,
  });

  useEffect(() => {
    fetchCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCounts = async () => {
    try {
      // 1) projects (no auth)
      const projectResponse = await axios.get(
        `${globalBackendRoute}/count-projects`
      );
      setTotalProjects(projectResponse?.data?.totalProjects || 0);

      // 2) users (no auth)
      const usersResponse = await axios.get(
        `${globalBackendRoute}/count-users`
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

      // 3) notifications (ADMIN-ONLY, needs token + admin/superadmin role)
      // Fallback to either key so older parts of the app still work.
      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      if (!token) {
        console.warn(
          "No token found in localStorage ('userToken' | 'token'). Admin notification counts will 401."
        );
      } else {
        const notificationResponse = await axios.get(
          `${globalBackendRoute}/api/counts/admin/all`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // response shape from controller: { all, role, user, total }
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
        title: "Notifications (All)",
        count: notifCounts.total, // total messages (all + role + user)
        icon: <FaUsersCog className="text-pink-500" />,
        linkText: "Create Notifications",
        link: "/create-notification",
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
