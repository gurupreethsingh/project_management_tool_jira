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
  FaStore,
  FaTruck,
  FaBoxes,
} from "react-icons/fa";

/**
 * E-commerce Careers Page
 * - Tracks: Working Professionals, Internships, Franchise/Partner Programs
 * - Departments cover the full e-commerce org surface (Ops, Supply Chain, Catalog, Seller, CX, etc.)
 * - Remote-friendly roles where applicable; on-site noted for warehouse/last-mile.
 * - Subtle palette + icons; same layout/filters as your previous version.
 */

const JOBS = [
  // ——— Working Professionals
  {
    id: "eng-plat-001",
    title: "Senior Software Engineer — Platform (Node/React)",
    dept: "Engineering",
    type: "Full-time",
    location: "Remote (India)",
    remote: true,
    experience: "3–5 years",
    salary: "₹18–32 LPA",
    tags: ["Node.js", "React", "Kubernetes", "PostgreSQL"],
    posted: "2025-10-28",
    applyUrl: "#apply-eng-platform",
    summary:
      "Own core platform services powering catalog, pricing, and checkout at national scale.",
  },
  {
    id: "pm-checkout-002",
    title: "Product Manager — Checkout & Payments",
    dept: "Product",
    type: "Full-time",
    location: "Bengaluru, India",
    remote: true,
    experience: "3–5 years",
    salary: "₹24–40 LPA",
    tags: ["Payments", "UPI", "RTO", "Conversion"],
    posted: "2025-10-25",
    applyUrl: "#apply-pm-checkout",
    summary:
      "Drive conversion with seamless payments, risk controls, and multi-tender orchestration.",
  },
  {
    id: "ops-reg-003",
    title: "Regional Operations Manager — Fulfillment",
    dept: "Operations",
    type: "Full-time",
    location: "Hyderabad, India",
    remote: false,
    experience: "5+ years",
    salary: "₹20–30 LPA",
    tags: ["FC", "SLA", "Lean", "Throughput"],
    posted: "2025-10-22",
    applyUrl: "#apply-ops-regional",
    summary:
      "Lead FC operations: inbound, storage, pick-pack-ship, safety, and cost per order.",
  },
  {
    id: "scm-analyst-004",
    title: "Supply Chain Analyst — Network Planning",
    dept: "Supply Chain",
    type: "Full-time",
    location: "Remote (India)",
    remote: true,
    experience: "1–3 years",
    salary: "₹10–16 LPA",
    tags: ["Forecasting", "Inventory", "SQL", "Tableau"],
    posted: "2025-11-01",
    applyUrl: "#apply-scm-analyst",
    summary:
      "Forecast demand, optimize inventory placement, and reduce stockouts & aging.",
  },
  {
    id: "catalog-ops-005",
    title: "Catalog Operations Specialist",
    dept: "Catalog",
    type: "Full-time",
    location: "Remote (India)",
    remote: true,
    experience: "0–2 years",
    salary: "₹6–10 LPA",
    tags: ["PIM", "QC", "A+ Content", "Taxonomy"],
    posted: "2025-10-18",
    applyUrl: "#apply-catalog-ops",
    summary:
      "Ensure clean listings, accurate attributes, and rich content to boost discoverability.",
  },
  {
    id: "seller-growth-006",
    title: "Seller Growth Manager",
    dept: "Seller Success",
    type: "Full-time",
    location: "Mumbai, India",
    remote: true,
    experience: "3–5 years",
    salary: "₹12–22 LPA",
    tags: ["Marketplace", "GMV", "Promotions", "Account Management"],
    posted: "2025-10-29",
    applyUrl: "#apply-seller-growth",
    summary:
      "Grow marketplace GMV through seller onboarding, merchandising, and promo strategy.",
  },
  {
    id: "cx-lead-007",
    title: "Customer Experience Lead",
    dept: "Customer Support",
    type: "Full-time",
    location: "Remote (India)",
    remote: true,
    experience: "3–5 years",
    salary: "₹12–20 LPA",
    tags: ["NPS", "AHT", "QA", "Escalations"],
    posted: "2025-10-30",
    applyUrl: "#apply-cx-lead",
    summary:
      "Own NPS and service recovery with data-led playbooks across chat, voice, and email.",
  },
  {
    id: "mkt-perf-008",
    title: "Performance Marketing Manager",
    dept: "Marketing",
    type: "Full-time",
    location: "Remote (India)",
    remote: true,
    experience: "3–5 years",
    salary: "₹18–28 LPA",
    tags: ["SEM", "Paid Social", "Attribution", "CRO"],
    posted: "2025-10-21",
    applyUrl: "#apply-mkt-perf",
    summary:
      "Scale profitable acquisition with multi-channel campaigns and precise measurement.",
  },
  {
    id: "ml-rec-009",
    title: "ML Engineer — Recommendations & Search",
    dept: "Data/ML",
    type: "Full-time",
    location: "Bengaluru, India",
    remote: true,
    experience: "1–3 years",
    salary: "₹18–30 LPA",
    tags: ["NLP", "Ranking", "Vector Search", "Python"],
    posted: "2025-10-27",
    applyUrl: "#apply-ml-rec",
    summary:
      "Build ranking models for ‘Search’, ‘Also Viewed’, and ‘Deals For You’.",
  },
  {
    id: "risk-010",
    title: "Risk Analyst — Fraud & Returns",
    dept: "Risk",
    type: "Full-time",
    location: "Remote (India)",
    remote: true,
    experience: "1–3 years",
    salary: "₹10–16 LPA",
    tags: ["Chargebacks", "RTO", "Policy", "SQL"],
    posted: "2025-10-26",
    applyUrl: "#apply-risk-analyst",
    summary:
      "Detect and prevent abuse across promo, returns, and payments with data signals.",
  },

  // ——— Internships (Students)
  {
    id: "intern-cat-011",
    title: "Intern — Catalog & Content (3–6 months)",
    dept: "Internships",
    type: "Internship",
    location: "Remote",
    remote: true,
    experience: "Internship",
    salary: "Stipend",
    tags: ["Content Ops", "Excel", "QC"],
    posted: "2025-09-30",
    applyUrl: "#apply-intern-catalog",
    summary:
      "Learn PIM tools, content standards, and launch SKUs with quality checks.",
  },
  {
    id: "intern-ds-012",
    title: "Intern — Data Science (Pricing/Forecasting)",
    dept: "Internships",
    type: "Internship",
    location: "Bengaluru, India",
    remote: true,
    experience: "Internship",
    salary: "Stipend",
    tags: ["Python", "Pandas", "Time Series"],
    posted: "2025-10-10",
    applyUrl: "#apply-intern-ds",
    summary:
      "Prototype pricing/forecast models and visualize insights for business teams.",
  },

  // ——— Franchise/Partner Programs
  {
    id: "partner-lastmile-013",
    title: "Delivery Partner — Last-Mile (Franchise Program)",
    dept: "Franchise & Partners",
    type: "Contract",
    location: "Multiple Cities",
    remote: false,
    experience: "0–2 years",
    salary: "Revenue Share",
    tags: ["Last-Mile", "Fleet", "SLA", "On-Ground"],
    posted: "2025-10-19",
    applyUrl: "#apply-franchise-lastmile",
    summary:
      "Operate last-mile delivery in your city with guaranteed volumes and performance bonuses.",
  },
  {
    id: "partner-microfc-014",
    title: "Micro-Fulfillment Partner (Dark Store/FC)",
    dept: "Franchise & Partners",
    type: "Contract",
    location: "Tier 1 & 2 Cities",
    remote: false,
    experience: "2–3 years",
    salary: "Revenue Share",
    tags: ["Warehouse", "SOP", "SLAs", "Capex"],
    posted: "2025-10-24",
    applyUrl: "#apply-franchise-fc",
    summary:
      "Run a micro-FC/dark store for fast deliveries; we provide SOPs, tech, and supply.",
  },
];

const DEPTS = [
  "All",
  "Engineering",
  "Product",
  "Operations",
  "Supply Chain",
  "Catalog",
  "Seller Success",
  "Customer Support",
  "Marketing",
  "Data/ML",
  "Risk",
  "Internships",
  "Franchise & Partners",
];

const LOCATIONS = [
  "All",
  "Remote",
  "Remote (India)",
  "Bengaluru, India",
  "Hyderabad, India",
  "Mumbai, India",
  "Multiple Cities",
  "Tier 1 & 2 Cities",
];

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
                Build India’s most trusted e-commerce network
              </h1>
              <p className="mt-3 text-slate-600 text-base md:text-lg">
                From platform engineering and product to catalog, operations, supply chain, and last-mile—there’s a place for you.
              </p>
              <div className="mt-4 d-flex flex-wrap gap-2">
                <a href="#open-roles" className="btn btn-outline-secondary rounded-pill px-4 py-2 shadow-none">
                  Explore Jobs
                </a>
                <a href="#internships" className="btn btn-outline-secondary rounded-pill px-4 py-2">
                  Student Internships
                </a>
                <a href="#franchise" className="btn btn-outline-secondary rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2">
                  <FaStore /> Franchise & Partners
                </a>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <Stat k="10K+" v="Cities Served" />
                <Stat k="100M+" v="Orders/Year" />
                <Stat k="Remote" v="Across India" />
              </div>
            </div>
            <div className="col-12 col-lg-5 mt-5 mt-lg-0">
              <div className="bg-slate-100/80 rounded-2xl p-5 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">Why work with us</h3>
                <ul className="mt-3 space-y-2 text-slate-600 text-sm">
                  <li>• Ownership & autonomy; real impact at massive scale</li>
                  <li>• Remote-friendly roles across tech and business</li>
                  <li>• Growth via rotations, mentorship, and learning credits</li>
                  <li>• Partner programs for entrepreneurship & income</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters / Open Roles */}
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
            Designed for people who build at scale—tech, business, and on-ground ops.
          </p>
          <div className="row g-3 mt-1">
            {[
              [<FaHeart key="h" />, "Health Coverage", "Medical for you & family, wellness support"],
              [<FaBook key="b" />, "Learning Credits", "₹50,000/year for courses & conferences"],
              [<FaHome key="r" />, "Remote Setup", "WFH stipend for internet & ergonomics"],
              [<FaCalendarAlt key="f" />, "Flexible Time", "Hybrid/remote options by role"],
              [<FaBaby key="p" />, "Parental Leave", "Inclusive policies for caregivers"],
              [<FaChartLine key="e" />, "ESOPs/Bonus", "Performance-linked wealth creation"],
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
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">Life in e-commerce</h2>
                <ul className="mt-3 space-y-2 text-slate-600 text-sm">
                  <li>• Customer obsession, from UX to doorstep delivery</li>
                  <li>• Operate with data—every decision measured</li>
                  <li>• Move fast, respect safety & compliance</li>
                  <li>• Learn by building: pilot → scale → improve</li>
                </ul>
              </div>
              <div className="col-12 col-lg-6">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Build", <FaLaptopCode key="l" />],
                    ["Learn", <FaBook key="bk" />],
                    ["Deliver", <FaTruck key="t" />],
                    ["Fulfill", <FaBoxes key="bx" />],
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
                <strong className="font-semibold text-slate-700">Equal Opportunity.</strong> We welcome applicants from all backgrounds and provide reasonable accommodations throughout hiring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Internships (Students) */}
      <section id="internships" className="py-5 bg-white/80">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">Early Careers & Internships</h2>
          <p className="text-slate-600 mt-2 text-sm">
            Learn how large-scale commerce works—tech, data, catalog, pricing, and ops.
          </p>
          <div className="mt-3">
            {JOBS.filter((j) => j.dept === "Internships").map((j) => (
              <div key={j.id} className="mb-3">
                <JobRow job={j} />
              </div>
            ))}
            <div className="rounded-3 bg-body-secondary text-body p-3 border border-slate-200">
              Looking for winter/summer internship windows?{" "}
              <a href="#apply-intern-open" className="text-slate-700 fw-semibold">
                Send an open application
              </a>{" "}
              with your resume and portfolio/GitHub.
            </div>
          </div>
        </div>
      </section>

      {/* Franchise / Partners */}
      <section id="franchise" className="py-5">
        <div className="container">
          <div className="rounded-3 bg-white p-4 p-md-5 border border-slate-200">
            <div className="d-flex align-items-center gap-2 mb-2">
              <FaStore className="text-slate-600" />
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 m-0">Franchise & Partner Programs</h2>
            </div>
            <p className="text-slate-600 text-sm">
              Build a business with our technology, SOPs, and guaranteed volumes.
            </p>

            <div className="row g-3 mt-1">
              {JOBS.filter((j) => j.dept === "Franchise & Partners").map((j) => (
                <div key={j.id} className="col-12 col-lg-6">
                  <JobCard job={j} />
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-3 bg-body-secondary text-body p-3 border border-slate-200 d-flex flex-wrap justify-content-between align-items-center">
              <span className="text-slate-700 text-sm">
                Not sure which program fits? Share your city, capacity, and experience.
              </span>
              <a href="#apply-franchise-open" className="btn btn-outline-secondary rounded-pill px-4 py-2 mt-2 mt-md-0">
                Enquire Now
              </a>
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
                Send an open application—job, internship, or franchise interest—and we’ll get in touch.
              </p>
            </div>
            <a href="#open-application" className="btn btn-outline-secondary rounded-pill mt-3 mt-md-0 px-4 py-2">
              Send Open Application
            </a>
          </div>
        </div>
      </section>

      <footer className="py-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} YourBrand Commerce — Careers
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
  const typeBadge =
    job.dept === "Franchise & Partners"
      ? "bg-warning-subtle text-body"
      : job.type === "Internship"
      ? "bg-info-subtle text-body"
      : "bg-body-secondary text-body";

  return (
    <article className="h-100 border border-slate-200 rounded-3 p-4 bg-white hover:shadow-sm transition-shadow">
      <div className="d-flex justify-content-between align-items-start">
        <h3 className="text-base md:text-lg font-semibold m-0 text-slate-800">{job.title}</h3>
        <span className={`badge rounded-pill d-inline-flex align-items-center gap-1 ${typeBadge}`}>
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
          {job.dept === "Franchise & Partners" ? "Enquire" : "Apply Now"}
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
            {job.dept === "Franchise & Partners" ? "Enquire" : "Apply"}
          </a>
          <span className="text-[11px] text-slate-500 mt-2">Posted: {job.posted}</span>
        </div>
      </div>
    </article>
  );
}

const FAQS = [
  {
    q: "Which roles are remote vs on-site?",
    a: "Most tech, data, catalog, marketing, and customer support roles are remote-friendly. Warehouse and last-mile roles require on-site presence for safety and SLAs.",
  },
  {
    q: "Do you hire working professionals transitioning from other industries?",
    a: "Yes. We value transferable skills in product, analytics, operations, and program management. Share outcomes you’ve driven and the metrics you moved.",
  },
  {
    q: "How do internships work?",
    a: "3–6 month programs with mentors and clear projects. We support academic requirements and provide stipends. Many interns convert to full-time.",
  },
  {
    q: "What is the franchise/partner model?",
    a: "You operate last-mile or micro-fulfillment on revenue share. We provide tech, SOPs, and demand; you manage on-ground operations and teams.",
  },
  {
    q: "What does your interview process look like?",
    a: "Screen → role/portfolio discussion → task/case study → values/leadership round → offer. We aim to complete this within 2–3 weeks.",
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
