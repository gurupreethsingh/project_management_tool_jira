// file: src/pages/PrivacyPolicy.jsx
import React, { useMemo, useState } from "react";
import {
  FaUserSecret,
  FaDatabase,
  FaCookieBite,
  FaChartBar,
  FaShareAlt,
  FaHistory,
  FaShieldAlt,
  FaChild,
  FaGlobe,
  FaSync,
  FaEnvelope,
  FaListUl,
  FaThLarge,
  FaIdBadge,
} from "react-icons/fa";

const HEAD_L = "text-slate-800 font-semibold text-[15px] flex items-center gap-2";
const TXT = "text-slate-600 text-[13px] leading-6";
const BADGE = "inline-flex items-center rounded-full border border-slate-300 bg-slate-50 text-slate-600 px-2 py-0.5 text-[11px]";

const SECTIONS = [
  {
    k: "collect",
    title: "1) Information We Collect",
    icon: <FaDatabase className="text-slate-500" />,
    body:
      "We collect information you provide (name, email, phone, addresses), transaction data, support chats/emails, and technical data (device, browser, IP) to operate our Services.",
  },
  {
    k: "use",
    title: "2) How We Use Information",
    icon: <FaUserSecret className="text-slate-500" />,
    body:
      "To process orders, provide support, personalize recommendations, prevent fraud, and improve our website and apps. We may send service updates and—where permitted—marketing messages (you can opt out anytime).",
  },
  {
    k: "cookies",
    title: "3) Cookies & Similar Tech",
    icon: <FaCookieBite className="text-slate-500" />,
    body:
      "We use cookies and similar technologies for sign-in, cart, analytics, and personalization. You can control cookies via your browser, but some features may not work properly.",
  },
  {
    k: "analytics",
    title: "4) Analytics & Advertising",
    icon: <FaChartBar className="text-slate-500" />,
    body:
      "We use analytics to understand usage and performance. Where applicable, we may run interest-based ads using pseudonymous identifiers, respecting your preferences.",
  },
  {
    k: "share",
    title: "5) How We Share Data",
    icon: <FaShareAlt className="text-slate-500" />,
    body:
      "We share data with service providers (payments, logistics, analytics, customer support), with affiliates (for operations), or when required by law. We do not sell your personal data.",
  },
  {
    k: "retention",
    title: "6) Data Retention",
    icon: <FaHistory className="text-slate-500" />,
    body:
      "We retain data as long as necessary for the purposes described and as required by law (e.g., tax, accounting). We then delete or anonymize it.",
  },
  {
    k: "security",
    title: "7) Security",
    icon: <FaShieldAlt className="text-slate-500" />,
    body:
      "We use administrative, technical, and physical safeguards to protect information. No method is 100% secure; please use strong passwords and enable available protections.",
  },
  {
    k: "children",
    title: "8) Children’s Privacy",
    icon: <FaChild className="text-slate-500" />,
    body:
      "Our Services are not directed to children under the age required by local law. If we learn a child has provided data, we will delete it.",
  },
  {
    k: "intl",
    title: "9) International Transfers",
    icon: <FaGlobe className="text-slate-500" />,
    body:
      "If data is transferred across borders, we implement appropriate safeguards in accordance with applicable regulations.",
  },
  {
    k: "rights",
    title: "10) Your Rights & Choices",
    icon: <FaSync className="text-slate-500" />,
    body:
      "You may access, correct, or delete your information subject to legal limits. You can manage communication preferences in your account or via links in emails.",
  },
  {
    k: "changes",
    title: "11) Changes to This Policy",
    icon: <FaSync className="text-slate-500" />,
    body:
      "We may update this Policy from time to time. Material changes will be notified via the website/app or email.",
  },
  {
    k: "contact",
    title: "12) Contact Us",
    icon: <FaEnvelope className="text-slate-500" />,
    body: (
      <>
        Questions or requests? Email{" "}
        <a className="text-slate-700 font-medium underline" href="mailto:privacy@example.com">
          privacy@example.com
        </a>
        .
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  const [view, setView] = useState("list"); // 'list' | 'grid' | 'card'
  const updatedOn = useMemo(() => "November 6, 2025", []);

  return (
    <main className="min-h-screen bg-white">
      {/* Header — compact, no gray band */}
      <header className="container mx-auto px-3 sm:px-4 pt-5 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
          <div>
            <h1 className="text-[22px] sm:text-[26px] font-semibold text-slate-800">Privacy Policy</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={BADGE}><FaIdBadge className="me-1" /> Policy</span>
              <span className={BADGE}>Updated: {updatedOn}</span>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <ToggleButton

              icon={<FaListUl />}
              active={view === "list"}
              onClick={() => setView("list")}
            />
            <ToggleButton

              icon={<FaThLarge />}
              active={view === "grid"}
              onClick={() => setView("grid")}
            />
            <ToggleButton

              icon={<FaIdBadge />}
              active={view === "card"}
              onClick={() => setView("card")}
            />
          </div>
        </div>
      </header>

      {/* Content — compact container */}
      <section className="container mx-auto px-3 sm:px-4 pb-6">
        {view === "list" && (
          <div className="divide-y divide-slate-200">
            {SECTIONS.map((s) => (
              <RowItem key={s.k} title={s.title} icon={s.icon}>
                {typeof s.body === "string" ? <p className={TXT}>{s.body}</p> : <div className={TXT}>{s.body}</div>}
              </RowItem>
            ))}
          </div>
        )}

        {view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-1">
            {SECTIONS.map((s) => (
              <MiniCard key={s.k} title={s.title} icon={s.icon}>
                {typeof s.body === "string" ? <p className={TXT}>{s.body}</p> : <div className={TXT}>{s.body}</div>}
              </MiniCard>
            ))}
          </div>
        )}

        {view === "card" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
            {SECTIONS.map((s) => (
              <Card key={s.k} title={s.title} icon={s.icon}>
                {typeof s.body === "string" ? <p className={TXT}>{s.body}</p> : <div className={TXT}>{s.body}</div>}
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/* ---------- UI bits (compact & subtle) ---------- */
function ToggleButton({ label, icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[12px]",
        active
          ? "border-slate-400 bg-slate-100 text-slate-800"
          : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50",
      ].join(" ")}
      aria-pressed={active}
    >
      <span className="text-slate-600">{icon}</span>
      {label}
    </button>
  );
}

function RowItem({ icon, title, children }) {
  return (
    <article className="py-3">
      <h2 className={HEAD_L}>
        <span>{icon}</span>
        <span>{title}</span>
      </h2>
      <div className="mt-1">{children}</div>
    </article>
  );
}

function MiniCard({ icon, title, children }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3">
      <h3 className={HEAD_L}>
        <span>{icon}</span>
        <span>{title}</span>
      </h3>
      <div className="mt-1">{children}</div>
    </article>
  );
}

function Card({ icon, title, children }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className={HEAD_L}>
          <span>{icon}</span>
          <span>{title}</span>
        </h3>
        <span className={BADGE}>Privacy</span>
      </div>
      <div className="mt-1.5">{children}</div>
    </article>
  );
}
