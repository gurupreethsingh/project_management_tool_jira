// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   FaUser,
//   FaEnvelope,
//   FaPhone,
//   FaMapMarkerAlt,
//   FaUserShield,
//   FaUserCircle, // ← avatar icon
// } from "react-icons/fa";
// import { MdEdit } from "react-icons/md";
// import { motion } from "framer-motion";
// import { useNavigate, useParams } from "react-router-dom";
// import globalBackendRoute from "../../config/Config";

// export default function Profile() {
//   const [userData, setUserData] = useState(null);
//   const [imgError, setImgError] = useState(false); // ← track broken image
//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = JSON.parse(localStorage.getItem("user"));
//       if (user && user.id) {
//         try {
//           const response = await axios.get(
//             `${globalBackendRoute}/api/user/${user.id}`,
//           );
//           setUserData(response.data);
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       } else {
//         console.error("No userId found in localStorage.");
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (!userData) {
//     return <div>Loading...</div>;
//   }

//   const handleUpdateProfile = () => {
//     navigate(`/update-profile/${userData._id}`);
//   };

//   const getImageUrl = (avatar) => {
//     if (avatar) {
//       const normalizedPath = avatar.replace(/\\/g, "/").split("uploads/").pop();
//       return `${globalBackendRoute}/uploads/${normalizedPath}`;
//     }
//     return null; // ← return null so we can show the icon instead
//   };

//   const imageUrl = getImageUrl(userData.avatar);
//   const showImage = Boolean(imageUrl) && !imgError;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="max-w-4xl mx-auto p-6 bg-white rounded-lg"
//     >
//       <div className="flex flex-col sm:flex-row items-center sm:items-start">
//         {/* User Image or Fallback Icon */}
//         {showImage ? (
//           <motion.img
//             initial={{ x: -50, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.5 }}
//             src={imageUrl}
//             alt={userData.name || "User avatar"}
//             onError={() => setImgError(true)} // ← fall back to icon if broken
//             className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg sm:rounded-xl mb-4 sm:mb-0 sm:mr-6"
//             style={{ maxWidth: "100%", height: "auto" }}
//           />
//         ) : (
//           <motion.div
//             initial={{ x: -50, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.5 }}
//             className="w-32 h-32 sm:w-48 sm:h-48 mb-4 sm:mb-0 sm:mr-6 flex items-center justify-center rounded-lg sm:rounded-xl bg-slate-100"
//             aria-label="Default user avatar"
//           >
//             <FaUserCircle className="w-24 h-24 sm:w-32 sm:h-32 text-slate-400" />
//           </motion.div>
//         )}

//         <div className="w-full">
//           <motion.h3
//             initial={{ x: -50, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.5 }}
//             className="text-base font-semibold leading-7 text-gray-900 text-left"
//           >
//             Profile Information
//           </motion.h3>

//           <div className="mt-6 border-t border-gray-100">
//             <dl className="divide-y divide-gray-100">
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.6, duration: 0.5 }}
//                 className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
//               >
//                 <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
//                   <FaUser className="text-indigo-600 mr-2" /> Full name
//                 </dt>
//                 <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                   {userData.name}
//                 </dd>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.8, duration: 0.5 }}
//                 className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
//               >
//                 <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
//                   <FaEnvelope className="text-green-500 mr-2" /> Email address
//                 </dt>
//                 <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                   {userData.email}
//                 </dd>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 1.0, duration: 0.5 }}
//                 className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
//               >
//                 <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
//                   <FaUserShield className="text-red-500 mr-2" /> Role
//                 </dt>
//                 <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                   {userData.role}
//                 </dd>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 1.2, duration: 0.5 }}
//                 className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
//               >
//                 <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
//                   <FaPhone className="text-yellow-500 mr-2" /> Phone
//                 </dt>
//                 <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                   {userData.phone || "N/A"}
//                 </dd>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 1.4, duration: 0.5 }}
//                 className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
//               >
//                 <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
//                   <FaMapMarkerAlt className="text-red-500 mr-2" /> Street
//                 </dt>
//                 <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                   {userData.address?.street || "N/A"}
//                 </dd>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 1.6, duration: 0.5 }}
//                 className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
//               >
//                 <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
//                   <FaMapMarkerAlt className="text-red-500 mr-2" /> City
//                 </dt>
//                 <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                   {userData.address?.city || "N/A"}
//                 </dd>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 1.8, duration: 0.5 }}
//                 className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
//               >
//                 <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
//                   <FaMapMarkerAlt className="text-red-500 mr-2" /> State
//                 </dt>
//                 <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                   {userData.address?.state || "N/A"}
//                 </dd>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 2.0, duration: 0.5 }}
//                 className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
//               >
//                 <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
//                   <FaMapMarkerAlt className="text-red-500 mr-2" /> Postal Code
//                 </dt>
//                 <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                   {userData.address?.postalCode || "N/A"}
//                 </dd>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 2.2, duration: 0.5 }}
//                 className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
//               >
//                 <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
//                   <FaMapMarkerAlt className="text-red-500 mr-2" /> Country
//                 </dt>
//                 <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                   {userData.address?.country || "N/A"}
//                 </dd>
//               </motion.div>
//             </dl>
//           </div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 2.4, duration: 0.5 }}
//             className="mt-6 flex justify-end"
//           >
//             <button
//               onClick={handleUpdateProfile}
//               className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 focus:outline-none"
//             >
//               <MdEdit className="mr-2" />
//               Update Profile
//             </button>
//           </motion.div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

//

"use client";

import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserShield,
  FaUserCircle,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

import profileBanner from "../../assets/images/profile_banner.jpg";

const HERO_TAGS = ["PROFILE", "ACCOUNT", "SETTINGS", "USER DETAILS"];

const HERO_STYLE = {
  backgroundImage: `url(${profileBanner})`,
};

function Profile() {
  const [userData, setUserData] = useState(null);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.id) {
        try {
          const response = await axios.get(
            `${globalBackendRoute}/api/user/${user.id}`,
          );
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.error("No userId found in localStorage.");
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <div className="service-page-wrap min-h-screen flex items-center justify-center">
        <div className="glass-card px-6 py-5">
          <p className="service-badge-heading">Loading</p>
          <p className="mt-2 service-paragraph">
            Fetching your profile details...
          </p>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = () => {
    navigate(`/update-profile/${userData._id}`);
  };

  const getImageUrl = (avatar) => {
    if (avatar) {
      const normalizedPath = avatar.replace(/\\/g, "/").split("uploads/").pop();
      return `${globalBackendRoute}/uploads/${normalizedPath}`;
    }
    return null;
  };

  const imageUrl = getImageUrl(userData.avatar);
  const showImage = Boolean(imageUrl) && !imgError;

  return (
    <div className="service-page-wrap min-h-screen">
      {/* HERO */}
      {/* <section className="service-hero-section" style={HERO_STYLE}>
        <div className="service-hero-overlay-1" />
        <div className="service-hero-overlay-2" />
        <div className="service-hero-overlay-3" />

        <div className="service-hero-container">
          <div className="service-hero-layout">
            <div>
              <div className="service-tag-row">
                {HERO_TAGS.map((item) => (
                  <span key={item} className="service-tag-pill">
                    {item}
                  </span>
                ))}
              </div>

              <h1 className="service-hero-title">
                Your{" "}
                <span className="service-hero-title-highlight">
                  profile information
                </span>
              </h1>

              <p className="service-hero-text">
                View your account details, role information, contact data, and
                address information in one place.
              </p>

              <div className="service-hero-status">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Profile synced with account data
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* MAIN */}
      <main className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[320px,minmax(0,1fr)] gap-8 lg:gap-10 items-start">
            {/* LEFT */}
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="glass-card p-5 sm:p-6"
            >
              <p className="service-badge-heading">Profile preview</p>

              <div className="mt-5 flex flex-col items-center text-center">
                {showImage ? (
                  <motion.img
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.35 }}
                    src={imageUrl}
                    alt={userData.name || "User avatar"}
                    onError={() => setImgError(true)}
                    className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-2xl border border-slate-200 shadow-sm"
                  />
                ) : (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.35 }}
                    className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center rounded-2xl bg-slate-100 border border-slate-200 shadow-sm"
                    aria-label="Default user avatar"
                  >
                    <FaUserCircle className="w-20 h-20 sm:w-24 sm:h-24 text-slate-400" />
                  </motion.div>
                )}

                <h2 className="mt-4 text-lg sm:text-xl font-semibold text-slate-900">
                  {userData.name}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{userData.email}</p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs sm:text-sm text-slate-700">
                  <FaUserShield className="text-indigo-600" />
                  <span>{userData.role}</span>
                </div>

                <button
                  onClick={handleUpdateProfile}
                  className="primary-gradient-button mt-6"
                >
                  <MdEdit className="mr-2" />
                  Update Profile
                </button>
              </div>
            </motion.section>

            {/* RIGHT */}
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
            >
              <h2 className="service-main-heading">Profile details</h2>

              <div className="glass-card mt-5 p-5 sm:p-6 lg:p-7">
                <p className="service-badge-heading">Account information</p>

                <div className="mt-6 grid grid-cols-1 gap-4">
                  {[
                    {
                      icon: <FaUser className="text-indigo-600" />,
                      label: "Full name",
                      value: userData.name,
                    },
                    {
                      icon: <FaEnvelope className="text-green-500" />,
                      label: "Email address",
                      value: userData.email,
                    },
                    {
                      icon: <FaUserShield className="text-rose-500" />,
                      label: "Role",
                      value: userData.role,
                    },
                    {
                      icon: <FaPhone className="text-amber-500" />,
                      label: "Phone",
                      value: userData.phone || "N/A",
                    },
                    {
                      icon: <FaMapMarkerAlt className="text-red-500" />,
                      label: "Street",
                      value: userData.address?.street || "N/A",
                    },
                    {
                      icon: <FaMapMarkerAlt className="text-red-500" />,
                      label: "City",
                      value: userData.address?.city || "N/A",
                    },
                    {
                      icon: <FaMapMarkerAlt className="text-red-500" />,
                      label: "State",
                      value: userData.address?.state || "N/A",
                    },
                    {
                      icon: <FaMapMarkerAlt className="text-red-500" />,
                      label: "Postal code",
                      value: userData.address?.postalCode || "N/A",
                    },
                    {
                      icon: <FaMapMarkerAlt className="text-red-500" />,
                      label: "Country",
                      value: userData.address?.country || "N/A",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={`${item.label}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + index * 0.05, duration: 0.3 }}
                      className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-[220px,minmax(0,1fr)] gap-3 sm:gap-4 items-start">
                        <div className="flex items-center text-sm font-medium text-slate-900">
                          <span className="form-icon-badge mr-2 !mr-2">
                            {item.icon}
                          </span>
                          {item.label}
                        </div>
                        <div className="text-sm sm:text-base text-slate-700 break-words">
                          {item.value}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleUpdateProfile}
                    className="primary-gradient-button"
                  >
                    <MdEdit className="mr-2" />
                    Update Profile
                  </button>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default memo(Profile);
