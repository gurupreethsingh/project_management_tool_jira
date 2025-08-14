// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   FaThList,
//   FaThLarge,
//   FaTh,
//   FaProjectDiagram,
//   FaTrashAlt,
// } from "react-icons/fa"; // Importing delete icon
// import { Link } from "react-router-dom";

// const AllProjects = () => {
//   const [projects, setProjects] = useState([]);
//   const [view, setView] = useState("grid");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [projectsPerPage, setProjectsPerPage] = useState(10);

//   useEffect(() => {
//     fetchProjects();
//   }, [searchTerm, currentPage, view]);

//   // original
//   // const fetchProjects = async () => {
//   //   try {
//   //     const response = await axios.get(
//   //       `http://localhost:5000/all-projects?search=${searchTerm}`
//   //     );
//   //     setProjects(response.data.projects); // Ensure you are receiving the full project list
//   //   } catch (error) {
//   //     console.error("Error fetching projects:", error);
//   //   }
//   // };

//   const fetchProjects = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/all-projects");
//       const allProjects = response.data.projects;

//       // Common stop words
//       const stopWords = new Set([
//         "a",
//         "an",
//         "the",
//         "and",
//         "or",
//         "but",
//         "if",
//         "to",
//         "of",
//         "in",
//         "on",
//         "at",
//         "for",
//         "with",
//         "by",
//         "from",
//       ]);

//       // Basic stemmer function
//       const stemWord = (word) => {
//         return word
//           .replace(/ing$|ed$|ly$|s$/gi, "") // remove common endings
//           .toLowerCase();
//       };

//       const searchWords = searchTerm
//         .toLowerCase()
//         .split(/\s+/)
//         .filter((word) => word && !stopWords.has(word))
//         .map(stemWord);

//       const filteredProjects = allProjects.filter((project) => {
//         const combined =
//           `${project.project_name} ${project.description}`.toLowerCase();
//         const stemmedCombined = combined.split(/\s+/).map(stemWord).join(" ");

//         return searchWords.every((word) => stemmedCombined.includes(word));
//       });

//       setProjects(filteredProjects);
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//     }
//   };

//   const handleViewChange = (viewType) => {
//     setView(viewType);
//     setCurrentPage(1); // Reset to the first page when changing views
//     if (viewType === "grid") {
//       setProjectsPerPage(10); // 5 per row, 2 rows
//     } else if (viewType === "card") {
//       setProjectsPerPage(8); // 4 per row, 2 rows
//     } else {
//       setProjectsPerPage(5); // Default for list view
//     }
//   };

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleDeleteProject = async (projectId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this project?"
//     );
//     if (confirmDelete) {
//       try {
//         await axios.delete(`http://localhost:5000/delete-project/${projectId}`);
//         alert("Project has been successfully deleted.");
//         fetchProjects(); // Refetch projects after deletion
//       } catch (error) {
//         console.error("Error deleting project:", error);
//         alert("Error deleting the project. Please try again.");
//       }
//     }
//   };

//   // Pagination Logic
//   const indexOfLastProject = currentPage * projectsPerPage;
//   const indexOfFirstProject = indexOfLastProject - projectsPerPage;
//   const currentProjects = projects.slice(
//     indexOfFirstProject,
//     indexOfLastProject
//   );

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const renderProjects = () => {
//     if (view === "grid") {
//       return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//           {currentProjects.map((project) => (
//             <div
//               key={project._id}
//               className="bg-white p-4 shadow-lg rounded-lg flex flex-col items-center relative"
//             >
//               <FaTrashAlt
//                 className="absolute top-2 right-2 text-red-500 cursor-pointer"
//                 onClick={() => handleDeleteProject(project._id)}
//               />
//               <FaProjectDiagram className="text-4xl text-blue-500 mb-2" />
//               <h3 className="text-xs font-semibold text-gray-600">
//                 {project.project_name}
//               </h3>
//               <p className="text-xs text-gray-400 mt-1 text-center">
//                 {project.description}
//               </p>
//               <Link
//                 to={`/single-project/${project._id}`}
//                 className="mt-2 text-xs text-indigo-600"
//               >
//                 View Project Details
//               </Link>
//             </div>
//           ))}
//         </div>
//       );
//     } else if (view === "card") {
//       return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//           {currentProjects.map((project) => (
//             <div
//               key={project._id}
//               className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center relative"
//             >
//               <FaTrashAlt
//                 className="absolute top-2 right-2 text-red-500 cursor-pointer"
//                 onClick={() => handleDeleteProject(project._id)}
//               />
//               <FaProjectDiagram className="text-5xl text-green-500 mb-2" />
//               <h3 className="text-xs font-bold text-gray-600">
//                 {project.project_name}
//               </h3>
//               <p className="text-xs text-gray-400 mt-2 text-center">
//                 {project.description}
//               </p>
//               <Link
//                 to={`/single-project/${project._id}`}
//                 className="mt-2 text-xs text-indigo-600"
//               >
//                 View Project Details
//               </Link>
//             </div>
//           ))}
//         </div>
//       );
//     } else if (view === "list") {
//       return (
//         <div className="space-y-4">
//           {currentProjects.map((project) => (
//             <div
//               key={project._id}
//               className="bg-white p-4 shadow-lg rounded-lg flex justify-between items-center relative"
//             >
//               <FaTrashAlt
//                 className="absolute top-2 right-2 text-red-500 cursor-pointer"
//                 onClick={() => handleDeleteProject(project._id)}
//               />
//               <div className="flex items-center">
//                 <FaProjectDiagram className="text-3xl text-purple-500 mr-4" />
//                 <h3 className="text-xs font-semibold text-gray-600">
//                   {project.project_name}
//                 </h3>
//               </div>
//               <p className="text-xs text-gray-400">{project.description}</p>
//               <Link
//                 to={`/single-project/${project._id}`}
//                 className="text-xs text-indigo-600"
//               >
//                 View Project Details
//               </Link>
//             </div>
//           ))}
//         </div>
//       );
//     }
//   };

//   const renderPagination = () => {
//     const pageNumbers = [];
//     for (let i = 1; i <= Math.ceil(projects.length / projectsPerPage); i++) {
//       pageNumbers.push(i);
//     }

//     return (
//       <div className="mt-8 flex justify-center">
//         <ul className="inline-flex space-x-2">
//           {pageNumbers.map((number) => (
//             <li key={number}>
//               <button
//                 onClick={() => paginate(number)}
//                 className={`px-3 py-1 rounded-lg text-white bg-indigo-500 hover:bg-indigo-700 ${
//                   number === currentPage ? "bg-indigo-700" : ""
//                 }`}
//               >
//                 {number}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   };

//   return (
//     <div className="py-16 sm:py-20">
//       <div className="mx-auto max-w-7xl px-6 lg:px-8">
//         {/* All Projects title */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
//           <h3 className="text-2xl font-bold text-start text-indigo-600">
//             All Projects
//           </h3>

//           <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
//             <Link
//               to={`/create-project`}
//               className="btn btn-sm bg-indigo-500 text-white rounded-lg shadow-lg hover:bg-indigo-600 w-full md:w-auto"
//             >
//               Create Project
//             </Link>

//             <input
//               type="text"
//               placeholder="Search Projects"
//               value={searchTerm}
//               onChange={handleSearchChange}
//               className="p-2 border border-gray-300 rounded-lg w-full md:w-auto"
//             />

//             <div className="flex space-x-4 justify-center md:justify-start">
//               <FaThList
//                 className={`text-xl cursor-pointer ${
//                   view === "list" ? "text-indigo-600" : "text-gray-600"
//                 }`}
//                 onClick={() => handleViewChange("list")}
//               />
//               <FaThLarge
//                 className={`text-xl cursor-pointer ${
//                   view === "card" ? "text-indigo-600" : "text-gray-600"
//                 }`}
//                 onClick={() => handleViewChange("card")}
//               />
//               <FaTh
//                 className={`text-xl cursor-pointer ${
//                   view === "grid" ? "text-indigo-600" : "text-gray-600"
//                 }`}
//                 onClick={() => handleViewChange("grid")}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Render Projects */}
//         {renderProjects()}

//         {/* Pagination */}
//         {renderPagination()}
//       </div>
//     </div>
//   );
// };

// export default AllProjects;

// till here every thing is perfect.

//

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaProjectDiagram,
  FaTrashAlt,
  FaEye,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [view, setView] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage, setProjectsPerPage] = useState(10);

  useEffect(() => {
    fetchProjects();
  }, [searchTerm, currentPage, view]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/all-projects");
      const allProjects = response.data.projects;

      const stopWords = new Set([
        "a",
        "an",
        "the",
        "and",
        "or",
        "but",
        "if",
        "to",
        "of",
        "in",
        "on",
        "at",
        "for",
        "with",
        "by",
        "from",
      ]);

      const stemWord = (word) =>
        word.replace(/ing$|ed$|ly$|s$/gi, "").toLowerCase();

      const searchWords = searchTerm
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word && !stopWords.has(word))
        .map(stemWord);

      const filteredProjects = allProjects.filter((project) => {
        const combined =
          `${project.project_name} ${project.description}`.toLowerCase();
        const stemmedCombined = combined.split(/\s+/).map(stemWord).join(" ");
        return searchWords.every((word) => stemmedCombined.includes(word));
      });

      setProjects(filteredProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleViewChange = (viewType) => {
    setView(viewType);
    setCurrentPage(1);
    if (viewType === "grid") setProjectsPerPage(10);
    else if (viewType === "card") setProjectsPerPage(8);
    else setProjectsPerPage(5);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`http://localhost:5000/delete-project/${id}`);
        alert("Project deleted.");
        fetchProjects();
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete project.");
      }
    }
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const paginate = (page) => setCurrentPage(page);

  const renderProjects = () => {
    if (view === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {currentProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-4 shadow-lg rounded-lg flex flex-col items-center relative"
            >
              <FaTrashAlt
                className="absolute top-2 right-2 text-red-500 cursor-pointer"
                onClick={() => handleDeleteProject(project._id)}
              />
              <FaProjectDiagram className="text-4xl text-blue-500 mb-2" />
              <h3 className="text-xs font-semibold text-gray-600 text-center">
                {project.project_name}
              </h3>
              <p className="text-xs text-gray-400 mt-1 text-center">
                {project.description}
              </p>
              <Link
                to={`/single-project/${project._id}`}
                className="mt-2 text-xs text-indigo-600"
              >
                View Project Details
              </Link>
            </div>
          ))}
        </div>
      );
    } else if (view === "card") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {currentProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center relative"
            >
              <FaTrashAlt
                className="absolute top-2 right-2 text-red-500 cursor-pointer"
                onClick={() => handleDeleteProject(project._id)}
              />
              <FaProjectDiagram className="text-5xl text-green-500 mb-2" />
              <h3 className="text-xs font-bold text-gray-600 text-center">
                {project.project_name}
              </h3>
              <p className="text-xs text-gray-400 mt-2 text-center">
                {project.description}
              </p>
              <Link
                to={`/single-project/${project._id}`}
                className="mt-2 text-xs text-indigo-600"
              >
                View Project Details
              </Link>
            </div>
          ))}
        </div>
      );
    } else if (view === "list") {
      return (
        <div className="space-y-4">
          <div className="hidden sm:grid grid-cols-4 font-bold text-sm text-center text-indigo-700 border-b pb-2">
            <div>Project Name</div>
            <div> Description</div>
            <div> View</div>
            <div> Delete</div>
          </div>
          {currentProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-4 rounded-lg shadow flex flex-col sm:grid sm:grid-cols-4 sm:items-center text-sm"
            >
              <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                <FaProjectDiagram className="text-purple-500" />
                <span className="text-gray-700 font-medium">
                  {project.project_name}
                </span>
              </div>
              <div className="text-gray-500 text-sm mb-2 sm:mb-0 text-center">
                | {project.description}
              </div>
              <div className="text-indigo-600 hover:underline mb-2 sm:mb-0 text-center">
                |{" "}
                <Link to={`/single-project/${project._id}`}>
                  View Project Details
                </Link>
              </div>
              <div className="text-red-500 cursor-pointer text-center">
                |{" "}
                <FaTrashAlt
                  className="inline"
                  onClick={() => handleDeleteProject(project._id)}
                />
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(projects.length / projectsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="mt-8 flex justify-center">
        <ul className="inline-flex space-x-2">
          {pageNumbers.map((number) => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded-lg text-white bg-indigo-500 hover:bg-indigo-700 ${
                  number === currentPage ? "bg-indigo-700" : ""
                }`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
          <h3 className="text-2xl font-bold text-start text-indigo-600">
            All Projects
          </h3>
          <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
            <Link
              to={`/create-project`}
              className="btn btn-sm bg-indigo-500 text-white rounded-lg shadow-lg hover:bg-indigo-600 w-full md:w-auto"
            >
              Create Project
            </Link>
            <input
              type="text"
              placeholder="Search Projects"
              value={searchTerm}
              onChange={handleSearchChange}
              className="p-2 border border-gray-300 rounded-lg w-full md:w-auto"
            />
            <div className="flex space-x-4 justify-center md:justify-start">
              <FaThList
                className={`text-xl cursor-pointer ${
                  view === "list" ? "text-indigo-600" : "text-gray-600"
                }`}
                onClick={() => handleViewChange("list")}
              />
              <FaThLarge
                className={`text-xl cursor-pointer ${
                  view === "card" ? "text-indigo-600" : "text-gray-600"
                }`}
                onClick={() => handleViewChange("card")}
              />
              <FaTh
                className={`text-xl cursor-pointer ${
                  view === "grid" ? "text-indigo-600" : "text-gray-600"
                }`}
                onClick={() => handleViewChange("grid")}
              />
            </div>
          </div>
        </div>

        {renderProjects()}
        {renderPagination()}
      </div>
    </div>
  );
};

export default AllProjects;
