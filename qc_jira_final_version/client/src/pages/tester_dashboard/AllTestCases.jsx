import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // To get the project ID from URL
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

const AllTestCases = () => {
  const { projectId } = useParams(); // Get projectId from the route
  const [testCases, setTestCases] = useState([]);
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalTestCases, setTotalTestCases] = useState(0);
  const [passedTestCasesCount, setPassedTestCasesCount] = useState(0);
  const [failedTestCasesCount, setFailedTestCasesCount] = useState(0);
  const [filteredTestCases, setFilteredTestCases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/single-project/${projectId}/all-test-cases`
        );
        const testCasesData = response.data;
        setTestCases(testCasesData);
        setTotalTestCases(testCasesData.length);

        const passedCount = testCasesData.filter(
          (testCase) => getTestStatus(testCase) === "Pass"
        ).length;
        const failedCount = testCasesData.length - passedCount;

        setPassedTestCasesCount(passedCount);
        setFailedTestCasesCount(failedCount);
        setFilteredTestCases(testCasesData);
        setTotalPages(Math.ceil(testCasesData.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching test cases:", error);
      }
    };

    fetchTestCases();
  }, [projectId, itemsPerPage]);

  useEffect(() => {
    const searchFilteredTestCases = testCases.filter((testCase) =>
      [
        testCase.test_case_name,
        testCase.requirement_number,
        testCase.module_name,
      ]
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(searchQuery.toLowerCase()))
    );
    setFilteredTestCases(searchFilteredTestCases);
    setTotalPages(Math.ceil(searchFilteredTestCases.length / itemsPerPage));
  }, [searchQuery, testCases]);

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this test case? This action is irreversible."
    );
    if (!userConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/delete-test-case/${id}`);
      setTestCases(testCases.filter((testCase) => testCase._id !== id));
      alert("Test case deleted successfully.");
    } catch (error) {
      console.error("Error deleting test case:", error);
      alert("Error deleting test case");
    }
  };

  const getTestStatus = (testCase) => {
    const hasFailed = testCase.testing_steps.some(
      (step) => step.status === "Fail"
    );
    return hasFailed ? "Fail" : "Pass";
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTestCases = filteredTestCases.slice(
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
              All Test Cases for Project: {projectId}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Total Test Cases: {totalTestCases} | Passed:{" "}
              {passedTestCasesCount} | Failed: {failedTestCasesCount}
            </p>
            {searchQuery && (
              <p className="text-sm text-gray-600">
                Showing {filteredTestCases.length} result(s) for "{searchQuery}"
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
                placeholder="Search test cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <a
                href="/test-case-dashboard"
                className="bg-indigo-700 btn btn-sm text-light hover:bg-indigo-900"
              >
                Test Case Dashboard
              </a>
            </div>
            <div>
              <a
                href={`/single-project/${projectId}`}
                className="bg-indigo-700 btn btn-sm text-light hover:bg-indigo-900"
              >
                Project Dashboard
              </a>
            </div>
          </div>
        </div>

        {/* List View */}
        {view === "list" && (
          <div className="mt-10 space-y-6">
            {currentTestCases.map((testCase, index) => (
              <div
                key={testCase._id}
                className="flex items-center justify-between bg-white rounded-lg shadow relative p-4"
              >
                <div className="flex flex-1 space-x-4">
                  <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
                    <span className="text-sm font-semibold text-gray-600">
                      Test Case Name
                    </span>
                    <span className="text-sm text-gray-900">
                      {testCase.test_case_name}
                    </span>
                  </div>

                  <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
                    <span className="text-sm font-semibold text-gray-600">
                      Test Case Number
                    </span>
                    <span className="text-sm text-gray-900">
                      {testCase.test_case_number}
                    </span>
                  </div>

                  <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
                    <span className="text-sm font-semibold text-gray-600">
                      Module
                    </span>
                    <span className="text-sm text-gray-900">
                      {testCase.module_name}
                    </span>
                  </div>

                  <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
                    <span className="text-sm font-semibold text-gray-600">
                      Test Status
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        getTestStatus(testCase) === "Pass"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {getTestStatus(testCase)}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-4 items-center w-1/12">
                  <Link
                    to={`/test-case-detail/${testCase._id}`}
                    className="text-blue-400 hover:text-blue-500 text-sm"
                  >
                    <FaEye className="text-lg" />
                  </Link>
                  <button
                    onClick={() => handleDelete(testCase._id)}
                    className="text-red-400 hover:text-red-500 text-sm"
                  >
                    <FaTrashAlt className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid View */}
        {view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-10">
            {currentTestCases.map((testCase, index) => (
              <div
                key={testCase._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-600">
                    <span className="font-semibold">TC-Name:</span>{" "}
                    {testCase.test_case_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">TC-Number:</span>{" "}
                    {testCase.test_case_number}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Module:</span>{" "}
                    {testCase.module_name}
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <Link
                    to={`/test-case-detail/${testCase._id}`}
                    className="text-blue-400 hover:text-blue-500 text-sm"
                  >
                    <FaEye className="text-sm" />
                  </Link>
                  <button
                    onClick={() => handleDelete(testCase._id)}
                    className="text-red-400 hover:text-red-500 text-sm"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Card View */}
        {view === "card" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {currentTestCases.map((testCase, index) => (
              <div
                key={testCase._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-600">
                    Test Case Name: {testCase.test_case_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">TC-Number:</span>{" "}
                    {testCase.test_case_number}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Module: </span>
                    {testCase.module_name}
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <Link
                    to={`/test-case-detail/${testCase._id}`}
                    className="text-blue-400 hover:text-blue-500 text-sm"
                  >
                    <FaEye className="text-sm" />
                  </Link>
                  <button
                    onClick={() => handleDelete(testCase._id)}
                    className="text-red-400 hover:text-red-500 text-sm"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
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

export default AllTestCases;
