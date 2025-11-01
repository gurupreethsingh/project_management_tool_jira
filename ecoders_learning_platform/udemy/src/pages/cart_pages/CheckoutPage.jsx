// src/pages/checkout_pages/CheckoutPage.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { CartContext } from "../../components/cart_components/CartContext";
import { AuthContext } from "../../components/auth_components/AuthManager";
import Breadcrumb from "../../components/common_components/Breadcrumb";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";
import axios from "axios";

/* Icons */
import { FaShoppingCart, FaMapMarkerAlt, FaStar, FaBookOpen, FaCode } from "react-icons/fa";
import {
  FaPython, FaReact, FaJava, FaDatabase, FaRobot, FaNodeJs, FaHtml5, FaCss3Alt
} from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io5";
import { TbBrandTypescript, TbBrandNextjs, TbBrandCSharp } from "react-icons/tb";

/* Map server iconKey => a subtle icon/color (same scheme as Cart) */
function iconFromKey(iconKey = "", tags = []) {
  const key = String(iconKey || "").toLowerCase();
  const icon = (Icon, cls) => ({ Icon, cls });

  if (key.startsWith("tag-")) {
    const tag = key.slice(4);
    if (/python/.test(tag)) return icon(FaPython, "text-yellow-500");
    if (/react/.test(tag)) return icon(FaReact, "text-cyan-500");
    if (/java\b/.test(tag)) return icon(FaJava, "text-orange-500");
    if (/(mysql|sql|db|database)/.test(tag)) return icon(FaDatabase, "text-blue-500");
    if (/selenium|robot/.test(tag)) return icon(FaRobot, "text-purple-700");
    if (/node/.test(tag)) return icon(FaNodeJs, "text-green-600");
    if (/typescript|ts\b/.test(tag)) return icon(TbBrandTypescript, "text-blue-600");
    if (/next/.test(tag)) return icon(TbBrandNextjs, "text-gray-900");
    if (/csharp|c#/.test(tag)) return icon(TbBrandCSharp, "text-violet-600");
    if (/html/.test(tag)) return icon(FaHtml5, "text-orange-500");
    if (/css/.test(tag)) return icon(FaCss3Alt, "text-blue-500");
    if (/javascript|js\b/.test(tag)) return icon(IoLogoJavascript, "text-yellow-500");
  }

  if (key.startsWith("level-")) return icon(FaBookOpen, "text-indigo-600");

  if (key.startsWith("bucket-")) {
    const b = Number(key.replace("bucket-", ""));
    const buckets = [
      icon(FaReact, "text-cyan-500"),
      icon(FaPython, "text-yellow-500"),
      icon(FaJava, "text-orange-500"),
      icon(FaDatabase, "text-blue-500"),
      icon(FaRobot, "text-purple-700"),
      icon(FaNodeJs, "text-green-600"),
      icon(FaHtml5, "text-orange-500"),
      icon(FaCss3Alt, "text-blue-500"),
    ];
    return buckets[(b - 1 + buckets.length) % buckets.length];
  }

  return icon(FaCode, "text-gray-500");
}

const TopicChip = ({ label }) => (
  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
    {label}
  </span>
);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems = [], clearCart } = useContext(CartContext);
  const { isLoggedIn, user, token } = useContext(AuthContext);

  // Addresses
  const [billing, setBilling] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });
  const [shipping, setShipping] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });
  const [sameAsBilling, setSameAsBilling] = useState(false);

  // Saved addresses
  const [savedBillingAddress, setSavedBillingAddress] = useState(null);
  const [savedShippingAddresses, setSavedShippingAddresses] = useState([]);

  // Guards: avoid overwriting user input after they type
  const prefilledRef = useRef({ billing: false, shipping: false });
  const editedRef = useRef({ billing: false, shipping: false });

  const userId = user?._id || user?.id || localStorage.getItem("userId") || null;

  /* Prefill from saved addresses (if logged in) */
  useEffect(() => {
    if (!isLoggedIn || !token) return;
    (async () => {
      try {
        const { data } = await axios.get(`${globalBackendRoute}/api/get-addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const billingSaved = data.find((a) => a.type === "billing" && a.isDefault);
        const shippingList = data.filter((a) => a.type === "shipping");

        if (billingSaved && !editedRef.current.billing) {
          setSavedBillingAddress(billingSaved);
          setBilling((prev) => ({
            ...prev,
            addressLine1: billingSaved.addressLine1 || billingSaved.street || prev.addressLine1 || "",
            addressLine2: billingSaved.addressLine2 || prev.addressLine2 || "",
            city: billingSaved.city || prev.city || "",
            state: billingSaved.state || prev.state || "",
            postalCode: billingSaved.postalCode || prev.postalCode || "",
            country: billingSaved.country || prev.country || "India",
            isDefault: !!billingSaved.isDefault,
          }));
          prefilledRef.current.billing = true;
        }

        if (shippingList.length > 0 && !editedRef.current.shipping) {
          setSavedShippingAddresses(shippingList);
          const s0 = shippingList[0] || {};
          setShipping((prev) => ({
            ...prev,
            addressLine1: s0.addressLine1 || s0.street || prev.addressLine1 || "",
            addressLine2: s0.addressLine2 || prev.addressLine2 || "",
            city: s0.city || prev.city || "",
            state: s0.state || prev.state || "",
            postalCode: s0.postalCode || prev.postalCode || "",
            country: s0.country || prev.country || "India",
            isDefault: !!s0.isDefault,
          }));
          prefilledRef.current.shipping = true;
        }
      } catch (err) {
        console.error("Address fetch error:", err);
      }
    })();
  }, [isLoggedIn, token]);

  /* Prefill from user profile ONLY if not prefilled & not edited */
  useEffect(() => {
    if (!isLoggedIn || !userId || !token) return;

    (async () => {
      try {
        const { data } = await axios.get(
          `${globalBackendRoute}/api/getUserById/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const u = data?.user || data?.data || data;
        const addr = u?.address || {};

        const fallback = {
          addressLine1: addr.street || "",
          addressLine2: addr.addressLine2 || "",
          city: addr.city || "",
          state: addr.state || "",
          postalCode: addr.postalCode || "",
          country: addr.country || "India",
          isDefault: false,
        };

        if (!prefilledRef.current.billing && !editedRef.current.billing) {
          const isBillingEmpty =
            !billing.addressLine1 && !billing.city && !billing.state && !billing.postalCode;
          if (isBillingEmpty) {
            setBilling((prev) => ({ ...prev, ...fallback }));
            prefilledRef.current.billing = true;
          }
        }

        if (!prefilledRef.current.shipping && !editedRef.current.shipping) {
          const isShippingEmpty =
            !shipping.addressLine1 && !shipping.city && !shipping.state && !shipping.postalCode;
          if (isShippingEmpty) {
            setShipping((prev) => ({ ...prev, ...fallback }));
            prefilledRef.current.shipping = true;
          }
        }
      } catch (err) {
        console.error("User fetch error:", err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, userId, token]);

  /* Input change handler (marks the form as edited) */
  const handleInputChange = (e, setter, formKey) => {
    const { name, value, type, checked } = e.target;
    editedRef.current[formKey] = true; // prevent future auto-prefill from overwriting
    setter((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  /* Address form (controlled) */
  const AddressForm = ({ title, address, setter, formKey }) => (
    <div className="border rounded-xl bg-white">
      <div className="px-4 py-3 border-b bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700 tracking-tight flex items-center gap-2">
          <FaMapMarkerAlt className="text-orange-500" />
          {title}
        </h2>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Address Line 1</label>
          <input
            name="addressLine1"
            value={address.addressLine1 || ""}
            onChange={(e) => handleInputChange(e, setter, formKey)}
            placeholder="Street, building, etc."
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Address Line 2</label>
          <input
            name="addressLine2"
            value={address.addressLine2 || ""}
            onChange={(e) => handleInputChange(e, setter, formKey)}
            placeholder="Apartment, suite…"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">City</label>
          <input
            name="city"
            value={address.city || ""}
            onChange={(e) => handleInputChange(e, setter, formKey)}
            placeholder="City"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">State</label>
          <input
            name="state"
            value={address.state || ""}
            onChange={(e) => handleInputChange(e, setter, formKey)}
            placeholder="State"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Postal Code</label>
          <input
            name="postalCode"
            value={address.postalCode || ""}
            onChange={(e) => handleInputChange(e, setter, formKey)}
            placeholder="PIN"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Country</label>
          <input
            name="country"
            value={address.country || ""}
            onChange={(e) => handleInputChange(e, setter, formKey)}
            placeholder="Country"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <label className="sm:col-span-2 flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            name="isDefault"
            checked={address.isDefault || false}
            onChange={(e) => handleInputChange(e, setter, formKey)}
            className="accent-orange-500"
          />
          <FaStar className="text-yellow-500" />
          Set as default
        </label>
      </div>
    </div>
  );

  /* Place order */
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.info("Your cart is empty.");
      return;
    }

    const finalShipping = sameAsBilling ? billing : shipping;

    if (!billing.addressLine1 || !billing.city || !finalShipping.addressLine1 || !finalShipping.city) {
      toast.error("Please fill all required fields in billing/shipping.");
      return;
    }

    try {
      // Save default addresses (only if logged in and nothing saved yet)
      if (isLoggedIn && token && !savedBillingAddress) {
        await axios.post(
          `${globalBackendRoute}/api/add-address`,
          { ...billing, type: "billing" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      if (isLoggedIn && token && !sameAsBilling && savedShippingAddresses.length === 0) {
        await axios.post(
          `${globalBackendRoute}/api/add-address`,
          { ...shipping, type: "shipping" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      await axios.post(
        `${globalBackendRoute}/api/place-order`,
        {
          billingAddress: billing,
          shippingAddress: finalShipping,
          items: cartItems,
          totalAmount: 0,
        },
        isLoggedIn && token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {}
      );

      toast.success("Order placed successfully!");
      clearCart();
      navigate(isLoggedIn && userId ? `/my-courses/${userId}` : "/thank-you");
    } catch (err) {
      console.error("Order error:", err?.message || err);
      toast.error("Order failed.");
    }
  };

  return (
    <div className="container">
      <div className="blog_header_section">
        <Breadcrumb pageTitle="Checkout" />
      </div>

      <div className="px-4 md:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <section className="lg:col-span-2 space-y-4">
            <AddressForm title="Billing Address" address={billing} setter={setBilling} formKey="billing" />

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={sameAsBilling}
                onChange={() => setSameAsBilling((v) => !v)}
                id="same-as-billing"
                className="accent-purple-600"
              />
              <label htmlFor="same-as-billing">Shipping same as billing</label>
            </div>

            {!sameAsBilling && (
              <AddressForm title="Shipping Address" address={shipping} setter={setShipping} formKey="shipping" />
            )}
          </section>

          {/* RIGHT */}
          <aside className="lg:col-span-1">
            <div className="border rounded-xl bg-white overflow-hidden">
              <div className="px-4 py-3 border-b bg-gray-50 flex items-center gap-2">
                <FaShoppingCart className="text-orange-500" />
                <h3 className="text-sm font-semibold text-gray-700 tracking-tight">
                  Your Courses ({cartItems.length})
                </h3>
              </div>

              {cartItems.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">Your cart is empty.</div>
              ) : (
                <ul className="divide-y">
                  {cartItems.map((item) => {
                    const { Icon, cls } = iconFromKey(item.iconKey, item.tags);
                    const topics = Array.isArray(item.tags) ? item.tags.slice(0, 3) : [];
                    return (
                      <li key={item._id} className="px-4 py-3 flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Icon className={`text-xl ${cls}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4
                              className="text-sm font-semibold text-gray-800 line-clamp-2"
                              title={item.title}
                            >
                              {item.title || "Untitled Course"}
                            </h4>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap">
                              {item.level || "Course"}
                            </span>
                          </div>
                          {topics.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {topics.map((t, i) => (
                                <TopicChip key={i} label={String(t)} />
                              ))}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="p-4 border-t space-y-3">
                <p className="text-xs text-gray-500">
                  Pricing is currently disabled. You can proceed to complete your enrollment.
                </p>

                <button
                  onClick={handlePlaceOrder}
                  disabled={cartItems.length === 0}
                  className={`w-full text-sm py-2 rounded-full font-semibold transition ${
                    cartItems.length === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Place Order
                </button>

                <Link
                  to="/cart"
                  className="block text-center text-xs text-gray-600 hover:text-purple-600"
                >
                  ← Review cart
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
