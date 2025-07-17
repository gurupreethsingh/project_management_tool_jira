import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
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
    maxParticipants: 100,
    isOnline: false,
    meetingLink: "",
  });

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  //  Fetch all users (for coordinator/attendees)
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users") // Adjust API route if needed
      .then((res) => {
        console.log("Fetched users:", res.data); // Debug log
        const userList = Array.isArray(res.data) ? res.data : res.data.users; // Support both formats
        setUsers(userList || []);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setUsers([]); // Fallback to empty array
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTagsChange = (e) => {
    setFormData({ ...formData, tags: e.target.value.split(",") });
  };

  const handleAttendeesChange = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, attendees: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/create-event", formData);
      setMessage("✅ Event created successfully!");
      setFormData({
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
        maxParticipants: 100,
        isOnline: false,
        meetingLink: "",
      });
    } catch (error) {
      console.error("Error creating event:", error);
      setMessage("Failed to create event");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded shadow-md max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Create Event</h2>

      {message && (
        <div className="mb-4 text-sm font-medium text-green-600">{message}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="eventName"
          placeholder="Event Name *"
          value={formData.eventName}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="date"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="duration"
          placeholder="Duration (e.g., 2 hours)"
          value={formData.duration}
          onChange={handleChange}
          className="input"
        />
        <input
          name="location"
          placeholder="Location *"
          value={formData.location}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="guestName"
          placeholder="Guest Name"
          value={formData.guestName}
          onChange={handleChange}
          className="input"
        />
        <input
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          className="input"
        />
        <input
          name="agenda"
          placeholder="Agenda"
          value={formData.agenda}
          onChange={handleChange}
          className="input"
        />
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          onChange={handleTagsChange}
          className="input"
        />
        <input
          name="maxParticipants"
          type="number"
          placeholder="Max Participants"
          value={formData.maxParticipants}
          onChange={handleChange}
          className="input"
        />

        <select
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
          className="input"
        >
          <option value="Seminar">Seminar</option>
          <option value="Workshop">Workshop</option>
          <option value="Webinar">Webinar</option>
          <option value="Cultural">Cultural</option>
          <option value="Technical">Technical</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="input"
        >
          <option value="Pending">Pending</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          name="coordinator"
          value={formData.coordinator}
          onChange={handleChange}
          required
          className="input"
        >
          <option value="">Select Coordinator</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>

        <select
          multiple
          name="attendees"
          value={formData.attendees}
          onChange={handleAttendeesChange}
          className="input h-32"
        >
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>

        <label className="flex items-center col-span-2">
          <input
            type="checkbox"
            name="isOnline"
            checked={formData.isOnline}
            onChange={handleChange}
            className="mr-2"
          />
          Is this an online event?
        </label>

        {formData.isOnline && (
          <input
            name="meetingLink"
            placeholder="Meeting Link"
            value={formData.meetingLink}
            onChange={handleChange}
            className="input col-span-2"
          />
        )}

        <textarea
          name="description"
          placeholder="Description *"
          value={formData.description}
          onChange={handleChange}
          required
          className="textarea col-span-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded col-span-2"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
