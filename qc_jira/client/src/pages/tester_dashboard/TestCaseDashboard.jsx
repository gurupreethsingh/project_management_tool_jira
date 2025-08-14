import React, { useState, useEffect } from "react";
import axios from "axios";

const TestCaseDashboard = () => {
  const [testCases, setTestCases] = useState([]);
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

  useEffect(() => {
    fetchTestCases();
  }, []);

  const fetchTestCases = async () => {
    try {
      const response = await axios.get("http://localhost:5000/all-test-cases");
      const cases = response.data;
      setTestCases(cases);
      calculateCounts(cases);
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
    let severityCountsTemp = { ...severityCounts };
    let moduleCountsTemp = {};

    cases.forEach((testCase) => {
      // Count by test case type
      if (testCase.test_case_type === "Functional") {
        functionalCount++;
      } else if (testCase.test_case_type === "Integration") {
        integrationCount++;
      } else if (testCase.test_case_type === "Selenium") {
        seleniumCount++;
      } else if (testCase.test_case_type === "Manual") {
        manualCount++;
      }

      // Count by severity
      severityCountsTemp[testCase.severity.toLowerCase()]++;

      // Count by module name
      if (moduleCountsTemp[testCase.module_name]) {
        moduleCountsTemp[testCase.module_name]++;
      } else {
        moduleCountsTemp[testCase.module_name] = 1;
      }
    });

    setTestCaseCounts({
      total: totalCount,
      functional: functionalCount,
      integration: integrationCount,
      selenium: seleniumCount,
      manual: manualCount,
    });

    setSeverityCounts(severityCountsTemp);
    setModuleCounts(moduleCountsTemp);
  };

  return (
    <div className="m-4">
      <div className="row">
        <div className="col-lg-10 m-auto">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Test Case Counts</h5>
              <div className="row mb-3">
                <div className="col-sm-6 col-md-4">
                  <div className="card text-white bg-primary border-0">
                    <div className="card-body">
                      <h5 className="card-title">Total Test Cases</h5>
                      <p className="card-text">{testCaseCounts.total}</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="card text-white bg-success border-0">
                    <div className="card-body">
                      <h5 className="card-title">Functional Test Cases</h5>
                      <p className="card-text">{testCaseCounts.functional}</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="card text-white bg-info border-0">
                    <div className="card-body">
                      <h5 className="card-title">Integration Test Cases</h5>
                      <p className="card-text">{testCaseCounts.integration}</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="card text-white bg-warning border-0">
                    <div className="card-body">
                      <h5 className="card-title">Selenium Test Cases</h5>
                      <p className="card-text">{testCaseCounts.selenium}</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="card text-white bg-danger border-0">
                    <div className="card-body">
                      <h5 className="card-title">Manual Test Cases</h5>
                      <p className="card-text">{testCaseCounts.manual}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <h5 className="card-title">Severity Counts</h5>
                  <ul className="list-group">
                    {Object.keys(severityCounts).map((severity) => (
                      <li
                        key={severity}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                        <span className="badge bg-primary rounded-pill">
                          {severityCounts[severity]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5 className="card-title">Module Counts</h5>
                  <ul className="list-group">
                    {Object.keys(moduleCounts).map((module) => (
                      <li
                        key={module}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {module}
                        <span className="badge bg-success rounded-pill">
                          {moduleCounts[module]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCaseDashboard;
