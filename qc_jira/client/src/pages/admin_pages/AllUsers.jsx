import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThList, FaThLarge, FaTh, FaSearch } from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

export default function AllUsers() {
  const [users, setUsers] = useState([]); // State to hold fetched users
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${globalBackendRoute}/api/all-users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Fetch the current user's role from localStorage or from an API
    const fetchCurrentUserRole = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role) {
        setCurrentUserRole(user.role);
      }
    };

    fetchUsers();
    fetchCurrentUserRole();
  }, []);

  const getImageUrl = (avatar) => {
    if (avatar) {
      // Replace backslashes with forward slashes and ensure proper relative path usage
      const normalizedPath = avatar.replace(/\\/g, "/").split("uploads/").pop();
      return `${globalBackendRoute}/uploads/${normalizedPath}`;
    }
    return "https://via.placeholder.com/150";
  };

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <h2 className="text-left text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              All Users
            </h2>
          </div>
          <div className="flex items-center space-x-4 flex-wrap">
            <FaThList
              className={`text-xl cursor-pointer ${
                view === "list" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("list")}
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${
                view === "card" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("card")}
            />
            <FaTh
              className={`text-xl cursor-pointer ${
                view === "grid" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("grid")}
            />
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {users
                .filter((user) =>
                  [user.name, user.email, user.role]
                    .map((field) => field.toLowerCase())
                    .some((field) => field.includes(searchQuery.toLowerCase()))
                )
                .map((user) => (
                  <div
                    key={user._id}
                    className="flex flex-col items-start relative"
                  >
                    <img
                      src={getImageUrl(user.avatar)}
                      alt={user.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <h3 className="mt-2 text-md font-semibold text-gray-900 text-left">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600 text-left">
                      {user.email}
                    </p>
                    <p className="text-sm text-gray-600 text-left">
                      {user.role}
                    </p>
                  </div>
                ))}
            </div>
          )}
          {view === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {users
                .filter((user) =>
                  [user.name, user.email, user.role]
                    .map((field) => field.toLowerCase())
                    .some((field) => field.includes(searchQuery.toLowerCase()))
                )
                .map((user) => (
                  <div
                    key={user._id}
                    className="flex flex-col items-start bg-white rounded-lg shadow relative"
                  >
                    <img
                      src={getImageUrl(user.avatar)}
                      alt={user.name}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 text-left">
                      {user.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 text-left">
                      {user.email}
                    </p>
                    <p className="mt-2 text-sm text-gray-600 text-left">
                      {user.role}
                    </p>
                  </div>
                ))}
            </div>
          )}
          {view === "list" && (
            <div className="space-y-6">
              {users
                .filter((user) =>
                  [user.name, user.email, user.role]
                    .map((field) => field.toLowerCase())
                    .some((field) => field.includes(searchQuery.toLowerCase()))
                )
                .map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center space-x-4 bg-white rounded-lg shadow relative"
                  >
                    <img
                      src={getImageUrl(user.avatar)}
                      alt={user.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 text-left">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-600 text-left">
                        {user.email}
                      </p>
                      <p className="text-sm text-gray-600 text-left">
                        {user.role}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
