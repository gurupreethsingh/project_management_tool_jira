// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   FaUser,
//   FaEnvelope,
//   FaPhone,
//   FaMapMarkerAlt,
//   FaUserShield,
// } from "react-icons/fa";
// import { MdEdit } from "react-icons/md";
// import { motion } from "framer-motion";
// import { useNavigate, useParams } from "react-router-dom";
// import globalBackendRoute from "../../config/Config";

// export default function Profile() {
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `${globalBackendRoute}/api/getUserById/${id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setUserData(response.data);
//       } catch (error) {
//         console.error("Error fetching user data:", error.message);
//       }
//     };
//     fetchUserData();
//   }, [id]);

//   const handleUpdateProfile = () => {
//     navigate(`/update-profile/${userData._id}`);
//   };

//   const getImageUrl = (avatar) => {
//     if (!avatar) return "https://placehold.co/150x150?text=No+Image";
//     return `${globalBackendRoute}/${avatar.replace(/\\/g, "/")}`;
//   };

//   if (!userData) return <div className="text-center py-8">Loading...</div>;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.45 }}
//       className="containerWidth my-4 sm:my-6"
//     >
//       <style>{`
//         /* Mobile-first polish (no logic changes) */
//         .pf-card {
//           border: 1px solid rgb(241,245,249);
//           box-shadow: none;
//           background: white;
//           border-radius: 24px;
//         }
//         .pf-muted { color: rgb(100,116,139); }
//       `}</style>

//       <div className="w-full">
//         {/* ✅ MOBILE HERO IMAGE (full width, controlled height) */}
//         <div className="sm:hidden">
//           <div className="relative w-full overflow-hidden rounded-3xl bg-slate-100 pf-card">
//             <img
//               src={getImageUrl(userData.avatar)}
//               alt={userData.name}
//               className="w-full h-[240px] object-cover"
//               onError={(e) => {
//                 e.currentTarget.onerror = null;
//                 e.currentTarget.src =
//                   "https://placehold.co/600x600?text=No+Image";
//               }}
//             />

//             {/* soft gradient bottom for readability */}
//             <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

//             <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
//               <div className="min-w-0">
//                 <p className="text-white text-[12px] font-bold opacity-90">
//                   Profile
//                 </p>
//                 <h2 className="text-white text-[18px] font-extrabold truncate">
//                   {userData.name}
//                 </h2>
//                 <p className="text-white/90 text-[12px] font-semibold truncate">
//                   {userData.email}
//                 </p>
//               </div>

//               <button
//                 onClick={handleUpdateProfile}
//                 className="shrink-0 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-extrabold text-[12px] px-4 py-2 shadow-md active:scale-[0.99] transition"
//                 type="button"
//                 aria-label="Update profile"
//               >
//                 <span className="inline-flex items-center gap-2">
//                   <MdEdit /> Update
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ✅ DESKTOP/TABLET LAYOUT (your original structure, just safer spacing) */}
//         <div className="hidden sm:flex flex-col sm:flex-row sm:items-start items-center gap-6">
//           {/* Avatar */}
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="w-auto h-full sm:w-48 sm:h-48"
//           >
//             <img
//               src={getImageUrl(userData.avatar)}
//               alt={userData.name}
//               className="w-full h-full object-cover rounded-xl border bg-gray-100"
//               onError={(e) => {
//                 e.currentTarget.onerror = null;
//                 e.currentTarget.src =
//                   "https://placehold.co/150x150?text=No+Image";
//               }}
//             />
//           </motion.div>

//           {/* User Info */}
//           <div className="w-full">
//             <motion.h3
//               className="text-2xl mb-4 font-extrabold"
//               initial={{ x: -30, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//             >
//               Profile
//             </motion.h3>

//             <div className="border-t border-gray-200 divide-y divide-gray-100">
//               <ProfileField
//                 icon={<FaUser className="text-blue-600" />}
//                 label="Full Name"
//                 value={userData.name}
//               />
//               <ProfileField
//                 icon={<FaEnvelope className="text-green-600" />}
//                 label="Email"
//                 value={userData.email}
//               />
//               <ProfileField
//                 icon={<FaPhone className="text-yellow-600" />}
//                 label="Phone"
//                 value={userData.phone || "N/A"}
//               />
//               <ProfileField
//                 icon={<FaUserShield className="text-red-500" />}
//                 label="Role"
//                 value={userData.role}
//               />
//               <ProfileField
//                 icon={<FaMapMarkerAlt className="text-purple-600" />}
//                 label="Street"
//                 value={userData.address?.street || "N/A"}
//               />
//               <ProfileField
//                 icon={<FaMapMarkerAlt className="text-indigo-600" />}
//                 label="City"
//                 value={userData.address?.city || "N/A"}
//               />
//               <ProfileField
//                 icon={<FaMapMarkerAlt className="text-pink-500" />}
//                 label="State"
//                 value={userData.address?.state || "N/A"}
//               />
//               <ProfileField
//                 icon={<FaMapMarkerAlt className="text-cyan-600" />}
//                 label="Postal Code"
//                 value={userData.address?.postalCode || "N/A"}
//               />
//               <ProfileField
//                 icon={<FaMapMarkerAlt className="text-teal-600" />}
//                 label="Country"
//                 value={userData.address?.country || "N/A"}
//               />
//             </div>

//             {/* Update Button */}
//             <div className="mt-6 text-center">
//               <button
//                 onClick={handleUpdateProfile}
//                 className="w-fit px-4 py-2 inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-full shadow hover:from-red-700 hover:to-orange-600 transition"
//                 type="button"
//               >
//                 <MdEdit /> Update
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ✅ MOBILE DETAILS (clean, non-overlapping, card style) */}
//         <div className="sm:hidden mt-4">
//           <div className="pf-card overflow-hidden">
//             <div
//               className="px-4 py-3 border-b"
//               style={{ borderColor: "rgb(241,245,249)" }}
//             >
//               <p className="text-[12px] font-extrabold text-slate-900">
//                 Account Details
//               </p>
//               <p className="text-[12px] font-semibold pf-muted mt-0.5">
//                 Your personal information
//               </p>
//             </div>

//             <div
//               className="divide-y"
//               style={{ borderColor: "rgb(241,245,249)" }}
//             >
//               <MobileField
//                 icon={<FaUser className="text-blue-600" />}
//                 label="Full Name"
//                 value={userData.name}
//               />
//               <MobileField
//                 icon={<FaEnvelope className="text-green-600" />}
//                 label="Email"
//                 value={userData.email}
//               />
//               <MobileField
//                 icon={<FaPhone className="text-yellow-600" />}
//                 label="Phone"
//                 value={userData.phone || "N/A"}
//               />
//               <MobileField
//                 icon={<FaUserShield className="text-red-500" />}
//                 label="Role"
//                 value={userData.role}
//               />
//             </div>

//             <div
//               className="px-4 py-3 border-t"
//               style={{ borderColor: "rgb(241,245,249)" }}
//             >
//               <p className="text-[12px] font-extrabold text-slate-900">
//                 Address
//               </p>
//               <p className="text-[12px] font-semibold pf-muted mt-0.5">
//                 Delivery location details
//               </p>
//             </div>

//             <div
//               className="divide-y"
//               style={{ borderColor: "rgb(241,245,249)" }}
//             >
//               <MobileField
//                 icon={<FaMapMarkerAlt className="text-purple-600" />}
//                 label="Street"
//                 value={userData.address?.street || "N/A"}
//               />
//               <MobileField
//                 icon={<FaMapMarkerAlt className="text-indigo-600" />}
//                 label="City"
//                 value={userData.address?.city || "N/A"}
//               />
//               <MobileField
//                 icon={<FaMapMarkerAlt className="text-pink-500" />}
//                 label="State"
//                 value={userData.address?.state || "N/A"}
//               />
//               <MobileField
//                 icon={<FaMapMarkerAlt className="text-cyan-600" />}
//                 label="Postal Code"
//                 value={userData.address?.postalCode || "N/A"}
//               />
//               <MobileField
//                 icon={<FaMapMarkerAlt className="text-teal-600" />}
//                 label="Country"
//                 value={userData.address?.country || "N/A"}
//               />
//             </div>

//             {/* Mobile bottom CTA (optional duplicate for thumb reach) */}
//             <div className="p-4">
//               <button
//                 onClick={handleUpdateProfile}
//                 className="w-full rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-extrabold text-[13px] px-4 py-3 shadow-md active:scale-[0.99] transition inline-flex items-center justify-center gap-2"
//                 type="button"
//               >
//                 <MdEdit /> Update Profile
//               </button>

//               <button
//                 onClick={() => navigate(-1)}
//                 className="mt-3 w-full rounded-full bg-slate-50 text-slate-800 font-extrabold text-[13px] px-4 py-3 active:scale-[0.99] transition"
//                 type="button"
//                 style={{ border: "1px solid rgb(241,245,249)" }}
//               >
//                 Go Back
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// function ProfileField({ icon, label, value }) {
//   return (
//     <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 px-2 sm:px-4">
//       <dt className="flex items-center text-sm font-medium text-gray-700 gap-2">
//         {icon} {label}
//       </dt>
//       <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
//         {value}
//       </dd>
//     </div>
//   );
// }

// /* ✅ Mobile-only row: prevents overlap, wraps long text, clean spacing */
// function MobileField({ icon, label, value }) {
//   return (
//     <div className="px-4 py-3 flex items-start gap-3">
//       <div className="mt-0.5 shrink-0">{icon}</div>
//       <div className="min-w-0 flex-1">
//         <p className="text-[12px] font-extrabold text-slate-700">{label}</p>
//         <p className="text-[13px] font-semibold text-slate-900 break-words">
//           {value}
//         </p>
//       </div>
//     </div>
//   );
// }

//

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserShield,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${globalBackendRoute}/api/getUserById/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };
    fetchUserData();
  }, [id]);

  const handleUpdateProfile = () => {
    navigate(`/update-profile/${userData?._id}`);
  };

  const getImageUrl = (avatarPath) => {
    if (!avatarPath || avatarPath === "undefined" || avatarPath === "null") {
      return "https://placehold.co/150x150?text=No+Image";
    }
    return `${globalBackendRoute}/${String(avatarPath).replace(/\\/g, "/")}`;
  };

  if (!userData) return <div className="text-center py-8">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="up-font up-scope w-full"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .up-font{
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }

        .upCard{
          border: 1px solid rgb(241,245,249);
          background: white;
          border-radius: 28px;
          box-shadow: none;
        }

        .upSoftBorder{ border: 1px solid rgb(241,245,249); }
        .upMuted{ color: rgb(100,116,139); }

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
          padding: 0.85rem 1.25rem;
          font-weight: 900;
          font-size: 13px;
          color: rgb(30,41,59);
          background: rgba(241,245,249,.8);
          transition: background .15s ease, transform .15s ease;
        }
        .btnGhost:hover{ background: rgba(226,232,240,.95); }
        .btnGhost:active{ transform: scale(.99); }

        /* Desktop field styles (matches UpdateProfile) */
        .fieldWrap{
          display: grid;
          grid-template-columns: 1.1fr 2fr;
          gap: 14px;
          align-items: center;
          padding: 14px 18px;
        }
        .fieldLabel{
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 900;
          color: rgb(51,65,85);
          min-width: 0;
        }
        .fieldValue{
          width: 100%;
          border-radius: 18px;
          background: rgba(241,245,249,.65);
          border: 1px solid rgb(241,245,249);
          padding: 11px 14px;
          font-weight: 800;
          font-size: 13px;
          color: rgb(15,23,42);
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        /* --- MOBILE COMPACT TUNING (same as UpdateProfile) --- */
        .mTitle{ padding: 10px 14px; }
        .mField{ padding: 10px 14px; }
        .mLabel{ font-size: 12px; font-weight: 900; }
        .mSub{ font-size: 12px; font-weight: 700; color: rgb(100,116,139); margin-top: 2px; }
        .mStickyPad{ padding-bottom: 86px; } /* room for sticky actions */

        @media (min-width: 1024px){
          .shell{
            max-width: 1100px;
            margin: 0 auto;
          }
        }
      `}</style>

      <div className="shell w-full px-3 sm:px-5 lg:px-10 py-6">
        {/* ========= MOBILE (compact + sticky actions like UpdateProfile) ========= */}
        <div className="sm:hidden">
          {/* Hero image */}
          <div className="relative w-full overflow-hidden rounded-3xl bg-slate-100 upCard">
            <img
              src={getImageUrl(userData.avatar)}
              alt={userData.name}
              className="w-full h-[190px] object-cover"
              onError={(e) => {
                if (!e.currentTarget.src.includes("placehold.co")) {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://placehold.co/600x600?text=No+Image";
                }
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

            <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-white text-[11px] font-bold opacity-90">
                  Profile
                </p>
                <h2 className="text-white text-[16px] font-extrabold truncate leading-tight">
                  {userData.name}
                </h2>
                <p className="text-white/90 text-[11px] font-semibold truncate">
                  {userData.email}
                </p>
              </div>

              {/* tiny quick edit */}
              <button
                type="button"
                onClick={handleUpdateProfile}
                className="shrink-0 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-extrabold text-[11px] px-3 py-2 shadow-md active:scale-[0.99] transition"
                aria-label="Update profile"
              >
                <span className="inline-flex items-center gap-1.5">
                  <MdEdit /> Edit
                </span>
              </button>
            </div>
          </div>

          {/* Details cards */}
          <div className="mt-3 mStickyPad">
            <div className="upCard overflow-hidden">
              <SectionTitleCompact
                title="Account Details"
                subtitle="Your personal information"
              />

              <div
                className="divide-y"
                style={{ borderColor: "rgb(241,245,249)" }}
              >
                <MobileField
                  icon={<FaUser className="text-blue-600" />}
                  label="Full Name"
                  value={userData.name}
                />

                {/* email + phone in 2 columns (compact) */}
                <div className="grid grid-cols-2 gap-2 px-3 py-2.5">
                  <MobileFieldInline
                    icon={<FaEnvelope className="text-green-600" />}
                    label="Email"
                    value={userData.email}
                  />
                  <MobileFieldInline
                    icon={<FaPhone className="text-yellow-600" />}
                    label="Phone"
                    value={userData.phone || "N/A"}
                  />
                </div>

                <MobileField
                  icon={<FaUserShield className="text-red-500" />}
                  label="Role"
                  value={userData.role || "N/A"}
                />
              </div>

              <SectionTitleCompact
                title="Address"
                subtitle="Delivery location details"
                topBorder
              />

              <div
                className="divide-y"
                style={{ borderColor: "rgb(241,245,249)" }}
              >
                <MobileField
                  icon={<FaMapMarkerAlt className="text-purple-600" />}
                  label="Street"
                  value={userData.address?.street || "N/A"}
                />

                <div className="grid grid-cols-2 gap-2 px-3 py-2.5">
                  <MobileFieldInline
                    icon={<FaMapMarkerAlt className="text-indigo-600" />}
                    label="City"
                    value={userData.address?.city || "N/A"}
                  />
                  <MobileFieldInline
                    icon={<FaMapMarkerAlt className="text-pink-500" />}
                    label="State"
                    value={userData.address?.state || "N/A"}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 px-3 py-2.5">
                  <MobileFieldInline
                    icon={<FaMapMarkerAlt className="text-cyan-600" />}
                    label="Postal"
                    value={userData.address?.postalCode || "N/A"}
                  />
                  <MobileFieldInline
                    icon={<FaMapMarkerAlt className="text-teal-600" />}
                    label="Country"
                    value={userData.address?.country || "N/A"}
                  />
                </div>
              </div>
            </div>

            {/* Sticky bottom actions (same behavior as UpdateProfile) */}
            <div className="fixed left-0 right-0 bottom-0 z-40">
              <div className="mx-auto max-w-[520px] px-3 pb-3">
                <div
                  className="rounded-3xl bg-white/90 backdrop-blur-xl border"
                  style={{ borderColor: "rgb(241,245,249)" }}
                >
                  <div className="p-2.5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="flex-1 rounded-full bg-slate-50 text-slate-800 font-extrabold text-[12px] px-4 py-3 active:scale-[0.99] transition"
                      style={{ border: "1px solid rgb(241,245,249)" }}
                    >
                      Go Back
                    </button>

                    <button
                      type="button"
                      onClick={handleUpdateProfile}
                      className="flex-1 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-extrabold text-[12px] px-4 py-3 shadow-md active:scale-[0.99] transition inline-flex items-center justify-center gap-2"
                    >
                      <MdEdit /> Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========= DESKTOP/TABLET (match UpdateProfile desktop styling) ========= */}
        <div className="hidden sm:block">
          <div className="upCard overflow-hidden">
            {/* Top header */}
            <div
              className="px-6 lg:px-8 py-6 border-b"
              style={{ borderColor: "rgb(241,245,249)" }}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-[12px] font-extrabold text-slate-600 hover:text-slate-900 transition"
                  >
                    ← Back
                  </button>

                  <h1 className="mt-3 text-[26px] font-extrabold text-slate-900">
                    Profile
                  </h1>
                  <p className="mt-1 text-[13px] font-semibold upMuted">
                    Your account information and saved address.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleUpdateProfile}
                    className="btnOrange inline-flex items-center gap-2"
                  >
                    <MdEdit className="text-[18px]" /> Update Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 lg:px-8 py-7">
              <div className="grid grid-cols-12 gap-7">
                {/* Left avatar card */}
                <div className="col-span-12 lg:col-span-4">
                  <div className="upSoftBorder rounded-3xl overflow-hidden bg-white">
                    <div className="relative">
                      <img
                        src={getImageUrl(userData.avatar)}
                        alt={userData.name}
                        className="w-full h-[260px] object-cover"
                        onError={(e) => {
                          if (!e.currentTarget.src.includes("placehold.co")) {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "https://placehold.co/600x600?text=No+Image";
                          }
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <p className="text-white text-[12px] font-extrabold truncate">
                          {userData.name}
                        </p>
                        <p className="text-white/90 text-[12px] font-semibold truncate">
                          {userData.email}
                        </p>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-[12px] font-extrabold text-slate-900">
                        Quick Actions
                      </p>
                      <p className="text-[12px] font-semibold upMuted mt-1">
                        Edit your details and address anytime.
                      </p>

                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={handleUpdateProfile}
                          className="btnOrange w-full inline-flex items-center justify-center gap-2"
                        >
                          <MdEdit className="text-[18px]" /> Update Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right details */}
                <div className="col-span-12 lg:col-span-8">
                  <div className="upSoftBorder rounded-3xl overflow-hidden">
                    <div
                      className="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b"
                      style={{ borderColor: "rgb(241,245,249)" }}
                    >
                      <p className="text-[12px] font-extrabold text-slate-900 uppercase tracking-wide">
                        Account Details
                      </p>
                      <p className="text-[13px] font-semibold upMuted mt-1">
                        Basic info used across your account
                      </p>
                    </div>

                    <div
                      className="divide-y"
                      style={{ borderColor: "rgb(241,245,249)" }}
                    >
                      <DesktopField
                        icon={<FaUser className="text-blue-600" />}
                        label="Full Name"
                        value={userData.name}
                      />
                      <DesktopField
                        icon={<FaEnvelope className="text-green-600" />}
                        label="Email"
                        value={userData.email}
                      />
                      <DesktopField
                        icon={<FaPhone className="text-yellow-600" />}
                        label="Phone"
                        value={userData.phone || "N/A"}
                      />
                      <DesktopField
                        icon={<FaUserShield className="text-red-500" />}
                        label="Role"
                        value={userData.role || "N/A"}
                      />
                    </div>

                    <div
                      className="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-y"
                      style={{ borderColor: "rgb(241,245,249)" }}
                    >
                      <p className="text-[12px] font-extrabold text-slate-900 uppercase tracking-wide">
                        Address
                      </p>
                      <p className="text-[13px] font-semibold upMuted mt-1">
                        Used for delivery and invoices
                      </p>
                    </div>

                    <div
                      className="divide-y"
                      style={{ borderColor: "rgb(241,245,249)" }}
                    >
                      <DesktopField
                        icon={<FaMapMarkerAlt className="text-purple-600" />}
                        label="Street"
                        value={userData.address?.street || "N/A"}
                      />
                      <DesktopField
                        icon={<FaMapMarkerAlt className="text-indigo-600" />}
                        label="City"
                        value={userData.address?.city || "N/A"}
                      />
                      <DesktopField
                        icon={<FaMapMarkerAlt className="text-pink-500" />}
                        label="State"
                        value={userData.address?.state || "N/A"}
                      />
                      <DesktopField
                        icon={<FaMapMarkerAlt className="text-cyan-600" />}
                        label="Postal Code"
                        value={userData.address?.postalCode || "N/A"}
                      />
                      <DesktopField
                        icon={<FaMapMarkerAlt className="text-teal-600" />}
                        label="Country"
                        value={userData.address?.country || "N/A"}
                      />
                    </div>

                    <div
                      className="px-6 py-5 border-t flex items-center justify-end gap-3"
                      style={{ borderColor: "rgb(241,245,249)" }}
                    >
                      <button
                        type="button"
                        onClick={handleUpdateProfile}
                        className="btnOrange inline-flex items-center gap-2"
                      >
                        <MdEdit className="text-[18px]" /> Update Profile
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 text-[12px] font-semibold upMuted">
                    Tip: Keep your phone number updated for delivery updates.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- Mobile compact section title ---------- */
function SectionTitleCompact({ title, subtitle, topBorder }) {
  return (
    <div
      className={`mTitle ${topBorder ? "border-t" : ""}`}
      style={topBorder ? { borderColor: "rgb(241,245,249)" } : undefined}
    >
      <p className="mLabel text-slate-900">{title}</p>
      <p className="mSub">{subtitle}</p>
    </div>
  );
}

/* ---------- Mobile full-width row ---------- */
function MobileField({ icon, label, value }) {
  return (
    <div className="mField flex items-start gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="mLabel text-slate-700">{label}</p>
        <p className="mt-1 text-[13px] font-semibold text-slate-900 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ---------- Mobile inline card for 2-col rows ---------- */
function MobileFieldInline({ icon, label, value }) {
  return (
    <div
      className="rounded-2xl bg-white p-2.5"
      style={{ border: "1px solid rgb(241,245,249)" }}
    >
      <div className="flex items-center gap-2">
        <span className="shrink-0">{icon}</span>
        <p className="text-[11px] font-extrabold text-slate-700 truncate">
          {label}
        </p>
      </div>
      <p className="mt-1 text-[13px] font-semibold text-slate-900 break-words">
        {value}
      </p>
    </div>
  );
}

/* ---------- Desktop field row (read-only) ---------- */
function DesktopField({ icon, label, value }) {
  return (
    <div className="fieldWrap">
      <div className="fieldLabel">
        <span className="shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      <div className="min-w-0">
        <div className="fieldValue">{value}</div>
      </div>
    </div>
  );
}
