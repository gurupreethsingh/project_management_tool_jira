// file: src/pages/TermsOfServices.jsx
import React from "react";
import {
  FaFileContract,
  FaUserCheck,
  FaShoppingCart,
  FaCreditCard,
  FaTruck,
  FaUndo,
  FaBan,
  FaShieldAlt,
  FaExternalLinkAlt,
  FaGavel,
  FaEnvelope,
  FaTags,
  FaMoneyBillAlt,
  FaStarHalfAlt,
  FaCommentDots,
  FaHandshake,
  FaBalanceScale,
} from "react-icons/fa";

const SECTION = "text-slate-800 font-semibold text-base md:text-lg flex items-center gap-2";
const P = "text-slate-600 text-sm leading-6";

export default function TermsOfServices() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header (compact, no gray bg) */}
      <section>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">Terms of Service</h1>
          <div className="mt-1 flex flex-wrap gap-2 overflow-x-auto no-scrollbar">
            {[
              ["#acceptance", "Acceptance"],
              ["#accounts", "Accounts"],
              ["#orders", "Orders"],
              ["#payments", "Payments"],
              ["#shipping", "Shipping"],
              ["#returns", "Returns"],
              ["#promos", "Promos"],
              ["#cod", "COD"],
              ["#ip", "IP"],
              ["#reviews", "Reviews"],
              ["#prohibited", "Prohibited"],
              ["#warranty", "Warranty"],
              ["#liability", "Liability"],
              ["#disputes", "Disputes"],
              ["#changes", "Changes"],
              ["#contact", "Contact"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-700 hover:bg-slate-50"
              >
                {label}
              </a>
            ))}
          </div>
          <p className="mt-1 text-slate-600 text-sm">
            Last updated: <span className="font-medium">November 6, 2025</span>
          </p>
        </div>
      </section>

      {/* Content (denser spacing) */}
      <section className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <Block id="acceptance" icon={<FaFileContract className="text-slate-500" />} title="1) Acceptance of Terms">
          <p className={P}>
            By using our website, apps, or services (“Services”), you agree to these Terms. If you do not agree, please do not use the Services.
          </p>
        </Block>

        <Block id="accounts" icon={<FaUserCheck className="text-slate-500" />} title="2) Eligibility & Accounts">
          <p className={P}>
            You must be 18+ (or have guardian consent). Keep credentials confidential; you’re responsible for activity under your account.
          </p>
        </Block>

        <Block id="orders" icon={<FaShoppingCart className="text-slate-500" />} title="3) Orders & Pricing">
          <p className={P}>
            Orders are purchase offers. We may cancel due to stock, pricing errors, or suspected fraud. Prices/discounts may change without notice.
          </p>
        </Block>

        <Block id="payments" icon={<FaCreditCard className="text-slate-500" />} title="4) Payments">
          <p className={P}>
            Supported: UPI, cards, net banking, select wallets via secure gateways. You authorize charging your method for order total, taxes, and shipping.
          </p>
        </Block>

        <Block id="shipping" icon={<FaTruck className="text-slate-500" />} title="5) Shipping & Delivery">
          <p className={P}>
            Timelines are estimates; delays can occur (logistics/weather/peaks). Risk transfers on delivery to your address or pickup point.
          </p>
        </Block>

        <Block id="returns" icon={<FaUndo className="text-slate-500" />} title="6) Returns & Refunds">
          <p className={P}>
            Eligible items accepted within the stated window per Returns Policy. Refund timing depends on method and quality check outcome.
          </p>
        </Block>

        <Block id="promos" icon={<FaTags className="text-slate-500" />} title="7) Promotions & Coupons">
          <p className={P}>
            Promo codes/gift cards cannot be exchanged for cash; single-use unless stated; subject to validity and exclusions. Misuse may void benefits.
          </p>
        </Block>

        <Block id="cod" icon={<FaMoneyBillAlt className="text-slate-500" />} title="8) Cash on Delivery (COD)">
          <p className={P}>
            COD may be limited by pincode/order value. Refusals or repeated non-deliveries can restrict future COD eligibility.
          </p>
        </Block>

        <Block id="ip" icon={<FaShieldAlt className="text-slate-500" />} title="9) Intellectual Property">
          <p className={P}>
            Content, trademarks, and software are owned by us or licensors. Do not copy, modify, or distribute without permission.
          </p>
        </Block>

        <Block id="reviews" icon={<FaCommentDots className="text-slate-500" />} title="10) User Content & Reviews">
          <p className={P}>
            Reviews must be truthful and lawful. We may moderate or remove content that violates guidelines (spam, hate, personal data).
          </p>
        </Block>

        <Block id="prohibited" icon={<FaBan className="text-slate-500" />} title="11) Prohibited Uses">
          <p className={P}>
            No fraud, scraping, reverse-engineering, malware distribution, IP violations, or unlawful activity on the Services.
          </p>
        </Block>

        <Block id="warranty" icon={<FaStarHalfAlt className="text-slate-500" />} title="12) Warranty & After-Sales">
          <p className={P}>
            Manufacturer warranties (if applicable) are governed by their terms. We may assist with service center coordination where possible.
          </p>
        </Block>

        <Block id="liability" icon={<FaBalanceScale className="text-slate-500" />} title="13) Liability & Governing Law">
          <p className={P}>
            To the extent permitted by law, we disclaim warranties and limit liability for indirect or consequential damages. Governed by laws of India; courts at Bengaluru.
          </p>
        </Block>

        <Block id="disputes" icon={<FaGavel className="text-slate-500" />} title="14) Disputes & Resolution">
          <p className={P}>
            Contact support first for resolution. If unresolved, disputes may be handled via mediation/arbitration or courts as per applicable law.
          </p>
        </Block>

        <Block id="changes" icon={<FaExternalLinkAlt className="text-slate-500" />} title="15) Changes to Terms">
          <p className={P}>
            We may update Terms periodically. Continued use after changes signifies acceptance of the updated Terms.
          </p>
        </Block>

        <Block id="contact" icon={<FaEnvelope className="text-slate-500" />} title="16) Contact">
          <p className={P}>
            Questions? Email{" "}
            <a className="text-slate-700 font-medium" href="mailto:legal@example.com">
              legal@example.com
            </a>
            .
          </p>
        </Block>
      </section>
    </main>
  );
}

function Block({ id, icon, title, children }) {
  return (
    <article id={id} className="rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className={SECTION}>
        <span>{icon}</span> <span>{title}</span>
      </h2>
      <div className="mt-1.5">{children}</div>
    </article>
  );
}
