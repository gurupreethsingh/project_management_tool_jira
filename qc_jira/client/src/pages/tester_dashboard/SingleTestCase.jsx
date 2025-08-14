import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SingleTestCase = () => {
  const { id } = useParams(); // Get test case ID from the URL
  const [testCase, setTestCase] = useState(null); // State to store the fetched test case

  // Fetch the test case when the component mounts
  useEffect(() => {
    const fetchTestCase = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/get-test-case/${id}` // Replace with your backend URL
        );
        setTestCase(response.data); // Store the fetched test case
      } catch (error) {
        console.error("Error fetching test case:", error);
      }
    };

    fetchTestCase();
  }, [id]);

  // Show loading state if the test case hasn't been fetched yet
  if (!testCase) {
    return <div className="container">Loading...</div>;
  }

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
              {/* Display Project, Scenario, and Test Case Numbers */}
              <h5 className="card-title">{testCase.test_case_name}</h5>
              <p className="card-text">
                <strong>Project Name:</strong> {testCase.project_name}
              </p>
              <p className="card-text">
                <strong>Scenario Number:</strong> {testCase.scenario_number}
              </p>
              <p className="card-text">
                <strong>Test Case Number:</strong> {testCase.test_case_number}
              </p>

              {/* Display other test case details */}
              <p className="card-text">
                <strong>Requirement Number:</strong>{" "}
                {testCase.requirement_number}
              </p>
              <p className="card-text">
                <strong>Build Number:</strong> {testCase.build_name_or_number}
              </p>
              <p className="card-text">
                <strong>Module:</strong> {testCase.module_name}
              </p>
              <p className="card-text">
                <strong>Pre-condition:</strong> {testCase.pre_condition}
              </p>
              <p className="card-text">
                <strong>Test Data:</strong> {testCase.test_data}
              </p>
              <p className="card-text">
                <strong>Post-condition:</strong> {testCase.post_condition}
              </p>
              <p className="card-text">
                <strong>Severity:</strong> {testCase.severity}
              </p>
              <p className="card-text">
                <strong>Test Case Type:</strong> {testCase.test_case_type}
              </p>
              <p className="card-text">
                <strong>Brief Description:</strong> {testCase.brief_description}
              </p>
              <p className="card-text">
                <strong>Test Execution Time:</strong>{" "}
                {testCase.test_execution_time}
              </p>

              {/* Display testing steps */}
              <div className="mt-4">
                <h5>Testing Steps:</h5>
                <table className="table table-bordered">
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
                    {testCase.testing_steps.map((step, index) => (
                      <tr key={index}>
                        <td>{step.step_number}</td>
                        <td>{step.action_description}</td>
                        <td>{step.input_data}</td>
                        <td>{step.expected_result}</td>
                        <td>{step.actual_result}</td>
                        <td>{step.status}</td>
                        <td>{step.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="mt-4">
                <h5>Footer:</h5>
                <p>Author: {testCase.footer.author}</p>
                <p>Reviewed By: {testCase.footer.reviewed_by}</p>
                <p>Approved By: {testCase.footer.approved_by}</p>
                <p>Approved Date: {testCase.footer.approved_date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTestCase;
