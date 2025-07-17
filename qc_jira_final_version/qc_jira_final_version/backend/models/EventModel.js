const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // e.g., "10:00 AM"
    required: true,
  },
  endTime: {
    type: String, // e.g., "12:00 PM"
    required: true,
  },
  duration: {
    type: String, // Optional: "2 hours"
  },
  description: {
    type: String,
    required: true,
  },
  agenda: {
    type: String,
    default: "", // e.g., "Welcome, Keynote, Networking"
  },
  eventType: {
    type: String,
    enum: ["Seminar", "Workshop", "Webinar", "Cultural", "Technical", "Other"],
    default: "Other",
  },
  status: {
    type: String,
    enum: ["Pending", "Ongoing", "Completed", "Cancelled"],
    default: "Pending",
  },
  coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  guestName: {
    type: String,
    default: "N/A",
  },
  location: {
    type: String,
    required: true,
  },
  department: {
    type: String,
  },
  tags: [
    {
      type: String,
    },
  ],
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  maxParticipants: {
    type: Number,
    default: 100,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  meetingLink: {
    type: String,
    default: "", // If isOnline === true
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", EventSchema);
