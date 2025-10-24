import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaSearch,
  FaClipboardList,
  FaExclamationTriangle,
  FaCubes,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const TestCaseDashboard = () => {
  const { projectId } = useParams();
  const [testCases, setTestCases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("list");

  const [testCaseCounts, setTestCaseCounts] = useState({
    total: 0,
    functional: 0,
    integration: 0,
    selenium: 0,
    manual: 0,
  });
  const [severityCounts, setSeverityCounts] = useState({
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
    major: 0,
    blocker: 0,
  });
  const [moduleCounts, setModuleCounts] = useState({});

  // derived lists for rendering (and filtering)
  const moduleEntries = Object.entries(moduleCounts) // [["Module A", 3], ...]
    .filter(([name]) =>
      String(name).toLowerCase().includes(searchQuery.toLowerCase())
    );

  const severityEntries = Object.entries(severityCounts) // [["low", 1], ...]
    .filter(([name]) =>
      String(name).toLowerCase().includes(searchQuery.toLowerCase())
    );

  useEffect(() => {
    fetchTestCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTestCases = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${globalBackendRoute}/api/all-test-cases`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTestCases(data);
      calculateCounts(data);
    } catch (error) {
      console.error("Error fetching test cases:", error);
    }
  };

  const calculateCounts = (cases) => {
    const totalCount = cases.length;
    let functionalCount = 0;
    let integrationCount = 0;
    let seleniumCount = 0;
    let manualCount = 0;

    const sev = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
      major: 0,
      blocker: 0,
    };
    const mods = {};

    cases.forEach((tc) => {
      // type
      switch ((tc.test_case_type || "").toLowerCase()) {
        case "functional":
          functionalCount++;
          break;
        case "integration":
          integrationCount++;
          break;
        case "selenium":
          seleniumCount++;
          break;
        case "manual":
          manualCount++;
          break;
        default:
          break;
      }

      // severity
      const s = (tc.severity || "").toLowerCase();
      if (s in sev) sev[s]++;

      // module
      if (tc.module_name) {
        mods[tc.module_name] = (mods[tc.module_name] || 0) + 1;
      }
    });

    setTestCaseCounts({
      total: totalCount,
      functional: functionalCount,
      integration: integrationCount,
      selenium: seleniumCount,
      manual: manualCount,
    });

    setSeverityCounts(sev);
    setModuleCounts(mods);
  };

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header / controls — mirrors AllTestCases */}
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <h2 className="text-left font-semibold tracking-tight text-indigo-600 sm:text-1xl">
              Test Case Dashboard
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Total Test Cases: {testCaseCounts.total} | Functional:{" "}
              {testCaseCounts.functional} | Integration:{" "}
              {testCaseCounts.integration} | Selenium: {testCaseCounts.selenium}{" "}
              | Manual: {testCaseCounts.manual}
            </p>
            {searchQuery && (
              <p className="text-sm text-gray-600">
                Filtering by: “{searchQuery}”
              </p>
            )}
          </div>

          <div className="flex items-center space-x-4 flex-wrap">
            <FaThList
              className={`text-xl cursor-pointer ${
                view === "list" ? "text-blue-400" : "text-gray-500"
              }`}
              onClick={() => setView("list")}
              title="List view"
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${
                view === "card" ? "text-blue-400" : "text-gray-500"
              }`}
              onClick={() => setView("card")}
              title="Card view"
            />
            <FaTh
              className={`text-xl cursor-pointer ${
                view === "grid" ? "text-blue-400" : "text-gray-500"
              }`}
              onClick={() => setView("grid")}
              title="Grid view"
            />

            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
                placeholder="Search modules/severities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick nav buttons to match AllTestCases button style */}
            <div>
              <a
                href={`/single-project/${projectId}`}
                className="bg-indigo-700 btn btn-sm text-light hover:bg-indigo-900"
              >
                Project Dashboard
              </a>
            </div>
            <div>
              <a
                href="/all-bugs"
                className="bg-indigo-700 btn btn-sm text-light hover:bg-indigo-900"
              >
                Bugs
              </a>
            </div>
          </div>
        </div>

        {/* Summary tiles — styled to feel like AllTestCases’ clean cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-600">
                Total Test Cases
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {testCaseCounts.total}
              </div>
            </div>
            <FaClipboardList className="text-indigo-600 text-2xl" />
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-600">
                Functional
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {testCaseCounts.functional}
              </div>
            </div>
            <FaClipboardList className="text-green-600 text-2xl" />
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-600">
                Integration
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {testCaseCounts.integration}
              </div>
            </div>
            <FaClipboardList className="text-blue-600 text-2xl" />
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-600">
                Automation Scripts
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {testCaseCounts.selenium}
              </div>
            </div>
            <FaClipboardList className="text-yellow-600 text-2xl" />
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-600">Manual</div>
              <div className="text-2xl font-bold text-gray-900">
                {testCaseCounts.manual}
              </div>
            </div>
            <FaClipboardList className="text-red-600 text-2xl" />
          </div>
        </div>

        {/* 3 Views (list / grid / card) — matching spacing/shadows from AllTestCases */}

        {/* LIST VIEW: show both severities and modules in stacked list cards */}
        {view === "list" && (
          <div className="mt-10 space-y-6">
            {/* Severities */}
            <div className="flex items-center justify-between bg-white rounded-lg shadow relative p-4">
              <div className="flex flex-1 space-x-4">
                <div className="flex flex-col w-4/12 border-r pr-2 border-gray-300">
                  <span className="text-sm font-semibold text-gray-600">
                    <FaExclamationTriangle className="inline-block mr-1 text-red-500" />
                    Severity
                  </span>
                </div>
                <div className="flex flex-col w-8/12">
                  <div className="flex flex-wrap gap-2">
                    {severityEntries.map(([sev, count]) => (
                      <span
                        key={sev}
                        className="inline-flex items-center text-xs font-semibold rounded-full px-3 py-1 bg-indigo-100 text-indigo-700 shadow-sm"
                      >
                        {sev.charAt(0).toUpperCase() + sev.slice(1)}
                        <span className="ml-2 inline-flex items-center justify-center text-[10px] font-bold bg-indigo-600 text-white rounded-full px-2 py-[2px]">
                          {count}
                        </span>
                      </span>
                    ))}
                    {severityEntries.length === 0 && (
                      <span className="text-sm text-gray-500">No matches</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modules */}
            <div className="flex items-center justify-between bg-white rounded-lg shadow relative p-4">
              <div className="flex flex-1 space-x-4">
                <div className="flex flex-col w-4/12 border-r pr-2 border-gray-300">
                  <span className="text-sm font-semibold text-gray-600">
                    <FaCubes className="inline-block mr-1 text-indigo-600" />
                    Modules
                  </span>
                </div>
                <div className="flex flex-col w-8/12">
                  <div className="flex flex-wrap gap-2">
                    {moduleEntries.map(([mod, count]) => (
                      <span
                        key={mod}
                        className="inline-flex items-center text-xs font-semibold rounded-full px-3 py-1 bg-green-100 text-green-700 shadow-sm"
                      >
                        {mod}
                        <span className="ml-2 inline-flex items-center justify-center text-[10px] font-bold bg-green-600 text-white rounded-full px-2 py-[2px]">
                          {count}
                        </span>
                      </span>
                    ))}
                    {moduleEntries.length === 0 && (
                      <span className="text-sm text-gray-500">No matches</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GRID VIEW: modules as small tiles (mirrors grid cards in AllTestCases) */}
        {view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-10">
            {moduleEntries.map(([mod, count]) => (
              <div
                key={mod}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-600">
                    <span className="font-semibold">Module:</span> {mod}
                  </div>
                  <div className="mt-2">
                    <span className="inline-flex items-center text-xs font-semibold rounded-full px-3 py-1 bg-indigo-100 text-indigo-700 shadow-sm">
                      Test Cases
                      <span className="ml-2 inline-flex items-center justify-center text-[10px] font-bold bg-indigo-600 text-white rounded-full px-2 py-[2px]">
                        {count}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {moduleEntries.length === 0 && (
              <div className="col-span-full text-sm text-gray-500">
                No matching modules.
              </div>
            )}
          </div>
        )}

        {/* CARD VIEW: severities as individual cards (mirrors card layout in AllTestCases) */}
        {view === "card" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {severityEntries.map(([sev, count]) => (
              <div
                key={sev}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-600">
                    Severity: {sev.charAt(0).toUpperCase() + sev.slice(1)}
                  </div>
                  <div className="mt-2">
                    <span className="inline-flex items-center text-xs font-semibold rounded-full px-3 py-1 bg-red-100 text-red-700 shadow-sm">
                      Total
                      <span className="ml-2 inline-flex items-center justify-center text-[10px] font-bold bg-red-600 text-white rounded-full px-2 py-[2px]">
                        {count}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {severityEntries.length === 0 && (
              <div className="col-span-full text-sm text-gray-500">
                No matching severities.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCaseDashboard;
