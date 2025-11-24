import React, { useMemo, useState, useRef } from "react";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaClock,
  FaGlobe,
  FaSearch,
  FaUserTie,
  FaLaptopCode,
  FaFlask,
  FaShieldAlt,
  FaHeart,
  FaBook,
  FaHome,
  FaCalendarAlt,
  FaBaby,
  FaChartLine,
  FaFileUpload,
} from "react-icons/fa";
import { SiReact, SiJavascript, SiMongodb, SiNodedotjs } from "react-icons/si";
import globalBackendRoute from "../../config/Config";

const JOBS = [
  {
    id: "fs-001",
    title: "Software Engineer — Full Stack (MERN)",
    dept: "Engineering",
    type: "Job",
    mode: "Full-time",
    location: "Bengaluru, India",
    remote: true,
    experience: "1–3 years",
    salary: "₹8–14 LPA",
    tags: ["React", "Node", "MongoDB", "REST"],
    posted: "2025-10-15",
    summary:
      "Build and ship features across our learning & e-commerce platforms with a focus on performance and reliability.",
  },
  {
    id: "ux-003",
    title: "Product Designer — UI/UX",
    dept: "Design",
    type: "Job",
    mode: "Full-time",
    location: "Hybrid — Bengaluru",
    remote: false,
    experience: "0–2 years",
    salary: "₹6–10 LPA",
    tags: ["Figma", "Design systems", "Accessibility"],
    posted: "2025-10-20",
    summary:
      "Own end-to-end product design: research, flows, prototypes, and thoughtful handoff.",
  },
  {
    id: "qa-005",
    title: "QA Automation Engineer",
    dept: "Quality Assurance",
    type: "Job",
    mode: "Full-time",
    location: "Remote (India)",
    remote: true,
    experience: "1–3 years",
    salary: "₹7–12 LPA",
    tags: ["Selenium", "TestNG", "POM", "CI/CD"],
    posted: "2025-11-01",
    summary:
      "Design robust test frameworks, expand coverage, and champion quality in quick iterations.",
  },
  {
    id: "ml-010",
    title: "Machine Learning Intern (NLP)",
    dept: "AI/ML",
    type: "Internship",
    mode: "Internship",
    location: "Remote",
    remote: true,
    experience: "Internship",
    salary: "Stipend",
    tags: ["Python", "Pandas", "Transformers"],
    posted: "2025-09-28",
    summary:
      "Help build data pipelines and prototypes for personalization and recommendations.",
  },
];

const TYPES = ["All", "Job", "Internship"];
const LOCATIONS = [
  "All",
  "Remote",
  "Bengaluru, India",
  "Hybrid — Bengaluru",
  "Remote (India)",
];
const EXPERIENCES = [
  "All",
  "Internship",
  "0–2 years",
  "1–3 years",
  "3–5 years",
  "5+ years",
];

export default function Careers() {
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [loc, setLoc] = useState("All");
  const [exp, setExp] = useState("All");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [view, setView] = useState("grid");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [files, setFiles] = useState([]);

  const rolesRef = useRef(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    applyType: "internship", // "internship" | "job"
    desiredRole: "",
    experienceLevel: "",
    preferredLocation: "",
    portfolioUrl: "",
    linkedinUrl: "",
    aboutYou: "",
  });

  const filtered = useMemo(() => {
    return JOBS.filter((j) => {
      const textHit =
        !q ||
        [j.title, j.summary, j.dept, j.location, j.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase());

      const typeHit = typeFilter === "All" || j.type === typeFilter;
      const locHit =
        loc === "All" ||
        (loc === "Remote"
          ? j.remote
          : j.location.toLowerCase() === loc.toLowerCase());
      const expHit = exp === "All" || j.experience === exp;
      const remoteHit = !remoteOnly || j.remote;

      return textHit && typeHit && locHit && expHit && remoteHit;
    });
  }, [q, typeFilter, loc, exp, remoteOnly]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilesChange = (e) => {
    const filesArr = Array.from(e.target.files || []);
    setFiles(filesArr);
  };

  const scrollToRoles = () => {
    if (rolesRef.current) {
      rolesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitMessage(null);

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        fd.append(k, v || "");
      });
      files.forEach((file) => {
        fd.append("files", file);
      });

      const res = await axios.post(
        `${globalBackendRoute}/api/careers/apply`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 201 || res.data?.status === true) {
        setSubmitMessage(
          "Application submitted! You’ll receive a confirmation email shortly."
        );
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          applyType: "internship",
          desiredRole: "",
          experienceLevel: "",
          preferredLocation: "",
          portfolioUrl: "",
          linkedinUrl: "",
          aboutYou: "",
        });
        setFiles([]);
      } else {
        setSubmitError("Could not submit application. Please try again.");
      }
    } catch (err) {
      console.error("Careers apply error:", err);
      setSubmitError(
        "There was an error submitting your application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
        <div className="absolute top-[-90px] left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[110px] opacity-80" />

        <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1.1fr)] gap-10 items-center">
            <div>
              <p className="text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-slate-500">
                CAREERS · INTERNSHIPS · ENGINEERING · DESIGN
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-slate-900">
                Build your career with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  Ecoders
                </span>
              </h1>
              <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Whether you&apos;re exploring your first internship or your next
                role in engineering, QA or AI — we focus on real projects,
                mentorship and calm, product-first work.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-xs sm:text-sm">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
                  <FaLaptopCode className="text-indigo-500" />
                  <span>Hands-on project experience</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
                  <FaBook className="text-emerald-500" />
                  <span>Structured mentoring & reviews</span>
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-xs sm:text-sm">
                <Stat label="Internships / year" value="20+" />
                <Stat label="Tech stack" value="MERN · AI · QA" />
                <Stat label="Remote friendly" value="Yes" />
              </div>

              {/* Hero CTAs */}
              <div className="mt-7 flex flex-wrap gap-3 text-xs sm:text-sm">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 py-2.5 font-medium text-white shadow-md hover:shadow-lg hover:brightness-110"
                >
                  Apply for Internship / Job
                </button>
                <button
                  type="button"
                  onClick={scrollToRoles}
                  className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-medium text-slate-800 hover:bg-slate-50"
                >
                  View Open Roles
                </button>
              </div>
            </div>

            {/* Right: Internship pitch */}
            <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl p-6 sm:p-7 lg:p-8">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                Internship @ Ecoders — why it&apos;s different
              </h2>
              <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-700">
                <li>
                  • You work on <b>real codebases</b> – our learning platform,
                  QA dashboards, internal tools.
                </li>
                <li>
                  • Weekly <b>1:1 mentorship</b> with seniors (code reviews,
                  design walkthroughs, career guidance).
                </li>
                <li>
                  • Exposure to{" "}
                  <b>AI systems, automation, and project management</b> in
                  production.
                </li>
                <li>
                  • Strong <b>placement assistance</b> for standout interns.
                </li>
              </ul>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <HighlightCard
                  icon={<SiReact className="text-[#61DAFB]" />}
                  title="MERN stack"
                  desc="React, Node.js, MongoDB, REST."
                />
                <HighlightCard
                  icon={<SiJavascript className="text-[#F7DF1E]" />}
                  title="Clean JS"
                  desc="Modern patterns & best practices."
                />
                <HighlightCard
                  icon={<SiMongodb className="text-[#47A248]" />}
                  title="Data modelling"
                  desc="Schemas, queries, indexing."
                />
                <HighlightCard
                  icon={<SiNodedotjs className="text-[#3C873A]" />}
                  title="Services & APIs"
                  desc="Express, routes, controllers."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER + OPEN ROLES */}
      <section ref={rolesRef} className="py-10 sm:py-12 lg:py-14 bg-white">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Open roles — internships & jobs
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-xl">
                Start by searching for a role that fits you, or just scroll down
                to apply directly.
              </p>
            </div>
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center self-start rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2.5 text-xs sm:text-sm font-medium text-white shadow-md hover:shadow-lg hover:brightness-110"
            >
              Apply without picking a role
            </button>
          </div>

          {/* Filters */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 shadow-sm p-4 sm:p-5 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              {/* Search */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  <span className="inline-flex items-center gap-1">
                    <FaSearch className="text-indigo-500" /> Search roles
                  </span>
                </label>
                <div className="flex rounded-xl border border-indigo-400 bg-white px-3 py-2 items-center gap-2 shadow-sm">
                  <FaSearch className="text-indigo-500" />
                  <input
                    className="w-full text-sm outline-none bg-transparent"
                    placeholder="Search by role, skill, or keyword…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  <span className="inline-flex items-center gap-1">
                    <FaBriefcase className="text-purple-500" /> Type
                  </span>
                </label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  {TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  <span className="inline-flex items-center gap-1">
                    <FaMapMarkerAlt className="text-emerald-500" /> Location
                  </span>
                </label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={loc}
                  onChange={(e) => setLoc(e.target.value)}
                >
                  {LOCATIONS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  <span className="inline-flex items-center gap-1">
                    <FaClock className="text-orange-400" /> Experience
                  </span>
                </label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={exp}
                  onChange={(e) => setExp(e.target.value)}
                >
                  {EXPERIENCES.map((eOpt) => (
                    <option key={eOpt}>{eOpt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRemoteOnly((r) => !r)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${
                    remoteOnly
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <FaGlobe className="text-emerald-500" />
                  <span>Remote only</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span>View:</span>
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={`px-3 py-1 rounded-full border ${
                    view === "grid"
                      ? "border-indigo-500 bg-indigo-500 text-white"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={`px-3 py-1 rounded-full border ${
                    view === "list"
                      ? "border-purple-500 bg-purple-500 text-white"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  List
                </button>
                <span className="ml-2">
                  Showing{" "}
                  <span className="font-semibold text-slate-800">
                    {filtered.length}
                  </span>{" "}
                  role(s)
                </span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                : "space-y-4"
            }
          >
            {filtered.map((job) =>
              view === "grid" ? (
                <JobCard key={job.id} job={job} />
              ) : (
                <JobRow key={job.id} job={job} />
              )
            )}

            {filtered.length === 0 && (
              <div className="text-center py-10 text-sm text-slate-500 border border-dashed border-slate-200 rounded-2xl">
                No roles match your filters right now.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* APPLICATION FORM - centered & more horizontal */}
      <section
        ref={formRef}
        id="apply"
        className="py-10 sm:py-12 lg:py-14 bg-white"
      >
        <div className="mx-auto container px-4 sm:px-6 lg:px-10">
          <div className="max-w-9xl mx-auto">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Apply for an internship or job
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                No login required. Share your details, attach your
                resume/portfolio and we&apos;ll get back to you over email.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-5 sm:p-6 lg:p-7"
            >
              {/* Multi-column responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                <FormField label="Full name" required>
                  <input
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your full name"
                    required
                  />
                </FormField>
                <FormField label="Email" required>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="you@example.com"
                    required
                  />
                </FormField>
                <FormField label="Phone">
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="+91…"
                  />
                </FormField>

                <FormField label="Apply for" required>
                  <select
                    name="applyType"
                    value={formData.applyType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="internship">Internship</option>
                    <option value="job">Job</option>
                  </select>
                </FormField>
                <FormField label="Desired role">
                  <input
                    name="desiredRole"
                    type="text"
                    value={formData.desiredRole}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Full Stack Intern, QA Engineer…"
                  />
                </FormField>
                <FormField label="Experience level">
                  <input
                    name="experienceLevel"
                    type="text"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 3rd year, 1 year exp…"
                  />
                </FormField>

                <FormField label="Preferred location">
                  <input
                    name="preferredLocation"
                    type="text"
                    value={formData.preferredLocation}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Remote / Bengaluru / …"
                  />
                </FormField>
                <FormField label="Portfolio / GitHub">
                  <input
                    name="portfolioUrl"
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Link to your work"
                  />
                </FormField>
                <FormField label="LinkedIn">
                  <input
                    name="linkedinUrl"
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="LinkedIn profile URL"
                  />
                </FormField>

                {/* Tell us about yourself - span full width */}
                <FormField
                  label="Tell us about yourself"
                  required
                  className="sm:col-span-2 lg:col-span-3"
                >
                  <textarea
                    name="aboutYou"
                    rows={4}
                    value={formData.aboutYou}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="A short note about your background and why you'd like to work with us…"
                    required
                  />
                </FormField>
              </div>

              {/* Files */}
              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Attach resume / portfolio / documents
                </label>
                <label className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs sm:text-sm text-slate-600 cursor-pointer hover:border-indigo-400">
                  <FaFileUpload className="text-indigo-500" />
                  <span className="flex-1 min-w-[180px]">
                    Click to upload (PDF, DOC, images). You can attach multiple
                    files.
                  </span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFilesChange}
                  />
                </label>
                {files.length > 0 && (
                  <p className="mt-2 text-[11px] text-slate-500">
                    {files.length} file(s) selected:{" "}
                    {files.map((f) => f.name).join(", ")}
                  </p>
                )}
              </div>

              {submitMessage && (
                <p className="mt-4 text-xs sm:text-sm text-emerald-600">
                  {submitMessage}
                </p>
              )}
              {submitError && (
                <p className="mt-4 text-xs sm:text-sm text-rose-600">
                  {submitError}
                </p>
              )}

              <div className="mt-6 text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-2.5 text-sm font-medium text-white shadow-md hover:shadow-lg hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting…" : "Submit application"}
                </button>
                <p className="mt-2 text-[11px] text-slate-500">
                  By submitting, you agree to be contacted via email/phone for
                  opportunities at Ecoders.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="py-6 text-center text-[11px] sm:text-xs text-slate-500">
        © {new Date().getFullYear()} Ecoders · Careers
      </footer>
    </div>
  );
}

/* Small UI pieces */

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-xs sm:text-sm">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function HighlightCard({ icon, title, desc }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 text-xs sm:text-sm">
      <div className="flex items-center gap-2 text-slate-800">
        <span className="text-lg">{icon}</span>
        <span className="font-semibold">{title}</span>
      </div>
      <p className="mt-1 text-[11px] text-slate-600">{desc}</p>
    </div>
  );
}

function Benefit({ icon, title, desc }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-xs sm:text-sm shadow-sm">
      <div className="flex items-center gap-2 text-slate-900">
        <span className="text-lg">{icon}</span>
        <span className="font-semibold">{title}</span>
      </div>
      <p className="mt-1 text-[11px] sm:text-xs text-slate-600">{desc}</p>
    </div>
  );
}

function MiniPill({ icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-700">
      <span className="text-sm text-slate-500">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function FormField({ label, required, children, className = "" }) {
  return (
    <div className={`mt-3 sm:mt-4 ${className}`}>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function JobCard({ job }) {
  const badgeClasses =
    job.type === "Internship"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-indigo-200 bg-indigo-50 text-indigo-700";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 flex flex-col h-full">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-slate-900">
            {job.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500">{job.dept}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] ${badgeClasses}`}
        >
          <FaBriefcase className="text-[13px]" />
          {job.type}
        </span>
      </div>
      <p className="mt-3 text-xs sm:text-sm text-slate-600 flex-1">
        {job.summary}
      </p>

      <div className="mt-3 space-y-1 text-[11px] text-slate-600">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-emerald-500" />
          <span>{job.location}</span>
          {job.remote && (
            <span className="ml-1 text-emerald-600 font-medium">
              (Remote friendly)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="text-orange-400" />
          <span>{job.experience}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaChartLine className="text-sky-500" />
          <span>{job.salary}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {job.tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-600"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
        <span>Posted: {job.posted}</span>
        <button
          type="button"
          onClick={() =>
            document
              .getElementById("apply")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          className="text-indigo-600 font-medium hover:underline"
        >
          Apply for this role
        </button>
      </div>
    </article>
  );
}

function JobRow({ job }) {
  const badgeClasses =
    job.type === "Internship"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-indigo-200 bg-indigo-50 text-indigo-700";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                {job.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500">{job.dept}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] ${badgeClasses}`}
            >
              <FaBriefcase className="text-[13px]" />
              {job.type}
            </span>
          </div>

          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            {job.summary}
          </p>

          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600">
            <span className="inline-flex items-center gap-1">
              <FaMapMarkerAlt className="text-emerald-500" />
              {job.location}
              {job.remote && (
                <span className="ml-1 text-emerald-600 font-medium">
                  (Remote)
                </span>
              )}
            </span>
            <span className="inline-flex items-center gap-1">
              <FaClock className="text-orange-400" />
              {job.experience}
            </span>
            <span className="inline-flex items-center gap-1">
              <FaChartLine className="text-sky-500" />
              {job.salary}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1">
            {job.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-600"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2">
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("apply")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 text-xs font-medium text-white shadow-md hover:shadow-lg hover:brightness-110"
          >
            Apply now
          </button>
          <span className="text-[11px] text-slate-500">
            Posted: {job.posted}
          </span>
        </div>
      </div>
    </article>
  );
}
