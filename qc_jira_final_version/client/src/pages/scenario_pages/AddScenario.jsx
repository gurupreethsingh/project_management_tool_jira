import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineAdminPanelSettings } from "react-icons/md"; // Icon
import { FaFileAlt } from "react-icons/fa"; // Icon for Scenario text

const AddScenario = () => {
  const [formData, setFormData] = useState({
    scenario_text: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { projectId } = useParams(); // Fetching project ID from URL

  // Function to handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to validate the form
  const validateForm = () => {
    let formErrors = {};
    if (!formData.scenario_text.trim()) {
      formErrors.scenario_text = "Scenario text cannot be empty.";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const token = localStorage.getItem("token");
        console.log("Token being sent:", token); // Check if token is correct

        const response = await fetch(
          `http://localhost:5000/single-projects/${projectId}/add-scenario`, // Backend route
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Ensure token is passed here
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          setSuccessMessage("Scenario added successfully!");
          setFormData({
            scenario_text: "",
          });
          setErrors({});
          alert("Scenario added successfully.");
          navigate(`/single-project/${projectId}/view-all-scenarios`); // Navigate back to project page after adding
        } else {
          const errorData = await response.json();
          setErrors({
            submit: errorData.message || "Error adding scenario",
          });
        }
      } catch (error) {
        setErrors({ submit: "An error occurred. Please try again." });
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <MdOutlineAdminPanelSettings
          className="text-indigo-600 mx-auto mb-2"
          size={48}
        />
        <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Add Scenario
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Scenario Text */}
          <div>
            <label
              htmlFor="scenario_text"
              className="block text-sm font-medium leading-6 text-gray-900 flex items-center"
            >
              <FaFileAlt className="text-green-500 mr-2" /> Scenario Text
            </label>
            <div className="mt-2">
              <input
                id="scenario_text"
                name="scenario_text"
                type="text"
                required
                value={formData.scenario_text}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.scenario_text && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.scenario_text}
                </p>
              )}
            </div>
          </div>

          {/* Display submit errors */}
          {errors.submit && <div className="text-red-600">{errors.submit}</div>}
          {successMessage && (
            <div className="text-green-600">{successMessage}</div>
          )}

          {/* Submit button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Scenario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScenario;
