// file: src/pages/Careers.jsx
import React, { useMemo, useState } from "react";
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
  FaPlus,
  FaMinus,
} from "react-icons/fa";

/**
 * Notes:
 * - Subtler palette via Tailwind slate/gray shades + neutral Bootstrap variants.
 * - Lighter font weights (semibold/medium) instead of extra-bold.
 * - Icons added to filters, cards, benefits, and FAQ toggles.
 */

const JOBS = [
  {
    id: "fs-001",
    title: "Software Engineer — Full Stack (MERN)",
    dept: "Engineering",
    type: "Full-time",
    location: "Bengaluru, India",
    remote: true,
    experience: "1–3 years",
    salary: "₹8–14 LPA",
    tags: ["React", "Node", "MongoDB", "REST"],
    posted: "2025-10-15",
    applyUrl: "#apply-fullstack",
    summary:
      "Build and ship features across our learning & e-commerce platforms with a focus on performance and reliability.",
  },
  {
    id: "ux-003",
    title: "Product Designer — UI/UX",
    dept: "Design",
    type: "Full-time",
    location: "Hybrid — Bengaluru",
    remote: false,
    experience: "0–2 years",
    salary: "₹6–10 LPA",
    tags: ["Figma", "Design systems", "Accessibility"],
    posted: "2025-10-20",
    applyUrl: "#apply-designer",
    summary:
      "Own end-to-end product design: research, flows, prototypes, and thoughtful handoff.",
  },
  {
    id: "qa-005",
    title: "QA Automation Engineer",
    dept: "Quality Assurance",
    type: "Full-time",
    location: "Remote (India)",
    remote: true,
    experience: "1–3 years",
    salary: "₹7–12 LPA",
    tags: ["Selenium", "TestNG", "POM", "CI/CD"],
    posted: "2025-11-01",
    applyUrl: "#apply-qa",
    summary:
      "Design robust test frameworks, expand coverage, and champion quality in quick iterations.",
  },
  {
    id: "ml-010",
    title: "Machine Learning Intern (NLP)",
    dept: "AI/ML",
    type: "Internship",
    location: "Remote",
    remote: true,
    experience: "Internship",
    salary: "Stipend",
    tags: ["Python", "Pandas", "Transformers"],
    posted: "2025-09-28",
    applyUrl: "#apply-ml-intern",
    summary:
      "Help build data pipelines and prototypes for personalization and recommendations.",
  },
];

const DEPTS = ["All", "Engineering", "Design", "Quality Assurance", "AI/ML"];
const LOCATIONS = ["All", "Remote", "Bengaluru, India", "Hybrid — Bengaluru", "Remote (India)"];
const EXPERIENCES = ["All", "Internship", "0–2 years", "1–3 years", "3–5 years", "5+ years"];

export default function Careers() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [loc, setLoc] = useState("All");
  const [exp, setExp] = useState("All");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [view, setView] = useState("grid"); // 'grid' | 'list'
  const [openFaq, setOpenFaq] = useState(null);

  const filtered = useMemo(() => {
    return JOBS.filter((j) => {
      const textHit =
        !q ||
        [j.title, j.summary, j.dept, j.location, j.tags.join(" ")].join(" ").toLowerCase().includes(q.toLowerCase());
      const deptHit = dept === "All" || j.dept === dept;
      const locHit =
        loc === "All" ||
        (loc === "Remote" ? j.remote : j.location.toLowerCase() === loc.toLowerCase());
      const expHit = exp === "All" || j.experience === exp;
      const remoteHit = !remoteOnly || j.remote;
      return textHit && deptHit && locHit && expHit && remoteHit;
    });
  }, [q, dept, loc, exp, remoteOnly]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-white/80">
        <div className="container">
          <div className="row align-items-center py-5">
            <div className="col-12 col-lg-7">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-800">
                Build Your Future With Us.
              </h1>
              <p className="mt-3 text-slate-600 text-base md:text-lg">
                We’re a product-driven team crafting calm, delightful experiences at scale.
                Join us to solve real problems with empathy and craft.
              </p>
              <div className="mt-4 d-flex gap-2">
                <a
                  href="#open-roles"
                  className="btn btn-outline-secondary rounded-pill px-4 py-2 shadow-none"
                >
                  View Open Roles
                </a>
                <a
                  href="#life-at"
                  className="btn btn-outline-secondary rounded-pill px-4 py-2"
                >
                  Life at Ecoders
                </a>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <Stat k="15+" v="Products & tools" />
                <Stat k="2M+" v="Learners reached" />
                <Stat k="Remote" v="Friendly culture" />
              </div>
            </div>
            <div className="col-12 col-lg-5 mt-5 mt-lg-0">
              <div className="bg-slate-100/80 rounded-2xl p-5 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">Why you’ll like it here</h3>
                <ul className="mt-3 space-y-2 text-slate-600 text-sm">
                  <li>• Ownership & autonomy</li>
                  <li>• Measurable user impact</li>
                  <li>• Kind, pragmatic teammates</li>
                  <li>• Remote stipend & learning budget</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section id="open-roles" className="py-5">
        <div className="container">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 p-md-5">
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-4">
                <label className="form-label text-xs text-slate-500">Search</label>
                <div className="input-group">
                  <span className="input-group-text bg-body border-end-0">
                    <FaSearch aria-hidden />
                  </span>
                  <input
                    className="form-control border-start-0"
                    placeholder="Role, skill, or keyword…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-6 col-md-2">
                <label className="form-label text-xs text-slate-500 d-flex align-items-center gap-2">
                  <FaUserTie /> Department
                </label>
                <select className="form-select" value={dept} onChange={(e) => setDept(e.target.value)}>
                  {DEPTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label text-xs text-slate-500 d-flex align-items-center gap-2">
                  <FaMapMarkerAlt /> Location
                </label>
                <select className="form-select" value={loc} onChange={(e) => setLoc(e.target.value)}>
                  {LOCATIONS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="col-6 col-md-2">
                <label className="form-label text-xs text-slate-500 d-flex align-items-center gap-2">
                  <FaClock /> Experience
                </label>
                <select className="form-select" value={exp} onChange={(e) => setExp(e.target.value)}>
                  {EXPERIENCES.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
              <div className="col-6 col-md-1 d-flex align-items-center gap-2">
                <input
                  id="remoteOnly"
                  type="checkbox"
                  className="form-check-input mt-0"
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                />
                <label htmlFor="remoteOnly" className="text-sm text-slate-600 d-flex align-items-center gap-1 m-0">
                  <FaGlobe /> Remote
                </label>
              </div>
              <div className="col-12 d-flex justify-content-between mt-2">
                <p className="text-xs text-slate-500 m-0">
                  Showing <span className="font-semibold text-slate-700">{filtered.length}</span> role(s)
                </p>
                <div className="btn-group" role="group" aria-label="View toggle">
                  <button
                    className={`btn ${view === "grid" ? "btn-secondary" : "btn-outline-secondary"} rounded-start-pill`}
                    onClick={() => setView("grid")}
                  >
                    Grid
                  </button>
                  <button
                    className={`btn ${view === "list" ? "btn-secondary" : "btn-outline-secondary"} rounded-end-pill`}
                    onClick={() => setView("list")}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className={`mt-4 ${view === "grid" ? "row g-3" : "space-y-3"}`}>
              {filtered.map((j) =>
                view === "grid" ? (
                  <div key={j.id} className="col-12 col-md-6 col-lg-4">
                    <JobCard job={j} />
                  </div>
                ) : (
                  <JobRow key={j.id} job={j} />
                )
              )}
              {filtered.length === 0 && (
                <div className="text-center py-5 text-slate-500 text-sm">No roles match your filters.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-5 bg-white/80">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">Benefits & Perks</h2>
          <p className="text-slate-600 mt-2 text-sm">
            We support you with meaningful benefits so you can do your best work.
          </p>
          <div className="row g-3 mt-1">
            {[
              [<FaHeart key="h" />, "Health Coverage", "Comprehensive medical for you & family"],
              [<FaBook key="b" />, "Learning Budget", "₹50,000/year for courses & conferences"],
              [<FaHome key="r" />, "Remote Stipend", "Home office, internet, ergonomics"],
              [<FaCalendarAlt key="f" />, "Flexible Time", "Async-friendly, generous PTO"],
              [<FaBaby key="p" />, "Parental Leave", "Inclusive policies for caregivers"],
              [<FaChartLine key="e" />, "ESOPs", "Own a meaningful stake in our journey"],
            ].map(([icon, title, desc]) => (
              <div key={title} className="col-12 col-md-6 col-lg-4">
                <div className="h-100 border border-slate-200 rounded-2xl p-4 bg-slate-50/60">
                  <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                    <span className="text-slate-500">{icon}</span> {title}
                  </h3>
                  <p className="text-slate-600 mt-2 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section id="life-at" className="py-5">
        <div className="container">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 p-md-5">
            <div className="row g-4 align-items-center">
              <div className="col-12 col-lg-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">Life at Ecoders</h2>
                <ul className="mt-3 space-y-2 text-slate-600 text-sm">
                  <li>• We default to trust & ownership.</li>
                  <li>• We obsess over craft and user joy.</li>
                  <li>• We debate ideas, not egos.</li>
                  <li>• We value sustainable pace and quality.</li>
                </ul>
              </div>
              <div className="col-12 col-lg-6">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Build", <FaLaptopCode key="l" />],
                    ["Learn", <FaBook key="bk" />],
                    ["Ship", <FaShieldAlt key="s" />],
                    ["Explore", <FaFlask key="f" />],
                  ].map(([t, ic]) => (
                    <div key={t} className="rounded-2xl border border-slate-200 p-4 text-center bg-slate-50/60">
                      <div className="text-2xl font-semibold text-slate-800 flex items-center justify-center gap-2">
                        <span className="text-slate-500">{ic}</span> {t}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">every week</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Equal Opportunity */}
            <div className="mt-5 bg-slate-50/70 border border-slate-200 rounded-2xl p-4">
              <p className="text-slate-600 text-sm">
                <strong className="font-semibold text-slate-700">Equal Opportunity.</strong> We’re committed to a diverse,
                inclusive workplace. We welcome applicants from all backgrounds without regard to caste, religion, gender,
                sexual orientation, age, disability, or veteran status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-5 bg-white/80">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">Hiring FAQs</h2>
          <div className="mt-3">
            {FAQS.map((f, i) => (
              <FAQ
                key={f.q}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                {...f}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Apply CTA */}
      <section className="py-5">
        <div className="container">
          <div className="rounded-3 bg-body-secondary text-body p-4 p-md-5 d-flex flex-column flex-md-row justify-content-between align-items-center border border-slate-200">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold m-0 text-slate-800">Didn’t find the right role?</h3>
              <p className="m-0 mt-2 text-slate-600 text-sm">
                Tell us why you’re a great fit. We love thoughtful open applications.
              </p>
            </div>
            <a href="#open-application" className="btn btn-outline-secondary rounded-pill mt-3 mt-md-0 px-4 py-2">
              Send Open Application
            </a>
          </div>
        </div>
      </section>

      <footer className="py-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Ecoders — Careers
      </footer>
    </main>
  );
}

/* ---------- Small Components ---------- */

function Stat({ k, v }) {
  return (
    <div className="bg-slate-100 rounded-xl p-3 border border-slate-200">
      <div className="text-xl font-semibold text-slate-800">{k}</div>
      <div className="text-[11px] text-slate-500">{v}</div>
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-pill border border-slate-200 px-2 py-1 text-[11px] me-1 mt-1 bg-white text-slate-600">
      {children}
    </span>
  );
}

function MetaRow({ icon, label, value, after }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span className="text-slate-500">{icon}</span>
      <span className="text-slate-500">{label}:</span>
      <b className="font-medium text-slate-700">{value}</b>
      {after}
    </div>
  );
}

function JobCard({ job }) {
  return (
    <article className="h-100 border border-slate-200 rounded-3 p-4 bg-white hover:shadow-sm transition-shadow">
      <div className="d-flex justify-content-between align-items-start">
        <h3 className="text-base md:text-lg font-semibold m-0 text-slate-800">{job.title}</h3>
        <span className="badge rounded-pill bg-body-secondary text-body d-inline-flex align-items-center gap-1">
          <FaBriefcase /> {job.type}
        </span>
      </div>
      <p className="text-sm text-slate-600 mt-2">{job.summary}</p>

      <div className="mt-2 space-y-1">
        <MetaRow icon={<FaUserTie />} label="Dept" value={job.dept} />
        <MetaRow
          icon={<FaMapMarkerAlt />}
          label="Location"
          value={job.location}
          after={job.remote && <span className="ms-1 text-emerald-600 text-xs">(Remote OK)</span>}
        />
        <MetaRow icon={<FaClock />} label="Experience" value={job.experience} />
        <MetaRow icon={<FaChartLine />} label="Compensation" value={job.salary} />
      </div>

      <div className="mt-2">
        {job.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      <div className="mt-3 d-flex justify-content-between align-items-center">
        <a href={job.applyUrl} className="btn btn-outline-secondary rounded-pill px-3 py-2">
          Apply Now
        </a>
        <span className="text-[11px] text-slate-500">Posted: {job.posted}</span>
      </div>
    </article>
  );
}

function JobRow({ job }) {
  return (
    <article className="w-100 border border-slate-200 rounded-3 p-3 bg-white hover:shadow-sm transition-shadow">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-2">
        <div>
          <h3 className="text-base md:text-lg font-semibold m-0 text-slate-800">{job.title}</h3>
          <div className="text-sm text-slate-600 mt-1">{job.summary}</div>
          <div className="mt-2 text-sm text-slate-600 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <FaUserTie className="text-slate-500" /> <b className="font-medium text-slate-700">{job.dept}</b>
            </span>
            <span className="inline-flex items-center gap-1">
              <FaMapMarkerAlt className="text-slate-500" /> {job.location}
              {job.remote && <span className="ms-1 text-emerald-600 text-xs">(Remote OK)</span>}
            </span>
            <span className="inline-flex items-center gap-1">
              <FaClock className="text-slate-500" /> {job.experience}
            </span>
            <span className="inline-flex items-center gap-1">
              <FaBriefcase className="text-slate-500" /> {job.type}
            </span>
          </div>
          <div className="mt-2">
            {job.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
        <div className="d-flex flex-column align-items-end">
          <a href={job.applyUrl} className="btn btn-outline-secondary rounded-pill px-3 py-2">
            Apply
          </a>
          <span className="text-[11px] text-slate-500 mt-2">Posted: {job.posted}</span>
        </div>
      </div>
    </article>
  );
}

const FAQS = [
  {
    q: "What does your interview process look like?",
    a: "Typically: intro chat → role/portfolio discussion → take-home or pairing → final values round → offer. We move thoughtfully and respect your time.",
  },
  {
    q: "Do you support remote work?",
    a: "Yes. We’re remote-friendly across India with flexible hours. Many roles are hybrid with a Bengaluru office option.",
  },
  {
    q: "Can I apply for multiple roles?",
    a: "Absolutely. Tell us which role you prefer and why—our team will route your profile accordingly.",
  },
  {
    q: "Do you sponsor visas?",
    a: "Select roles may offer relocation/visa support on a case-by-case basis.",
  },
];

function FAQ({ q, a, open, onToggle }) {
  const id = q.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return (
    <div className="border border-slate-200 rounded-2xl p-3 bg-white mb-2">
      <button
        className="w-100 text-start d-flex justify-content-between align-items-center bg-transparent border-0"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`faq-panel-${id}`}
      >
        <span className="font-medium text-slate-800">{q}</span>
        <span
          className="rounded-circle border border-slate-300 text-slate-600 d-inline-flex justify-content-center align-items-center"
          style={{ width: 28, height: 28 }}
          aria-hidden
        >
          {open ? <FaMinus /> : <FaPlus />}
        </span>
      </button>
      {open && (
        <div id={`faq-panel-${id}`} className="mt-2 text-slate-600 text-sm">
          {a}
        </div>
      )}
    </div>
  );
}
