// // file: src/pages/SingleUser.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   FaUser,
//   FaEnvelope,
//   FaPhone,
//   FaMapMarkerAlt,
//   FaUserShield,
//   FaUserCircle,
// } from "react-icons/fa";
// import { useParams } from "react-router-dom";
// import globalBackendRoute from "../../config/Config";

// const ROLES =
//   "accountant,admin,alumni_relations,business_analyst,content_creator,course_coordinator,customer_support,data_scientist,dean,department_head,developer_lead,developer,event_coordinator,exam_controller,hr_manager,hr,intern,legal_advisor,librarian,maintenance_staff,marketing_manager,operations_manager,product_owner,project_manager,qa_lead,recruiter,registrar,researcher,sales_executive,student,superadmin,support_engineer,teacher,tech_lead,test_engineer,user,ux_ui_designer".split(
//     ","
//   );

// const authHeaders = () => {
//   const t = localStorage.getItem("userToken");
//   return t ? { Authorization: `Bearer ${t}` } : {};
// };

// const imgUrl = (a) => {
//   if (!a) return null;
//   try {
//     const n = String(a).replace(/\\/g, "/").split("uploads/").pop();
//     return `${globalBackendRoute}/uploads/${n}`;
//   } catch {
//     return null;
//   }
// };

// const Row = ({ icon: Icon, label, value, iconClass }) => (
//   <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2">
//     <div className="text-sm font-medium text-slate-900 flex items-center min-w-0">
//       <Icon className={`${iconClass} mr-2 shrink-0`} />
//       <span className="truncate">{label}</span>
//     </div>
//     <div className="sm:col-span-2 text-sm text-slate-700 break-words">
//       {value}
//     </div>
//   </div>
// );

// export default function SingleUser() {
//   const { id } = useParams();
//   const [u, setU] = useState(null);
//   const [role, setRole] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [imgBroken, setImgBroken] = useState(false);

//   useEffect(() => {
//     let on = true;
//     (async () => {
//       try {
//         const { data } = await axios.get(
//           `${globalBackendRoute}/api/user/${id}`,
//           {
//             headers: authHeaders(),
//           }
//         );
//         if (!on) return;
//         setU(data || null);
//         setRole(data?.role || "");
//       } catch (e) {
//         console.error("fetch user error:", e);
//       } finally {
//         on && setLoading(false);
//       }
//     })();
//     return () => {
//       on = false;
//     };
//   }, [id]);

//   const updateRole = async () => {
//     if (!u || role === u.role) return alert("No changes detected in role.");
//     if (!window.confirm(`Update user role from "${u.role}" to "${role}"?`))
//       return;
//     try {
//       setSaving(true);
//       const { data } = await axios.patch(
//         `${globalBackendRoute}/api/user/${id}/role`,
//         { role },
//         { headers: { "Content-Type": "application/json", ...authHeaders() } }
//       );
//       setU(data.user);
//       alert(`Successfully updated role to "${data.user.role}".`);
//     } catch (e) {
//       console.error("update role error:", e);
//       alert("Failed to update user role. Please try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <div className="text-center py-12">Loading...</div>;
//   if (!u)
//     return (
//       <div className="text-center py-12 text-rose-600">User not found.</div>
//     );

//   const src = imgUrl(u.avatar);
//   const showImg = !!src && !imgBroken;

//   const rows = [
//     {
//       icon: FaUser,
//       label: "Full name",
//       value: u.name || "—",
//       iconClass: "text-indigo-600",
//     },
//     {
//       icon: FaEnvelope,
//       label: "Email address",
//       value: u.email || "—",
//       iconClass: "text-emerald-600",
//     },
//     {
//       icon: FaUserShield,
//       label: "Role",
//       value: u.role || "—",
//       iconClass: "text-rose-600",
//     },
//     {
//       icon: FaPhone,
//       label: "Phone",
//       value: u.phone || "N/A",
//       iconClass: "text-amber-500",
//     },
//     {
//       icon: FaMapMarkerAlt,
//       label: "Street",
//       value: u.address?.street || "N/A",
//       iconClass: "text-sky-600",
//     },
//     {
//       icon: FaMapMarkerAlt,
//       label: "City",
//       value: u.address?.city || "N/A",
//       iconClass: "text-sky-600",
//     },
//     {
//       icon: FaMapMarkerAlt,
//       label: "State",
//       value: u.address?.state || "N/A",
//       iconClass: "text-sky-600",
//     },
//     {
//       icon: FaMapMarkerAlt,
//       label: "Postal Code",
//       value: u.address?.postalCode || "N/A",
//       iconClass: "text-sky-600",
//     },
//     {
//       icon: FaMapMarkerAlt,
//       label: "Country",
//       value: u.address?.country || "N/A",
//       iconClass: "text-sky-600",
//     },
//   ];

//   return (
//     <div className="mx-auto max-w-5xl p-4 sm:p-6">
//       {/* Top bar */}
//       <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
//         <h1 className="text-lg sm:text-2xl font-semibold text-slate-800">
//           User Details
//         </h1>

//         {/* Actions: compact on mobile */}
//         <div className="flex gap-2 w-full sm:w-auto">
//           <select
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             className="w-1/2 sm:w-auto text-xs sm:text-sm bg-slate-100 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-200"
//           >
//             {ROLES.map((r) => (
//               <option key={r} value={r}>
//                 {r}
//               </option>
//             ))}
//           </select>
//           <button
//             onClick={updateRole}
//             disabled={saving}
//             className="w-1/2 sm:w-auto text-xs sm:text-sm px-3 py-1 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
//           >
//             {saving ? "Updating..." : "Update Role"}
//           </button>
//         </div>
//       </div>

//       {/* Content: 1-col on mobile, 2-col from md */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
//         {/* Left: Avatar — full width & square on mobile */}
//         <div className="md:col-span-1">
//           <div className="w-full aspect-square sm:aspect-square md:aspect-auto md:w-56 md:h-56">
//             {showImg ? (
//               <img
//                 src={src}
//                 alt={u.name || "User avatar"}
//                 onError={() => setImgBroken(true)}
//                 loading="lazy"
//                 className="w-full h-full object-cover rounded-2xl"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center">
//                 <FaUserCircle className="text-slate-400 w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36" />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right: Details */}
//         <div className="md:col-span-2 min-w-0">
//           {/* Header info */}
//           <div className="mb-3 sm:mb-4">
//             <div className="text-base sm:text-xl md:text-2xl font-semibold text-slate-800 break-words">
//               {u.name || "—"}
//             </div>
//             <div className="text-sm sm:text-base text-slate-600 break-all">
//               {u.email || "—"}
//             </div>
//             <div className="mt-2 inline-flex items-center text-xs sm:text-sm px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
//               <FaUserShield className="mr-2 shrink-0" /> {u.role || "—"}
//             </div>
//           </div>

//           {/* Rows (no borders/shadows) */}
//           <div className="space-y-1 sm:space-y-2">
//             {rows.map((r) => (
//               <Row
//                 key={r.label}
//                 icon={r.icon}
//                 label={r.label}
//                 value={r.value}
//                 iconClass={r.iconClass}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//

// file: src/pages/SingleUser.jsx
"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
  memo,
} from "react";
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
import { useParams } from "react-router-dom";
import globalBackendRoute from "../../config/Config";
import profileBanner from "../../assets/images/profile_banner.jpg";

const ROLES =
  "accountant,admin,alumni_relations,business_analyst,content_creator,course_coordinator,customer_support,data_scientist,dean,department_head,developer_lead,developer,event_coordinator,exam_controller,hr_manager,hr,intern,legal_advisor,librarian,maintenance_staff,marketing_manager,operations_manager,product_owner,project_manager,qa_lead,recruiter,registrar,researcher,sales_executive,student,superadmin,support_engineer,teacher,tech_lead,test_engineer,user,ux_ui_designer".split(
    ",",
  );

const HERO_TAGS = ["USER", "PROFILE", "ACCOUNT", "ADMIN VIEW"];

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

const ICON_CLASS = Object.freeze({
  indigo: "text-indigo-600",
  green: "text-green-500",
  rose: "text-rose-500",
  amber: "text-amber-500",
  red: "text-red-500",
});

function getAuthHeaders() {
  const token = localStorage.getItem("userToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function normalizeAvatarPath(avatar) {
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

function normalizeUser(rawUser) {
  if (!rawUser) return null;

  return {
    _id: rawUser._id || "",
    name: rawUser.name || "—",
    email: rawUser.email || "—",
    role: rawUser.role || "—",
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

const Toast = memo(function Toast({ toast, onClose }) {
  if (!toast) return null;

  const typeClasses =
    toast.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : toast.type === "error"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-indigo-200 bg-indigo-50 text-indigo-700";

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.22 }}
      className={`fixed right-4 top-4 z-[9999] max-w-sm rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-sm ${typeClasses}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.message ? (
            <p className="mt-1 text-xs sm:text-sm opacity-90">
              {toast.message}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium hover:bg-black/5"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
});

const SkeletonLine = memo(function SkeletonLine({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`} />
  );
});

const ProfileSkeleton = memo(function ProfileSkeleton() {
  return (
    <div className="service-page-wrap min-h-screen">
      <main className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[320px,minmax(0,1fr)] gap-8 lg:gap-10 items-start">
            <section className="glass-card p-5 sm:p-6">
              <SkeletonLine className="h-4 w-32" />

              <div className="mt-5 flex flex-col items-center text-center">
                <div className="h-32 w-32 sm:h-40 sm:w-40 animate-pulse rounded-2xl bg-slate-200 border border-slate-200" />
                <SkeletonLine className="mt-4 h-6 w-40" />
                <SkeletonLine className="mt-2 h-4 w-52" />
                <SkeletonLine className="mt-4 h-8 w-28 rounded-2xl" />
                <SkeletonLine className="mt-6 h-11 w-full rounded-2xl" />
                <SkeletonLine className="mt-4 h-11 w-full rounded-2xl" />
              </div>
            </section>

            <section>
              <SkeletonLine className="h-7 w-40" />

              <div className="glass-card mt-5 p-5 sm:p-6 lg:p-7">
                <SkeletonLine className="h-4 w-40" />

                <div className="mt-6 grid grid-cols-1 gap-4">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-[220px,minmax(0,1fr)] gap-3 sm:gap-4 items-start">
                        <SkeletonLine className="h-5 w-36" />
                        <SkeletonLine className="h-5 w-full" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <SkeletonLine className="h-11 w-36 rounded-2xl" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
});

const DetailRow = memo(function DetailRow({ label, value, icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.03, duration: 0.24 }}
      className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[220px,minmax(0,1fr)] gap-3 sm:gap-4 items-start">
        <div className="flex items-center text-sm font-medium text-slate-900 min-w-0">
          <span className="form-icon-badge mr-2 !mr-2 shrink-0">{icon}</span>
          <span className="truncate">{label}</span>
        </div>

        <div className="text-sm sm:text-base text-slate-700 break-words">
          {value}
        </div>
      </div>
    </motion.div>
  );
});

const UserPreviewCard = memo(function UserPreviewCard({
  userData,
  imageUrl,
  imgError,
  onImageError,
  role,
  onRoleChange,
  onUpdateRole,
  saving,
  isRoleChanged,
}) {
  const showImage = Boolean(imageUrl) && !imgError;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="glass-card p-5 sm:p-6"
    >
      <p className="service-badge-heading">User preview</p>

      <div className="mt-5 flex flex-col items-center text-center">
        {showImage ? (
          <motion.img
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.28 }}
            src={imageUrl}
            alt={userData.name || "User avatar"}
            onError={onImageError}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-2xl border border-slate-200 shadow-sm"
          />
        ) : (
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.28 }}
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

        <div className="mt-6 w-full">
          <label className="block text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 mb-2">
            Change role
          </label>

          <select
            value={role}
            onChange={onRoleChange}
            disabled={saving}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
          >
            {ROLES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onUpdateRole}
            disabled={saving || !isRoleChanged}
            className="primary-gradient-button mt-4 w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <MdEdit className="mr-2" />
            {saving ? "Updating..." : "Update Role"}
          </button>
        </div>
      </div>
    </motion.section>
  );
});

const UserDetailsCard = memo(function UserDetailsCard({
  rows,
  onUpdateRole,
  saving,
  isRoleChanged,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
    >
      <div className="glass-card p-5 sm:p-6 lg:p-7">
        <p className="service-badge-heading">Account information</p>

        <div className="mt-6 grid grid-cols-1 gap-4">
          {rows.map((item, index) => (
            <DetailRow
              key={item.label}
              label={item.label}
              value={item.value}
              icon={item.icon}
              index={index}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onUpdateRole}
            disabled={saving || !isRoleChanged}
            className="primary-gradient-button disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <MdEdit className="mr-2" />
            {saving ? "Updating..." : "Update Role"}
          </button>
        </div>
      </div>
    </motion.section>
  );
});

function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const clearToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback((nextToast) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToast(nextToast);

    timerRef.current = setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    toast,
    showToast,
    clearToast,
  };
}

function useUserById(id) {
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imgError, setImgError] = useState(false);

  const cancelRef = useRef(null);

  const fetchUser = useCallback(async () => {
    if (!id) {
      setUserData(null);
      setRole("");
      setLoading(false);
      return;
    }

    if (cancelRef.current) {
      cancelRef.current.abort();
    }

    const controller = new AbortController();
    cancelRef.current = controller;

    try {
      setLoading(true);

      const response = await axios.get(`${globalBackendRoute}/api/user/${id}`, {
        headers: getAuthHeaders(),
        signal: controller.signal,
      });

      const normalized = normalizeUser(response?.data || null);
      setUserData(normalized);
      setRole(normalized?.role || "");
      setImgError(false);
    } catch (error) {
      if (
        error?.name === "CanceledError" ||
        error?.name === "AbortError" ||
        axios.isCancel?.(error)
      ) {
        return;
      }

      console.error("fetch user error:", error);
      setUserData(null);
      setRole("");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();

    return () => {
      if (cancelRef.current) {
        cancelRef.current.abort();
      }
    };
  }, [fetchUser]);

  const imageUrl = useMemo(
    () => normalizeAvatarPath(userData?.avatar),
    [userData],
  );
  const isRoleChanged = useMemo(
    () => Boolean(userData) && role.trim() !== "" && role !== userData.role,
    [role, userData],
  );

  const onRoleChange = useCallback((event) => {
    setRole(event.target.value);
  }, []);

  const onImageError = useCallback(() => {
    setImgError(true);
  }, []);

  const updateRoleOptimistically = useCallback(
    async (showToast) => {
      if (!userData) return;

      const nextRole = role.trim();

      if (!nextRole) {
        showToast({
          type: "error",
          title: "Invalid role",
          message: "Please select a valid role before updating.",
        });
        return;
      }

      if (nextRole === userData.role) {
        showToast({
          type: "info",
          title: "No changes detected",
          message: "The selected role is already assigned to this user.",
        });
        return;
      }

      const previousUser = userData;
      const optimisticUser = {
        ...userData,
        role: nextRole,
      };

      setSaving(true);
      setUserData(optimisticUser);

      try {
        const response = await axios.patch(
          `${globalBackendRoute}/api/user/${id}/role`,
          { role: nextRole },
          {
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeaders(),
            },
          },
        );

        const updatedUser = normalizeUser(response?.data?.user || null);

        if (!updatedUser) {
          throw new Error("Invalid role update response.");
        }

        setUserData(updatedUser);
        setRole(updatedUser.role);

        showToast({
          type: "success",
          title: "Role updated",
          message: `User role changed to "${updatedUser.role}".`,
        });
      } catch (error) {
        console.error("update role error:", error);

        setUserData(previousUser);
        setRole(previousUser.role);

        showToast({
          type: "error",
          title: "Update failed",
          message: "Failed to update user role. Please try again.",
        });
      } finally {
        setSaving(false);
      }
    },
    [id, role, userData],
  );

  return {
    userData,
    role,
    loading,
    saving,
    imgError,
    imageUrl,
    isRoleChanged,
    setRole,
    onRoleChange,
    onImageError,
    updateRoleOptimistically,
    refetchUser: fetchUser,
  };
}

function SingleUser() {
  const { id } = useParams();

  const { toast, showToast, clearToast } = useToast();

  const {
    userData,
    role,
    loading,
    saving,
    imgError,
    imageUrl,
    isRoleChanged,
    onRoleChange,
    onImageError,
    updateRoleOptimistically,
  } = useUserById(id);

  const handleUpdateRole = useCallback(() => {
    updateRoleOptimistically(showToast);
  }, [updateRoleOptimistically, showToast]);

  const rows = useMemo(() => {
    if (!userData) return [];

    return [
      {
        label: "Full name",
        value: userData.name,
        icon: <FaUser className={ICON_CLASS.indigo} />,
      },
      {
        label: "Email address",
        value: userData.email,
        icon: <FaEnvelope className={ICON_CLASS.green} />,
      },
      {
        label: "Role",
        value: userData.role,
        icon: <FaUserShield className={ICON_CLASS.rose} />,
      },
      {
        label: "Phone",
        value: userData.phone,
        icon: <FaPhone className={ICON_CLASS.amber} />,
      },
      {
        label: "Street",
        value: userData.address.street,
        icon: <FaMapMarkerAlt className={ICON_CLASS.red} />,
      },
      {
        label: "City",
        value: userData.address.city,
        icon: <FaMapMarkerAlt className={ICON_CLASS.red} />,
      },
      {
        label: "State",
        value: userData.address.state,
        icon: <FaMapMarkerAlt className={ICON_CLASS.red} />,
      },
      {
        label: "Postal code",
        value: userData.address.postalCode,
        icon: <FaMapMarkerAlt className={ICON_CLASS.red} />,
      },
      {
        label: "Country",
        value: userData.address.country,
        icon: <FaMapMarkerAlt className={ICON_CLASS.red} />,
      },
    ];
  }, [userData]);

  if (loading) {
    return (
      <>
        <Toast toast={toast} onClose={clearToast} />
        <ProfileSkeleton />
      </>
    );
  }

  if (!userData) {
    return (
      <div className="service-page-wrap min-h-screen flex items-center justify-center">
        <Toast toast={toast} onClose={clearToast} />
        <div className="glass-card px-6 py-5 text-center">
          <p className="service-badge-heading text-rose-600">User not found</p>
          <p className="mt-2 service-paragraph">
            The requested user profile could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="service-page-wrap min-h-screen">
      <Toast toast={toast} onClose={clearToast} />

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
                User{" "}
                <span className="service-hero-title-highlight">
                  profile details
                </span>
              </h1>

              <p className="service-hero-text">
                View account information, contact details, address details, and
                manage the assigned role from one place.
              </p>

              <div className="service-hero-status">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Admin profile view is active
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <main className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[320px,minmax(0,1fr)] gap-8 lg:gap-10 items-start">
            <UserPreviewCard
              userData={userData}
              imageUrl={imageUrl}
              imgError={imgError}
              onImageError={onImageError}
              role={role}
              onRoleChange={onRoleChange}
              onUpdateRole={handleUpdateRole}
              saving={saving}
              isRoleChanged={isRoleChanged}
            />

            <UserDetailsCard
              rows={rows}
              onUpdateRole={handleUpdateRole}
              saving={saving}
              isRoleChanged={isRoleChanged}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default memo(SingleUser);
