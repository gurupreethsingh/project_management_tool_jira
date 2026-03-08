// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";

// const initialForm = {
//   // UI fields
//   eventName: "",
//   eventDate: "",          // yyyy-mm-dd
//   startTime: "",          // HH:mm
//   endTime: "",            // HH:mm
//   duration: "",
//   description: "",
//   agenda: "",
//   eventType: "Other",     // kept for tagging
//   status: "Pending",      // UI values; will map to model statuses
//   coordinator: "",        // userId
//   guestName: "",
//   location: "",           // venue name or location text
//   department: "",
//   tags: [],
//   attendees: [],          // userIds for "users" audience
//   audienceMode: "all",    // "all" | "roles" | "users"
//   audienceRoles: [],      // role strings (derived from users list)
//   maxParticipants: 100,
//   isOnline: false,
//   meetingLink: "",
//   isPublished: true,      // allow publish on create
// };

// const CreateEvent = () => {
//   const [formData, setFormData] = useState(initialForm);
//   const [users, setUsers] = useState([]);
//   const [message, setMessage] = useState("");
//   const [err, setErr] = useState("");
//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   // Fetch all users (for coordinator/attendees and roles)
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoadingUsers(true);
//         const res = await axios.get(`${globalBackendRoute}/api/all-users`);
//         const list = Array.isArray(res.data) ? res.data : res.data?.users || [];
//         setUsers(list);
//       } catch (e) {
//         console.error("Failed to fetch users:", e);
//         setUsers([]);
//         setErr("Unable to load users. You can still fill the form.");
//       } finally {
//         setLoadingUsers(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const token =
//     localStorage.getItem("userToken") || localStorage.getItem("token");

//   const computeDuration = (start, end) => {
//     if (!start || !end) return "";
//     try {
//       const [sh, sm] = start.split(":").map(Number);
//       const [eh, em] = end.split(":").map(Number);
//       const startMin = sh * 60 + sm;
//       const endMin = eh * 60 + em;
//       const diff = endMin - startMin;
//       if (diff <= 0) return "";
//       const h = Math.floor(diff / 60);
//       const m = diff % 60;
//       return h ? `${h}h ${m}m` : `${m}m`;
//     } catch {
//       return "";
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (name === "startTime" || name === "endTime") {
//       const next = { ...formData, [name]: value };
//       next.duration = computeDuration(next.startTime, next.endTime);
//       setFormData(next);
//       return;
//     }

//     if (type === "checkbox") {
//       setFormData((p) => ({ ...p, [name]: checked }));
//     } else {
//       setFormData((p) => ({ ...p, [name]: value }));
//     }
//   };

//   const handleTagsChange = (e) => {
//     const tags = e.target.value
//       .split(",")
//       .map((t) => t.trim())
//       .filter(Boolean);
//     setFormData((p) => ({ ...p, tags }));
//   };

//   const handleAttendeesChange = (e) => {
//     const selected = Array.from(e.target.selectedOptions, (o) => o.value);
//     setFormData((p) => ({ ...p, attendees: selected }));
//   };

//   const handleAudienceRolesChange = (e) => {
//     const selected = Array.from(e.target.selectedOptions, (o) => o.value);
//     setFormData((p) => ({ ...p, audienceRoles: selected }));
//   };

//   const uniqueRoles = useMemo(() => {
//     const set = new Set();
//     users.forEach((u) => {
//       if (u?.role) set.add(String(u.role).toLowerCase());
//     });
//     return Array.from(set).sort();
//   }, [users]);

//   // Map UI status → model status
//   const mapStatus = (ui) => {
//     switch (String(ui).toLowerCase()) {
//       case "pending":
//         return "scheduled"; // or "draft" if you prefer
//       case "ongoing":
//         return "live";
//       case "completed":
//         return "completed";
//       case "cancelled":
//         return "cancelled";
//       default:
//         return "scheduled";
//     }
//   };

//   // ISO datetime from date + time (assumes local; converts to ISO)
//   const toISODateTime = (dateStr, timeStr) => {
//     if (!dateStr || !timeStr) return null;
//     // Build a Date in local tz, then toISOString
//     const iso = new Date(`${dateStr}T${timeStr}:00`);
//     return isNaN(iso.getTime()) ? null : iso.toISOString();
//     // If your backend expects plain Date (UTC preserved by mongoose),
//     // sending ISO string is perfect.
//   };

//   const validate = () => {
//     const errs = [];
//     if (!formData.eventName.trim()) errs.push("Event Name is required.");
//     if (!formData.eventDate) errs.push("Event Date is required.");
//     if (!formData.startTime) errs.push("Start Time is required.");
//     if (!formData.endTime) errs.push("End Time is required.");
//     if (!formData.description.trim()) errs.push("Description is required.");
//     if (!formData.coordinator) errs.push("Coordinator is required.");

//     const sISO = toISODateTime(formData.eventDate, formData.startTime);
//     const eISO = toISODateTime(formData.eventDate, formData.endTime);
//     if (!sISO || !eISO) errs.push("Invalid start/end date/time.");
//     else if (new Date(eISO) <= new Date(sISO)) errs.push("End Time must be after Start Time.");

//     if (formData.audienceMode === "users" && formData.attendees.length === 0) {
//       errs.push("Please select at least one attendee for 'users' audience.");
//     }
//     if (formData.audienceMode === "roles" && formData.audienceRoles.length === 0) {
//       errs.push("Please select at least one role for 'roles' audience.");
//     }
//     return errs;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setErr("");
//     const errs = validate();
//     if (errs.length) {
//       setErr(errs.join(" "));
//       return;
//     }

//     setSubmitting(true);
//     try {
//       // Build Event payload for the new controller/model
//       const startISO = toISODateTime(formData.eventDate, formData.startTime);
//       const endISO = toISODateTime(formData.eventDate, formData.endTime);

//       // location
//       const location = formData.isOnline
//         ? {
//             kind: "virtual",
//             meetingUrl: formData.meetingLink || undefined,
//             venue: formData.location || undefined, // optional display
//           }
//         : {
//             kind: "physical",
//             venue: formData.location || undefined,
//           };

//       // organizers
//       const organizers = [];
//       if (formData.coordinator) {
//         organizers.push({
//           user: formData.coordinator,
//           role: "coordinator",
//         });
//       }
//       if (formData.guestName?.trim()) {
//         organizers.push({
//           name: formData.guestName.trim(),
//           role: "guest",
//         });
//       }

//       // audience
//       let audience = { mode: "all", roles: [], users: [] };
//       if (formData.audienceMode === "roles") {
//         audience = { mode: "roles", roles: formData.audienceRoles, users: [] };
//       } else if (formData.audienceMode === "users") {
//         audience = { mode: "users", roles: [], users: formData.attendees };
//       }

//       // registration
//       const registration = {
//         isRequired: false,
//         capacity: Number(formData.maxParticipants) || undefined,
//       };

//       // tags (also include eventType/department as tags to keep your UI semantics)
//       const tags = Array.from(
//         new Set(
//           [
//             ...(formData.tags || []),
//             formData.eventType || "",
//             formData.department || "",
//           ]
//             .map((t) => String(t || "").trim())
//             .filter(Boolean)
//         )
//       );

//       const payload = {
//         title: formData.eventName,
//         subtitle: formData.agenda || undefined,
//         description: formData.description,
//         startTime: startISO,
//         endTime: endISO,
//         status: mapStatus(formData.status),
//         audience,
//         location,
//         registration,
//         tags,
//         isPublished: !!formData.isPublished,
//         organizers,
//         // You can add coverImageUrl/attachments/recurrence fields later if you expose them in UI
//       };

//       await axios.post(`${globalBackendRoute}/api/events`, payload, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });

//       setMessage("✅ Event created successfully!");
//       setFormData(initialForm);
//     } catch (error) {
//       console.error("Error creating event:", error);
//       const msg =
//         error?.response?.data?.error ||
//         error?.response?.data?.details ||
//         error?.response?.data?.message ||
//         error?.message ||
//         "Failed to create event";
//       setErr(msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const inputCls =
//     "block w-full rounded-md border border-gray-300 px-3.5 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";
//   const labelCls = "block text-sm font-medium leading-6 text-gray-900";
//   const sectionGrid = "grid grid-cols-1 md:grid-cols-2 gap-4";

//   return (
//     <div className="container mx-auto p-6 bg-white rounded shadow-md max-w-4xl">
//       <h2 className="text-2xl font-bold mb-4">Create Event</h2>

//       {message && (
//         <div className="mb-4 text-sm font-medium text-green-600">{message}</div>
//       )}
//       {err && (
//         <div className="mb-4 text-sm font-medium text-red-600">{err}</div>
//       )}
//       {loadingUsers && (
//         <div className="mb-4 text-sm text-gray-600">Loading users…</div>
//       )}

//       <form onSubmit={handleSubmit} className={sectionGrid}>
//         <div>
//           <label className={labelCls}>Event Name *</label>
//           <input
//             name="eventName"
//             value={formData.eventName}
//             onChange={handleChange}
//             required
//             className={inputCls}
//           />
//         </div>

//         <div>
//           <label className={labelCls}>Event Date *</label>
//           <input
//             type="date"
//             name="eventDate"
//             value={formData.eventDate}
//             onChange={handleChange}
//             required
//             className={inputCls}
//           />
//         </div>

//         <div>
//           <label className={labelCls}>Start Time *</label>
//           <input
//             type="time"
//             name="startTime"
//             value={formData.startTime}
//             onChange={handleChange}
//             required
//             className={inputCls}
//           />
//         </div>

//         <div>
//           <label className={labelCls}>End Time *</label>
//           <input
//             type="time"
//             name="endTime"
//             value={formData.endTime}
//             onChange={handleChange}
//             required
//             className={inputCls}
//           />
//         </div>

//         <div>
//           <label className={labelCls}>Duration</label>
//           <input
//             name="duration"
//             placeholder="Auto-calculated"
//             value={formData.duration}
//             onChange={handleChange}
//             className={inputCls}
//             disabled
//           />
//         </div>

//         <div>
//           <label className={labelCls}>Location / Venue *</label>
//           <input
//             name="location"
//             value={formData.location}
//             onChange={handleChange}
//             required
//             className={inputCls}
//           />
//         </div>

//         <div>
//           <label className={labelCls}>Guest Name</label>
//           <input
//             name="guestName"
//             value={formData.guestName}
//             onChange={handleChange}
//             className={inputCls}
//           />
//         </div>

//         <div>
//           <label className={labelCls}>Department</label>
//           <input
//             name="department"
//             value={formData.department}
//             onChange={handleChange}
//             className={inputCls}
//           />
//         </div>

//         <div>
//           <label className={labelCls}>Agenda (subtitle)</label>
//           <input
//             name="agenda"
//             value={formData.agenda}
//             onChange={handleChange}
//             className={inputCls}
//           />
//         </div>

//         <div>
//           <label className={labelCls}>Tags (comma separated)</label>
//           <input
//             name="tags"
//             onChange={handleTagsChange}
//             className={inputCls}
//             placeholder="training, onboarding"
//           />
//         </div>

//         <div>
//           <label className={labelCls}>Max Participants</label>
//           <input
//             name="maxParticipants"
//             type="number"
//             min={1}
//             value={formData.maxParticipants}
//             onChange={handleChange}
//             className={inputCls}
//           />
//         </div>

//         <div>
//           <label className={labelCls}>Event Type</label>
//           <select
//             name="eventType"
//             value={formData.eventType}
//             onChange={handleChange}
//             className={inputCls}
//           >
//             <option value="Seminar">Seminar</option>
//             <option value="Workshop">Workshop</option>
//             <option value="Webinar">Webinar</option>
//             <option value="Cultural">Cultural</option>
//             <option value="Technical">Technical</option>
//             <option value="Other">Other</option>
//           </select>
//         </div>

//         <div>
//           <label className={labelCls}>Status</label>
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className={inputCls}
//           >
//             <option value="Pending">Pending</option>
//             <option value="Ongoing">Ongoing</option>
//             <option value="Completed">Completed</option>
//             <option value="Cancelled">Cancelled</option>
//           </select>
//         </div>

//         <div>
//           <label className={labelCls}>Coordinator *</label>
//           <select
//             name="coordinator"
//             value={formData.coordinator}
//             onChange={handleChange}
//             required
//             className={inputCls}
//           >
//             <option value="">Select Coordinator</option>
//             {users.map((u) => (
//               <option key={u._id} value={u._id}>
//                 {u.name} ({u.email})
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Audience Controls */}
//         <div>
//           <label className={labelCls}>Audience Mode</label>
//           <select
//             name="audienceMode"
//             value={formData.audienceMode}
//             onChange={handleChange}
//             className={inputCls}
//           >
//             <option value="all">All users</option>
//             <option value="roles">Specific roles</option>
//             <option value="users">Specific users</option>
//           </select>
//         </div>

//         {formData.audienceMode === "roles" && (
//           <div className="md:col-span-2">
//             <label className={labelCls}>Select Roles</label>
//             <select
//               multiple
//               name="audienceRoles"
//               value={formData.audienceRoles}
//               onChange={handleAudienceRolesChange}
//               className={`${inputCls} h-32`}
//             >
//               {uniqueRoles.map((r) => (
//                 <option key={r} value={r}>
//                   {r}
//                 </option>
//               ))}
//             </select>
//             <p className="text-xs text-gray-500 mt-1">
//               Hold Ctrl/Cmd to select multiple roles.
//             </p>
//           </div>
//         )}

//         {formData.audienceMode === "users" && (
//           <div className="md:col-span-2">
//             <label className={labelCls}>Attendees (specific users)</label>
//             <select
//               multiple
//               name="attendees"
//               value={formData.attendees}
//               onChange={handleAttendeesChange}
//               className={`${inputCls} h-32`}
//             >
//               {users.map((u) => (
//                 <option key={u._id} value={u._id}>
//                   {u.name}
//                 </option>
//               ))}
//             </select>
//             <p className="text-xs text-gray-500 mt-1">
//               Hold Ctrl/Cmd to select multiple.
//             </p>
//           </div>
//         )}

//         <label className="flex items-center md:col-span-2">
//           <input
//             type="checkbox"
//             name="isOnline"
//             checked={formData.isOnline}
//             onChange={handleChange}
//             className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//           />
//           <span className="text-sm text-gray-700">
//             Is this an online event?
//           </span>
//         </label>

//         {formData.isOnline && (
//           <div className="md:col-span-2">
//             <label className={labelCls}>Meeting Link</label>
//             <input
//               name="meetingLink"
//               value={formData.meetingLink}
//               onChange={handleChange}
//               className={inputCls}
//               placeholder="https://…"
//             />
//           </div>
//         )}

//         <div className="md:col-span-2">
//           <label className={labelCls}>Description *</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             required
//             rows={4}
//             className={`${inputCls} min-h-[120px]`}
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={submitting}
//           className={`bg-indigo-600 text-white font-semibold py-2 px-4 rounded md:col-span-2 ${
//             submitting ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-500"
//           }`}
//         >
//           {submitting ? "Creating..." : "Create Event"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateEvent;

//

//

"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import eventsBanner from "../../assets/images/profile_banner.jpg"; // change if needed

const initialForm = {
  eventName: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  duration: "",
  description: "",
  agenda: "",
  eventType: "Other",
  status: "Pending",
  coordinator: "",
  guestName: "",
  location: "",
  department: "",
  tags: [],
  attendees: [],
  audienceMode: "all",
  audienceRoles: [],
  maxParticipants: 100,
  isOnline: false,
  meetingLink: "",
  isPublished: true,
};

const HERO_TAGS = ["EVENTS", "CREATE", "SCHEDULE", "AUDIENCE", "PUBLISH"];
const HERO_STYLE = {
  backgroundImage: `url(${eventsBanner})`,
};

const CreateEvent = () => {
  const [formData, setFormData] = useState(initialForm);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [err, setErr] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await axios.get(`${globalBackendRoute}/api/all-users`);
        const list = Array.isArray(res.data) ? res.data : res.data?.users || [];
        setUsers(list);
      } catch (e) {
        console.error("Failed to fetch users:", e);
        setUsers([]);
        setErr("Unable to load users. You can still fill the form.");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token");

  const computeDuration = (start, end) => {
    if (!start || !end) return "";
    try {
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);
      const startMin = sh * 60 + sm;
      const endMin = eh * 60 + em;
      const diff = endMin - startMin;
      if (diff <= 0) return "";
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return h ? `${h}h ${m}m` : `${m}m`;
    } catch {
      return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "startTime" || name === "endTime") {
      const next = { ...formData, [name]: value };
      next.duration = computeDuration(next.startTime, next.endTime);
      setFormData(next);
      return;
    }

    if (type === "checkbox") {
      setFormData((p) => ({ ...p, [name]: checked }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setFormData((p) => ({ ...p, tags }));
  };

  const handleAttendeesChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    setFormData((p) => ({ ...p, attendees: selected }));
  };

  const handleAudienceRolesChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    setFormData((p) => ({ ...p, audienceRoles: selected }));
  };

  const uniqueRoles = useMemo(() => {
    const set = new Set();
    users.forEach((u) => {
      if (u?.role) set.add(String(u.role).toLowerCase());
    });
    return Array.from(set).sort();
  }, [users]);

  const mapStatus = (ui) => {
    switch (String(ui).toLowerCase()) {
      case "pending":
        return "scheduled";
      case "ongoing":
        return "live";
      case "completed":
        return "completed";
      case "cancelled":
        return "cancelled";
      default:
        return "scheduled";
    }
  };

  const toISODateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    const iso = new Date(`${dateStr}T${timeStr}:00`);
    return isNaN(iso.getTime()) ? null : iso.toISOString();
  };

  const validate = () => {
    const errs = [];
    if (!formData.eventName.trim()) errs.push("Event Name is required.");
    if (!formData.eventDate) errs.push("Event Date is required.");
    if (!formData.startTime) errs.push("Start Time is required.");
    if (!formData.endTime) errs.push("End Time is required.");
    if (!formData.description.trim()) errs.push("Description is required.");
    if (!formData.coordinator) errs.push("Coordinator is required.");

    const sISO = toISODateTime(formData.eventDate, formData.startTime);
    const eISO = toISODateTime(formData.eventDate, formData.endTime);
    if (!sISO || !eISO) errs.push("Invalid start/end date/time.");
    else if (new Date(eISO) <= new Date(sISO))
      errs.push("End Time must be after Start Time.");

    if (formData.audienceMode === "users" && formData.attendees.length === 0) {
      errs.push("Please select at least one attendee for 'users' audience.");
    }
    if (
      formData.audienceMode === "roles" &&
      formData.audienceRoles.length === 0
    ) {
      errs.push("Please select at least one role for 'roles' audience.");
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErr("");
    const errs = validate();
    if (errs.length) {
      setErr(errs.join(" "));
      return;
    }

    setSubmitting(true);
    try {
      const startISO = toISODateTime(formData.eventDate, formData.startTime);
      const endISO = toISODateTime(formData.eventDate, formData.endTime);

      const location = formData.isOnline
        ? {
            kind: "virtual",
            meetingUrl: formData.meetingLink || undefined,
            venue: formData.location || undefined,
          }
        : {
            kind: "physical",
            venue: formData.location || undefined,
          };

      const organizers = [];
      if (formData.coordinator) {
        organizers.push({
          user: formData.coordinator,
          role: "coordinator",
        });
      }
      if (formData.guestName?.trim()) {
        organizers.push({
          name: formData.guestName.trim(),
          role: "guest",
        });
      }

      let audience = { mode: "all", roles: [], users: [] };
      if (formData.audienceMode === "roles") {
        audience = { mode: "roles", roles: formData.audienceRoles, users: [] };
      } else if (formData.audienceMode === "users") {
        audience = { mode: "users", roles: [], users: formData.attendees };
      }

      const registration = {
        isRequired: false,
        capacity: Number(formData.maxParticipants) || undefined,
      };

      const tags = Array.from(
        new Set(
          [
            ...(formData.tags || []),
            formData.eventType || "",
            formData.department || "",
          ]
            .map((t) => String(t || "").trim())
            .filter(Boolean),
        ),
      );

      const payload = {
        title: formData.eventName,
        subtitle: formData.agenda || undefined,
        description: formData.description,
        startTime: startISO,
        endTime: endISO,
        status: mapStatus(formData.status),
        audience,
        location,
        registration,
        tags,
        isPublished: !!formData.isPublished,
        organizers,
      };

      await axios.post(`${globalBackendRoute}/api/events`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setMessage("✅ Event created successfully!");
      setFormData(initialForm);
    } catch (error) {
      console.error("Error creating event:", error);
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.details ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create event";
      setErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "form-input";
  const labelCls = "form-label";
  const helpCls = "form-help-text";

  return (
    <div className="service-page-wrap min-h-screen">
      <section className="service-hero-section" style={HERO_STYLE}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/50" />
        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-black/30 via-black/10 to-black/30" />
        <div className="service-hero-overlay-3" />

        <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                {HERO_TAGS.map((item) => (
                  <span key={item} className="service-tag-pill">
                    {item}
                  </span>
                ))}
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight leading-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]">
                Create{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
                  event & audience
                </span>
              </h1>

              <p className="mt-2 text-[11px] sm:text-xs md:text-sm text-white/90 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                Create events, assign coordinators, define audience visibility,
                and publish sessions with a clean structured workflow.
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 text-[11px] sm:text-xs text-white">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Event setup · Audience · Schedule · Publish
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-[11px] sm:text-xs text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                <span>Create mode</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-200" />
                <span>
                  {loadingUsers
                    ? "Loading users"
                    : `${users.length} users loaded`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-5 sm:py-6 lg:py-7 space-y-5">
          {message && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-[11px] sm:text-xs text-green-700">
              {message}
            </div>
          )}

          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] sm:text-xs text-red-700">
              {err}
            </div>
          )}

          {loadingUsers && (
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] sm:text-xs text-slate-600">
              Loading users…
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <section className="service-parent-card">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="service-main-heading">Basic event details</h2>
                <p className="service-small-paragraph">
                  Core event information and scheduling details.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Event Name *</label>
                  <input
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Event Date *</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Start Time *</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>End Time *</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Duration</label>
                  <input
                    name="duration"
                    placeholder="Auto-calculated"
                    value={formData.duration}
                    onChange={handleChange}
                    className={inputCls}
                    disabled
                  />
                </div>

                <div>
                  <label className={labelCls}>Location / Venue *</label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Guest Name</label>
                  <input
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Department</label>
                  <input
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Agenda (subtitle)</label>
                  <input
                    name="agenda"
                    value={formData.agenda}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Tags (comma separated)</label>
                  <input
                    name="tags"
                    onChange={handleTagsChange}
                    className={inputCls}
                    placeholder="training, onboarding"
                  />
                </div>

                <div>
                  <label className={labelCls}>Max Participants</label>
                  <input
                    name="maxParticipants"
                    type="number"
                    min={1}
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Event Type</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="Seminar">Seminar</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Technical">Technical</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Coordinator *</label>
                  <select
                    name="coordinator"
                    value={formData.coordinator}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  >
                    <option value="">Select Coordinator</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Audience Mode</label>
                  <select
                    name="audienceMode"
                    value={formData.audienceMode}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="all">All users</option>
                    <option value="roles">Specific roles</option>
                    <option value="users">Specific users</option>
                  </select>
                </div>
              </div>
            </section>

            {formData.audienceMode === "roles" && (
              <section className="service-parent-card">
                <h2 className="service-main-heading">Audience roles</h2>
                <div>
                  <label className={labelCls}>Select Roles</label>
                  <select
                    multiple
                    name="audienceRoles"
                    value={formData.audienceRoles}
                    onChange={handleAudienceRolesChange}
                    className={`${inputCls} h-36`}
                  >
                    {uniqueRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <p className={`${helpCls} mt-2`}>
                    Hold Ctrl/Cmd to select multiple roles.
                  </p>
                </div>
              </section>
            )}

            {formData.audienceMode === "users" && (
              <section className="service-parent-card">
                <h2 className="service-main-heading">Specific attendees</h2>
                <div>
                  <label className={labelCls}>Attendees (specific users)</label>
                  <select
                    multiple
                    name="attendees"
                    value={formData.attendees}
                    onChange={handleAttendeesChange}
                    className={`${inputCls} h-36`}
                  >
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  <p className={`${helpCls} mt-2`}>
                    Hold Ctrl/Cmd to select multiple.
                  </p>
                </div>
              </section>
            )}

            <section className="service-parent-card">
              <h2 className="service-main-heading">Event mode & description</h2>

              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="isOnline"
                  checked={formData.isOnline}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Is this an online event?</span>
              </label>

              {formData.isOnline && (
                <div>
                  <label className={labelCls}>Meeting Link</label>
                  <input
                    name="meetingLink"
                    value={formData.meetingLink}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="https://…"
                  />
                </div>
              )}

              <div>
                <label className={labelCls}>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={`${inputCls} min-h-[140px]`}
                />
              </div>
            </section>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={submitting}
                className={`primary-gradient-button ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
