// src/pages/attendance/CreateAttendance.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import backendGlobalRoute from "../../config/Config";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

// react-icons (FontAwesome 6 where available)
import {
  FaUser,
  FaBriefcase,
  FaCalendarDays,
  FaArrowLeft,
  FaRotateRight,
  FaArrowsRotate,
  FaBookOpen,
  FaCompass,
  FaClock,
  FaLocationDot,
  FaBarsProgress,
  FaBolt,
  FaCheck,
  FaBroom,
} from "react-icons/fa6";

// ---- Status colors ----
const STATUS_COLORS = {
  marked: {
    dot: "bg-blue-600",
    pill: "bg-blue-50 text-blue-700 border-blue-200",
  },
  accepted: {
    dot: "bg-emerald-600",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    dot: "bg-rose-600",
    pill: "bg-rose-50 text-rose-700 border-rose-200",
  },
  pending: {
    dot: "bg-amber-600",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
  },
  unmarked: {
    dot: "bg-slate-400",
    pill: "bg-slate-50 text-slate-700 border-slate-200",
  },
};

const Pill = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[12px] border ${
      STATUS_COLORS[status || "pending"]?.pill || STATUS_COLORS.pending.pill
    }`}
  >
    <span
      className={`inline-block w-2 h-2 rounded-full ${
        STATUS_COLORS[status || "pending"]?.dot || STATUS_COLORS.pending.dot
      }`}
    />
    {status}
  </span>
);

// ---- LOCAL date helpers (no UTC drift) ----
const toLocalISO = (d) => {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const monthKeyLocal = (d) => {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};
const startOfTodayLocal = () => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
};

// ---- safer local user getter ----
function getLocalUser() {
  try {
    const u =
      localStorage.getItem("user") || localStorage.getItem("currentUser");
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}
function getToken() {
  return (
    localStorage.getItem("userToken") || localStorage.getItem("token") || ""
  );
}

export default function CreateAttendance() {
  const navigate = useNavigate();

  // ---- auth / base ----
  const [user, setUser] = useState(null);
  const [authHeader, setAuthHeader] = useState();

  // ---- projects ----
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  // ---- form ----
  const [date, setDate] = useState(toLocalISO(new Date()));
  const [hoursWorked, setHoursWorked] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [location, setLocation] = useState("Remote");
  const [shift, setShift] = useState("General");
  const [isBillable, setIsBillable] = useState(false);

  // ---- calendar & summaries ----
  const [attendanceByDay, setAttendanceByDay] = useState({});
  const [attendanceCountThisMonth, setAttendanceCountThisMonth] = useState(0);
  const [activeMonth, setActiveMonth] = useState(startOfTodayLocal());

  // ---- ui flags ----
  const [showModal, setShowModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // =========================================
  // Init: user + token + projects
  // =========================================
  useEffect(() => {
    const init = async () => {
      try {
        const t = getToken();
        const u = getLocalUser();
        if (!t || !u) {
          toast.error("Not authenticated. Please log in.");
          navigate("/login");
          return;
        }
        setAuthHeader({ Authorization: `Bearer ${t}` });
        setUser(u);

        const uid = u._id || u.id;

        // Admins: all projects; others: assigned
        if (["admin", "superadmin"].includes(u.role)) {
          const r = await axios.get(`${backendGlobalRoute}/all-projects`, {
            headers: { Authorization: `Bearer ${t}` },
          });
          setProjects(Array.isArray(r.data) ? r.data : r.data.projects || []);
        } else {
          // IMPORTANT: use /api prefix to match backend mount
          const r = await axios.get(
            `${backendGlobalRoute}/api/user-assigned-projects/${uid}`,
            {
              headers: { Authorization: `Bearer ${t}` },
            }
          );
          setProjects(r?.data?.assignedProjects || []);
        }
      } catch (e) {
        if (e?.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate("/login");
          return;
        }
        toast.error(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to fetch user/projects."
        );
      } finally {
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================================
  // Month attendance
  // =========================================
  const fetchMonthAttendance = async (dt = activeMonth) => {
    if (!user || !authHeader) return;
    try {
      const monthKey = `${monthKeyLocal(dt)}-01`; // any date in month (LOCAL)
      const uid = user._id || user.id;

      let rows = [];
      try {
        // Preferred new endpoint
        const r = await axios.get(
          `${backendGlobalRoute}/api/attendance/calendar`,
          {
            headers: authHeader,
            params: { employee: uid, month: monthKey },
          }
        );
        const map = r?.data?.byDayKey || {};
        rows = Object.keys(map).map((k) => {
          const v = map[k];
          return {
            date: k,
            status: v.status,
            hoursWorked: v.hoursWorked,
            projectName: v.project?.project_name || "",
            location: v.location,
            shift: v.shift,
            isBillable: v.isBillable,
            taskDescription: v.taskDescription,
          };
        });
      } catch {
        // Fallback to legacy dates endpoint if you have it
        const r = await axios.get(
          `${backendGlobalRoute}/api/attendance/dates/${uid}`,
          {
            headers: authHeader,
          }
        );
        rows = r?.data || [];
      }

      const current = new Date(dt);
      const map = {};
      let count = 0;
      rows.forEach((entry) => {
        const key = entry.dayKey || entry.date;
        if (!key) return;
        map[key] = {
          ...entry,
          status: (entry.status || "marked").toLowerCase(),
        };
        const ed = new Date(key);
        if (
          ed.getMonth() === current.getMonth() &&
          ed.getFullYear() === current.getFullYear()
        ) {
          if (
            ["marked", "accepted", "rejected", "pending"].includes(
              map[key].status
            )
          )
            count++;
        }
      });

      setAttendanceByDay(map);
      setAttendanceCountThisMonth(count);
    } catch {
      // ignore month fetch failure (prevents toast spam)
    }
  };

  useEffect(() => {
    fetchMonthAttendance(activeMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authHeader, activeMonth]);

  // =========================================
  // Interactions
  // =========================================
  const openHistoryOrSelect = (value) => {
    // value is a Date in LOCAL tz
    value.setHours(0, 0, 0, 0);
    const selected = toLocalISO(value);
    if (attendanceByDay[selected]) {
      setSelectedHistory(attendanceByDay[selected]);
      setShowModal(true);
    } else {
      setDate(selected);
    }
  };

  const submitMark = async (e) => {
    e?.preventDefault?.();
    if (!user || !authHeader) {
      toast.error("Not authenticated.");
      navigate("/login");
      return;
    }
    if (!date) return toast.warn("Please select a date.");
    if (hoursWorked === "" || hoursWorked === null)
      return toast.warn("Enter hours worked.");
    if (attendanceByDay[date])
      return toast.warning("Already marked for this date.");

    const payload = {
      employee: user._id || user.id,
      project: selectedProject || null,
      date, // local YYYY-MM-DD string is okay - backend will parse to Date
      hoursWorked: Number(hoursWorked),
      taskDescription,
      location,
      shift,
      isBillable,
    };

    setSubmitting(true);
    try {
      let res;
      try {
        res = await axios.post(
          `${backendGlobalRoute}/api/attendance/mark`,
          payload,
          { headers: authHeader }
        );
      } catch {
        // If you *really* need legacy, ensure your server has this route; otherwise remove this block.
        res = await axios.post(
          `${backendGlobalRoute}/api/create-attendance`,
          payload,
          { headers: authHeader }
        );
      }

      if ([200, 201].includes(res.status)) {
        toast.success("Attendance submitted.");
        const projectName =
          projects.find((p) => p._id === selectedProject)?.project_name || "";
        setAttendanceByDay((prev) => ({
          ...prev,
          [date]: { ...payload, status: "marked", projectName },
        }));
        setAttendanceCountThisMonth((n) => n + 1);
        setHoursWorked("");
        setTaskDescription("");
        setIsBillable(false);
      } else {
        toast.error("Failed to submit attendance.");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to submit attendance."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const submitUnmark = async () => {
    if (!user || !authHeader) {
      toast.error("Not authenticated.");
      navigate("/login");
      return;
    }
    if (!date) return toast.warn("Pick a date to unmark.");
    setSubmitting(true);
    try {
      await axios.post(
        `${backendGlobalRoute}/api/attendance/unmark`,
        { employee: user._id || user.id, date, remarks: "Unmarked by user" },
        { headers: authHeader }
      );
      toast.success("Day set to Unmarked.");
      await fetchMonthAttendance(activeMonth);
    } catch (e) {
      toast.error(
        e?.response?.data?.message || e?.message || "Failed to unmark."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================
  // Derived
  // =========================================
  const selectedStatus = attendanceByDay[date]?.status;
  const selectedSummary = useMemo(() => {
    const a = attendanceByDay[date];
    if (!a) return null;
    return {
      status: a.status,
      project: a.projectName || "",
      hours: a.hoursWorked,
      location: a.location,
      shift: a.shift,
      task: a.taskDescription,
      billable: !!a.isBillable,
    };
  }, [attendanceByDay, date]);

  // =========================================
  // UI (compact, no cards, react-icons)
  // =========================================
  return (
    <div className="container mx-auto max-w-6xl px-3 sm:px-4 lg:px-6 py-6">
      <ToastContainer />
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b">
        <div className="leading-tight">
          <div className="text-xl sm:text-2xl font-semibold text-indigo-700 dark:text-indigo-300">
            <FaBarsProgress className="inline -mt-1 mr-2" /> Mark Attendance
          </div>
          {user && (
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 flex flex-wrap gap-3">
              <span>
                <FaUser className="inline -mt-0.5 mr-1" /> {user.name}
              </span>
              <span>
                <FaBriefcase className="inline -mt-0.5 mr-1" /> {user.role}
              </span>
              <span>
                <FaCalendarDays className="inline -mt-0.5 mr-1" /> This Month:{" "}
                {attendanceCountThisMonth}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-2.5 py-1.5 text-xs rounded border hover:bg-slate-50"
            title="Back"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-2.5 py-1.5 text-xs rounded border hover:bg-slate-50"
            title="Reload page"
          >
            <FaRotateRight />
          </button>
          <button
            onClick={() => fetchMonthAttendance(activeMonth)}
            className="px-2.5 py-1.5 text-xs rounded border hover:bg-slate-50"
            title="Refresh month"
          >
            <FaArrowsRotate />
          </button>
          <Link
            to="/attendance"
            className="px-2.5 py-1.5 text-xs rounded border hover:bg-slate-50"
            title="View all attendance"
          >
            <FaBookOpen />{" "}
          </Link>
        </div>
      </div>

      {/* Two columns (borders only) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Left: Calendar + selected info */}
        <section className="border rounded-md p-3">
          <div className="text-sm font-medium mb-2">
            <FaCalendarDays className="inline -mt-1 mr-1" /> Pick a Date
          </div>
          <Calendar
            onClickDay={(d) => {
              d.setHours(0, 0, 0, 0); // LOCAL midnight
              openHistoryOrSelect(d);
            }}
            onActiveStartDateChange={({ activeStartDate }) => {
              const x = activeStartDate
                ? new Date(activeStartDate)
                : startOfTodayLocal();
              x.setHours(0, 0, 0, 0);
              setActiveMonth(x);
            }}
            tileDisabled={({ date: d, view }) => {
              if (view !== "month") return false;
              const dd = new Date(d);
              dd.setHours(0, 0, 0, 0);
              const td = startOfTodayLocal();
              return dd > td; // disable future dates only
            }}
            tileContent={({ date: d }) => {
              const key = toLocalISO(d);
              const entry = attendanceByDay[key];
              if (!entry) return null;
              return (
                <div className="mt-0.5 flex justify-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      STATUS_COLORS[entry.status]?.dot ||
                      STATUS_COLORS.pending.dot
                    }`}
                  />
                </div>
              );
            }}
            tileClassName={({ date: d }) => {
              const key = toLocalISO(d);
              const entry = attendanceByDay[key];
              if (!entry) return null;
              if (entry.status === "accepted")
                return "react-calendar__tile--active bg-emerald-50";
              if (entry.status === "rejected")
                return "react-calendar__tile--active bg-rose-50";
              if (entry.status === "marked")
                return "react-calendar__tile--active bg-blue-50";
              if (entry.status === "pending")
                return "react-calendar__tile--active bg-amber-50";
              if (entry.status === "unmarked")
                return "react-calendar__tile--active bg-slate-50";
              return null;
            }}
            value={(() => {
              const d = new Date(date);
              d.setHours(0, 0, 0, 0);
              return d;
            })()}
          />

          {/* Selected strip */}
          <div className="mt-3 border-t pt-3 text-[13px]">
            <div className="flex items-center justify-between">
              <div className="font-medium">
                <FaCalendarDays className="inline -mt-[2px] mr-1" /> Selected:{" "}
                <span className="text-indigo-700">{date}</span>
              </div>
              <div>{selectedStatus && <Pill status={selectedStatus} />}</div>
            </div>

            {selectedSummary && (
              <div className="mt-2 grid sm:grid-cols-2 gap-x-4 gap-y-1">
                {selectedSummary.project && (
                  <div>
                    <FaCompass className="inline -mt-1 mr-1" />{" "}
                    <strong>Project:</strong> {selectedSummary.project}
                  </div>
                )}
                {selectedSummary.task && (
                  <div className="sm:col-span-2">
                    <FaBolt className="inline -mt-1 mr-1" />{" "}
                    <strong>Task:</strong> {selectedSummary.task}
                  </div>
                )}
                <div>
                  <FaClock className="inline -mt-1 mr-1" />{" "}
                  <strong>Hours:</strong> {selectedSummary.hours ?? "—"}
                </div>
                <div>
                  <FaLocationDot className="inline -mt-1 mr-1" />{" "}
                  <strong>Location:</strong> {selectedSummary.location}
                </div>
                <div>
                  <strong>Shift:</strong> {selectedSummary.shift}
                </div>
                <div>
                  <strong>Billable:</strong>{" "}
                  {selectedSummary.billable ? "Yes" : "No"}
                </div>
              </div>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setDate(toLocalISO(new Date()))}
                className="px-2 py-1 text-xs rounded border hover:bg-slate-50"
                title="Jump to today"
              >
                Today
              </button>
              <button
                onClick={() => setHoursWorked((h) => (h ? h : 8))}
                className="px-2 py-1 text-xs rounded border hover:bg-slate-50"
                title="Quick fill 8 hours"
              >
                +8h
              </button>
              <button
                onClick={() => setHoursWorked((h) => (h ? h : 9))}
                className="px-2 py-1 text-xs rounded border hover:bg-slate-50"
                title="Quick fill 9 hours"
              >
                +9h
              </button>
              <button
                onClick={submitUnmark}
                disabled={submitting}
                className="px-2 py-1 text-xs rounded border hover:bg-slate-50 disabled:opacity-50"
                title="Set selected date to Unmarked"
              >
                Unmark
              </button>
            </div>
          </div>
        </section>

        {/* Right: Compact form */}
        <section className="border rounded-md p-3">
          <form onSubmit={submitMark} className="space-y-3">
            {/* Project (optional) & quick link */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-end">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  <FaCompass className="inline -mt-1 mr-1" /> Project (optional)
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border rounded"
                >
                  <option value="">— Not linked —</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.project_name}
                    </option>
                  ))}
                </select>
              </div>
              <Link
                to={
                  selectedProject ? `/single-project/${selectedProject}` : "#"
                }
                onClick={(e) => {
                  if (!selectedProject) {
                    e.preventDefault();
                    toast.info("Select a project to open its dashboard.");
                  }
                }}
                className={`px-2.5 py-1.5 text-xs rounded border text-center ${
                  selectedProject
                    ? "hover:bg-slate-50"
                    : "opacity-60 cursor-not-allowed"
                }`}
                title="Open Project Dashboard"
              >
                Project
              </Link>
            </div>

            {/* Hours & Date inline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  <FaClock className="inline -mt-1 mr-1" /> Hours Worked *
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.25"
                  value={hoursWorked}
                  onChange={(e) => setHoursWorked(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  <FaCalendarDays className="inline -mt-1 mr-1" /> Date
                </label>
                <input
                  value={date}
                  readOnly
                  className="w-full px-2 py-1.5 text-sm border rounded bg-slate-50"
                  title="Select on the calendar"
                />
              </div>
            </div>

            {/* Task */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                <FaBolt className="inline -mt-1 mr-1" /> Task Description
              </label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                rows="3"
                className="w-full px-2 py-1.5 text-sm border rounded"
                placeholder="What did you work on today?"
              />
            </div>

            {/* Meta inline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  <FaLocationDot className="inline -mt-1 mr-1" /> Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border rounded"
                >
                  <option value="Remote">Remote</option>
                  <option value="Office">Office</option>
                  <option value="Client Site">Client Site</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Shift</label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border rounded"
                >
                  <option value="General">General</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>
              <label className="flex items-center gap-2 pt-6 text-sm">
                <input
                  type="checkbox"
                  checked={isBillable}
                  onChange={(e) => setIsBillable(e.target.checked)}
                />
                <span>Billable</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="px-3 py-1.5 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 inline-flex items-center gap-2"
                title="Submit attendance for the selected date"
              >
                <FaCheck />
                {submitting ? "Submitting…" : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setHoursWorked("");
                  setTaskDescription("");
                  setIsBillable(false);
                }}
                className="px-3 py-1.5 text-sm rounded border hover:bg-slate-50 inline-flex items-center gap-2"
              >
                <FaBroom /> Clear
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Modal */}
      {showModal && selectedHistory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 border rounded-md p-4 w-full max-w-md">
            <div className="text-base font-semibold mb-1 text-center">
              Attendance — {selectedHistory.date || selectedHistory.dayKey}
            </div>
            <div className="flex justify-center mb-2">
              <Pill status={selectedHistory.status} />
            </div>
            <div className="text-[13px] space-y-1">
              {selectedHistory.projectName && (
                <div>
                  <strong>Project:</strong> {selectedHistory.projectName}
                </div>
              )}
              {selectedHistory.taskDescription && (
                <div>
                  <strong>Task:</strong> {selectedHistory.taskDescription}
                </div>
              )}
              <div>
                <strong>Hours:</strong> {selectedHistory.hoursWorked}
              </div>
              <div>
                <strong>Location:</strong> {selectedHistory.location}
              </div>
              <div>
                <strong>Shift:</strong> {selectedHistory.shift}
              </div>
              <div>
                <strong>Billable:</strong>{" "}
                {selectedHistory.isBillable ? "Yes" : "No"}
              </div>
            </div>
            <div className="mt-3">
              <button
                className="w-full px-3 py-1.5 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center z-40">
          <div className="px-3 py-1.5 rounded bg-white border text-sm">
            Loading…
          </div>
        </div>
      )}
    </div>
  );
}
