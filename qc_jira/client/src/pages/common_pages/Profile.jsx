"use client";

import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import globalBackendRoute from "../../config/Config";
import profileBanner from "../../assets/images/profile_banner.jpg";

const HERO_TAGS = ["PROFILE", "ACCOUNT", "SETTINGS", "USER DETAILS"];

const HERO_STYLE = Object.freeze({
  backgroundImage: `url(${profileBanner})`,
});

const EMPTY_ADDRESS = Object.freeze({
  street: "N/A",
  city: "N/A",
  state: "N/A",
  postalCode: "N/A",
  country: "N/A",
});

function normalizeUser(rawUser) {
  if (!rawUser) return null;

  return {
    _id: rawUser._id || "",
    name: rawUser.name || "",
    email: rawUser.email || "",
    role: rawUser.role || "",
    phone: rawUser.phone || "N/A",
    avatar: rawUser.avatar || null,
    address: {
      street: rawUser.address?.street || EMPTY_ADDRESS.street,
      city: rawUser.address?.city || EMPTY_ADDRESS.city,
      state: rawUser.address?.state || EMPTY_ADDRESS.state,
      postalCode: rawUser.address?.postalCode || EMPTY_ADDRESS.postalCode,
      country: rawUser.address?.country || EMPTY_ADDRESS.country,
    },
  };
}

function getImageUrl(avatar) {
  if (!avatar) return null;

  try {
    const normalizedPath = String(avatar)
      .replace(/\\/g, "/")
      .split("uploads/")
      .pop();

    return normalizedPath
      ? `${globalBackendRoute}/uploads/${normalizedPath}`
      : null;
  } catch {
    return null;
  }
}

const DetailRow = memo(function DetailRow({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.05, duration: 0.3 }}
      className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[220px,minmax(0,1fr)] gap-3 sm:gap-4 items-start">
        <div className="flex items-center text-sm font-medium text-slate-900 min-w-0">
          <span className="form-icon-badge mr-2 !mr-2 shrink-0">
            {item.icon}
          </span>
          <span className="truncate">{item.label}</span>
        </div>

        <div className="text-sm sm:text-base text-slate-700 break-words">
          {item.value}
        </div>
      </div>
    </motion.div>
  );
});

function Profile() {
  const [userData, setUserData] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        setLoading(true);

        const user = JSON.parse(localStorage.getItem("user"));

        if (user && user.id) {
          const response = await axios.get(
            `${globalBackendRoute}/api/user/${user.id}`,
            {
              signal: controller.signal,
            },
          );

          if (!isMounted) return;

          setUserData(normalizeUser(response.data));
          setImgError(false);
        } else {
          console.error("No userId found in localStorage.");
          if (isMounted) setUserData(null);
        }
      } catch (error) {
        if (
          error?.name === "CanceledError" ||
          error?.name === "AbortError" ||
          axios.isCancel?.(error)
        ) {
          return;
        }

        console.error("Error fetching user data:", error);
        if (isMounted) setUserData(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleUpdateProfile = useCallback(() => {
    if (!userData?._id) return;
    navigate(`/update-profile/${userData._id}`);
  }, [navigate, userData]);

  const imageUrl = useMemo(() => getImageUrl(userData?.avatar), [userData]);
  const showImage = useMemo(
    () => Boolean(imageUrl) && !imgError,
    [imageUrl, imgError],
  );

  const detailRows = useMemo(() => {
    if (!userData) return [];

    return [
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
    ];
  }, [userData]);

  const handleImageError = useCallback(() => {
    setImgError(true);
  }, []);

  if (loading || !userData) {
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

      <main className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[320px,minmax(0,1fr)] gap-8 lg:gap-10 items-start">
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
                    onError={handleImageError}
                    loading="lazy"
                    decoding="async"
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

                <h2 className="mt-4 text-lg sm:text-xl font-semibold text-slate-900 break-words">
                  {userData.name}
                </h2>
                <p className="mt-1 text-sm text-slate-600 break-all">
                  {userData.email}
                </p>

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

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
            >
              <div className="glass-card p-5 sm:p-6 lg:p-7">
                <p className="service-badge-heading">Account information</p>

                <div className="mt-6 grid grid-cols-1 gap-4">
                  {detailRows.map((item, index) => (
                    <DetailRow
                      key={`${item.label}-${index}`}
                      item={item}
                      index={index}
                    />
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
