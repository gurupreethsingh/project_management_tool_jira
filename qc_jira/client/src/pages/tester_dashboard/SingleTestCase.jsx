// src/components/testcases/SingleTestCase.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

function computeCaseStatus(steps = []) {
  if (!Array.isArray(steps) || steps.length === 0) return "Pending";
  const hasFail = steps.some(
    (s) => String(s?.status || "").trim().toLowerCase() === "fail"
  );
  if (hasFail) return "Fail";
  const hasPending = steps.some(
    (s) => String(s?.status || "").trim().toLowerCase() === "pending"
  );
  return hasPending ? "Pending" : "Pass";
}

function fmtDate(d) {
  if (!d) return "";
  try {
    const dt = typeof d === "string" && d.includes("T") ? new Date(d) : new Date(d);
    if (Number.isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString();
  } catch {
    return String(d);
  }
}

const SingleTestCase = () => {
  const { id } = useParams();
  const [testCase, setTestCase] = useState(null);
  const [error, setError] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);
  const headers = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      setError("");
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/get-test-case/${id}`,
          { headers }
        );
        if (!mounted) return;
        const data = res.data || {};

        // Ensure arrays/objects exist
        data.testing_steps = Array.isArray(data.testing_steps)
          ? data.testing_steps
          : [];
        data.footer = data.footer || {
          author: "",
          reviewed_by: "",
          approved_by: "",
          approved_date: "",
        };

        setTestCase(data);
      } catch (e) {
        if (!mounted) return;
        console.error("Error fetching test case:", e?.response?.data || e);
        setError(
          e?.response?.data?.message ||
            "Failed to load the test case. Please try again."
        );
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, headers]);

  if (!testCase && !error) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  const overallStatus = computeCaseStatus(testCase.testing_steps || []);

  return (
    <div className="m-4">
      <div className="row">
        <div className="col-lg-2">
          <div className="list-group">
            <a
              href="/all-test-cases"
              className="list-group-item list-group-item-action text-secondary text-decoration-underline"
            >
              Test Case Dashboard
            </a>
            <a
              href="/all-test-cases"
              className="list-group-item list-group-item-action text-secondary text-decoration-underline"
            >
              View All Test Cases
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-body">
              {/* Header */}
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h5 className="card-title mb-0">{testCase.test_case_name}</h5>
                <span
                  className={
                    "badge px-3 py-2 " +
                    (overallStatus === "Pass"
                      ? "bg-success"
                      : overallStatus === "Fail"
                      ? "bg-danger"
                      : "bg-secondary")
                  }
                  title="Overall status derived from step statuses"
                >
                  {overallStatus}
                </span>
              </div>

              {/* Display Project, Scenario, and Test Case Numbers */}
              <p className="card-text">
                <strong>Project Name:</strong>{" "}
                {testCase.project_name || "-"}
              </p>
              <p className="card-text">
                <strong>Scenario Number:</strong>{" "}
                {testCase.scenario_number || "-"}
              </p>
              <p className="card-text">
                <strong>Test Case Number:</strong>{" "}
                {testCase.test_case_number || "-"}
              </p>

              {/* Display other test case details */}
              <p className="card-text">
                <strong>Requirement Number:</strong>{" "}
                {testCase.requirement_number || "-"}
              </p>
              <p className="card-text">
                <strong>Build Number:</strong>{" "}
                {testCase.build_name_or_number || "-"}
              </p>
              <p className="card-text">
                <strong>Module:</strong> {testCase.module_name || "-"}
              </p>
              <p className="card-text">
                <strong>Pre-condition:</strong>{" "}
                {testCase.pre_condition || "-"}
              </p>
              <p className="card-text">
                <strong>Test Data:</strong> {testCase.test_data || "-"}
              </p>
              <p className="card-text">
                <strong>Post-condition:</strong>{" "}
                {testCase.post_condition || "-"}
              </p>
              <p className="card-text">
                <strong>Severity:</strong> {testCase.severity || "-"}
              </p>
              <p className="card-text">
                <strong>Test Case Type:</strong>{" "}
                {testCase.test_case_type || "-"}
              </p>
              <p className="card-text">
                <strong>Brief Description:</strong>{" "}
                {testCase.brief_description || "-"}
              </p>
              <p className="card-text">
                <strong>Test Execution Time:</strong>{" "}
                {testCase.test_execution_time || "-"}
              </p>
              <p className="card-text">
                <strong>Test Execution Type:</strong>{" "}
                {testCase.test_execution_type || "Manual"}
              </p>

              {/* Display testing steps */}
              <div className="mt-4">
                <h5>Testing Steps:</h5>
                <div className="table-responsive">
                  <table className="table table-bordered mb-0">
                    <thead>
                      <tr>
                        <th>Step Number</th>
                        <th>Action Description</th>
                        <th>Input Data</th>
                        <th>Expected Result</th>
                        <th>Actual Result</th>
                        <th>Status</th>
                        <th>Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(testCase.testing_steps || []).map((step, index) => (
                        <tr key={index}>
                          <td>{step?.step_number ?? index + 1}</td>
                          <td>{step?.action_description || "-"}</td>
                          <td>{step?.input_data || "-"}</td>
                          <td>{step?.expected_result || "-"}</td>
                          <td>{step?.actual_result || "-"}</td>
                          <td>{step?.status || "Pending"}</td>
                          <td>{step?.remark || "-"}</td>
                        </tr>
                      ))}
                      {(!testCase.testing_steps ||
                        testCase.testing_steps.length === 0) && (
                        <tr>
                          <td colSpan={7} className="text-center text-muted">
                            No steps added yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4">
                <h5>Footer:</h5>
                <p>Author: {testCase.footer?.author || "-"}</p>
                <p>Reviewed By: {testCase.footer?.reviewed_by || "-"}</p>
                <p>Approved By: {testCase.footer?.approved_by || "-"}</p>
                <p>
                  Approved Date: {fmtDate(testCase.footer?.approved_date) || "-"}
                </p>
              </div>

              {/* Created / Updated (optional helpful meta) */}
              <div className="mt-3 text-muted" style={{ fontSize: 12 }}>
                <div>
                  <strong>Created:</strong>{" "}
                  {fmtDate(testCase.createdAt) || "-"}
                </div>
                <div>
                  <strong>Last Updated:</strong>{" "}
                  {fmtDate(testCase.updatedAt) || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTestCase;
