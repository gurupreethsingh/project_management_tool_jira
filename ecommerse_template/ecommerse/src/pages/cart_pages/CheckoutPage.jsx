// import React, { useState, useEffect, useContext } from "react";
// import {
//   FaMoneyBillWave,
//   FaShoppingCart,
//   FaArrowLeft,
//   FaMapMarkerAlt,
//   FaBuilding,
//   FaCity,
//   FaGlobeAsia,
//   FaMailBulk,
//   FaFlag,
//   FaStar,
// } from "react-icons/fa";
// import { CartContext } from "../../components/cart_components/CartContext";
// import { AuthContext } from "../../components/auth_components/AuthManager";
// import { toast } from "react-toastify";
// import { Link, useNavigate } from "react-router-dom";
// import globalBackendRoute from "../../config/Config";
// import axios from "axios";

// const CheckoutPage = () => {
//   const { cartItems, clearCart } = useContext(CartContext);
//   const { isLoggedIn, user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // At the top
//   const [guestInfo, setGuestInfo] = useState({
//     guestName: "",
//     guestEmail: "",
//     guestPhone: "",
//   });

//   const [billing, setBilling] = useState({
//     addressLine1: "",
//     addressLine2: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     country: "India",
//     isDefault: false,
//   });

//   const [shipping, setShipping] = useState({
//     addressLine1: "",
//     addressLine2: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     country: "India",
//     isDefault: false,
//   });

//   const [sameAsBilling, setSameAsBilling] = useState(false);
//   const [savedBillingAddress, setSavedBillingAddress] = useState(null);
//   const [savedShippingAddresses, setSavedShippingAddresses] = useState([]);

//   const totalAmount = cartItems.reduce(
//     (total, item) => total + item.selling_price * item.quantity,
//     0
//   );

//   useEffect(() => {
//     if (isLoggedIn) fetchSavedAddresses();
//   }, [isLoggedIn]);

//   const fetchSavedAddresses = async () => {
//     try {
//       const { data } = await axios.get(
//         `${globalBackendRoute}/api/get-addresses`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       const billingSaved = data.find(
//         (a) => a.type === "billing" && a.isDefault
//       );
//       const shippingList = data.filter((a) => a.type === "shipping");

//       if (billingSaved) {
//         setSavedBillingAddress(billingSaved);
//         setBilling({ ...billing, ...billingSaved });
//       }
//       if (shippingList.length > 0) {
//         setSavedShippingAddresses(shippingList);
//         setShipping({ ...shipping, ...shippingList[0] });
//       }
//     } catch (err) {
//       console.error("Address fetch error:", err);
//     }
//   };

//   const handleInputChange = (e, setter) => {
//     const { name, value, type, checked } = e.target;
//     setter((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const renderAddressForm = (title, address, setter) => {
//     const iconMap = {
//       addressLine1: [FaMapMarkerAlt, "orange", "Street, building, etc."],
//       addressLine2: [FaBuilding, "blue", "Apartment, suite..."],
//       city: [FaCity, "green", "City"],
//       state: [FaGlobeAsia, "purple", "State"],
//       postalCode: [FaMailBulk, "pink", "PIN"],
//       country: [FaFlag, "red", "Country"],
//     };

//     return (
//       <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4">
//         <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//           <FaMapMarkerAlt className="text-orange-500" />
//           {title}
//         </h2>
//         {Object.entries(iconMap).map(([key, [Icon, color, placeholder]]) => (
//           <div
//             key={key}
//             className="flex items-center w-full gap-3 mb-2 sm:mb-0"
//           >
//             <label className="w-32 text-sm text-gray-700 flex items-center gap-2">
//               <Icon className={`text-${color}-500`} />
//               {key.charAt(0).toUpperCase() + key.slice(1)}
//             </label>
//             <input
//               type="text"
//               name={key}
//               value={address[key] || ""}
//               onChange={(e) => handleInputChange(e, setter)}
//               placeholder={placeholder}
//               className="flex-1 border-b border-gray-300 outline-none py-1 text-gray-800 bg-transparent"
//             />
//           </div>
//         ))}
//         <label className="flex items-center gap-2 mt-4 text-sm text-gray-600">
//           <input
//             type="checkbox"
//             name="isDefault"
//             checked={address.isDefault || false}
//             onChange={(e) => handleInputChange(e, setter)}
//             className="accent-orange-500"
//           />
//           <FaStar className="text-yellow-500" />
//           Set as default
//         </label>
//       </div>
//     );
//   };

//   const handlePlaceOrder = async () => {
//     const finalShipping = sameAsBilling ? billing : shipping;

//     if (
//       !billing.addressLine1 ||
//       !billing.city ||
//       !finalShipping.addressLine1 ||
//       !finalShipping.city
//     ) {
//       toast.error("Please fill all required fields in billing/shipping.");
//       return;
//     }

//     try {
//       if (isLoggedIn && !savedBillingAddress) {
//         await axios.post(
//           `${globalBackendRoute}/api/add-address`,
//           { ...billing, type: "billing" },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//       }

//       if (isLoggedIn && !sameAsBilling && savedShippingAddresses.length === 0) {
//         await axios.post(
//           `${globalBackendRoute}/api/add-address`,
//           { ...shipping, type: "shipping" },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//       }

//       await axios.post(
//         `${globalBackendRoute}/api/place-order`,
//         {
//           billingAddress: billing,
//           shippingAddress: finalShipping,
//           items: cartItems,
//           totalAmount,
//           // userId: isLoggedIn ? user._id : null,
//         },
//         isLoggedIn
//           ? {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//               },
//             }
//           : {}
//       );

//       toast.success("Order placed successfully!");
//       navigate(isLoggedIn ? "/my-orders" : "/thank-you");
//       clearCart();
//     } catch (err) {
//       console.error("Order error:", err.message);
//       toast.error("Order failed.");
//     }
//   };

//   const getImageUrl = (img) => {
//     if (!img) return "https://via.placeholder.com/150";
//     const normalized = img.replace(/\\/g, "/").split("/").pop();
//     return `${globalBackendRoute}/uploads/products/${normalized}`;
//   };

//   return (
//     <div className="py-10 px-4 animate-fadeIn font-sans">
//       <h1 className="text-4xl font-extrabold text-gray-900 mb-10 flex items-center gap-3">
//         <FaMoneyBillWave className="text-orange-500" /> Checkout
//       </h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//         <div className="space-y-8">
//           {renderAddressForm("Billing Address", billing, setBilling)}
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <input
//               type="checkbox"
//               checked={sameAsBilling}
//               onChange={() => setSameAsBilling(!sameAsBilling)}
//             />
//             Same as Billing
//           </div>
//           {!sameAsBilling &&
//             renderAddressForm("Shipping Address", shipping, setShipping)}
//         </div>

//         <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6 self-start">
//           <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//             <FaShoppingCart /> Your Cart
//           </h2>

//           {cartItems.map((item) => (
//             <div
//               key={item._id}
//               className="flex justify-between items-center border-b pb-3"
//             >
//               <div className="flex items-center gap-4">
//                 <img
//                   src={getImageUrl(item.product_image)}
//                   alt={item.product_name}
//                   className="w-16 h-16 object-cover rounded-lg border"
//                 />
//                 <div>
//                   <p className="font-semibold text-gray-800">
//                     {item.product_name}
//                   </p>
//                   <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                 </div>
//               </div>
//               <p className="font-semibold text-black text-lg">
//                 ₹{item.selling_price * item.quantity}
//               </p>
//             </div>
//           ))}

//           <div className="flex justify-between items-center mt-6 border-t pt-4">
//             <h3 className="text-xl font-bold text-gray-700">Total</h3>
//             <h3 className="text-xl font-bold text-black">
//               ₹{totalAmount.toFixed(2)}
//             </h3>
//           </div>

//           <button
//             onClick={handlePlaceOrder}
//             className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:opacity-90 transition text-lg"
//           >
//             Place Order
//           </button>
//         </div>
//       </div>

//       <div className="mt-12 text-center">
//         <Link to="/shop">
//           <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition text-sm font-medium">
//             <FaArrowLeft /> Back to Shop
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

//

// ✅ file: src/pages/shop_pages/CheckoutPage.jsx
// ✅ ONLY UI updated (logic unchanged)
// - Same theme as Shop/SingleProduct
// - Clean address cards
// - Cart summary styled + orange→amber Place Order button
// - No colored label icons, no bright borders, consistent spacing

import React, { useState, useEffect, useContext } from "react";
import {
  FaMoneyBillWave,
  FaShoppingCart,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaBuilding,
  FaCity,
  FaGlobeAsia,
  FaMailBulk,
  FaFlag,
  FaStar,
} from "react-icons/fa";
import { CartContext } from "../../components/cart_components/CartContext";
import { AuthContext } from "../../components/auth_components/AuthManager";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";
import axios from "axios";
import { motion } from "framer-motion";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // At the top
  const [guestInfo, setGuestInfo] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
  });

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
  const [savedBillingAddress, setSavedBillingAddress] = useState(null);
  const [savedShippingAddresses, setSavedShippingAddresses] = useState([]);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.selling_price * item.quantity,
    0
  );

  useEffect(() => {
    if (isLoggedIn) fetchSavedAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const fetchSavedAddresses = async () => {
    try {
      const { data } = await axios.get(
        `${globalBackendRoute}/api/get-addresses`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const billingSaved = (data || []).find(
        (a) => a.type === "billing" && a.isDefault
      );
      const shippingList = (data || []).filter((a) => a.type === "shipping");

      if (billingSaved) {
        setSavedBillingAddress(billingSaved);
        setBilling({ ...billing, ...billingSaved });
      }
      if (shippingList.length > 0) {
        setSavedShippingAddresses(shippingList);
        setShipping({ ...shipping, ...shippingList[0] });
      }
    } catch (err) {
      console.error("Address fetch error:", err);
    }
  };

  const handleInputChange = (e, setter) => {
    const { name, value, type, checked } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const renderAddressForm = (title, address, setter) => {
    const iconMap = {
      addressLine1: [FaMapMarkerAlt, "Street, building, etc."],
      addressLine2: [FaBuilding, "Apartment, suite..."],
      city: [FaCity, "City"],
      state: [FaGlobeAsia, "State"],
      postalCode: [FaMailBulk, "PIN"],
      country: [FaFlag, "Country"],
    };

    return (
      <div
        className="rounded-3xl bg-white p-6 space-y-4"
        style={{ border: "1px solid rgb(241,245,249)", boxShadow: "none" }}
      >
        <h2 className="text-[16px] font-extrabold text-slate-900 flex items-center gap-2">
          <FaMapMarkerAlt className="text-orange-600" />
          {title}
        </h2>

        <div className="space-y-3">
          {Object.entries(iconMap).map(([key, [Icon, placeholder]]) => (
            <div key={key} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-slate-50 inline-flex items-center justify-center flex-shrink-0">
                <Icon className="text-slate-700" />
              </div>

              <div className="w-full">
                <label className="block text-[11px] font-extrabold text-slate-600 uppercase mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="text"
                  name={key}
                  value={address[key] || ""}
                  onChange={(e) => handleInputChange(e, setter)}
                  placeholder={placeholder}
                  className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-900 outline-none"
                  style={{ border: "1px solid rgb(241,245,249)" }}
                />
              </div>
            </div>
          ))}
        </div>

        <label className="flex items-center gap-2 mt-3 text-[12px] font-semibold text-slate-600">
          <input
            type="checkbox"
            name="isDefault"
            checked={address.isDefault || false}
            onChange={(e) => handleInputChange(e, setter)}
            className="accent-orange-500"
          />
          <FaStar className="text-amber-500" />
          Set as default
        </label>
      </div>
    );
  };

  const handlePlaceOrder = async () => {
    const finalShipping = sameAsBilling ? billing : shipping;

    if (
      !billing.addressLine1 ||
      !billing.city ||
      !finalShipping.addressLine1 ||
      !finalShipping.city
    ) {
      toast.error("Please fill all required fields in billing/shipping.");
      return;
    }

    try {
      if (isLoggedIn && !savedBillingAddress) {
        await axios.post(
          `${globalBackendRoute}/api/add-address`,
          { ...billing, type: "billing" },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      if (isLoggedIn && !sameAsBilling && savedShippingAddresses.length === 0) {
        await axios.post(
          `${globalBackendRoute}/api/add-address`,
          { ...shipping, type: "shipping" },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      await axios.post(
        `${globalBackendRoute}/api/place-order`,
        {
          billingAddress: billing,
          shippingAddress: finalShipping,
          items: cartItems,
          totalAmount,
        },
        isLoggedIn
          ? {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          : {}
      );

      toast.success("Order placed successfully!");
      navigate(isLoggedIn ? "/my-orders" : "/thank-you");
      clearCart();
    } catch (err) {
      console.error("Order error:", err.message);
      toast.error("Order failed.");
    }
  };

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/600x600";
    const normalized = String(img).replace(/\\/g, "/").split("/").pop();
    return `${globalBackendRoute}/uploads/products/${normalized}`;
  };

  return (
    <div className="co-font co-scope w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .co-font{
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
          padding: 0.8rem 1.2rem;
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
            <h1 className="text-[22px] sm:text-[28px] font-extrabold text-slate-900 flex items-center gap-3">
              <FaMoneyBillWave className="text-orange-500" /> Checkout
            </h1>
            <p className="mt-1 text-[12px] font-semibold text-slate-500">
              Fill billing/shipping details and place your order.
            </p>
          </div>

          <Link to="/shop" className="hidden sm:inline-flex btnGhost">
            Continue shopping
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: forms */}
          <div className="space-y-6">
            {renderAddressForm("Billing Address", billing, setBilling)}

            <div className="flex items-center gap-3 rounded-3xl bg-slate-50 px-4 py-4">
              <input
                type="checkbox"
                checked={sameAsBilling}
                onChange={() => setSameAsBilling(!sameAsBilling)}
                className="accent-orange-500"
              />
              <div>
                <p className="text-[12px] font-extrabold text-slate-800">
                  Shipping same as billing
                </p>
                <p className="text-[12px] font-semibold text-slate-500">
                  Use billing address for shipping too.
                </p>
              </div>
            </div>

            {!sameAsBilling &&
              renderAddressForm("Shipping Address", shipping, setShipping)}
          </div>

          {/* Right: cart summary */}
          <div
            className="rounded-3xl bg-white p-6 self-start"
            style={{ border: "1px solid rgb(241,245,249)", boxShadow: "none" }}
          >
            <h2 className="text-[16px] font-extrabold text-slate-900 flex items-center gap-2">
              <FaShoppingCart className="text-orange-500" /> Your Cart
            </h2>

            <div className="mt-5 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0"
                      style={{ border: "1px solid rgb(241,245,249)" }}
                    >
                      <img
                        src={getImageUrl(item.product_image)}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[13px] font-extrabold text-slate-900 truncate">
                        {item.product_name}
                      </p>
                      <p className="text-[12px] font-semibold text-slate-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="text-[13px] font-black text-slate-900">
                    ₹{item.selling_price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4 flex items-center justify-between">
              <h3 className="text-[13px] font-extrabold text-slate-700">
                Total
              </h3>
              <h3 className="text-[18px] font-black text-slate-900">
                ₹{totalAmount.toFixed(2)}
              </h3>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="btnOrange w-full mt-5"
              type="button"
            >
              Place Order
            </button>

            <div className="mt-6 text-center">
              <Link to="/shop">
                <button
                  className="btnGhost inline-flex items-center gap-2"
                  type="button"
                >
                  <FaArrowLeft /> Back to Shop
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;
