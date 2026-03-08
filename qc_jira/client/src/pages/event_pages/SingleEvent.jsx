// import React, { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";

// const API = `${globalBackendRoute}/api`;

// const fmtDT = (v) => (v ? new Date(v).toLocaleString() : "—");
// const safe = (v) => (v === undefined || v === null ? "" : String(v));
// const toISO = (dateStr, timeStr) => {
//   if (!dateStr || !timeStr) return null;
//   const d = new Date(`${dateStr}T${timeStr}:00`);
//   return isNaN(d.getTime()) ? null : d.toISOString();
// };

// export default function SingleEvent() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const token =
//     localStorage.getItem("userToken") || localStorage.getItem("token") || "";

//   let user = null;
//   try {
//     user = JSON.parse(localStorage.getItem("user"));
//   } catch {
//     user = null;
//   }
//   const isSuperAdmin =
//     user?.role === "superadmin" || user?.role === "admin" || false;

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const [event, setEvent] = useState(null);
//   const [busy, setBusy] = useState(false);
//   const [toast, setToast] = useState("");

//   const [edit, setEdit] = useState({
//     title: "",
//     subtitle: "",
//     description: "",
//     date: "",
//     start: "",
//     end: "",
//     status: "draft",
//     isPublished: false,
//     locationKind: "physical",
//     venue: "",
//     addressLine1: "",
//     addressLine2: "",
//     city: "",
//     state: "",
//     country: "",
//     pincode: "",
//     meetingUrl: "",
//   });

//   const [resched, setResched] = useState({
//     date: "",
//     start: "",
//     end: "",
//     reason: "",
//   });
//   const [cancelReason, setCancelReason] = useState("");
//   const [postpone, setPostpone] = useState({
//     date: "",
//     start: "",
//     end: "",
//     reason: "",
//   });
//   const [restartPayload, setRestartPayload] = useState({
//     date: "",
//     start: "",
//     end: "",
//     reason: "",
//   });

//   const [audMode, setAudMode] = useState("");
//   const [rolesToAdd, setRolesToAdd] = useState("");
//   const [roleToRemove, setRoleToRemove] = useState("");
//   const [usersToAdd, setUsersToAdd] = useState("");
//   const [userToRemove, setUserToRemove] = useState("");

//   const [reminder, setReminder] = useState({
//     minutesBeforeStart: 60,
//     channel: "inapp",
//     templateKey: "",
//     enabled: true,
//   });
//   const [removeReminderIndex, setRemoveReminderIndex] = useState("");

//   const [attachment, setAttachment] = useState({
//     label: "",
//     url: "",
//     mime: "",
//     sizeBytes: "",
//   });
//   const [removeAttachmentIndex, setRemoveAttachmentIndex] = useState("");

//   const [tagToAdd, setTagToAdd] = useState("");
//   const [tagToRemove, setTagToRemove] = useState("");

//   const [newOwner, setNewOwner] = useState("");
//   const [entityModel, setEntityModel] = useState("");
//   const [entityId, setEntityId] = useState("");
//   const [organizersJson, setOrganizersJson] = useState("[]");

//   const AX = axios.create({
//     baseURL: API,
//     headers: token ? { Authorization: `Bearer ${token}` } : {},
//   });

//   const toastOK = (m) => {
//     setToast(m);
//     setTimeout(() => setToast(""), 2200);
//   };

//   const load = () => {
//     if (!id) return;
//     setLoading(true);
//     setErr("");
//     AX.get(`/events/${id}`)
//       .then((res) => {
//         const ev = res.data;
//         setEvent(ev);

//         const sd = ev.startTime ? new Date(ev.startTime) : null;
//         const ed = ev.endTime ? new Date(ev.endTime) : null;
//         const yyyy = sd ? String(sd.getFullYear()).padStart(4, "0") : "";
//         const mm = sd ? String(sd.getMonth() + 1).padStart(2, "0") : "";
//         const dd = sd ? String(sd.getDate()).padStart(2, "0") : "";
//         const date = sd ? `${yyyy}-${mm}-${dd}` : "";
//         const hhS = sd ? String(sd.getHours()).padStart(2, "0") : "";
//         const miS = sd ? String(sd.getMinutes()).padStart(2, "0") : "";
//         const hhE = ed ? String(ed.getHours()).padStart(2, "0") : "";
//         const miE = ed ? String(ed.getMinutes()).padStart(2, "0") : "";

//         setEdit({
//           title: safe(ev.title),
//           subtitle: safe(ev.subtitle),
//           description: safe(ev.description),
//           date,
//           start: sd ? `${hhS}:${miS}` : "",
//           end: ed ? `${hhE}:${miE}` : "",
//           status: safe(ev.status || "draft"),
//           isPublished: !!ev.isPublished,
//           locationKind: safe(ev.location?.kind || "physical"),
//           venue: safe(ev.location?.venue),
//           addressLine1: safe(ev.location?.addressLine1),
//           addressLine2: safe(ev.location?.addressLine2),
//           city: safe(ev.location?.city),
//           state: safe(ev.location?.state),
//           country: safe(ev.location?.country),
//           pincode: safe(ev.location?.pincode),
//           meetingUrl: safe(ev.location?.meetingUrl),
//         });

//         setAudMode(safe(ev.audience?.mode || "all"));
//       })
//       .catch((e) => {
//         console.error("get event error:", e?.response || e);
//         setErr(
//           e?.response?.data?.error ||
//             e?.response?.data?.message ||
//             "Failed to load event."
//         );
//       })
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const reload = async () => {
//     const res = await AX.get(`/events/${id}`);
//     setEvent(res.data);
//   };

//   const handleUpdateCore = async () => {
//     setBusy(true);
//     setErr("");
//     try {
//       const startTime = toISO(edit.date, edit.start);
//       const endTime = toISO(edit.date, edit.end);
//       const location =
//         edit.locationKind === "virtual"
//           ? { kind: "virtual", meetingUrl: edit.meetingUrl, venue: edit.venue }
//           : {
//               kind: edit.locationKind || "physical",
//               venue: edit.venue,
//               addressLine1: edit.addressLine1,
//               addressLine2: edit.addressLine2,
//               city: edit.city,
//               state: edit.state,
//               country: edit.country,
//               pincode: edit.pincode,
//             };

//       await AX.put(`/events/${id}`, {
//         title: edit.title,
//         subtitle: edit.subtitle || undefined,
//         description: edit.description,
//         startTime,
//         endTime,
//         status: edit.status,
//         isPublished: !!edit.isPublished,
//         location,
//       });
//       await reload();
//       toastOK("Event updated");
//     } catch (e) {
//       console.error("updateEvent:", e?.response || e);
//       setErr(
//         e?.response?.data?.error ||
//           e?.response?.data?.details ||
//           "Update failed"
//       );
//     } finally {
//       setBusy(false);
//     }
//   };

//   const callPost = async (path, body = {}) =>
//     AX.post(path, body).then(() => reload());

//   const onPublish = () =>
//     callPost(`/events/${id}/publish`).then(() => toastOK("Published"));
//   const onUnpublish = () =>
//     callPost(`/events/${id}/unpublish`).then(() => toastOK("Unpublished"));

//   const onReschedule = async () => {
//     const newStart = toISO(resched.date, resched.start);
//     const newEnd = toISO(resched.date, resched.end);
//     await callPost(`/events/${id}/reschedule`, {
//       newStart,
//       newEnd,
//       reason: resched.reason,
//     });
//     toastOK("Rescheduled");
//     setResched({ date: "", start: "", end: "", reason: "" });
//   };

//   const onRestart = async () => {
//     const newStart = toISO(restartPayload.date, restartPayload.start);
//     const newEnd = toISO(restartPayload.date, restartPayload.end);
//     await callPost(`/events/${id}/restart`, {
//       newStart,
//       newEnd,
//       reason: restartPayload.reason,
//     });
//     toastOK("Restarted");
//     setRestartPayload({ date: "", start: "", end: "", reason: "" });
//   };

//   const onCancel = async () => {
//     await callPost(`/events/${id}/cancel`, { reason: cancelReason });
//     toastOK("Cancelled");
//     setCancelReason("");
//   };

//   const onPostpone = async () => {
//     const newStart = toISO(postpone.date, postpone.start);
//     const newEnd = toISO(postpone.date, postpone.end);
//     await callPost(`/events/${id}/postpone`, {
//       newStart,
//       newEnd,
//       reason: postpone.reason,
//     });
//     toastOK("Postponed");
//     setPostpone({ date: "", start: "", end: "", reason: "" });
//   };

//   const onSetAudienceMode = async () => {
//     await callPost(`/events/${id}/audience/mode`, { mode: audMode });
//     toastOK("Audience mode updated");
//   };
//   const onAddRoles = async () => {
//     const roles = rolesToAdd
//       .split(",")
//       .map((s) => s.trim().toLowerCase())
//       .filter(Boolean);
//     await callPost(`/events/${id}/audience/roles/add`, { roles });
//     toastOK("Roles added");
//     setRolesToAdd("");
//   };
//   const onRemoveRole = async () => {
//     await callPost(`/events/${id}/audience/roles/remove`, {
//       role: String(roleToRemove || "")
//         .trim()
//         .toLowerCase(),
//     });
//     toastOK("Role removed");
//     setRoleToRemove("");
//   };
//   const onAddUsers = async () => {
//     const users = usersToAdd
//       .split(",")
//       .map((s) => s.trim())
//       .filter(Boolean);
//     await callPost(`/events/${id}/audience/users/add`, { users });
//     toastOK("Users added");
//     setUsersToAdd("");
//   };
//   const onRemoveUser = async () => {
//     await callPost(`/events/${id}/audience/users/remove`, {
//       userId: String(userToRemove || "").trim(),
//     });
//     toastOK("User removed");
//     setUserToRemove("");
//   };

//   const onAddReminder = async () => {
//     const payload = {
//       minutesBeforeStart: Number(reminder.minutesBeforeStart) || 0,
//       channel: reminder.channel || "inapp",
//       templateKey: reminder.templateKey || undefined,
//       enabled: !!reminder.enabled,
//     };
//     await callPost(`/events/${id}/reminders/add`, payload);
//     toastOK("Reminder added");
//     setReminder({
//       minutesBeforeStart: 60,
//       channel: "inapp",
//       templateKey: "",
//       enabled: true,
//     });
//   };
//   const onRemoveReminder = async () => {
//     await callPost(`/events/${id}/reminders/remove`, {
//       index: Number(removeReminderIndex),
//     });
//     toastOK("Reminder removed");
//     setRemoveReminderIndex("");
//   };

//   const onAddAttachment = async () => {
//     const payload = {
//       label: attachment.label || undefined,
//       url: attachment.url || undefined,
//       mime: attachment.mime || undefined,
//       sizeBytes: attachment.sizeBytes
//         ? Number(attachment.sizeBytes)
//         : undefined,
//     };
//     await callPost(`/events/${id}/attachments/add`, payload);
//     toastOK("Attachment added");
//     setAttachment({ label: "", url: "", mime: "", sizeBytes: "" });
//   };
//   const onRemoveAttachment = async () => {
//     await callPost(`/events/${id}/attachments/remove`, {
//       index: Number(removeAttachmentIndex),
//     });
//     toastOK("Attachment removed");
//     setRemoveAttachmentIndex("");
//   };

//   const onAddTag = async () => {
//     await callPost(`/events/${id}/tags/add`, { tag: tagToAdd.trim() });
//     toastOK("Tag added");
//     setTagToAdd("");
//   };
//   const onRemoveTag = async () => {
//     await callPost(`/events/${id}/tags/remove`, { tag: tagToRemove.trim() });
//     toastOK("Tag removed");
//     setTagToRemove("");
//   };

//   const onTransferOwner = async () => {
//     await callPost(`/events/${id}/transfer/owner`, { userId: newOwner.trim() });
//     toastOK("Ownership transferred");
//     setNewOwner("");
//   };
//   const onTransferEntity = async () => {
//     await callPost(`/events/${id}/transfer/entity`, {
//       entityModel: entityModel.trim(),
//       entityId: entityId.trim(),
//     });
//     toastOK("Linked to entity");
//     setEntityModel("");
//     setEntityId("");
//   };
//   const onReplaceOrganizers = async () => {
//     try {
//       const organizers = JSON.parse(organizersJson);
//       await callPost(`/events/${id}/organizers/replace`, { organizers });
//       toastOK("Organizers replaced");
//     } catch {
//       setErr("Organizers JSON invalid");
//     }
//   };

//   const onSoftDelete = async () => {
//     await AX.delete(`/events/${id}`);
//     toastOK("Soft deleted");
//     await reload();
//   };
//   const onRestore = async () => {
//     await callPost(`/events/${id}/restore`);
//     toastOK("Restored");
//   };
//   const onHardDelete = async () => {
//     if (!window.confirm("Hard delete this event permanently?")) return;
//     await AX.delete(`/events/${id}/hard`);
//     toastOK("Hard deleted");
//     navigate("/all-events");
//   };

//   const durationLabel = useMemo(() => {
//     if (!event?.startTime || !event?.endTime) return "—";
//     const s = new Date(event.startTime).getTime();
//     const e = new Date(event.endTime).getTime();
//     const diff = Math.max(0, e - s);
//     const h = Math.floor(diff / 3600000);
//     const m = Math.floor((diff % 3600000) / 60000);
//     return `${h ? `${h}h ` : ""}${m}m`;
//   }, [event]);

//   if (!token || !isSuperAdmin) {
//     return (
//       <div className="max-w-5xl mx-auto p-4">
//         <h1 className="text-2xl font-bold">Event</h1>
//         <p className="mt-2 text-red-600">Super admin/admin access only.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Single Event</h1>
//         <Link to="/all-events" className="text-indigo-600 hover:underline">
//           ← Back to all events
//         </Link>
//       </div>

//       {toast && (
//         <div className="mt-3 p-2 rounded bg-green-50 text-green-700 border border-green-200 text-sm">
//           {toast}
//         </div>
//       )}
//       {err && (
//         <div className="mt-3 p-2 rounded bg-red-50 text-red-700 border border-red-200 text-sm">
//           {err}
//         </div>
//       )}

//       {loading ? (
//         <div className="mt-6 text-gray-500">Loading…</div>
//       ) : !event ? (
//         <div className="mt-6 text-gray-500">Event not found.</div>
//       ) : (
//         <>
//           <div className="mt-4 rounded-lg border p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-xl font-semibold">{event.title}</div>
//                 {event.subtitle ? (
//                   <div className="text-gray-600">{event.subtitle}</div>
//                 ) : null}
//               </div>
//               <div className="text-right">
//                 <div className="text-sm">
//                   <span className="px-2 py-0.5 rounded bg-gray-100 mr-2">
//                     {event.status}
//                   </span>
//                   {event.isPublished ? (
//                     <span className="px-2 py-0.5 rounded bg-green-100 text-green-700">
//                       Published
//                     </span>
//                   ) : (
//                     <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">
//                       Unpublished
//                     </span>
//                   )}
//                 </div>
//                 <div className="mt-1 text-xs text-gray-500">
//                   Created {fmtDT(event.createdAt)}
//                 </div>
//               </div>
//             </div>

//             <div className="mt-3 text-gray-800 whitespace-pre-wrap">
//               {event.description || (
//                 <em className="text-gray-400">No description</em>
//               )}
//             </div>

//             <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
//               <div>
//                 <div>
//                   <span className="font-medium">Start:</span>{" "}
//                   {fmtDT(event.startTime)}
//                 </div>
//                 <div>
//                   <span className="font-medium">End:</span>{" "}
//                   {fmtDT(event.endTime)}
//                 </div>
//                 <div>
//                   <span className="font-medium">Duration:</span> {durationLabel}
//                 </div>
//               </div>
//               <div>
//                 <div>
//                   <span className="font-medium">Location:</span>{" "}
//                   {event.location?.kind || "—"} • {event.location?.venue || "—"}
//                 </div>
//                 {event.location?.meetingUrl && (
//                   <div className="truncate">
//                     <span className="font-medium">Meeting:</span>{" "}
//                     <a
//                       className="text-indigo-600"
//                       href={event.location.meetingUrl}
//                       target="_blank"
//                       rel="noreferrer"
//                     >
//                       {event.location.meetingUrl}
//                     </a>
//                   </div>
//                 )}
//                 <div className="mt-1">
//                   <span className="font-medium">Audience:</span>{" "}
//                   {event.audience?.mode}{" "}
//                   {!!event.audience?.roles?.length &&
//                     `• roles: ${event.audience.roles.join(", ")}`}
//                   {!!event.audience?.users?.length &&
//                     ` • users: ${event.audience.users.length}`}
//                 </div>
//               </div>
//             </div>

//             <div className="mt-3 text-sm">
//               <span className="font-medium">Tags:</span>{" "}
//               {event.tags?.length ? event.tags.join(", ") : "—"}
//             </div>

//             {Array.isArray(event.organizers) && event.organizers.length > 0 && (
//               <div className="mt-3 text-sm">
//                 <div className="font-medium">Organizers:</div>
//                 <ul className="list-disc ml-5">
//                   {event.organizers.map((o, i) => (
//                     <li key={i}>
//                       {o.role ? `${o.role}: ` : ""}
//                       {o.user
//                         ? `${o.user?.name || o.user} (${o.user?.email || ""})`
//                         : o.name || "—"}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
//             <button
//               onClick={onPublish}
//               className="px-3 py-2 rounded bg-indigo-600 text-white text-sm"
//             >
//               Publish
//             </button>
//             <button
//               onClick={onUnpublish}
//               className="px-3 py-2 rounded border text-sm"
//             >
//               Unpublish
//             </button>
//             <button
//               onClick={onSoftDelete}
//               className="px-3 py-2 rounded border text-sm"
//             >
//               Soft Delete
//             </button>
//             <button
//               onClick={onRestore}
//               className="px-3 py-2 rounded border text-sm"
//             >
//               Restore
//             </button>
//             <button
//               onClick={onHardDelete}
//               className="px-3 py-2 rounded bg-red-600 text-white text-sm"
//             >
//               Hard Delete
//             </button>
//           </div>

//           <section className="mt-6 rounded-lg border p-4">
//             <h2 className="text-lg font-semibold">Edit Core</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
//               <input
//                 className="border rounded px-3 py-2"
//                 placeholder="Title"
//                 value={edit.title}
//                 onChange={(e) =>
//                   setEdit((p) => ({ ...p, title: e.target.value }))
//                 }
//               />
//               <input
//                 className="border rounded px-3 py-2"
//                 placeholder="Subtitle"
//                 value={edit.subtitle}
//                 onChange={(e) =>
//                   setEdit((p) => ({ ...p, subtitle: e.target.value }))
//                 }
//               />
//               <input
//                 type="date"
//                 className="border rounded px-3 py-2"
//                 value={edit.date}
//                 onChange={(e) =>
//                   setEdit((p) => ({ ...p, date: e.target.value }))
//                 }
//               />
//               <div className="grid grid-cols-2 gap-2">
//                 <input
//                   type="time"
//                   className="border rounded px-3 py-2"
//                   value={edit.start}
//                   onChange={(e) =>
//                     setEdit((p) => ({ ...p, start: e.target.value }))
//                   }
//                 />
//                 <input
//                   type="time"
//                   className="border rounded px-3 py-2"
//                   value={edit.end}
//                   onChange={(e) =>
//                     setEdit((p) => ({ ...p, end: e.target.value }))
//                   }
//                 />
//               </div>
//               <select
//                 className="border rounded px-3 py-2"
//                 value={edit.status}
//                 onChange={(e) =>
//                   setEdit((p) => ({ ...p, status: e.target.value }))
//                 }
//               >
//                 <option value="draft">draft</option>
//                 <option value="scheduled">scheduled</option>
//                 <option value="live">live</option>
//                 <option value="completed">completed</option>
//                 <option value="cancelled">cancelled</option>
//                 <option value="postponed">postponed</option>
//               </select>
//               <label className="inline-flex items-center gap-2 text-sm">
//                 <input
//                   type="checkbox"
//                   checked={edit.isPublished}
//                   onChange={(e) =>
//                     setEdit((p) => ({ ...p, isPublished: e.target.checked }))
//                   }
//                 />
//                 Published
//               </label>
//               <select
//                 className="border rounded px-3 py-2"
//                 value={edit.locationKind}
//                 onChange={(e) =>
//                   setEdit((p) => ({ ...p, locationKind: e.target.value }))
//                 }
//               >
//                 <option value="physical">physical</option>
//                 <option value="virtual">virtual</option>
//                 <option value="hybrid">hybrid</option>
//               </select>
//               <input
//                 className="border rounded px-3 py-2"
//                 placeholder="Venue"
//                 value={edit.venue}
//                 onChange={(e) =>
//                   setEdit((p) => ({ ...p, venue: e.target.value }))
//                 }
//               />
//               {edit.locationKind !== "virtual" && (
//                 <>
//                   <input
//                     className="border rounded px-3 py-2"
//                     placeholder="Address Line 1"
//                     value={edit.addressLine1}
//                     onChange={(e) =>
//                       setEdit((p) => ({ ...p, addressLine1: e.target.value }))
//                     }
//                   />
//                   <input
//                     className="border rounded px-3 py-2"
//                     placeholder="Address Line 2"
//                     value={edit.addressLine2}
//                     onChange={(e) =>
//                       setEdit((p) => ({ ...p, addressLine2: e.target.value }))
//                     }
//                   />
//                   <div className="grid grid-cols-2 gap-2">
//                     <input
//                       className="border rounded px-3 py-2"
//                       placeholder="City"
//                       value={edit.city}
//                       onChange={(e) =>
//                         setEdit((p) => ({ ...p, city: e.target.value }))
//                       }
//                     />
//                     <input
//                       className="border rounded px-3 py-2"
//                       placeholder="State"
//                       value={edit.state}
//                       onChange={(e) =>
//                         setEdit((p) => ({ ...p, state: e.target.value }))
//                       }
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-2">
//                     <input
//                       className="border rounded px-3 py-2"
//                       placeholder="Country"
//                       value={edit.country}
//                       onChange={(e) =>
//                         setEdit((p) => ({ ...p, country: e.target.value }))
//                       }
//                     />
//                     <input
//                       className="border rounded px-3 py-2"
//                       placeholder="Pincode"
//                       value={edit.pincode}
//                       onChange={(e) =>
//                         setEdit((p) => ({ ...p, pincode: e.target.value }))
//                       }
//                     />
//                   </div>
//                 </>
//               )}
//               {edit.locationKind !== "physical" && (
//                 <input
//                   className="border rounded px-3 py-2"
//                   placeholder="Meeting URL"
//                   value={edit.meetingUrl}
//                   onChange={(e) =>
//                     setEdit((p) => ({ ...p, meetingUrl: e.target.value }))
//                   }
//                 />
//               )}
//               <textarea
//                 rows={4}
//                 className="border rounded px-3 py-2 md:col-span-2"
//                 placeholder="Description"
//                 value={edit.description}
//                 onChange={(e) =>
//                   setEdit((p) => ({ ...p, description: e.target.value }))
//                 }
//               />
//             </div>
//             <div className="mt-3">
//               <button
//                 disabled={busy}
//                 onClick={handleUpdateCore}
//                 className={`px-4 py-2 rounded bg-indigo-600 text-white text-sm ${
//                   busy ? "opacity-60" : ""
//                 }`}
//               >
//                 {busy ? "Saving…" : "Save Changes"}
//               </button>
//             </div>
//           </section>

//           <section className="mt-6 rounded-lg border p-4">
//             <h2 className="text-lg font-semibold">Status & Schedule</h2>

//             <div className="mt-3 grid grid-cols-1 md:grid-cols-5 gap-2">
//               <input
//                 type="date"
//                 className="border rounded px-3 py-2"
//                 value={resched.date}
//                 onChange={(e) =>
//                   setResched((p) => ({ ...p, date: e.target.value }))
//                 }
//               />
//               <input
//                 type="time"
//                 className="border rounded px-3 py-2"
//                 value={resched.start}
//                 onChange={(e) =>
//                   setResched((p) => ({ ...p, start: e.target.value }))
//                 }
//               />
//               <input
//                 type="time"
//                 className="border rounded px-3 py-2"
//                 value={resched.end}
//                 onChange={(e) =>
//                   setResched((p) => ({ ...p, end: e.target.value }))
//                 }
//               />
//               <input
//                 className="border rounded px-3 py-2 md:col-span-2"
//                 placeholder="Reason"
//                 value={resched.reason}
//                 onChange={(e) =>
//                   setResched((p) => ({ ...p, reason: e.target.value }))
//                 }
//               />
//             </div>
//             <div className="mt-2">
//               <button
//                 onClick={onReschedule}
//                 className="px-3 py-1.5 rounded border text-sm"
//               >
//                 Reschedule
//               </button>
//             </div>

//             <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-2">
//               <input
//                 type="date"
//                 className="border rounded px-3 py-2"
//                 value={restartPayload.date}
//                 onChange={(e) =>
//                   setRestartPayload((p) => ({ ...p, date: e.target.value }))
//                 }
//               />
//               <input
//                 type="time"
//                 className="border rounded px-3 py-2"
//                 value={restartPayload.start}
//                 onChange={(e) =>
//                   setRestartPayload((p) => ({ ...p, start: e.target.value }))
//                 }
//               />
//               <input
//                 type="time"
//                 className="border rounded px-3 py-2"
//                 value={restartPayload.end}
//                 onChange={(e) =>
//                   setRestartPayload((p) => ({ ...p, end: e.target.value }))
//                 }
//               />
//               <input
//                 className="border rounded px-3 py-2 md:col-span-2"
//                 placeholder="Reason"
//                 value={restartPayload.reason}
//                 onChange={(e) =>
//                   setRestartPayload((p) => ({ ...p, reason: e.target.value }))
//                 }
//               />
//             </div>
//             <div className="mt-2">
//               <button
//                 onClick={onRestart}
//                 className="px-3 py-1.5 rounded border text-sm"
//               >
//                 Restart (make live)
//               </button>
//             </div>

//             <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-2">
//               <input
//                 className="border rounded px-3 py-2 md:col-span-3"
//                 placeholder="Cancel reason"
//                 value={cancelReason}
//                 onChange={(e) => setCancelReason(e.target.value)}
//               />
//               <button
//                 onClick={onCancel}
//                 className="px-3 py-1.5 rounded border text-sm"
//               >
//                 Cancel Event
//               </button>
//             </div>

//             <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-2">
//               <input
//                 type="date"
//                 className="border rounded px-3 py-2"
//                 value={postpone.date}
//                 onChange={(e) =>
//                   setPostpone((p) => ({ ...p, date: e.target.value }))
//                 }
//               />
//               <input
//                 type="time"
//                 className="border rounded px-3 py-2"
//                 value={postpone.start}
//                 onChange={(e) =>
//                   setPostpone((p) => ({ ...p, start: e.target.value }))
//                 }
//               />
//               <input
//                 type="time"
//                 className="border rounded px-3 py-2"
//                 value={postpone.end}
//                 onChange={(e) =>
//                   setPostpone((p) => ({ ...p, end: e.target.value }))
//                 }
//               />
//               <input
//                 className="border rounded px-3 py-2 md:col-span-2"
//                 placeholder="Reason"
//                 value={postpone.reason}
//                 onChange={(e) =>
//                   setPostpone((p) => ({ ...p, reason: e.target.value }))
//                 }
//               />
//             </div>
//             <div className="mt-2">
//               <button
//                 onClick={onPostpone}
//                 className="px-3 py-1.5 rounded border text-sm"
//               >
//                 Postpone
//               </button>
//             </div>
//           </section>

//           <section className="mt-6 rounded-lg border p-4 grid gap-6">
//             <div>
//               <h2 className="text-lg font-semibold">Audience</h2>
//               <div className="mt-2 flex items-center gap-2">
//                 <select
//                   className="border rounded px-3 py-2"
//                   value={audMode}
//                   onChange={(e) => setAudMode(e.target.value)}
//                 >
//                   <option value="all">all</option>
//                   <option value="roles">roles</option>
//                   <option value="users">users</option>
//                 </select>
//                 <button
//                   onClick={onSetAudienceMode}
//                   className="px-3 py-1.5 rounded border text-sm"
//                 >
//                   Set Mode
//                 </button>
//               </div>

//               <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
//                 <input
//                   className="border rounded px-3 py-2"
//                   placeholder="Add roles (comma separated)"
//                   value={rolesToAdd}
//                   onChange={(e) => setRolesToAdd(e.target.value)}
//                 />
//                 <button
//                   onClick={onAddRoles}
//                   className="px-3 py-1.5 rounded border text-sm"
//                 >
//                   Add Roles
//                 </button>

//                 <input
//                   className="border rounded px-3 py-2"
//                   placeholder="Remove a role (single)"
//                   value={roleToRemove}
//                   onChange={(e) => setRoleToRemove(e.target.value)}
//                 />
//                 <button
//                   onClick={onRemoveRole}
//                   className="px-3 py-1.5 rounded border text-sm"
//                 >
//                   Remove Role
//                 </button>
//               </div>

//               <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
//                 <input
//                   className="border rounded px-3 py-2"
//                   placeholder="Add userIds (comma separated)"
//                   value={usersToAdd}
//                   onChange={(e) => setUsersToAdd(e.target.value)}
//                 />
//                 <button
//                   onClick={onAddUsers}
//                   className="px-3 py-1.5 rounded border text-sm"
//                 >
//                   Add Users
//                 </button>

//                 <input
//                   className="border rounded px-3 py-2"
//                   placeholder="Remove userId (single)"
//                   value={userToRemove}
//                   onChange={(e) => setUserToRemove(e.target.value)}
//                 />
//                 <button
//                   onClick={onRemoveUser}
//                   className="px-3 py-1.5 rounded border text-sm"
//                 >
//                   Remove User
//                 </button>
//               </div>
//             </div>

//             <div>
//               <h2 className="text-lg font-semibold">Reminders</h2>
//               <div className="mt-2 grid grid-cols-1 md:grid-cols-5 gap-2">
//                 <input
//                   type="number"
//                   className="border rounded px-3 py-2"
//                   placeholder="Minutes before"
//                   value={reminder.minutesBeforeStart}
//                   onChange={(e) =>
//                     setReminder((p) => ({
//                       ...p,
//                       minutesBeforeStart: e.target.value,
//                     }))
//                   }
//                 />
//                 <select
//                   className="border rounded px-3 py-2"
//                   value={reminder.channel}
//                   onChange={(e) =>
//                     setReminder((p) => ({ ...p, channel: e.target.value }))
//                   }
//                 >
//                   <option value="inapp">inapp</option>
//                   <option value="email">email</option>
//                   <option value="sms">sms</option>
//                   <option value="webhook">webhook</option>
//                 </select>
//                 <input
//                   className="border rounded px-3 py-2"
//                   placeholder="Template key (opt)"
//                   value={reminder.templateKey}
//                   onChange={(e) =>
//                     setReminder((p) => ({ ...p, templateKey: e.target.value }))
//                   }
//                 />
//                 <label className="inline-flex items-center gap-2 px-3 py-2 border rounded">
//                   <input
//                     type="checkbox"
//                     checked={reminder.enabled}
//                     onChange={(e) =>
//                       setReminder((p) => ({ ...p, enabled: e.target.checked }))
//                     }
//                   />
//                   Enabled
//                 </label>
//                 <button
//                   onClick={onAddReminder}
//                   className="px-3 py-1.5 rounded border text-sm"
//                 >
//                   Add Reminder
//                 </button>
//               </div>

//               <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
//                 <input
//                   className="border rounded px-3 py-2"
//                   placeholder="Remove reminder index"
//                   value={removeReminderIndex}
//                   onChange={(e) => setRemoveReminderIndex(e.target.value)}
//                 />
//                 <button
//                   onClick={onRemoveReminder}
//                   className="px-3 py-1.5 rounded border text-sm"
//                 >
//                   Remove Reminder
//                 </button>
//               </div>

//               <div className="mt-3 text-sm text-gray-700">
//                 {event.reminders?.length ? (
//                   <ul className="list-disc ml-5">
//                     {event.reminders.map((r, i) => (
//                       <li key={i}>
//                         #{i} • {r.channel} • {r.minutesBeforeStart} min{" "}
//                         {r.enabled ? "(enabled)" : "(disabled)"}{" "}
//                         {r.templateKey ? `• ${r.templateKey}` : ""}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <em>No reminders</em>
//                 )}
//               </div>
//             </div>

//             <div>
//               <h2 className="text-lg font-semibold">Attachments</h2>
//               <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2">
//                 <input
//                   className="border rounded px-3 py-2"
//                   placeholder="Label"
//                   value={attachment.label}
//                   onChange={(e) =>
//                     setAttachment((p) => ({ ...p, label: e.target.value }))
//                   }
//                 />
//                 <input
//                   className="border rounded px-3 py-2"
//                   placeholder="URL"
//                   value={attachment.url}
//                   onChange={(e) =>
//                     setAttachment((p) => ({ ...p, url: e.target.value }))
//                   }
//                 />
//                 <input
//                   className="border rounded px-3 py-2"
//                   placeholder="MIME"
//                   value={attachment.mime}
//                   onChange={(e) =>
//                     setAttachment((p) => ({ ...p, mime: e.target.value }))
//                   }
//                 />
//                 <input
//                   type="number"
//                   className="border rounded px-3 py-2"
//                   placeholder="Size (bytes)"
//                   value={attachment.sizeBytes}
//                   onChange={(e) =>
//                     setAttachment((p) => ({ ...p, sizeBytes: e.target.value }))
//                   }
//                 />
//               </div>
//               <div className="mt-2">
//                 <button
//                   onClick={onAddAttachment}
//                   className="px-3 py-1.5 rounded border text-sm"
//                 >
//                   Add Attachment
//                 </button>
//               </div>

//               <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
//                 <input
//                   className="border rounded px-3 py-2"
//                   placeholder="Remove attachment index"
//                   value={removeAttachmentIndex}
//                   onChange={(e) => setRemoveAttachmentIndex(e.target.value)}
//                 />
//                 <button
//                   onClick={onRemoveAttachment}
//                   className="px-3 py-1.5 rounded border text-sm"
//                 >
//                   Remove Attachment
//                 </button>
//               </div>

//               <div className="mt-3 text-sm text-gray-700">
//                 {event.attachments?.length ? (
//                   <ul className="list-disc ml-5">
//                     {event.attachments.map((a, i) => (
//                       <li key={i}>
//                         #{i} • {a.label || "file"} • {a.mime || "?"}{" "}
//                         {a.url ? (
//                           <>
//                             •{" "}
//                             <a
//                               className="text-indigo-600"
//                               href={a.url}
//                               target="_blank"
//                               rel="noreferrer"
//                             >
//                               open
//                             </a>
//                           </>
//                         ) : null}
//                         {a.sizeBytes ? ` • ${a.sizeBytes} bytes` : ""}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <em>No attachments</em>
//                 )}
//               </div>
//             </div>

//             <div>
//               <h2 className="text-lg font-semibold">Tags</h2>
//               <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
//                 <input
//                   className="border rounded px-3 py-2"
//                   placeholder="Add tag"
//                   value={tagToAdd}
//                   onChange={(e) => setTagToAdd(e.target.value)}
//                 />
//                 <button
//                   onClick={onAddTag}
//                   className="px-3 py-1.5 rounded border text-sm"
//                 >
//                   Add Tag
//                 </button>

//                 <input
//                   className="border rounded px-3 py-2"
//                   placeholder="Remove tag"
//                   value={tagToRemove}
//                   onChange={(e) => setTagToRemove(e.target.value)}
//                 />
//                 <button
//                   onClick={onRemoveTag}
//                   className="px-3 py-1.5 rounded border text-sm"
//                 >
//                   Remove Tag
//                 </button>
//               </div>
//             </div>
//           </section>

//           <section className="mt-6 rounded-lg border p-4">
//             <h2 className="text-lg font-semibold">Transfer / Organizers</h2>
//             <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
//               <input
//                 className="border rounded px-3 py-2"
//                 placeholder="New owner userId"
//                 value={newOwner}
//                 onChange={(e) => setNewOwner(e.target.value)}
//               />
//               <button
//                 onClick={onTransferOwner}
//                 className="px-3 py-1.5 rounded border text-sm"
//               >
//                 Transfer Ownership
//               </button>
//             </div>

//             <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
//               <input
//                 className="border rounded px-3 py-2"
//                 placeholder="Entity model (Project, Task, Bug, Scenario, Course, User)"
//                 value={entityModel}
//                 onChange={(e) => setEntityModel(e.target.value)}
//               />
//               <input
//                 className="border rounded px-3 py-2"
//                 placeholder="Entity ObjectId"
//                 value={entityId}
//                 onChange={(e) => setEntityId(e.target.value)}
//               />
//               <button
//                 onClick={onTransferEntity}
//                 className="px-3 py-1.5 rounded border text-sm"
//               >
//                 Link to Entity
//               </button>
//             </div>

//             <div className="mt-3">
//               <label className="text-sm font-medium">
//                 Replace Organizers (JSON)
//               </label>
//               <textarea
//                 rows={6}
//                 className="mt-1 w-full border rounded px-3 py-2 font-mono text-sm"
//                 value={organizersJson}
//                 onChange={(e) => setOrganizersJson(e.target.value)}
//                 placeholder='[{"user":"<userId>","role":"host"}]'
//               />
//               <div className="mt-2">
//                 <button
//                   onClick={onReplaceOrganizers}
//                   className="px-3 py-1.5 rounded border text-sm"
//                 >
//                   Replace Organizers
//                 </button>
//               </div>
//             </div>

//             <div className="mt-4 text-sm">
//               <div className="font-medium">Current organizers</div>
//               {event.organizers?.length ? (
//                 <ul className="list-disc ml-5">
//                   {event.organizers.map((o, i) => (
//                     <li key={i}>
//                       {o.role ? `${o.role}: ` : ""}
//                       {o.user
//                         ? `${o.user?.name || o.user} (${o.user?.email || ""})`
//                         : o.name || "—"}
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <em>No organizers</em>
//               )}
//             </div>
//           </section>
//         </>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import eventsBanner from "../../assets/images/profile_banner.jpg"; // change if needed

const API = `${globalBackendRoute}/api`;

const fmtDT = (v) => (v ? new Date(v).toLocaleString() : "—");
const safe = (v) => (v === undefined || v === null ? "" : String(v));
const toISO = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  const d = new Date(`${dateStr}T${timeStr}:00`);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

const HERO_TAGS = ["EVENT", "DETAILS", "ADMIN", "ACTIONS", "SCHEDULE"];
const HERO_STYLE = {
  backgroundImage: `url(${eventsBanner})`,
};

const getStatusBadgeClass = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "live":
      return "bg-green-50 text-green-700 border-green-200";
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    case "postponed":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "draft":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "scheduled":
    default:
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
  }
};

export default function SingleEvent() {
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
  const isSuperAdmin =
    user?.role === "superadmin" || user?.role === "admin" || false;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [event, setEvent] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const [edit, setEdit] = useState({
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
  });

  const [resched, setResched] = useState({
    date: "",
    start: "",
    end: "",
    reason: "",
  });
  const [cancelReason, setCancelReason] = useState("");
  const [postpone, setPostpone] = useState({
    date: "",
    start: "",
    end: "",
    reason: "",
  });
  const [restartPayload, setRestartPayload] = useState({
    date: "",
    start: "",
    end: "",
    reason: "",
  });

  const [audMode, setAudMode] = useState("");
  const [rolesToAdd, setRolesToAdd] = useState("");
  const [roleToRemove, setRoleToRemove] = useState("");
  const [usersToAdd, setUsersToAdd] = useState("");
  const [userToRemove, setUserToRemove] = useState("");

  const [reminder, setReminder] = useState({
    minutesBeforeStart: 60,
    channel: "inapp",
    templateKey: "",
    enabled: true,
  });
  const [removeReminderIndex, setRemoveReminderIndex] = useState("");

  const [attachment, setAttachment] = useState({
    label: "",
    url: "",
    mime: "",
    sizeBytes: "",
  });
  const [removeAttachmentIndex, setRemoveAttachmentIndex] = useState("");

  const [tagToAdd, setTagToAdd] = useState("");
  const [tagToRemove, setTagToRemove] = useState("");

  const [newOwner, setNewOwner] = useState("");
  const [entityModel, setEntityModel] = useState("");
  const [entityId, setEntityId] = useState("");
  const [organizersJson, setOrganizersJson] = useState("[]");

  const AX = axios.create({
    baseURL: API,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const toastOK = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 2200);
  };

  const load = () => {
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

        setEdit({
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
        });

        setAudMode(safe(ev.audience?.mode || "all"));
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
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const reload = async () => {
    const res = await AX.get(`/events/${id}`);
    setEvent(res.data);
  };

  const handleUpdateCore = async () => {
    setBusy(true);
    setErr("");
    try {
      const startTime = toISO(edit.date, edit.start);
      const endTime = toISO(edit.date, edit.end);
      const location =
        edit.locationKind === "virtual"
          ? { kind: "virtual", meetingUrl: edit.meetingUrl, venue: edit.venue }
          : {
              kind: edit.locationKind || "physical",
              venue: edit.venue,
              addressLine1: edit.addressLine1,
              addressLine2: edit.addressLine2,
              city: edit.city,
              state: edit.state,
              country: edit.country,
              pincode: edit.pincode,
            };

      await AX.put(`/events/${id}`, {
        title: edit.title,
        subtitle: edit.subtitle || undefined,
        description: edit.description,
        startTime,
        endTime,
        status: edit.status,
        isPublished: !!edit.isPublished,
        location,
      });
      await reload();
      toastOK("Event updated");
    } catch (e) {
      console.error("updateEvent:", e?.response || e);
      setErr(
        e?.response?.data?.error ||
          e?.response?.data?.details ||
          "Update failed",
      );
    } finally {
      setBusy(false);
    }
  };

  const callPost = async (path, body = {}) =>
    AX.post(path, body).then(() => reload());

  const onPublish = () =>
    callPost(`/events/${id}/publish`).then(() => toastOK("Published"));
  const onUnpublish = () =>
    callPost(`/events/${id}/unpublish`).then(() => toastOK("Unpublished"));

  const onReschedule = async () => {
    const newStart = toISO(resched.date, resched.start);
    const newEnd = toISO(resched.date, resched.end);
    await callPost(`/events/${id}/reschedule`, {
      newStart,
      newEnd,
      reason: resched.reason,
    });
    toastOK("Rescheduled");
    setResched({ date: "", start: "", end: "", reason: "" });
  };

  const onRestart = async () => {
    const newStart = toISO(restartPayload.date, restartPayload.start);
    const newEnd = toISO(restartPayload.date, restartPayload.end);
    await callPost(`/events/${id}/restart`, {
      newStart,
      newEnd,
      reason: restartPayload.reason,
    });
    toastOK("Restarted");
    setRestartPayload({ date: "", start: "", end: "", reason: "" });
  };

  const onCancel = async () => {
    await callPost(`/events/${id}/cancel`, { reason: cancelReason });
    toastOK("Cancelled");
    setCancelReason("");
  };

  const onPostpone = async () => {
    const newStart = toISO(postpone.date, postpone.start);
    const newEnd = toISO(postpone.date, postpone.end);
    await callPost(`/events/${id}/postpone`, {
      newStart,
      newEnd,
      reason: postpone.reason,
    });
    toastOK("Postponed");
    setPostpone({ date: "", start: "", end: "", reason: "" });
  };

  const onSetAudienceMode = async () => {
    await callPost(`/events/${id}/audience/mode`, { mode: audMode });
    toastOK("Audience mode updated");
  };
  const onAddRoles = async () => {
    const roles = rolesToAdd
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    await callPost(`/events/${id}/audience/roles/add`, { roles });
    toastOK("Roles added");
    setRolesToAdd("");
  };
  const onRemoveRole = async () => {
    await callPost(`/events/${id}/audience/roles/remove`, {
      role: String(roleToRemove || "")
        .trim()
        .toLowerCase(),
    });
    toastOK("Role removed");
    setRoleToRemove("");
  };
  const onAddUsers = async () => {
    const users = usersToAdd
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await callPost(`/events/${id}/audience/users/add`, { users });
    toastOK("Users added");
    setUsersToAdd("");
  };
  const onRemoveUser = async () => {
    await callPost(`/events/${id}/audience/users/remove`, {
      userId: String(userToRemove || "").trim(),
    });
    toastOK("User removed");
    setUserToRemove("");
  };

  const onAddReminder = async () => {
    const payload = {
      minutesBeforeStart: Number(reminder.minutesBeforeStart) || 0,
      channel: reminder.channel || "inapp",
      templateKey: reminder.templateKey || undefined,
      enabled: !!reminder.enabled,
    };
    await callPost(`/events/${id}/reminders/add`, payload);
    toastOK("Reminder added");
    setReminder({
      minutesBeforeStart: 60,
      channel: "inapp",
      templateKey: "",
      enabled: true,
    });
  };
  const onRemoveReminder = async () => {
    await callPost(`/events/${id}/reminders/remove`, {
      index: Number(removeReminderIndex),
    });
    toastOK("Reminder removed");
    setRemoveReminderIndex("");
  };

  const onAddAttachment = async () => {
    const payload = {
      label: attachment.label || undefined,
      url: attachment.url || undefined,
      mime: attachment.mime || undefined,
      sizeBytes: attachment.sizeBytes
        ? Number(attachment.sizeBytes)
        : undefined,
    };
    await callPost(`/events/${id}/attachments/add`, payload);
    toastOK("Attachment added");
    setAttachment({ label: "", url: "", mime: "", sizeBytes: "" });
  };
  const onRemoveAttachment = async () => {
    await callPost(`/events/${id}/attachments/remove`, {
      index: Number(removeAttachmentIndex),
    });
    toastOK("Attachment removed");
    setRemoveAttachmentIndex("");
  };

  const onAddTag = async () => {
    await callPost(`/events/${id}/tags/add`, { tag: tagToAdd.trim() });
    toastOK("Tag added");
    setTagToAdd("");
  };
  const onRemoveTag = async () => {
    await callPost(`/events/${id}/tags/remove`, { tag: tagToRemove.trim() });
    toastOK("Tag removed");
    setTagToRemove("");
  };

  const onTransferOwner = async () => {
    await callPost(`/events/${id}/transfer/owner`, { userId: newOwner.trim() });
    toastOK("Ownership transferred");
    setNewOwner("");
  };
  const onTransferEntity = async () => {
    await callPost(`/events/${id}/transfer/entity`, {
      entityModel: entityModel.trim(),
      entityId: entityId.trim(),
    });
    toastOK("Linked to entity");
    setEntityModel("");
    setEntityId("");
  };
  const onReplaceOrganizers = async () => {
    try {
      const organizers = JSON.parse(organizersJson);
      await callPost(`/events/${id}/organizers/replace`, { organizers });
      toastOK("Organizers replaced");
    } catch {
      setErr("Organizers JSON invalid");
    }
  };

  const onSoftDelete = async () => {
    await AX.delete(`/events/${id}`);
    toastOK("Soft deleted");
    await reload();
  };
  const onRestore = async () => {
    await callPost(`/events/${id}/restore`);
    toastOK("Restored");
  };
  const onHardDelete = async () => {
    if (!window.confirm("Hard delete this event permanently?")) return;
    await AX.delete(`/events/${id}/hard`);
    toastOK("Hard deleted");
    navigate("/all-events");
  };

  const durationLabel = useMemo(() => {
    if (!event?.startTime || !event?.endTime) return "—";
    const s = new Date(event.startTime).getTime();
    const e = new Date(event.endTime).getTime();
    const diff = Math.max(0, e - s);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h ? `${h}h ` : ""}${m}m`;
  }, [event]);

  const inputCls = "form-input";
  const labelCls = "form-label";
  const smallBtn =
    "inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] sm:text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50";
  const redBtn =
    "inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-2 text-[11px] sm:text-xs font-medium text-red-700 shadow-sm hover:bg-red-50";

  if (!token || !isSuperAdmin) {
    return (
      <div className="service-page-wrap min-h-screen">
        <div className="service-main-container">
          <div className="service-parent-card">
            <h1 className="service-main-heading">Event</h1>
            <p className="mt-2 text-red-600">Super admin/admin access only.</p>
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
                Single{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
                  event & controls
                </span>
              </h1>

              <p className="mt-2 text-[11px] sm:text-xs md:text-sm text-white/90 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                Review event details, update core settings, manage audience,
                reminders, attachments, ownership, and event lifecycle actions.
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 text-[11px] sm:text-xs text-white">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Event admin · Schedule · Audience · Attachments
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-[11px] sm:text-xs text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                <span>{loading ? "Loading event" : "Admin view"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-200" />
                <span>{event?.status || "Status pending"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-5 sm:py-6 lg:py-7 space-y-5">
          <div className="service-parent-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="service-main-heading">Single Event</h1>
              <Link
                to="/all-events"
                className="text-indigo-600 hover:text-indigo-700 hover:underline text-xs sm:text-sm font-medium"
              >
                ← Back to all events
              </Link>
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
            <>
              <section className="service-parent-card">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 break-words">
                        {event.title}
                      </h2>

                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] sm:text-xs font-medium capitalize ${getStatusBadgeClass(
                          event.status,
                        )}`}
                      >
                        {event.status}
                      </span>

                      {event.isPublished ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-[10px] sm:text-xs font-medium text-green-700">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-1 text-[10px] sm:text-xs font-medium text-yellow-800">
                          Unpublished
                        </span>
                      )}
                    </div>

                    {event.subtitle ? (
                      <p className="mt-2 service-paragraph">{event.subtitle}</p>
                    ) : null}

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                      <div className="service-paragraph whitespace-pre-wrap text-slate-800">
                        {event.description || (
                          <em className="text-slate-400">No description</em>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-[260px] shrink-0">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="service-badge-heading">Event summary</p>

                      <div className="mt-3 space-y-3 text-xs sm:text-sm text-slate-600">
                        <div className="flex items-center justify-between gap-3">
                          <span>Created</span>
                          <span className="font-medium text-slate-800 text-right">
                            {fmtDT(event.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span>Start</span>
                          <span className="font-medium text-slate-800 text-right">
                            {fmtDT(event.startTime)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span>End</span>
                          <span className="font-medium text-slate-800 text-right">
                            {fmtDT(event.endTime)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span>Duration</span>
                          <span className="font-medium text-slate-800">
                            {durationLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                  <div className="service-small-card">
                    <div className="min-w-0">
                      <p className="service-badge-heading">Location</p>
                      <p className="service-small-paragraph break-words">
                        {event.location?.kind || "—"} •{" "}
                        {event.location?.venue || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="service-small-card">
                    <div className="min-w-0">
                      <p className="service-badge-heading">Meeting URL</p>
                      <p className="service-small-paragraph break-words">
                        {event.location?.meetingUrl ? (
                          <a
                            className="text-indigo-600 hover:underline break-all"
                            href={event.location.meetingUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {event.location.meetingUrl}
                          </a>
                        ) : (
                          "—"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="service-small-card">
                    <div className="min-w-0">
                      <p className="service-badge-heading">Audience</p>
                      <p className="service-small-paragraph break-words">
                        {event.audience?.mode}
                        {!!event.audience?.roles?.length &&
                          ` • roles: ${event.audience.roles.join(", ")}`}
                        {!!event.audience?.users?.length &&
                          ` • users: ${event.audience.users.length}`}
                      </p>
                    </div>
                  </div>

                  <div className="service-small-card">
                    <div className="min-w-0">
                      <p className="service-badge-heading">Tags</p>
                      <p className="service-small-paragraph break-words">
                        {event.tags?.length ? event.tags.join(", ") : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {Array.isArray(event.organizers) &&
                  event.organizers.length > 0 && (
                    <div className="mt-5">
                      <p className="service-sub-heading">Organizers</p>
                      <div className="mt-3 space-y-2">
                        {event.organizers.map((o, i) => (
                          <div key={i} className="service-small-card">
                            <div className="min-w-0">
                              <p className="service-list-paragraph break-words">
                                {o.role ? `${o.role}: ` : ""}
                                {o.user
                                  ? `${o.user?.name || o.user} (${o.user?.email || ""})`
                                  : o.name || "—"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </section>

              <section className="service-parent-card">
                <h2 className="service-main-heading">Quick actions</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={onPublish}
                    className="primary-gradient-button"
                  >
                    Publish
                  </button>
                  <button onClick={onUnpublish} className={smallBtn}>
                    Unpublish
                  </button>
                  <button onClick={onSoftDelete} className={smallBtn}>
                    Soft Delete
                  </button>
                  <button onClick={onRestore} className={smallBtn}>
                    Restore
                  </button>
                  <button onClick={onHardDelete} className={redBtn}>
                    Hard Delete
                  </button>
                </div>
              </section>

              <section className="service-parent-card">
                <h2 className="service-main-heading">Edit Core</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Title</label>
                    <input
                      className={inputCls}
                      placeholder="Title"
                      value={edit.title}
                      onChange={(e) =>
                        setEdit((p) => ({ ...p, title: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Subtitle</label>
                    <input
                      className={inputCls}
                      placeholder="Subtitle"
                      value={edit.subtitle}
                      onChange={(e) =>
                        setEdit((p) => ({ ...p, subtitle: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Date</label>
                    <input
                      type="date"
                      className={inputCls}
                      value={edit.date}
                      onChange={(e) =>
                        setEdit((p) => ({ ...p, date: e.target.value }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Start</label>
                      <input
                        type="time"
                        className={inputCls}
                        value={edit.start}
                        onChange={(e) =>
                          setEdit((p) => ({ ...p, start: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>End</label>
                      <input
                        type="time"
                        className={inputCls}
                        value={edit.end}
                        onChange={(e) =>
                          setEdit((p) => ({ ...p, end: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Status</label>
                    <select
                      className={inputCls}
                      value={edit.status}
                      onChange={(e) =>
                        setEdit((p) => ({ ...p, status: e.target.value }))
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
                        checked={edit.isPublished}
                        onChange={(e) =>
                          setEdit((p) => ({
                            ...p,
                            isPublished: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Published</span>
                    </label>
                  </div>

                  <div>
                    <label className={labelCls}>Location Kind</label>
                    <select
                      className={inputCls}
                      value={edit.locationKind}
                      onChange={(e) =>
                        setEdit((p) => ({
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
                      value={edit.venue}
                      onChange={(e) =>
                        setEdit((p) => ({ ...p, venue: e.target.value }))
                      }
                    />
                  </div>

                  {edit.locationKind !== "virtual" && (
                    <>
                      <div>
                        <label className={labelCls}>Address Line 1</label>
                        <input
                          className={inputCls}
                          placeholder="Address Line 1"
                          value={edit.addressLine1}
                          onChange={(e) =>
                            setEdit((p) => ({
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
                          value={edit.addressLine2}
                          onChange={(e) =>
                            setEdit((p) => ({
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
                          value={edit.city}
                          onChange={(e) =>
                            setEdit((p) => ({ ...p, city: e.target.value }))
                          }
                        />
                      </div>

                      <div>
                        <label className={labelCls}>State</label>
                        <input
                          className={inputCls}
                          placeholder="State"
                          value={edit.state}
                          onChange={(e) =>
                            setEdit((p) => ({ ...p, state: e.target.value }))
                          }
                        />
                      </div>

                      <div>
                        <label className={labelCls}>Country</label>
                        <input
                          className={inputCls}
                          placeholder="Country"
                          value={edit.country}
                          onChange={(e) =>
                            setEdit((p) => ({ ...p, country: e.target.value }))
                          }
                        />
                      </div>

                      <div>
                        <label className={labelCls}>Pincode</label>
                        <input
                          className={inputCls}
                          placeholder="Pincode"
                          value={edit.pincode}
                          onChange={(e) =>
                            setEdit((p) => ({ ...p, pincode: e.target.value }))
                          }
                        />
                      </div>
                    </>
                  )}

                  {edit.locationKind !== "physical" && (
                    <div className="md:col-span-2">
                      <label className={labelCls}>Meeting URL</label>
                      <input
                        className={inputCls}
                        placeholder="Meeting URL"
                        value={edit.meetingUrl}
                        onChange={(e) =>
                          setEdit((p) => ({
                            ...p,
                            meetingUrl: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className={labelCls}>Description</label>
                    <textarea
                      rows={5}
                      className={`${inputCls} min-h-[140px]`}
                      placeholder="Description"
                      value={edit.description}
                      onChange={(e) =>
                        setEdit((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    disabled={busy}
                    onClick={handleUpdateCore}
                    className={`primary-gradient-button ${busy ? "opacity-60" : ""}`}
                  >
                    {busy ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </section>

              <section className="service-parent-card">
                <h2 className="service-main-heading">Status & Schedule</h2>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="service-sub-heading">Reschedule</p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="date"
                        className={inputCls}
                        value={resched.date}
                        onChange={(e) =>
                          setResched((p) => ({ ...p, date: e.target.value }))
                        }
                      />
                      <input
                        type="time"
                        className={inputCls}
                        value={resched.start}
                        onChange={(e) =>
                          setResched((p) => ({ ...p, start: e.target.value }))
                        }
                      />
                      <input
                        type="time"
                        className={inputCls}
                        value={resched.end}
                        onChange={(e) =>
                          setResched((p) => ({ ...p, end: e.target.value }))
                        }
                      />
                      <input
                        className={inputCls}
                        placeholder="Reason"
                        value={resched.reason}
                        onChange={(e) =>
                          setResched((p) => ({ ...p, reason: e.target.value }))
                        }
                      />
                    </div>
                    <div className="mt-3">
                      <button onClick={onReschedule} className={smallBtn}>
                        Reschedule
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="service-sub-heading">Restart (make live)</p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="date"
                        className={inputCls}
                        value={restartPayload.date}
                        onChange={(e) =>
                          setRestartPayload((p) => ({
                            ...p,
                            date: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="time"
                        className={inputCls}
                        value={restartPayload.start}
                        onChange={(e) =>
                          setRestartPayload((p) => ({
                            ...p,
                            start: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="time"
                        className={inputCls}
                        value={restartPayload.end}
                        onChange={(e) =>
                          setRestartPayload((p) => ({
                            ...p,
                            end: e.target.value,
                          }))
                        }
                      />
                      <input
                        className={inputCls}
                        placeholder="Reason"
                        value={restartPayload.reason}
                        onChange={(e) =>
                          setRestartPayload((p) => ({
                            ...p,
                            reason: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mt-3">
                      <button onClick={onRestart} className={smallBtn}>
                        Restart
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="service-sub-heading">Cancel Event</p>
                    <div className="mt-3 flex flex-col gap-3">
                      <input
                        className={inputCls}
                        placeholder="Cancel reason"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                      />
                      <div>
                        <button onClick={onCancel} className={redBtn}>
                          Cancel Event
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="service-sub-heading">Postpone</p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="date"
                        className={inputCls}
                        value={postpone.date}
                        onChange={(e) =>
                          setPostpone((p) => ({ ...p, date: e.target.value }))
                        }
                      />
                      <input
                        type="time"
                        className={inputCls}
                        value={postpone.start}
                        onChange={(e) =>
                          setPostpone((p) => ({ ...p, start: e.target.value }))
                        }
                      />
                      <input
                        type="time"
                        className={inputCls}
                        value={postpone.end}
                        onChange={(e) =>
                          setPostpone((p) => ({ ...p, end: e.target.value }))
                        }
                      />
                      <input
                        className={inputCls}
                        placeholder="Reason"
                        value={postpone.reason}
                        onChange={(e) =>
                          setPostpone((p) => ({ ...p, reason: e.target.value }))
                        }
                      />
                    </div>
                    <div className="mt-3">
                      <button onClick={onPostpone} className={smallBtn}>
                        Postpone
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="service-parent-card">
                <h2 className="service-main-heading">Audience</h2>

                <div className="space-y-5">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="service-sub-heading">Audience mode</p>
                    <div className="mt-3 flex flex-col sm:flex-row gap-3 sm:items-center">
                      <select
                        className={`${inputCls} sm:max-w-xs`}
                        value={audMode}
                        onChange={(e) => setAudMode(e.target.value)}
                      >
                        <option value="all">all</option>
                        <option value="roles">roles</option>
                        <option value="users">users</option>
                      </select>
                      <button onClick={onSetAudienceMode} className={smallBtn}>
                        Set Mode
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="service-sub-heading">Roles</p>
                      <div className="mt-3 space-y-3">
                        <input
                          className={inputCls}
                          placeholder="Add roles (comma separated)"
                          value={rolesToAdd}
                          onChange={(e) => setRolesToAdd(e.target.value)}
                        />
                        <button onClick={onAddRoles} className={smallBtn}>
                          Add Roles
                        </button>

                        <input
                          className={inputCls}
                          placeholder="Remove a role (single)"
                          value={roleToRemove}
                          onChange={(e) => setRoleToRemove(e.target.value)}
                        />
                        <button onClick={onRemoveRole} className={smallBtn}>
                          Remove Role
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="service-sub-heading">Users</p>
                      <div className="mt-3 space-y-3">
                        <input
                          className={inputCls}
                          placeholder="Add userIds (comma separated)"
                          value={usersToAdd}
                          onChange={(e) => setUsersToAdd(e.target.value)}
                        />
                        <button onClick={onAddUsers} className={smallBtn}>
                          Add Users
                        </button>

                        <input
                          className={inputCls}
                          placeholder="Remove userId (single)"
                          value={userToRemove}
                          onChange={(e) => setUserToRemove(e.target.value)}
                        />
                        <button onClick={onRemoveUser} className={smallBtn}>
                          Remove User
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="service-parent-card">
                <h2 className="service-main-heading">Reminders</h2>

                <div className="grid grid-cols-1 xl:grid-cols-[1.3fr,1fr] gap-5">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="service-sub-heading">Add reminder</p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="number"
                        className={inputCls}
                        placeholder="Minutes before"
                        value={reminder.minutesBeforeStart}
                        onChange={(e) =>
                          setReminder((p) => ({
                            ...p,
                            minutesBeforeStart: e.target.value,
                          }))
                        }
                      />
                      <select
                        className={inputCls}
                        value={reminder.channel}
                        onChange={(e) =>
                          setReminder((p) => ({
                            ...p,
                            channel: e.target.value,
                          }))
                        }
                      >
                        <option value="inapp">inapp</option>
                        <option value="email">email</option>
                        <option value="sms">sms</option>
                        <option value="webhook">webhook</option>
                      </select>

                      <input
                        className={inputCls}
                        placeholder="Template key (opt)"
                        value={reminder.templateKey}
                        onChange={(e) =>
                          setReminder((p) => ({
                            ...p,
                            templateKey: e.target.value,
                          }))
                        }
                      />

                      <label className="inline-flex items-center gap-2 text-sm text-slate-700 rounded-xl border border-slate-200 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={reminder.enabled}
                          onChange={(e) =>
                            setReminder((p) => ({
                              ...p,
                              enabled: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Enabled</span>
                      </label>
                    </div>
                    <div className="mt-3">
                      <button onClick={onAddReminder} className={smallBtn}>
                        Add Reminder
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="service-sub-heading">Remove reminder</p>
                    <div className="mt-3 space-y-3">
                      <input
                        className={inputCls}
                        placeholder="Remove reminder index"
                        value={removeReminderIndex}
                        onChange={(e) => setRemoveReminderIndex(e.target.value)}
                      />
                      <button onClick={onRemoveReminder} className={smallBtn}>
                        Remove Reminder
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="service-sub-heading">Current reminders</p>
                  <div className="mt-3 text-sm text-slate-700">
                    {event.reminders?.length ? (
                      <ul className="space-y-2">
                        {event.reminders.map((r, i) => (
                          <li key={i} className="service-small-card">
                            <div className="min-w-0">
                              <p className="service-list-paragraph">
                                #{i} • {r.channel} • {r.minutesBeforeStart} min{" "}
                                {r.enabled ? "(enabled)" : "(disabled)"}{" "}
                                {r.templateKey ? `• ${r.templateKey}` : ""}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <em>No reminders</em>
                    )}
                  </div>
                </div>
              </section>

              <section className="service-parent-card">
                <h2 className="service-main-heading">Attachments</h2>

                <div className="grid grid-cols-1 xl:grid-cols-[1.3fr,1fr] gap-5">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="service-sub-heading">Add attachment</p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        className={inputCls}
                        placeholder="Label"
                        value={attachment.label}
                        onChange={(e) =>
                          setAttachment((p) => ({
                            ...p,
                            label: e.target.value,
                          }))
                        }
                      />
                      <input
                        className={inputCls}
                        placeholder="URL"
                        value={attachment.url}
                        onChange={(e) =>
                          setAttachment((p) => ({ ...p, url: e.target.value }))
                        }
                      />
                      <input
                        className={inputCls}
                        placeholder="MIME"
                        value={attachment.mime}
                        onChange={(e) =>
                          setAttachment((p) => ({ ...p, mime: e.target.value }))
                        }
                      />
                      <input
                        type="number"
                        className={inputCls}
                        placeholder="Size (bytes)"
                        value={attachment.sizeBytes}
                        onChange={(e) =>
                          setAttachment((p) => ({
                            ...p,
                            sizeBytes: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mt-3">
                      <button onClick={onAddAttachment} className={smallBtn}>
                        Add Attachment
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="service-sub-heading">Remove attachment</p>
                    <div className="mt-3 space-y-3">
                      <input
                        className={inputCls}
                        placeholder="Remove attachment index"
                        value={removeAttachmentIndex}
                        onChange={(e) =>
                          setRemoveAttachmentIndex(e.target.value)
                        }
                      />
                      <button onClick={onRemoveAttachment} className={smallBtn}>
                        Remove Attachment
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="service-sub-heading">Current attachments</p>
                  <div className="mt-3 text-sm text-slate-700">
                    {event.attachments?.length ? (
                      <ul className="space-y-2">
                        {event.attachments.map((a, i) => (
                          <li key={i} className="service-small-card">
                            <div className="min-w-0">
                              <p className="service-list-paragraph break-words">
                                #{i} • {a.label || "file"} • {a.mime || "?"}
                                {a.url ? (
                                  <>
                                    {" "}
                                    •{" "}
                                    <a
                                      className="text-indigo-600 hover:underline break-all"
                                      href={a.url}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      open
                                    </a>
                                  </>
                                ) : null}
                                {a.sizeBytes ? ` • ${a.sizeBytes} bytes` : ""}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <em>No attachments</em>
                    )}
                  </div>
                </div>
              </section>

              <section className="service-parent-card">
                <h2 className="service-main-heading">Tags</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="service-sub-heading">Add tag</p>
                    <div className="mt-3 space-y-3">
                      <input
                        className={inputCls}
                        placeholder="Add tag"
                        value={tagToAdd}
                        onChange={(e) => setTagToAdd(e.target.value)}
                      />
                      <button onClick={onAddTag} className={smallBtn}>
                        Add Tag
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="service-sub-heading">Remove tag</p>
                    <div className="mt-3 space-y-3">
                      <input
                        className={inputCls}
                        placeholder="Remove tag"
                        value={tagToRemove}
                        onChange={(e) => setTagToRemove(e.target.value)}
                      />
                      <button onClick={onRemoveTag} className={smallBtn}>
                        Remove Tag
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="service-parent-card">
                <h2 className="service-main-heading">Transfer / Organizers</h2>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="service-sub-heading">Transfer ownership</p>
                    <div className="mt-3 flex flex-col gap-3">
                      <input
                        className={inputCls}
                        placeholder="New owner userId"
                        value={newOwner}
                        onChange={(e) => setNewOwner(e.target.value)}
                      />
                      <div>
                        <button onClick={onTransferOwner} className={smallBtn}>
                          Transfer Ownership
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="service-sub-heading">Link to entity</p>
                    <div className="mt-3 flex flex-col gap-3">
                      <input
                        className={inputCls}
                        placeholder="Entity model (Project, Task, Bug, Scenario, Course, User)"
                        value={entityModel}
                        onChange={(e) => setEntityModel(e.target.value)}
                      />
                      <input
                        className={inputCls}
                        placeholder="Entity ObjectId"
                        value={entityId}
                        onChange={(e) => setEntityId(e.target.value)}
                      />
                      <div>
                        <button onClick={onTransferEntity} className={smallBtn}>
                          Link to Entity
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 p-4">
                  <p className="service-sub-heading">
                    Replace Organizers (JSON)
                  </p>
                  <textarea
                    rows={7}
                    className="mt-3 block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/70 focus:border-slate-900/70 sm:text-sm font-mono"
                    value={organizersJson}
                    onChange={(e) => setOrganizersJson(e.target.value)}
                    placeholder='[{"user":"<userId>","role":"host"}]'
                  />
                  <div className="mt-3">
                    <button onClick={onReplaceOrganizers} className={smallBtn}>
                      Replace Organizers
                    </button>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="service-sub-heading">Current organizers</p>
                  <div className="mt-3 text-sm text-slate-700">
                    {event.organizers?.length ? (
                      <ul className="space-y-2">
                        {event.organizers.map((o, i) => (
                          <li key={i} className="service-small-card">
                            <div className="min-w-0">
                              <p className="service-list-paragraph break-words">
                                {o.role ? `${o.role}: ` : ""}
                                {o.user
                                  ? `${o.user?.name || o.user} (${o.user?.email || ""})`
                                  : o.name || "—"}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <em>No organizers</em>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
