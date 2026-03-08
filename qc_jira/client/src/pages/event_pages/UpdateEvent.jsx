// import React, { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";

// const API = `${globalBackendRoute}/api`;

// const toISO = (dateStr, timeStr) => {
//     if (!dateStr || !timeStr) return null;
//     const d = new Date(`${dateStr}T${timeStr}:00`);
//     return isNaN(d.getTime()) ? null : d.toISOString();
// };
// const safe = (v) => (v === undefined || v === null ? "" : String(v));

// export default function UpdateEvent() {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const token =
//         localStorage.getItem("userToken") || localStorage.getItem("token") || "";
//     let user = null;
//     try {
//         user = JSON.parse(localStorage.getItem("user"));
//     } catch {
//         user = null;
//     }
//     const isSuperAdmin = user?.role === "superadmin" || user?.role === "admin";

//     const AX = useMemo(
//         () =>
//             axios.create({
//                 baseURL: API,
//                 headers: token ? { Authorization: `Bearer ${token}` } : {},
//             }),
//         [token]
//     );

//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [err, setErr] = useState("");
//     const [toast, setToast] = useState("");
//     const [event, setEvent] = useState(null);

//     const [form, setForm] = useState({
//         title: "",
//         subtitle: "",
//         description: "",
//         date: "", // yyyy-mm-dd
//         start: "", // HH:mm
//         end: "", // HH:mm
//         status: "draft",
//         isPublished: false,

//         // location
//         locationKind: "physical",
//         venue: "",
//         addressLine1: "",
//         addressLine2: "",
//         city: "",
//         state: "",
//         country: "",
//         pincode: "",
//         meetingUrl: "",

//         // audience
//         audienceMode: "all",
//         audienceRolesCSV: "",
//         audienceUsersCSV: "",

//         // registration
//         regRequired: false,
//         regCapacity: "",
//         regWaitlist: false,

//         // other
//         tagsCSV: "",
//         coverImageUrl: "",
//         entityModel: "",
//         entityId: "",

//         // organizers JSON
//         organizersJson: "[\n  // { \"user\": \"<ObjectId>\", \"role\": \"host\" }\n]",
//     });

//     const notify = (msg) => {
//         setToast(msg);
//         setTimeout(() => setToast(""), 2200);
//     };

//     // Load event
//     useEffect(() => {
//         if (!id) return;
//         setLoading(true);
//         setErr("");
//         AX.get(`/events/${id}`)
//             .then((res) => {
//                 const ev = res.data;
//                 setEvent(ev);

//                 // hydrate form with existing values
//                 const sd = ev.startTime ? new Date(ev.startTime) : null;
//                 const ed = ev.endTime ? new Date(ev.endTime) : null;

//                 const yyyy = sd ? String(sd.getFullYear()).padStart(4, "0") : "";
//                 const mm = sd ? String(sd.getMonth() + 1).padStart(2, "0") : "";
//                 const dd = sd ? String(sd.getDate()).padStart(2, "0") : "";
//                 const date = sd ? `${yyyy}-${mm}-${dd}` : "";
//                 const hhS = sd ? String(sd.getHours()).padStart(2, "0") : "";
//                 const miS = sd ? String(sd.getMinutes()).padStart(2, "0") : "";
//                 const hhE = ed ? String(ed.getHours()).padStart(2, "0") : "";
//                 const miE = ed ? String(ed.getMinutes()).padStart(2, "0") : "";

//                 setForm((p) => ({
//                     ...p,
//                     title: safe(ev.title),
//                     subtitle: safe(ev.subtitle),
//                     description: safe(ev.description),
//                     date,
//                     start: sd ? `${hhS}:${miS}` : "",
//                     end: ed ? `${hhE}:${miE}` : "",
//                     status: safe(ev.status || "draft"),
//                     isPublished: !!ev.isPublished,

//                     locationKind: safe(ev.location?.kind || "physical"),
//                     venue: safe(ev.location?.venue),
//                     addressLine1: safe(ev.location?.addressLine1),
//                     addressLine2: safe(ev.location?.addressLine2),
//                     city: safe(ev.location?.city),
//                     state: safe(ev.location?.state),
//                     country: safe(ev.location?.country),
//                     pincode: safe(ev.location?.pincode),
//                     meetingUrl: safe(ev.location?.meetingUrl),

//                     audienceMode: safe(ev.audience?.mode || "all"),
//                     audienceRolesCSV: (ev.audience?.roles || []).join(", "),
//                     audienceUsersCSV: (ev.audience?.users || []).join(", "),

//                     regRequired: !!ev.registration?.isRequired,
//                     regCapacity: safe(ev.registration?.capacity),
//                     regWaitlist: !!ev.registration?.waitlistEnabled,

//                     tagsCSV: (ev.tags || []).join(", "),
//                     coverImageUrl: safe(ev.coverImageUrl),

//                     entityModel: safe(ev.entityModel),
//                     entityId: safe(ev.relatedEntity),

//                     organizersJson: JSON.stringify(
//                         (ev.organizers || []).map((o) => ({
//                             user: typeof o.user === "object" ? o.user?._id || o.user?.id : o.user,
//                             name: o.name,
//                             email: o.email,
//                             phone: o.phone,
//                             role: o.role,
//                         })),
//                         null,
//                         2
//                     ),
//                 }));
//             })
//             .catch((e) => {
//                 console.error("get event error:", e?.response || e);
//                 setErr(
//                     e?.response?.data?.error ||
//                     e?.response?.data?.message ||
//                     "Failed to load event."
//                 );
//             })
//             .finally(() => setLoading(false));
//     }, [AX, id]);

//     // Build payload for PUT /events/:id
//     const buildPayload = () => {
//         const startTime = toISO(form.date, form.start);
//         const endTime = toISO(form.date, form.end);

//         const location =
//             form.locationKind === "virtual"
//                 ? { kind: "virtual", meetingUrl: form.meetingUrl, venue: form.venue }
//                 : {
//                     kind: form.locationKind || "physical",
//                     venue: form.venue || undefined,
//                     addressLine1: form.addressLine1 || undefined,
//                     addressLine2: form.addressLine2 || undefined,
//                     city: form.city || undefined,
//                     state: form.state || undefined,
//                     country: form.country || undefined,
//                     pincode: form.pincode || undefined,
//                 };

//         const roles = form.audienceRolesCSV
//             .split(",")
//             .map((s) => s.trim().toLowerCase())
//             .filter(Boolean);

//         const users = form.audienceUsersCSV
//             .split(",")
//             .map((s) => s.trim())
//             .filter(Boolean);

//         let organizers;
//         try {
//             organizers = JSON.parse(form.organizersJson);
//             if (!Array.isArray(organizers)) throw new Error("Organizers must be an array");
//         } catch (e) {
//             throw new Error("Organizers JSON is invalid.");
//         }

//         const payload = {
//             title: form.title,
//             subtitle: form.subtitle || undefined,
//             description: form.description,
//             startTime,
//             endTime,
//             status: form.status,
//             isPublished: !!form.isPublished,
//             location,
//             audience: {
//                 mode: (form.audienceMode || "all").toLowerCase(),
//                 roles,
//                 users,
//             },
//             registration: {
//                 isRequired: !!form.regRequired,
//                 capacity: form.regCapacity ? Number(form.regCapacity) : undefined,
//                 waitlistEnabled: !!form.regWaitlist,
//             },
//             tags: form.tagsCSV
//                 .split(",")
//                 .map((t) => t.trim())
//                 .filter(Boolean),
//             coverImageUrl: form.coverImageUrl || undefined,
//             entityModel: form.entityModel || undefined,
//             relatedEntity: form.entityId || undefined,
//             organizers,
//         };

//         return payload;
//     };

//     const onSubmit = async (e) => {
//         e.preventDefault();
//         setErr("");
//         if (!isSuperAdmin) {
//             setErr("Only admin/superadmin can update events.");
//             return;
//         }
//         try {
//             const payload = buildPayload();
//             setSaving(true);
//             await AX.put(`/events/${id}`, payload);
//             notify("Event updated");
//             // optionally go back to event view
//             // navigate(`/single-event/${id}`);
//         } catch (e) {
//             console.error("update event error:", e?.response || e);
//             setErr(
//                 e?.response?.data?.error ||
//                 e?.response?.data?.details ||
//                 "Update failed"
//             );
//         } finally {
//             setSaving(false);
//         }
//     };

//     if (!token) {
//         return (
//             <div className="max-w-5xl mx-auto p-4">
//                 <h1 className="text-2xl font-bold">Update Event</h1>
//                 <p className="mt-2 text-red-600">Please log in.</p>
//             </div>
//         );
//     }
//     if (!isSuperAdmin) {
//         return (
//             <div className="max-w-5xl mx-auto p-4">
//                 <h1 className="text-2xl font-bold">Update Event</h1>
//                 <p className="mt-2 text-red-600">
//                     Only admin/superadmin can update events.
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-6xl mx-auto p-4">
//             <div className="flex items-center justify-between">
//                 <h1 className="text-2xl font-bold">Update Event</h1>
//                 <div className="flex items-center gap-3">
//                     <Link to="/all-events" className="text-indigo-600 hover:underline">
//                         ← Back to all events
//                     </Link>
//                     <Link
//                         to={`/single-event/${id}`}
//                         className="text-indigo-600 hover:underline"
//                     >
//                         View single event →
//                     </Link>
//                 </div>
//             </div>

//             {toast && (
//                 <div className="mt-3 p-2 rounded bg-green-50 text-green-700 border border-green-200 text-sm">
//                     {toast}
//                 </div>
//             )}
//             {err && (
//                 <div className="mt-3 p-2 rounded bg-red-50 text-red-700 border border-red-200 text-sm">
//                     {err}
//                 </div>
//             )}

//             {loading ? (
//                 <div className="mt-6 text-gray-500">Loading…</div>
//             ) : !event ? (
//                 <div className="mt-6 text-gray-500">Event not found.</div>
//             ) : (
//                 <form onSubmit={onSubmit} className="mt-4 grid gap-6">
//                     {/* Core */}
//                     <section className="rounded-lg border p-4">
//                         <h2 className="text-lg font-semibold">Core</h2>
//                         <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
//                             <input
//                                 className="border rounded px-3 py-2"
//                                 placeholder="Title"
//                                 value={form.title}
//                                 onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
//                                 required
//                             />
//                             <input
//                                 className="border rounded px-3 py-2"
//                                 placeholder="Subtitle"
//                                 value={form.subtitle}
//                                 onChange={(e) =>
//                                     setForm((p) => ({ ...p, subtitle: e.target.value }))
//                                 }
//                             />
//                             <textarea
//                                 className="border rounded px-3 py-2 md:col-span-2"
//                                 placeholder="Description"
//                                 rows={4}
//                                 value={form.description}
//                                 onChange={(e) =>
//                                     setForm((p) => ({ ...p, description: e.target.value }))
//                                 }
//                             />
//                             <input
//                                 type="date"
//                                 className="border rounded px-3 py-2"
//                                 value={form.date}
//                                 onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
//                                 required
//                             />
//                             <div className="grid grid-cols-2 gap-2">
//                                 <input
//                                     type="time"
//                                     className="border rounded px-3 py-2"
//                                     value={form.start}
//                                     onChange={(e) => setForm((p) => ({ ...p, start: e.target.value }))}
//                                     required
//                                 />
//                                 <input
//                                     type="time"
//                                     className="border rounded px-3 py-2"
//                                     value={form.end}
//                                     onChange={(e) => setForm((p) => ({ ...p, end: e.target.value }))}
//                                     required
//                                 />
//                             </div>
//                             <select
//                                 className="border rounded px-3 py-2"
//                                 value={form.status}
//                                 onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
//                             >
//                                 <option value="draft">draft</option>
//                                 <option value="scheduled">scheduled</option>
//                                 <option value="live">live</option>
//                                 <option value="completed">completed</option>
//                                 <option value="cancelled">cancelled</option>
//                                 <option value="postponed">postponed</option>
//                             </select>
//                             <label className="inline-flex items-center gap-2 text-sm">
//                                 <input
//                                     type="checkbox"
//                                     checked={form.isPublished}
//                                     onChange={(e) =>
//                                         setForm((p) => ({ ...p, isPublished: e.target.checked }))
//                                     }
//                                 />
//                                 Published
//                             </label>
//                             <input
//                                 className="border rounded px-3 py-2 md:col-span-2"
//                                 placeholder="Cover image URL"
//                                 value={form.coverImageUrl}
//                                 onChange={(e) =>
//                                     setForm((p) => ({ ...p, coverImageUrl: e.target.value }))
//                                 }
//                             />
//                         </div>
//                     </section>

//                     {/* Location */}
//                     <section className="rounded-lg border p-4">
//                         <h2 className="text-lg font-semibold">Location</h2>
//                         <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
//                             <select
//                                 className="border rounded px-3 py-2"
//                                 value={form.locationKind}
//                                 onChange={(e) =>
//                                     setForm((p) => ({ ...p, locationKind: e.target.value }))
//                                 }
//                             >
//                                 <option value="physical">physical</option>
//                                 <option value="virtual">virtual</option>
//                                 <option value="hybrid">hybrid</option>
//                             </select>
//                             <input
//                                 className="border rounded px-3 py-2"
//                                 placeholder="Venue"
//                                 value={form.venue}
//                                 onChange={(e) => setForm((p) => ({ ...p, venue: e.target.value }))}
//                             />

//                             {form.locationKind !== "virtual" && (
//                                 <>
//                                     <input
//                                         className="border rounded px-3 py-2"
//                                         placeholder="Address Line 1"
//                                         value={form.addressLine1}
//                                         onChange={(e) =>
//                                             setForm((p) => ({ ...p, addressLine1: e.target.value }))
//                                         }
//                                     />
//                                     <input
//                                         className="border rounded px-3 py-2"
//                                         placeholder="Address Line 2"
//                                         value={form.addressLine2}
//                                         onChange={(e) =>
//                                             setForm((p) => ({ ...p, addressLine2: e.target.value }))
//                                         }
//                                     />
//                                     <div className="grid grid-cols-2 gap-2">
//                                         <input
//                                             className="border rounded px-3 py-2"
//                                             placeholder="City"
//                                             value={form.city}
//                                             onChange={(e) =>
//                                                 setForm((p) => ({ ...p, city: e.target.value }))
//                                             }
//                                         />
//                                         <input
//                                             className="border rounded px-3 py-2"
//                                             placeholder="State"
//                                             value={form.state}
//                                             onChange={(e) =>
//                                                 setForm((p) => ({ ...p, state: e.target.value }))
//                                             }
//                                         />
//                                     </div>
//                                     <div className="grid grid-cols-2 gap-2">
//                                         <input
//                                             className="border rounded px-3 py-2"
//                                             placeholder="Country"
//                                             value={form.country}
//                                             onChange={(e) =>
//                                                 setForm((p) => ({ ...p, country: e.target.value }))
//                                             }
//                                         />
//                                         <input
//                                             className="border rounded px-3 py-2"
//                                             placeholder="Pincode"
//                                             value={form.pincode}
//                                             onChange={(e) =>
//                                                 setForm((p) => ({ ...p, pincode: e.target.value }))
//                                             }
//                                         />
//                                     </div>
//                                 </>
//                             )}

//                             {form.locationKind !== "physical" && (
//                                 <input
//                                     className="border rounded px-3 py-2 md:col-span-2"
//                                     placeholder="Meeting URL"
//                                     value={form.meetingUrl}
//                                     onChange={(e) =>
//                                         setForm((p) => ({ ...p, meetingUrl: e.target.value }))
//                                     }
//                                 />
//                             )}
//                         </div>
//                     </section>

//                     {/* Audience */}
//                     <section className="rounded-lg border p-4">
//                         <h2 className="text-lg font-semibold">Audience</h2>
//                         <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
//                             <select
//                                 className="border rounded px-3 py-2"
//                                 value={form.audienceMode}
//                                 onChange={(e) =>
//                                     setForm((p) => ({ ...p, audienceMode: e.target.value }))
//                                 }
//                             >
//                                 <option value="all">all</option>
//                                 <option value="roles">roles</option>
//                                 <option value="users">users</option>
//                             </select>
//                             <input
//                                 className="border rounded px-3 py-2 md:col-span-2"
//                                 placeholder="Roles (comma separated)"
//                                 value={form.audienceRolesCSV}
//                                 onChange={(e) =>
//                                     setForm((p) => ({ ...p, audienceRolesCSV: e.target.value }))
//                                 }
//                             />
//                             <input
//                                 className="border rounded px-3 py-2 md:col-span-3"
//                                 placeholder="User IDs (comma separated)"
//                                 value={form.audienceUsersCSV}
//                                 onChange={(e) =>
//                                     setForm((p) => ({ ...p, audienceUsersCSV: e.target.value }))
//                                 }
//                             />
//                         </div>
//                     </section>

//                     {/* Registration */}
//                     <section className="rounded-lg border p-4">
//                         <h2 className="text-lg font-semibold">Registration</h2>
//                         <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
//                             <label className="inline-flex items-center gap-2 border rounded px-3 py-2">
//                                 <input
//                                     type="checkbox"
//                                     checked={form.regRequired}
//                                     onChange={(e) =>
//                                         setForm((p) => ({ ...p, regRequired: e.target.checked }))
//                                     }
//                                 />
//                                 Required
//                             </label>
//                             <input
//                                 type="number"
//                                 className="border rounded px-3 py-2"
//                                 placeholder="Capacity"
//                                 value={form.regCapacity}
//                                 onChange={(e) =>
//                                     setForm((p) => ({ ...p, regCapacity: e.target.value }))
//                                 }
//                             />
//                             <label className="inline-flex items-center gap-2 border rounded px-3 py-2">
//                                 <input
//                                     type="checkbox"
//                                     checked={form.regWaitlist}
//                                     onChange={(e) =>
//                                         setForm((p) => ({ ...p, regWaitlist: e.target.checked }))
//                                     }
//                                 />
//                                 Waitlist enabled
//                             </label>
//                         </div>
//                     </section>

//                     {/* Tags / Entity / Organizers */}
//                     <section className="rounded-lg border p-4">
//                         <h2 className="text-lg font-semibold">Other</h2>
//                         <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
//                             <input
//                                 className="border rounded px-3 py-2"
//                                 placeholder="Tags (comma separated)"
//                                 value={form.tagsCSV}
//                                 onChange={(e) =>
//                                     setForm((p) => ({ ...p, tagsCSV: e.target.value }))
//                                 }
//                             />
//                             <input
//                                 className="border rounded px-3 py-2"
//                                 placeholder="Entity model (optional)"
//                                 value={form.entityModel}
//                                 onChange={(e) =>
//                                     setForm((p) => ({ ...p, entityModel: e.target.value }))
//                                 }
//                             />
//                             <input
//                                 className="border rounded px-3 py-2"
//                                 placeholder="Related entity ObjectId (optional)"
//                                 value={form.entityId}
//                                 onChange={(e) =>
//                                     setForm((p) => ({ ...p, entityId: e.target.value }))
//                                 }
//                             />
//                         </div>

//                         <div className="mt-4">
//                             <label className="block text-sm font-medium mb-1">
//                                 Organizers (JSON array)
//                             </label>
//                             <textarea
//                                 rows={6}
//                                 className="w-full border rounded px-3 py-2 font-mono text-sm"
//                                 value={form.organizersJson}
//                                 onChange={(e) =>
//                                     setForm((p) => ({ ...p, organizersJson: e.target.value }))
//                                 }
//                             />
//                             <p className="text-xs text-gray-500 mt-1">
//                                 Example: <code>[{`{ "user": "<ObjectId>", "role": "host" }`}]</code>
//                             </p>
//                         </div>
//                     </section>

//                     <div className="flex items-center gap-3">
//                         <button
//                             disabled={saving}
//                             type="submit"
//                             className={`px-4 py-2 rounded bg-indigo-600 text-white text-sm ${saving ? "opacity-60" : ""
//                                 }`}
//                         >
//                             {saving ? "Saving…" : "Save Changes"}
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => navigate(`/single-event/${id}`)}
//                             className="px-4 py-2 rounded border text-sm"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//             )}
//         </div>
//     );
// }

//

//

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import eventsBanner from "../../assets/images/profile_banner.jpg"; // change if needed

const API = `${globalBackendRoute}/api`;

const toISO = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  const d = new Date(`${dateStr}T${timeStr}:00`);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

const safe = (v) => (v === undefined || v === null ? "" : String(v));

const HERO_TAGS = ["EVENTS", "UPDATE", "ADMIN", "SCHEDULE", "AUDIENCE"];
const HERO_STYLE = {
  backgroundImage: `url(${eventsBanner})`,
};

export default function UpdateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const isSuperAdmin = user?.role === "superadmin" || user?.role === "admin";

  const AX = useMemo(
    () =>
      axios.create({
        baseURL: API,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    [token],
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");
  const [event, setEvent] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    date: "",
    start: "",
    end: "",
    status: "draft",
    isPublished: false,

    locationKind: "physical",
    venue: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    meetingUrl: "",

    audienceMode: "all",
    audienceRolesCSV: "",
    audienceUsersCSV: "",

    regRequired: false,
    regCapacity: "",
    regWaitlist: false,

    tagsCSV: "",
    coverImageUrl: "",
    entityModel: "",
    entityId: "",

    organizersJson: '[\n  // { "user": "<ObjectId>", "role": "host" }\n]',
  });

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setErr("");

    AX.get(`/events/${id}`)
      .then((res) => {
        const ev = res.data;
        setEvent(ev);

        const sd = ev.startTime ? new Date(ev.startTime) : null;
        const ed = ev.endTime ? new Date(ev.endTime) : null;

        const yyyy = sd ? String(sd.getFullYear()).padStart(4, "0") : "";
        const mm = sd ? String(sd.getMonth() + 1).padStart(2, "0") : "";
        const dd = sd ? String(sd.getDate()).padStart(2, "0") : "";
        const date = sd ? `${yyyy}-${mm}-${dd}` : "";
        const hhS = sd ? String(sd.getHours()).padStart(2, "0") : "";
        const miS = sd ? String(sd.getMinutes()).padStart(2, "0") : "";
        const hhE = ed ? String(ed.getHours()).padStart(2, "0") : "";
        const miE = ed ? String(ed.getMinutes()).padStart(2, "0") : "";

        setForm((p) => ({
          ...p,
          title: safe(ev.title),
          subtitle: safe(ev.subtitle),
          description: safe(ev.description),
          date,
          start: sd ? `${hhS}:${miS}` : "",
          end: ed ? `${hhE}:${miE}` : "",
          status: safe(ev.status || "draft"),
          isPublished: !!ev.isPublished,

          locationKind: safe(ev.location?.kind || "physical"),
          venue: safe(ev.location?.venue),
          addressLine1: safe(ev.location?.addressLine1),
          addressLine2: safe(ev.location?.addressLine2),
          city: safe(ev.location?.city),
          state: safe(ev.location?.state),
          country: safe(ev.location?.country),
          pincode: safe(ev.location?.pincode),
          meetingUrl: safe(ev.location?.meetingUrl),

          audienceMode: safe(ev.audience?.mode || "all"),
          audienceRolesCSV: (ev.audience?.roles || []).join(", "),
          audienceUsersCSV: (ev.audience?.users || []).join(", "),

          regRequired: !!ev.registration?.isRequired,
          regCapacity: safe(ev.registration?.capacity),
          regWaitlist: !!ev.registration?.waitlistEnabled,

          tagsCSV: (ev.tags || []).join(", "),
          coverImageUrl: safe(ev.coverImageUrl),

          entityModel: safe(ev.entityModel),
          entityId: safe(ev.relatedEntity),

          organizersJson: JSON.stringify(
            (ev.organizers || []).map((o) => ({
              user:
                typeof o.user === "object" ? o.user?._id || o.user?.id : o.user,
              name: o.name,
              email: o.email,
              phone: o.phone,
              role: o.role,
            })),
            null,
            2,
          ),
        }));
      })
      .catch((e) => {
        console.error("get event error:", e?.response || e);
        setErr(
          e?.response?.data?.error ||
            e?.response?.data?.message ||
            "Failed to load event.",
        );
      })
      .finally(() => setLoading(false));
  }, [AX, id]);

  const buildPayload = () => {
    const startTime = toISO(form.date, form.start);
    const endTime = toISO(form.date, form.end);

    const location =
      form.locationKind === "virtual"
        ? { kind: "virtual", meetingUrl: form.meetingUrl, venue: form.venue }
        : {
            kind: form.locationKind || "physical",
            venue: form.venue || undefined,
            addressLine1: form.addressLine1 || undefined,
            addressLine2: form.addressLine2 || undefined,
            city: form.city || undefined,
            state: form.state || undefined,
            country: form.country || undefined,
            pincode: form.pincode || undefined,
          };

    const roles = form.audienceRolesCSV
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const users = form.audienceUsersCSV
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    let organizers;
    try {
      organizers = JSON.parse(form.organizersJson);
      if (!Array.isArray(organizers))
        throw new Error("Organizers must be an array");
    } catch (e) {
      throw new Error("Organizers JSON is invalid.");
    }

    const payload = {
      title: form.title,
      subtitle: form.subtitle || undefined,
      description: form.description,
      startTime,
      endTime,
      status: form.status,
      isPublished: !!form.isPublished,
      location,
      audience: {
        mode: (form.audienceMode || "all").toLowerCase(),
        roles,
        users,
      },
      registration: {
        isRequired: !!form.regRequired,
        capacity: form.regCapacity ? Number(form.regCapacity) : undefined,
        waitlistEnabled: !!form.regWaitlist,
      },
      tags: form.tagsCSV
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      coverImageUrl: form.coverImageUrl || undefined,
      entityModel: form.entityModel || undefined,
      relatedEntity: form.entityId || undefined,
      organizers,
    };

    return payload;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!isSuperAdmin) {
      setErr("Only admin/superadmin can update events.");
      return;
    }

    try {
      const payload = buildPayload();
      setSaving(true);
      await AX.put(`/events/${id}`, payload);
      notify("Event updated");
    } catch (e) {
      console.error("update event error:", e?.response || e);
      setErr(
        e?.response?.data?.error ||
          e?.response?.data?.details ||
          "Update failed",
      );
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "form-input";
  const labelCls = "form-label";
  const helpCls = "form-help-text";

  if (!token) {
    return (
      <div className="service-page-wrap min-h-screen">
        <div className="service-main-container">
          <div className="service-parent-card">
            <h1 className="service-main-heading">Update Event</h1>
            <p className="text-red-600 text-sm sm:text-base">Please log in.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="service-page-wrap min-h-screen">
        <div className="service-main-container">
          <div className="service-parent-card">
            <h1 className="service-main-heading">Update Event</h1>
            <p className="text-red-600 text-sm sm:text-base">
              Only admin/superadmin can update events.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
                Update{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
                  event & settings
                </span>
              </h1>

              <p className="mt-2 text-[11px] sm:text-xs md:text-sm text-white/90 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                Edit core event details, location, audience rules, registration
                settings, organizers, and advanced event metadata.
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 text-[11px] sm:text-xs text-white">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Admin update · Event settings · Save changes
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-[11px] sm:text-xs text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                <span>Edit mode</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-200" />
                <span>{loading ? "Loading event" : "Ready to update"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-5 sm:py-6 lg:py-7 space-y-5">
          <div className="service-parent-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="service-main-heading">Update Event</h1>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/all-events"
                  className="text-indigo-600 hover:text-indigo-700 hover:underline text-xs sm:text-sm font-medium"
                >
                  ← Back to all events
                </Link>
                <Link
                  to={`/single-event/${id}`}
                  className="text-indigo-600 hover:text-indigo-700 hover:underline text-xs sm:text-sm font-medium"
                >
                  View single event →
                </Link>
              </div>
            </div>

            {toast && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-[11px] sm:text-xs text-green-700">
                {toast}
              </div>
            )}

            {err && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] sm:text-xs text-red-700">
                {err}
              </div>
            )}
          </div>

          {loading ? (
            <div className="service-parent-card">
              <div className="text-sm text-slate-500">Loading…</div>
            </div>
          ) : !event ? (
            <div className="service-parent-card">
              <div className="text-sm text-slate-500">Event not found.</div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <section className="service-parent-card">
                <h2 className="service-main-heading">Core</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Title</label>
                    <input
                      className={inputCls}
                      placeholder="Title"
                      value={form.title}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, title: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Subtitle</label>
                    <input
                      className={inputCls}
                      placeholder="Subtitle"
                      value={form.subtitle}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, subtitle: e.target.value }))
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelCls}>Description</label>
                    <textarea
                      className={`${inputCls} min-h-[140px]`}
                      placeholder="Description"
                      rows={5}
                      value={form.description}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, description: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Date</label>
                    <input
                      type="date"
                      className={inputCls}
                      value={form.date}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, date: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Start</label>
                      <input
                        type="time"
                        className={inputCls}
                        value={form.start}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, start: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className={labelCls}>End</label>
                      <input
                        type="time"
                        className={inputCls}
                        value={form.end}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, end: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Status</label>
                    <select
                      className={inputCls}
                      value={form.status}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, status: e.target.value }))
                      }
                    >
                      <option value="draft">draft</option>
                      <option value="scheduled">scheduled</option>
                      <option value="live">live</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                      <option value="postponed">postponed</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={form.isPublished}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            isPublished: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Published</span>
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelCls}>Cover image URL</label>
                    <input
                      className={inputCls}
                      placeholder="Cover image URL"
                      value={form.coverImageUrl}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          coverImageUrl: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </section>

              <section className="service-parent-card">
                <h2 className="service-main-heading">Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Location Kind</label>
                    <select
                      className={inputCls}
                      value={form.locationKind}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          locationKind: e.target.value,
                        }))
                      }
                    >
                      <option value="physical">physical</option>
                      <option value="virtual">virtual</option>
                      <option value="hybrid">hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelCls}>Venue</label>
                    <input
                      className={inputCls}
                      placeholder="Venue"
                      value={form.venue}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, venue: e.target.value }))
                      }
                    />
                  </div>

                  {form.locationKind !== "virtual" && (
                    <>
                      <div>
                        <label className={labelCls}>Address Line 1</label>
                        <input
                          className={inputCls}
                          placeholder="Address Line 1"
                          value={form.addressLine1}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              addressLine1: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div>
                        <label className={labelCls}>Address Line 2</label>
                        <input
                          className={inputCls}
                          placeholder="Address Line 2"
                          value={form.addressLine2}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              addressLine2: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div>
                        <label className={labelCls}>City</label>
                        <input
                          className={inputCls}
                          placeholder="City"
                          value={form.city}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, city: e.target.value }))
                          }
                        />
                      </div>

                      <div>
                        <label className={labelCls}>State</label>
                        <input
                          className={inputCls}
                          placeholder="State"
                          value={form.state}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, state: e.target.value }))
                          }
                        />
                      </div>

                      <div>
                        <label className={labelCls}>Country</label>
                        <input
                          className={inputCls}
                          placeholder="Country"
                          value={form.country}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, country: e.target.value }))
                          }
                        />
                      </div>

                      <div>
                        <label className={labelCls}>Pincode</label>
                        <input
                          className={inputCls}
                          placeholder="Pincode"
                          value={form.pincode}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, pincode: e.target.value }))
                          }
                        />
                      </div>
                    </>
                  )}

                  {form.locationKind !== "physical" && (
                    <div className="md:col-span-2">
                      <label className={labelCls}>Meeting URL</label>
                      <input
                        className={inputCls}
                        placeholder="Meeting URL"
                        value={form.meetingUrl}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            meetingUrl: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}
                </div>
              </section>

              <section className="service-parent-card">
                <h2 className="service-main-heading">Audience</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Audience Mode</label>
                    <select
                      className={inputCls}
                      value={form.audienceMode}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          audienceMode: e.target.value,
                        }))
                      }
                    >
                      <option value="all">all</option>
                      <option value="roles">roles</option>
                      <option value="users">users</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelCls}>Roles (comma separated)</label>
                    <input
                      className={inputCls}
                      placeholder="Roles (comma separated)"
                      value={form.audienceRolesCSV}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          audienceRolesCSV: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className={labelCls}>
                      User IDs (comma separated)
                    </label>
                    <input
                      className={inputCls}
                      placeholder="User IDs (comma separated)"
                      value={form.audienceUsersCSV}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          audienceUsersCSV: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </section>

              <section className="service-parent-card">
                <h2 className="service-main-heading">Registration</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700 rounded-xl border border-slate-200 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={form.regRequired}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          regRequired: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Required</span>
                  </label>

                  <div>
                    <label className={labelCls}>Capacity</label>
                    <input
                      type="number"
                      className={inputCls}
                      placeholder="Capacity"
                      value={form.regCapacity}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          regCapacity: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <label className="inline-flex items-center gap-2 text-sm text-slate-700 rounded-xl border border-slate-200 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={form.regWaitlist}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          regWaitlist: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Waitlist enabled</span>
                  </label>
                </div>
              </section>

              <section className="service-parent-card">
                <h2 className="service-main-heading">Other</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Tags (comma separated)</label>
                    <input
                      className={inputCls}
                      placeholder="Tags (comma separated)"
                      value={form.tagsCSV}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, tagsCSV: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Entity model (optional)</label>
                    <input
                      className={inputCls}
                      placeholder="Entity model (optional)"
                      value={form.entityModel}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          entityModel: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelCls}>
                      Related entity ObjectId (optional)
                    </label>
                    <input
                      className={inputCls}
                      placeholder="Related entity ObjectId (optional)"
                      value={form.entityId}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, entityId: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Organizers (JSON array)</label>
                  <textarea
                    rows={7}
                    className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/70 focus:border-slate-900/70 sm:text-sm font-mono"
                    value={form.organizersJson}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        organizersJson: e.target.value,
                      }))
                    }
                  />
                  <p className={`${helpCls} mt-2`}>
                    Example:{" "}
                    <code>[{`{ "user": "<ObjectId>", "role": "host" }`}]</code>
                  </p>
                </div>
              </section>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  disabled={saving}
                  type="submit"
                  className={`primary-gradient-button ${
                    saving ? "opacity-60" : ""
                  }`}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/single-event/${id}`)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
