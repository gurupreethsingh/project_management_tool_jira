import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserShield,
  FaUserCircle, // ← avatar icon
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [imgError, setImgError] = useState(false); // ← track broken image
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.id) {
        try {
          const response = await axios.get(
            `${globalBackendRoute}/api/user/${user.id}`
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
    return <div>Loading...</div>;
  }

  const handleUpdateProfile = () => {
    navigate(`/update-profile/${userData._id}`);
  };

  const getImageUrl = (avatar) => {
    if (avatar) {
      const normalizedPath = avatar.replace(/\\/g, "/").split("uploads/").pop();
      return `${globalBackendRoute}/uploads/${normalizedPath}`;
    }
    return null; // ← return null so we can show the icon instead
  };

  const imageUrl = getImageUrl(userData.avatar);
  const showImage = Boolean(imageUrl) && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        {/* User Image or Fallback Icon */}
        {showImage ? (
          <motion.img
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            src={imageUrl}
            alt={userData.name || "User avatar"}
            onError={() => setImgError(true)} // ← fall back to icon if broken
            className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg sm:rounded-xl mb-4 sm:mb-0 sm:mr-6"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        ) : (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-32 h-32 sm:w-48 sm:h-48 mb-4 sm:mb-0 sm:mr-6 flex items-center justify-center rounded-lg sm:rounded-xl bg-slate-100"
            aria-label="Default user avatar"
          >
            <FaUserCircle className="w-24 h-24 sm:w-32 sm:h-32 text-slate-400" />
          </motion.div>
        )}

        <div className="w-full">
          <motion.h3
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base font-semibold leading-7 text-gray-900 text-left"
          >
            Profile Information
          </motion.h3>

          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
              >
                <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                  <FaUser className="text-indigo-600 mr-2" /> Full name
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {userData.name}
                </dd>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
              >
                <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                  <FaEnvelope className="text-green-500 mr-2" /> Email address
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {userData.email}
                </dd>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
              >
                <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                  <FaUserShield className="text-red-500 mr-2" /> Role
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {userData.role}
                </dd>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
              >
                <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                  <FaPhone className="text-yellow-500 mr-2" /> Phone
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {userData.phone || "N/A"}
                </dd>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
              >
                <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                  <FaMapMarkerAlt className="text-red-500 mr-2" /> Street
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {userData.address?.street || "N/A"}
                </dd>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.5 }}
                className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
              >
                <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                  <FaMapMarkerAlt className="text-red-500 mr-2" /> City
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {userData.address?.city || "N/A"}
                </dd>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.5 }}
                className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
              >
                <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                  <FaMapMarkerAlt className="text-red-500 mr-2" /> State
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {userData.address?.state || "N/A"}
                </dd>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0, duration: 0.5 }}
                className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
              >
                <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                  <FaMapMarkerAlt className="text-red-500 mr-2" /> Postal Code
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {userData.address?.postalCode || "N/A"}
                </dd>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.5 }}
                className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
              >
                <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                  <FaMapMarkerAlt className="text-red-500 mr-2" /> Country
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {userData.address?.country || "N/A"}
                </dd>
              </motion.div>
            </dl>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.5 }}
            className="mt-6 flex justify-end"
          >
            <button
              onClick={handleUpdateProfile}
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 focus:outline-none"
            >
              <MdEdit className="mr-2" />
              Update Profile
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
