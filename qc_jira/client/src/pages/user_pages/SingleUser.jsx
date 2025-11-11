// file: src/pages/SingleUser.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserShield,
  FaUserCircle,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

const ROLES =
  "accountant,admin,alumni_relations,business_analyst,content_creator,course_coordinator,customer_support,data_scientist,dean,department_head,developer_lead,developer,event_coordinator,exam_controller,hr_manager,hr,intern,legal_advisor,librarian,maintenance_staff,marketing_manager,operations_manager,product_owner,project_manager,qa_lead,recruiter,registrar,researcher,sales_executive,student,superadmin,support_engineer,teacher,tech_lead,test_engineer,user,ux_ui_designer".split(
    ","
  );

const authHeaders = () => {
  const t = localStorage.getItem("userToken");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

const imgUrl = (a) => {
  if (!a) return null;
  try {
    const n = String(a).replace(/\\/g, "/").split("uploads/").pop();
    return `${globalBackendRoute}/uploads/${n}`;
  } catch {
    return null;
  }
};

const Row = ({ icon: Icon, label, value, iconClass }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2">
    <div className="text-sm font-medium text-slate-900 flex items-center min-w-0">
      <Icon className={`${iconClass} mr-2 shrink-0`} />
      <span className="truncate">{label}</span>
    </div>
    <div className="sm:col-span-2 text-sm text-slate-700 break-words">
      {value}
    </div>
  </div>
);

export default function SingleUser() {
  const { id } = useParams();
  const [u, setU] = useState(null);
  const [role, setRole] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imgBroken, setImgBroken] = useState(false);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const { data } = await axios.get(
          `${globalBackendRoute}/api/user/${id}`,
          {
            headers: authHeaders(),
          }
        );
        if (!on) return;
        setU(data || null);
        setRole(data?.role || "");
      } catch (e) {
        console.error("fetch user error:", e);
      } finally {
        on && setLoading(false);
      }
    })();
    return () => {
      on = false;
    };
  }, [id]);

  const updateRole = async () => {
    if (!u || role === u.role) return alert("No changes detected in role.");
    if (!window.confirm(`Update user role from "${u.role}" to "${role}"?`))
      return;
    try {
      setSaving(true);
      const { data } = await axios.patch(
        `${globalBackendRoute}/api/user/${id}/role`,
        { role },
        { headers: { "Content-Type": "application/json", ...authHeaders() } }
      );
      setU(data.user);
      alert(`Successfully updated role to "${data.user.role}".`);
    } catch (e) {
      console.error("update role error:", e);
      alert("Failed to update user role. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!u)
    return (
      <div className="text-center py-12 text-rose-600">User not found.</div>
    );

  const src = imgUrl(u.avatar);
  const showImg = !!src && !imgBroken;

  const rows = [
    {
      icon: FaUser,
      label: "Full name",
      value: u.name || "—",
      iconClass: "text-indigo-600",
    },
    {
      icon: FaEnvelope,
      label: "Email address",
      value: u.email || "—",
      iconClass: "text-emerald-600",
    },
    {
      icon: FaUserShield,
      label: "Role",
      value: u.role || "—",
      iconClass: "text-rose-600",
    },
    {
      icon: FaPhone,
      label: "Phone",
      value: u.phone || "N/A",
      iconClass: "text-amber-500",
    },
    {
      icon: FaMapMarkerAlt,
      label: "Street",
      value: u.address?.street || "N/A",
      iconClass: "text-sky-600",
    },
    {
      icon: FaMapMarkerAlt,
      label: "City",
      value: u.address?.city || "N/A",
      iconClass: "text-sky-600",
    },
    {
      icon: FaMapMarkerAlt,
      label: "State",
      value: u.address?.state || "N/A",
      iconClass: "text-sky-600",
    },
    {
      icon: FaMapMarkerAlt,
      label: "Postal Code",
      value: u.address?.postalCode || "N/A",
      iconClass: "text-sky-600",
    },
    {
      icon: FaMapMarkerAlt,
      label: "Country",
      value: u.address?.country || "N/A",
      iconClass: "text-sky-600",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      {/* Top bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-lg sm:text-2xl font-semibold text-slate-800">
          User Details
        </h1>

        {/* Actions: compact on mobile */}
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-1/2 sm:w-auto text-xs sm:text-sm bg-slate-100 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button
            onClick={updateRole}
            disabled={saving}
            className="w-1/2 sm:w-auto text-xs sm:text-sm px-3 py-1 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Role"}
          </button>
        </div>
      </div>

      {/* Content: 1-col on mobile, 2-col from md */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Left: Avatar — full width & square on mobile */}
        <div className="md:col-span-1">
          <div className="w-full aspect-square sm:aspect-square md:aspect-auto md:w-56 md:h-56">
            {showImg ? (
              <img
                src={src}
                alt={u.name || "User avatar"}
                onError={() => setImgBroken(true)}
                loading="lazy"
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaUserCircle className="text-slate-400 w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36" />
              </div>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="md:col-span-2 min-w-0">
          {/* Header info */}
          <div className="mb-3 sm:mb-4">
            <div className="text-base sm:text-xl md:text-2xl font-semibold text-slate-800 break-words">
              {u.name || "—"}
            </div>
            <div className="text-sm sm:text-base text-slate-600 break-all">
              {u.email || "—"}
            </div>
            <div className="mt-2 inline-flex items-center text-xs sm:text-sm px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
              <FaUserShield className="mr-2 shrink-0" /> {u.role || "—"}
            </div>
          </div>

          {/* Rows (no borders/shadows) */}
          <div className="space-y-1 sm:space-y-2">
            {rows.map((r) => (
              <Row
                key={r.label}
                icon={r.icon}
                label={r.label}
                value={r.value}
                iconClass={r.iconClass}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
