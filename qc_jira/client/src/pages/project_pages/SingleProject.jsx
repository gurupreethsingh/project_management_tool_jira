import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaPlus,
  FaFileAlt,
  FaCodeBranch,
  FaBug,
  FaChartBar,
  FaLaptopCode,
  FaHardHat,
  FaCalendarAlt,
  FaFolderOpen,
  FaClock,
  FaNetworkWired,
  FaTasks,
  FaShieldAlt,
  FaProjectDiagram,
  FaUserShield,
  FaUserFriends,
  FaUserCog,
  FaUserTie,
  FaUsers,
  FaBusinessTime,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const SingleProject = () => {
  const { projectId } = useParams();
  const [userRole, setUserRole] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalTestCases, setTotalTestCases] = useState(0);
  const [totalDefects, setTotalDefects] = useState(0);
  const navigate = useNavigate();

  // read once for ids we need elsewhere
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const developerId = loggedInUser ? loggedInUser.id : null;

  useEffect(() => {
    fetchProject();
    fetchTestCaseCount();
    fetchDefectsCount();
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role) setUserRole(user.role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${globalBackendRoute}/api/single-project/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProject(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Unauthorized access. Please log in.");
        navigate("/login");
      } else {
        console.error("Error fetching project:", error.message);
        setError("Failed to load project data.");
        setLoading(false);
      }
    }
  };

  const fetchTestCaseCount = async () => {
    try {
      const res = await axios.get(
        `${globalBackendRoute}/api/projects/${projectId}/test-cases-count`
      );
      setTotalTestCases(res.data.totalTestCases || 0);
    } catch (err) {
      console.error(
        "Error fetching test case count:",
        err?.response?.status,
        err?.message
      );
      setTotalTestCases(0);
    }
  };

  const fetchDefectsCount = async () => {
    try {
      const res = await axios.get(
        `${globalBackendRoute}/api/single-project/${projectId}/defects-count`
      );
      setTotalDefects(res.data.totalDefects || 0);
    } catch (err) {
      console.error(
        "Error fetching defects count:",
        err?.response?.status,
        err?.message
      );
      setTotalDefects(0);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return <div className="text-center p-4 text-rose-700">{error}</div>;
  if (!project) return null;

  // ----- role helpers -----
  const normRole = (userRole || "").toLowerCase();
  const ALLOWED_REQUIREMENT_ROLES = new Set([
    "superadmin",
    "admin",
    "project_manager",
    "developer_lead",
    "qa_lead",
  ]);
  const canCreateRequirement = ALLOWED_REQUIREMENT_ROLES.has(normRole);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const taskLink = [
    "superadmin",
    "admin",
    "qa_lead",
    "project_manager",
  ].includes(normRole)
    ? `/single-project/${projectId}/view-all-tasks`
    : `/single-project/${projectId}/user-assigned-tasks/${userId}`;

  const totalScenarios = project.totalScenarios || 0;

  // ----- light button base classes -----
  const baseBtn =
    "px-3 py-2 text-sm rounded-md border transition-colors duration-150 flex items-center justify-center";

  // ---------- small list renderer for each role ----------
  const RoleList = ({ title, colorClasses, icon, list }) => {
    const items = Array.isArray(list) ? list : [];
    return (
      <div
        className={`p-4 rounded-lg border ${colorClasses.bg} ${colorClasses.border}`}
      >
        <h3 className={`text-md font-semibold mb-2 ${colorClasses.title}`}>
          {icon}
          {title}
        </h3>
        {items.length > 0 ? (
          <ul>
            {items.map((u, idx) => (
              <li
                key={u?._id || `${title}-${u?.name || "unknown"}-${idx}`}
                className="flex items-center text-slate-700"
              >
                <FaUser className={`${colorClasses.icon} mr-2`} />
                {u?.name || "Unnamed"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-600">No {title.toLowerCase()} assigned.</p>
        )}
      </div>
    );
  };

  // Colors/icons per section (compact but distinct)
  const style = {
    dev: {
      bg: "bg-sky-50",
      border: "border-sky-100",
      title: "text-sky-800",
      icon: "text-sky-500",
    },
    te: {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      title: "text-emerald-800",
      icon: "text-emerald-500",
    },
    super: {
      bg: "bg-fuchsia-50",
      border: "border-fuchsia-100",
      title: "text-fuchsia-800",
      icon: "text-fuchsia-500",
    },
    pm: {
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      title: "text-indigo-800",
      icon: "text-indigo-500",
    },
    admin: {
      bg: "bg-teal-50",
      border: "border-teal-100",
      title: "text-teal-800",
      icon: "text-teal-500",
    },
    hr: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      title: "text-amber-800",
      icon: "text-amber-500",
    },
    testlead: {
      bg: "bg-cyan-50",
      border: "border-cyan-100",
      title: "text-cyan-800",
      icon: "text-cyan-500",
    },
    qalead: {
      bg: "bg-purple-50",
      border: "border-purple-100",
      title: "text-purple-800",
      icon: "text-purple-500",
    },
    devlead: {
      bg: "bg-lime-50",
      border: "border-lime-100",
      title: "text-lime-800",
      icon: "text-lime-500",
    },
    ba: {
      bg: "bg-rose-50",
      border: "border-rose-100",
      title: "text-rose-800",
      icon: "text-rose-500",
    },
  };

  // Fallbacks: support snake_cased or camelCased backend keys
  const devs = project.developers || project?.Developers || [];
  const tests = project.testEngineers || project?.test_engineers || [];
  const superAdmins = project.superAdmins || project.super_admins || [];
  const projectManagers =
    project.projectManagers || project.project_managers || [];
  const admins = project.admins || [];
  const hrs = project.hrs || project.hr || [];
  const testLeads = project.testLeads || project.test_leads || [];
  const qaLeads = project.qaLeads || project.qa_leads || [];
  const developerLeads =
    project.developerLeads || project.developer_leads || [];
  const bas =
    project.bas || project.business_analysts || project.businessAnalysts || [];

  return (
    <div className="container mx-auto p-4 bg-white">
      {/* Project Info (UNCHANGED) */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 border border-slate-200">
        <h1 className="text-2xl font-semibold text-slate-800 flex items-center">
          <FaFolderOpen className="mr-2 text-indigo-400" />
          <span className="font-extrabold">Project Name: </span>
          <span className="text-indigo-700 ml-2 font-serif">
            {project.projectName}
          </span>
        </h1>
        <div className="flex justify-between flex-wrap items-center">
          <p className="font-medium text-slate-700 flex items-center mt-2">
            <FaFileAlt className="mr-2 text-indigo-400" />
            Description: <span className="ml-1">{project.description}</span>
          </p>
          <p className="font-medium text-slate-700 flex items-center mt-1">
            <FaCalendarAlt className="mr-2 text-emerald-500" />
            <span className="font-bold">Start Date:</span>
            <span className="text-emerald-700 ml-2">
              {project.startDate
                ? new Date(project.startDate).toLocaleDateString()
                : "—"}
            </span>
          </p>
          <p className="font-medium text-slate-700 flex items-center mt-1">
            <FaClock className="mr-2 text-rose-400" />
            Deadline:
            <span className="text-rose-700 ml-2">
              {project.deadline
                ? new Date(project.deadline).toLocaleDateString()
                : "—"}
            </span>
          </p>
          <p className="font-medium text-slate-700 flex items-center mt-1">
            <FaLaptopCode className="mr-2 text-indigo-400" />
            Domain:
            <span className="text-indigo-700 ml-2">
              {project.domain || "—"}
            </span>
          </p>
        </div>
      </div>

      {/* Action Buttons (UNCHANGED) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
        <Link
          to={`/single-project/${projectId}/add-scenario`}
          className={`${baseBtn} bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200`}
        >
          <FaPlus className="mr-1" />
          Add Scenario
        </Link>

        <Link
          to={`/single-project/${projectId}/view-all-scenarios`}
          className={`${baseBtn} bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200`}
        >
          <FaFolderOpen className="mr-1" />
          View Scenarios
        </Link>

        <Link
          to={`/single-project/${projectId}/all-test-cases`}
          className={`${baseBtn} bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200`}
        >
          <FaFileAlt className="mr-1" />
          View Test Cases
        </Link>

        {(normRole === "superadmin" ||
          normRole === "admin" ||
          normRole === "project_manager" ||
          normRole === "qa_lead" ||
          normRole === "test_lead" ||
          normRole === "test_engineer" ||
          normRole === "developer_lead" ||
          normRole === "developer" ||
          normRole === "test_engineer") && (
          <>
            <Link
              to={`/single-project/${projectId}/add-defect`}
              className={`${baseBtn} bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200`}
            >
              <FaBug className="mr-1" />
              Add Defect
            </Link>
            <Link
              to={`/single-project/${projectId}/all-defects`}
              className={`${baseBtn} bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200`}
            >
              <FaBug className="mr-1" />
              View Defects
            </Link>
          </>
        )}

        {normRole === "developer" && (
          <Link
            to={`/single-project/${projectId}/developer/${developerId}/view-assigned-defects`}
            className={`${baseBtn} bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100`}
          >
            <FaBug className="mr-1" />
            Assigned Defects
          </Link>
        )}

        {(normRole === "superadmin" ||
          normRole === "admin" ||
          normRole === "project_manager" ||
          normRole === "qa_lead" ||
          normRole === "test_lead" ||
          normRole === "test_engineer" ||
          normRole === "developer_lead" ||
          normRole === "developer") && (
          <Link
            to={`/single-project/${projectId}/all-defects`}
            className={`${baseBtn} bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100`}
          >
            <FaBug className="mr-1" />
            Bug Bucket
          </Link>
        )}

        <Link
          to={`/single-project/${projectId}/traceability-matrix`}
          className={`${baseBtn} bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-200`}
        >
          <FaChartBar className="mr-1" />
          Traceability Matrix
        </Link>

        {(normRole === "superadmin" ||
          normRole === "admin" ||
          normRole === "project_manager" ||
          normRole === "developer_lead" ||
          normRole === "qa_lead" ||
          normRole === "test_engineer" ||
          normRole === "test_lead") && (
          <Link
            to={`/single-project/${projectId}/test-case-execution`}
            className={`${baseBtn} bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200`}
          >
            <FaNetworkWired className="mr-1" />
            Execute Test Cases
          </Link>
        )}

        {(normRole === "superadmin" ||
          normRole === "admin" ||
          normRole === "project_manager" ||
          normRole === "developer_lead" ||
          normRole === "qa_lead" ||
          normRole === "test_lead") && (
          <Link
            to={`/projects/${projectId}/assign-task`}
            className={`${baseBtn} bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200`}
          >
            <FaTasks className="mr-1" />
            Add Task
          </Link>
        )}

        <Link
          to={taskLink}
          className={`${baseBtn} bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100`}
        >
          <FaFolderOpen className="mr-1" />
          View Tasks
        </Link>

        {/* Requirement Management */}
        {canCreateRequirement && (
          <Link
            to={`/create-requirement/${projectId}`}
            className={`${baseBtn} bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200`}
          >
            <FaPlus className="mr-1" />
            Create Requirement
          </Link>
        )}

        <Link
          to={`/all-requirements/${projectId}`}
          className={`${baseBtn} bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100`}
        >
          <FaFolderOpen className="mr-1" />
          View Requirements
        </Link>
      </div>

      {/* Users Involved (EXTENDED) */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">Users Involved</h2>

        {/* First row: Developers & Test Engineers (UNCHANGED content, wrapped in RoleList for consistency) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <RoleList
            title="Developers"
            colorClasses={style.dev}
            icon={<FaLaptopCode className="mr-2 inline text-sky-500" />}
            list={devs}
          />
          <RoleList
            title="Test Engineers"
            colorClasses={style.te}
            icon={<FaHardHat className="mr-2 inline text-emerald-500" />}
            list={tests}
          />
        </div>

        {/* New roles — compact grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
          <RoleList
            title="Super Admins"
            colorClasses={style.super}
            icon={<FaShieldAlt className="mr-2 inline text-fuchsia-500" />}
            list={superAdmins}
          />
          <RoleList
            title="Project Managers"
            colorClasses={style.pm}
            icon={<FaProjectDiagram className="mr-2 inline text-indigo-500" />}
            list={projectManagers}
          />
          <RoleList
            title="Admins"
            colorClasses={style.admin}
            icon={<FaUserShield className="mr-2 inline text-teal-500" />}
            list={admins}
          />
          <RoleList
            title="HRs"
            colorClasses={style.hr}
            icon={<FaUserFriends className="mr-2 inline text-amber-500" />}
            list={hrs}
          />
          <RoleList
            title="Test Leads"
            colorClasses={style.testlead}
            icon={<FaUserCog className="mr-2 inline text-cyan-500" />}
            list={testLeads}
          />
          <RoleList
            title="QA Leads"
            colorClasses={style.qalead}
            icon={<FaUserCog className="mr-2 inline text-purple-500" />}
            list={qaLeads}
          />
          <RoleList
            title="Developer Leads"
            colorClasses={style.devlead}
            icon={<FaUserTie className="mr-2 inline text-lime-500" />}
            list={developerLeads}
          />
          <RoleList
            title="Business Analysts"
            colorClasses={style.ba}
            icon={<FaBusinessTime className="mr-2 inline text-rose-500" />}
            list={bas}
          />
        </div>
      </div>

      {/* Summary Cards (UNCHANGED) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-amber-50 p-4 rounded-lg flex items-center border border-amber-100">
          <FaFileAlt className="text-3xl text-amber-500 mr-4" />
          <div>
            <h3 className="text-sm font-semibold text-amber-900">
              Total Scenarios
            </h3>
            <p className="text-lg text-amber-900">{totalScenarios}</p>
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-lg flex items-center border border-emerald-100">
          <FaCodeBranch className="text-3xl text-emerald-500 mr-4" />
          <div>
            <h3 className="text-sm font-semibold text-emerald-900">
              Total Test Cases
            </h3>
            <p className="text-xl text-emerald-900">{totalTestCases}</p>
          </div>
        </div>

        <div className="bg-rose-50 p-4 rounded-lg flex items-center border border-rose-100">
          <FaBug className="text-3xl text-rose-500 mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-rose-900">
              Total Defects
            </h3>
            <p className="text-xl text-rose-900">{totalDefects}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProject;
