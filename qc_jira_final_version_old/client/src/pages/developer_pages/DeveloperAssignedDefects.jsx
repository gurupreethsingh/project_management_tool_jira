import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaThList,
  FaThLarge,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const DeveloperAssignedDefects = () => {
  const { projectId } = useParams();
  const [defects, setDefects] = useState([]);
  const [view, setView] = useState("list"); // Toggle between list and card view
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDefects, setFilteredDefects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(6);

  // Count states for status types
  const [statusCounts, setStatusCounts] = useState({
    open: 0,
    fixed: 0,
    pending: 0,
    reopened: 0,
    unableToFix: 0,
  });

  useEffect(() => {
    fetchAssignedDefects();
    adjustCardsPerPage();
    window.addEventListener("resize", adjustCardsPerPage);

    return () => {
      window.removeEventListener("resize", adjustCardsPerPage);
    };
  }, [projectId, view]);

  const fetchAssignedDefects = async () => {
    try {
      // Fetch the logged-in user from localStorage
      const loggedInUser = JSON.parse(localStorage.getItem("user"));

      if (!loggedInUser || !loggedInUser.id) {
        console.error("No logged-in user found in localStorage.");
        return;
      }

      // Fetch defects assigned to the logged-in developer
      const response = await axios.get(
        `http://localhost:5000/single-project/${projectId}/developer/${loggedInUser.id}/view-assigned-defects`
      );

      const defectsData = response.data;
      setDefects(defectsData);
      setFilteredDefects(defectsData);
      setTotalPages(Math.ceil(defectsData.length / cardsPerPage));

      // Calculate status counts
      const statusCounts = {
        open: defectsData.filter((defect) => defect.status === "Open/New")
          .length,
        fixed: defectsData.filter((defect) => defect.status === "Fixed").length,
        pending: defectsData.filter((defect) => defect.status === "Pending")
          .length,
        reopened: defectsData.filter((defect) => defect.status === "Re-opened")
          .length,
        unableToFix: defectsData.filter(
          (defect) => defect.status === "Unable-To-Fix"
        ).length,
      };
      setStatusCounts(statusCounts);
    } catch (error) {
      console.error("Error fetching assigned defects:", error.message);
    }
  };

  const adjustCardsPerPage = () => {
    const width = window.innerWidth;

    if (view === "card") {
      if (width >= 1920) setCardsPerPage(6);
      else if (width >= 1366) setCardsPerPage(6);
      else setCardsPerPage(4);
    } else if (view === "list") {
      setCardsPerPage(6);
    }
  };

  const getNumberOfColumns = (viewType) => {
    const width = window.innerWidth;
    if (viewType === "grid" || viewType === "card") {
      if (width >= 1920) return "grid-cols-3";
      if (width >= 1366) return "grid-cols-2";
      return "grid-cols-1";
    }
  };

  useEffect(() => {
    // Make search case-insensitive and search through multiple fields
    const searchFilteredDefects = defects.filter((item) =>
      [
        item.defectId?.toString(),
        item.defectBugId?.toString(),
        item.expectedResult,
        item.moduleName,
        item.assignedBy,
      ]
        .filter(Boolean) // Ensure no null or undefined values are searched
        .some((field) =>
          field.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    setFilteredDefects(searchFilteredDefects);
    setTotalPages(Math.ceil(searchFilteredDefects.length / cardsPerPage));
  }, [searchQuery, defects, cardsPerPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderGridOrCardView = (viewType) => {
    const columnClass = getNumberOfColumns(viewType);

    return (
      <div className={`grid ${columnClass} gap-4 mt-10`}>
        {filteredDefects
          .slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)
          .map((defect, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-gray-600">
                  SL No: {defect.defectBugId}
                </div>
                <div className="text-sm text-gray-600">
                  Defect Number: {defect.defectNumber}
                </div>
                <div className="text-sm text-gray-600">
                  Expected Result: {defect.expectedResult}
                </div>
                <div className="text-sm text-gray-600">
                  Module Name: {defect.moduleName}
                </div>
                <div className="text-sm text-gray-600">
                  Assigned By: {defect.assignedBy}
                </div>
                <div className="text-sm text-gray-600">
                  Status:{" "}
                  {defect.status === "Fail" ? (
                    <span className="text-red-500">{defect.status}</span>
                  ) : (
                    <span className="text-green-500">{defect.status}</span>
                  )}
                </div>
              </div>
              <Link
                to={`/single-project/${defect.projectId}/defect/${defect.defectId}`}
                className="text-blue-500 mt-2 inline-block"
              >
                View Defect Details
              </Link>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <h2 className="text-left font-semibold tracking-tight text-indigo-600 sm:text-1xl">
              Developer's Assigned Defects for Project: {projectId}
            </h2>
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
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Link
                to={`/single-project/${projectId}`}
                className="bg-indigo-700 text-white px-3 py-1 rounded-md hover:bg-indigo-900"
              >
                Project Dashboard
              </Link>
            </div>
          </div>
        </div>

        {view === "list" ? (
          <div className="mt-10 space-y-6">
            {filteredDefects
              .slice(
                (currentPage - 1) * cardsPerPage,
                currentPage * cardsPerPage
              )
              .map((defect, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white rounded-lg shadow p-4"
                >
                  <div className="flex flex-1 space-x-4">
                    <div className="flex flex-col w-1/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Sl No
                      </span>
                      <span className="text-sm text-gray-900">{index + 1}</span>
                    </div>
                    <div className="flex flex-col w-1/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Module Name
                      </span>
                      <span className="text-sm text-gray-900">
                        {defect.moduleName}
                      </span>
                    </div>
                    <div className="flex flex-col w-4/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Defect Number
                      </span>
                      <span className="text-sm text-gray-900">
                        {defect.defectBugId}
                      </span>
                    </div>
                    <div className="flex flex-col w-4/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Expected Result
                      </span>
                      <span className="text-sm text-gray-900">
                        {defect.expectedResult}
                      </span>
                    </div>

                    <div className="flex flex-col w-4/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Assigned By
                      </span>
                      <span className="text-sm text-gray-900">
                        {defect.assignedBy}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/single-project/${defect.projectId}/defect/${defect.defectId}`}
                    className="text-white btn btn-sm bg-indigo-700 hover:bg-indigo-900"
                  >
                    View Defect Details
                  </Link>
                </div>
              ))}
          </div>
        ) : (
          renderGridOrCardView(view)
        )}

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

export default DeveloperAssignedDefects;
