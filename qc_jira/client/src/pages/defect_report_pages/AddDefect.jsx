import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FaBug,
  FaListAlt,
  FaFileSignature,
  FaProjectDiagram,
  FaAlignLeft,
  FaPlus,
  FaTrash,
  FaUser,
  FaCamera,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const AddDefect = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [testCases, setTestCases] = useState([]);
  const [bug, setBug] = useState({
    project_id: projectId,
    project_name: "",
    test_case_number: "",
    test_case_name: "",
    scenario_number: "",
    requirement_number: "",
    build_number: "",
    module_name: "",
    test_case_type: "",
    expected_result: "",
    actual_result: "",
    description_of_defect: "",
    priority: "Low",
    severity: "Minor",
    status: "Open/New",
    steps_to_replicate: [""],
    author: "",
    reported_date: new Date().toISOString().slice(0, 10),
    updated_date: new Date().toISOString().slice(0, 10),
    fixed_date: "",
    bug_picture: "",
    bug_id: "",
  });

  // helper to attach Authorization header when token exists
  const authConfig = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser?.name) {
      setBug((prev) => ({ ...prev, author: loggedInUser.name }));
    }

    const fetchProjectDetails = async () => {
      try {
        // ✅ protected route → send token + correct path
        const projectRes = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}`,
          authConfig()
        );

        if (projectRes.data) {
          setBug((prev) => ({
            ...prev,
            project_name:
              projectRes.data.project_name || projectRes.data.projectName || "",
          }));
        }

        // ✅ correct test-cases endpoint + auth
        const tcRes = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}/all-test-cases`,
          authConfig()
        );

        const all = Array.isArray(tcRes.data) ? tcRes.data : [];

        // Mark a test as failed if any step is Fail (case-insensitive)
        const failed = all.filter((tc) =>
          (tc.testing_steps || []).some(
            (step) => String(step?.status).toLowerCase() === "fail"
          )
        );

        setTestCases(failed);
      } catch (err) {
        // 401 here means your token is missing/expired/invalid
        console.error(
          "Error fetching project/test cases:",
          err?.message || err
        );
        if (err?.response?.status === 401) {
          alert("Your session has expired. Please log in again.");
          // optionally redirect:
          // navigate("/login");
        }
      }
    };

    fetchProjectDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleTestCaseChange = (e) => {
    const selected = testCases.find(
      (tc) => tc.test_case_number === e.target.value
    );

    if (!selected) {
      setBug((prev) => ({
        ...prev,
        test_case_number: "",
        test_case_name: "",
        scenario_number: "",
        requirement_number: "",
        build_number: "",
        module_name: "",
        test_case_type: "",
        expected_result: "",
        actual_result: "",
        bug_id: "",
      }));
      return;
    }

    // Pull expected/actual from the first failed step if available
    const failedStep =
      (selected.testing_steps || []).find(
        (s) => String(s?.status).toLowerCase() === "fail"
      ) || {};

    setBug((prev) => ({
      ...prev,
      test_case_number: selected.test_case_number,
      test_case_name: selected.test_case_name,
      scenario_number: selected.scenario_number,
      requirement_number: selected.requirement_number || "",
      build_number: selected.build_name_or_number || "",
      module_name: selected.module_name || "",
      test_case_type: selected.test_case_type || "",
      expected_result: failedStep.expected_result || "",
      // actual_result is user-editable; prefill with failed actual if present
      actual_result: failedStep.actual_result || prev.actual_result || "",
      bug_id: selected.test_case_number
        ? `DEF-${String(selected.test_case_number).replace("TC-", "")}`
        : prev.bug_id,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBug((prev) => ({
      ...prev,
      [name]: value,
      updated_date: new Date().toISOString().slice(0, 10),
    }));
  };

  const handlePictureChange = (e) => {
    setBug((prev) => ({ ...prev, bug_picture: e.target.files[0] }));
  };

  const handleStepChange = (index, e) => {
    const updated = bug.steps_to_replicate.map((s, i) =>
      i === index ? e.target.value : s
    );
    setBug((prev) => ({ ...prev, steps_to_replicate: updated }));
  };

  const addStep = () => {
    setBug((prev) => ({
      ...prev,
      steps_to_replicate: [...prev.steps_to_replicate, ""],
    }));
  };

  const removeStep = (index) => {
    setBug((prev) => ({
      ...prev,
      steps_to_replicate: prev.steps_to_replicate.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(bug).forEach(([key, val]) => {
      if (key === "steps_to_replicate") {
        formData.append(key, JSON.stringify(val));
      } else {
        formData.append(key, val);
      }
    });

    try {
      await axios.post(`${globalBackendRoute}/api/addbug`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Bug added successfully!");
      navigate(`/single-project/${projectId}/all-defects`);
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.message);
      } else {
        console.error(
          "Error adding bug:",
          error.response?.data?.message || error.message
        );
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h5 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 d-flex align-items-center ">
          <FaBug className="mr-2 text-indigo-600" /> Add New Bug
        </h5>
        <div className="flex space-x-4 flex-wrap">
          <Link
            to="/bugbucket"
            className=" btn btn-sm bg-indigo-600 hover:bg-indigo-800 font-semibold text-white"
          >
            Bug Bucket
          </Link>
          <Link
            to={`/single-project/${projectId}/all-defects`}
            className=" btn btn-sm bg-indigo-600 hover:bg-indigo-800 font-semibold text-white"
          >
            All Bugs
          </Link>
          <Link
            to={`/single-project/${projectId}`}
            className=" btn btn-sm bg-indigo-600 hover:bg-indigo-800 font-semibold text-white"
          >
            Project Dashboard
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center">
              <FaProjectDiagram className="text-orange-500 mr-2" size={24} />
              <label
                htmlFor="project_name"
                className="text-sm font-medium leading-6 text-gray-900"
              >
                Project Name
              </label>
            </div>
            <input
              id="project_name"
              name="project_name"
              type="text"
              value={bug.project_name}
              readOnly
              className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <div className="flex items-center">
              <FaFileSignature className="text-green-500 mr-2" size={24} />
              <label
                htmlFor="scenario_number"
                className="text-sm font-medium leading-6 text-gray-900"
              >
                Scenario Number
              </label>
            </div>
            <input
              id="scenario_number"
              name="scenario_number"
              type="text"
              value={bug.scenario_number || ""}
              readOnly
              className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <div className="flex items-center">
              <FaListAlt className="text-blue-500 mr-2" size={24} />
              <label
                htmlFor="test_case_number"
                className="text-sm font-medium leading-6 text-gray-900"
              >
                Test Case Number
              </label>
            </div>
            <select
              id="test_case_number"
              name="test_case_number"
              value={bug.test_case_number}
              onChange={handleTestCaseChange}
              className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">Select a Test Case</option>
              {testCases.map((tc) => (
                <option key={tc._id} value={tc.test_case_number}>
                  {tc.test_case_number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center">
              <FaFileSignature className="text-green-500 mr-2" size={24} />
              <label
                htmlFor="test_case_name"
                className="text-sm font-medium leading-6 text-gray-900"
              >
                Test Case Name
              </label>
            </div>
            <input
              id="test_case_name"
              name="test_case_name"
              type="text"
              value={bug.test_case_name}
              readOnly
              className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        {/* Build Number, Module Name */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="build_number"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Build Number
            </label>
            <input
              id="build_number"
              name="build_number"
              type="text"
              value={bug.build_number}
              readOnly
              className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label
              htmlFor="module_name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Module Name
            </label>
            <input
              id="module_name"
              name="module_name"
              type="text"
              value={bug.module_name}
              readOnly
              className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        {/* Expected Result, Actual Result */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="expected_result"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Expected Result
            </label>
            <input
              id="expected_result"
              name="expected_result"
              type="text"
              value={bug.expected_result}
              readOnly
              className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label
              htmlFor="actual_result"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Actual Result
            </label>
            <input
              id="actual_result"
              name="actual_result"
              type="text"
              value={bug.actual_result}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description_of_defect"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Description of Defect
          </label>
          <textarea
            id="description_of_defect"
            name="description_of_defect"
            value={bug.description_of_defect}
            onChange={handleInputChange}
            className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
            rows={2}
          />
        </div>

        {/* Steps */}
        <div>
          <div className="flex items-center">
            <FaAlignLeft className="text-purple-500 mr-2" size={24} />
            <label
              htmlFor="steps_to_replicate"
              className="text-sm font-medium leading-6 text-gray-900"
            >
              Steps to Replicate
            </label>
          </div>
          {bug.steps_to_replicate.map((step, index) => (
            <div className="flex items-center mb-2" key={index}>
              <span className="mr-2">{index + 1}.</span>
              <input
                type="text"
                className="form-control me-2 block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
                value={step}
                onChange={(e) => handleStepChange(index, e)}
              />
              <button
                type="button"
                className="ml-2 btn btn-primary"
                onClick={addStep}
              >
                <FaPlus />
              </button>
              {bug.steps_to_replicate.length > 1 && (
                <button
                  type="button"
                  className="ml-2 btn btn-danger"
                  onClick={() => removeStep(index)}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Priority, Severity, Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Priority
            </label>
            <select
              className="form-select block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
              id="priority"
              name="priority"
              value={bug.priority}
              onChange={handleInputChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="severity"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Severity
            </label>
            <select
              className="form-select block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
              id="severity"
              name="severity"
              value={bug.severity}
              onChange={handleInputChange}
            >
              <option value="Minor">Minor</option>
              <option value="Major">Major</option>
              <option value="Critical">Critical</option>
              <option value="Blocker">Blocker</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Status
            </label>
            <select
              className="form-select block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
              id="status"
              name="status"
              value={bug.status}
              onChange={handleInputChange}
            >
              <option value="Open/New">Open/New</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Fixed">Fixed</option>
              <option value="Re opened">Re opened</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Author, Reported Date, Fixed Date */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium leading-6 text-gray-900 flex items-center"
            >
              <FaUser className="text-red-500 mr-2" /> Author
            </label>
            <input
              id="author"
              name="author"
              type="text"
              value={bug.author}
              readOnly
              className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label
              htmlFor="reported_date"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Reported Date
            </label>
            <input
              type="date"
              className="form-control block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
              id="reported_date"
              name="reported_date"
              value={bug.reported_date}
              readOnly
            />
          </div>

          <div>
            <label
              htmlFor="fixed_date"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Fixed Date
            </label>
            <input
              type="date"
              className="form-control block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
              id="fixed_date"
              name="fixed_date"
              value={bug.fixed_date}
              onChange={handleInputChange}
              disabled={bug.status !== "Fixed"}
            />
          </div>
        </div>

        {/* Bug Picture */}
        <div>
          <label
            htmlFor="bug_picture"
            className="block text-sm font-medium leading-6 text-gray-900 flex items-center"
          >
            <FaCamera className="text-gray-600 mr-2" /> Bug Picture
          </label>
          <div className="mt-2">
            <input
              type="file"
              className="form-control block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
              id="bug_picture"
              name="bug_picture"
              onChange={handlePictureChange}
            />
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600"
          >
            Add Bug
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDefect;
