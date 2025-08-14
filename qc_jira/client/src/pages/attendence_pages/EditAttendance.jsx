import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

const EditAttendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hoursWorked: "",
    taskDescription: "",
    location: "",
    shift: "",
    isBillable: false,
    remarks: "", // ✅ NEW FIELD
  });

  const [loading, setLoading] = useState(true);

  // Fetch attendance details
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${globalBackendRoute}/api/get-single-attendance/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data;
        setFormData({
          hoursWorked: data.hoursWorked || "",
          taskDescription: data.taskDescription || "",
          location: data.location || "",
          shift: data.shift || "",
          isBillable: data.isBillable || false,
          remarks: data.remarks || "", // ✅ INITIALLY LOAD IF EXISTS
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${globalBackendRoute}/api/update-attendance/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Attendance updated successfully!");
      navigate(`/get-single-attendance/${id}`);
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Failed to update attendance.");
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600 border-b pb-2">Edit Attendance</h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
        <div>
          <label className="block font-semibold">Hours Worked:</label>
          <input
            type="number"
            name="hoursWorked"
            value={formData.hoursWorked}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Task Description:</label>
          <textarea
            name="taskDescription"
            value={formData.taskDescription}
            onChange={handleChange}
            rows={3}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block font-semibold">Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block font-semibold">Shift:</label>
          <input
            type="text"
            name="shift"
            value={formData.shift}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block font-semibold">Remarks:</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows={2}
            placeholder="Reason for update..."
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isBillable"
            checked={formData.isBillable}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="font-semibold">Is Billable</label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Update Attendance
        </button>
      </form>
    </div>
  );
};

export default EditAttendance;
