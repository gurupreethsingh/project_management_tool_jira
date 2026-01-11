// ✅ file: src/pages/shop_pages/CartPage.jsx
// ✅ ONLY UI updated (logic unchanged)
// - Same theme as Shop/SingleProduct
// - Clean rows, more vertical spacing, no heavy shadow
// - Total box styled with same orange→amber CTA

import React, { useContext } from "react";
import { CartContext } from "../../components/cart_components/CartContext";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaRupeeSign,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";
import { RiArrowLeftSLine } from "react-icons/ri";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartLoading } =
    useContext(CartContext);

  const handleIncrease = (id, qty) => {
    updateQuantity(id, qty + 1);
  };

  const handleDecrease = (id, qty) => {
    if (qty > 1) {
      updateQuantity(id, qty - 1);
    }
  };

  const getImageUrl = (img) => {
    if (img) {
      const normalized = String(img).replace(/\\/g, "/").split("/").pop();
      return `${globalBackendRoute}/uploads/products/${normalized}`;
    }
    return "https://via.placeholder.com/600x600";
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.selling_price * item.quantity,
    0
  );

  const CartSpinner = () => (
    <div className="flex flex-col justify-center items-center h-[60vh]">
      <FaShoppingCart className="text-orange-500 w-14 h-14 mb-4 animate-spin" />
      <p className="text-slate-600 text-[14px] font-extrabold">
        Loading your cart...
      </p>
    </div>
  );

  return (
    <div className="cp-font cp-scope w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .cp-font{
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }

        .btnOrange{
          border-radius: 9999px;
          background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36));
          padding: 0.85rem 1.35rem;
          color: white;
          font-weight: 800;
          font-size: 14px;
          box-shadow: 0 18px 30px -18px rgba(249,115,22,0.45);
          transition: opacity .15s ease, transform .15s ease;
        }
        .btnOrange:hover{ opacity: .95; }
        .btnOrange:active{ transform: scale(.99); }

        .btnGhost{
          border-radius: 9999px;
          padding: 0.75rem 1.15rem;
          font-weight: 800;
          font-size: 13px;
          color: rgb(30,41,59);
          background: rgba(241,245,249,.8);
          transition: background .15s ease, transform .15s ease;
        }
        .btnGhost:hover{ background: rgba(226,232,240,.95); }
        .btnGhost:active{ transform: scale(.99); }
      `}</style>

      <motion.div
        className="w-full px-3 sm:px-5 lg:px-10 py-6 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-[12px] font-extrabold text-slate-600 hover:text-slate-900 transition"
            >
              <RiArrowLeftSLine className="text-[16px]" />
              Back
            </button>

            <h1 className="mt-3 text-[22px] sm:text-[26px] font-extrabold text-slate-900 flex items-center gap-3">
              <FaShoppingCart className="text-orange-500" />
              Your Cart
              <span className="text-[12px] font-semibold text-slate-500">
                ({cartItems.length})
              </span>
            </h1>
            <p className="mt-1 text-[12px] font-semibold text-slate-500">
              Update quantities or proceed to checkout.
            </p>
          </div>

          <Link to="/shop" className="hidden sm:inline-flex btnGhost">
            Continue shopping
          </Link>
        </div>

        {cartLoading ? (
          <CartSpinner />
        ) : cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-16"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              alt="Empty Cart"
              className="mx-auto w-28 h-28 opacity-90"
            />
            <h2 className="text-[16px] font-extrabold text-slate-700 mt-4">
              Your cart is empty!
            </h2>
            <div className="mt-6">
              <Link to="/shop" className="btnOrange inline-block">
                Go Shopping
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="mt-8">
            <div className="flex flex-col gap-6">
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  className="bg-white rounded-3xl p-4 sm:p-5"
                  style={{
                    border: "1px solid rgb(241,245,249)",
                    boxShadow: "none",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    {/* Product */}
                    <div className="flex items-center gap-4 w-full md:w-[52%]">
                      <div
                        className="rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0"
                        style={{
                          width: 92,
                          height: 92,
                          border: "1px solid rgb(241,245,249)",
                        }}
                      >
                        <img
                          src={getImageUrl(item.product_image)}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/600x600";
                          }}
                          loading="lazy"
                        />
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-[14px] sm:text-[16px] font-extrabold text-slate-900 truncate">
                          {item.product_name}
                        </h2>
                        <p className="mt-1 text-[12px] font-semibold text-slate-500">
                          Price{" "}
                          <span className="font-extrabold text-slate-800">
                            ₹{item.selling_price}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDecrease(item._id, item.quantity)}
                        className="h-10 w-10 rounded-full bg-slate-50 hover:bg-slate-100 transition inline-flex items-center justify-center"
                        style={{ border: "1px solid rgb(241,245,249)" }}
                        type="button"
                      >
                        <FaMinus />
                      </button>
                      <span className="min-w-[32px] text-center font-black text-[14px] text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrease(item._id, item.quantity)}
                        className="h-10 w-10 rounded-full bg-slate-50 hover:bg-slate-100 transition inline-flex items-center justify-center"
                        style={{ border: "1px solid rgb(241,245,249)" }}
                        type="button"
                      >
                        <FaPlus />
                      </button>
                    </div>

                    {/* Total + Remove */}
                    <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                      <span className="text-[16px] font-black text-slate-900 flex items-center gap-1">
                        <FaRupeeSign /> {item.selling_price * item.quantity}
                      </span>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="h-10 w-10 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 transition inline-flex items-center justify-center"
                        type="button"
                        title="Remove"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total box */}
            <motion.div
              className="mt-10 rounded-3xl bg-white p-6 text-center"
              style={{
                border: "1px solid rgb(241,245,249)",
                boxShadow: "none",
              }}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-[14px] font-extrabold text-slate-700">
                Total Amount
              </h2>

              <p className="mt-2 text-[26px] font-black text-slate-900 flex justify-center items-center gap-2">
                <FaRupeeSign /> {totalAmount.toFixed(2)}
              </p>

              <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/shop"
                  className="btnGhost inline-flex justify-center"
                >
                  Continue shopping
                </Link>

                <button
                  onClick={() => navigate("/checkout")}
                  className="btnOrange inline-flex justify-center"
                  type="button"
                >
                  Proceed to Checkout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CartPage;
