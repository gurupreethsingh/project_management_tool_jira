import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaFileSignature, FaAlignLeft, FaPlus, FaTrash, FaArrowLeft } from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const emptyStep = (n) => ({
  step_number: n,
  action_description: "",
  input_data: "",
  expected_result: "",
  actual_result: "",
  status: "Pending",
  remark: "",
});

export default function UpdateTestCase() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [reviewUsers, setReviewUsers] = useState([]);
  const [approverUsers, setApproverUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [locks, setLocks] = useState({ canEditStatus: true, isLockedByApproval: false });

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

  const token = useMemo(() => localStorage.getItem("token"), []);
  const authHeaders = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

  const refetchHistory = async () => {
    try {
      const histRes = await axios.get(`${globalBackendRoute}/api/test-case/${id}/history`, { headers: authHeaders });
      setHistory(Array.isArray(histRes.data?.history) ? histRes.data.history : []);
    } catch {}
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      if (!token) {
        setError("You are not authorized. Please log in.");
        setLoading(false);
        return;
      }

      const [tcRes, reviewersRes, approversRes, histRes] = await Promise.all([
        axios.get(`${globalBackendRoute}/api/get-test-case/${id}`, { headers: authHeaders }),
        axios.get(`${globalBackendRoute}/api/users/reviewers`, { headers: authHeaders }),
        axios.get(`${globalBackendRoute}/api/users/approvers`, { headers: authHeaders }),
        axios.get(`${globalBackendRoute}/api/test-case/${id}/history`, { headers: authHeaders }),
      ]);

      const data = tcRes.data;
      const steps =
        Array.isArray(data.testing_steps) && data.testing_steps.length
          ? data.testing_steps.map((s, i) => {
              const raw = String(s?.status || "").trim().toLowerCase();
              const status = raw === "fail" ? "Fail" : raw === "pass" ? "Pass" : "Pending";
              return {
                step_number: i + 1,
                action_description: s.action_description || "",
                input_data: s.input_data || "",
                expected_result: s.expected_result || "",
                actual_result: s.actual_result || "",
                status,
                remark: s.remark || "",
              };
            })
          : [emptyStep(1)];

      setLocks({
        canEditStatus: Boolean(tcRes.data?.__locks?.canEditStatus ?? true),
        isLockedByApproval: Boolean(tcRes.data?.__locks?.isLockedByApproval ?? false),
      });

      setTestCase((prev) => ({
        ...prev,
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
        test_execution_type: data.test_execution_type || "Manual",
        footer: {
          author: data.footer?.author || "",
          reviewed_by: data.footer?.reviewed_by || "",
          approved_by: data.footer?.approved_by || "",
          approved_date: data.footer?.approved_date || "",
        },
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
      }));

      setReviewUsers(Array.isArray(reviewersRes.data) ? reviewersRes.data : []);
      setApproverUsers(Array.isArray(approversRes.data) ? approversRes.data : []);
      setHistory(Array.isArray(histRes.data?.history) ? histRes.data.history : []);
    } catch (err) {
      console.error("UpdateTestCase load error:", err?.response?.data || err);
      setError(err?.response?.data?.message || "Failed to load test case or dropdown users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const statusFromSteps = useMemo(() => {
    const steps = Array.isArray(testCase.testing_steps) ? testCase.testing_steps : [];
    if (!steps.length) return "Pending";
    const hasFail = steps.some((s) => String(s?.status || "").toLowerCase() === "fail");
    if (hasFail) return "Fail";
    const hasPending = steps.some((s) => String(s?.status || "").toLowerCase() === "pending");
    return hasPending ? "Pending" : "Pass";
  }, [testCase.testing_steps]);

  const approvedDateValue =
    testCase.footer.approved_date && String(testCase.footer.approved_date).includes("T")
      ? String(testCase.footer.approved_date).split("T")[0]
      : testCase.footer.approved_date || "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("footer.")) {
      const key = name.split(".")[1];
      setTestCase((prev) => ({ ...prev, footer: { ...prev.footer, [key]: value } }));
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
      const next = [...prev.testing_steps, emptyStep(prev.testing_steps.length + 1)];
      return { ...prev, testing_steps: next };
    });
  };

  const removeTestingStep = (index) => {
    setTestCase((prev) => {
      const next = prev.testing_steps.filter((_, i) => i !== index);
      const renumbered = next.length ? next.map((s, i) => ({ ...s, step_number: i + 1 })) : [emptyStep(1)];
      return { ...prev, testing_steps: renumbered };
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!token) {
        setError("You are not authorized. Please log in.");
        setSaving(false);
        return;
      }

      const payload = {
        ...testCase,
        testing_steps: testCase.testing_steps.map((s, i) => {
          const raw = String(s.status || "").trim().toLowerCase();
          const status = raw === "fail" ? "Fail" : raw === "pass" ? "Pass" : "Pending";
          return {
            step_number: i + 1,
            action_description: s.action_description || "",
            input_data: s.input_data || "",
            expected_result: s.expected_result || "",
            actual_result: s.actual_result || "",
            status,
            remark: s.remark || "",
          };
        }),
        footer: {
          ...testCase.footer,
          approved_date: approvedDateValue || "",
        },
        test_execution_type: testCase.test_execution_type || "Manual",
      };

      await axios.put(`${globalBackendRoute}/api/update-test-case/${id}`, payload, { headers: authHeaders });

      alert("Test case details updated successfully.");
      await refetchHistory();
      const res = await axios.get(`${globalBackendRoute}/api/get-test-case/${id}`, { headers: authHeaders });
      setLocks({
        canEditStatus: Boolean(res.data?.__locks?.canEditStatus ?? true),
        isLockedByApproval: Boolean(res.data?.__locks?.isLockedByApproval ?? false),
      });
    } catch (err) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        (status === 403
          ? "Step statuses are locked after approval. Only authorized users can modify them."
          : "Failed to update test case.");

      setError(msg);

      if (status === 403) {
        try {
          const res = await axios.get(`${globalBackendRoute}/api/get-test-case/${id}`, { headers: authHeaders });
          const data = res.data || {};
          const steps =
            Array.isArray(data.testing_steps) && data.testing_steps.length
              ? data.testing_steps.map((s, i) => ({
                  step_number: i + 1,
                  action_description: s.action_description || "",
                  input_data: s.input_data || "",
                  expected_result: s.expected_result || "",
                  actual_result: s.actual_result || "",
                  status:
                    String(s?.status || "").toLowerCase() === "fail"
                      ? "Fail"
                      : String(s?.status || "").toLowerCase() === "pass"
                      ? "Pass"
                      : "Pending",
                  remark: s.remark || "",
                }))
              : [emptyStep(1)];

          setLocks({
            canEditStatus: Boolean(res.data?.__locks?.canEditStatus ?? true),
            isLockedByApproval: Boolean(res.data?.__locks?.isLockedByApproval ?? false),
          });

          setTestCase((prev) => ({
            ...prev,
            testing_steps: steps,
            footer: {
              author: data.footer?.author || "",
              reviewed_by: data.footer?.reviewed_by || "",
              approved_by: data.footer?.approved_by || "",
              approved_date: data.footer?.approved_date || "",
            },
          }));
        } catch {}
      }
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

  const approvedBySelected = Boolean(String(testCase.footer.approved_by || "").trim());

  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
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
                  "inline-flex items-center rounded-full px-2 py-0.5 font-semibold border",
                  (() => {
                    const steps = testCase.testing_steps || [];
                    const hasFail = steps.some((s) => String(s?.status || "").toLowerCase() === "fail");
                    const hasPending = steps.some((s) => String(s?.status || "").toLowerCase() === "pending");
                    if (hasFail) return "border-rose-200 bg-rose-50 text-rose-700";
                    if (hasPending) return "border-slate-200 bg-slate-50 text-slate-700";
                    return "border-emerald-200 bg-emerald-50 text-emerald-700";
                  })(),
                ].join(" ")}
              >
                {(() => {
                  const steps = testCase.testing_steps || [];
                  const hasFail = steps.some((s) => String(s?.status || "").toLowerCase() === "fail");
                  const hasPending = steps.some((s) => String(s?.status || "").toLowerCase() === "pending");
                  if (hasFail) return "Fail";
                  if (hasPending) return "Pending";
                  return "Pass";
                })()}
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

            <Link to={`/test-case-detail/${testCase._id}`} className="px-3 py-1.5 bg-slate-800 text-white rounded-md hover:bg-black text-sm">
              View Test Case
            </Link>
            {testCase.project_id && (
              <a href={`/single-project/${testCase.project_id}`} className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm">
                Project Dashboard
              </a>
            )}
          </div>
        </div>

        {/* With the new backend, test_engineer will normally NOT see this locked banner after approval */}
        {locks.isLockedByApproval && (
          <div className="mb-4 rounded-md bg-amber-50 border border-amber-200 p-3 text-amber-800 text-sm">
            <b>Status locked:</b> This test case is approved. Only authorized users can change step statuses.
          </div>
        )}

        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700 text-sm">{error}</div>}

        <form onSubmit={handleUpdate} className="space-y-8">
          <section>
            <h3 className="text-xs font-semibold text-slate-700 mb-2">Project & Scenario</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {["project_id", "project_name", "scenario_id", "scenario_number"].map((field) => (
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
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-slate-700 mb-2">Test Case Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {["test_case_name", "requirement_number", "build_name_or_number", "module_name"].map((field) => (
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
                  <label className="text-[11px] font-medium text-slate-700">{field.replace(/_/g, " ").toUpperCase()}</label>
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
              <div>
                <label className="text-[11px] font-medium text-slate-700">Severity</label>
                <select
                  className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                  name="severity"
                  value={testCase.severity || "Medium"}
                  onChange={handleChange}
                  required
                >
                  {["Low", "Medium", "Major", "Critical", "Blocker"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700">Test Case Type</label>
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
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700">Test Execution Type</label>
                <select
                  className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                  name="test_execution_type"
                  value={testCase.test_execution_type || "Manual"}
                  onChange={handleChange}
                  required
                >
                  {["Manual", "Automation", "Both"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700">Test Execution Time</label>
                <input
                  type="text"
                  className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                  name="test_execution_time"
                  value={testCase.test_execution_time || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-1 md:col-span-4">
                <label className="text-[11px] font-medium text-slate-700">Brief Description</label>
                <textarea
                  className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                  name="brief_description"
                  value={testCase.brief_description || ""}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Write a brief description of the test case..."
                  required
                />
              </div>
            </div>
          </section>

          {/* Steps */}
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
                disabled={!locks.canEditStatus}
                title={!locks.canEditStatus ? "Statuses locked after approval" : "Add step"}
              >
                <FaPlus className="mr-1" />
                Add Step
              </button>
            </div>

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

              {testCase.testing_steps.map((step, index) => (
                <div
                  key={`step-${index}`}
                  className="
                    grid items-start gap-2 px-3 py-2 border-t border-slate-200
                    min-w-[1480px]
                    grid-cols-[80px,300px,200px,220px,220px,140px,260px,120px]
                  "
                >
                  <div>
                    <label className="sr-only">Step #</label>
                    <input
                      type="text"
                      readOnly
                      value={step.step_number}
                      className="h-9 block w-full rounded-md border border-slate-200 px-2 text-sm bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="sr-only">Action Description</label>
                    <textarea
                      placeholder="Action Description"
                      className="block w-full rounded-md border border-slate-200 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600 resize-y"
                      name={`testing_steps.${index}.action_description`}
                      value={step.action_description}
                      onChange={handleChange}
                      rows={2}
                      required
                    />
                  </div>

                  <div>
                    <label className="sr-only">Input Data</label>
                    <textarea
                      placeholder="Input Data"
                      className="block w-full rounded-md border border-slate-200 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600 resize-y"
                      name={`testing_steps.${index}.input_data`}
                      value={step.input_data}
                      onChange={handleChange}
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="sr-only">Expected Result</label>
                    <textarea
                      placeholder="Expected Result"
                      className="block w-full rounded-md border border-slate-200 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600 resize-y"
                      name={`testing_steps.${index}.expected_result`}
                      value={step.expected_result}
                      onChange={handleChange}
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="sr-only">Actual Result</label>
                    <textarea
                      placeholder="Actual Result"
                      className="block w-full rounded-md border border-slate-200 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600 resize-y"
                      name={`testing_steps.${index}.actual_result`}
                      value={step.actual_result}
                      onChange={handleChange}
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="sr-only">Status</label>
                    <select
                      className="h-9 block w-full rounded-md border border-slate-200 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600 disabled:opacity-60"
                      name={`testing_steps.${index}.status`}
                      value={step.status}
                      onChange={handleChange}
                      disabled={!locks.canEditStatus}
                      title={!locks.canEditStatus ? "Statuses locked after approval" : ""}
                    >
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  <div>
                    <label className="sr-only">Remark</label>
                    <textarea
                      placeholder="Remark"
                      className="block w-full rounded-md border border-slate-200 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600 resize-y"
                      name={`testing_steps.${index}.remark`}
                      value={step.remark}
                      onChange={handleChange}
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center justify-end">
                    {testCase.testing_steps.length > 1 && (
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-rose-600 text-white rounded-md hover:bg-rose-700 text-sm inline-flex items-center disabled:opacity-60"
                        onClick={() => removeTestingStep(index)}
                        title="Delete Step"
                        disabled={!locks.canEditStatus}
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

          <section>
            <h3 className="text-xs font-semibold text-slate-700 mb-2">Footer</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-700">Author</label>
                <input
                  type="text"
                  className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                  name="footer.author"
                  value={testCase.footer.author || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700">Reviewed By</label>
                <select
                  className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                  name="footer.reviewed_by"
                  value={testCase.footer.reviewed_by || ""}
                  onChange={handleChange}
                >
                  <option value="">— Select Reviewer —</option>
                  {reviewUsers.map((u) => (
                    <option key={u._id} value={u.name}>
                      {u.name} {u.role ? `(${u.role})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700">Approved By</label>
                <select
                  className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600"
                  name="footer.approved_by"
                  value={testCase.footer.approved_by || ""}
                  onChange={handleChange}
                >
                  <option value="">— Select Approver —</option>
                  {approverUsers.map((u) => (
                    <option key={u._id} value={u.name}>
                      {u.name} {u.role ? `(${u.role})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700">Approved Date</label>
                <input
                  type="date"
                  className="block w-full rounded-md border border-slate-200 py-1.5 px-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-600 disabled:opacity-60"
                  name="footer.approved_date"
                  value={approvedDateValue}
                  onChange={handleChange}
                  disabled={!approvedBySelected}
                  title={!approvedBySelected ? "Select 'Approved By' first" : ""}
                />
              </div>
            </div>
          </section>

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

        <div className="mt-8 bg-white rounded-lg shadow border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Test Case History</h3>
          {history.length === 0 ? (
            <p className="text-[13px] text-slate-600">No changes recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {history.map((h, i) => (
                <div key={i} className="border border-slate-100 rounded-md p-3">
                  <div className="text-[12px] text-slate-600 mb-1">
                    <span className="font-medium text-indigo-700">{h.by}</span>
                    {h.role ? <span className="ml-1 text-slate-500">({h.role})</span> : null}
                    <span className="mx-2">·</span>
                    <span>{h.at ? new Date(h.at).toLocaleString() : ""}</span>
                  </div>
                  <ul className="list-disc pl-5 text-[13px] text-slate-800">
                    {(h.items || []).map((it, idx) => (
                      <li
                        key={idx}
                        dangerouslySetInnerHTML={{
                          __html: it.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"),
                        }}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
