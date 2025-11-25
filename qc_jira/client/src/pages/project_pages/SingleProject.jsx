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

  useEffect(() => {
    if (projectId && /^[0-9a-fA-F]{24}$/.test(projectId)) {
      localStorage.setItem("lastProjectId", projectId);
    }
  }, [projectId]);

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

  if (loading)
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-slate-600">
        Loading project...
      </div>
    );

  if (error)
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-rose-700">
        {error}
      </div>
    );

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

  // ----- controls button style (aligned with AllProjects look) -----
  const baseBtn =
    "inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] md:text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium whitespace-nowrap shadow-sm hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition";

  // ----- role data with fallbacks -----
  const devs = project.developers || project.Developers || [];
  const tests = project.testEngineers || project.test_engineers || [];
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

  const roleBlocks = [
    { key: "Developers", list: devs },
    { key: "Test Engineers", list: tests },
    { key: "Super Admins", list: superAdmins },
    { key: "Project Managers", list: projectManagers },
    { key: "Admins", list: admins },
    { key: "HRs", list: hrs },
    { key: "Test Leads", list: testLeads },
    { key: "QA Leads", list: qaLeads },
    { key: "Developer Leads", list: developerLeads },
    { key: "Business Analysts", list: bas },
  ].filter((r) => Array.isArray(r.list) && r.list.length > 0);

  const RoleRow = ({ title, list }) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 py-2">
      <div className="w-48 flex items-center gap-2 text-xs font-semibold text-slate-800">
        <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center bg-white">
          <FaUser className="text-[10px] text-slate-600" />
        </span>
        <span>{title}</span>
        <span className="text-[10px] font-normal text-slate-500">
          ({list.length})
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((u, idx) => (
          <span
            key={u?._id || `${title}-${u?.name || "unknown"}-${idx}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] border border-slate-200 rounded-full bg-white text-slate-800"
          >
            <FaUser className="text-[9px] text-slate-500" />
            {u?.name || "Unnamed"}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-6 sm:py-8">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Header Card (matches AllProjects style) */}
        <div className="bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 rounded-xl ">
          <div className="p-3 sm:p-4 space-y-3">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
              <FaProjectDiagram className="text-indigo-500" />
              <span className="uppercase tracking-[0.16em] text-slate-600">
                Project Overview
              </span>
              <span>/</span>
              <span className="font-semibold text-slate-900 max-w-xs truncate">
                {project.projectName}
              </span>
            </div>

            {/* Top Row: Left = project info, Right = summary badges */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              {/* Left: Project core details */}
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-indigo-600 truncate">
                    {project.projectName}
                  </h1>
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.16em] text-slate-500">
                    Project Details
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                  {project.description ||
                    "No description provided for this project."}
                </p>
                <div className="flex flex-wrap gap-4 text-[10px] sm:text-xs text-slate-700 mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-slate-700" />
                    <span className="text-slate-500">Start:</span>
                    <span className="font-medium">
                      {project.startDate
                        ? new Date(project.startDate).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaClock className="text-slate-700" />
                    <span className="text-slate-500">Deadline:</span>
                    <span className="font-medium">
                      {project.deadline
                        ? new Date(project.deadline).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaLaptopCode className="text-slate-700" />
                    <span className="text-slate-500">Domain:</span>
                    <span className="font-medium">{project.domain || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Right: Summary metrics (chips, in one row on wide screens) */}
              <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-2">
                <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100">
                    <FaFileAlt className="text-indigo-500 text-sm" />
                    <div className="flex flex-col leading-tight">
                      <span className="text-[8px] uppercase tracking-wide text-indigo-500 font-bold">
                        Total Scenarios
                      </span>
                      <span className="text-sm font-semibold text-indigo-900">
                        {totalScenarios}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
                    <FaCodeBranch className="text-emerald-500 text-sm" />
                    <div className="flex flex-col leading-tight">
                      <span className="text-[8px] uppercase tracking-wide text-emerald-500 font-bold">
                        Total Test Cases
                      </span>
                      <span className="text-sm font-semibold text-emerald-900">
                        {totalTestCases}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100">
                    <FaBug className="text-rose-500 text-sm" />
                    <div className="flex flex-col leading-tight">
                      <span className="text-[8px] uppercase tracking-wide text-rose-500 font-bold">
                        Total Defects
                      </span>
                      <span className="text-sm font-semibold text-rose-900">
                        {totalDefects}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Controls Toolbar */}
            <div className="pt-2 border-t border-slate-100 mt-1">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="text-[10px] sm:text-xs font-semibold tracking-wide text-slate-800 uppercase">
                  Project Controls
                </h2>
                <span className="text-[9px] sm:text-[10px] text-slate-500">
                  All key actions aligned in one toolbar
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* Scenarios */}
                <Link
                  to={`/single-project/${projectId}/add-scenario`}
                  className={baseBtn}
                >
                  <FaPlus className="text-[10px]" />
                  Add Scenario
                </Link>
                <Link
                  to={`/single-project/${projectId}/view-all-scenarios`}
                  className={baseBtn}
                >
                  <FaFolderOpen className="text-[10px]" />
                  View Scenarios
                </Link>

                {/* Test Cases */}
                <Link
                  to={`/single-project/${projectId}/all-test-cases`}
                  className={baseBtn}
                >
                  <FaFileAlt className="text-[10px]" />
                  View Test Cases
                </Link>

                {/* Defects & Bug Bucket */}
                {(normRole === "superadmin" ||
                  normRole === "admin" ||
                  normRole === "project_manager" ||
                  normRole === "qa_lead" ||
                  normRole === "test_lead" ||
                  normRole === "test_engineer" ||
                  normRole === "developer_lead" ||
                  normRole === "developer") && (
                  <>
                    <Link
                      to={`/single-project/${projectId}/add-defect`}
                      className={baseBtn}
                    >
                      <FaBug className="text-[10px]" />
                      Add Defect
                    </Link>
                    <Link
                      to={`/single-project/${projectId}/all-defects`}
                      className={baseBtn}
                    >
                      <FaBug className="text-[10px]" />
                      View Defects
                    </Link>
                    <Link
                      to={`/single-project/${projectId}/all-defects`}
                      className={baseBtn}
                    >
                      <FaBug className="text-[10px]" />
                      Bug Bucket
                    </Link>
                  </>
                )}

                {/* Dev-only: Assigned Defects */}
                {normRole === "developer" && developerId && (
                  <Link
                    to={`/single-project/${projectId}/developer/${developerId}/view-assigned-defects`}
                    className={baseBtn}
                  >
                    <FaBug className="text-[10px]" />
                    My Defects
                  </Link>
                )}

                {/* Traceability */}
                <Link
                  to={`/single-project/${projectId}/traceability-matrix`}
                  className={baseBtn}
                >
                  <FaChartBar className="text-[10px]" />
                  Traceability Matrix
                </Link>

                {/* Execute Test Cases */}
                {(normRole === "superadmin" ||
                  normRole === "admin" ||
                  normRole === "project_manager" ||
                  normRole === "developer_lead" ||
                  normRole === "qa_lead" ||
                  normRole === "test_engineer" ||
                  normRole === "test_lead") && (
                  <Link
                    to={`/single-project/${projectId}/test-case-execution`}
                    className={baseBtn}
                  >
                    <FaNetworkWired className="text-[10px]" />
                    Execute Test Cases
                  </Link>
                )}

                {/* Tasks */}
                {(normRole === "superadmin" ||
                  normRole === "admin" ||
                  normRole === "project_manager" ||
                  normRole === "developer_lead" ||
                  normRole === "qa_lead" ||
                  normRole === "test_lead") && (
                  <Link
                    to={`/projects/${projectId}/assign-task`}
                    className={baseBtn}
                  >
                    <FaTasks className="text-[10px]" />
                    Add Task
                  </Link>
                )}
                <Link to={taskLink} className={baseBtn}>
                  <FaFolderOpen className="text-[10px]" />
                  View Tasks
                </Link>

                {/* Requirements */}
                {canCreateRequirement && (
                  <Link
                    to={`/create-requirement/${projectId}`}
                    className={baseBtn}
                  >
                    <FaPlus className="text-[10px]" />
                    Create Requirement
                  </Link>
                )}
                <Link to={`/all-requirements/${projectId}`} className={baseBtn}>
                  <FaFolderOpen className="text-[10px]" />
                  View Requirements
                </Link>

                {/* ✅ NEW: Generate Report */}
                <Link
                  to={`/single-project/${projectId}/generate-report`}
                  className={baseBtn}
                >
                  <FaBusinessTime className="text-[10px]" />
                  Generate Report
                </Link>

                <Link to={`/all-reports`} className={baseBtn}>
                  <FaBusinessTime className="text-[10px]" />
                  View All Reports
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Users Involved (card aligned with overall style) */}
        <section className="mt-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-3 sm:px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-2">
              <h2 className="text-[11px] sm:text-xs font-semibold tracking-wide text-slate-800 uppercase flex items-center gap-1.5">
                <FaUsers className="text-indigo-500" />
                Users Involved
              </h2>
              <span className="text-[9px] sm:text-[10px] text-slate-500">
                Only roles with assigned users are listed
              </span>
            </div>

            <div className="px-3 sm:px-4 py-3">
              {roleBlocks.length === 0 ? (
                <p className="text-xs sm:text-sm text-slate-500">
                  No users mapped to this project yet.
                </p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {roleBlocks.map((rb) => (
                    <RoleRow key={rb.key} title={rb.key} list={rb.list} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SingleProject;
