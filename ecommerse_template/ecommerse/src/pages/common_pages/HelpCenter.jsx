// file: src/pages/HelpCenter.jsx
import React, { useState } from "react";
import {
  FaSearch,
  FaBoxOpen,
  FaUndo,
  FaShippingFast,
  FaCreditCard,
  FaUserShield,
  FaPhoneAlt,
  FaEnvelope,
  FaQuestionCircle,
  FaMapMarkerAlt,
  FaExchangeAlt,
  FaGift,
  FaReceipt,
  FaHeadset,
  FaMobileAlt,
  FaStore,
} from "react-icons/fa";

const faqs = [
  { q: "Where is my order?", a: "Most orders ship in 24–48 hours and arrive in 2–5 business days. Track from Orders → your order." },
  { q: "Can I change address after ordering?", a: "If the order isn’t packed, you can edit the address from Orders. Otherwise, contact support with the correct address." },
  { q: "What is your return policy?", a: "Returns within 14 days for eligible items. Keep original packaging/tags. Start from Orders → ‘Start a return’." },
  { q: "Which payments do you accept?", a: "UPI, debit/credit cards, net banking, select wallets. COD is available on eligible pincodes/orders." },
  { q: "When will I get my refund?", a: "Prepaid refunds usually reflect in 3–7 business days post quality check. COD refunds go to your selected mode." },
  { q: "Are my payments secure?", a: "Yes. We use PCI-DSS compliant gateways and encryption. We never store full card numbers." },
  { q: "Do you provide GST invoices?", a: "Yes. Add your GST number at checkout or in Address Book → Business. Download invoices from Orders." },
];

export default function HelpCenter() {
  const [open, setOpen] = useState(null);

  return (
    <main className="min-h-screen bg-white">
      {/* Header (compact, no gray bg) */}
      <section>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">Help Center</h1>
          <p className="mt-1 text-slate-600 text-sm md:text-base">
            Quick answers about orders, returns, shipping, payments, and more.
          </p>

          {/* Search */}
          <div className="mt-4 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Search help topics (e.g., returns, address, refund)…"
              aria-label="Search help topics"
            />
          </div>

          {/* Quick nav (pills, horizontal scroll on mobile) */}
          <nav className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
            {[
              ["#orders", "Orders"],
              ["#returns", "Returns"],
              ["#shipping", "Shipping"],
              ["#payments", "Payments"],
              ["#account", "Account"],
              ["#faqs", "FAQs"],
              ["#contact", "Contact"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-700 hover:bg-slate-50"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Quick links grid (compact cards) */}
      <section className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickCard id="orders" icon={<FaBoxOpen className="text-slate-500" />} title="Track Order" desc="Live status & ETA." />
          <QuickCard id="returns" icon={<FaUndo className="text-slate-500" />} title="Returns & Refunds" desc="Window, steps, timelines." />
          <QuickCard id="shipping" icon={<FaShippingFast className="text-slate-500" />} title="Shipping" desc="Speeds, fees, coverage." />
          <QuickCard id="" icon={<FaCreditCard className="text-slate-500" />} title="Payments & COD" desc="Methods, charges, limits." />
          <QuickCard id="" icon={<FaUserShield className="text-slate-500" />} title="Account & Security" desc="Password, 2FA, privacy." />
          <QuickCard id="" icon={<FaExchangeAlt className="text-slate-500" />} title="Replacements" desc="Damaged/defective items." />
          <QuickCard id="" icon={<FaMapMarkerAlt className="text-slate-500" />} title="Address Change" desc="Edit after placing order." />
          <QuickCard id="" icon={<FaGift className="text-slate-500" />} title="Gift Cards & Offers" desc="Redeem & T&C." />
          <QuickCard id="" icon={<FaReceipt className="text-slate-500" />} title="GST Invoice" desc="Add GST & download invoice." />
          <QuickCard id="" icon={<FaHeadset className="text-slate-500" />} title="B2B/Wholesale" desc="Bulk & enterprise orders." />
          <QuickCard id="" icon={<FaMobileAlt className="text-slate-500" />} title="App Troubleshooting" desc="Login, cache, updates." />
          <QuickCard id="" icon={<FaStore className="text-slate-500" />} title="Pickup & Store" desc="Click & collect options." />
        </div>
      </section>

      {/* FAQ (denser) */}
      <section id="faqs" className="max-w-5xl mx-auto px-4 pb-6">
        <h2 className="text-lg font-semibold text-slate-800">Popular FAQs</h2>
        <div className="mt-2 divide-y divide-slate-200 border border-slate-200 rounded-2xl">
          {faqs.map((item, i) => (
            <button
              key={item.q}
              className="w-full text-left p-4 focus:outline-none hover:bg-slate-50/60"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-medium text-slate-800">{item.q}</span>
                <span className="text-slate-400">{open === i ? "−" : "+"}</span>
              </div>
              {open === i && <p className="mt-1.5 text-sm text-slate-600">{item.a}</p>}
            </button>
          ))}
        </div>
      </section>

      {/* Contact (compact) */}
      <section id="contact" className="border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h3 className="text-base font-semibold text-slate-800">Need more help?</h3>
          <p className="text-slate-600 text-sm">9:00–18:00 IST, Mon–Sat (excl. public holidays)</p>
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <a href="tel:+910000000000" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50">
              <FaPhoneAlt className="text-slate-500" /> Call Support
            </a>
            <a href="mailto:support@example.com" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50">
              <FaEnvelope className="text-slate-500" /> Email Support
            </a>
            <a href="#faqs" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50">
              <FaQuestionCircle className="text-slate-500" /> Browse FAQs
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function QuickCard({ id, icon, title, desc }) {
  return (
    <a
      href={id || "#"}
      className="group rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm transition"
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <div>
          <h3 className="font-medium text-slate-800">{title}</h3>
          <p className="text-sm text-slate-600">{desc}</p>
        </div>
      </div>
    </a>
  );
}
