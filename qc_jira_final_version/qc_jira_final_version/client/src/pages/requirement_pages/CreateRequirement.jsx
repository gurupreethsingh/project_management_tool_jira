import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CreateRequirement = () => {
  const { projectId } = useParams(); // ✅ Get from route
  const [moduleName, setModuleName] = useState("");
  const [steps, setSteps] = useState([{ image: null, instruction: "" }]);

  // Add another step
  const handleAddStep = () => {
    setSteps([...steps, { image: null, instruction: "" }]);
  };

  // Update a step field
  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index][field] = value;
    setSteps(updatedSteps);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("project_id", projectId);
    formData.append("module_name", moduleName);

    steps.forEach((step) => {
      if (step.image) formData.append("images", step.image);
      formData.append("instructions[]", step.instruction);
    });

    try {
      const res = await axios.post(
        "/api/requirements/create-requirement",
        formData
      );
      alert("✅ Requirement created successfully!");
      setModuleName("");
      setSteps([{ image: null, instruction: "" }]);
    } catch (error) {
      alert("❌ Failed to create requirement: " + error.message);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>Create Requirement</h2>
      <p>
        <strong>Project ID:</strong> {projectId}
      </p>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Module Name */}
        <div style={{ marginBottom: "20px" }}>
          <label>Module Name:</label>
          <input
            type="text"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            required
            placeholder="Enter Module Name"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        {/* Steps */}
        <h4>Steps (Image + Instruction)</h4>
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "6px",
              marginBottom: "20px",
              background: "#f9f9f9",
            }}
          >
            <label>Step {index + 1} - Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleStepChange(index, "image", e.target.files[0])
              }
              style={{ display: "block", marginBottom: "10px" }}
            />

            <label>Step {index + 1} - Instruction:</label>
            <textarea
              rows="4"
              placeholder="Enter development & testing steps"
              value={step.instruction}
              onChange={(e) =>
                handleStepChange(index, "instruction", e.target.value)
              }
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              required
            ></textarea>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddStep}
          style={{
            backgroundColor: "#28a745",
            color: "#fff",
            padding: "10px 15px",
            border: "none",
            borderRadius: "4px",
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          ➕ Add More Steps
        </button>

        <br />

        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "12px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🚀 Submit Requirement
        </button>
      </form>
    </div>
  );
};

export default CreateRequirement;
