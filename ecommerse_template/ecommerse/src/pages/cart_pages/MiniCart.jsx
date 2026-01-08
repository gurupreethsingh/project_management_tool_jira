// ✅ file: src/components/cart_components/MiniCart.jsx
// ✅ ONLY UI updated (logic unchanged)
// - Same theme as Shop pages (Plus Jakarta Sans + orange→amber gradient buttons)
// - Cleaner popup (no heavy shadow), better spacing
// - Selling price dark, totals dark (kept readable)
// - Close on outside click + when cart changes (your logic kept)

import React, { useState, useRef, useEffect, useContext } from "react";
import { CartContext } from "../../components/cart_components/CartContext";
import { AuthContext } from "../../components/auth_components/AuthManager";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaRupeeSign, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import globalBackendRoute from "../../config/Config";

const MiniCart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const cartRef = useRef();
  const navigate = useNavigate();

  const toggleCart = () => setOpen(!open);

  const handleOutsideClick = (e) => {
    if (cartRef.current && !cartRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  // 👇 Close minicart when cart items change (e.g., user switched)
  useEffect(() => {
    setOpen(false);
  }, [cartItems]);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.selling_price * item.quantity,
    0
  );

  const getImageUrl = (img) => {
    if (img) {
      const normalized = String(img).replace(/\\/g, "/").split("/").pop();
      return `${globalBackendRoute}/uploads/products/${normalized}`;
    }
    return "https://via.placeholder.com/600x600";
  };

  return (
    <div className="mc-font mc-scope relative" ref={cartRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .mc-font{
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }

        .btnOrange{
          border-radius: 9999px;
          background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36));
          padding: 0.7rem 1.0rem;
          color: white;
          font-weight: 800;
          font-size: 12px;
          box-shadow: 0 18px 30px -18px rgba(249,115,22,0.45);
          transition: opacity .15s ease, transform .15s ease;
        }
        .btnOrange:hover{ opacity: .95; }
        .btnOrange:active{ transform: scale(.99); }

        .btnGhost{
          border-radius: 9999px;
          padding: 0.7rem 1.0rem;
          font-weight: 800;
          font-size: 12px;
          color: rgb(30,41,59);
          background: rgba(241,245,249,.9);
          transition: background .15s ease, transform .15s ease;
          border: 1px solid rgb(241,245,249);
        }
        .btnGhost:hover{ background: rgba(226,232,240,.95); }
        .btnGhost:active{ transform: scale(.99); }

        .mcCard{
          border: 1px solid rgb(241,245,249);
          box-shadow: none;
        }

        .mcScroll::-webkit-scrollbar{ width: 10px; }
        .mcScroll::-webkit-scrollbar-thumb{ background: rgba(148,163,184,.35); border-radius: 9999px; }
        .mcScroll::-webkit-scrollbar-track{ background: transparent; }
      `}</style>

      {/* Cart Icon */}
      <button
        onClick={toggleCart}
        className="relative p-2 rounded-full"
        type="button"
        aria-label="Open cart"
      >
        <FaShoppingCart className="w-7 h-7 text-orange-500 hover:scale-110 transition-transform duration-300" />

        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full">
            {cartCount}
          </span>
        )}
      </button>

      {/* MiniCart Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="absolute right-0 mt-3 w-[340px] max-w-[92vw] bg-white rounded-3xl z-50 p-4 mcCard"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="min-w-0">
                <h2 className="text-[14px] font-extrabold text-slate-900">
                  Cart Summary
                </h2>
                <p className="text-[12px] font-semibold text-slate-500">
                  {cartItems.length === 0
                    ? "No items yet"
                    : `${cartCount} item(s) • quick checkout`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 w-9 rounded-full bg-slate-50 hover:bg-slate-100 transition inline-flex items-center justify-center"
                style={{ border: "1px solid rgb(241,245,249)" }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            {cartItems.length === 0 ? (
              <div className="text-center text-slate-500 py-10">
                <FaShoppingCart className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-[13px] font-extrabold">
                  Your cart is empty!
                </p>
                <p className="mt-1 text-[12px] font-semibold text-slate-500">
                  Add products to see them here.
                </p>

                <div className="mt-5">
                  <Link
                    to="/shop"
                    onClick={() => setOpen(false)}
                    className="btnGhost inline-flex justify-center w-full"
                  >
                    Browse products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1 mcScroll">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 rounded-2xl bg-white p-2"
                    style={{ border: "1px solid rgb(241,245,249)" }}
                  >
                    <div
                      className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0"
                      style={{ border: "1px solid rgb(241,245,249)" }}
                    >
                      <img
                        src={getImageUrl(item.product_image)}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/600x600";
                        }}
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-grow min-w-0">
                      <h3 className="text-[12px] font-extrabold text-slate-900 truncate">
                        {item.product_name}
                      </h3>

                      <div className="mt-1 flex items-center gap-2 text-[12px] font-semibold text-slate-600">
                        <span className="inline-flex items-center gap-1 font-extrabold text-slate-900">
                          <FaRupeeSign /> {item.selling_price}
                        </span>
                        <span className="text-slate-400">×</span>
                        <span className="font-extrabold">{item.quantity}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="h-9 w-9 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 transition inline-flex items-center justify-center"
                      type="button"
                      aria-label="Remove"
                      title="Remove"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="mt-4 border-t pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-extrabold text-slate-700">
                    Total
                  </span>
                  <span className="flex items-center gap-1 text-[14px] font-black text-slate-900">
                    <FaRupeeSign /> {cartTotal.toFixed(2)}
                  </span>
                </div>

                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="btnOrange block w-full text-center"
                >
                  View Cart
                </Link>

                <button
                  className="btnGhost w-full"
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate("/checkout");
                  }}
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MiniCart;
