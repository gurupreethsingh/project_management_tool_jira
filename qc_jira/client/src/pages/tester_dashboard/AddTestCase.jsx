// import React, { useEffect, useState } from "react";
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

//   const [isCustomTestType, setIsCustomTestType] = useState(false);
//   const [customTestCaseType, setCustomTestCaseType] = useState("");

//   const initialStep = {
//     step_number: 1,
//     action_description: "",
//     input_data: "",
//     expected_result: "",
//     actual_result: "",
//     status: "Pass",
//     remark: "",
//   };

//   const initialTestCase = {
//     test_case_name: "",
//     requirement_number: "",
//     build_name_or_number: "",
//     module_name: "", // will be auto-filled from scenario.module.name
//     pre_condition: "",
//     test_data: "",
//     post_condition: "",
//     severity: "Medium",
//     test_case_type: "Functional",
//     brief_description: "",
//     test_execution_time: "",
//     testing_steps: [initialStep],
//     footer: {
//       author: loggedInUser,
//       reviewed_by: "",
//       approved_by: "",
//       approved_date: new Date().toISOString().split("T")[0],
//     },
//   };

//   const [testCase, setTestCase] = useState(initialTestCase);

//   useEffect(() => {
//     const bootstrap = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           alert("You are not authorized, please log in.");
//           navigate("/login");
//           return;
//         }

//         const user = JSON.parse(localStorage.getItem("user"));
//         setLoggedInUser(user?.name || "");

//         setTestCase((prev) => ({
//           ...prev,
//           footer: { ...prev.footer, author: user?.name || "" },
//         }));

//         // 1) Project details
//         const projRes = await axios.get(
//           `${globalBackendRoute}/api/single-project/${projectId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setProjectName(
//           projRes.data.projectName || projRes.data.project?.projectName || ""
//         );

//         // 2) Scenario details (module name + ensure text/number if not passed in state)
//         const scenRes = await axios.get(
//           `${globalBackendRoute}/api/single-project/${projectId}/scenario-history/${scenarioId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const scen = scenRes?.data?.scenario;
//         const moduleName = scen?.module?.name || "";

//         // fill module name from DB
//         setTestCase((prev) => ({ ...prev, module_name: moduleName }));

//         // if the page wasn't navigated with state, backfill these:
//         if (!location.state?.scenarioNumber) {
//           setScenarioNumber(scen?.scenario_number || "");
//         }
//         if (!location.state?.scenarioText) {
//           setScenarioText(scen?.scenario_text || "");
//         }

//         // 3) If user needs a selector, load all scenarios for this project
//         if (!location.state?.scenarioNumber) {
//           fetchScenarioNumbers(token);
//         }
//       } catch (error) {
//         if (error.response && error.response.status === 401) {
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
//     } else {
//       setTestCase((prev) => ({ ...prev, [name]: value }));
//     }
//   };

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

//       await axios.post(
//         `${globalBackendRoute}/api/add-test-case`,
//         {
//           ...testCase,
//           test_case_type: finalTestCaseType,
//           project_id: projectId,
//           project_name: projectName,
//           scenario_id: scenarioId,
//           scenario_number: scenarioNumber,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("Test case added successfully.");
//       navigate(`/single-project/${projectId}/all-test-cases`);
//     } catch (error) {
//       console.error("Error adding test case:", error);
//       alert(
//         error?.response?.data?.message ||
//           "Error adding test case. Please try again."
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
//         Add New Test Case
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
//               >
//                 <option value="">Select Scenario</option>
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

//           {/* Module name is fetched from DB and read-only */}
//           <div>
//             <label className="block text-sm font-medium">Module Name</label>
//             <input
//               type="text"
//               name="module_name"
//               value={testCase.module_name}
//               readOnly
//               title="Module is determined by the Scenario"
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

//         {/* Severity, Type, Time */}
//         <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
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
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             />
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
//                         className="block w-full rounded-md border-gray-300"
//                       />
//                     </td>
//                     <td>
//                       <select
//                         value={step.status}
//                         onChange={(e) =>
//                           handleStepChange(e, step.step_number, "status")
//                         }
//                         className="block w-full rounded-md border-gray-300"
//                       >
//                         <option value="Pass">Pass</option>
//                         <option value="Fail">Fail</option>
//                       </select>
//                     </td>
//                     <td>
//                       <input
//                         type="text"
//                         value={step.remark}
//                         onChange={(e) =>
//                           handleStepChange(e, step.step_number, "remark")
//                         }
//                         className="block w-full rounded-md border-gray-300"
//                       />
//                     </td>
//                     <td>
//                       <button
//                         type="button"
//                         onClick={() => deleteStepRow(step.step_number)}
//                         className="btn btn-danger"
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
//           >
//             <FaPlus className="inline-block mr-2" /> Add Step
//           </button>
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
//           <div>
//             <label className="block text-sm font-medium">
//               <FaTools className="inline-block mr-1 text-blue-500" /> Reviewed
//               By
//             </label>
//             <input
//               type="text"
//               name="footer.reviewed_by"
//               value={testCase.footer.reviewed_by}
//               onChange={handleInputChange}
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">
//               <FaClipboardList className="inline-block mr-1 text-green-500" />{" "}
//               Approved By
//             </label>
//             <input
//               type="text"
//               name="footer.approved_by"
//               value={testCase.footer.approved_by}
//               onChange={handleInputChange}
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             />
//           </div>
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
//               className="block w-full rounded-md border-gray-300 shadow-sm"
//             />
//           </div>
//         </div>

//         <div className="mt-6">
//           <button type="submit" className="btn btn-success w-full">
//             Add Test Case
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddTestCase;

//

import React, { useEffect, useState } from "react";
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

  const [isCustomTestType, setIsCustomTestType] = useState(false);
  const [customTestCaseType, setCustomTestCaseType] = useState("");

  const initialStep = {
    step_number: 1,
    action_description: "",
    input_data: "",
    expected_result: "",
    actual_result: "",
    status: "Pass",
    remark: "",
  };

  const initialTestCase = {
    test_case_name: "",
    requirement_number: "",
    build_name_or_number: "",
    module_name: "", // auto-filled from scenario.module.name
    pre_condition: "",
    test_data: "",
    post_condition: "",
    severity: "Medium",
    test_case_type: "Functional",
    brief_description: "",
    test_execution_time: "",
    // NEW: default Manual to match backend default/normalizer
    test_execution_type: "Manual",
    testing_steps: [initialStep],
    footer: {
      author: loggedInUser,
      reviewed_by: "",
      approved_by: "",
      approved_date: new Date().toISOString().split("T")[0],
    },
  };

  const [testCase, setTestCase] = useState(initialTestCase);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not authorized, please log in.");
          navigate("/login");
          return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        setLoggedInUser(user?.name || "");

        setTestCase((prev) => ({
          ...prev,
          footer: { ...prev.footer, author: user?.name || "" },
        }));

        // 1) Project details
        const projRes = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjectName(
          projRes.data.projectName || projRes.data.project?.projectName || ""
        );

        // 2) Scenario details (module name + ensure text/number if not passed via state)
        const scenRes = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}/scenario-history/${scenarioId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const scen = scenRes?.data?.scenario;
        const moduleName = scen?.module?.name || "";

        // fill module name from DB
        setTestCase((prev) => ({ ...prev, module_name: moduleName }));

        // backfill scenarioNumber/Text if not provided via state
        if (!location.state?.scenarioNumber) {
          setScenarioNumber(scen?.scenario_number || "");
        }
        if (!location.state?.scenarioText) {
          setScenarioText(scen?.scenario_text || "");
        }

        // 3) Load all scenarios for selector when necessary
        if (!location.state?.scenarioNumber) {
          fetchScenarioNumbers(token);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
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

      await axios.post(
        `${globalBackendRoute}/api/add-test-case`,
        {
          ...testCase,
          test_case_type: finalTestCaseType,
          // make sure we send the new field exactly as controllers expect
          test_execution_type: testCase.test_execution_type || "Manual",
          project_id: projectId,
          project_name: projectName,
          scenario_id: scenarioId,
          scenario_number: scenarioNumber,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Test case added successfully.");
      navigate(`/single-project/${projectId}/all-test-cases`);
    } catch (error) {
      console.error("Error adding test case:", error);
      alert(
        error?.response?.data?.message ||
          "Error adding test case. Please try again."
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
        Add New Test Case
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
              >
                <option value="">Select Scenario</option>
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

          {/* Module name is fetched from DB and read-only */}
          <div>
            <label className="block text-sm font-medium">Module Name</label>
            <input
              type="text"
              name="module_name"
              value={testCase.module_name}
              readOnly
              title="Module is determined by the Scenario"
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
              className="block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* NEW: Test Execution Type */}
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
                        className="block w-full rounded-md border-gray-300"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={step.input_data}
                        onChange={(e) =>
                          handleStepChange(e, step.step_number, "input_data")
                        }
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
                        className="block w-full rounded-md border-gray-300"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={step.actual_result}
                        onChange={(e) =>
                          handleStepChange(e, step.step_number, "actual_result")
                        }
                        className="block w-full rounded-md border-gray-300"
                      />
                    </td>
                    <td>
                      <select
                        value={step.status}
                        onChange={(e) =>
                          handleStepChange(e, step.step_number, "status")
                        }
                        className="block w-full rounded-md border-gray-300"
                      >
                        <option value="Pass">Pass</option>
                        <option value="Fail">Fail</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={step.remark}
                        onChange={(e) =>
                          handleStepChange(e, step.step_number, "remark")
                        }
                        className="block w-full rounded-md border-gray-300"
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => deleteStepRow(step.step_number)}
                        className="btn btn-danger"
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
          >
            <FaPlus className="inline-block mr-2" /> Add Step
          </button>
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
          <div>
            <label className="block text-sm font-medium">
              <FaTools className="inline-block mr-1 text-blue-500" /> Reviewed
              By
            </label>
            <input
              type="text"
              name="footer.reviewed_by"
              value={testCase.footer.reviewed_by}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              <FaClipboardList className="inline-block mr-1 text-green-500" />{" "}
              Approved By
            </label>
            <input
              type="text"
              name="footer.approved_by"
              value={testCase.footer.approved_by}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
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
              className="block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        <div className="mt-6">
          <button type="submit" className="btn btn-success w-full">
            Add Test Case
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTestCase;
