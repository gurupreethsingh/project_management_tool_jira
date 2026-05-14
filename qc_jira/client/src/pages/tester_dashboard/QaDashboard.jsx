import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.REACT_APP_BACKEND_URL ||
  "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
};

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const QaDashboard = () => {
  const user = getUser();
  const userId = user?._id || user?.id;

  const [loading, setLoading] = useState(true);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [stats, setStats] = useState({
    assignedProjects: 0,
    totalTestCases: 0,
    totalDefects: 0,
    manual: 0,
    automation: 0,
    both: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQaLeadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        if (!userId) {
          setError("User not found. Please login again.");
          return;
        }

        const [projectCountRes, assignedProjectsRes] = await Promise.all([
          axios.get(
            `${API_BASE}/api/user-project-count/${userId}?role=qa_lead`,
            authHeaders(),
          ),
          axios.get(
            `${API_BASE}/api/user-assigned-projects/${userId}`,
            authHeaders(),
          ),
        ]);

        const projects =
          assignedProjectsRes?.data?.assignedProjects ||
          assignedProjectsRes?.data?.projects ||
          [];

        setAssignedProjects(projects);

        let totalTestCases = 0;
        let totalDefects = 0;
        let manual = 0;
        let automation = 0;
        let both = 0;

        await Promise.all(
          projects.map(async (project) => {
            const projectId = project?._id || project?.id;
            if (!projectId) return;

            try {
              const [tcCountRes, defectCountRes, executionTypeRes] =
                await Promise.all([
                  axios.get(
                    `${API_BASE}/api/projects/${projectId}/test-cases-count`,
                    authHeaders(),
                  ),
                  axios.get(
                    `${API_BASE}/api/single-project/${projectId}/defects-count`,
                    authHeaders(),
                  ),
                  axios.get(
                    `${API_BASE}/api/projects/${projectId}/test-cases-count-by-execution-type`,
                    authHeaders(),
                  ),
                ]);

              totalTestCases += Number(tcCountRes?.data?.totalTestCases || 0);
              totalDefects += Number(defectCountRes?.data?.totalDefects || 0);
              manual += Number(executionTypeRes?.data?.Manual || 0);
              automation += Number(executionTypeRes?.data?.Automation || 0);
              both += Number(executionTypeRes?.data?.Both || 0);
            } catch (innerErr) {
              console.error("Project stats fetch failed:", innerErr);
            }
          }),
        );

        setStats({
          assignedProjects:
            projectCountRes?.data?.assignedProjectsCount || projects.length,
          totalTestCases,
          totalDefects,
          manual,
          automation,
          both,
        });
      } catch (err) {
        console.error("QA Dashboard error:", err);
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to load QA Lead dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQaLeadDashboard();
  }, [userId]);

  const recentProjects = useMemo(() => {
    return [...assignedProjects].slice(0, 6);
  }, [assignedProjects]);

  const cards = [
    {
      title: "Assigned Projects",
      value: stats.assignedProjects,
      link: `/user-assigned-projects/${userId}`,
      linkText: "View Projects",
    },
    {
      title: "Total Test Cases",
      value: stats.totalTestCases,
      link: "/test-case-dashboard",
      linkText: "View Test Cases",
    },
    {
      title: "Total Defects",
      value: stats.totalDefects,
      link: "#",
      linkText: "View Defects",
    },
    {
      title: "Manual Test Cases",
      value: stats.manual,
      link: "/test-case-dashboard",
      linkText: "View Manual",
    },
    {
      title: "Automation Test Cases",
      value: stats.automation,
      link: "/test-case-dashboard",
      linkText: "View Automation",
    },
    {
      title: "Both Type Test Cases",
      value: stats.both,
      link: "/test-case-dashboard",
      linkText: "View Both",
    },
  ];

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-lg font-semibold text-gray-700">
              Loading QA Lead Dashboard...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen  px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto container space-y-8">
        <div className="rounded-3xl  p-8  shadow">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                QA Lead Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Welcome, {user?.name || "QA Lead"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6  md:text-base">
                Manage assigned projects, scenarios, test cases, defects,
                traceability matrix, and QA execution activities from one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/all-projects"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow hover:bg-slate-100"
              >
                All Projects
              </Link>

              {userId && (
                <Link
                  to={`/user-assigned-projects/${userId}`}
                  className="rounded-xl shadow px-5 py-3 text-sm font-semibold text-blue-600 hover:bg-white/10 bg-white"
                >
                  My Assigned Projects
                </Link>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    {card.title}
                  </p>
                  <h2 className="mt-3 text-4xl font-bold text-gray-900">
                    {card.value}
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl font-bold text-blue-700">
                  {String(card.title).charAt(0)}
                </div>
              </div>

              {card.link !== "#" ? (
                <Link
                  to={card.link}
                  className="mt-6 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  {card.linkText} →
                </Link>
              ) : (
                <span className="mt-6 inline-flex text-sm font-semibold text-gray-400">
                  {card.linkText}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Assigned Projects
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Projects assigned to the QA Lead role.
                </p>
              </div>

              {userId && (
                <Link
                  to={`/user-assigned-projects/${userId}`}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  View All
                </Link>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-2">Project</th>
                    <th className="px-4 py-2">Domain</th>
                    <th className="px-4 py-2">Deadline</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {recentProjects.length > 0 ? (
                    recentProjects.map((project) => {
                      const projectId = project?._id || project?.id;

                      return (
                        <tr
                          key={projectId}
                          className="rounded-2xl bg-gray-50 text-sm"
                        >
                          <td className="rounded-l-2xl px-4 py-4 font-semibold text-gray-900">
                            {project?.project_name ||
                              project?.projectName ||
                              "Untitled Project"}
                          </td>
                          <td className="px-4 py-4 text-gray-600">
                            {project?.domain || "N/A"}
                          </td>
                          <td className="px-4 py-4 text-gray-600">
                            {project?.deadline
                              ? new Date(project.deadline).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="rounded-r-2xl px-4 py-4">
                            <Link
                              to={`/single-project/${projectId}`}
                              className="font-semibold text-blue-700 hover:text-blue-900"
                            >
                              Open
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="rounded-2xl bg-gray-50 px-4 py-8 text-center text-sm font-medium text-gray-500"
                      >
                        No assigned projects found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <p className="mt-1 text-sm text-gray-500">
              Common QA Lead activities.
            </p>

            <div className="mt-6 space-y-3">
              <Link
                to="/all-projects"
                className="block rounded-2xl bg-gray-50 px-4 py-4 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-800"
              >
                View All Projects
              </Link>

              {userId && (
                <Link
                  to={`/user-assigned-projects/${userId}`}
                  className="block rounded-2xl bg-gray-50 px-4 py-4 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-800"
                >
                  View Assigned Projects
                </Link>
              )}

              <Link
                to="/test-case-dashboard"
                className="block rounded-2xl bg-gray-50 px-4 py-4 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-800"
              >
                Test Case Dashboard
              </Link>

              <Link
                to="/all-reports"
                className="block rounded-2xl bg-gray-50 px-4 py-4 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-800"
              >
                View Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QaDashboard;
