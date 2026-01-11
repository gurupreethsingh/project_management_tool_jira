// import React, { useContext, useEffect } from "react";
// import { WishlistContext } from "../../components/wishlist_components/WishlistContext";
// import { CartContext } from "../../components/cart_components/CartContext";
// import { FaTrash, FaCartPlus, FaBookmark, FaCheck } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import globalBackendRoute from "../../config/Config";
// import { AuthContext } from "../../components/auth_components/AuthManager";
// import { motion } from "framer-motion";
// import { BsViewList } from "react-icons/bs";
// import { RiArrowLeftSLine } from "react-icons/ri";

// const Wishlist = () => {
//   const {
//     wishlistItems,
//     removeFromWishlist,
//     toggleSaveForLater,
//     moveToCartFromWishlist,
//     fetchWishlist,
//   } = useContext(WishlistContext);

//   const { addToCart, fetchServerCart } = useContext(CartContext);
//   const { isLoggedIn } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isLoggedIn && wishlistItems.length === 0) {
//       fetchWishlist();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isLoggedIn]);

//   useEffect(() => {
//     if (isLoggedIn) fetchWishlist();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const getImageUrl = (img) => {
//     if (!img) return "https://via.placeholder.com/600x600";
//     const normalized = String(img).replace(/\\/g, "/").split("/").pop();
//     return `${globalBackendRoute}/uploads/products/${normalized}`;
//   };

//   const handleCheckoutNow = (item) => {
//     addToCart(item);
//     navigate("/checkout");
//   };

//   return (
//     <div className="wl-font wl-scope w-full">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
//         .wl-font{
//           font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
//         }

//         .btnOrange{
//           border-radius: 9999px;
//           background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36));
//           padding: 0.7rem 1.1rem;
//           color: white;
//           font-weight: 800;
//           font-size: 12px;
//           box-shadow: 0 18px 30px -18px rgba(249,115,22,0.45);
//           transition: opacity .15s ease, transform .15s ease;
//         }
//         .btnOrange:hover{ opacity: .95; }
//         .btnOrange:active{ transform: scale(.99); }

//         .btnGhost{
//           border-radius: 9999px;
//           padding: 0.7rem 1.0rem;
//           font-weight: 800;
//           font-size: 12px;
//           color: rgb(30,41,59);
//           background: rgba(241,245,249,.8);
//           transition: background .15s ease, transform .15s ease;
//         }
//         .btnGhost:hover{ background: rgba(226,232,240,.95); }
//         .btnGhost:active{ transform: scale(.99); }

//         .priceSelling{ color: rgb(15,23,42); font-weight: 900; }
//         .priceMrp{ color: rgb(239,68,68); font-weight: 800; text-decoration: line-through; }
//       `}</style>

//       <motion.div
//         className="w-full px-3 sm:px-5 lg:px-10 py-6"
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.35 }}
//       >
//         {/* Header */}
//         <div className="flex items-end justify-between gap-4">
//           <div className="min-w-0">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="inline-flex items-center gap-2 text-[12px] font-extrabold text-slate-600 hover:text-slate-900 transition"
//             >
//               <RiArrowLeftSLine className="text-[16px]" />
//               Back
//             </button>

//             <h1 className="mt-3 text-[22px] sm:text-[26px] font-extrabold text-slate-900 flex items-center gap-3">
//               <BsViewList className="text-orange-500" />
//               My Wishlist
//               <span className="text-[12px] font-semibold text-slate-500">
//                 ({wishlistItems.length})
//               </span>
//             </h1>
//             <p className="mt-1 text-[12px] font-semibold text-slate-500">
//               Save items, move to cart, or buy instantly.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => navigate("/shop")}
//             className="hidden sm:inline-flex btnGhost"
//           >
//             Continue shopping
//           </button>
//         </div>

//         {/* Empty state */}
//         {wishlistItems.length === 0 ? (
//           <motion.div
//             className="text-center text-slate-500 mt-16"
//             initial={{ opacity: 0, scale: 0.96 }}
//             animate={{ opacity: 1, scale: 1 }}
//           >
//             <div className="inline-flex items-center gap-2 text-[12px] font-semibold">
//               <span className="h-2 w-2 rounded-full bg-orange-500" />
//               Your wishlist is empty.
//             </div>

//             <div className="mt-6">
//               <button
//                 type="button"
//                 className="btnOrange"
//                 onClick={() => navigate("/shop")}
//               >
//                 Browse products
//               </button>
//             </div>
//           </motion.div>
//         ) : (
//           <>
//             {/* Grid */}
//             <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-10">
//               {wishlistItems.map((item) => (
//                 <motion.div
//                   key={item._id}
//                   className="rounded-3xl bg-white overflow-hidden"
//                   style={{
//                     border: "1px solid rgb(241,245,249)",
//                     boxShadow: "none",
//                   }}
//                   initial={{ y: 14, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ duration: 0.28 }}
//                 >
//                   <div
//                     className="p-3 cursor-pointer"
//                     onClick={() => navigate(`/single-product/${item._id}`)}
//                     title="Open product"
//                   >
//                     <div className="rounded-2xl overflow-hidden bg-slate-50">
//                       <img
//                         src={getImageUrl(item.product_image)}
//                         alt={item.product_name}
//                         className="w-full aspect-square object-cover"
//                         loading="lazy"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = "https://via.placeholder.com/600x600";
//                         }}
//                       />
//                     </div>

//                     <div className="mt-3">
//                       <h2 className="text-[13px] font-extrabold text-slate-900 truncate">
//                         {item.product_name}
//                       </h2>

//                       <div className="mt-2 flex items-baseline gap-2">
//                         <span className="priceSelling text-[14px]">
//                           ₹{item.selling_price}
//                         </span>
//                         {item.display_price && (
//                           <span className="priceMrp text-[12px]">
//                             ₹{item.display_price}
//                           </span>
//                         )}
//                       </div>

//                       {item.savedForLater && (
//                         <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-amber-700">
//                           <FaBookmark className="text-amber-600" />
//                           Saved for later
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="px-3 pb-4">
//                     <div className="grid grid-cols-1 gap-2 mt-2">
//                       <button
//                         onClick={async () => {
//                           await moveToCartFromWishlist(item._id);
//                           fetchServerCart();
//                         }}
//                         className="btnOrange w-full inline-flex items-center justify-center gap-2"
//                         type="button"
//                       >
//                         <FaCartPlus /> Move to Cart
//                       </button>

//                       <button
//                         onClick={() => handleCheckoutNow(item)}
//                         className="btnGhost w-full inline-flex items-center justify-center gap-2"
//                         type="button"
//                       >
//                         <FaCheck /> Buy Now
//                       </button>

//                       <div className="grid grid-cols-2 gap-2 mt-1">
//                         <button
//                           onClick={() => toggleSaveForLater(item._id)}
//                           className="btnGhost w-full inline-flex items-center justify-center gap-2"
//                           type="button"
//                         >
//                           <FaBookmark />
//                           {item.savedForLater ? "Unsave" : "Save"}
//                         </button>

//                         <button
//                           onClick={() => removeFromWishlist(item._id)}
//                           className="w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[12px] font-extrabold bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
//                           type="button"
//                         >
//                           <FaTrash /> Remove
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             <div className="mt-10 sm:hidden flex justify-center">
//               <button
//                 type="button"
//                 onClick={() => navigate("/shop")}
//                 className="btnGhost"
//               >
//                 Continue shopping
//               </button>
//             </div>
//           </>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default Wishlist;

// ✅ file: src/pages/wishlist_pages/Wishlist.jsx  (use your exact path)
// ✅ ONLY CHANGE: MOBILE VIEW matches CartPage mobile row style
// ✅ Desktop view remains EXACTLY as your current desktop grid (sm+)
// ✅ Logic unchanged

import React, { useContext, useEffect } from "react";
import { WishlistContext } from "../../components/wishlist_components/WishlistContext";
import { CartContext } from "../../components/cart_components/CartContext";
import {
  FaTrash,
  FaCartPlus,
  FaBookmark,
  FaCheck,
  FaRupeeSign,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";
import { AuthContext } from "../../components/auth_components/AuthManager";
import { motion } from "framer-motion";
import { BsViewList } from "react-icons/bs";
import { RiArrowLeftSLine } from "react-icons/ri";

const Wishlist = () => {
  const {
    wishlistItems,
    removeFromWishlist,
    toggleSaveForLater,
    moveToCartFromWishlist,
    fetchWishlist,
  } = useContext(WishlistContext);

  const { addToCart, fetchServerCart } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && wishlistItems.length === 0) {
      fetchWishlist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/600x600";
    const normalized = String(img).replace(/\\/g, "/").split("/").pop();
    return `${globalBackendRoute}/uploads/products/${normalized}`;
  };

  const handleCheckoutNow = (item) => {
    addToCart(item);
    navigate("/checkout");
  };

  return (
    <div className="wl-font wl-scope w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .wl-font{
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }

        .btnOrange{
          border-radius: 9999px;
          background-image: linear-gradient(to right, rgb(249,115,22), rgb(251,191,36));
          padding: 0.7rem 1.1rem;
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
          background: rgba(241,245,249,.8);
          transition: background .15s ease, transform .15s ease;
        }
        .btnGhost:hover{ background: rgba(226,232,240,.95); }
        .btnGhost:active{ transform: scale(.99); }

        .priceSelling{ color: rgb(15,23,42); font-weight: 900; }
        .priceMrp{ color: rgb(239,68,68); font-weight: 800; text-decoration: line-through; }
      `}</style>

      <motion.div
        className="w-full px-3 sm:px-5 lg:px-10 py-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Header (unchanged) */}
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
              <BsViewList className="text-orange-500" />
              My Wishlist
              <span className="text-[12px] font-semibold text-slate-500">
                ({wishlistItems.length})
              </span>
            </h1>
            <p className="mt-1 text-[12px] font-semibold text-slate-500">
              Save items, move to cart, or buy instantly.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="hidden sm:inline-flex btnGhost"
          >
            Continue shopping
          </button>
        </div>

        {/* Empty state (unchanged) */}
        {wishlistItems.length === 0 ? (
          <motion.div
            className="text-center text-slate-500 mt-16"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="inline-flex items-center gap-2 text-[12px] font-semibold">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Your wishlist is empty.
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="btnOrange"
                onClick={() => navigate("/shop")}
              >
                Browse products
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* ✅ MOBILE VIEW (matches CartPage row feel) */}
            <div className="mt-8 sm:hidden">
              <div className="flex flex-col gap-6">
                {wishlistItems.map((item) => (
                  <motion.div
                    key={item._id}
                    className="bg-white rounded-3xl p-4"
                    style={{
                      border: "1px solid rgb(241,245,249)",
                      boxShadow: "none",
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Product row (image left, details right) */}
                    <div className="flex items-center gap-4">
                      <div
                        className="rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0"
                        style={{
                          width: 92,
                          height: 92,
                          border: "1px solid rgb(241,245,249)",
                        }}
                        onClick={() => navigate(`/single-product/${item._id}`)}
                        title="Open product"
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
                        <h2
                          className="text-[14px] font-extrabold text-slate-900 truncate cursor-pointer"
                          onClick={() =>
                            navigate(`/single-product/${item._id}`)
                          }
                          title="Open product"
                        >
                          {item.product_name}
                        </h2>

                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="priceSelling text-[14px] inline-flex items-center gap-1">
                            <FaRupeeSign /> {item.selling_price}
                          </span>
                          {item.display_price && (
                            <span className="priceMrp text-[12px]">
                              ₹{item.display_price}
                            </span>
                          )}
                        </div>

                        {item.savedForLater && (
                          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-amber-700">
                            <FaBookmark className="text-amber-600" />
                            Saved for later
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions (cart-like, stacked clean) */}
                    <div className="mt-4 grid grid-cols-1 gap-2">
                      <button
                        onClick={async () => {
                          await moveToCartFromWishlist(item._id);
                          fetchServerCart();
                        }}
                        className="btnOrange w-full inline-flex items-center justify-center gap-2"
                        type="button"
                      >
                        <FaCartPlus /> Move to Cart
                      </button>

                      <button
                        onClick={() => handleCheckoutNow(item)}
                        className="btnGhost w-full inline-flex items-center justify-center gap-2"
                        type="button"
                      >
                        <FaCheck /> Buy Now
                      </button>

                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          onClick={() => toggleSaveForLater(item._id)}
                          className="btnGhost w-full inline-flex items-center justify-center gap-2"
                          type="button"
                        >
                          <FaBookmark />
                          {item.savedForLater ? "Unsave" : "Save"}
                        </button>

                        <button
                          onClick={() => removeFromWishlist(item._id)}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[12px] font-extrabold bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                          type="button"
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mobile continue shopping button (same as you had) */}
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/shop")}
                  className="btnGhost"
                >
                  Continue shopping
                </button>
              </div>
            </div>

            {/* ✅ DESKTOP VIEW (unchanged): your existing grid */}
            <div className="hidden sm:grid mt-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-10">
              {wishlistItems.map((item) => (
                <motion.div
                  key={item._id}
                  className="rounded-3xl bg-white overflow-hidden"
                  style={{
                    border: "1px solid rgb(241,245,249)",
                    boxShadow: "none",
                  }}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.28 }}
                >
                  <div
                    className="p-3 cursor-pointer"
                    onClick={() => navigate(`/single-product/${item._id}`)}
                    title="Open product"
                  >
                    <div className="rounded-2xl overflow-hidden bg-slate-50">
                      <img
                        src={getImageUrl(item.product_image)}
                        alt={item.product_name}
                        className="w-full aspect-square object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/600x600";
                        }}
                      />
                    </div>

                    <div className="mt-3">
                      <h2 className="text-[13px] font-extrabold text-slate-900 truncate">
                        {item.product_name}
                      </h2>

                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="priceSelling text-[14px]">
                          ₹{item.selling_price}
                        </span>
                        {item.display_price && (
                          <span className="priceMrp text-[12px]">
                            ₹{item.display_price}
                          </span>
                        )}
                      </div>

                      {item.savedForLater && (
                        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-amber-700">
                          <FaBookmark className="text-amber-600" />
                          Saved for later
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions (unchanged) */}
                  <div className="px-3 pb-4">
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      <button
                        onClick={async () => {
                          await moveToCartFromWishlist(item._id);
                          fetchServerCart();
                        }}
                        className="btnOrange w-full inline-flex items-center justify-center gap-2"
                        type="button"
                      >
                        <FaCartPlus /> Move to Cart
                      </button>

                      <button
                        onClick={() => handleCheckoutNow(item)}
                        className="btnGhost w-full inline-flex items-center justify-center gap-2"
                        type="button"
                      >
                        <FaCheck /> Buy Now
                      </button>

                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          onClick={() => toggleSaveForLater(item._id)}
                          className="btnGhost w-full inline-flex items-center justify-center gap-2"
                          type="button"
                        >
                          <FaBookmark />
                          {item.savedForLater ? "Unsave" : "Save"}
                        </button>

                        <button
                          onClick={() => removeFromWishlist(item._id)}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[12px] font-extrabold bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                          type="button"
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Wishlist;
