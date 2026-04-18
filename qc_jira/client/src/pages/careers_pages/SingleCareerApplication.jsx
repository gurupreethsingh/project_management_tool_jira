"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaTrash,
  FaTimesCircle,
  FaUserTie,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";
import {
  CareerHero,
  InfoBlock,
  LongTextBlock,
  PageSkeletonGrid,
} from "../../components/careers_components/CareersShared";

const CAREERS_API = `${globalBackendRoute}/api/careers`;

function getAuthHeaders() {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("userToken") ||
    "";

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

function FormInput({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-700 outline-none focus:border-slate-400 ${className}`}
    />
  );
}

function FormTextArea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      rows={4}
      className={`w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-700 outline-none resize-none focus:border-slate-400 ${className}`}
    />
  );
}

const SingleCareerApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [joiningOrStartDate, setJoiningOrStartDate] = useState("");
  const [commitmentNotes, setCommitmentNotes] = useState("");

  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  useEffect(() => {
    if (String(user?.role || "").toLowerCase() !== "superadmin") {
      navigate("/home");
    }
  }, [user, navigate]);

  const fetchApplication = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${CAREERS_API}/admin/single-application/${id}`,
        getAuthHeaders(),
      );

      const data = response.data;
      setItem(data);
      setStatus(data?.status || "applied");
      setStatusReason(data?.statusReason || "");
      setAdminNotes(data?.adminNotes || "");
      setJoiningOrStartDate(
        data?.availableFrom ? String(data.availableFrom).slice(0, 10) : "",
      );
      setCommitmentNotes(data?.adminNotes || "");
    } catch (err) {
      console.error("Error fetching application:", err);
      alert("Could not load career application.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const updateStatus = useCallback(async () => {
    try {
      await axios.patch(
        `${CAREERS_API}/admin/update-application-status/${id}`,
        {
          status,
          statusReason,
          adminNotes: `${adminNotes}\n\nJoining/Start Date: ${
            joiningOrStartDate || "N/A"
          }\nCommitment Notes: ${commitmentNotes || "N/A"}`,
        },
        getAuthHeaders(),
      );

      alert("Application updated successfully.");
      fetchApplication();
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err?.response?.data?.message || "Failed to update application.");
    }
  }, [
    id,
    status,
    statusReason,
    adminNotes,
    joiningOrStartDate,
    commitmentNotes,
    fetchApplication,
  ]);

  const deleteApplication = useCallback(async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this career application?",
    );
    if (!confirmed) return;

    try {
      await axios.delete(
        `${CAREERS_API}/admin/delete-application/${id}`,
        getAuthHeaders(),
      );
      alert("Application deleted successfully.");
      navigate("/all-career-applications");
    } catch (err) {
      console.error("Error deleting application:", err);
      alert("Failed to delete application.");
    }
  }, [id, navigate]);

  const sendEmail = useCallback(async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      alert("Subject and message are required.");
      return;
    }

    try {
      await axios.post(
        `${CAREERS_API}/admin/send-email-to-selected`,
        {
          ids: [id],
          subject: emailSubject,
          message: emailMessage,
        },
        getAuthHeaders(),
      );

      alert("Email sent successfully.");
      setEmailSubject("");
      setEmailMessage("");
      fetchApplication();
    } catch (err) {
      console.error("Error sending email:", err);
      alert("Failed to send email.");
    }
  }, [id, emailSubject, emailMessage, fetchApplication]);

  if (loading) {
    return (
      <div className="service-page-wrap min-h-screen bg-slate-50">
        <main className="service-main-wrap">
          <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
            <PageSkeletonGrid count={3} columns="grid-cols-1" />
          </div>
        </main>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="service-page-wrap min-h-screen bg-slate-50">
      <CareerHero
        title={
          <>
            Review this{" "}
            <span className="service-hero-title-highlight">
              career application
            </span>
          </>
        }
        subtitle={`Manage status, notes, dates, and optional email communication for ${
          item?.fullName || item?.firstName
        }.`}
        statCards={[
          {
            label: "Candidate",
            value: item?.fullName || item?.firstName || "N/A",
          },
          { label: "Status", value: item?.status || "N/A" },
          { label: "Type", value: item?.opportunityTypeSnapshot || "N/A" },
          {
            label: "Experience",
            value: `${item?.totalExperienceYears || 0}y`,
          },
        ]}
      />

      <main className="service-main-wrap">
        <div className="container mx-auto space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate("/all-career-applications")}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-extrabold text-slate-700"
            >
              <FaArrowLeft />
              Back
            </button>

            <button
              type="button"
              onClick={deleteApplication}
              className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-[13px] font-extrabold text-rose-700"
            >
              <FaTrash />
              Delete Application
            </button>
          </div>

          <section className="grid items-start gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1.45fr),minmax(0,1fr)]">
            <div className="space-y-5">
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="service-badge-heading">Applicant overview</p>
                <h2 className="mt-2 text-[24px] font-black text-slate-900 sm:text-[30px]">
                  {item?.fullName ||
                    `${item?.firstName || ""} ${item?.lastName || ""}`}
                </h2>
                <p className="mt-2 service-paragraph">
                  Applied for {item?.opportunityTitleSnapshot}
                </p>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InfoBlock label="Email" value={item?.email} />
                  <InfoBlock label="Phone" value={item?.phone} />
                  <InfoBlock label="City" value={item?.city} />
                  <InfoBlock label="Country" value={item?.country} />
                  <InfoBlock
                    label="Experience"
                    value={`${item?.totalExperienceYears || 0} years`}
                  />
                  <InfoBlock
                    label="Current Company"
                    value={item?.currentCompany}
                  />
                  <InfoBlock label="Current Role" value={item?.currentRole} />
                  <InfoBlock
                    label="Qualification"
                    value={item?.highestQualification}
                  />
                  <InfoBlock label="College" value={item?.collegeName} />
                  <InfoBlock
                    label="Graduation Year"
                    value={item?.graduationYear}
                  />
                  <InfoBlock
                    label="Expected Salary / Stipend"
                    value={item?.expectedSalaryOrStipend}
                  />
                  <InfoBlock
                    label="Notice Period (Days)"
                    value={item?.noticePeriodDays}
                  />
                  <InfoBlock
                    label="Applied On"
                    value={
                      item?.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "N/A"
                    }
                  />
                  <InfoBlock
                    label="Application Type"
                    value={item?.opportunityTypeSnapshot}
                  />
                </div>
              </section>

              {!!item?.skills?.length && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h3 className="service-badge-heading">Skills</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold text-orange-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <LongTextBlock title="Cover Letter" value={item?.coverLetter} />
              <LongTextBlock
                title="Why Should We Hire You?"
                value={item?.whyShouldWeHireYou}
              />
              <LongTextBlock title="Admin Notes" value={item?.adminNotes} />
            </div>

            <div className="space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="service-badge-heading">Update application</h3>

                <div className="mt-4 space-y-3">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-700 outline-none"
                  >
                    <option value="applied">Applied</option>
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview_scheduled">
                      Interview Scheduled
                    </option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="delayed">Delayed</option>
                  </select>

                  <FormInput
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    placeholder="Status Reason"
                  />

                  <FormInput
                    type="date"
                    value={joiningOrStartDate}
                    onChange={(e) => setJoiningOrStartDate(e.target.value)}
                  />

                  <FormTextArea
                    rows={4}
                    value={commitmentNotes}
                    onChange={(e) => setCommitmentNotes(e.target.value)}
                    placeholder="Internship commitment / joining notes"
                  />

                  <FormTextArea
                    rows={4}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Admin Notes"
                  />

                  <button
                    type="button"
                    onClick={updateStatus}
                    className="w-full rounded-2xl bg-slate-900 py-3 text-[13px] font-extrabold text-white"
                  >
                    Save Updates
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus("accepted")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 py-3 text-[12px] font-extrabold text-emerald-700"
                  >
                    <FaCheckCircle />
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("rejected")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-50 py-3 text-[12px] font-extrabold text-rose-700"
                  >
                    <FaTimesCircle />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("delayed")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-50 py-3 text-[12px] font-extrabold text-amber-700"
                  >
                    <FaClock />
                    Delay
                  </button>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="service-badge-heading">
                  Send email to candidate
                </h3>
                <p className="mt-2 service-small-paragraph">
                  Optional: send acceptance, rejection, delay, or interview
                  communication.
                </p>

                <div className="mt-4 space-y-3">
                  <FormInput
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Email Subject"
                  />
                  <FormTextArea
                    rows={6}
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Email Message"
                  />
                  <button
                    type="button"
                    onClick={sendEmail}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-[13px] font-extrabold text-white"
                  >
                    <FaEnvelope />
                    Send Email
                  </button>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="service-badge-heading">Opportunity snapshot</h3>
                <div className="mt-4 space-y-3 text-[13px] font-semibold text-slate-600">
                  <div className="flex items-center gap-2">
                    <FaUserTie className="text-slate-900" />
                    <span>{item?.opportunityTitleSnapshot}</span>
                  </div>
                  <div>Type: {item?.opportunityTypeSnapshot}</div>
                  <div>Application Source: {item?.applicationSource}</div>
                  <div>
                    Reviewed At:{" "}
                    {item?.reviewedAt
                      ? new Date(item.reviewedAt).toLocaleString()
                      : "Not reviewed yet"}
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default memo(SingleCareerApplication);
