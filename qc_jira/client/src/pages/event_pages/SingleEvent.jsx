import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

const API = `${globalBackendRoute}/api`;

const fmtDT = (v) => (v ? new Date(v).toLocaleString() : "—");
const safe = (v) => (v === undefined || v === null ? "" : String(v));
const toISO = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  const d = new Date(`${dateStr}T${timeStr}:00`);
  return isNaN(d.getTime()) ? null : d.toISOString();
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
            "Failed to load event."
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
          "Update failed"
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

  if (!token || !isSuperAdmin) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold">Event</h1>
        <p className="mt-2 text-red-600">Super admin/admin access only.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Single Event</h1>
        <Link to="/all-events" className="text-indigo-600 hover:underline">
          ← Back to all events
        </Link>
      </div>

      {toast && (
        <div className="mt-3 p-2 rounded bg-green-50 text-green-700 border border-green-200 text-sm">
          {toast}
        </div>
      )}
      {err && (
        <div className="mt-3 p-2 rounded bg-red-50 text-red-700 border border-red-200 text-sm">
          {err}
        </div>
      )}

      {loading ? (
        <div className="mt-6 text-gray-500">Loading…</div>
      ) : !event ? (
        <div className="mt-6 text-gray-500">Event not found.</div>
      ) : (
        <>
          <div className="mt-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold">{event.title}</div>
                {event.subtitle ? (
                  <div className="text-gray-600">{event.subtitle}</div>
                ) : null}
              </div>
              <div className="text-right">
                <div className="text-sm">
                  <span className="px-2 py-0.5 rounded bg-gray-100 mr-2">
                    {event.status}
                  </span>
                  {event.isPublished ? (
                    <span className="px-2 py-0.5 rounded bg-green-100 text-green-700">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">
                      Unpublished
                    </span>
                  )}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Created {fmtDT(event.createdAt)}
                </div>
              </div>
            </div>

            <div className="mt-3 text-gray-800 whitespace-pre-wrap">
              {event.description || (
                <em className="text-gray-400">No description</em>
              )}
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <div>
                  <span className="font-medium">Start:</span>{" "}
                  {fmtDT(event.startTime)}
                </div>
                <div>
                  <span className="font-medium">End:</span>{" "}
                  {fmtDT(event.endTime)}
                </div>
                <div>
                  <span className="font-medium">Duration:</span> {durationLabel}
                </div>
              </div>
              <div>
                <div>
                  <span className="font-medium">Location:</span>{" "}
                  {event.location?.kind || "—"} • {event.location?.venue || "—"}
                </div>
                {event.location?.meetingUrl && (
                  <div className="truncate">
                    <span className="font-medium">Meeting:</span>{" "}
                    <a
                      className="text-indigo-600"
                      href={event.location.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {event.location.meetingUrl}
                    </a>
                  </div>
                )}
                <div className="mt-1">
                  <span className="font-medium">Audience:</span>{" "}
                  {event.audience?.mode}{" "}
                  {!!event.audience?.roles?.length &&
                    `• roles: ${event.audience.roles.join(", ")}`}
                  {!!event.audience?.users?.length &&
                    ` • users: ${event.audience.users.length}`}
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm">
              <span className="font-medium">Tags:</span>{" "}
              {event.tags?.length ? event.tags.join(", ") : "—"}
            </div>

            {Array.isArray(event.organizers) && event.organizers.length > 0 && (
              <div className="mt-3 text-sm">
                <div className="font-medium">Organizers:</div>
                <ul className="list-disc ml-5">
                  {event.organizers.map((o, i) => (
                    <li key={i}>
                      {o.role ? `${o.role}: ` : ""}
                      {o.user
                        ? `${o.user?.name || o.user} (${o.user?.email || ""})`
                        : o.name || "—"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
            <button
              onClick={onPublish}
              className="px-3 py-2 rounded bg-indigo-600 text-white text-sm"
            >
              Publish
            </button>
            <button
              onClick={onUnpublish}
              className="px-3 py-2 rounded border text-sm"
            >
              Unpublish
            </button>
            <button
              onClick={onSoftDelete}
              className="px-3 py-2 rounded border text-sm"
            >
              Soft Delete
            </button>
            <button
              onClick={onRestore}
              className="px-3 py-2 rounded border text-sm"
            >
              Restore
            </button>
            <button
              onClick={onHardDelete}
              className="px-3 py-2 rounded bg-red-600 text-white text-sm"
            >
              Hard Delete
            </button>
          </div>

          <section className="mt-6 rounded-lg border p-4">
            <h2 className="text-lg font-semibold">Edit Core</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <input
                className="border rounded px-3 py-2"
                placeholder="Title"
                value={edit.title}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, title: e.target.value }))
                }
              />
              <input
                className="border rounded px-3 py-2"
                placeholder="Subtitle"
                value={edit.subtitle}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, subtitle: e.target.value }))
                }
              />
              <input
                type="date"
                className="border rounded px-3 py-2"
                value={edit.date}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, date: e.target.value }))
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  className="border rounded px-3 py-2"
                  value={edit.start}
                  onChange={(e) =>
                    setEdit((p) => ({ ...p, start: e.target.value }))
                  }
                />
                <input
                  type="time"
                  className="border rounded px-3 py-2"
                  value={edit.end}
                  onChange={(e) =>
                    setEdit((p) => ({ ...p, end: e.target.value }))
                  }
                />
              </div>
              <select
                className="border rounded px-3 py-2"
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
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={edit.isPublished}
                  onChange={(e) =>
                    setEdit((p) => ({ ...p, isPublished: e.target.checked }))
                  }
                />
                Published
              </label>
              <select
                className="border rounded px-3 py-2"
                value={edit.locationKind}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, locationKind: e.target.value }))
                }
              >
                <option value="physical">physical</option>
                <option value="virtual">virtual</option>
                <option value="hybrid">hybrid</option>
              </select>
              <input
                className="border rounded px-3 py-2"
                placeholder="Venue"
                value={edit.venue}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, venue: e.target.value }))
                }
              />
              {edit.locationKind !== "virtual" && (
                <>
                  <input
                    className="border rounded px-3 py-2"
                    placeholder="Address Line 1"
                    value={edit.addressLine1}
                    onChange={(e) =>
                      setEdit((p) => ({ ...p, addressLine1: e.target.value }))
                    }
                  />
                  <input
                    className="border rounded px-3 py-2"
                    placeholder="Address Line 2"
                    value={edit.addressLine2}
                    onChange={(e) =>
                      setEdit((p) => ({ ...p, addressLine2: e.target.value }))
                    }
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="border rounded px-3 py-2"
                      placeholder="City"
                      value={edit.city}
                      onChange={(e) =>
                        setEdit((p) => ({ ...p, city: e.target.value }))
                      }
                    />
                    <input
                      className="border rounded px-3 py-2"
                      placeholder="State"
                      value={edit.state}
                      onChange={(e) =>
                        setEdit((p) => ({ ...p, state: e.target.value }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="border rounded px-3 py-2"
                      placeholder="Country"
                      value={edit.country}
                      onChange={(e) =>
                        setEdit((p) => ({ ...p, country: e.target.value }))
                      }
                    />
                    <input
                      className="border rounded px-3 py-2"
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
                <input
                  className="border rounded px-3 py-2"
                  placeholder="Meeting URL"
                  value={edit.meetingUrl}
                  onChange={(e) =>
                    setEdit((p) => ({ ...p, meetingUrl: e.target.value }))
                  }
                />
              )}
              <textarea
                rows={4}
                className="border rounded px-3 py-2 md:col-span-2"
                placeholder="Description"
                value={edit.description}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
            <div className="mt-3">
              <button
                disabled={busy}
                onClick={handleUpdateCore}
                className={`px-4 py-2 rounded bg-indigo-600 text-white text-sm ${
                  busy ? "opacity-60" : ""
                }`}
              >
                {busy ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </section>

          <section className="mt-6 rounded-lg border p-4">
            <h2 className="text-lg font-semibold">Status & Schedule</h2>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-5 gap-2">
              <input
                type="date"
                className="border rounded px-3 py-2"
                value={resched.date}
                onChange={(e) =>
                  setResched((p) => ({ ...p, date: e.target.value }))
                }
              />
              <input
                type="time"
                className="border rounded px-3 py-2"
                value={resched.start}
                onChange={(e) =>
                  setResched((p) => ({ ...p, start: e.target.value }))
                }
              />
              <input
                type="time"
                className="border rounded px-3 py-2"
                value={resched.end}
                onChange={(e) =>
                  setResched((p) => ({ ...p, end: e.target.value }))
                }
              />
              <input
                className="border rounded px-3 py-2 md:col-span-2"
                placeholder="Reason"
                value={resched.reason}
                onChange={(e) =>
                  setResched((p) => ({ ...p, reason: e.target.value }))
                }
              />
            </div>
            <div className="mt-2">
              <button
                onClick={onReschedule}
                className="px-3 py-1.5 rounded border text-sm"
              >
                Reschedule
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-2">
              <input
                type="date"
                className="border rounded px-3 py-2"
                value={restartPayload.date}
                onChange={(e) =>
                  setRestartPayload((p) => ({ ...p, date: e.target.value }))
                }
              />
              <input
                type="time"
                className="border rounded px-3 py-2"
                value={restartPayload.start}
                onChange={(e) =>
                  setRestartPayload((p) => ({ ...p, start: e.target.value }))
                }
              />
              <input
                type="time"
                className="border rounded px-3 py-2"
                value={restartPayload.end}
                onChange={(e) =>
                  setRestartPayload((p) => ({ ...p, end: e.target.value }))
                }
              />
              <input
                className="border rounded px-3 py-2 md:col-span-2"
                placeholder="Reason"
                value={restartPayload.reason}
                onChange={(e) =>
                  setRestartPayload((p) => ({ ...p, reason: e.target.value }))
                }
              />
            </div>
            <div className="mt-2">
              <button
                onClick={onRestart}
                className="px-3 py-1.5 rounded border text-sm"
              >
                Restart (make live)
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-2">
              <input
                className="border rounded px-3 py-2 md:col-span-3"
                placeholder="Cancel reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <button
                onClick={onCancel}
                className="px-3 py-1.5 rounded border text-sm"
              >
                Cancel Event
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-2">
              <input
                type="date"
                className="border rounded px-3 py-2"
                value={postpone.date}
                onChange={(e) =>
                  setPostpone((p) => ({ ...p, date: e.target.value }))
                }
              />
              <input
                type="time"
                className="border rounded px-3 py-2"
                value={postpone.start}
                onChange={(e) =>
                  setPostpone((p) => ({ ...p, start: e.target.value }))
                }
              />
              <input
                type="time"
                className="border rounded px-3 py-2"
                value={postpone.end}
                onChange={(e) =>
                  setPostpone((p) => ({ ...p, end: e.target.value }))
                }
              />
              <input
                className="border rounded px-3 py-2 md:col-span-2"
                placeholder="Reason"
                value={postpone.reason}
                onChange={(e) =>
                  setPostpone((p) => ({ ...p, reason: e.target.value }))
                }
              />
            </div>
            <div className="mt-2">
              <button
                onClick={onPostpone}
                className="px-3 py-1.5 rounded border text-sm"
              >
                Postpone
              </button>
            </div>
          </section>

          <section className="mt-6 rounded-lg border p-4 grid gap-6">
            <div>
              <h2 className="text-lg font-semibold">Audience</h2>
              <div className="mt-2 flex items-center gap-2">
                <select
                  className="border rounded px-3 py-2"
                  value={audMode}
                  onChange={(e) => setAudMode(e.target.value)}
                >
                  <option value="all">all</option>
                  <option value="roles">roles</option>
                  <option value="users">users</option>
                </select>
                <button
                  onClick={onSetAudienceMode}
                  className="px-3 py-1.5 rounded border text-sm"
                >
                  Set Mode
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  className="border rounded px-3 py-2"
                  placeholder="Add roles (comma separated)"
                  value={rolesToAdd}
                  onChange={(e) => setRolesToAdd(e.target.value)}
                />
                <button
                  onClick={onAddRoles}
                  className="px-3 py-1.5 rounded border text-sm"
                >
                  Add Roles
                </button>

                <input
                  className="border rounded px-3 py-2"
                  placeholder="Remove a role (single)"
                  value={roleToRemove}
                  onChange={(e) => setRoleToRemove(e.target.value)}
                />
                <button
                  onClick={onRemoveRole}
                  className="px-3 py-1.5 rounded border text-sm"
                >
                  Remove Role
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  className="border rounded px-3 py-2"
                  placeholder="Add userIds (comma separated)"
                  value={usersToAdd}
                  onChange={(e) => setUsersToAdd(e.target.value)}
                />
                <button
                  onClick={onAddUsers}
                  className="px-3 py-1.5 rounded border text-sm"
                >
                  Add Users
                </button>

                <input
                  className="border rounded px-3 py-2"
                  placeholder="Remove userId (single)"
                  value={userToRemove}
                  onChange={(e) => setUserToRemove(e.target.value)}
                />
                <button
                  onClick={onRemoveUser}
                  className="px-3 py-1.5 rounded border text-sm"
                >
                  Remove User
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Reminders</h2>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-5 gap-2">
                <input
                  type="number"
                  className="border rounded px-3 py-2"
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
                  className="border rounded px-3 py-2"
                  value={reminder.channel}
                  onChange={(e) =>
                    setReminder((p) => ({ ...p, channel: e.target.value }))
                  }
                >
                  <option value="inapp">inapp</option>
                  <option value="email">email</option>
                  <option value="sms">sms</option>
                  <option value="webhook">webhook</option>
                </select>
                <input
                  className="border rounded px-3 py-2"
                  placeholder="Template key (opt)"
                  value={reminder.templateKey}
                  onChange={(e) =>
                    setReminder((p) => ({ ...p, templateKey: e.target.value }))
                  }
                />
                <label className="inline-flex items-center gap-2 px-3 py-2 border rounded">
                  <input
                    type="checkbox"
                    checked={reminder.enabled}
                    onChange={(e) =>
                      setReminder((p) => ({ ...p, enabled: e.target.checked }))
                    }
                  />
                  Enabled
                </label>
                <button
                  onClick={onAddReminder}
                  className="px-3 py-1.5 rounded border text-sm"
                >
                  Add Reminder
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  className="border rounded px-3 py-2"
                  placeholder="Remove reminder index"
                  value={removeReminderIndex}
                  onChange={(e) => setRemoveReminderIndex(e.target.value)}
                />
                <button
                  onClick={onRemoveReminder}
                  className="px-3 py-1.5 rounded border text-sm"
                >
                  Remove Reminder
                </button>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                {event.reminders?.length ? (
                  <ul className="list-disc ml-5">
                    {event.reminders.map((r, i) => (
                      <li key={i}>
                        #{i} • {r.channel} • {r.minutesBeforeStart} min{" "}
                        {r.enabled ? "(enabled)" : "(disabled)"}{" "}
                        {r.templateKey ? `• ${r.templateKey}` : ""}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <em>No reminders</em>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Attachments</h2>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2">
                <input
                  className="border rounded px-3 py-2"
                  placeholder="Label"
                  value={attachment.label}
                  onChange={(e) =>
                    setAttachment((p) => ({ ...p, label: e.target.value }))
                  }
                />
                <input
                  className="border rounded px-3 py-2"
                  placeholder="URL"
                  value={attachment.url}
                  onChange={(e) =>
                    setAttachment((p) => ({ ...p, url: e.target.value }))
                  }
                />
                <input
                  className="border rounded px-3 py-2"
                  placeholder="MIME"
                  value={attachment.mime}
                  onChange={(e) =>
                    setAttachment((p) => ({ ...p, mime: e.target.value }))
                  }
                />
                <input
                  type="number"
                  className="border rounded px-3 py-2"
                  placeholder="Size (bytes)"
                  value={attachment.sizeBytes}
                  onChange={(e) =>
                    setAttachment((p) => ({ ...p, sizeBytes: e.target.value }))
                  }
                />
              </div>
              <div className="mt-2">
                <button
                  onClick={onAddAttachment}
                  className="px-3 py-1.5 rounded border text-sm"
                >
                  Add Attachment
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  className="border rounded px-3 py-2"
                  placeholder="Remove attachment index"
                  value={removeAttachmentIndex}
                  onChange={(e) => setRemoveAttachmentIndex(e.target.value)}
                />
                <button
                  onClick={onRemoveAttachment}
                  className="px-3 py-1.5 rounded border text-sm"
                >
                  Remove Attachment
                </button>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                {event.attachments?.length ? (
                  <ul className="list-disc ml-5">
                    {event.attachments.map((a, i) => (
                      <li key={i}>
                        #{i} • {a.label || "file"} • {a.mime || "?"}{" "}
                        {a.url ? (
                          <>
                            •{" "}
                            <a
                              className="text-indigo-600"
                              href={a.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              open
                            </a>
                          </>
                        ) : null}
                        {a.sizeBytes ? ` • ${a.sizeBytes} bytes` : ""}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <em>No attachments</em>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Tags</h2>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  className="border rounded px-3 py-2"
                  placeholder="Add tag"
                  value={tagToAdd}
                  onChange={(e) => setTagToAdd(e.target.value)}
                />
                <button
                  onClick={onAddTag}
                  className="px-3 py-1.5 rounded border text-sm"
                >
                  Add Tag
                </button>

                <input
                  className="border rounded px-3 py-2"
                  placeholder="Remove tag"
                  value={tagToRemove}
                  onChange={(e) => setTagToRemove(e.target.value)}
                />
                <button
                  onClick={onRemoveTag}
                  className="px-3 py-1.5 rounded border text-sm"
                >
                  Remove Tag
                </button>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-lg border p-4">
            <h2 className="text-lg font-semibold">Transfer / Organizers</h2>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                className="border rounded px-3 py-2"
                placeholder="New owner userId"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
              />
              <button
                onClick={onTransferOwner}
                className="px-3 py-1.5 rounded border text-sm"
              >
                Transfer Ownership
              </button>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                className="border rounded px-3 py-2"
                placeholder="Entity model (Project, Task, Bug, Scenario, Course, User)"
                value={entityModel}
                onChange={(e) => setEntityModel(e.target.value)}
              />
              <input
                className="border rounded px-3 py-2"
                placeholder="Entity ObjectId"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
              />
              <button
                onClick={onTransferEntity}
                className="px-3 py-1.5 rounded border text-sm"
              >
                Link to Entity
              </button>
            </div>

            <div className="mt-3">
              <label className="text-sm font-medium">
                Replace Organizers (JSON)
              </label>
              <textarea
                rows={6}
                className="mt-1 w-full border rounded px-3 py-2 font-mono text-sm"
                value={organizersJson}
                onChange={(e) => setOrganizersJson(e.target.value)}
                placeholder='[{"user":"<userId>","role":"host"}]'
              />
              <div className="mt-2">
                <button
                  onClick={onReplaceOrganizers}
                  className="px-3 py-1.5 rounded border text-sm"
                >
                  Replace Organizers
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm">
              <div className="font-medium">Current organizers</div>
              {event.organizers?.length ? (
                <ul className="list-disc ml-5">
                  {event.organizers.map((o, i) => (
                    <li key={i}>
                      {o.role ? `${o.role}: ` : ""}
                      {o.user
                        ? `${o.user?.name || o.user} (${o.user?.email || ""})`
                        : o.name || "—"}
                    </li>
                  ))}
                </ul>
              ) : (
                <em>No organizers</em>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
