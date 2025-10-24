import React, { useState, useEffect } from "react";
import axios from "axios";
import backendGlobalRoute from "../../config/Config";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CreateAttendance = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [date, setDate] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [location, setLocation] = useState("Remote");
  const [shift, setShift] = useState("General");
  const [isBillable, setIsBillable] = useState(false);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [attendanceCountThisMonth, setAttendanceCountThisMonth] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!token || !userData) return;
        setUser(userData);

        if (["admin", "superadmin"].includes(userData.role)) {
          const res = await axios.get(`${backendGlobalRoute}/all-projects`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProjects(
            Array.isArray(res.data) ? res.data : res.data.projects || []
          );
        } else {
          const res = await axios.get(
            `${backendGlobalRoute}/user-assigned-projects/${userData.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setProjects(res.data.assignedProjects);
        }

        if (["developer", "test engineer"].includes(userData.role)) {
          const res = await axios.get(
            `${backendGlobalRoute}/api/attendance/dates/${userData.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const map = {};
          const now = new Date();
          let count = 0;
          res.data.forEach((entry) => {
            map[entry.date] = entry;
            const entryDate = new Date(entry.date);
            if (
              entryDate.getMonth() === now.getMonth() &&
              entryDate.getFullYear() === now.getFullYear()
            ) {
              count++;
            }
          });
          setAttendanceCountThisMonth(count);
          setAttendanceMap(map);
        }
      } catch (err) {
        toast.error("Error fetching user/project info");
      }
    };
    fetchUserAndProjects();
  }, []);

  const handleBackToDashboard = () => {
    if (!user) return;
    if (user.role === "developer") {
      navigate("/developer-dashboard");
    } else if (user.role === "test_engineer") {
      navigate("/test-engineer-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject || !date || !hoursWorked) {
      toast.warn("Please fill in all required fields.");
      return;
    }
    if (attendanceMap[date]) {
      toast.warning("⚠️ You have already marked attendance for this date.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const attendanceData = {
        employee: user._id,
        project: selectedProject,
        date,
        hoursWorked,
        taskDescription,
        location,
        shift,
        isBillable,
      };
      const response = await axios.post(
        `${backendGlobalRoute}/api/create-attendance`,
        attendanceData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if ([200, 201].includes(response.status)) {
        toast.success("✅ Attendance submitted successfully!");
        setSelectedProject("");
        setDate("");
        setHoursWorked("");
        setTaskDescription("");
        setLocation("Remote");
        setShift("General");
        setIsBillable(false);
        setAttendanceMap((prev) => ({
          ...prev,
          [attendanceData.date]: {
            ...attendanceData,
            projectName:
              projects.find((p) => p._id === selectedProject)?.project_name ||
              "Project",
          },
        }));
        setAttendanceCountThisMonth((prev) => prev + 1);
      }
    } catch (err) {
      toast.error("Failed to submit attendance.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 mb-10 p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-xl rounded-xl border border-gray-300 dark:border-gray-700">
      <ToastContainer />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
          Create Attendance
        </h2>
        <button
          onClick={handleBackToDashboard}
          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          🔙 Back to Dashboard
        </button>
      </div>

      {user && (
        <div className="mb-4 text-lg space-y-1">
          <p>
            <strong>👤 Name:</strong> {user.name}
          </p>
          <p>
            <strong>💼 Role:</strong> {user.role}
          </p>
          <p>
            <strong>📆 Days Attended This Month:</strong>{" "}
            {attendanceCountThisMonth}
          </p>
        </div>
      )}

      <div className="mb-8">
        <label className="block mb-2 font-semibold">📅 Select Date</label>
        <Calendar
          onClickDay={(value) => {
            const selected = value.toISOString().split("T")[0];
            if (attendanceMap[selected]) {
              setSelectedHistory(attendanceMap[selected]);
              setShowModal(true);
            } else {
              setDate(selected);
            }
          }}
          tileDisabled={({ date, view }) => {
            const d = date.toISOString().split("T")[0];
            return view === "month" && attendanceMap[d];
          }}
          tileContent={({ date }) => {
            const d = date.toISOString().split("T")[0];
            if (attendanceMap[d]) {
              return <span className="text-red-500">📝</span>;
            }
            return null;
          }}
          tileClassName={({ date }) => {
            const d = date.toISOString().split("T")[0];
            return attendanceMap[d]
              ? "bg-red-100 dark:bg-red-700 text-red-600 dark:text-white font-semibold"
              : null;
          }}
          value={date ? new Date(date) : new Date()}
        />
      </div>

      {projects.length > 0 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold">
              📁 Select Project *
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
              required
            >
              <option value="">-- Select a project --</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.project_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">⏱ Hours Worked *</label>
            <input
              type="number"
              min="0"
              max="24"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">
              📝 Task Description
            </label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
              rows="3"
              placeholder="Brief description of today's work..."
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">🌍 Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="Remote">Remote</option>
                <option value="Office">Office</option>
                <option value="Client Site">Client Site</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">⏰ Shift</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="General">General</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isBillable}
              onChange={(e) => setIsBillable(e.target.checked)}
            />
            <label className="font-semibold">💰 Is Billable</label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md"
          >
            ✅ Submit Attendance
          </button>
        </form>
      )}

      {showModal && selectedHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md w-full max-w-md shadow-md">
            <h3 className="text-xl font-bold mb-4 text-center">
              Attendance on {selectedHistory.date}
            </h3>
            <ul className="text-gray-800 dark:text-gray-200 space-y-1">
              <li>
                <strong>Project:</strong> {selectedHistory.projectName}
              </li>
              <li>
                <strong>Task:</strong> {selectedHistory.taskDescription}
              </li>
              <li>
                <strong>Hours:</strong> {selectedHistory.hoursWorked}
              </li>
              <li>
                <strong>Location:</strong> {selectedHistory.location}
              </li>
              <li>
                <strong>Shift:</strong> {selectedHistory.shift}
              </li>
              <li>
                <strong>Billable:</strong>{" "}
                {selectedHistory.isBillable ? "Yes" : "No"}
              </li>
            </ul>
            <button
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAttendance;
