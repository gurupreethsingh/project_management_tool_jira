// CreateRequirement.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

const CreateRequirement = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [useExistingModule, setUseExistingModule] = useState(true);
  const [moduleName, setModuleName] = useState("");            // for new module
  const [selectedModule, setSelectedModule] = useState("");     // for existing module
  const [availableModules, setAvailableModules] = useState([]); // [{name, normalized}]
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState([{ image: null, instruction: "", for: "Both" }]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [projectName, setProjectName] = useState("");

  const normalizeModuleName = (str) => (str || "").trim().toLowerCase();

  // load project name
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${globalBackendRoute}/api/projects/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res?.data?.projectName) setProjectName(res.data.projectName);
        else if (res?.data?.project_name) setProjectName(res.data.project_name);
      } catch (err) {
        console.error("Error fetching project details:", err);
      }
    };
    if (projectId) fetchProjectDetails();
  }, [projectId]);

  // load existing requirement modules for this project
  useEffect(() => {
    const loadModules = async () => {
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/projects/${projectId}/requirement-modules`
        );
        const mods = Array.isArray(res.data) ? res.data : [];
        setAvailableModules(mods);
        if (mods.length && !selectedModule) setSelectedModule(mods[0].name);
      } catch (e) {
        setAvailableModules([]);
      }
    };
    if (projectId) loadModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleAddStep = () => {
    setSteps((prev) => [...prev, { image: null, instruction: "", for: "Both" }]);
  };

  const handleRemoveStep = (index) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStepChange = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const effectiveModuleName = useMemo(() => {
    return useExistingModule ? selectedModule : moduleName;
  }, [useExistingModule, selectedModule, moduleName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mod = normalizeModuleName(effectiveModuleName);
    if (!mod) {
      setMessage("Module name cannot be empty.");
      return;
    }
    if (!description.trim()) {
      setMessage("Description is required.");
      return;
    }
    const hasAtLeastOneInstruction = steps.some(
      (s) => (s.instruction || "").trim().length > 0
    );
    if (!hasAtLeastOneInstruction) {
      setMessage("Please add at least one step instruction.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");
      const token = localStorage.getItem("token");

      // Build FormData (images + JSON for steps)
      const formData = new FormData();
      formData.append("project_id", projectId);
      formData.append("module_name", effectiveModuleName.trim()); // server normalizes anyway
      formData.append("description", description);

      // Map "Developer" → "Dev" for schema enum compatibility
      const stepsPayload = steps
        .map((s, idx) => ({
          step_number: idx + 1,
          instruction: (s.instruction || "").trim(),
          for: s.for === "Developer" ? "Dev" : s.for || "Both",
        }))
        .filter((s) => s.instruction.length > 0);

      formData.append("steps", JSON.stringify(stepsPayload));

      steps.forEach((s) => {
        if (s.image) formData.append("images", s.image);
      });

      await axios.post(`${globalBackendRoute}/api/requirements`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // let axios set multipart boundary
        },
      });

      setMessage("✅ Requirement created successfully!");
      setModuleName("");
      setSelectedModule(availableModules[0]?.name || "");
      setDescription("");
      setSteps([{ image: null, instruction: "", for: "Both" }]);
    } catch (err) {
      console.error("Create requirement error:", err);
      const serverMsg =
        err?.response?.data?.error ||
        err?.response?.data?.details ||
        err?.message ||
        "Failed to create requirement.";
      setMessage(`❌ ${serverMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <h3 className="text-2xl font-bold text-indigo-600">Create Requirement</h3>
          <p className="text-sm text-gray-600">
            <strong>Project ID:</strong> {projectId}{" "}
            {projectName && <> - <strong>Project Name:</strong> {projectName}</>}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white border rounded-lg">
          <div className="p-4 space-y-6">

            {/* Module picker */}
            <div className="grid gap-3">
              <div className="flex gap-4 items-center">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="mr-2"
                    checked={useExistingModule}
                    onChange={() => setUseExistingModule(true)}
                  />
                  <span className="text-sm text-gray-800">Select existing module</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="mr-2"
                    checked={!useExistingModule}
                    onChange={() => setUseExistingModule(false)}
                  />
                  <span className="text-sm text-gray-800">Create new module</span>
                </label>
              </div>

              {useExistingModule ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Module <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {availableModules.length ? (
                      availableModules.map((m) => (
                        <option key={m.normalized} value={m.name}>
                          {m.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No modules yet</option>
                    )}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Pick an existing module to add more requirements under it.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    New Module Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    placeholder="Enter module name"
                    className="w-full px-3 py-2 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Similar names are normalized server-side to avoid accidental variants.
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description <span className="text-red-600">*</span>
              </label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Provide a brief description of the requirement..."
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Steps */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Steps (Image + Instruction)
              </h4>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={index} className="border border-gray-200 bg-gray-50 rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-800">Step {index + 1}</label>
                      {steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(index)}
                          className="text-xs text-red-600 hover:underline"
                          title="Remove this step"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <label className="block text-sm font-medium text-gray-600 mb-1">Image (optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleStepChange(index, "image", e.target.files[0])}
                      className="w-full text-sm text-gray-700 mb-3"
                    />

                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Instruction <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      rows="4"
                      value={step.instruction}
                      onChange={(e) => handleStepChange(index, "instruction", e.target.value)}
                      required
                      placeholder="Describe development or testing steps..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />

                    <label className="block text-sm font-medium text-gray-600 mt-3 mb-1">
                      For (Developer / QA / Both)
                    </label>
                    <select
                      value={step.for || "Both"}
                      onChange={(e) => handleStepChange(index, "for", e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option>Both</option>
                      <option>Developer</option>
                      <option>QA</option>
                    </select>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddStep}
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                ➕ Add More Steps
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-4 py-3 border-t bg-gray-50 flex justify-between items-center">
            <div className="text-xs text-gray-600">{message}</div>
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white ${
                submitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {submitting ? "Submitting..." : "Submit Requirement"}
            </button>
          </div>
        </form>

        {/* Back */}
        <div className="mt-6 text-right">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-indigo-600 hover:text-indigo-800 underline"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRequirement;
