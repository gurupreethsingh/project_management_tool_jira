// // frontend/src/pages/testcases/AddTestCase.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FaClipboardList,
//   FaPlus,
//   FaTrash,
//   FaUser,
//   FaTools,
//   FaCalendar,
//   FaClipboardCheck,
// } from "react-icons/fa";
// import globalBackendRoute from "../../config/Config";

// const AddTestCase = () => {
//   const { projectId, scenarioId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [scenarioNumber, setScenarioNumber] = useState(
//     location.state?.scenarioNumber || ""
//   );
//   const [scenarioText, setScenarioText] = useState(
//     location.state?.scenarioText || ""
//   );
//   const [projectName, setProjectName] = useState("");
//   const [scenarioNumbers, setScenarioNumbers] = useState([]);
//   const [loggedInUser, setLoggedInUser] = useState("");

//   // NEW: editing mode toggles
//   const [isEditing, setIsEditing] = useState(false);
//   const [existingTestCaseId, setExistingTestCaseId] = useState("");

//   // NEW: users for dropdowns
//   const [allUsers, setAllUsers] = useState([]); // for Reviewed By (all roles)
//   const [approverUsers, setApproverUsers] = useState([]); // for Approved By (eligible roles only)

//   // still computed to populate input, but not rendered as chips
//   const [scenarioModules, setScenarioModules] = useState([]);

//   const initialStep = {
//     step_number: 1,
//     action_description: "",
//     input_data: "",
//     expected_result: "",
//     actual_result: "",
//     status: "Pending",
//     remark: "",
//   };

//   const initialTestCase = {
//     test_case_name: "",
//     requirement_number: "",
//     build_name_or_number: "",
//     module_name: "",
//     pre_condition: "",
//     test_data: "",
//     post_condition: "",
//     severity: "Medium",
//     test_case_type: "Functional",
//     brief_description: "",
//     test_execution_time: "",
//     test_execution_type: "Manual",
//     testing_steps: [initialStep],
//     footer: {
//       author: loggedInUser,
//       reviewed_by: "",
//       approved_by: "",
//       approved_date: new Date().toISOString().split("T")[0],
//     },
//   };

//   const [testCase, setTestCase] = useState(initialTestCase);
//   const UNASSIGNED_LABEL = "Unassigned";

//   const allowedRoles = useMemo(
//     () => [
//       "superadmin",
//       "admin",
//       "project_manager",
//       "test_lead",
//       "qa_lead",
//       "developer_lead",
//     ],
//     []
//   );

//   const currentUser = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user") || "{}");
//     } catch {
//       return {};
//     }
//   }, []);

//   const currentRole = String(currentUser?.role || "").toLowerCase();
//   const isPrivilegedUser = allowedRoles.includes(currentRole);
//   const hasApproval =
//     !!testCase.footer.approved_by &&
//     testCase.footer.approved_by.trim().length > 0;
//   const canEditStatus = isPrivilegedUser && hasApproval;

//   const onBlockedStatusClick = () => {
//     alert(
//       "Status (Pass/Fail/Pending) can be changed only after the test case is approved by a privileged role (superadmin, admin, project_manager, test_lead, qa_lead, developer_lead). Once approved, you can update the status."
//     );
//   };

//   useEffect(() => {
//     const bootstrap = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           alert("You are not authorized, please log in.");
//           navigate("/login");
//           return;
//         }

//         const user = JSON.parse(localStorage.getItem("user") || "{}");
//         setLoggedInUser(user?.name || "");
//         setTestCase((prev) => ({
//           ...prev,
//           footer: { ...prev.footer, author: user?.name || "" },
//         }));

//         // 1) Project
//         const projRes = await axios.get(
//           `${globalBackendRoute}/api/projects/${projectId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setProjectName(
//           projRes.data.projectName || projRes.data.project?.projectName || ""
//         );

//         // 2) Scenario + existing TC detection
//         const scenRes = await axios.get(
//           `${globalBackendRoute}/api/single-project/${projectId}/scenario-history/${scenarioId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const scen = scenRes?.data?.scenario;

//         const mods =
//           Array.isArray(scen?.modules) && scen.modules.length
//             ? scen.modules.map((m) =>
//                 typeof m === "object"
//                   ? { _id: m._id, name: m.name }
//                   : { _id: String(m), name: "" }
//               )
//             : scen?.module?._id || scen?.module?.name
//             ? [{ _id: scen.module._id, name: scen.module.name }]
//             : [];
//         setScenarioModules(mods);

//         const moduleNamesJoined =
//           mods.length > 0
//             ? mods.map((m) => m.name || m._id).join(", ")
//             : UNASSIGNED_LABEL;
//         setTestCase((prev) => ({ ...prev, module_name: moduleNamesJoined }));

//         if (!location.state?.scenarioNumber)
//           setScenarioNumber(scen?.scenario_number || "");
//         if (!location.state?.scenarioText)
//           setScenarioText(scen?.scenario_text || "");
//         if (!location.state?.scenarioNumber) fetchScenarioNumbers(token);

//         // 3) Load users for dropdowns
//         const [allUsersRes, approversRes] = await Promise.all([
//           axios.get(`${globalBackendRoute}/api/users`), // alias to getAllUsers
//           axios.get(`${globalBackendRoute}/api/users/approvers`),
//         ]);

//         setAllUsers(Array.isArray(allUsersRes.data) ? allUsersRes.data : []);
//         setApproverUsers(
//           Array.isArray(approversRes.data) ? approversRes.data : []
//         );

//         // 4) If scenario already has a test case -> switch to edit mode & prefill
//         const existingTcId =
//           Array.isArray(scen?.testCases) && scen.testCases.length
//             ? String(scen.testCases[0])
//             : "";
//         if (existingTcId) {
//           const tcRes = await axios.get(
//             `${globalBackendRoute}/api/get-test-case/${existingTcId}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           const tc = tcRes?.data;

//           setTestCase({
//             test_case_name: tc?.test_case_name || "",
//             requirement_number: tc?.requirement_number || "",
//             build_name_or_number: tc?.build_name_or_number || "",
//             module_name: tc?.module_name || moduleNamesJoined,
//             pre_condition: tc?.pre_condition || "",
//             test_data: tc?.test_data || "",
//             post_condition: tc?.post_condition || "",
//             severity: tc?.severity || "Medium",
//             test_case_type: tc?.test_case_type || "Functional",
//             brief_description: tc?.brief_description || "",
//             test_execution_time: tc?.test_execution_time || "",
//             test_execution_type: tc?.test_execution_type || "Manual",
//             testing_steps:
//               Array.isArray(tc?.testing_steps) && tc.testing_steps.length
//                 ? tc.testing_steps.map((s, i) => ({
//                     step_number: s.step_number ?? i + 1,
//                     action_description: s.action_description || "",
//                     input_data: s.input_data || "",
//                     expected_result: s.expected_result || "",
//                     actual_result: s.actual_result || "",
//                     status: s.status || "Pending",
//                     remark: s.remark || "",
//                   }))
//                 : [initialStep],
//             footer: {
//               author: tc?.footer?.author || user?.name || "",
//               reviewed_by: tc?.footer?.reviewed_by || "",
//               approved_by: tc?.footer?.approved_by || "",
//               approved_date: tc?.footer?.approved_date
//                 ? new Date(tc.footer.approved_date).toISOString().split("T")[0]
//                 : new Date().toISOString().split("T")[0],
//             },
//           });

//           setIsEditing(true);
//           setExistingTestCaseId(existingTcId);
//         } else {
//           setIsEditing(false);
//           setExistingTestCaseId("");
//         }
//       } catch (error) {
//         if (error?.response?.status === 401) {
//           alert("Session expired. Please log in again.");
//           navigate("/login");
//         } else {
//           console.error("Bootstrap error:", error);
//         }
//       }
//     };

//     bootstrap();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [projectId, scenarioId]);

//   const fetchScenarioNumbers = async (tokenParam) => {
//     try {
//       const token = tokenParam || localStorage.getItem("token");
//       const response = await axios.get(
//         `${globalBackendRoute}/api/projects/${projectId}/scenarios`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setScenarioNumbers(response.data || []);
//     } catch (error) {
//       console.error("Error fetching scenario numbers:", error);
//     }
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;

//     if (name.startsWith("footer.")) {
//       setTestCase((prev) => ({
//         ...prev,
//         footer: { ...prev.footer, [name.split(".")[1]]: value },
//       }));
//       return;
//     }

//     setTestCase((prev) => ({ ...prev, [name]: value }));
//   };

//   const [isCustomTestType, setIsCustomTestType] = useState(false);
//   const [customTestCaseType, setCustomTestCaseType] = useState("");

//   const handleTestCaseTypeChange = (event) => {
//     const value = event.target.value;
//     setTestCase((prev) => ({ ...prev, test_case_type: value }));
//     setIsCustomTestType(value === "Others");
//     if (value !== "Others") setCustomTestCaseType("");
//   };

//   const handleStepChange = (event, stepNumber, field) => {
//     const { value } = event.target;
//     setTestCase((prev) => ({
//       ...prev,
//       testing_steps: prev.testing_steps.map((step) =>
//         step.step_number === stepNumber ? { ...step, [field]: value } : step
//       ),
//     }));
//   };

//   const addStepRow = () => {
//     setTestCase((prev) => {
//       const newStepNumber = prev.testing_steps.length + 1;
//       const newStep = { ...initialStep, step_number: newStepNumber };
//       return { ...prev, testing_steps: [...prev.testing_steps, newStep] };
//     });
//   };

//   const deleteStepRow = (stepNumberToDelete) => {
//     setTestCase((prev) => {
//       const updated = prev.testing_steps
//         .filter((s) => s.step_number !== stepNumberToDelete)
//         .map((s, i) => ({ ...s, step_number: i + 1 }));
//       return { ...prev, testing_steps: updated };
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const token = localStorage.getItem("token");

//       if (!testCase.footer.author) {
//         alert("Author information is missing. Please log in.");
//         return;
//       }

//       const finalTestCaseType = isCustomTestType
//         ? customTestCaseType
//         : testCase.test_case_type;

//       if (isEditing && existingTestCaseId) {
//         await axios.put(
//           `${globalBackendRoute}/api/update-test-case/${existingTestCaseId}`,
//           {
//             ...testCase,
//             test_case_type: finalTestCaseType,
//             test_execution_type: testCase.test_execution_type || "Manual",
//           },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         alert("Test case updated successfully.");
//       } else {
//         await axios
//           .post(
//             `${globalBackendRoute}/api/add-test-case`,
//             {
//               ...testCase,
//               test_case_type: finalTestCaseType,
//               test_execution_type: testCase.test_execution_type || "Manual",
//               project_id: projectId,
//               project_name: projectName,
//               scenario_id: scenarioId,
//               scenario_number: scenarioNumber,
//             },
//             { headers: { Authorization: `Bearer ${token}` } }
//           )
//           .catch((err) => {
//             // If server signals duplicate, flip to edit mode instantly
//             if (
//               err?.response?.status === 409 &&
//               err?.response?.data?.testCaseId
//             ) {
//               setIsEditing(true);
//               setExistingTestCaseId(err.response.data.testCaseId);
//               alert(
//                 "A test case already exists for this scenario — switched to Update mode."
//               );
//               return Promise.resolve();
//             }
//             return Promise.reject(err);
//           });
//         if (!isEditing) alert("Test case added successfully.");
//       }

//       navigate(`/single-project/${projectId}/all-test-cases`);
//     } catch (error) {
//       console.error("Add/Update test case error:", error);
//       alert(
//         error?.response?.data?.message ||
//           "Error saving test case. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <div className="d-flex justify-content-start align-items-center flex-wrap shadow rounded p-3 mb-2">
//         <h3 className="font-bold">Scenario :</h3>
//         <p className="ms-2 text-green-600">{scenarioText}</p>
//       </div>
//       <h1 className="text-2xl font-bold mb-6 mt-6">
//         <FaClipboardList className="inline-block mr-2 text-indigo-600" />
//         {isEditing ? "Update Test Case" : "Add New Test Case"}
//       </h1>

//       <form onSubmit={handleSubmit} className="mt-3 mb-3">
//         {/* First row - 4 fields */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium">Project ID</label>
//             <input
//               type="text"
//               value={projectId}
//               readOnly
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">Project Name</label>
//             <input
//               type="text"
//               value={projectName}
//               readOnly
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">Scenario ID</label>
//             <input
//               type="text"
//               value={scenarioId}
//               readOnly
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">Scenario Number</label>
//             {scenarioNumber ? (
//               <input
//                 type="text"
//                 value={scenarioNumber}
//                 readOnly
//                 className="block w-full rounded-md border-gray-300 shadow-sm"
//               />
//             ) : (
//               <select
//                 value={scenarioNumber}
//                 onChange={(e) => setScenarioNumber(e.target.value)}
//                 className="block w-full rounded-md border-gray-300 shadow-sm"
//                 disabled={isEditing}
//                 title={
//                   isEditing
//                     ? "Scenario is locked for an existing test case"
//                     : ""
//                 }
//               >
//                 <option value="">Select a scenario number…</option>
//                 {scenarioNumbers.map((scenario) => (
//                   <option key={scenario._id} value={scenario.scenario_number}>
//                     {scenario.scenario_number}: {scenario.scenario_text}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>
//         </div>

//         {/* Editable fields */}
//         <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium">Test Case Name</label>
//             <input
//               type="text"
//               name="test_case_name"
//               value={testCase.test_case_name}
//               onChange={handleInputChange}
//               required
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">
//               Requirement Number
//             </label>
//             <input
//               type="text"
//               name="requirement_number"
//               value={testCase.requirement_number}
//               onChange={handleInputChange}
//               required
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">
//               Build Name/Number
//             </label>
//             <input
//               type="text"
//               name="build_name_or_number"
//               value={testCase.build_name_or_number}
//               onChange={handleInputChange}
//               required
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Module Name(s)</label>
//             <input
//               type="text"
//               name="module_name"
//               value={testCase.module_name}
//               readOnly
//               title="Auto-filled from the Scenario's modules"
//               className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
//             />
//           </div>
//         </div>

//         {/* Pre condition, Test Data, Post Condition */}
//         <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium">Pre Condition</label>
//             <input
//               type="text"
//               name="pre_condition"
//               value={testCase.pre_condition}
//               onChange={handleInputChange}
//               required
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">Test Data</label>
//             <input
//               type="text"
//               name="test_data"
//               value={testCase.test_data}
//               onChange={handleInputChange}
//               required
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">Post Condition</label>
//             <input
//               type="text"
//               name="post_condition"
//               value={testCase.post_condition}
//               onChange={handleInputChange}
//               required
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             />
//           </div>
//         </div>

//         {/* Severity, Type, Time, Execution Type */}
//         <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium">Severity</label>
//             <select
//               name="severity"
//               value={testCase.severity}
//               onChange={handleInputChange}
//               required
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             >
//               <option value="Low">Low</option>
//               <option value="Medium">Medium</option>
//               <option value="High">High</option>
//               <option value="Critical">Critical</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Test Case Type</label>
//             <select
//               name="test_case_type"
//               value={testCase.test_case_type}
//               onChange={handleTestCaseTypeChange}
//               required
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             >
//               <option value="Functional">Functional</option>
//               <option value="Non-Functional">Non-Functional</option>
//               <option value="Regression">Regression</option>
//               <option value="Smoke">Smoke</option>
//               <option value="Sanity">Sanity</option>
//               <option value="Integration">Integration</option>
//               <option value="GUI">GUI</option>
//               <option value="Adhoc">Adhoc</option>
//               <option value="Internationalization">Internationalization</option>
//               <option value="Localization">Localization</option>
//               <option value="Unit Testing">Unit Testing</option>
//               <option value="Performance">Performance</option>
//               <option value="Load">Load</option>
//               <option value="Stress">Stress</option>
//               <option value="Usability">Usability</option>
//               <option value="Accessibility">Accessibility</option>
//               <option value="Security">Security</option>
//               <option value="End-to-End">End-to-End</option>
//               <option value="Acceptance">Acceptance</option>
//               <option value="Alpha">Alpha</option>
//               <option value="Beta">Beta</option>
//               <option value="Boundary Value">Boundary Value</option>
//               <option value="Scalability">Scalability</option>
//               <option value="Cross-Browser">Cross-Browser</option>
//               <option value="A/B Testing">A/B Testing</option>
//               <option value="Others">Others</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium">
//               Test Execution Time
//             </label>
//             <input
//               type="text"
//               name="test_execution_time"
//               value={testCase.test_execution_time}
//               onChange={handleInputChange}
//               placeholder="e.g., ~10 minutes"
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">
//               Test Execution Type
//             </label>
//             <select
//               name="test_execution_type"
//               value={testCase.test_execution_type}
//               onChange={handleInputChange}
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             >
//               <option value="Manual">Manual</option>
//               <option value="Automation">Automation</option>
//               <option value="Both">Both Manual and Automation</option>
//             </select>
//           </div>
//         </div>

//         {/* Custom test type input */}
//         {isCustomTestType && (
//           <div className="mt-4">
//             <label className="block text-sm font-medium">
//               Specify Custom Test Case Type
//             </label>
//             <input
//               type="text"
//               value={customTestCaseType}
//               onChange={(e) => setCustomTestCaseType(e.target.value)}
//               required
//               placeholder="e.g., Chaos Testing"
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             />
//           </div>
//         )}

//         {/* Brief Description */}
//         <div className="mt-6">
//           <label className="block text-sm font-medium">Brief Description</label>
//           <textarea
//             name="brief_description"
//             value={testCase.brief_description}
//             onChange={handleInputChange}
//             required
//             placeholder="Summarize the purpose and expected outcome of this test case..."
//             className="block w-full rounded-md border-gray-300 shadow-sm"
//             rows="2"
//           />
//         </div>

//         {/* Testing Steps */}
//         <div className="mt-6">
//           <h4 className="text-lg font-medium mb-2">
//             <FaClipboardCheck className="inline-block mr-2 text-indigo-600" />{" "}
//             Testing Steps
//           </h4>
//           <div className="table-responsive">
//             <table className="table table-bordered shadow-md">
//               <thead>
//                 <tr>
//                   <th>Step #</th>
//                   <th>Action Description</th>
//                   <th>Input Data</th>
//                   <th>Expected Result</th>
//                   <th>Actual Result</th>
//                   <th>Status</th>
//                   <th>Remark</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {testCase.testing_steps.map((step, index) => (
//                   <tr key={index}>
//                     <td>{step.step_number}</td>
//                     <td>
//                       <input
//                         type="text"
//                         value={step.action_description}
//                         onChange={(e) =>
//                           handleStepChange(
//                             e,
//                             step.step_number,
//                             "action_description"
//                           )
//                         }
//                         placeholder="Describe the action to perform"
//                         className="block w-full rounded-md border-gray-300"
//                       />
//                     </td>
//                     <td>
//                       <input
//                         type="text"
//                         value={step.input_data}
//                         onChange={(e) =>
//                           handleStepChange(e, step.step_number, "input_data")
//                         }
//                         placeholder='e.g., username="john.doe"'
//                         className="block w-full rounded-md border-gray-300"
//                       />
//                     </td>
//                     <td>
//                       <input
//                         type="text"
//                         value={step.expected_result}
//                         onChange={(e) =>
//                           handleStepChange(
//                             e,
//                             step.step_number,
//                             "expected_result"
//                           )
//                         }
//                         placeholder="e.g., Login success message appears"
//                         className="block w-full rounded-md border-gray-300"
//                       />
//                     </td>
//                     <td>
//                       <input
//                         type="text"
//                         value={step.actual_result}
//                         onChange={(e) =>
//                           handleStepChange(e, step.step_number, "actual_result")
//                         }
//                         placeholder="e.g., Captured from execution"
//                         className="block w-full rounded-md border-gray-300"
//                       />
//                     </td>
//                     <td>
//                       <div className="relative">
//                         {!canEditStatus && (
//                           <button
//                             type="button"
//                             onClick={onBlockedStatusClick}
//                             className="absolute inset-0 opacity-0 cursor-not-allowed"
//                             aria-label="Status locked until approval"
//                             title="Status locked until approval"
//                           />
//                         )}
//                         <select
//                           value={step.status}
//                           onChange={(e) =>
//                             handleStepChange(e, step.step_number, "status")
//                           }
//                           className={`block w-full rounded-md border-gray-300 ${
//                             !canEditStatus ? "bg-gray-100 text-gray-500" : ""
//                           }`}
//                         >
//                           <option value="Pending">Pending</option>
//                           <option value="Pass">Pass</option>
//                           <option value="Fail">Fail</option>
//                         </select>
//                       </div>
//                     </td>
//                     <td>
//                       <input
//                         type="text"
//                         value={step.remark}
//                         onChange={(e) =>
//                           handleStepChange(e, step.step_number, "remark")
//                         }
//                         placeholder="Notes or observations for this step"
//                         className="block w-full rounded-md border-gray-300"
//                       />
//                     </td>
//                     <td>
//                       <button
//                         type="button"
//                         onClick={() => deleteStepRow(step.step_number)}
//                         className="btn btn-danger"
//                         title="Delete step"
//                       >
//                         <FaTrash />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <button
//             type="button"
//             onClick={addStepRow}
//             className="btn btn-primary mt-2"
//             title="Add new step"
//           >
//             <FaPlus className="inline-block mr-2" /> Add Step
//           </button>
//           {!canEditStatus && (
//             <p className="text-xs text-slate-600 mt-2">
//               Status is locked at <b>Pending</b>. Enter all details and get the
//               test case approved by a privileged role to enable Pass/Fail
//               updates.
//             </p>
//           )}
//         </div>

//         {/* Footer fields */}
//         <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium">
//               <FaUser className="inline-block mr-1 text-red-500" /> Author
//             </label>
//             <input
//               type="text"
//               name="footer.author"
//               value={testCase.footer.author}
//               readOnly
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             />
//           </div>

//           {/* Reviewed By: ALL users */}
//           <div>
//             <label className="block text-sm font-medium">
//               <FaTools className="inline-block mr-1 text-blue-500" /> Reviewed
//               By
//             </label>
//             <select
//               name="footer.reviewed_by"
//               value={testCase.footer.reviewed_by}
//               onChange={handleInputChange}
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             >
//               <option value="">-- Select Reviewer --</option>
//               {allUsers.map((u) => (
//                 <option key={u._id} value={u.name}>
//                   {u.name} {u.role ? `(${u.role})` : ""}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Approved By: APPROVER-ELIGIBLE users only */}
//           <div>
//             <label className="block text-sm font-medium">
//               <FaClipboardList className="inline-block mr-1 text-green-500" />{" "}
//               Approved By
//             </label>
//             <select
//               name="footer.approved_by"
//               value={testCase.footer.approved_by}
//               onChange={(e) => {
//                 // also clear/set approved_date if you want tight coupling
//                 const val = e.target.value;
//                 setTestCase((prev) => ({
//                   ...prev,
//                   footer: {
//                     ...prev.footer,
//                     approved_by: val,
//                     approved_date:
//                       prev.footer.approved_date ||
//                       new Date().toISOString().split("T")[0],
//                   },
//                 }));
//               }}
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             >
//               <option value="">-- Select Approver --</option>
//               {approverUsers.map((u) => (
//                 <option key={u._id} value={u.name}>
//                   {u.name} {u.role ? `(${u.role})` : ""}
//                 </option>
//               ))}
//             </select>
//             <p className="text-[11px] text-slate-500 mt-1">
//               * Only users with roles: superadmin, admin, test_lead,
//               developer_lead, business_analyst, qa_lead.
//             </p>
//           </div>

//           {/* Approved Date: disabled until Approved By is selected */}
//           <div>
//             <label className="block text-sm font-medium">
//               <FaCalendar className="inline-block mr-1 text-purple-500" />{" "}
//               Approved Date
//             </label>
//             <input
//               type="date"
//               name="footer.approved_date"
//               value={testCase.footer.approved_date}
//               onChange={handleInputChange}
//               disabled={!testCase.footer.approved_by}
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//               title={
//                 !testCase.footer.approved_by ? "Select 'Approved By' first" : ""
//               }
//             />
//           </div>
//         </div>

//         <div className="mt-6">
//           <button type="submit" className="btn btn-success w-full">
//             {isEditing ? "Update Test Case" : "Add Test Case"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddTestCase;


// till here old code. fully working. 

//

// frontend/src/pages/testcases/AddTestCase.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaClipboardList,
  FaPlus,
  FaTrash,
  FaUser,
  FaTools,
  FaCalendar,
  FaClipboardCheck,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const AddTestCase = () => {
  const { projectId, scenarioId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [scenarioNumber, setScenarioNumber] = useState(
    location.state?.scenarioNumber || ""
  );
  const [scenarioText, setScenarioText] = useState(
    location.state?.scenarioText || ""
  );
  const [projectName, setProjectName] = useState("");
  const [scenarioNumbers, setScenarioNumbers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState("");

  // Editing mode toggles
  const [isEditing, setIsEditing] = useState(false);
  const [existingTestCaseId, setExistingTestCaseId] = useState("");

  // Users for dropdowns
  const [allUsers, setAllUsers] = useState([]); // For Reviewed By
  const [approverUsers, setApproverUsers] = useState([]); // For Approved By

  // Scenario modules (auto → module_name)
  const [scenarioModules, setScenarioModules] = useState([]);

  const initialStep = {
    step_number: 1,
    action_description: "",
    input_data: "",
    expected_result: "",
    actual_result: "",
    status: "Pending",
    remark: "",
  };

  const [testCase, setTestCase] = useState({
    test_case_name: "",
    requirement_number: "",
    build_name_or_number: "",
    module_name: "",
    pre_condition: "",
    test_data: "",
    post_condition: "",
    severity: "Medium",
    test_case_type: "Functional",
    brief_description: "",
    test_execution_time: "",
    test_execution_type: "Manual",
    testing_steps: [initialStep],
    footer: {
      author: "",
      reviewed_by: "",
      approved_by: "",
      approved_date: new Date().toISOString().split("T")[0],
    },
  });

  const UNASSIGNED_LABEL = "Unassigned";

  const allowedRoles = useMemo(
    () => [
      "superadmin",
      "admin",
      "project_manager",
      "test_lead",
      "qa_lead",
      "developer_lead",
    ],
    []
  );

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const currentRole = String(currentUser?.role || "").toLowerCase();
  const isPrivilegedUser = allowedRoles.includes(currentRole);

  const hasApproval =
    !!testCase.footer.approved_by &&
    testCase.footer.approved_by.trim().length > 0;

  const canEditStatus = isPrivilegedUser && hasApproval;

  // NEW: Lock/unlock Actual Result similar to Status
  // (If you want everyone to edit Actual Result after approval, use `const canEditActualResult = hasApproval;`)
  const canEditActualResult = canEditStatus;

  const onBlockedStatusClick = () => {
    alert(
      "Status and Actual Result can be updated only after the test case is approved by a privileged role (superadmin, admin, project_manager, test_lead, qa_lead, developer_lead)."
    );
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not authorized, please log in.");
          navigate("/login");
          return;
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setLoggedInUser(user?.name || "");
        setTestCase((prev) => ({
          ...prev,
          footer: { ...prev.footer, author: user?.name || "" },
        }));

        // 1) Load project
        const projRes = await axios.get(
          `${globalBackendRoute}/api/projects/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjectName(
          projRes.data.projectName || projRes.data.project?.projectName || ""
        );

        // 2) Load scenario & detect modules + existing test case
        const scenRes = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}/scenario-history/${scenarioId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const scen = scenRes?.data?.scenario;

        const mods =
          Array.isArray(scen?.modules) && scen.modules.length
            ? scen.modules.map((m) =>
                typeof m === "object"
                  ? { _id: m._id, name: m.name }
                  : { _id: String(m), name: "" }
              )
            : scen?.module?._id || scen?.module?.name
            ? [{ _id: scen.module._id, name: scen.module.name }]
            : [];

        setScenarioModules(mods);

        const moduleNamesJoined =
          mods.length > 0
            ? mods.map((m) => m.name || m._id).join(", ")
            : UNASSIGNED_LABEL;

        setTestCase((prev) => ({
          ...prev,
          module_name: prev.module_name || moduleNamesJoined,
        }));

        if (!location.state?.scenarioNumber)
          setScenarioNumber(scen?.scenario_number || "");
        if (!location.state?.scenarioText)
          setScenarioText(scen?.scenario_text || "");
        if (!location.state?.scenarioNumber) fetchScenarioNumbers(token);

        // 3) Load users for dropdowns
        const [allUsersRes, approversRes] = await Promise.all([
          axios.get(`${globalBackendRoute}/api/users`),
          axios.get(`${globalBackendRoute}/api/users/approvers`),
        ]);

        setAllUsers(Array.isArray(allUsersRes.data) ? allUsersRes.data : []);
        setApproverUsers(
          Array.isArray(approversRes.data) ? approversRes.data : []
        );

        // 4) Existing test case check
        const existingTcId =
          Array.isArray(scen?.testCases) && scen.testCases.length
            ? String(scen.testCases[0])
            : "";

        if (existingTcId) {
          const tcRes = await axios.get(
            `${globalBackendRoute}/api/get-test-case/${existingTcId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const tc = tcRes?.data;

          setTestCase({
            test_case_name: tc?.test_case_name || "",
            requirement_number: tc?.requirement_number || "",
            build_name_or_number: tc?.build_name_or_number || "",
            module_name: tc?.module_name || moduleNamesJoined,
            pre_condition: tc?.pre_condition || "",
            test_data: tc?.test_data || "",
            post_condition: tc?.post_condition || "",
            severity: tc?.severity || "Medium",
            test_case_type: tc?.test_case_type || "Functional",
            brief_description: tc?.brief_description || "",
            test_execution_time: tc?.test_execution_time || "",
            test_execution_type: tc?.test_execution_type || "Manual",
            testing_steps:
              Array.isArray(tc?.testing_steps) && tc.testing_steps.length
                ? tc.testing_steps.map((s, i) => ({
                    step_number: s.step_number ?? i + 1,
                    action_description: s.action_description || "",
                    input_data: s.input_data || "",
                    expected_result: s.expected_result || "",
                    actual_result: s.actual_result || "",
                    status: s.status || "Pending",
                    remark: s.remark || "",
                  }))
                : [initialStep],
            footer: {
              author: tc?.footer?.author || user?.name || "",
              reviewed_by: tc?.footer?.reviewed_by || "",
              approved_by: tc?.footer?.approved_by || "",
              approved_date: tc?.footer?.approved_date
                ? new Date(tc.footer.approved_date).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
            },
          });

          setIsEditing(true);
          setExistingTestCaseId(existingTcId);
        } else {
          setIsEditing(false);
          setExistingTestCaseId("");
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/login");
        } else {
          console.error("Bootstrap error:", error);
        }
      }
    };

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, scenarioId]);

  const fetchScenarioNumbers = async (tokenParam) => {
    try {
      const token = tokenParam || localStorage.getItem("token");
      const response = await axios.get(
        `${globalBackendRoute}/api/projects/${projectId}/scenarios`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setScenarioNumbers(response.data || []);
    } catch (error) {
      console.error("Error fetching scenario numbers:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith("footer.")) {
      setTestCase((prev) => ({
        ...prev,
        footer: { ...prev.footer, [name.split(".")[1]]: value },
      }));
      return;
    }

    setTestCase((prev) => ({ ...prev, [name]: value }));
  };

  const [isCustomTestType, setIsCustomTestType] = useState(false);
  const [customTestCaseType, setCustomTestCaseType] = useState("");

  const handleTestCaseTypeChange = (event) => {
    const value = event.target.value;
    setTestCase((prev) => ({ ...prev, test_case_type: value }));
    setIsCustomTestType(value === "Others");
    if (value !== "Others") setCustomTestCaseType("");
  };

  const handleStepChange = (event, stepNumber, field) => {
    const { value } = event.target;
    setTestCase((prev) => ({
      ...prev,
      testing_steps: prev.testing_steps.map((step) =>
        step.step_number === stepNumber ? { ...step, [field]: value } : step
      ),
    }));
  };

  const addStepRow = () => {
    setTestCase((prev) => {
      const newStepNumber = prev.testing_steps.length + 1;
      const newStep = { ...initialStep, step_number: newStepNumber };
      return { ...prev, testing_steps: [...prev.testing_steps, newStep] };
    });
  };

  const deleteStepRow = (stepNumberToDelete) => {
    setTestCase((prev) => {
      const updated = prev.testing_steps
        .filter((s) => s.step_number !== stepNumberToDelete)
        .map((s, i) => ({ ...s, step_number: i + 1 }));
      return { ...prev, testing_steps: updated };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!testCase.footer.author) {
        alert("Author information is missing. Please log in.");
        return;
      }

      const finalTestCaseType = isCustomTestType
        ? customTestCaseType
        : testCase.test_case_type;

      if (isEditing && existingTestCaseId) {
        await axios.put(
          `${globalBackendRoute}/api/update-test-case/${existingTestCaseId}`,
          {
            ...testCase,
            test_case_type: finalTestCaseType,
            test_execution_type: testCase.test_execution_type || "Manual",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Test case updated successfully.");
      } else {
        await axios
          .post(
            `${globalBackendRoute}/api/add-test-case`,
            {
              ...testCase,
              test_case_type: finalTestCaseType,
              test_execution_type: testCase.test_execution_type || "Manual",
              project_id: projectId,
              project_name: projectName,
              scenario_id: scenarioId,
              scenario_number: scenarioNumber,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .catch((err) => {
            if (
              err?.response?.status === 409 &&
              err?.response?.data?.testCaseId
            ) {
              setIsEditing(true);
              setExistingTestCaseId(err.response.data.testCaseId);
              alert(
                "A test case already exists for this scenario — switched to Update mode."
              );
              return Promise.resolve();
            }
            return Promise.reject(err);
          });
        if (!isEditing) alert("Test case added successfully.");
      }

      navigate(`/single-project/${projectId}/all-test-cases`);
    } catch (error) {
      console.error("Add/Update test case error:", error);
      alert(
        error?.response?.data?.message ||
          "Error saving test case. Please try again."
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="d-flex justify-content-start align-items-center flex-wrap shadow rounded p-3 mb-2">
        <h3 className="font-bold">Scenario :</h3>
        <p className="ms-2 text-green-600">{scenarioText}</p>
      </div>

      <h1 className="text-2xl font-bold mb-6 mt-6">
        <FaClipboardList className="inline-block mr-2 text-indigo-600" />
        {isEditing ? "Update Test Case" : "Add New Test Case"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-3 mb-3">
        {/* First row - 4 fields */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium">Project ID</label>
            <input
              type="text"
              value={projectId}
              readOnly
              className="block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Project Name</label>
            <input
              type="text"
              value={projectName}
              readOnly
              className="block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Scenario ID</label>
            <input
              type="text"
              value={scenarioId}
              readOnly
              className="block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Scenario Number</label>
            {scenarioNumber ? (
              <input
                type="text"
                value={scenarioNumber}
                readOnly
                className="block w-full rounded-md border-gray-300 shadow-sm"
              />
            ) : (
              <select
                value={scenarioNumber}
                onChange={(e) => setScenarioNumber(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm"
                disabled={isEditing}
                title={
                  isEditing
                    ? "Scenario is locked for an existing test case"
                    : ""
                }
              >
                <option value="">Select a scenario number…</option>
                {scenarioNumbers.map((scenario) => (
                  <option key={scenario._id} value={scenario.scenario_number}>
                    {scenario.scenario_number}: {scenario.scenario_text}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Editable fields */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium">Test Case Name</label>
            <input
              type="text"
              name="test_case_name"
              value={testCase.test_case_name}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Requirement Number
            </label>
            <input
              type="text"
              name="requirement_number"
              value={testCase.requirement_number}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Build Name/Number
            </label>
            <input
              type="text"
              name="build_name_or_number"
              value={testCase.build_name_or_number}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Module Name(s)</label>
            <input
              type="text"
              name="module_name"
              value={testCase.module_name}
              readOnly
              title="Auto-filled from the Scenario's modules"
              className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
            />
          </div>
        </div>

        {/* Pre condition, Test Data, Post Condition */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Pre Condition</label>
            <input
              type="text"
              name="pre_condition"
              value={testCase.pre_condition}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Test Data</label>
            <input
              type="text"
              name="test_data"
              value={testCase.test_data}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Post Condition</label>
            <input
              type="text"
              name="post_condition"
              value={testCase.post_condition}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        {/* Severity, Type, Time, Execution Type */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium">Severity</label>
            <select
              name="severity"
              value={testCase.severity}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Test Case Type</label>
            <select
              name="test_case_type"
              value={testCase.test_case_type}
              onChange={handleTestCaseTypeChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="Functional">Functional</option>
              <option value="Non-Functional">Non-Functional</option>
              <option value="Regression">Regression</option>
              <option value="Smoke">Smoke</option>
              <option value="Sanity">Sanity</option>
              <option value="Integration">Integration</option>
              <option value="GUI">GUI</option>
              <option value="Adhoc">Adhoc</option>
              <option value="Internationalization">Internationalization</option>
              <option value="Localization">Localization</option>
              <option value="Unit Testing">Unit Testing</option>
              <option value="Performance">Performance</option>
              <option value="Load">Load</option>
              <option value="Stress">Stress</option>
              <option value="Usability">Usability</option>
              <option value="Accessibility">Accessibility</option>
              <option value="Security">Security</option>
              <option value="End-to-End">End-to-End</option>
              <option value="Acceptance">Acceptance</option>
              <option value="Alpha">Alpha</option>
              <option value="Beta">Beta</option>
              <option value="Boundary Value">Boundary Value</option>
              <option value="Scalability">Scalability</option>
              <option value="Cross-Browser">Cross-Browser</option>
              <option value="A/B Testing">A/B Testing</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Test Execution Time
            </label>
            <input
              type="text"
              name="test_execution_time"
              value={testCase.test_execution_time}
              onChange={handleInputChange}
              placeholder="e.g., ~10 minutes"
              className="block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Test Execution Type
            </label>
            <select
              name="test_execution_type"
              value={testCase.test_execution_type}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="Manual">Manual</option>
              <option value="Automation">Automation</option>
              <option value="Both">Both Manual and Automation</option>
            </select>
          </div>
        </div>

        {/* Custom test type input */}
        {isCustomTestType && (
          <div className="mt-4">
            <label className="block text-sm font-medium">
              Specify Custom Test Case Type
            </label>
            <input
              type="text"
              value={customTestCaseType}
              onChange={(e) => setCustomTestCaseType(e.target.value)}
              required
              placeholder="e.g., Chaos Testing"
              className="block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        )}

        {/* Brief Description */}
        <div className="mt-6">
          <label className="block text-sm font-medium">Brief Description</label>
          <textarea
            name="brief_description"
            value={testCase.brief_description}
            onChange={handleInputChange}
            required
            placeholder="Summarize the purpose and expected outcome of this test case..."
            className="block w-full rounded-md border-gray-300 shadow-sm"
            rows="2"
          />
        </div>

        {/* Testing Steps */}
        <div className="mt-6">
          <h4 className="text-lg font-medium mb-2">
            <FaClipboardCheck className="inline-block mr-2 text-indigo-600" />{" "}
            Testing Steps
          </h4>
          <div className="table-responsive">
            <table className="table table-bordered shadow-md">
              <thead>
                <tr>
                  <th>Step #</th>
                  <th>Action Description</th>
                  <th>Input Data</th>
                  <th>Expected Result</th>
                  <th>Actual Result</th>
                  <th>Status</th>
                  <th>Remark</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testCase.testing_steps.map((step, index) => (
                  <tr key={index}>
                    <td>{step.step_number}</td>
                    <td>
                      <input
                        type="text"
                        value={step.action_description}
                        onChange={(e) =>
                          handleStepChange(
                            e,
                            step.step_number,
                            "action_description"
                          )
                        }
                        placeholder="Describe the action to perform"
                        className="block w-full rounded-md border-gray-300"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={step.input_data}
                        onChange={(e) =>
                          handleStepChange(
                            e,
                            step.step_number,
                            "input_data"
                          )
                        }
                        placeholder='e.g., username="john.doe"'
                        className="block w-full rounded-md border-gray-300"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={step.expected_result}
                        onChange={(e) =>
                          handleStepChange(
                            e,
                            step.step_number,
                            "expected_result"
                          )
                        }
                        placeholder="e.g., Login success message appears"
                        className="block w-full rounded-md border-gray-300"
                      />
                    </td>

                    {/* Actual Result - LOCKED until approved */}
                    <td>
                      <div className="relative">
                        {!canEditActualResult && (
                          <button
                            type="button"
                            onClick={onBlockedStatusClick}
                            className="absolute inset-0 opacity-0 cursor-not-allowed"
                            aria-label="Actual Result locked until approval"
                            title="Actual Result locked until approval"
                          />
                        )}
                        <input
                          type="text"
                          value={step.actual_result}
                          onChange={(e) =>
                            handleStepChange(
                              e,
                              step.step_number,
                              "actual_result"
                            )
                          }
                          placeholder="e.g., Captured from execution"
                          className={`block w-full rounded-md border-gray-300 ${
                            !canEditActualResult
                              ? "bg-gray-100 text-gray-500"
                              : ""
                          }`}
                          readOnly={!canEditActualResult}
                        />
                      </div>
                    </td>

                    {/* Status - existing lock logic */}
                    <td>
                      <div className="relative">
                        {!canEditStatus && (
                          <button
                            type="button"
                            onClick={onBlockedStatusClick}
                            className="absolute inset-0 opacity-0 cursor-not-allowed"
                            aria-label="Status locked until approval"
                            title="Status locked until approval"
                          />
                        )}
                        <select
                          value={step.status}
                          onChange={(e) =>
                            handleStepChange(e, step.step_number, "status")
                          }
                          className={`block w-full rounded-md border-gray-300 ${
                            !canEditStatus
                              ? "bg-gray-100 text-gray-500"
                              : ""
                          }`}
                          disabled={!canEditStatus}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Pass">Pass</option>
                          <option value="Fail">Fail</option>
                        </select>
                      </div>
                    </td>

                    <td>
                      <input
                        type="text"
                        value={step.remark}
                        onChange={(e) =>
                          handleStepChange(e, step.step_number, "remark")
                        }
                        placeholder="Notes or observations for this step"
                        className="block w-full rounded-md border-gray-300"
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => deleteStepRow(step.step_number)}
                        className="btn btn-danger"
                        title="Delete step"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addStepRow}
            className="btn btn-primary mt-2"
            title="Add new step"
          >
            <FaPlus className="inline-block mr-2" /> Add Step
          </button>

          {!canEditStatus && (
            <p className="text-xs text-slate-600 mt-2">
              <b>Note:</b> Status and Actual Result fields are locked at this
              stage. Get the test case approved by a privileged role to enable
              Pass/Fail and execution result updates.
            </p>
          )}
        </div>

        {/* Footer fields */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium">
              <FaUser className="inline-block mr-1 text-red-500" /> Author
            </label>
            <input
              type="text"
              name="footer.author"
              value={testCase.footer.author}
              readOnly
              className="block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* Reviewed By */}
          <div>
            <label className="block text-sm font-medium">
              <FaTools className="inline-block mr-1 text-blue-500" /> Reviewed
              By
            </label>
            <select
              name="footer.reviewed_by"
              value={testCase.footer.reviewed_by}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">-- Select Reviewer --</option>
              {allUsers.map((u) => (
                <option key={u._id} value={u.name}>
                  {u.name} {u.role ? `(${u.role})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Approved By */}
          <div>
            <label className="block text-sm font-medium">
              <FaClipboardList className="inline-block mr-1 text-green-500" />{" "}
              Approved By
            </label>
            <select
              name="footer.approved_by"
              value={testCase.footer.approved_by}
              onChange={(e) => {
                const val = e.target.value;
                setTestCase((prev) => ({
                  ...prev,
                  footer: {
                    ...prev.footer,
                    approved_by: val,
                    approved_date:
                      prev.footer.approved_date ||
                      new Date().toISOString().split("T")[0],
                  },
                }));
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">-- Select Approver --</option>
              {approverUsers.map((u) => (
                <option key={u._id} value={u.name}>
                  {u.name} {u.role ? `(${u.role})` : ""}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              * Only users with roles: superadmin, admin, test_lead,
              developer_lead, business_analyst, qa_lead.
            </p>
          </div>

          {/* Approved Date */}
          <div>
            <label className="block text-sm font-medium">
              <FaCalendar className="inline-block mr-1 text-purple-500" />{" "}
              Approved Date
            </label>
            <input
              type="date"
              name="footer.approved_date"
              value={testCase.footer.approved_date}
              onChange={handleInputChange}
              disabled={!testCase.footer.approved_by}
              className="block w-full rounded-md border-gray-300 shadow-sm"
              title={
                !testCase.footer.approved_by
                  ? "Select 'Approved By' first"
                  : ""
              }
            />
          </div>
        </div>

        <div className="mt-6">
          <button type="submit" className="btn btn-success w-full">
            {isEditing ? "Update Test Case" : "Add Test Case"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTestCase;
