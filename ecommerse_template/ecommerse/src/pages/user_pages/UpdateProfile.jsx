import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { MdSave } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

export default function UpdateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
    avatar: "",
    role: "",
  });

  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/getUserById/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const user = res.data;
        setFormData({
          ...user,
          address: {
            street: user.address?.street || "",
            city: user.address?.city || "",
            state: user.address?.state || "",
            postalCode: user.address?.postalCode || "",
            country: user.address?.country || "",
          },
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const form = new FormData();

    try {
      for (let key in formData) {
        if (key === "address") {
          form.append("address", JSON.stringify(formData.address));
        } else {
          form.append(key, formData[key]);
        }
      }
      if (avatar) form.append("avatar", avatar);

      await axios.put(`${globalBackendRoute}/api/update-profile/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile updated successfully!");
      navigate(`/profile/${id}`);
    } catch (err) {
      console.error("Error updating profile:", err.response || err);
      alert("Failed to update profile.");
    }
  };

  const getImageUrl = (avatarPath) => {
    if (!avatarPath || avatarPath === "undefined" || avatarPath === "null") {
      return "https://placehold.co/150x150?text=No+Image";
    }
    return `${globalBackendRoute}/${String(avatarPath).replace(/\\/g, "/")}`;
  };

  return (
    <div className="up-font up-scope w-full">
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

        /* Desktop field styles */
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
        .fieldInput{
          width: 100%;
          border-radius: 18px;
          background: rgba(241,245,249,.8);
          border: 1px solid rgb(241,245,249);
          padding: 11px 14px;
          font-weight: 700;
          font-size: 13px;
          color: rgb(15,23,42);
          outline: none;
          transition: box-shadow .15s ease, border-color .15s ease, background .15s ease;
        }
        .fieldInput:focus{
          background: white;
          border-color: rgb(253,186,116);
          box-shadow: 0 0 0 4px rgba(251,191,36,.18);
        }

        /* --- MOBILE COMPACT TUNING --- */
        .mTitle{ padding: 10px 14px; }
        .mField{ padding: 10px 14px; }
        .mInputWrap{ padding: 6px 10px; border-radius: 16px; }
        .mInput{ font-size: 13px; font-weight: 700; }
        .mLabel{ font-size: 12px; font-weight: 900; }
        .mSub{ font-size: 12px; font-weight: 700; color: rgb(100,116,139); margin-top: 2px; }
        .mChip{ font-size: 11px; font-weight: 800; }
        .mBtn{ padding: 10px 14px; font-size: 13px; }
        .mStickyPad{ padding-bottom: 86px; } /* room for sticky actions */

        @media (min-width: 1024px){
          .shell{
            max-width: 1100px;
            margin: 0 auto;
          }
        }
      `}</style>

      <div className="shell w-full px-3 sm:px-5 lg:px-10 py-6">
        {/* ========= MOBILE (more compact) ========= */}
        <div className="sm:hidden">
          {/* Hero image: shorter + tighter */}
          <div className="relative w-full overflow-hidden rounded-3xl bg-slate-100 upCard">
            <img
              src={getImageUrl(formData.avatar)}
              alt={formData.name}
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
                  Update Profile
                </p>
                <h2 className="text-white text-[16px] font-extrabold truncate leading-tight">
                  {formData.name || "Your Name"}
                </h2>
                <p className="text-white/90 text-[11px] font-semibold truncate">
                  {formData.email || "your@email.com"}
                </p>
              </div>

              {/* tiny quick save (still exists) */}
              <button
                type="submit"
                form="updateProfileForm"
                className="shrink-0 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-extrabold text-[11px] px-3 py-2 shadow-md active:scale-[0.99] transition"
                aria-label="Save profile"
              >
                <span className="inline-flex items-center gap-1.5">
                  <MdSave /> Save
                </span>
              </button>
            </div>
          </div>

          {/* Mobile form (compact + some 2-col rows) */}
          <form
            id="updateProfileForm"
            onSubmit={handleSubmit}
            className="mt-3 mStickyPad"
          >
            <div className="upCard overflow-hidden">
              <SectionTitleCompact
                title="Account Details"
                subtitle="Edit your personal information"
              />

              <div
                className="divide-y"
                style={{ borderColor: "rgb(241,245,249)" }}
              >
                <MobileEditableFieldCompact
                  icon={<FaUser className="text-blue-600" />}
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />

                {/* Email + Phone in 2 columns */}
                <div
                  className="grid grid-cols-2 gap-2 px-3 py-2.5"
                  style={{ borderColor: "rgb(241,245,249)" }}
                >
                  <MobileEditableFieldCompactInline
                    icon={<FaEnvelope className="text-green-600" />}
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  <MobileEditableFieldCompactInline
                    icon={<FaPhone className="text-yellow-600" />}
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                  />
                </div>
              </div>

              <SectionTitleCompact
                title="Address"
                subtitle="Update your delivery location"
                topBorder
              />

              {/* Address: Street full, then 2-col rows */}
              <div
                className="divide-y"
                style={{ borderColor: "rgb(241,245,249)" }}
              >
                <MobileEditableFieldCompact
                  icon={<FaMapMarkerAlt className="text-purple-600" />}
                  label="Street"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Street"
                />

                <div className="grid grid-cols-2 gap-2 px-3 py-2.5">
                  <MobileEditableFieldCompactInline
                    icon={<FaMapMarkerAlt className="text-indigo-600" />}
                    label="City"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                  <MobileEditableFieldCompactInline
                    icon={<FaMapMarkerAlt className="text-pink-500" />}
                    label="State"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 px-3 py-2.5">
                  <MobileEditableFieldCompactInline
                    icon={<FaMapMarkerAlt className="text-cyan-600" />}
                    label="Postal"
                    name="address.postalCode"
                    value={formData.address.postalCode}
                    onChange={handleChange}
                    placeholder="Postal"
                  />
                  <MobileEditableFieldCompactInline
                    icon={<FaMapMarkerAlt className="text-teal-600" />}
                    label="Country"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    placeholder="Country"
                  />
                </div>
              </div>

              {/* Upload row (compact) */}
              <div
                className="px-4 py-3 border-t"
                style={{ borderColor: "rgb(241,245,249)" }}
              >
                <p className="mLabel text-slate-900">Profile Image</p>
                <p className="mSub">Upload a new profile photo</p>

                <div className="mt-2.5">
                  <label
                    htmlFor="profileImageMobile"
                    className="w-full rounded-full bg-slate-50 text-slate-800 font-extrabold text-[13px] px-4 py-2.5 inline-flex items-center justify-center active:scale-[0.99] transition"
                    style={{ border: "1px solid rgb(241,245,249)" }}
                  >
                    Choose File
                  </label>
                  <input
                    id="profileImageMobile"
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {avatar?.name && (
                    <p className="mt-1.5 text-[11px] font-semibold text-slate-600 break-words">
                      Selected:{" "}
                      <span className="font-extrabold">{avatar.name}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky bottom actions (removes need to scroll just to save) */}
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
                      type="submit"
                      className="flex-1 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-extrabold text-[12px] px-4 py-3 shadow-md active:scale-[0.99] transition inline-flex items-center justify-center gap-2"
                    >
                      <MdSave /> Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* ========= DESKTOP/TABLET (unchanged, your “perfect” UI) ========= */}
        <div className="hidden sm:block">
          <form onSubmit={handleSubmit} className="upCard overflow-hidden">
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
                    Update Profile
                  </h1>
                  <p className="mt-1 text-[13px] font-semibold upMuted">
                    Keep your account details accurate for faster checkout.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/profile/${id}`)}
                    className="btnGhost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btnOrange inline-flex items-center gap-2"
                  >
                    <MdSave className="text-[18px]" /> Save Changes
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 lg:px-8 py-7">
              <div className="grid grid-cols-12 gap-7">
                <div className="col-span-12 lg:col-span-4">
                  <div className="upSoftBorder rounded-3xl overflow-hidden bg-white">
                    <div className="relative">
                      <img
                        src={getImageUrl(formData.avatar)}
                        alt={formData.name}
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
                          {formData.name || "Your Name"}
                        </p>
                        <p className="text-white/90 text-[12px] font-semibold truncate">
                          {formData.email || "your@email.com"}
                        </p>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-[12px] font-extrabold text-slate-900">
                        Profile Image
                      </p>
                      <p className="text-[12px] font-semibold upMuted mt-1">
                        Upload a new avatar photo.
                      </p>

                      <div className="mt-4">
                        <label
                          htmlFor="profileImageDesktop"
                          className="btnGhost w-full inline-flex justify-center"
                          style={{ background: "rgba(241,245,249,.8)" }}
                        >
                          Choose File
                        </label>
                        <input
                          id="profileImageDesktop"
                          type="file"
                          onChange={handleImageChange}
                          className="hidden"
                        />

                        {avatar?.name && (
                          <p className="mt-2 text-[12px] font-semibold text-slate-600 break-words">
                            Selected:{" "}
                            <span className="font-extrabold">
                              {avatar.name}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

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
                      <DesktopEditableField
                        icon={<FaUser className="text-blue-600" />}
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                      />
                      <DesktopEditableField
                        icon={<FaEnvelope className="text-green-600" />}
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                      />
                      <DesktopEditableField
                        icon={<FaPhone className="text-yellow-600" />}
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone"
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
                      <DesktopEditableField
                        icon={<FaMapMarkerAlt className="text-purple-600" />}
                        label="Street"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        placeholder="Street"
                      />
                      <DesktopEditableField
                        icon={<FaMapMarkerAlt className="text-indigo-600" />}
                        label="City"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        placeholder="City"
                      />
                      <DesktopEditableField
                        icon={<FaMapMarkerAlt className="text-pink-500" />}
                        label="State"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        placeholder="State"
                      />
                      <DesktopEditableField
                        icon={<FaMapMarkerAlt className="text-cyan-600" />}
                        label="Postal Code"
                        name="address.postalCode"
                        value={formData.address.postalCode}
                        onChange={handleChange}
                        placeholder="Postal Code"
                      />
                      <DesktopEditableField
                        icon={<FaMapMarkerAlt className="text-teal-600" />}
                        label="Country"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        placeholder="Country"
                      />
                    </div>

                    <div
                      className="px-6 py-5 border-t flex items-center justify-end gap-3"
                      style={{ borderColor: "rgb(241,245,249)" }}
                    >
                      <button
                        type="button"
                        onClick={() => navigate(`/profile/${id}`)}
                        className="btnGhost"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btnOrange inline-flex items-center gap-2"
                      >
                        <MdSave className="text-[18px]" /> Save Changes
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 text-[12px] font-semibold upMuted">
                    Tip: Use a clear profile photo so your account looks more
                    trustworthy.
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------- Desktop field row ---------- */
function DesktopEditableField({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="fieldWrap">
      <div className="fieldLabel">
        <span className="shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      <div className="min-w-0">
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className="fieldInput"
        />
      </div>
    </div>
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

/* ---------- Mobile compact full-width field ---------- */
function MobileEditableFieldCompact({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="mField flex items-start gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="mLabel text-slate-700">{label}</p>
        <div
          className="mInputWrap mt-1 bg-slate-50"
          style={{ border: "1px solid rgb(241,245,249)" }}
        >
          <input
            type="text"
            name={name}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            className="mInput w-full bg-transparent outline-none text-slate-900 placeholder-slate-400"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Mobile compact inline field for 2-col rows ---------- */
function MobileEditableFieldCompactInline({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
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
      <div
        className="mt-1 rounded-xl bg-slate-50 px-2.5 py-1.5"
        style={{ border: "1px solid rgb(241,245,249)" }}
      >
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-[13px] font-semibold text-slate-900 placeholder-slate-400"
        />
      </div>
    </div>
  );
}
