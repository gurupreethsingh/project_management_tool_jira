import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import ecoders_logo from "../assets/ecoders_logo.png";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAdminOrSuperAdmin, setAdminOrSuperAdmin] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!userToken || !userData) {
      setIsLoggedIn(false);
      return;
    }

    // Set user data from localStorage
    setIsLoggedIn(true);
    setUserName(userData.name);
    setUserId(userData.id);
    setUser(userData);

    if (userData.role === "admin" || userData.role === "superadmin") {
      setAdminOrSuperAdmin(true);
      fetchUnreadMessages();
    } else {
      setAdminOrSuperAdmin(false);
    }

    // Remove automatic redirection to dashboards, allowing navigation to work smoothly
  }, [location.pathname]);

  const fetchUnreadMessages = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/messages/unread-count"
      );
      setUnreadMessagesCount(response.data.unreadCount);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setUserName("");
    setUserId(null);
    setAdminOrSuperAdmin(false);
    navigate("/", { replace: true });
  };

  const getDashboardLink = (role) => {
    const dashboardLinks = {
      superadmin: "/super-admin-dashboard",
      admin: "/admin-dashboard",
      qa_lead: "/qa-dashboard",
      test_engineer: "/test-engineer-dashboard",
      developer: "/developer-dashboard",
      developer_lead: "/developer-lead-dashboard",
      project_manager : "/project-manager-dashboard",
    };
    return dashboardLinks[role] || "/dashboard";
  };

  return (
    <header className="bg-white border-b z-50 relative p-2">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-full items-center justify-between w-full px-4"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              alt="Your Company"
              src={
                ecoders_logo ||
                "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              }
              className="h-16 w-auto"
            />
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-x-8 w-full whitespace-nowrap">
          <Link
            to="/"
            className="text-sm font-semibold leading-6 text-gray-600"
          >
            Home
          </Link>

          {isLoggedIn && (
            <>
              {isAdminOrSuperAdmin ? (
                <>
                  <Link
                    to="/all-users"
                    className="text-sm font-semibold leading-6 text-gray-700"
                  >
                    All Users
                  </Link>
                  <Link
                    to={getDashboardLink(user.role)}
                    className="text-sm font-semibold leading-6 text-gray-700"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <Link
                  to={getDashboardLink(user.role)}
                  className="text-sm font-semibold leading-6 text-gray-700"
                >
                  Dashboard
                </Link>
              )}
            </>
          )}

          <Link
            to="/all-blogs"
            className="text-sm font-semibold leading-6 text-gray-700"
          >
            Blogs
          </Link>
          <Link
            to="/contact"
            className="text-sm font-semibold leading-6 text-gray-700"
          >
            Contact
          </Link>
          <Link
            to="/about-us"
            className="text-sm font-semibold leading-6 text-gray-700"
          >
            About Us
          </Link>
        </div>

        <div className="flex lg:flex-1 lg:justify-end">
          {isLoggedIn ? (
            <Menu as="div" className="relative z-50">
              <Menu.Button className="flex items-center text-sm font-semibold leading-6 text-gray-700">
                <UserIcon className="h-5 w-5 text-gray-700 mr-2" />
                {userName}
                {unreadMessagesCount > 0 && (
                  <span className="ml-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {unreadMessagesCount}
                  </span>
                )}
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item as="div">
                  {({ active }) => (
                    <Link
                      to={`/profile/${userId}`}
                      className={`block px-4 py-2 text-sm text-gray-700 ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      Profile
                    </Link>
                  )}
                </Menu.Item>

                {isAdminOrSuperAdmin && (
                  <Menu.Item as="div">
                    {({ active }) => (
                      <Link
                        to="/all-messages"
                        className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${
                          active ? "bg-gray-100" : ""
                        }`}
                      >
                        View Messages
                      </Link>
                    )}
                  </Menu.Item>
                )}

                <Menu.Item as="div">
                  {({ active }) => (
                    <Link
                      to={getDashboardLink(user.role)}
                      className={`block px-4 py-2 text-sm text-gray-700 ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      Dashboard
                    </Link>
                  )}
                </Menu.Item>

                {isAdminOrSuperAdmin && (
                  <Menu.Item as="div">
                    {({ active }) => (
                      <Link
                        to="/all-replies"
                        className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${
                          active ? "bg-gray-100" : ""
                        }`}
                      >
                        All Replies
                      </Link>
                    )}
                  </Menu.Item>
                )}

                <Menu.Item as="div">
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      Log out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          ) : (
            <Link
              to="/login"
              className="text-sm font-semibold leading-6 text-gray-700"
            >
              Log in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
