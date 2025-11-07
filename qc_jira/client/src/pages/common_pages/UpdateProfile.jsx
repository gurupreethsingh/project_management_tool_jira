import React, { useEffect, useState, useEffect as UseEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserCircle,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

export default function UpdateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    avatar: null, // can be File (when chosen) or null
  });

  // Preview source (server URL or local object URL)
  const [previewSrc, setPreviewSrc] = useState(null);
  const [imgError, setImgError] = useState(false);

  const serverUrlFromAvatarPath = (avatar) => {
    if (!avatar) return null;
    // If backend returns a full URL already, use it as-is
    if (typeof avatar === "string" && /^https?:\/\//i.test(avatar))
      return avatar;
    // Otherwise normalize server relative path
    if (typeof avatar === "string") {
      const normalizedPath = avatar.replace(/\\/g, "/").split("uploads/").pop();
      return `${globalBackendRoute}/uploads/${normalizedPath}`;
    }
    return null;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${globalBackendRoute}/api/user/${id}`
        );
        const fetchedData = response.data || {};

        const addressData = fetchedData.address || {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        };

        setUserData((prev) => ({
          ...prev,
          name: fetchedData.name || "",
          email: fetchedData.email || "",
          phone: fetchedData.phone || "",
          address: addressData,
          avatar: null, // keep null; preview will use fetched path below
        }));

        const url = serverUrlFromAvatarPath(fetchedData.avatar);
        setPreviewSrc(url);
        setImgError(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  // Revoke object URL on unmount or when user picks a new file
  useEffect(() => {
    return () => {
      if (previewSrc && previewSrc.startsWith("blob:")) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((u) => ({ ...u, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUserData((u) => ({ ...u, address: { ...u.address, [name]: value } }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setUserData((u) => ({ ...u, avatar: file }));

    // show preview immediately
    if (file) {
      if (previewSrc && previewSrc.startsWith("blob:"))
        URL.revokeObjectURL(previewSrc);
      const objUrl = URL.createObjectURL(file);
      setPreviewSrc(objUrl);
      setImgError(false);
    } else {
      // cleared file input → fall back to existing server image or icon
      setImgError(false);
      // keep whatever server preview we previously had, otherwise null
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("phone", userData.phone);
    formData.append("street", userData.address.street);
    formData.append("city", userData.address.city);
    formData.append("state", userData.address.state);
    formData.append("postalCode", userData.address.postalCode);
    formData.append("country", userData.address.country);

    if (userData.avatar) {
      formData.append("avatar", userData.avatar);
    }

    try {
      const response = await axios.put(
        `${globalBackendRoute}/api/update-user/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        alert("Profile updated successfully.");
        navigate(`/profile/${id}`);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const showImage = Boolean(previewSrc) && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <motion.h3
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-base font-semibold leading-7 text-gray-900 text-left"
      >
        Update Profile
      </motion.h3>

      {/* Avatar preview (image or icon) */}
      <div className="mt-6 flex items-center gap-4">
        {showImage ? (
          <motion.img
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            src={previewSrc}
            alt="User avatar preview"
            onError={() => setImgError(true)}
            className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-xl border border-slate-200"
          />
        ) : (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200"
            aria-label="Default user avatar"
          >
            <FaUserCircle className="w-16 h-16 sm:w-20 sm:h-20 text-slate-400" />
          </motion.div>
        )}

        <label className="block">
          <span className="text-sm font-medium text-gray-900">
            Change Avatar
          </span>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
          />
          <p className="text-xs text-slate-500 mt-1">PNG/JPG up to ~5MB.</p>
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6"
        >
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaUser className="text-indigo-500 mr-2" /> Full Name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="p-2 w-full rounded-md border border-slate-200 focus:outline-none"
                />
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaEnvelope className="text-green-500 mr-2" /> Email
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="p-2 w-full rounded-md border border-slate-200 focus:outline-none"
                />
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaPhone className="text-yellow-500 mr-2" /> Phone
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  className="p-2 w-full rounded-md border border-slate-200 focus:outline-none"
                />
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaMapMarkerAlt className="text-red-500 mr-2" /> Street
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="street"
                  value={userData.address.street}
                  onChange={handleAddressChange}
                  className="p-2 w-full rounded-md border border-slate-200 focus:outline-none"
                />
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaMapMarkerAlt className="text-red-500 mr-2" /> City
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="city"
                  value={userData.address.city}
                  onChange={handleAddressChange}
                  className="p-2 w-full rounded-md border border-slate-200 focus:outline-none"
                />
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaMapMarkerAlt className="text-red-500 mr-2" /> State
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="state"
                  value={userData.address.state}
                  onChange={handleAddressChange}
                  className="p-2 w-full rounded-md border border-slate-200 focus:outline-none"
                />
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaMapMarkerAlt className="text-red-500 mr-2" /> Postal Code
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="postalCode"
                  value={userData.address.postalCode}
                  onChange={handleAddressChange}
                  className="p-2 w-full rounded-md border border-slate-200 focus:outline-none"
                />
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaMapMarkerAlt className="text-red-500 mr-2" /> Country
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="country"
                  value={userData.address.country}
                  onChange={handleAddressChange}
                  className="p-2 w-full rounded-md border border-slate-200 focus:outline-none"
                />
              </dd>
            </div>

            {/* File input kept above near preview; this row shows the label in the grid if you prefer grid placement
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaUser className="text-blue-500 mr-2" /> Avatar
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input type="file" name="avatar" accept="image/*" onChange={handleFileChange} className="p-2 w-full rounded-md focus:outline-none" />
              </dd>
            </div>
            */}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 flex justify-end"
        >
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 focus:outline-none"
          >
            Save Changes
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
