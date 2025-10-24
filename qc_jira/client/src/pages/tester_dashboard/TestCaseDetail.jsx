// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { FaFileSignature, FaAlignLeft, FaPlus, FaTrash } from "react-icons/fa";
// import globalBackendRoute from "../../config/Config";

// const emptyStep = (n) => ({
//   step_number: n,
//   action_description: "",
//   input_data: "",
//   expected_result: "",
//   actual_result: "",
//   status: "Pass",
//   remark: "",
// });

// const UpdateTestCase = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const [testCase, setTestCase] = useState({
//     _id: "",
//     project_id: "",
//     project_name: "",
//     scenario_id: "",
//     scenario_number: "",
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
//     testing_steps: [emptyStep(1)],
//     footer: {
//       author: "",
//       reviewed_by: "",
//       approved_by: "",
//       approved_date: "",
//     },
//   });

//   useEffect(() => {
//     const fetchTestCase = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("You are not authorized. Please log in.");
//           setLoading(false);
//           return;
//         }

//         const { data } = await axios.get(
//           `${globalBackendRoute}/api/get-test-case/${id}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         // Ensure steps/footers are shaped for the form and there is at least one step
//         const steps =
//           Array.isArray(data.testing_steps) && data.testing_steps.length
//             ? data.testing_steps.map((s, i) => ({
//                 step_number: i + 1,
//                 action_description: s.action_description || "",
//                 input_data: s.input_data || "",
//                 expected_result: s.expected_result || "",
//                 actual_result: s.actual_result || "",
//                 status: s.status === "Fail" ? "Fail" : "Pass",
//                 remark: s.remark || "",
//               }))
//             : [emptyStep(1)];

//         setTestCase({
//           ...testCase,
//           ...data,
//           testing_steps: steps,
//           footer: {
//             author: data.footer?.author || "",
//             reviewed_by: data.footer?.reviewed_by || "",
//             approved_by: data.footer?.approved_by || "",
//             approved_date: data.footer?.approved_date || "",
//           },
//         });
//       } catch (err) {
//         console.error("Error fetching test case:", err?.response?.data || err);
//         setError(
//           err?.response?.data?.message ||
//             "Failed to load test case. It may not exist."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTestCase();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name.startsWith("footer.")) {
//       const key = name.split(".")[1];
//       setTestCase((prev) => ({
//         ...prev,
//         footer: { ...prev.footer, [key]: value },
//       }));
//       return;
//     }

//     if (name.startsWith("testing_steps.")) {
//       const [, idxStr, field] = name.split(".");
//       const index = Number(idxStr);
//       setTestCase((prev) => {
//         const nextSteps = [...prev.testing_steps];
//         nextSteps[index] = { ...nextSteps[index], [field]: value };
//         return { ...prev, testing_steps: nextSteps };
//       });
//       return;
//     }

//     setTestCase((prev) => ({ ...prev, [name]: value }));
//   };

//   const addTestingStep = () => {
//     setTestCase((prev) => {
//       const next = [
//         ...prev.testing_steps,
//         emptyStep(prev.testing_steps.length + 1),
//       ];
//       return { ...prev, testing_steps: next };
//     });
//   };

//   const removeTestingStep = (index) => {
//     setTestCase((prev) => {
//       const next = prev.testing_steps.filter((_, i) => i !== index);
//       const renumbered = next.length
//         ? next.map((s, i) => ({ ...s, step_number: i + 1 }))
//         : [emptyStep(1)];
//       return { ...prev, testing_steps: renumbered };
//     });
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("You are not authorized. Please log in.");
//         setSaving(false);
//         return;
//       }

//       // Normalize steps again on submission
//       const payload = {
//         ...testCase,
//         testing_steps: testCase.testing_steps.map((s, i) => ({
//           step_number: i + 1,
//           action_description: s.action_description || "",
//           input_data: s.input_data || "",
//           expected_result: s.expected_result || "",
//           actual_result: s.actual_result || "",
//           status: s.status === "Fail" ? "Fail" : "Pass",
//           remark: s.remark || "",
//         })),
//         footer: {
//           ...testCase.footer,
//           // Ensure approved_date is either empty string or ISO
//           approved_date: testCase.footer.approved_date || "",
//         },
//       };

//       await axios.put(
//         `${globalBackendRoute}/api/update-test-case/${id}`,
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert("Test case details updated successfully.");

//       const projectId = testCase.project_id;
//       if (projectId) {
//         navigate(`/single-project/${projectId}/all-test-cases`);
//       }
//     } catch (err) {
//       console.error("Error updating test case:", err?.response?.data || err);
//       setError(err?.response?.data?.message || "Failed to update test case.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const approvedDateValue =
//     testCase.footer.approved_date &&
//     String(testCase.footer.approved_date).includes("T")
//       ? testCase.footer.approved_date.split("T")[0]
//       : testCase.footer.approved_date || "";

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-12">
//         <p>Loading test case…</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <h5 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 flex items-center mb-6">
//         <FaFileSignature className="mr-2 text-indigo-600" /> Update Test Case
//       </h5>

//       {error && (
//         <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700 text-sm">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleUpdate} className="space-y-6">
//         {/* Project and Scenario Info */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
//           {["project_id", "project_name", "scenario_id", "scenario_number"].map(
//             (field) => (
//               <div key={field}>
//                 <label className="text-sm font-medium leading-6 text-gray-900">
//                   {field.replace(/_/g, " ").toUpperCase()}
//                 </label>
//                 <input
//                   type="text"
//                   className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//                   name={field}
//                   value={testCase[field] || ""}
//                   readOnly
//                 />
//               </div>
//             )
//           )}
//         </div>

//         {/* Test Case Details */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
//           {[
//             "test_case_name",
//             "requirement_number",
//             "build_name_or_number",
//             "module_name",
//           ].map((field) => (
//             <div key={field}>
//               <label className="text-sm font-medium leading-6 text-gray-900">
//                 {field.replace(/_/g, " ").toUpperCase()}
//               </label>
//               <input
//                 type="text"
//                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//                 name={field}
//                 value={testCase[field] || ""}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           ))}
//         </div>

//         {/* Additional Fields */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           {["pre_condition", "test_data", "post_condition"].map((field) => (
//             <div key={field}>
//               <label className="text-sm font-medium leading-6 text-gray-900">
//                 {field.replace(/_/g, " ").toUpperCase()}
//               </label>
//               <input
//                 type="text"
//                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//                 name={field}
//                 value={testCase[field] || ""}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           ))}
//         </div>

//         {/* Severity / Type / Brief / Time */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
//           <div>
//             <label className="text-sm font-medium leading-6 text-gray-900">
//               Severity
//             </label>
//             <select
//               className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//               name="severity"
//               value={testCase.severity || "Medium"}
//               onChange={handleChange}
//               required
//             >
//               {["Low", "Medium", "Major", "Critical", "Blocker"].map(
//                 (option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 )
//               )}
//             </select>
//           </div>
//           <div>
//             <label className="text-sm font-medium leading-6 text-gray-900">
//               Test Case Type
//             </label>
//             <select
//               className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//               name="test_case_type"
//               value={testCase.test_case_type || "Functional"}
//               onChange={handleChange}
//               required
//             >
//               {[
//                 "Functional",
//                 "Non-Functional",
//                 "Regression",
//                 "Smoke",
//                 "Sanity",
//                 "Integration",
//                 "GUI",
//                 "Adhoc",
//                 "Internationalization",
//                 "Localization",
//               ].map((option) => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="text-sm font-medium leading-6 text-gray-900">
//               Test Execution Time
//             </label>
//             <input
//               type="text"
//               className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//               name="test_execution_time"
//               value={testCase.test_execution_time || ""}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <label className="text-sm font-medium leading-6 text-gray-900">
//               Brief Description
//             </label>
//             <textarea
//               className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//               name="brief_description"
//               value={testCase.brief_description || ""}
//               onChange={handleChange}
//               rows={1}
//               required
//             />
//           </div>
//         </div>

//         {/* Testing Steps */}
//         <div>
//           <label className="text-sm font-medium leading-6 text-gray-900 mb-2 flex items-center">
//             <FaAlignLeft className="text-purple-500 mr-2" /> Testing Steps
//           </label>

//           {testCase.testing_steps.map((step, index) => (
//             <div
//               key={`step-${index}`}
//               className="mb-4 rounded-md border border-gray-200 p-3"
//             >
//               <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
//                 <div>
//                   <label className="text-xs font-medium text-gray-600">
//                     Step #
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={step.step_number}
//                     className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-gray-50"
//                   />
//                 </div>
//                 <div className="lg:col-span-2">
//                   <label className="text-xs font-medium text-gray-600">
//                     Action Description
//                   </label>
//                   <input
//                     type="text"
//                     className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//                     name={`testing_steps.${index}.action_description`}
//                     value={step.action_description}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-medium text-gray-600">
//                     Input Data
//                   </label>
//                   <input
//                     type="text"
//                     className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//                     name={`testing_steps.${index}.input_data`}
//                     value={step.input_data}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-medium text-gray-600">
//                     Expected Result
//                   </label>
//                   <input
//                     type="text"
//                     className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//                     name={`testing_steps.${index}.expected_result`}
//                     value={step.expected_result}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-medium text-gray-600">
//                     Actual Result
//                   </label>
//                   <input
//                     type="text"
//                     className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//                     name={`testing_steps.${index}.actual_result`}
//                     value={step.actual_result}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-medium text-gray-600">
//                     Status
//                   </label>
//                   <select
//                     className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//                     name={`testing_steps.${index}.status`}
//                     value={step.status}
//                     onChange={handleChange}
//                   >
//                     <option value="Pass">Pass</option>
//                     <option value="Fail">Fail</option>
//                   </select>
//                 </div>
//                 <div className="lg:col-span-4">
//                   <label className="text-xs font-medium text-gray-600">
//                     Remark
//                   </label>
//                   <input
//                     type="text"
//                     className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//                     name={`testing_steps.${index}.remark`}
//                     value={step.remark}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="flex items-end gap-2">
//                   <button
//                     type="button"
//                     className="btn btn-primary"
//                     onClick={addTestingStep}
//                     title="Add Step"
//                   >
//                     <FaPlus />
//                   </button>
//                   {testCase.testing_steps.length > 1 && (
//                     <button
//                       type="button"
//                       className="btn btn-danger"
//                       onClick={() => removeTestingStep(index)}
//                       title="Delete Step"
//                     >
//                       <FaTrash />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Footer Fields */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
//           <div>
//             <label className="text-sm font-medium leading-6 text-gray-900">
//               Author
//             </label>
//             <input
//               type="text"
//               className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//               name="footer.author"
//               value={testCase.footer.author || ""}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <label className="text-sm font-medium leading-6 text-gray-900">
//               Reviewed By
//             </label>
//             <input
//               type="text"
//               className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//               name="footer.reviewed_by"
//               value={testCase.footer.reviewed_by || ""}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <label className="text-sm font-medium leading-6 text-gray-900">
//               Approved By
//             </label>
//             <input
//               type="text"
//               className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//               name="footer.approved_by"
//               value={testCase.footer.approved_by || ""}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <label className="text-sm font-medium leading-6 text-gray-900">
//               Approved Date
//             </label>
//             <input
//               type="date"
//               className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//               name="footer.approved_date"
//               value={approvedDateValue}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         {/* Submit */}
//         <div className="text-center">
//           <button
//             type="submit"
//             disabled={saving}
//             className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600 disabled:opacity-70"
//           >
//             {saving ? "Updating…" : "Update Test Case"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdateTestCase;


// old code original

//

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaFileSignature,
  FaAlignLeft,
  FaPlus,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const emptyStep = (n) => ({
  step_number: n,
  action_description: "",
  input_data: "",
  expected_result: "",
  actual_result: "",
  status: "Pass",
  remark: "",
});

export default function UpdateTestCase() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [testCase, setTestCase] = useState({
    _id: "",
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
    severity: "Medium",
    test_case_type: "Functional",
    brief_description: "",
    test_execution_time: "",
    testing_steps: [emptyStep(1)],
    // NEW
    test_execution_type: "Manual",
    footer: {
      author: "",
      reviewed_by: "",
      approved_by: "",
      approved_date: "",
    },
    createdAt: null,
    updatedAt: null,
  });

  // Fetch on mount
  useEffect(() => {
    const fetchTestCase = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You are not authorized. Please log in.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          `${globalBackendRoute}/api/get-test-case/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const steps =
          Array.isArray(data.testing_steps) && data.testing_steps.length
            ? data.testing_steps.map((s, i) => ({
                step_number: i + 1,
                action_description: s.action_description || "",
                input_data: s.input_data || "",
                expected_result: s.expected_result || "",
                actual_result: s.actual_result || "",
                status: s.status === "Fail" ? "Fail" : "Pass",
                remark: s.remark || "",
              }))
            : [emptyStep(1)];

        setTestCase({
          _id: data._id || id,
          project_id: data.project_id || "",
          project_name: data.project_name || "",
          scenario_id: data.scenario_id || "",
          scenario_number: data.scenario_number || "",
          test_case_name: data.test_case_name || "",
          requirement_number: data.requirement_number || "",
          build_name_or_number: data.build_name_or_number || "",
          module_name: data.module_name || "",
          pre_condition: data.pre_condition || "",
          test_data: data.test_data || "",
          post_condition: data.post_condition || "",
          severity: data.severity || "Medium",
          test_case_type: data.test_case_type || "Functional",
          brief_description: data.brief_description || "",
          test_execution_time: data.test_execution_time || "",
          testing_steps: steps,
          // NEW
          test_execution_type: data.test_execution_type || "Manual",
          footer: {
            author: data.footer?.author || "",
            reviewed_by: data.footer?.reviewed_by || "",
            approved_by: data.footer?.approved_by || "",
            approved_date: data.footer?.approved_date || "",
          },
          createdAt: data.createdAt || null,
          updatedAt: data.updatedAt || null,
        });
      } catch (err) {
        console.error("Error fetching test case:", err?.response?.data || err);
        setError(
          err?.response?.data?.message ||
            "Failed to load test case. It may not exist."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTestCase();
  }, [id]);

  // Derived status chip
  const statusFromSteps = useMemo(() => {
    const steps = Array.isArray(testCase.testing_steps)
      ? testCase.testing_steps
      : [];
    if (!steps.length) return "N/A";
    return steps.some((s) => String(s?.status).toLowerCase() === "fail")
      ? "Fail"
      : "Pass";
  }, [testCase.testing_steps]);

  const approvedDateValue =
    testCase.footer.approved_date &&
    String(testCase.footer.approved_date).includes("T")
      ? String(testCase.footer.approved_date).split("T")[0]
      : testCase.footer.approved_date || "";

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("footer.")) {
      const key = name.split(".")[1];
      setTestCase((prev) => ({
        ...prev,
        footer: { ...prev.footer, [key]: value },
      }));
      return;
    }

    if (name.startsWith("testing_steps.")) {
      const [, idxStr, field] = name.split(".");
      const index = Number(idxStr);
      setTestCase((prev) => {
        const nextSteps = [...prev.testing_steps];
        nextSteps[index] = { ...nextSteps[index], [field]: value };
        return { ...prev, testing_steps: nextSteps };
      });
      return;
    }

    setTestCase((prev) => ({ ...prev, [name]: value }));
  };

  const addTestingStep = () => {
    setTestCase((prev) => {
      const next = [
        ...prev.testing_steps,
        emptyStep(prev.testing_steps.length + 1),
      ];
      return { ...prev, testing_steps: next };
    });
  };

  const removeTestingStep = (index) => {
    setTestCase((prev) => {
      const next = prev.testing_steps.filter((_, i) => i !== index);
      const renumbered = next.length
        ? next.map((s, i) => ({ ...s, step_number: i + 1 }))
        : [emptyStep(1)];
      return { ...prev, testing_steps: renumbered };
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not authorized. Please log in.");
        setSaving(false);
        return;
      }

      const payload = {
        ...testCase,
        testing_steps: testCase.testing_steps.map((s, i) => ({
          step_number: i + 1,
          action_description: s.action_description || "",
          input_data: s.input_data || "",
          expected_result: s.expected_result || "",
          actual_result: s.actual_result || "",
          status: String(s.status).toLowerCase() === "fail" ? "Fail" : "Pass",
          remark: s.remark || "",
        })),
        footer: {
          ...testCase.footer,
          approved_date: approvedDateValue || "",
        },
        // NEW: include exec type explicitly
        test_execution_type: testCase.test_execution_type || "Manual",
      };

      await axios.put(
        `${globalBackendRoute}/api/update-test-case/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Test case details updated successfully.");
      const projectId = testCase.project_id;
      if (projectId) {
        navigate(`/single-project/${projectId}/all-test-cases`);
      }
    } catch (err) {
      console.error("Error updating test case:", err?.response?.data || err);
      setError(err?.response?.data?.message || "Failed to update test case.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-600">Loading test case…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header / Controls */}
        <div className="flex justify-between items-center gap-3 flex-wrap mb-4">
          <div className="min-w-0">
            <h2 className="font-semibold tracking-tight text-indigo-600 text-lg flex items-center">
              <FaFileSignature className="mr-2" />
              Update Test Case
            </h2>
            <div className="mt-1 text-[11px] text-slate-600 space-x-1">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium">
                #{testCase.test_case_number || "—"}
              </span>
              <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
                {testCase.module_name || "Unassigned"}
              </span>
              <span
                className={[
                  "inline-flex items-center rounded-full px-2 py-0.5 font-semibold",
                  statusFromSteps === "Pass"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 border"
                    : "border-rose-200 bg-rose-50 text-rose-700 border",
                ].join(" ")}
              >
                {statusFromSteps}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium">
                Exec: {testCase.test_execution_type || "Manual"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 text-sm inline-flex items-center"
              title="Back"
            >
              <FaArrowLeft className="mr-1" />
              Back
            </button>
            {testCase.project_id && (
              <a
                href={`/single-project/${testCase.project_id}`}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm"
              >
                Project Dashboard
              </a>
            )}
            <Link
              to={`/test-case-detail/${testCase._id}`}
              className="px-3 py-1.5 bg-slate-800 text-white rounded-md hover:bg-black text-sm"
            >
              View Test Case
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleUpdate} className="space-y-8">
          {/* Project & Scenario (readonly) */}
          <section>
            <h3 className="text-xs font-semibold text-slate-700 mb-2">
              Project & Scenario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {["project_id", "project_name", "scenario_id", "scenario_number"].map(
                (field) => (
                  <div key={field}>
                    <label className="text-[11px] font-medium text-slate-700">
                      {field.replace(/_/g, " ").toUpperCase()}
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm bg-slate-50"
                      name={field}
                      value={testCase[field] || ""}
                      readOnly
                    />
                  </div>
                )
              )}
            </div>
          </section>

          {/* Core details */}
          <section>
            <h3 className="text-xs font-semibold text-slate-700 mb-2">
              Test Case Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                "test_case_name",
                "requirement_number",
                "build_name_or_number",
                "module_name",
              ].map((field) => (
                <div key={field}>
                  <label className="text-[11px] font-medium text-slate-700">
                    {field.replace(/_/g, " ").toUpperCase()}
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                    name={field}
                    value={testCase[field] || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              {["pre_condition", "test_data", "post_condition"].map((field) => (
                <div key={field}>
                  <label className="text-[11px] font-medium text-slate-700">
                    {field.replace(/_/g, " ").toUpperCase()}
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                    name={field}
                    value={testCase[field] || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-3">
              <div>
                <label className="text-[11px] font-medium text-slate-700">
                  Severity
                </label>
                <select
                  className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                  name="severity"
                  value={testCase.severity || "Medium"}
                  onChange={handleChange}
                  required
                >
                  {["Low", "Medium", "Major", "Critical", "Blocker"].map(
                    (option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700">
                  Test Case Type
                </label>
                <select
                  className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                  name="test_case_type"
                  value={testCase.test_case_type || "Functional"}
                  onChange={handleChange}
                  required
                >
                  {[
                    "Functional",
                    "Non-Functional",
                    "Regression",
                    "Smoke",
                    "Sanity",
                    "Integration",
                    "GUI",
                    "Adhoc",
                    "Internationalization",
                    "Localization",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* NEW: Test Execution Type */}
              <div>
                <label className="text-[11px] font-medium text-slate-700">
                  Test Execution Type
                </label>
                <select
                  className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                  name="test_execution_type"
                  value={testCase.test_execution_type || "Manual"}
                  onChange={handleChange}
                  required
                >
                  {["Manual", "Automation", "Both"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700">
                  Test Execution Time
                </label>
                <input
                  type="text"
                  className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                  name="test_execution_time"
                  value={testCase.test_execution_time || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[11px] font-medium text-slate-700">
                  Brief Description
                </label>
                <textarea
                  className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                  name="brief_description"
                  value={testCase.brief_description || ""}
                  onChange={handleChange}
                  rows={1}
                  required
                />
              </div>
            </div>
          </section>

          {/* Steps (header + single-line rows) */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-700 flex items-center">
                <FaAlignLeft className="text-purple-500 mr-2" />
                Testing Steps
              </h3>
              <button
                type="button"
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm inline-flex items-center"
                onClick={addTestingStep}
              >
                <FaPlus className="mr-1" />
                Add Step
              </button>
            </div>

            {/* Header row (scrolls with content) */}
            <div className="rounded-md border border-slate-200 overflow-x-auto">
              <div
                className="
                  grid items-center gap-2 px-3 py-2 bg-slate-50
                  min-w-[1480px]
                  grid-cols-[80px,300px,200px,220px,220px,140px,260px,120px]
                  text-[11px] font-semibold text-slate-600 uppercase tracking-wide
                "
              >
                <div>Step #</div>
                <div>Action Description</div>
                <div>Input Data</div>
                <div>Expected Result</div>
                <div>Actual Result</div>
                <div>Status</div>
                <div>Remark</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Rows */}
              {testCase.testing_steps.map((step, index) => (
                <div
                  key={`step-${index}`}
                  className="
                    grid items-center gap-2 px-3 py-2 border-t border-slate-200
                    min-w-[1480px]
                    grid-cols-[80px,300px,200px,220px,220px,140px,260px,120px]
                  "
                >
                  {/* Step # */}
                  <div>
                    <label className="sr-only">Step #</label>
                    <input
                      type="text"
                      readOnly
                      value={step.step_number}
                      className="h-9 block w-full rounded-md border border-slate-200 px-2 text-sm bg-slate-50"
                    />
                  </div>

                  {/* Action Description */}
                  <div>
                    <label className="sr-only">Action Description</label>
                    <input
                      type="text"
                      placeholder="Action Description"
                      className="h-9 block w-full rounded-md border border-slate-200 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                      name={`testing_steps.${index}.action_description`}
                      value={step.action_description}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Input Data */}
                  <div>
                    <label className="sr-only">Input Data</label>
                    <input
                      type="text"
                      placeholder="Input Data"
                      className="h-9 block w-full rounded-md border border-slate-200 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                      name={`testing_steps.${index}.input_data`}
                      value={step.input_data}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Expected Result */}
                  <div>
                    <label className="sr-only">Expected Result</label>
                    <input
                      type="text"
                      placeholder="Expected Result"
                      className="h-9 block w-full rounded-md border border-slate-200 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                      name={`testing_steps.${index}.expected_result`}
                      value={step.expected_result}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Actual Result */}
                  <div>
                    <label className="sr-only">Actual Result</label>
                    <input
                      type="text"
                      placeholder="Actual Result"
                      className="h-9 block w-full rounded-md border border-slate-200 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                      name={`testing_steps.${index}.actual_result`}
                      value={step.actual_result}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="sr-only">Status</label>
                    <select
                      className="h-9 block w-full rounded-md border border-slate-200 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                      name={`testing_steps.${index}.status`}
                      value={step.status}
                      onChange={handleChange}
                    >
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                  </div>

                  {/* Remark */}
                  <div>
                    <label className="sr-only">Remark</label>
                    <input
                      type="text"
                      placeholder="Remark"
                      className="h-9 block w-full rounded-md border border-slate-200 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                      name={`testing_steps.${index}.remark`}
                      value={step.remark}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Row actions */}
                  <div className="flex items-center justify-end">
                    {testCase.testing_steps.length > 1 && (
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-rose-600 text-white rounded-md hover:bg-rose-700 text-sm inline-flex items-center"
                        onClick={() => removeTestingStep(index)}
                        title="Delete Step"
                      >
                        <FaTrash className="mr-1" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <section>
            <h3 className="text-xs font-semibold text-slate-700 mb-2">
              Footer
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-700">
                  Author
                </label>
                <input
                  type="text"
                  className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                  name="footer.author"
                  value={testCase.footer.author || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-700">
                  Reviewed By
                </label>
                <input
                  type="text"
                  className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                  name="footer.reviewed_by"
                  value={testCase.footer.reviewed_by || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-700">
                  Approved By
                </label>
                <input
                  type="text"
                  className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                  name="footer.approved_by"
                  value={testCase.footer.approved_by || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-700">
                  Approved Date
                </label>
                <input
                  type="date"
                  className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                  name="footer.approved_date"
                  value={approvedDateValue}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-600 disabled:opacity-70"
            >
              {saving ? "Updating…" : "Update Test Case"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


