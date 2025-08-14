// // making the module name trim left and right.

// // import React, { useState, useEffect } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import globalBackendRoute from "../../config/Config";

// // const CreateRequirement = () => {
// //   const { projectId } = useParams();
// //   const navigate = useNavigate();

// //   const [moduleName, setModuleName] = useState("");
// //   const [steps, setSteps] = useState([{ image: null, instruction: "" }]);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [message, setMessage] = useState("");
// //   const [projectName, setProjectName] = useState(""); // state for project_name

// //   // Helper: normalize module name (trim ends + lowercase)
// //   const normalizeModuleName = (str) => (str || "").trim().toLowerCase();

// //   // Fetch project name on mount
// //   useEffect(() => {
// //     const fetchProjectDetails = async () => {
// //       try {
// //         const token = localStorage.getItem("token");
// //         const res = await axios.get(
// //           `${globalBackendRoute}/single-project/${projectId}`,
// //           {
// //             headers: { Authorization: `Bearer ${token}` },
// //           }
// //         );

// //         if (res?.data?.projectName) {
// //           setProjectName(res.data.projectName);
// //         }
// //       } catch (err) {
// //         console.error("Error fetching project details:", err);
// //       }
// //     };

// //     if (projectId) {
// //       fetchProjectDetails();
// //     }
// //   }, [projectId, navigate, globalBackendRoute]);

// //   const handleAddStep = () => {
// //     setSteps([...steps, { image: null, instruction: "" }]);
// //   };

// //   const handleStepChange = (index, field, value) => {
// //     const updatedSteps = [...steps];
// //     updatedSteps[index][field] = value;
// //     setSteps(updatedSteps);
// //   };

// //   // (Optional UX) On blur: enforce trim + lowercase in the input itself
// //   const handleModuleBlur = () => {
// //     const normalized = normalizeModuleName(moduleName);
// //     if (normalized !== moduleName) setModuleName(normalized);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     // 1) Normalize before storing (trim edges + lowercase)
// //     const normalizedModule = normalizeModuleName(moduleName);

// //     if (!normalizedModule) {
// //       setMessage("Module name cannot be empty or just spaces.");
// //       return;
// //     }

// //     try {
// //       setSubmitting(true);
// //       setMessage("");

// //       const token = localStorage.getItem("token");

// //       // 2) Duplicate check (for this project)
// //       //    Uses your route: GET /api/projects/:projectId/requirements
// //       const dupRes = await axios.get(
// //         `${globalBackendRoute}/api/projects/${projectId}/requirements`,
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );

// //       const existing = Array.isArray(dupRes?.data) ? dupRes.data : [];
// //       const isDuplicate = existing.some(
// //         (r) => normalizeModuleName(r?.module_name) === normalizedModule
// //       );
// //       if (isDuplicate) {
// //         setMessage("❌ A requirement with the same module name already exists for this project.");
// //         setSubmitting(false);
// //         return;
// //       }

// //       // 3) Build form data
// //       const formData = new FormData();
// //       formData.append("project_id", projectId);
// //       formData.append("module_name", normalizedModule);

// //       steps.forEach((step) => {
// //         if (step.image) formData.append("images", step.image);
// //         formData.append("instructions[]", step.instruction);
// //       });

// //       // 4) Submit
// //       await axios.post(`${globalBackendRoute}/api/create-requirement`, formData, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           // Don't set Content-Type manually for FormData (axios sets it with boundary)
// //         },
// //       });

// //       setMessage("✅ Requirement created successfully!");
// //       setModuleName("");
// //       setSteps([{ image: null, instruction: "" }]);
// //     } catch (err) {
// //       console.error(err);
// //       setMessage("Failed to create requirement.");
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="py-16 sm:py-20">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         {/* Header */}
// //         <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
// //           <h3 className="text-2xl font-bold text-indigo-600">
// //             Create Requirement
// //           </h3>
// //           <p className="text-sm text-gray-600">
// //             <strong>Project ID:</strong> {projectId}{" "}
// //             {projectName && (
// //               <>
// //                 - <strong>Project Name:</strong> {projectName}
// //               </>
// //             )}
// //           </p>
// //         </div>

// //         {/* Form */}
// //         <form
// //           onSubmit={handleSubmit}
// //           encType="multipart/form-data"
// //           className="bg-white border rounded-lg"
// //         >
// //           <div className="p-4 space-y-6">
// //             {/* Module Name */}
// //             <div>
// //               <label className="block text-sm font-semibold text-gray-700 mb-1">
// //                 Module Name
// //               </label>
// //               <input
// //                 type="text"
// //                 value={moduleName}
// //                 onChange={(e) => setModuleName(e.target.value)}
// //                 onBlur={handleModuleBlur} // enforce trim+lowercase on blur
// //                 required
// //                 placeholder="Enter module name"
// //                 className="w-full px-3 py-2 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
// //               />
// //               <p className="mt-1 text-xs text-gray-500">
// //                 Tip: Leading/trailing spaces are removed and text is saved in lowercase.
// //               </p>
// //             </div>

// //             {/* Steps */}
// //             <div>
// //               <h4 className="text-lg font-semibold text-gray-800 mb-3">
// //                 Steps (Image + Instruction)
// //               </h4>
// //               <div className="space-y-6">
// //                 {steps.map((step, index) => (
// //                   <div
// //                     key={index}
// //                     className="border border-gray-200 bg-gray-50 rounded-md p-4"
// //                   >
// //                     <label className="block text-sm font-medium text-gray-600 mb-1">
// //                       Step {index + 1} - Image
// //                     </label>
// //                     <input
// //                       type="file"
// //                       accept="image/*"
// //                       onChange={(e) =>
// //                         handleStepChange(index, "image", e.target.files[0])
// //                       }
// //                       className="w-full text-sm text-gray-700 mb-3"
// //                     />

// //                     <label className="block text-sm font-medium text-gray-600 mb-1">
// //                       Step {index + 1} - Instruction
// //                     </label>
// //                     <textarea
// //                       rows="4"
// //                       value={step.instruction}
// //                       onChange={(e) =>
// //                         handleStepChange(index, "instruction", e.target.value)
// //                       }
// //                       required
// //                       placeholder="Describe development or testing steps..."
// //                       className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
// //                     ></textarea>
// //                   </div>
// //                 ))}
// //               </div>

// //               <button
// //                 type="button"
// //                 onClick={handleAddStep}
// //                 className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
// //               >
// //                 ➕ Add More Steps
// //               </button>
// //             </div>
// //           </div>

// //           {/* Submit Button */}
// //           <div className="px-4 py-3 border-t bg-gray-50 flex justify-between items-center">
// //             <div className="text-xs text-gray-500">{message}</div>
// //             <button
// //               type="submit"
// //               disabled={submitting}
// //               className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white ${
// //                 submitting
// //                   ? "bg-indigo-400 cursor-not-allowed"
// //                   : "bg-indigo-600 hover:bg-indigo-700"
// //               }`}
// //             >
// //               {submitting ? "Submitting..." : "Submit Requirement"}
// //             </button>
// //           </div>
// //         </form>

// //         {/* Back */}
// //         <div className="mt-6 text-right">
// //           <button
// //             onClick={() => navigate(-1)}
// //             className="text-sm text-indigo-600 hover:text-indigo-800 underline"
// //           >
// //             Go Back
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CreateRequirement;

// // new

// //

// // src/pages/requirements/CreateRequirement.jsx
// // src/pages/requirements/CreateRequirement.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";

// const CreateRequirement = () => {
//   const { projectId } = useParams();
//   const navigate = useNavigate();

//   const [moduleName, setModuleName] = useState("");
//   const [steps, setSteps] = useState([{ image: null, instruction: "" }]);
//   const [submitting, setSubmitting] = useState(false);
//   const [message, setMessage] = useState("");
//   const [projectName, setProjectName] = useState("");
//   const [description, setDescription] = useState("");

//   const normalizeModuleName = (str) => (str || "").trim().toLowerCase();

//   // Fetch project name
//   useEffect(() => {
//     const fetchProjectDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           `${globalBackendRoute}/api/single-project/${projectId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         if (res?.data?.projectName) setProjectName(res.data.projectName);
//       } catch (err) {
//         console.error("Error fetching project details:", err);
//       }
//     };
//     if (projectId) fetchProjectDetails();
//   }, [projectId]);

//   const handleAddStep = () => {
//     setSteps((prev) => [...prev, { image: null, instruction: "" }]);
//   };

//   const handleStepChange = (index, field, value) => {
//     const updated = [...steps];
//     updated[index][field] = value;
//     setSteps(updated);
//   };

//   // trim + lowercase on blur
//   const handleModuleBlur = () => {
//     const normalized = normalizeModuleName(moduleName);
//     if (normalized !== moduleName) setModuleName(normalized);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const normalizedModule = normalizeModuleName(moduleName);
//     if (!normalizedModule) {
//       setMessage("Module name cannot be empty or just spaces.");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setMessage("");
//       const token = localStorage.getItem("token");

//       // Duplicate check
//       const dupRes = await axios.get(
//         `${globalBackendRoute}/api/projects/${projectId}/requirements`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const existing = Array.isArray(dupRes?.data) ? dupRes.data : [];
//       const isDuplicate = existing.some(
//         (r) => normalizeModuleName(r?.module_name) === normalizedModule
//       );
//       if (isDuplicate) {
//         setMessage(
//           "❌ A requirement with the same module name already exists for this project."
//         );
//         setSubmitting(false);
//         return;
//       }

//       // Build form data
//       const formData = new FormData();
//       formData.append("project_id", projectId);
//       formData.append("module_name", normalizedModule);

//       steps.forEach((step) => {
//         if (step.image) formData.append("images", step.image);
//         formData.append("instructions[]", step.instruction);
//       });

//       // Submit to REST endpoint
//       await axios.post(`${globalBackendRoute}/api/requirements`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setMessage("✅ Requirement created successfully!");
//       setModuleName("");
//       setSteps([{ image: null, instruction: "" }]);
//     } catch (err) {
//       console.error(err);
//       if (err?.response?.status === 409) {
//         setMessage("❌ Duplicate: This module already exists for the project.");
//       } else {
//         setMessage("Failed to create requirement.");
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="py-16 sm:py-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
//           <h3 className="text-2xl font-bold text-indigo-600">
//             Create Requirement
//           </h3>
//           <p className="text-sm text-gray-600">
//             <strong>Project ID:</strong> {projectId}{" "}
//             {projectName && (
//               <>
//                 {" "}
//                 - <strong>Project Name:</strong> {projectName}
//               </>
//             )}
//           </p>
//         </div>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           encType="multipart/form-data"
//           className="bg-white border rounded-lg"
//         >
//           <div className="p-4 space-y-6">
//             {/* Module Name */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 Module Name <span className="text-red-600">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={moduleName}
//                 onChange={(e) => setModuleName(e.target.value)}
//                 onBlur={handleModuleBlur}
//                 required
//                 placeholder="Enter module name"
//                 className="w-full px-3 py-2 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
//               />
//               <p className="mt-1 text-xs text-gray-500">
//                 Tip: Leading/trailing spaces are removed and text is saved in
//                 lowercase.
//               </p>
//             </div>

//             {/* Steps */}
//             <div>
//               <h4 className="text-lg font-semibold text-gray-800 mb-3">
//                 Steps (Image + Instruction)
//               </h4>
//               <div className="space-y-6">
//                 {steps.map((step, index) => (
//                   <div
//                     key={index}
//                     className="border border-gray-200 bg-gray-50 rounded-md p-4"
//                   >
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Step {index + 1} - Image
//                     </label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) =>
//                         handleStepChange(index, "image", e.target.files[0])
//                       }
//                       className="w-full text-sm text-gray-700 mb-3"
//                     />

//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Step {index + 1} - Instruction{" "}
//                       <span className="text-red-600">*</span>
//                     </label>
//                     <textarea
//                       rows="4"
//                       value={step.instruction}
//                       onChange={(e) =>
//                         handleStepChange(index, "instruction", e.target.value)
//                       }
//                       required
//                       placeholder="Describe development or testing steps..."
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
//                     ></textarea>
//                   </div>
//                 ))}
//               </div>

//               <button
//                 type="button"
//                 onClick={handleAddStep}
//                 className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
//               >
//                 ➕ Add More Steps
//               </button>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="px-4 py-3 border-t bg-gray-50 flex justify-between items-center">
//             <div className="text-xs text-gray-500">{message}</div>
//             <button
//               type="submit"
//               disabled={submitting}
//               className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white ${
//                 submitting
//                   ? "bg-indigo-400 cursor-not-allowed"
//                   : "bg-indigo-600 hover:bg-indigo-700"
//               }`}
//             >
//               {submitting ? "Submitting..." : "Submit Requirement"}
//             </button>
//           </div>
//         </form>

//         {/* Back */}
//         <div className="mt-6 text-right">
//           <button
//             onClick={() => navigate(-1)}
//             className="text-sm text-indigo-600 hover:text-indigo-800 underline"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateRequirement;

//

// src/pages/requirements/CreateRequirement.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

const CreateRequirement = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [moduleName, setModuleName] = useState("");
  const [description, setDescription] = useState(""); // ✅ NEW: description state
  const [steps, setSteps] = useState([{ image: null, instruction: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [projectName, setProjectName] = useState("");

  const normalizeModuleName = (str) => (str || "").trim().toLowerCase();

  // Fetch project name
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res?.data?.projectName) setProjectName(res.data.projectName);
      } catch (err) {
        console.error("Error fetching project details:", err);
      }
    };
    if (projectId) fetchProjectDetails();
  }, [projectId]);

  const handleAddStep = () => {
    setSteps((prev) => [...prev, { image: null, instruction: "" }]);
  };

  const handleRemoveStep = (index) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStepChange = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  // trim + lowercase on blur
  const handleModuleBlur = () => {
    const normalized = normalizeModuleName(moduleName);
    if (normalized !== moduleName) setModuleName(normalized);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedModule = normalizeModuleName(moduleName);
    if (!normalizedModule) {
      setMessage("Module name cannot be empty or just spaces.");
      return;
    }

    if (!description.trim()) {
      setMessage("Description is required.");
      return;
    }

    // At least one step must have an instruction
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

      // Duplicate check (module uniqueness per project)
      const dupRes = await axios.get(
        `${globalBackendRoute}/api/projects/${projectId}/requirements`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const existing = Array.isArray(dupRes?.data) ? dupRes.data : [];
      const isDuplicate = existing.some(
        (r) => normalizeModuleName(r?.module_name) === normalizedModule
      );
      if (isDuplicate) {
        setMessage(
          "❌ A requirement with the same module name already exists for this project."
        );
        setSubmitting(false);
        return;
      }

      // Build form data
      const formData = new FormData();
      formData.append("project_id", projectId);
      formData.append("module_name", normalizedModule);
      formData.append("description", description); // ✅ include description

      steps.forEach((step) => {
        // backend expects array fields: "images" and "instructions[]"
        if (step.image) formData.append("images", step.image);
        formData.append("instructions[]", step.instruction || "");
      });

      // Submit to REST endpoint
      await axios.post(`${globalBackendRoute}/api/requirements`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Requirement created successfully!");
      setModuleName("");
      setDescription(""); // ✅ reset
      setSteps([{ image: null, instruction: "" }]);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 409) {
        setMessage("❌ Duplicate: This module already exists for the project.");
      } else {
        setMessage("Failed to create requirement.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <h3 className="text-2xl font-bold text-indigo-600">
            Create Requirement
          </h3>
          <p className="text-sm text-gray-600">
            <strong>Project ID:</strong> {projectId}{" "}
            {projectName && (
              <>
                {" "}
                - <strong>Project Name:</strong> {projectName}
              </>
            )}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="bg-white border rounded-lg"
        >
          <div className="p-4 space-y-6">
            {/* Module Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Module Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                onBlur={handleModuleBlur}
                required
                placeholder="Enter module name"
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Tip: Leading/trailing spaces are removed and text is saved in
                lowercase.
              </p>
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
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                This is a high-level summary of the requirement (visible in
                lists and cards).
              </p>
            </div>

            {/* Steps */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Steps (Image + Instruction)
              </h4>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 bg-gray-50 rounded-md p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-800">
                        Step {index + 1}
                      </label>
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

                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Image (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleStepChange(index, "image", e.target.files[0])
                      }
                      className="w-full text-sm text-gray-700 mb-3"
                    />

                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Instruction <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      rows="4"
                      value={step.instruction}
                      onChange={(e) =>
                        handleStepChange(index, "instruction", e.target.value)
                      }
                      required
                      placeholder="Describe development or testing steps..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
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
            <div className="text-xs text-gray-500">{message}</div>
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white ${
                submitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
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
