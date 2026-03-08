"use client";

import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserCircle,
  FaImage,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

import updateProfileBanner from "../../assets/images/profile_banner.jpg";

const HERO_TAGS = ["UPDATE PROFILE", "ACCOUNT", "SETTINGS", "AVATAR"];

const HERO_STYLE = {
  backgroundImage: `url(${updateProfileBanner})`,
};

function UpdateProfile() {
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
    avatar: null,
  });

  const [previewSrc, setPreviewSrc] = useState(null);
  const [imgError, setImgError] = useState(false);

  const serverUrlFromAvatarPath = (avatar) => {
    if (!avatar) return null;
    if (typeof avatar === "string" && /^https?:\/\//i.test(avatar)) {
      return avatar;
    }
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
          `${globalBackendRoute}/api/user/${id}`,
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
          avatar: null,
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
    setUserData((u) => ({
      ...u,
      address: { ...u.address, [name]: value },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setUserData((u) => ({ ...u, avatar: file }));

    if (file) {
      if (previewSrc && previewSrc.startsWith("blob:")) {
        URL.revokeObjectURL(previewSrc);
      }
      const objUrl = URL.createObjectURL(file);
      setPreviewSrc(objUrl);
      setImgError(false);
    } else {
      setImgError(false);
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
        { headers: { "Content-Type": "multipart/form-data" } },
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
                Update your{" "}
                <span className="service-hero-title-highlight">
                  profile details
                </span>
              </h1>

              <p className="service-hero-text">
                Edit your account information, upload a new avatar, and keep
                your contact and address details up to date.
              </p>

              <div className="service-hero-status">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Changes save directly to your account
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
              <p className="service-badge-heading">Avatar preview</p>

              <div className="mt-5 flex flex-col items-center text-center">
                {showImage ? (
                  <motion.img
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.35 }}
                    src={previewSrc}
                    alt="User avatar preview"
                    onError={() => setImgError(true)}
                    className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-2xl border border-slate-200 shadow-sm"
                  />
                ) : (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.35 }}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm"
                    aria-label="Default user avatar"
                  >
                    <FaUserCircle className="w-20 h-20 sm:w-24 sm:h-24 text-slate-400" />
                  </motion.div>
                )}

                <div className="mt-5 w-full text-left">
                  <label className="form-label">
                    <span className="form-icon-badge">
                      <FaImage className="text-[11px]" />
                    </span>
                    Change avatar
                  </label>

                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-input mt-2.5 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
                  />

                  <p className="mt-2 form-help-text">PNG/JPG up to ~5MB.</p>
                </div>
              </div>
            </motion.section>

            {/* RIGHT */}
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
            >
              <h2 className="service-main-heading">Update form</h2>

              <div className="glass-card mt-5 p-5 sm:p-6 lg:p-7">
                <p className="service-badge-heading">Edit profile</p>
                <p className="mt-3 form-help-text">
                  Update your details below and save your changes.
                </p>

                <form onSubmit={handleSubmit} className="mt-6">
                  <div className="grid grid-cols-1 gap-y-5">
                    <div>
                      <label htmlFor="name" className="form-label">
                        <span className="form-icon-badge">
                          <FaUser className="text-[11px]" />
                        </span>
                        Full name
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        className="form-input mt-2.5"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="form-label">
                        <span className="form-icon-badge">
                          <FaEnvelope className="text-[11px]" />
                        </span>
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="form-input mt-2.5"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="form-label">
                        <span className="form-icon-badge">
                          <FaPhone className="text-[11px]" />
                        </span>
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="text"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        className="form-input mt-2.5"
                      />
                    </div>

                    <div>
                      <label htmlFor="street" className="form-label">
                        <span className="form-icon-badge">
                          <FaMapMarkerAlt className="text-[11px]" />
                        </span>
                        Street
                      </label>
                      <input
                        id="street"
                        type="text"
                        name="street"
                        value={userData.address.street}
                        onChange={handleAddressChange}
                        className="form-input mt-2.5"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="form-label">
                        <span className="form-icon-badge">
                          <FaMapMarkerAlt className="text-[11px]" />
                        </span>
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        name="city"
                        value={userData.address.city}
                        onChange={handleAddressChange}
                        className="form-input mt-2.5"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="form-label">
                        <span className="form-icon-badge">
                          <FaMapMarkerAlt className="text-[11px]" />
                        </span>
                        State
                      </label>
                      <input
                        id="state"
                        type="text"
                        name="state"
                        value={userData.address.state}
                        onChange={handleAddressChange}
                        className="form-input mt-2.5"
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="form-label">
                        <span className="form-icon-badge">
                          <FaMapMarkerAlt className="text-[11px]" />
                        </span>
                        Postal code
                      </label>
                      <input
                        id="postalCode"
                        type="text"
                        name="postalCode"
                        value={userData.address.postalCode}
                        onChange={handleAddressChange}
                        className="form-input mt-2.5"
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="form-label">
                        <span className="form-icon-badge">
                          <FaMapMarkerAlt className="text-[11px]" />
                        </span>
                        Country
                      </label>
                      <input
                        id="country"
                        type="text"
                        name="country"
                        value={userData.address.country}
                        onChange={handleAddressChange}
                        className="form-input mt-2.5"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/profile/${id}`)}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50"
                    >
                      Cancel
                    </button>

                    <button type="submit" className="primary-gradient-button">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default memo(UpdateProfile);
