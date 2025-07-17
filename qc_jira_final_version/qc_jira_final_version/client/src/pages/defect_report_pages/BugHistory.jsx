import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // To get the defect ID from URL
import axios from "axios";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaSearch,
  FaEye,
  FaTrashAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const BugHistory = () => {
  const { defectId } = useParams(); // Get defectId from the route
  const [history, setHistory] = useState([]);
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch token from local storage
  const token = localStorage.getItem("token"); // Ensure you save the token during login

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Ensure the token exists before making the request
        if (!token) {
          console.error("Token not found, please log in.");
          return;
        }

        // Make the API call to fetch bug history
        const response = await axios.get(
          `http://localhost:5000/bug-history/${defectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Sending the token with the request
            },
          }
        );

        // Update the history state and calculate pagination
        setHistory(response.data);
        setFilteredHistory(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching bug history:", error);
      }
    };

    fetchHistory();
  }, [defectId, itemsPerPage, token]);

  useEffect(() => {
    const searchFilteredHistory = history.filter((entry) =>
      [
        entry.scenario_number,
        entry.test_case_number,
        entry.module_name,
        entry.status,
        entry.updated_by,
      ]
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(searchQuery.toLowerCase()))
    );
    setFilteredHistory(searchFilteredHistory);
    setTotalPages(Math.ceil(searchFilteredHistory.length / itemsPerPage));
  }, [searchQuery, history]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHistory = filteredHistory.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <h2 className="text-left font-semibold tracking-tight text-indigo-600 sm:text-1xl">
              Bug History for Defect: {defectId}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Total History Entries: {history.length}
            </p>
            {searchQuery && (
              <p className="text-sm text-gray-600">
                Showing {filteredHistory.length} result(s) for "{searchQuery}"
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4 flex-wrap">
            <FaThList
              className={`text-xl cursor-pointer ${
                view === "list" ? "text-blue-400" : "text-gray-500"
              }`}
              onClick={() => setView("list")}
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${
                view === "card" ? "text-blue-400" : "text-gray-500"
              }`}
              onClick={() => setView("card")}
            />
            <FaTh
              className={`text-xl cursor-pointer ${
                view === "grid" ? "text-blue-400" : "text-gray-500"
              }`}
              onClick={() => setView("grid")}
            />
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* List View */}
        {view === "list" && (
          <div className="mt-10 space-y-6">
            {currentHistory.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white rounded-lg shadow relative p-4"
              >
                <div className="flex flex-1 space-x-4">
                  <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
                    <span className="text-sm font-semibold text-gray-600">
                      Scenario Number
                    </span>
                    <span className="text-sm text-gray-900">
                      {entry.scenario_number}
                    </span>
                  </div>

                  <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
                    <span className="text-sm font-semibold text-gray-600">
                      Test Case Number
                    </span>
                    <span className="text-sm text-gray-900">
                      {entry.test_case_number}
                    </span>
                  </div>

                  <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
                    <span className="text-sm font-semibold text-gray-600">
                      Module Name
                    </span>
                    <span className="text-sm text-gray-900">
                      {entry.module_name}
                    </span>
                  </div>

                  <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
                    <span className="text-sm font-semibold text-gray-600">
                      Status
                    </span>
                    <span className="text-sm text-gray-900">
                      {entry.status}
                    </span>
                  </div>

                  <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
                    <span className="text-sm font-semibold text-gray-600">
                      Updated By
                    </span>
                    <span className="text-sm text-gray-900">
                      {entry.updated_by}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid View */}
        {view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-10">
            {currentHistory.map((entry, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-600">
                    Scenario Number: {entry.scenario_number}
                  </div>
                  <div className="text-sm text-gray-600">
                    Test Case Number: {entry.test_case_number}
                  </div>
                  <div className="text-sm text-gray-600">
                    Module Name: {entry.module_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Status: {entry.status}
                  </div>
                  <div className="text-sm text-gray-600">
                    Updated By: {entry.updated_by}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Card View */}
        {view === "card" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {currentHistory.map((entry, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-600">
                    Scenario Number: {entry.scenario_number}
                  </div>
                  <div className="text-sm text-gray-600">
                    Test Case Number: {entry.test_case_number}
                  </div>
                  <div className="text-sm text-gray-600">
                    Module Name: {entry.module_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Status: {entry.status}
                  </div>
                  <div className="text-sm text-gray-600">
                    Updated By: {entry.updated_by}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 mt-10">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <FaArrowRight className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BugHistory;
