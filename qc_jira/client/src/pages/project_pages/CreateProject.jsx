// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { MdOutlineWorkOutline } from "react-icons/md";
// import { FaFileAlt, FaCalendarAlt, FaUserTie, FaUsers } from "react-icons/fa";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";

// export default function CreateProject() {
//   const [formData, setFormData] = useState({
//     projectName: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     deadline: "",
//     developers: [],
//     testEngineers: [],
//   });

//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState("");
//   const [developers, setDevelopers] = useState([]);
//   const [testEngineers, setTestEngineers] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDevelopers = async () => {
//       try {
//         const res = await axios.get(
//           `${globalBackendRoute}/api/users/developers`
//         );
//         setDevelopers(Array.isArray(res.data) ? res.data : []);
//       } catch (error) {
//         console.error("Error fetching developers:", error);
//       }
//     };

//     const fetchTestEngineers = async () => {
//       try {
//         const res = await axios.get(
//           `${globalBackendRoute}/api/users/test-engineers`
//         );
//         setTestEngineers(Array.isArray(res.data) ? res.data : []);
//       } catch (error) {
//         console.error("Error fetching test engineers:", error);
//       }
//     };

//     fetchDevelopers();
//     fetchTestEngineers();
//   }, []);

//   const validateForm = () => {
//     const formErrors = {};
//     if (!formData.projectName.trim())
//       formErrors.projectName = "Project name cannot be empty.";
//     if (!formData.startDate) formErrors.startDate = "Start date is required.";
//     if (!formData.deadline) formErrors.deadline = "Deadline is required.";
//     setErrors(formErrors);
//     return Object.keys(formErrors).length === 0;
//   };

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleDropdownChange = (e) => {
//     const { name, options } = e.target;
//     const selectedValues = Array.from(options)
//       .filter((o) => o.selected)
//       .map((o) => o.value);
//     setFormData({ ...formData, [name]: selectedValues });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       const userToken = localStorage.getItem("token");
//       const rawUser = localStorage.getItem("user");
//       const user = rawUser ? JSON.parse(rawUser) : null;
//       const creatorId = user?._id || user?.id;

//       // Send createdBy so backend passes schema validation even if req.user is absent
//       const payload = {
//         ...formData,
//         createdBy: creatorId,
//       };

//       const response = await axios.post(
//         `${globalBackendRoute}/api/create-project`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${userToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 201) {
//         setSuccessMessage("Project created successfully!");
//         setFormData({
//           projectName: "",
//           description: "",
//           startDate: "",
//           endDate: "",
//           deadline: "",
//           developers: [],
//           testEngineers: [],
//         });
//         setErrors({});
//         alert("Project Created Successfully.");
//         navigate("/all-projects");
//       } else {
//         setErrors({ submit: "Project creation failed." });
//       }
//     } catch (error) {
//       const serverMsg =
//         error?.response?.data?.message || error?.message || "Server error";
//       console.error(
//         "Error during project creation:",
//         error?.response?.data || error
//       );
//       setErrors({ submit: serverMsg });
//     }
//   };

//   return (
//     <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-3xl text-center">
//         <MdOutlineWorkOutline
//           className="text-indigo-600 mx-auto mb-2"
//           size={48}
//         />
//         <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
//           Create New Project
//         </h2>
//       </div>

//       <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-3xl">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Project Name */}
//           <div className="flex items-center space-x-4">
//             <label
//               htmlFor="projectName"
//               className="block w-1/3 text-sm font-medium leading-6 text-gray-900"
//             >
//               <FaFileAlt className="text-green-500 mr-2 inline-block" /> Project
//               Name
//             </label>
//             <div className="w-2/3">
//               <input
//                 id="projectName"
//                 name="projectName"
//                 type="text"
//                 required
//                 value={formData.projectName}
//                 onChange={handleChange}
//                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//               />
//               {errors.projectName && (
//                 <p className="mt-2 text-sm text-red-600">
//                   {errors.projectName}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Description */}
//           <div className="flex items-center space-x-4">
//             <label
//               htmlFor="description"
//               className="block w-1/3 text-sm font-medium leading-6 text-gray-900"
//             >
//               <FaFileAlt className="text-blue-500 mr-2 inline-block" />{" "}
//               Description
//             </label>
//             <div className="w-2/3">
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//               ></textarea>
//             </div>
//           </div>

//           {/* Start Date */}
//           <div className="flex items-center space-x-4">
//             <label
//               htmlFor="startDate"
//               className="block w-1/3 text-sm font-medium leading-6 text-gray-900"
//             >
//               <FaCalendarAlt className="text-purple-500 mr-2 inline-block" />{" "}
//               Start Date
//             </label>
//             <div className="w-2/3">
//               <input
//                 id="startDate"
//                 name="startDate"
//                 type="date"
//                 required
//                 value={formData.startDate}
//                 onChange={handleChange}
//                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//               />
//               {errors.startDate && (
//                 <p className="mt-2 text-sm text-red-600">{errors.startDate}</p>
//               )}
//             </div>
//           </div>

//           {/* End Date */}
//           <div className="flex items-center space-x-4">
//             <label
//               htmlFor="endDate"
//               className="block w-1/3 text-sm font-medium leading-6 text-gray-900"
//             >
//               <FaCalendarAlt className="text-orange-500 mr-2 inline-block" />{" "}
//               End Date
//             </label>
//             <div className="w-2/3">
//               <input
//                 id="endDate"
//                 name="endDate"
//                 type="date"
//                 value={formData.endDate}
//                 onChange={handleChange}
//                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//               />
//             </div>
//           </div>

//           {/* Deadline */}
//           <div className="flex items-center space-x-4">
//             <label
//               htmlFor="deadline"
//               className="block w-1/3 text-sm font-medium leading-6 text-gray-900"
//             >
//               <FaCalendarAlt className="text-red-500 mr-2 inline-block" />{" "}
//               Deadline
//             </label>
//             <div className="w-2/3">
//               <input
//                 id="deadline"
//                 name="deadline"
//                 type="date"
//                 required
//                 value={formData.deadline}
//                 onChange={handleChange}
//                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//               />
//               {errors.deadline && (
//                 <p className="mt-2 text-sm text-red-600">{errors.deadline}</p>
//               )}
//             </div>
//           </div>

//           {/* Developers */}
//           <div className="flex items-center space-x-4">
//             <label
//               htmlFor="developers"
//               className="block w-1/3 text-sm font-medium leading-6 text-gray-900"
//             >
//               <FaUserTie className="text-green-500 mr-2 inline-block" />{" "}
//               Developers
//             </label>
//             <div className="w-2/3">
//               <select
//                 id="developers"
//                 name="developers"
//                 multiple
//                 value={formData.developers}
//                 onChange={handleDropdownChange}
//                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//               >
//                 {developers.map((developer) => (
//                   <option key={developer._id} value={developer._id}>
//                     {developer.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Test Engineers */}
//           <div className="flex items-center space-x-4">
//             <label
//               htmlFor="testEngineers"
//               className="block w-1/3 text-sm font-medium leading-6 text-gray-900"
//             >
//               <FaUsers className="text-blue-500 mr-2 inline-block" /> Test
//               Engineers
//             </label>
//             <div className="w-2/3">
//               <select
//                 id="testEngineers"
//                 name="testEngineers"
//                 multiple
//                 value={formData.testEngineers}
//                 onChange={handleDropdownChange}
//                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//               >
//                 {testEngineers.map((testEngineer) => (
//                   <option key={testEngineer._id} value={testEngineer._id}>
//                     {testEngineer.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {errors.submit && <div className="text-red-600">{errors.submit}</div>}
//           {successMessage && (
//             <div className="text-green-600">{successMessage}</div>
//           )}

//           <div>
//             <button
//               type="submit"
//               className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//             >
//               Create Project
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


// new code from there. 

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineWorkOutline } from "react-icons/md";
import { FaFileAlt, FaCalendarAlt, FaUserTie, FaUsers } from "react-icons/fa";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

/** Small badge pill with remove (x) */
function Pill({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs mr-1 mb-1">
      {children}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full bg-gray-200 px-1 leading-none hover:bg-gray-300"
        aria-label="remove"
        title="Remove"
      >
        ×
      </button>
    </span>
  );
}

/** RoleAssigner */
function RoleAssigner({ label, availableSource, assignedIds, setAssignedIds }) {
  const [availableSelection, setAvailableSelection] = useState([]);

  const idToUser = useMemo(() => {
    const map = new Map();
    (availableSource || []).forEach((u) => map.set(String(u._id), u));
    return map;
  }, [availableSource]);

  const assignedSet = useMemo(() => new Set((assignedIds || []).map(String)), [assignedIds]);
  const available = (availableSource || []).filter((u) => !assignedSet.has(String(u._id)));

  const canAdd = availableSelection.length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    const merged = Array.from(new Set([...(assignedIds || []), ...availableSelection.map(String)]));
    setAssignedIds(merged);
    setAvailableSelection([]);
  };

  const handleRemove = (userId) => {
    setAssignedIds((assignedIds || []).filter((id) => String(id) !== String(userId)));
  };

  const handleClear = () => setAssignedIds([]);

  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-800">{label}</div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className={`rounded-md px-2 py-1 text-xs font-semibold text-white ${
              canAdd ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-400 cursor-not-allowed"
            }`}
            title={canAdd ? "Add selected" : "Select from the left list first"}
          >
            Add →
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md bg-gray-200 px-2 py-1 text-xs hover:bg-gray-300"
            title="Clear all assigned"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <select
            multiple
            className="w-full h-24 rounded-md border py-1.5 px-2 text-sm"
            value={availableSelection}
            onChange={(e) => {
              const vals = Array.from(e.target.options)
                .filter((o) => o.selected)
                .map((o) => String(o.value));
              setAvailableSelection(vals);
            }}
          >
            {available.map((u) => (
              <option key={String(u._id)} value={String(u._id)}>
                {u.name}
              </option>
            ))}
          </select>
          <div className="text-[10px] text-gray-500 mt-1">
            {available.length === 0 ? "(No available users)" : "Available"}
          </div>
        </div>

        <div className="min-h-[96px]">
          {(assignedIds || []).length === 0 ? (
            <div className="text-xs text-gray-400 italic h-full flex items-center">
              (No one assigned)
            </div>
          ) : (
            <div className="flex flex-wrap">
              {assignedIds.map((id) => (
                <Pill key={String(id)} onRemove={() => handleRemove(id)}>
                  {idToUser.get(String(id))?.name || "Unknown"}
                </Pill>
              ))}
            </div>
          )}
          <div className="text-[10px] text-gray-500 mt-1">Assigned</div>
        </div>
      </div>
    </div>
  );
}

export default function CreateProject() {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    deadline: "",
    developers: [],
    testEngineers: [],
    superAdmins: [],
    projectManagers: [],
    admins: [],
    hrs: [],
    testLeads: [],
    qaLeads: [],
    developerLeads: [],
    bas: [],
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [developersList, setDevelopersList] = useState([]); // kept (not used for available now)
  const [testEngineersList, setTestEngineersList] = useState([]); // kept (not used for available now)
  const [allUsers, setAllUsers] = useState([]);

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [mode, setMode] = useState("create");

  const navigate = useNavigate();

  const nameIndex = useMemo(() => {
    const idx = new Map();
    projects.forEach((p) => idx.set((p.project_name || "").trim().toLowerCase(), p));
    return idx;
  }, [projects]);

  const nameClashes = useMemo(() => {
    const nm = (formData.projectName || "").trim().toLowerCase();
    if (!nm) return false;
    return nameIndex.has(nm);
  }, [formData.projectName, nameIndex]);

  // Normalize users
  const normalizeUsers = (raw) => {
    if (!raw) return [];
    const arr = Array.isArray(raw?.users)
      ? raw.users
      : Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
      ? raw.data
      : [];
    return arr
      .filter(Boolean)
      .map((u) => ({
        _id: String(u._id || u.id || u.user_id || ""),
        name: u.name || u.fullName || u.username || u.email || "Unnamed",
      }))
      .filter((u) => u._id);
  };

  // Call your existing /api/all-users only (no more 404 noise)
  const fetchAllUsers = async () => {
    const token = localStorage.getItem("token");
    const headers = token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };
    const url = `${globalBackendRoute}/api/all-users`;
    const res = await axios.get(url, { headers });
    return normalizeUsers(res.data);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [devRes, teRes, projNamesRes] = await Promise.all([
          axios.get(`${globalBackendRoute}/api/users/developers`),
          axios.get(`${globalBackendRoute}/api/users/test-engineers`),
          axios.get(`${globalBackendRoute}/api/projects/names`),
        ]);
        setDevelopersList(Array.isArray(devRes.data) ? devRes.data : []);
        setTestEngineersList(Array.isArray(teRes.data) ? teRes.data : []);
        setProjects(Array.isArray(projNamesRes.data?.projects) ? projNamesRes.data.projects : []);
      } catch (e) {
        console.error("Initial fetch (dev/te/projects) failed:", e);
      }

      try {
        const users = await fetchAllUsers();
        setAllUsers(users);
      } catch (e2) {
        console.warn("Could not load all users; pickers may be empty.", e2);
        setAllUsers([]);
      }
    };
    fetchAll();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    const formErrors = {};
    if (!formData.projectName.trim())
      formErrors.projectName = "Project name cannot be empty.";
    if (mode === "create" && !formData.startDate)
      formErrors.startDate = "Start date is required.";
    if (mode === "create" && !formData.deadline)
      formErrors.deadline = "Deadline is required.";
    if (mode === "create" && nameClashes) {
      formErrors.projectName =
        "A project with this name already exists (case-insensitive). Choose another name or switch to Edit.";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSelectExisting = async (projectId) => {
    try {
      setSelectedProjectId(projectId);
      setErrors({});
      setSuccessMessage("");
      if (!projectId) {
        setMode("edit");
        return;
      }
      setMode("edit");

      const res = await axios.get(`${globalBackendRoute}/api/projects/${projectId}`);
      const proj = res.data || {};

      setFormData((prev) => ({
        ...prev,
        projectName: proj.projectName || proj.project_name || "",
        description: proj.description || "",
        startDate: proj.startDate ? String(proj.startDate).substring(0, 10) : "",
        endDate: proj.endDate ? String(proj.endDate).substring(0, 10) : "",
        deadline: proj.deadline ? String(proj.deadline).substring(0, 10) : "",
        developers: (proj.developers || []).map((u) => String(u._id || u)),
        testEngineers: (proj.testEngineers || []).map((u) => String(u._id || u)),
        superAdmins: (proj.superAdmins || []).map((u) => String(u._id || u)),
        projectManagers: (proj.projectManagers || []).map((u) => String(u._id || u)),
        admins: (proj.admins || []).map((u) => String(u._id || u)),
        hrs: (proj.hrs || []).map((u) => String(u._id || u)),
        testLeads: (proj.testLeads || []).map((u) => String(u._id || u)),
        qaLeads: (proj.qaLeads || []).map((u) => String(u._id || u)),
        developerLeads: (proj.developerLeads || []).map((u) => String(u._id || u)),
        bas: (proj.bas || []).map((u) => String(u._id || u)),
      }));
    } catch (e) {
      console.error("Failed to load project:", e?.response?.data || e);
      setErrors({ submit: e?.response?.data?.message || "Failed to load project" });
    }
  };

  const handleCreate = async () => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    const creatorId = user?._id || user?.id;

    try {
      const payload = { ...formData, createdBy: creatorId };
      const res = await axios.post(`${globalBackendRoute}/api/create-project`, payload, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201) {
        setSuccessMessage("Project created successfully!");
        alert("Project Created Successfully.");
        navigate("/all-projects");
      } else {
        setErrors({ submit: "Project creation failed." });
      }
    } catch (error) {
      const serverMsg = error?.response?.data?.message || error?.message || "Server error";
      setErrors({ submit: serverMsg });
    }
  };

  const handleSaveMembers = async () => {
    if (!selectedProjectId) {
      setErrors({ submit: "Please select a project to edit." });
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const {
        developers,
        testEngineers,
        superAdmins,
        projectManagers,
        admins,
        hrs,
        testLeads,
        qaLeads,
        developerLeads,
        bas,
      } = formData;

      const payload = {
        developers,
        testEngineers,
        superAdmins,
        projectManagers,
        admins,
        hrs,
        testLeads,
        qaLeads,
        developerLeads,
        bas,
      };

      await axios.put(
        `${globalBackendRoute}/api/projects/${selectedProjectId}/members`,
        payload,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMessage("Members updated successfully!");
    } catch (e) {
      const serverMsg = e?.response?.data?.message || e?.message || "Server error";
      setErrors({ submit: serverMsg });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (mode === "create") {
      await handleCreate();
    } else {
      await handleSaveMembers();
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <MdOutlineWorkOutline className="text-indigo-600 mx-auto mb-2" size={40} />
          <h2 className="text-xl font-bold text-gray-900">
            {mode === "create" ? "Create New Project" : "Edit Existing Project"}
          </h2>
        </div>

        {/* Mode + Choose project */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Mode</span>
            <select
              className="rounded-md border py-1.5 px-2 text-sm"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="create">Create</option>
              <option value="edit">Edit</option>
            </select>
          </div>

          {mode === "edit" && (
            <div className="flex items-center gap-2 md:col-span-2">
              <span className="text-sm text-gray-700">Project</span>
              <select
                className="rounded-md border py-1.5 px-2 text-sm w-full"
                value={selectedProjectId}
                onChange={(e) => handleSelectExisting(e.target.value)}
              >
                <option value="">-- Select --</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.project_name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Top basics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Name */}
            <div className="flex items-center gap-2">
              <label htmlFor="projectName" className="w-36 text-sm font-medium text-gray-700">
                <FaFileAlt className="text-green-500 inline-block mr-1" />
                Name
              </label>
              <input
                id="projectName"
                name="projectName"
                type="text"
                required
                value={formData.projectName}
                onChange={(e) =>
                  setFormData({ ...formData, projectName: e.target.value })
                }
                list="project-name-suggestions"
                className="flex-1 min-w-0 rounded-md border py-1.5 px-2 text-sm"
              />
              <datalist id="project-name-suggestions">
                {projects.map((p) => (
                  <option key={p._id} value={p.project_name} />
                ))}
              </datalist>
            </div>

            {/* Dates row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-2">
                <label htmlFor="startDate" className="text-xs text-gray-700 whitespace-nowrap">
                  <FaCalendarAlt className="text-purple-500 inline-block mr-1" />
                  Start
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required={mode === "create"}
                  value={formData.startDate}
                  onChange={handleChange}
                  className="flex-1 min-w-0 rounded-md border py-1 px-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="endDate" className="text-xs text-gray-700 whitespace-nowrap">
                  <FaCalendarAlt className="text-orange-500 inline-block mr-1" />
                  End
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="flex-1 min-w-0 rounded-md border py-1 px-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="deadline" className="text-xs text-gray-700 whitespace-nowrap">
                  <FaCalendarAlt className="text-red-500 inline-block mr-1" />
                  Deadline
                </label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  required={mode === "create"}
                  value={formData.deadline}
                  onChange={handleChange}
                  className="flex-1 min-w-0 rounded-md border py-1 px-2 text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 flex items-start gap-2">
              <label htmlFor="description" className="w-36 text-sm font-medium text-gray-700">
                <FaFileAlt className="text-blue-500 inline-block mr-1" />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="flex-1 min-w-0 rounded-md border py-1.5 px-2 text-sm"
              />
            </div>
          </div>

          {/* Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Use ALL USERS for available list so you can add anyone */}
            <RoleAssigner
              label={
                <span className="inline-flex items-center gap-1">
                  <FaUserTie className="text-green-500" /> Developers
                </span>
              }
              availableSource={allUsers}
              assignedIds={formData.developers}
              setAssignedIds={(ids) => setFormData((p) => ({ ...p, developers: ids }))}
            />
            <RoleAssigner
              label={
                <span className="inline-flex items-center gap-1">
                  <FaUsers className="text-blue-500" /> Test Engineers
                </span>
              }
              availableSource={allUsers}
              assignedIds={formData.testEngineers}
              setAssignedIds={(ids) => setFormData((p) => ({ ...p, testEngineers: ids }))}
            />

            {/* New role pickers */}
            <RoleAssigner
              label="Super Admins"
              availableSource={allUsers}
              assignedIds={formData.superAdmins}
              setAssignedIds={(ids) => setFormData((p) => ({ ...p, superAdmins: ids }))}
            />
            <RoleAssigner
              label="Project Managers"
              availableSource={allUsers}
              assignedIds={formData.projectManagers}
              setAssignedIds={(ids) => setFormData((p) => ({ ...p, projectManagers: ids }))}
            />
            <RoleAssigner
              label="Admins"
              availableSource={allUsers}
              assignedIds={formData.admins}
              setAssignedIds={(ids) => setFormData((p) => ({ ...p, admins: ids }))}
            />
            <RoleAssigner
              label="HRs"
              availableSource={allUsers}
              assignedIds={formData.hrs}
              setAssignedIds={(ids) => setFormData((p) => ({ ...p, hrs: ids }))}
            />
            <RoleAssigner
              label="Test Leads"
              availableSource={allUsers}
              assignedIds={formData.testLeads}
              setAssignedIds={(ids) => setFormData((p) => ({ ...p, testLeads: ids }))}
            />
            <RoleAssigner
              label="QA Leads"
              availableSource={allUsers}
              assignedIds={formData.qaLeads}
              setAssignedIds={(ids) => setFormData((p) => ({ ...p, qaLeads: ids }))}
            />
            <RoleAssigner
              label="Developer Leads"
              availableSource={allUsers}
              assignedIds={formData.developerLeads}
              setAssignedIds={(ids) => setFormData((p) => ({ ...p, developerLeads: ids }))}
            />
            <RoleAssigner
              label="Business Analysts"
              availableSource={allUsers}
              assignedIds={formData.bas}
              setAssignedIds={(ids) => setFormData((p) => ({ ...p, bas: ids }))}
            />
          </div>

          {/* Messages */}
          {errors.projectName && <p className="text-red-600 text-sm">{errors.projectName}</p>}
          {errors.startDate && <p className="text-red-600 text-sm">{errors.startDate}</p>}
          {errors.deadline && <p className="text-red-600 text-sm">{errors.deadline}</p>}
          {errors.submit && <div className="text-red-600 text-sm">{errors.submit}</div>}
          {successMessage && <div className="text-green-600 text-sm">{successMessage}</div>}

          {/* Submit */}
          <div className="sticky bottom-2 bg-white/70 backdrop-blur p-2 rounded-md shadow flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
            >
              {mode === "create" ? "Create Project" : "Save Members"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

