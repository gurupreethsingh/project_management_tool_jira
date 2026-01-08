// ✅ file: src/pages/order_pages/MyOrders.jsx
// ✅ ONLY UI updated (logic unchanged)
// - Same theme as Shop (Plus Jakarta Sans + orange→amber buttons)
// - Cleaner cards (no heavy shadows), more spacing between rows and sections
// - Selling price dark, status pill tidy
// - Better item spacing + responsive layout

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../components/auth_components/AuthManager";
import globalBackendRoute from "../../config/Config";
import {
  FaClock,
  FaRupeeSign,
  FaBoxOpen,
  FaShippingFast,
} from "react-icons/fa";

const MyOrders = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${globalBackendRoute}/api/my-orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/600x600";
    const normalized = String(imagePath).replace(/\\/g, "/").split("/").pop();
    return `${globalBackendRoute}/uploads/products/${normalized}`;
  };

  const formatAddress = (addr) => {
    if (!addr || typeof addr !== "object") return "N/A";
    const { addressLine1, addressLine2, city, state, postalCode, country } =
      addr;
    return `${addressLine1 || ""}${addressLine2 ? ", " + addressLine2 : ""}${
      city ? ", " + city : ""
    }${state ? ", " + state : ""}${postalCode ? ", " + postalCode : ""}${
      country ? ", " + country : ""
    }`;
  };

  const statusTheme = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "delivered")
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (s === "shipped") return "bg-blue-50 text-blue-700 border-blue-100";
    return "bg-amber-50 text-amber-800 border-amber-100";
  };

  return (
    <div className="orders-font orders-scope w-full px-4 sm:px-6 lg:px-10 py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .orders-font{
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }

        .btnOrange{
          border-radius: 9999px;
          background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36));
          padding: 0.75rem 1.25rem;
          color: white;
          font-weight: 800;
          font-size: 12px;
          box-shadow: 0 18px 30px -18px rgba(249,115,22,0.45);
          transition: opacity .15s ease, transform .15s ease;
          border: none;
        }
        .btnOrange:hover{ opacity: .95; }
        .btnOrange:active{ transform: scale(.99); }

        .ordersCard{
          border: 1px solid rgb(241,245,249);
          box-shadow: none;
          background: white;
          border-radius: 1.25rem;
        }

        .orders-scope .priceSelling{
          color: rgb(15,23,42);
          font-weight: 900;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-11 w-11 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100">
          <FaBoxOpen className="text-orange-600 text-xl" />
        </div>
        <div className="min-w-0">
          <h1 className="text-[26px] sm:text-[32px] font-extrabold text-slate-900">
            My Orders
          </h1>
          <p className="text-[12px] font-semibold text-slate-500">
            {orders.length === 0
              ? "No orders yet"
              : `Showing ${orders.length} order(s)`}
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center mt-20">
          <div className="mx-auto h-16 w-16 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <FaClock className="text-3xl text-amber-500" />
          </div>
          <p className="mt-4 text-[14px] font-extrabold text-slate-700">
            No orders placed yet.
          </p>
          <p className="mt-1 text-[12px] font-semibold text-slate-500">
            Start shopping and your orders will appear here.
          </p>

          <div className="mt-6">
            <a href="/shop" className="btnOrange inline-flex">
              Continue Shopping
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="ordersCard p-5 sm:p-6">
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-slate-500">
                    Order ID
                  </p>
                  <p className="text-[13px] font-extrabold text-slate-900 break-all">
                    {order._id}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={[
                      "inline-flex items-center justify-center",
                      "px-3 py-1 rounded-full text-[11px] font-black uppercase",
                      "border",
                      statusTheme(order.orderStatus),
                    ].join(" ")}
                  >
                    {order.orderStatus || "Processing"}
                  </span>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-extrabold bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
                    style={{ border: "1px solid rgb(241,245,249)" }}
                  >
                    <FaShippingFast className="text-orange-600" />
                    Track Delivery
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="mt-6">
                <h3 className="text-[12px] font-extrabold uppercase text-slate-700">
                  Items
                </h3>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl bg-white p-3 flex gap-3"
                      style={{ border: "1px solid rgb(241,245,249)" }}
                    >
                      <div
                        className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0"
                        style={{ border: "1px solid rgb(241,245,249)" }}
                      >
                        <img
                          src={getImageUrl(item.product_image)}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/600x600";
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-extrabold text-slate-900 truncate">
                          {item.product_name}
                        </p>
                        <p className="mt-1 text-[12px] font-semibold text-slate-500">
                          Qty:{" "}
                          <span className="font-extrabold">
                            {item.quantity}
                          </span>
                        </p>

                        <p className="mt-2 text-[13px] font-black inline-flex items-center gap-1 priceSelling">
                          <FaRupeeSign className="text-orange-600" />
                          {Number(item.selling_price || 0) *
                            Number(item.quantity || 0)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Addresses */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div
                  className="rounded-2xl p-4 bg-slate-50"
                  style={{ border: "1px solid rgb(241,245,249)" }}
                >
                  <p className="text-[12px] font-extrabold text-slate-700 uppercase">
                    Billing Address
                  </p>
                  <p className="mt-2 text-[12px] font-semibold text-slate-600 leading-relaxed">
                    {formatAddress(order.billingAddress)}
                  </p>
                </div>

                <div
                  className="rounded-2xl p-4 bg-slate-50"
                  style={{ border: "1px solid rgb(241,245,249)" }}
                >
                  <p className="text-[12px] font-extrabold text-slate-700 uppercase">
                    Shipping Address
                  </p>
                  <p className="mt-2 text-[12px] font-semibold text-slate-600 leading-relaxed">
                    {formatAddress(order.shippingAddress)}
                  </p>
                </div>
              </div>

              {/* Total */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-[12px] font-semibold text-slate-500">
                  Order Total
                </div>

                <div className="text-[18px] font-black text-slate-900 inline-flex items-center gap-2">
                  <FaRupeeSign className="text-orange-600" />
                  <span>₹{Number(order.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
