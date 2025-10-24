import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

const API = `${globalBackendRoute}/api`;

const toISO = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    const d = new Date(`${dateStr}T${timeStr}:00`);
    return isNaN(d.getTime()) ? null : d.toISOString();
};
const safe = (v) => (v === undefined || v === null ? "" : String(v));

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
        [token]
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
        date: "", // yyyy-mm-dd
        start: "", // HH:mm
        end: "", // HH:mm
        status: "draft",
        isPublished: false,

        // location
        locationKind: "physical",
        venue: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        meetingUrl: "",

        // audience
        audienceMode: "all",
        audienceRolesCSV: "",
        audienceUsersCSV: "",

        // registration
        regRequired: false,
        regCapacity: "",
        regWaitlist: false,

        // other
        tagsCSV: "",
        coverImageUrl: "",
        entityModel: "",
        entityId: "",

        // organizers JSON
        organizersJson: "[\n  // { \"user\": \"<ObjectId>\", \"role\": \"host\" }\n]",
    });

    const notify = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2200);
    };

    // Load event
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setErr("");
        AX.get(`/events/${id}`)
            .then((res) => {
                const ev = res.data;
                setEvent(ev);

                // hydrate form with existing values
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
                            user: typeof o.user === "object" ? o.user?._id || o.user?.id : o.user,
                            name: o.name,
                            email: o.email,
                            phone: o.phone,
                            role: o.role,
                        })),
                        null,
                        2
                    ),
                }));
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
    }, [AX, id]);

    // Build payload for PUT /events/:id
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
            if (!Array.isArray(organizers)) throw new Error("Organizers must be an array");
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
            // optionally go back to event view
            // navigate(`/single-event/${id}`);
        } catch (e) {
            console.error("update event error:", e?.response || e);
            setErr(
                e?.response?.data?.error ||
                e?.response?.data?.details ||
                "Update failed"
            );
        } finally {
            setSaving(false);
        }
    };

    if (!token) {
        return (
            <div className="max-w-5xl mx-auto p-4">
                <h1 className="text-2xl font-bold">Update Event</h1>
                <p className="mt-2 text-red-600">Please log in.</p>
            </div>
        );
    }
    if (!isSuperAdmin) {
        return (
            <div className="max-w-5xl mx-auto p-4">
                <h1 className="text-2xl font-bold">Update Event</h1>
                <p className="mt-2 text-red-600">
                    Only admin/superadmin can update events.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Update Event</h1>
                <div className="flex items-center gap-3">
                    <Link to="/all-events" className="text-indigo-600 hover:underline">
                        ← Back to all events
                    </Link>
                    <Link
                        to={`/single-event/${id}`}
                        className="text-indigo-600 hover:underline"
                    >
                        View single event →
                    </Link>
                </div>
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
                <form onSubmit={onSubmit} className="mt-4 grid gap-6">
                    {/* Core */}
                    <section className="rounded-lg border p-4">
                        <h2 className="text-lg font-semibold">Core</h2>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                className="border rounded px-3 py-2"
                                placeholder="Title"
                                value={form.title}
                                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                required
                            />
                            <input
                                className="border rounded px-3 py-2"
                                placeholder="Subtitle"
                                value={form.subtitle}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, subtitle: e.target.value }))
                                }
                            />
                            <textarea
                                className="border rounded px-3 py-2 md:col-span-2"
                                placeholder="Description"
                                rows={4}
                                value={form.description}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, description: e.target.value }))
                                }
                            />
                            <input
                                type="date"
                                className="border rounded px-3 py-2"
                                value={form.date}
                                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                                required
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="time"
                                    className="border rounded px-3 py-2"
                                    value={form.start}
                                    onChange={(e) => setForm((p) => ({ ...p, start: e.target.value }))}
                                    required
                                />
                                <input
                                    type="time"
                                    className="border rounded px-3 py-2"
                                    value={form.end}
                                    onChange={(e) => setForm((p) => ({ ...p, end: e.target.value }))}
                                    required
                                />
                            </div>
                            <select
                                className="border rounded px-3 py-2"
                                value={form.status}
                                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
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
                                    checked={form.isPublished}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, isPublished: e.target.checked }))
                                    }
                                />
                                Published
                            </label>
                            <input
                                className="border rounded px-3 py-2 md:col-span-2"
                                placeholder="Cover image URL"
                                value={form.coverImageUrl}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, coverImageUrl: e.target.value }))
                                }
                            />
                        </div>
                    </section>

                    {/* Location */}
                    <section className="rounded-lg border p-4">
                        <h2 className="text-lg font-semibold">Location</h2>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <select
                                className="border rounded px-3 py-2"
                                value={form.locationKind}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, locationKind: e.target.value }))
                                }
                            >
                                <option value="physical">physical</option>
                                <option value="virtual">virtual</option>
                                <option value="hybrid">hybrid</option>
                            </select>
                            <input
                                className="border rounded px-3 py-2"
                                placeholder="Venue"
                                value={form.venue}
                                onChange={(e) => setForm((p) => ({ ...p, venue: e.target.value }))}
                            />

                            {form.locationKind !== "virtual" && (
                                <>
                                    <input
                                        className="border rounded px-3 py-2"
                                        placeholder="Address Line 1"
                                        value={form.addressLine1}
                                        onChange={(e) =>
                                            setForm((p) => ({ ...p, addressLine1: e.target.value }))
                                        }
                                    />
                                    <input
                                        className="border rounded px-3 py-2"
                                        placeholder="Address Line 2"
                                        value={form.addressLine2}
                                        onChange={(e) =>
                                            setForm((p) => ({ ...p, addressLine2: e.target.value }))
                                        }
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            className="border rounded px-3 py-2"
                                            placeholder="City"
                                            value={form.city}
                                            onChange={(e) =>
                                                setForm((p) => ({ ...p, city: e.target.value }))
                                            }
                                        />
                                        <input
                                            className="border rounded px-3 py-2"
                                            placeholder="State"
                                            value={form.state}
                                            onChange={(e) =>
                                                setForm((p) => ({ ...p, state: e.target.value }))
                                            }
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            className="border rounded px-3 py-2"
                                            placeholder="Country"
                                            value={form.country}
                                            onChange={(e) =>
                                                setForm((p) => ({ ...p, country: e.target.value }))
                                            }
                                        />
                                        <input
                                            className="border rounded px-3 py-2"
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
                                <input
                                    className="border rounded px-3 py-2 md:col-span-2"
                                    placeholder="Meeting URL"
                                    value={form.meetingUrl}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, meetingUrl: e.target.value }))
                                    }
                                />
                            )}
                        </div>
                    </section>

                    {/* Audience */}
                    <section className="rounded-lg border p-4">
                        <h2 className="text-lg font-semibold">Audience</h2>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <select
                                className="border rounded px-3 py-2"
                                value={form.audienceMode}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, audienceMode: e.target.value }))
                                }
                            >
                                <option value="all">all</option>
                                <option value="roles">roles</option>
                                <option value="users">users</option>
                            </select>
                            <input
                                className="border rounded px-3 py-2 md:col-span-2"
                                placeholder="Roles (comma separated)"
                                value={form.audienceRolesCSV}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, audienceRolesCSV: e.target.value }))
                                }
                            />
                            <input
                                className="border rounded px-3 py-2 md:col-span-3"
                                placeholder="User IDs (comma separated)"
                                value={form.audienceUsersCSV}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, audienceUsersCSV: e.target.value }))
                                }
                            />
                        </div>
                    </section>

                    {/* Registration */}
                    <section className="rounded-lg border p-4">
                        <h2 className="text-lg font-semibold">Registration</h2>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <label className="inline-flex items-center gap-2 border rounded px-3 py-2">
                                <input
                                    type="checkbox"
                                    checked={form.regRequired}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, regRequired: e.target.checked }))
                                    }
                                />
                                Required
                            </label>
                            <input
                                type="number"
                                className="border rounded px-3 py-2"
                                placeholder="Capacity"
                                value={form.regCapacity}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, regCapacity: e.target.value }))
                                }
                            />
                            <label className="inline-flex items-center gap-2 border rounded px-3 py-2">
                                <input
                                    type="checkbox"
                                    checked={form.regWaitlist}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, regWaitlist: e.target.checked }))
                                    }
                                />
                                Waitlist enabled
                            </label>
                        </div>
                    </section>

                    {/* Tags / Entity / Organizers */}
                    <section className="rounded-lg border p-4">
                        <h2 className="text-lg font-semibold">Other</h2>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                className="border rounded px-3 py-2"
                                placeholder="Tags (comma separated)"
                                value={form.tagsCSV}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, tagsCSV: e.target.value }))
                                }
                            />
                            <input
                                className="border rounded px-3 py-2"
                                placeholder="Entity model (optional)"
                                value={form.entityModel}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, entityModel: e.target.value }))
                                }
                            />
                            <input
                                className="border rounded px-3 py-2"
                                placeholder="Related entity ObjectId (optional)"
                                value={form.entityId}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, entityId: e.target.value }))
                                }
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-1">
                                Organizers (JSON array)
                            </label>
                            <textarea
                                rows={6}
                                className="w-full border rounded px-3 py-2 font-mono text-sm"
                                value={form.organizersJson}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, organizersJson: e.target.value }))
                                }
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Example: <code>[{`{ "user": "<ObjectId>", "role": "host" }`}]</code>
                            </p>
                        </div>
                    </section>

                    <div className="flex items-center gap-3">
                        <button
                            disabled={saving}
                            type="submit"
                            className={`px-4 py-2 rounded bg-indigo-600 text-white text-sm ${saving ? "opacity-60" : ""
                                }`}
                        >
                            {saving ? "Saving…" : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/single-event/${id}`)}
                            className="px-4 py-2 rounded border text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
