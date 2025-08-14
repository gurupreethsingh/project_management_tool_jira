import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const TraceabilityMatrix = () => {
  const { projectId } = useParams();
  const [matrix, setMatrix] = useState([]);
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMatrix, setFilteredMatrix] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(6);

  // Count states
  const [totalScenarios, setTotalScenarios] = useState(0);
  const [totalTestCases, setTotalTestCases] = useState(0);
  const [passCount, setPassCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [defectReportCount, setDefectReportCount] = useState(0);
  const [missingTestCasesCount, setMissingTestCasesCount] = useState(0);

  useEffect(() => {
    fetchTraceabilityMatrix();
    adjustCardsPerPage();
    window.addEventListener("resize", adjustCardsPerPage);

    return () => {
      window.removeEventListener("resize", adjustCardsPerPage);
    };
  }, [projectId, view]);

  const fetchTraceabilityMatrix = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/projects/${projectId}/traceability-matrix`
      );
      const matrixData = response.data;

      // Set counts
      setMatrix(matrixData);
      setFilteredMatrix(matrixData);
      setTotalScenarios(matrixData.length);
      setTotalTestCases(
        matrixData.filter((item) => item.testCaseNumber).length
      );
      setPassCount(
        matrixData.filter((item) => item.testCaseStatus === "Pass").length
      );
      setFailCount(
        matrixData.filter((item) => item.testCaseStatus === "Fail").length
      );
      setDefectReportCount(
        matrixData.filter((item) => item.defectReportStatus === "Present")
          .length
      );
      setMissingTestCasesCount(
        matrixData.filter(
          (item) => !item.testCaseNumber || item.testCaseNumber === "Missing"
        ).length
      );
    } catch (error) {
      console.error("Error fetching traceability matrix:", error.message);
    }
  };

  const adjustCardsPerPage = () => {
    const width = window.innerWidth;

    // Dynamic card/grid count based on screen width
    if (view === "card") {
      if (width >= 1920) setCardsPerPage(6); // 1920×1080: 6 cards
      else if (width >= 1366) setCardsPerPage(6); // 1366×768: 6 cards
      else if (width >= 1280) setCardsPerPage(6); // 1280×1024: 6 cards
      else if (width >= 1024) setCardsPerPage(6); // 1024×768: 6 cards
    } else if (view === "grid") {
      if (width >= 1920) setCardsPerPage(10); // 1920×1080: 10 cards
      else if (width >= 1366) setCardsPerPage(8); // 1366×768: 8 cards
      else if (width >= 1280) setCardsPerPage(8); // 1280×1024: 8 cards
      else if (width >= 1024) setCardsPerPage(8); // 1024×768: 8 cards
    } else if (view === "list") {
      if (width >= 1920) setCardsPerPage(6);
      else if (width >= 1366) setCardsPerPage(5);
      else setCardsPerPage(4);
    }
  };

  const getNumberOfColumns = (viewType) => {
    const width = window.innerWidth;

    if (viewType === "grid") {
      if (width >= 1920) return "grid-cols-5";
      if (width >= 1366) return "grid-cols-4";
      return "grid-cols-3";
    } else if (viewType === "card") {
      if (width >= 1920) return "grid-cols-3"; // 1920x1080: 3 cards
      if (width >= 1366) return "grid-cols-2";
      return "grid-cols-1";
    }
  };

  useEffect(() => {
    const searchFilteredMatrix = matrix.filter((item) =>
      [
        item.scenarioNumber?.toString(),
        item.scenarioText,
        item.testCaseNumber?.toString(),
        item.defectNumber?.toString(),
        item.testCaseStatus,
        item.defectReportStatus,
      ].some((field) =>
        field
          ? field.toString().toLowerCase().includes(searchQuery.toLowerCase())
          : false
      )
    );
    setFilteredMatrix(searchFilteredMatrix);
    setTotalPages(Math.ceil(searchFilteredMatrix.length / cardsPerPage));
  }, [searchQuery, matrix, cardsPerPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderGridOrCardView = (viewType) => {
    const columnClass = getNumberOfColumns(viewType);

    return (
      <div className={`grid ${columnClass} gap-4 mt-10`}>
        {filteredMatrix
          .slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)
          .map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-gray-600">
                  Scenario Number: {item.scenarioNumber}
                </div>
                <div className="text-sm text-gray-600">
                  Scenario Description: {item.scenarioText}
                </div>
                <div className="text-sm text-gray-600">
                  Test Case Number: {item.testCaseNumber || "N/A"}
                </div>
                <div className="text-sm text-gray-600">
                  Test Case Status:{" "}
                  {item.testCaseStatus === "Fail" ? (
                    <span className="text-red-500">Fail</span>
                  ) : (
                    <span className="text-green-500">Pass</span>
                  )}
                </div>
              </div>
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
              Traceability Matrix for Project: {projectId}
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
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Link
                to={`/single-project/${projectId}`}
                className="bg-indigo-700 text-white px-3 py-2 rounded-md hover:bg-indigo-900"
              >
                Project Dashboard
              </Link>
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600 mt-2">
            Total Scenarios: {totalScenarios} | Expected TestCases:{" "}
            {totalTestCases} |{" "}
            <span className="text-red-600">
              Missing Test Cases: {missingTestCasesCount}
            </span>{" "}
            |{" "}
            <span className="text-green-600">
              Pass Test Cases: {passCount}{" "}
            </span>{" "}
            |{" "}
            <span className="text-red-600">Fail Test Cases : {failCount}</span>{" "}
            |
            <span className="text-red-600">
              Missing Defect Reports: {defectReportCount}
            </span>{" "}
          </p>
          {searchQuery && (
            <p className="text-sm text-gray-600">
              Showing {filteredMatrix.length} result(s) for "{searchQuery}"
            </p>
          )}
        </div>

        {view === "list" ? (
          <div className="mt-10 space-y-6">
            {filteredMatrix
              .slice(
                (currentPage - 1) * cardsPerPage,
                currentPage * cardsPerPage
              )
              .map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white rounded-lg shadow p-4"
                >
                  <div className="flex flex-1 space-x-4">
                    <div className="flex flex-col w-1/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Serial Number
                      </span>
                      <span className="text-sm text-gray-900">{index + 1}</span>
                    </div>
                    <div className="flex flex-col w-1/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Scenario Number
                      </span>
                      <span className="text-sm text-gray-700 font-semibold">
                        {item.scenarioNumber}
                      </span>
                    </div>
                    <div className="flex flex-col w-4/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Scenario Description
                      </span>
                      <span className="text-sm text-gray-900">
                        {item.scenarioText}
                      </span>
                    </div>
                    <div className="flex flex-col w-1/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Test Case Number
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          item.testCaseNumber === "Missing"
                            ? "text-red-500 font-bold"
                            : "text-gray-700 font-semibold"
                        }`}
                      >
                        {item.testCaseNumber || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col w-1/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Test Case Status
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          item.testCaseStatus === "Fail"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {item.testCaseStatus || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col w-1/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Defect Number
                      </span>
                      <span className="text-sm text-gray-900">
                        {item.defectNumber || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col w-1/12">
                      <span className="text-sm font-semibold text-gray-600">
                        Defect Report
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          item.defectReportStatus === "Present"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.defectReportStatus || "N/A"}
                      </span>
                    </div>
                  </div>
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

export default TraceabilityMatrix;
