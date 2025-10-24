import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThList, FaThLarge, FaTh, FaSearch } from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const AllAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(
          `${globalBackendRoute}/api/all-admins`
        );
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  const getImageUrl = (avatar) => {
    if (avatar) {
      const normalizedPath = avatar.replace(/\\/g, "/").split("uploads/").pop();
      return `${globalBackendRoute}/uploads/${normalizedPath}`;
    }
    return "https://via.placeholder.com/150";
  };

  const filteredAdmins = admins.filter((admin) =>
    [admin.name, admin.email, admin.role]
      .map((field) => field.toLowerCase())
      .some((field) => field.includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Title on the left, Search and Icons on the right */}
        <div className="flex justify-between items-center flex-wrap mb-6">
          <div>
            <h2 className="text-left text-2xl font-bold tracking-tight text-indigo-600 sm:text-4xl">
              All Admins
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
                placeholder="Search admins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
          </div>
        </div>

        {/* Admin Count */}
        <div className="mb-4 text-lg  text-gray-700">
          Total Admins: {filteredAdmins.length}
        </div>

        <div className="">
          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {filteredAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className="flex flex-col items-start relative shadow rounded"
                >
                  <img
                    src={getImageUrl(admin.avatar)}
                    alt={admin.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <h3 className="mt-2 ps-1 text-md font-semibold text-gray-900 text-left">
                    {admin.name}
                  </h3>
                  <p className="text-sm ps-1 text-gray-600 text-left">
                    {admin.email}
                  </p>
                  <p className="text-sm ps-1 text-gray-600 text-left">
                    {admin.role}
                  </p>
                </div>
              ))}
            </div>
          )}

          {view === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className="flex flex-col items-start bg-white rounded-lg shadow relative"
                >
                  <img
                    src={getImageUrl(admin.avatar)}
                    alt={admin.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <h3 className="ps-2 text-lg font-semibold text-gray-700 text-left">
                    Name : <span className="text-gray-700">{admin.name}</span>
                  </h3>
                  <p className="ps-2 text-sm text-gray-600 text-left">
                    Email : {admin.email}
                  </p>
                  <p className="ps-2 text-sm text-gray-600 text-left">
                    Role : {admin.role}
                  </p>
                </div>
              ))}
            </div>
          )}

          {view === "list" && (
            <div className="space-y-6">
              {filteredAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className="flex items-center space-x-4 bg-white rounded-lg shadow relative"
                >
                  <img
                    src={getImageUrl(admin.avatar)}
                    alt={admin.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 text-left">
                      {admin.name}
                    </h3>
                    <p className="text-sm text-gray-600 text-left">
                      {admin.email}
                    </p>
                    <p className="text-sm text-gray-600 text-left">
                      {admin.role}
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
};

export default AllAdmins;
