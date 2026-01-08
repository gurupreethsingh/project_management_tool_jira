// ✅ file: src/pages/order_pages/ThankYou.jsx
// ✅ ONLY UI updated (logic unchanged)
// - Same theme as Shop (Plus Jakarta Sans + orange→amber gradient button)
// - Centered layout + clean card style (no heavy shadows)

import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const ThankYou = () => {
  return (
    <div className="ty-font w-full px-4 py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .ty-font{
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }

        .btnOrange{
          border-radius: 9999px;
          background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36));
          padding: 0.85rem 1.4rem;
          color: white;
          font-weight: 800;
          font-size: 12px;
          box-shadow: 0 18px 30px -18px rgba(249,115,22,0.45);
          transition: opacity .15s ease, transform .15s ease;
          border: none;
        }
        .btnOrange:hover{ opacity: .95; }
        .btnOrange:active{ transform: scale(.99); }

        .tyCard{
          border: 1px solid rgb(241,245,249);
          box-shadow: none;
          background: white;
          border-radius: 1.5rem;
        }
      `}</style>

      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="tyCard w-full max-w-xl p-8 sm:p-10 text-center">
          <div className="mx-auto h-16 w-16 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <FaCheckCircle className="text-3xl text-emerald-600" />
          </div>

          <h1 className="mt-5 text-[24px] sm:text-[30px] font-extrabold text-slate-900">
            Thank You for Your Order!
          </h1>

          <p className="mt-2 text-[13px] font-semibold text-slate-600">
            We have received your order. We will process and ship it soon.
          </p>

          <div className="mt-7">
            <Link to="/shop" className="btnOrange inline-flex items-center">
              Continue Shopping
            </Link>
          </div>

          <p className="mt-5 text-[12px] font-semibold text-slate-500">
            You can track your order from{" "}
            <span className="font-extrabold text-slate-700">My Orders</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
