// import React, { useState, useEffect, useContext, useMemo } from "react";
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
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronDown } from "lucide-react";

// const CheckoutPage = () => {
//   const { cartItems, clearCart } = useContext(CartContext);
//   const { isLoggedIn } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // kept (logic unchanged)
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

//   const [sameAsBilling, setSameAsBilling] = useState(true);
//   const [savedBillingAddress, setSavedBillingAddress] = useState(null);
//   const [savedShippingAddresses, setSavedShippingAddresses] = useState([]);

//   // ✅ accordion states (UI only)
//   const [openBilling, setOpenBilling] = useState(true);
//   const [openShipping, setOpenShipping] = useState(false);

//   const totalAmount = cartItems.reduce(
//     (total, item) => total + item.selling_price * item.quantity,
//     0
//   );

//   useEffect(() => {
//     if (isLoggedIn) fetchSavedAddresses();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isLoggedIn]);

//   const fetchSavedAddresses = async () => {
//     try {
//       const { data } = await axios.get(
//         `${globalBackendRoute}/api/get-addresses`,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );

//       const billingSaved = (data || []).find(
//         (a) => a.type === "billing" && a.isDefault
//       );
//       const shippingList = (data || []).filter((a) => a.type === "shipping");

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

//   const getImageUrl = (img) => {
//     if (!img) return "https://via.placeholder.com/600x600";
//     const normalized = String(img).replace(/\\/g, "/").split("/").pop();
//     return `${globalBackendRoute}/uploads/products/${normalized}`;
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

//   // ✅ small helper (UI only)
//   const AddressField = ({
//     Icon,
//     label,
//     name,
//     value,
//     placeholder,
//     onChange,
//     className = "",
//   }) => (
//     <div className={`flex items-center gap-3 ${className}`}>
//       <div className="h-9 w-9 rounded-2xl bg-slate-50 inline-flex items-center justify-center flex-shrink-0">
//         <Icon className="text-slate-700 text-[14px]" />
//       </div>
//       <div className="w-full">
//         <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">
//           {label}
//         </label>
//         <input
//           type="text"
//           name={name}
//           value={value || ""}
//           onChange={onChange}
//           placeholder={placeholder}
//           className="w-full rounded-2xl bg-slate-50 px-3 py-2.5 text-[13px] font-semibold text-slate-900 outline-none"
//           style={{ border: "1px solid rgb(241,245,249)" }}
//         />
//       </div>
//     </div>
//   );

//   const AddressAccordion = ({
//     title,
//     open,
//     setOpen,
//     address,
//     setter,
//     showDefaultToggle,
//   }) => {
//     return (
//       <div
//         className="rounded-3xl bg-white overflow-hidden"
//         style={{ border: "1px solid rgb(241,245,249)", boxShadow: "none" }}
//       >
//         {/* header */}
//         <button
//           type="button"
//           onClick={() => setOpen((v) => !v)}
//           className="w-full px-4 sm:px-5 py-3 flex items-center justify-between gap-3"
//         >
//           <div className="flex items-center gap-2 min-w-0">
//             <div className="h-9 w-9 rounded-2xl bg-slate-50 inline-flex items-center justify-center flex-shrink-0">
//               <FaMapMarkerAlt className="text-orange-600" />
//             </div>
//             <div className="min-w-0 text-left">
//               <p className="text-[13px] sm:text-[14px] font-extrabold text-slate-900 truncate">
//                 {title}
//               </p>
//               <p className="text-[12px] font-semibold text-slate-500 truncate">
//                 {address?.addressLine1
//                   ? `${address.addressLine1}${
//                       address.city ? ` • ${address.city}` : ""
//                     }`
//                   : "Tap to add address details"}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             {showDefaultToggle && (
//               <label
//                 className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-slate-600"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <input
//                   type="checkbox"
//                   name="isDefault"
//                   checked={address.isDefault || false}
//                   onChange={(e) => handleInputChange(e, setter)}
//                   className="accent-orange-500"
//                 />
//                 <FaStar className="text-amber-500" />
//                 Default
//               </label>
//             )}

//             <motion.span
//               animate={{ rotate: open ? 180 : 0 }}
//               transition={{ duration: 0.18 }}
//               className="h-9 w-9 rounded-2xl bg-slate-50 inline-flex items-center justify-center"
//             >
//               <ChevronDown className="h-4 w-4 text-slate-700" />
//             </motion.span>
//           </div>
//         </button>

//         {/* body */}
//         <AnimatePresence initial={false}>
//           {open && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ duration: 0.22 }}
//               className="px-4 sm:px-5 pb-4"
//             >
//               <div className="pt-2 space-y-3">
//                 <AddressField
//                   Icon={FaMapMarkerAlt}
//                   label="AddressLine1"
//                   name="addressLine1"
//                   value={address.addressLine1}
//                   placeholder="Street, building, etc."
//                   onChange={(e) => handleInputChange(e, setter)}
//                 />

//                 <AddressField
//                   Icon={FaBuilding}
//                   label="AddressLine2"
//                   name="addressLine2"
//                   value={address.addressLine2}
//                   placeholder="Apartment, suite..."
//                   onChange={(e) => handleInputChange(e, setter)}
//                 />

//                 {/* ✅ combined row: City + State */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   <AddressField
//                     Icon={FaCity}
//                     label="City"
//                     name="city"
//                     value={address.city}
//                     placeholder="City"
//                     onChange={(e) => handleInputChange(e, setter)}
//                   />
//                   <AddressField
//                     Icon={FaGlobeAsia}
//                     label="State"
//                     name="state"
//                     value={address.state}
//                     placeholder="State"
//                     onChange={(e) => handleInputChange(e, setter)}
//                   />
//                 </div>

//                 {/* ✅ combined row: PIN + Country */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   <AddressField
//                     Icon={FaMailBulk}
//                     label="PostalCode"
//                     name="postalCode"
//                     value={address.postalCode}
//                     placeholder="PIN"
//                     onChange={(e) => handleInputChange(e, setter)}
//                   />
//                   <AddressField
//                     Icon={FaFlag}
//                     label="Country"
//                     name="country"
//                     value={address.country}
//                     placeholder="Country"
//                     onChange={(e) => handleInputChange(e, setter)}
//                   />
//                 </div>

//                 {/* default toggle on mobile (kept compact) */}
//                 {showDefaultToggle && (
//                   <label className="sm:hidden flex items-center gap-2 text-[11px] font-semibold text-slate-600 pt-1">
//                     <input
//                       type="checkbox"
//                       name="isDefault"
//                       checked={address.isDefault || false}
//                       onChange={(e) => handleInputChange(e, setter)}
//                       className="accent-orange-500"
//                     />
//                     <FaStar className="text-amber-500" />
//                     Set as default
//                   </label>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     );
//   };

//   const cartCountText = useMemo(() => {
//     const count = (cartItems || []).reduce(
//       (sum, it) => sum + (it?.quantity || 0),
//       0
//     );
//     return count;
//   }, [cartItems]);

//   return (
//     <div className="co-font co-scope w-full">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
//         .co-font{
//           font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
//         }

//         .btnOrange{
//           border-radius: 9999px;
//           background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36));
//           padding: 0.75rem 1.2rem;
//           color: white;
//           font-weight: 900;
//           font-size: 13px;
//           box-shadow: 0 18px 30px -18px rgba(249,115,22,0.45);
//           transition: opacity .15s ease, transform .15s ease;
//           will-change: transform;
//         }
//         .btnOrange:hover{ opacity: .95; }
//         .btnOrange:active{ transform: scale(.99); }

//         .btnGhost{
//           border-radius: 9999px;
//           padding: 0.7rem 1.0rem;
//           font-weight: 900;
//           font-size: 12px;
//           color: rgb(30,41,59);
//           background: rgba(241,245,249,.8);
//           transition: background .15s ease, transform .15s ease;
//         }
//         .btnGhost:hover{ background: rgba(226,232,240,.95); }
//         .btnGhost:active{ transform: scale(.99); }

//         .cartScroll{
//           max-height: 290px;
//           overflow: auto;
//           padding-right: 6px;
//         }
//         @media (min-width: 1024px){
//           .cartScroll{ max-height: 360px; }
//         }
//       `}</style>

//       <motion.div
//         className="w-full px-3 sm:px-6 lg:px-10 2xl:px-16 py-4 sm:py-6"
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//       >
//         <div className="w-full max-w-[1700px] mx-auto">
//           {/* Header (compact) */}
//           <div className="flex items-end justify-between gap-4">
//             <div className="min-w-0">
//               <h1 className="text-[20px] sm:text-[24px] font-extrabold text-slate-900 flex items-center gap-3">
//                 <FaMoneyBillWave className="text-orange-500" /> Checkout
//                 <span className="hidden sm:inline text-[12px] font-semibold text-slate-500">
//                   ({cartCountText} items)
//                 </span>
//               </h1>
//               <p className="mt-1 text-[12px] font-semibold text-slate-500">
//                 Add address details and place your order.
//               </p>
//             </div>

//             <Link to="/shop" className="hidden sm:inline-flex btnGhost">
//               Continue shopping
//             </Link>
//           </div>

//           <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
//             {/* Left: accordions */}
//             <div className="space-y-4">
//               <AddressAccordion
//                 title="Billing Address"
//                 open={openBilling}
//                 setOpen={(fn) => setOpenBilling(fn)}
//                 address={billing}
//                 setter={setBilling}
//                 showDefaultToggle={true}
//               />

//               <div className="flex items-center justify-between gap-3 rounded-3xl bg-slate-50 px-4 py-3">
//                 <label className="flex items-center gap-3">
//                   <input
//                     type="checkbox"
//                     checked={sameAsBilling}
//                     onChange={() => {
//                       const next = !sameAsBilling;
//                       setSameAsBilling(next);
//                       if (next) setOpenShipping(false);
//                     }}
//                     className="accent-orange-500"
//                   />
//                   <div className="min-w-0">
//                     <p className="text-[12px] font-extrabold text-slate-800">
//                       Shipping same as billing
//                     </p>
//                     <p className="text-[12px] font-semibold text-slate-500 truncate">
//                       Use billing address for shipping too.
//                     </p>
//                   </div>
//                 </label>

//                 {!sameAsBilling && (
//                   <button
//                     type="button"
//                     className="btnGhost"
//                     onClick={() => setOpenShipping(true)}
//                   >
//                     Edit shipping
//                   </button>
//                 )}
//               </div>

//               {!sameAsBilling && (
//                 <AddressAccordion
//                   title="Shipping Address"
//                   open={openShipping}
//                   setOpen={(fn) => setOpenShipping(fn)}
//                   address={shipping}
//                   setter={setShipping}
//                   showDefaultToggle={false}
//                 />
//               )}

//               {/* mobile continue shopping */}
//               <div className="sm:hidden flex justify-center">
//                 <Link to="/shop" className="btnGhost inline-flex">
//                   Continue shopping
//                 </Link>
//               </div>
//             </div>

//             {/* Right: cart summary (compact + scroll + sticky total/CTA) */}
//             <div
//               className="rounded-3xl bg-white p-4 sm:p-5 self-start"
//               style={{
//                 border: "1px solid rgb(241,245,249)",
//                 boxShadow: "none",
//               }}
//             >
//               <div className="flex items-center justify-between gap-3">
//                 <h2 className="text-[14px] sm:text-[15px] font-extrabold text-slate-900 flex items-center gap-2">
//                   <FaShoppingCart className="text-orange-500" /> Your Cart
//                 </h2>
//                 <span className="text-[12px] font-semibold text-slate-500">
//                   {cartItems.length} products
//                 </span>
//               </div>

//               <div className="mt-4 cartScroll space-y-3">
//                 {cartItems.map((item) => (
//                   <div
//                     key={item._id}
//                     className="flex items-center justify-between gap-4"
//                   >
//                     <div className="flex items-center gap-3 min-w-0">
//                       <div
//                         className="h-12 w-12 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0"
//                         style={{ border: "1px solid rgb(241,245,249)" }}
//                       >
//                         <img
//                           src={getImageUrl(item.product_image)}
//                           alt={item.product_name}
//                           className="w-full h-full object-cover"
//                           loading="lazy"
//                         />
//                       </div>

//                       <div className="min-w-0">
//                         <p className="text-[12.5px] font-extrabold text-slate-900 truncate">
//                           {item.product_name}
//                         </p>
//                         <p className="text-[12px] font-semibold text-slate-500">
//                           Qty: {item.quantity}
//                         </p>
//                       </div>
//                     </div>

//                     <p className="text-[13px] font-black text-slate-900">
//                       ₹{item.selling_price * item.quantity}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-4 pt-4 border-t">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-[12px] font-extrabold text-slate-700">
//                     Total
//                   </h3>
//                   <h3 className="text-[18px] font-black text-slate-900">
//                     ₹{totalAmount.toFixed(2)}
//                   </h3>
//                 </div>

//                 <button
//                   onClick={handlePlaceOrder}
//                   className="btnOrange w-full mt-4"
//                   type="button"
//                 >
//                   Place Order
//                 </button>

//                 <div className="mt-4 text-center">
//                   <Link to="/shop">
//                     <button
//                       className="btnGhost inline-flex items-center gap-2"
//                       type="button"
//                     >
//                       <FaArrowLeft /> Back to Shop
//                     </button>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default CheckoutPage;

//

import React, { useState, useEffect, useContext, useMemo } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // kept (logic unchanged)
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

  // ✅ checked by default; user can uncheck
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [savedBillingAddress, setSavedBillingAddress] = useState(null);
  const [savedShippingAddresses, setSavedShippingAddresses] = useState([]);

  // ✅ accordion states (UI only)
  const [openBilling, setOpenBilling] = useState(true);
  const [openShipping, setOpenShipping] = useState(false);

  // ✅ MOBILE: cart accordion to reduce long page
  const [openCartMobile, setOpenCartMobile] = useState(false);

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

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/600x600";
    const normalized = String(img).replace(/\\/g, "/").split("/").pop();
    return `${globalBackendRoute}/uploads/products/${normalized}`;
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

  // ✅ small helper (UI only)
  const AddressField = ({
    Icon,
    label,
    name,
    value,
    placeholder,
    onChange,
    className = "",
  }) => (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="coFieldIcon h-9 w-9 rounded-2xl bg-slate-50 inline-flex items-center justify-center flex-shrink-0">
        <Icon className="text-slate-700 text-[14px]" />
      </div>
      <div className="w-full">
        <label className="coFieldLabel block text-[10px] font-extrabold text-slate-600 uppercase mb-1">
          {label}
        </label>
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className="coFieldInput w-full rounded-2xl bg-slate-50 px-3 py-2.5 text-[13px] font-semibold text-slate-900 outline-none"
          style={{ border: "1px solid rgb(241,245,249)" }}
        />
      </div>
    </div>
  );

  const AddressAccordion = ({
    title,
    open,
    setOpen,
    address,
    setter,
    showDefaultToggle,
  }) => {
    return (
      <div
        className="rounded-3xl bg-white overflow-hidden"
        style={{ border: "1px solid rgb(241,245,249)", boxShadow: "none" }}
      >
        {/* header */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full px-4 sm:px-5 py-3 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-9 w-9 rounded-2xl bg-slate-50 inline-flex items-center justify-center flex-shrink-0">
              <FaMapMarkerAlt className="text-orange-600" />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-[13px] sm:text-[14px] font-extrabold text-slate-900 truncate">
                {title}
              </p>
              <p className="text-[12px] font-semibold text-slate-500 truncate">
                {address?.addressLine1
                  ? `${address.addressLine1}${
                      address.city ? ` • ${address.city}` : ""
                    }`
                  : "Tap to add address details"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {showDefaultToggle && (
              <label
                className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-slate-600"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={address.isDefault || false}
                  onChange={(e) => handleInputChange(e, setter)}
                  className="accent-orange-500"
                />
                <FaStar className="text-amber-500" />
                Default
              </label>
            )}

            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.18 }}
              className="h-9 w-9 rounded-2xl bg-slate-50 inline-flex items-center justify-center"
            >
              <ChevronDown className="h-4 w-4 text-slate-700" />
            </motion.span>
          </div>
        </button>

        {/* body */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="px-4 sm:px-5 pb-4"
            >
              <div className="pt-2 space-y-3">
                <AddressField
                  Icon={FaMapMarkerAlt}
                  label="AddressLine1"
                  name="addressLine1"
                  value={address.addressLine1}
                  placeholder="Street, building, etc."
                  onChange={(e) => handleInputChange(e, setter)}
                />

                <AddressField
                  Icon={FaBuilding}
                  label="AddressLine2"
                  name="addressLine2"
                  value={address.addressLine2}
                  placeholder="Apartment, suite..."
                  onChange={(e) => handleInputChange(e, setter)}
                />

                {/* ✅ combined row: City + State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AddressField
                    Icon={FaCity}
                    label="City"
                    name="city"
                    value={address.city}
                    placeholder="City"
                    onChange={(e) => handleInputChange(e, setter)}
                  />
                  <AddressField
                    Icon={FaGlobeAsia}
                    label="State"
                    name="state"
                    value={address.state}
                    placeholder="State"
                    onChange={(e) => handleInputChange(e, setter)}
                  />
                </div>

                {/* ✅ combined row: PIN + Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AddressField
                    Icon={FaMailBulk}
                    label="PostalCode"
                    name="postalCode"
                    value={address.postalCode}
                    placeholder="PIN"
                    onChange={(e) => handleInputChange(e, setter)}
                  />
                  <AddressField
                    Icon={FaFlag}
                    label="Country"
                    name="country"
                    value={address.country}
                    placeholder="Country"
                    onChange={(e) => handleInputChange(e, setter)}
                  />
                </div>

                {/* default toggle on mobile (kept compact) */}
                {showDefaultToggle && (
                  <label className="sm:hidden flex items-center gap-2 text-[11px] font-semibold text-slate-600 pt-1">
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
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const cartCountText = useMemo(() => {
    const count = (cartItems || []).reduce(
      (sum, it) => sum + (it?.quantity || 0),
      0
    );
    return count;
  }, [cartItems]);

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
          padding: 0.75rem 1.2rem;
          color: white;
          font-weight: 900;
          font-size: 13px;
          box-shadow: 0 18px 30px -18px rgba(249,115,22,0.45);
          transition: opacity .15s ease, transform .15s ease;
          will-change: transform;
        }
        .btnOrange:hover{ opacity: .95; }
        .btnOrange:active{ transform: scale(.99); }

        .btnGhost{
          border-radius: 9999px;
          padding: 0.7rem 1.0rem;
          font-weight: 900;
          font-size: 12px;
          color: rgb(30,41,59);
          background: rgba(241,245,249,.8);
          transition: background .15s ease, transform .15s ease;
        }
        .btnGhost:hover{ background: rgba(226,232,240,.95); }
        .btnGhost:active{ transform: scale(.99); }

        .cartScroll{
          max-height: 290px;
          overflow: auto;
          padding-right: 6px;
        }
        @media (min-width: 1024px){
          .cartScroll{ max-height: 360px; }
        }

        /* ✅ MOBILE COMPACT MODE */
        @media (max-width: 640px){
          .coMobilePad{ padding-bottom: 92px; } /* space for sticky bar */
          .coFieldInput{ padding-top: .55rem; padding-bottom: .55rem; font-size: 12.5px; }
          .coFieldLabel{ font-size: 9px; margin-bottom: 3px; }
          .coFieldIcon{ height: 34px; width: 34px; border-radius: 16px; }
          .cartScroll{ max-height: 200px; }
          .coCartRowImg{ height: 40px; width: 40px; border-radius: 16px; }
          .coCartTitle{ font-size: 12px; }
          .coCartSub{ font-size: 11px; }
        }

        /* sticky bar only on mobile */
        .coStickyBar{
          position: sticky;
          bottom: 0;
          z-index: 50;
          backdrop-filter: blur(10px);
        }
      `}</style>

      <motion.div
        className="coMobilePad w-full px-3 sm:px-6 lg:px-10 2xl:px-16 py-4 sm:py-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full max-w-[1700px] mx-auto">
          {/* Header (compact) */}
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-[20px] sm:text-[24px] font-extrabold text-slate-900 flex items-center gap-3">
                <FaMoneyBillWave className="text-orange-500" /> Checkout
                <span className="hidden sm:inline text-[12px] font-semibold text-slate-500">
                  ({cartCountText} items)
                </span>
              </h1>
              <p className="mt-1 text-[12px] font-semibold text-slate-500">
                Add address details and place your order.
              </p>
            </div>

            <Link to="/shop" className="hidden sm:inline-flex btnGhost">
              Continue shopping
            </Link>
          </div>

          {/* ✅ MOBILE: Cart summary collapsible (prevents long page) */}
          <div className="sm:hidden mt-4">
            <div
              className="rounded-3xl bg-white overflow-hidden"
              style={{ border: "1px solid rgb(241,245,249)" }}
            >
              <button
                type="button"
                onClick={() => setOpenCartMobile((v) => !v)}
                className="w-full px-4 py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-9 w-9 rounded-2xl bg-slate-50 inline-flex items-center justify-center flex-shrink-0">
                    <FaShoppingCart className="text-orange-500" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-[13px] font-extrabold text-slate-900 truncate">
                      Cart Summary
                    </p>
                    <p className="text-[12px] font-semibold text-slate-500 truncate">
                      {cartItems.length} products • Total ₹
                      {totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <motion.span
                  animate={{ rotate: openCartMobile ? 180 : 0 }}
                  transition={{ duration: 0.18 }}
                  className="h-9 w-9 rounded-2xl bg-slate-50 inline-flex items-center justify-center"
                >
                  <ChevronDown className="h-4 w-4 text-slate-700" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openCartMobile && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="px-4 pb-4"
                  >
                    <div className="mt-2 cartScroll space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="coCartRowImg h-12 w-12 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0"
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
                              <p className="coCartTitle text-[12.5px] font-extrabold text-slate-900 truncate">
                                {item.product_name}
                              </p>
                              <p className="coCartSub text-[12px] font-semibold text-slate-500">
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Left: accordions */}
            <div className="space-y-4">
              <AddressAccordion
                title="Billing Address"
                open={openBilling}
                setOpen={(fn) => setOpenBilling(fn)}
                address={billing}
                setter={setBilling}
                showDefaultToggle={true}
              />

              <div className="flex items-center justify-between gap-3 rounded-3xl bg-slate-50 px-4 py-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={() => {
                      const next = !sameAsBilling;
                      setSameAsBilling(next);
                      if (next) setOpenShipping(false);
                    }}
                    className="accent-orange-500"
                  />
                  <div className="min-w-0">
                    <p className="text-[12px] font-extrabold text-slate-800">
                      Shipping same as billing
                    </p>
                    <p className="text-[12px] font-semibold text-slate-500 truncate">
                      Use billing address for shipping too.
                    </p>
                  </div>
                </label>

                {!sameAsBilling && (
                  <button
                    type="button"
                    className="btnGhost"
                    onClick={() => setOpenShipping(true)}
                  >
                    Edit
                  </button>
                )}
              </div>

              {!sameAsBilling && (
                <AddressAccordion
                  title="Shipping Address"
                  open={openShipping}
                  setOpen={(fn) => setOpenShipping(fn)}
                  address={shipping}
                  setter={setShipping}
                  showDefaultToggle={false}
                />
              )}

              {/* mobile continue shopping */}
              <div className="sm:hidden flex justify-center">
                <Link to="/shop" className="btnGhost inline-flex">
                  Continue shopping
                </Link>
              </div>
            </div>

            {/* Right: cart summary (desktop/tablet) */}
            <div
              className="hidden sm:block rounded-3xl bg-white p-4 sm:p-5 self-start"
              style={{
                border: "1px solid rgb(241,245,249)",
                boxShadow: "none",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[14px] sm:text-[15px] font-extrabold text-slate-900 flex items-center gap-2">
                  <FaShoppingCart className="text-orange-500" /> Your Cart
                </h2>
                <span className="text-[12px] font-semibold text-slate-500">
                  {cartItems.length} products
                </span>
              </div>

              <div className="mt-4 cartScroll space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="h-12 w-12 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0"
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
                        <p className="text-[12.5px] font-extrabold text-slate-900 truncate">
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

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="text-[12px] font-extrabold text-slate-700">
                    Total
                  </h3>
                  <h3 className="text-[18px] font-black text-slate-900">
                    ₹{totalAmount.toFixed(2)}
                  </h3>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="btnOrange w-full mt-4"
                  type="button"
                >
                  Place Order
                </button>

                <div className="mt-4 text-center">
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
          </div>
        </div>

        {/* ✅ MOBILE: sticky bottom bar (Total + Place Order) */}
        <div className="sm:hidden coStickyBar mt-5">
          <div
            className="rounded-3xl bg-white/85 px-4 py-3 flex items-center justify-between gap-3"
            style={{ border: "1px solid rgb(241,245,249)" }}
          >
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold text-slate-600 uppercase">
                Total
              </p>
              <p className="text-[16px] font-black text-slate-900 truncate">
                ₹{totalAmount.toFixed(2)}
              </p>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="btnOrange"
              type="button"
              style={{ padding: "0.75rem 1.1rem", fontSize: "13px" }}
            >
              Place Order
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;
