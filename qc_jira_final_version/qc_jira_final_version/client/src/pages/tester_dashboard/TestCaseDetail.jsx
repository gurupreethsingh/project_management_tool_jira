import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaProjectDiagram,
  FaFileSignature,
  FaAlignLeft,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

const UpdateTestCase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testCase, setTestCase] = useState({
    project_id: "",
    project_name: "",
    scenario_id: "",
    scenario_number: "",
    test_case_name: "",
    requirement_number: "",
    build_name_or_number: "",
    module_name: "",
    pre_condition: "",
    test_data: "",
    post_condition: "",
    severity: "",
    test_case_type: "Functional",
    brief_description: "",
    test_execution_time: "",
    testing_steps: [],
    footer: {
      author: "",
      reviewed_by: "",
      approved_by: "",
      approved_date: "",
    },
  });

  useEffect(() => {
    fetchTestCase();
  }, [id]);

  const fetchTestCase = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/get-test-case/${id}`
      );
      setTestCase(response.data);
    } catch (error) {
      console.error("Error fetching test case:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("footer.")) {
      const fieldName = name.split(".")[1];
      setTestCase({
        ...testCase,
        footer: {
          ...testCase.footer,
          [fieldName]: value,
        },
      });
    } else if (name.includes("testing_steps.")) {
      const index = name.split(".")[1];
      const fieldName = name.split(".")[2];
      const newTestingSteps = [...testCase.testing_steps];
      newTestingSteps[index][fieldName] = value;
      setTestCase({ ...testCase, testing_steps: newTestingSteps });
    } else {
      setTestCase({ ...testCase, [name]: value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/update-test-case/${id}`, testCase);
      alert("Test case details updated successfully.");
      const projectId = testCase.project_id;
      if (projectId) {
        navigate(`/single-project/${projectId}/all-test-cases`);
      } else {
        console.error("Project ID is not available for navigation.");
      }
    } catch (error) {
      console.error("Error updating test case:", error);
    }
  };

  const addTestingStep = () => {
    setTestCase({
      ...testCase,
      testing_steps: [
        ...testCase.testing_steps,
        {
          step_number: testCase.testing_steps.length + 1,
          action_description: "",
          input_data: "",
          expected_result: "",
          actual_result: "",
          status: "Pass",
          remark: "",
        },
      ],
    });
  };

  const removeTestingStep = (index) => {
    const newTestingSteps = testCase.testing_steps.filter(
      (_, i) => i !== index
    );
    setTestCase({ ...testCase, testing_steps: newTestingSteps });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h5 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 flex items-center mb-6">
        <FaFileSignature className="mr-2 text-indigo-600" /> Update Test Case
      </h5>
      
      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Project and Scenario Info */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {['project_id', 'project_name', 'scenario_id', 'scenario_number'].map((field, i) => (
            <div key={i}>
              <label className="text-sm font-medium leading-6 text-gray-900">
                {field.replace(/_/g, " ").toUpperCase()}
              </label>
              <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
                name={field}
                value={testCase[field]}
                readOnly
              />
            </div>
          ))}
        </div>

        {/* Test Case Details */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {['test_case_name', 'requirement_number', 'build_name_or_number', 'module_name'].map((field, i) => (
            <div key={i}>
              <label className="text-sm font-medium leading-6 text-gray-900">
                {field.replace(/_/g, " ").toUpperCase()}
              </label>
              <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
                name={field}
                value={testCase[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
        </div>

        {/* Additional Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {['pre_condition', 'test_data', 'post_condition'].map((field, i) => (
            <div key={i}>
              <label className="text-sm font-medium leading-6 text-gray-900">
                {field.replace(/_/g, " ").toUpperCase()}
              </label>
              <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
                name={field}
                value={testCase[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
        </div>

        {/* Severity and Test Case Type */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium leading-6 text-gray-900">Severity</label>
            <select
              className="form-control block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
              name="severity"
              value={testCase.severity}
              onChange={handleChange}
              required
            >
              {["Low", "Medium", "Major", "Critical", "Blocker"].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium leading-6 text-gray-900">Test Case Type</label>
            <select
              className="form-select block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
              name="test_case_type"
              value={testCase.test_case_type}
              onChange={handleChange}
              required
            >
              {["Functional", "Non-Functional", "Regression", "Smoke", "Sanity", "Integration", "Gui", "Adhoc", "Internationalization", "Localization"].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium leading-6 text-gray-900">Brief Description</label>
            <textarea
              className="form-control block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
              name="brief_description"
              value={testCase.brief_description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>



        {/* Testing Steps */}
        <div>
          <label className="text-sm font-medium leading-6 text-gray-900 mb-2 flex items-center">
            <FaAlignLeft className="text-purple-500 mr-2" /> Testing Steps
          </label>
          {testCase.testing_steps.map((step, index) => (
            <div className="flex items-center mb-2" key={index}>
              <span className="mr-2">{index + 1}.</span>
              <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
                name={`testing_steps.${index}.action_description`}
                value={step.action_description}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="ml-2 btn btn-primary"
                onClick={addTestingStep}
              >
                <FaPlus />
              </button>
              {testCase.testing_steps.length > 1 && (
                <button
                  type="button"
                  className="ml-2 btn btn-danger"
                  onClick={() => removeTestingStep(index)}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>

                {/* Footer Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {["footer.author", "footer.reviewed_by", "footer.approved_by", "footer.approved_date"].map((field, i) => (
            <div key={i}>
              <label className="text-sm font-medium leading-6 text-gray-900">{field.split(".")[1].replace(/_/g, " ").toUpperCase()}</label>
              <input
                type={field === "footer.approved_date" ? "date" : "text"}
                className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
                name={field}
                value={field === "footer.approved_date" && testCase.footer.approved_date ? testCase.footer.approved_date.split("T")[0] : testCase.footer[field.split(".")[1]]}
                onChange={handleChange}
                
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600"
          >
            Update Test Case
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTestCase;




